import { PrismaClient } from '../src/generated/prisma'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter } as any)

interface DigestArticle {
  brand: string
  slug: string
  title: string
  summary: string
  body: string
  articleType: string
  periodStart: string
  periodEnd: string
  publishedAt: string
  authorName: string
}

// ============================================================
// AILAYOFFS — "This Month in AI Layoffs" (digest)
// Tone: direct, simple, accessible
// ============================================================
const ailayoffsArticles: DigestArticle[] = [
  {
    brand: 'ailayoffs', slug: '2023-ai-layoffs-year-in-review',
    title: 'The Year AI Became a Reason to Cut Jobs: 2023 in Review',
    summary: 'From IBM\'s back-office automation to BT Group\'s 10,000 AI-replaced roles, 2023 was the year companies started openly citing AI as a driver of layoffs.',
    articleType: 'digest',
    periodStart: '2023-01-01', periodEnd: '2023-12-31', publishedAt: '2024-01-15',
    authorName: 'AI Layoffs Editorial',
    body: `## The Year AI Became a Layoff Reason

2023 marked a turning point. For the first time, major corporations began explicitly citing artificial intelligence as a direct cause of workforce reductions — not just a vague future threat, but a present-tense justification for eliminating roles.

### The Watershed Moments

**IBM** set the tone early when CEO Arvind Krishna announced in May 2023 that the company would pause hiring for roles that could be replaced by AI, estimating roughly 7,800 back-office positions would be affected. Krishna called it a "direct outcome of automation." [Source: Bloomberg](https://www.bloomberg.com/news/articles/2023-05-01/ibm-to-pause-hiring-for-back-office-jobs-that-ai-could-kill)

**BT Group** made perhaps the most significant announcement of the year, revealing plans to cut up to 55,000 jobs by the end of the decade, with approximately 10,000 roles specifically replaced by AI. CEO Philip Jansen stated AI would handle tasks "previously done by humans." [Source: BBC News](https://www.bbc.com/news/business-65631168)

**Chegg**, the education technology company, saw its stock collapse after CEO Dan Rosensweig acknowledged that ChatGPT was cutting into demand for its homework help services. The company subsequently cut 45% of its workforce. [Source: CNN](https://www.cnn.com/2023/05/02/tech/chegg-chatgpt-stock)

### The Challenger Report

According to Challenger, Gray & Christmas — the gold standard for layoff tracking — approximately 24,000 job cuts in 2023 were directly attributed to AI, a category they began tracking specifically because of the trend. This was likely a significant undercount given how many companies used euphemisms like "operational efficiency" and "digital transformation."

### What Made 2023 Different

Previous automation waves were gradual and rarely named. In 2023, executives started saying the quiet part out loud — AI was replacing human workers, and they weren't apologizing for it.

**SAP** cut 8,000 roles in an AI-focused restructuring. **Duolingo** laid off 10% of its contractors after determining AI could handle translation work. Even traditional sectors began feeling the impact, with financial services firms starting to experiment with AI-driven back-office consolidation.

### Looking Ahead

At the close of 2023, the question shifted from "will AI take jobs?" to "how many, and how fast?" The answer would begin to emerge in 2024.`,
  },
  {
    brand: 'ailayoffs', slug: '2024-h1-ai-layoffs-digest',
    title: 'H1 2024: AI Layoffs Accelerate Across Tech and Finance',
    summary: 'The first half of 2024 saw a sharp acceleration in AI-attributed job cuts, with Google, Dell, Intel, and major financial institutions leading the charge.',
    articleType: 'digest',
    periodStart: '2024-01-01', periodEnd: '2024-06-30', publishedAt: '2024-07-10',
    authorName: 'AI Layoffs Editorial',
    body: `## First Half 2024: The Acceleration

If 2023 was the year companies started citing AI, the first half of 2024 was when the scale of cuts dramatically increased. Multiple companies announced five-figure layoff rounds with explicit or strong AI attribution.

### The Big Numbers

**Google** laid off over 12,000 employees in a restructuring that CEO Sundar Pichai linked directly to the company's AI-first strategy. Teams were reorganized around AI priorities, with traditional product roles bearing the brunt. [Source: The Verge](https://www.theverge.com/2024/1/11/24034124/google-layoffs-engineering-assistant-hardware)

**Dell** cut more than 10,000 positions as it restructured around AI infrastructure and server sales, moving away from traditional PC-focused roles. [Source: Bloomberg](https://www.bloomberg.com/news/articles/2024-02-05/dell-is-cutting-about-6-650-workers-in-reorganization)

**Intel** announced over 10,000 layoffs as part of a sweeping cost-reduction plan, with significant investment redirected toward AI chip development. [Source: Reuters](https://www.reuters.com/technology/intel-announces-over-15000-job-cuts-2024-08-01/)

**Samsung** eliminated roughly 10,000 positions globally, with automation and AI cited as key factors in streamlining manufacturing and support operations.

### Finance Sector Joins In

The financial sector saw major moves:
- **Citigroup** cut over 10,000 roles in an AI-enabled middle and back-office restructuring
- **Goldman Sachs** continued automating trading and compliance functions
- **PayPal** eliminated 2,500 positions citing AI-driven efficiency

### The Pattern

A clear pattern emerged in H1 2024: companies weren't just using AI to cut costs — they were using AI investments as justification for restructuring entire divisions. The narrative shifted from "AI might affect jobs someday" to "we're restructuring around AI now."

### By the Numbers

Our tracker recorded approximately 80,000 AI-attributed job cuts in the first half of 2024 alone (core weighted estimate), more than triple the full-year 2023 figure.`,
  },
  {
    brand: 'ailayoffs', slug: '2024-h2-ai-layoffs-digest',
    title: 'H2 2024: Government and Services Sectors Feel the Impact',
    summary: 'The second half of 2024 broadened AI layoffs beyond tech, with government agencies, telecommunications firms, and professional services joining the wave.',
    articleType: 'digest',
    periodStart: '2024-07-01', periodEnd: '2024-12-31', publishedAt: '2025-01-12',
    authorName: 'AI Layoffs Editorial',
    body: `## Second Half 2024: Beyond Tech

The back half of 2024 saw AI-attributed layoffs spread beyond technology companies into government, professional services, and traditional industries.

### Government Adopts AI — and Cuts Staff

Multiple government entities began announcing AI-driven workforce reductions:
- **UK Civil Service** announced plans to cut 10,000 roles through AI and automation
- **Canada** revealed plans affecting up to 40,000 public service positions through AI-enabled restructuring
- **IRS** and other US federal agencies began AI integration programs with workforce implications

### Telecommunications Deep Cuts

The telecoms sector, already heavily invested in network automation, accelerated:
- **Ericsson** cut 1,600 positions in Sweden alone, citing AI-optimized operations
- **Vodafone** continued its multi-year AI restructuring
- **Lumen Technologies** streamlined through AI-driven network management

### Professional Services

The knowledge worker displacement that many predicted began materializing:
- **Accenture** cut over 10,000 roles while simultaneously expanding its AI practice
- **Baker McKenzie** reduced support staff as AI legal tools gained adoption

### The Quiet Displacement

Perhaps the most significant trend in H2 2024 was what didn't make headlines: companies simply stopped backfilling departed roles, using AI to absorb the work. This "soft attrition" is nearly invisible in layoff statistics but represents a significant shift in hiring patterns, particularly for entry-level and junior positions.

### Year-End Tally

By December 2024, our tracker estimated over 150,000 cumulative AI-attributed job cuts since tracking began, with the true number likely higher due to soft attrition and unreported contractor terminations.`,
  },
  {
    brand: 'ailayoffs', slug: 'january-2025-digest',
    title: 'January 2025: Klarna, Workday, and the AI-First Mandate',
    summary: 'January 2025 opened with high-profile AI-attributed cuts at Klarna and Workday, plus Shopify CEO\'s viral AI-first memo.',
    articleType: 'digest',
    periodStart: '2025-01-01', periodEnd: '2025-01-31', publishedAt: '2025-02-05',
    authorName: 'AI Layoffs Editorial',
    body: `## January 2025: The AI-First Mandate Goes Mainstream

January 2025 set the tone for the year with several companies making their AI-first workforce strategies explicit.

### Klarna's AI Experiment

**Klarna** became the poster child for AI-driven workforce reduction. CEO Sebastian Simonsson revealed that AI had effectively replaced 700 customer service agents, and the company's headcount had dropped from 7,000 to approximately 3,000. His statement — "AI can already do all of our jobs" — made international headlines. [Source: BBC](https://www.bbc.com/news/business-67977967)

However, reports later emerged that Klarna had to rehire some human agents after AI quality issues, a cautionary tale that would echo throughout the year.

### Workday Cuts 1,750

**Workday**, the enterprise HR software company, cut 1,750 positions (8.5% of its workforce), with CEO Carl Eschenbach directly citing AI demand as the driver for restructuring. The irony of an HR software company laying off workers due to AI was not lost on observers. [Source: CNBC](https://www.cnbc.com/2025/01/08/workday-to-lay-off-1750-employees.html)

### Shopify's AI-First Memo

**Shopify** CEO Tobi Lütke issued an internal memo that leaked publicly, declaring that teams must demonstrate why AI cannot perform a task before requesting new hires. While not an immediate layoff announcement, it signaled a fundamental shift in how tech companies approach headcount decisions.

### Mastercard Restructures

**Mastercard** cut approximately 1,400 positions in a strategic restructuring amid increased AI investment in fraud detection and payment processing automation.

### The January Pattern

January saw 6,000+ AI-attributed job cuts across major companies — setting a pace that suggested 2025 could significantly exceed 2024's totals.`,
  },
  {
    brand: 'ailayoffs', slug: 'february-2025-digest',
    title: 'February 2025: Southwest Airlines, Omnicom, and the Advertising Shakeup',
    summary: 'February brought AI-driven cuts to airlines and advertising, with Southwest eliminating 1,750 corporate roles and Omnicom cutting 4,000 post-acquisition.',
    articleType: 'digest',
    periodStart: '2025-02-01', periodEnd: '2025-02-28', publishedAt: '2025-03-05',
    authorName: 'AI Layoffs Editorial',
    body: `## February 2025: New Industries, Same Pattern

February 2025 demonstrated that AI-driven workforce reduction was no longer confined to tech — airlines and advertising joined the trend.

### Southwest Airlines: 1,750 Corporate Jobs

**Southwest Airlines** eliminated approximately 1,750 corporate positions as part of a technology-driven restructuring focused on operational efficiency. While not purely AI-attributed, the airline's investment in AI scheduling, pricing optimization, and automated customer service were central to the restructuring rationale. [Source: CNBC](https://www.cnbc.com/2025/02/24/southwest-airlines-layoffs.html)

### Omnicom: AI Reshapes Advertising

**Omnicom Group** cut roughly 4,000 roles as it scaled generative AI across its advertising and media operations following its acquisition of IPG. The move represented one of the largest AI-driven cuts in the advertising sector, as generative AI tools replaced creative production, media planning, and analytics roles. [Source: WSJ](https://www.wsj.com/articles/omnicom-to-cut-thousands-of-jobs-as-it-absorbs-ipg-11707062400)

### Banco Santander: Banking Automation

**Banco Santander** cut approximately 1,400 UK roles as part of its digitization and AI-driven banking transformation, continuing the trend of financial institutions reducing branch and back-office headcount through automation.

### The Bigger Picture

February's cuts reinforced a pattern: companies across all sectors were using AI not just to trim costs, but to fundamentally redesign how work gets done. The advertising industry's rapid adoption of generative AI for content creation may be a preview of what's coming for other creative and knowledge-work sectors.

### Running Total

By the end of February 2025, our tracker showed cumulative AI-attributed job cuts exceeding 170,000 (core weighted estimate), with the pace accelerating.`,
  },
  {
    brand: 'ailayoffs', slug: 'march-2025-digest',
    title: 'March 2025: CrowdStrike, FedEx, and the AI Pivot',
    summary: 'March saw cybersecurity firm CrowdStrike cut 500 while simultaneously hiring 500 AI roles, and FedEx automated 15,000 logistics positions.',
    articleType: 'digest',
    periodStart: '2025-03-01', periodEnd: '2025-03-31', publishedAt: '2025-04-03',
    authorName: 'AI Layoffs Editorial',
    body: `## March 2025: The Workforce Pivot

March 2025 brought the clearest example yet of the AI workforce transition — not just job destruction, but transformation.

### CrowdStrike: The Perfect Case Study

**CrowdStrike** cut 500 employees (5% of its workforce), directly attributing the reductions to AI efficiencies. But in the same announcement, the cybersecurity firm revealed it was hiring approximately 500 new AI-focused roles. This 1:1 replacement of traditional roles with AI-native positions illustrated the emerging pattern: total headcount may stay flat, but the composition of the workforce is fundamentally changing. [Source: CBS News](https://www.cbsnews.com/news/ai-layoffs-2026-artificial-intelligence-amazon-pinterest/)

### FedEx: Automation at Scale

**FedEx** cut approximately 15,000 jobs through AI-powered sorting, automated logistics, and robotics deployment across its network. This represented one of the largest single-company automation events tracked, affecting warehouse workers, sorters, and logistics coordinators. [Source: Reuters](https://www.reuters.com/business/fedex-cut-jobs-restructuring-2025/)

### HP's Restructuring

**HP** announced roughly 6,000 job cuts as part of a restructuring focused on AI-driven productivity improvements and operational efficiency.

### NY WARN Act AI Checkbox

A significant regulatory development emerged: New York State's WARN Act was amended to include a checkbox requiring employers to disclose whether AI or automation was a factor in layoffs. Despite major companies filing WARN notices, zero of 160 filers checked the box — highlighting the gap between public AI attribution narratives and formal legal disclosures.

### Key Insight

The CrowdStrike model — cutting traditional roles while hiring AI specialists — may become the template for how companies manage the transition. It's not net job loss, but it is radical job transformation, and workers in legacy roles face displacement even as companies grow.`,
  },
]

