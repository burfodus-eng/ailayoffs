'use client'

import { useBrand } from '@/lib/brand-context'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine, Legend } from 'recharts'

interface MonthlyData {
  month: string
  lost: number
  created: number
  net: number
}

interface CumulativeData {
  month: string
  cumLost: number
  cumCreated: number
  cumNet: number
}

export function NetImpactClient({
  chartData,
  cumulativeData,
  totalLost,
  totalCreated,
  lossEventCount,
  creationEventCount,
}: {
  chartData: MonthlyData[]
  cumulativeData: CumulativeData[]
  totalLost: number
  totalCreated: number
  lossEventCount: number
  creationEventCount: number
}) {
  const brand = useBrand()
  const netTotal = totalCreated - totalLost
  const ratio = totalLost > 0 ? (totalLost / Math.max(totalCreated, 1)).toFixed(1) : '0'

  const formatMonth = (m: string) => {
    const [y, mo] = m.split('-')
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    return `${months[parseInt(mo) - 1]} ${y.slice(2)}`
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Net Impact</h1>
        <p className="text-muted-foreground text-sm mt-1">AI jobs created vs jobs lost — core weighted estimates</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="border rounded-lg p-4 bg-card">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Jobs Lost</p>
          <p className="text-2xl font-bold text-red-500 tabular-nums">{totalLost.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">{lossEventCount} events</p>
        </div>
        <div className="border rounded-lg p-4 bg-card">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Jobs Created</p>
          <p className="text-2xl font-bold text-green-500 tabular-nums">{totalCreated.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">{creationEventCount} events</p>
        </div>
        <div className="border rounded-lg p-4 bg-card">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Net Result</p>
          <p className={`text-2xl font-bold tabular-nums ${netTotal >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {netTotal >= 0 ? '+' : ''}{netTotal.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground">{netTotal >= 0 ? 'net positive' : 'net negative'}</p>
        </div>
        <div className="border rounded-lg p-4 bg-card">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Loss Ratio</p>
          <p className="text-2xl font-bold tabular-nums">{ratio}x</p>
          <p className="text-xs text-muted-foreground">jobs lost per job created</p>
        </div>
      </div>

      {chartData.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground">Not enough data to display charts yet.</p>
        </div>
      ) : (
        <>
          {/* Monthly Bar Chart */}
          <div className="border rounded-lg p-4 bg-card mb-6">
            <h2 className="font-bold text-sm mb-4">Monthly Breakdown</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData.map(d => ({ ...d, lostNeg: -d.lost, monthLabel: formatMonth(d.month) }))}>
                <CartesianGrid strokeDasharray="3 3" stroke={brand.cardBorder} />
                <XAxis dataKey="monthLabel" tick={{ fontSize: 11 }} stroke={brand.bodyText} />
                <YAxis tick={{ fontSize: 11 }} stroke={brand.bodyText} tickFormatter={(v: number) => Math.abs(v).toLocaleString()} />
                <Tooltip
                  contentStyle={{ backgroundColor: brand.cardBg, border: `1px solid ${brand.cardBorder}`, fontSize: 12 }}
                  formatter={(v: any, n: any) => [Math.abs(Number(v)).toLocaleString(), String(n) === 'lostNeg' ? 'Jobs Lost' : String(n) === 'created' ? 'Jobs Created' : 'Net']}
                />
                <Legend />
                <ReferenceLine y={0} stroke={brand.bodyText} strokeWidth={2} />
                <Bar dataKey="lostNeg" name="Jobs Lost" fill="#ef4444" radius={[0, 0, 2, 2]} />
                <Bar dataKey="created" name="Jobs Created" fill="#22c55e" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Cumulative Line Chart */}
          <div className="border rounded-lg p-4 bg-card">
            <h2 className="font-bold text-sm mb-4">Cumulative Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={cumulativeData.map(d => ({ ...d, cumLostNeg: -d.cumLost, monthLabel: formatMonth(d.month) }))}>
                <CartesianGrid strokeDasharray="3 3" stroke={brand.cardBorder} />
                <XAxis dataKey="monthLabel" tick={{ fontSize: 11 }} stroke={brand.bodyText} />
                <YAxis tick={{ fontSize: 11 }} stroke={brand.bodyText} tickFormatter={(v: number) => Math.abs(v).toLocaleString()} />
                <Tooltip
                  contentStyle={{ backgroundColor: brand.cardBg, border: `1px solid ${brand.cardBorder}`, fontSize: 12 }}
                  formatter={(v: any, n: any) => {
                    const labels: Record<string, string> = { cumLostNeg: 'Total Lost', cumCreated: 'Total Created', cumNet: 'Net Impact' }
                    return [Math.abs(Number(v)).toLocaleString(), labels[String(n)] || String(n)]
                  }}
                />
                <Legend />
                <ReferenceLine y={0} stroke={brand.bodyText} strokeWidth={2} />
                <Line type="monotone" dataKey="cumLostNeg" name="Total Lost" stroke="#ef4444" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="cumCreated" name="Total Created" stroke="#22c55e" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="cumNet" name="Net Impact" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  )
}
