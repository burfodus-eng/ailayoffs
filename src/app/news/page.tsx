import { Metadata } from 'next'
import { prisma } from '@/lib/db'
import { NewsClient } from '@/components/news-client'

export const metadata: Metadata = { title: 'News & Sources' }
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

  return (
    <NewsClient
      events={JSON.parse(JSON.stringify(events)) as any[]}
      countries={countries.map(c => c.country!).filter(Boolean)}
      industries={industries.map(i => i.industry!).filter(Boolean)}
    />
  )
}
