'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { ExternalLink } from 'lucide-react'

interface ArticleData {
  title: string
  url: string
  summary: string | null
  publishedAt: string | null
  source: { name: string; domain: string } | null
}

interface EventData {
  id: string
  eventType: string
  companyName: string | null
  country: string | null
  industry: string | null
  dateAnnounced: string | null
  jobsCutAnnounced: number | null
  weightedAiJobs: number
  conservativeAiJobs: number
  upperAiJobs: number
  attributionCategory: string
  publicSummary: string | null
  reviewStatus: string
  articleEvents: { article: ArticleData; isPrimary: boolean }[]
}

function categoryBadge(cat: string) {
  switch (cat) {
    case 'EXPLICIT': return 'explicit' as const
    case 'STRONG': return 'strong' as const
    case 'MODERATE': return 'moderate' as const
    case 'WEAK': return 'weak' as const
    default: return 'secondary' as const
  }
}

export function NewsClient({ events }: { events: EventData[] }) {
  if (events.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg">No events tracked yet.</p>
        <p className="text-gray-600 text-sm mt-2">Data will appear here as articles are discovered and classified.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {events.map((event) => {
        const primaryArticle = event.articleEvents.find(ae => ae.isPrimary)?.article || event.articleEvents[0]?.article

        return (
          <Card key={event.id} className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    {event.companyName && <span className="text-white font-semibold">{event.companyName}</span>}
                    {event.country && <span className="text-gray-500 text-sm">{event.country}</span>}
                    {event.industry && <span className="text-gray-600 text-xs">({event.industry})</span>}
                    <Badge variant={categoryBadge(event.attributionCategory)}>
                      {event.attributionCategory.toLowerCase()}
                    </Badge>
                    <Badge variant={event.reviewStatus === 'REVIEWED' ? 'reviewed' : 'provisional'}>
                      {event.reviewStatus.toLowerCase()}
                    </Badge>
                    <Badge variant="outline" className="text-gray-400">
                      {event.eventType.replace('_', ' ').toLowerCase()}
                    </Badge>
                  </div>

                  {event.publicSummary && (
                    <p className="text-gray-300 text-sm mb-3">{event.publicSummary}</p>
                  )}

                  {primaryArticle && (
                    <a href={primaryArticle.url} target="_blank" rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1">
                      {primaryArticle.title || primaryArticle.source?.name || 'Source'}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}

                  {event.dateAnnounced && (
                    <span className="text-gray-600 text-xs mt-2 block">
                      Announced: {new Date(event.dateAnnounced).toLocaleDateString()}
                    </span>
                  )}
                </div>

                <div className="text-right shrink-0">
                  {event.jobsCutAnnounced && (
                    <div className="text-gray-400 text-xs mb-1">{event.jobsCutAnnounced.toLocaleString()} announced</div>
                  )}
                  <div className="text-white font-bold text-lg tabular-nums">{event.weightedAiJobs.toLocaleString()}</div>
                  <div className="text-gray-500 text-xs">weighted estimate</div>
                  <div className="text-gray-600 text-xs mt-1">
                    {event.conservativeAiJobs.toLocaleString()} &ndash; {event.upperAiJobs.toLocaleString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
