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
    },
    _count: true,
  })

  const [reviewedCount, totalCount, lastEvent, recentEvents] = await Promise.all([
    prisma.event.count({ where: { reviewStatus: 'REVIEWED', eventType: { in: eventTypes as any } } }),
    prisma.event.count({ where: { reviewStatus: { not: 'EXCLUDED' }, eventType: { in: eventTypes as any } } }),
    prisma.event.findFirst({ orderBy: { createdAt: 'desc' }, select: { createdAt: true } }),
    prisma.event.findMany({
      where: { eventType: { in: eventTypes as any }, reviewStatus: { not: 'EXCLUDED' }, supersededByEventId: null },
      orderBy: { dateAnnounced: 'desc' },
      take: 5,
      select: {
        id: true,
        companyName: true,
        country: true,
        dateAnnounced: true,
        weightedAiJobs: true,
        attributionCategory: true,
        publicSummary: true,
        reviewStatus: true,
      },
    }),
  ])

  return {
    conservative: result._sum.conservativeAiJobs || 0,
    core: result._sum.weightedAiJobs || 0,
    upper: result._sum.upperAiJobs || 0,
    eventCount: result._count,
    reviewedPercent: totalCount > 0 ? Math.round((reviewedCount / totalCount) * 100) : 0,
    lastUpdated: lastEvent?.createdAt?.toISOString() || null,
    recentEvents,
  }
}

export default async function HomePage() {
  const headersList = await headers()
  const host = headersList.get('host') || 'ailayoffs.com.au'
  const brand = getBrandFromHost(host)
  const stats = await getStats(brand.focusType)

  const trackingLabel = brand.focusType === 'robot'
    ? 'Robot & Automation-Attributed Jobs Lost'
    : brand.focusType === 'both'
    ? 'AI & Automation-Attributed Jobs Lost'
    : 'AI-Attributed Jobs Lost Globally'

  return (
    <div>
      {/* Hero */}
      <section className={`bg-gradient-to-b ${brand.heroGradient} py-16 sm:py-24`}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm uppercase tracking-widest mb-4">
            Live Estimate &mdash; {trackingLabel}
          </p>

          {stats.core > 0 ? (
            <>
              <div className="text-6xl sm:text-8xl font-black text-white tabular-nums mb-2">
                {formatNumberFull(stats.core)}
              </div>
              <p className="text-gray-400 text-sm mb-8">Core weighted estimate</p>

              <div className="flex items-center justify-center gap-8 text-sm">
                <div className="text-center">
                  <div className="text-gray-500 text-xs uppercase tracking-wider">Conservative</div>
                  <div className="text-gray-300 text-xl font-bold tabular-nums">{formatNumberFull(stats.conservative)}</div>
                </div>
                <div className="text-center">
                  <div className="text-gray-500 text-xs uppercase tracking-wider">Upper Bound</div>
                  <div className="text-gray-300 text-xl font-bold tabular-nums">{formatNumberFull(stats.upper)}</div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="text-4xl sm:text-5xl font-bold text-gray-500 mb-4">
                Awaiting Data
              </div>
              <p className="text-gray-500 text-sm max-w-lg mx-auto">
                The tracker is live but has not yet ingested any events.
                Data will appear here as articles are discovered and classified.
              </p>
            </>
          )}

          <div className="mt-8 flex items-center justify-center gap-6 text-xs text-gray-500">
            {stats.lastUpdated && (
              <span>Last updated: {new Date(stats.lastUpdated).toLocaleDateString()}</span>
            )}
            <span>{stats.eventCount} events tracked</span>
            {stats.eventCount > 0 && <span>{stats.reviewedPercent}% reviewed</span>}
          </div>

          <p className="mt-6 text-gray-600 text-xs max-w-md mx-auto">
            This is a live estimate built from public reporting and weighted attribution analysis.
            Numbers are ranges, not exact census counts.
          </p>
        </div>
      </section>

      {/* Recent Events */}
      <HomeClient recentEvents={stats.recentEvents} hasData={stats.core > 0} />
    </div>
  )
}
