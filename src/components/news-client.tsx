'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ExternalLink, Filter, X, Clock, Building2, MapPin, Briefcase, ArrowRight } from 'lucide-react'

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

function getOgImageUrl(articleUrl: string): string {
  try {
    const domain = new URL(articleUrl).hostname
    return `https://logo.clearbit.com/${domain}?size=200`
  } catch {
    return ''
  }
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
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

function eventTypeLabel(type: string) {
  switch (type) {
    case 'AI_LAYOFF': return 'AI Layoff'
    case 'ROBOT_LAYOFF': return 'Robot / Automation'
    case 'AI_JOB_CREATED': return 'Jobs Created'
    case 'PRODUCTIVITY_GAIN': return 'Productivity'
    default: return type
  }
}

// Popup preview modal
function EventPopup({ event, onClose }: { event: EventData; onClose: () => void }) {
  const article = event.articleEvents.find(ae => ae.isPrimary)?.article || event.articleEvents[0]?.article

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative bg-card border rounded-lg max-w-lg w-full max-h-[80vh] overflow-y-auto p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground">
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2 mb-3">
          <span className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded ${categoryStyle(event.attributionCategory)}`}>
            {event.attributionCategory}
          </span>
          <span className="px-2 py-0.5 text-[9px] font-bold uppercase rounded bg-muted">
            {eventTypeLabel(event.eventType)}
          </span>
        </div>

        <h2 className="text-lg font-bold mb-2">
          {event.companyName}: {event.jobsCutAnnounced?.toLocaleString() || event.weightedAiJobs.toLocaleString()} jobs {event.eventType === 'AI_JOB_CREATED' ? 'created' : 'cut'}
        </h2>

        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-3">
          {event.dateAnnounced && <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{formatDate(event.dateAnnounced)}</span>}
          {event.country && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{event.country}</span>}
          {event.industry && <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" />{event.industry}</span>}
        </div>

        {event.publicSummary && (
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">{event.publicSummary}</p>
        )}

        <div className="flex items-center gap-3 text-xs tabular-nums mb-4 p-3 bg-muted/50 rounded">
          <span className="text-green-600 dark:text-green-400">Conservative: {event.conservativeAiJobs.toLocaleString()}</span>
          <span className="font-bold text-amber-600 dark:text-amber-400">Core: {event.weightedAiJobs.toLocaleString()}</span>
          <span className="text-red-600 dark:text-red-400">Upper: {event.upperAiJobs.toLocaleString()}</span>
        </div>

        {article && (
          <p className="text-xs text-muted-foreground mb-4">
            Source: {article.source?.name || article.source?.domain || 'Unknown'}
          </p>
        )}

        <div className="flex items-center gap-3">
          <Link
            href={`/event/${event.id}`}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            onClick={onClose}
          >
            Read Full Summary <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export function NewsClient({ events, countries, industries }: { events: EventData[]; countries: string[]; industries: string[] }) {
  const [countryFilter, setCountryFilter] = useState('')
  const [industryFilter, setIndustryFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [popupEvent, setPopupEvent] = useState<EventData | null>(null)

  const filtered = useMemo(() => {
    return events.filter(e => {
      if (countryFilter && e.country !== countryFilter) return false
      if (industryFilter && e.industry !== industryFilter) return false
      if (categoryFilter && e.attributionCategory !== categoryFilter) return false
      if (typeFilter && e.eventType !== typeFilter) return false
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        const matches = [e.companyName, e.country, e.industry, e.publicSummary]
          .filter(Boolean)
          .some(s => s!.toLowerCase().includes(q))
        if (!matches) return false
      }
      return true
    })
  }, [events, countryFilter, industryFilter, categoryFilter, typeFilter, searchQuery])

  const featured = filtered[0]
  const rest = filtered.slice(1)
  const activeFilters = [countryFilter, industryFilter, categoryFilter, typeFilter].filter(Boolean).length

  if (events.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
        <p className="text-muted-foreground text-lg">No events tracked yet.</p>
        <p className="text-muted-foreground/60 text-sm mt-2">Data will appear here as articles are discovered and classified.</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {popupEvent && <EventPopup event={popupEvent} onClose={() => setPopupEvent(null)} />}

      {/* Header */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">News & Sources</h1>
          <p className="text-muted-foreground text-sm mt-1">{filtered.length} events from public reporting</p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-3 py-2 text-sm border rounded-md transition-colors ${showFilters ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
        >
          <Filter className="h-4 w-4" />
          Filters {activeFilters > 0 && `(${activeFilters})`}
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="border rounded-lg p-4 mb-6 bg-card">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <select value={countryFilter} onChange={(e) => setCountryFilter(e.target.value)} className="px-3 py-2 text-sm border rounded-md bg-background">
              <option value="">All Countries</option>
              {countries.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={industryFilter} onChange={(e) => setIndustryFilter(e.target.value)} className="px-3 py-2 text-sm border rounded-md bg-background">
              <option value="">All Industries</option>
              {industries.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="px-3 py-2 text-sm border rounded-md bg-background">
              <option value="">All Attribution</option>
              <option value="EXPLICIT">Explicit</option>
              <option value="STRONG">Strong</option>
              <option value="MODERATE">Moderate</option>
              <option value="WEAK">Weak</option>
            </select>
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="px-3 py-2 text-sm border rounded-md bg-background">
              <option value="">All Types</option>
              <option value="AI_LAYOFF">AI Layoffs</option>
              <option value="ROBOT_LAYOFF">Robot / Automation</option>
              <option value="AI_JOB_CREATED">Jobs Created</option>
              <option value="PRODUCTIVITY_GAIN">Productivity</option>
            </select>
          </div>
          {activeFilters > 0 && (
            <button
              onClick={() => { setCountryFilter(''); setIndustryFilter(''); setCategoryFilter(''); setTypeFilter(''); setSearchQuery('') }}
              className="mt-3 text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              <X className="h-3 w-3" /> Clear all filters
            </button>
          )}
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground">No events match your filters.</p>
        </div>
      )}

      {/* Featured Story */}
      {featured && (
        <FeaturedCard event={featured} onPreview={() => setPopupEvent(featured)} />
      )}

      {/* Story Grid */}
      {rest.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
          {rest.map(event => (
            <StoryCard key={event.id} event={event} onPreview={() => setPopupEvent(event)} />
          ))}
        </div>
      )}
    </div>
  )
}

function FeaturedCard({ event, onPreview }: { event: EventData; onPreview: () => void }) {
  const article = event.articleEvents.find(ae => ae.isPrimary)?.article || event.articleEvents[0]?.article
  const logoUrl = article ? getOgImageUrl(article.url) : ''

  return (
    <div
      onClick={onPreview}
      className="block group cursor-pointer"
    >
      <div className="border rounded-lg overflow-hidden bg-card hover:shadow-lg transition-shadow">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-72 h-48 md:h-auto bg-muted flex items-center justify-center shrink-0 relative overflow-hidden">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={event.companyName || ''}
                className="w-20 h-20 object-contain opacity-60 group-hover:opacity-80 transition-opacity"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
              />
            ) : null}
            <div className="absolute top-3 left-3">
              <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded ${categoryStyle(event.attributionCategory)}`}>
                {event.attributionCategory}
              </span>
            </div>
            <div className="absolute bottom-3 left-3">
              <span className="px-2 py-1 text-[10px] font-bold uppercase rounded bg-black/60 text-white">
                {eventTypeLabel(event.eventType)}
              </span>
            </div>
          </div>

          <div className="p-6 flex-1">
            <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
              {event.dateAnnounced && (
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{formatDate(event.dateAnnounced)}</span>
              )}
              {event.country && (
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{event.country}</span>
              )}
              {event.industry && (
                <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" />{event.industry}</span>
              )}
            </div>

            <h2 className="text-xl font-bold mb-2 group-hover:text-blue-500 transition-colors">
              {event.companyName}: {event.jobsCutAnnounced?.toLocaleString() || event.weightedAiJobs.toLocaleString()} jobs {event.eventType === 'AI_JOB_CREATED' ? 'created' : 'cut'}
            </h2>

            {event.publicSummary && (
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">{event.publicSummary}</p>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs tabular-nums">
                <span className="text-green-600 dark:text-green-400">Conservative: {event.conservativeAiJobs.toLocaleString()}</span>
                <span className="font-bold text-amber-600 dark:text-amber-400">Core: {event.weightedAiJobs.toLocaleString()}</span>
                <span className="text-red-600 dark:text-red-400">Upper: {event.upperAiJobs.toLocaleString()}</span>
              </div>
              {article && (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  {article.source?.name || article.source?.domain || 'Source'} <ExternalLink className="h-3 w-3" />
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StoryCard({ event, onPreview }: { event: EventData; onPreview: () => void }) {
  const article = event.articleEvents.find(ae => ae.isPrimary)?.article || event.articleEvents[0]?.article
  const logoUrl = article ? getOgImageUrl(article.url) : ''

  return (
    <div
      onClick={onPreview}
      className="block group cursor-pointer"
    >
      <div className="border rounded-lg overflow-hidden bg-card hover:shadow-lg transition-shadow h-full flex flex-col">
        <div className="h-36 bg-muted flex items-center justify-center relative overflow-hidden">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={event.companyName || ''}
              className="w-16 h-16 object-contain opacity-50 group-hover:opacity-70 transition-opacity"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
          ) : (
            <Building2 className="h-12 w-12 text-muted-foreground/20" />
          )}
          <div className="absolute top-2 left-2 flex gap-1">
            <span className={`px-1.5 py-0.5 text-[9px] font-bold uppercase rounded ${categoryStyle(event.attributionCategory)}`}>
              {event.attributionCategory}
            </span>
          </div>
          <div className="absolute top-2 right-2">
            <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase rounded bg-black/60 text-white">
              {eventTypeLabel(event.eventType)}
            </span>
          </div>
        </div>

        <div className="p-4 flex-1 flex flex-col">
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground mb-2">
            {event.dateAnnounced && <span>{formatDate(event.dateAnnounced)}</span>}
            {event.country && <><span className="text-muted-foreground/40">|</span><span>{event.country}</span></>}
            {event.industry && <><span className="text-muted-foreground/40">|</span><span>{event.industry}</span></>}
          </div>

          <h3 className="font-bold text-sm mb-2 group-hover:text-blue-500 transition-colors leading-snug">
            {event.companyName}: {event.jobsCutAnnounced?.toLocaleString() || event.weightedAiJobs.toLocaleString()} jobs {event.eventType === 'AI_JOB_CREATED' ? 'created' : 'cut'}
          </h3>

          {event.publicSummary && (
            <p className="text-muted-foreground text-xs leading-relaxed line-clamp-3 mb-3 flex-1">{event.publicSummary}</p>
          )}

          <div className="flex items-center justify-between mt-auto pt-3 border-t">
            <span className="text-xs font-bold tabular-nums text-amber-600 dark:text-amber-400">
              {event.weightedAiJobs.toLocaleString()} weighted
            </span>
            {article && (
              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                {article.source?.domain || 'Source'} <ExternalLink className="h-3 w-3" />
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
