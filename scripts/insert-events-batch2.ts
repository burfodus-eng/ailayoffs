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

  // Google - multiple rounds of layoffs with AI restructuring
  {
    company: "Google",
    jobs: 12000,
    date: "2024-01-20",
    country: "US",
    industry: "Technology",
    category: "STRONG",
    eventType: "AI_LAYOFF",
    url: "https://www.cbsnews.com/news/google-layoffs-2024-sundar-pichai/",
    sourceDomain: "cbsnews.com",
    sourceName: "CBS News",
    title: "Google cuts 12,000 jobs amid AI restructuring push",
    summary: "Google cut 6% of its global workforce amid an aggressive push into AI. CEO Sundar Pichai warned of more cuts as the company invested heavily in AI infrastructure.",
  },
  // Meta - 600 AI unit layoffs
  {
    company: "Meta",
    jobs: 600,
    date: "2025-10-22",
    country: "US",
    industry: "Technology",
    category: "EXPLICIT",
    eventType: "AI_LAYOFF",
    url: "https://www.cnbc.com/2025/10/22/meta-layoffs-ai.html",
    sourceDomain: "cnbc.com",
    sourceName: "CNBC",
    title: "Meta lays off 600 from AI unit as it restructures",
    summary: "Meta laid off roughly 600 employees within its artificial intelligence unit. Chief AI Officer Alexandr Wang stated the restructuring aims to reduce bureaucracy and make each person 'more load-bearing'.",
  },
  // Meta - 5% performance-based cuts
  {
    company: "Meta",
    jobs: 3600,
    date: "2025-01-14",
    country: "US",
    industry: "Technology",
    category: "MODERATE",
    eventType: "AI_LAYOFF",
    url: "https://www.cnbc.com/2025/01/14/meta-targeting-lowest-performing-employees-in-latest-round-of-layoffs.html",
    sourceDomain: "cnbc.com",
    sourceName: "CNBC",
    title: "Meta cuts 5% of workforce in preparation for 'intense year' of AI",
    summary: "Mark Zuckerberg announced Meta would cut approximately 5% of its workforce, describing 2025 as an 'intense year' focused on AI development.",
  },
  // Morgan Stanley - AI-attributed layoffs
  {
    company: "Morgan Stanley",
    jobs: 2500,
    date: "2025-11-01",
    country: "US",
    industry: "Financial Services",
    category: "STRONG",
    eventType: "AI_LAYOFF",
    url: "https://www.entrepreneur.com/business-news/morgan-stanley-plans-to-cut-2000-workers-partly-due-to-ai/488752",
    sourceDomain: "entrepreneur.com",
    sourceName: "Entrepreneur",
    title: "Morgan Stanley cuts 2,500 jobs, partly due to AI automation",
    summary: "Morgan Stanley eliminated approximately 2,500 roles across investment banking, trading, and wealth management. Insiders say many cuts are thanks to AI making back-office work more efficient.",
  },
  // Deutsche Bank - AI compliance systems
  {
    company: "Deutsche Bank",
    jobs: 3500,
    date: "2024-02-01",
    country: "DE",
    industry: "Financial Services",
    category: "MODERATE",
    eventType: "AI_LAYOFF",
    url: "https://www.euronews.com/business/2024/02/01/deutsche-bank-plans-3500-job-cuts-to-boost-profitability",
    sourceDomain: "euronews.com",
    sourceName: "Euronews",
    title: "Deutsche Bank plans 3,500 job cuts with AI-based compliance systems",
    summary: "Deutsche Bank plans to lay off 3,500 employees by 2025, with savings partly driven by simplified workflows, automation, and AI-based compliance systems.",
  },
  // HSBC - AI-driven advisory tools
  {
    company: "HSBC",
    jobs: 5000,
    date: "2024-10-01",
    country: "GB",
    industry: "Financial Services",
    category: "MODERATE",
    eventType: "AI_LAYOFF",
    url: "https://fortune.com/europe/2025/01/31/european-banks-ubs-deutsche-hsbc-jp-morgan-goldman-sachs-job-cuts/",
    sourceDomain: "fortune.com",
    sourceName: "Fortune",
    title: "HSBC announces 5,000 job cuts as AI financial advisory tools expand",
    summary: "HSBC announced 5,000 job cuts as AI-driven financial advisory tools gained popularity and the bank restructured its investment banking operations in Europe and the US.",
  },
  // Citigroup - 20,000 by 2026
  {
    company: "Citigroup",
    jobs: 20000,
    date: "2024-01-01",
    country: "US",
    industry: "Financial Services",
    category: "MODERATE",
    eventType: "AI_LAYOFF",
    url: "https://finance.yahoo.com/news/citigroup-lay-off-1-000-143107879.html",
    sourceDomain: "finance.yahoo.com",
    sourceName: "Yahoo Finance",
    title: "Citigroup to cut 20,000 jobs by 2026 with AI-driven efficiency gains",
    summary: "Citigroup is trimming roughly 20,000 jobs by 2026 as part of a sweeping restructuring. The bank cited efficiencies gained through technology and AI as a key factor.",
  },
  // Goldman Sachs - AI efficiency-driven headcount management
  {
    company: "Goldman Sachs",
    jobs: 2400,
    date: "2025-05-01",
    country: "US",
    industry: "Financial Services",
    category: "MODERATE",
    eventType: "AI_LAYOFF",
    url: "https://fortune.com/2025/10/14/goldman-sachs-layoffs-headcount-earnings-ai-efficiencies/",
    sourceDomain: "fortune.com",
    sourceName: "Fortune",
    title: "Goldman Sachs flags continued AI-led job cuts through 2026",
    summary: "Goldman Sachs prepared to trim 3-5% of staff with AI efficiencies cited. Despite multiple rounds of layoffs, total headcount rose by 1,800, showing simultaneous cuts and hiring.",
  },
  // Telstra - Australia's largest telco
  {
    company: "Telstra",
    jobs: 2800,
    date: "2024-05-01",
    country: "AU",
    industry: "Telecommunications",
    category: "STRONG",
    eventType: "AI_LAYOFF",
    url: "https://ia.acs.org.au/article/2024/telstra-cuts-2-800-jobs-as-ai-takes-over.html",
    sourceDomain: "ia.acs.org.au",
    sourceName: "Information Age (ACS)",
    title: "Telstra cuts 2,800 jobs as AI takes over",
    summary: "Telstra announced 2,800 job cuts in its Enterprise overhaul. AI is being used to improve half of Telstra's key processes including automatically detecting and resolving faults.",
  },
  // Telstra - additional 2025 cuts
  {
    company: "Telstra",
    jobs: 2356,
    date: "2025-06-01",
    country: "AU",
    industry: "Telecommunications",
    category: "MODERATE",
    eventType: "AI_LAYOFF",
    url: "https://ia.acs.org.au/article/2025/telstra-says-550-new-job-cuts--not-a-result--of-ai.html",
    sourceDomain: "ia.acs.org.au",
    sourceName: "Information Age (ACS)",
    title: "Telstra cuts 2,356 more jobs in 2025 amid AI efficiency push",
    summary: "Telstra reduced workforce by 2,356 roles (7.4%) across 2025. While Telstra downplayed AI's role, critics argue AI-driven efficiency gains are enabling the cuts.",
  },
  // Vodafone - 11,000 global cuts
  {
    company: "Vodafone",
    jobs: 11000,
    date: "2023-05-16",
    country: "GB",
    industry: "Telecommunications",
    category: "MODERATE",
    eventType: "AI_LAYOFF",
    url: "https://www.cnn.com/2023/05/16/tech/vodaphone-job-cuts-uk-and-worldwide/index.html",
    sourceDomain: "cnn.com",
    sourceName: "CNN",
    title: "Vodafone plans 11,000 job cuts globally over three years",
    summary: "Vodafone CEO announced plans to shed 11,000 jobs over three years. While the company downplayed AI's role, automation is expected to perform manual tasks in German operations.",
  },
  // Ericsson - telecom layoffs
  {
    company: "Ericsson",
    jobs: 1200,
    date: "2024-03-25",
    country: "SE",
    industry: "Telecommunications",
    category: "MODERATE",
    eventType: "AI_LAYOFF",
    url: "https://www.rcrwireless.com/20240325/featured/ericsson-to-layoff-1200-in-sweden",
    sourceDomain: "rcrwireless.com",
    sourceName: "RCR Wireless",
    title: "Ericsson to lay off 1,200 in Sweden amid AI and cloud pivot",
    summary: "Ericsson announced 1,200 layoffs in Sweden as it pivots toward cloud-native solutions and AI capabilities to diversify beyond traditional hardware sales.",
  },
  // Nokia - massive telecom cuts
  {
    company: "Nokia",
    jobs: 14000,
    date: "2023-10-19",
    country: "FI",
    industry: "Telecommunications",
    category: "MODERATE",
    eventType: "AI_LAYOFF",
    url: "https://nokiamob.net/2025/05/03/workforce-reductions-at-ericsson-and-nokia/",
    sourceDomain: "nokiamob.net",
    sourceName: "NokiaMob",
    title: "Nokia to cut up to 14,000 jobs by end of 2026",
    summary: "Nokia announced cutting between 9,000 and 14,000 jobs by end of 2026 in response to market slowdown, with investments shifting to AI and automation technologies.",
  },
  // TCS - India's largest IT company
  {
    company: "TCS",
    jobs: 12000,
    date: "2025-07-01",
    country: "IN",
    industry: "IT Services",
    category: "STRONG",
    eventType: "AI_LAYOFF",
    url: "https://smefutures.com/when-ai-came-for-it-crowd-inside-tcss-12000-layoffs-and-new-face-of-tech-employment/",
    sourceDomain: "smefutures.com",
    sourceName: "SME Futures",
    title: "TCS cuts 12,000 jobs as AI reshapes India's IT outsourcing sector",
    summary: "TCS announced cutting about 2% of its workforce (over 12,000 jobs) as AI-driven automation replaces traditional IT service delivery roles. The company simultaneously targets hiring 12,000+ AI specialists.",
  },
  // Cognizant - major Indian IT cuts
  {
    company: "Cognizant",
    jobs: 10700,
    date: "2024-12-01",
    country: "IN",
    industry: "IT Services",
    category: "MODERATE",
    eventType: "AI_LAYOFF",
    url: "https://www.innovativefarming.in/cognizant-lay-off-10700-employees/",
    sourceDomain: "innovativefarming.in",
    sourceName: "Innovative Farming",
    title: "Cognizant lays off 10,700 employees amid AI transformation",
    summary: "Cognizant reduced its workforce by 10,700 employees, bringing its global workforce to 336,800, as the company invests in AI-driven transformation and ChatGPT-like tools.",
  },
  // Canva - technical writers laid off for AI (Australia)
  {
    company: "Canva",
    jobs: 10,
    date: "2025-03-01",
    country: "AU",
    industry: "Design Technology",
    category: "EXPLICIT",
    eventType: "AI_LAYOFF",
    url: "https://ia.acs.org.au/article/2025/canva-lays-off-technical-writers-amid-ai-push.html",
    sourceDomain: "ia.acs.org.au",
    sourceName: "Information Age (ACS)",
    title: "Canva lays off 10 of 12 technical writers after AI push",
    summary: "Canva laid off 10 of its 12 technical writers just months after encouraging employees to embrace AI tools. Engineers now take ownership of documentation with AI tool support.",
  },
  // Grammarly - AI-focused restructuring
  {
    company: "Grammarly",
    jobs: 230,
    date: "2024-02-07",
    country: "US",
    industry: "AI Writing Tools",
    category: "EXPLICIT",
    eventType: "AI_LAYOFF",
    url: "https://techcrunch.com/2024/02/09/grammarly-lays-off-230-employees-as-part-of-a-business-restructuring/",
    sourceDomain: "techcrunch.com",
    sourceName: "TechCrunch",
    title: "Grammarly lays off 230 employees to refocus on AI writing tools",
    summary: "Grammarly laid off approximately 230 employees (23% of workforce) as part of a business restructuring focused on AI-enabled writing and productivity tools. CEO stated they need a 'different mix of capabilities'.",
  },
  // Dukaan - Indian startup replaced 90% support staff
  {
    company: "Dukaan",
    jobs: 27,
    date: "2023-07-10",
    country: "IN",
    industry: "E-commerce",
    category: "EXPLICIT",
    eventType: "AI_LAYOFF",
    url: "https://edition.cnn.com/2023/07/12/business/dukaan-ceo-layoffs-ai-chatbot",
    sourceDomain: "cnn.com",
    sourceName: "CNN",
    title: "Dukaan CEO replaces 90% of support staff with AI chatbot",
    summary: "Dukaan CEO Suumit Shah replaced 90% of customer support staff with an AI chatbot built in two days. Resolution time dropped 98% and costs fell 85%. The announcement sparked widespread backlash.",
  },
  // BuzzFeed - AI content pivot
  {
    company: "BuzzFeed",
    jobs: 180,
    date: "2023-04-20",
    country: "US",
    industry: "Digital Media",
    category: "STRONG",
    eventType: "AI_LAYOFF",
    url: "https://www.hollywoodreporter.com/business/business-news/buzzfeed-ai-creators-news-shut-down-1235483607/",
    sourceDomain: "hollywoodreporter.com",
    sourceName: "Hollywood Reporter",
    title: "BuzzFeed shuts down news division and pivots to AI content",
    summary: "BuzzFeed cut 15% of staff and shut down BuzzFeed News while pivoting to AI-generated content. CEO told investors AI would become part of the company's core business.",
  },
  // CNET - AI content layoffs
  {
    company: "CNET",
    jobs: 12,
    date: "2023-02-01",
    country: "US",
    industry: "Digital Media",
    category: "STRONG",
    eventType: "AI_LAYOFF",
    url: "https://www.india.com/business/tech-news-website-cnet-to-layoff-several-long-time-employees-after-using-ai-to-produce-articles-connie-guglielmo-5925187/",
    sourceDomain: "india.com",
    sourceName: "India.com",
    title: "CNET lays off longtime employees after using AI to produce articles",
    summary: "CNET laid off several longtime employees (about 10% of workforce) after publishing 77 AI-generated articles. The practice was paused after public outcry over factual errors.",
  },
  // Business Insider - 21% staff cut for AI
  {
    company: "Business Insider",
    jobs: 200,
    date: "2025-05-01",
    country: "US",
    industry: "Digital Media",
    category: "EXPLICIT",
    eventType: "AI_LAYOFF",
    url: "https://variety.com/2025/digital/news/business-insider-layoffs-shift-toward-ai-live-events-1236412950/",
    sourceDomain: "variety.com",
    sourceName: "Variety",
    title: "Business Insider cuts 21% of staff going 'all-in on AI'",
    summary: "Business Insider laid off 21% of staffers. CEO Barbara Peng told staff the company would go 'all-in on AI' amid extreme traffic drops partly caused by AI search tools reducing website visits.",
  },
  // Washington Post - AI restructuring
  {
    company: "Washington Post",
    jobs: 300,
    date: "2026-02-01",
    country: "US",
    industry: "News Media",
    category: "MODERATE",
    eventType: "AI_LAYOFF",
    url: "https://www.techrepublic.com/article/news-washington-post-layoffs-ai-restructuring/",
    sourceDomain: "techrepublic.com",
    sourceName: "TechRepublic",
    title: "Washington Post cuts one-third of workforce amid AI strategy shift",
    summary: "The Washington Post cut roughly one-third of its workforce, including more than 300 journalists. CEO Will Lewis pushed a new strategy centered on subscriptions, events, and heavier use of AI.",
  },
  // Spotify - AI-driven workforce reduction
  {
    company: "Spotify",
    jobs: 1500,
    date: "2023-12-04",
    country: "SE",
    industry: "Music Streaming",
    category: "STRONG",
    eventType: "AI_LAYOFF",
    url: "https://www.npr.org/2023/12/04/1216950219/spotify-layoffs-17-percent-tech",
    sourceDomain: "npr.org",
    sourceName: "NPR",
    title: "Spotify cuts 17% of staff as it pivots toward AI-driven operations",
    summary: "Spotify cut 1,500 jobs (17% of workforce). By 2025, senior engineers stopped writing code entirely, with AI system Honk (built on Claude Code) merging 650+ agent-generated pull requests monthly.",
  },
  // PwC - Big Four consulting cuts
  {
    company: "PwC",
    jobs: 1800,
    date: "2024-09-01",
    country: "US",
    industry: "Professional Services",
    category: "MODERATE",
    eventType: "AI_LAYOFF",
    url: "https://ncscorp.ca/blog/big-4-layoffs-kpmg-deloitte-ey-pwc/",
    sourceDomain: "ncscorp.ca",
    sourceName: "NCS Corp",
    title: "PwC eliminates 1,800 US jobs as AI reshapes consulting",
    summary: "PwC announced the elimination of approximately 1,800 jobs (2.5% of US workforce), the first cuts of this scale since 2009, spanning from entry-level associates to managing directors.",
  },
  // McKinsey - AI-driven consulting cuts
  {
    company: "McKinsey",
    jobs: 2000,
    date: "2024-03-01",
    country: "US",
    industry: "Management Consulting",
    category: "STRONG",
    eventType: "AI_LAYOFF",
    url: "https://www.fastcompany.com/91463039/why-the-mckinsey-layoffs-are-a-warning-signal-for-consulting-in-the-ai-age-ai-layoffs-management-consulting",
    sourceDomain: "fastcompany.com",
    sourceName: "Fast Company",
    title: "McKinsey cuts nearly 10% of non-client-facing staff amid AI push",
    summary: "McKinsey laid off nearly 10% of non-client-facing staff. Reports indicate the motivation comes from AI and automation interests, signaling broader disruption of the consulting industry.",
  },
  // KPMG - audit workforce cuts
  {
    company: "KPMG",
    jobs: 330,
    date: "2024-11-01",
    country: "US",
    industry: "Professional Services",
    category: "MODERATE",
    eventType: "AI_LAYOFF",
    url: "https://ncscorp.ca/blog/big-4-layoffs-kpmg-deloitte-ey-pwc/",
    sourceDomain: "ncscorp.ca",
    sourceName: "NCS Corp",
    title: "KPMG cuts 330 US audit staff as AI automates audit processes",
    summary: "KPMG announced plans to lay off approximately 330 employees, representing nearly 4% of its US audit workforce of about 9,000 professionals, as AI automates audit functions.",
  },
  // Deloitte - consulting division cuts
  {
    company: "Deloitte",
    jobs: 800,
    date: "2024-09-01",
    country: "GB",
    industry: "Professional Services",
    category: "MODERATE",
    eventType: "AI_LAYOFF",
    url: "https://www.consultancy.uk/news/36894/job-cuts-loom-for-across-big-four-following-over-hiring",
    sourceDomain: "consultancy.uk",
    sourceName: "Consultancy UK",
    title: "Deloitte cuts up to 800 roles primarily in consulting division",
    summary: "Deloitte placed up to 800 roles at risk, primarily in its consulting division, as AI tools reshape the advisory landscape and reduce demand for traditional consulting services.",
  },
  // Optus - Australian telco
  {
    company: "Optus",
    jobs: 440,
    date: "2024-06-01",
    country: "AU",
    industry: "Telecommunications",
    category: "EXPLICIT",
    eventType: "AI_LAYOFF",
    url: "https://www.lightreading.com/network-automation/australia-s-optus-to-cut-440-jobs-blames-automation-reports",
    sourceDomain: "lightreading.com",
    sourceName: "Light Reading",
    title: "Optus cuts 440 jobs, blames automation and digitization",
    summary: "Optus cut 440 jobs citing introduction of automated processes and deployment of digital technologies. A spokesperson stated the company was 'embracing next-generation technologies, like digitization and automation'.",
  },
  // Commonwealth Bank Australia - AI chatbot replacing support staff
  {
    company: "Commonwealth Bank",
    jobs: 90,
    date: "2025-06-01",
    country: "AU",
    industry: "Financial Services",
    category: "EXPLICIT",
    eventType: "AI_LAYOFF",
    url: "https://ia.acs.org.au/article/2025/cba-replaces-90-support-staff-with-ai-chatbot.html",
    sourceDomain: "ia.acs.org.au",
    sourceName: "Information Age (ACS)",
    title: "Commonwealth Bank replaces 90 support staff with AI chatbot",
    summary: "Commonwealth Bank made 45 Direct Banking workers redundant after an AI chatbot started handling inbound customer enquiries, with another 45 set to follow. CBA later reversed some cuts after union pressure.",
  },
  // Commonwealth Bank - broader 300 job cut
  {
    company: "Commonwealth Bank",
    jobs: 300,
    date: "2026-02-24",
    country: "AU",
    industry: "Financial Services",
    category: "STRONG",
    eventType: "AI_LAYOFF",
    url: "https://au.headtopics.com/news/commonwealth-bank-to-cut-300-jobs-amid-ai-and-skills-80172294",
    sourceDomain: "headtopics.com",
    sourceName: "HeadTopics",
    title: "Commonwealth Bank cuts 300 jobs amid AI push and $90M workforce program",
    summary: "CBA is cutting 300 positions, primarily in technology roles, while investing $90 million in a three-year AI workforce program to prepare employees for AI-driven changes.",
  },
  // Shopify - AI-first hiring freeze (not layoffs but significant policy)
  {
    company: "Shopify",
    jobs: 0,
    date: "2025-04-07",
    country: "CA",
    industry: "E-commerce",
    category: "EXPLICIT",
    eventType: "AI_LAYOFF",
    url: "https://www.cnbc.com/2025/04/07/shopify-ceo-prove-ai-cant-do-jobs-before-asking-for-more-headcount.html",
    sourceDomain: "cnbc.com",
    sourceName: "CNBC",
    title: "Shopify CEO mandates proving AI can't do job before any new hire",
    summary: "Shopify CEO Tobi Lutke issued memo requiring all managers to prove AI cannot do a job before requesting new headcount. AI usage added to performance reviews. 'Everyone means everyone' including executives.",
  },

  // ===== ROBOT/AUTOMATION LAYOFFS =====

  // Amazon - 1 million robots deployed
  {
    company: "Amazon",
    jobs: 160000,
    date: "2025-07-02",
    country: "US",
    industry: "E-commerce/Logistics",
    category: "STRONG",
    eventType: "ROBOT_LAYOFF",
    url: "https://www.cnbc.com/2025/07/02/amazon-deploys-its-1-millionth-robot-in-a-sign-of-more-job-automation.html",
    sourceDomain: "cnbc.com",
    sourceName: "CNBC",
    title: "Amazon deploys 1 millionth robot, plans to avoid hiring 160,000 workers",
    summary: "Amazon deployed its one millionth warehouse robot across 300+ fulfillment centers. Leaked documents reveal plans to avoid hiring 160,000+ US workers by 2027, saving ~30 cents per shipped item.",
  },

  // ===== AI JOBS CREATED =====

  // IKEA - reskilled workers (positive AI story)
  {
    company: "IKEA",
    jobs: 8500,
    date: "2023-09-01",
    country: "SE",
    industry: "Retail",
    category: "EXPLICIT",
    eventType: "AI_JOB_CREATED",
    url: "https://stealthesethoughts.com/2023/09/01/ikea-reskill-employees-and-boost-sales-by-billions/",
    sourceDomain: "stealthesethoughts.com",
    sourceName: "Steal These Thoughts",
    title: "IKEA reskills 8,500 call center workers to interior design advisors after AI chatbot",
    summary: "IKEA deployed AI chatbot Billie handling 47% of call center queries, then reskilled 8,500 call center workers into interior design advisors rather than laying them off, generating $1.4 billion in new revenue.",
  },
  // TCS hiring AI specialists
  {
    company: "TCS",
    jobs: 12000,
    date: "2025-01-01",
    country: "IN",
    industry: "IT Services",
    category: "STRONG",
    eventType: "AI_JOB_CREATED",
    url: "https://www.angelone.in/news/share-market/why-tcs-infosys-and-wipro-are-cutting-jobs-despite-revenue-growth",
    sourceDomain: "angelone.in",
    sourceName: "AngelOne",
    title: "TCS targets hiring 12,000+ AI specialists for 2025",
    summary: "While cutting 12,000 traditional roles, TCS simultaneously targets hiring 12,000+ AI specialists for 2025, reflecting the shift from traditional IT to AI-first service delivery.",
  },
  // Infosys hiring digital transformation experts
  {
    company: "Infosys",
    jobs: 15000,
    date: "2025-01-01",
    country: "IN",
    industry: "IT Services",
    category: "STRONG",
    eventType: "AI_JOB_CREATED",
    url: "https://www.angelone.in/news/share-market/why-tcs-infosys-and-wipro-are-cutting-jobs-despite-revenue-growth",
    sourceDomain: "angelone.in",
    sourceName: "AngelOne",
    title: "Infosys hiring 15,000+ digital transformation and AI experts",
    summary: "Infosys is hiring 15,000+ digital transformation experts as it pivots from traditional IT services to AI-driven solutions, even as it slows down fresher onboarding.",
  },
  // Accenture - massive AI hiring
  {
    company: "Accenture",
    jobs: 77000,
    date: "2025-01-01",
    country: "US",
    industry: "Professional Services",
    category: "EXPLICIT",
    eventType: "AI_JOB_CREATED",
    url: "https://www.fastcompany.com/91463039/why-the-mckinsey-layoffs-are-a-warning-signal-for-consulting-in-the-ai-age-ai-layoffs-management-consulting",
    sourceDomain: "fastcompany.com",
    sourceName: "Fast Company",
    title: "Accenture hires 77,000 AI and data professionals in 2025",
    summary: "Despite also cutting some roles, Accenture hired over 77,000 AI and data professionals in 2025, representing one of the largest AI hiring surges by any company.",
  },
  // Amazon AWS - data center jobs
  {
    company: "Amazon (AWS)",
    jobs: 1750,
    date: "2025-01-01",
    country: "US",
    industry: "Cloud Computing",
    category: "EXPLICIT",
    eventType: "AI_JOB_CREATED",
    url: "https://www.veritone.com/blog/ai-jobs-growth-q1-2025-labor-market-analysis/",
    sourceDomain: "veritone.com",
    sourceName: "Veritone",
    title: "AWS commits $40B+ creating 1,750+ jobs for AI data centers",
    summary: "AWS committed over $40 billion across Pennsylvania ($20B, 1,250 jobs), Georgia ($11B), and North Carolina ($10B, 500 jobs) to build AI data centers and infrastructure.",
  },

  // ===== PRODUCTIVITY GAINS / CLAIMS =====

  // Wendy's AI drive-thru
  {
    company: "Wendy's",
    jobs: 0,
    date: "2025-02-13",
    country: "US",
    industry: "Fast Food",
    category: "MODERATE",
    eventType: "PRODUCTIVITY_GAIN",
    url: "https://www.restaurantdive.com/news/wendys-deploy-digital-menu-boards-drive-thru-ai-500-restaurants-2025/746977/",
    sourceDomain: "restaurantdive.com",
    sourceName: "Restaurant Dive",
    title: "Wendy's deploys AI drive-thru ordering to 500+ restaurants",
    summary: "Wendy's deploying Fresh AI voice ordering system to 500-600 of its nearly 6,000 US restaurants in 2025. Company says AI assists workers rather than replaces them, but future impact on drive-thru staffing is uncertain.",
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
