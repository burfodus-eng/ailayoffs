/**
 * Post published BrandArticle records to Threads.
 *
 * Usage:
 *   npx tsx scripts/post-to-threads.ts              # dry-run (default)
 *   npx tsx scripts/post-to-threads.ts --post        # actually post
 *   npx tsx scripts/post-to-threads.ts --post --limit 3
 *
 * Env vars required:
 *   DATABASE_URL, THREADS_USER_TOKEN, THREADS_USER_ID
 *
 * Tracking: uses a local JSON file (scripts/.threads-posted.json) to avoid double-posting.
 */

import { PrismaClient } from '../src/generated/prisma'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import fs from 'fs'
import path from 'path'

const THREADS_USER_TOKEN = process.env.THREADS_USER_TOKEN
const THREADS_USER_ID = process.env.THREADS_USER_ID
const GRAPH_BASE = 'https://graph.threads.net/v1.0'

const POSTED_FILE = path.join(__dirname, '.threads-posted.json')

interface PostedRecord {
  articleId: string
  threadsPostId: string
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

function buildThreadsText(title: string, summary: string | null, link: string): string {
  // Threads has a 500 char limit — keep it concise
  let text = title

  if (summary) {
    // Leave room for link (URLs are ~40 chars on Threads)
    const maxSummaryLen = 500 - title.length - link.length - 6 // 6 for newlines
    const trimmedSummary = summary.length > maxSummaryLen
      ? summary.substring(0, maxSummaryLen - 3) + '...'
      : summary
    text += `\n\n${trimmedSummary}`
  }

  text += `\n\n${link}`

  // Final safety trim
  if (text.length > 500) {
    text = text.substring(0, 497) + '...'
  }

  return text
}

async function createThreadsContainer(text: string, link: string): Promise<string> {
  const res = await fetch(`${GRAPH_BASE}/${THREADS_USER_ID}/threads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      media_type: 'TEXT',
      text,
      link_attachment: link,
      access_token: THREADS_USER_TOKEN,
    }),
  })

  const data = await res.json()

  if (!res.ok || data.error) {
    throw new Error(`Threads container creation failed: ${JSON.stringify(data)}`)
  }

  return data.id
}

async function publishThreadsContainer(creationId: string): Promise<string> {
  const res = await fetch(`${GRAPH_BASE}/${THREADS_USER_ID}/threads_publish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      creation_id: creationId,
      access_token: THREADS_USER_TOKEN,
    }),
  })

  const data = await res.json()

  if (!res.ok || data.error) {
    throw new Error(`Threads publish failed: ${JSON.stringify(data)}`)
  }

  return data.id
}

async function main() {
  const args = process.argv.slice(2)
  const dryRun = !args.includes('--post')
  const limitFlag = args.indexOf('--limit')
  const limit = limitFlag !== -1 ? parseInt(args[limitFlag + 1]) : undefined

  if (!THREADS_USER_TOKEN) {
    console.error('ERROR: THREADS_USER_TOKEN env var is required')
    console.error('Run scripts/threads-auth.ts first to obtain a token.')
    process.exit(1)
  }

  if (!THREADS_USER_ID) {
    console.error('ERROR: THREADS_USER_ID env var is required')
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
      const summary = article.socialSummary || null
      const text = buildThreadsText(title, summary, link)

      console.log(`--- ${article.slug} ---`)
      console.log(`  Title: ${title}`)
      console.log(`  Link:  ${link}`)
      console.log(`  Text:  ${text.substring(0, 120)}...`)
      console.log(`  Chars: ${text.length}/500`)

      if (dryRun) {
        console.log('  [DRY RUN — skipping post]')
      } else {
        try {
          // Step 1: Create media container
          const containerId = await createThreadsContainer(text, link)
          console.log(`  Container created: ${containerId}`)

          // Brief pause — Threads sometimes needs a moment before publishing
          await new Promise(r => setTimeout(r, 2000))

          // Step 2: Publish
          const postId = await publishThreadsContainer(containerId)
          console.log(`  Published! Threads ID: ${postId}`)

          posted.push({
            articleId: article.id,
            threadsPostId: postId,
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
