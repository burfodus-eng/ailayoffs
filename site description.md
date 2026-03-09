# Claude Build Prompt — AI / Robot Job Loss Tracking Website

Build a production-ready web app for a public-facing website that tracks **global job losses attributed to AI**, with a related mirrored section for **robot-driven job loss**.

The goal is to create a site with the same emotional clarity and urgency that made pandemic tracking sites compelling: a **large, constantly updating headline number**, clean charts, simple navigation, and a strong sense that the data is being updated continuously from real-world events.

This is not a generic news site. It is primarily a **live public tracker**.

---

## 1. Core Product Vision

Create a website that:

- Tracks **AI-attributed job losses globally**
- Separately tracks **robot / automation / humanoid / physical automation job losses**
- Uses AI pipelines to **search the web daily**, read and classify relevant articles, extract the announced or implied job-loss figures, score the level of attribution, and update a database
- Maintains a **range-based tally**:
  - **Conservative total** = only explicit/direct AI attribution
  - **Core / sweet spot total** = best estimate using weighted attribution
  - **Upper bound total** = broadest plausible AI-linked interpretation
- Stores article metadata, summaries, extracted counts, attribution weights, location, company, date, category, and confidence
- Has a **minimal, professional landing page** with a large central number and supporting graph, similar in spirit to the simplicity of pandemic dashboards
- Includes supporting pages for news, jobs created by AI, productivity gains from AI, and a job security analyzer

The design should feel:

- Serious
- Credible
- Minimal
- Fast
- Easy to scan
- Professional enough that journalists, researchers, and the general public would trust it

Avoid hype aesthetics. No neon cyberpunk. No clutter.

---

## 2. Brand / Domain Structure

Primary domain concept:
- AI layoffs / AI job loss tracker

Secondary domain / related section:
- Robot layoffs / robot job loss tracker

Architect this so the same backend and shared data model can serve:
- main AI site
- robot-specific section or subdomain/subpage
- mirrored layouts with slightly different visual identity

Examples:
- `ailayoffwatch.com`
- `aicuts.com.au`
- `robotlayoffs.com`
- `robotlayoffs.com.au`

Requirements:
- Shared ingestion/data pipeline
- Shared article catalog where possible
- Separate filters/views/branding for AI vs robot / automation
- Similar structure but slightly different layouts/themes so they feel related, not duplicated

---

## 3. Primary Homepage Experience

The homepage should be dominated by:

### A. Main headline metric
A huge front-and-center number showing:

**Estimated AI-attributed jobs lost globally**

This should default to the **core / sweet spot estimate**.

Directly nearby, also show:
- Conservative estimate
- Upper bound estimate
- Last updated timestamp
- 24h / 7d / 30d change

### B. Main chart
A clean graph showing trend over time for:
- Conservative
- Core
- Upper bound

User can toggle between:
- line chart
- cumulative line chart
- event bar chart
- recent major announcements

### C. Supporting summary blocks
Below the fold, very subtle:
- Latest major events
- Latest verified articles
- AI jobs created
- Productivity / GDP-equivalent estimate
- Robot layoffs section
- Job security tool

But the landing page must remain focused on the big number first.

### D. Tone
The page should communicate seriousness:
- “This is a live estimate built from public reporting and weighted attribution analysis.”
- “Numbers are ranges, not exact census counts.”
- “See methodology.”

---

## 4. Attribution Model

This is the most important part of the product.

We need an AI-assisted classification engine that reads articles and classifies the job-loss relationship to AI.

For every article / announcement, assign:

### Attribution category
- **Explicit**: company directly states AI caused or enabled job cuts
- **Strong**: AI clearly cited as a major factor, even if mixed with restructuring language
- **Moderate**: evidence strongly suggests AI-driven efficiency or replacement, but not fully explicit
- **Weak / fringe**: AI only loosely connected; should minimally affect totals
- **Not relevant**: article should be discarded

### Weighting model
Each article/event should contribute to totals using weights such as:

- Explicit = 1.00
- Strong = 0.75
- Moderate = 0.40
- Weak = 0.15
- Fringe = 0.05
- Not relevant = 0

