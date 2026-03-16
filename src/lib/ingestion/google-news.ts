/**
 * Google News RSS feed parser — finds AI layoff articles from Google News.
 * Used as a supplementary source alongside Exa search.
 */

import { googleNewsFeeds } from './search-queries'

export interface GoogleNewsArticle {
  title: string
  url: string
  publishedDate: string | null
  source: string | null
}

/**
 * Parse a Google News RSS feed and extract articles.
 */
function parseGoogleNewsRss(xml: string): GoogleNewsArticle[] {
  const articles: GoogleNewsArticle[] = []

  const items = xml.match(/<item>[\s\S]*?<\/item>/gi) || []

  for (const item of items) {
    const titleMatch = item.match(/<title>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/i)
    const linkMatch = item.match(/<link>(.*?)<\/link>/i)
    const dateMatch = item.match(/<pubDate>(.*?)<\/pubDate>/i)
    const sourceMatch = item.match(/<source[^>]*>(.*?)<\/source>/i)

    const title = titleMatch?.[1]?.trim()
    let url = linkMatch?.[1]?.trim()

    if (!title || !url) continue

    // Google News wraps URLs — try to extract the real source URL from the description
    // The description contains an <a href="..."> with the Google redirect URL
    // We keep the Google URL for now — the pipeline will use title for classification

    let publishedDate: string | null = null
    if (dateMatch?.[1]) {
      try {
        publishedDate = new Date(dateMatch[1]).toISOString().split('T')[0]
      } catch {
        // ignore bad dates
      }
    }

    articles.push({
      title,
      url,
      publishedDate,
      source: sourceMatch?.[1]?.trim() || null,
    })
  }

  return articles
}

/**
 * Fetch articles from all configured Google News RSS feeds.
 * Returns deduplicated list of articles.
 */
export async function fetchGoogleNewsArticles(): Promise<GoogleNewsArticle[]> {
  const allArticles: GoogleNewsArticle[] = []
  const seenUrls = new Set<string>()

  for (const feedUrl of googleNewsFeeds) {
    try {
      const res = await fetch(feedUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; AILayoffsTracker/1.0)',
          Accept: 'application/rss+xml, application/xml, text/xml',
        },
        signal: AbortSignal.timeout(10000),
      })

      if (!res.ok) {
        console.warn(`[google-news] Feed returned ${res.status}: ${feedUrl.substring(0, 80)}`)
        continue
      }

      const xml = await res.text()
      const articles = parseGoogleNewsRss(xml)

      for (const article of articles) {
        if (!seenUrls.has(article.url)) {
          seenUrls.add(article.url)
          allArticles.push(article)
        }
      }

      console.log(`[google-news] Feed returned ${articles.length} articles`)
    } catch (e: any) {
      console.warn(`[google-news] Failed to fetch feed: ${e.message}`)
    }

    await new Promise(r => setTimeout(r, 500))
  }

  return allArticles
}
