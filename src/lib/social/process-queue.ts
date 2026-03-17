/**
 * Process the social post queue — posts any items whose scheduledFor has passed.
 * Uses Facebook /photos endpoint for posts with images (direct image upload).
 *
 * Picks 1 post per brand per run to prevent broken brands from blocking the queue.
 * Skips brands with recent permission errors (permanent failures).
 */

import { PrismaClient } from '@/generated/prisma'

const MAX_ATTEMPTS = 5
const PERMISSION_MAX_ATTEMPTS = 1 // permission errors are permanent, fail fast

interface PostResult {
  processed: number
  posted: number
  failed: number
  skipped: number
  details: { brand: string; status: string; error?: string }[]
}

/**
 * Post to Facebook Graph API.
 * Uses /photos endpoint when an image URL is available (shows image directly in feed).
 * Falls back to /feed with link parameter for posts without images.
 */
async function postToFacebook(
  brand: string,
  content: string,
  imageUrl?: string | null,
): Promise<{ postId: string }> {
  const key = brand.toUpperCase()
  const pageToken = process.env[`FB_${key}_PAGE_TOKEN`]
  const pageId = process.env[`FB_${key}_PAGE_ID`]

  if (!pageToken || !pageId) {
    throw new Error(`Missing FB_${key}_PAGE_TOKEN or FB_${key}_PAGE_ID`)
  }

  // Extract link from post content
  const linkMatch = content.match(/Read more: (https:\/\/\S+)/)
  const link = linkMatch?.[1]

  // Remove the "Read more:" line from the message
  let message = link
    ? content.replace(/\nRead more: https:\/\/\S+\n?/, '\n').trim()
    : content.trim()

  // Add link back as a clickable line for /photos posts
  if (link) {
    message += `\n\n🔗 Read more: ${link}`
  }

  if (imageUrl) {
    // Post as photo with image — shows image directly in feed
    const res = await fetch(`https://graph.facebook.com/v21.0/${pageId}/photos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: imageUrl,
        message,
        access_token: pageToken,
      }),
    })

    if (!res.ok) {
      const err = await res.json()
      throw new Error(`Facebook API: ${JSON.stringify(err.error?.message || err)}`)
    }

    const data = await res.json() as { id: string }
    return { postId: data.id }
  }

  // Fallback: post to /feed with link
  const body: Record<string, string> = {
    message,
    access_token: pageToken,
  }
  if (link) body.link = link

  const res = await fetch(`https://graph.facebook.com/v21.0/${pageId}/feed`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(`Facebook API: ${JSON.stringify(err.error?.message || err)}`)
  }

  const data = await res.json() as { id: string }
  return { postId: data.id }
}

/**
 * Post to a platform. Returns the platform post ID.
 */
async function postToPlatform(
  platform: string,
  brand: string,
  content: string,
  imageUrl?: string | null,
): Promise<{ postId: string }> {
  switch (platform) {
    case 'facebook':
      return postToFacebook(brand, content, imageUrl)
    default:
      throw new Error(`Unknown platform: ${platform}`)
  }
}

/**
 * Process all due posts in the queue.
 * Picks 1 post per brand to prevent broken brands from starving working ones.
 */
export async function processPostQueue(prisma: PrismaClient): Promise<PostResult> {
  const result: PostResult = { processed: 0, posted: 0, failed: 0, skipped: 0, details: [] }

  // Get distinct brands with pending posts
  const brands = await prisma.$queryRawUnsafe<{ brand: string }[]>(
    `SELECT DISTINCT brand FROM "SocialPostQueue"
     WHERE status = 'pending' AND "scheduledFor" <= NOW() AND attempts < $1
     ORDER BY brand`,
    MAX_ATTEMPTS
  )

  if (brands.length === 0) {
    console.log('[POST QUEUE] No due posts')
    return result
  }

  console.log(`[POST QUEUE] Brands with due posts: ${brands.map(b => b.brand).join(', ')}`)

  // Check each brand for recent permission errors — skip brands that are permanently broken
  for (const { brand } of brands) {
    // Skip brand if it has recent permission errors (last 3 posts all permission errors)
    const recentFails = await prisma.$queryRawUnsafe<{ cnt: number }[]>(
      `SELECT count(*)::int as cnt FROM "SocialPostQueue"
       WHERE brand = $1 AND status = 'failed'
       AND "errorMessage" LIKE '%Permissions error%'
       AND "postedAt" IS NULL`,
      brand
    )
    if (recentFails[0]?.cnt >= 3) {
      console.log(`[SKIP] ${brand} — has permission errors, token needs fixing`)
      result.details.push({ brand, status: 'skipped', error: 'permission_errors' })
      result.skipped++
      continue
    }

    // Pick 1 post for this brand
    const [post] = await prisma.$queryRawUnsafe<any[]>(
      `SELECT id, "eventId", platform, brand, "postContent", attempts, "errorMessage"
       FROM "SocialPostQueue"
       WHERE status = 'pending' AND brand = $1 AND "scheduledFor" <= NOW() AND attempts < $2
       ORDER BY "scheduledFor" ASC
       LIMIT 1`,
      brand, MAX_ATTEMPTS
    )

    if (!post) continue
    result.processed++

    // If this post previously had a permission error, mark as failed immediately
    if (post.errorMessage?.includes('Permissions error')) {
      await prisma.$queryRawUnsafe(
        `UPDATE "SocialPostQueue" SET status = 'failed', attempts = $1 WHERE id = $2`,
        PERMISSION_MAX_ATTEMPTS, post.id
      )
      result.details.push({ brand, status: 'failed', error: 'permission_error_retry' })
      result.failed++
      continue
    }

    if (!post.postContent) {
      await prisma.$queryRawUnsafe('UPDATE "SocialPostQueue" SET status = \'skipped\', "errorMessage" = \'No post content\' WHERE id = $1', post.id)
      result.details.push({ brand, status: 'skipped', error: 'no_content' })
      result.skipped++
      continue
    }

    try {
      // Look up event image
      let imageUrl: string | null = null
      try {
        const [event] = await prisma.$queryRawUnsafe<any[]>('SELECT "coverImageUrl" FROM "Event" WHERE id = $1', post.eventId)
        imageUrl = event?.coverImageUrl || null
      } catch { /* ignore */ }

      const { postId } = await postToPlatform(post.platform, post.brand, post.postContent, imageUrl)

      await prisma.$queryRawUnsafe(
        'UPDATE "SocialPostQueue" SET status = \'posted\', "platformPostId" = $1, "postedAt" = NOW(), attempts = $2 WHERE id = $3',
        postId, post.attempts + 1, post.id
      )

      console.log(`[POSTED] ${post.platform}/${post.brand} — ${postId}`)
      result.details.push({ brand, status: 'posted' })
      result.posted++

      // Rate limit: 3s between brands
      await new Promise(r => setTimeout(r, 3000))
    } catch (e: any) {
      const isPermissionError = e.message?.includes('Permissions error')
      const isRateLimit = e.message?.includes('limit how often')
      const newAttempts = post.attempts + 1
      const maxForThis = isPermissionError ? PERMISSION_MAX_ATTEMPTS : MAX_ATTEMPTS
      const isFinal = newAttempts >= maxForThis

      await prisma.$queryRawUnsafe(
        'UPDATE "SocialPostQueue" SET status = $1, "errorMessage" = $2, attempts = $3 WHERE id = $4',
        isFinal ? 'failed' : 'pending', e.message?.substring(0, 500), newAttempts, post.id
      )

      const errorType = isPermissionError ? 'permission' : isRateLimit ? 'rate_limit' : 'unknown'
      console.error(`[FAIL] ${post.platform}/${post.brand}: ${errorType} — ${e.message?.substring(0, 100)}${isFinal ? ' (giving up)' : ` (attempt ${newAttempts}/${maxForThis})`}`)
      result.details.push({ brand, status: 'failed', error: errorType })
      result.failed++
    }
  }

  return result
}
