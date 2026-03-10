import { Metadata } from 'next'
import { prisma } from '@/lib/db'

export const metadata: Metadata = {
  title: 'AI Productivity & GDP Impact',
  description: 'Tracking AI-driven productivity gains and GDP impact claims from companies deploying automation, machine learning, and generative AI tools.',
}
export const dynamic = 'force-dynamic'

export default async function ProductivityPage() {
  const claims = await prisma.productivityClaim.findMany({
    where: { reviewStatus: { not: 'EXCLUDED' } },
    orderBy: { publishedAt: 'desc' },
    take: 50,
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-[var(--dark-text)] mb-2">AI Productivity & GDP Impact</h1>
      <p className="text-gray-600 dark:text-[var(--dark-muted)] mb-8">Cataloging reported productivity gains, cost reductions, and economic impact from AI adoption.</p>

      {claims.length > 0 ? (
        <div className="space-y-4">
          {claims.map((claim) => (
            <div key={claim.id} className="bg-white dark:bg-[var(--dark-card)] border border-gray-200 dark:border-[var(--dark-border)] rounded-lg p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  {claim.companyName && <span className="text-gray-900 dark:text-[var(--dark-text)] font-semibold">{claim.companyName}</span>}
                  {claim.industry && <span className="text-gray-500 text-sm ml-2">({claim.industry})</span>}
                  <p className="text-gray-600 dark:text-[var(--dark-muted)] text-sm mt-2">{claim.claim}</p>
                  {claim.estimatedImpact && (
                    <p className="text-gray-500 text-xs mt-2">Estimated impact: {claim.estimatedImpact}</p>
                  )}
                  {claim.sourceUrl && (
                    <a href={claim.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 text-xs mt-1 inline-block">Source</a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-500 dark:text-[var(--dark-muted)] text-lg">No productivity claims tracked yet.</p>
          <p className="text-gray-500 text-sm mt-2">Data will appear here as reports are discovered and classified.</p>
        </div>
      )}

      <div className="mt-8 text-center text-gray-500 text-xs">
        These are modeled estimates based on public claims, not hard facts.
        See our <a href="/methodology" className="text-gray-600 dark:text-[var(--dark-muted)] underline">methodology</a> for details.
      </div>
    </div>
  )
}
