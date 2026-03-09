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
  // ===== GOVERNMENT / PUBLIC SECTOR — AI & AUTOMATION DRIVEN =====

  // --- United Kingdom ---
  {
    company: "UK Civil Service",
    jobs: 10000,
    date: "2025-03-23",
    country: "GB",
    industry: "Government",
    category: "STRONG",
    eventType: "AI_LAYOFF",
    url: "https://www.personneltoday.com/hr/civil-service-cuts-10000/",
    sourceDomain: "personneltoday.com",
    sourceName: "Personnel Today",
    title: "UK Chancellor announces 10,000 civil service job cuts with AI to drive 15% cost reduction",
    summary: "Chancellor Rachel Reeves announced 10,000 civil service job cuts as part of the Spring Statement, targeting a 15% reduction in government operating costs by end of decade. AI tech teams will be deployed across departments to eliminate tasks machines can do 'better, faster, and to the same standard.' The plan aims to save over £2 billion per year.",
  },
  {
    company: "UK Cabinet Office",
    jobs: 2100,
    date: "2025-04-01",
    country: "GB",
    industry: "Government",
    category: "STRONG",
    eventType: "AI_LAYOFF",
    url: "https://www.personneltoday.com/hr/cabinet-office-to-shed-2100-civil-service-jobs/",
    sourceDomain: "personneltoday.com",
    sourceName: "Personnel Today",
    title: "Cabinet Office to cut 2,100 jobs over two years, citing AI savings",
    summary: "The UK Cabinet Office announced plans to cut 2,100 of its 6,500 staff — nearly a third — over two years. Of those, 1,200 will be redundancies and 900 transferred to other departments. The department expects to save £110 million by 2028 through job reductions and greater use of artificial intelligence. Top civil servant Cat Little said the department would become 'more strategic, specialist, and smaller.'",
  },
  {
    company: "NHS England (ICBs)",
    jobs: 12500,
    date: "2025-11-01",
    country: "GB",
    industry: "Government/Healthcare",
    category: "MODERATE",
    eventType: "AI_LAYOFF",
    url: "https://healthcareleadernews.com/news/icbs-asked-to-reduce-workforce-by-over-12000/",
    sourceDomain: "healthcareleadernews.com",
    sourceName: "Healthcare Leader",
    title: "NHS Integrated Care Boards asked to cut workforce by 12,500 as part of 50% running cost reduction",
    summary: "Health Secretary Wes Streeting approved a 50% cut to Integrated Care Board running costs, requiring a reduction of approximately 12,500 staff from around 25,000 ICB employees. The cuts aim to save £700-750 million annually. The government is simultaneously investing £1 billion in NHS data and technology transformation to reduce administrative burden through automation.",
  },

  // --- Canada ---
  {
    company: "Canadian Federal Public Service",
    jobs: 40000,
    date: "2025-11-04",
    country: "CA",
    industry: "Government",
    category: "STRONG",
    eventType: "AI_LAYOFF",
    url: "https://www.hrreporter.com/focus-areas/hr-technology/budget-2025-federal-public-service-to-lose-40000-jobs/393688",
    sourceDomain: "hrreporter.com",
    sourceName: "Canadian HR Reporter",
    title: "Canada's Budget 2025 projects 40,000 federal public service job losses by 2029",
    summary: "Canada's top public servant confirmed the Carney government's Budget 2025 will result in 40,000 job cuts, reducing the federal public service from ~370,000 to ~330,000 by March 2029. The budget includes $925.6 million over five years for sovereign AI infrastructure and expanded AI use across departments. Unions warn of longer wait times for passports, EI, child benefits, and reduced public health capacity.",
  },

  // --- Australia ---
  {
    company: "Services Australia",
    jobs: 4241,
    date: "2025-03-01",
    country: "AU",
    industry: "Government",
    category: "WEAK",
    eventType: "AI_LAYOFF",
    url: "https://www.canberratimes.com.au/story/9184467/thousands-of-services-australia-jobs-at-risk/",
    sourceDomain: "canberratimes.com.au",
    sourceName: "The Canberra Times",
    title: "Thousands of Services Australia jobs at risk as temporary funding expires amid digital-first shift",
    summary: "Services Australia faces losing 4,241 staff (14% of its 30,912 workforce) as temporary funding measures expire on June 30. The agency has been shifting to digital-first service delivery through myGov and previously paused automation of welfare claims in 2023 post-Robodebt, but plans to resume automation in 2025-26 with new safeguards. The union estimates $1.7 billion will be removed from agency resourcing.",
  },

  // --- South Korea ---
  {
    company: "South Korea (Workforce Projection)",
    jobs: 448000,
    date: "2026-02-12",
    country: "KR",
    industry: "Government/Economy-wide",
    category: "MODERATE",
    eventType: "AI_LAYOFF",
    url: "https://www.koreatimes.co.kr/southkorea/society/20260212/ai-expected-to-heavily-cut-jobs-in-sales-manufacturing-over-next-decade",
    sourceDomain: "koreatimes.co.kr",
    sourceName: "The Korea Times",
    title: "South Korea projects 448,000 job losses in sales and manufacturing over next decade due to AI and automation",
    summary: "Korea Employment Information Service (KEIS) projected 268,000 sales job losses over the next decade due to online commerce and unmanned checkout systems, plus 180,000 manufacturing job losses from industrial robots and AI-driven smart factory systems. While highly skilled professional roles are projected to gain 547,000 positions, routine-based roles face steep declines.",
  },

  // --- China ---
  {
    company: "China Manufacturing Sector",
    jobs: 80000000,
    date: "2024-01-01",
    country: "CN",
    industry: "Government/Manufacturing",
    category: "MODERATE",
    eventType: "ROBOT_LAYOFF",
    url: "https://www.fredgao.com/p/a-silent-handover-how-automation",
    sourceDomain: "fredgao.com",
    sourceName: "Fred Gao Newsletter",
    title: "China's manufacturing sector sheds 80 million jobs through automation since 2008 peak",
    summary: "China's manufacturing sector declined from approximately 200 million employees at its 2008-2009 peak to around 120 million or fewer by 2024, a reduction of roughly 80 million workers. Rather than mass layoffs, the workforce shrank through 'natural attrition' — as workers left, positions were automated and not refilled. McKinsey estimates up to 220 million Chinese workers may need to transition occupations by 2030.",
  },

  // --- NHS Grampian (Scotland) ---
  {
    company: "NHS Grampian",
    jobs: 700,
    date: "2025-10-09",
    country: "GB",
    industry: "Government/Healthcare",
    category: "EXPLICIT",
    eventType: "AI_LAYOFF",
    url: "https://www.digitalhealth.net/2025/10/nhs-grampian-advised-to-replace-40-of-staff-with-ai-to-cut-costs/",
    sourceDomain: "digitalhealth.net",
    sourceName: "Digital Health",
    title: "NHS Grampian advised by KPMG to replace 30-40% of back-office staff with AI",
    summary: "A KPMG report published October 9, 2025 recommended NHS Grampian leverage GenAI and Robotic Process Automation to achieve a 30-40% phased reduction in back-office roles, cutting 525-700 positions over 12-36 months via recruitment pauses and attrition. Projected savings of £11.7-15.6 million. KPMG stated 'a significant opportunity exists for NHSG to leverage the latest technology developments (including the use of GenAI tools) to drive efficiency and right-size headcount.'",
  },

  // --- US Pentagon / DoD (DOGE) ---
  {
    company: "US Department of Defense (DOGE)",
    jobs: 60000,
    date: "2025-03-18",
    country: "US",
    industry: "Government/Defense",
    category: "MODERATE",
    eventType: "AI_LAYOFF",
    url: "https://www.military.com/daily-news/2025/03/18/pentagon-pushes-ahead-cutting-60000-civilian-workers-using-firings-resignations-and-hiring-freeze.html",
    sourceDomain: "military.com",
    sourceName: "Military.com",
    title: "Pentagon pushes to cut 60,000 civilian workers via DOGE-driven efficiency campaign",
    summary: "The Pentagon is pursuing the elimination of over 60,000 of its 900,000+ civilian personnel through deferred resignations, probationary staff removal, and hiring freezes as part of DOGE. DISA expects a 10% workforce reduction. The Chief Digital and AI Office sought hiring freeze exemptions. Cuts have 'unexpectedly and significantly impacted' critical Pentagon IT units. The $66B DOD IT budget is pivoting to AI and efficiency.",
  },

  // --- Argentina (Milei Austerity) ---
  {
    company: "Argentina Federal Government (Milei)",
    jobs: 63000,
    date: "2024-12-10",
    country: "AR",
    industry: "Government",
    category: "WEAK",
    eventType: "AI_LAYOFF",
    url: "https://www.upi.com/Top_News/World-News/2026/02/09/Javier-Milei-cuts-63000-Argentinian-public-sector-jobs-in-2-years/2661770651174/",
    sourceDomain: "upi.com",
    sourceName: "UPI",
    title: "Argentina's Milei cuts 63,000 public sector jobs in two years of 'chainsaw' austerity",
    summary: "Between December 2023 and December 2025, Argentina's national government workforce fell by 63,234 positions (18.4% reduction). The largest reductions were in the National Public Administration (13.7%) and state-owned enterprises (16.4%). Annual savings of approximately US$1.885 billion. While framed as austerity rather than AI-driven, Milei's government has promoted digitalization and has been compared to DOGE-style efficiency reforms.",
  },

  // --- Canada Service Canada ---
  {
    company: "Service Canada",
    jobs: 800,
    date: "2025-06-01",
    country: "CA",
    industry: "Government",
    category: "MODERATE",
    eventType: "AI_LAYOFF",
    url: "https://stlawyers.ca/blog-news/service-canada-cuts-800-passport-jobs-2025/",
    sourceDomain: "stlawyers.ca",
    sourceName: "Samfiru Tumarkin LLP",
    title: "Service Canada cuts 800 jobs as passport processing shifts to digital channels",
    summary: "Service Canada eliminated 800 term positions nationwide by end of June 2025, citing declining passport application volumes as more services move to digital channels. Part of broader ESDC workforce adjustment where over 3,000 ESDC workers received notices that their positions would be affected. The CRA also issued notices to 655+ workers as it automates risk scoring processes to reduce repetitive tasks by 50%.",
  },

  // --- UK HMRC ---
  {
    company: "HMRC",
    jobs: 2594,
    date: "2024-03-01",
    country: "GB",
    industry: "Government",
    category: "STRONG",
    eventType: "AI_LAYOFF",
    url: "https://www.cityam.com/spending-watchdog-says-hmrc-in-declining-spiral-and-needs-to-rethink-unprecedented-job-cuts/",
    sourceDomain: "cityam.com",
    sourceName: "City A.M.",
    title: "HMRC loses 2,594 staff in one year as it pushes 90% automated customer interactions by 2030",
    summary: "Between March 2023 and March 2024, 2,594 employees left HMRC. Frontline customer service staff was cut by 6% to 18,200. HMRC aims for more than 90% of customer interactions to be through automated or self-serve channels by 2029-30, deploying automated IVR systems and pushing users toward digital self-service. The spending watchdog warned HMRC was in a 'declining spiral' of service quality.",
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
