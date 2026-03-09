import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const type = searchParams.get('type') || 'AI_LAYOFF'
  const page = parseInt(searchParams.get('page') || '1')
  const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100)
  const country = searchParams.get('country')
  const company = searchParams.get('company')
  const category = searchParams.get('category')
  const status = searchParams.get('status')

  const where: Record<string, unknown> = {
    eventType: type,
    reviewStatus: { not: 'EXCLUDED' },
    supersededByEventId: null,
  }
  if (country) where.country = country
  if (company) where.companyName = { contains: company, mode: 'insensitive' }
  if (category) where.attributionCategory = category
  if (status) where.reviewStatus = status

  const [events, total] = await Promise.all([
    prisma.event.findMany({
      where,
      orderBy: { dateAnnounced: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        articleEvents: {
          include: { article: { select: { title: true, url: true, summary: true, publishedAt: true } } },
          where: { isPrimary: true },
          take: 1,
        },
      },
    }),
    prisma.event.count({ where }),
  ])

  return NextResponse.json({
    events,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  })
}
