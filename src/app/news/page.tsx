import { Metadata } from 'next'
import { prisma } from '@/lib/db'
import { normalizeIndustry } from '@/lib/domains'
import { NewsClient } from '@/components/news-client'

export const metadata: Metadata = {
  title: 'News & Sources',
  description: 'Latest AI layoff announcements, job cuts, and workforce restructuring events sourced from verified public reporting. Updated daily.',
  openGraph: { title: 'News & Sources', description: 'Latest AI layoff announcements and workforce restructuring events from verified sources.' },
}
export const dynamic = 'force-dynamic'

export default async function NewsPage() {
  const [events, countries, industries] = await Promise.all([
    prisma.event.findMany({
      where: { reviewStatus: { not: 'EXCLUDED' }, supersededByEventId: null },
      orderBy: { dateAnnounced: 'desc' },
      take: 100,
      include: {
        articleEvents: {
          include: { article: { select: { title: true, url: true, summary: true, publishedAt: true, source: { select: { name: true, domain: true } } } } },
          take: 3,
        },
      },
    }),
    prisma.event.findMany({
      where: { reviewStatus: { not: 'EXCLUDED' }, country: { not: null } },
      select: { country: true },
      distinct: ['country'],
      orderBy: { country: 'asc' },
    }),
    prisma.event.findMany({
      where: { reviewStatus: { not: 'EXCLUDED' }, industry: { not: null } },
      select: { industry: true },
      distinct: ['industry'],
      orderBy: { industry: 'asc' },
    }),
  ])

  const normalizedEvents = events.map(e => ({ ...e, industry: normalizeIndustry(e.industry) }))
  const normalizedIndustries = [...new Set(normalizedEvents.map(e => e.industry).filter(Boolean))].sort() as string[]

  return (
    <NewsClient
      events={JSON.parse(JSON.stringify(normalizedEvents)) as any[]}
      countries={countries.map(c => c.country!).filter(Boolean)}
      industries={normalizedIndustries}
    />
  )
}
