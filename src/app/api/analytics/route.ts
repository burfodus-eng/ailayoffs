import { NextRequest, NextResponse } from 'next/server'

const UMAMI_URL = 'https://umami-production-845c.up.railway.app'
const UMAMI_USERNAME = process.env.UMAMI_ADMIN_USERNAME || 'admin'
const UMAMI_PASSWORD = process.env.UMAMI_ADMIN_PASSWORD || ''

// Color palette for dynamically discovered sites
const COLORS = [
  '#ef4444', '#f59e0b', '#38bdf8', '#06b6d4', '#a78bfa', '#8b5cf6',
  '#22c55e', '#4ecdc4', '#f97316', '#ec4899', '#14b8a6', '#6366f1',
  '#84cc16', '#e11d48', '#0ea5e9', '#d946ef', '#facc15', '#fb923c',
  '#34d399', '#818cf8', '#f472b6', '#a3e635', '#2dd4bf', '#c084fc',
  '#fbbf24', '#38bdf8', '#4ade80', '#f87171', '#60a5fa', '#a78bfa',
  '#fb7185', '#fcd34d', '#67e8f9', '#86efac', '#c4b5fd', '#fda4af',
]

async function getToken(): Promise<string> {
  const res = await fetch(`${UMAMI_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: UMAMI_USERNAME, password: UMAMI_PASSWORD }),
  })
  if (!res.ok) throw new Error(`Auth failed: ${res.status}`)
  const data = await res.json()
  return data.token
}

async function fetchUmami(token: string, path: string, params: Record<string, string> = {}) {
  const qs = new URLSearchParams(params).toString()
  const url = `${UMAMI_URL}${path}${qs ? '?' + qs : ''}`
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    next: { revalidate: 0 },
  })
  if (!res.ok) return null
  return res.json()
}

async function getAllWebsites(token: string): Promise<{ id: string; name: string; domain: string; color: string }[]> {
  // Fetch all websites from Umami (paginated, get up to 100)
  const data = await fetchUmami(token, '/api/websites', { limit: '100', offset: '0' })
  const websites = data?.data || data || []
  if (!Array.isArray(websites)) return []

  return websites.map((w: any, i: number) => ({
    id: w.id,
    name: w.name || w.domain,
    domain: w.domain,
    color: COLORS[i % COLORS.length],
  }))
}

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')
  if (secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const period = req.nextUrl.searchParams.get('period') || '24h'
  const now = Date.now()
  let startAt: number
  let unit: string

  switch (period) {
    case '1h': startAt = now - 60 * 60 * 1000; unit = 'minute'; break
    case '24h': startAt = now - 24 * 60 * 60 * 1000; unit = 'hour'; break
    case '7d': startAt = now - 7 * 24 * 60 * 60 * 1000; unit = 'day'; break
    case '30d': startAt = now - 30 * 24 * 60 * 60 * 1000; unit = 'day'; break
    case '90d': startAt = now - 90 * 24 * 60 * 60 * 1000; unit = 'day'; break
    case 'year': startAt = now - 365 * 24 * 60 * 60 * 1000; unit = 'month'; break
    default: startAt = now - 24 * 60 * 60 * 1000; unit = 'hour'
  }

  try {
    const token = await getToken()
    const timeParams = { startAt: startAt.toString(), endAt: now.toString() }

    // Dynamically fetch ALL websites from Umami
    const allSites = await getAllWebsites(token)

    // Time ranges for the domain table
    const day24h = { startAt: (now - 24 * 60 * 60 * 1000).toString(), endAt: now.toString() }
    const day7d = { startAt: (now - 7 * 24 * 60 * 60 * 1000).toString(), endAt: now.toString() }
    const allTimeRange = { startAt: new Date('2025-01-01T00:00:00Z').getTime().toString(), endAt: now.toString() }

    // Fetch stats for ALL sites — current period + 24h + 7d + all-time
    const allResults = await Promise.all(
      allSites.map(async (site) => {
        const [stats, active, stats24h, stats7d, statsAllTime] = await Promise.all([
          fetchUmami(token, `/api/websites/${site.id}/stats`, timeParams),
          fetchUmami(token, `/api/websites/${site.id}/active`),
          period !== '24h' ? fetchUmami(token, `/api/websites/${site.id}/stats`, day24h) : null,
          period !== '7d' ? fetchUmami(token, `/api/websites/${site.id}/stats`, day7d) : null,
          fetchUmami(token, `/api/websites/${site.id}/stats`, allTimeRange),
        ])
        return {
          ...site,
          stats: stats || { pageviews: 0, visitors: 0, visits: 0, bounces: 0, totaltime: 0 },
          active: active?.visitors || 0,
          stats24h: (period === '24h' ? stats : stats24h) || { pageviews: 0, visitors: 0 },
          stats7d: (period === '7d' ? stats : stats7d) || { pageviews: 0, visitors: 0 },
          statsAllTime: statsAllTime || { pageviews: 0, visitors: 0 },
        }
      })
    )

    // Sort by visitors (descending) to find top 8
    const sorted = [...allResults].sort((a, b) =>
      (b.stats.visitors + b.stats.pageviews) - (a.stats.visitors + a.stats.pageviews)
    )
    const top8 = sorted.slice(0, 8)

    // Fetch detailed data only for top 8 (pageviews chart, top pages, referrers, etc.)
    const detailedResults = await Promise.all(
      top8.map(async (site) => {
        const allTimeStart = new Date('2025-01-01T00:00:00Z').getTime().toString()
        const allTimeEnd = now.toString()

        const [pageviews, topPages, referrers, countries, browsers, os, devices, allTimePageviews] = await Promise.all([
          fetchUmami(token, `/api/websites/${site.id}/pageviews`, { ...timeParams, unit }),
          fetchUmami(token, `/api/websites/${site.id}/metrics`, { ...timeParams, type: 'path', limit: '10' }),
          fetchUmami(token, `/api/websites/${site.id}/metrics`, { ...timeParams, type: 'referrer', limit: '10' }),
          fetchUmami(token, `/api/websites/${site.id}/metrics`, { ...timeParams, type: 'country', limit: '10' }),
          fetchUmami(token, `/api/websites/${site.id}/metrics`, { ...timeParams, type: 'browser', limit: '10' }),
          fetchUmami(token, `/api/websites/${site.id}/metrics`, { ...timeParams, type: 'os', limit: '10' }),
          fetchUmami(token, `/api/websites/${site.id}/metrics`, { ...timeParams, type: 'device', limit: '10' }),
          fetchUmami(token, `/api/websites/${site.id}/pageviews`, { startAt: allTimeStart, endAt: allTimeEnd, unit: 'month' }),
        ])

        return {
          ...site,
          pageviews: pageviews || { pageviews: [], sessions: [] },
          topPages: topPages || [],
          referrers: referrers || [],
          countries: countries || [],
          browsers: browsers || [],
          os: os || [],
          devices: devices || [],
          allTimePageviews: allTimePageviews?.pageviews || [],
        }
      })
    )

    // Compute totals from ALL sites (not just top 8)
    const totals = allResults.reduce(
      (acc, s) => ({
        pageviews: acc.pageviews + (s.stats.pageviews || 0),
        visitors: acc.visitors + (s.stats.visitors || 0),
        visits: acc.visits + (s.stats.visits || 0),
        bounces: acc.bounces + (s.stats.bounces || 0),
        totaltime: acc.totaltime + (s.stats.totaltime || 0),
        active: acc.active + s.active,
      }),
      { pageviews: 0, visitors: 0, visits: 0, bounces: 0, totaltime: 0, active: 0 }
    )

    return NextResponse.json({
      sites: detailedResults,
      allSites: allResults, // lightweight data for all sites (for combined chart)
      totals,
      period,
      totalSiteCount: allResults.length,
    })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
