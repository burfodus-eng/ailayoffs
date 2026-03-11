/**
 * Shared social media configuration for all brands and platforms.
 */

import 'dotenv/config'
import { type BrandKey, brands } from '../../src/lib/domains'

export type { BrandKey }

// ── Brand → Social Config ──

export interface BrandSocialConfig {
  brand: BrandKey
  name: string
  domain: string
  hashtags: string[]
  subreddit?: string  // target subreddit for this brand
}

export const brandSocialConfig: Record<BrandKey, BrandSocialConfig> = {
  ailayoffs: {
    brand: 'ailayoffs',
    name: brands.ailayoffs.name,
    domain: brands.ailayoffs.domain,
    hashtags: ['#AILayoffs', '#AI', '#ArtificialIntelligence', '#FutureOfWork', '#TechLayoffs', '#Automation'],
    subreddit: 'ailayoffs',
  },
  aicuts: {
    brand: 'aicuts',
    name: brands.aicuts.name,
    domain: brands.aicuts.domain,
    hashtags: ['#AICuts', '#AI', '#TechCuts', '#WorkforceReduction', '#FutureOfWork', '#Automation'],
    subreddit: 'aicuts',
  },
  ailayoffwatch: {
    brand: 'ailayoffwatch',
    name: brands.ailayoffwatch.name,
    domain: brands.ailayoffwatch.domain,
    hashtags: ['#AILayoffWatch', '#AI', '#AIResearch', '#WorkforceAnalysis', '#FutureOfWork'],
    subreddit: 'ailayoffwatch',
  },
  robotlayoffs: {
    brand: 'robotlayoffs',
    name: brands.robotlayoffs.name,
    domain: brands.robotlayoffs.domain,
    hashtags: ['#RobotLayoffs', '#Automation', '#Robotics', '#FutureOfWork', '#AI'],
    subreddit: 'robotlayoffs',
  },
}

// ── Platform env var naming ──
// Each brand has its own set of credentials per platform.
// Env var pattern: {PLATFORM}_{BRAND}_*
//
// Facebook:
//   FB_AILAYOFFS_PAGE_TOKEN, FB_AILAYOFFS_PAGE_ID
//   FB_AICUTS_PAGE_TOKEN, FB_AICUTS_PAGE_ID
//   FB_AILAYOFFWATCH_PAGE_TOKEN, FB_AILAYOFFWATCH_PAGE_ID
//   FB_ROBOTLAYOFFS_PAGE_TOKEN, FB_ROBOTLAYOFFS_PAGE_ID
//
// Reddit:
//   REDDIT_AILAYOFFS_CLIENT_ID, REDDIT_AILAYOFFS_CLIENT_SECRET, REDDIT_AILAYOFFS_USERNAME, REDDIT_AILAYOFFS_PASSWORD
//   (same pattern for other brands)
//
// X (Twitter):
//   X_AILAYOFFS_API_KEY, X_AILAYOFFS_API_SECRET, X_AILAYOFFS_ACCESS_TOKEN, X_AILAYOFFS_ACCESS_SECRET
//   (same pattern for other brands)
//
// Threads:
//   THREADS_AILAYOFFS_USER_TOKEN, THREADS_AILAYOFFS_USER_ID
//   (same pattern for other brands)

export function getFacebookEnv(brand: BrandKey) {
  const key = brand.toUpperCase()
  return {
    pageToken: process.env[`FB_${key}_PAGE_TOKEN`] || (brand === 'ailayoffs' ? process.env.FB_PAGE_TOKEN : undefined),
    pageId: process.env[`FB_${key}_PAGE_ID`] || (brand === 'ailayoffs' ? process.env.FB_PAGE_ID : undefined),
  }
}

export function getRedditEnv(brand: BrandKey) {
  const key = brand.toUpperCase()
  return {
    clientId: process.env[`REDDIT_${key}_CLIENT_ID`],
    clientSecret: process.env[`REDDIT_${key}_CLIENT_SECRET`],
    username: process.env[`REDDIT_${key}_USERNAME`],
    password: process.env[`REDDIT_${key}_PASSWORD`],
  }
}

export function getXEnv(brand: BrandKey) {
  const key = brand.toUpperCase()
  return {
    apiKey: process.env[`X_${key}_API_KEY`],
    apiSecret: process.env[`X_${key}_API_SECRET`],
    accessToken: process.env[`X_${key}_ACCESS_TOKEN`],
    accessSecret: process.env[`X_${key}_ACCESS_SECRET`],
  }
}

