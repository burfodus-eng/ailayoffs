import { PrismaClient } from '../src/generated/prisma'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter } as any)

async function main() {
  const events = await prisma.event.findMany({
    where: { reviewStatus: { not: 'EXCLUDED' }, supersededByEventId: null },
    select: { id: true, companyName: true, publicSummary: true, jobsCutAnnounced: true, industry: true, country: true, eventType: true, attributionCategory: true },
    orderBy: { dateAnnounced: 'desc' }
  })
  for (const e of events) {
    const len = (e.publicSummary || '').length
    console.log(`${String(len).padStart(4)} | ${(e.companyName || '??').padEnd(25)} | ${(e.publicSummary || '(none)').slice(0, 100)}`)
  }
  console.log(`\nTotal: ${events.length}`)
  await prisma.$disconnect()
  await pool.end()
}

main().catch(console.error)
