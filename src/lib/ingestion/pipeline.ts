import Exa from 'exa-js'
import { PrismaClient } from '@/generated/prisma'
import { classifyArticle, ClassificationResult } from './classify'
import { getQueriesForRun } from './search-queries'
import { getSourceReputation } from './source-reputation'

// Normalize company name for dedup matching
function normalizeCompanyName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s*\(formerly.*?\)/gi, '')  // "Block (formerly Square)" → "block"
    .replace(/\s*\(.*?\)/gi, '')           // Remove any parentheticals
    .replace(/\b(inc|corp|corporation|co|ltd|limited|plc|group|holdings|technologies|enterprises)\b\.?/gi, '')
    .replace(/[^a-z0-9]/g, '')             // Strip non-alphanumeric
    .trim()
}

// Check if two company names likely refer to the same entity
function isSameCompany(a: string, b: string): boolean {
  const na = normalizeCompanyName(a)
  const nb = normalizeCompanyName(b)
  if (na === nb) return true
  // One contains the other (e.g. "oracle" vs "oraclecorp")
  if (na.length > 3 && nb.length > 3 && (na.includes(nb) || nb.includes(na))) return true
  return false
}

interface PipelineResult {
  queriesRun: number
  articlesFound: number
  articlesNew: number
  eventsCreated: number
  eventsSkipped: number
  errors: string[]
}

// Compute weighted AI jobs from announced count and attribution
function computeWeightedJobs(jobCount: number, category: string): { conservative: number; weighted: number; upper: number } {
  const weights: Record<string, { conservative: number; core: number; upper: number }> = {
    EXPLICIT: { conservative: 1.0, core: 1.0, upper: 1.0 },
    STRONG: { conservative: 0.0, core: 0.75, upper: 1.0 },
    MODERATE: { conservative: 0.0, core: 0.40, upper: 0.70 },
    WEAK: { conservative: 0.0, core: 0.15, upper: 0.35 },
    FRINGE: { conservative: 0.0, core: 0.05, upper: 0.15 },
  }
  const w = weights[category] || weights.FRINGE
  return {
    conservative: Math.round(jobCount * w.conservative),
    weighted: Math.round(jobCount * w.core),
    upper: Math.round(jobCount * w.upper),
  }
}

