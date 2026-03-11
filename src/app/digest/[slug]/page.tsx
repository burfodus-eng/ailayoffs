import { prisma } from '@/lib/db'
import { headers } from 'next/headers'
import { getBrandFromHost, type BrandKey } from '@/lib/domains'
import { getArticleRecommendations, affiliatePartners } from '@/lib/affiliates'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { ArticleJsonLd } from '@/components/json-ld'

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
      <ArticleJsonLd
        headline={article.title}
        description={article.summary}
        datePublished={article.publishedAt?.toISOString() || article.createdAt.toISOString()}
        dateModified={article.updatedAt.toISOString()}
        authorName={article.authorName}
        url={`https://${brand.domain}/digest/${slug}`}
        image={article.coverImageUrl || undefined}
      />
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

      {/* Recommendation Module */}
      <RecommendationModule brandKey={brand.key as BrandKey} />

      <div className="mt-8 px-4 py-3 bg-gray-50 dark:bg-[var(--dark-surface)] rounded border border-gray-100 dark:border-[var(--dark-border)]">
        <p className="text-xs text-gray-500 dark:text-[var(--dark-muted)] italic">
          This summary was prepared with AI assistance and reviewed by our editorial team.
        </p>
      </div>

      <div className="mt-10 pt-6 border-t border-gray-200 dark:border-[var(--dark-border)]">
        <p className="text-xs text-gray-400 dark:text-[var(--dark-muted)]">
          Published by {brand.name} &middot; Data estimated from public reporting &middot;{' '}
          <Link href="/methodology" className="underline">Methodology</Link>
        </p>
      </div>
    </article>
  )
}

// Article-end recommendation module
function RecommendationModule({ brandKey }: { brandKey: BrandKey }) {
  const recs = getArticleRecommendations()
  // ailayoffwatch is most restrained
  const isRestrained = brandKey === 'ailayoffwatch'

  const items = [
    { partner: recs.training, label: 'Training', desc: 'Build in-demand skills with structured courses' },
    { partner: recs.tool, label: 'Tool', desc: 'Research and productivity tools for the AI era' },
    ...(!isRestrained ? [{ partner: recs.career, label: 'Career', desc: 'Resume and job transition support' }] : []),
  ]

  return (
    <div className="mt-10 pt-6 border-t border-gray-100 dark:border-[var(--dark-border)]">
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-[var(--dark-muted)] mb-3">
        What to learn next
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {items.map(({ partner, label, desc }) => (
          <a
            key={partner.id}
            href={partner.url}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="block border border-gray-150 dark:border-[var(--dark-border)] rounded-lg p-3 hover:border-gray-300 dark:hover:border-[var(--dark-accent)] transition-colors bg-white dark:bg-[var(--dark-card)]"
          >
            <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-400 dark:text-[var(--dark-muted)]">{label}</span>
            <p className="text-sm font-medium text-gray-900 dark:text-[var(--dark-text)] mt-0.5">{partner.name}</p>
            <p className="text-xs text-gray-500 dark:text-[var(--dark-muted)] mt-1">{desc}</p>
          </a>
        ))}
      </div>
      <p className="text-[10px] text-gray-400 dark:text-[var(--dark-muted)] mt-2">
        Some links may earn us a commission. We only recommend resources we believe provide genuine value.
      </p>
    </div>
  )
}

// Markdown to HTML (headings, bold, links, lists, tables, paragraphs)
function renderMarkdown(md: string): string {
  return md
    .split('\n\n')
    .map(block => {
      block = block.trim()
      if (!block) return ''

      // Headings — downshift to avoid duplicate h1 (page title is h1)
      if (block.startsWith('### ')) return `<h4>${escHtml(block.slice(4))}</h4>`
      if (block.startsWith('## ')) return `<h3>${escHtml(block.slice(3))}</h3>`
      if (block.startsWith('# ')) return `<h2>${escHtml(block.slice(2))}</h2>`

      // Table
      if (block.includes('|') && block.split('\n').length >= 2) {
        const rows = block.split('\n').filter(r => r.trim().startsWith('|'))
        if (rows.length >= 2) {
          const parseRow = (r: string) => r.split('|').slice(1, -1).map(c => c.trim())
          const headerCells = parseRow(rows[0])
          // Skip separator row (row[1] with dashes)
          const dataRows = rows.slice(2)
          const thead = `<thead><tr>${headerCells.map(c => `<th>${inlineFormat(c)}</th>`).join('')}</tr></thead>`
          const tbody = `<tbody>${dataRows.map(r => `<tr>${parseRow(r).map(c => `<td>${inlineFormat(c)}</td>`).join('')}</tr>`).join('')}</tbody>`
          return `<table>${thead}${tbody}</table>`
        }
      }

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
