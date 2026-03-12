/**
 * Next.js instrumentation — runs once on server startup.
 * Sets up a self-calling cron to trigger ingestion every 6 hours.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const SIX_HOURS = 6 * 60 * 60 * 1000

    // Wait 30s after startup before first run, then every 6 hours
    setTimeout(() => {
      triggerIngestion()
      setInterval(triggerIngestion, SIX_HOURS)
    }, 30_000)

    console.log('[CRON] Ingestion scheduler registered — every 6 hours')
  }
}

async function triggerIngestion() {
  const secret = process.env.ADMIN_SECRET
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  if (!secret || secret === 'change-me-in-production') {
    console.log('[CRON] Skipping — ADMIN_SECRET not configured')
    return
  }

  try {
    console.log('[CRON] Triggering ingestion...')
    const res = await fetch(`${baseUrl}/api/cron/ingest?secret=${encodeURIComponent(secret)}`)
    const data = await res.json()
    console.log('[CRON] Ingestion result:', JSON.stringify(data))
  } catch (e: any) {
    console.error('[CRON] Ingestion failed:', e.message)
  }
}
