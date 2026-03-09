import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

type Cat = "EXPLICIT" | "STRONG" | "MODERATE" | "WEAK" | "FRINGE";

function calcJobs(announced: number, cat: Cat) {
  const weights: Record<Cat, { conservative: number; core: number; upper: number }> = {
    EXPLICIT:  { conservative: 1.0,  core: 1.0,  upper: 1.0  },
    STRONG:    { conservative: 0.0,  core: 0.75, upper: 1.0  },
    MODERATE:  { conservative: 0.0,  core: 0.40, upper: 0.70 },
    WEAK:      { conservative: 0.0,  core: 0.15, upper: 0.35 },
    FRINGE:    { conservative: 0.0,  core: 0.05, upper: 0.15 },
  };
  const w = weights[cat];
  return {
    conservative: Math.round(announced * w.conservative),
    core: Math.round(announced * w.core),
    upper: Math.round(announced * w.upper),
  };
}

const coreWeights: Record<Cat, number> = {
  EXPLICIT: 1.0, STRONG: 0.75, MODERATE: 0.40, WEAK: 0.15, FRINGE: 0.05,
};

type EventType = "AI_LAYOFF" | "ROBOT_LAYOFF" | "AI_JOB_CREATED" | "PRODUCTIVITY_GAIN";

interface EventData {
  company: string;
  jobs: number;
  date: string;
  country: string;
  industry: string;
  category: Cat;
  eventType: EventType;
  url: string;
  sourceDomain: string;
  sourceName: string;
  title: string;
  summary: string;
}

