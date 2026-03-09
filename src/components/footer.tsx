'use client'

import Link from 'next/link'
import { useBrand } from '@/lib/brand-context'

export function Footer() {
  const brand = useBrand()

  return (
    <footer className="border-t border-white/10 bg-slate-950 text-gray-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-semibold mb-3">{brand.name}</h3>
            <p className="text-xs leading-relaxed">{brand.description}</p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3">Trackers</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="hover:text-white transition-colors">AI Job Losses</Link></li>
              <li><Link href="/robots" className="hover:text-white transition-colors">Robot / Automation</Link></li>
              <li><Link href="/jobs-created" className="hover:text-white transition-colors">Jobs Created</Link></li>
              <li><Link href="/productivity" className="hover:text-white transition-colors">Productivity Impact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3">Tools</h3>
            <ul className="space-y-2">
              <li><Link href="/job-security" className="hover:text-white transition-colors">Job Security Analyzer</Link></li>
              <li><Link href="/news" className="hover:text-white transition-colors">News & Sources</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3">About</h3>
            <ul className="space-y-2">
              <li><Link href="/methodology" className="hover:text-white transition-colors">Methodology</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-white/10 text-center text-xs text-gray-500">
          <p>Data is estimated from public reporting. Numbers represent ranges, not exact counts.</p>
          <p className="mt-1">&copy; {new Date().getFullYear()} {brand.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
