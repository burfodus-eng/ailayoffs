import { PrismaClient } from '../src/generated/prisma'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter } as any)

async function main() {
  const result = await prisma.brandArticle.updateMany({
    where: {
      authorName: { contains: 'Editorial' },
    },
    data: { authorName: 'Steve Burford' },
  })
  process.stderr.write(`Updated ${result.count} articles to "Steve Burford"\n`)
  await pool.end()
}

main().catch(e => { process.stderr.write(String(e)); process.exit(1) })
