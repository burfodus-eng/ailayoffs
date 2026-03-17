import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { processPostQueue } from '@/lib/social/process-queue'

export const maxDuration = 120

/**
 * Process the social post queue.
 * Called every 15 minutes by n8n scheduler.
 *
 *   GET /api/cron/post?secret=YOUR_ADMIN_SECRET
 *   GET /api/cron/post?secret=YOUR_ADMIN_SECRET&reset=ratelimit  (one-time: reset rate-limited failures)
 */
export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')
  const expectedSecret = process.env.ADMIN_SECRET

  if (!expectedSecret || expectedSecret === 'change-me-in-production') {
    return NextResponse.json({ error: 'ADMIN_SECRET not configured' }, { status: 503 })
  }

  if (secret !== expectedSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Reset failures back to pending: ?reset=all or ?reset=ratelimit
  const reset = request.nextUrl.searchParams.get('reset')
  if (reset) {
    const where = reset === 'all'
      ? `status = 'failed'`
      : `(status = 'failed' OR (status = 'pending' AND attempts > 0)) AND "errorMessage" LIKE '%limit how often%'`
    const [result] = await prisma.$queryRawUnsafe<{ cnt: number }[]>(
      `WITH updated AS (
        UPDATE "SocialPostQueue" SET status = 'pending', attempts = 0, "errorMessage" = NULL
        WHERE ${where}
        RETURNING id
      ) SELECT count(*)::int as cnt FROM updated`
    )
    console.log(`[CRON] Reset ${result.cnt} posts (${reset})`)
    return NextResponse.json({ success: true, resetType: reset, resetCount: result.cnt })
  }

  console.log('[CRON] Processing social post queue...')

  const result = await processPostQueue(prisma)
  console.log(`[CRON] Post queue: ${result.posted} posted, ${result.failed} failed, ${result.skipped} skipped`)
  if (result.details.length > 0) {
    console.log(`[CRON] Details: ${JSON.stringify(result.details)}`)
  }

  // Debug info
  let debugInfo: any = {}
  try {
    const stats = await prisma.$queryRawUnsafe<any[]>(
      `SELECT brand, status, count(*)::int as cnt
       FROM "SocialPostQueue" GROUP BY brand, status ORDER BY brand, status`
    )
    debugInfo = { stats, serverTime: new Date().toISOString() }
  } catch { /* ignore */ }

  return NextResponse.json({ success: true, ...result, debug: debugInfo })
}
