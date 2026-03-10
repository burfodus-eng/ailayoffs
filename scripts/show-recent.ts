import { PrismaClient } from '../src/generated/prisma'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter } as any)

async function main() {
  const events = await prisma.event.findMany({
    where: { reviewLevel: 'AUTOMATED' },
    orderBy: { createdAt: 'desc' },
    take: 10,
    select: { companyName: true, eventType: true, jobsCutAnnounced: true, weightedAiJobs: true, attributionCategory: true, publicSummary: true, dateAnnounced: true },
  })

  for (const e of events) {
    console.log('---')
    console.log(`${e.eventType} | ${e.companyName} | ${e.jobsCutAnnounced || 0} announced | Core: ${e.weightedAiJobs} | ${e.attributionCategory}`)
    console.log(`Date: ${e.dateAnnounced ? new Date(e.dateAnnounced).toISOString().split('T')[0] : 'n/a'}`)
    console.log((e.publicSummary || '').slice(0, 200))
  }

  console.log(`\nTotal automated events: ${events.length}`)
  await prisma.$disconnect()
  await pool.end()
}

main().catch(console.error)
