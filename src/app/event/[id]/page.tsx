import { Metadata } from 'next'
import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import { EventDetailClient } from '@/components/event-detail-client'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const event = await prisma.event.findUnique({ where: { id }, select: { companyName: true, publicSummary: true } })
  if (!event) return { title: 'Event Not Found' }
  return {
    title: `${event.companyName || 'Unknown'} — AI Job Impact`,
    description: event.publicSummary || undefined,
  }
}

export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const event = await prisma.event.findUnique({
    where: { id },
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

  if (!event) notFound()

  return <EventDetailClient event={JSON.parse(JSON.stringify(event))} />
}
