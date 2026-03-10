# Claude Build Update — Affiliate Rollout Expansion for Training, AI Tools, and Job Security

Update the monetization rollout to include a first-wave affiliate layer centered on:
- upskilling and retraining
- job transition support
- AI productivity tools
- contextual recommendations tied to article topics and job-security results

This rollout should remain subtle and useful.
The tracker must still feel like a serious data product, not an ad-heavy content farm.

---

## 1. Approved First-Wave Affiliate Partners

Add support for the following affiliate partners as the initial rollout set.

### Training / Upskilling Partners
- Coursera
- Udemy
- DataCamp
- Codecademy
- edX
- Pluralsight
- Skillshare

### Career / Transition Support
- Resume.io

### AI Tools / Builder / Research Partners
- Perplexity
- Base44

Affiliate details, tracking URLs, and partner-specific rules will be provided later and should be easy to add via admin/config.

---

## 2. Core Rollout Principle

The affiliate layer should help users answer:
- What should I learn next?
- What tools should I try?
- How do I improve my job resilience?
- How do I pivot into safer work?
- How do I improve my resume or transition path?

The site should not feel like it is monetizing fear aggressively.
Affiliate modules should look like:
- recommended next steps
- relevant learning options
- practical tools
- job-security resources

---

## 3. Article Monetization Strategy

Add a light affiliate layer to article/event pages.

### Main rule
Do not clutter articles with obvious promo blocks or spammy banner placements.

Instead, allow:
- a small recommendation module near the end of the article
- a few contextual inline links using common, natural phrases
- occasional small tool or training callouts
- clear but subtle disclosure

---

## 4. Inline Link Strategy for Articles

Support contextual inline affiliate links using common relevant words or short phrases inside article summaries or supporting editorial copy.

This should be implemented carefully.

### Allowed approach
Link common phrases such as:
- training
- upskilling
- learn more
- skill development
- AI skills
- coding skills
- analytics training
- automation skills
- resume tools
- research tools
- workflow tools
- AI tools
- career transition
- job search help

These phrases may link to relevant affiliate offers when contextually appropriate.

### Important rules
- links must fit naturally in the sentence
- links must be relevant to the article topic
- do not force a brand name unnaturally into editorial text
- do not overload a paragraph with links
- do not turn source citations into affiliate links
- do not randomly inject links with no topic relevance
- keep the editorial text readable and trustworthy

### Preferred pattern
Use neutral/common words in the text, with the destination brand shown in the hover/target or nearby label if needed.

Example:
- “Readers looking at retraining options can explore relevant **training** pathways.”
- “Some workers may want to build more resilient **AI skills**.”
- “People affected may want **resume tools** and structured transition support.”
- “This trend may increase demand for **research tools** and **workflow tools**.”

### Avoid
- awkwardly inserting “Claude” or other brand names into factual article summaries
- excessive linking in the first paragraph
- keyword stuffing with commercial anchors

---

## 5. Contextual Relevance Rules

Inline or module-based recommendations must follow topic relevance.

### Example mappings

#### Engineering / software layoffs
Prefer:
- DataCamp
- Codecademy
- Coursera
- Pluralsight
- Udemy
- Base44

Inline link phrases:
- coding skills
- AI skills
- technical training
- builder tools
- workflow tools

#### Admin / support / clerical displacement
Prefer:
- Coursera
- Udemy
- Skillshare
- Resume.io
- Perplexity

Inline link phrases:
- upskilling
- digital skills
- career transition
- resume tools
- research tools

#### Analyst / research / knowledge work displacement
Prefer:
- Coursera
- DataCamp
- Perplexity
- Udemy

Inline link phrases:
- analytics training
- research tools
- AI skills
- workflow tools

#### Product / operations / business roles
Prefer:
- Coursera
- edX
- Udemy
- Perplexity
- Resume.io

Inline link phrases:
- leadership training
- operations skills
- workflow tools
- job search help

#### Creator / marketing / communications roles
Prefer:
- Skillshare
- Coursera
- Udemy
- Perplexity

Inline link phrases:
- creative training
- digital skills
- content skills
- research tools

---

## 6. Article-End Recommendation Module

Each article page may optionally include a small recommendation module.

### Suggested titles
- Suggested next step
- Upskilling options
- Career resilience resources
- Tools and training
- What to learn next

### Module contents
- 1 to 3 recommendations max
- short rationale for each
- clear distinction between training and tools
- subtle affiliate disclosure

### Example structure
- One technical learning option
- One general retraining option
- One job transition or tool option

---

## 7. Job Security Page — Expanded Monetization Layer

The job security checker should be the strongest and most structured affiliate surface.

After a user receives their result, include:

### A. Risk report
- overall job risk score
- AI exposure
- robotics/automation exposure
- time horizon
- reasoning summary
- confidence level

### B. Skill resilience section
- capabilities that improve resilience
- adjacent safer skills
- suggested next learning steps
- role pivots worth considering

### C. Recommended learning pathways
Add a more detailed monetized recommendation section that can include:
- beginner pathway
- technical pathway
- non-technical pathway
- career switch pathway
- resume/job-search support
- tool stack suggestions

### D. Tool recommendations
Where relevant, include:
- Perplexity as a research or knowledge-work tool
- Base44 as a builder/productivity/creation tool
- later partner details can support additional tools

### E. Affiliate presentation style
Use a structured result card format:
- Recommended course/provider
- Why it fits this risk profile
- Skill area
- Beginner / Intermediate / Advanced
- Tool / Training / Resume Support tag

This page can carry more affiliate density than article pages, but still must remain clean and useful.

---

## 8. Recommendation Categories for Job Security Results

Support these recommendation buckets:

