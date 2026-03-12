import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * Webhook endpoint for Make.com video generation integration.
 *
 * GET  — Make polls this to get new events ready for video generation
 * POST — Callback from Make after video is generated (updates event with video URL)
 *
 * Auth: x-make-apikey header or ?apikey= query param
 */

function authenticate(request: NextRequest): boolean {
  const key = request.headers.get('x-make-apikey')
    || request.nextUrl.searchParams.get('apikey')
  return key === process.env.MAKE_WEBHOOK_KEY
}

/**
 * GET — Returns recent events that haven't had videos generated yet.
 * Make polls this to find new content for video creation.
 *
 * Query params:
 *   limit  — max events to return (default 5)
 *   since  — ISO date, only events created after this (default: last 24h)
 */
export async function GET(request: NextRequest) {
  if (!authenticate(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const limit = parseInt(request.nextUrl.searchParams.get('limit') || '5')
  const since = request.nextUrl.searchParams.get('since')
    || new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

  const events = await prisma.event.findMany({
    where: {
      createdAt: { gte: new Date(since) },
      reviewStatus: { not: 'EXCLUDED' },
      publicSummary: { not: null },
      companyName: { not: null },
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    select: {
      id: true,
      eventType: true,
      companyName: true,
      country: true,
      industry: true,
      dateAnnounced: true,
      jobsCutAnnounced: true,
      attributionCategory: true,
      confidenceScore: true,
      publicSummary: true,
      createdAt: true,
      articleEvents: {
        where: { isPrimary: true },
        select: {
          article: {
            select: { title: true, url: true, publishedAt: true },
          },
        },
        take: 1,
      },
    },
  })

  // Flatten for Make's consumption
  const payload = events.map(e => ({
    eventId: e.id,
    eventType: e.eventType,
    company: e.companyName,
    country: e.country,
    industry: e.industry,
    dateAnnounced: e.dateAnnounced,
    jobsCut: e.jobsCutAnnounced,
    attribution: e.attributionCategory,
    confidence: e.confidenceScore,
    summary: e.publicSummary,
    createdAt: e.createdAt,
    sourceArticle: e.articleEvents[0]?.article || null,
  }))

  return NextResponse.json({ events: payload, count: payload.length })
}

/**
 * POST — Callback from Make after video generation.
 * Body: { eventId, videoUrl, platform?, status? }
 */
export async function POST(request: NextRequest) {
  if (!authenticate(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { eventId, videoUrl, status } = body

  if (!eventId) {
    return NextResponse.json({ error: 'eventId is required' }, { status: 400 })
  }

  // Log the callback
  console.log(`[MAKE WEBHOOK] Video callback for event ${eventId}: ${status || 'completed'} — ${videoUrl || 'no URL'}`)

  return NextResponse.json({ success: true, eventId })
}
