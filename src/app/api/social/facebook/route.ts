import { prisma } from '@/lib/db'
import { brands, type BrandKey } from '@/lib/domains'
import { NextRequest, NextResponse } from 'next/server'

const ADMIN_SECRET = process.env.ADMIN_SECRET || ''
const GRAPH_API_BASE = 'https://graph.facebook.com/v21.0'

function auth(req: NextRequest): boolean {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  return !!ADMIN_SECRET && token === ADMIN_SECRET
}

function getFbCredentials(brand: BrandKey) {
  const key = brand.toUpperCase()
  return {
    token: process.env[`FB_${key}_PAGE_TOKEN`] || (brand === 'ailayoffs' ? process.env.FB_PAGE_TOKEN : undefined),
    pageId: process.env[`FB_${key}_PAGE_ID`] || (brand === 'ailayoffs' ? process.env.FB_PAGE_ID : undefined),
  }
}

// POST /api/social/facebook — publish a specific article to Facebook
// Body: { articleId: string, brand?: BrandKey }
export async function POST(req: NextRequest) {
  if (!auth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { articleId, brand: brandParam } = await req.json()
  if (!articleId) {
    return NextResponse.json({ error: 'articleId is required' }, { status: 400 })
  }

  const article = await prisma.brandArticle.findUnique({ where: { id: articleId } })
  if (!article) {
    return NextResponse.json({ error: 'Article not found' }, { status: 404 })
  }
  if (!article.published) {
    return NextResponse.json({ error: 'Article is not published' }, { status: 400 })
  }

  const brand = (brandParam || article.brand || 'ailayoffs') as BrandKey
  const brandConfig = brands[brand]
  if (!brandConfig) {
    return NextResponse.json({ error: 'Invalid brand' }, { status: 400 })
  }

  const fb = getFbCredentials(brand)
  if (!fb.token) {
    return NextResponse.json({ error: `FB_${brand.toUpperCase()}_PAGE_TOKEN not configured` }, { status: 500 })
  }
  if (!fb.pageId) {
    return NextResponse.json({ error: `FB_${brand.toUpperCase()}_PAGE_ID not configured` }, { status: 500 })
  }

  const title = article.socialTitle || article.title
  const link = `https://${brandConfig.domain}/digest/${article.slug}`

  let message = title
  if (article.socialSummary) {
    message += `\n\n${article.socialSummary}`
  }

  const res = await fetch(`${GRAPH_API_BASE}/${fb.pageId}/feed`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, link, access_token: fb.token }),
  })

  const data = await res.json()

  if (!res.ok) {
    return NextResponse.json({ error: 'Facebook API error', details: data }, { status: res.status })
  }

  return NextResponse.json({
    success: true,
    facebookPostId: data.id,
    articleId: article.id,
    brand,
    slug: article.slug,
    message,
    link,
  })
}

// GET /api/social/facebook?brand=ailayoffs&postId=xxx — check a post
// Or GET /api/social/facebook?brand=ailayoffs — list recent page posts
export async function GET(req: NextRequest) {
  if (!auth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const brand = (req.nextUrl.searchParams.get('brand') || 'ailayoffs') as BrandKey
  const fb = getFbCredentials(brand)

  if (!fb.token) {
    return NextResponse.json({ error: `FB_${brand.toUpperCase()}_PAGE_TOKEN not configured` }, { status: 500 })
  }

  const postId = req.nextUrl.searchParams.get('postId')

  if (postId) {
    const res = await fetch(
      `${GRAPH_API_BASE}/${postId}?fields=id,message,created_time,permalink_url,shares,likes.summary(true),comments.summary(true)&access_token=${fb.token}`
    )
    const data = await res.json()
    if (!res.ok) {
      return NextResponse.json({ error: 'Facebook API error', details: data }, { status: res.status })
    }
    return NextResponse.json({ post: data })
  }

  const limit = req.nextUrl.searchParams.get('limit') || '10'
  const res = await fetch(
    `${GRAPH_API_BASE}/${fb.pageId}/feed?fields=id,message,created_time,permalink_url&limit=${limit}&access_token=${fb.token}`
  )
  const data = await res.json()
  if (!res.ok) {
    return NextResponse.json({ error: 'Facebook API error', details: data }, { status: res.status })
  }

  return NextResponse.json({ brand, posts: data.data, paging: data.paging })
}
