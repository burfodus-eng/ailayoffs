'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, PieChart, Pie, Cell, AreaChart, Area, Legend,
} from 'recharts'
import {
  Globe, Users, Eye, Clock, ArrowUp, ArrowDown, Monitor, Smartphone,
  Tablet, RefreshCw, Activity, TrendingUp, MousePointer, ExternalLink,
} from 'lucide-react'

interface SiteData {
  id: string
  name: string
  domain: string
  color: string
  active: number
  stats: {
    pageviews: number
    visitors: number
    visits: number
    bounces: number
    totaltime: number
  }
  pageviews: {
    pageviews: { x: string; y: number }[]
    sessions: { x: string; y: number }[]
  }
  topPages: { x: string; y: number }[]
  referrers: { x: string; y: number }[]
  countries: { x: string; y: number }[]
  browsers: { x: string; y: number }[]
  os: { x: string; y: number }[]
  devices: { x: string; y: number }[]
}

interface AnalyticsData {
  sites: SiteData[]
  totals: {
    pageviews: number
    visitors: number
    visits: number
    bounces: number
    totaltime: number
    active: number
  }
  period: string
}

const PERIODS = [
  { value: '1h', label: '1H' },
  { value: '24h', label: '24H' },
  { value: '7d', label: '7D' },
  { value: '30d', label: '30D' },
  { value: '90d', label: '90D' },
  { value: 'year', label: '1Y' },
]

const fmt = (n: number) => {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
  return n.toLocaleString()
}

const fmtTime = (ms: number, visits: number) => {
  if (!visits) return '0s'
  const avg = ms / visits / 1000
  if (avg >= 60) return `${Math.floor(avg / 60)}m ${Math.floor(avg % 60)}s`
  return `${Math.floor(avg)}s`
}

const bounceRate = (bounces: number, visits: number) => {
  if (!visits) return '0%'
  return `${Math.round((bounces / visits) * 100)}%`
}

const DEVICE_ICONS: Record<string, any> = {
  desktop: Monitor,
  mobile: Smartphone,
  tablet: Tablet,
}

function DeviceIcon({ type }: { type: string }) {
  const Icon = DEVICE_ICONS[type.toLowerCase()] || Monitor
  return <Icon className="h-3.5 w-3.5" />
}

