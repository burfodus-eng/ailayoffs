'use client'

import { useBrand } from '@/lib/brand-context'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { ArrowRight, Newspaper, Shield, TrendingUp, Bot } from 'lucide-react'

interface RecentEvent {
  id: string
  companyName: string | null
  country: string | null
  dateAnnounced: Date | null
  weightedAiJobs: number
  attributionCategory: string
  publicSummary: string | null
  reviewStatus: string
}

export function HomeClient({ recentEvents, hasData }: { recentEvents: RecentEvent[]; hasData: boolean }) {
  const brand = useBrand()

  const categoryBadgeVariant = (cat: string) => {
    switch (cat) {
      case 'EXPLICIT': return 'explicit' as const
      case 'STRONG': return 'strong' as const
      case 'MODERATE': return 'moderate' as const
      case 'WEAK': return 'weak' as const
      default: return 'secondary' as const
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      {/* Recent Events */}
      {recentEvents.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Recent Events</h2>
            <Link href="/news" className="text-sm text-gray-400 hover:text-white flex items-center gap-1">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {recentEvents.map((event) => (
              <Card key={event.id} className="bg-slate-900/50 border-slate-800">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {event.companyName && (
                        <span className="text-white font-medium">{event.companyName}</span>
                      )}
                      {event.country && (
                        <span className="text-gray-500 text-sm">{event.country}</span>
                      )}
                      <Badge variant={categoryBadgeVariant(event.attributionCategory)}>
                        {event.attributionCategory.toLowerCase()}
                      </Badge>
                      <Badge variant={event.reviewStatus === 'REVIEWED' ? 'reviewed' : 'provisional'}>
                        {event.reviewStatus.toLowerCase()}
                      </Badge>
                    </div>
                    {event.publicSummary && (
                      <p className="text-gray-400 text-sm">{event.publicSummary}</p>
                    )}
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-white font-bold tabular-nums">
                      {event.weightedAiJobs.toLocaleString()}
                    </div>
                    <div className="text-gray-500 text-xs">weighted jobs</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Section Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/news">
          <Card className="bg-slate-900/50 border-slate-800 hover:border-slate-600 transition-colors h-full">
            <CardHeader>
              <Newspaper className="h-8 w-8 text-gray-400 mb-2" />
              <CardTitle className="text-white text-base">News & Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 text-sm">Browse the articles and reports used to build our estimates.</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/jobs-created">
          <Card className="bg-slate-900/50 border-slate-800 hover:border-slate-600 transition-colors h-full">
            <CardHeader>
              <TrendingUp className="h-8 w-8 text-green-400 mb-2" />
              <CardTitle className="text-white text-base">AI Jobs Created</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 text-sm">Tracking new jobs, roles, and opportunities created by AI adoption.</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/robots">
          <Card className="bg-slate-900/50 border-slate-800 hover:border-slate-600 transition-colors h-full">
            <CardHeader>
              <Bot className="h-8 w-8 text-purple-400 mb-2" />
              <CardTitle className="text-white text-base">Robot Tracker</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 text-sm">Automation, robotics, and humanoid-driven job displacement.</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/job-security">
          <Card className="bg-slate-900/50 border-slate-800 hover:border-slate-600 transition-colors h-full">
            <CardHeader>
              <Shield className="h-8 w-8 text-blue-400 mb-2" />
              <CardTitle className="text-white text-base">Job Security Analyzer</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 text-sm">Check how AI and automation might affect your role.</p>
            </CardContent>
          </Card>
        </Link>
      </section>

      {/* Methodology Note */}
      <section className="mt-12 text-center">
        <p className="text-gray-600 text-xs max-w-2xl mx-auto">
          Includes reviewed and provisional reports. Recent records are continuously verified.
          Totals may be revised as better evidence is found.{' '}
          <Link href="/methodology" className="text-gray-400 hover:text-white underline">
            See methodology
          </Link>
        </p>
      </section>
    </div>
  )
}
