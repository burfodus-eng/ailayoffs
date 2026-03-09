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

// ============================================================================
// AI-DEDICATED COMPANIES — JOBS CREATED
//
// These are companies that exist BECAUSE of AI. Every employee role at these
// companies is an AI-created job. Events track incremental headcount growth.
//
// Data sources: seo.ai, electroiq.com, getlatka.com, Wikipedia, stockanalysis.com,
// cnbc.com, tracxn.com, pitchbook.com, leadiq.com, and other business intelligence
// platforms. All figures are best-available public estimates.
// ============================================================================

const events: EventData[] = [

  // ===== OPENAI =====
  // Founded 2015, HQ San Francisco
  // Source: seo.ai/blog/how-many-people-work-at-openai (yearly timeline table)
  {
    company: "OpenAI",
    jobs: 10,
    date: "2015-12-11",
    country: "US",
    industry: "Artificial Intelligence",
    category: "EXPLICIT",
    eventType: "AI_JOB_CREATED",
    url: "https://seo.ai/blog/how-many-people-work-at-openai",
    sourceDomain: "seo.ai",
    sourceName: "SEO.ai",
    title: "OpenAI founded with approximately 10 employees",
    summary: "OpenAI was founded in December 2015 as a non-profit AI research lab by Sam Altman, Elon Musk, and others with approximately 10 initial employees focused on AI safety research.",
  },
  {
    company: "OpenAI",
    jobs: 140,
    date: "2020-01-01",
    country: "US",
    industry: "Artificial Intelligence",
    category: "EXPLICIT",
    eventType: "AI_JOB_CREATED",
    url: "https://seo.ai/blog/how-many-people-work-at-openai",
    sourceDomain: "seo.ai",
    sourceName: "SEO.ai",
    title: "OpenAI grows to 250 employees by 2020",
    summary: "OpenAI grew from approximately 10 employees at founding to 250 by 2020, adding roughly 240 jobs over 5 years as the company transitioned from non-profit to capped-profit structure and released GPT-2.",
  },
  {
    company: "OpenAI",
    jobs: 125,
    date: "2022-01-01",
    country: "US",
    industry: "Artificial Intelligence",
    category: "EXPLICIT",
    eventType: "AI_JOB_CREATED",
    url: "https://seo.ai/blog/how-many-people-work-at-openai",
    sourceDomain: "seo.ai",
    sourceName: "SEO.ai",
    title: "OpenAI reaches 375 employees by 2022",
    summary: "OpenAI grew to 375 employees by 2022, adding 125 positions from the 2020 headcount of 250, as the company developed GPT-3 and DALL-E.",
  },
  {
    company: "OpenAI",
    jobs: 395,
    date: "2023-11-01",
    country: "US",
    industry: "Artificial Intelligence",
    category: "EXPLICIT",
    eventType: "AI_JOB_CREATED",
    url: "https://seo.ai/blog/how-many-people-work-at-openai",
    sourceDomain: "seo.ai",
    sourceName: "SEO.ai",
    title: "OpenAI doubles to 770 employees following ChatGPT launch",
    summary: "OpenAI's headcount more than doubled from 375 to 770 employees by November 2023, a 130% increase driven by the explosive success of ChatGPT launched in November 2022.",
  },
  {
    company: "OpenAI",
    jobs: 2761,
    date: "2024-09-01",
    country: "US",
    industry: "Artificial Intelligence",
    category: "EXPLICIT",
    eventType: "AI_JOB_CREATED",
    url: "https://seo.ai/blog/how-many-people-work-at-openai",
    sourceDomain: "seo.ai",
    sourceName: "SEO.ai",
    title: "OpenAI surges to 3,531 employees by September 2024",
    summary: "OpenAI grew from 770 to 3,531 employees by September 2024, a 4.6x increase in under a year, reportedly onboarding up to 50 new employees per week during peak hiring in technical and research roles.",
  },
  {
    company: "OpenAI",
    jobs: 1769,
    date: "2025-07-01",
    country: "US",
    industry: "Artificial Intelligence",
    category: "EXPLICIT",
    eventType: "AI_JOB_CREATED",
    url: "https://www.allblogthings.com/2025/05/openai-number-of-employees-growth-leadership-and-key-insights.html",
    sourceDomain: "allblogthings.com",
    sourceName: "AllBlogThings",
    title: "OpenAI reaches approximately 5,300 employees by mid-2025",
    summary: "OpenAI continued its aggressive hiring, growing from 3,531 to approximately 5,300 full-time employees by July 2025, a 718% increase from the 770 employees in November 2023.",
  },

  // ===== ANTHROPIC =====
  // Founded 2021, HQ San Francisco
  // Source: seo.ai/blog/how-many-people-work-at-anthropic
  {
    company: "Anthropic",
    jobs: 7,
    date: "2021-02-01",
    country: "US",
    industry: "Artificial Intelligence",
    category: "EXPLICIT",
    eventType: "AI_JOB_CREATED",
    url: "https://seo.ai/blog/how-many-people-work-at-anthropic",
    sourceDomain: "seo.ai",
    sourceName: "SEO.ai",
    title: "Anthropic founded with 7 employees",
    summary: "Anthropic was founded in 2021 by Dario and Daniela Amodei, former OpenAI VP of Research and VP of Safety, with 7 initial employees focused on AI safety.",
  },
  {
    company: "Anthropic",
    jobs: 185,
    date: "2022-12-01",
    country: "US",
    industry: "Artificial Intelligence",
    category: "EXPLICIT",
    eventType: "AI_JOB_CREATED",
    url: "https://seo.ai/blog/how-many-people-work-at-anthropic",
    sourceDomain: "seo.ai",
    sourceName: "SEO.ai",
    title: "Anthropic grows to 192 employees by end of 2022",
    summary: "Anthropic expanded rapidly in its first full year of operation, growing from 7 founders to 192 employees by the end of 2022 as it developed its Claude AI assistant.",
  },
  {
    company: "Anthropic",
    jobs: 48,
    date: "2023-12-01",
    country: "US",
    industry: "Artificial Intelligence",
    category: "EXPLICIT",
    eventType: "AI_JOB_CREATED",
    url: "https://seo.ai/blog/how-many-people-work-at-anthropic",
    sourceDomain: "seo.ai",
    sourceName: "SEO.ai",
    title: "Anthropic reaches 240 employees by end of 2023",
    summary: "Anthropic grew modestly from 192 to 240 employees through 2023 while launching Claude 2 and securing major investment from Google and Amazon.",
  },
  {
    company: "Anthropic",
    jobs: 795,
    date: "2024-09-01",
    country: "US",
    industry: "Artificial Intelligence",
    category: "EXPLICIT",
    eventType: "AI_JOB_CREATED",
    url: "https://seo.ai/blog/how-many-people-work-at-anthropic",
    sourceDomain: "seo.ai",
    sourceName: "SEO.ai",
    title: "Anthropic quadruples to 1,035 employees by September 2024",
    summary: "Anthropic expanded from 240 to 1,035 employees by September 2024, a 331% increase in one year, driven by the success of Claude 3 and massive funding rounds totaling billions.",
  },
  {
    company: "Anthropic",
    jobs: 62,
    date: "2025-06-01",
    country: "US",
    industry: "Artificial Intelligence",
    category: "EXPLICIT",
    eventType: "AI_JOB_CREATED",
    url: "https://siliconangle.com/2025/09/26/anthropic-triple-international-headcount-add-offices-following-latest-funding-round/",
    sourceDomain: "siliconangle.com",
    sourceName: "SiliconANGLE",
    title: "Anthropic reaches 1,097 employees in 2025, plans to triple international headcount",
    summary: "Anthropic grew to 1,097 employees by 2025 and announced plans to triple its international headcount, opening offices in Paris and Munich to expand its European presence.",
  },

  // ===== GOOGLE DEEPMIND =====
  // Founded 2010 (as DeepMind), HQ London
  // Source: Wikipedia, usesignhouse.com/blog/deepmind-stats, stockanalysis.com
  {
    company: "Google DeepMind",
    jobs: 50,
    date: "2014-01-26",
    country: "GB",
    industry: "Artificial Intelligence",
    category: "EXPLICIT",
    eventType: "AI_JOB_CREATED",
    url: "https://en.wikipedia.org/wiki/Google_DeepMind",
    sourceDomain: "en.wikipedia.org",
    sourceName: "Wikipedia",
    title: "Google acquires DeepMind with approximately 50 employees",
    summary: "Google acquired DeepMind Technologies in January 2014 for approximately $500 million. The London-based AI lab had roughly 50 employees at the time of acquisition.",
  },
  {
    company: "Google DeepMind",
    jobs: 300,
    date: "2016-12-01",
    country: "GB",
    industry: "Artificial Intelligence",
    category: "EXPLICIT",
    eventType: "AI_JOB_CREATED",
    url: "https://usesignhouse.com/blog/deepmind-stats/",
    sourceDomain: "usesignhouse.com",
    sourceName: "SignHouse",
    title: "DeepMind grows to 350 employees by 2016",
    summary: "DeepMind expanded from approximately 50 employees at acquisition to 350 by 2016, following its AlphaGo victory over world Go champion Lee Sedol.",
  },
  {
    company: "Google DeepMind",
    jobs: 1217,
    date: "2022-12-01",
    country: "GB",
    industry: "Artificial Intelligence",
    category: "EXPLICIT",
    eventType: "AI_JOB_CREATED",
    url: "https://usesignhouse.com/blog/deepmind-stats/",
    sourceDomain: "usesignhouse.com",
    sourceName: "SignHouse",
    title: "DeepMind reaches 1,567 employees by 2022",
    summary: "DeepMind grew from 350 to 1,567 employees by 2022, adding 1,217 positions as the lab expanded its research into protein folding (AlphaFold), reinforcement learning, and other AI domains.",
  },
  {
    company: "Google DeepMind",
    jobs: 4033,
    date: "2024-06-01",
    country: "GB",
    industry: "Artificial Intelligence",
    category: "EXPLICIT",
    eventType: "AI_JOB_CREATED",
    url: "https://leadiq.com/c/google-deepmind/5a1d971c230000540085b523/employee-directory",
    sourceDomain: "leadiq.com",
    sourceName: "LeadIQ",
    title: "Google DeepMind reaches approximately 5,600 employees after merger with Google Brain",
    summary: "Following the April 2023 merger of DeepMind and Google Brain into Google DeepMind, the combined unit grew to approximately 5,600 employees by 2024, up from 2,500 two years prior.",
  },
  {
    company: "Google DeepMind",
    jobs: 1400,
    date: "2025-10-01",
    country: "GB",
    industry: "Artificial Intelligence",
    category: "EXPLICIT",
    eventType: "AI_JOB_CREATED",
    url: "https://leadiq.com/c/google-deepmind/5a1d971c230000540085b523/employee-directory",
    sourceDomain: "leadiq.com",
    sourceName: "LeadIQ",
    title: "Google DeepMind grows to approximately 7,000 employees by late 2025",
    summary: "Google DeepMind continued expanding to approximately 7,000 employees across 6 continents by October 2025, adding roughly 1,400 positions from the 5,600 headcount in 2024.",
  },

  // ===== MIDJOURNEY =====
  // Founded 2021, HQ San Francisco
  // Source: electroiq.com/stats/how-many-people-work-at-midjourney
  {
    company: "Midjourney",
    jobs: 11,
    date: "2022-07-01",
    country: "US",
    industry: "Artificial Intelligence",
    category: "EXPLICIT",
    eventType: "AI_JOB_CREATED",
    url: "https://electroiq.com/stats/how-many-people-work-at-midjourney/",
    sourceDomain: "electroiq.com",
    sourceName: "ElectroIQ",
    title: "Midjourney launches with 11-person team",
    summary: "Midjourney launched its AI image generation platform in 2022 with a core team of just 11 people, making it one of the leanest AI startups relative to its revenue.",
  },
  {
    company: "Midjourney",
    jobs: 39,
    date: "2023-12-01",
    country: "US",
    industry: "Artificial Intelligence",
    category: "EXPLICIT",
    eventType: "AI_JOB_CREATED",
    url: "https://electroiq.com/stats/how-many-people-work-at-midjourney/",
    sourceDomain: "electroiq.com",
    sourceName: "ElectroIQ",
    title: "Midjourney grows to 50 employees by 2023",
    summary: "Midjourney expanded from 11 to 50 employees by 2023, a 355% increase, while generating hundreds of millions in annual revenue with no outside funding.",
  },
  {
    company: "Midjourney",
    jobs: 81,
    date: "2024-12-01",
    country: "US",
    industry: "Artificial Intelligence",
    category: "EXPLICIT",
    eventType: "AI_JOB_CREATED",
    url: "https://electroiq.com/stats/how-many-people-work-at-midjourney/",
    sourceDomain: "electroiq.com",
    sourceName: "ElectroIQ",
    title: "Midjourney reaches 131 employees by 2024",
    summary: "Midjourney grew from 50 to 131 employees by 2024, a 1,091% increase from its 2022 launch team of 11. The company maintained a lean structure with 60-70 core engineers.",
  },

  // ===== STABILITY AI =====
  // Founded 2019, HQ London
  // Source: cnbc.com, tracxn.com
  {
    company: "Stability AI",
    jobs: 200,
    date: "2023-06-01",
    country: "GB",
    industry: "Artificial Intelligence",
    category: "EXPLICIT",
    eventType: "AI_JOB_CREATED",
    url: "https://www.cnbc.com/2024/04/18/ai-startup-stability-lays-off-10percent-of-employees-after-ceo-exit.html",
    sourceDomain: "cnbc.com",
    sourceName: "CNBC",
    title: "Stability AI reaches approximately 200 employees at peak",
    summary: "Stability AI, creators of Stable Diffusion, grew to approximately 200 employees by 2023 following its $101 million seed round in 2022. The company later laid off 10% in April 2024 after CEO Emad Mostaque's departure.",
  },

  // ===== COHERE =====
  // Founded 2019, HQ Toronto
  // Source: getlatka.com, cnbc.com
  {
    company: "Cohere",
    jobs: 400,
    date: "2024-07-01",
    country: "CA",
    industry: "Artificial Intelligence",
    category: "EXPLICIT",
    eventType: "AI_JOB_CREATED",
    url: "https://www.cnbc.com/2024/07/23/cohere-layoffs-20-employees-cut-following-500-million-funding.html",
    sourceDomain: "cnbc.com",
    sourceName: "CNBC",
    title: "Cohere reaches approximately 400 employees by mid-2024",
    summary: "Toronto-based Cohere, focused on enterprise AI and LLMs, grew to approximately 400 employees by July 2024 following its $500 million funding round. The company was founded in 2019 by former Google Brain researchers.",
  },
  {
    company: "Cohere",
    jobs: 414,
    date: "2025-07-01",
    country: "CA",
    industry: "Artificial Intelligence",
    category: "EXPLICIT",
    eventType: "AI_JOB_CREATED",
    url: "https://getlatka.com/companies/cohere.com",
    sourceDomain: "getlatka.com",
    sourceName: "Getlatka",
    title: "Cohere grows to approximately 814 employees by mid-2025",
    summary: "Cohere roughly doubled its workforce from 400 to approximately 814 employees by July 2025, adding 414 positions as enterprise demand for its AI models surged.",
  },

  // ===== MISTRAL AI =====
  // Founded 2023, HQ Paris
  // Source: getlatka.com, tracxn.com
  {
    company: "Mistral AI",
    jobs: 50,
    date: "2023-06-01",
    country: "FR",
    industry: "Artificial Intelligence",
    category: "EXPLICIT",
    eventType: "AI_JOB_CREATED",
    url: "https://getlatka.com/companies/mistral-ai",
    sourceDomain: "getlatka.com",
    sourceName: "Getlatka",
    title: "Mistral AI founded with approximately 50 employees",
    summary: "Mistral AI was founded in May 2023 in Paris by former DeepMind and Meta researchers, quickly assembling a team of approximately 50 employees within its first month.",
  },
  {
    company: "Mistral AI",
    jobs: 450,
    date: "2024-03-01",
    country: "FR",
    industry: "Artificial Intelligence",
    category: "EXPLICIT",
    eventType: "AI_JOB_CREATED",
    url: "https://getlatka.com/companies/mistral-ai",
    sourceDomain: "getlatka.com",
    sourceName: "Getlatka",
    title: "Mistral AI grows to approximately 500 employees by early 2024",
    summary: "Mistral AI grew from roughly 50 to 500 employees within nine months, an almost 900% expansion, as the Paris-based company rapidly developed open-weight LLMs and secured major funding.",
  },
  {
    company: "Mistral AI",
    jobs: 173,
    date: "2025-12-01",
    country: "FR",
    industry: "Artificial Intelligence",
    category: "EXPLICIT",
    eventType: "AI_JOB_CREATED",
    url: "https://tracxn.com/d/companies/mistralai/__SLZq7rzxLYqqA97jtPwO09jLDeb76RVJVb306OhciWU",
    sourceDomain: "tracxn.com",
    sourceName: "Tracxn",
    title: "Mistral AI reaches approximately 673 employees by late 2025",
    summary: "Mistral AI continued expanding to approximately 673 employees by late 2025, adding 173 positions from its 500-employee base, as it competed with OpenAI and Anthropic in the frontier model space.",
  },

  // ===== HUGGING FACE =====
  // Founded 2016, HQ New York
  // Source: tracxn.com, getlatka.com
  {
    company: "Hugging Face",
    jobs: 635,
    date: "2024-06-01",
    country: "US",
    industry: "Artificial Intelligence",
    category: "EXPLICIT",
    eventType: "AI_JOB_CREATED",
    url: "https://getlatka.com/companies/hugging-face",
    sourceDomain: "getlatka.com",
    sourceName: "Getlatka",
    title: "Hugging Face reaches 635 employees by 2024",
    summary: "Hugging Face, the open-source AI platform founded in 2016, grew to 635 employees by 2024. The New York-based company became the central hub for sharing AI models, datasets, and applications.",
  },
  {
    company: "Hugging Face",
    jobs: 30,
    date: "2025-12-01",
    country: "US",
    industry: "Artificial Intelligence",
    category: "EXPLICIT",
    eventType: "AI_JOB_CREATED",
    url: "https://tracxn.com/d/companies/huggingface/___89yhA9z0-ZrLstW87xWDVe15Bkl70IZOkQf38SXzmQ",
    sourceDomain: "tracxn.com",
    sourceName: "Tracxn",
    title: "Hugging Face grows to 665 employees by late 2025",
    summary: "Hugging Face grew modestly to 665 employees by late 2025, adding approximately 30 positions. The company laid off 4% of staff in February 2025 but continued net growth.",
  },

  // ===== INFLECTION AI =====
  // Founded 2022
  // Source: techcrunch.com, deeplearning.ai
  {
    company: "Inflection AI",
    jobs: 70,
    date: "2023-06-01",
    country: "US",
    industry: "Artificial Intelligence",
    category: "EXPLICIT",
    eventType: "AI_JOB_CREATED",
    url: "https://techcrunch.com/2024/03/19/after-raising-1-3b-inflection-got-eaten-alive-by-its-biggest-investor-microsoft/",
    sourceDomain: "techcrunch.com",
    sourceName: "TechCrunch",
    title: "Inflection AI reaches 70 employees before Microsoft acqui-hire",
    summary: "Inflection AI grew to 70 employees after raising $1.3 billion in June 2023. In March 2024, Microsoft hired most of its staff in a $650M deal, leaving only about 20 employees at the original company.",
  },

  // ===== xAI =====
  // Founded 2023
  // Source: getlatka.com, techcrunch.com
  {
    company: "xAI",
    jobs: 1500,
    date: "2024-06-01",
    country: "US",
    industry: "Artificial Intelligence",
    category: "EXPLICIT",
    eventType: "AI_JOB_CREATED",
    url: "https://getlatka.com/companies/xai",
    sourceDomain: "getlatka.com",
    sourceName: "Getlatka",
    title: "xAI grows to approximately 1,500 employees by mid-2024",
    summary: "Elon Musk's xAI, founded in 2023, rapidly scaled to approximately 1,500 employees by mid-2024, including a large data annotation team training the Grok chatbot. The company built a massive GPU supercluster in Memphis, Tennessee.",
  },

  // ===== PERPLEXITY AI =====
  // Founded 2022
  // Source: taptwicedigital.com, tracxn.com
  {
    company: "Perplexity AI",
    jobs: 60,
    date: "2024-06-01",
    country: "US",
    industry: "Artificial Intelligence",
    category: "EXPLICIT",
    eventType: "AI_JOB_CREATED",
    url: "https://taptwicedigital.com/stats/perplexity",
    sourceDomain: "taptwicedigital.com",
    sourceName: "TapTwice Digital",
    title: "Perplexity AI reaches approximately 60 employees by 2024",
    summary: "Perplexity AI, the AI-powered search engine founded in 2022, grew to approximately 60 employees by 2024 while gaining millions of users.",
  },
  {
    company: "Perplexity AI",
    jobs: 187,
    date: "2025-06-01",
    country: "US",
    industry: "Artificial Intelligence",
    category: "EXPLICIT",
    eventType: "AI_JOB_CREATED",
    url: "https://taptwicedigital.com/stats/perplexity",
    sourceDomain: "taptwicedigital.com",
    sourceName: "TapTwice Digital",
    title: "Perplexity AI grows to approximately 247 employees by 2025",
    summary: "Perplexity AI expanded from approximately 60 to 247 employees by 2025, adding 187 positions as the AI search startup raised its valuation to $18 billion.",
  },

  // ===== RUNWAY ML =====
  // Founded 2018, HQ New York
  // Source: getlatka.com
  {
    company: "Runway ML",
    jobs: 200,
    date: "2024-06-01",
    country: "US",
    industry: "Artificial Intelligence",
    category: "EXPLICIT",
    eventType: "AI_JOB_CREATED",
    url: "https://getlatka.com/companies/runwayml.com",
    sourceDomain: "getlatka.com",
    sourceName: "Getlatka",
    title: "Runway ML reaches approximately 200 employees by 2024",
    summary: "Runway ML, the AI video generation company founded in 2018 in New York, grew to approximately 200 employees by 2024 as its Gen-2 and Gen-3 models gained traction in creative industries.",
  },
  {
    company: "Runway ML",
    jobs: 182,
    date: "2025-04-01",
    country: "US",
    industry: "Artificial Intelligence",
    category: "EXPLICIT",
    eventType: "AI_JOB_CREATED",
    url: "https://getlatka.com/companies/runwayml.com",
    sourceDomain: "getlatka.com",
    sourceName: "Getlatka",
    title: "Runway ML grows to 382 employees by early 2025",
    summary: "Runway ML expanded from approximately 200 to 382 employees by April 2025, a 64% headcount increase, as the company continued developing AI-powered video generation tools.",
  },

  // ===== SCALE AI =====
  // Founded 2016, HQ San Francisco
  // Source: techcrunch.com, trueup.io
  {
    company: "Scale AI",
    jobs: 600,
    date: "2023-01-01",
    country: "US",
    industry: "Artificial Intelligence",
    category: "EXPLICIT",
    eventType: "AI_JOB_CREATED",
    url: "https://techcrunch.com/2023/01/10/scale-ai-cuts-20-of-its-workforce/",
    sourceDomain: "techcrunch.com",
    sourceName: "TechCrunch",
    title: "Scale AI has approximately 600 employees in early 2023",
    summary: "Scale AI, the AI data labeling and infrastructure company founded in 2016, had approximately 600 employees in early 2023. The company cut 20% of its workforce in January 2023 amid a market downturn, but later rebounded significantly.",
  },

  // ===== DATABRICKS =====
  // Founded 2013, HQ San Francisco
  // Source: medium.com (Marvelous MLOps), getlatka.com
  {
    company: "Databricks",
    jobs: 1300,
    date: "2020-01-01",
    country: "US",
    industry: "Artificial Intelligence/Data",
    category: "EXPLICIT",
    eventType: "AI_JOB_CREATED",
    url: "https://medium.com/marvelous-mlops/databricks-meteoric-rise-booming-business-or-bubble-39ba00434784",
    sourceDomain: "medium.com",
    sourceName: "Medium (Marvelous MLOps)",
    title: "Databricks reaches approximately 1,300 employees by 2020",
    summary: "Databricks, the AI and data lakehouse platform founded in 2013, had just over 1,300 employees by early 2020 as the company built its unified analytics platform.",
  },
  {
    company: "Databricks",
    jobs: 3700,
    date: "2023-03-01",
    country: "US",
    industry: "Artificial Intelligence/Data",
    category: "EXPLICIT",
    eventType: "AI_JOB_CREATED",
    url: "https://medium.com/marvelous-mlops/databricks-meteoric-rise-booming-business-or-bubble-39ba00434784",
    sourceDomain: "medium.com",
    sourceName: "Medium (Marvelous MLOps)",
    title: "Databricks grows to approximately 5,000 employees by Q1 2023",
    summary: "Databricks expanded from 1,300 to approximately 5,000 employees by Q1 2023, adding 3,700 positions as the company became a central platform for enterprise AI and machine learning workloads.",
  },
  {
    company: "Databricks",
    jobs: 3000,
    date: "2025-06-01",
    country: "US",
    industry: "Artificial Intelligence/Data",
    category: "EXPLICIT",
    eventType: "AI_JOB_CREATED",
    url: "https://getlatka.com/companies/databricks#team",
    sourceDomain: "getlatka.com",
    sourceName: "Getlatka",
    title: "Databricks reaches approximately 8,000 employees by 2025",
    summary: "Databricks continued its growth trajectory to approximately 8,000 staff globally by 2025, a 6x increase from 2020, driven by surging enterprise demand for AI infrastructure and its $3.7 billion annual revenue.",
  },

  // ===== CHARACTER.AI =====
  // Founded 2021
  // Source: getlatka.com
  {
    company: "Character.AI",
    jobs: 225,
    date: "2024-06-01",
    country: "US",
    industry: "Artificial Intelligence",
    category: "EXPLICIT",
    eventType: "AI_JOB_CREATED",
    url: "https://getlatka.com/companies/character.ai",
    sourceDomain: "getlatka.com",
    sourceName: "Getlatka",
    title: "Character.AI grows to approximately 225 employees by 2024",
    summary: "Character.AI, the conversational AI platform founded in 2021 by former Google researchers, grew to approximately 225 employees by 2024. In August 2024, Google hired its co-founders in an acqui-hire-style deal.",
  },

  // ===== JASPER AI =====
  // Founded 2021
  // Source: nikolaroza.com, getlatka.com
  {
    company: "Jasper AI",
    jobs: 140,
    date: "2025-01-01",
    country: "US",
    industry: "Artificial Intelligence",
    category: "EXPLICIT",
    eventType: "AI_JOB_CREATED",
    url: "https://nikolaroza.com/jasper-ai-statistics-facts-and-trends/",
    sourceDomain: "nikolaroza.com",
    sourceName: "NikolarRoza",
    title: "Jasper AI reaches approximately 140 employees by 2025",
    summary: "Jasper AI, the AI content generation platform founded in 2021, grew from 25 employees in 2022 to approximately 140 by 2025, a 600% increase, serving enterprise marketing teams.",
  },

  // ===== REPLICATE =====
  // Founded 2019
  // Source: getlatka.com
  {
    company: "Replicate",
    jobs: 37,
    date: "2024-12-01",
    country: "US",
    industry: "Artificial Intelligence",
    category: "EXPLICIT",
    eventType: "AI_JOB_CREATED",
    url: "https://getlatka.com/companies/replicate.com",
    sourceDomain: "getlatka.com",
    sourceName: "Getlatka",
    title: "Replicate reaches 37 employees by end of 2024",
    summary: "Replicate, the ML model hosting platform founded in 2019, grew to 37 employees by end of 2024. The company was later acquired by Cloudflare in November 2025.",
  },

  // ===== WEIGHTS & BIASES =====
  // Founded 2017
  // Source: tracxn.com, pitchbook.com
  {
    company: "Weights & Biases",
    jobs: 304,
    date: "2025-12-01",
    country: "US",
    industry: "Artificial Intelligence",
    category: "EXPLICIT",
    eventType: "AI_JOB_CREATED",
    url: "https://tracxn.com/d/companies/weights-biases/__uVC3y5h56PSBeov63SBmKNjSxWpMaR4hyT-qaotxi5Q",
    sourceDomain: "tracxn.com",
    sourceName: "Tracxn",
    title: "Weights & Biases reaches approximately 304 employees",
    summary: "Weights & Biases, the MLOps platform founded in 2017, grew to approximately 304 employees. The company was acquired by CoreWeave for $1.7 billion, reflecting the value of AI infrastructure tooling.",
  },

  // ===== TOGETHER AI =====
  // Founded 2022
  // Source: getlatka.com, tracxn.com
  {
    company: "Together AI",
    jobs: 287,
    date: "2024-12-01",
    country: "US",
    industry: "Artificial Intelligence",
    category: "EXPLICIT",
    eventType: "AI_JOB_CREATED",
    url: "https://getlatka.com/companies/together",
    sourceDomain: "getlatka.com",
    sourceName: "Getlatka",
    title: "Together AI reaches 287 employees by 2024",
    summary: "Together AI, the open-source AI cloud platform founded in 2022, grew to 287 employees by 2024, building infrastructure for training and running open-source AI models.",
  },
  {
    company: "Together AI",
    jobs: 26,
    date: "2025-12-01",
    country: "US",
    industry: "Artificial Intelligence",
    category: "EXPLICIT",
    eventType: "AI_JOB_CREATED",
    url: "https://tracxn.com/d/companies/togetherai/__fcIBLE0rJMeK3FAdcfzE0H41jE36bJd0FDBWalYo6cY",
    sourceDomain: "tracxn.com",
    sourceName: "Tracxn",
    title: "Together AI grows to 313 employees by late 2025",
    summary: "Together AI grew from 287 to approximately 313 employees by late 2025, continuing to expand its open-source AI inference and training platform.",
  },

  // ===== ADEPT AI =====
  // Founded 2022
  // Source: getlatka.com, techcrunch.com
  {
    company: "Adept AI",
    jobs: 100,
    date: "2024-03-01",
    country: "US",
    industry: "Artificial Intelligence",
    category: "EXPLICIT",
    eventType: "AI_JOB_CREATED",
    url: "https://techcrunch.com/2024/06/28/amazon-hires-founders-away-from-ai-startup-adept/",
    sourceDomain: "techcrunch.com",
    sourceName: "TechCrunch",
    title: "Adept AI reaches approximately 100 employees before Amazon acqui-hire",
    summary: "Adept AI, the AI agent startup founded in 2022, grew to approximately 100 employees before Amazon hired its co-founders and most staff in June 2024. Only about 20 employees remained at the original company.",
  },

  // ===== AI21 LABS =====
  // Founded 2017, HQ Tel Aviv
  // Source: getlatka.com, leadiq.com
  {
    company: "AI21 Labs",
    jobs: 242,
    date: "2024-12-01",
    country: "IL",
    industry: "Artificial Intelligence",
    category: "EXPLICIT",
    eventType: "AI_JOB_CREATED",
    url: "https://getlatka.com/companies/ai21.com",
    sourceDomain: "getlatka.com",
    sourceName: "Getlatka",
    title: "AI21 Labs reaches approximately 242 employees by 2024",
    summary: "AI21 Labs, the Tel Aviv-based AI company founded in 2017, grew to approximately 242 employees by 2024. The company developed the Jamba large language model and Wordtune writing assistant.",
  },

  // ===== ALEPH ALPHA =====
  // Founded 2019, HQ Heidelberg, Germany
  // Source: fortune.com, tracxn.com
  {
    company: "Aleph Alpha",
    jobs: 200,
    date: "2024-09-01",
    country: "DE",
    industry: "Artificial Intelligence",
    category: "EXPLICIT",
    eventType: "AI_JOB_CREATED",
    url: "https://fortune.com/europe/2024/09/07/aleph-alpha-germany-ai-startup-tech-silicon-valley/",
    sourceDomain: "fortune.com",
    sourceName: "Fortune",
    title: "Aleph Alpha reaches approximately 200 employees by 2024",
    summary: "Aleph Alpha, Germany's leading AI startup founded in 2019 and headquartered in Heidelberg, grew to roughly 200 employees by September 2024. The company focuses on sovereign AI for European governments and enterprises.",
  },
  {
    company: "Aleph Alpha",
    jobs: 100,
    date: "2025-07-01",
    country: "DE",
    industry: "Artificial Intelligence",
    category: "EXPLICIT",
    eventType: "AI_JOB_CREATED",
    url: "https://tracxn.com/d/companies/aleph-alpha/__9w8DBslRjv4B4lTYAdG7XkrtnnWhgssw3HF9CXIPjTw",
    sourceDomain: "tracxn.com",
    sourceName: "Tracxn",
    title: "Aleph Alpha grows to over 300 employees by mid-2025",
    summary: "Aleph Alpha expanded from roughly 200 to over 300 employees by mid-2025, adding approximately 100 positions as the Heidelberg-based company grew its sovereign AI platform for European clients.",
  },

  // ===== SENSETIME =====
  // Founded 2014, HQ Hong Kong
  // Source: stockanalysis.com/quote/hkg/0020/employees
  {
    company: "SenseTime",
    jobs: 4531,
    date: "2023-12-31",
    country: "HK",
    industry: "Artificial Intelligence",
    category: "EXPLICIT",
    eventType: "AI_JOB_CREATED",
    url: "https://stockanalysis.com/quote/hkg/0020/employees/",
    sourceDomain: "stockanalysis.com",
    sourceName: "Stock Analysis",
    title: "SenseTime has 4,531 employees in 2023",
    summary: "SenseTime, the Hong Kong-based AI company founded in 2014 and publicly listed, employed 4,531 people as of the end of 2023. The company specializes in computer vision, autonomous driving, and generative AI.",
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
