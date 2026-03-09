'use client'

import { useBrand } from '@/lib/brand-context'
import type { BrandConfig } from '@/lib/domains'
import Link from 'next/link'
import { ArrowRight, ExternalLink } from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
  AreaChart, Area, BarChart, Bar, CartesianGrid,
} from 'recharts'

interface EventData {
  id: string
  companyName: string | null
  country: string | null
  industry: string | null
  dateAnnounced: string | null
  jobsCutAnnounced: number | null
  conservativeAiJobs: number
  weightedAiJobs: number
  upperAiJobs: number
  attributionCategory: string
  publicSummary: string | null
  reviewStatus: string
  articleEvents: { article: { url: string; title: string } }[]
}

interface ChartPoint {
  date: string
  company: string
  conservative: number
  core: number
  upper: number
}

interface StatsData {
  conservative: number
  core: number
  upper: number
  totalAnnounced: number
  eventCount: number
  reviewedPercent: number
  lastUpdated: string | null
}

interface HomeClientProps {
  allEvents: EventData[]
  chartData: ChartPoint[]
  hasData: boolean
  stats: StatsData
  trackingLabel: string
}

const fmt = (n: number) => n.toLocaleString()
const fmtAxis = (value: number) => {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
  if (value >= 1000) return `${(value / 1000).toFixed(0)}K`
  return value.toString()
}

function catBadge(cat: string) {
  switch (cat) {
    case 'EXPLICIT': return 'bg-red-100 text-red-700 border-red-200'
    case 'STRONG': return 'bg-orange-100 text-orange-700 border-orange-200'
    case 'MODERATE': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
    case 'WEAK': return 'bg-gray-100 text-gray-600 border-gray-200'
    default: return 'bg-gray-100 text-gray-500 border-gray-200'
  }
}

const navItems = [
  { href: '/news', label: 'News & Sources' },
  { href: '/net-impact', label: 'Net Impact' },
  { href: '/jobs-created', label: 'Jobs Created' },
  { href: '/robots', label: 'Robot Tracker' },
  { href: '/job-security', label: 'Job Security' },
  { href: '/methodology', label: 'Methodology' },
]

