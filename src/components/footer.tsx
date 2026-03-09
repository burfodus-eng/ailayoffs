'use client'

import Link from 'next/link'
import { useBrand } from '@/lib/brand-context'
import type { BrandKey } from '@/lib/domains'

const sisterBrands: { key: BrandKey; name: string; url: string; angle: string }[] = [
  { key: 'ailayoffs', name: 'AI Layoffs', url: 'https://ailayoffs.com.au', angle: 'Public tracker' },
  { key: 'aicuts', name: 'AI Cuts', url: 'https://aicuts.com.au', angle: 'Breaking updates' },
  { key: 'ailayoffwatch', name: 'AI Layoff Watch', url: 'https://ailayoffwatch.com', angle: 'Research & analysis' },
  { key: 'robotlayoffs', name: 'Robot Layoffs', url: 'https://robotlayoffs.com', angle: 'Automation tracker' },
]

export function Footer() {
  const brand = useBrand()
  const others = sisterBrands.filter(b => b.key !== brand.key)

  return (
    <footer className="bg-white border-t border-gray-200 dark:bg-[var(--dark-card)] dark:border-[var(--dark-border)] text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col md:flex-row items-start justify-between gap-6">
          <div className="space-y-3">
            <div className="text-gray-500 dark:text-[var(--dark-muted)] text-xs">
              &copy; {new Date().getFullYear()} {brand.name} &middot; Data estimated from public reporting
            </div>
            <nav className="flex items-center gap-4 text-xs text-gray-500 dark:text-[var(--dark-muted)]">
              <Link href="/methodology" className="hover:text-gray-900 dark:hover:text-[var(--dark-text)] transition-colors">Methodology</Link>
              <Link href="/digest" className="hover:text-gray-900 dark:hover:text-[var(--dark-text)] transition-colors">Digest</Link>
              <Link href="/about" className="hover:text-gray-900 dark:hover:text-[var(--dark-text)] transition-colors">About</Link>
              <Link href="/faq" className="hover:text-gray-900 dark:hover:text-[var(--dark-text)] transition-colors">FAQ</Link>
              <Link href="/news" className="hover:text-gray-900 dark:hover:text-[var(--dark-text)] transition-colors">Sources</Link>
            </nav>
          </div>

          {/* Sister brands cross-link */}
          <div className="text-xs">
            <p className="text-gray-400 dark:text-[var(--dark-muted)] mb-1.5">Related trackers</p>
            <div className="flex items-center gap-3">
              {others.map(b => (
                <a
                  key={b.key}
                  href={b.url}
                  className="text-gray-500 dark:text-[var(--dark-muted)] hover:text-gray-900 dark:hover:text-[var(--dark-text)] transition-colors"
                  title={b.angle}
                >
                  {b.name}
                </a>
              ))}
            </div>
            <p className="text-[10px] text-gray-300 dark:text-gray-600 mt-1.5">
              Part of a network of AI and automation tracking sites sharing a common data platform.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
