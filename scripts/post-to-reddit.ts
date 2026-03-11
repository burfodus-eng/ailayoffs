/**
 * Post published BrandArticle records to Reddit (multi-brand).
 *
 * Usage:
 *   npx tsx scripts/post-to-reddit.ts                          # dry-run, ailayoffs only
 *   npx tsx scripts/post-to-reddit.ts --post --brand all       # post all brands
 *   npx tsx scripts/post-to-reddit.ts --post --brand aicuts --limit 3
 *
 * Env vars per brand:
 *   REDDIT_AILAYOFFS_CLIENT_ID, REDDIT_AILAYOFFS_CLIENT_SECRET
 *   REDDIT_AILAYOFFS_USERNAME, REDDIT_AILAYOFFS_PASSWORD
 *   (same pattern for other brands)
 *
 * Reddit API setup:
 *   1. Create a Reddit account for each brand (or use one account)
 *   2. Go to https://www.reddit.com/prefs/apps
 *   3. Create a "script" type app
 *   4. Note the client ID (under app name) and secret
 *
 * Posts are submitted as link posts to the brand's subreddit.
 * You can also post to other subreddits by setting --subreddit flag.
 */

import path from 'path'
import {
  parseArgs,
  createPrisma,
  loadPosted,
  savePosted,
  getRedditEnv,
  brandSocialConfig,
  articleUrl,
  buildRedditTitle,
  type BrandKey,
} from './lib/social-config'

const POSTED_FILE = path.join(__dirname, '.reddit-posted.json')
const USER_AGENT = 'AILayoffsBot/1.0'

interface RedditAuth {
  accessToken: string
}

async function authenticateReddit(clientId: string, clientSecret: string, username: string, password: string): Promise<RedditAuth> {
  const res = await fetch('https://www.reddit.com/api/v1/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
      'User-Agent': USER_AGENT,
    },
    body: new URLSearchParams({
      grant_type: 'password',
      username,
      password,
    }),
  })

  const data = await res.json()
  if (data.error) {
    throw new Error(`Reddit auth failed: ${JSON.stringify(data)}`)
  }
  return { accessToken: data.access_token }
}

async function submitLinkPost(
  auth: RedditAuth,
  subreddit: string,
  title: string,
  url: string,
): Promise<{ id: string; url: string }> {
  const res = await fetch('https://oauth.reddit.com/api/submit', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${auth.accessToken}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': USER_AGENT,
    },
    body: new URLSearchParams({
      sr: subreddit,
      kind: 'link',
      title,
      url,
      resubmit: 'true',
    }),
  })

  const data = await res.json()
  if (!data.json?.data) {
    throw new Error(`Reddit submit failed: ${JSON.stringify(data)}`)
  }

  return {
    id: data.json.data.id || data.json.data.name,
    url: data.json.data.url || `https://reddit.com${data.json.data.permalink || ''}`,
  }
}

async function addComment(
  auth: RedditAuth,
  thingId: string,
  text: string,
): Promise<void> {
  const res = await fetch('https://oauth.reddit.com/api/comment', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${auth.accessToken}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': USER_AGENT,
    },
    body: new URLSearchParams({
      thing_id: thingId,
      text,
    }),
  })

  const data = await res.json()
  if (data.json?.errors?.length) {
    console.error(`    Warning: comment failed: ${JSON.stringify(data.json.errors)}`)
  }
}

async function main() {
  const { dryRun, limit, brandKeys } = parseArgs()
  const args = process.argv.slice(2)
  const subredditFlag = args.indexOf('--subreddit')
  const overrideSubreddit = subredditFlag !== -1 ? args[subredditFlag + 1] : undefined

  const { prisma, pool } = await createPrisma()

  try {
    const posted = loadPosted(POSTED_FILE)
    const postedIds = new Set(posted.map(p => `${p.brand}:${p.articleId}`))

    for (const brand of brandKeys) {
      const config = brandSocialConfig[brand]
      const env = getRedditEnv(brand)
      const subreddit = overrideSubreddit || config.subreddit || brand

      console.log(`\n${'='.repeat(60)}`)
      console.log(`  REDDIT — ${config.name} → r/${subreddit}`)
      console.log(`${'='.repeat(60)}`)

      if (!env.clientId || !env.clientSecret || !env.username || !env.password) {
        console.log(`  ⚠ Skipping — missing REDDIT_${brand.toUpperCase()}_* env vars`)
        continue
      }

      // Authenticate
      let auth: RedditAuth
      try {
        auth = await authenticateReddit(env.clientId, env.clientSecret, env.username, env.password)
        console.log('  ✓ Authenticated with Reddit')
      } catch (err: any) {
        console.error(`  ✗ Auth failed: ${err.message}`)
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
        const title = buildRedditTitle(article.socialTitle || article.title)
        const link = articleUrl(brand, article.slug)

        // Build a summary comment for context
        const summaryComment = article.socialSummary || article.summary || null

        console.log(`\n  --- ${article.slug} ---`)
        console.log(`    Title:     ${title}`)
        console.log(`    Link:      ${link}`)
        console.log(`    Subreddit: r/${subreddit}`)

        if (dryRun) {
          console.log('    [DRY RUN — skipping]')
        } else {
          try {
            const result = await submitLinkPost(auth, subreddit, title, link)
            console.log(`    ✓ Posted! Reddit ID: ${result.id}`)
            console.log(`    ✓ URL: ${result.url}`)

            // Add a summary comment if we have one
            if (summaryComment && result.id) {
              const fullName = result.id.startsWith('t3_') ? result.id : `t3_${result.id}`
              await addComment(auth, fullName, summaryComment)
              console.log('    ✓ Added summary comment')
            }

            posted.push({
              articleId: article.id,
              platformPostId: result.id,
              postedAt: new Date().toISOString(),
              title,
              brand,
            })
            savePosted(POSTED_FILE, posted)

            // Reddit rate limit: wait 2s between posts
            await new Promise(r => setTimeout(r, 2000))
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