// Shared data table used by all layouts
function EventTable({ events, compact }: { events: EventData[]; compact?: boolean }) {
  return (
    <div className="overflow-x-auto border border-gray-200 bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            {['Date', 'Company', 'Country', 'Industry', 'Attribution', 'Announced', 'Conservative', 'Core', 'Upper', 'Src'].map((h, i) => (
              <th key={h} className={`p-2 text-[10px] font-semibold uppercase tracking-wider text-gray-500 ${i >= 5 ? 'text-right' : 'text-left'} ${i === 9 ? 'text-center' : ''} ${compact && (i === 2 || i === 3) ? 'hidden lg:table-cell' : i === 2 ? 'hidden sm:table-cell' : i === 3 ? 'hidden md:table-cell' : ''} ${i === 9 ? 'hidden lg:table-cell' : ''}`}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {events.map((event, i) => {
            const src = event.articleEvents?.[0]?.article?.url
            return (
              <tr key={event.id} className={`border-b border-gray-100 hover:bg-blue-50/30 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                <td className="p-2 text-xs text-gray-400 whitespace-nowrap">{event.dateAnnounced ? new Date(event.dateAnnounced).toISOString().split('T')[0] : '—'}</td>
                <td className="p-2 font-medium text-gray-900 whitespace-nowrap">{event.companyName || '—'}</td>
                <td className={`p-2 text-xs text-gray-500 ${compact ? 'hidden lg:table-cell' : 'hidden sm:table-cell'}`}>{event.country || '—'}</td>
                <td className={`p-2 text-xs text-gray-500 ${compact ? 'hidden lg:table-cell' : 'hidden md:table-cell'}`}>{event.industry || '—'}</td>
                <td className="p-2"><span className={`inline-block px-1.5 py-0.5 text-[10px] font-semibold uppercase border rounded ${catBadge(event.attributionCategory)}`}>{event.attributionCategory}</span></td>
                <td className="p-2 text-right tabular-nums text-gray-500">{event.jobsCutAnnounced?.toLocaleString() || '—'}</td>
                <td className="p-2 text-right tabular-nums text-green-700">{event.conservativeAiJobs.toLocaleString()}</td>
                <td className="p-2 text-right tabular-nums font-bold text-amber-700">{event.weightedAiJobs.toLocaleString()}</td>
                <td className="p-2 text-right tabular-nums text-red-600">{event.upperAiJobs.toLocaleString()}</td>
                <td className="p-2 text-center hidden lg:table-cell">{src ? <a href={src} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700"><ExternalLink className="h-3 w-3 inline" /></a> : '—'}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

// Shared stat bar
function StatBar({ stats, trackingLabel }: { stats: StatsData; trackingLabel: string }) {
  return (
    <div className="bg-white border border-gray-200 p-4">
      <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-2">{trackingLabel}</p>
      <div className="text-4xl sm:text-5xl font-bold tabular-nums text-gray-900">{fmt(stats.core)}</div>
      <p className="text-xs text-gray-400 mt-1">Core weighted estimate</p>
      <div className="grid grid-cols-4 gap-4 mt-4 pt-3 border-t border-gray-100">
        {[
          { label: 'Conservative', value: stats.conservative, cls: 'text-green-700' },
          { label: 'Upper Bound', value: stats.upper, cls: 'text-red-600' },
          { label: 'Announced', value: stats.totalAnnounced, cls: 'text-gray-600' },
          { label: 'Events', value: stats.eventCount, cls: 'text-gray-600' },
        ].map(s => (
          <div key={s.label}>
            <div className="text-[10px] uppercase tracking-wider text-gray-400">{s.label}</div>
            <div className={`text-lg font-bold tabular-nums ${s.cls}`}>{fmt(s.value)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// LAYOUT 1: FULL-WIDTH REPORT (ailayoffs)
// Top stats banner → full-width chart → full-width table
// Clean, spreadsheet-like, maximum data density
// ═══════════════════════════════════════════════════════════════
function ReportLayout({ allEvents, chartData, hasData, stats, trackingLabel }: HomeClientProps) {
  if (!hasData) {
    return <div className="min-h-[60vh] flex items-center justify-center bg-gray-50"><p className="text-gray-400">No data available yet.</p></div>
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Stats Banner */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-1">{trackingLabel}</p>
              <div className="text-5xl sm:text-6xl font-bold tabular-nums text-gray-900">{fmt(stats.core)}</div>
            </div>
            <div className="flex gap-6">
              {[
                { label: 'Conservative', value: stats.conservative, cls: 'text-green-700' },
                { label: 'Core', value: stats.core, cls: 'text-amber-700' },
                { label: 'Upper', value: stats.upper, cls: 'text-red-600' },
                { label: 'Events', value: stats.eventCount, cls: 'text-gray-600' },
              ].map(s => (
                <div key={s.label} className="text-right">
                  <div className="text-[10px] uppercase tracking-wider text-gray-400">{s.label}</div>
                  <div className={`text-xl font-bold tabular-nums ${s.cls}`}>{fmt(s.value)}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-2 text-[10px] text-gray-400">
            {stats.reviewedPercent}% reviewed
            {stats.lastUpdated && <> · Updated {stats.lastUpdated.split('T')[0]}</>}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Chart */}
        <div className="bg-white border border-gray-200 p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500">Cumulative Impact</h2>
          </div>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={{ stroke: '#e5e7eb' }} />
                <YAxis tickFormatter={fmtAxis} tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={{ stroke: '#e5e7eb' }} width={50} />
                <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', fontSize: 12, color: '#374151' }} formatter={(v: any, n: any) => [Number(v).toLocaleString(), String(n)]} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Area type="monotone" dataKey="upper" stroke="#ef4444" fill="#fef2f2" strokeWidth={1} name="Upper" />
                <Area type="monotone" dataKey="core" stroke="#d97706" fill="#fffbeb" strokeWidth={2} name="Core" />
                <Area type="monotone" dataKey="conservative" stroke="#16a34a" fill="#f0fdf4" strokeWidth={1} name="Conservative" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Full-width Event Table */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500">Event Log</h2>
            <Link href="/news" className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1">
              All Sources <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <EventTable events={allEvents} />
        </div>

        {/* Bottom disclaimer */}
        <p className="text-center text-[10px] text-gray-400 py-4 border-t border-gray-200">
          Data estimated from public reporting · Not census data · <Link href="/methodology" className="underline text-blue-500">Methodology</Link>
        </p>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// LAYOUT 2: TWO-COLUMN (aicuts)
// Left: stats + chart stacked. Right: scrollable table
// Side-by-side analytical view
// ═══════════════════════════════════════════════════════════════
function TwoColumnLayout({ allEvents, chartData, hasData, stats, trackingLabel }: HomeClientProps) {
  if (!hasData) {
    return <div className="min-h-[60vh] flex items-center justify-center bg-gray-50"><p className="text-gray-400">No data available yet.</p></div>
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left Column - Stats + Chart */}
          <div className="lg:col-span-2 space-y-4">
            <StatBar stats={stats} trackingLabel={trackingLabel} />

            {/* Chart */}
            <div className="bg-white border border-gray-200 p-4">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Trend</h2>
              <div style={{ height: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#9ca3af' }} tickLine={false} axisLine={{ stroke: '#e5e7eb' }} />
                    <YAxis tickFormatter={fmtAxis} tick={{ fontSize: 9, fill: '#9ca3af' }} tickLine={false} axisLine={{ stroke: '#e5e7eb' }} width={40} />
                    <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', fontSize: 11, color: '#374151' }} formatter={(v: any, n: any) => [Number(v).toLocaleString(), String(n)]} />
                    <Line type="monotone" dataKey="upper" stroke="#ef4444" strokeWidth={1} dot={false} name="Upper" />
                    <Line type="monotone" dataKey="core" stroke="#d97706" strokeWidth={2} dot={false} name="Core" />
                    <Line type="monotone" dataKey="conservative" stroke="#16a34a" strokeWidth={1} dot={false} name="Conservative" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Quick links */}
            <div className="grid grid-cols-2 gap-2">
              {navItems.slice(0, 4).map(l => (
                <Link key={l.href} href={l.href} className="bg-white border border-gray-200 p-3 text-center text-xs font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-colors">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Column - Table */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500">Event Log</h2>
              <Link href="/news" className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1">
                All Sources <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <EventTable events={allEvents} compact />
          </div>
        </div>

        <p className="text-center text-[10px] text-gray-400 py-4 mt-4 border-t border-gray-200">
          Data from public reporting · <Link href="/methodology" className="underline text-blue-500">Methodology</Link>
        </p>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// LAYOUT 3: SIDEBAR NAV (ailayoffwatch)
// Left sidebar with nav + stats, main content area with chart + table
// App/dashboard feel with persistent sidebar
// ═══════════════════════════════════════════════════════════════
function SidebarLayout({ allEvents, chartData, hasData, stats, trackingLabel }: HomeClientProps) {
  if (!hasData) {
    return <div className="min-h-[60vh] flex items-center justify-center bg-gray-50"><p className="text-gray-400">No data available yet.</p></div>
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:block w-64 shrink-0 bg-white border-r border-gray-200 min-h-[calc(100vh-56px)] sticky top-14">
          <div className="p-4">
            {/* Stats in sidebar */}
            <div className="mb-6">
              <p className="text-[10px] uppercase tracking-[0.15em] text-gray-400 mb-1">{trackingLabel}</p>
              <div className="text-3xl font-bold tabular-nums text-gray-900">{fmt(stats.core)}</div>
              <p className="text-[10px] text-gray-400">Core weighted</p>
            </div>

            <div className="space-y-3 mb-6">
              {[
                { label: 'Conservative', value: stats.conservative, cls: 'text-green-700' },
                { label: 'Upper Bound', value: stats.upper, cls: 'text-red-600' },
                { label: 'Announced', value: stats.totalAnnounced, cls: 'text-gray-600' },
                { label: 'Events', value: stats.eventCount, cls: 'text-gray-600' },
                { label: 'Reviewed', value: `${stats.reviewedPercent}%`, cls: 'text-gray-600' },
              ].map(s => (
                <div key={s.label} className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider text-gray-400">{s.label}</span>
                  <span className={`text-sm font-bold tabular-nums ${s.cls}`}>{typeof s.value === 'number' ? fmt(s.value) : s.value}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-4">
              <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-2">Navigation</p>
              <nav className="space-y-0.5">
                {navItems.map(l => (
                  <Link key={l.href} href={l.href} className="block px-2 py-1.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-blue-700 rounded transition-colors">
                    {l.label}
                  </Link>
                ))}
              </nav>
            </div>

            {stats.lastUpdated && (
              <div className="mt-6 pt-4 border-t border-gray-100 text-[10px] text-gray-400">
                Updated {stats.lastUpdated.split('T')[0]}
              </div>
            )}
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 min-w-0 p-4 lg:p-6">
          {/* Mobile stats (hidden on desktop where sidebar shows them) */}
          <div className="lg:hidden mb-4">
            <StatBar stats={stats} trackingLabel={trackingLabel} />
          </div>

          {/* Chart */}
          <div className="bg-white border border-gray-200 p-4 mb-6">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Cumulative Impact</h2>
            <div style={{ height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={{ stroke: '#e5e7eb' }} />
                  <YAxis tickFormatter={fmtAxis} tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={{ stroke: '#e5e7eb' }} width={50} />
                  <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', fontSize: 12, color: '#374151' }} formatter={(v: any, n: any) => [Number(v).toLocaleString(), String(n)]} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Area type="monotone" dataKey="upper" stroke="#ef4444" fill="#fef2f2" strokeWidth={1} name="Upper" />
                  <Area type="monotone" dataKey="core" stroke="#3b82f6" fill="#eff6ff" strokeWidth={2} name="Core" />
                  <Area type="monotone" dataKey="conservative" stroke="#16a34a" fill="#f0fdf4" strokeWidth={1} name="Conservative" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Table */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500">Event Log</h2>
              <Link href="/news" className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1">
                All Sources <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <EventTable events={allEvents} />
          </div>
        </main>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// LAYOUT 4: TABBED PANELS (robotlayoffs)
// Stats at top, then chart and table side-by-side in equal panels
// More compact, card-panel based
// ═══════════════════════════════════════════════════════════════
function PanelLayout({ allEvents, chartData, hasData, stats, trackingLabel }: HomeClientProps) {
  if (!hasData) {
    return <div className="min-h-[60vh] flex items-center justify-center bg-gray-50"><p className="text-gray-400">No data available yet.</p></div>
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Top stats strip */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center divide-x divide-gray-200 overflow-x-auto">
            <div className="pr-6 py-4">
              <p className="text-[9px] uppercase tracking-[0.15em] text-gray-400">{trackingLabel}</p>
              <div className="text-3xl font-bold tabular-nums text-gray-900">{fmt(stats.core)}</div>
            </div>
            {[
              { label: 'Conservative', value: stats.conservative, cls: 'text-green-700' },
              { label: 'Upper', value: stats.upper, cls: 'text-red-600' },
              { label: 'Announced', value: stats.totalAnnounced, cls: 'text-gray-700' },
              { label: 'Events', value: stats.eventCount, cls: 'text-gray-700' },
              { label: 'Reviewed', value: `${stats.reviewedPercent}%`, cls: 'text-gray-700' },
            ].map(s => (
              <div key={s.label} className="px-4 py-4 min-w-0">
                <div className="text-[9px] uppercase tracking-wider text-gray-400 whitespace-nowrap">{s.label}</div>
                <div className={`text-lg font-bold tabular-nums ${s.cls}`}>{typeof s.value === 'number' ? fmt(s.value) : s.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Chart + Mini nav side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          {/* Chart - 2/3 width */}
          <div className="lg:col-span-2 bg-white border border-gray-200 p-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Cumulative Trend</h2>
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#9ca3af' }} tickLine={false} axisLine={{ stroke: '#e5e7eb' }} />
                  <YAxis tickFormatter={fmtAxis} tick={{ fontSize: 9, fill: '#9ca3af' }} tickLine={false} axisLine={{ stroke: '#e5e7eb' }} width={50} />
                  <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', fontSize: 11, color: '#374151' }} formatter={(v: any, n: any) => [Number(v).toLocaleString(), String(n)]} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="upper" fill="#fee2e2" stroke="#ef4444" strokeWidth={0.5} name="Upper" />
                  <Bar dataKey="core" fill="#e0e7ff" stroke="#6366f1" strokeWidth={0.5} name="Core" />
                  <Bar dataKey="conservative" fill="#dcfce7" stroke="#16a34a" strokeWidth={0.5} name="Conservative" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Right panel - nav + summary */}
          <div className="space-y-3">
            {navItems.map(l => (
              <Link key={l.href} href={l.href} className="block bg-white border border-gray-200 p-3 hover:bg-blue-50 hover:border-blue-200 transition-colors">
                <span className="text-sm font-medium text-gray-700">{l.label}</span>
                <ArrowRight className="h-3 w-3 inline ml-2 text-gray-400" />
              </Link>
            ))}
          </div>
        </div>

        {/* Full-width table */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500">Event Log</h2>
            <Link href="/news" className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1">
              All Sources <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <EventTable events={allEvents} />
        </div>

        <p className="text-center text-[10px] text-gray-400 py-4 border-t border-gray-200">
          Public reporting data · Weighted attribution · <Link href="/methodology" className="underline text-blue-500">Methodology</Link>
        </p>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// MAIN EXPORT
// ═══════════════════════════════════════════════════════════════
export function HomeClient(props: HomeClientProps) {
  const brand = useBrand()

  switch (brand.layout) {
    case 'terminal':
      return <ReportLayout {...props} />
    case 'editorial':
      return <TwoColumnLayout {...props} />
    case 'dashboard':
      return <SidebarLayout {...props} />
    case 'futuristic':
      return <PanelLayout {...props} />
    default:
      return <ReportLayout {...props} />
  }
}
