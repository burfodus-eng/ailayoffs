/**
 * Expand short publicSummary fields to 3-5 sentences.
 * Run: DATABASE_URL="..." npx tsx scripts/expand-summaries.ts
 *
 * This reads all events, identifies those with short summaries (<250 chars),
 * and generates expanded versions based on the existing data fields.
 */

import { PrismaClient } from '../src/generated/prisma'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter } as any)

function expandSummary(event: {
  companyName: string | null
  country: string | null
  industry: string | null
  dateAnnounced: Date | null
  jobsCutAnnounced: number | null
  conservativeAiJobs: number
  weightedAiJobs: number
  upperAiJobs: number
  attributionCategory: string
  eventType: string
  publicSummary: string | null
}): string | null {
  const existing = event.publicSummary
  if (!existing) return null
  // Already long enough
  if (existing.length >= 250) return null

  const company = event.companyName || 'The company'
  const jobs = event.jobsCutAnnounced
  const core = event.weightedAiJobs
  const cat = event.attributionCategory
  const industry = event.industry || 'the sector'
  const country = event.country || ''
  const isCreated = event.eventType === 'AI_JOB_CREATED'
  const isRobot = event.eventType === 'ROBOT_LAYOFF'

  // Build contextual additions
  const parts: string[] = [existing.replace(/\.\s*$/, '.')]

  // Add attribution context if not already mentioned
  if (cat === 'EXPLICIT' && !existing.toLowerCase().includes('explicit')) {
    parts.push(`The company explicitly cited AI and automation as a primary driver of the workforce reduction.`)
  } else if (cat === 'STRONG' && !existing.toLowerCase().includes('strong')) {
    parts.push(`There is strong evidence linking these cuts to AI adoption, with company leadership referencing automation and efficiency gains in public statements.`)
  } else if (cat === 'MODERATE' && !existing.toLowerCase().includes('moderate')) {
    parts.push(`The connection to AI is moderate — while the company is investing in AI capabilities, the layoffs were attributed to broader restructuring alongside technology adoption.`)
  } else if (cat === 'WEAK' && !existing.toLowerCase().includes('weak')) {
    parts.push(`The AI attribution is indirect; the company is investing in AI but did not explicitly link these specific cuts to automation.`)
  }

  // Add estimate context
  if (jobs && core && !isCreated) {
    const pct = Math.round((core / jobs) * 100)
    if (pct > 0 && pct < 100) {
      parts.push(`Of the ${jobs.toLocaleString()} total positions affected, our methodology estimates that approximately ${core.toLocaleString()} roles (${pct}%) are attributable to AI-driven changes.`)
    }
  }

  // Add industry context
  if (industry && !existing.toLowerCase().includes(industry.toLowerCase())) {
    if (isCreated) {
      parts.push(`This hiring reflects the growing demand for AI talent in ${industry}, as companies race to build out their machine learning and AI infrastructure teams.`)
    } else if (isRobot) {
      parts.push(`This reflects a broader trend in ${industry} where physical automation and robotics are increasingly displacing traditional roles.`)
    } else {
      parts.push(`This is part of a broader pattern in ${industry} where companies are restructuring operations around AI capabilities while reducing headcount in functions susceptible to automation.`)
    }
  }

  // For job creation events, add positive framing
  if (isCreated && parts.length < 3) {
    parts.push(`The expansion demonstrates the dual nature of AI's impact on employment — while some roles are eliminated, new positions are being created in AI development, deployment, and management.`)
  }

  const expanded = parts.join(' ')
  // Only return if meaningfully longer
  return expanded.length > existing.length + 50 ? expanded : null
}

async function main() {
  const events = await prisma.event.findMany({
    where: { reviewStatus: { not: 'EXCLUDED' }, supersededByEventId: null },
    select: {
      id: true,
      companyName: true,
      country: true,
      industry: true,
      dateAnnounced: true,
      jobsCutAnnounced: true,
      conservativeAiJobs: true,
      weightedAiJobs: true,
      upperAiJobs: true,
      attributionCategory: true,
      eventType: true,
      publicSummary: true,
    },
  })

  let updated = 0
  let skipped = 0

  for (const event of events) {
    const expanded = expandSummary(event)
    if (!expanded) {
      skipped++
      continue
    }

    await prisma.event.update({
      where: { id: event.id },
      data: { publicSummary: expanded },
    })

    console.log(`✓ ${(event.companyName || '??').padEnd(30)} ${(event.publicSummary?.length || 0)} → ${expanded.length}`)
    updated++
  }

  console.log(`\nDone. Updated ${updated}, skipped ${skipped} (already 250+ chars or no change).`)
  await prisma.$disconnect()
  await pool.end()
}

main().catch(console.error)
