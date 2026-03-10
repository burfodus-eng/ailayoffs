import { PrismaClient } from '@/generated/prisma'

export async function updateLiveCounters(prisma: PrismaClient) {
  const counterTypes = [
    { key: 'ai_layoff', eventTypes: ['AI_LAYOFF'] },
    { key: 'robot_layoff', eventTypes: ['ROBOT_LAYOFF'] },
    { key: 'both', eventTypes: ['AI_LAYOFF', 'ROBOT_LAYOFF'] },
  ]

  for (const { key, eventTypes } of counterTypes) {
    const total = await prisma.event.aggregate({
      where: {
        eventType: { in: eventTypes as any },
        reviewStatus: { not: 'EXCLUDED' },
        supersededByEventId: null,
      },
      _sum: { weightedAiJobs: true },
    })

    const baseValue = total._sum.weightedAiJobs || 0

    const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
    const recentTotal = await prisma.event.aggregate({
      where: {
        eventType: { in: eventTypes as any },
        reviewStatus: { not: 'EXCLUDED' },
        supersededByEventId: null,
        dateAnnounced: { gte: ninetyDaysAgo },
      },
      _sum: { weightedAiJobs: true },
    })

    const dailyRate = (recentTotal._sum.weightedAiJobs || 0) / 90
    const ratePerSecond = dailyRate / 86400

    await prisma.liveCounter.upsert({
      where: { counterType: key },
      create: { counterType: key, baseValue, ratePerSecond, lastUpdatedAt: new Date() },
      update: { baseValue, ratePerSecond, lastUpdatedAt: new Date() },
    })
  }
}
