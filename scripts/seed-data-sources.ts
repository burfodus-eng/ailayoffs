import { PrismaClient } from '../src/generated/prisma'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter } as any)

interface SourceSeed {
  name: string
  url: string
  type: string
  category: string // ai_layoffs | robot_automation | both
  region?: string
  country?: string
  language?: string
  description?: string
  tier: number
  checkFrequency?: string
  hasApi?: boolean
  hasRss?: boolean
  rssUrl?: string
  paywalled?: boolean
}

const sources: SourceSeed[] = [
  // ═══════════════════════════════════════════════════════════
  // TIER 1 — HIGH YIELD
  // ═══════════════════════════════════════════════════════════
  { name: 'Layoffs.fyi', url: 'https://layoffs.fyi', type: 'tracker', category: 'both', region: 'Global', tier: 1, checkFrequency: 'daily', description: 'The broadest tech layoff dataset globally, tracking thousands of layoff events with an Airtable backend. Updated daily by the community.' },
  { name: 'JobGoneToAI', url: 'https://jobgonetoai.com', type: 'tracker', category: 'ai_layoffs', region: 'Global', tier: 1, checkFrequency: 'daily', description: '156,499 verified AI-displaced jobs across 58 companies. Cross-referenced with SEC filings for accuracy.' },
  { name: 'AI-Layoffs.com', url: 'https://ai-layoffs.com', type: 'tracker', category: 'ai_layoffs', region: 'Global', tier: 1, checkFrequency: 'daily', description: 'Purpose-built AI layoff tracker updated daily. Focuses exclusively on job losses attributed to artificial intelligence.' },
  { name: 'Reuters Technology', url: 'https://reuters.com/technology', type: 'news', category: 'both', region: 'Global', tier: 1, checkFrequency: 'daily', hasRss: true, rssUrl: 'https://feeds.reuters.com/reuters/technologyNews', description: 'Global wire service with breaking coverage of major corporate layoff announcements. Often first to report large-scale cuts.' },
  { name: 'CNBC Technology', url: 'https://cnbc.com/technology', type: 'news', category: 'both', region: 'US', tier: 1, checkFrequency: 'daily', hasRss: true, description: 'Fast signal on major tech sector layoffs with executive interviews and analyst commentary.' },
  { name: 'TechCrunch', url: 'https://techcrunch.com', type: 'news', category: 'both', region: 'Global', tier: 1, checkFrequency: 'daily', hasRss: true, rssUrl: 'https://techcrunch.com/feed/', description: 'Leading startup and technology news source. Covers layoffs across the tech ecosystem from startups to FAANG.' },
  { name: 'Bloomberg Technology', url: 'https://bloomberg.com/technology', type: 'news', category: 'both', region: 'Global', tier: 1, checkFrequency: 'daily', paywalled: true, description: 'Premium financial news covering enterprise layoffs, restructuring, and AI-driven workforce transformation.' },
  { name: 'WARN Firehose', url: 'https://warnfirehose.com', type: 'government', category: 'both', region: 'US', tier: 1, checkFrequency: 'daily', hasApi: true, description: 'Aggregates all US state WARN Act layoff notifications into a single searchable database, updated daily.' },
  { name: 'Business Wire AI', url: 'https://businesswire.com/newsroom/industry/technology/artificial-intelligence', type: 'news', category: 'ai_layoffs', region: 'Global', tier: 1, checkFrequency: 'daily', hasRss: true, description: 'Official company press releases covering AI strategy, restructuring, and workforce changes.' },
  { name: 'Challenger Gray & Christmas', url: 'https://challengergray.com', type: 'research', category: 'both', region: 'US', tier: 1, checkFrequency: 'monthly', description: 'Gold standard for layoff reporting. Monthly job cuts report has tracked AI as a layoff reason since 2023, with 91,753 AI-cited cuts.' },

  // ═══════════════════════════════════════════════════════════
  // TIER 2 — GOOD YIELD
  // ═══════════════════════════════════════════════════════════
  { name: 'LayoffData.com', url: 'https://layoffdata.com', type: 'tracker', category: 'both', region: 'US', tier: 2, checkFrequency: 'weekly', description: '81,000+ standardized WARN notices across US states with structured data for analysis.' },
  { name: 'Fortune Tech', url: 'https://fortune.com/section/tech', type: 'news', category: 'both', region: 'US', tier: 2, checkFrequency: 'daily', hasRss: true, description: 'Business news with strong executive quote coverage on AI workforce decisions.' },
  { name: 'Wall Street Journal Tech', url: 'https://wsj.com/tech', type: 'news', category: 'both', region: 'US', tier: 2, checkFrequency: 'daily', paywalled: true, description: 'Isabelle Bousquette and others cover the AI workforce beat with investigative depth.' },
  { name: 'Axios AI+', url: 'https://axios.com/newsletters/axios-ai-plus', type: 'news', category: 'ai_layoffs', region: 'US', tier: 2, checkFrequency: 'daily', description: 'Ina Fried\'s concise daily AI newsletter — often surfaces workforce impact stories early.' },
  { name: 'BetaKit', url: 'https://betakit.com/tag/layoffs', type: 'tracker', category: 'both', region: 'Canada', country: 'CA', tier: 2, checkFrequency: 'weekly', description: 'Canada-specific tech layoff tracking with startup ecosystem context.' },
  { name: 'Financial Times AI', url: 'https://ft.com/artificial-intelligence', type: 'news', category: 'ai_layoffs', region: 'Europe', tier: 2, checkFrequency: 'daily', paywalled: true, description: 'Authoritative UK/Europe AI coverage with focus on financial sector workforce impact.' },
  { name: 'The Guardian Technology', url: 'https://theguardian.com/technology', type: 'news', category: 'both', region: 'UK', country: 'GB', tier: 2, checkFrequency: 'daily', hasRss: true, rssUrl: 'https://www.theguardian.com/technology/rss', description: 'Free, quality UK technology coverage including layoffs and automation stories.' },
  { name: 'AFR', url: 'https://afr.com', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'AU', tier: 2, checkFrequency: 'daily', description: 'Australian Financial Review — broke the WiseTech layoffs story. Key source for AU/NZ tech workforce.' },
  { name: 'Programs.com AI Layoffs', url: 'https://programs.com/resources/ai-layoffs', type: 'tracker', category: 'ai_layoffs', region: 'Global', tier: 2, checkFrequency: 'monthly', description: 'Tracks 100,000+ AI-impacted workers with 45+ CEO quotes on AI-driven restructuring.' },
  { name: 'tech.co', url: 'https://tech.co', type: 'tracker', category: 'ai_layoffs', region: 'Global', tier: 2, checkFrequency: 'monthly', description: 'Maintains a running list of companies that explicitly replaced workers with AI.' },
  { name: 'PR Newswire', url: 'https://prnewswire.com', type: 'news', category: 'both', region: 'Global', tier: 2, checkFrequency: 'daily', description: 'Official corporate press releases on restructuring, workforce changes, and AI strategy.' },
  { name: 'Intellizence API', url: 'https://intellizence.com', type: 'api', category: 'both', region: 'Global', tier: 2, hasApi: true, description: 'The only commercial REST API with a layoffReason filter, enabling automated tracking of AI-attributed layoffs.' },

  // ═══════════════════════════════════════════════════════════
  // TIER 3 — MODERATE YIELD
  // ═══════════════════════════════════════════════════════════
  { name: 'SEC EDGAR', url: 'https://efts.sec.gov', type: 'filings', category: 'both', region: 'US', tier: 3, checkFrequency: 'monthly', hasApi: true, description: '8-K Item 2.05 filings disclose corporate restructuring. Free full-text search across all US public companies.' },
  { name: 'NY WARN Dashboard', url: 'https://dol.ny.gov/warn-dashboard', type: 'government', category: 'ai_layoffs', region: 'US', country: 'US', tier: 3, checkFrequency: 'weekly', description: 'The only mandatory AI-layoff disclosure system globally. Since March 2025, New York requires companies to disclose if AI caused layoffs.' },
  { name: 'LayoffAlert.org', url: 'https://layoffalert.org', type: 'tracker', category: 'both', region: 'US', tier: 3, checkFrequency: 'weekly', description: '716 WARN notices tracked in 2026 across 36 US states with structured data.' },
  { name: 'Wired', url: 'https://wired.com', type: 'news', category: 'both', region: 'Global', tier: 3, checkFrequency: 'weekly', hasRss: true, description: 'In-depth technology journalism with long-form investigations into AI\'s workforce impact.' },
  { name: 'Ars Technica', url: 'https://arstechnica.com', type: 'news', category: 'both', region: 'US', tier: 3, checkFrequency: 'weekly', hasRss: true, description: 'Technical depth on AI automation stories, with expert analysis beyond headline numbers.' },
  { name: 'Fast Company', url: 'https://fastcompany.com', type: 'news', category: 'ai_layoffs', region: 'US', tier: 3, checkFrequency: 'weekly', description: 'Covers the workplace/AI intersection with focus on how companies restructure around automation.' },
  { name: 'The Register', url: 'https://theregister.com', type: 'news', category: 'both', region: 'UK', country: 'GB', tier: 3, checkFrequency: 'weekly', description: 'UK-based tech publication with strong enterprise IT layoff coverage and sardonic analysis.' },
  { name: 'InformationWeek', url: 'https://informationweek.com', type: 'news', category: 'both', region: 'US', tier: 3, checkFrequency: 'weekly', description: 'Enterprise IT news covering corporate restructuring driven by digital transformation and AI.' },
  { name: 'Built In', url: 'https://builtin.com', type: 'news', category: 'both', region: 'US', tier: 3, checkFrequency: 'weekly', description: 'Tech community platform tracking hiring and layoff trends across the industry.' },
  { name: 'CX Dive', url: 'https://cxdive.com', type: 'industry', category: 'ai_layoffs', region: 'Global', tier: 3, checkFrequency: 'weekly', description: 'Covers BPO and call center automation — one of the sectors most directly impacted by AI chatbots.' },
  { name: 'Retail Dive', url: 'https://retaildive.com', type: 'industry', category: 'robot_automation', region: 'US', tier: 3, checkFrequency: 'weekly', description: 'Tracks retail automation including self-checkout expansion and warehouse robotics deployment.' },
  { name: 'Healthcare IT News', url: 'https://healthcareitnews.com', type: 'industry', category: 'ai_layoffs', region: 'US', tier: 3, checkFrequency: 'weekly', description: 'Covers AI deployment in healthcare — from diagnostic AI replacing radiologists to admin automation.' },
  { name: 'American Banker', url: 'https://americanbanker.com', type: 'industry', category: 'ai_layoffs', region: 'US', tier: 3, checkFrequency: 'weekly', description: 'Finance sector coverage of AI-driven restructuring in banking and financial services.' },

  // ═══════════════════════════════════════════════════════════
  // TIER 4 — RESEARCH & CONTEXT
  // ═══════════════════════════════════════════════════════════
  { name: 'Bureau of Labor Statistics', url: 'https://bls.gov', type: 'government', category: 'both', region: 'US', country: 'US', tier: 4, checkFrequency: 'quarterly', hasApi: true, description: 'US federal labor statistics including JOLTS, QCEW, and 2023-2033 AI occupational projections.' },
  { name: 'ONS (UK)', url: 'https://ons.gov.uk', type: 'government', category: 'both', region: 'UK', country: 'GB', tier: 4, checkFrequency: 'monthly', description: 'UK Office for National Statistics. BICS survey shows 23% of businesses using AI, 4% decreased headcount.' },
  { name: 'Statistics Canada', url: 'https://statcan.gc.ca', type: 'government', category: 'both', region: 'Canada', country: 'CA', tier: 4, checkFrequency: 'quarterly', description: 'Canadian AI adoption doubled from 6% to 12%, with 6% of adopters reducing employment as a result.' },
  { name: 'Eurostat', url: 'https://ec.europa.eu/eurostat', type: 'government', category: 'both', region: 'Europe', tier: 4, checkFrequency: 'quarterly', hasApi: true, description: '27-country EU dataset on AI adoption and workforce impact. Standardized cross-country comparisons.' },
  { name: 'ILOSTAT', url: 'https://ilostat.ilo.org', type: 'government', category: 'both', region: 'Global', tier: 4, hasApi: true, description: 'International Labour Organization\'s global labor statistics database covering 190+ countries. Free API.' },
  { name: 'World Bank Open Data', url: 'https://data.worldbank.org', type: 'government', category: 'both', region: 'Global', tier: 4, hasApi: true, description: 'Employment indicators for 190+ countries with free API access. Essential for developing country data.' },
  { name: 'Indeed Hiring Lab', url: 'https://hiringlab.org', type: 'research', category: 'both', region: 'Global', tier: 4, checkFrequency: 'monthly', description: 'Job posting analytics showing AI jobs tracker: +123% in 2024, now 4.2% of all postings. Tracks declining demand for automatable roles.' },
  { name: 'WEF Future of Jobs', url: 'https://weforum.org', type: 'research', category: 'both', region: 'Global', tier: 4, checkFrequency: 'quarterly', description: 'World Economic Forum flagship report projecting net +78M jobs by 2030 (170M created, 92M displaced).' },
  { name: 'IMF', url: 'https://imf.org', type: 'research', category: 'both', region: 'Global', tier: 4, checkFrequency: 'quarterly', description: 'International Monetary Fund research finding 40% of global jobs affected by AI, rising to 60% in advanced economies.' },
  { name: 'OECD Employment', url: 'https://oecd.org/employment', type: 'government', category: 'both', region: 'Global', tier: 4, hasApi: true, description: '38-country labour data finding 27% of OECD jobs at high risk of automation.' },
  { name: 'McKinsey Global Institute', url: 'https://mckinsey.com/mgi', type: 'research', category: 'both', region: 'Global', tier: 4, description: 'Leading consulting research estimating 30% of US work hours automatable by 2030 with current AI.' },
  { name: 'Goldman Sachs Research', url: 'https://goldmansachs.com/insights', type: 'research', category: 'ai_layoffs', region: 'Global', tier: 4, description: 'Landmark research estimating 300M jobs globally could be affected by generative AI.' },
  { name: 'Stanford HAI AI Index', url: 'https://hai.stanford.edu', type: 'research', category: 'both', region: 'Global', tier: 4, checkFrequency: 'quarterly', description: 'Stanford\'s annual AI Index Report — the most comprehensive dataset on AI adoption, investment, and workforce impact.' },
  { name: 'Brookings Institution', url: 'https://brookings.edu/topic/artificial-intelligence', type: 'research', category: 'ai_layoffs', region: 'US', tier: 4, checkFrequency: 'quarterly', description: 'Non-partisan policy research on AI workforce displacement, regulation, and economic impact.' },
  { name: 'MIT Work of the Future', url: 'https://workofthefuture.mit.edu', type: 'research', category: 'both', region: 'Global', tier: 4, description: 'MIT research program studying how AI and automation reshape employment, including the finding that AI will only replace 23% of tasks.' },
  { name: 'SHRM', url: 'https://shrm.org', type: 'research', category: 'ai_layoffs', region: 'US', tier: 4, description: 'Society for Human Resource Management research identifying 23.2M US jobs with 50%+ tasks automatable by AI.' },
  { name: 'PwC AI Barometer', url: 'https://pwc.com', type: 'research', category: 'both', region: 'Global', tier: 4, description: 'Annual AI Barometer finding 4x productivity gains in AI-exposed industries, tracking enterprise adoption rates.' },
  { name: 'Eurofound Restructuring Monitor', url: 'https://eurofound.europa.eu', type: 'government', category: 'both', region: 'Europe', tier: 4, checkFrequency: 'weekly', description: 'Tracks individual corporate restructuring events across all 27 EU countries. Directly relevant to layoff tracking.' },

  // ═══════════════════════════════════════════════════════════
  // GOVERNMENT — US FEDERAL
  // ═══════════════════════════════════════════════════════════
  { name: 'BLS — JOLTS', url: 'https://bls.gov/jlt', type: 'government', category: 'both', region: 'US', country: 'US', tier: 4, hasApi: true, checkFrequency: 'monthly', description: 'Monthly Job Openings & Labor Turnover Survey — tracks layoffs, quits, and hires by sector across the US economy.' },
  { name: 'BLS — QCEW', url: 'https://bls.gov/cew', type: 'government', category: 'both', region: 'US', country: 'US', tier: 4, hasApi: true, checkFrequency: 'quarterly', description: 'Quarterly Census of Employment & Wages — every employer by county. The gold standard for local employment data.' },
  { name: 'Census — Business Dynamics', url: 'https://census.gov/programs-surveys/bds.html', type: 'government', category: 'both', region: 'US', country: 'US', tier: 4, description: 'Firm-level job creation and destruction data from the US Census Bureau.' },
  { name: 'Federal Reserve FRED', url: 'https://fred.stlouisfed.org', type: 'government', category: 'both', region: 'US', country: 'US', tier: 4, hasApi: true, description: '800,000+ economic time series including employment data. Free API. Essential for macro context.' },

  // ═══════════════════════════════════════════════════════════
  // GOVERNMENT — INTERNATIONAL
  // ═══════════════════════════════════════════════════════════
  { name: 'ABS (Australia)', url: 'https://abs.gov.au/statistics/labour', type: 'government', category: 'both', region: 'Asia-Pacific', country: 'AU', tier: 4, hasApi: true, description: 'Australian Bureau of Statistics — monthly employment by industry and AI/technology adoption surveys.' },
  { name: 'Destatis (Germany)', url: 'https://destatis.de', type: 'government', category: 'both', region: 'Europe', country: 'DE', tier: 4, language: 'de', description: 'German Federal Statistical Office. AI adoption surveys and employment data for Europe\'s largest economy.' },
  { name: 'INSEE (France)', url: 'https://insee.fr', type: 'government', category: 'both', region: 'Europe', country: 'FR', tier: 4, language: 'fr', description: 'French National Institute of Statistics. Business surveys include AI adoption and employment impact.' },
  { name: 'ISTAT (Italy)', url: 'https://istat.it', type: 'government', category: 'both', region: 'Europe', country: 'IT', tier: 4, language: 'it', description: 'Italian National Institute of Statistics. Labour Force Survey and business digitalization data.' },
  { name: 'INE (Spain)', url: 'https://ine.es', type: 'government', category: 'both', region: 'Europe', country: 'ES', tier: 4, language: 'es', description: 'Spanish National Statistics Institute. Employment surveys and ERE (mass layoff) filings data.' },
  { name: 'Statistics Japan', url: 'https://stat.go.jp', type: 'government', category: 'both', region: 'Asia-Pacific', country: 'JP', tier: 4, language: 'ja', hasApi: true, description: 'Japanese Labour Force Survey. The e-Stat API provides programmatic access to employment data.' },
  { name: 'KOSTAT (South Korea)', url: 'https://kostat.go.kr', type: 'government', category: 'both', region: 'Asia-Pacific', country: 'KR', tier: 4, language: 'ko', description: 'Statistics Korea. Employment trends in one of the world\'s most digitally advanced economies.' },
  { name: 'NBS China', url: 'https://stats.gov.cn', type: 'government', category: 'both', region: 'Asia-Pacific', country: 'CN', tier: 4, language: 'zh', description: 'China National Bureau of Statistics. Employment data for the world\'s largest manufacturing workforce.' },
  { name: 'MOSPI (India)', url: 'https://mospi.gov.in', type: 'government', category: 'both', region: 'Asia-Pacific', country: 'IN', tier: 4, description: 'India Ministry of Statistics. Periodic Labour Force Survey covering the world\'s largest workforce.' },
  { name: 'Stats SA (South Africa)', url: 'https://statssa.gov.za', type: 'government', category: 'both', region: 'Africa', country: 'ZA', tier: 4, description: 'Quarterly Labour Force Survey — the primary employment dataset for Africa\'s most industrialized economy.' },
  { name: 'IBGE (Brazil)', url: 'https://ibge.gov.br', type: 'government', category: 'both', region: 'Americas', country: 'BR', tier: 4, language: 'pt', description: 'Brazilian national statistics including PNAD employment survey and CAGED formal employment registry.' },
  { name: 'INEGI (Mexico)', url: 'https://inegi.org.mx', type: 'government', category: 'both', region: 'Americas', country: 'MX', tier: 4, language: 'es', description: 'Mexican national statistics with quarterly employment surveys.' },
  { name: 'Singapore MOM', url: 'https://mom.gov.sg', type: 'government', category: 'both', region: 'Asia-Pacific', country: 'SG', tier: 4, description: 'Ministry of Manpower quarterly retrenchment reports — the most detailed in ASEAN.' },

  // ═══════════════════════════════════════════════════════════
  // INDUSTRY-SPECIFIC
  // ═══════════════════════════════════════════════════════════
  { name: 'The Robot Report', url: 'https://therobotreport.com', type: 'industry', category: 'robot_automation', region: 'Global', tier: 3, checkFrequency: 'weekly', description: 'Dedicated robotics industry news covering deployment, automation, and workforce displacement in manufacturing and logistics.' },
  { name: 'Robotics & Automation News', url: 'https://roboticsandautomationnews.com', type: 'industry', category: 'robot_automation', region: 'Global', tier: 3, checkFrequency: 'weekly', description: 'Global robotics deployment news — factory automation, warehouse robots, autonomous vehicles.' },
  { name: 'Automotive News', url: 'https://autonews.com', type: 'industry', category: 'robot_automation', region: 'Global', tier: 3, checkFrequency: 'weekly', description: 'Auto sector restructuring driven by EV transition and manufacturing automation.' },
  { name: 'IndustryWeek', url: 'https://industryweek.com', type: 'industry', category: 'robot_automation', region: 'US', tier: 3, checkFrequency: 'weekly', description: 'Manufacturing workforce news covering factory automation, robotics deployment, and industrial AI.' },
  { name: 'Modern Materials Handling', url: 'https://mmh.com', type: 'industry', category: 'robot_automation', region: 'US', tier: 3, checkFrequency: 'weekly', description: 'Warehouse and logistics automation — Amazon robotics, automated fulfillment, AGVs.' },
  { name: 'Artificial Lawyer', url: 'https://artificiallawyer.com', type: 'industry', category: 'ai_layoffs', region: 'Global', tier: 3, checkFrequency: 'weekly', description: 'Dedicated coverage of AI in the legal sector — 69% of paralegal work estimated as automatable.' },
  { name: 'STAT News', url: 'https://statnews.com', type: 'industry', category: 'ai_layoffs', region: 'US', tier: 3, checkFrequency: 'weekly', description: 'Health and biotech news covering AI in diagnostics, drug discovery, and clinical decision support.' },
  { name: 'FreightWaves', url: 'https://freightwaves.com', type: 'industry', category: 'robot_automation', region: 'US', tier: 3, checkFrequency: 'weekly', description: 'Trucking and logistics automation — autonomous vehicles, route optimization, warehouse robotics.' },
  { name: 'Supply Chain Dive', url: 'https://supplychaindive.com', type: 'industry', category: 'robot_automation', region: 'Global', tier: 3, checkFrequency: 'weekly', description: 'Supply chain AI and automation deployment news affecting warehouse, logistics, and procurement workers.' },
  { name: 'Press Gazette', url: 'https://pressgazette.co.uk', type: 'industry', category: 'ai_layoffs', region: 'UK', country: 'GB', tier: 3, checkFrequency: 'weekly', description: 'Media industry tracker — 3,434 journalism jobs cut in UK and US due to AI and digital transformation.' },
  { name: 'Becker\'s Healthcare', url: 'https://beckershospitalreview.com', type: 'industry', category: 'ai_layoffs', region: 'US', tier: 3, description: 'Hospital and health system news covering AI deployment in clinical and administrative roles.' },

  // ═══════════════════════════════════════════════════════════
  // NON-ENGLISH NEWS
  // ═══════════════════════════════════════════════════════════
  { name: 'Nikkei Asia', url: 'https://asia.nikkei.com', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'JP', tier: 3, description: 'English edition of Japan\'s leading business daily — covers Asian tech layoffs and automation.' },
  { name: 'Caixin Global', url: 'https://caixinglobal.com', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'CN', tier: 3, description: 'English business news from China covering tech sector layoffs and AI policy.' },
  { name: 'South China Morning Post', url: 'https://scmp.com', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'HK', tier: 3, description: 'Hong Kong-based English-language daily with broad Asia tech and business coverage.' },
  { name: 'Handelsblatt', url: 'https://handelsblatt.com', type: 'news', category: 'both', region: 'Europe', country: 'DE', tier: 3, language: 'de', description: 'Germany\'s leading business daily. Covers European enterprise AI adoption and restructuring.' },
  { name: 'Les Echos', url: 'https://lesechos.fr', type: 'news', category: 'both', region: 'Europe', country: 'FR', tier: 3, language: 'fr', description: 'France\'s premier business newspaper. Covers AI workforce impact across French and European companies.' },
  { name: 'Economic Times India', url: 'https://economictimes.indiatimes.com', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'IN', tier: 3, description: 'India\'s largest business daily. Essential for tracking India\'s 50-63K IT sector layoffs.' },
  { name: 'Rest of World', url: 'https://restofworld.org', type: 'news', category: 'both', region: 'Global', tier: 3, description: 'Technology\'s impact outside the Western bubble — covers AI displacement in developing economies.' },
  { name: 'Tech in Asia', url: 'https://techinasia.com', type: 'news', category: 'both', region: 'Asia-Pacific', tier: 3, description: 'Southeast Asian tech ecosystem coverage including startup layoffs and automation trends.' },

  // ═══════════════════════════════════════════════════════════
  // UNIONS & WORKER ORGANIZATIONS
  // ═══════════════════════════════════════════════════════════
  { name: 'AFL-CIO', url: 'https://aflcio.org', type: 'union', category: 'both', region: 'US', country: 'US', tier: 4, description: 'US federation representing 12.5M workers. Vocal that "CEOs are using AI as an excuse to slash payrolls."' },
  { name: 'TUC', url: 'https://tuc.org.uk', type: 'union', category: 'both', region: 'UK', country: 'GB', tier: 4, description: 'UK Trades Union Congress (5.5M workers) drafting AI Regulation & Employment Rights Bill.' },
  { name: 'UNI Global Union', url: 'https://uniglobalunion.org', type: 'union', category: 'both', region: 'Global', tier: 4, description: 'International federation of 20M workers. Research shows only 20% of unions have AI bargaining agreements.' },
  { name: 'ACTU', url: 'https://actu.org.au', type: 'union', category: 'both', region: 'Asia-Pacific', country: 'AU', tier: 4, description: 'Australian Council of Trade Unions. Landmark Framework Agreement with Microsoft on AI (January 2026).' },
  { name: 'IG Metall', url: 'https://igmetall.de', type: 'union', category: 'robot_automation', region: 'Europe', country: 'DE', tier: 4, language: 'de', description: 'Germany\'s largest industrial union (2.3M members). Negotiating AI integration and automation terms.' },

  // ═══════════════════════════════════════════════════════════
  // STOCK EXCHANGES & FILINGS
  // ═══════════════════════════════════════════════════════════
  { name: 'LSE Regulatory News', url: 'https://londonstockexchange.com/news', type: 'filings', category: 'both', region: 'UK', country: 'GB', tier: 4, description: 'London Stock Exchange RNS announcements including restructuring disclosures from UK-listed companies.' },
  { name: 'Companies House (UK)', url: 'https://companieshouse.gov.uk', type: 'filings', category: 'both', region: 'UK', country: 'GB', tier: 4, hasApi: true, description: 'Free API for UK corporate filings including insolvencies and director changes — signals of restructuring.' },
  { name: 'DART (South Korea)', url: 'https://dart.fss.or.kr', type: 'filings', category: 'both', region: 'Asia-Pacific', country: 'KR', tier: 4, description: 'Korean corporate disclosure system with English interface. Mass layoff filings from major Korean companies.' },
  { name: 'ASX Announcements', url: 'https://asx.com.au/asx/statistics/announcements.do', type: 'filings', category: 'both', region: 'Asia-Pacific', country: 'AU', tier: 4, description: 'Australian Securities Exchange company announcements including restructuring and workforce changes.' },

  // ═══════════════════════════════════════════════════════════
  // TIER 5 — NICHE / FORUMS
  // ═══════════════════════════════════════════════════════════
  { name: 'Blind', url: 'https://teamblind.com', type: 'forum', category: 'both', region: 'Global', tier: 5, description: 'Anonymous professional network where tech employees share layoff information before official announcements.' },
  { name: 'TheLayoff.com', url: 'https://thelayoff.com', type: 'forum', category: 'both', region: 'US', tier: 5, description: 'Company-specific layoff discussion forums with early signals from affected employees.' },
  { name: 'NASSCOM', url: 'https://nasscom.in', type: 'industry', category: 'ai_layoffs', region: 'Asia-Pacific', country: 'IN', tier: 3, description: 'India\'s IT/BPO industry body. Tracks AI adoption and workforce impact across India\'s massive IT services sector.' },
]