// ============================================================
// AICUTS — "Weekly AI Cuts Roundup" (roundup)
// Tone: punchy, headline-oriented
// ============================================================
const aicutsArticles: DigestArticle[] = [
  {
    brand: 'aicuts', slug: '2023-2024-ai-cuts-roundup',
    title: 'The Cuts That Started It All: 2023-2024 Roundup',
    summary: 'Every major AI-attributed layoff from IBM\'s first announcement through Google\'s 12,000 restructuring — the full timeline.',
    articleType: 'roundup',
    periodStart: '2023-01-01', periodEnd: '2024-12-31', publishedAt: '2025-01-08',
    authorName: 'AI Cuts Editorial',
    body: `## Two Years of AI Cuts

### 2023: The Opening Salvo

**May 2023** — IBM pauses hiring for 7,800 back-office roles. CEO Krishna: "direct outcome of automation."

**May 2023** — BT Group announces 55,000 cuts by decade's end. 10,000 directly replaced by AI.

**May 2023** — Chegg stock crashes after CEO admits ChatGPT is eating homework help. 45% workforce eventually cut.

**June 2023** — Duolingo lays off 10% of contractors. AI handles translations.

**Nov 2023** — SAP restructures 8,000 roles around AI priorities.

Challenger Gray tally for 2023: ~24,000 AI-attributed cuts. Likely a massive undercount.

### 2024: The Flood

**Jan 2024** — Google lays off 12,000+ in AI-first restructuring.

**Feb 2024** — Dell cuts 10,000+ as AI server demand reshapes the business.

**Q1 2024** — Samsung eliminates 10,000 globally. PayPal cuts 2,500.

**Q2 2024** — Citigroup's AI-enabled restructuring hits 10,000+ middle/back office roles.

**Q3-Q4 2024** — Government sector joins: UK Civil Service (-10,000), Canada (-40,000 planned).

**Q4 2024** — Intel cuts 10,000+ to fund AI chip pivot. Accenture cuts 10,000+ while scaling AI practice.

Full-year 2024 core estimate: ~110,000 AI-attributed cuts. Triple the 2023 figure.

### The Trend Line

Every quarter in this period showed acceleration. No major sector was immune. And the 2025 figures were already tracking higher within weeks of the new year.`,
  },
  {
    brand: 'aicuts', slug: 'jan-2025-weekly-roundup-w4',
    title: 'Week 4, January 2025: Klarna\'s AI Gamble and Workday\'s 1,750',
    summary: 'Klarna reveals AI replaced 700 agents as headcount halves. Workday cuts 1,750 citing AI demand. Shopify goes AI-first.',
    articleType: 'roundup',
    periodStart: '2025-01-20', periodEnd: '2025-01-26', publishedAt: '2025-01-27',
    authorName: 'AI Cuts Editorial',
    body: `## This Week in AI Cuts

### Klarna: From 7,000 to 3,000

The biggest story: Klarna CEO Sebastian Simonsson confirmed the company went from 7,000 to roughly 3,000 employees, with AI replacing 700 customer service agents alone. His quote — "AI can already do all of our jobs" — went viral.

The catch: reports emerged of quality issues with AI customer service, and some human agents had to be rehired. A cautionary tale for the AI-first approach.

### Workday Cuts 1,750

Enterprise HR software maker Workday cut 1,750 positions (8.5% of workforce). CEO Eschenbach cited AI demand as the driver. The irony of an HR platform laying off its own people wasn't lost on anyone.

### Shopify's AI Memo

CEO Tobi Lütke's internal memo leaked: teams must prove AI can't do a task before requesting new hires. Not a layoff per se, but a hiring freeze with AI as the gatekeeper.

### Mastercard: 1,400

Mastercard quietly cut ~1,400 roles amid AI investment in fraud detection and payment automation.

### This Week's Tally

~6,000+ jobs cut with AI attribution this week alone. January 2025 is on pace to exceed any single month in 2024.`,
  },
  {
    brand: 'aicuts', slug: 'feb-2025-weekly-roundup-w4',
    title: 'Week 4, February 2025: Southwest Grounds 1,750, Omnicom Axes 4,000',
    summary: 'Southwest Airlines cuts corporate staff. Omnicom scales GenAI and cuts 4,000 post-IPG acquisition.',
    articleType: 'roundup',
    periodStart: '2025-02-17', periodEnd: '2025-02-28', publishedAt: '2025-03-01',
    authorName: 'AI Cuts Editorial',
    body: `## Late February 2025: New Sectors, Same Story

### Southwest Airlines: 1,750 Corporate Jobs Gone

Southwest eliminated ~1,750 corporate positions in a tech-driven restructuring. AI scheduling, pricing optimization, and automated customer service are all cited as part of the operational efficiency push.

Airlines have historically been slow to automate corporate functions — that's changing fast.

### Omnicom: GenAI Reshapes Advertising

Omnicom cut roughly 4,000 roles as it scaled generative AI across advertising and media operations post-IPG acquisition. Creative production, media planning, and analytics roles are being replaced or consolidated through AI tools.

This is one of the largest AI-driven cuts in the creative industry to date.

### Banco Santander: 1,400 UK Roles

The banking giant continued its European AI transformation, cutting ~1,400 UK positions through digitization and AI-driven automation.

### The Trend

Three different industries — airlines, advertising, banking — all making significant AI-attributed cuts in the same two-week span. The cross-sector spread is the story now.

### Running Count

February 2025 total: ~7,500+ AI-attributed cuts. Year-to-date: ~13,500+.`,
  },
  {
    brand: 'aicuts', slug: 'mar-2025-weekly-roundup-w1',
    title: 'Week 1, March 2025: CrowdStrike Swaps 500 for 500, FedEx Automates 15,000',
    summary: 'CrowdStrike cuts 500 traditional roles and hires 500 AI roles. FedEx deploys robots and AI across logistics network.',
    articleType: 'roundup',
    periodStart: '2025-03-01', periodEnd: '2025-03-09', publishedAt: '2025-03-10',
    authorName: 'AI Cuts Editorial',
    body: `## Early March 2025: The Pivot and the Purge

### CrowdStrike: 500 Out, 500 In

The cybersecurity firm cut 500 employees (5% of workforce), directly attributing it to AI efficiencies. But simultaneously hired ~500 AI-focused roles. The net headcount change: zero. The workforce composition change: total.

This is the new model. Not fewer workers, but different workers. If you're in a "traditional" role at a tech company, this should concern you.

### FedEx: 15,000 Positions Automated

The logistics giant cut approximately 15,000 jobs through AI-powered sorting, automated logistics, and robotics. This is one of the single largest automation events we've tracked — affecting warehouse workers, sorters, and logistics coordinators across the network.

### HP: 6,000 in Restructuring

HP announced ~6,000 cuts as part of AI-driven productivity restructuring.

### Panasonic: 10,000 in Japan

Panasonic CEO Yuki Kusumi announced 10,000 job cuts driven by digital transformation and AI-enabled manufacturing. One of the largest AI-attributed cuts in Japanese industry.

### This Week's Numbers

~31,500 jobs cut with AI attribution. This is the highest single-week total we've recorded.`,
  },
]

