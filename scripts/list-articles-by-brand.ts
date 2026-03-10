import { PrismaClient } from '../src/generated/prisma'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter } as any)

async function main() {
  const articles = await prisma.brandArticle.findMany({
    where: { published: true },
    select: { brand: true, slug: true },
    orderBy: { publishedAt: 'desc' },
  })
  const byBrand: Record<string, string[]> = {}
  for (const a of articles) {
    if (!byBrand[a.brand]) byBrand[a.brand] = []
    byBrand[a.brand].push(a.slug)
  }
  console.log(JSON.stringify(byBrand))
  await prisma.$disconnect()
  await pool.end()
}
main().catch(console.error)
