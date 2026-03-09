export type BrandKey = 'ailayoffs' | 'aicuts' | 'ailayoffwatch' | 'robotlayoffs'

export interface BrandConfig {
  key: BrandKey
  name: string
  tagline: string
  description: string
  primaryColor: string
  accentColor: string
  focusType: 'ai' | 'robot' | 'both'
  domain: string
  heroHeading: string
  heroSubheading: string
  digestLabel: string // e.g. "This Month in AI Layoffs"
  tone: string // editorial guidance for content generation
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

// Primary industry categories — normalize granular industries to these
export const PRIMARY_INDUSTRIES = [
  'Technology',
  'Finance',
  'Telecommunications',
  'Manufacturing',
  'Retail & E-commerce',
  'Healthcare & Pharma',
  'Media & Entertainment',
  'Government',
  'Professional Services',
  'AI & Machine Learning',
  'Robotics & Automation',
  'Defense',
  'Transport & Logistics',
  'Energy',
  'Education',
] as const

const industryNormMap: Record<string, string> = {
  'Enterprise Software': 'Technology',
  'Cloud Computing': 'Technology',
  'Technology/Software': 'Technology',
  'Technology/Hardware': 'Technology',
  'Technology/E-commerce': 'Technology',
  'Technology/VR': 'Technology',
  'Technology/Logistics': 'Technology',
  'Technology (Cross-Industry)': 'Technology',
  'E-commerce/Tech': 'Technology',
  'SaaS/Customer Service': 'Technology',
  'Design Technology': 'Technology',
  'Tech Media': 'Media & Entertainment',
  'Consulting/Technology': 'Professional Services',
  'Financial Services': 'Finance',
  'Financial Services/Fintech': 'Finance',
  'Fintech': 'Finance',
  'Banking': 'Finance',
  'Banking/Finance': 'Finance',
  'Insurance': 'Finance',
  'Asset Management': 'Finance',
  'Payment/HR Software': 'Finance',
  'Payroll/HR Tech': 'Technology',
  'Payroll/HR Software': 'Technology',
  'Digital Media': 'Media & Entertainment',
  'News Media': 'Media & Entertainment',
  'Music Streaming': 'Media & Entertainment',
  'Sports Media': 'Media & Entertainment',
  'Gaming': 'Media & Entertainment',
  'Gaming/Game Engine': 'Media & Entertainment',
  'Retail': 'Retail & E-commerce',
  'Retail/Logistics': 'Retail & E-commerce',
  'Retail/Furniture': 'Retail & E-commerce',
  'Retail/Fashion': 'Retail & E-commerce',
  'Retail/Supermarket': 'Retail & E-commerce',
  'E-commerce': 'Retail & E-commerce',
  'E-commerce/Furniture': 'Retail & E-commerce',
  'E-commerce/Logistics': 'Retail & E-commerce',
  'Interior Design/E-commerce': 'Retail & E-commerce',
  'Freelance Marketplace': 'Retail & E-commerce',
  'Online Grocery/Robotics': 'Retail & E-commerce',
  'Automotive': 'Manufacturing',
  'Automotive/Manufacturing': 'Manufacturing',
  'Automotive/Logistics': 'Manufacturing',
  'Electronics Manufacturing': 'Manufacturing',
  'Chemical Manufacturing': 'Manufacturing',
  'Consumer Goods/Manufacturing': 'Manufacturing',
  'Manufacturing/Technology': 'Manufacturing',
  'Semiconductor Equipment': 'Manufacturing',
  'Pharmaceutical': 'Healthcare & Pharma',
  'Pharmaceutical/Agriculture': 'Healthcare & Pharma',
  'Pharmaceutical/Chemical': 'Healthcare & Pharma',
  'Healthcare/Radiology': 'Healthcare & Pharma',
  'Healthcare AI': 'Healthcare & Pharma',
  'Professional Services': 'Professional Services',
  'Management Consulting': 'Professional Services',
  'Consulting/Accounting': 'Professional Services',
  'Accounting/Consulting': 'Professional Services',
  'Legal': 'Professional Services',
  'Legal AI': 'AI & Machine Learning',
  'Government': 'Government',
  'Government/Tax': 'Government',
  'Government/Defense': 'Government',
  'Government/Healthcare': 'Government',
  'Government/Services': 'Government',
  'Government/Postal': 'Government',
  'Government/Social Services': 'Government',
  'Artificial Intelligence': 'AI & Machine Learning',
  'Artificial Intelligence/Data': 'AI & Machine Learning',
  'AI Developer Tools': 'AI & Machine Learning',
  'AI Coding': 'AI & Machine Learning',
  'Enterprise AI': 'AI & Machine Learning',
  'AI Content/Marketing': 'AI & Machine Learning',
  'AI Video Generation': 'AI & Machine Learning',
  'AI Video/3D': 'AI & Machine Learning',
  'AI Chips/Hardware': 'AI & Machine Learning',
  'AI Chips/Inference': 'AI & Machine Learning',
  'AI Chips/GPUs': 'AI & Machine Learning',
  'AI Infrastructure': 'AI & Machine Learning',
  'AI Research': 'AI & Machine Learning',
  'AI Writing Tools': 'AI & Machine Learning',
  'Defense AI': 'Defense',
  'Autonomous Vehicles': 'Robotics & Automation',
  'Humanoid Robotics': 'Robotics & Automation',
  'Robotics': 'Robotics & Automation',
  'Airlines': 'Transport & Logistics',
  'Logistics': 'Transport & Logistics',
  'Logistics/Freight': 'Transport & Logistics',
  'Shipping/Ports': 'Transport & Logistics',
  'Travel/Tech': 'Transport & Logistics',
  'Travel/Technology': 'Transport & Logistics',
  'Education Technology': 'Education',
  'Economic Research': 'Professional Services',
  'Real Estate/Technology': 'Technology',
}

export function normalizeIndustry(industry: string | null): string {
  if (!industry) return 'Technology'
  if ((PRIMARY_INDUSTRIES as readonly string[]).includes(industry)) return industry
  return industryNormMap[industry] || industry
}

export const brands: Record<BrandKey, BrandConfig> = {
  ailayoffs: {
    key: 'ailayoffs',
    name: 'AI Layoffs',
    tagline: 'Global AI Layoffs Tracker',
    description: 'The direct public counter tracking estimated jobs lost due to artificial intelligence — latest announcements, company breakdowns, and country data.',
    primaryColor: 'red',
    accentColor: 'amber',
    focusType: 'ai',
    domain: 'ailayoffs.com.au',
    heroHeading: 'Global AI Layoffs Tracker',
    heroSubheading: 'Estimated jobs lost due to AI, updated from public reporting',
    digestLabel: 'This Month in AI Layoffs',
    tone: 'direct, simple, accessible — the clearest public counter for general searchers',
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
    tagline: 'Tracking the Latest AI-Linked Job Cuts',
    description: 'Fast-moving coverage of AI-attributed workforce reductions — breaking updates, biggest cuts, and sharp event summaries.',
    primaryColor: 'orange',
    accentColor: 'yellow',
    focusType: 'ai',
    domain: 'aicuts.com.au',
    heroHeading: 'Live AI Cuts Tally',
    heroSubheading: 'Breaking AI workforce reductions and major cut events',
    digestLabel: 'Weekly AI Cuts Roundup',
    tone: 'punchy, headline-oriented, fast-moving — social-friendly with sharp summaries',
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
    tagline: 'The Research-Grade AI Layoff Tracker',
    description: 'An independent research tracker of AI-attributed job loss — built from public reporting with weighted attribution, confidence scoring, and transparent methodology.',
    primaryColor: 'blue',
    accentColor: 'cyan',
    focusType: 'both',
    domain: 'ailayoffwatch.com',
    heroHeading: 'Tracking AI-Attributed Job Loss Globally',
    heroSubheading: 'Conservative, core, and upper estimates built from public reporting and weighted attribution review',
    digestLabel: 'Monthly Research Summary',
    tone: 'research-led, data-journalism, credible — the flagship authority for journalists and researchers',
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
    tagline: 'Robot & Automation Displacement Tracker',
    description: 'Tracking job loss linked to robots, warehouse automation, manufacturing systems, and physical AI — by industry and geography.',
    primaryColor: 'purple',
    accentColor: 'violet',
    focusType: 'robot',
    domain: 'robotlayoffs.com',
    heroHeading: 'Robot & Automation Job Displacement',
    heroSubheading: 'Tracking workforce loss from robotics, warehouse automation, and physical AI systems',
    digestLabel: 'Monthly Automation Report',
    tone: 'future-of-work, industry-specific, practical — focused on physical automation and robotics',
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
