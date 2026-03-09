'use client'

import Link from 'next/link'
import { ExternalLink, ArrowLeft, Clock, MapPin, Briefcase, Building2 } from 'lucide-react'

interface ArticleData {
  id: string
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
  articleEvents: { article: ArticleData; isPrimary: boolean }[]
}

function categoryStyle(cat: string) {
  switch (cat) {
    case 'EXPLICIT': return 'bg-red-600 text-white'
    case 'STRONG': return 'bg-orange-500 text-white'
    case 'MODERATE': return 'bg-yellow-500 text-black'
    case 'WEAK': return 'bg-gray-400 text-white'
    default: return 'bg-gray-300 text-gray-700'
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export function EventDetailClient({ event }: { event: EventData }) {
  const primaryArticle = event.articleEvents.find(ae => ae.isPrimary)?.article || event.articleEvents[0]?.article

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <Link href="/news" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to News
      </Link>

      <div className="border rounded-lg bg-card p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded ${categoryStyle(event.attributionCategory)}`}>
            {event.attributionCategory}
          </span>
          <span className="px-2 py-1 text-[10px] font-bold uppercase rounded bg-muted">
            {event.eventType.replace(/_/g, ' ')}
          </span>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold mb-4">
          {event.companyName}: {event.jobsCutAnnounced?.toLocaleString() || event.weightedAiJobs.toLocaleString()} jobs {event.eventType === 'AI_JOB_CREATED' ? 'created' : 'cut'}
        </h1>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
          {event.dateAnnounced && (
            <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{formatDate(event.dateAnnounced)}</span>
          )}
          {event.country && (
            <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{event.country}</span>
          )}
          {event.industry && (
            <span className="flex items-center gap-1"><Briefcase className="h-4 w-4" />{event.industry}</span>
          )}
          {event.companyName && (
            <span className="flex items-center gap-1"><Building2 className="h-4 w-4" />{event.companyName}</span>
          )}
        </div>

        {/* Summary */}
        {event.publicSummary && (
          <div className="mb-8">
            <p className="text-base leading-relaxed">{event.publicSummary}</p>
          </div>
        )}

        {/* Estimates */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="border rounded-lg p-4 text-center">
            <p className="text-xs text-muted-foreground uppercase">Conservative</p>
            <p className="text-xl font-bold text-green-600 dark:text-green-400 tabular-nums">{event.conservativeAiJobs.toLocaleString()}</p>
          </div>
          <div className="border rounded-lg p-4 text-center bg-muted/30">
            <p className="text-xs text-muted-foreground uppercase">Core Estimate</p>
            <p className="text-xl font-bold text-amber-600 dark:text-amber-400 tabular-nums">{event.weightedAiJobs.toLocaleString()}</p>
          </div>
          <div className="border rounded-lg p-4 text-center">
            <p className="text-xs text-muted-foreground uppercase">Upper Bound</p>
            <p className="text-xl font-bold text-red-600 dark:text-red-400 tabular-nums">{event.upperAiJobs.toLocaleString()}</p>
          </div>
        </div>

        {/* Sources */}
        <div>
          <h2 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-3">Sources</h2>
          <div className="space-y-3">
            {event.articleEvents.map(({ article, isPrimary }) => (
              <div key={article.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {isPrimary && <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded">Primary</span>}
                      <span className="text-xs text-muted-foreground">{article.source?.name || article.source?.domain}</span>
                      {article.publishedAt && <span className="text-xs text-muted-foreground">{formatDate(article.publishedAt)}</span>}
                    </div>
                    <p className="font-medium text-sm">{article.title}</p>
                    {article.summary && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{article.summary}</p>}
                  </div>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 inline-flex items-center gap-1 px-3 py-1.5 text-xs border rounded-md hover:bg-muted transition-colors"
                  >
                    Read Original <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
