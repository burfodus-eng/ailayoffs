import { PrismaClient } from '../src/generated/prisma'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter } as any)

async function main() {
  // Find and remove bad automated events
  const badEvents = await prisma.event.findMany({
    where: {
      reviewLevel: 'AUTOMATED',
      OR: [
        // "Block (formerly Square)" — duplicate of existing "Block"
        { companyName: { contains: 'formerly' } },
        // "Oracle Corp." — duplicate of existing "Oracle"
        { companyName: 'Oracle Corp.' },
        // "Multiple (...)" — aggregate articles shouldn't be single events
        { companyName: { startsWith: 'Multiple' } },
        // Events with no date AND no job count — too vague
        { dateAnnounced: null, jobsCutAnnounced: null },
      ],
    },
    select: { id: true, companyName: true, jobsCutAnnounced: true, dateAnnounced: true },
  })

  console.log(`Found ${badEvents.length} bad events to clean up:`)
  for (const e of badEvents) {
    console.log(`  - ${e.companyName} | jobs: ${e.jobsCutAnnounced} | date: ${e.dateAnnounced?.toISOString().split('T')[0] || 'null'}`)

    // Delete article links first
    await prisma.articleEvent.deleteMany({ where: { eventId: e.id } })
    // Delete the event
    await prisma.event.delete({ where: { id: e.id } })
    console.log(`    DELETED`)
  }

  // Also check for the "Oracle Corporation" duplicate (we already have "Oracle" with 20,000 jobs)
  const oracleDupes = await prisma.event.findMany({
    where: {
      companyName: 'Oracle Corporation',
      reviewLevel: 'AUTOMATED',
    },
    select: { id: true, companyName: true, jobsCutAnnounced: true },
  })

  for (const e of oracleDupes) {
    console.log(`  - ${e.companyName} (automated dupe) | jobs: ${e.jobsCutAnnounced}`)
    await prisma.articleEvent.deleteMany({ where: { eventId: e.id } })
    await prisma.event.delete({ where: { id: e.id } })
    console.log(`    DELETED`)
  }

  // Check for RedBalloon productivity gain with no jobs (low value)
  const lowValue = await prisma.event.findMany({
    where: {
      reviewLevel: 'AUTOMATED',
      eventType: 'PRODUCTIVITY_GAIN',
      weightedAiJobs: 0,
      jobsCutAnnounced: null,
    },
    select: { id: true, companyName: true },
  })

  for (const e of lowValue) {
    console.log(`  - ${e.companyName} (productivity gain, no data)`)
    await prisma.articleEvent.deleteMany({ where: { eventId: e.id } })
    await prisma.event.delete({ where: { id: e.id } })
    console.log(`    DELETED`)
  }

  console.log('\nDone.')
  await prisma.$disconnect()
  await pool.end()
}

main().catch(console.error)
