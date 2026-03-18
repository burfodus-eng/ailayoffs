/**
 * Fix bad event cover images.
 *
 * 1. Finds events with missing or likely-bad images
 * 2. Searches for better images by industry/context
 * 3. Verifies candidates with Claude Vision
 * 4. Updates the event with the best verified image
 *
 * SAFE: Only updates Event.coverImageUrl — does not touch
 * any other fields, IDs, or social post queue records.
 */

import { PrismaClient } from '@/generated/prisma'
import { buildSearchQuery, searchImages } from './search'
import { verifyImage } from './verify'

const BATCH_SIZE = 10 // events per run

interface FixResult {
  processed: number
  fixed: number
  skipped: number
  failed: number
  details: { eventId: string; company: string; status: string; reason?: string }[]
}

/**
 * Known-bad image patterns. If an event's coverImageUrl matches any of these,
 * it's a candidate for replacement.
 */
const BAD_IMAGE_PATTERNS = [
  // Pexels random results (the current broken approach)
  // We can't easily detect bad Pexels URLs by pattern, so we verify them with Claude
]

/**
 * Check if an image URL is likely from a generic/unverified search.
 * These are candidates for verification and possible replacement.
 */
function needsVerification(url: string | null): boolean {
  if (!url) return true
  // Pexels landscape URLs from the old script
  if (url.includes('images.pexels.com')) return true
  // Unsplash generic images
  if (url.includes('images.unsplash.com')) return true
  // Pixabay
  if (url.includes('pixabay.com')) return true
  return false
}

/**
 * Process a batch of events with bad or missing images.
 */
export async function fixEventImages(prisma: PrismaClient): Promise<FixResult> {
  const result: FixResult = { processed: 0, fixed: 0, skipped: 0, failed: 0, details: [] }

  // Find events that need image fixes:
  // 1. No cover image at all
  // 2. Has a stock photo URL that might be wrong
  const events = await prisma.$queryRawUnsafe<any[]>(
    `SELECT id, "companyName", industry, "eventType", country, "publicSummary", "coverImageUrl"
     FROM "Event"
     WHERE "reviewStatus" != 'EXCLUDED'
     AND (
       "coverImageUrl" IS NULL
       OR "coverImageUrl" LIKE '%images.pexels.com%'
       OR "coverImageUrl" LIKE '%images.unsplash.com%'
       OR "coverImageUrl" LIKE '%pixabay.com%'
     )
     ORDER BY "createdAt" DESC
     LIMIT $1`,
    BATCH_SIZE
  )

  if (events.length === 0) {
    console.log('[FIX-IMAGES] No events need image fixes')
    return result
  }

  console.log(`[FIX-IMAGES] Processing ${events.length} events`)

  for (const event of events) {
    result.processed++
    const company = event.companyName || 'Unknown'

    // Step 1: If there's an existing image, verify it first
    if (event.coverImageUrl) {
      try {
        const check = await verifyImage(event.coverImageUrl, {
          companyName: event.companyName,
          industry: event.industry,
          eventType: event.eventType,
          publicSummary: event.publicSummary,
        })

        if (check.suitable) {
          console.log(`[OK] ${company} — existing image is fine: ${check.description}`)
          result.details.push({ eventId: event.id, company, status: 'ok', reason: check.description })
          result.skipped++
          await new Promise(r => setTimeout(r, 1500)) // rate limit Claude
          continue
        }

        console.log(`[BAD] ${company} — ${check.reason}: ${check.description}`)
      } catch (e: any) {
        console.log(`[WARN] ${company} — verify failed: ${e.message}, will try to replace`)
      }
    }

    // Step 2: Search for better images
    const queries = buildSearchQuery({
      companyName: event.companyName,
      industry: event.industry,
      eventType: event.eventType,
      country: event.country,
    })

    const candidates = await searchImages(queries)
    if (candidates.length === 0) {
      console.log(`[SKIP] ${company} — no image candidates found`)
      result.details.push({ eventId: event.id, company, status: 'no_candidates' })
      result.failed++
      continue
    }

    // Step 3: Verify candidates until we find a good one
    let bestImage: string | null = null
    let bestDescription = ''

    for (const candidate of candidates.slice(0, 3)) {
      try {
        const check = await verifyImage(candidate.url, {
          companyName: event.companyName,
          industry: event.industry,
          eventType: event.eventType,
          publicSummary: event.publicSummary,
        })

        if (check.suitable) {
          bestImage = candidate.url
          bestDescription = check.description
          break
        }

        console.log(`  [REJECT] ${candidate.source}: ${check.reason}`)
        await new Promise(r => setTimeout(r, 1500))
      } catch {
        continue
      }
    }

    if (!bestImage) {
      console.log(`[SKIP] ${company} — no suitable image found after verification`)
      result.details.push({ eventId: event.id, company, status: 'none_passed_verification' })
      result.failed++
      continue
    }

    // Step 4: Update the event — ONLY coverImageUrl
    try {
      await prisma.$queryRawUnsafe(
        'UPDATE "Event" SET "coverImageUrl" = $1, "updatedAt" = NOW() WHERE id = $2',
        bestImage, event.id
      )
      console.log(`[FIXED] ${company} — ${bestDescription} (${bestImage.substring(0, 60)}...)`)
      result.details.push({ eventId: event.id, company, status: 'fixed', reason: bestDescription })
      result.fixed++
    } catch (e: any) {
      console.error(`[ERROR] ${company} — update failed: ${e.message}`)
      result.details.push({ eventId: event.id, company, status: 'error', reason: e.message })
      result.failed++
    }

    // Rate limit between events
    await new Promise(r => setTimeout(r, 2000))
  }

  return result
}
