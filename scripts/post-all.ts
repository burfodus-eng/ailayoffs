/**
 * Post to ALL platforms for one or more brands in a single run.
 *
 * Usage:
 *   npx tsx scripts/post-all.ts                              # dry-run, ailayoffs, all platforms
 *   npx tsx scripts/post-all.ts --post --brand all            # post everything everywhere
 *   npx tsx scripts/post-all.ts --post --brand aicuts --limit 3
 *   npx tsx scripts/post-all.ts --post --brand all --platform facebook,reddit
 *
 * This is a convenience wrapper — it shells out to the individual platform scripts.
 */

import { execSync } from 'child_process'

const args = process.argv.slice(2)

// Extract --platform flag if present
const platformIdx = args.indexOf('--platform')
let platforms: string[]
if (platformIdx !== -1) {
  platforms = args[platformIdx + 1].split(',')
  // Remove --platform and its value from args passed to subscripts
  args.splice(platformIdx, 2)
} else {
  platforms = ['facebook', 'threads', 'reddit', 'x']
}

const passthrough = args.join(' ')

for (const platform of platforms) {
  const script = `scripts/post-to-${platform}.ts`
  console.log(`\n${'━'.repeat(60)}`)
  console.log(`  Running: npx tsx ${script} ${passthrough}`)
  console.log(`${'━'.repeat(60)}`)

  try {
    execSync(`npx tsx ${script} ${passthrough}`, {
      stdio: 'inherit',
      cwd: process.cwd(),
      env: process.env,
    })
  } catch (err: any) {
    console.error(`\n  ✗ ${platform} script failed — continuing with next platform`)
  }
}

console.log('\n✓ Done.')