const events: EventData[] = [
  // ===== AI LAYOFFS =====

  // --- Insurance ---
  {
    company: "Allianz Partners",
    jobs: 1800,
    date: "2025-11-26",
    country: "DE",
    industry: "Insurance",
    category: "EXPLICIT",
    eventType: "AI_LAYOFF",
    url: "https://www.france24.com/en/live-news/20251126-insurance-giant-allianz-signals-job-cuts-in-ai-shift",
    sourceDomain: "france24.com",
    sourceName: "France 24",
    title: "Allianz Partners to cut up to 1,800 jobs as AI reshapes call centre operations",
    summary: "Allianz Partners plans to eliminate 1,500 to 1,800 jobs over 12-18 months, mainly in call centres in its travel insurance division. The subsidiary employs 22,600 people, with 14,000 handling customer inquiries by phone. The company is increasingly automating tasks using AI tools.",
  },

  // --- Fintech ---
  {
    company: "PayPal",
    jobs: 2500,
    date: "2024-01-30",
    country: "US",
    industry: "Fintech",
    category: "MODERATE",
    eventType: "AI_LAYOFF",
    url: "https://www.cnbc.com/2024/01/30/paypal-will-cut-about-2500-jobs-or-9percent-of-global-workforce.html",
    sourceDomain: "cnbc.com",
    sourceName: "CNBC",
    title: "PayPal cuts 2,500 jobs (9% of workforce) while deploying AI automation and consolidating technology",
    summary: "PayPal cut 9% of its global workforce (about 2,500 jobs) to 'right-size' the business. CEO Alex Chriss cited the need to deploy automation and consolidate technology to reduce complexity and duplication. Simultaneously launched AI-powered checkout and merchant recommendation features.",
  },

  // --- Technology / Electronics ---
  {
    company: "Samsung",
    jobs: 10000,
    date: "2024-10-01",
    country: "KR",
    industry: "Electronics/Technology",
    category: "MODERATE",
    eventType: "AI_LAYOFF",
    url: "https://finance.yahoo.com/news/samsung-cut-thousands-jobs-part-152351245.html",
    sourceDomain: "finance.yahoo.com",
    sourceName: "Yahoo Finance (Bloomberg)",
    title: "Samsung to cut thousands of jobs globally amid struggles in AI chip market",
    summary: "Samsung Electronics began cutting up to 10% of overseas staff (~10,000 jobs) across Southeast Asia, Australia, New Zealand, the Americas, Europe, and Africa. Sales and marketing staff cut by 15%, administrative staff by up to 30%. Cuts driven by falling behind SK Hynix in AI memory chips.",
  },
  {
    company: "Hewlett Packard Enterprise",
    jobs: 2500,
    date: "2025-03-01",
    country: "US",
    industry: "Technology",
    category: "MODERATE",
    eventType: "AI_LAYOFF",
    url: "https://www.channelfutures.com/sdn-sd-wan/hpe-layoffs-to-impact-2-500-employees",
    sourceDomain: "channelfutures.com",
    sourceName: "Channel Futures",
    title: "HPE cuts 2,500 jobs while pivoting to AI and cloud services",
    summary: "Hewlett Packard Enterprise announced 2,500 job cuts (plus 500 via attrition), representing 5% of its 61,000 workforce, to save $350M annually. Cuts coincide with strategic pivot to AI, cloud computing, and network solutions following Juniper Networks acquisition. HPE implemented AI-powered agents in finance operations.",
  },

  // --- Consulting ---
  {
    company: "Accenture",
    jobs: 11000,
    date: "2025-09-28",
    country: "US",
    industry: "Consulting/Technology",
    category: "EXPLICIT",
    eventType: "AI_LAYOFF",
    url: "https://www.cnbc.com/2025/09/26/accenture-plans-on-exiting-staff-who-cant-be-reskilled-on-ai.html",
    sourceDomain: "cnbc.com",
    sourceName: "CNBC",
    title: "Accenture lays off 11,000 staff who couldn't be reskilled on AI",
    summary: "Accenture laid off over 11,000 employees in Q4 FY2025 as part of an $865M AI-driven restructuring. CEO Julie Sweet stated those who 'cannot be reskilled will be exited.' Part of broader 21,800 cuts over two quarters. Simultaneously invested in training 70,000 employees in AI and hired 77,000 AI/data professionals.",
  },
  {
    company: "PwC",
    jobs: 1500,
    date: "2025-05-01",
    country: "US",
    industry: "Consulting/Accounting",
    category: "MODERATE",
    eventType: "AI_LAYOFF",
    url: "https://www.entrepreneur.com/business-news/big-four-accounting-firm-pwc-is-laying-off-1500-us-staff/491188",
    sourceDomain: "entrepreneur.com",
    sourceName: "Entrepreneur",
    title: "PwC lays off 1,500 US workers in second major round as AI reshapes audit and tax work",
    summary: "PwC cut approximately 1,500 US roles (2% of workforce) primarily in audit and tax divisions, less than a year after its September 2024 round of 1,800 cuts. Part of broader Big Four trend where AI and automation are replacing low-level audit and tax work, with firms shifting work to lower-cost countries.",
  },

  // --- Energy ---
  {
    company: "BP",
    jobs: 4700,
    date: "2025-01-16",
    country: "GB",
    industry: "Energy",
    category: "WEAK",
    eventType: "AI_LAYOFF",
    url: "https://www.powermag.com/bp-cutting-thousands-of-jobs-in-effort-to-reduce-costs/",
    sourceDomain: "powermag.com",
    sourceName: "POWER Magazine",
    title: "BP cuts 4,700 employees and 3,000 contractors in $2B cost reduction drive",
    summary: "BP announced cuts of about 4,700 employees and 3,000 contractor positions to reduce costs by $2B by end of 2026. The technology division alone cut approximately 1,100 roles. BP is utilizing AI in engineering, marketing and operations, though cuts are primarily driven by broader cost pressures.",
  },

  // --- Media ---
  {
    company: "Vice Media",
    jobs: 300,
    date: "2024-02-22",
    country: "US",
    industry: "Media",
    category: "WEAK",
    eventType: "AI_LAYOFF",
    url: "https://www.cnn.com/2024/02/22/media/vice-lay-offs-stops-publishing-content-on-its-website/index.html",
    sourceDomain: "cnn.com",
    sourceName: "CNN",
    title: "Vice Media ceases publishing on vice.com, lays off several hundred staff",
    summary: "Vice Media laid off several hundred staffers (from ~900 total) and ceased publishing to its website, shifting to a studio model. While AI was not the stated cause, the layoffs occurred amid industry collapse driven partly by AI threatening traditional media business models and reduced search traffic from AI-powered search.",
  },
  {
    company: "BuzzFeed",
    jobs: 160,
    date: "2024-02-23",
    country: "US",
    industry: "Media",
    category: "MODERATE",
    eventType: "AI_LAYOFF",
    url: "https://www.hollywoodreporter.com/business/digital/buzzfeed-layoffs-new-restructuring-1235831847/",
    sourceDomain: "hollywoodreporter.com",
    sourceName: "Hollywood Reporter",
    title: "BuzzFeed cuts 16% of remaining workforce in second AI-era restructuring",
    summary: "BuzzFeed laid off 16% of its remaining workforce (~160 people) in its second round of AI-era cuts. The company also sold Complex to NTWRK for $108.6M. CEO Jonah Peretti continued to emphasize AI content generation as a core business strategy alongside these workforce reductions.",
  },

  // --- Telecom ---
  {
    company: "Ericsson",
    jobs: 1600,
    date: "2026-01-15",
    country: "SE",
    industry: "Telecommunications",
    category: "WEAK",
    eventType: "AI_LAYOFF",
    url: "https://www.ericsson.com/en/press-releases/2026/1/ericsson-announces-proposed-headcount-reduction-in-sweden",
    sourceDomain: "ericsson.com",
    sourceName: "Ericsson (Press Release)",
    title: "Ericsson announces 1,600 job cuts in Sweden amid cost-efficiency push",
    summary: "Ericsson will eliminate 1,600 positions in Sweden (~12% of its 13,222 Swedish workforce) as part of global initiatives to improve cost position. Cuts expected to be completed by end of 2026. This follows 1,200 cuts in Sweden in March 2024 and 8,500 worldwide in 2023.",
  },

  // --- Banking ---
  {
    company: "Citigroup",
    jobs: 1000,
    date: "2026-01-14",
    country: "US",
    industry: "Banking",
    category: "MODERATE",
    eventType: "AI_LAYOFF",
    url: "https://fortune.com/2026/01/14/citigroup-ceo-jane-fraser-job-cuts-ai-bad-old-ways-restructuring/",
    sourceDomain: "fortune.com",
    sourceName: "Fortune",
    title: "Citigroup cuts 1,000 more jobs as CEO Fraser cites AI and automation in restructuring memo",
    summary: "Citigroup eliminated approximately 1,000 positions as part of CEO Jane Fraser's 'Transformation' program. Fraser noted automation and AI-enabled systems would allow running middle-office and operational functions with fewer employees. Part of broader plan to cut 20,000 jobs by 2026.",
  },

  // --- Pharma ---
  {
    company: "Bayer",
    jobs: 5000,
    date: "2025-05-01",
    country: "DE",
    industry: "Pharmaceutical/Agriculture",
    category: "WEAK",
    eventType: "AI_LAYOFF",
    url: "https://fortune.com/2025/01/06/bayer-attacked-bureaucracy-firing-5000-managers-asking-teams-self-organize/",
    sourceDomain: "fortune.com",
    sourceName: "Fortune",
    title: "Bayer fires 5,000 managers in radical restructuring as AI and automation reshape operations",
    summary: "Bayer eliminated approximately 5,000 managers (from total 13,500 cuts since early 2024) under CEO Bill Anderson's 'Dynamic Shared Ownership' model. While primarily framed as anti-bureaucracy, the restructuring coincides with increasing AI adoption across pharma for drug discovery, clinical trials, and operations.",
  },

];

