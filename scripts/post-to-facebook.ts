/**
 * Post published BrandArticle records to Facebook Pages (multi-brand).
 *
 * Usage:
 *   npx tsx scripts/post-to-facebook.ts                          # dry-run, ailayoffs only
 *   npx tsx scripts/post-to-facebook.ts --post --brand all       # post all brands
 *   npx tsx scripts/post-to-facebook.ts --post --brand aicuts,robotlayoffs --limit 3
 *
 * Env vars per brand:
 *   FB_AILAYOFFS_PAGE_TOKEN, FB_AILAYOFFS_PAGE_ID
 *   FB_AICUTS_PAGE_TOKEN, FB_AICUTS_PAGE_ID
 *   FB_AILAYOFFWATCH_PAGE_TOKEN, FB_AILAYOFFWATCH_PAGE_ID
 *   FB_ROBOTLAYOFFS_PAGE_TOKEN, FB_ROBOTLAYOFFS_PAGE_ID
 *
 * Legacy env vars (FB_PAGE_TOKEN, FB_PAGE_ID) still work for ailayoffs.
 */

import path from 'path'
import {
  parseArgs,
  createPrisma,
  loadPosted,
  savePosted,
  getFacebookEnv,
  brandSocialConfig,
  articleUrl,
  buildFacebookMessage,
  type BrandKey,
  type PostedRecord,
} from './lib/social-config'

const POSTED_FILE = path.join(__dirname, '.fb-posted.json')

async function postToFacebook(
  pageToken: string,
  pageId: string,
  message: string,
  link: string,
  imageUrl?: string | null,
): Promise<{ id: string }> {
  const graphBase = `https://graph.facebook.com/v21.0/${pageId}`

  if (imageUrl) {
    const res = await fetch(`${graphBase}/photos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: imageUrl,
        message: message + `\n\n🔗 Read the full report: ${link}`,
        access_token: pageToken,
      }),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(`Facebook API error: ${JSON.stringify(err)}`)
    }
    return res.json() as Promise<{ id: string }>
  }

  const res = await fetch(`${graphBase}/feed`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, link, access_token: pageToken }),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(`Facebook API error: ${JSON.stringify(err)}`)
  }
  return res.json() as Promise<{ id: string }>
}

async function main() {
  const { dryRun, limit, brandKeys } = parseArgs()
  const { prisma, pool } = await createPrisma()

  try {
    const posted = loadPosted(POSTED_FILE)
    const postedIds = new Set(posted.map(p => `${p.brand}:${p.articleId}`))

    for (const brand of brandKeys) {
      const config = brandSocialConfig[brand]
      const env = getFacebookEnv(brand)

      console.log(`\n${'='.repeat(60)}`)
      console.log(`  FACEBOOK — ${config.name} (${config.domain})`)
      console.log(`${'='.repeat(60)}`)

      if (!env.pageToken) {
        console.log(`  ⚠ Skipping — no FB_${brand.toUpperCase()}_PAGE_TOKEN set`)
        continue
      }
      if (!env.pageId) {
        console.log(`  ⚠ Skipping — no FB_${brand.toUpperCase()}_PAGE_ID set`)
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
        const message = buildFacebookMessage(
          title,
          article.socialSummary || article.summary,
          article.body,
          config.hashtags,
        )
        const imageUrl = article.coverImageUrl || article.socialImageUrl

        console.log(`\n  --- ${article.slug} ---`)
        console.log(`    Title:   ${title}`)
        console.log(`    Link:    ${link}`)
        console.log(`    Image:   ${imageUrl || 'none'}`)
        console.log(`    Message: ${message.substring(0, 200)}...`)

        if (dryRun) {
          console.log('    [DRY RUN — skipping]')
        } else {
          try {
            const result = await postToFacebook(env.pageToken, env.pageId, message, link, imageUrl)
            console.log(`    ✓ Posted! Facebook ID: ${result.id}`)

            posted.push({
              articleId: article.id,
              platformPostId: result.id,
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
