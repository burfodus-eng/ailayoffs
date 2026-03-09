'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react'

export function JobSecurityClient() {
  const [jobTitle, setJobTitle] = useState('')
  const [industry, setIndustry] = useState('')
  const [country, setCountry] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!jobTitle.trim()) return

    setLoading(true)
    setSubmitted(true)

    try {
      const res = await fetch('/api/job-security', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobTitle, industry, country }),
      })
      if (res.ok) {
        setResult(await res.json())
      } else {
        setResult({ error: 'Analysis unavailable. AI API key required.' })
      }
    } catch {
      setResult({ error: 'Analysis unavailable. Please try again later.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div>
          <label className="block text-sm text-gray-300 mb-1">Job Title *</label>
          <input
            type="text"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="e.g. Financial Analyst, Truck Driver, Software Engineer"
            className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Industry</label>
            <input
              type="text"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="e.g. Finance, Manufacturing"
              className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Country</label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="e.g. Australia, USA"
              className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
        <Button type="submit" disabled={loading || !jobTitle.trim()} className="w-full">
          {loading ? 'Analyzing...' : 'Analyze Job Security'}
        </Button>
      </form>

      {submitted && !loading && result && (
        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="p-6">
            {result.error ? (
              <div className="text-center py-4">
                <AlertTriangle className="h-8 w-8 text-yellow-500 mx-auto mb-3" />
                <p className="text-gray-400">{result.error}</p>
                <p className="text-gray-600 text-sm mt-2">The job security analyzer requires an AI API key to be configured.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-1">{result.riskScore}/100</div>
                  <p className="text-gray-400 text-sm">Overall AI Displacement Risk</p>
                </div>
                {result.reasoning && <p className="text-gray-300 text-sm">{result.reasoning}</p>}
                {result.suggestions && (
                  <div>
                    <h3 className="text-white font-semibold mb-2">Resilience Suggestions</h3>
                    <ul className="text-gray-300 text-sm list-disc pl-5 space-y-1">
                      {result.suggestions.map((s: string, i: number) => <li key={i}>{s}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <div className="mt-6 text-center text-gray-600 text-xs">
        This tool provides estimates only. Individual outcomes vary based on many factors.
        See our <a href="/methodology" className="text-gray-400 underline">methodology</a>.
      </div>
    </div>
  )
}
