import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

const ADMIN_SECRET = process.env.ADMIN_SECRET || ''
const FB_PAGE_TOKEN = process.env.FB_PAGE_TOKEN || ''
const FB_PAGE_ID = process.env.FB_PAGE_ID || '1089727594217084'
const GRAPH_API_BASE = `https://graph.facebook.com/v21.0`

function auth(req: NextRequest): boolean {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  return !!ADMIN_SECRET && token === ADMIN_SECRET
}

// POST /api/social/facebook — publish a specific article to Facebook
// Body: { articleId: string }
export async function POST(req: NextRequest) {
  if (!auth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!FB_PAGE_TOKEN) {
    return NextResponse.json({ error: 'FB_PAGE_TOKEN not configured' }, { status: 500 })
  }

  const { articleId } = await req.json()
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

  const title = article.socialTitle || article.title
  const link = `https://ailayoffs.com.au/digest/${article.slug}`

  let message = title
  if (article.socialSummary) {
    message += `\n\n${article.socialSummary}`
  }

  const res = await fetch(`${GRAPH_API_BASE}/${FB_PAGE_ID}/feed`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      link,
      access_token: FB_PAGE_TOKEN,
    }),
  })

  const data = await res.json()

  if (!res.ok) {
    return NextResponse.json(
      { error: 'Facebook API error', details: data },
      { status: res.status }
    )
  }

  return NextResponse.json({
    success: true,
    facebookPostId: data.id,
    articleId: article.id,
    slug: article.slug,
    message,
    link,
  })
}

// GET /api/social/facebook?postId=xxx — check a Facebook post's status
// Or GET /api/social/facebook — list recent page posts
export async function GET(req: NextRequest) {
  if (!auth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!FB_PAGE_TOKEN) {
    return NextResponse.json({ error: 'FB_PAGE_TOKEN not configured' }, { status: 500 })
  }

  const postId = req.nextUrl.searchParams.get('postId')

  if (postId) {
    // Get a specific post
    const res = await fetch(
      `${GRAPH_API_BASE}/${postId}?fields=id,message,created_time,permalink_url,shares,likes.summary(true),comments.summary(true)&access_token=${FB_PAGE_TOKEN}`
    )
    const data = await res.json()

    if (!res.ok) {
      return NextResponse.json(
        { error: 'Facebook API error', details: data },
        { status: res.status }
      )
    }

    return NextResponse.json({ post: data })
  }

  // List recent page posts
  const limit = req.nextUrl.searchParams.get('limit') || '10'
  const res = await fetch(
    `${GRAPH_API_BASE}/${FB_PAGE_ID}/feed?fields=id,message,created_time,permalink_url&limit=${limit}&access_token=${FB_PAGE_TOKEN}`
  )
  const data = await res.json()

  if (!res.ok) {
    return NextResponse.json(
      { error: 'Facebook API error', details: data },
      { status: res.status }
    )
  }

  return NextResponse.json({ posts: data.data, paging: data.paging })
}
