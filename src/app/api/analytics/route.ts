import { NextRequest, NextResponse } from 'next/server'

const UMAMI_URL = 'https://umami-production-845c.up.railway.app'
const UMAMI_USERNAME = process.env.UMAMI_ADMIN_USERNAME || 'admin'
const UMAMI_PASSWORD = process.env.UMAMI_ADMIN_PASSWORD || ''

const SITES = [
  { id: '926a73bd-e2d9-4413-9949-32a638889802', name: 'AI Layoffs', domain: 'ailayoffs.com.au', color: '#ef4444' },
  { id: '8506d74b-abab-4439-a375-78373368b4a1', name: 'AI Cuts', domain: 'aicuts.com.au', color: '#f59e0b' },
  { id: 'f17098f0-7925-4678-b37c-a078d9ab2ca7', name: 'AI Layoff Watch', domain: 'ailayoffwatch.com', color: '#38bdf8' },
  { id: '9e644b12-d780-45c3-91ad-62786cd2d461', name: 'AI Layoff Watch AU', domain: 'ailayoffwatch.com.au', color: '#06b6d4' },
  { id: '7089fed7-475d-429e-b753-5912c96a9d0a', name: 'Robot Layoffs', domain: 'robotlayoffs.com', color: '#a78bfa' },
  { id: 'cb93b879-8cf4-4e83-83ff-392dca006059', name: 'Robot Layoffs AU', domain: 'robotlayoffs.com.au', color: '#8b5cf6' },
  { id: '2a232f1d-b4f6-40a1-baba-f4323538aa31', name: 'CentreTable', domain: 'centretable.com.au', color: '#22c55e' },
  { id: '54052bff-0820-4dd2-bd8f-83246278c193', name: 'ShiftCanvas', domain: 'shiftcanvas.com.au', color: '#4ecdc4' },
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

    const results = await Promise.all(
      SITES.map(async (site) => {
        const allTimeStart = new Date('2025-01-01T00:00:00Z').getTime().toString()
        const allTimeEnd = now.toString()

        const [stats, active, pageviews, topPages, referrers, countries, browsers, os, devices, allTimePageviews] = await Promise.all([
          fetchUmami(token, `/api/websites/${site.id}/stats`, timeParams),
          fetchUmami(token, `/api/websites/${site.id}/active`),
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
          stats: stats || { pageviews: 0, visitors: 0, visits: 0, bounces: 0, totaltime: 0 },
          active: active?.visitors || 0,
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

    // Compute totals
    const totals = results.reduce(
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

    return NextResponse.json({ sites: results, totals, period })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
