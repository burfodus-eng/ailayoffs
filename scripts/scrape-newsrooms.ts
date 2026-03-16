import { scrapeCompanyNewsrooms } from '@/lib/ingestion/press-scraper'

async function main() {
  const args = process.argv.slice(2)

  let companyFilter: string | undefined
  const companyIdx = args.indexOf('--company')
  if (companyIdx !== -1 && args[companyIdx + 1]) {
    companyFilter = args[companyIdx + 1]
  }

  console.log('=== Company Newsroom Scraper ===')
  if (companyFilter) {
    console.log(`Filtering for: ${companyFilter}`)
  }
  console.log('')

  const releases = await scrapeCompanyNewsrooms({ companyFilter })

  if (releases.length === 0) {
    console.log('\nNo layoff-related press releases found.')
    return
  }

  console.log(`\n=== Found ${releases.length} press release(s) ===\n`)

  for (const release of releases) {
    console.log(`[${release.company}] ${release.title}`)
    console.log(`  URL:  ${release.url}`)
    console.log(`  Date: ${release.publishedDate || 'unknown'}`)
    console.log('')
  }
}

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
