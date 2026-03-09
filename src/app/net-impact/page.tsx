import { Metadata } from 'next'
import { prisma } from '@/lib/db'
import { NetImpactClient } from '@/components/net-impact-client'

export const metadata: Metadata = { title: 'Net Impact — AI Jobs Created vs Lost' }
export const dynamic = 'force-dynamic'

export default async function NetImpactPage() {
  const [lossEvents, creationEvents] = await Promise.all([
    prisma.event.findMany({
      where: {
        eventType: { in: ['AI_LAYOFF', 'ROBOT_LAYOFF'] },
        reviewStatus: { not: 'EXCLUDED' },
        supersededByEventId: null,
        dateAnnounced: { not: null },
      },
      orderBy: { dateAnnounced: 'asc' },
      select: {
        id: true,
        companyName: true,
        dateAnnounced: true,
        weightedAiJobs: true,
        conservativeAiJobs: true,
        upperAiJobs: true,
        eventType: true,
      },
    }),
    prisma.event.findMany({
      where: {
        eventType: 'AI_JOB_CREATED',
        reviewStatus: { not: 'EXCLUDED' },
        supersededByEventId: null,
        dateAnnounced: { not: null },
      },
      orderBy: { dateAnnounced: 'asc' },
      select: {
        id: true,
        companyName: true,
        dateAnnounced: true,
        weightedAiJobs: true,
        conservativeAiJobs: true,
        upperAiJobs: true,
        eventType: true,
      },
    }),
  ])

  // Build monthly aggregated data
  const monthlyData: Record<string, { lost: number; created: number }> = {}

  for (const e of lossEvents) {
    const month = e.dateAnnounced!.toISOString().slice(0, 7)
    if (!monthlyData[month]) monthlyData[month] = { lost: 0, created: 0 }
    monthlyData[month].lost += e.weightedAiJobs
  }

  for (const e of creationEvents) {
    const month = e.dateAnnounced!.toISOString().slice(0, 7)
    if (!monthlyData[month]) monthlyData[month] = { lost: 0, created: 0 }
    monthlyData[month].created += e.weightedAiJobs
  }

  const chartData = Object.entries(monthlyData)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, data]) => ({
      month,
      lost: data.lost,
      created: data.created,
      net: data.created - data.lost,
    }))

  // Build cumulative data
  let cumLost = 0, cumCreated = 0
  const cumulativeData = chartData.map(d => {
    cumLost += d.lost
    cumCreated += d.created
    return {
      month: d.month,
      cumLost,
      cumCreated,
      cumNet: cumCreated - cumLost,
    }
  })

  const totalLost = lossEvents.reduce((s, e) => s + e.weightedAiJobs, 0)
  const totalCreated = creationEvents.reduce((s, e) => s + e.weightedAiJobs, 0)

  return (
    <NetImpactClient
      chartData={chartData}
      cumulativeData={cumulativeData}
      totalLost={totalLost}
      totalCreated={totalCreated}
      lossEventCount={lossEvents.length}
      creationEventCount={creationEvents.length}
    />
  )
}
