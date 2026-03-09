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
  jobsCreated: number
  summary: string
  sourceUrl: string
  sourceTitle: string
}

const events: EventInput[] = [
  // AI CODING
  { companyName: 'Anysphere (Cursor)', country: 'US', industry: 'AI Developer Tools', dateAnnounced: '2025-03-01', jobsCreated: 60, summary: 'Cursor AI coding assistant maker grew to ~60 employees by March 2025.', sourceUrl: 'https://en.wikipedia.org/wiki/Anysphere', sourceTitle: 'Anysphere - Wikipedia' },
  { companyName: 'Anysphere (Cursor)', country: 'US', industry: 'AI Developer Tools', dateAnnounced: '2025-12-01', jobsCreated: 240, summary: 'Cursor grew from ~60 to ~300 employees in 2025, adding ~240 roles as AI coding adoption surged.', sourceUrl: 'https://getlatka.com/companies/cursor.com', sourceTitle: 'Cursor company profile - GetLatka' },
  { companyName: 'Replit', country: 'US', industry: 'AI Developer Tools', dateAnnounced: '2025-06-01', jobsCreated: 200, summary: 'Replit recovered from 2024 layoffs, growing from ~70 to ~335 employees. AI Agent product drove hiring surge.', sourceUrl: 'https://tracxn.com/d/companies/replit', sourceTitle: 'Replit company profile - Tracxn' },
  { companyName: 'Poolside AI', country: 'US', industry: 'AI Coding', dateAnnounced: '2024-10-02', jobsCreated: 256, summary: 'AI coding startup grew to ~256 employees after raising $500M from eBay, Nvidia, and others.', sourceUrl: 'https://techcrunch.com/2024/10/02/ai-coding-startup-poolside-raises-500m-from-ebay-nvidia-and-others/', sourceTitle: 'Poolside raises $500M - TechCrunch' },

  // AI ENTERPRISE
  { companyName: 'Glean', country: 'US', industry: 'Enterprise AI', dateAnnounced: '2025-06-01', jobsCreated: 152, summary: 'Enterprise AI search company grew from ~1,323 to ~1,475 employees.', sourceUrl: 'https://sacra.com/c/glean/', sourceTitle: 'Glean company profile - Sacra' },
  { companyName: 'Harvey AI', country: 'US', industry: 'Legal AI', dateAnnounced: '2025-06-23', jobsCreated: 700, summary: 'Legal AI company grew from ~340 to planned ~1,043 employees after $300M Series C at $5B valuation.', sourceUrl: 'https://fortune.com/2025/06/23/harvey-raises-300-million-at-5-billion-valuation/', sourceTitle: 'Harvey raises $300M at $5B valuation - Fortune' },
  { companyName: 'Writer', country: 'US', industry: 'Enterprise AI', dateAnnounced: '2025-01-01', jobsCreated: 400, summary: 'Enterprise AI platform grew significantly, reaching $84M revenue in 2024. Estimated ~400 employees.', sourceUrl: 'https://venturebeat.com/ai/writer-triples-revenue-and-expands-to-250-customers/', sourceTitle: 'Writer triples revenue - VentureBeat' },
  { companyName: 'Copy.ai', country: 'US', industry: 'AI Content/Marketing', dateAnnounced: '2025-01-01', jobsCreated: 206, summary: 'AI content platform grew to ~206 employees. Acquired by Fullcast in Oct 2025.', sourceUrl: 'https://leadiq.com/c/copyai/5a1dd39d2300005300dd6214', sourceTitle: 'Copy.ai company profile - LeadIQ' },

  // AI VIDEO/MEDIA
  { companyName: 'Synthesia', country: 'GB', industry: 'AI Video Generation', dateAnnounced: '2025-06-01', jobsCreated: 460, summary: 'AI video generation company grew from ~198 (2023) to ~661 employees (2026), adding ~460 roles.', sourceUrl: 'https://sifted.eu/articles/synthesia-ai-strategy-chatgpt', sourceTitle: 'Synthesia AI growth - Sifted' },
  { companyName: 'Luma AI', country: 'US', industry: 'AI Video/3D', dateAnnounced: '2025-01-01', jobsCreated: 224, summary: 'AI video and 3D generation company grew to ~224 employees.', sourceUrl: 'https://tracxn.com/d/companies/lumaai', sourceTitle: 'Luma AI company profile - Tracxn' },
  { companyName: 'Pika', country: 'US', industry: 'AI Video Generation', dateAnnounced: '2024-06-01', jobsCreated: 48, summary: 'AI video generation startup grew to ~48 employees.', sourceUrl: 'https://tracxn.com/d/companies/pikalabs', sourceTitle: 'Pika company profile - Tracxn' },

  // AI CHIPS
  { companyName: 'Cerebras Systems', country: 'US', industry: 'AI Chips/Hardware', dateAnnounced: '2025-01-01', jobsCreated: 784, summary: 'AI chip maker grew to ~784 employees. Filed for IPO in 2024.', sourceUrl: 'https://pitchbook.com/profiles/company/163733-59', sourceTitle: 'Cerebras Systems - PitchBook' },
  { companyName: 'Groq', country: 'US', industry: 'AI Chips/Inference', dateAnnounced: '2025-12-01', jobsCreated: 644, summary: 'AI inference chip company grew to ~644 employees. Revenue $172.5M in 2025. Nvidia acquisition deal announced.', sourceUrl: 'https://www.cnbc.com/2025/12/24/nvidia-buying-ai-chip-startup-groq-for-about-20-billion-biggest-deal.html', sourceTitle: 'Nvidia buying Groq for $20B - CNBC' },
  { companyName: 'SambaNova Systems', country: 'US', industry: 'AI Infrastructure', dateAnnounced: '2025-01-01', jobsCreated: 403, summary: 'AI infrastructure company at ~403 employees. Pivoted from training to inference in 2025.', sourceUrl: 'https://tracxn.com/d/companies/sambanovasystems', sourceTitle: 'SambaNova Systems - Tracxn' },

  // DEFENSE AI
  { companyName: 'Anduril Industries', country: 'US', industry: 'Defense AI', dateAnnounced: '2024-09-06', jobsCreated: 2400, summary: 'Defense AI company grew from ~2,400 to ~7,000 employees (2023-2025). Hired 1,000+ in 9 months in 2024.', sourceUrl: 'https://fortune.com/2024/09/06/defense-tech-startup-anduril-hiring-manufacturing/', sourceTitle: 'Anduril hiring surge - Fortune' },
  { companyName: 'Anduril Industries', country: 'US', industry: 'Defense AI', dateAnnounced: '2025-06-01', jobsCreated: 2600, summary: 'Continued explosive growth to ~7,000 employees, adding ~2,600 more roles in 2025.', sourceUrl: 'https://tracxn.com/d/companies/anduril', sourceTitle: 'Anduril company profile - Tracxn' },
  { companyName: 'Shield AI', country: 'US', industry: 'Defense AI', dateAnnounced: '2025-06-01', jobsCreated: 1029, summary: 'Defense AI company grew from ~290 to ~1,319 employees. Revenue ~$267M, growing 64% YoY.', sourceUrl: 'https://sacra.com/research/shield-ai-at-267m-yr-growing-64-yoy/', sourceTitle: 'Shield AI research - Sacra' },

  // AUTONOMOUS VEHICLES
  { companyName: 'Waymo', country: 'US', industry: 'Autonomous Vehicles', dateAnnounced: '2025-06-01', jobsCreated: 1700, summary: 'Waymo grew from ~800 (2023) to ~2,500 employees (2025). Valuation $126B after $16B round.', sourceUrl: 'https://www.thedriverlessdigest.com/p/waymo-stats-2025-funding-growth-coverage', sourceTitle: 'Waymo stats 2025 - Driverless Digest' },
  { companyName: 'Aurora Innovation', country: 'US', industry: 'Autonomous Vehicles', dateAnnounced: '2024-12-01', jobsCreated: 1800, summary: 'Autonomous trucking company at ~1,800 employees. Launched commercial self-driving truck service.', sourceUrl: 'https://stockanalysis.com/stocks/aur/employees/', sourceTitle: 'Aurora Innovation employees - StockAnalysis' },

  // ROBOTICS
  { companyName: 'Figure AI', country: 'US', industry: 'Humanoid Robotics', dateAnnounced: '2025-09-01', jobsCreated: 260, summary: 'Humanoid robotics company grew from ~163 to ~422 employees. Valuation $39B. Building BotQ factory for 12,000 humanoids/year.', sourceUrl: 'https://getlatka.com/companies/figure-ai', sourceTitle: 'Figure AI - GetLatka' },
  { companyName: 'Boston Dynamics', country: 'US', industry: 'Robotics', dateAnnounced: '2025-01-01', jobsCreated: 1200, summary: 'Hyundai-owned robotics company at ~1,200 employees. Developing Spot, Atlas, and Stretch robots.', sourceUrl: 'https://tracxn.com/d/companies/boston-dynamics', sourceTitle: 'Boston Dynamics - Tracxn' },

  // HEALTHCARE AI
  { companyName: 'Abridge AI', country: 'US', industry: 'Healthcare AI', dateAnnounced: '2025-06-01', jobsCreated: 514, summary: 'Clinical documentation AI company grew to ~514 employees. $117M ARR, $5.3B valuation. Raised ~$800M total.', sourceUrl: 'https://pitchbook.com/profiles/company/268134-40', sourceTitle: 'Abridge AI - PitchBook' },

  // NEW AI STARTUPS
  { companyName: 'DeepSeek', country: 'CN', industry: 'AI Research', dateAnnounced: '2025-01-01', jobsCreated: 180, summary: 'Chinese AI research lab grew to ~160-200 employees. Known for efficient LLM training techniques.', sourceUrl: 'https://en.wikipedia.org/wiki/DeepSeek', sourceTitle: 'DeepSeek - Wikipedia' },
  { companyName: 'Sakana AI', country: 'JP', industry: 'AI Research', dateAnnounced: '2025-06-01', jobsCreated: 135, summary: 'Japanese AI research company founded 2023, grew from 3 to ~138 employees. Founded by ex-Google Brain researchers.', sourceUrl: 'https://en.wikipedia.org/wiki/Sakana_AI', sourceTitle: 'Sakana AI - Wikipedia' },

  // BIG TECH AI EXPANSION
  { companyName: 'NVIDIA', country: 'US', industry: 'AI Chips/GPUs', dateAnnounced: '2025-01-01', jobsCreated: 6400, summary: 'NVIDIA grew from ~29,600 to ~36,000 employees (21.6% growth) as AI GPU demand exploded.', sourceUrl: 'https://www.macrotrends.net/stocks/charts/NVDA/nvidia/number-of-employees', sourceTitle: 'NVIDIA employee count - MacroTrends' },
]

