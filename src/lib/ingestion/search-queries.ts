// Search queries organized by category, rotated across runs
export const searchQueries = {
  // Direct layoff announcements
  explicit: [
    'AI layoffs 2026',
    'AI layoffs 2025',
    'AI job cuts announcement',
    'laid off replaced by AI',
    'jobs lost to artificial intelligence',
    'company cuts jobs AI automation',
    'AI replacing workers layoffs',
    'generative AI job losses',
    'mass layoffs AI automation 2026',
    'tech layoffs this week',
  ],
  // Company-specific (most likely to have AI layoffs)
  companies: [
    'Meta layoffs job cuts',
    'Google Alphabet layoffs restructuring',
    'Microsoft layoffs job cuts',
    'Amazon layoffs workforce reduction',
    'Apple layoffs job cuts',
    'Oracle layoffs restructuring',
    'Salesforce layoffs job cuts',
    'IBM layoffs workforce',
    'Intel layoffs restructuring',
    'SAP layoffs job cuts',
    'Cisco layoffs restructuring',
    'Dell layoffs job cuts',
    'Accenture Deloitte PwC KPMG layoffs',
  ],
  // Euphemistic language companies actually use
  euphemistic: [
    'workforce optimization AI restructuring',
    'operational efficiency job cuts technology',
    'organizational restructuring AI transformation',
    'headcount reduction digital transformation',
    'cost reduction AI automation workforce',
    'efficiency restructuring eliminate positions',
    'streamlining operations reducing workforce',
  ],
  // Sector-specific
  sectors: [
    'banking finance layoffs AI automation',
    'consulting firm layoffs AI',
    'telecom layoffs workforce reduction',
    'manufacturing automation job cuts',
    'media entertainment layoffs AI',
    'retail e-commerce layoffs automation',
    'government public sector AI job cuts',
  ],
  // Robot/automation specific
  robot: [
    'warehouse automation job cuts robots',
    'RPA robotic process automation layoffs',
    'factory robots replacing workers',
    'autonomous vehicles job displacement',
    'humanoid robots workforce',
    'self-checkout jobs eliminated',
  ],
  // Job creation (for balance)
  creation: [
    'AI company hiring new jobs',
    'AI engineer hiring boom',
    'artificial intelligence new positions created',
    'machine learning team expansion hiring',
  ],
  // Productivity/impact
  productivity: [
    'AI productivity gains company report',
    'AI automation efficiency savings workforce',
    'generative AI ROI enterprise deployment',
  ],
}

// Google News RSS feeds for real-time monitoring
export const googleNewsFeeds = [
  'https://news.google.com/rss/search?q=AI+layoffs+when:3d&hl=en-US&gl=US&ceid=US:en',
  'https://news.google.com/rss/search?q=artificial+intelligence+job+cuts+when:3d&hl=en-US&gl=US&ceid=US:en',
  'https://news.google.com/rss/search?q=tech+layoffs+automation+when:3d&hl=en-US&gl=US&ceid=US:en',
  'https://news.google.com/rss/search?q=workforce+reduction+AI+when:3d&hl=en-US&gl=US&ceid=US:en',
]

// Get a subset of queries for a given run to avoid hitting rate limits
export function getQueriesForRun(runIndex: number): string[] {
  const allQueries = [
    ...searchQueries.explicit,
    ...searchQueries.companies,
    ...searchQueries.euphemistic,
    ...searchQueries.sectors,
    ...searchQueries.robot,
    ...searchQueries.creation,
    ...searchQueries.productivity,
  ]

  // Rotate through queries: each run picks a different subset of 10
  const batchSize = 10
  const start = (runIndex * batchSize) % allQueries.length
  const queries: string[] = []
  for (let i = 0; i < batchSize; i++) {
    queries.push(allQueries[(start + i) % allQueries.length])
  }
  return queries
}
