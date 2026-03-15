/**
 * Process the social post queue — posts any items whose scheduledFor has passed.
 */

import { PrismaClient } from '@/generated/prisma'

const MAX_ATTEMPTS = 3

interface PostResult {
  processed: number
  posted: number
  failed: number
  skipped: number
}

/**
 * Post to Facebook Graph API.
 */
async function postToFacebook(
  brand: string,
  content: string,
): Promise<{ postId: string }> {
  const key = brand.toUpperCase()
  const pageToken = process.env[`FB_${key}_PAGE_TOKEN`]
  const pageId = process.env[`FB_${key}_PAGE_ID`]

  if (!pageToken || !pageId) {
    throw new Error(`Missing FB_${key}_PAGE_TOKEN or FB_${key}_PAGE_ID`)
  }

  // Extract link from post content (e.g. "Read more: https://...")
  const linkMatch = content.match(/Read more: (https:\/\/\S+)/)
  const link = linkMatch?.[1]

  // Remove the "Read more:" line from the message since Facebook will show the link preview
  const message = link
    ? content.replace(/\nRead more: https:\/\/\S+\n?/, '\n')
    : content

  const body: Record<string, string> = {
    message: message.trim(),
    access_token: pageToken,
  }
  if (link) {
    body.link = link
  }

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
): Promise<{ postId: string }> {
  switch (platform) {
    case 'facebook':
      return postToFacebook(brand, content)
    // Future platforms:
    // case 'threads': return postToThreads(brand, content)
    // case 'x': return postToX(brand, content)
    // case 'reddit': return postToReddit(brand, content)
    default:
      throw new Error(`Unknown platform: ${platform}`)
  }
}

/**
 * Process all due posts in the queue.
 */
export async function processPostQueue(prisma: PrismaClient): Promise<PostResult> {
  const result: PostResult = { processed: 0, posted: 0, failed: 0, skipped: 0 }

  // Find all pending posts whose scheduled time has passed
  const duePosts = await prisma.socialPostQueue.findMany({
    where: {
      status: 'pending',
      scheduledFor: { lte: new Date() },
      attempts: { lt: MAX_ATTEMPTS },
    },
    orderBy: { scheduledFor: 'asc' },
  })

  if (duePosts.length === 0) return result

  console.log(`[POST QUEUE] ${duePosts.length} posts due`)

  for (const post of duePosts) {
    result.processed++

    if (!post.postContent) {
      await prisma.socialPostQueue.update({
        where: { id: post.id },
        data: { status: 'skipped', errorMessage: 'No post content' },
      })
      result.skipped++
      continue
    }

    try {
      const { postId } = await postToPlatform(post.platform, post.brand, post.postContent)

      await prisma.socialPostQueue.update({
        where: { id: post.id },
        data: {
          status: 'posted',
          platformPostId: postId,
          postedAt: new Date(),
          attempts: post.attempts + 1,
        },
      })

      console.log(`[POSTED] ${post.platform}/${post.brand} — ${postId}`)
      result.posted++

      // Rate limit: 2s between posts to the same platform
      await new Promise(r => setTimeout(r, 2000))
    } catch (e: any) {
      const newAttempts = post.attempts + 1
      const isFinal = newAttempts >= MAX_ATTEMPTS

      await prisma.socialPostQueue.update({
        where: { id: post.id },
        data: {
          status: isFinal ? 'failed' : 'pending',
          errorMessage: e.message,
          attempts: newAttempts,
        },
      })

      console.error(`[FAIL] ${post.platform}/${post.brand}: ${e.message}${isFinal ? ' (giving up)' : ` (attempt ${newAttempts}/${MAX_ATTEMPTS})`}`)
      result.failed++
    }
  }

  return result
}
