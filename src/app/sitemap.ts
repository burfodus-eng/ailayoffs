import { MetadataRoute } from 'next'
import { prisma } from '@/lib/db'
import { headers } from 'next/headers'
import { getBrandFromHost } from '@/lib/domains'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const headersList = await headers()
  const host = headersList.get('host') || 'ailayoffs.com.au'
  const brand = getBrandFromHost(host)
  const origin = `https://${brand.domain}`

  const staticPages = [
    { url: origin, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 1.0 },
    { url: `${origin}/news`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${origin}/digest`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${origin}/net-impact`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: `${origin}/jobs-created`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: `${origin}/methodology`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${origin}/about`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.4 },
    { url: `${origin}/faq`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.4 },
    { url: `${origin}/robots`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: `${origin}/job-security`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.6 },
    { url: `${origin}/productivity`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.6 },
  ]

  // Dynamic digest articles
  const articles = await prisma.brandArticle.findMany({
    where: { brand: brand.key, published: true },
    select: { slug: true, updatedAt: true },
    orderBy: { publishedAt: 'desc' },
  })

  const articlePages = articles.map(a => ({
    url: `${origin}/digest/${a.slug}`,
    lastModified: a.updatedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  // Dynamic event pages (top 500 most recent)
  const events = await prisma.event.findMany({
    where: { reviewStatus: { not: 'EXCLUDED' }, supersededByEventId: null },
    select: { id: true, updatedAt: true },
    orderBy: { dateAnnounced: 'desc' },
    take: 500,
  })

  const eventPages = events.map(e => ({
    url: `${origin}/event/${e.id}`,
    lastModified: e.updatedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }))

  return [...staticPages, ...articlePages, ...eventPages]
}
