/**
 * Next.js instrumentation — runs once on server startup.
 * - Ingestion: every 6 hours (find new articles)
 * - Post queue: every 15 minutes (process staggered social posts)
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const SIX_HOURS = 6 * 60 * 60 * 1000
    const FIFTEEN_MIN = 15 * 60 * 1000

    // Ingestion: wait 30s after startup, then every 6 hours
    setTimeout(() => {
      triggerIngestion()
      setInterval(triggerIngestion, SIX_HOURS)
    }, 30_000)

    // Post queue: wait 60s after startup, then every 15 minutes
    setTimeout(() => {
      triggerPostQueue()
      setInterval(triggerPostQueue, FIFTEEN_MIN)
    }, 60_000)

    console.log('[CRON] Schedulers registered — ingestion (6h), post queue (15m)')
  }
}

function getBaseConfig() {
  const secret = process.env.ADMIN_SECRET
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  if (!secret || secret === 'change-me-in-production') return null
  return { secret, baseUrl }
}

async function triggerIngestion() {
  const config = getBaseConfig()
  if (!config) { console.log('[CRON] Skipping ingestion — ADMIN_SECRET not configured'); return }

  try {
    console.log('[CRON] Triggering ingestion...')
    const res = await fetch(`${config.baseUrl}/api/cron/ingest?secret=${encodeURIComponent(config.secret)}`)
    const data = await res.json()
    console.log('[CRON] Ingestion result:', JSON.stringify(data))
  } catch (e: any) {
    console.error('[CRON] Ingestion failed:', e.message)
  }
}

async function triggerPostQueue() {
  const config = getBaseConfig()
  if (!config) return

  try {
    const res = await fetch(`${config.baseUrl}/api/cron/post?secret=${encodeURIComponent(config.secret)}`)
    const data = await res.json()
    if (data.processed > 0) {
      console.log('[CRON] Post queue result:', JSON.stringify(data))
    }
  } catch (e: any) {
    console.error('[CRON] Post queue failed:', e.message)
  }
}
