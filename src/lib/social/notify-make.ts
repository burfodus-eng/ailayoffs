/**
 * Notify Make.com webhook when new events are created.
 * Sends event data to Make so it can trigger video generation.
 */

import { PrismaClient } from '@/generated/prisma'

export async function notifyMakeWebhook(
  prisma: PrismaClient,
  eventIds: string[]
): Promise<number> {
  const webhookUrl = process.env.MAKE_VIDEO_WEBHOOK_URL
  const apiKey = process.env.MAKE_WEBHOOK_KEY

  if (!webhookUrl) {
    console.log('[MAKE] Skipping — MAKE_VIDEO_WEBHOOK_URL not configured')
    return 0
  }

  const events = await prisma.event.findMany({
    where: { id: { in: eventIds } },
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
            select: { title: true, url: true },
          },
        },
        take: 1,
      },
    },
  })

  let sent = 0

  for (const event of events) {
    if (!event.companyName || !event.publicSummary) continue

    const payload = {
      eventId: event.id,
      eventType: event.eventType,
      company: event.companyName,
      country: event.country,
      industry: event.industry,
      dateAnnounced: event.dateAnnounced,
      jobsCut: event.jobsCutAnnounced,
      attribution: event.attributionCategory,
      confidence: event.confidenceScore,
      summary: event.publicSummary,
      sourceArticleTitle: event.articleEvents[0]?.article?.title || null,
      sourceArticleUrl: event.articleEvents[0]?.article?.url || null,
    }

    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' }
      if (apiKey) headers['x-make-apikey'] = apiKey

      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        console.log(`[MAKE] Sent event ${event.companyName} to Make webhook`)
        sent++
      } else {
        console.error(`[MAKE] Webhook returned ${res.status}: ${await res.text()}`)
      }
    } catch (e: any) {
      console.error(`[MAKE] Failed to notify: ${e.message}`)
    }
  }

  return sent
}
