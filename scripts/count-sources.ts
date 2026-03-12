import 'dotenv/config'
import { PrismaClient } from '../src/generated/prisma'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

async function main() {
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
  const adapter = new PrismaPg(pool)
  const prisma = new PrismaClient({ adapter } as any)

  const sources = await prisma.source.count()
  const dataSources = await prisma.dataSource.count()
  console.log('Source table:', sources)
  console.log('DataSource table:', dataSources)

  await prisma.$disconnect()
  await pool.end()
}
main().catch(console.error)
