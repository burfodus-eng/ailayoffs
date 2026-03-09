# Claude Build Update — Multi-Brand SEO Split, Tailored Content, and Light Cross-Linking

Update the product and content strategy to support a **shared data platform with multiple public-facing brands**, while reducing duplicate-content risk and giving each domain a distinct search identity.

This is not a design rewrite. It is a **content architecture and SEO differentiation update**.

The brands can continue to share:
- the same backend
- the same core database
- the same ingestion pipeline
- the same event records

But each brand must have:
- its own homepage messaging
- its own content angle
- its own indexable support pages
- its own article framing
- its own internal linking emphasis

The goal is to preserve the hedge across domains while avoiding the appearance of a low-value clone network.

---

## 1. Core Strategic Principle

Treat the project as:

- **one shared data engine**
- **multiple branded editorial wrappers**

Do **not** treat each site as a full duplicate of the others with only a different logo.

Each brand should feel like a different entry point into the same data universe.

The same raw events may be reused across brands, but the **presentation, framing, page clusters, and article selections** should vary enough that each site serves a distinct purpose.

---

## 2. Brand Roles

Implement the following strategic identity split.

### A. AILayoffWatch
This is the most serious and credible version of the platform.

Tone:
- research-led
- data-journalism
- credible
- methodology-aware
- trust-building

Positioning:
- the flagship authority site
- best for journalists, researchers, and serious readers
- the strongest “source of truth” brand

Content emphasis:
- methodology
- attribution explanation
- weekly and monthly summaries
- largest events and trend analysis
- revisions and confidence framing

Suggested homepage emphasis:
- “Tracking AI-attributed job loss globally”
- “Conservative, core, and upper estimates”
- “Built from public reporting and weighted attribution review”

Suggested unique content hubs:
- Methodology / scoring
- Weekly tracker summary
- Biggest AI layoff events this month
- Reviewed vs provisional updates
- Country and sector analysis

---

### B. AILayoffs
This is the blunt, exact-match, straightforward public tracker.

Tone:
- direct
- simple
- public-facing
- highly legible
- accessible

Positioning:
- the clearest public counter
- broad keyword capture for “AI layoffs”
- most intuitive site name for general searchers

Content emphasis:
- latest announcements
- layoffs by company
- layoffs by country
- recent major additions to totals
- headline event pages

Suggested homepage emphasis:
- “Global AI layoffs tracker”
- “Estimated jobs lost due to AI”
- “Latest AI layoff announcements and company events”

Suggested unique content hubs:
- Latest AI layoff announcements
- AI layoffs by company
- AI layoffs by country
- Largest announced AI job cuts
- Daily updated tracker pages

---

### C. AICuts
This is the punchier, faster-moving, more social and media-friendly version.

Tone:
- sharper
- punchier
- more headline-oriented
- still credible, but less academic

Positioning:
- fast-moving news angle
- suitable for social traction and higher click-through
- more dynamic framing around major events

Content emphasis:
- breaking updates
- recent spikes
- biggest daily or weekly cuts
- sharp summaries of new events
- event-driven commentary

Suggested homepage emphasis:
- “Tracking the latest AI-linked job cuts”
- “Breaking AI cuts and major workforce reduction events”
- “Live tally of AI-attributed job cuts”

Suggested unique content hubs:
- Breaking AI cuts
- Daily AI cuts roundup
- Largest recent AI cuts
- This week’s AI-linked job loss events
- Fast summaries of notable company announcements

---

### D. RobotLayoffs
This is the sister brand focused on physical automation, robotics, humanoids, warehouse systems, and labor displacement through machines rather than purely software AI.

Tone:
- future-of-work
- physical automation
- robotics-industry aware
- practical and industry-specific

Positioning:
- dedicated physical automation and robotics displacement tracker
- manufacturing / logistics / retail / warehousing / humanoids focus

Content emphasis:
- warehouse automation
- robotics deployment
- manufacturing job displacement
- humanoid robots
- logistics and retail automation

Suggested homepage emphasis:
- “Tracking job loss linked to robots and automation”
- “Global robot and automation layoffs tracker”
- “Physical automation and labor displacement events”

Suggested unique content hubs:
- Warehouse automation job cuts
- Robot layoffs by industry
- Humanoid and robotics displacement tracker
- Manufacturing and logistics automation events
- Physical automation by geography

---

## 3. Homepage Differentiation Requirements

Do not use identical homepage copy across brands.

Each homepage should differ in:
- hero heading
- subheading
- explainer paragraph
- supporting callout cards
- highlighted article/event collections
- internal links to unique content hubs
- emphasis of filters or charts

