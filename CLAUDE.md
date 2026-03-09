# AI Layoffs Tracker — Project Rules

## Hard Rules
- **NEVER fabricate, seed, or hallucinate data** — no fake articles, companies, events, or job loss numbers
- **Database starts empty** — all data comes from real search/ingestion pipelines only
- **No dummy/placeholder content** — if there's no data, show "No data yet" or empty states
- This is a DATA TRACKER, not a data fabricator

## Architecture
- **Framework:** Next.js 14 (App Router) + TypeScript + Tailwind + shadcn/ui
- **Database:** PostgreSQL on Railway + Prisma ORM
- **Deploy:** Railway (not Vercel)
- **LLM:** Both Anthropic + OpenAI supported, configurable via env vars
- **Search/Discovery:** Exa API for article discovery

## Multi-Domain Setup
- All domains share the same Railway deployment and database
- Domain detection middleware selects branding/theme per domain
- Each domain has its own visual identity but shared data
- Domains: ailayoffs.com.au, aicuts.com.au, ailayoffwatch.com, ailayoffwatch.com.au, robotlayoffs.com, robotlayoffs.com.au

## Admin
- No admin UI — manage via server scripts and API routes with secret key
- No auth provider needed for MVP
- Admin operations via CLI scripts in /scripts directory

## Data Integrity
- Only real articles from real sources
- Attribution must link to verifiable source URLs
- No inflated or fabricated statistics
