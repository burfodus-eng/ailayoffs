'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Filter, X, Clock, Building2, MapPin, Briefcase, ArrowRight } from 'lucide-react'
import { getCompanyLogoUrl, getIndustryImageUrl } from '@/lib/company-images'

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

function getEventImage(event: EventData): { logo: string; bg: string } {
  const logo = getCompanyLogoUrl(event.companyName)
  const bg = getIndustryImageUrl(event.industry)
  return { logo, bg }
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
  const { logo, bg } = getEventImage(event)
  const article = event.articleEvents.find(ae => ae.isPrimary)?.article || event.articleEvents[0]?.article

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative bg-white dark:bg-[var(--dark-card)] border border-gray-200 dark:border-[var(--dark-border)] rounded-lg max-w-lg w-full max-h-[80vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-24 bg-gray-50 dark:bg-[var(--dark-surface)] flex items-center justify-center border-b border-gray-100 dark:border-[var(--dark-border)] rounded-t-lg relative overflow-hidden">
          {bg && <img src={bg} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" />}
          {logo ? (
            <img src={logo} alt={event.companyName || ''} className="w-14 h-14 object-contain relative z-10" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
          ) : (
            <Building2 className="h-10 w-10 text-gray-300 dark:text-gray-600 relative z-10" />
          )}
        </div>

        <div className="p-6">
          <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <X className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2 mb-3">
            <span className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded ${categoryStyle(event.attributionCategory)}`}>
              {event.attributionCategory}
            </span>
            <span className="px-2 py-0.5 text-[9px] font-bold uppercase rounded bg-gray-100 dark:bg-[var(--dark-surface)] text-gray-600 dark:text-[var(--dark-text)]">
              {eventTypeLabel(event.eventType)}
            </span>
          </div>

          <h2 className="text-lg font-bold text-gray-900 dark:text-[var(--dark-text)] mb-2">
            {event.companyName}: {event.jobsCutAnnounced?.toLocaleString() || event.weightedAiJobs.toLocaleString()} jobs {event.eventType === 'AI_JOB_CREATED' ? 'created' : 'cut'}
          </h2>

          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-[var(--dark-muted)] mb-3">
            {event.dateAnnounced && <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{formatDate(event.dateAnnounced)}</span>}
            {event.country && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{event.country}</span>}
            {event.industry && <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" />{event.industry}</span>}
          </div>

          {event.publicSummary && (
            <p className="text-sm text-gray-600 dark:text-[var(--dark-text)] leading-relaxed mb-4">{event.publicSummary}</p>
          )}

          <div className="flex items-center gap-3 text-xs tabular-nums mb-4 p-3 bg-gray-50 dark:bg-[var(--dark-surface)] rounded border border-gray-100 dark:border-[var(--dark-border)]">
            <span className="text-green-700 dark:text-green-400">Conservative: {event.conservativeAiJobs.toLocaleString()}</span>
            <span className="font-bold text-amber-700 dark:text-amber-400">Core: {event.weightedAiJobs.toLocaleString()}</span>
            <span className="text-red-600 dark:text-red-400">Upper: {event.upperAiJobs.toLocaleString()}</span>
          </div>

          {article && (
            <p className="text-xs text-gray-500 dark:text-[var(--dark-muted)] mb-4">
              Source: {article.source?.name || article.source?.domain || 'Unknown'}
            </p>
          )}

          <Link
            href={`/event/${event.id}`}
            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
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
        <p className="text-gray-500 text-lg">No events tracked yet.</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {popupEvent && <EventPopup event={popupEvent} onClose={() => setPopupEvent(null)} />}

      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-[var(--dark-text)]">News & Sources</h1>
          <p className="text-gray-500 dark:text-[var(--dark-muted)] text-sm mt-1">{filtered.length} events from public reporting</p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-3 py-2 text-sm border rounded-md transition-colors ${showFilters ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 dark:border-[var(--dark-border)] text-gray-600 dark:text-[var(--dark-text)] hover:bg-gray-50 dark:hover:bg-gray-700'}`}
        >
          <Filter className="h-4 w-4" />
          Filters {activeFilters > 0 && `(${activeFilters})`}
        </button>
      </div>

      {showFilters && (
        <div className="border border-gray-200 dark:border-[var(--dark-border)] rounded-lg p-4 mb-6 bg-white dark:bg-[var(--dark-card)]">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-200 dark:border-[var(--dark-border)] rounded-md bg-white dark:bg-[var(--dark-surface)] text-gray-900 dark:text-[var(--dark-text)] focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select value={countryFilter} onChange={(e) => setCountryFilter(e.target.value)} className="px-3 py-2 text-sm border border-gray-200 dark:border-[var(--dark-border)] rounded-md bg-white dark:bg-[var(--dark-surface)] text-gray-700 dark:text-[var(--dark-text)]">
              <option value="">All Countries</option>
              {countries.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={industryFilter} onChange={(e) => setIndustryFilter(e.target.value)} className="px-3 py-2 text-sm border border-gray-200 dark:border-[var(--dark-border)] rounded-md bg-white dark:bg-[var(--dark-surface)] text-gray-700 dark:text-[var(--dark-text)]">
              <option value="">All Industries</option>
              {industries.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="px-3 py-2 text-sm border border-gray-200 dark:border-[var(--dark-border)] rounded-md bg-white dark:bg-[var(--dark-surface)] text-gray-700 dark:text-[var(--dark-text)]">
              <option value="">All Attribution</option>
              <option value="EXPLICIT">Explicit</option>
              <option value="STRONG">Strong</option>
              <option value="MODERATE">Moderate</option>
              <option value="WEAK">Weak</option>
            </select>
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="px-3 py-2 text-sm border border-gray-200 dark:border-[var(--dark-border)] rounded-md bg-white dark:bg-[var(--dark-surface)] text-gray-700 dark:text-[var(--dark-text)]">
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
              className="mt-3 text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 flex items-center gap-1"
            >
              <X className="h-3 w-3" /> Clear all filters
            </button>
          )}
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-500">No events match your filters.</p>
        </div>
      )}

      {featured && <FeaturedCard event={featured} onPreview={() => setPopupEvent(featured)} />}

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
  const { logo, bg } = getEventImage(event)

  return (
    <div onClick={onPreview} className="block group cursor-pointer">
      <div className="border border-gray-200 dark:border-[var(--dark-border)] rounded-lg overflow-hidden bg-white dark:bg-[var(--dark-card)] hover:shadow-lg transition-shadow">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-72 h-48 md:h-auto bg-gray-50 dark:bg-[var(--dark-surface)] flex items-center justify-center shrink-0 relative overflow-hidden">
            {bg && <img src={bg} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" />}
            {logo ? (
              <img
                src={logo}
                alt={event.companyName || ''}
                className="w-20 h-20 object-contain opacity-60 group-hover:opacity-80 transition-opacity relative z-10"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
              />
            ) : (
              <Building2 className="h-16 w-16 text-gray-200 dark:text-gray-600 relative z-10" />
            )}
            <div className="absolute top-3 left-3">
              <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded ${categoryStyle(event.attributionCategory)}`}>
                {event.attributionCategory}
              </span>
            </div>
            <div className="absolute bottom-3 left-3">
              <span className="px-2 py-1 text-[10px] font-bold uppercase rounded bg-gray-800/70 text-white">
                {eventTypeLabel(event.eventType)}
              </span>
            </div>
          </div>

          <div className="p-6 flex-1">
            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-[var(--dark-muted)] mb-2">
              {event.dateAnnounced && <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{formatDate(event.dateAnnounced)}</span>}
              {event.country && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{event.country}</span>}
              {event.industry && <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" />{event.industry}</span>}
            </div>

            <h2 className="text-xl font-bold text-gray-900 dark:text-[var(--dark-text)] mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {event.companyName}: {event.jobsCutAnnounced?.toLocaleString() || event.weightedAiJobs.toLocaleString()} jobs {event.eventType === 'AI_JOB_CREATED' ? 'created' : 'cut'}
            </h2>

            {event.publicSummary && (
              <p className="text-gray-500 dark:text-[var(--dark-muted)] text-sm leading-relaxed mb-4">{event.publicSummary}</p>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs tabular-nums">
                <span className="text-green-700 dark:text-green-400">Conservative: {event.conservativeAiJobs.toLocaleString()}</span>
                <span className="font-bold text-amber-700 dark:text-amber-400">Core: {event.weightedAiJobs.toLocaleString()}</span>
                <span className="text-red-600 dark:text-red-400">Upper: {event.upperAiJobs.toLocaleString()}</span>
              </div>
              {article && (
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {article.source?.name || article.source?.domain || 'Source'}
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
  const { logo, bg } = getEventImage(event)

  return (
    <div onClick={onPreview} className="block group cursor-pointer">
      <div className="border border-gray-200 dark:border-[var(--dark-border)] rounded-lg overflow-hidden bg-white dark:bg-[var(--dark-card)] hover:shadow-lg transition-shadow h-full flex flex-col">
        <div className="h-32 bg-gray-50 dark:bg-[var(--dark-surface)] flex items-center justify-center relative overflow-hidden">
          {bg && <img src={bg} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" />}
          {logo ? (
            <img
              src={logo}
              alt={event.companyName || ''}
              className="w-14 h-14 object-contain opacity-50 group-hover:opacity-70 transition-opacity relative z-10"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
          ) : (
            <Building2 className="h-10 w-10 text-gray-200 dark:text-gray-600 relative z-10" />
          )}
          <div className="absolute top-2 left-2 flex gap-1">
            <span className={`px-1.5 py-0.5 text-[9px] font-bold uppercase rounded ${categoryStyle(event.attributionCategory)}`}>
              {event.attributionCategory}
            </span>
          </div>
          <div className="absolute top-2 right-2">
            <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase rounded bg-gray-800/70 text-white">
              {eventTypeLabel(event.eventType)}
            </span>
          </div>
        </div>

        <div className="p-4 flex-1 flex flex-col">
          <div className="flex items-center gap-2 text-[11px] text-gray-500 dark:text-[var(--dark-muted)] mb-2">
            {event.dateAnnounced && <span>{formatDate(event.dateAnnounced)}</span>}
            {event.country && <><span className="text-gray-300 dark:text-gray-600">|</span><span>{event.country}</span></>}
            {event.industry && <><span className="text-gray-300 dark:text-gray-600">|</span><span>{event.industry}</span></>}
          </div>

          <h3 className="font-bold text-sm text-gray-900 dark:text-[var(--dark-text)] mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
            {event.companyName}: {event.jobsCutAnnounced?.toLocaleString() || event.weightedAiJobs.toLocaleString()} jobs {event.eventType === 'AI_JOB_CREATED' ? 'created' : 'cut'}
          </h3>

          {event.publicSummary && (
            <p className="text-gray-500 dark:text-[var(--dark-muted)] text-xs leading-relaxed line-clamp-3 mb-3 flex-1">{event.publicSummary}</p>
          )}

          <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100 dark:border-[var(--dark-border)]">
            <span className="text-xs font-bold tabular-nums text-amber-700 dark:text-amber-400">
              {event.weightedAiJobs.toLocaleString()} weighted
            </span>
            {article && (
              <span className="text-[10px] text-gray-400 dark:text-gray-500">
                {article.source?.domain || 'Source'}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