### Training
- foundational AI literacy
- data and analytics
- programming / automation
- digital operations
- business analytics
- product / workflow skills
- communication / leadership / management
- creative and digital content skills

### Career Transition
- resume improvement
- interview preparation
- job-search support
- portfolio or profile improvement

### Tools
- research tools
- workflow tools
- builder tools
- productivity tools

---

## 9. AI Tools Partner Placement Rules

Add a separate class of affiliate placements for AI platforms/tools.

### Approved first-wave AI tools
- Perplexity
- Base44

### Usage guidance
These should generally appear:
- in job-security results
- in tool recommendation modules
- occasionally in article-end modules
- not heavily inside the opening factual summary of articles

### Best contextual phrases for linking
- research tools
- workflow tools
- builder tools
- AI tools
- productivity tools
- faster research
- rapid prototyping tools
- idea-to-app tools

### Avoid
- awkwardly forcing tool brand names into article prose
- linking brands in a way that confuses editorial content with recommendations

---

## 10. Content System Support

Update the content generation system so each article can optionally generate:

- inline common-word affiliate links
- one small article-end affiliate module
- one brand-aware social excerpt
- one job-security cross-link if relevant

### Generated article support fields
Add support for:
- affiliate_link_density
- affiliate_inline_phrases
- affiliate_module_variant
- recommended_offer_ids
- recommendation_rationale
- disclosure_variant
- monetization_enabled boolean

---

## 11. Inline Link Density Rules

To preserve trust and readability, enforce limits.

### Rules
- max 1 inline affiliate link in short articles
- max 2 inline affiliate links in longer article pages
- no affiliate links in the first sentence
- no affiliate links inside source citation areas
- no affiliate links in methodology explanations
- no affiliate links in charts/tables
- no affiliate links in raw event metadata blocks

This is important.

The content should still read like journalism/data commentary first.

---

## 12. Disclosure Rules

Keep disclosures light but clear.

### Acceptable patterns
- “Some links may earn us a commission.”
- “Recommended resources may include affiliate links.”
- “We may earn from qualifying referrals.”

### Placement
- global footer disclosure
- local module disclosure where needed
- job-security page disclosure near recommendation section

Do not make affiliate links look like evidence or source citations.

---

## 13. Admin / Config Requirements

Prepare admin/config support for:
- storing affiliate partner details
- storing offer-specific tracking URLs
- tagging offers by role family, industry, and skill type
- enabling/disabling inline linking
- setting per-brand aggressiveness
- setting page-type rules
- editing common-word anchor lists
- controlling randomization and frequency
- previewing generated affiliate placements before publish

Affiliate details will be provided later and should be easy to paste into the system.

---

## 14. Randomized Linking Rules

Support limited randomized linking from an approved phrase pool, but only within strict relevance rules.

### Requirements
- randomization should occur only among relevant offers
- phrase selection should come from an approved phrase list
- do not randomly attach links to unrelated words
- do not make every article monetized in the same pattern
- vary link choice, module choice, and wording slightly across articles
- keep brand trust above revenue optimization

### Example
If an article is about AI replacing entry-level analysts:
- possible inline phrase = “analytics training”
- possible module links = Coursera, DataCamp, Perplexity

If an article is about builders or coding productivity:
- possible inline phrase = “builder tools” or “coding skills”
- possible module links = Codecademy, DataCamp, Base44

Randomization should happen inside a constrained matching system, not a blind ad engine.

---

## 15. Per-Brand Tone Rules

### AILayoffWatch
Most restrained.
Use:
- limited inline links
- small recommendation modules
- strong trust/disclosure discipline

### AILayoffs
Direct and practical.
Use:
- one article-end module
- occasional inline common-word links
- stronger job transition suggestions

### AICuts
More dynamic.
Use:
- punchier recommendation copy
- daily roundup-compatible recommendation blocks
- still keep density controlled

### RobotLayoffs
Focus on:
- industrial skills
- automation-adjacent retraining
- technical tools
- operations/productivity resources

---

## 16. Suggested First-Wave Offer Mapping

### Coursera
Best for:
- broad professional certificates
- AI literacy
- data/analytics
- business skills
- career switching

### Udemy
Best for:
- flexible course variety
- broad skill targeting
- low-friction recommendations

### DataCamp
Best for:
- analytics
- data
- Python
- technical transitions

### Codecademy
Best for:
- coding pathways
- software-adjacent upskilling

### edX
Best for:
- formal-feeling education options
- technical and professional pathways

### Pluralsight
Best for:
- engineering
- IT
- developer-focused upskilling

### Skillshare
Best for:
- broader creative/business/generalist skill development

### Resume.io
Best for:
- resume improvement
- immediate job transition support

### Perplexity
Best for:
- research tools
- knowledge work support
- information gathering workflows

### Base44
Best for:
- builder tools
- rapid prototyping
- productivity/creation workflows

---

## 17. Rollout Priority

### Phase 1
1. Add affiliate partner/config tables
2. Add offer tagging by role/industry/topic
3. Add job-security recommendation panels
4. Add article-end recommendation module
5. Add inline common-word affiliate linking support
6. Add disclosure system
7. Add Perplexity and Base44 tool recommendations

### Phase 2
8. Add per-brand monetization tuning
9. Add randomized phrase selection within constraints
10. Add recommendation analytics
11. Add editable phrase banks and mapping logic

### Phase 3
12. Add performance reporting
13. Add A/B testing
14. Add more tool and training partners
15. Add user-behavior-based recommendation refinement

---

## 18. Final Principle

This affiliate rollout should feel like:
- a useful resource layer
- practical next-step guidance
- subtle support for user action

It should not feel like:
- hidden ad stuffing
- random commercial linking
- editorial compromise
- a low-quality affiliate content site

The tracker remains the product.
The affiliate layer helps users respond constructively to the information they just learned.