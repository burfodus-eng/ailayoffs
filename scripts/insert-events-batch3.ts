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

  // --- Retail ---
  {
    company: "Walmart",
    jobs: 1500,
    date: "2025-05-21",
    country: "US",
    industry: "Retail",
    category: "STRONG",
    eventType: "AI_LAYOFF",
    url: "https://www.newsweek.com/walmart-celebrates-automation-us-job-cuts-reach-multiyear-high-11107369",
    sourceDomain: "newsweek.com",
    sourceName: "Newsweek",
    title: "Walmart cuts 1,500 corporate jobs while investing $500M in AI and robotics",
    summary: "Walmart eliminated 1,500 corporate positions in Bentonville, Hoboken and other tech hubs while simultaneously investing over $500 million in AI and robotics. Over 50% of fulfillment center volume now comes from automation.",
  },
  {
    company: "Target",
    jobs: 1200,
    date: "2025-06-15",
    country: "US",
    industry: "Retail",
    category: "STRONG",
    eventType: "AI_LAYOFF",
    url: "https://www.wsws.org/en/articles/2025/10/25/jobs-o25.html",
    sourceDomain: "wsws.org",
    sourceName: "World Socialist Web Site",
    title: "Target eliminates 1,200 distribution and logistics roles amid automation push",
    summary: "Target eliminated 1,200 distribution and logistics roles across four regional distribution centers as part of a plan to automate and consolidate operations, investing in robotics and automation to improve speed and accuracy.",
  },
  {
    company: "Tesco",
    jobs: 400,
    date: "2025-01-29",
    country: "GB",
    industry: "Retail",
    category: "MODERATE",
    eventType: "AI_LAYOFF",
    url: "https://www.retailgazette.co.uk/blog/2025/01/tesco-cut-400-jobs/",
    sourceDomain: "retailgazette.co.uk",
    sourceName: "Retail Gazette",
    title: "Tesco to axe 400 jobs as it finds 'more efficient ways of working'",
    summary: "Tesco cut 400 jobs across stores and head office management, impacting management positions at head office, Tesco Mobile managers, and in-store bakery employees, citing the need to simplify and find more efficient ways of working.",
  },
  {
    company: "Sainsbury's",
    jobs: 3000,
    date: "2025-01-23",
    country: "GB",
    industry: "Retail",
    category: "MODERATE",
    eventType: "AI_LAYOFF",
    url: "https://www.ctol.digital/news/sainsburys-axes-3000-jobs-labour-tax-hikes-automation-future-uk-retail/",
    sourceDomain: "ctol.digital",
    sourceName: "CTOL Digital Solutions",
    title: "Sainsbury's slashes 3,000 roles as automation and tax pressures redefine retail",
    summary: "Sainsbury's announced plans to cut 3,000 jobs (2% of workforce) including 20% of senior management and closing 61 in-store cafes. Part of a £1 billion cost reduction plan leveraging automation and technology under its 'Next Level' strategy.",
  },

  // --- Automotive ---
  {
    company: "Tesla",
    jobs: 14000,
    date: "2024-04-15",
    country: "US",
    industry: "Automotive",
    category: "MODERATE",
    eventType: "AI_LAYOFF",
    url: "https://fortune.com/2024/04/15/elon-musk-tesla-cut-10-percent-global-workforce-14000-employees-slowing-ev-demand/",
    sourceDomain: "fortune.com",
    sourceName: "Fortune",
    title: "Tesla cuts 10% of global workforce — 14,000 employees — amid pivot to self-driving and AI",
    summary: "Tesla laid off 10% of its global workforce (approximately 14,000 workers) as Elon Musk pivoted the company toward building fully self-driving cars and robotaxis, dropping plans for a lower-cost EV.",
  },
  {
    company: "Bosch",
    jobs: 5550,
    date: "2024-11-25",
    country: "DE",
    industry: "Automotive/Manufacturing",
    category: "MODERATE",
    eventType: "AI_LAYOFF",
    url: "https://www.thehrdigest.com/bosch-announces-job-cuts-deals-another-blow-to-the-automotive-industry/",
    sourceDomain: "thehrdigest.com",
    sourceName: "The HR Digest",
    title: "Bosch announces 5,550 job cuts amid EV slowdown and automation push",
    summary: "Bosch's workforce reduction plans affect around 5,550 jobs globally, with a significant chunk in Germany. The company had previously announced plans to cut 7,000 employees in October 2024.",
  },
  {
    company: "Siemens",
    jobs: 6000,
    date: "2025-03-18",
    country: "DE",
    industry: "Manufacturing/Technology",
    category: "STRONG",
    eventType: "AI_LAYOFF",
    url: "https://www.ctol.digital/news/siemens-cuts-jobs-expands-green-energy-markets/",
    sourceDomain: "ctol.digital",
    sourceName: "CTOL Digital Solutions",
    title: "Siemens confirms 6,000 job cuts in automation and EV segments",
    summary: "Siemens cut approximately 6,000 jobs worldwide, with 2,850 in Germany, primarily within the Digital Industries (automation) division. An additional 450 jobs affected in the EV charging business.",
  },

  // --- Legal ---
  {
    company: "Baker McKenzie",
    jobs: 1000,
    date: "2026-02-11",
    country: "US",
    industry: "Legal",
    category: "EXPLICIT",
    eventType: "AI_LAYOFF",
    url: "https://news.bloomberglaw.com/business-and-practice/wake-up-call-hundreds-laid-off-at-baker-mckenzie-as-ai-grows",
    sourceDomain: "news.bloomberglaw.com",
    sourceName: "Bloomberg Law",
    title: "Baker McKenzie cuts up to 1,000 support staff citing AI pivot",
    summary: "Law firm Baker McKenzie laid off up to 1,000 support staff (about 10% of global workforce) explicitly citing AI. Roles affected include know-how, research, marketing, and secretarial positions. The firm stated it was 'rethinking the ways in which we work, including through our use of AI.'",
  },

  // --- Travel ---
  {
    company: "Expedia",
    jobs: 1500,
    date: "2024-02-15",
    country: "US",
    industry: "Travel/Technology",
    category: "MODERATE",
    eventType: "AI_LAYOFF",
    url: "https://www.phocuswire.com/expedia-group-layoffs-2025",
    sourceDomain: "phocuswire.com",
    sourceName: "PhocusWire",
    title: "Expedia Group cuts 1,500 jobs amid AI-driven technological transformation",
    summary: "Expedia Group announced up to 1,500 job cuts as part of wider company reshaping. CEO Ariane Gorin described AI as a 'step function' opportunity. The company appointed a Chief AI Officer and hired new AI-focused directors.",
  },
  {
    company: "Booking.com",
    jobs: 1000,
    date: "2025-07-16",
    country: "NL",
    industry: "Travel/Technology",
    category: "STRONG",
    eventType: "AI_LAYOFF",
    url: "https://www.phocuswire.com/booking-holdings-job-cuts-system-modernization",
    sourceDomain: "phocuswire.com",
    sourceName: "PhocusWire",
    title: "Booking.com cuts up to 1,000 jobs globally as CEO cites AI transformation",
    summary: "Booking.com confirmed cuts of up to 1,000 jobs globally and 900 in Amsterdam (10% of Amsterdam workforce). Part of a $400-450M annual savings plan. CEO Glenn Fogel stated AI would reshape operations across customer service, legal review, HR, and pricing.",
  },

  // --- Banking / Finance (European) ---
  {
    company: "ING",
    jobs: 950,
    date: "2025-10-28",
    country: "NL",
    industry: "Banking",
    category: "EXPLICIT",
    eventType: "AI_LAYOFF",
    url: "https://nltimes.nl/2025/10/28/ing-may-cut-950-jobs-netherlands-ai-replaces-roles",
    sourceDomain: "nltimes.nl",
    sourceName: "NL Times",
    title: "ING may cut 950 jobs in Netherlands as AI replaces some roles",
    summary: "ING announced approximately 950 jobs at risk through December 2026, explicitly citing digitalization, centralization, and efficiency through the use of AI. The bank will prioritize retraining and internal transfers before layoffs.",
  },
  {
    company: "ABN Amro",
    jobs: 5200,
    date: "2025-11-14",
    country: "NL",
    industry: "Banking",
    category: "EXPLICIT",
    eventType: "AI_LAYOFF",
    url: "https://brusselssignal.eu/2025/11/dutch-bank-abn-amro-to-cut-5200-jobs-by-2028-in-ai-driven-overhaul/",
    sourceDomain: "brusselssignal.eu",
    sourceName: "Brussels Signal",
    title: "ABN Amro to cut 5,200 jobs by 2028 in AI-driven overhaul",
    summary: "ABN Amro announced plans to cut 5,200 full-time positions (nearly a quarter of its workforce) by 2028. CEO Marguerite Bérard argued AI will assume part of the workload. IT, AI deployment, and API integration are central to the plan. Already cut 1,500 positions in 2025.",
  },
  {
    company: "BNP Paribas",
    jobs: 1200,
    date: "2026-01-15",
    country: "FR",
    industry: "Banking",
    category: "MODERATE",
    eventType: "AI_LAYOFF",
    url: "https://www.connexionfrance.com/news/france-sees-record-bank-branch-closures-as-bnp-and-societe-generale-lead-cuts/744961",
    sourceDomain: "connexionfrance.com",
    sourceName: "Connexion France",
    title: "BNP Paribas eliminates 1,200 positions amid branch closures and digitalization",
    summary: "BNP Paribas announced plans to eliminate 1,200 positions (600 in France), closing 16% of its branches as part of digitalization. Some employees are being replaced by AI as agencies close.",
  },
  {
    company: "Barclays",
    jobs: 200,
    date: "2025-01-15",
    country: "GB",
    industry: "Banking",
    category: "WEAK",
    eventType: "AI_LAYOFF",
    url: "https://www.efinancialcareers.com/news/barclays-job-cuts-2025",
    sourceDomain: "efinancialcareers.com",
    sourceName: "eFinancialCareers",
    title: "Barclays cuts 200 investment banking jobs",
    summary: "Barclays cut 200 jobs from its investment bank, affecting people in investment banking, research and global markets. Cuts skewed towards expensive managing directors.",
  },

  // --- Australian ---
  {
    company: "WiseTech Global",
    jobs: 2000,
    date: "2026-02-25",
    country: "AU",
    industry: "Technology/Logistics",
    category: "EXPLICIT",
    eventType: "AI_LAYOFF",
    url: "https://www.computerworld.com/article/4137200/australias-wisetech-to-cut-2000-jobs-as-ai-renders-manual-coding-obsolete.html",
    sourceDomain: "computerworld.com",
    sourceName: "Computerworld",
    title: "WiseTech Global to cut 2,000 jobs as AI renders manual coding obsolete",
    summary: "WiseTech Global will axe about 2,000 jobs (nearly a third of its global workforce) in a two-year AI restructuring. CEO stated: 'the era of manually writing code as the core act of engineering is over.' Product, development, and customer service teams cut by up to 50%.",
  },
  {
    company: "Commonwealth Bank",
    jobs: 300,
    date: "2026-02-20",
    country: "AU",
    industry: "Banking",
    category: "STRONG",
    eventType: "AI_LAYOFF",
    url: "https://ia.acs.org.au/article/2026/wisetech-axes-2-000-jobs--cba-cuts-hundreds-as-ai-ramps.html",
    sourceDomain: "ia.acs.org.au",
    sourceName: "Information Age (ACS)",
    title: "Commonwealth Bank cuts approximately 300 jobs as AI ramps up",
    summary: "CBA cut approximately 300 jobs across technology, retail, business, institutional banking, and HR. This follows the bank's earlier failed experiment replacing 45 call centre workers with an AI chatbot, which had to be reversed.",
  },
  {
    company: "Westpac",
    jobs: 1500,
    date: "2025-06-01",
    country: "AU",
    industry: "Banking",
    category: "MODERATE",
    eventType: "AI_LAYOFF",
    url: "https://au.finance.yahoo.com/news/big-bank-ready-cut-1500-004242129.html",
    sourceDomain: "au.finance.yahoo.com",
    sourceName: "Yahoo Finance Australia",
    title: "Westpac to cut 1,500 jobs while investing heavily in AI",
    summary: "Westpac will cut 1,500 jobs (about 5% of its 36,000 workforce). The bank is investing heavily in AI, having established four reusable AI solution patterns, delivered eight AI solutions, and was constructing 14 more.",
  },
  {
    company: "ANZ",
    jobs: 3500,
    date: "2025-03-01",
    country: "AU",
    industry: "Banking",
    category: "WEAK",
    eventType: "AI_LAYOFF",
    url: "https://thenightly.com.au/business/companies/analysis-anz-nab-job-cuts-are-just-the-start-of-killing-season-at-australias-big-banks-c-19976062",
    sourceDomain: "thenightly.com.au",
    sourceName: "The Nightly",
    title: "ANZ cuts 3,500 staff and 1,000 contractors in restructure",
    summary: "ANZ cut 3,500 staff and 1,000 contractors with technology divisions impacted. CEO Nuno Matos said the cuts had 'absolutely nothing to do with AI', though the timing coincides with industry-wide AI adoption.",
  },
  {
    company: "NAB",
    jobs: 410,
    date: "2025-03-01",
    country: "AU",
    industry: "Banking",
    category: "WEAK",
    eventType: "AI_LAYOFF",
    url: "https://www.itnews.com.au/news/nab-makes-cuts-to-technology-and-enterprise-operations-division-620186",
    sourceDomain: "itnews.com.au",
    sourceName: "iTnews",
    title: "NAB eliminates 410 positions and relocates 127 jobs abroad",
    summary: "NAB eliminated 410 positions and relocated 127 jobs offshore, with cuts concentrated in technology and enterprise operations division.",
  },

  // --- Real Estate ---
  {
    company: "Redfin",
    jobs: 450,
    date: "2025-02-12",
    country: "US",
    industry: "Real Estate/Technology",
    category: "WEAK",
    eventType: "AI_LAYOFF",
    url: "https://www.housingwire.com/articles/redfin-to-lay-off-450-employees-in-its-rental-division/",
    sourceDomain: "housingwire.com",
    sourceName: "HousingWire",
    title: "Redfin to cut 450 roles following Zillow partnership deal",
    summary: "Redfin announced 450 positions to be cut between February and July 2025 following a partnership with Zillow. This is the sixth round of layoffs at Redfin since June 2022.",
  },

  // ===== ROBOT LAYOFFS =====
  {
    company: "Foxconn",
    jobs: 60000,
    date: "2016-05-25",
    country: "CN",
    industry: "Electronics Manufacturing",
    category: "EXPLICIT",
    eventType: "ROBOT_LAYOFF",
    url: "https://fortune.com/2016/05/26/foxconn-factory-robot-workers/",
    sourceDomain: "fortune.com",
    sourceName: "Fortune",
    title: "Foxconn replaces 60,000 factory workers with robots",
    summary: "iPhone manufacturer Foxconn replaced 60,000 factory workers with automation robots at its factory in Kunshan, China. The workforce at the factory was reduced from 110,000 to 50,000.",
  },
  {
    company: "Amazon",
    jobs: 160000,
    date: "2025-10-21",
    country: "US",
    industry: "Retail/Logistics",
    category: "STRONG",
    eventType: "ROBOT_LAYOFF",
    url: "https://www.cnbc.com/2025/10/22/amazon-switch-to-robots-will-save-it-up-to-4-billion-a-year-morgan-stanley-says.html",
    sourceDomain: "cnbc.com",
    sourceName: "CNBC",
    title: "Amazon plans to avoid 160,000 new hires by 2027 via warehouse robots",
    summary: "Amazon's robotics division aims to automate 75% of operations by 2033, expecting to avoid about 160,000 new roles by 2027. Over 1 million robots now work in 300+ fulfillment centers. The Shreveport warehouse already reduced staffing by 25% due to automation.",
  },
  {
    company: "John Deere",
    jobs: 2167,
    date: "2024-07-07",
    country: "US",
    industry: "Agriculture/Manufacturing",
    category: "MODERATE",
    eventType: "ROBOT_LAYOFF",
    url: "https://www.cnn.com/2024/07/07/business/john-deere-mass-layoffs-2024/index.html",
    sourceDomain: "cnn.com",
    sourceName: "CNN",
    title: "John Deere lays off 2,167 workers while pushing autonomous farming technology",
    summary: "John Deere laid off 2,167 workers in 2024 at facilities in Iowa and Illinois. The company simultaneously revealed autonomous machines at CES 2025 and aims for a fully autonomous corn/soy production system by end of decade.",
  },

  // --- Port Automation ---
  {
    company: "US East Coast Ports (ILA)",
    jobs: 572,
    date: "2024-10-01",
    country: "US",
    industry: "Shipping/Ports",
    category: "STRONG",
    eventType: "ROBOT_LAYOFF",
    url: "https://www.supplychainbrain.com/articles/40432-strike-at-us-ports-brings-debate-over-automation-front-and-center",
    sourceDomain: "supplychainbrain.com",
    sourceName: "SupplyChainBrain",
    title: "Port automation costs 572 jobs per year at LA/Long Beach terminals",
    summary: "A 2022 Economic Roundtable study found automation cost 572 jobs each year at partially automated terminals at LA/Long Beach ports. In October 2024, 45,000 longshoremen struck across 36 ports over semi-automated crane deployment. A January 2025 deal blocked fully automated technology.",
  },

  // --- Manufacturing ---
  {
    company: "Woolworths (Australia)",
    jobs: 400,
    date: "2024-06-01",
    country: "AU",
    industry: "Retail/Supermarket",
    category: "STRONG",
    eventType: "ROBOT_LAYOFF",
    url: "https://www.forrester.com/blogs/the-automation-paradox-strikes-again-lessons-from-woolworths-amazon-era-productivity-play/",
    sourceDomain: "forrester.com",
    sourceName: "Forrester",
    title: "Woolworths deploys AI warehouse monitoring, sparking 17-day strikes",
    summary: "Woolworths introduced AI-generated algorithms to monitor worker movements and set 'pick rates' in distribution centres. Workers wearing headsets receive AI-directed instructions. Industrial action across Victoria and NSW warehouses cost $95 million. Office-based staff cuts are part of a $400M cost-saving plan.",
  },

  // ===== AI JOBS CREATED =====
  {
    company: "AI Industry (Global)",
    jobs: 8000000,
    date: "2025-06-01",
    country: "GLOBAL",
    industry: "Technology (Cross-Industry)",
    category: "STRONG",
    eventType: "AI_JOB_CREATED",
    url: "https://www.veritone.com/blog/ai-jobs-growth-q1-2025-labor-market-analysis/",
    sourceDomain: "veritone.com",
    sourceName: "Veritone",
    title: "6-8 million unfilled AI roles globally with demand 10x higher than supply",
    summary: "Industry estimates indicate 6-8 million unfilled AI specialist roles globally, with demand 10x higher than supply. AI job listings increased over 600% in the US over three years. Healthcare, finance, education, logistics, and agriculture are all hiring AI talent at record speed.",
  },
  {
    company: "Baker McKenzie (AI Hiring)",
    jobs: 200,
    date: "2026-02-11",
    country: "US",
    industry: "Legal",
    category: "MODERATE",
    eventType: "AI_JOB_CREATED",
    url: "https://abovethelaw.com/2026/02/baker-mckenzie-blamed-ai-for-massive-layoff-but-the-problem-is-much-more-complicated/",
    sourceDomain: "abovethelaw.com",
    sourceName: "Above the Law",
    title: "Law firms investing in AI-literate attorney and technologist roles",
    summary: "While Baker McKenzie cut 1,000 support staff, the legal industry is simultaneously creating new AI-literate roles. Law firms favor smaller teams of AI-literate attorneys who can do more with less. The 2024 graduate employment rate hit 93.4%, the highest on record.",
  },

  // ===== GOVERNMENT / PUBLIC SECTOR =====
  {
    company: "US Federal Government (DOGE)",
    jobs: 300000,
    date: "2025-02-01",
    country: "US",
    industry: "Government",
    category: "MODERATE",
    eventType: "AI_LAYOFF",
    url: "https://www.newsweek.com/doge-layoffs-federal-government-tracker-2025-dod-cuts-2042525",
    sourceDomain: "newsweek.com",
    sourceName: "Newsweek",
    title: "DOGE initiative drives approximately 300,000 federal job cuts",
    summary: "The Department of Government Efficiency (DOGE), established by executive order on January 20, 2025, drove approximately 300,000 federal layoffs. The stated objective was to modernize IT and maximize productivity. Over 123,000 took deferred resignation. Economists estimate nearly 1 million jobs affected including indirect impacts.",
  },

  // ===== PRODUCTIVITY GAINS / NOTABLE EVENTS =====
  {
    company: "Lemonade",
    jobs: 100,
    date: "2025-03-01",
    country: "US",
    industry: "Insurance",
    category: "STRONG",
    eventType: "AI_LAYOFF",
    url: "https://blog.ourcrowd.com/lemonade-ceo-sees-ai-replacing-engineers-and-actuaries-soon/",
    sourceDomain: "blog.ourcrowd.com",
    sourceName: "OurCrowd Blog",
    title: "Lemonade CEO announces AI will replace engineers and actuaries",
    summary: "Lemonade CEO Daniel Schrieber announced in March 2025 that AI may replace employees in engineering, actuarial, legal and compliance functions. AI bot 'Jim' already handles one-third of claims autonomously. The insurtech operates with far fewer staff than traditional insurers.",
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
