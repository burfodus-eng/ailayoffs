import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { jobTitle, industry, country, tasks, experience, education } = await request.json()

  if (!jobTitle) {
    return NextResponse.json({ error: 'Job title required' }, { status: 400 })
  }

  // Check if we have an AI API key
  const anthropicKey = process.env.ANTHROPIC_API_KEY
  const openaiKey = process.env.OPENAI_API_KEY

  if (!anthropicKey && !openaiKey) {
    return NextResponse.json({ error: 'Analysis unavailable. AI API key required.' }, { status: 503 })
  }

  try {
    if (anthropicKey) {
      const Anthropic = (await import('@anthropic-ai/sdk')).default
      const client = new Anthropic({ apiKey: anthropicKey })

      const message = await client.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        messages: [{
          role: 'user',
          content: `Analyze the AI/automation displacement risk for this job. Return JSON only with these fields:
- riskScore (0-100, where 100 is highest risk of displacement)
- aiRiskScore (0-100)
- roboticsRiskScore (0-100)
- timeHorizon (string like "2-5 years", "5-10 years")
- reasoning (2-3 sentences)
- suggestions (array of 3-5 resilience suggestions)
- adjacentRoles (array of 2-3 safer adjacent roles)

Job: ${jobTitle}
Tasks: ${tasks?.join(', ') || 'not specified'}
Experience: ${experience || 'not specified'}
Education: ${education || 'not specified'}
${industry ? `Industry: ${industry}` : ''}
${country ? `Country: ${country}` : ''}

Return ONLY valid JSON, no markdown.`
        }],
      })

      const text = message.content[0].type === 'text' ? message.content[0].text : ''
      const parsed = JSON.parse(text)
      return NextResponse.json(parsed)
    }

    // Fallback to OpenAI
    const OpenAI = (await import('openai')).default
    const client = new OpenAI({ apiKey: openaiKey })
    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{
        role: 'user',
        content: `Analyze the AI/automation displacement risk for this job. Return JSON only with these fields:
- riskScore (0-100, where 100 is highest risk of displacement)
- aiRiskScore (0-100)
- roboticsRiskScore (0-100)
- timeHorizon (string like "2-5 years", "5-10 years")
- reasoning (2-3 sentences)
- suggestions (array of 3-5 resilience suggestions)
- adjacentRoles (array of 2-3 safer adjacent roles)

Job: ${jobTitle}
Tasks: ${tasks?.join(', ') || 'not specified'}
Experience: ${experience || 'not specified'}
Education: ${education || 'not specified'}
${industry ? `Industry: ${industry}` : ''}
${country ? `Country: ${country}` : ''}

Return ONLY valid JSON, no markdown.`
      }],
      response_format: { type: 'json_object' },
    })

    const parsed = JSON.parse(completion.choices[0].message.content || '{}')
    return NextResponse.json(parsed)
  } catch (err) {
    console.error('Job security analysis error:', err)
    return NextResponse.json({ error: 'Analysis failed. Please try again.' }, { status: 500 })
  }
}
