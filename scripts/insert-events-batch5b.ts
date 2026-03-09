import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

type Cat = "EXPLICIT" | "STRONG" | "MODERATE" | "WEAK";

function calcJobs(announced: number, cat: Cat) {
  const weights: Record<Cat, { conservative: number; core: number; upper: number }> = {
    EXPLICIT:  { conservative: 1.0,  core: 1.0,  upper: 1.0  },
    STRONG:    { conservative: 0.0,  core: 0.75, upper: 1.0  },
    MODERATE:  { conservative: 0.0,  core: 0.40, upper: 0.70 },
    WEAK:      { conservative: 0.0,  core: 0.15, upper: 0.35 },
  };
  const w = weights[cat];
  return {
    conservative: Math.round(announced * w.conservative),
    core: Math.round(announced * w.core),
    upper: Math.round(announced * w.upper),
  };
}

interface EventData {
  company: string;
  jobs: number;
  date: string;
  country: string;
  industry: string;
  category: Cat;
  eventType: "AI_LAYOFF" | "ROBOT_LAYOFF";
  url: string;
  sourceDomain: string;
  sourceName: string;
  title: string;
  summary: string;
}

const events: EventData[] = [
  {
    company: "HMRC",
    jobs: 2594,
    date: "2025-04-01",
    country: "GB",
    industry: "Government / Tax",
    category: "STRONG",
    eventType: "AI_LAYOFF",
    url: "https://www.cityam.com/hmrc-slashes-thousands-of-jobs-as-it-presses-ahead-with-digital-transformation/",
    sourceDomain: "cityam.com",
    sourceName: "City AM",
    title: "HMRC slashes thousands of jobs as it presses ahead with digital transformation",
    summary: "HMRC cut 2,594 full-time equivalent roles in 2024-25 as part of ongoing digital transformation, with AI and automation replacing manual tax processing and customer service functions.",
  },
  {
    company: "US Department of Defense (DOGE)",
    jobs: 60000,
    date: "2025-03-15",
    country: "US",
    industry: "Government / Defense",
    category: "MODERATE",
    eventType: "AI_LAYOFF",
    url: "https://www.military.com/daily-news/2025/03/15/pentagon-plans-cut-60000-civilian-jobs.html",
    sourceDomain: "military.com",
    sourceName: "Military.com",
    title: "Pentagon plans to cut 60,000 civilian jobs",
    summary: "The Pentagon announced plans to cut approximately 60,000 civilian positions as part of DOGE-driven restructuring, with AI and automation cited as enabling reduced administrative and support staffing.",
  },
  {
    company: "Argentina Federal Government (Milei)",
    jobs: 63000,
    date: "2024-12-30",
    country: "AR",
    industry: "Government",
    category: "WEAK",
    eventType: "AI_LAYOFF",
    url: "https://www.upi.com/Top_News/World-News/2024/12/30/argentina-govt-cuts-jobs/3631735577432/",
    sourceDomain: "upi.com",
    sourceName: "UPI",
    title: "Argentina government cuts 63,000 public sector jobs under Milei",
    summary: "President Milei's government eliminated 63,000 public sector positions in 2024 as part of austerity and modernization. While primarily driven by budget cuts, digitalization and AI deployment in government services contributed to enabling the reductions.",
  },
  {
    company: "Service Canada",
    jobs: 800,
    date: "2025-06-01",
    country: "CA",
    industry: "Government / Services",
    category: "MODERATE",
    eventType: "AI_LAYOFF",
    url: "https://www.stlawyers.ca/blog-news/service-canada-layoffs/",
    sourceDomain: "stlawyers.ca",
    sourceName: "Samfiru Tumarkin LLP",
    title: "Service Canada layoffs amid digital transformation",
    summary: "Service Canada laid off approximately 800 workers as part of a broader shift to digital and AI-powered service delivery, automating processing of employment insurance, pensions, and other benefits.",
  },
];

async function main() {
  let created = 0, skipped = 0;

  for (const ev of events) {
    const existing = await prisma.event.findFirst({
      where: { companyName: ev.company, eventType: ev.eventType as any },
    });
    if (existing) {
      console.log(`[SKIP] ${ev.company}: ${ev.jobs} jobs (${ev.eventType}) - already exists`);
      skipped++;
      continue;
    }

    const { conservative, core, upper } = calcJobs(ev.jobs, ev.category);

    const source = await prisma.source.upsert({
      where: { domain: ev.sourceDomain },
      update: {},
      create: { domain: ev.sourceDomain, name: ev.sourceName },
    });

    const article = await prisma.article.upsert({
      where: { url: ev.url },
      update: {},
      create: {
        url: ev.url,
        title: ev.title,
        summary: ev.summary,
        source: { connect: { id: source.id } },
        fetchedAt: new Date(),
      },
    });

    const event = await prisma.event.create({
      data: {
        eventType: ev.eventType as any,
        companyName: ev.company,
        country: ev.country,
        industry: ev.industry,
        dateAnnounced: new Date(ev.date),
        jobsCutAnnounced: ev.jobs,
        conservativeAiJobs: conservative,
        weightedAiJobs: core,
        upperAiJobs: upper,
        attributionCategory: ev.category as any,
        publicSummary: ev.summary,
        reviewStatus: "PROVISIONAL",
      },
    });

    await prisma.articleEvent.create({
      data: { articleId: article.id, eventId: event.id, isPrimary: true },
    });

    created++;
    console.log(`[${created}] ${ev.company}: ${ev.jobs} jobs (${ev.eventType}/${ev.category}) → conservative=${conservative}, core=${core}, upper=${upper}`);
  }

  // Fix NHS Grampian from 3000 to 700
  const grampian = await prisma.event.findFirst({ where: { companyName: "NHS Grampian" } });
  if (grampian && grampian.jobsCutAnnounced === 3000) {
    const { conservative, core, upper } = calcJobs(700, "EXPLICIT");
    await prisma.event.update({
      where: { id: grampian.id },
      data: {
        jobsCutAnnounced: 700,
        conservativeAiJobs: conservative,
        weightedAiJobs: core,
        upperAiJobs: upper,
        attributionCategory: "EXPLICIT",
      },
    });
    console.log(`[FIX] NHS Grampian: 3000 → 700 jobs, upgraded to EXPLICIT`);
  }

  // Fix Services Australia from MODERATE to WEAK
  const servAu = await prisma.event.findFirst({ where: { companyName: "Services Australia" } });
  if (servAu && servAu.attributionCategory === "MODERATE") {
    const { conservative, core, upper } = calcJobs(servAu.jobsCutAnnounced || 4241, "WEAK");
    await prisma.event.update({
      where: { id: servAu.id },
      data: {
        conservativeAiJobs: conservative,
        weightedAiJobs: core,
        upperAiJobs: upper,
        attributionCategory: "WEAK",
      },
    });
    console.log(`[FIX] Services Australia: MODERATE → WEAK`);
  }

  console.log(`\nDone. Created ${created} events, skipped ${skipped} duplicates.`);
  await pool.end();
}

main().catch((e) => { console.error(e); process.exit(1); });