The homepage may still use:
- the same total structure
- the same chart components
- the same database
- the same event table style

But the narrative wrapper must be distinct.

---

## 4. Brand-Specific Indexable Pages

Each brand must have at least **one or two dedicated content clusters** that are unique enough to stand on their own in search indexing.

These pages should not be duplicated 1:1 across the network.

### Required rule:
Every brand gets:
- one unique homepage
- at least two unique indexable collection pages
- a curated subset of article/event pages with brand-specific framing

### Examples of brand-specific pages:

#### AILayoffWatch
- /methodology
- /weekly-summary
- /largest-events-this-month
- /reviewed-updates
- /ai-layoffs-by-sector

#### AILayoffs
- /latest-ai-layoffs
- /ai-layoffs-by-company
- /ai-layoffs-by-country
- /largest-ai-layoffs
- /today-in-ai-layoffs

#### AICuts
- /breaking-ai-cuts
- /daily-roundup
- /recent-major-cuts
- /weekly-spike-report
- /fast-updates

#### RobotLayoffs
- /robot-layoffs-by-industry
- /warehouse-automation-cuts
- /humanoid-job-displacement
- /automation-by-country
- /physical-automation-events

---

## 5. Event Article Strategy

Do not publish the exact same event article page on every domain with only the logo changed.

Instead, support **brand-specific article variants**.

For a given event, store a shared core data record, but allow:
- different titles per brand
- different introductions per brand
- different summary framing per brand
- different related links per brand
- different featured badge logic per brand

### Example:
Same event, different framing:

#### AILayoffWatch
“WiseTech AI overhaul: how the tracker classified 2,000 announced cuts”

#### AILayoffs
“2,000 jobs added to the AI layoffs tracker after WiseTech announcement”

#### AICuts
“WiseTech adds another 2,000 jobs to the global AI cuts tally”

#### RobotLayoffs
Only include if materially related to robotics / automation / physical systems

This lets all brands reuse the same underlying facts without creating obvious clone pages.

---

## 6. Selective Publishing Rule

Do not publish all event pages to all brands by default.

Instead:
- maintain one shared master event database
- publish all events to the flagship or main tracker brands if needed
- publish only selected subsets to secondary brands
- choose article publication based on brand fit

### Suggested approach:
- AILayoffWatch = broad but curated and reviewed
- AILayoffs = broad public-facing event coverage
- AICuts = selective high-interest / timely items
- RobotLayoffs = only physical automation and robotics-related items

This reduces duplication and improves brand clarity.

---

## 7. Shared Data, Separate Wrappers

Architect the CMS / content model so the same event can support:
- shared factual fields
- shared counts
- shared source records
- shared attribution record

But also:
- per-brand title
- per-brand slug
- per-brand summary
- per-brand publish status
- per-brand SEO title
- per-brand meta description
- per-brand related page assignment
- per-brand internal linking strategy

This is an important requirement.

---

## 8. Internal Linking Strategy

Each brand should have its own internal linking emphasis.

### AILayoffWatch
Internal links should push toward:
- methodology
- reviewed summaries
- sector analysis
- country breakdowns
- biggest events pages

### AILayoffs
Internal links should push toward:
- latest announcements
- company pages
- country pages
- largest layoffs
- recent updates

### AICuts
Internal links should push toward:
- breaking updates
- daily roundup
- recent spikes
- largest recent cuts
- fast social-style summaries

### RobotLayoffs
Internal links should push toward:
- automation by industry
- robotics deployment
- warehouse / logistics categories
- geography filters
- major robot-driven displacement events

---

## 9. Footer Cross-Linking Policy

Implement a **light, user-helpful network footer** linking the sister brands, but do not make it spammy or keyword-stuffed.

### Important:
The footer should help users discover related trackers, not try to manipulate rankings.

Keep it:
- small
- clean
- branded
- minimal
- consistent

### Recommended footer heading:
- Related trackers
- Explore our other trackers
- Sister trackers
- Other tracking projects

### Example footer block:
- AI Layoff Watch
- AI Layoffs
- AI Cuts
- Robot Layoffs

### Rules:
- use branded anchor text, not repetitive keyword-rich anchor stuffing
- keep this block compact
- include it in the footer only, not aggressively sitewide in content areas
- optionally add a one-line explanation such as:
  - “Each tracker focuses on a different angle of AI and automation-driven workforce change.”

Do not use footer anchors like:
- best AI layoffs tracker
- AI job cuts tracker
- robot layoffs tracker
- jobs replaced by AI

That would be too manipulative and low quality.

---

## 10. Footer Disclosure / Transparency Note

