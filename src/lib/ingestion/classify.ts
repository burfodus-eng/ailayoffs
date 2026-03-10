import Anthropic from '@anthropic-ai/sdk'
import OpenAI from 'openai'

export interface ClassificationResult {
  relevant: boolean
  eventType: 'AI_LAYOFF' | 'ROBOT_LAYOFF' | 'AI_JOB_CREATED' | 'PRODUCTIVITY_GAIN' | null
  companyName: string | null
  country: string | null
  industry: string | null
  jobCount: number | null
  dateAnnounced: string | null // ISO date
  attributionCategory: 'EXPLICIT' | 'STRONG' | 'MODERATE' | 'WEAK' | 'FRINGE' | null
  confidenceScore: number
  publicSummary: string | null
  reasoning: string
}

const SYSTEM_PROMPT = `You are an AI layoff data analyst. Given a news article, extract structured data about AI-driven job displacement events.

CRITICAL RULES:
- Each event must be about ONE specific company. If an article covers multiple companies, extract ONLY the PRIMARY company (the one with the most detail/focus). Set relevant=false for generic roundup articles listing many companies briefly.
- REJECT (relevant=false) articles that are:
  - Roundups/listicles covering multiple companies without depth on any single one
  - Opinion pieces or predictions without a concrete announced event
  - Articles about AI industry trends without a specific company action
- companyName must be the SHORT, canonical company name: "Block" not "Block (formerly Square)", "Oracle" not "Oracle Corp." or "Oracle Corporation", "Meta" not "Meta Platforms Inc."
- dateAnnounced is REQUIRED for layoff/hiring events. Use the date the action was announced. If no specific date is mentioned in the article, estimate from context or set to null — but events without dates are lower quality.
- jobCount should be a specific number. Do not use 0 — if no number is mentioned, set to null.
- country should be the 2-letter ISO code: "US", "AU", "UK", "IN", "DE", etc.

Attribution categories:
- EXPLICIT: Company directly states AI/automation caused the cuts
- STRONG: Leadership mentions AI in context of cuts but doesn't explicitly link them
- MODERATE: Company is investing in AI AND cutting jobs simultaneously
- WEAK: General industry trend, no direct company statement
- FRINGE: Very tenuous connection

Event types:
- AI_LAYOFF: Jobs cut where AI played a role
- ROBOT_LAYOFF: Physical robots/RPA displacing workers
- AI_JOB_CREATED: AI company hiring new roles
- PRODUCTIVITY_GAIN: Company reports AI efficiency gains (no layoffs)

Write a 3-5 sentence publicSummary suitable for display on a data tracker website.

Respond ONLY with valid JSON:
{
  "relevant": boolean,
  "eventType": "AI_LAYOFF" | "ROBOT_LAYOFF" | "AI_JOB_CREATED" | "PRODUCTIVITY_GAIN" | null,
  "companyName": string | null,
  "country": string | null,
  "industry": string | null,
  "jobCount": number | null,
  "dateAnnounced": "YYYY-MM-DD" | null,
  "attributionCategory": "EXPLICIT" | "STRONG" | "MODERATE" | "WEAK" | "FRINGE" | null,
  "confidenceScore": 0.0-1.0,
  "publicSummary": string | null,
  "reasoning": string
}`

export async function classifyArticle(
  title: string,
  text: string,
  url: string,
  provider: 'anthropic' | 'openai'
): Promise<ClassificationResult> {
  const userPrompt = `Classify this article:\n\nTitle: ${title}\nURL: ${url}\n\nContent (first 4000 chars):\n${text.slice(0, 4000)}`

  try {
    let responseText: string

    if (provider === 'anthropic') {
      const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
      const msg = await client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userPrompt }],
      })
      responseText = msg.content[0].type === 'text' ? msg.content[0].text : ''
    } else {
      const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
      const completion = await client.chat.completions.create({
        model: 'gpt-4o-mini',
        max_tokens: 1024,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt },
        ],
      })
      responseText = completion.choices[0]?.message?.content || ''
    }

    // Extract JSON from response (handle markdown code blocks)
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return { relevant: false, eventType: null, companyName: null, country: null, industry: null, jobCount: null, dateAnnounced: null, attributionCategory: null, confidenceScore: 0, publicSummary: null, reasoning: 'Failed to parse LLM response' }
    }

    return JSON.parse(jsonMatch[0]) as ClassificationResult
  } catch (error: any) {
    console.error(`Classification error (${provider}):`, error.message)
    return { relevant: false, eventType: null, companyName: null, country: null, industry: null, jobCount: null, dateAnnounced: null, attributionCategory: null, confidenceScore: 0, publicSummary: null, reasoning: `Error: ${error.message}` }
  }
}
