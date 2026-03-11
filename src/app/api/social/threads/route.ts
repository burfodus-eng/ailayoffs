import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

const ADMIN_SECRET = process.env.ADMIN_SECRET || ''
const THREADS_USER_TOKEN = process.env.THREADS_USER_TOKEN || ''
const THREADS_USER_ID = process.env.THREADS_USER_ID || ''
const GRAPH_BASE = 'https://graph.threads.net/v1.0'

function auth(req: NextRequest): boolean {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  return !!ADMIN_SECRET && token === ADMIN_SECRET
}

function buildThreadsText(title: string, summary: string | null, link: string): string {
  let text = title

  if (summary) {
    const maxSummaryLen = 500 - title.length - link.length - 6
    const trimmedSummary = summary.length > maxSummaryLen
      ? summary.substring(0, maxSummaryLen - 3) + '...'
      : summary
    text += `\n\n${trimmedSummary}`
  }

  text += `\n\n${link}`

  if (text.length > 500) {
    text = text.substring(0, 497) + '...'
  }

  return text
}

// POST /api/social/threads — publish a specific article to Threads
// Body: { articleId: string }
export async function POST(req: NextRequest) {
  if (!auth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!THREADS_USER_TOKEN || !THREADS_USER_ID) {
    return NextResponse.json(
      { error: 'THREADS_USER_TOKEN and THREADS_USER_ID not configured' },
      { status: 500 }
    )
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
  const summary = article.socialSummary || null
  const text = buildThreadsText(title, summary, link)

  // Step 1: Create media container
  const containerRes = await fetch(`${GRAPH_BASE}/${THREADS_USER_ID}/threads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      media_type: 'TEXT',
      text,
      link_attachment: link,
      access_token: THREADS_USER_TOKEN,
    }),
  })

  const containerData = await containerRes.json()

  if (!containerRes.ok || containerData.error) {
    return NextResponse.json(
      { error: 'Threads container creation failed', details: containerData },
      { status: containerRes.status }
    )
  }

  // Brief pause before publishing
  await new Promise(r => setTimeout(r, 2000))

  // Step 2: Publish
  const publishRes = await fetch(`${GRAPH_BASE}/${THREADS_USER_ID}/threads_publish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      creation_id: containerData.id,
      access_token: THREADS_USER_TOKEN,
    }),
  })

  const publishData = await publishRes.json()

  if (!publishRes.ok || publishData.error) {
    return NextResponse.json(
      { error: 'Threads publish failed', details: publishData },
      { status: publishRes.status }
    )
  }

  return NextResponse.json({
    success: true,
    threadsPostId: publishData.id,
    articleId: article.id,
    slug: article.slug,
    text,
    link,
  })
}

// GET /api/social/threads — list recent Threads posts
export async function GET(req: NextRequest) {
  if (!auth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!THREADS_USER_TOKEN || !THREADS_USER_ID) {
    return NextResponse.json(
      { error: 'THREADS_USER_TOKEN and THREADS_USER_ID not configured' },
      { status: 500 }
    )
  }

  const limit = req.nextUrl.searchParams.get('limit') || '10'

  const res = await fetch(
    `${GRAPH_BASE}/${THREADS_USER_ID}/threads?fields=id,text,timestamp,permalink,is_quote_post&limit=${limit}&access_token=${THREADS_USER_TOKEN}`
  )

  const data = await res.json()

  if (!res.ok || data.error) {
    return NextResponse.json(
      { error: 'Threads API error', details: data },
      { status: res.status }
    )
  }

  return NextResponse.json({ posts: data.data, paging: data.paging })
}
