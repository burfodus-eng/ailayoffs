# Master Source Map — AI Layoffs Tracker

Generated from exhaustive 4-agent parallel search covering all 13 source classes.

## Executive Summary

### Best Sources (ranked by value × automation potential)
1. **NY WARN AI Checkbox** — Only mandatory AI-layoff disclosure globally (March 2025)
2. **WARN Firehose** (warnfirehose.com) — MCP server for AI integration, daily scraping
3. **Intellizence API** — Only true REST API with `layoffReason` filter
4. **SEC EDGAR EFTS** — Free full-text search of all US filings
5. **Challenger Gray & Christmas** — Gold standard monthly reports, AI as category since 2023
6. **JobGoneToAI** — 156,499 verified jobs across 58 companies
7. **Eurostat AI Adoption** — 27-country structured dataset with API
8. **Statistics Canada** — Quarterly AI adoption + employment surveys
9. **ONS BICS** (UK) — Fortnightly AI business survey
10. **Indeed Hiring Lab** — AI job creation tracking

### Biggest Gaps
- No country has direct, comprehensive "AI caused this layoff" dataset
- India: high impact but thin official data
- China: significant but inaccessible
- Hours reduction / soft attrition: no definitive source anywhere
- Freelancer displacement largely invisible in official stats

### Recommended Ingestion Stack

**Daily**: Reuters RSS, CNBC RSS, TechCrunch RSS, WARN Firehose, Business Wire AI feed
**Weekly**: Challenger press releases, JobGoneToAI scrape, LayoffData.com, BetaKit (Canada)
**Monthly**: Challenger full report, BLS data, ONS BICS, Statistics Canada, Eurostat update
**Quarterly**: SEC EDGAR keyword sweep, academic paper scan, consulting report roundup

---

## Source Inventory (see detailed files)

- [News & Media Sources](source-discovery-news-media.md) — outlets, trackers, journalists, search queries
- [Companies & Filings](source-discovery-companies-filings.md) — 50 company watchlist, SEC/ASX/LSE, transcripts, legal
- [Vendor & Industry](source-discovery-vendor-industry.md) — case studies, trade pubs, blind spots, historical backfill
- [Government & Academic](source-discovery-govt-academic.md) — BLS, WARN, ONS, Eurostat, unions, research reports

---

## Company Watchlist Summary

### Tier 1: Confirmed AI-Cited (21+ companies)
Amazon, Microsoft, Block, CrowdStrike, Workday, Klarna, IBM, Duolingo, Chegg, Accenture, Dell, Intel, UPS, Citigroup, TCS, HP, C.H. Robinson, Southwest Airlines, Pinterest, Salesforce, Shopify, WiseTech Global, FedEx, Omnicom, Fiverr, Dropbox, Dow Chemical

### Tier 2: Strong Signals (15)
Google, Meta, BT Group, Teleperformance, Goldman Sachs, Morgan Stanley, Banco Santander, Mastercard, Ericsson, Commonwealth Bank, Infosys, Wipro, Cognizant, SAP, Cisco

### Tier 3: High Exposure (60+)
JPMorgan, Wells Fargo, HSBC, Deutsche Bank, Vodafone, T-Mobile, AT&T, Verizon, Adobe, Intuit, PayPal, Uber, + BPO sector (Concentrix, TTEC, Alorica, Foundever) + Insurance + Legal Tech + Media

---

## Key Statistics for Context

| Metric | Value | Source |
|--------|-------|--------|
| AI-attributed job cuts since 2023 | 91,753 (conservative) to 156,499 (broad) | Challenger / JobGoneToAI |
| AI jobs created (2 years) | 1.3M | WEF/LinkedIn |
| Global jobs affected by GenAI | 300M | Goldman Sachs |
| WEF net projection by 2030 | +78M (170M created, 92M displaced) | WEF Future of Jobs 2025 |
| US jobs with 50%+ tasks automated | 23.2M | SHRM |
| EU enterprises using AI | 20% (2025) | Eurostat |
| Freelancer marketplace spend drop | 0.66% → 0.14% of company spend | Ramp |
| Companies regretting AI layoffs | 55% | The Interview Guys |

---

## Events to Add to Database (not yet tracked)

| Company | Jobs | Type | Attribution |
|---------|------|------|-------------|
| CrowdStrike | 500 | AI_LAYOFF | EXPLICIT |
| Southwest Airlines | 1,750 | AI_LAYOFF | MODERATE |
| HP | 6,000 | AI_LAYOFF | STRONG |
| FedEx | 15,000 | AI_LAYOFF | STRONG |
| Omnicom | 4,000 | AI_LAYOFF | EXPLICIT |
| Fiverr | 250 | AI_LAYOFF | EXPLICIT |
| Mastercard | 1,400 | AI_LAYOFF | MODERATE |
| Banco Santander (UK) | 1,400 | AI_LAYOFF | MODERATE |
| BT Group | 10,000 | AI_LAYOFF | EXPLICIT |
| Teleperformance | TBD | AI_LAYOFF | STRONG |
| Panasonic | 10,000 | AI_LAYOFF | MODERATE |
