'use client'

import Link from 'next/link'
import { useBrand } from '@/lib/brand-context'
import { Activity, Menu, Moon, Sun, X } from 'lucide-react'
import { useTheme } from '@/lib/theme-context'
import { useState } from 'react'

const navLinks = [
  { href: '/', label: 'Tracker' },
  { href: '/news', label: 'News & Sources' },
  { href: '/net-impact', label: 'Net Impact' },
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

  // Layout 1 (terminal/report): Clean top bar, underline style
  if (brand.layout === 'terminal') {
    return (
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-12">
            <Link href="/" className="flex items-center gap-2 text-gray-900 font-bold text-sm">
              <Activity className="h-4 w-4 text-blue-600" />
              <span>{brand.name}</span>
            </Link>
            <nav className="hidden md:flex items-center gap-0">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="text-gray-500 hover:text-gray-900 px-3 py-2 text-xs uppercase tracking-wider transition-colors border-b-2 border-transparent hover:border-blue-500">
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-2">
              <button onClick={toggle} className="text-gray-400 hover:text-gray-600 p-1">
                {theme === 'dark' ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
              </button>
              <button className="md:hidden text-gray-500 hover:text-gray-900" onClick={() => setMobileOpen(!mobileOpen)}>
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
          {mobileOpen && (
            <nav className="md:hidden pb-3 space-y-0.5 border-t border-gray-100">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="block text-gray-500 hover:text-gray-900 hover:bg-gray-50 px-3 py-1.5 text-sm" onClick={() => setMobileOpen(false)}>
                  {link.label}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </header>
    )
  }

  // Layout 2 (editorial/two-column): Centered brand with nav below
  if (brand.layout === 'editorial') {
    return (
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            <Link href="/" className="text-gray-900 font-bold text-lg">
              {brand.name}
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="text-gray-500 hover:text-gray-900 px-2.5 py-1.5 text-xs transition-colors rounded hover:bg-gray-100">
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-2">
              <button onClick={toggle} className="text-gray-400 hover:text-gray-600 p-1">
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
              <button className="md:hidden text-gray-500 hover:text-gray-900" onClick={() => setMobileOpen(!mobileOpen)}>
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
          {mobileOpen && (
            <nav className="md:hidden pb-4 space-y-1 border-t border-gray-100">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="block text-gray-500 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 text-sm" onClick={() => setMobileOpen(false)}>
                  {link.label}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </header>
    )
  }

  // Layout 3 (dashboard/sidebar): Minimal top bar — nav is in sidebar
  if (brand.layout === 'dashboard') {
    return (
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4">
          <div className="flex items-center justify-between h-14">
            <Link href="/" className="flex items-center gap-2 text-gray-900 font-semibold text-lg">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              {brand.name}
            </Link>
            {/* Nav links shown on mobile/tablet since sidebar is hidden */}
            <nav className="hidden md:flex lg:hidden items-center gap-0.5">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="text-gray-500 hover:text-gray-900 px-2.5 py-1.5 text-xs rounded-full hover:bg-gray-100 transition-all">
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-2">
              <button onClick={toggle} className="text-gray-400 hover:text-gray-600 p-1">
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
              <button className="md:hidden text-gray-500 hover:text-gray-900" onClick={() => setMobileOpen(!mobileOpen)}>
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
          {mobileOpen && (
            <nav className="md:hidden pb-4 space-y-1 border-t border-gray-100">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="block text-gray-500 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 text-sm" onClick={() => setMobileOpen(false)}>
                  {link.label}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </header>
    )
  }

  // Layout 4 (futuristic/panel): Horizontal strip with all stats visible
  if (brand.layout === 'futuristic') {
    return (
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-12">
            <Link href="/" className="flex items-center gap-2 font-bold text-sm text-gray-900">
              <Activity className="h-4 w-4 text-indigo-500" />
              <span>{brand.name}</span>
            </Link>
            <nav className="hidden md:flex items-center gap-0">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="text-gray-500 hover:text-gray-900 px-2.5 py-1 text-xs transition-colors hover:bg-gray-100 rounded">
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-2">
              <button onClick={toggle} className="text-gray-400 hover:text-gray-600 p-1">
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
              <button className="md:hidden text-gray-500 hover:text-gray-900" onClick={() => setMobileOpen(!mobileOpen)}>
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
          {mobileOpen && (
            <nav className="md:hidden pb-3 space-y-0.5 border-t border-gray-100">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="block text-gray-500 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 text-sm" onClick={() => setMobileOpen(false)}>
                  {link.label}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </header>
    )
  }

  // Default fallback
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2 text-gray-900 font-bold text-lg">
            <Activity className="h-5 w-5" />
            <span>{brand.name}</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm transition-colors">
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <button onClick={toggle} className="text-gray-400 hover:text-gray-600 p-1">
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button className="md:hidden text-gray-500 hover:text-gray-900" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        {mobileOpen && (
          <nav className="md:hidden pb-4 space-y-1 border-t border-gray-100">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="block text-gray-500 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 text-sm" onClick={() => setMobileOpen(false)}>
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  )
}
