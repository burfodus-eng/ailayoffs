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
  // US GOVERNMENT
  {
    companyName: 'IRS (US Internal Revenue Service)',
    country: 'US',
    industry: 'Government/Tax',
    dateAnnounced: '2025-03-01',
    jobsCutAnnounced: 20000,
    category: 'MODERATE',
    eventType: 'AI_LAYOFF',
    summary: 'IRS shed over 20,000 employees through buyouts, early retirements, and layoffs under DOGE pressure. Officials cited declining workloads and increased automation as justification.',
    sourceUrl: 'https://mypersonaltaxcpa.com/irs-layoffs-2025/',
    sourceTitle: 'IRS Layoffs 2025: What You Need to Know',
  },
  {
    companyName: 'USPS',
    country: 'US',
    industry: 'Government/Postal',
    dateAnnounced: '2025-01-15',
    jobsCutAnnounced: 10000,
    category: 'STRONG',
    eventType: 'ROBOT_LAYOFF',
    summary: 'USPS cut 10,000 workers through voluntary early retirement as part of Delivering for America modernization plan. 400 centers being partially or fully automated with HOPS sorting systems.',
    sourceUrl: 'https://www.cbsnews.com/news/usps-cut-10000-workers-elon-musks-doge/',
    sourceTitle: 'USPS cuts 10,000 workers amid automation modernization',
  },
  {
    companyName: 'Social Security Administration',
    country: 'US',
    industry: 'Government/Social Services',
    dateAnnounced: '2025-05-01',
    jobsCutAnnounced: 7000,
    category: 'MODERATE',
    eventType: 'AI_LAYOFF',
    summary: 'SSA cut 7,000 employees under DOGE restructuring, dropping from 57,000 to 51,400. AI chatbot rolled out to handle 1.6 million of 5.1 million monthly calls. Commissioner called AI a great enabler.',
    sourceUrl: 'https://401kspecialistmag.com/social-security-administration-cutting-7000-jobs-in-doge-initiated-restructuring/',
    sourceTitle: 'SSA cutting 7,000 jobs in DOGE-initiated restructuring',
  },
  {
    companyName: 'Department of Veterans Affairs',
    country: 'US',
    industry: 'Government/Healthcare',
    dateAnnounced: '2025-06-01',
    jobsCutAnnounced: 30000,
    category: 'WEAK',
    eventType: 'AI_LAYOFF',
    summary: 'VA reduced staff by nearly 30,000 by end of FY2025, including 12% cut to IT workforce. Deploying automation tools with AI handling routine tasks like document summarization and inquiry routing.',
    sourceUrl: 'https://news.va.gov/press-room/va-to-reduce-staff-by-nearly-30k-by-end-of-fy2025/',
    sourceTitle: 'VA to reduce staff by nearly 30K by end of FY2025',
  },

  // UK GOVERNMENT
  {
    companyName: 'UK Cabinet Office',
    country: 'GB',
    industry: 'Government',
    dateAnnounced: '2025-10-01',
    jobsCutAnnounced: 2100,
    category: 'STRONG',
    eventType: 'AI_LAYOFF',
    summary: 'Cabinet Office to cut or move 2,100 jobs (one-third of workforce). Part of PM Starmer AI-driven civil service reform. 11 London buildings to be closed.',
    sourceUrl: 'https://www.civilserviceworld.com/professions/article/starmer-civil-service-reform-ai-automation-albs',
    sourceTitle: 'Starmer civil service reform with AI and automation',
  },
  {
    companyName: 'Cambridge University Hospitals NHS',
    country: 'GB',
    industry: 'Healthcare/Government',
    dateAnnounced: '2025-04-01',
    jobsCutAnnounced: 500,
    category: 'MODERATE',
    eventType: 'AI_LAYOFF',
    summary: 'Announced 500 non-clinical job losses (4% of workforce) as part of NHS-wide corporate cost reductions, with AI and automation enabling leaner operations.',
    sourceUrl: 'https://www.wsws.org/en/articles/2025/04/20/tuwl-a20.html',
    sourceTitle: 'Cambridge University Hospitals NHS job cuts',
  },

  // AUSTRALIA
  {
    companyName: 'Telstra',
    country: 'AU',
    industry: 'Telecommunications',
    dateAnnounced: '2025-07-01',
    jobsCutAnnounced: 550,
    category: 'MODERATE',
    eventType: 'AI_LAYOFF',
    summary: 'Telstra cut 550 positions (2% of workforce) to simplify enterprise business. Company cited AI efficiencies would enable further reductions by 2030.',
    sourceUrl: 'https://totaltele.com/telstra-to-axe-hundreds-of-jobs-as-company-doubles-down-on-ai-efficiency/',
    sourceTitle: 'Telstra cuts hundreds as it doubles down on AI efficiency',
  },
  {
    companyName: 'Telstra',
    country: 'AU',
    industry: 'Telecommunications',
    dateAnnounced: '2026-02-01',
    jobsCutAnnounced: 1000,
    category: 'STRONG',
    eventType: 'AI_LAYOFF',
    summary: 'Telstra cut 1,000 more jobs while posting $1.2B half-year profit. Continued enterprise simplification with AI efficiency gains.',
    sourceUrl: 'https://ia.acs.org.au/article/2026/telstra-posts--1-2b-half-year-profit-as-1-000-jobs-cut.html',
    sourceTitle: 'Telstra posts $1.2B profit as 1,000 jobs cut',
  },

  // INDIA IT
  {
    companyName: 'Infosys',
    country: 'IN',
    industry: 'IT Services',
    dateAnnounced: '2024-04-01',
    jobsCutAnnounced: 26000,
    category: 'STRONG',
    eventType: 'AI_LAYOFF',
    summary: 'Eliminated 26,000 positions in fiscal 2024 as AI and automation reshaped IT services industry. Over 300 enterprise-grade AI agents deployed delivering 5-15% productivity gains.',
    sourceUrl: 'https://www.cnbc.com/2025/08/04/indias-it-layoffs-spark-fears-ai-is-hurting-jobs-in-critical-sector.html',
    sourceTitle: 'India IT layoffs spark fears AI is hurting jobs in critical sector',
  },
  {
    companyName: 'Wipro',
    country: 'IN',
    industry: 'IT Services',
    dateAnnounced: '2024-04-01',
    jobsCutAnnounced: 24500,
    category: 'STRONG',
    eventType: 'AI_LAYOFF',
    summary: 'Shed 24,500 roles in fiscal 2024 as part of broader Indian IT industry realignment driven by AI adoption and automation of traditional outsourcing work.',
    sourceUrl: 'https://www.cnbc.com/2025/08/04/indias-it-layoffs-spark-fears-ai-is-hurting-jobs-in-critical-sector.html',
    sourceTitle: 'India IT layoffs spark fears AI is hurting jobs',
  },
  {
    companyName: 'Cognizant',
    country: 'US',
    industry: 'IT Services',
    dateAnnounced: '2025-03-01',
    jobsCutAnnounced: 13700,
    category: 'MODERATE',
    eventType: 'AI_LAYOFF',
    summary: 'Headcount declined from 350,000 to 336,300 as AI deployment accelerated across client engagements. CEO stressed AI productivity boost.',
    sourceUrl: 'https://www.getgenerative.ai/india-it-pyramid-collapse-ai/',
    sourceTitle: 'India IT pyramid collapse driven by AI',
  },
  {
    companyName: 'Livspace',
    country: 'IN',
    industry: 'Interior Design/E-commerce',
    dateAnnounced: '2026-02-01',
    jobsCutAnnounced: 1000,
    category: 'EXPLICIT',
    eventType: 'AI_LAYOFF',
    summary: 'Laid off ~1,000 employees (12% of workforce) to become AI-native organization. AI agents deployed across functions to replace manual roles.',
    sourceUrl: 'https://www.entrepreneur.com/en-in/news-and-trends/livspace-layoffs-around-1000-employees-affected-amid/502890',
    sourceTitle: 'Livspace lays off 1,000 in AI transformation',
  },

  // CANADA
  {
    companyName: 'CRA (Canada Revenue Agency)',
    country: 'CA',
    industry: 'Government/Tax',
    dateAnnounced: '2024-05-01',
    jobsCutAnnounced: 2000,
    category: 'MODERATE',
    eventType: 'AI_LAYOFF',
    summary: 'CRA did not renew contracts for ~2,000 term members in Contact Centres. Automated telephone system reduced call volumes by 95,000 annually.',
    sourceUrl: 'https://www.ute-sei.org/en/news-events/news/more-cuts-cra-expense-population',
    sourceTitle: 'More cuts at CRA at expense of population',
  },

  // EUROPE
  {
    companyName: 'ASML',
    country: 'NL',
    industry: 'Semiconductor Equipment',
    dateAnnounced: '2026-01-28',
    jobsCutAnnounced: 1700,
    category: 'MODERATE',
    eventType: 'AI_LAYOFF',
    summary: 'Cut 1,700 jobs (3.8% of workforce) despite record results. Cuts target management layers in technology/IT departments.',
    sourceUrl: 'https://www.bloomberg.com/news/articles/2026-01-28/asml-plans-about-1-700-job-cuts-in-netherlands-us-as-sales-boom',
    sourceTitle: 'ASML plans 1,700 job cuts despite sales boom',
  },
  {
    companyName: 'Nokia',
    country: 'FI',
    industry: 'Telecommunications',
    dateAnnounced: '2024-11-01',
    jobsCutAnnounced: 5000,
    category: 'MODERATE',
    eventType: 'AI_LAYOFF',
    summary: 'CEO announced 5,000 additional cuts to finalize restructuring. Total workforce shrank 27% from 103,000+ to 75,600 between 2018-2024. Automation integral to network equipment.',
    sourceUrl: 'https://www.lightreading.com/5g/ericsson-and-nokia-were-cutting-20-000-jobs-as-huawei-grew',
    sourceTitle: 'Nokia finalizes restructuring with 5,000 more cuts',
  },

  // FINANCE
  {
    companyName: 'Oracle',
    country: 'US',
    industry: 'Enterprise Software',
    dateAnnounced: '2026-03-05',
    jobsCutAnnounced: 20000,
    category: 'MODERATE',
    eventType: 'AI_LAYOFF',
    summary: 'Oracle planning to cut 20,000-30,000 positions (12-18% of workforce) amid cash crunch from massive AI data center expansion. Some categories can be bolstered using AI.',
    sourceUrl: 'https://www.bloomberg.com/news/articles/2026-03-05/oracle-layoffs-to-impact-thousands-in-ai-cash-crunch',
    sourceTitle: 'Oracle layoffs to impact thousands in AI cash crunch',
  },
  {
    companyName: 'Morgan Stanley',
    country: 'US',
    industry: 'Financial Services',
    dateAnnounced: '2026-03-05',
    jobsCutAnnounced: 2500,
    category: 'MODERATE',
    eventType: 'AI_LAYOFF',
    summary: 'Cut 2,500 employees (3% of staff) across investment banking, wealth management divisions. Came after record revenue year in 2025.',
    sourceUrl: 'https://www.foxbusiness.com/markets/morgan-stanley-cuts-2500-jobs-despite-posting-record-revenue-year-across-all-divisions',
    sourceTitle: 'Morgan Stanley cuts 2,500 despite record revenue',
  },
  {
    companyName: 'BlackRock',
    country: 'US',
    industry: 'Asset Management',
    dateAnnounced: '2026-01-12',
    jobsCutAnnounced: 250,
    category: 'WEAK',
    eventType: 'AI_LAYOFF',
    summary: 'Cut ~250 jobs (1% of 24,600 workforce), third round in 12 months. Cuts in investment and sales teams amid increasing automation.',
    sourceUrl: 'https://www.bloomberg.com/news/articles/2026-01-12/blackrock-cuts-hundreds-of-jobs-trimming-about-1-of-staff',
    sourceTitle: 'BlackRock trims about 1% of staff',
  },

  // NEW CORPORATE
  {
    companyName: 'Amazon',
    country: 'US',
    industry: 'Technology/E-commerce',
    dateAnnounced: '2026-01-28',
    jobsCutAnnounced: 16000,
    category: 'EXPLICIT',
    eventType: 'AI_LAYOFF',
    summary: 'Amazon cut 16,000 additional corporate jobs in January 2026. CEO Jassy stated AI would reduce need for people in certain roles. Total 30,000 corporate cuts since October 2025.',
    sourceUrl: 'https://www.cnbc.com/2026/01/28/amazon-layoffs-anti-bureaucracy-ai.html',
    sourceTitle: 'Amazon cuts 16,000 more corporate jobs citing AI',
  },
  {
    companyName: 'Meta (Reality Labs)',
    country: 'US',
    industry: 'Technology/VR',
    dateAnnounced: '2026-01-15',
    jobsCutAnnounced: 1500,
    category: 'STRONG',
    eventType: 'AI_LAYOFF',
    summary: 'Eliminated ~1,500 positions in Reality Labs division (10%), pivoting from metaverse toward AI and wearable technology.',
    sourceUrl: 'https://www.fastcompany.com/91474082/meta-layoffs-today-jobs-slashed-at-reality-labs-vr-division',
    sourceTitle: 'Meta layoffs hit Reality Labs as resources redirect to AI',
  },
  {
    companyName: 'eBay',
    country: 'US',
    industry: 'E-commerce',
    dateAnnounced: '2026-02-26',
    jobsCutAnnounced: 800,
    category: 'STRONG',
    eventType: 'AI_LAYOFF',
    summary: 'Cut 800 roles (6% of workforce) while investing heavily in AI-powered shopping agents, automated listing tools, and pricing optimization. Third round in three years.',
    sourceUrl: 'https://www.cnbc.com/2026/02/26/ebay-layoffs-800-workforce.html',
    sourceTitle: 'eBay cuts 800 jobs amid AI investment',
  },
  {
    companyName: 'Workday',
    country: 'US',
    industry: 'Enterprise Software',
    dateAnnounced: '2026-02-01',
    jobsCutAnnounced: 375,
    category: 'STRONG',
    eventType: 'AI_LAYOFF',
    summary: 'Second round of layoffs affecting ~2% of workforce on top of the 1,750 cut in February 2025. Continued AI investment focus.',
    sourceUrl: 'https://www.metaintro.com/blog/workday-layoffs-ceo-steps-down-co-founder-returns-ai-2026',
    sourceTitle: 'Workday second round of layoffs in 2026',
  },
  {
    companyName: 'Ericsson',
    country: 'SE',
    industry: 'Telecommunications',
    dateAnnounced: '2026-01-15',
    jobsCutAnnounced: 1600,
    category: 'MODERATE',
    eventType: 'AI_LAYOFF',
    summary: 'Announced 1,600 job cuts in Sweden (12% of Swedish workforce). Part of global cost-efficiency initiatives while maintaining investment in AI-enabled programmable networks.',
    sourceUrl: 'https://www.ericsson.com/en/press-releases/2026/1/ericsson-announces-proposed-headcount-reduction-in-sweden',
    sourceTitle: 'Ericsson announces headcount reduction in Sweden',
  },
]

async function main() {
  let created = 0, skipped = 0

  for (let i = 0; i < events.length; i++) {
    const e = events[i]
    const w = weights[e.category]

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
