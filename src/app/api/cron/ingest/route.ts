import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { runIngestionPipeline } from '@/lib/ingestion/pipeline'

export const maxDuration = 300

/**
 * Cron endpoint for automated ingestion.
 * Call every 6 hours — alternates between Anthropic and OpenAI.
 *
 * Railway cron or external scheduler hits:
 *   GET /api/cron/ingest?secret=YOUR_ADMIN_SECRET
 *
 * Schedule: 0 0,6,12,18 * * *  (every 6 hours)
 * - Hours 0, 12: Anthropic (Claude)
 * - Hours 6, 18: OpenAI (GPT-4o-mini)
 */
export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')
  const expectedSecret = process.env.ADMIN_SECRET

  if (!expectedSecret || expectedSecret === 'change-me-in-production') {
    return NextResponse.json({ error: 'ADMIN_SECRET not configured' }, { status: 503 })
  }

  if (secret !== expectedSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const hasAnthropicKey = !!process.env.ANTHROPIC_API_KEY
  const hasOpenAIKey = !!process.env.OPENAI_API_KEY

  if (!process.env.EXA_API_KEY || (!hasAnthropicKey && !hasOpenAIKey)) {
    return NextResponse.json({ error: 'Missing API keys' }, { status: 503 })
  }

  // Alternate provider based on current hour
  const hour = new Date().getUTCHours()
  let provider: 'anthropic' | 'openai'

  if (hour % 12 < 6) {
    provider = hasAnthropicKey ? 'anthropic' : 'openai'
  } else {
    provider = hasOpenAIKey ? 'openai' : 'anthropic'
  }

  console.log(`[CRON] Ingestion starting — provider: ${provider}, hour: ${hour}`)

  const result = await runIngestionPipeline(prisma, provider)

  // Also update the live counter after ingestion
  try {
    const { updateLiveCounters } = await import('@/lib/ingestion/update-counters')
    await updateLiveCounters(prisma)
    console.log('[CRON] Live counters updated')
  } catch (e: any) {
    console.error('[CRON] Counter update failed:', e.message)
  }

  return NextResponse.json({ success: true, provider, ...result })
}