Where appropriate, optionally include a subtle transparency note in the footer or About pages:

Examples:
- “Part of a network of related AI and automation tracking sites.”
- “This site shares a common data platform with our related trackers.”
- “Data may overlap across sister brands, but content framing and coverage focus differ.”

This can help establish honesty and reduce the appearance of a hidden network.

Do not over-explain this on every page. Keep it subtle.

---

## 11. Canonical and Indexing Rules

Implement smart canonical handling to avoid self-competition.

### Rules:
- if two pages are materially the same, choose one preferred canonical
- if a page is brand-specific and substantially distinct, allow self-canonical
- do not create near-identical article pages with identical metadata across all domains
- allow selective `noindex` for weak or duplicate-supporting pages
- use canonical tags intentionally, not automatically

The system should support editorial decisions such as:
- publish on Brand A only
- publish on Brand A and Brand B with different copy
- canonical Brand B version to Brand A if overlap is too high
- keep roundup/index pages unique enough to self-index

---

## 12. Duplicate Content Avoidance Requirements

Avoid the following failure mode:
- same event database
- same titles
- same summary text
- same page layout
- same metadata
- same article pages
- four domains competing for the same query

Instead, require:
- different homepage copy
- different content clusters
- different article intros
- different related-link modules
- different featured page selections
- different editorial framing

The backend may remain shared, but the content surface must not feel cloned.

---

## 13. Social Publishing Strategy Support

Prepare the content system so each brand can publish its own branded updates to social channels.

For each brand, support generation of:
- article title
- short summary
- social post text
- image/card headline
- excerpt for Facebook / X / LinkedIn if used later

This should allow the same event to generate:
- one article variant per selected brand
- one social post per selected brand

Do not require identical copy across brands.

---

## 14. CMS / Data Model Changes

Update the schema to support multi-brand content variants.

### Add brand-aware content fields such as:
- `brand`
- `brand_slug`
- `brand_publish_status`
- `brand_title`
- `brand_summary`
- `brand_intro`
- `brand_meta_title`
- `brand_meta_description`
- `brand_canonical_url`
- `brand_featured_section`
- `brand_related_links`
- `brand_social_copy`
- `brand_homepage_priority`
- `brand_article_priority`

Also support:
- selective event/article publication by brand
- brand-specific homepage modules
- brand-specific featured event sets
- brand-specific content hubs

---

## 15. Homepage Module Suggestions Per Brand

### AILayoffWatch homepage modules
- Main total
- Conservative / core / upper chart
- Methodology callout
- Reviewed updates
- Biggest events this month
- Sector trend summary

### AILayoffs homepage modules
- Main total
- Latest announcements
- Largest companies affected
- Country leaderboard
- AI layoffs by company
- Recent additions to tracker

### AICuts homepage modules
- Main total
- Breaking cuts ticker
- This week’s biggest events
- Latest rapid summaries
- Fast-moving sector spikes
- Daily roundup link

### RobotLayoffs homepage modules
- Main total
- Manufacturing / warehouse / logistics split
- Top industries affected
- Automation event feed
- Robot displacement by geography
- Latest physical automation updates

---

## 16. Page-by-Page SEO Split Principle

Each site should be answerable in one sentence.

### AILayoffWatch
The research-grade AI layoff tracker.

### AILayoffs
The direct public AI layoffs counter.

### AICuts
The fast-moving AI cuts update site.

### RobotLayoffs
The robot and automation displacement tracker.

This principle should guide:
- homepage copy
- nav labels
- content hubs
- article titles
- social copy
- metadata

---

## 17. Implementation Priority

Update implementation plan to include:

### Phase 1
1. Add multi-brand content fields
2. Differentiate homepage content per brand
3. Add unique collection pages per brand
4. Add footer related-trackers block
5. Add brand-specific article title/summary support
6. Add selective publish controls by brand
7. Add canonical controls

### Phase 2
8. Add social post generation per brand
9. Add featured content modules per brand
10. Add brand-specific roundup templates
11. Add editorial dashboard for cross-brand publishing choices

### Phase 3
12. Add advanced index control tools
13. Add per-brand content performance reporting
14. Add recommendation engine for which events should publish to which brands

---

## 18. Final Product Principle

The network should feel like:
- one strong data engine
- several legitimate editorial brands

It should **not** feel like:
- a duplicate-content farm
- a doorway network
- a set of cloned sites trying to capture the same SERPs

Build the system so that:
- data is shared
- brands are differentiated
- homepage and article framing vary
- footer links are light and user-helpful
- indexing strategy is intentional
- each domain can succeed on its own angle