async function main() {
  let created = 0, skipped = 0

  for (let i = 0; i < events.length; i++) {
    const e = events[i]

    const existing = await prisma.event.findFirst({
      where: { companyName: e.companyName, eventType: 'AI_JOB_CREATED', dateAnnounced: new Date(e.dateAnnounced) },
    })
    if (existing) {
      console.log(`[${i + 1}] SKIP (duplicate): ${e.companyName}`)
      skipped++
      continue
    }

    const domain = new URL(e.sourceUrl).hostname
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
        eventType: 'AI_JOB_CREATED',
        companyName: e.companyName,
        country: e.country,
        industry: e.industry,
        dateAnnounced: new Date(e.dateAnnounced),
        jobsCutAnnounced: e.jobsCreated,
        conservativeAiJobs: e.jobsCreated,
        weightedAiJobs: e.jobsCreated,
        upperAiJobs: e.jobsCreated,
        attributionCategory: 'EXPLICIT',
        publicSummary: e.summary,
        reviewStatus: 'REVIEWED',
      },
    })

    await prisma.articleEvent.create({
      data: { articleId: article.id, eventId: event.id, isPrimary: true },
    })

    console.log(`[${i + 1}] ${e.companyName}: ${e.jobsCreated} jobs created`)
    created++
  }

  console.log(`\nDone. Created ${created} events, skipped ${skipped} duplicates.`)
  await prisma.$disconnect()
  await pool.end()
}

main().catch(console.error)
