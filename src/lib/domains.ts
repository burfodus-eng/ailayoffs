export type BrandKey = 'ailayoffs' | 'aicuts' | 'ailayoffwatch' | 'robotlayoffs'

export interface BrandConfig {
  key: BrandKey
  name: string
  tagline: string
  description: string
  primaryColor: string
  accentColor: string
  focusType: 'ai' | 'robot' | 'both'
  // Theme
  headerBg: string
  heroGradient: string
  heroBg: string
  heroText: string
  heroAccent: string
  bodyBg: string
  bodyText: string
  cardBg: string
  cardBorder: string
  tableBg: string
  chartColors: [string, string, string] // [conservative, core, upper]
  fontStyle: 'mono' | 'serif' | 'sans'
  layout: 'terminal' | 'editorial' | 'dashboard' | 'futuristic'
}

export const brands: Record<BrandKey, BrandConfig> = {
  ailayoffs: {
    key: 'ailayoffs',
    name: 'AI Layoffs',
    tagline: 'Tracking AI-Attributed Job Losses Globally',
    description: 'A live tracker of global job losses attributed to artificial intelligence, built from public reporting with transparent methodology.',
    primaryColor: 'red',
    accentColor: 'amber',
    focusType: 'ai',
    headerBg: 'bg-slate-900',
    heroGradient: 'from-slate-900 via-red-950 to-slate-900',
    heroBg: '#0f172a',
    heroText: '#f59e0b',
    heroAccent: '#ef4444',
    bodyBg: '#0f172a',
    bodyText: '#94a3b8',
    cardBg: '#1e293b',
    cardBorder: '#334155',
    tableBg: '#0f172a',
    chartColors: ['#22c55e', '#f59e0b', '#ef4444'],
    fontStyle: 'mono',
    layout: 'terminal',
  },
  aicuts: {
    key: 'aicuts',
    name: 'AI Cuts',
    tagline: 'The AI Job Cut Tracker',
    description: 'Monitoring workforce reductions driven by artificial intelligence adoption worldwide.',
    primaryColor: 'orange',
    accentColor: 'yellow',
    focusType: 'ai',
    headerBg: 'bg-amber-950',
    heroGradient: 'from-gray-900 via-orange-950 to-gray-900',
    heroBg: '#faf8f5',
    heroText: '#78350f',
    heroAccent: '#c2410c',
    bodyBg: '#faf8f5',
    bodyText: '#44403c',
    cardBg: '#ffffff',
    cardBorder: '#d6d3d1',
    tableBg: '#ffffff',
    chartColors: ['#a16207', '#c2410c', '#9a3412'],
    fontStyle: 'serif',
    layout: 'editorial',
  },
  ailayoffwatch: {
    key: 'ailayoffwatch',
    name: 'AI Layoff Watch',
    tagline: 'Watching the AI Employment Impact',
    description: 'An independent observatory tracking how AI is reshaping the global workforce.',
    primaryColor: 'blue',
    accentColor: 'cyan',
    focusType: 'both',
    headerBg: 'bg-slate-900',
    heroGradient: 'from-slate-950 via-blue-950 to-slate-950',
    heroBg: '#0f172a',
    heroText: '#e2e8f0',
    heroAccent: '#38bdf8',
    bodyBg: '#1e293b',
    bodyText: '#cbd5e1',
    cardBg: '#0f172a',
    cardBorder: '#334155',
    tableBg: '#0f172a',
    chartColors: ['#06b6d4', '#3b82f6', '#8b5cf6'],
    fontStyle: 'sans',
    layout: 'dashboard',
  },
  robotlayoffs: {
    key: 'robotlayoffs',
    name: 'Robot Layoffs',
    tagline: 'Tracking Automation & Robotics Job Displacement',
    description: 'Monitoring global job losses driven by robotics, automation, and physical AI systems.',
    primaryColor: 'purple',
    accentColor: 'violet',
    focusType: 'robot',
    headerBg: 'bg-[#0a0a0f]',
    heroGradient: 'from-gray-950 via-purple-950 to-gray-950',
    heroBg: '#0a0a0f',
    heroText: '#c4b5fd',
    heroAccent: '#a78bfa',
    bodyBg: '#0a0a0f',
    bodyText: '#a78bfa',
    cardBg: '#1a1a2e',
    cardBorder: '#7c3aed',
    tableBg: '#0a0a0f',
    chartColors: ['#8b5cf6', '#a78bfa', '#c4b5fd'],
    fontStyle: 'mono',
    layout: 'futuristic',
  },
}

const domainMap: Record<string, BrandKey> = {
  'ailayoffs.com.au': 'ailayoffs',
  'aicuts.com.au': 'aicuts',
  'ailayoffwatch.com': 'ailayoffwatch',
  'ailayoffwatch.com.au': 'ailayoffwatch',
  'robotlayoffs.com': 'robotlayoffs',
  'robotlayoffs.com.au': 'robotlayoffs',
}

export function getBrandFromHost(host: string): BrandConfig {
  const cleanHost = host.replace(/:\d+$/, '').toLowerCase()
  const key = domainMap[cleanHost] || 'ailayoffs'
  return brands[key]
}
