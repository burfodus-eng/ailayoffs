import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  const counters = await prisma.liveCounter.findMany()

  const result: Record<string, { baseValue: number; ratePerSecond: number; lastUpdatedAt: string }> = {}
  for (const c of counters) {
    result[c.counterType] = {
      baseValue: c.baseValue,
      ratePerSecond: c.ratePerSecond,
      lastUpdatedAt: c.lastUpdatedAt.toISOString(),
    }
  }

  return NextResponse.json(result, {
    headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
  })
}
