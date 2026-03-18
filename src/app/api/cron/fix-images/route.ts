import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { fixEventImages } from '@/lib/images/fix-images'

export const maxDuration = 300 // 5 min — image verification takes time

/**
 * Fix bad event cover images using smart search + Claude Vision verification.
 * Called periodically by n8n or manually.
 *
 *   GET /api/cron/fix-images?secret=YOUR_ADMIN_SECRET
 *
 * Only updates Event.coverImageUrl — does NOT touch any other fields,
 * social post queue, or Facebook integration.
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

  console.log('[CRON] Fixing event images...')

  const result = await fixEventImages(prisma)

  console.log(`[CRON] Images: ${result.fixed} fixed, ${result.skipped} already ok, ${result.failed} failed`)

  return NextResponse.json({ success: true, ...result })
}
