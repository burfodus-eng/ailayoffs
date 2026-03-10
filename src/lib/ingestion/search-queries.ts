// Search queries organized by category, rotated across runs
export const searchQueries = {
  explicit: [
    'AI layoffs 2025',
    'AI job cuts',
    'laid off replaced by AI',
    'jobs lost to artificial intelligence',
    'company cuts jobs AI automation',
    'AI replacing workers layoffs',
    'generative AI job losses',
    'ChatGPT replacing jobs layoffs',
  ],
  euphemistic: [
    'workforce optimization AI restructuring',
    'operational efficiency job cuts technology',
    'right-sizing automation',
    'organizational restructuring AI transformation',
    'headcount reduction digital transformation',
    'cost reduction AI automation workforce',
  ],
  robot: [
    'warehouse automation job cuts robots',
    'RPA robotic process automation layoffs',
    'factory robots replacing workers',
    'autonomous vehicles job displacement',
    'humanoid robots workforce',
    'self-checkout jobs eliminated',
  ],
  creation: [
    'AI company hiring new jobs',
    'AI engineer hiring boom',
    'artificial intelligence new positions created',
    'machine learning team expansion hiring',
  ],
  productivity: [
    'AI productivity gains company report',
    'AI automation efficiency savings workforce',
    'generative AI ROI enterprise deployment',
  ],
}

// Get a subset of queries for a given run to avoid hitting rate limits
export function getQueriesForRun(runIndex: number): string[] {
  const allQueries = [
    ...searchQueries.explicit,
    ...searchQueries.euphemistic,
    ...searchQueries.robot,
    ...searchQueries.creation,
    ...searchQueries.productivity,
  ]

  // Rotate through queries: each run picks a different subset of 8
  const batchSize = 8
  const start = (runIndex * batchSize) % allQueries.length
  const queries: string[] = []
  for (let i = 0; i < batchSize; i++) {
    queries.push(allQueries[(start + i) % allQueries.length])
  }
  return queries
}
