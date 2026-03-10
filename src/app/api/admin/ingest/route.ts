import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { runIngestionPipeline } from '@/lib/ingestion/pipeline'

export const maxDuration = 300 // 5 min max for serverless

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const expectedSecret = process.env.ADMIN_SECRET

  if (!expectedSecret || authHeader !== `Bearer ${expectedSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const hasExaKey = !!process.env.EXA_API_KEY
  const hasAnthropicKey = !!process.env.ANTHROPIC_API_KEY
  const hasOpenAIKey = !!process.env.OPENAI_API_KEY

  if (!hasExaKey || (!hasAnthropicKey && !hasOpenAIKey)) {
    return NextResponse.json({
      error: 'Missing API keys',
      apis: {
        exa: hasExaKey ? 'configured' : 'missing',
        anthropic: hasAnthropicKey ? 'configured' : 'missing',
        openai: hasOpenAIKey ? 'configured' : 'missing',
      },
    }, { status: 503 })
  }

  // Parse optional body params
  let provider: 'anthropic' | 'openai' = 'anthropic'
  let runIndex: number | undefined
  try {
    const body = await request.json()
    if (body.provider === 'openai' && hasOpenAIKey) provider = 'openai'
    if (body.provider === 'anthropic' && hasAnthropicKey) provider = 'anthropic'
    if (typeof body.runIndex === 'number') runIndex = body.runIndex
  } catch {
    // No body or invalid JSON — use defaults
  }

  // Auto-select provider if requested one isn't available
  if (provider === 'anthropic' && !hasAnthropicKey) provider = 'openai'
  if (provider === 'openai' && !hasOpenAIKey) provider = 'anthropic'

  console.log(`Starting ingestion with ${provider}...`)

  const result = await runIngestionPipeline(prisma, provider, runIndex)

  return NextResponse.json({
    success: true,
    provider,
    ...result,
  })
}

// GET for status check
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const expectedSecret = process.env.ADMIN_SECRET

  if (!expectedSecret || authHeader !== `Bearer ${expectedSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const recentLogs = await prisma.ingestionLog.findMany({
    orderBy: { startedAt: 'desc' },
    take: 10,
  })

  return NextResponse.json({
    ready: !!process.env.EXA_API_KEY && (!!process.env.ANTHROPIC_API_KEY || !!process.env.OPENAI_API_KEY),
    recentRuns: recentLogs,
  })
}
