import { prisma } from '@/lib/db'
import { headers } from 'next/headers'
import { getBrandFromHost } from '@/lib/domains'
import Link from 'next/link'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers()
  const host = headersList.get('host') || 'ailayoffs.com.au'
  const brand = getBrandFromHost(host)
  return {
    title: `${brand.digestLabel} | ${brand.name}`,
    description: `${brand.digestLabel} — curated summaries and analysis from ${brand.name}`,
  }
}

export default async function DigestPage() {
  const headersList = await headers()
  const host = headersList.get('host') || 'ailayoffs.com.au'
  const brand = getBrandFromHost(host)

  const articles = await prisma.brandArticle.findMany({
    where: { brand: brand.key, published: true },
    orderBy: { publishedAt: 'desc' },
    take: 50,
  })

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-[var(--dark-text)]">{brand.digestLabel}</h1>
        <p className="text-gray-500 dark:text-[var(--dark-muted)] text-sm mt-1">
          Curated summaries and analysis from {brand.name}
        </p>
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 dark:text-[var(--dark-muted)] text-lg">No articles published yet.</p>
          <p className="text-gray-300 dark:text-gray-600 text-sm mt-2">Check back soon for our first {brand.digestLabel.toLowerCase()}.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {articles.map(article => (
            <Link
              key={article.id}
              href={`/digest/${article.slug}`}
              className="block group"
            >
              <article className="border border-gray-200 dark:border-[var(--dark-border)] rounded-lg overflow-hidden bg-white dark:bg-[var(--dark-card)] hover:shadow-lg transition-shadow">
                <div className="flex flex-col sm:flex-row">
                  {article.coverImageUrl && (
                    <div className="sm:w-48 h-40 sm:h-auto shrink-0 bg-gray-100 dark:bg-[var(--dark-surface)]">
                      <img
                        src={article.coverImageUrl}
                        alt={article.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-5 flex-1">
                    <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-[var(--dark-muted)] mb-2">
                      <span className="uppercase tracking-wider font-semibold">{article.articleType}</span>
                      {article.publishedAt && (
                        <>
                          <span>&middot;</span>
                          <span>{new Date(article.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </>
                      )}
                      <span>&middot;</span>
                      <span>{article.authorName}</span>
                    </div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-[var(--dark-text)] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
                      {article.title}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-[var(--dark-muted)] line-clamp-2">
                      {article.summary}
                    </p>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
