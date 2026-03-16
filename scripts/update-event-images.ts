import 'dotenv/config'
import { PrismaClient } from '../src/generated/prisma'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter } as any)

const PEXELS_API_KEY = process.env.PEXELS_API_KEY!

async function searchPexels(query: string, retries = 5): Promise<string | null> {
  const page = Math.floor(Math.random() * 10) + 1
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&page=${page}`

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        headers: { Authorization: PEXELS_API_KEY },
        signal: AbortSignal.timeout(15000),
      })
      if (res.status === 429) {
        if (attempt < retries) {
          console.log(`  Rate limited, waiting 20s (attempt ${attempt}/${retries})...`)
          await sleep(20000)
          continue
        }
        console.error(`  Rate limited, giving up for query "${query}"`)
        return null
      }
      if (!res.ok) {
        console.error(`  Pexels API error ${res.status} for query "${query}"`)
        return null
      }
      const data = await res.json()
      if (data.photos && data.photos.length > 0) {
        return data.photos[0].src.landscape
      }
      return null
    } catch (err: any) {
      if (attempt < retries) {
        console.log(`  Retry ${attempt}/${retries} after error: ${err.message}`)
        await sleep(2000 * attempt)
      } else {
        console.error(`  Failed after ${retries} attempts: ${err.message}`)
        return null
      }
    }
  }
  return null
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function main() {
  const events = await prisma.event.findMany({
    where: {
      coverImageUrl: { startsWith: 'https://images.unsplash.com' },
    },
    select: {
      id: true,
      companyName: true,
      industry: true,
      coverImageUrl: true,
    },
  })

  console.log(`Found ${events.length} events with Unsplash images to replace.\n`)

  let updated = 0
  let failed = 0

  for (const event of events) {
    const company = event.companyName || ''
    const industry = event.industry || ''

    let imageUrl: string | null = null
    const primaryQuery = `${company} ${industry}`.trim()
    if (primaryQuery) {
      console.log(`[${updated + failed + 1}/${events.length}] Searching: "${primaryQuery}"`)
      imageUrl = await searchPexels(primaryQuery)
      await sleep(1500)
    }

    if (!imageUrl && industry) {
      console.log(`  Fallback: "${industry}"`)
      imageUrl = await searchPexels(industry)
      await sleep(1500)
    }

    if (!imageUrl) {
      console.log(`  Final fallback: "corporate office business"`)
      imageUrl = await searchPexels('corporate office business')
      await sleep(1500)
    }

    if (imageUrl) {
      await prisma.event.update({
        where: { id: event.id },
        data: { coverImageUrl: imageUrl },
      })
      updated++
      console.log(`  Updated ${event.companyName || event.id}\n`)
    } else {
      failed++
      console.log(`  No image found for ${event.companyName || event.id}\n`)
    }
  }

  console.log(`\nDone! Updated: ${updated}, Failed: ${failed}`)
  await pool.end()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
