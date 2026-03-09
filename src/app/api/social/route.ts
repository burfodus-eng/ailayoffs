import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { brands, type BrandKey } from '@/lib/domains'

const ADMIN_SECRET = process.env.ADMIN_SECRET || ''

function auth(req: NextRequest): boolean {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  return !!ADMIN_SECRET && token === ADMIN_SECRET
}

// GET /api/social?brand=ailayoffs — get social-ready content for a brand
// Returns published articles with social copy ready for Facebook/Instagram posting
// Optional: ?type=digest&limit=5&since=2026-03-01
export async function GET(req: NextRequest) {
  if (!auth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const brand = req.nextUrl.searchParams.get('brand') || 'ailayoffs'
  const type = req.nextUrl.searchParams.get('type')
  const limit = parseInt(req.nextUrl.searchParams.get('limit') || '10')
  const since = req.nextUrl.searchParams.get('since')

  if (!brands[brand as BrandKey]) {
    return NextResponse.json({ error: 'Invalid brand' }, { status: 400 })
  }

  const brandConfig = brands[brand as BrandKey]

  const articles = await prisma.brandArticle.findMany({
    where: {
      brand,
      published: true,
      ...(type ? { articleType: type } : {}),
      ...(since ? { publishedAt: { gte: new Date(since) } } : {}),
    },
    orderBy: { publishedAt: 'desc' },
    take: limit,
  })

  // Format for social posting bot
  const posts = articles.map(article => ({
    id: article.id,
    brand: article.brand,
    brandName: brandConfig.name,
    brandDomain: brandConfig.domain,
    slug: article.slug,
    url: `https://${brandConfig.domain}/digest/${article.slug}`,
    // Social content
    title: article.socialTitle || article.title,
    caption: article.socialSummary || article.summary,
    imageUrl: article.socialImageUrl || article.coverImageUrl,
    hashtags: generateHashtags(brand as BrandKey, article.articleType),
    // Metadata
    articleType: article.articleType,
    publishedAt: article.publishedAt,
    periodStart: article.periodStart,
    periodEnd: article.periodEnd,
  }))

  return NextResponse.json({ brand, brandName: brandConfig.name, posts })
}

function generateHashtags(brand: BrandKey, articleType: string): string[] {
  const base = ['#AI', '#ArtificialIntelligence', '#FutureOfWork']
  const brandTags: Record<BrandKey, string[]> = {
    ailayoffs: ['#AILayoffs', '#TechLayoffs', '#AIJobs'],
    aicuts: ['#AICuts', '#TechCuts', '#WorkforceReduction'],
    ailayoffwatch: ['#AILayoffWatch', '#AIResearch', '#WorkforceAnalysis'],
    robotlayoffs: ['#RobotLayoffs', '#Automation', '#Robotics', '#FutureOfWork'],
  }
  return [...base, ...brandTags[brand]]
}
