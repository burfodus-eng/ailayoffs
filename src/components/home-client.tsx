'use client'

import { useState, useMemo } from 'react'
import { useBrand } from '@/lib/brand-context'
import type { BrandConfig } from '@/lib/domains'
import Link from 'next/link'
import { ArrowRight, ExternalLink, BarChart3, Table2, ZoomIn, ZoomOut } from 'lucide-react'
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
    case 'EXPLICIT': return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800'
    case 'STRONG': return 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800'
    case 'MODERATE': return 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800'
    case 'WEAK': return 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-700/30 dark:text-gray-400 dark:border-gray-600'
    default: return 'bg-gray-100 text-gray-500 border-gray-200 dark:bg-gray-700/30 dark:text-gray-400 dark:border-gray-600'
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

// ═══════════════════════════════════════════════════════════════
// SHARED COMPONENTS
// ═══════════════════════════════════════════════════════════════

// Filters for country and industry
function Filters({ events, countryFilter, setCountryFilter, industryFilter, setIndustryFilter }: {
  events: EventData[]
  countryFilter: string
  setCountryFilter: (v: string) => void
  industryFilter: string
  setIndustryFilter: (v: string) => void
}) {
  const countries = useMemo(() => [...new Set(events.map(e => e.country).filter(Boolean))].sort() as string[], [events])
  const industries = useMemo(() => [...new Set(events.map(e => e.industry).filter(Boolean))].sort() as string[], [events])

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <select
        value={countryFilter}
        onChange={(e) => setCountryFilter(e.target.value)}
        className="px-2 py-1 text-xs border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
      >
        <option value="">All Countries</option>
        {countries.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
      <select
        value={industryFilter}
        onChange={(e) => setIndustryFilter(e.target.value)}
        className="px-2 py-1 text-xs border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
      >
        <option value="">All Industries</option>
        {industries.map(i => <option key={i} value={i}>{i}</option>)}
      </select>
      {(countryFilter || industryFilter) && (
        <button onClick={() => { setCountryFilter(''); setIndustryFilter('') }} className="text-xs text-blue-500 hover:text-blue-700">
          Clear
        </button>
      )}
    </div>
  )
}