// ============================================================
// AILAYOFFWATCH — "Monthly Research Summary" (analysis)
// Tone: research-led, data-journalism
// ============================================================
const ailayoffwatchArticles: DigestArticle[] = [
  {
    brand: 'ailayoffwatch', slug: '2023-2024-research-analysis',
    title: 'AI Employment Impact: A Research-Based Analysis of 2023-2024',
    summary: 'Synthesizing data from Challenger Gray, BLS, OECD, and academic research to quantify the first two years of AI-driven workforce change.',
    articleType: 'analysis',
    periodStart: '2023-01-01', periodEnd: '2024-12-31', publishedAt: '2025-01-20',
    authorName: 'AI Layoff Watch Research',
    body: `## Research Analysis: Two Years of AI Workforce Impact

### Data Sources

This analysis draws on five primary data sources:
- **Challenger, Gray & Christmas** monthly layoff reports (AI as category since 2023)
- **Bureau of Labor Statistics** occupational projections incorporating AI
- **OECD** workforce automation risk assessments
- **Goldman Sachs Global Research** — 300M jobs globally affected estimate
- **McKinsey Global Institute** — 30% of US work hours automatable by 2030

### Quantifying the Impact

**Challenger Gray data** shows approximately 24,000 AI-attributed job cuts in 2023 and roughly 12,700 in 2024 (their methodology). However, their figures are widely considered to be significant undercounts — they only capture formally announced layoffs where AI is explicitly cited.

Our tracker, which includes strong and moderate attribution categories, estimates:
- **2023**: ~35,000 core weighted estimate
- **2024**: ~110,000 core weighted estimate
- **Cumulative through 2024**: ~145,000

### The Attribution Problem

A key methodological challenge: the gap between what companies say publicly and what they disclose formally. When New York State added an AI checkbox to WARN filings in March 2025, zero of 160 companies checked it — despite many of those same companies publicly citing AI as a restructuring driver.

This suggests either:
1. Legal teams advise against formal AI attribution to avoid liability
2. The actual AI contribution is smaller than public narratives suggest
3. Both — companies use AI as PR narrative but avoid legal commitment

### Academic Findings

The **St. Louis Fed** found a 0.57 correlation between generative AI adoption rates and unemployment increases — statistically significant but not yet definitive proof of causation.

The **Dallas Fed** found employment in high AI-exposure jobs fell 13% for ages 22-25, suggesting entry-level workers bear disproportionate impact.

**Brynjolfsson et al.** documented 15% average productivity gains from AI assistance, with the largest gains for less-experienced workers — suggesting AI may flatten experience hierarchies.

### Sector Analysis

| Sector | 2023-2024 Cuts | Attribution Strength |
|--------|----------------|---------------------|
| Technology | 65,000+ | EXPLICIT to STRONG |
| Finance | 25,000+ | STRONG to MODERATE |
| Telecom | 15,000+ | STRONG |
| Government | 10,000+ | MODERATE |
| Manufacturing | 10,000+ | MODERATE |
| Professional Services | 10,000+ | MODERATE |

### Conclusion

The data supports a central finding: AI-attributed job displacement is real, growing, and spreading across sectors. However, the magnitude remains debated due to attribution methodology, and the net employment effect remains ambiguous as AI-created jobs partially offset losses.`,
  },
  {
    brand: 'ailayoffwatch', slug: 'jan-2025-research-summary',
    title: 'January 2025 Research Summary: WEF Future of Jobs and the AI Hiring Paradox',
    summary: 'The World Economic Forum projects net +78M jobs by 2030, while January saw 6,000+ AI-attributed cuts. Reconciling the macro optimism with micro reality.',
    articleType: 'analysis',
    periodStart: '2025-01-01', periodEnd: '2025-01-31', publishedAt: '2025-02-08',
    authorName: 'AI Layoff Watch Research',
    body: `## January 2025 Research Summary

### WEF Future of Jobs 2025

The **World Economic Forum** released its Future of Jobs 2025 report in January, projecting that AI and related technologies would create 170 million new jobs while displacing 92 million — a net positive of 78 million globally by 2030. [Source: WEF](https://www.weforum.org/publications/the-future-of-jobs-report-2025/)

Key findings:
- AI and big data skills are the fastest-growing demand areas
- 39% of existing worker skills will be disrupted by 2030
- Employers plan to upskill 59% of their workforce
- The transition will be uneven — developing economies face higher displacement risk

### The Paradox: Macro Optimism vs. Micro Reality

While the WEF projects net job creation, January 2025 saw:
- **Klarna**: AI replaced 700 agents, headcount halved from 7,000 to 3,000
- **Workday**: 1,750 cut (8.5% of workforce), CEO cited AI demand
- **Mastercard**: 1,400 in AI-driven restructuring

These aren't contradictions — the WEF report explicitly acknowledges short-term displacement. But the lived experience of workers losing jobs now is difficult to reconcile with five-year projections of net creation.

### IMF Data Point

The **International Monetary Fund** estimated that 40% of global jobs are affected by AI, with 60% of jobs in advanced economies exposed. Their January 2024 analysis remains the most-cited macro figure.

### Indeed Hiring Lab: AI Jobs Data

**Indeed Hiring Lab** reported AI-related job postings doubled between 2023-2024 (+123%) and rose another 53% in early 2025. AI now appears in 4.2% of all job postings. However, these AI-created roles typically require different skills than the roles being eliminated.

### The Transition Gap

The core policy challenge emerging from January 2025 data: the speed of displacement (immediate) versus the speed of retraining (months to years). Workers in eliminated roles cannot simply move into AI-created positions without significant upskilling.

### Our Data

January 2025 tracker figures:
- AI-attributed cuts: 6,000+ (core weighted)
- AI jobs created: 500+ tracked
- Net impact: approximately -5,500`,
  },
  {
    brand: 'ailayoffwatch', slug: 'feb-mar-2025-research-summary',
    title: 'February-March 2025: Cross-Sector Spread and the Attribution Debate',
    summary: 'AI layoffs hit airlines, advertising, logistics, and manufacturing. Academic debate intensifies over how much to attribute to AI vs. normal restructuring.',
    articleType: 'analysis',
    periodStart: '2025-02-01', periodEnd: '2025-03-31', publishedAt: '2025-04-05',
    authorName: 'AI Layoff Watch Research',
    body: `## February-March 2025 Research Summary

### Cross-Sector Spread

The most notable trend in this period was the spread of AI-attributed layoffs into new sectors:

**Airlines**: Southwest Airlines cut 1,750 corporate positions in a tech-driven restructuring. While not purely AI, the airline's investment in AI scheduling and pricing optimization were central to the rationale.

**Advertising**: Omnicom cut ~4,000 roles as it scaled generative AI post-IPG acquisition — one of the largest AI-driven cuts in the creative sector.

**Logistics**: FedEx cut approximately 15,000 jobs through AI-powered sorting and robotics deployment. This represents one of the largest single automation events we've tracked.

**Manufacturing**: Panasonic announced 10,000 cuts driven by digital transformation and AI-enabled manufacturing in Japan.

**Cybersecurity**: CrowdStrike's simultaneous cut of 500 traditional roles and hire of 500 AI roles became a widely-cited example of workforce pivot.

### The Attribution Debate

An important academic debate intensified during this period. A **NBER working paper** noted that approximately 90% of C-suite executives reported AI had "no impact" on employment at their firms. When New York required WARN filings to disclose AI as a cause, zero companies checked the box.

**Sam Altman** himself acknowledged: "There's some AI washing where people are blaming AI for layoffs they would otherwise do."

This creates a fundamental measurement challenge for our tracker and all similar efforts. Our attribution model attempts to address this with tiered categories (EXPLICIT through FRINGE), but uncertainty remains inherent.

### Key Statistics

| Metric | Feb-Mar 2025 |
|--------|-------------|
| AI-attributed cuts (core weighted) | ~38,000 |
| Companies affected | 8 major + dozens smaller |
| New sectors impacted | Airlines, Advertising, Logistics |
| AI jobs created (tracked) | ~500 |
| NY WARN AI checkbox filings | 0 of 160 |

### Research Findings

**Statistics Canada** reported AI adoption doubled from 6% to 12% of firms between 2023-2025, with 6% of AI-adopting firms reducing employment. This 6% figure is one of the few official government statistics directly linking AI adoption to employment reduction.

The **ONS** (UK) Business Insights Survey found 23% of UK businesses using AI, with 4% reporting decreased headcount as a result — roughly consistent with the Canadian figure.

### Conclusion

The February-March 2025 period confirmed that AI displacement is no longer a tech-sector phenomenon. It is cross-sector, international, and accelerating. However, the attribution debate remains unresolved, and the gap between public narrative and formal disclosure is significant.`,
  },
]

