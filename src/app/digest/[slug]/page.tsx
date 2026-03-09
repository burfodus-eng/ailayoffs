import { prisma } from '@/lib/db'
import { headers } from 'next/headers'
import { getBrandFromHost } from '@/lib/domains'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const headersList = await headers()
  const host = headersList.get('host') || 'ailayoffs.com.au'
  const brand = getBrandFromHost(host)

  const article = await prisma.brandArticle.findUnique({
    where: { brand_slug: { brand: brand.key, slug } },
  })

  if (!article) return { title: 'Not Found' }

  return {
    title: article.metaTitle || article.title,
    description: article.metaDescription || article.summary,
    openGraph: {
      title: article.socialTitle || article.title,
      description: article.socialSummary || article.summary,
      images: article.socialImageUrl ? [{ url: article.socialImageUrl }] : undefined,
      type: 'article',
      publishedTime: article.publishedAt?.toISOString(),
      authors: [article.authorName],
    },
  }
}

export default async function DigestArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const headersList = await headers()
  const host = headersList.get('host') || 'ailayoffs.com.au'
  const brand = getBrandFromHost(host)

  const article = await prisma.brandArticle.findUnique({
    where: { brand_slug: { brand: brand.key, slug } },
  })

  if (!article || !article.published) notFound()

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <Link href="/digest" className="text-xs text-blue-600 dark:text-blue-400 hover:underline mb-4 inline-block">
        &larr; Back to {brand.digestLabel}
      </Link>

      {article.coverImageUrl && (
        <div className="rounded-lg overflow-hidden mb-6 bg-gray-100 dark:bg-[var(--dark-surface)]">
          <img src={article.coverImageUrl} alt={article.title} className="w-full h-64 object-cover" />
        </div>
      )}

      <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-[var(--dark-muted)] mb-3">
        <span className="uppercase tracking-wider font-semibold">{article.articleType}</span>
        {article.publishedAt && (
          <>
            <span>&middot;</span>
            <span>{new Date(article.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </>
        )}
        <span>&middot;</span>
        <span>By {article.authorName}</span>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-[var(--dark-text)] mb-3">{article.title}</h1>
      <p className="text-lg text-gray-500 dark:text-[var(--dark-muted)] mb-8 leading-relaxed">{article.summary}</p>

      {article.periodStart && article.periodEnd && (
        <div className="text-xs text-gray-400 dark:text-[var(--dark-muted)] mb-6 px-3 py-2 bg-gray-50 dark:bg-[var(--dark-surface)] rounded border border-gray-100 dark:border-[var(--dark-border)]">
          Covering: {new Date(article.periodStart).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} &mdash; {new Date(article.periodEnd).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </div>
      )}

      <div
        className="prose prose-gray dark:prose-invert max-w-none
          prose-headings:text-gray-900 dark:prose-headings:text-[var(--dark-text)]
          prose-p:text-gray-600 dark:prose-p:text-[var(--dark-text)]
          prose-a:text-blue-600 dark:prose-a:text-blue-400
          prose-strong:text-gray-900 dark:prose-strong:text-[var(--dark-text)]"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(article.body) }}
      />

      <div className="mt-10 pt-6 border-t border-gray-200 dark:border-[var(--dark-border)]">
        <p className="text-xs text-gray-400 dark:text-[var(--dark-muted)]">
          Published by {brand.name} &middot; Data estimated from public reporting &middot;{' '}
          <Link href="/methodology" className="underline">Methodology</Link>
        </p>
      </div>
    </article>
  )
}

// Simple markdown to HTML (headings, bold, links, lists, paragraphs)
function renderMarkdown(md: string): string {
  return md
    .split('\n\n')
    .map(block => {
      block = block.trim()
      if (!block) return ''

      // Headings
      if (block.startsWith('### ')) return `<h3>${escHtml(block.slice(4))}</h3>`
      if (block.startsWith('## ')) return `<h2>${escHtml(block.slice(3))}</h2>`
      if (block.startsWith('# ')) return `<h1>${escHtml(block.slice(2))}</h1>`

      // Unordered list
      if (block.match(/^[-*] /m)) {
        const items = block.split('\n').filter(l => l.match(/^[-*] /)).map(l => `<li>${inlineFormat(l.replace(/^[-*] /, ''))}</li>`).join('')
        return `<ul>${items}</ul>`
      }

      // Paragraph
      return `<p>${inlineFormat(block)}</p>`
    })
    .join('\n')
}

function inlineFormat(text: string): string {
  let s = escHtml(text)
  s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  s = s.replace(/\*(.+?)\*/g, '<em>$1</em>')
  s = s.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
  return s
}

function escHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
