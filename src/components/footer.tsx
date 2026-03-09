'use client'

import Link from 'next/link'
import { useBrand } from '@/lib/brand-context'

export function Footer() {
  const brand = useBrand()

  return (
    <footer className="bg-white border-t border-gray-200 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-gray-500 text-xs">
            &copy; {new Date().getFullYear()} {brand.name} · Data estimated from public reporting
          </div>
          <nav className="flex items-center gap-4 text-xs text-gray-500">
            <Link href="/methodology" className="hover:text-gray-900 transition-colors">Methodology</Link>
            <Link href="/about" className="hover:text-gray-900 transition-colors">About</Link>
            <Link href="/faq" className="hover:text-gray-900 transition-colors">FAQ</Link>
            <Link href="/news" className="hover:text-gray-900 transition-colors">Sources</Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
