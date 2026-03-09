'use client'

import Link from 'next/link'
import { useBrand } from '@/lib/brand-context'
import { Activity, Menu, Moon, Sun, X } from 'lucide-react'
import { useTheme } from '@/lib/theme-context'
import { useState } from 'react'

const navLinks = [
  { href: '/', label: 'Tracker' },
  { href: '/news', label: 'News & Sources' },
  { href: '/jobs-created', label: 'Jobs Created' },
  { href: '/productivity', label: 'Productivity' },
  { href: '/robots', label: 'Robot Tracker' },
  { href: '/job-security', label: 'Job Security' },
  { href: '/methodology', label: 'Methodology' },
]

export function Header() {
  const brand = useBrand()
  const { theme, toggle } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className={`${brand.headerBg} border-b border-white/10 sticky top-0 z-50`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2 text-white font-bold text-lg">
            <Activity className="h-5 w-5" />
            <span>{brand.name}</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-300 hover:text-white px-3 py-2 text-sm transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button onClick={toggle} className="text-gray-300 hover:text-white p-1">
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

          <button
            className="md:hidden text-gray-300 hover:text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          </div>
        </div>

        {mobileOpen && (
          <nav className="md:hidden pb-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-gray-300 hover:text-white px-3 py-2 text-sm"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  )
}
