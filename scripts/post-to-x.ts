/**
 * Post published BrandArticle records to X/Twitter (multi-brand).
 *
 * Usage:
 *   npx tsx scripts/post-to-x.ts                          # dry-run, ailayoffs only
 *   npx tsx scripts/post-to-x.ts --post --brand all       # post all brands
 *   npx tsx scripts/post-to-x.ts --post --brand aicuts --limit 3
 *
 * Env vars per brand:
 *   X_AILAYOFFS_API_KEY, X_AILAYOFFS_API_SECRET
 *   X_AILAYOFFS_ACCESS_TOKEN, X_AILAYOFFS_ACCESS_SECRET
 *   (same pattern for other brands)
 *
 * X API setup:
 *   1. Apply for X Developer access at https://developer.x.com
 *   2. Create a project and app
 *   3. Generate API Key + Secret (consumer credentials)
 *   4. Generate Access Token + Secret (user auth for your account)
 *   5. Ensure the app has Read and Write permissions
 *
 * Uses OAuth 1.0a (required for posting on behalf of a user).
 */

import crypto from 'crypto'
import path from 'path'
import {
  parseArgs,
  createPrisma,
  loadPosted,
  savePosted,
  getXEnv,
  brandSocialConfig,
  articleUrl,
  buildXPost,
  type BrandKey,
} from './lib/social-config'

const POSTED_FILE = path.join(__dirname, '.x-posted.json')
const X_API_BASE = 'https://api.x.com/2'

// ── OAuth 1.0a signing ──

function percentEncode(str: string): string {
  return encodeURIComponent(str).replace(/[!'()*]/g, c => '%' + c.charCodeAt(0).toString(16).toUpperCase())
}

function generateOAuthSignature(
  method: string,
  url: string,
  params: Record<string, string>,
  consumerSecret: string,
  tokenSecret: string,
): string {
  const sortedKeys = Object.keys(params).sort()
  const paramString = sortedKeys.map(k => `${percentEncode(k)}=${percentEncode(params[k])}`).join('&')
  const baseString = `${method.toUpperCase()}&${percentEncode(url)}&${percentEncode(paramString)}`
  const signingKey = `${percentEncode(consumerSecret)}&${percentEncode(tokenSecret)}`
  return crypto.createHmac('sha1', signingKey).update(baseString).digest('base64')
}

function buildOAuthHeader(
  method: string,
  url: string,
  apiKey: string,
  apiSecret: string,
  accessToken: string,
  accessSecret: string,
): string {
  const oauthParams: Record<string, string> = {
    oauth_consumer_key: apiKey,
    oauth_nonce: crypto.randomBytes(16).toString('hex'),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_token: accessToken,
    oauth_version: '1.0',
  }

  const signature = generateOAuthSignature(method, url, oauthParams, apiSecret, accessSecret)
  oauthParams.oauth_signature = signature

  const headerParts = Object.keys(oauthParams)
    .sort()
    .map(k => `${percentEncode(k)}="${percentEncode(oauthParams[k])}"`)
    .join(', ')

  return `OAuth ${headerParts}`
}

async function postTweet(
  apiKey: string,
  apiSecret: string,
  accessToken: string,
  accessSecret: string,
  text: string,
): Promise<{ id: string }> {
  const url = `${X_API_BASE}/tweets`
  const authHeader = buildOAuthHeader('POST', url, apiKey, apiSecret, accessToken, accessSecret)

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': authHeader,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  })

  const data = await res.json()
  if (!res.ok || data.errors) {
    throw new Error(`X API error: ${JSON.stringify(data)}`)
  }

  return { id: data.data.id }
}

async function main() {
  const { dryRun, limit, brandKeys } = parseArgs()
  const { prisma, pool } = await createPrisma()

  try {
    const posted = loadPosted(POSTED_FILE)
    const postedIds = new Set(posted.map(p => `${p.brand}:${p.articleId}`))

    for (const brand of brandKeys) {
      const config = brandSocialConfig[brand]
      const env = getXEnv(brand)

      console.log(`\n${'='.repeat(60)}`)
      console.log(`  X/TWITTER — ${config.name}`)
      console.log(`${'='.repeat(60)}`)

      if (!env.apiKey || !env.apiSecret || !env.accessToken || !env.accessSecret) {
        console.log(`  ⚠ Skipping — missing X_${brand.toUpperCase()}_* env vars`)
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
        const text = buildXPost(title, article.socialSummary, link, config.hashtags)

        console.log(`\n  --- ${article.slug} ---`)
        console.log(`    Text (${text.length}/280 chars):`)
        console.log(`    ${text.replace(/\n/g, '\n    ')}`)

        if (dryRun) {
          console.log('    [DRY RUN — skipping]')
        } else {
          try {
            const result = await postTweet(env.apiKey, env.apiSecret, env.accessToken, env.accessSecret, text)
            console.log(`    ✓ Posted! Tweet ID: ${result.id}`)

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