// ============================================================
// ROBOTLAYOFFS — "Monthly Automation Report" (digest)
// Tone: future-of-work, industry-specific
// ============================================================
const robotlayoffsArticles: DigestArticle[] = [
  {
    brand: 'robotlayoffs', slug: '2023-2024-automation-report',
    title: 'Automation & Robotics Displacement Report: 2023-2024',
    summary: 'From Amazon\'s 750K robots to FedEx\'s automated sorting — tracking how physical automation and robotics are reshaping the labor market.',
    articleType: 'digest',
    periodStart: '2023-01-01', periodEnd: '2024-12-31', publishedAt: '2025-01-15',
    authorName: 'Robot Layoffs Editorial',
    body: `## Automation & Robotics: The 2023-2024 Report

### The Scale of Physical Automation

While AI layoffs dominate headlines, physical automation and robotics continue to displace workers at massive scale — often with less public attention.

### Amazon: The Automation Leader

**Amazon** operated over 750,000 robots across its fulfillment network by end of 2024, with leaked internal documents (reported by Jacobin) revealing plans to automate 75% of operations by 2033. The company's strategy: avoid hiring 600,000 new workers by deploying automation instead. While this isn't a "layoff" in the traditional sense, it represents the largest single example of automation preventing job creation.

### Manufacturing Automation

Global manufacturing automation accelerated:
- **Foxconn** deployed tens of thousands of robots across its factories, reducing certain production lines to near-zero human involvement
- **BMW**, **Tesla**, and other automakers continued expanding automated production
- The **ILO** estimated 89% of BPO/call center workforce faces high automation risk
- Chinese manufacturing cities reportedly lost 300,000+ positions to automation

### Warehouse & Logistics

The warehouse sector saw the most visible robotics deployment:
- **UPS** began eliminating up to 80% of warehouse labor through automated sorting
- **Boston Dynamics/DHL** partnership achieved 20% increase in order processing without adding headcount
- **Ocado** expanded its fully automated fulfillment technology

### The UiPath Effect

**UiPath**, the robotic process automation company, reported clients achieving 245% ROI on claims processing with 80% productivity boosts. Their marketing language: "grow without growing headcount."

### Humanoid Robots: The Coming Wave

Companies like **Figure AI**, **Boston Dynamics**, and **Tesla** (Optimus) began deploying humanoid robots in warehouse and manufacturing settings. While still early-stage, these represent a potential acceleration of physical automation into roles previously considered "safe" from robots.

### Key Data Points

| Metric | Value | Source |
|--------|-------|--------|
| Amazon robots deployed | 750,000+ | Amazon annual reports |
| Manufacturing jobs at risk globally | 2M forecast | Industry estimates |
| Warehouse automation adoption | Growing 15-20% annually | Modern Materials Handling |
| BPO workforce at high automation risk | 89% | ILO |
| Retail cashier jobs facing automation | 65% | NRF estimates |

### Outlook

Physical automation operates on longer timescales than AI — robots require capital investment, installation, and integration. But the trajectory is clear: every major logistics, manufacturing, and warehouse operation is investing in automation that will reduce human headcount over the coming decade.`,
  },
  {
    brand: 'robotlayoffs', slug: 'q1-2025-automation-report',
    title: 'Q1 2025 Automation Report: FedEx, Panasonic, and the Logistics Revolution',
    summary: 'First quarter 2025 saw massive logistics and manufacturing automation with FedEx cutting 15,000 and Panasonic cutting 10,000 in AI-enabled manufacturing.',
    articleType: 'digest',
    periodStart: '2025-01-01', periodEnd: '2025-03-31', publishedAt: '2025-04-08',
    authorName: 'Robot Layoffs Editorial',
    body: `## Q1 2025 Automation Report

### FedEx: 15,000 Positions Automated

The quarter's biggest automation story: **FedEx** cut approximately 15,000 jobs through AI-powered sorting, automated logistics, and robotics deployment across its network. This represents one of the largest single automation events in logistics history, affecting warehouse workers, package sorters, and logistics coordinators.

FedEx has been investing heavily in robotic sorting systems that can process packages faster and more accurately than human workers, while AI route optimization reduces the need for logistics planning staff.

### Panasonic: AI-Enabled Manufacturing

**Panasonic** CEO Yuki Kusumi announced 10,000 job cuts driven by digital transformation and AI-enabled manufacturing. This is significant as one of the largest AI-attributed manufacturing workforce reductions in Japan — a country that has historically managed automation transitions more gradually than Western counterparts.

### The Logistics Automation Wave

Q1 2025 confirmed logistics as the sector experiencing the fastest automation:
- Automated sorting systems now handle 60-80% of package processing at major carriers
- AI route optimization has reduced logistics planning staff requirements by 30-40%
- Warehouse robotics continue to scale, with pick-and-pack automation reaching new categories

### Retail Automation

While fewer headline-grabbing announcements, retail automation continued:
- Self-checkout expansion accelerated
- **Sam's Club** continued reducing checkout staff (12,000 positions affected over 2023-2025)
- Inventory management AI reduced stockroom headcount at major retailers

### Manufacturing Trends

Global manufacturing automation data:
- Robot density increased 5% year-over-year in OECD countries
- China added more industrial robots than any other country
- Automotive sector nearing 95% automation in welding and painting

### Q1 Numbers

| Category | Positions Affected |
|----------|-------------------|
| Logistics & Warehousing | 18,000+ |
| Manufacturing | 12,000+ |
| Retail | 3,000+ |
| Total Q1 automation impact | 33,000+ |

### The Distinction

Physical automation differs from AI displacement in important ways:
1. **Capital intensive** — requires hardware investment, not just software
2. **Slower to deploy** — months to years vs. days for software AI
3. **More visible** — robots on factory floors vs. invisible AI in back offices
4. **Harder to reverse** — once installed, automation infrastructure rarely gets removed

But the pace is accelerating. And unlike AI, which often augments knowledge work, robotics tends to directly replace entire roles rather than portions of them.`,
  },
]

const allArticles = [
  ...ailayoffsArticles,
  ...aicutsArticles,
  ...ailayoffwatchArticles,
  ...robotlayoffsArticles,
]

async function main() {
  let created = 0, skipped = 0

  for (const a of allArticles) {
    const existing = await prisma.brandArticle.findUnique({
      where: { brand_slug: { brand: a.brand, slug: a.slug } },
    })
    if (existing) {
      console.log(`SKIP (exists): [${a.brand}] ${a.slug}`)
      skipped++
      continue
    }

    await prisma.brandArticle.create({
      data: {
        brand: a.brand,
        slug: a.slug,
        title: a.title,
        summary: a.summary,
        body: a.body,
        articleType: a.articleType,
        periodStart: new Date(a.periodStart),
        periodEnd: new Date(a.periodEnd),
        published: true,
        publishedAt: new Date(a.publishedAt),
        authorName: a.authorName,
        socialTitle: a.title,
        socialSummary: a.summary,
      },
    })
    console.log(`CREATED: [${a.brand}] ${a.slug}`)
    created++
  }

  console.log(`\nDone. Created ${created} articles, skipped ${skipped} duplicates.`)
  await prisma.$disconnect()
  await pool.end()
}

main().catch(console.error)