These should be configurable in admin settings.

### Three tally outputs
For each event:
- **Conservative count** = count only explicit cases or explicit portion
- **Core count** = announced job cuts × weighted attribution
- **Upper bound count** = if article plausibly supports a broader AI linkage, include a higher weighted number

### Event record fields
Each event should store:
- event_id
- article_id
- company
- country
- region
- industry
- date_announced
- article_published_at
- jobs_cut_announced
- conservative_ai_jobs
- weighted_ai_jobs
- upper_ai_jobs
- attribution_category
- attribution_weight
- confidence_score
- reasoning_summary
- short public summary
- source_url
- source_domain
- source_type
- paywalled boolean
- ai_or_robot classification
- duplicate_group_id
- created_at
- updated_at

Also store extracted evidence text snippets internally for audit, but do **not** republish copyrighted full text.

---

## 5. News / Article Catalog

Create a dedicated news page that lists the articles used to build the counts.

For each item show:
- headline
- source
- date
- company
- country
- jobs announced
- AI attribution category
- estimated weighted impact
- short summary
- link to original article
- badge such as:
  - Verified explicit
  - Strong AI link
  - Moderate inference
  - Weak signal

Important:
- Do **not** republish full articles
- Only show:
  - short summary generated from the source
  - optionally the first sentence or very short excerpt if allowed
  - link back to source
- Respect copyright, robots, and publisher terms
- Prefer summarization and metadata, not full-text republishing

Include filters:
- date range
- country
- industry
- source
- AI vs robot
- attribution category
- company
- jobs count range

---

## 6. Additional Sections

### A. Jobs Created by AI
A page tracking reported AI-related job creation, including:
- new AI hiring
- new roles created due to AI deployment
- retraining / redeployment figures
- AI infrastructure expansion job creation

Show:
- conservative / weighted / upper totals
- charts over time
- company and geography filters
- article catalog like the layoffs page

### B. Productivity / GDP Improvement Tracker
A page that catalogs reported claims about:
- productivity gains
- output increases
- cost reductions
- revenue uplift
- GDP or labor-equivalent estimates

This page should attempt to translate reported productivity gains into:
- equivalent labor displacement estimate
- equivalent GDP contribution
- value unlocked

Make it clear these are modeled estimates, not hard facts.

For each entry:
- store raw claim
- estimated impact model
- assumptions used
- confidence / uncertainty

### C. Robot / Automation / Humanoid Tracker
A sister section focused on:
- industrial automation
- warehouse robotics
- humanoid robots
- autonomous systems replacing physical jobs
- robotics-enabled job reduction

This should share data structure with AI layoffs but have its own:
- landing page
- charts
- design flavor
- labels
- filters

### D. Job Security Analyzer
A public tool where users enter:
- job title
- industry
- country
- experience level
- key tasks
- software/tools used
- education / credentials
- optional salary range

The tool returns:
- job risk score
- AI risk score
- robotics risk score
- time horizon
- reasoning
- resilience suggestions
- adjacent safer roles
- suggested skills to improve security
- suggested training resources

This page is one of the monetization opportunities, but it must remain useful and not feel spammy.

---

## 7. Monetization

I want subtle monetization only.

Possible monetization areas:
- sponsored tools/resources for upskilling
- affiliate links for AI training platforms
- career transition tools
- resume / interview services
- premium deeper reports
- API / data access
- newsletter sponsorships

Requirements:
- Keep monetization subtle
- Do not clutter core pages
- Clearly label sponsored content
- Avoid spammy banners
- Consider placements such as:
  - “Suggested upskilling resources”
  - “Career resilience tools”
  - “Sponsored learning platform”
  - small in-sidebar mentions on article pages or job security results

Also propose:
- premium enterprise / research dashboard
- CSV export subscription
- alerts by company / country / sector
- paid API for journalists, analysts, hedge funds, researchers, and policy teams

---

## 8. Site Architecture

Build as a modern, scalable full-stack app.