async function main() {
  console.log(`Seeding ${sources.length} data sources...`)
  let created = 0, skipped = 0

  for (const s of sources) {
    try {
      await prisma.dataSource.upsert({
        where: { url: s.url },
        create: {
          name: s.name,
          url: s.url,
          type: s.type,
          category: s.category,
          region: s.region || null,
          country: s.country || null,
          language: s.language || 'en',
          description: s.description || null,
          tier: s.tier,
          checkFrequency: s.checkFrequency || null,
          hasApi: s.hasApi || false,
          hasRss: s.hasRss || false,
          rssUrl: s.rssUrl || null,
          paywalled: s.paywalled || false,
        },
        update: {
          name: s.name,
          type: s.type,
          category: s.category,
          region: s.region || null,
          country: s.country || null,
          language: s.language || 'en',
          description: s.description || null,
          tier: s.tier,
          checkFrequency: s.checkFrequency || null,
          hasApi: s.hasApi || false,
          hasRss: s.hasRss || false,
          rssUrl: s.rssUrl || null,
          paywalled: s.paywalled || false,
        },
      })
      created++
    } catch (e: any) {
      console.log(`  SKIP: ${s.name} — ${e.message}`)
      skipped++
    }
  }

  console.log(`Done: ${created} upserted, ${skipped} skipped`)
  await prisma.$disconnect()
  await pool.end()
}

main().catch(console.error)
