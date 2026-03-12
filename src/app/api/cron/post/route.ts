import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { processPostQueue } from '@/lib/social/process-queue'

export const maxDuration = 120

/**
 * Process the social post queue.
 * Called every 15 minutes by the instrumentation scheduler.
 *
 *   GET /api/cron/post?secret=YOUR_ADMIN_SECRET
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

  console.log('[CRON] Processing social post queue...')
  const result = await processPostQueue(prisma)
  console.log(`[CRON] Post queue: ${result.posted} posted, ${result.failed} failed, ${result.skipped} skipped`)

  return NextResponse.json({ success: true, ...result })
}
