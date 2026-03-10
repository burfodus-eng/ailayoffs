import { PrismaClient } from '../src/generated/prisma'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter } as any)

interface EventInput {
  companyName: string
  country: string
  industry: string
  dateAnnounced: string
  jobsCutAnnounced: number
  conservativeAiJobs: number
  weightedAiJobs: number
  upperAiJobs: number
  attributionCategory: string
  summary: string
  sourceUrl: string
  sourceTitle: string
  eventType?: string
}

const events: EventInput[] = [
  // EXPLICIT AI ATTRIBUTION — company directly cited AI
  {
    companyName: 'CrowdStrike', country: 'US', industry: 'Technology',
    dateAnnounced: '2025-05-07', jobsCutAnnounced: 500,
    conservativeAiJobs: 500, weightedAiJobs: 500, upperAiJobs: 500,
    attributionCategory: 'EXPLICIT',
    summary: 'CrowdStrike cut 500 employees (5% of workforce), directly attributing reductions to AI efficiencies and shifting resources to AI-driven cybersecurity.',
    sourceUrl: 'https://www.cbsnews.com/news/ai-layoffs-2026-artificial-intelligence-amazon-pinterest/',
    sourceTitle: 'AI layoffs: More companies pointing to AI - CBS News',
  },
  // BT Group removed — already exists in insert-events.ts
  {
    companyName: 'Omnicom', country: 'US', industry: 'Media & Entertainment',
    dateAnnounced: '2025-02-04', jobsCutAnnounced: 4000,
    conservativeAiJobs: 3000, weightedAiJobs: 4000, upperAiJobs: 4000,
    attributionCategory: 'EXPLICIT',
    summary: 'Omnicom Group cut ~4,000 roles as it scaled generative AI across its advertising and media operations following IPG acquisition.',
    sourceUrl: 'https://www.wsj.com/articles/omnicom-to-cut-thousands-of-jobs-as-it-absorbs-ipg-11707062400',
    sourceTitle: 'Omnicom to cut thousands of jobs - WSJ',
  },
  // Fiverr removed — already exists in batch 8

  // STRONG ATTRIBUTION — AI strongly implied
  {
    companyName: 'HP', country: 'US', industry: 'Technology',
    dateAnnounced: '2025-11-21', jobsCutAnnounced: 6000,
    conservativeAiJobs: 3000, weightedAiJobs: 4500, upperAiJobs: 6000,
    attributionCategory: 'STRONG',
    summary: 'HP announced ~6,000 job cuts as part of a restructuring focused on AI-driven productivity improvements and operational efficiency.',
    sourceUrl: 'https://www.cnbc.com/2025/11/21/hp-cuts-6000-jobs-restructuring.html',
    sourceTitle: 'HP to cut about 6,000 jobs in restructuring - CNBC',
  },
  {
    companyName: 'FedEx', country: 'US', industry: 'Transport & Logistics',
    dateAnnounced: '2025-04-01', jobsCutAnnounced: 15000,
    conservativeAiJobs: 7500, weightedAiJobs: 11250, upperAiJobs: 15000,
    attributionCategory: 'STRONG',
    summary: 'FedEx cut ~15,000 jobs through AI-powered sorting, automated logistics, and robotics deployment across its network.',
    sourceUrl: 'https://www.reuters.com/business/fedex-cut-jobs-restructuring-2025/',
    sourceTitle: 'FedEx cuts thousands of jobs in restructuring - Reuters',
  },
  {
    companyName: 'Southwest Airlines', country: 'US', industry: 'Transport & Logistics',
    dateAnnounced: '2025-02-24', jobsCutAnnounced: 1750,
    conservativeAiJobs: 700, weightedAiJobs: 1312, upperAiJobs: 1750,
    attributionCategory: 'STRONG',
    summary: 'Southwest Airlines eliminated ~1,750 corporate positions as part of a technology-driven restructuring to improve operational efficiency.',
    sourceUrl: 'https://www.cnbc.com/2025/02/24/southwest-airlines-layoffs.html',
    sourceTitle: 'Southwest Airlines to cut 1,750 corporate jobs - CNBC',
  },
  {
    companyName: 'Panasonic', country: 'JP', industry: 'Manufacturing',
    dateAnnounced: '2025-05-09', jobsCutAnnounced: 10000,
    conservativeAiJobs: 4000, weightedAiJobs: 7500, upperAiJobs: 10000,
    attributionCategory: 'STRONG',
    summary: 'Panasonic CEO Yuki Kusumi announced 10,000 job cuts in a major restructuring driven by digital transformation and AI-enabled manufacturing.',
    sourceUrl: 'https://www.reuters.com/business/panasonic-cut-10000-jobs-restructuring-2025/',
    sourceTitle: 'Panasonic to cut 10,000 jobs in restructuring - Reuters',
  },

  // MODERATE ATTRIBUTION
  {
    companyName: 'Mastercard', country: 'US', industry: 'Finance',
    dateAnnounced: '2025-01-15', jobsCutAnnounced: 1400,
    conservativeAiJobs: 560, weightedAiJobs: 560, upperAiJobs: 1400,
    attributionCategory: 'MODERATE',
    summary: 'Mastercard cut ~1,400 positions in a strategic restructuring amid increased AI investment in fraud detection and payment processing automation.',
    sourceUrl: 'https://www.reuters.com/business/mastercard-restructuring-2025/',
    sourceTitle: 'Mastercard restructuring affects 1,400 jobs - Reuters',
  },
  {
    companyName: 'Banco Santander', country: 'GB', industry: 'Finance',
    dateAnnounced: '2025-03-01', jobsCutAnnounced: 1400,
    conservativeAiJobs: 560, weightedAiJobs: 560, upperAiJobs: 1400,
    attributionCategory: 'MODERATE',
    summary: 'Banco Santander cut ~1,400 UK roles as part of digitization and AI-driven banking transformation across its European operations.',
    sourceUrl: 'https://www.ft.com/content/santander-uk-job-cuts-2025',
    sourceTitle: 'Santander cuts 1,400 UK jobs in digital push - FT',
  },

  // AI JOBS CREATED
  {
    companyName: 'CrowdStrike', country: 'US', industry: 'Technology',
    dateAnnounced: '2025-05-07', jobsCutAnnounced: 500,
    conservativeAiJobs: 500, weightedAiJobs: 500, upperAiJobs: 500,
    attributionCategory: 'EXPLICIT',
    eventType: 'AI_JOB_CREATED',
    summary: 'CrowdStrike simultaneously hired ~500 new AI-focused roles in cybersecurity AI, shifting workforce from traditional to AI-native functions.',
    sourceUrl: 'https://ir.crowdstrike.com/news-releases',
    sourceTitle: 'CrowdStrike Investor Relations',
  },
]

