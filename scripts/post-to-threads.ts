/**
 * Post published BrandArticle records to Threads (multi-brand).
 *
 * Usage:
 *   npx tsx scripts/post-to-threads.ts                          # dry-run, ailayoffs only
 *   npx tsx scripts/post-to-threads.ts --post --brand all       # post all brands
 *   npx tsx scripts/post-to-threads.ts --post --brand aicuts --limit 3
 *
 * Env vars per brand:
 *   THREADS_AILAYOFFS_USER_TOKEN, THREADS_AILAYOFFS_USER_ID
 *   (same pattern for other brands)
 *
 * Legacy env vars (THREADS_USER_TOKEN, THREADS_USER_ID) still work for ailayoffs.
 */

import path from 'path'
import {
  parseArgs,
  createPrisma,
  loadPosted,
  savePosted,
  getThreadsEnv,
  brandSocialConfig,
  articleUrl,
  buildThreadsText,
  type BrandKey,
} from './lib/social-config'

const POSTED_FILE = path.join(__dirname, '.threads-posted.json')
const GRAPH_BASE = 'https://graph.threads.net/v1.0'

async function createContainer(userId: string, token: string, text: string, link: string): Promise<string> {
  const res = await fetch(`${GRAPH_BASE}/${userId}/threads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      media_type: 'TEXT',
      text,
      link_attachment: link,
      access_token: token,
    }),
  })
  const data = await res.json()
  if (!res.ok || data.error) {
    throw new Error(`Threads container failed: ${JSON.stringify(data)}`)
  }
  return data.id
}

async function publishContainer(userId: string, token: string, creationId: string): Promise<string> {
  const res = await fetch(`${GRAPH_BASE}/${userId}/threads_publish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      creation_id: creationId,
      access_token: token,
    }),
  })
  const data = await res.json()
  if (!res.ok || data.error) {
    throw new Error(`Threads publish failed: ${JSON.stringify(data)}`)
  }
  return data.id
}

async function main() {
  const { dryRun, limit, brandKeys } = parseArgs()
  const { prisma, pool } = await createPrisma()

  try {
    const posted = loadPosted(POSTED_FILE)
    const postedIds = new Set(posted.map(p => `${p.brand}:${p.articleId}`))

    for (const brand of brandKeys) {
      const config = brandSocialConfig[brand]
      const env = getThreadsEnv(brand)

      console.log(`\n${'='.repeat(60)}`)
      console.log(`  THREADS — ${config.name}`)
      console.log(`${'='.repeat(60)}`)

      if (!env.userToken || !env.userId) {
        console.log(`  ⚠ Skipping — missing THREADS_${brand.toUpperCase()}_* env vars`)
        continue
      }

      const articles = await prisma.brandArticle.findMany({
        where: { brand, published: true },
        orderBy: { publishedAt: 'asc' },
      })

      const toPost = articles.filter(a => !postedIds.has(`${brand}:${a.id}`))
      const batch = limit ? toPost.slice(0, limit) : toPost

      console.log(`  Found ${articles.length} published articles`)
      console.log(`  Already posted: ${articles.length - toPost.length}`)
      console.log(`  To post: ${batch.length}${dryRun ? ' (DRY RUN)' : ''}`)

      for (const article of batch) {
        const title = article.socialTitle || article.title
        const link = articleUrl(brand, article.slug)
        const text = buildThreadsText(title, article.socialSummary, link)

        console.log(`\n  --- ${article.slug} ---`)
        console.log(`    Text (${text.length}/500 chars):`)
        console.log(`    ${text.substring(0, 120)}...`)

        if (dryRun) {
          console.log('    [DRY RUN — skipping]')
        } else {
          try {
            const containerId = await createContainer(env.userId, env.userToken, text, link)
            console.log(`    Container: ${containerId}`)

            await new Promise(r => setTimeout(r, 2000))

            const postId = await publishContainer(env.userId, env.userToken, containerId)
            console.log(`    ✓ Posted! Threads ID: ${postId}`)

            posted.push({
              articleId: article.id,
              platformPostId: postId,
              postedAt: new Date().toISOString(),
              title,
              brand,
            })
            savePosted(POSTED_FILE, posted)
          } catch (err: any) {
            console.error(`    ✗ FAILED: ${err.message}`)
          }
        }
      }

      if (batch.length === 0) {
        console.log('  Nothing new to post.')
      }
    }
  } finally {
    await prisma.$disconnect()
    await pool.end()
  }
}

main().catch(console.error)