// Country code to flag emoji
function countryFlag(code: string) {
  if (!code || code.length !== 2) return '🌍'
  const offset = 127397
  return String.fromCodePoint(...[...code.toUpperCase()].map(c => c.charCodeAt(0) + offset))
}

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [period, setPeriod] = useState('24h')
  const [secret, setSecret] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [selectedSite, setSelectedSite] = useState<string | null>(null)
  const [autoRefresh, setAutoRefresh] = useState(true)

  const fetchData = useCallback(async () => {
    if (!secret) return
    setLoading(true)
    try {
      const res = await fetch(`/api/analytics?secret=${encodeURIComponent(secret)}&period=${period}`)
      if (!res.ok) {
        if (res.status === 401) { setAuthenticated(false); setError('Invalid secret'); return }
        throw new Error(`API error: ${res.status}`)
      }
      const json = await res.json()
      if (json.error) throw new Error(json.error)
      setData(json)
      setError(null)
      setAuthenticated(true)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [secret, period])

  useEffect(() => {
    if (authenticated) fetchData()
  }, [period, authenticated, fetchData])

  // Auto-refresh every 60 seconds
  useEffect(() => {
    if (!authenticated || !autoRefresh) return
    const interval = setInterval(fetchData, 60000)
    return () => clearInterval(interval)
  }, [authenticated, autoRefresh, fetchData])

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#0f1117] flex items-center justify-center">
        <div className="bg-[#1a1b23] border border-[#2a2b35] rounded-lg p-8 max-w-sm w-full">
          <h1 className="text-lg font-bold text-white mb-1">Analytics Dashboard</h1>
          <p className="text-xs text-gray-500 mb-6">Enter admin secret to continue</p>
          <form onSubmit={(e) => { e.preventDefault(); setAuthenticated(true); fetchData() }}>
            <input
              type="password"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              placeholder="Admin secret"
              className="w-full px-3 py-2 bg-[#0f1117] border border-[#2a2b35] rounded text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 mb-3"
              autoFocus
            />
            <button type="submit" className="w-full py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors">
              Access Dashboard
            </button>
            {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
          </form>
        </div>
      </div>
    )
  }

  const sites = data?.sites || []
  const totals = data?.totals || { pageviews: 0, visitors: 0, visits: 0, bounces: 0, totaltime: 0, active: 0 }
  const activeSite = selectedSite ? sites.find(s => s.id === selectedSite) : null

  // Build combined pageview chart data
  const combinedChart = (() => {
    if (!sites.length) return []
    const timeMap: Record<string, Record<string, number>> = {}
    for (const site of sites) {
      for (const pv of site.pageviews?.pageviews || []) {
        if (!timeMap[pv.x]) timeMap[pv.x] = {}
        timeMap[pv.x][site.name] = pv.y
      }
    }
    return Object.entries(timeMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([time, vals]) => {
        const d = new Date(time)
        const label = period === '1h'
          ? d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : period === '24h'
            ? d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : d.toLocaleDateString([], { month: 'short', day: 'numeric' })
        return { time: label, ...vals }
      })
  })()

  // Merge metrics across all sites
  const mergeMetrics = (key: keyof SiteData) => {
    const map: Record<string, number> = {}
    for (const site of sites) {
      const items = site[key] as { x: string; y: number }[]
      if (!items) continue
      for (const item of items) {
        map[item.x] = (map[item.x] || 0) + item.y
      }
    }
    return Object.entries(map)
      .map(([x, y]) => ({ x, y }))
      .sort((a, b) => b.y - a.y)
      .slice(0, 10)
  }

  const allTopPages = mergeMetrics('topPages')
  const allReferrers = mergeMetrics('referrers')
  const allCountries = mergeMetrics('countries')
  const allBrowsers = mergeMetrics('browsers')
  const allOS = mergeMetrics('os')
  const allDevices = mergeMetrics('devices')

  const PIE_COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#a78bfa', '#06b6d4', '#ec4899', '#84cc16']

  return (
    <div className="min-h-screen bg-[#0f1117] text-white">
      {/* Header */}
      <div className="border-b border-[#2a2b35] bg-[#1a1b23]">
        <div className="max-w-[1600px] mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Activity className="h-5 w-5 text-blue-400" />
            <h1 className="text-sm font-bold">Analytics Dashboard</h1>
            {totals.active > 0 && (
              <span className="flex items-center gap-1.5 px-2 py-0.5 bg-green-500/10 border border-green-500/20 rounded-full">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                <span className="text-[11px] text-green-400 font-medium">{totals.active} live</span>
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {/* Period selector */}
            <div className="flex bg-[#0f1117] border border-[#2a2b35] rounded overflow-hidden">
              {PERIODS.map(p => (
                <button
                  key={p.value}
                  onClick={() => setPeriod(p.value)}
                  className={`px-2.5 py-1 text-[11px] font-medium transition-colors ${period === p.value ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`p-1.5 rounded transition-colors ${autoRefresh ? 'text-green-400 bg-green-500/10' : 'text-gray-500 hover:text-gray-300'}`}
              title={autoRefresh ? 'Auto-refresh on (60s)' : 'Auto-refresh off'}
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading && autoRefresh ? 'animate-spin' : ''}`} />
            </button>
            <button onClick={fetchData} disabled={loading} className="px-3 py-1 text-[11px] bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50 transition-colors">
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 py-4">
        {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-xs">{error}</div>}

        {/* Global stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          {[
            { label: 'Visitors', value: fmt(totals.visitors), icon: Users, color: 'text-blue-400' },
            { label: 'Page Views', value: fmt(totals.pageviews), icon: Eye, color: 'text-green-400' },
            { label: 'Visits', value: fmt(totals.visits), icon: MousePointer, color: 'text-purple-400' },
            { label: 'Bounce Rate', value: bounceRate(totals.bounces, totals.visits), icon: ArrowDown, color: 'text-orange-400' },
            { label: 'Avg. Duration', value: fmtTime(totals.totaltime, totals.visits), icon: Clock, color: 'text-cyan-400' },
            { label: 'Live Now', value: totals.active.toString(), icon: Activity, color: 'text-green-400' },
          ].map(stat => (
            <div key={stat.label} className="bg-[#1a1b23] border border-[#2a2b35] rounded-lg p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <stat.icon className={`h-3 w-3 ${stat.color}`} />
                <span className="text-[10px] uppercase tracking-wider text-gray-500">{stat.label}</span>
              </div>
              <div className={`text-xl font-bold tabular-nums ${stat.color}`}>{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Site cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {sites.map(site => (
            <button
              key={site.id}
              onClick={() => setSelectedSite(selectedSite === site.id ? null : site.id)}
              className={`text-left bg-[#1a1b23] border rounded-lg p-3 transition-all hover:border-[#3a3b45] ${selectedSite === site.id ? 'border-blue-500 ring-1 ring-blue-500/30' : 'border-[#2a2b35]'}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: site.color }} />
                  <span className="text-xs font-semibold text-white">{site.name}</span>
                </div>
                {site.active > 0 && (
                  <span className="flex items-center gap-1 text-[10px] text-green-400">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                    {site.active}
                  </span>
                )}
              </div>
              <div className="text-[10px] text-gray-500 mb-2">{site.domain}</div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <div className="text-[10px] text-gray-600">Visitors</div>
                  <div className="text-sm font-bold tabular-nums text-blue-400">{fmt(site.stats.visitors)}</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-600">Views</div>
                  <div className="text-sm font-bold tabular-nums text-green-400">{fmt(site.stats.pageviews)}</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-600">Bounce</div>
                  <div className="text-sm font-bold tabular-nums text-orange-400">{bounceRate(site.stats.bounces, site.stats.visits)}</div>
                </div>
              </div>
              {/* Mini sparkline */}
              {site.pageviews?.pageviews?.length > 0 && (() => {
                // Trim trailing zero-value points (future empty time buckets from Umami)
                let sparkData = [...site.pageviews.pageviews]
                while (sparkData.length > 1 && sparkData[sparkData.length - 1].y === 0) {
                  sparkData.pop()
                }
                // Pad sparse data so the chart renders a line instead of a dot
                if (sparkData.length === 1) {
                  sparkData = [{ ...sparkData[0], x: '' }, sparkData[0], { ...sparkData[0], x: ' ' }]
                }
                return (
                  <div className="mt-2 h-10">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={sparkData} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
                        <defs>
                          <linearGradient id={`spark-${site.id}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={site.color} stopOpacity={0.3} />
                            <stop offset="100%" stopColor={site.color} stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="y" stroke={site.color} fill={`url(#spark-${site.id})`} strokeWidth={1.5} dot={false} isAnimationActive={false} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                )
              })()}
            </button>
          ))}
        </div>

        {/* Combined traffic chart */}
        <div className="bg-[#1a1b23] border border-[#2a2b35] rounded-lg p-4 mb-6">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
            {selectedSite ? `Traffic — ${activeSite?.name}` : 'Combined Traffic — All Sites'}
          </h2>
          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              {selectedSite && activeSite ? (
                <AreaChart data={activeSite.pageviews?.pageviews?.map((pv, i) => {
                  const d = new Date(pv.x)
                  const label = period === '1h' || period === '24h'
                    ? d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : d.toLocaleDateString([], { month: 'short', day: 'numeric' })
                  return {
                    time: label,
                    pageviews: pv.y,
                    sessions: activeSite.pageviews?.sessions?.[i]?.y || 0,
                  }
                }) || []} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#6b7280' }} tickLine={false} axisLine={{ stroke: '#1f2937' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#6b7280' }} tickLine={false} axisLine={{ stroke: '#1f2937' }} width={40} />
                  <Tooltip
                    contentStyle={{ background: '#1a1b23', border: '1px solid #2a2b35', fontSize: 12, color: '#fff', borderRadius: 6 }}
                    formatter={(v: any, n: any) => [Number(v).toLocaleString(), String(n)]}
                  />
                  <Area type="monotone" dataKey="pageviews" stroke={activeSite.color} fill={activeSite.color} fillOpacity={0.15} strokeWidth={2} name="Page Views" />
                  <Area type="monotone" dataKey="sessions" stroke="#6b7280" fill="#6b7280" fillOpacity={0.05} strokeWidth={1} name="Sessions" />
                </AreaChart>
              ) : (
                <AreaChart data={combinedChart} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#6b7280' }} tickLine={false} axisLine={{ stroke: '#1f2937' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#6b7280' }} tickLine={false} axisLine={{ stroke: '#1f2937' }} width={40} />
                  <Tooltip
                    contentStyle={{ background: '#1a1b23', border: '1px solid #2a2b35', fontSize: 12, color: '#fff', borderRadius: 6 }}
                    formatter={(v: any, n: any) => [Number(v).toLocaleString(), String(n)]}
                  />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  {sites.map(site => (
                    <Area key={site.id} type="monotone" dataKey={site.name} stroke={site.color} fill={site.color} fillOpacity={0.08} strokeWidth={1.5} stackId="1" name={site.name} />
                  ))}
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed metrics grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          {/* Top Pages */}
          <MetricPanel
            title="Top Pages"
            icon={<Eye className="h-3.5 w-3.5 text-green-400" />}
            data={selectedSite ? (activeSite?.topPages || []) : allTopPages}
            maxValue={Math.max(...(selectedSite ? (activeSite?.topPages || []) : allTopPages).map(d => d.y), 1)}
            color="#22c55e"
          />

          {/* Referrers */}
          <MetricPanel
            title="Referrers"
            icon={<ExternalLink className="h-3.5 w-3.5 text-blue-400" />}
            data={selectedSite ? (activeSite?.referrers || []) : allReferrers}
            maxValue={Math.max(...(selectedSite ? (activeSite?.referrers || []) : allReferrers).map(d => d.y), 1)}
            color="#3b82f6"
            formatLabel={(x) => x || '(direct)'}
          />

          {/* Countries */}
          <MetricPanel
            title="Countries"
            icon={<Globe className="h-3.5 w-3.5 text-purple-400" />}
            data={selectedSite ? (activeSite?.countries || []) : allCountries}
            maxValue={Math.max(...(selectedSite ? (activeSite?.countries || []) : allCountries).map(d => d.y), 1)}
            color="#a78bfa"
            formatLabel={(x) => `${countryFlag(x)} ${x}`}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          {/* Browsers */}
          <div className="bg-[#1a1b23] border border-[#2a2b35] rounded-lg p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5 text-cyan-400" /> Browsers
            </h3>
            <div style={{ height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={(selectedSite ? (activeSite?.browsers || []) : allBrowsers).map(d => ({ name: d.x, value: d.y }))}
                    cx="50%" cy="50%" innerRadius={45} outerRadius={75}
                    dataKey="value" paddingAngle={2}
                  >
                    {(selectedSite ? (activeSite?.browsers || []) : allBrowsers).map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: '#1a1b23', border: '1px solid #2a2b35', fontSize: 11, color: '#fff', borderRadius: 6 }}
                    formatter={(v: any, n: any) => [Number(v).toLocaleString(), n]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1">
              {(selectedSite ? (activeSite?.browsers || []) : allBrowsers).slice(0, 5).map((b, i) => (
                <span key={b.x} className="flex items-center gap-1 text-[10px] text-gray-400">
                  <span className="w-2 h-2 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                  {b.x} ({b.y})
                </span>
              ))}
            </div>
          </div>

          {/* OS */}
          <div className="bg-[#1a1b23] border border-[#2a2b35] rounded-lg p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-1.5">
              <Monitor className="h-3.5 w-3.5 text-orange-400" /> Operating Systems
            </h3>
            <div style={{ height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={(selectedSite ? (activeSite?.os || []) : allOS).slice(0, 6)} layout="vertical" margin={{ left: 0, right: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 10, fill: '#6b7280' }} tickLine={false} axisLine={false} />
                  <YAxis type="category" dataKey="x" tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false} width={80} />
                  <Tooltip
                    contentStyle={{ background: '#1a1b23', border: '1px solid #2a2b35', fontSize: 11, color: '#fff', borderRadius: 6 }}
                    formatter={(v: any) => [Number(v).toLocaleString(), 'Visitors']}
                  />
                  <Bar dataKey="y" fill="#f97316" radius={[0, 4, 4, 0]} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Devices */}
          <div className="bg-[#1a1b23] border border-[#2a2b35] rounded-lg p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-1.5">
              <Smartphone className="h-3.5 w-3.5 text-pink-400" /> Devices
            </h3>
            <div className="space-y-3 mt-4">
              {(selectedSite ? (activeSite?.devices || []) : allDevices).map(d => {
                const total = (selectedSite ? (activeSite?.devices || []) : allDevices).reduce((a, b) => a + b.y, 0)
                const pct = total ? (d.y / total) * 100 : 0
                return (
                  <div key={d.x}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="flex items-center gap-2 text-xs text-gray-300">
                        <DeviceIcon type={d.x} />
                        {d.x || 'Unknown'}
                      </span>
                      <span className="text-xs text-gray-500 tabular-nums">{d.y.toLocaleString()} ({pct.toFixed(0)}%)</span>
                    </div>
                    <div className="h-1.5 bg-[#0f1117] rounded-full overflow-hidden">
                      <div className="h-full bg-pink-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Site comparison bar chart */}
        <div className="bg-[#1a1b23] border border-[#2a2b35] rounded-lg p-4 mb-6">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Site Comparison — Visitors</h2>
          <div style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sites.map(s => ({ name: s.name, visitors: s.stats.visitors, pageviews: s.stats.pageviews, color: s.color }))} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#6b7280' }} tickLine={false} axisLine={{ stroke: '#1f2937' }} />
                <YAxis tick={{ fontSize: 10, fill: '#6b7280' }} tickLine={false} axisLine={{ stroke: '#1f2937' }} width={40} />
                <Tooltip
                  contentStyle={{ background: '#1a1b23', border: '1px solid #2a2b35', fontSize: 11, color: '#fff', borderRadius: 6 }}
                  formatter={(v: any, n: any) => [Number(v).toLocaleString(), String(n)]}
                />
                <Bar dataKey="visitors" name="Visitors" radius={[4, 4, 0, 0]} barSize={32}>
                  {sites.map(s => <Cell key={s.id} fill={s.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <p className="text-center text-[10px] text-gray-600 pb-4">
          Powered by Umami · Auto-refreshes every 60s when enabled
        </p>
      </div>
    </div>
  )
}

// Reusable metric list panel
function MetricPanel({ title, icon, data, maxValue, color, formatLabel }: {
  title: string
  icon: React.ReactNode
  data: { x: string; y: number }[]
  maxValue: number
  color: string
  formatLabel?: (x: string) => string
}) {
  return (
    <div className="bg-[#1a1b23] border border-[#2a2b35] rounded-lg p-4">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-1.5">
        {icon} {title}
      </h3>
      <div className="space-y-1.5">
        {data.length === 0 && <p className="text-xs text-gray-600">No data yet</p>}
        {data.slice(0, 10).map((item, i) => (
          <div key={item.x || i} className="group">
            <div className="flex items-center justify-between text-xs mb-0.5">
              <span className="text-gray-300 truncate max-w-[200px]" title={item.x}>
                {formatLabel ? formatLabel(item.x) : (item.x || '(none)')}
              </span>
              <span className="text-gray-500 tabular-nums ml-2 shrink-0">{item.y.toLocaleString()}</span>
            </div>
            <div className="h-1 bg-[#0f1117] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${(item.y / maxValue) * 100}%`, background: color }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
