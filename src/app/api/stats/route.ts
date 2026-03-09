import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  const [aiLayoffs, robotLayoffs, aiJobsCreated] = await Promise.all([
    prisma.event.aggregate({
      where: { eventType: 'AI_LAYOFF', reviewStatus: { not: 'EXCLUDED' }, supersededByEventId: null },
      _sum: { conservativeAiJobs: true, weightedAiJobs: true, upperAiJobs: true },
      _count: true,
    }),
    prisma.event.aggregate({
      where: { eventType: 'ROBOT_LAYOFF', reviewStatus: { not: 'EXCLUDED' }, supersededByEventId: null },
      _sum: { conservativeAiJobs: true, weightedAiJobs: true, upperAiJobs: true },
      _count: true,
    }),
    prisma.event.aggregate({
      where: { eventType: 'AI_JOB_CREATED', reviewStatus: { not: 'EXCLUDED' }, supersededByEventId: null },
      _sum: { conservativeAiJobs: true, weightedAiJobs: true, upperAiJobs: true },
      _count: true,
    }),
  ])

  const [reviewedCount, totalCount, lastEvent] = await Promise.all([
    prisma.event.count({ where: { reviewStatus: 'REVIEWED' } }),
    prisma.event.count({ where: { reviewStatus: { not: 'EXCLUDED' } } }),
    prisma.event.findFirst({ orderBy: { createdAt: 'desc' }, select: { createdAt: true } }),
  ])

  return NextResponse.json({
    ai: {
      conservative: aiLayoffs._sum.conservativeAiJobs || 0,
      core: aiLayoffs._sum.weightedAiJobs || 0,
      upper: aiLayoffs._sum.upperAiJobs || 0,
      eventCount: aiLayoffs._count,
    },
    robot: {
      conservative: robotLayoffs._sum.conservativeAiJobs || 0,
      core: robotLayoffs._sum.weightedAiJobs || 0,
      upper: robotLayoffs._sum.upperAiJobs || 0,
      eventCount: robotLayoffs._count,
    },
    aiJobsCreated: {
      conservative: aiJobsCreated._sum.conservativeAiJobs || 0,
      core: aiJobsCreated._sum.weightedAiJobs || 0,
      upper: aiJobsCreated._sum.upperAiJobs || 0,
      eventCount: aiJobsCreated._count,
    },
    reviewedPercent: totalCount > 0 ? Math.round((reviewedCount / totalCount) * 100) : 0,
    lastUpdated: lastEvent?.createdAt || null,
    totalEvents: totalCount,
  })
}
