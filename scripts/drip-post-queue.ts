/**
 * Drip-feed the social post queue — posts a small batch, then waits.
 * Uses /photos endpoint with direct image upload (not OG link previews).
 *
 * Usage:
 *   npx tsx scripts/drip-post-queue.ts                    # 10 per batch, 60 min interval
 *   npx tsx scripts/drip-post-queue.ts --batch 5 --interval 30   # 5 per batch, 30 min interval
 *   npx tsx scripts/drip-post-queue.ts --once             # post one batch and exit
 */

import 'dotenv/config'
import pg from 'pg'

const Pool = (pg as any).default?.Pool || pg.Pool

const args = process.argv.slice(2)
const batchIdx = args.indexOf('--batch')
const BATCH_SIZE = batchIdx !== -1 ? parseInt(args[batchIdx + 1]) : 10
const intervalIdx = args.indexOf('--interval')
const INTERVAL_MIN = intervalIdx !== -1 ? parseInt(args[intervalIdx + 1]) : 60
const ONCE = args.includes('--once')

async function postToFB(
  brand: string,
  message: string,
  link: string | null,
  imageUrl: string | null,
): Promise<string> {
  const key = brand.toUpperCase()
  const token = process.env[`FB_${key}_PAGE_TOKEN`]
  const pageId = process.env[`FB_${key}_PAGE_ID`]
  if (!token || !pageId) throw new Error(`Missing token/id for ${brand}`)

  const fullMessage = link ? message + `\n\n🔗 Read more: ${link}` : message

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      // Use /photos if we have an image (shows image directly in feed)
      // Otherwise /feed with link (shows OG link preview)
      const endpoint = imageUrl ? `${pageId}/photos` : `${pageId}/feed`
      const body: Record<string, string> = { message: fullMessage, access_token: token }
      if (imageUrl) {
        body.url = imageUrl
      } else if (link) {
        body.link = link
      }

      const res = await fetch(`https://graph.facebook.com/v21.0/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(15000),
      })
      const data = await res.json() as any
      if (!res.ok) {
        const msg = data.error?.message || JSON.stringify(data)
        if (msg.includes('unknown') && attempt < 2) {
          await new Promise(r => setTimeout(r, 5000))
          continue
        }
        throw new Error(msg)
      }
      return data.id
    } catch (e: any) {
      if (attempt < 2 && (e.message.includes('fetch failed') || e.message.includes('timeout'))) {
        await new Promise(r => setTimeout(r, 5000))
        continue
      }
      throw e
    }
  }
  throw new Error('Max retries exceeded')
}

async function postBatch(pool: any): Promise<{ posted: number; failed: number; remaining: number }> {
  // Fetch pending posts with their event's cover image
  const pending = await pool.query(
    `SELECT q.id, q.brand, q."postContent", e."coverImageUrl", e.slug
     FROM "SocialPostQueue" q
     JOIN "Event" e ON e.id = q."eventId"
     WHERE q.status = 'pending' ORDER BY q."scheduledFor" ASC LIMIT $1`,
    [BATCH_SIZE]
  )

  const totalPending = await pool.query(
    `SELECT count(*)::int as cnt FROM "SocialPostQueue" WHERE status = 'pending'`
  )
  const remaining = totalPending.rows[0].cnt

  if (pending.rows.length === 0) {
    return { posted: 0, failed: 0, remaining: 0 }
  }

  let posted = 0
  let failed = 0

  for (const row of pending.rows) {
    try {
      // Extract link from content
      const linkMatch = row.postContent?.match(/Read more: (https:\/\/\S+)/)
      const link = linkMatch?.[1] || null
      // Remove the "Read more" line from the message body
      const message = link
        ? row.postContent.replace(/\nRead more: https:\/\/\S+\n?/, '\n').trim()
        : row.postContent

      const fbId = await postToFB(row.brand, message, link, row.coverImageUrl)
      await pool.query(
        `UPDATE "SocialPostQueue" SET status = 'posted', "platformPostId" = $1,
         "postedAt" = now(), attempts = attempts + 1 WHERE id = $2`,
        [fbId, row.id]
      )
      posted++
      console.log(`  ✓ ${row.brand} — ${fbId}`)
    } catch (e: any) {
      await pool.query(
        `UPDATE "SocialPostQueue" SET status = 'failed', "errorMessage" = $1,
         attempts = attempts + 1 WHERE id = $2`,
        [e.message?.substring(0, 200), row.id]
      )
      failed++
      console.log(`  ✗ ${row.brand} — ${e.message?.substring(0, 80)}`)
    }
    // 5s between posts within a batch
    await new Promise(r => setTimeout(r, 5000))
  }

  return { posted, failed, remaining: remaining - posted }
}

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })

  console.log(`Drip posting: ${BATCH_SIZE} per batch, ${INTERVAL_MIN} min interval${ONCE ? ' (once)' : ''}`)

  let round = 1
  while (true) {
    const now = new Date().toISOString().substring(11, 19)
    console.log(`\n[${now}] Round ${round}:`)

    const result = await postBatch(pool)
    console.log(`  Posted: ${result.posted}, Failed: ${result.failed}, Remaining: ${result.remaining}`)

    if (result.remaining === 0) {
      console.log('\nAll done — queue empty.')
      break
    }

    if (ONCE) {
      console.log(`\nStopping (--once). ${result.remaining} posts remaining.`)
      break
    }

    console.log(`  Waiting ${INTERVAL_MIN} minutes...`)
    await new Promise(r => setTimeout(r, INTERVAL_MIN * 60 * 1000))
    round++
  }

  await pool.end()
}

main().catch(e => {
  console.error('Fatal:', e)
  process.exit(1)
})