export function getThreadsEnv(brand: BrandKey) {
  const key = brand.toUpperCase()
  return {
    userToken: process.env[`THREADS_${key}_USER_TOKEN`] || (brand === 'ailayoffs' ? process.env.THREADS_USER_TOKEN : undefined),
    userId: process.env[`THREADS_${key}_USER_ID`] || (brand === 'ailayoffs' ? process.env.THREADS_USER_ID : undefined),
  }
}

// ── Article URL builder ──

export function articleUrl(brand: BrandKey, slug: string): string {
  return `https://${brandSocialConfig[brand].domain}/digest/${slug}`
}

// ── Message builders ──

export function buildFacebookMessage(
  title: string,
  summary: string | null,
  body: string | null,
  hashtags: string[],
): string {
  const parts: string[] = []
  parts.push(`📊 ${title}`)
  parts.push('')

  if (summary) {
    parts.push(summary)
    parts.push('')
  }

  if (body) {
    const paragraphs = body
      .split('\n')
      .filter(l => l.trim() && !l.startsWith('#') && !l.startsWith('---') && !l.startsWith('!['))
      .map(l => l.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1').trim())
      .filter(l => l.length > 40)
      .slice(0, 3)

    if (paragraphs.length > 0) {
      parts.push('Key findings:')
      for (const p of paragraphs) {
        parts.push(`▸ ${p.substring(0, 150)}${p.length > 150 ? '...' : ''}`)
      }
      parts.push('')
    }
  }

  parts.push(hashtags.join(' '))
  return parts.join('\n')
}

export function buildXPost(title: string, summary: string | null, link: string, hashtags: string[]): string {
  // X has 280 char limit
  const tags = hashtags.slice(0, 3).join(' ')
  let text = `📊 ${title}\n\n`

  if (summary) {
    const maxSummary = 280 - text.length - link.length - tags.length - 6
    if (maxSummary > 30) {
      const trimmed = summary.length > maxSummary ? summary.substring(0, maxSummary - 3) + '...' : summary
      text += trimmed + '\n\n'
    }
  }

  text += `${link}\n\n${tags}`

  if (text.length > 280) {
    text = `📊 ${title}\n\n${link}\n\n${tags}`
  }
  if (text.length > 280) {
    text = `${title}\n\n${link}`
  }

  return text.substring(0, 280)
}

export function buildRedditTitle(title: string): string {
  // Reddit titles max 300 chars
  return title.substring(0, 300)
}

export function buildThreadsText(title: string, summary: string | null, link: string): string {
  let text = title
  if (summary) {
    const maxLen = 500 - title.length - link.length - 6
    const trimmed = summary.length > maxLen ? summary.substring(0, maxLen - 3) + '...' : summary
    text += `\n\n${trimmed}`
  }
  text += `\n\n${link}`
  if (text.length > 500) text = text.substring(0, 497) + '...'
  return text
}

// ── Tracking file helpers ──

export interface PostedRecord {
  articleId: string
  platformPostId: string
  postedAt: string
  title: string
  brand: BrandKey
}

export function loadPosted(filePath: string): PostedRecord[] {
  const fs = require('fs')
  if (!fs.existsSync(filePath)) return []
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
}

export function savePosted(filePath: string, records: PostedRecord[]) {
  const fs = require('fs')
  fs.writeFileSync(filePath, JSON.stringify(records, null, 2))
}

// ── DB helper ──

export async function createPrisma() {
  const { PrismaClient } = await import('../../src/generated/prisma')
  const { PrismaPg } = await import('@prisma/adapter-pg')
  const pg = await import('pg')
  const Pool = (pg as any).default?.Pool || pg.Pool
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  const adapter = new PrismaPg(pool)
  const prisma = new PrismaClient({ adapter } as any)
  return { prisma, pool }
}

// ── CLI helpers ──

export function parseArgs() {
  const args = process.argv.slice(2)
  const dryRun = !args.includes('--post')
  const limitFlag = args.indexOf('--limit')
  const limit = limitFlag !== -1 ? parseInt(args[limitFlag + 1]) : undefined

  // --brand ailayoffs,aicuts or --brand all
  const brandFlag = args.indexOf('--brand')
  let brandKeys: BrandKey[]
  if (brandFlag !== -1) {
    const val = args[brandFlag + 1]
    if (val === 'all') {
      brandKeys = ['ailayoffs', 'aicuts', 'ailayoffwatch', 'robotlayoffs']
    } else {
      brandKeys = val.split(',') as BrandKey[]
    }
  } else {
    brandKeys = ['ailayoffs'] // default for backwards compat
  }

  return { dryRun, limit, brandKeys }
}
