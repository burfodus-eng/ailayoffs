import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { fixEventImages } from '@/lib/images/fix-images'

export const maxDuration = 300 // 5 min — image verification takes time

/**
 * Fix bad event cover images using smart search + Claude Vision verification.
 * Called periodically by n8n or manually.
 *
 *   GET /api/cron/fix-images?secret=YOUR_ADMIN_SECRET
 *
 * Only updates Event.coverImageUrl — does NOT touch any other fields,
 * social post queue, or Facebook integration.
 */
export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')
  const expectedSecret = process.env.ADMIN_SECRET

  if (!expectedSecret || expectedSecret === 'change-me-in-production') {
    return NextResponse.json({ error: 'ADMIN_SECRET not configured' }, { status: 503 })
  }

  if (secret !== expectedSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  console.log('[CRON] Fixing event images...')

  // Ensure tables exist (idempotent)
  try {
    await prisma.$queryRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "ImageClassification" (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        "eventId" TEXT NOT NULL REFERENCES "Event"(id),
        "previousImageUrl" TEXT,
        "previousVerdict" TEXT,
        "previousReason" TEXT,
        "previousDescription" TEXT,
        "newImageUrl" TEXT,
        "newSource" TEXT,
        "newDescription" TEXT,
        "searchQueries" TEXT[] DEFAULT '{}',
        "candidatesTested" INTEGER DEFAULT 0,
        action TEXT NOT NULL,
        "classifiedAt" TIMESTAMP(3) DEFAULT NOW()
      )
    `)
    await prisma.$queryRawUnsafe(`CREATE INDEX IF NOT EXISTS "ImageClassification_eventId_idx" ON "ImageClassification"("eventId")`)
    await prisma.$queryRawUnsafe(`CREATE INDEX IF NOT EXISTS "ImageClassification_classifiedAt_idx" ON "ImageClassification"("classifiedAt")`)
    await prisma.$queryRawUnsafe(`CREATE INDEX IF NOT EXISTS "ImageClassification_action_idx" ON "ImageClassification"(action)`)

    await prisma.$queryRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "ImageCatalogue" (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        url TEXT UNIQUE NOT NULL,
        description TEXT,
        industry TEXT,
        "eventType" TEXT,
        "imageType" TEXT DEFAULT 'photo',
        tags TEXT[] DEFAULT '{}',
        source TEXT,
        "sourceId" TEXT,
        width INTEGER,
        height INTEGER,
        "isVerified" BOOLEAN DEFAULT false,
        "verifiedAt" TIMESTAMP(3),
        "usageCount" INTEGER DEFAULT 0,
        "lastUsedAt" TIMESTAMP(3),
        "createdAt" TIMESTAMP(3) DEFAULT NOW(),
        "updatedAt" TIMESTAMP(3) DEFAULT NOW()
      )
    `)
    await prisma.$queryRawUnsafe(`CREATE INDEX IF NOT EXISTS "ImageCatalogue_industry_idx" ON "ImageCatalogue"(industry)`)
    await prisma.$queryRawUnsafe(`CREATE INDEX IF NOT EXISTS "ImageCatalogue_eventType_idx" ON "ImageCatalogue"("eventType")`)
    await prisma.$queryRawUnsafe(`CREATE INDEX IF NOT EXISTS "ImageCatalogue_isVerified_idx" ON "ImageCatalogue"("isVerified")`)
    await prisma.$queryRawUnsafe(`CREATE INDEX IF NOT EXISTS "ImageCatalogue_industry_verified_idx" ON "ImageCatalogue"(industry, "isVerified")`)
  } catch (e: any) {
    console.log(`[CRON] Table setup: ${e.message?.substring(0, 100)}`)
  }

  const result = await fixEventImages(prisma)

  console.log(`[CRON] Images: ${result.fixed} fixed, ${result.kept} already ok, ${result.failed} failed`)

  return NextResponse.json({ success: true, ...result })
}
