/**
 * One-time OAuth flow to obtain a long-lived Threads user access token.
 *
 * Usage:
 *   npx tsx scripts/threads-auth.ts                  # Step 1: prints authorization URL
 *   npx tsx scripts/threads-auth.ts --code CODE      # Step 2: exchanges code for long-lived token
 *
 * Env vars required:
 *   THREADS_APP_ID, THREADS_APP_SECRET
 *
 * Flow:
 *   1. Run without args → prints URL to visit in browser
 *   2. User authorizes → gets redirected with ?code=XXX
 *   3. Run with --code XXX → exchanges for short-lived then long-lived token
 *   4. Save the long-lived token as THREADS_USER_TOKEN in .env
 */

const THREADS_APP_ID = process.env.THREADS_APP_ID
const THREADS_APP_SECRET = process.env.THREADS_APP_SECRET
const REDIRECT_URI = 'https://ailayoffs.com.au/threads-callback'
const GRAPH_BASE = 'https://graph.threads.net'

async function exchangeCodeForToken(code: string): Promise<string> {
  console.log('Exchanging authorization code for short-lived token...')

  const params = new URLSearchParams({
    client_id: THREADS_APP_ID!,
    client_secret: THREADS_APP_SECRET!,
    grant_type: 'authorization_code',
    redirect_uri: REDIRECT_URI,
    code,
  })

  const res = await fetch(`${GRAPH_BASE}/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  })

  const data = await res.json()

  if (!res.ok || data.error) {
    throw new Error(`Token exchange failed: ${JSON.stringify(data)}`)
  }

  console.log(`Short-lived token obtained. User ID: ${data.user_id}`)
  console.log(`(Expires in ~1 hour)`)
  return data.access_token
}

async function exchangeForLongLived(shortToken: string): Promise<{ token: string; expiresIn: number }> {
  console.log('Exchanging for long-lived token...')

  const params = new URLSearchParams({
    grant_type: 'th_exchange_token',
    client_secret: THREADS_APP_SECRET!,
    access_token: shortToken,
  })

  const res = await fetch(`${GRAPH_BASE}/access_token?${params.toString()}`)
  const data = await res.json()

  if (!res.ok || data.error) {
    throw new Error(`Long-lived token exchange failed: ${JSON.stringify(data)}`)
  }

  console.log(`Long-lived token obtained! Expires in ${Math.round(data.expires_in / 86400)} days.`)
  return { token: data.access_token, expiresIn: data.expires_in }
}

async function getUserInfo(token: string) {
  const res = await fetch(`${GRAPH_BASE}/v1.0/me?fields=id,username,threads_profile_picture_url&access_token=${token}`)
  const data = await res.json()

  if (!res.ok || data.error) {
    console.warn('Could not fetch user info:', JSON.stringify(data))
    return null
  }

  return data
}

async function main() {
  if (!THREADS_APP_ID || !THREADS_APP_SECRET) {
    console.error('ERROR: THREADS_APP_ID and THREADS_APP_SECRET env vars are required')
    process.exit(1)
  }

  const args = process.argv.slice(2)
  const codeIdx = args.indexOf('--code')

  if (codeIdx === -1) {
    // Step 1: Print the authorization URL
    const authUrl = `https://threads.net/oauth/authorize?client_id=${THREADS_APP_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=threads_basic,threads_content_publish&response_type=code`

    console.log('=== Threads OAuth — Step 1 ===')
    console.log()
    console.log('Visit this URL in your browser to authorize:')
    console.log()
    console.log(authUrl)
    console.log()
    console.log('After authorizing, you will be redirected to:')
    console.log(`  ${REDIRECT_URI}?code=XXXXXX#_`)
    console.log()
    console.log('Copy the code value and run:')
    console.log('  npx tsx scripts/threads-auth.ts --code YOUR_CODE_HERE')
    return
  }

  // Step 2: Exchange the code
  const code = args[codeIdx + 1]
  if (!code) {
    console.error('ERROR: Please provide the code after --code')
    process.exit(1)
  }

  // Strip trailing #_ if the user copied it
  const cleanCode = code.replace(/#_$/, '')

  const shortToken = await exchangeCodeForToken(cleanCode)
  const { token: longToken, expiresIn } = await exchangeForLongLived(shortToken)

  // Try to get user info
  const userInfo = await getUserInfo(longToken)

  console.log()
  console.log('=== SUCCESS ===')
  console.log()

  if (userInfo) {
    console.log(`Threads User ID: ${userInfo.id}`)
    console.log(`Username: @${userInfo.username}`)
    console.log()
  }

  console.log('Add these to your .env:')
  console.log()
  console.log(`THREADS_USER_TOKEN=${longToken}`)
  if (userInfo) {
    console.log(`THREADS_USER_ID=${userInfo.id}`)
  }
  console.log()
  console.log(`Token expires in ${Math.round(expiresIn / 86400)} days. Re-run this script to refresh.`)
}

main().catch(console.error)
