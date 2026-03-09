'use client'

import { useBrand } from '@/lib/brand-context'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { ArrowRight, ExternalLink } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'

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

function categoryColor(cat: string) {
  switch (cat) {
    case 'EXPLICIT': return 'text-red-600 bg-red-100 dark:bg-red-950 dark:text-red-400 border-red-300 dark:border-red-800'
    case 'STRONG': return 'text-orange-600 bg-orange-100 dark:bg-orange-950 dark:text-orange-400 border-orange-300 dark:border-orange-800'
    case 'MODERATE': return 'text-yellow-700 bg-yellow-100 dark:bg-yellow-950 dark:text-yellow-400 border-yellow-300 dark:border-yellow-800'
    case 'WEAK': return 'text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-400 border-gray-300 dark:border-gray-700'
    default: return 'text-gray-500 bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700'
  }
}

const formatAxis = (value: number) => {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
  if (value >= 1000) return `${(value / 1000).toFixed(0)}K`
  return value.toString()
}

export function HomeClient({ allEvents, chartData, hasData }: { allEvents: EventData[]; chartData: ChartPoint[]; hasData: boolean }) {
  const brand = useBrand()

  if (!hasData) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground font-mono text-sm">No events tracked yet. Data will appear as articles are discovered.</p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Chart */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-muted-foreground">Cumulative AI Job Losses</h2>
        </div>
        <div className="border rounded-none bg-card p-4" style={{ height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fontFamily: 'monospace' }}
                tickLine={false}
                axisLine={{ stroke: '#334155' }}
              />
              <YAxis
                tickFormatter={formatAxis}
                tick={{ fontSize: 10, fontFamily: 'monospace' }}
                tickLine={false}
                axisLine={{ stroke: '#334155' }}
                width={50}
              />
              <Tooltip
                contentStyle={{
                  background: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: 0,
                  fontFamily: 'monospace',
                  fontSize: 11,
                  color: '#e2e8f0',
                }}
                formatter={(value: any, name: any) => [Number(value).toLocaleString(), String(name)]}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Legend
                wrapperStyle={{ fontFamily: 'monospace', fontSize: 11 }}
              />
              <Line type="stepAfter" dataKey="upper" stroke="#ef4444" strokeWidth={1} dot={{ r: 2 }} name="Upper Bound" />
              <Line type="stepAfter" dataKey="core" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} name="Core Estimate" />
              <Line type="stepAfter" dataKey="conservative" stroke="#22c55e" strokeWidth={1} dot={{ r: 2 }} name="Conservative" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Event Table */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-muted-foreground">Event Log</h2>
          <Link href="/news" className="text-xs font-mono text-muted-foreground hover:text-foreground flex items-center gap-1">
            ALL SOURCES <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="border rounded-none overflow-x-auto">
          <table className="w-full text-sm font-mono">
            <thead>
              <tr className="bg-muted/50 border-b">
                <th className="text-left p-2 text-xs font-bold uppercase text-muted-foreground">Date</th>
                <th className="text-left p-2 text-xs font-bold uppercase text-muted-foreground">Company</th>
                <th className="text-left p-2 text-xs font-bold uppercase text-muted-foreground hidden sm:table-cell">Country</th>
                <th className="text-left p-2 text-xs font-bold uppercase text-muted-foreground hidden md:table-cell">Industry</th>
                <th className="text-left p-2 text-xs font-bold uppercase text-muted-foreground">Attribution</th>
                <th className="text-right p-2 text-xs font-bold uppercase text-muted-foreground">Announced</th>
                <th className="text-right p-2 text-xs font-bold uppercase text-muted-foreground">Conservative</th>
                <th className="text-right p-2 text-xs font-bold uppercase text-muted-foreground">Core</th>
                <th className="text-right p-2 text-xs font-bold uppercase text-muted-foreground">Upper</th>
                <th className="text-center p-2 text-xs font-bold uppercase text-muted-foreground hidden lg:table-cell">Source</th>
              </tr>
            </thead>
            <tbody>
              {allEvents.map((event, i) => {
                const sourceUrl = event.articleEvents?.[0]?.article?.url
                return (
                  <tr key={event.id} className={`border-b border-border/50 hover:bg-muted/30 ${i % 2 === 0 ? '' : 'bg-muted/10'}`}>
                    <td className="p-2 text-xs text-muted-foreground whitespace-nowrap">
                      {event.dateAnnounced ? new Date(event.dateAnnounced).toISOString().split('T')[0] : '—'}
                    </td>
                    <td className="p-2 font-medium text-foreground whitespace-nowrap">
                      {event.companyName || '—'}
                    </td>
                    <td className="p-2 text-xs text-muted-foreground hidden sm:table-cell">{event.country || '—'}</td>
                    <td className="p-2 text-xs text-muted-foreground hidden md:table-cell">{event.industry || '—'}</td>
                    <td className="p-2">
                      <span className={`inline-block px-1.5 py-0.5 text-[10px] font-bold uppercase border ${categoryColor(event.attributionCategory)}`}>
                        {event.attributionCategory}
                      </span>
                    </td>
                    <td className="p-2 text-right tabular-nums text-muted-foreground">
                      {event.jobsCutAnnounced?.toLocaleString() || '—'}
                    </td>
                    <td className="p-2 text-right tabular-nums text-green-600 dark:text-green-400">
                      {event.conservativeAiJobs.toLocaleString()}
                    </td>
                    <td className="p-2 text-right tabular-nums font-bold text-amber-600 dark:text-amber-400">
                      {event.weightedAiJobs.toLocaleString()}
                    </td>
                    <td className="p-2 text-right tabular-nums text-red-600 dark:text-red-400">
                      {event.upperAiJobs.toLocaleString()}
                    </td>
                    <td className="p-2 text-center hidden lg:table-cell">
                      {sourceUrl ? (
                        <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-400">
                          <ExternalLink className="h-3 w-3 inline" />
                        </a>
                      ) : '—'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Navigation Links - compact */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border border border-border mb-8">
        <Link href="/news" className="bg-card hover:bg-muted/50 p-4 text-center transition-colors">
          <div className="text-xs font-mono font-bold uppercase text-muted-foreground">News & Sources</div>
          <div className="text-xs text-muted-foreground mt-1">Article catalog</div>
        </Link>
        <Link href="/jobs-created" className="bg-card hover:bg-muted/50 p-4 text-center transition-colors">
          <div className="text-xs font-mono font-bold uppercase text-green-600 dark:text-green-400">Jobs Created</div>
          <div className="text-xs text-muted-foreground mt-1">AI hiring tracker</div>
        </Link>
        <Link href="/robots" className="bg-card hover:bg-muted/50 p-4 text-center transition-colors">
          <div className="text-xs font-mono font-bold uppercase text-purple-600 dark:text-purple-400">Robot Tracker</div>
          <div className="text-xs text-muted-foreground mt-1">Automation & robotics</div>
        </Link>
        <Link href="/job-security" className="bg-card hover:bg-muted/50 p-4 text-center transition-colors">
          <div className="text-xs font-mono font-bold uppercase text-blue-600 dark:text-blue-400">Job Security</div>
          <div className="text-xs text-muted-foreground mt-1">Risk analyzer</div>
        </Link>
      </section>

      {/* Footer note */}
      <div className="text-center text-[10px] font-mono text-muted-foreground py-4">
        DATA FROM PUBLIC REPORTING // WEIGHTED ATTRIBUTION ANALYSIS // NOT CENSUS DATA //
        <Link href="/methodology" className="underline hover:text-foreground ml-1">METHODOLOGY</Link>
      </div>
    </div>
  )
}