Preferred stack:
- **Next.js**
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui**
- **Postgres** via Supabase or Neon
- **Prisma** or Drizzle ORM
- **Vercel** deploy target preferred
- **Cron / scheduled jobs** for daily ingestion
- **OpenAI / Anthropic / hybrid LLM abstraction**
- Optional scraping/search infra using:
  - Exa / Tavily / SerpAPI / Firecrawl / Jina / Diffbot or similar
- Object storage if needed for archived article metadata snapshots

If another stack is clearly better, explain why, but default to the above.

---

## 9. Data Pipeline / Ingestion Engine

This app must not be static. Build an automated ingestion pipeline.

### Pipeline goals
Every day, automatically:
1. Search the web for relevant articles
2. Discover company announcements and reporting
3. Deduplicate related articles
4. Extract key facts
5. Classify AI / robot attribution strength
6. Estimate weighted job-loss contribution
7. Save event + article records
8. Update aggregates and charts
9. Flag low-confidence cases for admin review

### Search targets
Search for combinations around:
- AI layoffs
- job cuts due to AI
- AI replaces workers
- restructuring due to AI
- automation job cuts
- robot replaces workers
- generative AI job reduction
- workforce reduction driven by AI
- company layoffs while citing AI productivity
- new articles mentioning layoffs + AI + company names

Also search regionally and by language where possible.

### Source handling
Support:
- multiple articles for same event
- press releases
- earnings calls
- investor presentations
- reputable news reporting
- company blog posts

### Deduplication logic
Many outlets will cover the same event. Build a system to:
- group articles into one event cluster
- prefer highest-quality source
- preserve related article links
- avoid double-counting layoffs

### Human-review queue
Create an internal moderation/admin queue for:
- low-confidence classification
- large events
- conflicting counts
- duplicates
- uncertain attribution

---

## 10. Methodology Page

Include a serious methodology page that explains:

- what is being counted
- what is not being counted
- difference between explicit and inferred attribution
- how conservative, core, and upper totals are calculated
- how duplicates are prevented
- how uncertain cases are handled
- why totals are estimates
- how article summaries are generated
- copyright-safe publishing approach
- that source links remain with original publishers
- that the site is informational, not official government data

This page should feel robust enough that journalists can cite it.

---

## 11. Pages Required

Build at minimum:

1. **Homepage**
2. **Methodology**
3. **News / Sources**
4. **AI Jobs Created**
5. **Productivity / GDP Impact**
6. **Robot / Automation Job Loss**
7. **Job Security Analyzer**
8. **About**
9. **FAQ**
10. **Admin / review dashboard** (protected)

Optional:
- country pages
- company pages
- sector pages
- live alerts page
- API docs page
- newsletter signup page

---

## 12. UI / UX Direction

Design language:
- minimal
- editorial
- data-first
- modern but restrained
- trust-building
- no excessive gradients
- no flashy startup gimmicks

Suggested palette:
- neutral background
- dark text
- muted accent colors
- warning colors only for charts / risk signals
- red / amber / grey for danger growth and big events
- subtle green/blue for “jobs created” / positive metrics

Homepage inspiration:
- pandemic dashboards
- financial indices
- worldometer-style urgency
- simple, centered, bold numbers

Need:
- responsive mobile and desktop
- fast load times
- accessible charts
- skeleton loading states
- tooltips with methodology notes
- clean typography

---

## 13. Robot Tracker Differentiation

The robot section should feel related but slightly distinct.

Differences:
- slightly different chart styling
- iconography for robotics / automation
- category emphasis on physical labor replacement
- filters for warehouse, manufacturing, logistics, retail automation, humanoids, delivery robots, etc.

But backend and data architecture should be shared.

---

## 14. Admin / Internal Tools

Build a protected admin area for:
- reviewing ingested articles
- editing event classifications
- changing attribution weights
- marking duplicates
- merging events
- adjusting totals if needed
- re-running article parsing
- manually adding events
- viewing low-confidence queue
- exporting data CSV
- seeing ingestion logs and failures

---

## 15. SEO / Content Strategy

The public site should be SEO-friendly.

