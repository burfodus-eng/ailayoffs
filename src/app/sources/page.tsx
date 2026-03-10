import { Metadata } from 'next'
import { headers } from 'next/headers'
import { getBrandFromHost } from '@/lib/domains'
import { prisma } from '@/lib/db'
import { SourcesList } from './sources-list'

export const metadata: Metadata = {
  title: 'Sources',
  description: 'The data sources we monitor to track AI and automation-related job displacement — news outlets, government data, research institutions, and industry trackers.',
}

export default async function SourcesPage() {
  const headersList = await headers()
  const host = headersList.get('host') || 'ailayoffs.com.au'
  const brand = getBrandFromHost(host)

  // Determine which categories to show based on brand
  const categoryFilter: string[] =
    brand.focusType === 'robot'
      ? ['robot_automation', 'both']
      : ['ai_layoffs', 'both']

  const sources = await prisma.dataSource.findMany({
    where: {
      active: true,
      category: { in: categoryFilter },
    },
    orderBy: [
      { tier: 'asc' },
      { name: 'asc' },
    ],
    select: {
      id: true,
      name: true,
      url: true,
      type: true,
      category: true,
      region: true,
      country: true,
      description: true,
      tier: true,
      paywalled: true,
      hasRss: true,
      hasApi: true,
      eventsFound: true,
    },
  })

  // Extract unique filter values
  const types = [...new Set(sources.map(s => s.type).filter(Boolean))] as string[]
  const regions = [...new Set(sources.map(s => s.region).filter(Boolean))] as string[]
  const tiers = [...new Set(sources.map(s => s.tier))].sort()

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-[var(--dark-text)] mb-2">
        {brand.focusType === 'robot' ? 'Automation & Robotics Sources' : 'AI Layoff Sources'}
      </h1>
      <p className="text-gray-600 dark:text-[var(--dark-muted)] mb-8">
        {brand.focusType === 'robot'
          ? 'The news outlets, trackers, government agencies, and research institutions we monitor for robot and automation-related workforce displacement.'
          : 'The news outlets, trackers, government agencies, and research institutions we monitor for AI-related workforce displacement.'}
      </p>
      <SourcesList
        sources={sources}
        types={types}
        regions={regions}
        tiers={tiers}
        brandKey={brand.key}
      />
    </div>
  )
}
