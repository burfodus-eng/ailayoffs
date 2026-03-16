import { readFileSync } from 'fs'
import { join } from 'path'

export interface PressRelease {
  company: string
  title: string
  url: string
  publishedDate: string | null
  source: 'press_release'
}

interface CompanyNewsroom {
  company: string
  domain: string
  newsroomUrl: string
  irUrl: string | null
  rssUrl: string | null
  pageType: 'rss' | 'html'
}

// Must match at least one "action" keyword (layoff/cut/etc)
const ACTION_KEYWORDS = [
  'layoff', 'lay off', 'laid off', 'laying off',
  'job cuts', 'jobs cut', 'cutting jobs', 'cuts jobs',
  'restructur', 'workforce reduction', 'headcount',
  'eliminat\\w* \\d+', 'eliminat\\w* positions', 'eliminat\\w* roles',
  'downsiz', 'rightsiz',
]

const ACTION_PATTERN = new RegExp(ACTION_KEYWORDS.join('|'), 'i')

function loadNewsrooms(configPath?: string): CompanyNewsroom[] {
  const path = configPath || join(process.cwd(), 'scripts', 'data', 'company-newsrooms.json')
  const raw = readFileSync(path, 'utf-8')
  return JSON.parse(raw)
}

/**
 * Parse an RSS/Atom feed and extract items with title, link, and pubDate.
 * Uses basic regex — no XML library needed.
 */
function parseRssFeed(xml: string): Array<{ title: string; url: string; date: string | null }> {
  const items: Array<{ title: string; url: string; date: string | null }> = []

  // Try RSS <item> blocks first, then Atom <entry> blocks
  const itemBlocks = xml.match(/<item[\s>][\s\S]*?<\/item>/gi)
    || xml.match(/<entry[\s>][\s\S]*?<\/entry>/gi)
    || []

  for (const block of itemBlocks) {
    // Title
    const titleMatch = block.match(/<title[^>]*>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/i)
    const title = titleMatch?.[1]?.trim() || ''

    // Link — RSS uses <link>url</link>, Atom uses <link href="url"/>
    let url = ''
    const linkHrefMatch = block.match(/<link[^>]+href=["']([^"']+)["']/i)
    const linkTextMatch = block.match(/<link[^>]*>(?:<!\[CDATA\[)?(https?:\/\/[^\s<]+?)(?:\]\]>)?<\/link>/i)
    if (linkHrefMatch) {
      url = linkHrefMatch[1]
    } else if (linkTextMatch) {
      url = linkTextMatch[1]
    }

    // Date — try multiple tag names
    const dateMatch = block.match(/<(?:pubDate|published|updated|dc:date)[^>]*>(.*?)<\//i)
    const date = dateMatch?.[1]?.trim() || null

    if (title && url) {
      items.push({ title, url, date })
    }
  }

  return items
}

/**
 * Parse an HTML page and extract links that look like articles/press releases.
 * Returns links with their text content.
 */
function parseHtmlLinks(html: string, baseUrl: string): Array<{ title: string; url: string; date: string | null }> {
  const items: Array<{ title: string; url: string; date: string | null }> = []
  const seen = new Set<string>()

  // Match <a> tags with href
  const linkPattern = /<a\s[^>]*href=["']([^"'#]+)["'][^>]*>([\s\S]*?)<\/a>/gi
  let match: RegExpExecArray | null

  while ((match = linkPattern.exec(html)) !== null) {
    let href = match[1].trim()
    // Strip HTML tags from link text
    const text = match[2].replace(/<[^>]+>/g, '').trim()

    if (!text || text.length < 15 || text.length > 300) continue

    // Resolve relative URLs
    if (href.startsWith('/')) {
      try {
        const base = new URL(baseUrl)
        href = `${base.protocol}//${base.host}${href}`
      } catch {
        continue
      }
    }

    // Skip non-article links
    if (!href.startsWith('http')) continue
    if (href.match(/\.(pdf|jpg|png|gif|svg|css|js)(\?|$)/i)) continue
    if (href.match(/(login|signup|subscribe|contact|about|careers|privacy|terms)/i)) continue

    if (seen.has(href)) continue
    seen.add(href)

    // Try to find a nearby date (common patterns in press release listings)
    // This is best-effort — dates in HTML listings vary wildly
    items.push({ title: text, url: href, date: null })
  }

  return items
}

/**
 * Fetch a URL with a timeout and user-agent header.
 */
async function fetchPage(url: string, timeoutMs = 15000): Promise<string> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; AILayoffsTracker/1.0; +https://ailayoffs.com.au)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} for ${url}`)
    }

    return await response.text()
  } finally {
    clearTimeout(timer)
  }
}

/**
 * Scrape a single company's newsroom for layoff-related press releases.
 */
async function scrapeCompany(newsroom: CompanyNewsroom): Promise<PressRelease[]> {
  const results: PressRelease[] = []

  // Determine which URL to fetch — prefer RSS if available
  const useRss = !!newsroom.rssUrl
  const fetchUrl = useRss ? newsroom.rssUrl! : newsroom.newsroomUrl

  let content: string
  try {
    content = await fetchPage(fetchUrl)
  } catch (err: any) {
    console.warn(`[press-scraper] Failed to fetch ${newsroom.company} (${fetchUrl}): ${err.message}`)
    return results
  }

  // Parse links/items
  const items = useRss
    ? parseRssFeed(content)
    : parseHtmlLinks(content, newsroom.newsroomUrl)

  // Filter for layoff-related keywords
  for (const item of items) {
    if (ACTION_PATTERN.test(item.title)) {
      let publishedDate: string | null = null
      if (item.date) {
        try {
          publishedDate = new Date(item.date).toISOString().split('T')[0]
        } catch {
          publishedDate = null
        }
      }

      results.push({
        company: newsroom.company,
        title: item.title,
        url: item.url,
        publishedDate,
        source: 'press_release',
      })
    }
  }

  return results
}

/**
 * Scrape all configured company newsrooms for layoff-related press releases.
 *
 * @param options.configPath - Override path to company-newsrooms.json
 * @param options.companyFilter - Only scrape this company (case-insensitive)
 */
export async function scrapeCompanyNewsrooms(options?: {
  configPath?: string
  companyFilter?: string
}): Promise<PressRelease[]> {
  let newsrooms = loadNewsrooms(options?.configPath)

  if (options?.companyFilter) {
    const filter = options.companyFilter.toLowerCase()
    newsrooms = newsrooms.filter(n => n.company.toLowerCase().includes(filter))
  }

  const allResults: PressRelease[] = []

  for (const newsroom of newsrooms) {
    console.log(`[press-scraper] Scraping ${newsroom.company} (${newsroom.pageType})...`)
    try {
      const releases = await scrapeCompany(newsroom)
      allResults.push(...releases)
      console.log(`[press-scraper] ${newsroom.company}: found ${releases.length} relevant releases`)
    } catch (err: any) {
      console.warn(`[press-scraper] Error scraping ${newsroom.company}: ${err.message}`)
    }

    // Be polite between requests
    await new Promise(r => setTimeout(r, 500))
  }

  return allResults
}