Need:
- structured metadata
- dynamic pages for events, companies, and countries
- good titles and descriptions
- clean URLs
- article summary pages
- JSON-LD where useful
- sitemap
- proper canonical tags

Focus SEO on terms like:
- AI layoffs tracker
- AI job loss tracker
- automation layoffs
- robot layoffs
- jobs replaced by AI
- AI layoffs by company
- AI layoffs by country
- jobs created by AI
- AI productivity gains
- is my job safe from AI

---

## 16. Legal / Compliance Considerations

Important:
- Do not scrape and republish full copyrighted articles
- Prefer metadata + summary + source link
- Respect robots and terms where possible
- Build source storage in a way that keeps only needed audit snippets internally
- Make public display copyright-safe
- Include a disclaimer page
- Make ad / affiliate links clearly labeled
- Avoid defamatory presentation; present data as estimates based on public reporting
- Include a feedback / correction request flow

---

## 17. Suggested Scoring / Estimation Logic

Implement a first-pass model like this:

### Conservative
- counts only direct explicit AI statements
- no weak inference
- no broad assumption

### Core
- explicit = 100%
- strong = 75%
- moderate = 40%
- weak = 15%
- fringe = 5%

### Upper bound
- explicit = 100%
- strong = 100%
- moderate = 70%
- weak = 35%
- fringe = 15%

Make these configurable.

Also support partial attribution:
Example:
- company cuts 10,000 jobs
- article suggests AI is one factor among several
- model may assign only 20–40% of that event to AI under core logic

Store both:
- total_jobs_announced
- ai_jobs_attributed_conservative
- ai_jobs_attributed_core
- ai_jobs_attributed_upper

---

## 18. MVP Priority Order

Phase 1 MVP:
1. Homepage
2. Methodology
3. News / Sources page
4. Automated ingestion pipeline
5. Event classification + scoring
6. Aggregated totals + charts
7. Admin review dashboard

Phase 2:
8. Jobs created by AI page
9. Productivity/GDP impact page
10. Robot tracker
11. Country/company/sector views

Phase 3:
12. Job security analyzer
13. Premium alerts/API
14. Affiliate / monetization integrations
15. Newsletter / research products

---

## 19. Deliverables I Want From You

Please do all of the following:

### A. Architecture plan
Explain the full technical architecture before coding.

### B. Database schema
Design the schema for:
- articles
- events
- companies
- sources
- classifications
- daily aggregates
- article clusters
- productivity claims
- job creation events
- user submissions
- admin overrides

### C. UX / sitemap
Provide a full sitemap and page structure.

### D. Build the app
Implement the working MVP.

### E. Seed examples
**HARD RULE: DO NOT seed with fabricated/dummy data.** No fake articles, no made-up companies, no hallucinated events. The database starts empty. Data comes ONLY from real search/ingestion pipelines pulling real articles. This is a data tracker, not a data fabricator.

### F. Mock ingestion
Even if live search APIs are not fully wired yet, build the pipeline structure so it is ready.

### G. Admin tooling
Create at least a basic moderation dashboard.

### H. Documentation
Provide README with:
- setup
- environment variables
- cron configuration
- deployment steps
- how to add new search providers
- how to tune attribution weights
- how to extend to robot tracker

---

## 20. Important Product Guidance

This product lives or dies on credibility.

That means:
- serious tone
- transparent methodology
- no inflated claims hidden in the UI
- always show uncertainty
- keep numbers bold but defensible
- use the big front-page number as the emotional hook, but make the underlying evidence easily inspectable

Think:
**“Worldometer for AI-attributed job loss”**
but with a modern, trustworthy design and a defensible classification engine.

---

## 21. Output Format I Want From You

Please respond in this order:

1. Product summary
2. Recommended stack and why
3. Architecture diagram in text
4. Database schema
5. Ingestion pipeline design
6. Scoring / methodology proposal
7. Sitemap and page wireframes
8. Monetization options
9. MVP implementation plan
10. Then begin generating the codebase

If any assumptions are needed, make sensible defaults and proceed.