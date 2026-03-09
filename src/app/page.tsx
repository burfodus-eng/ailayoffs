import { prisma } from '@/lib/db'
import { formatNumberFull } from '@/lib/utils'
import { headers } from 'next/headers'
import { getBrandFromHost } from '@/lib/domains'
import { HomeClient } from '@/components/home-client'

export const dynamic = 'force-dynamic'

async function getStats(focusType: string) {
  const eventTypes = focusType === 'robot'
    ? ['ROBOT_LAYOFF']
    : focusType === 'both'
    ? ['AI_LAYOFF', 'ROBOT_LAYOFF']
    : ['AI_LAYOFF']

  const result = await prisma.event.aggregate({
    where: {
      eventType: { in: eventTypes as any },
      reviewStatus: { not: 'EXCLUDED' },
      supersededByEventId: null,
    },
    _sum: {
      conservativeAiJobs: true,
      weightedAiJobs: true,
      upperAiJobs: true,
      jobsCutAnnounced: true,
    },
    _count: true,
  })

  const [reviewedCount, totalCount, lastEvent, allEvents] = await Promise.all([
    prisma.event.count({ where: { reviewStatus: 'REVIEWED', eventType: { in: eventTypes as any } } }),
    prisma.event.count({ where: { reviewStatus: { not: 'EXCLUDED' }, eventType: { in: eventTypes as any } } }),
    prisma.event.findFirst({ orderBy: { createdAt: 'desc' }, select: { createdAt: true } }),
    prisma.event.findMany({
      where: { eventType: { in: eventTypes as any }, reviewStatus: { not: 'EXCLUDED' }, supersededByEventId: null },
      orderBy: { dateAnnounced: 'desc' },
      select: {
        id: true,
        companyName: true,
        country: true,
        industry: true,
        dateAnnounced: true,
        jobsCutAnnounced: true,
        conservativeAiJobs: true,
        weightedAiJobs: true,
        upperAiJobs: true,
        attributionCategory: true,
        publicSummary: true,
        reviewStatus: true,
        articleEvents: {
          include: { article: { select: { url: true, title: true } } },
          where: { isPrimary: true },
          take: 1,
        },
      },
    }),
  ])

  // Build cumulative chart data from events sorted by date
  const sortedEvents = [...allEvents]
    .filter(e => e.dateAnnounced)
    .sort((a, b) => new Date(a.dateAnnounced!).getTime() - new Date(b.dateAnnounced!).getTime())

  let cumConservative = 0, cumCore = 0, cumUpper = 0
  const chartData = sortedEvents.map(e => {
    cumConservative += e.conservativeAiJobs
    cumCore += e.weightedAiJobs
    cumUpper += e.upperAiJobs
    return {
      date: e.dateAnnounced!.toISOString().split('T')[0],
      company: e.companyName || '',
      conservative: cumConservative,
      core: cumCore,
      upper: cumUpper,
    }
  })

  return {
    conservative: result._sum.conservativeAiJobs || 0,
    core: result._sum.weightedAiJobs || 0,
    upper: result._sum.upperAiJobs || 0,
    totalAnnounced: result._sum.jobsCutAnnounced || 0,
    eventCount: result._count,
    reviewedPercent: totalCount > 0 ? Math.round((reviewedCount / totalCount) * 100) : 0,
    lastUpdated: lastEvent?.createdAt?.toISOString() || null,
    allEvents: JSON.parse(JSON.stringify(allEvents)),
    chartData,
  }
}

export default async function HomePage() {
  const headersList = await headers()
  const host = headersList.get('host') || 'ailayoffs.com.au'
  const brand = getBrandFromHost(host)
  const stats = await getStats(brand.focusType)

  const trackingLabel = brand.focusType === 'robot'
    ? 'ROBOT & AUTOMATION-ATTRIBUTED JOBS LOST'
    : brand.focusType === 'both'
    ? 'AI & AUTOMATION-ATTRIBUTED JOBS LOST'
    : 'AI-ATTRIBUTED JOBS LOST GLOBALLY'

  return (
    <div>
      {/* Hero - always dark */}
      <section className="bg-slate-950 border-b border-slate-800 py-10 sm:py-14">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-6">
            <p className="text-slate-500 text-xs font-mono uppercase tracking-[0.2em] mb-3">
              LIVE ESTIMATE // {trackingLabel}
            </p>

            {stats.core > 0 ? (
              <>
                <div className="text-5xl sm:text-7xl font-black text-white font-mono tabular-nums tracking-tight">
                  {formatNumberFull(stats.core)}
                </div>
                <p className="text-slate-500 text-xs font-mono mt-1">CORE WEIGHTED ESTIMATE</p>
              </>
            ) : (
              <div className="text-3xl font-mono text-slate-600">NO DATA</div>
            )}
          </div>

          {stats.core > 0 && (
            <div className="grid grid-cols-4 gap-px bg-slate-800 border border-slate-800 max-w-2xl mx-auto">
              <div className="bg-slate-900 p-3 text-center">
                <div className="text-slate-500 text-[10px] font-mono uppercase">Conservative</div>
                <div className="text-slate-300 text-lg font-mono font-bold tabular-nums">{formatNumberFull(stats.conservative)}</div>
              </div>
              <div className="bg-slate-900 p-3 text-center">
                <div className="text-slate-500 text-[10px] font-mono uppercase">Core</div>
                <div className="text-white text-lg font-mono font-bold tabular-nums">{formatNumberFull(stats.core)}</div>
              </div>
              <div className="bg-slate-900 p-3 text-center">
                <div className="text-slate-500 text-[10px] font-mono uppercase">Upper Bound</div>
                <div className="text-slate-300 text-lg font-mono font-bold tabular-nums">{formatNumberFull(stats.upper)}</div>
              </div>
              <div className="bg-slate-900 p-3 text-center">
                <div className="text-slate-500 text-[10px] font-mono uppercase">Total Announced</div>
                <div className="text-slate-400 text-lg font-mono font-bold tabular-nums">{formatNumberFull(stats.totalAnnounced)}</div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-center gap-4 mt-4 text-[10px] font-mono text-slate-600 uppercase">
            {stats.lastUpdated && <span>Updated: {new Date(stats.lastUpdated).toISOString().split('T')[0]}</span>}
            <span>{stats.eventCount} events</span>
            <span>{stats.reviewedPercent}% reviewed</span>
            <span className="text-green-700">LIVE</span>
          </div>
        </div>
      </section>

      <HomeClient
        allEvents={stats.allEvents}
        chartData={stats.chartData}
        hasData={stats.core > 0}
      />
    </div>
  )
}
