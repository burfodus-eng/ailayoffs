export type BrandKey = 'ailayoffs' | 'aicuts' | 'ailayoffwatch' | 'robotlayoffs'

export interface BrandConfig {
  key: BrandKey
  name: string
  tagline: string
  description: string
  primaryColor: string // tailwind color class
  accentColor: string
  focusType: 'ai' | 'robot' | 'both'
  headerBg: string
  heroGradient: string
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
  },
  aicuts: {
    key: 'aicuts',
    name: 'AI Cuts',
    tagline: 'The AI Job Cut Tracker',
    description: 'Monitoring workforce reductions driven by artificial intelligence adoption worldwide.',
    primaryColor: 'orange',
    accentColor: 'yellow',
    focusType: 'ai',
    headerBg: 'bg-gray-900',
    heroGradient: 'from-gray-900 via-orange-950 to-gray-900',
  },
  ailayoffwatch: {
    key: 'ailayoffwatch',
    name: 'AI Layoff Watch',
    tagline: 'Watching the AI Employment Impact',
    description: 'An independent observatory tracking how AI is reshaping the global workforce.',
    primaryColor: 'blue',
    accentColor: 'cyan',
    focusType: 'both',
    headerBg: 'bg-slate-950',
    heroGradient: 'from-slate-950 via-blue-950 to-slate-950',
  },
  robotlayoffs: {
    key: 'robotlayoffs',
    name: 'Robot Layoffs',
    tagline: 'Tracking Automation & Robotics Job Displacement',
    description: 'Monitoring global job losses driven by robotics, automation, and physical AI systems.',
    primaryColor: 'purple',
    accentColor: 'violet',
    focusType: 'robot',
    headerBg: 'bg-gray-950',
    heroGradient: 'from-gray-950 via-purple-950 to-gray-950',
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
