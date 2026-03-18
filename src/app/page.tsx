import { prisma } from '@/lib/db'
import { headers } from 'next/headers'
import { getBrandFromHost, normalizeIndustry } from '@/lib/domains'
import dynamic from 'next/dynamic'

// Lazy-load HomeClient — defers ~200KB recharts bundle until client hydration
const HomeClient = dynamic(() => import('@/components/home-client').then(m => m.HomeClient), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-pulse text-gray-400">Loading dashboard...</div>
    </div>
  ),
})

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
    allEvents: JSON.parse(JSON.stringify(allEvents.map(e => ({ ...e, industry: normalizeIndustry(e.industry) })))),
    chartData,
  }
}

export default async function HomePage() {
  const headersList = await headers()
  const host = headersList.get('host') || 'ailayoffs.com.au'
  const brand = getBrandFromHost(host)
  const stats = await getStats(brand.focusType)

  const trackingLabel = brand.heroHeading.toUpperCase()

  return (
    <HomeClient
      allEvents={stats.allEvents}
      chartData={stats.chartData}
      hasData={stats.core > 0}
      stats={{
        conservative: stats.conservative,
        core: stats.core,
        upper: stats.upper,
        totalAnnounced: stats.totalAnnounced,
        eventCount: stats.eventCount,
        reviewedPercent: stats.reviewedPercent,
        lastUpdated: stats.lastUpdated,
      }}
      trackingLabel={trackingLabel}
    />
  )
}
