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
  category: 'EXPLICIT' | 'STRONG' | 'MODERATE' | 'WEAK'
  eventType: 'AI_LAYOFF' | 'ROBOT_LAYOFF'
  summary: string
  sourceUrl: string
  sourceTitle: string
}

const weights: Record<string, number> = { EXPLICIT: 1.0, STRONG: 0.75, MODERATE: 0.4, WEAK: 0.15 }

const events: EventInput[] = [
  // TECH
  {
    companyName: 'Shopify',
    country: 'CA',
    industry: 'E-commerce/Tech',
    dateAnnounced: '2023-05-04',
    jobsCutAnnounced: 2300,
    category: 'EXPLICIT',
    eventType: 'AI_LAYOFF',
    summary: 'CEO Tobi Lutke cut 20% of workforce, issued memo requiring employees to prove tasks cannot be done by AI before requesting new hires. AI chatbot Sidekick replaced merchant support roles.',
    sourceUrl: 'https://www.cnbc.com/2025/04/07/shopify-ceo-prove-ai-cant-do-jobs-before-asking-for-more-headcount.html',
    sourceTitle: 'Shopify CEO: Prove AI can\'t do jobs before asking for more headcount',
  },
  {
    companyName: 'Intuit',
    country: 'US',
    industry: 'Financial Software',
    dateAnnounced: '2024-07-10',
    jobsCutAnnounced: 1800,
    category: 'EXPLICIT',
    eventType: 'AI_LAYOFF',
    summary: 'CEO cited AI transformation, shifting to AI-native experiences. 1,050 cut for not meeting expectations, remaining cuts tied to restructuring around GenAI assistant Intuit Assist.',
    sourceUrl: 'https://fortune.com/2024/07/10/intuit-layoffs-email-hiring-ai-transformation/',
    sourceTitle: 'Intuit lays off 1,800 as CEO pushes AI transformation',
  },
  {
    companyName: 'Workday',
    country: 'US',
    industry: 'Enterprise Software',
    dateAnnounced: '2025-02-07',
    jobsCutAnnounced: 1750,
    category: 'EXPLICIT',
    eventType: 'AI_LAYOFF',
    summary: 'CEO Carl Eschenbach said cuts were needed to prioritize AI investment. 8.5% of workforce. One of first major companies in 2025 to explicitly cite AI as reason for reduction.',
    sourceUrl: 'https://fortune.com/2025/02/07/workday-layoff-ai-future-of-work/',
    sourceTitle: 'Workday lays off 1,750 to prioritize AI',
  },
  {
    companyName: 'Fiverr',
    country: 'IL',
    industry: 'Freelance Marketplace',
    dateAnnounced: '2025-09-15',
    jobsCutAnnounced: 250,
    category: 'EXPLICIT',
    eventType: 'AI_LAYOFF',
    summary: 'CEO Micha Kaufman announced pivot to AI-first company. AI deployed in customer support, fraud detection, and matching. Support costs reduced significantly.',
    sourceUrl: 'https://www.engadget.com/ai/fiverr-is-laying-off-250-employees-to-become-an-ai-first-company-215730063.html',
    sourceTitle: 'Fiverr lays off 250 to become AI-first company',
  },
  {
    companyName: 'Freshworks',
    country: 'IN',
    industry: 'SaaS/Customer Service',
    dateAnnounced: '2024-11-15',
    jobsCutAnnounced: 660,
    category: 'MODERATE',
    eventType: 'AI_LAYOFF',
    summary: 'Combined CX teams and restructured around AI priorities. Freddy AI product increasingly handling customer queries autonomously. 13% of workforce.',
    sourceUrl: 'https://www.cio.com/article/3601088/freshworks-lays-off-660-about-13-percent-of-its-global-workforce-despite-strong-earnings-profits.html',
    sourceTitle: 'Freshworks lays off 660 despite strong earnings',
  },
  {
    companyName: 'eBay',
    country: 'US',
    industry: 'E-commerce',
    dateAnnounced: '2024-01-24',
    jobsCutAnnounced: 1000,
    category: 'WEAK',
    eventType: 'AI_LAYOFF',
    summary: 'Cut 9% of workforce. Company denied AI-related but simultaneously increased AI spending significantly.',
    sourceUrl: 'https://www.fastcompany.com/91499335/ebay-layoffs-today-job-cuts-after-etsy-depop-acquisition-ai-investments',
    sourceTitle: 'eBay layoffs amid AI investment shift',
  },
  {
    companyName: 'Wayfair',
    country: 'US',
    industry: 'E-commerce/Furniture',
    dateAnnounced: '2024-01-19',
    jobsCutAnnounced: 1650,
    category: 'MODERATE',
    eventType: 'AI_LAYOFF',
    summary: 'Multiple rounds of cuts totaling 13% of workforce. Launched Muse generative AI shopping tool. Closed Austin Tech Development Center. Cited operational efficiency and AI-driven productivity.',
    sourceUrl: 'https://www.retaildive.com/news/wayfair-layoffs-340-employees-technology-development-center-closure-austin/741944/',
    sourceTitle: 'Wayfair cuts workforce amid AI pivot',
  },
  {
    companyName: 'Dukaan',
    country: 'IN',
    industry: 'E-commerce Platform',
    dateAnnounced: '2023-07-12',
    jobsCutAnnounced: 23,
    category: 'EXPLICIT',
    eventType: 'AI_LAYOFF',
    summary: 'CEO Suumit Shah replaced 90% of customer support team with AI chatbot built in two days. Response time went from 1m44s to instant. Support costs reduced 85%.',
    sourceUrl: 'https://www.cnn.com/2023/07/12/business/dukaan-ceo-layoffs-ai-chatbot/index.html',
    sourceTitle: 'Dukaan CEO replaces 90% of support staff with AI chatbot',
  },
  {
    companyName: 'Paycom',
    country: 'US',
    industry: 'Payroll/HR Software',
    dateAnnounced: '2025-10-01',
    jobsCutAnnounced: 500,
    category: 'EXPLICIT',
    eventType: 'AI_LAYOFF',
    summary: 'Automated payroll and back-office functions. Staff told directly their roles had been replaced by AI-driven systems. 7% of workforce.',
    sourceUrl: 'https://www.news9.com/story/68dd487999d76e9f790c57d1/paycom-layoff-500-okc-employees',
    sourceTitle: 'Paycom lays off 500 OKC employees',
  },
  {
    companyName: 'Expedia',
    country: 'US',
    industry: 'Travel/Tech',
    dateAnnounced: '2026-01-26',
    jobsCutAnnounced: 400,
    category: 'MODERATE',
    eventType: 'AI_LAYOFF',
    summary: 'Cut ~3% of workforce in product/tech roles. Coincided with increased AI focus, including new Chief AI Officer appointment.',
    sourceUrl: 'https://skift.com/2026/01/26/expedia-job-cuts-layoffs/',
    sourceTitle: 'Expedia job cuts hit product and tech roles',
  },

  // MEDIA
  {
    companyName: 'BuzzFeed',
    country: 'US',
    industry: 'Digital Media',
    dateAnnounced: '2023-04-20',
    jobsCutAnnounced: 250,
    category: 'STRONG',
    eventType: 'AI_LAYOFF',
    summary: 'Shut down BuzzFeed News entirely, cut 15% of staff. Told investors AI would become part of core business. Used Buzzy the Robot AI to co-author articles.',
    sourceUrl: 'https://www.cnbc.com/2023/04/20/buzzfeed-will-lay-off-15percent-of-staff-shutter-its-news-unit.html',
    sourceTitle: 'BuzzFeed shuts news unit, lays off 15% as AI takes center stage',
  },
  {
    companyName: 'CNET',
    country: 'US',
    industry: 'Tech Media',
    dateAnnounced: '2023-03-15',
    jobsCutAnnounced: 30,
    category: 'STRONG',
    eventType: 'AI_LAYOFF',
    summary: 'Secretly published 77 AI-generated articles, over half contained factual errors. Laid off veteran journalists weeks after pausing AI content.',
    sourceUrl: 'https://variety.com/2023/digital/news/cnet-layoffs-artificial-intelligence-red-ventures-1235541332/',
    sourceTitle: 'CNET lays off staff after AI content scandal',
  },
  {
    companyName: 'Sports Illustrated',
    country: 'US',
    industry: 'Sports Media',
    dateAnnounced: '2023-11-27',
    jobsCutAnnounced: 50,
    category: 'STRONG',
    eventType: 'AI_LAYOFF',
    summary: 'Published articles under fake AI-generated author profiles with fabricated biographies. Mass layoffs followed AI scandal exposure, parent company Arena Group collapsed.',
    sourceUrl: 'https://www.sportico.com/business/media/2023/sports-illustrated-ai-artifical-intelligence-journalism-1234748077/',
    sourceTitle: 'Sports Illustrated AI-generated author scandal',
  },

  // FINANCIAL SERVICES
  {
    companyName: 'HSBC',
    country: 'GB',
    industry: 'Banking',
    dateAnnounced: '2025-02-14',
    jobsCutAnnounced: 8000,
    category: 'STRONG',
    eventType: 'AI_LAYOFF',
    summary: 'CEO implementing 10% global workforce reduction. 20,000+ engineers using AI coding tools with 15% productivity boost. AI streamlining credit analysis and customer service.',
    sourceUrl: 'https://www.bloomberg.com/news/articles/2025-02-14/hsbc-plans-new-round-of-investment-bank-job-cuts-next-week',
    sourceTitle: 'HSBC plans major investment bank job cuts',
  },
  {
    companyName: 'Acrisure',
    country: 'US',
    industry: 'Insurance',
    dateAnnounced: '2025-10-08',
    jobsCutAnnounced: 400,
    category: 'EXPLICIT',
    eventType: 'AI_LAYOFF',
    summary: 'Laid off entire accounting workforce segments, citing AI and technology advancements. Deploying AI platform acquired from Tulco LLC for $400M.',
    sourceUrl: 'https://www.insurancejournal.com/news/midwest/2025/10/08/843154.htm',
    sourceTitle: 'Acrisure lays off 400 citing AI advancements',
  },

  // TRANSPORT & LOGISTICS
  {
    companyName: 'United Airlines',
    country: 'US',
    industry: 'Airlines',
    dateAnnounced: '2025-10-17',
    jobsCutAnnounced: 300,
    category: 'EXPLICIT',
    eventType: 'AI_LAYOFF',
    summary: 'CFO explicitly stated during earnings call that AI eliminated 4% of management jobs. First US airline to publicly confirm AI-driven job losses. AI replaced data entry, analytics, and forecasting.',
    sourceUrl: 'https://skift.com/2025/10/17/united-airlines-says-it-eliminated-4-percent-of-management-jobs-due-to-ai/',
    sourceTitle: 'United Airlines eliminated 4% of management jobs due to AI',
  },
  {
    companyName: 'C.H. Robinson',
    country: 'US',
    industry: 'Logistics/Freight',
    dateAnnounced: '2025-10-01',
    jobsCutAnnounced: 1400,
    category: 'EXPLICIT',
    eventType: 'AI_LAYOFF',
    summary: 'Rolled out AI-driven pricing, scheduling, and shipment tracking tools. Slashed over 50% of US sales team. Workforce shrank by 2,400+ since 2023.',
    sourceUrl: 'https://www.freightwaves.com/news/c-h-robinson-slashes-over-50-of-us-sales-team-sources-say',
    sourceTitle: 'C.H. Robinson slashes over 50% of US sales team',
  },
  {
    companyName: 'American Airlines',
    country: 'US',
    industry: 'Airlines',
    dateAnnounced: '2025-11-04',
    jobsCutAnnounced: 300,
    category: 'MODERATE',
    eventType: 'AI_LAYOFF',
    summary: 'Cut 4% of HQ workforce in communications, commercial, finance, and technology. Referenced efficiency and restructuring, reinvesting savings into AI capabilities.',
    sourceUrl: 'https://skift.com/2025/11/04/american-airlines-layoffs-to-hit-corporate-jobs/',
    sourceTitle: 'American Airlines layoffs hit corporate jobs',
  },

  // MANUFACTURING
  {
    companyName: 'Dow Chemical',
    country: 'US',
    industry: 'Chemical Manufacturing',
    dateAnnounced: '2026-01-15',
    jobsCutAnnounced: 4500,
    category: 'STRONG',
    eventType: 'AI_LAYOFF',
    summary: 'Transform to Outperform strategy includes AI and automation throughout processes. Expected $2B in savings. Restructuring costs of $1.1-1.5B.',
    sourceUrl: 'https://www.manufacturingdive.com/news/dow-q4-2025-job-layoffs-ai-transform-outperform-cost-savings-program/810878/',
    sourceTitle: 'Dow announces 4,500 job cuts in AI-driven transformation',
  },
  {
    companyName: 'Siemens',
    country: 'DE',
    industry: 'Industrial Technology',
    dateAnnounced: '2025-03-20',
    jobsCutAnnounced: 6050,
    category: 'MODERATE',
    eventType: 'ROBOT_LAYOFF',
    summary: 'Factory automation division saw 46% profit decline. 5,600 cuts in factory automation, 450 in EV charging. 2,600 jobs cut in Germany. Automation/digitalization core to strategy.',
    sourceUrl: 'https://www.trendforce.com/news/2025/03/20/news-siemens-to-cut-6000-jobs-biggest-layoff-since-2017-amid-automation-ev-challenges/',
    sourceTitle: 'Siemens to cut 6,000 jobs, biggest layoff since 2017',
  },
  {
    companyName: 'Bosch',
    country: 'DE',
    industry: 'Auto Parts/Industrial',
    dateAnnounced: '2024-11-22',
    jobsCutAnnounced: 7000,
    category: 'MODERATE',
    eventType: 'ROBOT_LAYOFF',
    summary: 'Multiple rounds tied to auto industry transition. Shifting from manual manufacturing to semiconductor production and automated systems.',
    sourceUrl: 'https://www.reuters.com/business/autos-transportation/bosch-cut-5500-jobs-auto-parts-division-2024-11-22/',
    sourceTitle: 'Bosch to cut thousands of jobs in auto parts restructuring',
  },
  {
    companyName: 'Ocado',
    country: 'GB',
    industry: 'Online Grocery/Robotics',
    dateAnnounced: '2026-03-01',
    jobsCutAnnounced: 1000,
    category: 'EXPLICIT',
    eventType: 'ROBOT_LAYOFF',
    summary: 'CEO stated company has largely completed significant phase of investment in robotics and automation. Direct replacement of human roles with automated warehouse systems.',
    sourceUrl: 'https://www.reuters.com/business/retail-consumer/ocado-cut-jobs-2026/',
    sourceTitle: 'Ocado cuts 1,000 jobs as robotics phase completes',
  },

  // PROFESSIONAL SERVICES
  {
    companyName: 'PwC',
    country: 'US',
    industry: 'Accounting/Consulting',
    dateAnnounced: '2024-10-01',
    jobsCutAnnounced: 1800,
    category: 'STRONG',
    eventType: 'AI_LAYOFF',
    summary: 'Cuts primarily in audit and tax divisions. AI automation reducing need for entry-level auditors. UK accounting graduate listings down 44% YoY across Big Four.',
    sourceUrl: 'https://ncscorp.ca/blog/big-4-layoffs-kpmg-deloitte-ey-pwc/',
    sourceTitle: 'Big 4 layoffs driven by AI automation',
  },
  {
    companyName: 'KPMG',
    country: 'US',
    industry: 'Accounting/Consulting',
    dateAnnounced: '2024-11-01',
    jobsCutAnnounced: 330,
    category: 'STRONG',
    eventType: 'AI_LAYOFF',
    summary: 'Cuts in audit workforce as AI tools handle data-heavy audit tasks. Part of industry-wide shift toward automation of structured professional services work.',
    sourceUrl: 'https://ncscorp.ca/blog/big-4-layoffs-kpmg-deloitte-ey-pwc/',
    sourceTitle: 'KPMG audit staff cuts amid AI automation',
  },
  {
    companyName: 'Deloitte',
    country: 'GB',
    industry: 'Accounting/Consulting',
    dateAnnounced: '2024-09-15',
    jobsCutAnnounced: 1050,
    category: 'STRONG',
    eventType: 'AI_LAYOFF',
    summary: 'UK workforce down 2%. Cuts primarily in consulting. Shifting work to lower-cost countries while deploying AI for routine tasks.',
    sourceUrl: 'https://www.cfobrew.com/stories/2025/11/12/cost-cutting-measures-hit-big-four-staff',
    sourceTitle: 'Big Four cost-cutting hits staff as AI deployed',
  },

  // TELECOM
  {
    companyName: 'Vodafone',
    country: 'GB',
    industry: 'Telecommunications',
    dateAnnounced: '2023-05-17',
    jobsCutAnnounced: 11000,
    category: 'MODERATE',
    eventType: 'AI_LAYOFF',
    summary: '11,000 job cuts representing 10%+ of global workforce over 3 years. Restructuring included significant investment in digital and automated customer service.',
    sourceUrl: 'https://techhq.com/news/vodafone-cuts-11000-jobs-in-latest-tech-layoffs/',
    sourceTitle: 'Vodafone cuts 11,000 jobs in restructuring',
  },
  {
    companyName: 'Lumen Technologies',
    country: 'US',
    industry: 'Telecommunications',
    dateAnnounced: '2024-06-01',
    jobsCutAnnounced: 2100,
    category: 'STRONG',
    eventType: 'AI_LAYOFF',
    summary: 'AI-driven operations and network automation reduced need for manual roles. ~7% of workforce. Legacy copper telecom positions hit hardest.',
    sourceUrl: 'https://www.channelfutures.com/channel-business/lumen-layoffs-impact-almost-7-of-workforce',
    sourceTitle: 'Lumen layoffs impact nearly 7% of workforce',
  },
  {
    companyName: 'Verizon',
    country: 'US',
    industry: 'Telecommunications',
    dateAnnounced: '2024-06-15',
    jobsCutAnnounced: 4800,
    category: 'MODERATE',
    eventType: 'AI_LAYOFF',
    summary: 'Voluntary separation program for US management. Continued automation of network operations and customer service.',
    sourceUrl: 'https://www.thelayoff.com/verizon-communications',
    sourceTitle: 'Verizon voluntary separation program',
  },
  {
    companyName: 'AT&T',
    country: 'US',
    industry: 'Telecommunications',
    dateAnnounced: '2024-09-01',
    jobsCutAnnounced: 5000,
    category: 'MODERATE',
    eventType: 'AI_LAYOFF',
    summary: '8-12% annual headcount reduction strategy. Automating network and customer service operations. Steady attrition rather than single announcement.',
    sourceUrl: 'https://www.fierce-network.com/broadband/heres-where-tech-and-telecom-headcounts-stand-layoffs-climb',
    sourceTitle: 'AT&T headcount continues to decline amid automation',
  },

  // IT OUTSOURCING
  {
    companyName: 'Tata Consultancy Services',
    country: 'IN',
    industry: 'IT Services',
    dateAnnounced: '2025-07-01',
    jobsCutAnnounced: 12000,
    category: 'MODERATE',
    eventType: 'AI_LAYOFF',
    summary: 'First mass layoff in TCS history. Targeted middle and senior management. Part of strategy to become future-ready organization with AI deployment. Experts warn 500K Indian IT jobs at risk.',
    sourceUrl: 'https://www.siliconrepublic.com/business/tata-consultancy-services-tcs-layoff-2pc-12000-ai-artificial-intelligence',
    sourceTitle: 'TCS lays off 12,000 in first mass layoff',
  },

  // GAMING
  {
    companyName: 'EA (Electronic Arts)',
    country: 'US',
    industry: 'Gaming',
    dateAnnounced: '2024-02-28',
    jobsCutAnnounced: 670,
    category: 'STRONG',
    eventType: 'AI_LAYOFF',
    summary: 'Cut 5% of workforce. Mandated AI use across the company. Employees frustrated by AI mandate, suspecting it\'s justification for layoffs.',
    sourceUrl: 'https://www.pcgamer.com/gaming-industry/ea-employees-are-reportedly-frustrated-by-a-mandate-to-use-ai-mocking-the-policy-in-slack-and-suspecting-its-being-used-as-justification-for-layoffs/',
    sourceTitle: 'EA employees frustrated by AI mandate amid layoffs',
  },
  {
    companyName: 'Unity Technologies',
    country: 'US',
    industry: 'Gaming/Game Engine',
    dateAnnounced: '2024-01-08',
    jobsCutAnnounced: 1800,
    category: 'MODERATE',
    eventType: 'AI_LAYOFF',
    summary: '25% of global workforce cut. Restructuring around AI-powered development tools. Additional quiet round in February 2025.',
    sourceUrl: 'https://www.blog.udonis.co/mobile-marketing/mobile-games/unity-layoffs',
    sourceTitle: 'Unity lays off 25% of workforce',
  },

  // PHARMA
  {
    companyName: 'Bayer',
    country: 'DE',
    industry: 'Pharmaceutical/Chemical',
    dateAnnounced: '2024-06-01',
    jobsCutAnnounced: 5000,
    category: 'MODERATE',
    eventType: 'AI_LAYOFF',
    summary: 'Implementing Dynamic Shared Ownership model. Part of broader restructuring including automation of processes. Dropped from 92,815 to 88,078 employees.',
    sourceUrl: 'https://www.biospace.com/job-trends/the-5-largest-biopharma-layoffs-of-h1-2025',
    sourceTitle: 'Bayer restructuring includes AI-driven automation',
  },
  {
    companyName: 'Novartis',
    country: 'CH',
    industry: 'Pharmaceutical',
    dateAnnounced: '2024-12-01',
    jobsCutAnnounced: 757,
    category: 'MODERATE',
    eventType: 'AI_LAYOFF',
    summary: 'Closed sites in Germany and Boston. Investing heavily in AI for drug discovery (BioAIM program) while reducing headcount.',
    sourceUrl: 'https://www.fiercebiotech.com/biotech/fierce-biotech-layoff-tracker-2024',
    sourceTitle: 'Novartis workforce cuts amid AI drug discovery push',
  },
]

