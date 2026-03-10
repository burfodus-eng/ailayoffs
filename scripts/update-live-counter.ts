/**
 * Calculate rate of change from historical event data and update the LiveCounter table.
 * Run daily via cron or manually: DATABASE_URL="..." npx tsx scripts/update-live-counter.ts
 *
 * Strategy:
 * - Look at events over the last 90 days to compute an average daily rate
 * - Set baseValue to the current confirmed total
 * - Set ratePerSecond = dailyRate / 86400
 * - The frontend interpolates between updates
 */

import { PrismaClient } from '../src/generated/prisma'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter } as any)

async function computeCounter(counterType: string, eventTypes: string[]) {
  // Get current total
  const total = await prisma.event.aggregate({
    where: {
      eventType: { in: eventTypes as any },
      reviewStatus: { not: 'EXCLUDED' },
      supersededByEventId: null,
    },
    _sum: { weightedAiJobs: true },
  })

  const baseValue = total._sum.weightedAiJobs || 0

  // Get events from last 90 days to compute rate
  const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
  const recentTotal = await prisma.event.aggregate({
    where: {
      eventType: { in: eventTypes as any },
      reviewStatus: { not: 'EXCLUDED' },
      supersededByEventId: null,
      dateAnnounced: { gte: ninetyDaysAgo },
    },
    _sum: { weightedAiJobs: true },
  })

  const recentJobs = recentTotal._sum.weightedAiJobs || 0
  const dailyRate = recentJobs / 90
  const ratePerSecond = dailyRate / 86400

  await prisma.liveCounter.upsert({
    where: { counterType },
    create: { counterType, baseValue, ratePerSecond, lastUpdatedAt: new Date() },
    update: { baseValue, ratePerSecond, lastUpdatedAt: new Date() },
  })

  console.log(`${counterType}: base=${baseValue}, daily=${dailyRate.toFixed(1)}, rate/s=${ratePerSecond.toFixed(6)}`)
}

async function main() {
  await computeCounter('ai_layoff', ['AI_LAYOFF'])
  await computeCounter('robot_layoff', ['ROBOT_LAYOFF'])
  await computeCounter('both', ['AI_LAYOFF', 'ROBOT_LAYOFF'])

  console.log('Done.')
  await prisma.$disconnect()
  await pool.end()
}

main().catch(console.error)