// Chart with zoom capability
function ChartWithZoom({ chartData, chartType }: { chartData: ChartPoint[]; chartType: 'area' | 'line' | 'bar' }) {
  const [zoomRange, setZoomRange] = useState<[number, number]>([0, chartData.length])
  const isZoomed = zoomRange[0] !== 0 || zoomRange[1] !== chartData.length
  const visibleData = chartData.slice(zoomRange[0], zoomRange[1])

  const zoomIn = () => {
    const mid = Math.floor((zoomRange[0] + zoomRange[1]) / 2)
    const quarter = Math.max(5, Math.floor((zoomRange[1] - zoomRange[0]) / 4))
    setZoomRange([Math.max(0, mid - quarter), Math.min(chartData.length, mid + quarter)])
  }
  const zoomOut = () => setZoomRange([0, chartData.length])

  const gridStroke = '#f0f0f0'
  const axisStroke = '#e5e7eb'
  const tickFill = '#9ca3af'
  const tooltipStyle = { background: '#fff', border: '1px solid #e5e7eb', fontSize: 12, color: '#374151' }
  const tooltipFormatter = (v: any, n: any) => [Number(v).toLocaleString(), String(n)]

  return (
    <div>
      <div className="flex items-center justify-end gap-1 mb-2">
        <button onClick={zoomIn} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" title="Zoom in">
          <ZoomIn className="h-3.5 w-3.5" />
        </button>
        {isZoomed && (
          <button onClick={zoomOut} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" title="Reset zoom">
            <ZoomOut className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      <div style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'area' ? (
            <AreaChart data={visibleData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: tickFill }} tickLine={false} axisLine={{ stroke: axisStroke }} />
              <YAxis tickFormatter={fmtAxis} tick={{ fontSize: 10, fill: tickFill }} tickLine={false} axisLine={{ stroke: axisStroke }} width={50} />
              <Tooltip contentStyle={tooltipStyle} formatter={tooltipFormatter} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Area type="monotone" dataKey="upper" stroke="#ef4444" fill="#fef2f2" strokeWidth={1} name="Upper" />
              <Area type="monotone" dataKey="core" stroke="#d97706" fill="#fffbeb" strokeWidth={2} name="Core" />
              <Area type="monotone" dataKey="conservative" stroke="#16a34a" fill="#f0fdf4" strokeWidth={1} name="Conservative" />
            </AreaChart>
          ) : chartType === 'bar' ? (
            <BarChart data={visibleData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
              <XAxis dataKey="date" tick={{ fontSize: 9, fill: tickFill }} tickLine={false} axisLine={{ stroke: axisStroke }} />
              <YAxis tickFormatter={fmtAxis} tick={{ fontSize: 9, fill: tickFill }} tickLine={false} axisLine={{ stroke: axisStroke }} width={50} />
              <Tooltip contentStyle={tooltipStyle} formatter={tooltipFormatter} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="upper" fill="#fee2e2" stroke="#ef4444" strokeWidth={0.5} name="Upper" />
              <Bar dataKey="core" fill="#e0e7ff" stroke="#6366f1" strokeWidth={0.5} name="Core" />
              <Bar dataKey="conservative" fill="#dcfce7" stroke="#16a34a" strokeWidth={0.5} name="Conservative" />
            </BarChart>
          ) : (
            <LineChart data={visibleData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: tickFill }} tickLine={false} axisLine={{ stroke: axisStroke }} />
              <YAxis tickFormatter={fmtAxis} tick={{ fontSize: 10, fill: tickFill }} tickLine={false} axisLine={{ stroke: axisStroke }} width={50} />
              <Tooltip contentStyle={tooltipStyle} formatter={tooltipFormatter} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="upper" stroke="#ef4444" strokeWidth={1} dot={false} name="Upper" />
              <Line type="monotone" dataKey="core" stroke="#d97706" strokeWidth={2} dot={false} name="Core" />
              <Line type="monotone" dataKey="conservative" stroke="#16a34a" strokeWidth={1} dot={false} name="Conservative" />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  )
}

// Event table with links to internal pages
function EventTable({ events, compact }: { events: EventData[]; compact?: boolean }) {
  return (
    <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-750 border-b border-gray-200 dark:border-gray-700">
            {['Date', 'Company', 'Country', 'Industry', 'Attribution', 'Announced', 'Conservative', 'Core', 'Upper', 'Src'].map((h, i) => (
              <th key={h} className={`p-2 text-[10px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 ${i >= 5 ? 'text-right' : 'text-left'} ${i === 9 ? 'text-center' : ''} ${compact && (i === 2 || i === 3) ? 'hidden lg:table-cell' : i === 2 ? 'hidden sm:table-cell' : i === 3 ? 'hidden md:table-cell' : ''} ${i === 9 ? 'hidden lg:table-cell' : ''}`}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {events.map((event, i) => (
            <tr key={event.id} className={`border-b border-gray-100 dark:border-gray-700 hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors ${i % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50/50 dark:bg-gray-750/50'}`}>
              <td className="p-2 text-xs text-gray-400 whitespace-nowrap">{event.dateAnnounced ? new Date(event.dateAnnounced).toISOString().split('T')[0] : '—'}</td>
              <td className="p-2 font-medium whitespace-nowrap">
                <Link href={`/event/${event.id}`} className="text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {event.companyName || '—'}
                </Link>
              </td>
              <td className={`p-2 text-xs text-gray-500 dark:text-gray-400 ${compact ? 'hidden lg:table-cell' : 'hidden sm:table-cell'}`}>{event.country || '—'}</td>
              <td className={`p-2 text-xs text-gray-500 dark:text-gray-400 ${compact ? 'hidden lg:table-cell' : 'hidden md:table-cell'}`}>{event.industry || '—'}</td>
              <td className="p-2"><span className={`inline-block px-1.5 py-0.5 text-[10px] font-semibold uppercase border rounded ${catBadge(event.attributionCategory)}`}>{event.attributionCategory}</span></td>
              <td className="p-2 text-right tabular-nums text-gray-500 dark:text-gray-400">{event.jobsCutAnnounced?.toLocaleString() || '—'}</td>
              <td className="p-2 text-right tabular-nums text-green-700 dark:text-green-400">{event.conservativeAiJobs.toLocaleString()}</td>
              <td className="p-2 text-right tabular-nums font-bold text-amber-700 dark:text-amber-400">{event.weightedAiJobs.toLocaleString()}</td>
              <td className="p-2 text-right tabular-nums text-red-600 dark:text-red-400">{event.upperAiJobs.toLocaleString()}</td>
              <td className="p-2 text-center hidden lg:table-cell">
                <Link href={`/event/${event.id}`} className="text-blue-500 hover:text-blue-700 dark:text-blue-400">
                  <ExternalLink className="h-3 w-3 inline" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// Big number hero — shared across all layouts
function HeroNumber({ stats, trackingLabel }: { stats: StatsData; trackingLabel: string }) {
  return (
    <div className="text-center py-8">
      <p className="text-[10px] uppercase tracking-[0.25em] text-gray-400 dark:text-gray-500 mb-2">{trackingLabel}</p>
      <div className="text-6xl sm:text-7xl md:text-8xl font-bold tabular-nums text-gray-900 dark:text-gray-100">
        {fmt(stats.core)}
      </div>
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">Core weighted estimate</p>
      <div className="flex items-center justify-center gap-6 sm:gap-10 mt-6">
        {[
          { label: 'Conservative', value: stats.conservative, cls: 'text-green-700 dark:text-green-400' },
          { label: 'Upper Bound', value: stats.upper, cls: 'text-red-600 dark:text-red-400' },
          { label: 'Announced', value: stats.totalAnnounced, cls: 'text-gray-600 dark:text-gray-300' },
          { label: 'Events', value: stats.eventCount, cls: 'text-gray-600 dark:text-gray-300' },
        ].map(s => (
          <div key={s.label} className="text-center">
            <div className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500">{s.label}</div>
            <div className={`text-xl font-bold tabular-nums ${s.cls}`}>{fmt(s.value)}</div>
          </div>
        ))}
      </div>
      <div className="mt-3 text-[10px] text-gray-400 dark:text-gray-500">
        {stats.lastUpdated && <>Updated {stats.lastUpdated.split('T')[0]}</>}
      </div>
    </div>
  )
}

// Chart/Events view switcher
function ChartEventsSwitcher({
  chartData, events, chartType, countryFilter, setCountryFilter, industryFilter, setIndustryFilter
}: {
  chartData: ChartPoint[]
  events: EventData[]
  chartType: 'area' | 'line' | 'bar'
  countryFilter: string
  setCountryFilter: (v: string) => void
  industryFilter: string
  setIndustryFilter: (v: string) => void
}) {
  const [view, setView] = useState<'chart' | 'events'>('chart')

  const filtered = useMemo(() => {
    return events.filter(e => {
      if (countryFilter && e.country !== countryFilter) return false
      if (industryFilter && e.industry !== industryFilter) return false
      return true
    })
  }, [events, countryFilter, industryFilter])

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            {view === 'chart' ? 'Cumulative Impact' : 'Event Log'}
          </h2>
          <Filters
            events={events}
            countryFilter={countryFilter}
            setCountryFilter={setCountryFilter}
            industryFilter={industryFilter}
            setIndustryFilter={setIndustryFilter}
          />
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setView('chart')}
            className={`p-1.5 rounded ${view === 'chart' ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
            title="Chart view"
          >
            <BarChart3 className="h-4 w-4" />
          </button>
          <button
            onClick={() => setView('events')}
            className={`p-1.5 rounded ${view === 'events' ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
            title="Event list"
          >
            <Table2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {view === 'chart' ? (
        <ChartWithZoom chartData={chartData} chartType={chartType} />
      ) : (
        <div className="max-h-[380px] overflow-y-auto">
          <EventTable events={filtered} />
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// LAYOUT 1: FULL-WIDTH REPORT (ailayoffs)
// ═══════════════════════════════════════════════════════════════
function ReportLayout({ allEvents, chartData, hasData, stats, trackingLabel }: HomeClientProps) {
  const [countryFilter, setCountryFilter] = useState('')
  const [industryFilter, setIndustryFilter] = useState('')

  const filtered = useMemo(() => {
    return allEvents.filter(e => {
      if (countryFilter && e.country !== countryFilter) return false
      if (industryFilter && e.industry !== industryFilter) return false
      return true
    })
  }, [allEvents, countryFilter, industryFilter])

  if (!hasData) {
    return <div className="min-h-[60vh] flex items-center justify-center bg-gray-50 dark:bg-gray-900"><p className="text-gray-400">No data available yet.</p></div>
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4">
          <HeroNumber stats={stats} trackingLabel={trackingLabel} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <ChartEventsSwitcher
          chartData={chartData}
          events={allEvents}
          chartType="area"
          countryFilter={countryFilter}
          setCountryFilter={setCountryFilter}
          industryFilter={industryFilter}
          setIndustryFilter={setIndustryFilter}
        />

        {/* Full table below */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              All Events {(countryFilter || industryFilter) && `(${filtered.length})`}
            </h2>
            <Link href="/news" className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 flex items-center gap-1">
              All Sources <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <EventTable events={filtered} />
        </div>

        <p className="text-center text-[10px] text-gray-400 dark:text-gray-500 py-4 mt-4 border-t border-gray-200 dark:border-gray-700">
          Data estimated from public reporting · Not census data · <Link href="/methodology" className="underline text-blue-500">Methodology</Link>
        </p>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// LAYOUT 2: TWO-COLUMN (aicuts)
// ═══════════════════════════════════════════════════════════════
function TwoColumnLayout({ allEvents, chartData, hasData, stats, trackingLabel }: HomeClientProps) {
  const [countryFilter, setCountryFilter] = useState('')
  const [industryFilter, setIndustryFilter] = useState('')

  const filtered = useMemo(() => {
    return allEvents.filter(e => {
      if (countryFilter && e.country !== countryFilter) return false
      if (industryFilter && e.industry !== industryFilter) return false
      return true
    })
  }, [allEvents, countryFilter, industryFilter])

  if (!hasData) {
    return <div className="min-h-[60vh] flex items-center justify-center bg-gray-50 dark:bg-gray-900"><p className="text-gray-400">No data available yet.</p></div>
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4">
          <HeroNumber stats={stats} trackingLabel={trackingLabel} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left Column - Chart + nav */}
          <div className="lg:col-span-2 space-y-4">
            <ChartEventsSwitcher
              chartData={chartData}
              events={allEvents}
              chartType="line"
              countryFilter={countryFilter}
              setCountryFilter={setCountryFilter}
              industryFilter={industryFilter}
              setIndustryFilter={setIndustryFilter}
            />
            <div className="grid grid-cols-2 gap-2">
              {navItems.slice(0, 4).map(l => (
                <Link key={l.href} href={l.href} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 text-center text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-700 dark:hover:text-blue-400 hover:border-blue-200 dark:hover:border-blue-800 transition-colors">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Column - Table */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Event Log {(countryFilter || industryFilter) && `(${filtered.length})`}
              </h2>
              <Link href="/news" className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 flex items-center gap-1">
                All Sources <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <EventTable events={filtered} compact />
          </div>
        </div>

        <p className="text-center text-[10px] text-gray-400 dark:text-gray-500 py-4 mt-4 border-t border-gray-200 dark:border-gray-700">
          Data from public reporting · <Link href="/methodology" className="underline text-blue-500">Methodology</Link>
        </p>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// LAYOUT 3: SIDEBAR NAV (ailayoffwatch)
// ═══════════════════════════════════════════════════════════════
function SidebarLayout({ allEvents, chartData, hasData, stats, trackingLabel }: HomeClientProps) {
  const [countryFilter, setCountryFilter] = useState('')
  const [industryFilter, setIndustryFilter] = useState('')

  const filtered = useMemo(() => {
    return allEvents.filter(e => {
      if (countryFilter && e.country !== countryFilter) return false
      if (industryFilter && e.industry !== industryFilter) return false
      return true
    })
  }, [allEvents, countryFilter, industryFilter])

  if (!hasData) {
    return <div className="min-h-[60vh] flex items-center justify-center bg-gray-50 dark:bg-gray-900"><p className="text-gray-400">No data available yet.</p></div>
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:block w-64 shrink-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-[calc(100vh-56px)] sticky top-14">
          <div className="p-4">
            <div className="mb-6 text-center">
              <p className="text-[10px] uppercase tracking-[0.15em] text-gray-400 dark:text-gray-500 mb-1">{trackingLabel}</p>
              <div className="text-4xl font-bold tabular-nums text-gray-900 dark:text-gray-100">{fmt(stats.core)}</div>
              <p className="text-[10px] text-gray-400 dark:text-gray-500">Core weighted</p>
            </div>

            <div className="space-y-3 mb-6">
              {[
                { label: 'Conservative', value: stats.conservative, cls: 'text-green-700 dark:text-green-400' },
                { label: 'Upper Bound', value: stats.upper, cls: 'text-red-600 dark:text-red-400' },
                { label: 'Announced', value: stats.totalAnnounced, cls: 'text-gray-600 dark:text-gray-300' },
                { label: 'Events', value: stats.eventCount, cls: 'text-gray-600 dark:text-gray-300' },
              ].map(s => (
                <div key={s.label} className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500">{s.label}</span>
                  <span className={`text-sm font-bold tabular-nums ${s.cls}`}>{typeof s.value === 'number' ? fmt(s.value) : s.value}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
              <p className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">Navigation</p>
              <nav className="space-y-0.5">
                {navItems.map(l => (
                  <Link key={l.href} href={l.href} className="block px-2 py-1.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-blue-700 dark:hover:text-blue-400 rounded transition-colors">
                    {l.label}
                  </Link>
                ))}
              </nav>
            </div>

            {stats.lastUpdated && (
              <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 text-[10px] text-gray-400 dark:text-gray-500">
                Updated {stats.lastUpdated.split('T')[0]}
              </div>
            )}
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 min-w-0 p-4 lg:p-6">
          {/* Mobile hero */}
          <div className="lg:hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded mb-4">
            <HeroNumber stats={stats} trackingLabel={trackingLabel} />
          </div>

          <ChartEventsSwitcher
            chartData={chartData}
            events={allEvents}
            chartType="area"
            countryFilter={countryFilter}
            setCountryFilter={setCountryFilter}
            industryFilter={industryFilter}
            setIndustryFilter={setIndustryFilter}
          />

          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                All Events {(countryFilter || industryFilter) && `(${filtered.length})`}
              </h2>
              <Link href="/news" className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 flex items-center gap-1">
                All Sources <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <EventTable events={filtered} />
          </div>
        </main>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// LAYOUT 4: PANEL (robotlayoffs)
// ═══════════════════════════════════════════════════════════════
function PanelLayout({ allEvents, chartData, hasData, stats, trackingLabel }: HomeClientProps) {
  const [countryFilter, setCountryFilter] = useState('')
  const [industryFilter, setIndustryFilter] = useState('')

  const filtered = useMemo(() => {
    return allEvents.filter(e => {
      if (countryFilter && e.country !== countryFilter) return false
      if (industryFilter && e.industry !== industryFilter) return false
      return true
    })
  }, [allEvents, countryFilter, industryFilter])

  if (!hasData) {
    return <div className="min-h-[60vh] flex items-center justify-center bg-gray-50 dark:bg-gray-900"><p className="text-gray-400">No data available yet.</p></div>
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4">
          <HeroNumber stats={stats} trackingLabel={trackingLabel} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <div className="lg:col-span-2">
            <ChartEventsSwitcher
              chartData={chartData}
              events={allEvents}
              chartType="bar"
              countryFilter={countryFilter}
              setCountryFilter={setCountryFilter}
              industryFilter={industryFilter}
              setIndustryFilter={setIndustryFilter}
            />
          </div>

          <div className="space-y-3">
            {navItems.map(l => (
              <Link key={l.href} href={l.href} className="block bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-200 dark:hover:border-blue-800 transition-colors">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{l.label}</span>
                <ArrowRight className="h-3 w-3 inline ml-2 text-gray-400" />
              </Link>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Event Log {(countryFilter || industryFilter) && `(${filtered.length})`}
            </h2>
            <Link href="/news" className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 flex items-center gap-1">
              All Sources <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <EventTable events={filtered} />
        </div>

        <p className="text-center text-[10px] text-gray-400 dark:text-gray-500 py-4 border-t border-gray-200 dark:border-gray-700">
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