async function main() {
  let created = 0, skipped = 0

  for (let i = 0; i < events.length; i++) {
    const e = events[i]
    const w = weights[e.category]

    // Check for duplicate
    const existing = await prisma.event.findFirst({
      where: { companyName: e.companyName, eventType: e.eventType, dateAnnounced: new Date(e.dateAnnounced) },
    })
    if (existing) {
      console.log(`[${i + 1}] SKIP (duplicate): ${e.companyName}`)
      skipped++
      continue
    }

    const conservative = Math.round(e.jobsCutAnnounced * w * 0.6)
    const core = Math.round(e.jobsCutAnnounced * w)
    const upper = Math.round(e.jobsCutAnnounced * Math.min(w * 1.4, 1.0))

    // Upsert source
    const domain = new URL(e.sourceUrl).hostname
    const source = await prisma.source.upsert({
      where: { domain },
      update: {},
      create: { name: domain, domain, reliable: true },
    })

    // Create article
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

    // Create event
    const event = await prisma.event.create({
      data: {
        eventType: e.eventType,
        companyName: e.companyName,
        country: e.country,
        industry: e.industry,
        dateAnnounced: new Date(e.dateAnnounced),
        jobsCutAnnounced: e.jobsCutAnnounced,
        conservativeAiJobs: conservative,
        weightedAiJobs: core,
        upperAiJobs: upper,
        attributionCategory: e.category,
        publicSummary: e.summary,
        reviewStatus: 'REVIEWED',
      },
    })

    // Link article to event
    await prisma.articleEvent.create({
      data: { articleId: article.id, eventId: event.id, isPrimary: true },
    })

    console.log(`[${i + 1}] ${e.companyName}: ${e.jobsCutAnnounced} jobs (${e.eventType}/${e.category}) → conservative=${conservative}, core=${core}, upper=${upper}`)
    created++
  }

  console.log(`\nDone. Created ${created} events, skipped ${skipped} duplicates.`)
  await prisma.$disconnect()
  await pool.end()
}

main().catch(console.error)
