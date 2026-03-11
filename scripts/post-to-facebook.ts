/**
 * Post published BrandArticle records to the AI Layoffs Facebook Page.
 *
 * Usage:
 *   npx tsx scripts/post-to-facebook.ts              # dry-run (default)
 *   npx tsx scripts/post-to-facebook.ts --post        # actually post
 *   npx tsx scripts/post-to-facebook.ts --post --limit 3
 *
 * Env vars required:
 *   DATABASE_URL, FB_PAGE_TOKEN, FB_PAGE_ID
 *
 * Tracking: uses a local JSON file (scripts/.fb-posted.json) to avoid double-posting.
 */

import { PrismaClient } from '../src/generated/prisma'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import fs from 'fs'
import path from 'path'

const FB_PAGE_TOKEN = process.env.FB_PAGE_TOKEN
const FB_PAGE_ID = process.env.FB_PAGE_ID || '1089727594217084'
const GRAPH_API = `https://graph.facebook.com/v21.0/${FB_PAGE_ID}/feed`

const POSTED_FILE = path.join(__dirname, '.fb-posted.json')

interface PostedRecord {
  articleId: string
  facebookPostId: string
  postedAt: string
  title: string
}

function loadPosted(): PostedRecord[] {
  if (!fs.existsSync(POSTED_FILE)) return []
  return JSON.parse(fs.readFileSync(POSTED_FILE, 'utf-8'))
}

function savePosted(records: PostedRecord[]) {
  fs.writeFileSync(POSTED_FILE, JSON.stringify(records, null, 2))
}

async function postToFacebook(message: string, link: string): Promise<{ id: string }> {
  const res = await fetch(GRAPH_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      link,
      access_token: FB_PAGE_TOKEN,
    }),
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(`Facebook API error: ${JSON.stringify(err)}`)
  }

  return res.json() as Promise<{ id: string }>
}

async function main() {
  const args = process.argv.slice(2)
  const dryRun = !args.includes('--post')
  const limitFlag = args.indexOf('--limit')
  const limit = limitFlag !== -1 ? parseInt(args[limitFlag + 1]) : undefined

  if (!FB_PAGE_TOKEN) {
    console.error('ERROR: FB_PAGE_TOKEN env var is required')
    process.exit(1)
  }

  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
  const adapter = new PrismaPg(pool)
  const prisma = new PrismaClient({ adapter } as any)

  try {
    const posted = loadPosted()
    const postedIds = new Set(posted.map(p => p.articleId))

    const articles = await prisma.brandArticle.findMany({
      where: {
        brand: 'ailayoffs',
        published: true,
      },
      orderBy: { publishedAt: 'asc' },
    })

    const toPost = articles.filter(a => !postedIds.has(a.id))
    const batch = limit ? toPost.slice(0, limit) : toPost

    console.log(`Found ${articles.length} published ailayoffs articles`)
    console.log(`Already posted: ${postedIds.size}`)
    console.log(`To post: ${batch.length}${dryRun ? ' (DRY RUN)' : ''}`)
    console.log()

    for (const article of batch) {
      const title = article.socialTitle || article.title
      const link = `https://ailayoffs.com.au/digest/${article.slug}`

      // Build message: title + description
      let message = title
      if (article.socialSummary) {
        message += `\n\n${article.socialSummary}`
      }

      console.log(`--- ${article.slug} ---`)
      console.log(`  Title:   ${title}`)
      console.log(`  Link:    ${link}`)
      console.log(`  Message: ${message.substring(0, 120)}...`)

      if (dryRun) {
        console.log('  [DRY RUN — skipping post]')
      } else {
        try {
          const result = await postToFacebook(message, link)
          console.log(`  Posted! Facebook ID: ${result.id}`)

          posted.push({
            articleId: article.id,
            facebookPostId: result.id,
            postedAt: new Date().toISOString(),
            title,
          })
          savePosted(posted)
        } catch (err: any) {
          console.error(`  FAILED: ${err.message}`)
        }
      }
      console.log()
    }

    if (batch.length === 0) {
      console.log('Nothing new to post.')
    }
  } finally {
    await prisma.$disconnect()
    await pool.end()
  }
}

main().catch(console.error)
