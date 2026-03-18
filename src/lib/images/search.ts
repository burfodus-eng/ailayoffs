/**
 * Smart image search for event cover images.
 * Searches by industry/context rather than company name to avoid irrelevant results.
 * Uses Pexels + Pixabay, picks the best candidate.
 */

const PEXELS_API_KEY = process.env.PEXELS_API_KEY
const PIXABAY_API_KEY = process.env.PIXABAY_API_KEY

interface ImageResult {
  url: string
  source: 'pexels' | 'pixabay'
  description: string
  width: number
  height: number
}

/**
 * Build a good search query based on the event context.
 * Never searches by company name — uses industry + event type instead.
 */
export function buildSearchQuery(event: {
  companyName?: string | null
  industry?: string | null
  eventType: string
  country?: string | null
}): string[] {
  const queries: string[] = []

  // Industry-specific queries (much better than company names)
  const industryQueries: Record<string, string[]> = {
    'Technology': ['corporate technology office', 'tech company headquarters', 'modern office building'],
    'Banking': ['bank building finance', 'financial district cityscape', 'corporate banking office'],
    'Financial Services': ['financial trading floor', 'finance corporate office', 'stock market business'],
    'Insurance': ['corporate insurance office', 'business meeting boardroom'],
    'Telecommunications': ['telecommunications tower network', 'telecom data center', 'network infrastructure'],
    'Manufacturing': ['factory manufacturing floor', 'industrial automation robots', 'manufacturing plant'],
    'Automotive': ['automotive factory production', 'car manufacturing assembly', 'auto industry'],
    'Healthcare': ['hospital medical technology', 'healthcare workers office', 'medical facility'],
    'Pharmaceutical': ['pharmaceutical laboratory research', 'medical research lab'],
    'Retail': ['retail store corporate', 'shopping business commerce'],
    'E-commerce': ['ecommerce warehouse logistics', 'online shopping technology'],
    'Government': ['government building capitol', 'public sector office'],
    'Legal': ['law firm office gavel', 'legal corporate meeting'],
    'Media': ['media newsroom broadcast', 'digital media office'],
    'Digital Media': ['digital media newsroom', 'content creator studio'],
    'Gaming': ['gaming studio development', 'video game technology'],
    'Airlines': ['airline airplane airport', 'aviation commercial flight'],
    'Logistics': ['logistics warehouse shipping', 'supply chain delivery'],
    'AI': ['artificial intelligence technology', 'AI robot futuristic office', 'machine learning data'],
    'Robotics': ['robot automation industrial', 'robotics technology factory'],
    'Defense': ['defense military technology', 'aerospace engineering'],
    'Autonomous Vehicles': ['self driving car technology', 'autonomous vehicle sensor'],
    'Consulting': ['consulting boardroom meeting', 'business strategy office'],
    'IT Services': ['IT data center servers', 'technology infrastructure office'],
    'Semiconductor': ['semiconductor chip manufacturing', 'microchip technology factory'],
    'Education': ['university campus education', 'classroom technology'],
    'Energy': ['energy power plant industrial', 'renewable energy technology'],
  }

  const industry = event.industry || ''

  // Try direct industry match
  for (const [key, qs] of Object.entries(industryQueries)) {
    if (industry.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(industry.toLowerCase())) {
      queries.push(...qs)
      break
    }
  }

  // Event type specific queries
  if (event.eventType === 'ROBOT_LAYOFF') {
    queries.push('industrial robot automation factory', 'robotic arm manufacturing')
  } else if (event.eventType === 'AI_JOB_CREATED') {
    queries.push('AI technology hiring recruitment', 'tech startup modern office')
  } else if (event.eventType === 'PRODUCTIVITY_GAIN') {
    queries.push('business productivity growth chart', 'efficient modern workplace')
  }

  // Generic fallbacks
  if (queries.length === 0) {
    queries.push(
      'corporate office building modern',
      'business technology workplace',
      'corporate headquarters skyline',
    )
  }

  return queries
}

async function searchPexels(query: string): Promise<ImageResult[]> {
  if (!PEXELS_API_KEY) return []

  try {
    const page = Math.floor(Math.random() * 3) + 1
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=5&page=${page}&orientation=landscape`,
      {
        headers: { Authorization: PEXELS_API_KEY },
        signal: AbortSignal.timeout(10000),
      }
    )
    if (!res.ok) return []
    const data = await res.json() as any
    return (data.photos || []).map((p: any) => ({
      url: p.src.landscape, // 940x627
      source: 'pexels' as const,
      description: p.alt || query,
      width: p.width,
      height: p.height,
    }))
  } catch {
    return []
  }
}

async function searchPixabay(query: string): Promise<ImageResult[]> {
  if (!PIXABAY_API_KEY) return []

  try {
    const page = Math.floor(Math.random() * 3) + 1
    const res = await fetch(
      `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(query)}&per_page=5&page=${page}&orientation=horizontal&image_type=photo&min_width=800`,
      { signal: AbortSignal.timeout(10000) }
    )
    if (!res.ok) return []
    const data = await res.json() as any
    return (data.hits || []).map((h: any) => ({
      url: h.webformatURL,
      source: 'pixabay' as const,
      description: h.tags || query,
      width: h.webformatWidth,
      height: h.webformatHeight,
    }))
  } catch {
    return []
  }
}

/**
 * Search for a relevant image across multiple providers.
 * Tries multiple queries, returns candidates for verification.
 */
export async function searchImages(queries: string[]): Promise<ImageResult[]> {
  const results: ImageResult[] = []

  for (const query of queries.slice(0, 2)) {
    const [pexels, pixabay] = await Promise.all([
      searchPexels(query),
      searchPixabay(query),
    ])
    results.push(...pexels, ...pixabay)

    if (results.length >= 5) break

    // Rate limit between queries
    await new Promise(r => setTimeout(r, 500))
  }

  return results
}
