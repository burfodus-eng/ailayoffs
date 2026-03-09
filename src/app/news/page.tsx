import { Metadata } from 'next'
import { prisma } from '@/lib/db'
import { NewsClient } from '@/components/news-client'

export const metadata: Metadata = { title: 'News & Sources' }
export const dynamic = 'force-dynamic'

export default async function NewsPage() {
  const events = await prisma.event.findMany({
    where: { reviewStatus: { not: 'EXCLUDED' }, supersededByEventId: null },
    orderBy: { dateAnnounced: 'desc' },
    take: 50,
    include: {
      articleEvents: {
        include: { article: { select: { title: true, url: true, summary: true, publishedAt: true, source: { select: { name: true, domain: true } } } } },
        take: 3,
      },
    },
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold text-white mb-2">News & Sources</h1>
      <p className="text-gray-400 mb-8">Articles and reports used to build our estimates.</p>
      <NewsClient events={JSON.parse(JSON.stringify(events))} />
    </div>
  )
}
