/**
 * Claude Vision verification — checks if an image is appropriate
 * for a news article about a company event (layoff, restructuring, etc).
 * Rejects irrelevant images (toys, nature, cartoons, etc).
 */

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY

interface VerifyResult {
  suitable: boolean
  reason: string
  description: string // What Claude sees in the image
}

/**
 * Ask Claude Vision if an image is appropriate for the given context.
 * Uses the image URL directly (no download needed).
 */
export async function verifyImage(
  imageUrl: string,
  context: {
    companyName?: string | null
    industry?: string | null
    eventType: string
    publicSummary?: string | null
  }
): Promise<VerifyResult> {
  if (!ANTHROPIC_API_KEY) {
    // If no API key, skip verification and accept the image
    return { suitable: true, reason: 'no_api_key', description: 'unverified' }
  }

  const eventDesc = context.eventType === 'ROBOT_LAYOFF'
    ? 'robot/automation-related job displacement'
    : context.eventType === 'AI_JOB_CREATED'
    ? 'AI company hiring/job creation'
    : context.eventType === 'PRODUCTIVITY_GAIN'
    ? 'AI-driven productivity improvement'
    : 'AI-related layoffs/workforce reduction'

  const prompt = `You are checking if this image is suitable as a cover photo for a news article.

The article is about: ${context.companyName || 'a company'} (${context.industry || 'unknown industry'}) — ${eventDesc}.

Is this image appropriate? It should look professional and relate to business, technology, corporate, or the company's industry.

REJECT if the image shows:
- Toys, children's items, cartoons, or whimsical objects
- Nature/plants/animals unrelated to the industry
- Food, cooking, or restaurants (unless the company is in food industry)
- Random people's personal photos
- Blurry, low quality, or watermarked images
- Anything inappropriate or unprofessional

ACCEPT if the image shows:
- Corporate buildings, offices, or headquarters
- Technology, servers, data centers
- Business meetings, boardrooms
- Industry-relevant scenes (factory for manufacturing, etc)
- Professional stock photography of relevant subjects

Return ONLY valid JSON (no markdown):
{"suitable": true/false, "reason": "brief explanation", "description": "what you see in the image (30-80 chars)"}`;

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 200,
        messages: [{
          role: 'user',
          content: [
            { type: 'image', source: { type: 'url', url: imageUrl } },
            { type: 'text', text: prompt },
          ],
        }],
      }),
      signal: AbortSignal.timeout(30000),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error(`[VERIFY] Claude API error: ${res.status} ${err.substring(0, 200)}`)
      return { suitable: true, reason: 'api_error', description: 'unverified' }
    }

    const data = await res.json() as any
    const text = data.content?.[0]?.text?.trim() || ''
    const jsonStr = text.replace(/^```json?\n?/, '').replace(/\n?```$/, '')
    const result = JSON.parse(jsonStr)

    return {
      suitable: !!result.suitable,
      reason: result.reason || '',
      description: result.description || '',
    }
  } catch (e: any) {
    console.error(`[VERIFY] Error: ${e.message}`)
    // On error, accept the image rather than blocking
    return { suitable: true, reason: 'error', description: 'unverified' }
  }
}