async function main() {
  let created = 0;
  let skipped = 0;

  for (const ev of events) {
    // Check if event already exists for this company with similar date and job count
    const existing = await prisma.event.findFirst({
      where: {
        companyName: ev.company,
        jobsCutAnnounced: ev.jobs,
        eventType: ev.eventType,
      },
    });

    if (existing) {
      console.log(`[SKIP] ${ev.company}: ${ev.jobs} jobs (${ev.eventType}) - already exists`);
      skipped++;
      continue;
    }

    // Upsert company
    const company = await prisma.company.upsert({
      where: { name: ev.company },
      update: { industry: ev.industry, country: ev.country },
      create: { name: ev.company, industry: ev.industry, country: ev.country },
    });

    // Upsert source
    const source = await prisma.source.upsert({
      where: { domain: ev.sourceDomain },
      update: {},
      create: { domain: ev.sourceDomain, name: ev.sourceName, type: "news" },
    });

    // Handle article URL uniqueness
    let articleUrl = ev.url;
    const existingArticle = await prisma.article.findUnique({ where: { url: articleUrl } });
    if (existingArticle && existingArticle.title !== ev.title) {
      articleUrl = `${ev.url}#${ev.company.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
    }

    const article = await prisma.article.upsert({
      where: { url: articleUrl },
      update: {},
      create: {
        title: ev.title,
        url: articleUrl,
        sourceId: source.id,
        publishedAt: new Date(ev.date),
        summary: ev.summary,
        language: "en",
        country: ev.country,
      },
    });

    // Calculate weighted jobs
    const jobs = calcJobs(ev.jobs, ev.category);

    // Create event
    const event = await prisma.event.create({
      data: {
        eventType: ev.eventType,
        companyId: company.id,
        companyName: ev.company,
        country: ev.country,
        industry: ev.industry,
        dateAnnounced: new Date(ev.date),
        jobsCutAnnounced: ev.jobs,
        conservativeAiJobs: jobs.conservative,
        weightedAiJobs: jobs.core,
        upperAiJobs: jobs.upper,
        attributionCategory: ev.category,
        attributionWeight: coreWeights[ev.category],
        confidenceScore: ev.category === "EXPLICIT" ? 0.95 : ev.category === "STRONG" ? 0.8 : 0.6,
        publicSummary: ev.summary,
        reviewStatus: "PROVISIONAL",
        reviewLevel: "AUTOMATED",
        needsReview: true,
      },
    });

    // Link article to event
    await prisma.articleEvent.create({
      data: {
        articleId: article.id,
        eventId: event.id,
        isPrimary: true,
      },
    });

    created++;
    console.log(`[${created}] ${ev.company}: ${ev.jobs} jobs (${ev.eventType}/${ev.category}) → conservative=${jobs.conservative}, core=${jobs.core}, upper=${jobs.upper}`);
  }

  console.log(`\nDone. Created ${created} events, skipped ${skipped} duplicates.`);
  await prisma.$disconnect();
  await pool.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
