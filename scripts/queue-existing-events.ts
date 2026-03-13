import 'dotenv/config'
import { PrismaClient } from '../src/generated/prisma'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const Pool = (pg as any).default?.Pool || pg.Pool

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  const adapter = new PrismaPg(pool)
  const prisma = new PrismaClient({ adapter } as any)

  const events = await prisma.event.findMany({
    where: {
      reviewStatus: { not: 'EXCLUDED' },
      publicSummary: { not: null },
      companyName: { not: null },
    },
    orderBy: { createdAt: 'desc' },
  })

  const schedule = [
    { platform: 'facebook', brand: 'ailayoffs', offset: 0 },
    { platform: 'facebook', brand: 'aicuts', offset: 1 },
    { platform: 'facebook', brand: 'ailayoffwatch', offset: 2 },
    { platform: 'facebook', brand: 'robotlayoffs', offset: 3 },
  ]

  let queued = 0
  const now = Date.now()

  for (const event of events) {
    const isRobot = event.eventType === 'ROBOT_LAYOFF'
    const relevantBrands = isRobot
      ? ['robotlayoffs', 'ailayoffs', 'ailayoffwatch']
      : ['ailayoffs', 'aicuts', 'ailayoffwatch']

    const slots = schedule.filter(s => relevantBrands.includes(s.brand))

    for (const slot of slots) {
      const scheduledFor = new Date(now + queued * 5 * 60 * 1000) // 5 min apart
      const emoji = isRobot ? '🤖' : '📊'
      const jobs = event.jobsCutAnnounced

      let text: string
      if (jobs) {
        text = `${emoji} ${event.companyName} cuts ${jobs.toLocaleString()} jobs amid ${isRobot ? 'automation' : 'AI'} transformation.\n\n${event.publicSummary}\n\n#AILayoffs #FutureOfWork`
      } else {
        text = `${emoji} ${event.companyName} announces workforce changes.\n\n${event.publicSummary}\n\n#AILayoffs #FutureOfWork`
      }

      try {
        await prisma.socialPostQueue.create({
          data: {
            eventId: event.id,
            platform: slot.platform,
            brand: slot.brand,
            scheduledFor,
            postContent: text,
            status: 'pending',
          },
        })
        queued++
        console.log(`QUEUED: ${slot.platform}/${slot.brand} — ${event.companyName} at ${scheduledFor.toISOString()}`)
      } catch (e: any) {
        if (e.code === 'P2002') {
          // already queued
        } else {
          console.log(`Skip: ${event.companyName} ${slot.brand}: ${e.message.substring(0, 80)}`)
        }
      }
    }
  }

  console.log(`\nDone: ${queued} posts queued`)
  await prisma.$disconnect()
  await pool.end()
}

main().catch(console.error)
