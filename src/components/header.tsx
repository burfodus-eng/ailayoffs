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
  { href: '/net-impact', label: 'Net Impact' },
  { href: '/job-security', label: 'Job Security' },
  { href: '/methodology', label: 'Methodology' },
]

export function Header() {
  const brand = useBrand()
  const { theme, toggle } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)

  // Terminal style
  if (brand.layout === 'terminal') {
    return (
      <header className="bg-[#0a0f1a] border-b border-slate-800 sticky top-0 z-50 font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-12">
            <Link href="/" className="flex items-center gap-2 text-amber-500 font-bold text-sm">
              <Activity className="h-4 w-4" />
              <span>{brand.name.toUpperCase()}</span>
              <span className="text-slate-600 text-xs">v1.0</span>
            </Link>
            <nav className="hidden md:flex items-center gap-0">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="text-slate-500 hover:text-amber-500 px-3 py-2 text-xs uppercase tracking-wider transition-colors">
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-2">
              <button onClick={toggle} className="text-slate-600 hover:text-amber-500 p-1">
                {theme === 'dark' ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
              </button>
              <button className="md:hidden text-slate-500 hover:text-amber-500" onClick={() => setMobileOpen(!mobileOpen)}>
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
          {mobileOpen && (
            <nav className="md:hidden pb-3 space-y-0.5 font-mono">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="block text-slate-500 hover:text-amber-500 px-3 py-1.5 text-xs uppercase" onClick={() => setMobileOpen(false)}>
                  {'>'} {link.label}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </header>
    )
  }

  // Editorial style
  if (brand.layout === 'editorial') {
    return (
      <header className="bg-amber-950 border-b border-amber-900 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            <Link href="/" className="flex items-center gap-2 text-amber-100 font-serif font-bold text-xl">
              {brand.name}
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="text-amber-200/70 hover:text-amber-100 px-3 py-2 text-sm font-serif transition-colors hover:underline underline-offset-4">
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-2">
              <button onClick={toggle} className="text-amber-200/70 hover:text-amber-100 p-1">
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
              <button className="md:hidden text-amber-200/70 hover:text-amber-100" onClick={() => setMobileOpen(!mobileOpen)}>
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
          {mobileOpen && (
            <nav className="md:hidden pb-4 space-y-1 font-serif">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="block text-amber-200/70 hover:text-amber-100 px-3 py-2 text-sm" onClick={() => setMobileOpen(false)}>
                  {link.label}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </header>
    )
  }

  // Dashboard style
  if (brand.layout === 'dashboard') {
    return (
      <header className="bg-slate-900 border-b border-slate-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            <Link href="/" className="flex items-center gap-2 text-white font-semibold text-lg">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              {brand.name}
            </Link>
            <nav className="hidden md:flex items-center gap-0.5">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="text-slate-400 hover:text-white px-3 py-1.5 text-sm rounded-full hover:bg-slate-800 transition-all">
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-2">
              <button onClick={toggle} className="text-slate-400 hover:text-white p-1">
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
              <button className="md:hidden text-slate-400 hover:text-white" onClick={() => setMobileOpen(!mobileOpen)}>
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
          {mobileOpen && (
            <nav className="md:hidden pb-4 space-y-1">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="block text-slate-400 hover:text-white px-3 py-2 text-sm rounded-lg hover:bg-slate-800" onClick={() => setMobileOpen(false)}>
                  {link.label}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </header>
    )
  }

  // Futuristic style
  if (brand.layout === 'futuristic') {
    return (
      <header className="bg-[#0a0a0f] border-b border-purple-900/30 sticky top-0 z-50 font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg">
              <Activity className="h-5 w-5 text-purple-500" />
              <span style={{ color: '#c4b5fd', textShadow: '0 0 10px rgba(139,92,246,0.5)' }}>{brand.name}</span>
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="text-purple-400/60 hover:text-purple-300 px-3 py-2 text-xs uppercase tracking-wider transition-colors">
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-2">
              <button onClick={toggle} className="text-purple-400/60 hover:text-purple-300 p-1">
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
              <button className="md:hidden text-purple-400/60 hover:text-purple-300" onClick={() => setMobileOpen(!mobileOpen)}>
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
          {mobileOpen && (
            <nav className="md:hidden pb-4 space-y-1 font-mono">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="block text-purple-400/60 hover:text-purple-300 px-3 py-2 text-xs uppercase tracking-wider" onClick={() => setMobileOpen(false)}>
                  {'// '}{link.label}
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
    <header className={`${brand.headerBg} border-b border-white/10 sticky top-0 z-50`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2 text-white font-bold text-lg">
            <Activity className="h-5 w-5" />
            <span>{brand.name}</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-gray-300 hover:text-white px-3 py-2 text-sm transition-colors">
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <button onClick={toggle} className="text-gray-300 hover:text-white p-1">
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button className="md:hidden text-gray-300 hover:text-white" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        {mobileOpen && (
          <nav className="md:hidden pb-4 space-y-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="block text-gray-300 hover:text-white px-3 py-2 text-sm" onClick={() => setMobileOpen(false)}>
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  )
}
