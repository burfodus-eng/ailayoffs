/**
 * Queue social media posts for new events.
 *
 * After ingestion creates events, this queues staggered posts across
 * all brands and platforms. Each platform/brand combo gets a 1-hour offset.
 *
 * Schedule (from ingestion time):
 *   +0m   Facebook — ailayoffs
 *   +60m  Facebook — aicuts
 *   +120m Facebook — ailayoffwatch
 *   +180m Facebook — robotlayoffs
 *   (future: +240m threads, +300m X, +360m reddit per brand)
 */

import { PrismaClient } from '@/generated/prisma'

type BrandKey = 'ailayoffs' | 'aicuts' | 'ailayoffwatch' | 'robotlayoffs'

const BRAND_DOMAINS: Record<BrandKey, string> = {
  ailayoffs: 'https://ailayoffs.com.au',
  aicuts: 'https://aicuts.com.au',
  ailayoffwatch: 'https://ailayoffwatch.com',
  robotlayoffs: 'https://robotlayoffs.com',
}

interface PostSlot {
  platform: string
  brand: BrandKey
  offsetMinutes: number
}

// Stagger schedule — 1 hour between each
const POST_SCHEDULE: PostSlot[] = [
  { platform: 'facebook', brand: 'ailayoffs', offsetMinutes: 0 },
  { platform: 'facebook', brand: 'aicuts', offsetMinutes: 60 },
  { platform: 'facebook', brand: 'ailayoffwatch', offsetMinutes: 120 },
  { platform: 'facebook', brand: 'robotlayoffs', offsetMinutes: 180 },
  // Add more platforms here as they're set up:
  // { platform: 'threads', brand: 'ailayoffs', offsetMinutes: 240 },
  // { platform: 'x', brand: 'ailayoffs', offsetMinutes: 300 },
]

/**
 * Determine which brands an event should be posted to based on eventType.
 */
function getBrandsForEvent(eventType: string): BrandKey[] {
  if (eventType === 'ROBOT_LAYOFF') {
    return ['robotlayoffs', 'ailayoffs', 'ailayoffwatch']
  }
  // AI_LAYOFF, AI_JOB_CREATED, PRODUCTIVITY_GAIN
  return ['ailayoffs', 'aicuts', 'ailayoffwatch']
}

/**
 * Build the social post text for an event.
 */
function buildEventPostText(event: {
  companyName: string | null
  publicSummary: string | null
  jobsCutAnnounced: number | null
  eventType: string
  country: string | null
  industry: string | null
  dateAnnounced: Date | null
  slug?: string | null
}, platform: string, brand?: BrandKey): string {
  const company = event.companyName || 'Unknown Company'
  const jobs = event.jobsCutAnnounced
  const summary = event.publicSummary || ''

  if (platform === 'x') {
    // 280 char limit
    let text = jobs
      ? `${company} cuts ${jobs.toLocaleString()} jobs amid AI/automation shift.`
      : `${company} announces workforce changes linked to AI/automation.`
    text += `\n\n${summary.substring(0, 180)}`
    text += '\n\n#AILayoffs #FutureOfWork'
    return text.substring(0, 280)
  }

  // Facebook / Threads / Reddit — longer format
  const parts: string[] = []

  if (event.eventType === 'ROBOT_LAYOFF') {
    parts.push(jobs
      ? `🤖 ${company} displaces ${jobs.toLocaleString()} workers through automation and robotics.`
      : `🤖 ${company} announces automation-driven workforce changes.`)
  } else {
    parts.push(jobs
      ? `📊 ${company} cuts ${jobs.toLocaleString()} jobs amid AI transformation.`
      : `📊 ${company} announces AI-driven workforce restructuring.`)
  }

  parts.push('')
  if (summary) {
    parts.push(summary)
    parts.push('')
  }

  if (event.country || event.industry) {
    const meta: string[] = []
    if (event.industry) meta.push(event.industry)
    if (event.country) meta.push(event.country)
    parts.push(`📍 ${meta.join(' | ')}`)
    parts.push('')
  }

  // Add link to the article on the brand's domain
  if (brand && BRAND_DOMAINS[brand]) {
    const slug = event.slug || company.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    parts.push(`Read more: ${BRAND_DOMAINS[brand]}/event/${slug}`)
    parts.push('')
  }

  if (event.eventType === 'ROBOT_LAYOFF') {
    parts.push('#RobotLayoffs #Automation #Robotics #FutureOfWork')
  } else {
    parts.push('#AILayoffs #AI #FutureOfWork #TechLayoffs')
  }

  return parts.join('\n')
}

/**
 * Queue social posts for newly created events.
 * Call this after ingestion creates events.
 */
export async function queuePostsForEvents(
  prisma: PrismaClient,
  eventIds: string[]
): Promise<number> {
  if (eventIds.length === 0) return 0

  const events = await prisma.event.findMany({
    where: { id: { in: eventIds } },
  })

  let queued = 0
  const now = new Date()

  for (const event of events) {
    if (!event.companyName || !event.publicSummary) continue

    const relevantBrands = getBrandsForEvent(event.eventType)
    const relevantSlots = POST_SCHEDULE.filter(s => relevantBrands.includes(s.brand))

    for (const slot of relevantSlots) {
      const scheduledFor = new Date(now.getTime() + slot.offsetMinutes * 60 * 1000)
      const postContent = buildEventPostText(event, slot.platform, slot.brand)

      try {
        await prisma.socialPostQueue.create({
          data: {
            eventId: event.id,
            platform: slot.platform,
            brand: slot.brand,
            scheduledFor,
            postContent,
            status: 'pending',
          },
        })
        queued++
        console.log(`QUEUED: ${slot.platform}/${slot.brand} for ${event.companyName} at ${scheduledFor.toISOString()}`)
      } catch (e: any) {
        // Unique constraint — already queued
        if (e.code === 'P2002') continue
        console.error(`Failed to queue ${slot.platform}/${slot.brand}: ${e.message}`)
      }
    }
  }

  return queued
}
