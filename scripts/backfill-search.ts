/**
 * Backfill search: find articles we missed and ingest them.
 * Searches Exa with broad queries, classifies with LLM, creates events.
 *
 * Usage: npx tsx scripts/backfill-search.ts
 */

import 'dotenv/config'
import Exa from 'exa-js'
import pg from 'pg'

const Pool = (pg as any).default?.Pool || pg.Pool

const QUERIES = [
  'Meta layoffs 2026 16000 jobs AI',
  'Oracle layoffs 2026 30000 restructuring',
  'Amazon layoffs 2026 AI',
  'Microsoft layoffs 2026',
  'Google layoffs 2026',
  'Salesforce layoffs 2026 AI',
  'Dell layoffs 2026',
  'Cisco layoffs 2026',
  'Intel layoffs restructuring 2026',
  'IBM layoffs 2026',
  'SAP layoffs 2026',
  'Accenture layoffs 2026',
  'KPMG Deloitte PwC layoffs 2026',
  'BT Group Ericsson Vodafone layoffs 2026',
  'Workday Shopify layoffs 2026',
  'FedEx UPS automation job cuts 2026',
  'banking layoffs AI 2026 JPMorgan Goldman',
  'tech layoffs February 2026',
  'tech layoffs January 2026',
  'AI job cuts Q1 2026',
]

const INDUSTRY_IMAGES: Record<string, string> = {
  Technology: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=630&fit=crop',
  Finance: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&h=630&fit=crop',
  'Financial Services': 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&h=630&fit=crop',
  Manufacturing: 'https://images.unsplash.com/photo-1565043666747-69f6646db940?w=1200&h=630&fit=crop',
  Telecommunications: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=630&fit=crop',
  'Professional Services': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=630&fit=crop',
  Government: 'https://images.unsplash.com/photo-1523292562811-8fa7962a78c8?w=1200&h=630&fit=crop',
  'Retail & E-commerce': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=630&fit=crop',
  default: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&h=630&fit=crop',
}

const WEIGHTS: Record<string, { c: number; w: number; u: number }> = {
  EXPLICIT: { c: 1, w: 1, u: 1 },
  STRONG: { c: 0, w: 0.75, u: 1 },
  MODERATE: { c: 0, w: 0.4, u: 0.7 },
  WEAK: { c: 0, w: 0.15, u: 0.35 },
  FRINGE: { c: 0, w: 0.05, u: 0.15 },
}

