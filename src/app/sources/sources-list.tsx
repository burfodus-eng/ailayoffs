'use client'

import { useState } from 'react'

interface SourceItem {
  id: string
  name: string
  url: string
  type: string | null
  category: string
  region: string | null
  country: string | null
  description: string | null
  tier: number
  paywalled: boolean
  hasRss: boolean
  hasApi: boolean
  eventsFound: number
}

interface SourcesListProps {
  sources: SourceItem[]
  types: string[]
  regions: string[]
  tiers: number[]
  brandKey: string
}

const TYPE_COLORS: Record<string, string> = {
  tracker: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  news: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  government: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  research: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  industry: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  union: 'bg-red-500/20 text-red-300 border-red-500/30',
  forum: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  api: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
  filings: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
}

const TYPE_COLORS_LIGHT: Record<string, string> = {
  tracker: 'bg-blue-100 text-blue-800 border-blue-200',
  news: 'bg-amber-100 text-amber-800 border-amber-200',
  government: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  research: 'bg-purple-100 text-purple-800 border-purple-200',
  industry: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  union: 'bg-red-100 text-red-800 border-red-200',
  forum: 'bg-orange-100 text-orange-800 border-orange-200',
  api: 'bg-teal-100 text-teal-800 border-teal-200',
  filings: 'bg-indigo-100 text-indigo-800 border-indigo-200',
}

const TIER_LABELS: Record<number, string> = {
  1: 'Primary',
  2: 'Strong',
  3: 'Moderate',
  4: 'Research',
  5: 'Niche',
}

const TIER_DOTS: Record<number, string> = {
  1: 'bg-green-400',
  2: 'bg-blue-400',
  3: 'bg-yellow-400',
  4: 'bg-purple-400',
  5: 'bg-gray-400',
}

const DEFAULT_LIMIT = 50

export function SourcesList({ sources, types, regions, tiers, brandKey }: SourcesListProps) {
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [regionFilter, setRegionFilter] = useState<string>('all')
  const [tierFilter, setTierFilter] = useState<string>('all')
  const [showAll, setShowAll] = useState(false)

  const filtered = sources.filter(s => {
    if (typeFilter !== 'all' && s.type !== typeFilter) return false
    if (regionFilter !== 'all' && s.region !== regionFilter) return false
    if (tierFilter !== 'all' && s.tier !== Number(tierFilter)) return false
    return true
  })

  const hasFilters = typeFilter !== 'all' || regionFilter !== 'all' || tierFilter !== 'all'
  const displayed = hasFilters || showAll ? filtered : filtered.slice(0, DEFAULT_LIMIT)
  const hiddenCount = filtered.length - displayed.length

  return (
    <>
      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          className="rounded-md border border-gray-300 dark:border-[var(--dark-border)] bg-white dark:bg-[var(--dark-surface)] text-gray-900 dark:text-[var(--dark-text)] px-3 py-1.5 text-sm"
        >
          <option value="all">All types</option>
          {types.sort().map(t => (
            <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
          ))}
        </select>

        <select
          value={regionFilter}
          onChange={e => setRegionFilter(e.target.value)}
          className="rounded-md border border-gray-300 dark:border-[var(--dark-border)] bg-white dark:bg-[var(--dark-surface)] text-gray-900 dark:text-[var(--dark-text)] px-3 py-1.5 text-sm"
        >
          <option value="all">All regions</option>
          {regions.sort().map(r => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>

        <select
          value={tierFilter}
          onChange={e => setTierFilter(e.target.value)}
          className="rounded-md border border-gray-300 dark:border-[var(--dark-border)] bg-white dark:bg-[var(--dark-surface)] text-gray-900 dark:text-[var(--dark-text)] px-3 py-1.5 text-sm"
        >
          <option value="all">All tiers</option>
          {tiers.map(t => (
            <option key={t} value={String(t)}>Tier {t} — {TIER_LABELS[t] || `Tier ${t}`}</option>
          ))}
        </select>

        {(hasFilters) && (
          <button
            onClick={() => { setTypeFilter('all'); setRegionFilter('all'); setTierFilter('all') }}
            className="text-sm text-gray-500 dark:text-[var(--dark-muted)] hover:text-gray-700 dark:hover:text-[var(--dark-text)] underline"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Count */}
      <p className="text-sm text-gray-500 dark:text-[var(--dark-muted)] mb-4">
        Showing {displayed.length} of {filtered.length} sources
      </p>

      {/* Source cards */}
      <div className="grid gap-3">
        {displayed.map(source => (
          <div
            key={source.id}
            className="border border-gray-200 dark:border-[var(--dark-border)] rounded-lg p-4 bg-white dark:bg-[var(--dark-surface)] hover:border-gray-300 dark:hover:border-[var(--dark-accent)] transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-gray-900 dark:text-[var(--dark-text)] hover:text-[var(--dark-accent)] hover:underline truncate"
                  >
                    {source.name}
                  </a>
                  {source.type && (
                    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded border ${TYPE_COLORS_LIGHT[source.type] || 'bg-gray-100 text-gray-700 border-gray-200'} dark:${TYPE_COLORS[source.type] || 'bg-gray-500/20 text-gray-300 border-gray-500/30'}`}>
                      {source.type}
                    </span>
                  )}
                  {source.paywalled && (
                    <span className="inline-flex items-center px-1.5 py-0.5 text-xs text-gray-500 dark:text-[var(--dark-muted)]" title="Paywalled">
                      $
                    </span>
                  )}
                </div>
                {source.description && (
                  <p className="text-sm text-gray-600 dark:text-[var(--dark-muted)] line-clamp-2">
                    {source.description}
                  </p>
                )}
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-[var(--dark-muted)]">
                  {source.region && <span>{source.region}{source.country ? ` (${source.country})` : ''}</span>}
                  <span className="flex items-center gap-1">
                    <span className={`inline-block w-2 h-2 rounded-full ${TIER_DOTS[source.tier] || 'bg-gray-400'}`} />
                    {TIER_LABELS[source.tier] || `Tier ${source.tier}`}
                  </span>
                  {source.hasRss && <span title="RSS feed available">RSS</span>}
                  {source.hasApi && <span title="API available">API</span>}
                  {source.eventsFound > 0 && <span>{source.eventsFound} events tracked</span>}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Show all toggle */}
      {hiddenCount > 0 && (
        <button
          onClick={() => setShowAll(true)}
          className="mt-6 w-full py-2.5 text-sm font-medium text-gray-600 dark:text-[var(--dark-muted)] border border-gray-300 dark:border-[var(--dark-border)] rounded-lg hover:bg-gray-50 dark:hover:bg-[var(--dark-card)] transition-colors"
        >
          Show all {filtered.length} sources ({hiddenCount} more)
        </button>
      )}

      {showAll && !hasFilters && filtered.length > DEFAULT_LIMIT && (
        <button
          onClick={() => setShowAll(false)}
          className="mt-4 w-full py-2 text-sm text-gray-500 dark:text-[var(--dark-muted)] hover:underline"
        >
          Show top {DEFAULT_LIMIT} only
        </button>
      )}

      {displayed.length === 0 && (
        <p className="text-center text-gray-500 dark:text-[var(--dark-muted)] py-12">
          No sources match the selected filters.
        </p>
      )}
    </>
  )
}
