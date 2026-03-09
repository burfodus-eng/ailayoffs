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

interface EventData {
  company: string;
  jobs: number;
  date: string;
  country: string;
  industry: string;
  category: Cat;
  url: string;
  sourceDomain: string;
  sourceName: string;
  title: string;
  summary: string;
}

const events: EventData[] = [
  {
    company: "BT Group",
    jobs: 10000,
    date: "2023-05-18",
    country: "GB",
    industry: "Telecommunications",
    category: "EXPLICIT",
    url: "https://aibusiness.com/nlp/bt-to-cut-up-to-55-000-jobs-due-to-ai-automation",
    sourceDomain: "aibusiness.com",
    sourceName: "AI Business",
    title: "BT Group to cut 10,000 jobs due to AI and automation",
    summary: "BT Group announced plans to cut up to 55,000 jobs by 2030, with approximately 10,000 roles specifically replaced by AI and automation in customer service and internal processes.",
  },
  {
    company: "IBM",
    jobs: 8000,
    date: "2023-05-01",
    country: "US",
    industry: "Technology",
    category: "EXPLICIT",
    url: "https://glassalmanac.com/ibm-laid-off-8000-employees-to-replace-them-with-ai-what-they-didnt-expect-was-having-to-rehire-as-many-due-to-ai/",
    sourceDomain: "glassalmanac.com",
    sourceName: "Glass Almanac",
    title: "IBM laid off 8,000 employees to replace them with AI",
    summary: "IBM CEO Arvind Krishna stated AI chatbots had taken over back-office HR roles. The company replaced many HR positions with its internal AskHR AI chatbot.",
  },
  {
    company: "Duolingo",
    jobs: 300,
    date: "2024-01-09",
    country: "US",
    industry: "Education Technology",
    category: "EXPLICIT",
    url: "https://www.cnn.com/2024/01/09/tech/duolingo-layoffs-due-to-ai",
    sourceDomain: "cnn.com",
    sourceName: "CNN",
    title: "Duolingo cuts 10% of contractors as it pivots to AI",
    summary: "Duolingo offboarded 10% of its contractor workforce as the company pivoted to AI for content translation across its 100+ language offerings.",
  },
  {
    company: "SAP",
    jobs: 8000,
    date: "2024-01-23",
    country: "DE",
    industry: "Enterprise Software",
    category: "EXPLICIT",
    url: "https://www.cnbc.com/2024/01/23/sap-plans-job-changes-or-buyouts-for-8000-employees-in-restructuring-plan.html",
    sourceDomain: "cnbc.com",
    sourceName: "CNBC",
    title: "SAP plans restructuring affecting 8,000 employees to refocus on AI",
    summary: "SAP announced a EUR 2 billion restructuring affecting 8,000 employees to refocus on AI capabilities. Most handled through voluntary buyouts and retraining.",
  },
  {
    company: "Intel",
    jobs: 24000,
    date: "2024-08-01",
    country: "US",
    industry: "Semiconductors",
    category: "MODERATE",
    url: "https://intellizence.com/insights/layoff-downsizing/major-companies-that-announced-mass-layoffs/",
    sourceDomain: "intellizence.com",
    sourceName: "Intellizence",
    title: "Intel cuts 24,000 jobs in strategic restructuring for AI era",
    summary: "Intel announced cutting 24,000 jobs and halting major factory projects as part of a strategic restructuring to reposition for the AI chip market.",
  },
  {
    company: "Dropbox",
    jobs: 528,
    date: "2024-10-01",
    country: "US",
    industry: "Cloud Storage",
    category: "STRONG",
    url: "https://tech.co/news/companies-replace-workers-with-ai",
    sourceDomain: "tech.co",
    sourceName: "Tech.co",
    title: "Dropbox lays off 528 employees to refocus on AI",
    summary: "Dropbox laid off 528 employees as CEO Drew Houston refocused the business around AI-powered search and productivity tools.",
  },
  {
    company: "Cisco",
    jobs: 6000,
    date: "2024-08-01",
    country: "US",
    industry: "Networking",
    category: "STRONG",
    url: "https://news.crunchbase.com/startups/tech-layoffs/",
    sourceDomain: "news.crunchbase.com",
    sourceName: "Crunchbase News",
    title: "Cisco cuts 6,000 jobs shifting focus to AI networking and security",
    summary: "Cisco cut around 7% of its workforce shifting focus toward AI-driven networking and security products.",
  },
  {
    company: "Klarna",
    jobs: 4000,
    date: "2024-06-01",
    country: "SE",
    industry: "Fintech",
    category: "EXPLICIT",
    url: "https://finance.yahoo.com/news/ai-enabled-klarna-half-workforce-145442740.html",
    sourceDomain: "finance.yahoo.com",
    sourceName: "Yahoo Finance",
    title: "Klarna halves workforce as AI takes over operations",
    summary: "Klarna halved its workforce using AI. Its AI assistant handled workload equivalent of 700 full-time employees. CEO later admitted cuts went too far.",
  },
  {
    company: "Workday",
    jobs: 1750,
    date: "2025-02-07",
    country: "US",
    industry: "HR Software",
    category: "EXPLICIT",
    url: "https://fortune.com/2025/02/07/workday-layoff-ai-future-of-work/",
    sourceDomain: "fortune.com",
    sourceName: "Fortune",
    title: "Workday cuts 1,750 jobs to prioritize AI investment",
    summary: "Workday cut 8.5% of its workforce with CEO explicitly stating layoffs were needed to prioritize AI investment.",
  },
  {
    company: "UPS",
    jobs: 20000,
    date: "2025-04-30",
    country: "US",
    industry: "Logistics",
    category: "STRONG",
    url: "https://www.entrepreneur.com/business-news/ups-plans-to-lay-off-20000-employees-by-the-end-of-2025/490804",
    sourceDomain: "entrepreneur.com",
    sourceName: "Entrepreneur",
    title: "UPS to cut 20,000 jobs citing AI and automation",
    summary: "UPS announced cutting 20,000 jobs and closing 73 facilities, citing AI and automation with 400 facilities becoming partially or fully automated.",
  },
  {
    company: "Dell",
    jobs: 12500,
    date: "2025-06-01",
    country: "US",
    industry: "Technology",
    category: "STRONG",
    url: "https://news.crunchbase.com/startups/tech-layoffs/",
    sourceDomain: "news.crunchbase.com",
    sourceName: "Crunchbase News",
    title: "Dell cuts 12,500 jobs reorganizing around AI infrastructure",
    summary: "Dell cut roughly 12,500 jobs reorganizing around demand for AI servers and infrastructure.",
  },
  {
    company: "Microsoft",
    jobs: 15000,
    date: "2025-07-01",
    country: "US",
    industry: "Technology",
    category: "STRONG",
    url: "https://www.cnbc.com/2025/12/21/ai-job-cuts-amazon-microsoft-and-more-cite-ai-for-2025-layoffs.html",
    sourceDomain: "cnbc.com",
    sourceName: "CNBC",
    title: "Microsoft cuts 15,000 jobs in 2025 amid AI push",
    summary: "Microsoft cut around 15,000 jobs across 2025 as part of a push to simplify operations and invest heavily in AI.",
  },
  {
    company: "Amazon",
    jobs: 14000,
    date: "2025-10-01",
    country: "US",
    industry: "Technology/E-commerce",
    category: "EXPLICIT",
    url: "https://www.cnbc.com/2025/12/21/ai-job-cuts-amazon-microsoft-and-more-cite-ai-for-2025-layoffs.html",
    sourceDomain: "cnbc.com",
    sourceName: "CNBC",
    title: "Amazon cuts 14,000 corporate roles as AI agents expand",
    summary: "Amazon cut 14,000 corporate roles. CEO Andy Jassy stated that as Amazon rolls out more generative AI and autonomous agents, it will need fewer people in certain roles.",
  },
  {
    company: "Chegg",
    jobs: 388,
    date: "2025-10-27",
    country: "US",
    industry: "Education Technology",
    category: "EXPLICIT",
    url: "https://www.finalroundai.com/blog/chegg-layoffs-2025",
    sourceDomain: "finalroundai.com",
    sourceName: "Final Round AI",
    title: "Chegg cuts 50% of workforce as AI disrupts education market",
    summary: "Chegg cut 45% of its workforce after students stopped paying for homework help because ChatGPT and other AI tools provide the same answers for free.",
  },
  {
    company: "Paycom",
    jobs: 500,
    date: "2025-10-01",
    country: "US",
    industry: "Payroll/HR Tech",
    category: "EXPLICIT",
    url: "https://programs.com/resources/ai-layoffs/",
    sourceDomain: "programs.com",
    sourceName: "Programs.com",
    title: "Paycom lays off 500+ employees after automating with AI",
    summary: "Paycom laid off over 500 employees after automating payroll and back-office functions, with staff told directly their roles had been replaced by AI.",
  },
  {
    company: "Salesforce",
    jobs: 4000,
    date: "2025-09-01",
    country: "US",
    industry: "Enterprise Software",
    category: "EXPLICIT",
    url: "https://tech.co/news/companies-replace-workers-with-ai",
    sourceDomain: "tech.co",
    sourceName: "Tech.co",
    title: "Salesforce cuts support team from 9,000 to 5,000 using AI agents",
    summary: "Salesforce reduced customer support headcount from 9,000 to 5,000. CEO Marc Benioff stated that agentic AI agents now handle much of the support workload.",
  },
  {
    company: "HP Inc.",
    jobs: 5000,
    date: "2025-11-01",
    country: "US",
    industry: "Technology/Hardware",
    category: "EXPLICIT",
    url: "https://tech.co/news/companies-replace-workers-with-ai",
    sourceDomain: "tech.co",
    sourceName: "Tech.co",
    title: "HP to cut up to 6,000 jobs globally linked to AI adoption",
    summary: "HP confirmed cutting 4,000-6,000 jobs globally by 2028, explicitly linking the decision to AI adoption.",
  },
  {
    company: "Block",
    jobs: 4000,
    date: "2026-02-01",
    country: "US",
    industry: "Fintech",
    category: "EXPLICIT",
    url: "https://officechai.com/ai/block-lays-off-4000-employees-says-ai-tools-are-fundamentally-changing-how-work-is-done/",
    sourceDomain: "officechai.com",
    sourceName: "OfficeChai",
    title: "Block lays off 4,000 as Dorsey says AI is changing how work is done",
    summary: "Block slashed its workforce by nearly half. CEO Jack Dorsey stated a significantly smaller team using AI tools can do more and do it better.",
  },
  {
    company: "Pinterest",
    jobs: 700,
    date: "2026-01-01",
    country: "US",
    industry: "Social Media",
    category: "STRONG",
    url: "https://www.cbsnews.com/news/ai-layoffs-2026-artificial-intelligence-amazon-pinterest/",
    sourceDomain: "cbsnews.com",
    sourceName: "CBS News",
    title: "Pinterest cuts 15% of workforce in AI restructuring",
    summary: "Pinterest cut 15% of its workforce in an effort to restructure and move toward AI-powered features.",
  },
];

async function main() {
  let created = 0;

  for (const ev of events) {
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

    // Check if article already exists (some share URLs like crunchbase, tech.co, cnbc)
    // For shared URLs, we need unique articles per event - append company name as fragment
    let articleUrl = ev.url;
    const existingArticle = await prisma.article.findUnique({ where: { url: articleUrl } });

    // If URL already used by a different event's article, make it unique
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
        eventType: "AI_LAYOFF",
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
    console.log(`[${created}/19] ${ev.company}: ${ev.jobs} jobs (${ev.category}) → conservative=${jobs.conservative}, core=${jobs.core}, upper=${jobs.upper}`);
  }

  console.log(`\nDone. Created ${created} events.`);
  await prisma.$disconnect();
  await pool.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