function normalizeCompany(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '')
}

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  const exa = new Exa(process.env.EXA_API_KEY!)

  // Load classify function
  const { classifyArticle } = await import('../src/lib/ingestion/classify')

  // Get existing URLs
  const existingRes = await pool.query('SELECT url FROM "Article"')
  const existingUrls = new Set(existingRes.rows.map((r: any) => r.url))

  // Phase 1: Search for new articles
  console.log('=== Phase 1: Searching for missed articles ===\n')
  const allNew: Array<{ title: string; url: string; date: string | null; text: string | null }> = []

  for (const q of QUERIES) {
    try {
      const result = await exa.searchAndContents(q, {
        type: 'neural',
        useAutoprompt: true,
        numResults: 10,
        startPublishedDate: '2025-10-01',
        text: { maxCharacters: 3000 },
      })

      let found = 0
      for (const item of result.results) {
        if (!existingUrls.has(item.url) && !allNew.find(a => a.url === item.url)) {
          allNew.push({
            title: item.title,
            url: item.url,
            date: item.publishedDate?.substring(0, 10) || null,
            text: item.text || null,
          })
          existingUrls.add(item.url)
          found++
        }
      }
      if (found > 0) console.log(`  ${q} -> ${found} new`)
    } catch (e: any) {
      console.error(`  Query failed: ${q} — ${e.message?.substring(0, 50)}`)
    }
    await new Promise(r => setTimeout(r, 1000))
  }

  console.log(`\nTotal new articles: ${allNew.length}\n`)

  // Phase 2: Classify and ingest
  console.log('=== Phase 2: Classifying and ingesting ===\n')

  // Load existing events for dedup
  const eventsRes = await pool.query(
    'SELECT id, "companyName", "jobsCutAnnounced", "eventType" FROM "Event"'
  )
  const existingEvents = eventsRes.rows

  let created = 0, linked = 0, skippedCount = 0, errorCount = 0

  for (const item of allNew) {
    try {
      // Create source
      const domain = new URL(item.url).hostname.replace('www.', '')
      await pool.query(
        'INSERT INTO "Source" (id, domain, name) VALUES (gen_random_uuid(), $1, $1) ON CONFLICT (domain) DO NOTHING',
        [domain]
      )
      const srcRes = await pool.query('SELECT id FROM "Source" WHERE domain = $1', [domain])

      // Create article
      const artRes = await pool.query(
        `INSERT INTO "Article" (id, title, url, "sourceId", "publishedAt", summary, "extractedText", "createdAt", "updatedAt")
         VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, now(), now())
         ON CONFLICT (url) DO UPDATE SET title=EXCLUDED.title RETURNING id`,
        [item.title, item.url, srcRes.rows[0].id, item.date ? new Date(item.date) : null, item.text?.substring(0, 500), item.text]
      )

      // Classify with LLM
      const classification = await classifyArticle(item.title, item.text || '', item.url, 'anthropic')

      if (!classification.relevant || !classification.companyName) {
        skippedCount++
        continue
      }

      // Dedup check — match company name + job count
      const candidateNorm = normalizeCompany(classification.companyName)
      let matchedEvent = null

      for (const ev of existingEvents) {
        if (!ev.companyName) continue
        const evNorm = normalizeCompany(ev.companyName)
        if (evNorm !== candidateNorm && !evNorm.includes(candidateNorm) && !candidateNorm.includes(evNorm)) continue
        if (ev.eventType !== (classification.eventType || 'AI_LAYOFF')) continue

        // If both have job counts and differ by >2x, treat as separate
        if (ev.jobsCutAnnounced && classification.jobCount) {
          const ratio = Math.max(ev.jobsCutAnnounced, classification.jobCount) / Math.min(ev.jobsCutAnnounced, classification.jobCount)
          if (ratio > 2) continue
        }
        matchedEvent = ev
        break
      }

      if (matchedEvent) {
        await pool.query(
          'INSERT INTO "ArticleEvent" (id, "articleId", "eventId", "isPrimary") VALUES (gen_random_uuid(), $1, $2, false) ON CONFLICT DO NOTHING',
          [artRes.rows[0].id, matchedEvent.id]
        ).catch(() => {})
        linked++
        console.log(`  LINKED: ${classification.companyName} -> existing (${matchedEvent.jobsCutAnnounced || '?'} jobs)`)
      } else {
        // Create new event
        const jobs = classification.jobCount || 0
        const cat = classification.attributionCategory || 'FRINGE'
        const w = WEIGHTS[cat] || WEIGHTS.FRINGE
        const img = INDUSTRY_IMAGES[classification.industry || ''] || INDUSTRY_IMAGES.default

        let slug = classification.companyName.toLowerCase().replace(/[^a-z0-9]+/g, '-')
        if (classification.dateAnnounced) {
          slug += '-' + classification.dateAnnounced.substring(0, 7)
        } else {
          slug += '-2026'
        }

        // Prevent slug collision
        const slugCheck = await pool.query('SELECT id FROM "Event" WHERE slug = $1', [slug])
        if (slugCheck.rows.length > 0) slug += '-' + Date.now().toString(36).slice(-4)

        await pool.query(
          `INSERT INTO "Event" (id, slug, "coverImageUrl", "eventType", "companyName", country, industry,
           "dateAnnounced", "jobsCutAnnounced", "conservativeAiJobs", "weightedAiJobs", "upperAiJobs",
           "attributionCategory", "attributionWeight", "confidenceScore", "provisionalConfidenceScore",
           "publicSummary", "reviewStatus", "reviewLevel", "needsReview", "createdAt", "updatedAt")
           VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, now(), now())`,
          [slug, img, classification.eventType || 'AI_LAYOFF', classification.companyName,
           classification.country, classification.industry,
           classification.dateAnnounced ? new Date(classification.dateAnnounced) : null,
           jobs || null, Math.round(jobs * w.c), Math.round(jobs * w.w), Math.round(jobs * w.u),
           cat, classification.confidenceScore || 0.5, classification.confidenceScore || 0.5,
           classification.confidenceScore || 0.5, classification.publicSummary || classification.reasoning,
           'PROVISIONAL', 'AUTOMATED', true]
        )

        // Link article to new event
        const newEventRes = await pool.query('SELECT id FROM "Event" WHERE slug = $1', [slug])
        if (newEventRes.rows.length > 0) {
          await pool.query(
            'INSERT INTO "ArticleEvent" (id, "articleId", "eventId", "isPrimary") VALUES (gen_random_uuid(), $1, $2, true) ON CONFLICT DO NOTHING',
            [artRes.rows[0].id, newEventRes.rows[0].id]
          ).catch(() => {})

          // Add to existingEvents for subsequent dedup
          existingEvents.push({
            id: newEventRes.rows[0].id,
            companyName: classification.companyName,
            jobsCutAnnounced: jobs || null,
            eventType: classification.eventType || 'AI_LAYOFF',
          })
        }

        created++
        console.log(`  NEW: ${classification.companyName} — ${jobs || '?'} jobs (${cat}) [${slug}]`)
      }
    } catch (e: any) {
      errorCount++
      console.error(`  ERR: ${item.title?.substring(0, 50)} — ${e.message?.substring(0, 80)}`)
    }

    await new Promise(r => setTimeout(r, 500))
  }

  console.log(`\n=== DONE ===`)
  console.log(`Created: ${created} | Linked: ${linked} | Skipped: ${skippedCount} | Errors: ${errorCount}`)

  await pool.end()
}

main().catch(e => {
  console.error('Fatal:', e)
  process.exit(1)
})