export async function runIngestionPipeline(
  prisma: PrismaClient,
  provider: 'anthropic' | 'openai',
  runIndex?: number
): Promise<PipelineResult> {
  const result: PipelineResult = {
    queriesRun: 0,
    articlesFound: 0,
    articlesNew: 0,
    eventsCreated: 0,
    eventsSkipped: 0,
    errors: [],
  }

  const exa = new Exa(process.env.EXA_API_KEY!)

  // Determine which queries to run this cycle
  const idx = runIndex ?? Math.floor(Date.now() / (12 * 60 * 60 * 1000)) // rotates every 12h
  const queries = getQueriesForRun(idx)

  // Log the ingestion run
  const log = await prisma.ingestionLog.create({
    data: { pipeline: `auto-${provider}`, status: 'running' },
  })

  try {
    for (const query of queries) {
      result.queriesRun++
      try {
        // Search for recent articles (last 7 days)
        const searchResult = await exa.searchAndContents(query, {
          type: 'neural',
          useAutoprompt: true,
          numResults: 5,
          startPublishedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          text: { maxCharacters: 5000 },
        })

        for (const item of searchResult.results) {
          result.articlesFound++

          if (!item.url || !item.title) continue

          // ── Source reputation gate (before any LLM calls) ──
          const reputation = getSourceReputation(item.url)

          if (reputation.tier === 'blocked') {
            console.log(`BLOCK (banned source): ${reputation.domain} — ${item.title}`)
            result.eventsSkipped++
            continue
          }

          // Check for duplicate article by URL
          const existingArticle = await prisma.article.findUnique({
            where: { url: item.url },
          })

          if (existingArticle) {
            result.eventsSkipped++
            continue
          }

          result.articlesNew++

          // Classify with LLM
          const classification = await classifyArticle(
            item.title,
            item.text || '',
            item.url,
            provider
          )

          if (!classification.relevant || !classification.eventType || !classification.companyName) {
            continue
          }

          // HARD RULE: Reject events with no date — too vague to be trustworthy
          if (!classification.dateAnnounced) {
            console.log(`SKIP (no date): ${classification.companyName} from ${reputation.domain}`)
            result.eventsSkipped++
            continue
          }

          // ── Source-tier-aware quality gates ──

          // Unknown sources need a specific job count — vague "layoffs" isn't enough
          if (reputation.requiresJobCount && !classification.jobCount) {
            console.log(`SKIP (unknown source, no job count): ${classification.companyName} from ${reputation.domain}`)
            result.eventsSkipped++
            continue
          }

          // Check LLM confidence against source tier minimum
          if (classification.confidenceScore < reputation.minConfidence) {
            console.log(`SKIP (confidence ${classification.confidenceScore} < ${reputation.minConfidence} for ${reputation.tier} source): ${classification.companyName} from ${reputation.domain}`)
            result.eventsSkipped++
            continue
          }

          console.log(`[${reputation.tier}] ${reputation.domain} (score ${reputation.score}) — ${classification.companyName}: ${classification.jobCount || '?'} jobs`)

          // Fuzzy duplicate check: find recent events for similar company names
          // For events with dates, check ±90 days. Also check ALL events for same company (catches dateless dupes).
          const candidateDate = new Date(classification.dateAnnounced)
          const potentialDuplicates = await prisma.event.findMany({
            where: {
              eventType: classification.eventType as any,
              reviewStatus: { not: 'EXCLUDED' },
              OR: [
                {
                  dateAnnounced: {
                    gte: new Date(candidateDate.getTime() - 90 * 24 * 60 * 60 * 1000),
                    lte: new Date(candidateDate.getTime() + 30 * 24 * 60 * 60 * 1000),
                  },
                },
                {
                  // Also catch events with no date for the same company
                  dateAnnounced: null,
                },
              ],
            },
            select: { id: true, companyName: true, jobsCutAnnounced: true },
          })

          const duplicateCheck = potentialDuplicates.find(existing =>
            existing.companyName && isSameCompany(existing.companyName, classification.companyName!)
          )

          if (duplicateCheck) {
            // Link article to existing event instead of creating new one
            try {
              // Create the source if needed
              const domain = new URL(item.url).hostname.replace('www.', '')
              const source = await prisma.source.upsert({
                where: { domain },
                create: { domain, name: domain },
                update: {},
              })

              const article = await prisma.article.create({
                data: {
                  title: item.title,
                  url: item.url,
                  sourceId: source.id,
                  publishedAt: item.publishedDate ? new Date(item.publishedDate) : null,
                  summary: item.text?.slice(0, 500) || null,
                  extractedText: item.text || null,
                },
              })

              await prisma.articleEvent.create({
                data: {
                  articleId: article.id,
                  eventId: duplicateCheck.id,
                  isPrimary: false,
                },
              })
            } catch (e: any) {
              // URL collision on article create — already exists
            }

            result.eventsSkipped++
            continue
          }

          // Create new event
          try {
            const domain = new URL(item.url).hostname.replace('www.', '')
            const source = await prisma.source.upsert({
              where: { domain },
              create: { domain, name: domain },
              update: {},
            })

            const article = await prisma.article.create({
              data: {
                title: item.title,
                url: item.url,
                sourceId: source.id,
                publishedAt: item.publishedDate ? new Date(item.publishedDate) : null,
                summary: item.text?.slice(0, 500) || null,
                extractedText: item.text || null,
              },
            })

            const jobCount = classification.jobCount || 0
            const { conservative, weighted, upper } = computeWeightedJobs(
              jobCount,
              classification.attributionCategory || 'FRINGE'
            )

            const event = await prisma.event.create({
              data: {
                eventType: classification.eventType as any,
                companyName: classification.companyName,
                country: classification.country,
                industry: classification.industry,
                dateAnnounced: classification.dateAnnounced ? new Date(classification.dateAnnounced) : null,
                jobsCutAnnounced: jobCount || null,
                conservativeAiJobs: conservative,
                weightedAiJobs: weighted,
                upperAiJobs: upper,
                attributionCategory: (classification.attributionCategory || 'FRINGE') as any,
                attributionWeight: classification.confidenceScore,
                confidenceScore: classification.confidenceScore,
                provisionalConfidenceScore: classification.confidenceScore,
                reasoningSummary: classification.reasoning,
                publicSummary: classification.publicSummary,
                reviewStatus: 'PROVISIONAL',
                reviewLevel: 'AUTOMATED',
                needsReview: true,
              },
            })

            await prisma.articleEvent.create({
              data: {
                articleId: article.id,
                eventId: event.id,
                isPrimary: true,
              },
            })

            result.eventsCreated++
            console.log(`NEW EVENT: [${classification.eventType}] ${classification.companyName} — ${jobCount} jobs (${classification.attributionCategory})`)
          } catch (e: any) {
            result.errors.push(`Event creation failed for ${item.url}: ${e.message}`)
          }
        }
      } catch (e: any) {
        result.errors.push(`Query "${query}" failed: ${e.message}`)
      }

      // Small delay between queries to be respectful
      await new Promise(r => setTimeout(r, 1000))
    }
  } finally {
    // Update ingestion log
    await prisma.ingestionLog.update({
      where: { id: log.id },
      data: {
        status: result.errors.length > 0 ? 'completed_with_errors' : 'completed',
        completedAt: new Date(),
        articlesFound: result.articlesFound,
        eventsCreated: result.eventsCreated,
        errors: result.errors,
        details: JSON.stringify(result),
      },
    })
  }

  return result
}
