/**
 * Fix bad event cover images.
 *
 * 1. Finds events with missing or likely-bad images (not already classified)
 * 2. Verifies existing image with Claude Vision
 * 3. If bad, searches for better images by industry/context
 * 4. Verifies candidates with Claude Vision
 * 5. Updates the event and logs the classification
 *
 * SAFE: Only updates Event.coverImageUrl — does not touch
 * any other fields, IDs, or social post queue records.
 * All findings are recorded in ImageClassification table.
 */

import { PrismaClient } from '@/generated/prisma'
import { buildSearchQuery, searchImages } from './search'
import { verifyImage } from './verify'

const BATCH_SIZE = 10 // events per run

interface FixResult {
  processed: number
  fixed: number
  kept: number
  failed: number
  details: { eventId: string; company: string; action: string; reason?: string }[]
}

/**
 * Process a batch of events with bad or missing images.
 * Skips events that have already been classified.
 */
export async function fixEventImages(prisma: PrismaClient): Promise<FixResult> {
  const result: FixResult = { processed: 0, fixed: 0, kept: 0, failed: 0, details: [] }

  // Find events that need image fixes, excluding already-classified ones
  const events = await prisma.$queryRawUnsafe<any[]>(
    `SELECT e.id, e."companyName", e.industry, e."eventType", e.country,
            e."publicSummary", e."coverImageUrl"
     FROM "Event" e
     LEFT JOIN "ImageClassification" ic ON ic."eventId" = e.id
     WHERE e."reviewStatus" != 'EXCLUDED'
     AND ic.id IS NULL
     AND (
       e."coverImageUrl" IS NULL
       OR e."coverImageUrl" LIKE '%images.pexels.com%'
       OR e."coverImageUrl" LIKE '%images.unsplash.com%'
       OR e."coverImageUrl" LIKE '%pixabay.com%'
     )
     ORDER BY e."createdAt" DESC
     LIMIT $1`,
    BATCH_SIZE
  )

  if (events.length === 0) {
    console.log('[FIX-IMAGES] No unclassified events need image fixes')
    return result
  }

  console.log(`[FIX-IMAGES] Processing ${events.length} events`)

  for (const event of events) {
    result.processed++
    const company = event.companyName || 'Unknown'
    const queries = buildSearchQuery({
      companyName: event.companyName,
      industry: event.industry,
      eventType: event.eventType,
      country: event.country,
    })

    // Step 1: If there's an existing image, verify it first
    let previousVerdict: string | null = null
    let previousReason: string | null = null
    let previousDescription: string | null = null

    if (event.coverImageUrl) {
      try {
        const check = await verifyImage(event.coverImageUrl, {
          companyName: event.companyName,
          industry: event.industry,
          eventType: event.eventType,
          publicSummary: event.publicSummary,
        })

        previousVerdict = check.suitable ? 'suitable' : 'rejected'
        previousReason = check.reason
        previousDescription = check.description

        if (check.suitable) {
          console.log(`[KEPT] ${company} — image is fine: ${check.description}`)

          // Record the classification even for kept images
          await prisma.$queryRawUnsafe(
            `INSERT INTO "ImageClassification"
             (id, "eventId", "previousImageUrl", "previousVerdict", "previousReason",
              "previousDescription", "searchQueries", "candidatesTested", action, "classifiedAt")
             VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, 0, 'kept', NOW())`,
            event.id, event.coverImageUrl, previousVerdict, previousReason,
            previousDescription, queries
          )

          result.details.push({ eventId: event.id, company, action: 'kept', reason: check.description })
          result.kept++
          await new Promise(r => setTimeout(r, 1500))
          continue
        }

        console.log(`[BAD] ${company} — ${check.reason}: ${check.description}`)
      } catch (e: any) {
        previousVerdict = 'error'
        previousReason = e.message
        console.log(`[WARN] ${company} — verify failed: ${e.message}, will try to replace`)
      }
    } else {
      previousVerdict = 'missing'
      previousReason = 'no cover image'
    }

    // Step 2: Search for better images
    const candidates = await searchImages(queries)
    if (candidates.length === 0) {
      console.log(`[NO-CANDIDATES] ${company}`)

      await prisma.$queryRawUnsafe(
        `INSERT INTO "ImageClassification"
         (id, "eventId", "previousImageUrl", "previousVerdict", "previousReason",
          "previousDescription", "searchQueries", "candidatesTested", action, "classifiedAt")
         VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, 0, 'no_candidates', NOW())`,
        event.id, event.coverImageUrl, previousVerdict, previousReason,
        previousDescription, queries
      )

      result.details.push({ eventId: event.id, company, action: 'no_candidates' })
      result.failed++
      continue
    }

    // Step 3: Verify candidates until we find a good one
    let bestImage: string | null = null
    let bestDescription = ''
    let bestSource = ''
    let candidatesTested = 0

    for (const candidate of candidates.slice(0, 3)) {
      candidatesTested++
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
          bestSource = candidate.source
          break
        }

        console.log(`  [REJECT] ${candidate.source}: ${check.reason}`)
        await new Promise(r => setTimeout(r, 1500))
      } catch {
        continue
      }
    }

    if (!bestImage) {
      console.log(`[NONE-PASSED] ${company} — ${candidatesTested} candidates tested`)

      await prisma.$queryRawUnsafe(
        `INSERT INTO "ImageClassification"
         (id, "eventId", "previousImageUrl", "previousVerdict", "previousReason",
          "previousDescription", "searchQueries", "candidatesTested", action, "classifiedAt")
         VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, 'none_passed', NOW())`,
        event.id, event.coverImageUrl, previousVerdict, previousReason,
        previousDescription, queries, candidatesTested
      )

      result.details.push({ eventId: event.id, company, action: 'none_passed' })
      result.failed++
      continue
    }

    // Step 4: Update the event and record the classification
    try {
      await prisma.$queryRawUnsafe(
        'UPDATE "Event" SET "coverImageUrl" = $1, "updatedAt" = NOW() WHERE id = $2',
        bestImage, event.id
      )

      await prisma.$queryRawUnsafe(
        `INSERT INTO "ImageClassification"
         (id, "eventId", "previousImageUrl", "previousVerdict", "previousReason",
          "previousDescription", "newImageUrl", "newSource", "newDescription",
          "searchQueries", "candidatesTested", action, "classifiedAt")
         VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'replaced', NOW())`,
        event.id, event.coverImageUrl, previousVerdict, previousReason,
        previousDescription, bestImage, bestSource, bestDescription,
        queries, candidatesTested
      )

      console.log(`[REPLACED] ${company} — ${bestDescription} (${bestSource})`)
      result.details.push({ eventId: event.id, company, action: 'replaced', reason: bestDescription })
      result.fixed++
    } catch (e: any) {
      console.error(`[ERROR] ${company} — ${e.message}`)

      await prisma.$queryRawUnsafe(
        `INSERT INTO "ImageClassification"
         (id, "eventId", "previousImageUrl", "previousVerdict", "previousReason",
          "previousDescription", "searchQueries", "candidatesTested", action, "classifiedAt")
         VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, 'error', NOW())`,
        event.id, event.coverImageUrl, previousVerdict, previousReason,
        previousDescription, queries, candidatesTested
      ).catch(() => {})

      result.details.push({ eventId: event.id, company, action: 'error', reason: e.message })
      result.failed++
    }

    // Rate limit between events
    await new Promise(r => setTimeout(r, 2000))
  }

  return result
}
