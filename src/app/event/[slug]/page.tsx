import { Metadata } from 'next'
import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import { getBrandFromHost } from '@/lib/domains'
import { getIndustryImageUrl } from '@/lib/company-images'
import { EventDetailClient } from '@/components/event-detail-client'

export const dynamic = 'force-dynamic'

async function getEvent(slug: string) {
  // Try slug first, then fall back to ID lookup
  let event = await prisma.event.findUnique({
    where: { slug },
    include: {
      articleEvents: {
        include: {
          article: {
            select: {
              id: true,
              title: true,
              url: true,
              summary: true,
              publishedAt: true,
              source: { select: { name: true, domain: true } },
            },
          },
        },
      },
    },
  })

  if (!event) {
    // Try as ID for backwards compatibility
    event = await prisma.event.findUnique({
      where: { id: slug },
      include: {
        articleEvents: {
          include: {
            article: {
              select: {
                id: true,
                title: true,
                url: true,
                summary: true,
                publishedAt: true,
                source: { select: { name: true, domain: true } },
              },
            },
          },
        },
      },
    })
  }

  return event
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const event = await getEvent(slug)
  if (!event) return { title: 'Event Not Found' }

  const headersList = await headers()
  const host = headersList.get('host') || 'ailayoffs.com.au'
  const brand = getBrandFromHost(host)

  const title = event.jobsCutAnnounced
    ? `${event.companyName} cuts ${event.jobsCutAnnounced.toLocaleString()} jobs — ${brand.name}`
    : `${event.companyName || 'Unknown'} — AI Job Impact`

  const imageUrl = event.coverImageUrl || getIndustryImageUrl(event.industry)

  return {
    title,
    description: event.publicSummary || undefined,
    openGraph: {
      title,
      description: event.publicSummary || undefined,
      images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630 }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: event.publicSummary || undefined,
      images: imageUrl ? [imageUrl] : undefined,
    },
  }
}

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const event = await getEvent(slug)

  if (!event) notFound()

  return <EventDetailClient event={JSON.parse(JSON.stringify(event))} />
}
