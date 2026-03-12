/**
 * Master seed script — imports all source seed files and upserts into DataSource table.
 *
 * Usage: npx tsx scripts/seed-all-sources.ts
 */

import 'dotenv/config'
import { PrismaClient } from '../src/generated/prisma'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

// Import the original seed sources (inline in seed-data-sources.ts — we'll import the sub-files)
import { newsPublicationSources } from './seeds/news-publications'
import { warnStateSources } from './seeds/warn-states'
import { extendedSources } from './seeds/extended-sources'

// Re-read the original sources from seed-data-sources.ts
// We need to extract just the array — let's import it differently
// Actually, let's just run the original seed first, then add the new ones

import type { SourceSeed } from './seeds/news-publications'

const allNewSources: SourceSeed[] = [
  ...newsPublicationSources,
  ...warnStateSources,
  ...extendedSources,
]

async function main() {
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
  const adapter = new PrismaPg(pool)
  const prisma = new PrismaClient({ adapter } as any)

  // Deduplicate by URL
  const seen = new Set<string>()
  const deduped = allNewSources.filter(s => {
    const url = s.url.toLowerCase().replace(/\/$/, '')
    if (seen.has(url)) return false
    seen.add(url)
    return true
  })

  console.log(`Seeding ${deduped.length} new data sources (deduplicated from ${allNewSources.length})...`)
  let created = 0, updated = 0, skipped = 0

  for (const s of deduped) {
    try {
      const existing = await prisma.dataSource.findUnique({ where: { url: s.url } })
      await prisma.dataSource.upsert({
        where: { url: s.url },
        create: {
          name: s.name,
          url: s.url,
          type: s.type,
          category: s.category,
          region: s.region || null,
          country: s.country || null,
          language: s.language || 'en',
          description: s.description || null,
          tier: s.tier,
          checkFrequency: s.checkFrequency || null,
          hasApi: s.hasApi || false,
          hasRss: s.hasRss || false,
          rssUrl: s.rssUrl || null,
          paywalled: s.paywalled || false,
        },
        update: {
          name: s.name,
          type: s.type,
          category: s.category,
          region: s.region || null,
          country: s.country || null,
          language: s.language || 'en',
          description: s.description || null,
          tier: s.tier,
          checkFrequency: s.checkFrequency || null,
          hasApi: s.hasApi || false,
          hasRss: s.hasRss || false,
          rssUrl: s.rssUrl || null,
          paywalled: s.paywalled || false,
        },
      })
      if (existing) updated++
      else created++
    } catch (e: any) {
      console.log(`  SKIP: ${s.name} — ${e.message.substring(0, 100)}`)
      skipped++
    }
  }

  const total = await prisma.dataSource.count()
  console.log(`\nDone: ${created} created, ${updated} updated, ${skipped} skipped`)
  console.log(`Total sources in database: ${total}`)

  await prisma.$disconnect()
  await pool.end()
}

main().catch(console.error)
