import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { brands, type BrandKey } from '@/lib/domains'

const ADMIN_SECRET = process.env.ADMIN_SECRET || ''

function auth(req: NextRequest): boolean {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  return !!ADMIN_SECRET && token === ADMIN_SECRET
}

// GET /api/digest?brand=ailayoffs — list published digests for a brand
export async function GET(req: NextRequest) {
  const brand = req.nextUrl.searchParams.get('brand') || 'ailayoffs'
  const published = req.nextUrl.searchParams.get('published') !== 'false'

  const articles = await prisma.brandArticle.findMany({
    where: { brand, ...(published ? { published: true } : {}) },
    orderBy: { publishedAt: 'desc' },
    take: 50,
  })

  return NextResponse.json({ articles })
}

// POST /api/digest — create or update a brand article
// Body: { brand, slug, title, summary, body, coverImageUrl?, socialTitle?, socialSummary?,
//         socialImageUrl?, periodStart?, periodEnd?, articleType?, published?, authorName?,
//         metaTitle?, metaDescription? }
export async function POST(req: NextRequest) {
  if (!auth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const data = await req.json()
  const { brand, slug } = data

  if (!brand || !slug || !brands[brand as BrandKey]) {
    return NextResponse.json({ error: 'brand and slug required, brand must be valid' }, { status: 400 })
  }

  if (!data.title || !data.summary || !data.body) {
    return NextResponse.json({ error: 'title, summary, and body required' }, { status: 400 })
  }

  const article = await prisma.brandArticle.upsert({
    where: { brand_slug: { brand, slug } },
    update: {
      title: data.title,
      summary: data.summary,
      body: data.body,
      coverImageUrl: data.coverImageUrl || null,
      socialTitle: data.socialTitle || null,
      socialSummary: data.socialSummary || null,
      socialImageUrl: data.socialImageUrl || null,
      periodStart: data.periodStart ? new Date(data.periodStart) : null,
      periodEnd: data.periodEnd ? new Date(data.periodEnd) : null,
      articleType: data.articleType || 'digest',
      published: data.published ?? false,
      publishedAt: data.publishedAt ? new Date(data.publishedAt) : (data.published ? new Date() : null),
      authorName: data.authorName || 'Editorial',
      metaTitle: data.metaTitle || null,
      metaDescription: data.metaDescription || null,
    },
    create: {
      brand,
      slug,
      title: data.title,
      summary: data.summary,
      body: data.body,
      coverImageUrl: data.coverImageUrl || null,
      socialTitle: data.socialTitle || null,
      socialSummary: data.socialSummary || null,
      socialImageUrl: data.socialImageUrl || null,
      periodStart: data.periodStart ? new Date(data.periodStart) : null,
      periodEnd: data.periodEnd ? new Date(data.periodEnd) : null,
      articleType: data.articleType || 'digest',
      published: data.published ?? false,
      publishedAt: data.publishedAt ? new Date(data.publishedAt) : (data.published ? new Date() : null),
      authorName: data.authorName || 'Editorial',
      metaTitle: data.metaTitle || null,
      metaDescription: data.metaDescription || null,
    },
  })

  return NextResponse.json({ article })
}
