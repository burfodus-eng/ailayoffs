import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const type = searchParams.get('type') || 'AI_LAYOFF'

  const aggregates = await prisma.dailyAggregate.findMany({
    where: { eventType: type as any },
    orderBy: { date: 'asc' },
    select: {
      date: true,
      totalConservative: true,
      totalCore: true,
      totalUpper: true,
      cumulativeConservative: true,
      cumulativeCore: true,
      cumulativeUpper: true,
      eventCount: true,
    },
  })

  return NextResponse.json({ data: aggregates })
}
