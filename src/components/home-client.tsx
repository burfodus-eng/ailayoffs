'use client'

import { useBrand } from '@/lib/brand-context'
import type { BrandConfig } from '@/lib/domains'
import Link from 'next/link'
import { ArrowRight, ExternalLink } from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
  AreaChart, Area, BarChart, Bar,
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

function categoryColor(cat: string) {
  switch (cat) {
    case 'EXPLICIT': return 'text-red-600 bg-red-100 dark:bg-red-950 dark:text-red-400 border-red-300 dark:border-red-800'
    case 'STRONG': return 'text-orange-600 bg-orange-100 dark:bg-orange-950 dark:text-orange-400 border-orange-300 dark:border-orange-800'
    case 'MODERATE': return 'text-yellow-700 bg-yellow-100 dark:bg-yellow-950 dark:text-yellow-400 border-yellow-300 dark:border-yellow-800'
    case 'WEAK': return 'text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-400 border-gray-300 dark:border-gray-700'
    default: return 'text-gray-500 bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700'
  }
}

// ═══════════════════════════════════════════════════════════════
// LAYOUT 1: TERMINAL (ailayoffs)
// ═══════════════════════════════════════════════════════════════
function TerminalLayout({ allEvents, chartData, hasData, stats, trackingLabel, brand }: HomeClientProps & { brand: BrandConfig }) {
  if (!hasData) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center" style={{ background: brand.bodyBg, color: brand.bodyText }}>
        <p className="font-mono text-sm">{'>'} NO DATA IN SYSTEM. AWAITING INPUT...</p>
      </div>
    )
  }

  return (
    <div style={{ background: brand.bodyBg, color: brand.bodyText }} className="font-mono">
      {/* Hero - Terminal style */}
      <section style={{ background: '#0a0f1a', borderBottom: '1px solid #1e293b' }} className="py-8">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-4">
            <p className="text-xs uppercase tracking-[0.3em] mb-2" style={{ color: '#475569' }}>
              {'///'} {trackingLabel} {'///'}
            </p>
            <div className="text-5xl sm:text-7xl font-black tabular-nums tracking-tight" style={{ color: '#f59e0b' }}>
              {fmt(stats.core)}
            </div>
            <p className="text-[10px] uppercase mt-1" style={{ color: '#475569' }}>CORE WEIGHTED ESTIMATE</p>
          </div>

          <div className="grid grid-cols-4 gap-px max-w-2xl mx-auto" style={{ background: '#334155' }}>
            {[
              { label: 'CONSERVATIVE', value: stats.conservative, color: '#22c55e' },
              { label: 'CORE', value: stats.core, color: '#f59e0b' },
              { label: 'UPPER BOUND', value: stats.upper, color: '#ef4444' },
              { label: 'ANNOUNCED', value: stats.totalAnnounced, color: '#64748b' },
            ].map(s => (
              <div key={s.label} style={{ background: '#0f172a' }} className="p-3 text-center">
                <div className="text-[10px] uppercase" style={{ color: '#475569' }}>{s.label}</div>
                <div className="text-lg font-bold tabular-nums" style={{ color: s.color }}>{fmt(s.value)}</div>
              </div>
            ))}
          </div>

          <div className="text-center mt-3 text-[10px] uppercase" style={{ color: '#334155' }}>
            EVENTS: {stats.eventCount} | REVIEWED: {stats.reviewedPercent}% |{' '}
            {stats.lastUpdated && <>UPDATED: {stats.lastUpdated.split('T')[0]} | </>}
            <span style={{ color: '#16a34a' }}>STATUS: LIVE</span>
          </div>
        </div>
      </section>

      {/* Chart */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="text-xs uppercase tracking-wider mb-2" style={{ color: '#475569' }}>
          {'══════════════'} CUMULATIVE TREND {'══════════════'}
        </div>
        <div style={{ background: '#0a0f1a', border: '1px solid #1e293b' }} className="p-4" >
          <div style={{ height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <XAxis dataKey="date" tick={{ fontSize: 10, fontFamily: 'monospace', fill: '#475569' }} tickLine={false} axisLine={{ stroke: '#1e293b' }} />
                <YAxis tickFormatter={fmtAxis} tick={{ fontSize: 10, fontFamily: 'monospace', fill: '#475569' }} tickLine={false} axisLine={{ stroke: '#1e293b' }} width={50} />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 0, fontFamily: 'monospace', fontSize: 11, color: '#e2e8f0' }} formatter={(v: any, n: any) => [Number(v).toLocaleString(), String(n)]} labelFormatter={l => `DATE: ${l}`} />
                <Legend wrapperStyle={{ fontFamily: 'monospace', fontSize: 11 }} />
                <Line type="stepAfter" dataKey="upper" stroke="#ef4444" strokeWidth={1} dot={{ r: 1.5, fill: '#ef4444' }} name="Upper" />
                <Line type="stepAfter" dataKey="core" stroke="#f59e0b" strokeWidth={2} dot={{ r: 2, fill: '#f59e0b' }} name="Core" />
                <Line type="stepAfter" dataKey="conservative" stroke="#22c55e" strokeWidth={1} dot={{ r: 1.5, fill: '#22c55e' }} name="Conservative" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Event Table */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs uppercase tracking-wider" style={{ color: '#475569' }}>
              {'══════════════'} EVENT LOG {'══════════════'}
            </div>
            <Link href="/news" className="text-xs hover:underline flex items-center gap-1" style={{ color: '#475569' }}>
              ALL SOURCES <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div style={{ border: '1px solid #1e293b' }} className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: '#0a0f1a', borderBottom: '1px solid #1e293b' }}>
                  {['Date', 'Company', 'Country', 'Industry', 'Attribution', 'Announced', 'Conservative', 'Core', 'Upper', 'Src'].map((h, i) => (
                    <th key={h} className={`p-2 text-[10px] font-bold uppercase ${i >= 5 ? 'text-right' : 'text-left'} ${i === 9 ? 'text-center' : ''} ${i === 2 ? 'hidden sm:table-cell' : ''} ${i === 3 ? 'hidden md:table-cell' : ''} ${i === 9 ? 'hidden lg:table-cell' : ''}`} style={{ color: '#475569' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allEvents.map((event, i) => {
                  const src = event.articleEvents?.[0]?.article?.url
                  return (
                    <tr key={event.id} style={{ background: i % 2 === 0 ? '#0f172a' : '#0a0f1a', borderBottom: '1px solid #1e293b' }} className="hover:brightness-125">
                      <td className="p-2 text-xs whitespace-nowrap" style={{ color: '#475569' }}>{event.dateAnnounced ? new Date(event.dateAnnounced).toISOString().split('T')[0] : '—'}</td>
                      <td className="p-2 font-medium whitespace-nowrap" style={{ color: '#e2e8f0' }}>{event.companyName || '—'}</td>
                      <td className="p-2 text-xs hidden sm:table-cell" style={{ color: '#475569' }}>{event.country || '—'}</td>
                      <td className="p-2 text-xs hidden md:table-cell" style={{ color: '#475569' }}>{event.industry || '—'}</td>
                      <td className="p-2"><span className={`inline-block px-1.5 py-0.5 text-[10px] font-bold uppercase border ${categoryColor(event.attributionCategory)}`}>{event.attributionCategory}</span></td>
                      <td className="p-2 text-right tabular-nums" style={{ color: '#64748b' }}>{event.jobsCutAnnounced?.toLocaleString() || '—'}</td>
                      <td className="p-2 text-right tabular-nums" style={{ color: '#22c55e' }}>{event.conservativeAiJobs.toLocaleString()}</td>
                      <td className="p-2 text-right tabular-nums font-bold" style={{ color: '#f59e0b' }}>{event.weightedAiJobs.toLocaleString()}</td>
                      <td className="p-2 text-right tabular-nums" style={{ color: '#ef4444' }}>{event.upperAiJobs.toLocaleString()}</td>
                      <td className="p-2 text-center hidden lg:table-cell">{src ? <a href={src} target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6' }}><ExternalLink className="h-3 w-3 inline" /></a> : '—'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Nav links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px mt-6 mb-6" style={{ background: '#1e293b' }}>
          {[
            { href: '/news', label: 'NEWS & SOURCES', sub: 'Article catalog', color: '#64748b' },
            { href: '/jobs-created', label: 'JOBS CREATED', sub: 'AI hiring', color: '#22c55e' },
            { href: '/robots', label: 'ROBOT TRACKER', sub: 'Automation', color: '#a855f7' },
            { href: '/job-security', label: 'JOB SECURITY', sub: 'Risk analyzer', color: '#3b82f6' },
          ].map(l => (
            <Link key={l.href} href={l.href} className="p-4 text-center hover:brightness-125 transition-all" style={{ background: '#0f172a' }}>
              <div className="text-xs font-bold uppercase" style={{ color: l.color }}>{l.label}</div>
              <div className="text-[10px] mt-1" style={{ color: '#475569' }}>{l.sub}</div>
            </Link>
          ))}
        </div>

        <div className="text-center text-[10px] uppercase py-4" style={{ color: '#334155' }}>
          DATA FROM PUBLIC REPORTING // WEIGHTED ATTRIBUTION ANALYSIS // NOT CENSUS DATA //{' '}
          <Link href="/methodology" className="underline hover:text-white">METHODOLOGY</Link>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// LAYOUT 2: EDITORIAL (aicuts)
// ═══════════════════════════════════════════════════════════════
function EditorialLayout({ allEvents, chartData, hasData, stats, trackingLabel, brand }: HomeClientProps & { brand: BrandConfig }) {
  if (!hasData) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center" style={{ background: brand.bodyBg, color: brand.bodyText }}>
        <p className="font-serif text-lg italic">No reports available yet.</p>
      </div>
    )
  }

  return (
    <div style={{ background: brand.bodyBg, color: brand.bodyText }}>
      {/* Hero - Editorial */}
      <section className="py-12 text-center" style={{ borderBottom: '2px solid #d6d3d1' }}>
        <div className="max-w-3xl mx-auto px-4">
          <p className="text-xs uppercase tracking-[0.25em] mb-4 font-sans" style={{ color: '#a8a29e' }}>
            {trackingLabel}
          </p>
          <div className="text-6xl sm:text-8xl font-bold font-serif tabular-nums" style={{ color: '#78350f' }}>
            {fmt(stats.core)}
          </div>
          <div className="w-24 h-px mx-auto mt-3 mb-3" style={{ background: '#c2410c' }} />
          <p className="text-sm font-serif italic" style={{ color: '#78716c' }}>Core weighted estimate of AI-attributed job losses</p>

          <div className="flex items-center justify-center gap-8 mt-6 text-sm font-serif">
            {[
              { label: 'Conservative', value: stats.conservative },
              { label: 'Upper Bound', value: stats.upper },
              { label: 'Total Announced', value: stats.totalAnnounced },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className="text-xs uppercase tracking-wider" style={{ color: '#a8a29e' }}>{s.label}</div>
                <div className="text-xl font-bold tabular-nums" style={{ color: '#44403c' }}>{fmt(s.value)}</div>
              </div>
            ))}
          </div>

          <div className="mt-4 text-xs font-sans" style={{ color: '#a8a29e' }}>
            {stats.eventCount} events tracked | {stats.reviewedPercent}% reviewed
            {stats.lastUpdated && <> | Updated {stats.lastUpdated.split('T')[0]}</>}
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Chart - Area style */}
        <section className="mb-10">
          <div className="flex items-center gap-4 mb-4">
            <h2 className="text-xl font-serif font-bold" style={{ color: '#44403c' }}>Cumulative Impact</h2>
            <div className="flex-1 h-px" style={{ background: '#d6d3d1' }} />
          </div>
          <div className="p-6" style={{ background: '#ffffff', border: '1px solid #e7e5e4', borderRadius: 4 }}>
            <div style={{ height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#a8a29e' }} tickLine={false} axisLine={{ stroke: '#d6d3d1' }} />
                  <YAxis tickFormatter={fmtAxis} tick={{ fontSize: 10, fill: '#a8a29e' }} tickLine={false} axisLine={{ stroke: '#d6d3d1' }} width={50} />
                  <Tooltip contentStyle={{ background: '#faf8f5', border: '1px solid #d6d3d1', borderRadius: 4, fontSize: 12, color: '#44403c' }} formatter={(v: any, n: any) => [Number(v).toLocaleString(), String(n)]} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Area type="monotone" dataKey="upper" stroke="#9a3412" fill="#fed7aa" fillOpacity={0.3} strokeWidth={1} name="Upper Bound" />
                  <Area type="monotone" dataKey="core" stroke="#c2410c" fill="#fdba74" fillOpacity={0.4} strokeWidth={2} name="Core Estimate" />
                  <Area type="monotone" dataKey="conservative" stroke="#a16207" fill="#fef3c7" fillOpacity={0.3} strokeWidth={1} name="Conservative" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* Events as cards */}
        <section className="mb-10">
          <div className="flex items-center gap-4 mb-4">
            <h2 className="text-xl font-serif font-bold" style={{ color: '#44403c' }}>Latest Reports</h2>
            <div className="flex-1 h-px" style={{ background: '#d6d3d1' }} />
            <Link href="/news" className="text-sm font-serif hover:underline flex items-center gap-1" style={{ color: '#a8a29e' }}>
              All Sources <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {allEvents.slice(0, 12).map(event => {
              const src = event.articleEvents?.[0]?.article
              return (
                <div key={event.id} className="p-4" style={{ background: '#ffffff', border: '1px solid #e7e5e4', borderRadius: 4 }}>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-serif font-bold text-base" style={{ color: '#292524' }}>{event.companyName || 'Unknown'}</h3>
                    <span className={`inline-block px-1.5 py-0.5 text-[10px] font-bold uppercase border ${categoryColor(event.attributionCategory)}`}>{event.attributionCategory}</span>
                  </div>
                  <div className="text-xs mb-2" style={{ color: '#78716c' }}>
                    {event.dateAnnounced ? new Date(event.dateAnnounced).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Date unknown'}
                    {event.country && <> &middot; {event.country}</>}
                    {event.industry && <> &middot; {event.industry}</>}
                  </div>
                  {event.publicSummary && <p className="text-sm font-serif mb-2 leading-relaxed" style={{ color: '#57534e' }}>{event.publicSummary}</p>}
                  <div className="flex items-center gap-4 text-xs tabular-nums" style={{ color: '#78716c' }}>
                    <span>Core: <strong style={{ color: '#c2410c' }}>{event.weightedAiJobs.toLocaleString()}</strong></span>
                    <span>Range: {event.conservativeAiJobs.toLocaleString()} — {event.upperAiJobs.toLocaleString()}</span>
                    {src && <a href={src.url} target="_blank" rel="noopener noreferrer" className="ml-auto hover:underline" style={{ color: '#c2410c' }}>Source <ExternalLink className="h-3 w-3 inline" /></a>}
                  </div>
                </div>
              )
            })}
          </div>
          {allEvents.length > 12 && (
            <p className="text-center text-sm font-serif mt-4 italic" style={{ color: '#a8a29e' }}>
              Showing 12 of {allEvents.length} events.{' '}
              <Link href="/news" className="underline" style={{ color: '#c2410c' }}>View all</Link>
            </p>
          )}
        </section>

        {/* Nav */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { href: '/news', label: 'News & Sources', sub: 'Article catalog' },
            { href: '/jobs-created', label: 'Jobs Created', sub: 'AI hiring tracker' },
            { href: '/robots', label: 'Robot Tracker', sub: 'Automation & robotics' },
            { href: '/job-security', label: 'Job Security', sub: 'Risk analyzer' },
          ].map(l => (
            <Link key={l.href} href={l.href} className="p-4 text-center hover:shadow-md transition-shadow" style={{ background: '#ffffff', border: '1px solid #e7e5e4', borderRadius: 4 }}>
              <div className="text-sm font-serif font-bold" style={{ color: '#44403c' }}>{l.label}</div>
              <div className="text-xs mt-1" style={{ color: '#a8a29e' }}>{l.sub}</div>
            </Link>
          ))}
        </section>

        <div className="text-center text-xs py-4 font-serif italic" style={{ color: '#a8a29e', borderTop: '1px solid #d6d3d1' }}>
          Data estimated from public reporting. Numbers represent ranges, not exact counts.{' '}
          <Link href="/methodology" className="underline" style={{ color: '#c2410c' }}>Read our methodology</Link>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// LAYOUT 3: DASHBOARD (ailayoffwatch)
// ═══════════════════════════════════════════════════════════════
function DashboardLayout({ allEvents, chartData, hasData, stats, trackingLabel, brand }: HomeClientProps & { brand: BrandConfig }) {
  if (!hasData) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center" style={{ background: brand.bodyBg, color: brand.bodyText }}>
        <p className="text-sm">No data available yet. Check back soon.</p>
      </div>
    )
  }

  const statCards = [
    { label: 'Core Estimate', value: stats.core, color: '#3b82f6', sub: 'Weighted AI attribution' },
    { label: 'Conservative', value: stats.conservative, color: '#06b6d4', sub: 'Lower bound estimate' },
    { label: 'Upper Bound', value: stats.upper, color: '#8b5cf6', sub: 'Maximum estimate' },
    { label: 'Events Tracked', value: stats.eventCount, color: '#38bdf8', sub: `${stats.reviewedPercent}% reviewed` },
  ]

  return (
    <div style={{ background: brand.bodyBg, color: brand.bodyText }}>
      {/* Hero */}
      <section className="py-8" style={{ background: '#0f172a', borderBottom: '1px solid #1e293b' }}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#22c55e' }} />
            <span className="text-xs uppercase tracking-wider" style={{ color: '#64748b' }}>{trackingLabel}</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {statCards.map(s => (
              <div key={s.label} className="rounded-lg p-4" style={{ background: '#1e293b', border: '1px solid #334155' }}>
                <div className="text-xs uppercase tracking-wider mb-1" style={{ color: '#64748b' }}>{s.label}</div>
                <div className="text-3xl font-bold tabular-nums" style={{ color: s.color }}>{fmt(s.value)}</div>
                <div className="text-[10px] mt-1" style={{ color: '#475569' }}>{s.sub}</div>
                {s.label === 'Core Estimate' && (
                  <div className="mt-2 h-1.5 rounded-full overflow-hidden" style={{ background: '#334155' }}>
                    <div className="h-full rounded-full" style={{ background: '#3b82f6', width: `${Math.min(100, (stats.core / (stats.upper || 1)) * 100)}%` }} />
                  </div>
                )}
              </div>
            ))}
          </div>

          {stats.lastUpdated && (
            <div className="mt-3 text-xs" style={{ color: '#475569' }}>
              Last updated: {new Date(stats.lastUpdated).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
            </div>
          )}
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Chart */}
        <section className="mb-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: '#64748b' }}>Cumulative Impact</h2>
          <div className="rounded-lg p-4" style={{ background: '#0f172a', border: '1px solid #334155' }}>
            <div style={{ height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }} tickLine={false} axisLine={{ stroke: '#334155' }} />
                  <YAxis tickFormatter={fmtAxis} tick={{ fontSize: 10, fill: '#64748b' }} tickLine={false} axisLine={{ stroke: '#334155' }} width={50} />
                  <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, fontSize: 12, color: '#e2e8f0' }} formatter={(v: any, n: any) => [Number(v).toLocaleString(), String(n)]} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Line type="monotone" dataKey="upper" stroke="#8b5cf6" strokeWidth={1} dot={false} name="Upper" />
                  <Line type="monotone" dataKey="core" stroke="#3b82f6" strokeWidth={2.5} dot={false} name="Core" />
                  <Line type="monotone" dataKey="conservative" stroke="#06b6d4" strokeWidth={1} dot={false} name="Conservative" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* Events as compact rows */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: '#64748b' }}>Event Log</h2>
            <Link href="/news" className="text-xs flex items-center gap-1 rounded-full px-3 py-1" style={{ background: '#334155', color: '#94a3b8' }}>
              All Sources <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="rounded-lg overflow-hidden" style={{ background: '#0f172a', border: '1px solid #334155' }}>
            {allEvents.map((event, i) => {
              const src = event.articleEvents?.[0]?.article?.url
              return (
                <div key={event.id} className="flex items-center gap-3 px-4 py-2.5 hover:brightness-125 transition-all" style={{ borderBottom: i < allEvents.length - 1 ? '1px solid #1e293b' : undefined }}>
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: event.attributionCategory === 'EXPLICIT' ? '#ef4444' : event.attributionCategory === 'STRONG' ? '#f97316' : event.attributionCategory === 'MODERATE' ? '#eab308' : '#6b7280' }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm truncate" style={{ color: '#e2e8f0' }}>{event.companyName || '—'}</span>
                      <span className="text-xs" style={{ color: '#475569' }}>{event.country || ''}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs tabular-nums flex-shrink-0">
                    <span style={{ color: '#64748b' }}>{event.dateAnnounced ? new Date(event.dateAnnounced).toISOString().split('T')[0] : ''}</span>
                    <span className="font-bold" style={{ color: '#3b82f6' }}>{event.weightedAiJobs.toLocaleString()}</span>
                    {src && <a href={src} target="_blank" rel="noopener noreferrer" style={{ color: '#38bdf8' }}><ExternalLink className="h-3 w-3" /></a>}
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Nav */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { href: '/news', label: 'News & Sources', color: '#64748b' },
            { href: '/jobs-created', label: 'Jobs Created', color: '#22c55e' },
            { href: '/robots', label: 'Robot Tracker', color: '#a855f7' },
            { href: '/job-security', label: 'Job Security', color: '#3b82f6' },
          ].map(l => (
            <Link key={l.href} href={l.href} className="rounded-lg p-4 text-center hover:brightness-110 transition-all" style={{ background: '#0f172a', border: '1px solid #334155' }}>
              <div className="text-sm font-semibold" style={{ color: l.color }}>{l.label}</div>
            </Link>
          ))}
        </section>

        <div className="text-center text-xs py-4" style={{ color: '#475569' }}>
          Data estimated from public reporting.{' '}
          <Link href="/methodology" className="underline" style={{ color: '#38bdf8' }}>Methodology</Link>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// LAYOUT 4: FUTURISTIC (robotlayoffs)
// ═══════════════════════════════════════════════════════════════
function FuturisticLayout({ allEvents, chartData, hasData, stats, trackingLabel, brand }: HomeClientProps & { brand: BrandConfig }) {
  if (!hasData) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center font-mono" style={{ background: brand.bodyBg, color: brand.bodyText }}>
        <p className="text-sm">[ NO DATA STREAMS DETECTED ]</p>
      </div>
    )
  }

  return (
    <div className="font-mono" style={{ background: brand.bodyBg, color: brand.bodyText, backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(139,92,246,0.08) 1px, transparent 0)', backgroundSize: '40px 40px' }}>
      {/* Hero */}
      <section className="py-10 relative overflow-hidden" style={{ borderBottom: '1px solid rgba(124,58,237,0.3)' }}>
        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <div className="text-center mb-6">
            <p className="text-xs uppercase tracking-[0.4em] mb-3" style={{ color: '#7c3aed' }}>
              {'[ '}{trackingLabel}{' ]'}
            </p>
            <div className="text-6xl sm:text-8xl font-black tabular-nums tracking-tight" style={{ color: '#c4b5fd', textShadow: '0 0 40px rgba(139,92,246,0.4)' }}>
              {fmt(stats.core)}
            </div>
            <div className="w-32 h-0.5 mx-auto mt-2" style={{ background: 'linear-gradient(90deg, transparent, #7c3aed, transparent)' }} />
            <p className="text-[10px] uppercase mt-2" style={{ color: '#6d28d9' }}>CORE WEIGHTED ESTIMATE</p>
          </div>

          <div className="grid grid-cols-4 gap-3 max-w-2xl mx-auto">
            {[
              { label: 'CONSERVATIVE', value: stats.conservative, color: '#8b5cf6' },
              { label: 'CORE', value: stats.core, color: '#a78bfa' },
              { label: 'UPPER', value: stats.upper, color: '#c4b5fd' },
              { label: 'ANNOUNCED', value: stats.totalAnnounced, color: '#6d28d9' },
            ].map(s => (
              <div key={s.label} className="p-3 text-center" style={{ background: 'rgba(26,26,46,0.8)', border: '1px solid rgba(124,58,237,0.3)', clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))' }}>
                <div className="text-[9px] uppercase tracking-wider" style={{ color: '#6d28d9' }}>{s.label}</div>
                <div className="text-lg font-bold tabular-nums" style={{ color: s.color }}>{fmt(s.value)}</div>
              </div>
            ))}
          </div>

          <div className="text-center mt-4 text-[10px] uppercase tracking-wider" style={{ color: '#4c1d95' }}>
            STREAMS: {stats.eventCount} | VERIFIED: {stats.reviewedPercent}% |{' '}
            <span className="inline-flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#22c55e', boxShadow: '0 0 6px #22c55e' }} />
              ONLINE
            </span>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Chart - Bar chart */}
        <section className="mb-6">
          <h2 className="text-xs uppercase tracking-[0.2em] mb-3" style={{ color: '#7c3aed' }}>{'[ DISPLACEMENT INDEX ]'}</h2>
          <div className="p-4" style={{ background: 'rgba(26,26,46,0.6)', border: '1px solid rgba(124,58,237,0.2)' }}>
            <div style={{ height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <XAxis dataKey="date" tick={{ fontSize: 9, fontFamily: 'monospace', fill: '#6d28d9' }} tickLine={false} axisLine={{ stroke: 'rgba(124,58,237,0.3)' }} />
                  <YAxis tickFormatter={fmtAxis} tick={{ fontSize: 9, fontFamily: 'monospace', fill: '#6d28d9' }} tickLine={false} axisLine={{ stroke: 'rgba(124,58,237,0.3)' }} width={50} />
                  <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid #7c3aed', borderRadius: 0, fontFamily: 'monospace', fontSize: 11, color: '#c4b5fd' }} formatter={(v: any, n: any) => [Number(v).toLocaleString(), String(n)]} />
                  <Legend wrapperStyle={{ fontFamily: 'monospace', fontSize: 11 }} />
                  <Bar dataKey="upper" fill="rgba(196,181,253,0.3)" stroke="#c4b5fd" strokeWidth={0.5} name="Upper" />
                  <Bar dataKey="core" fill="rgba(167,139,250,0.5)" stroke="#a78bfa" strokeWidth={0.5} name="Core" />
                  <Bar dataKey="conservative" fill="rgba(139,92,246,0.4)" stroke="#8b5cf6" strokeWidth={0.5} name="Conservative" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* Events with accent bars */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs uppercase tracking-[0.2em]" style={{ color: '#7c3aed' }}>{'[ EVENT LOG ]'}</h2>
            <Link href="/news" className="text-xs flex items-center gap-1 hover:underline" style={{ color: '#6d28d9' }}>
              ALL SOURCES <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-1">
            {allEvents.map(event => {
              const src = event.articleEvents?.[0]?.article?.url
              const barColor = event.attributionCategory === 'EXPLICIT' ? '#ef4444' : event.attributionCategory === 'STRONG' ? '#f97316' : event.attributionCategory === 'MODERATE' ? '#eab308' : '#6b7280'
              return (
                <div key={event.id} className="flex items-stretch" style={{ background: 'rgba(26,26,46,0.5)', border: '1px solid rgba(124,58,237,0.15)' }}>
                  <div className="w-1 flex-shrink-0" style={{ background: barColor }} />
                  <div className="flex items-center gap-3 px-3 py-2.5 flex-1 min-w-0">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm" style={{ color: '#c4b5fd' }}>{event.companyName || '—'}</span>
                        <span className="text-[10px] uppercase" style={{ color: '#4c1d95' }}>{event.country || ''}</span>
                      </div>
                      {event.publicSummary && <p className="text-xs mt-0.5 truncate" style={{ color: '#6d28d9' }}>{event.publicSummary}</p>}
                    </div>
                    <div className="flex items-center gap-4 text-xs tabular-nums flex-shrink-0">
                      <span style={{ color: '#4c1d95' }}>{event.dateAnnounced ? new Date(event.dateAnnounced).toISOString().split('T')[0] : ''}</span>
                      <span className="font-bold" style={{ color: '#a78bfa', textShadow: '0 0 8px rgba(167,139,250,0.4)' }}>{event.weightedAiJobs.toLocaleString()}</span>
                      {src && <a href={src} target="_blank" rel="noopener noreferrer" style={{ color: '#7c3aed' }}><ExternalLink className="h-3 w-3" /></a>}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Nav */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { href: '/news', label: 'NEWS FEED', color: '#6d28d9' },
            { href: '/jobs-created', label: 'CREATION INDEX', color: '#22c55e' },
            { href: '/robots', label: 'ROBOT SYSTEMS', color: '#a78bfa' },
            { href: '/job-security', label: 'THREAT ANALYSIS', color: '#c4b5fd' },
          ].map(l => (
            <Link key={l.href} href={l.href} className="p-4 text-center hover:brightness-125 transition-all" style={{ background: 'rgba(26,26,46,0.6)', border: '1px solid rgba(124,58,237,0.2)', clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))' }}>
              <div className="text-xs font-bold uppercase tracking-wider" style={{ color: l.color }}>{'[ '}{l.label}{' ]'}</div>
            </Link>
          ))}
        </section>

        <div className="text-center text-[10px] uppercase tracking-wider py-4" style={{ color: '#4c1d95', borderTop: '1px solid rgba(124,58,237,0.2)' }}>
          PUBLIC REPORTING DATA // WEIGHTED ATTRIBUTION //{' '}
          <Link href="/methodology" className="underline" style={{ color: '#7c3aed' }}>METHODOLOGY</Link>
        </div>
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
      return <TerminalLayout {...props} brand={brand} />
    case 'editorial':
      return <EditorialLayout {...props} brand={brand} />
    case 'dashboard':
      return <DashboardLayout {...props} brand={brand} />
    case 'futuristic':
      return <FuturisticLayout {...props} brand={brand} />
    default:
      return <TerminalLayout {...props} brand={brand} />
  }
}