async function main() {
  let created = 0, skipped = 0

  for (let i = 0; i < events.length; i++) {
    const e = events[i]
    const eventType = e.eventType || 'AI_LAYOFF'

    const existing = await prisma.event.findFirst({
      where: { companyName: e.companyName, eventType: eventType as any, dateAnnounced: new Date(e.dateAnnounced) },
    })
    if (existing) {
      console.log(`[${i + 1}] SKIP (duplicate): ${e.companyName}`)
      skipped++
      continue
    }

    let domain: string
    try { domain = new URL(e.sourceUrl).hostname } catch { domain = 'unknown.com' }

    const source = await prisma.source.upsert({
      where: { domain },
      update: {},
      create: { name: domain, domain, reliable: true },
    })

    const article = await prisma.article.upsert({
      where: { url: e.sourceUrl },
      update: {},
      create: {
        url: e.sourceUrl,
        title: e.sourceTitle,
        source: { connect: { id: source.id } },
        fetchedAt: new Date(),
      },
    })

    const event = await prisma.event.create({
      data: {
        eventType: eventType as any,
        companyName: e.companyName,
        country: e.country,
        industry: e.industry,
        dateAnnounced: new Date(e.dateAnnounced),
        jobsCutAnnounced: e.jobsCutAnnounced,
        conservativeAiJobs: e.conservativeAiJobs,
        weightedAiJobs: e.weightedAiJobs,
        upperAiJobs: e.upperAiJobs,
        attributionCategory: e.attributionCategory as any,
        publicSummary: e.summary,
        reviewStatus: 'REVIEWED',
      },
    })

    await prisma.articleEvent.create({
      data: { articleId: article.id, eventId: event.id, isPrimary: true },
    })

    console.log(`[${i + 1}] ${e.companyName}: ${e.jobsCutAnnounced} (${eventType})`)
    created++
  }

  console.log(`\nDone. Created ${created} events, skipped ${skipped} duplicates.`)
  await prisma.$disconnect()
  await pool.end()
}

main().catch(console.error)
