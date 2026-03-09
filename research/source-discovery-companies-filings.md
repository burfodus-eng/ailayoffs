# Source Discovery: Companies, Filings, Transcripts & Legal

## Companies with Confirmed AI-Cited Layoffs (21 Tier 1)

1. **Amazon** — 14,000 corporate roles. Jassy: "We will need fewer people"
2. **Microsoft** — ~15,000. Nadella: "reimagine our mission"
3. **Block** — 10,000→<6,000. Dorsey: "intelligence tools fundamentally changes what it means to run a company"
4. **CrowdStrike** — 500 (5% workforce). Directly attributed to AI
5. **Workday** — 1,750. CEO cited AI demand
6. **Klarna** — AI replaced 700 CS agents. CEO: "AI can already do all our jobs"
7. **IBM** — Hundreds back-office. Krishna: "direct outcome of automation"
8. **Duolingo** — 10% contractors
9. **Chegg** — 45% workforce
10. **Accenture** — 10,000+
11. **Dell** — 10,000+
12. **Intel** — 10,000+
13. **UPS** — 10,000+ (AI/ML enabling)
14. **Citigroup** — 10,000+ (AI-enabled middle/back office)
15. **TCS** — 10,000+
16. **HP** — ~6,000
17. **C.H. Robinson** — ~1,400 after AI tools rollout
18. **Southwest Airlines** — 1,750 corporate
19. **Pinterest** — AI-cited cuts 2026
20. **Salesforce** — AI replacement announced (support 9K→5K)
21. **Shopify** — CEO AI-first mandate memo

## Tier 2: Strong Signals (15)
22. Google/Alphabet, 23. Meta, 24. BT Group (55K by 2030, 10K→AI), 25. Teleperformance, 26. Goldman Sachs, 27. Morgan Stanley, 28. Banco Santander (1,400 UK), 29. Mastercard (1,400), 30. Ericsson (1,600 Sweden), 31. Commonwealth Bank (300 tech), 32. Infosys, 33. Wipro, 34. Cognizant, 35. SAP, 36. Cisco

## Tier 3: Watch (14)
37. JPMorgan Chase, 38. Wells Fargo, 39. HSBC, 40. Deutsche Bank, 41. Vodafone, 42. T-Mobile, 43. AT&T, 44. Verizon, 45. Adobe, 46. Intuit, 47. PayPal, 48. Uber, 49. Snap, 50. News Corp

---

## SEC EDGAR — Best Source for Filing Research

- **EFTS API**: `https://efts.sec.gov/LATEST/search-index?q="artificial+intelligence"+"workforce+reduction"` — free, full-text
- **Best queries**: `"AI" AND "workforce reduction"`, `"automation" AND "reduction in force"`, `"generative AI" AND "layoff"`
- **8-K Item 2.05** = where restructuring/layoffs are disclosed
- **sec-api.io** — Python/JS SDK, <60s indexing, freemium

## Other Filing Sources

- **ASX**: asx.com.au/markets/trade-our-cash-market/announcements (no full-text API)
- **LSE RNS**: londonstockexchange.com/news
- **UK Companies House**: Free API available
- **NY DOL WARN Dashboard**: dol.ny.gov/warn-dashboard — includes AI checkbox (since March 2025)

## Key Finding: AI Washing Problem

NBER working paper: ~90% of C-suite execs reported AI had **no impact** on employment. When NY required WARN filings to disclose AI as cause, **zero of 160 companies** checked the box — including Amazon and Goldman Sachs. Sam Altman: "there's some AI washing where people are blaming AI for layoffs they would otherwise do."

---

## Earnings Call Transcript APIs (Programmable)

| Source | Access | Cost |
|--------|--------|------|
| **Finnhub** | REST API | Freemium |
| **Financial Modeling Prep** | REST API | Freemium |
| **EarningsCall.biz** | REST API | Paid |
| Seeking Alpha | Paywalled ($239/yr) | No public API |
| Motley Fool | Free (limited) | Scrapeable |

### Executive Euphemisms to Monitor
rightsizing, workforce optimization, operational efficiency, simplified operating model, org changes, RIF, streamlining, delayering, resource action, leveraging synergies, smartsizing, force shaping, workforce transformation, doing more with less, AI-first

---

## Legal Sources

### Landmark Cases
- **Mobley v. Workday** (N.D. Cal 2024-25) — AI hiring tool discrimination, collective certified
- **EEOC v. iTutorGroup** — AI rejected women 55+/men 60+, settled $365K
- **Akridge v. Alfa Insurance** — employer claimed automation made role redundant, employee says pretext

### Active Legislation
- **NY WARN Act AI Amendment** (March 2025) — checkbox for AI/automation on WARN filings
- **California SB 951** (Feb 2026) — 90-day notice, must name AI system and developer
- **Federal S.3108** (Nov 2025) — quarterly AI job impact reports to DOL/BLS

### Finding: Very few decided cases on AI displacement termination. Most AI employment litigation focuses on hiring discrimination, not displacement.

---

## Press Wire Services for Company Announcements
- **Business Wire AI Newsroom**: businesswire.com/newsroom/industry/technology/artificial-intelligence — RSS
- **PR Newswire**: prnewswire.com — keyword search
