import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const expectedSecret = process.env.ADMIN_SECRET

  if (!expectedSecret || authHeader !== `Bearer ${expectedSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Pipeline will be triggered here when APIs are configured
  // For now, return status
  const hasExaKey = !!process.env.EXA_API_KEY
  const hasAnthropicKey = !!process.env.ANTHROPIC_API_KEY
  const hasOpenAIKey = !!process.env.OPENAI_API_KEY

  return NextResponse.json({
    message: 'Ingestion pipeline status',
    ready: hasExaKey && (hasAnthropicKey || hasOpenAIKey),
    apis: {
      exa: hasExaKey ? 'configured' : 'missing EXA_API_KEY',
      anthropic: hasAnthropicKey ? 'configured' : 'missing ANTHROPIC_API_KEY',
      openai: hasOpenAIKey ? 'configured' : 'missing OPENAI_API_KEY',
    },
  })
}
