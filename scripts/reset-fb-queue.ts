/**
 * Reset Facebook queue: delete all posted FB posts from the page,
 * regenerate postContent with domain links for ALL entries, and
 * reset everything back to pending.
 *
 * Usage: npx tsx scripts/reset-fb-queue.ts
 */

require('dotenv/config')
import { Pool } from 'pg'

const BRAND_DOMAINS: Record<string, string> = {
  ailayoffs: 'https://ailayoffs.com.au',
  aicuts: 'https://aicuts.com.au',
  ailayoffwatch: 'https://ailayoffwatch.com',
  robotlayoffs: 'https://robotlayoffs.com',
}

interface QueueRow {
  id: string
  eventId: string
  platform: string
  brand: string
  platformPostId: string | null
  status: string
}

interface EventRow {
  id: string
  companyName: string | null
  publicSummary: string | null
  jobsCutAnnounced: number | null
  eventType: string
  country: string | null
  industry: string | null
  dateAnnounced: Date | null
}

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function buildEventPostText(
  event: EventRow,
  platform: string,
  brand: string
): string {
  const company = event.companyName || 'Unknown Company'
  const jobs = event.jobsCutAnnounced
  const summary = event.publicSummary || ''

  if (platform === 'x') {
    let text = jobs
      ? `${company} cuts ${jobs.toLocaleString()} jobs amid AI/automation shift.`
      : `${company} announces workforce changes linked to AI/automation.`
    text += `\n\n${summary.substring(0, 180)}`
    text += '\n\n#AILayoffs #FutureOfWork'
    return text.substring(0, 280)
  }

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

  if (BRAND_DOMAINS[brand]) {
    const slug = slugify(company)
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

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  const fbToken = process.env.FB_AILAYOFFS_PAGE_TOKEN
  if (!fbToken) {
    console.error('Missing FB_AILAYOFFS_PAGE_TOKEN')
    process.exit(1)
  }

  try {
    // ── Step 1: Delete all posted Facebook posts from the page ──
    console.log('\n=== Step 1: Deleting posted Facebook posts ===\n')

    const postedRes = await pool.query<QueueRow>(
      `SELECT id, "platformPostId" FROM "SocialPostQueue"
       WHERE status = 'posted' AND "platformPostId" IS NOT NULL AND platform = 'facebook'`
    )

    console.log(`Found ${postedRes.rows.length} posted Facebook entries to delete`)

    let deleted = 0
    let deleteFailed = 0

    for (const row of postedRes.rows) {
      try {
        const url = `https://graph.facebook.com/v21.0/${row.platformPostId}`
        const resp = await fetch(url, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ access_token: fbToken }),
        })

        const data = await resp.json()

        if (resp.ok && (data.success === true || data === true)) {
          deleted++
          console.log(`  Deleted ${row.platformPostId} (${deleted}/${postedRes.rows.length})`)
        } else {
          deleteFailed++
          console.warn(`  Failed to delete ${row.platformPostId}: ${JSON.stringify(data)}`)
        }
      } catch (err: any) {
        deleteFailed++
        console.error(`  Error deleting ${row.platformPostId}: ${err.message}`)
      }

      await sleep(2000)
    }

    console.log(`\nDeleted: ${deleted}, Failed: ${deleteFailed}\n`)

    // ── Step 2: Regenerate postContent for ALL queue entries ──
    console.log('=== Step 2: Regenerating post content with domain links ===\n')

    const allQueueRes = await pool.query<QueueRow>(
      `SELECT id, "eventId", platform, brand FROM "SocialPostQueue"`
    )

    // Collect unique event IDs
    const eventIds = [...new Set(allQueueRes.rows.map(r => r.eventId))]

    // Fetch all events
    const eventsRes = await pool.query<EventRow>(
      `SELECT id, "companyName", "publicSummary", "jobsCutAnnounced",
              "eventType", country, industry, "dateAnnounced"
       FROM "Event"
       WHERE id = ANY($1)`,
      [eventIds]
    )

    const eventsMap = new Map<string, EventRow>()
    for (const e of eventsRes.rows) {
      eventsMap.set(e.id, e)
    }

    let updated = 0
    let skipped = 0
    const now = new Date()

    for (let i = 0; i < allQueueRes.rows.length; i++) {
      const row = allQueueRes.rows[i]
      const event = eventsMap.get(row.eventId)
      if (!event) {
        console.warn(`  Event ${row.eventId} not found, skipping queue entry ${row.id}`)
        skipped++
        continue
      }

      const newContent = buildEventPostText(event, row.platform, row.brand)
      // Stagger posts 3 minutes apart to avoid rate limits
      const scheduledFor = new Date(now.getTime() + i * 3 * 60 * 1000)

      await pool.query(
        `UPDATE "SocialPostQueue"
         SET "postContent" = $1,
             status = 'pending',
             attempts = 0,
             "platformPostId" = NULL,
             "postUrl" = NULL,
             "errorMessage" = NULL,
             "postedAt" = NULL,
             "scheduledFor" = $2
         WHERE id = $3`,
        [newContent, scheduledFor, row.id]
      )

      updated++
    }

    const lastScheduled = new Date(now.getTime() + allQueueRes.rows.length * 3 * 60 * 1000)
    console.log(`Updated: ${updated}, Skipped: ${skipped}`)
    console.log(`Posts staggered 3 min apart, last one at: ${lastScheduled.toISOString()}`)
    console.log(`\nDone. All ${updated} queue entries reset to pending with regenerated content.`)
  } finally {
    await pool.end()
  }
}

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
