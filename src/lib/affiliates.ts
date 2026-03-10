// Affiliate partner configuration
// Tracking URLs will be updated once affiliate accounts are active

export interface AffiliatePartner {
  id: string
  name: string
  url: string // base URL, will be replaced with tracking URL later
  category: 'training' | 'career' | 'tool'
  bestFor: string[]
  industries: string[] // empty = all
}

export const affiliatePartners: Record<string, AffiliatePartner> = {
  coursera: {
    id: 'coursera', name: 'Coursera', url: 'https://www.coursera.org',
    category: 'training',
    bestFor: ['AI literacy', 'data analytics', 'business skills', 'career switching', 'professional certificates'],
    industries: [],
  },
  udemy: {
    id: 'udemy', name: 'Udemy', url: 'https://www.udemy.com',
    category: 'training',
    bestFor: ['flexible courses', 'broad skills', 'AI tools', 'prompt engineering', 'no-code automation'],
    industries: [],
  },
  datacamp: {
    id: 'datacamp', name: 'DataCamp', url: 'https://www.datacamp.com',
    category: 'training',
    bestFor: ['analytics', 'data science', 'Python', 'technical transitions', 'SQL'],
    industries: ['Technology', 'Finance'],
  },
  codecademy: {
    id: 'codecademy', name: 'Codecademy', url: 'https://www.codecademy.com',
    category: 'training',
    bestFor: ['coding pathways', 'software upskilling', 'web development', 'programming basics'],
    industries: ['Technology'],
  },
  edx: {
    id: 'edx', name: 'edX', url: 'https://www.edx.org',
    category: 'training',
    bestFor: ['formal education', 'university courses', 'technical pathways', 'professional development'],
    industries: [],
  },
  pluralsight: {
    id: 'pluralsight', name: 'Pluralsight', url: 'https://www.pluralsight.com',
    category: 'training',
    bestFor: ['engineering', 'IT', 'developer upskilling', 'cloud computing', 'DevOps'],
    industries: ['Technology'],
  },
  skillshare: {
    id: 'skillshare', name: 'Skillshare', url: 'https://www.skillshare.com',
    category: 'training',
    bestFor: ['creative skills', 'design', 'business', 'generalist development', 'visual communication'],
    industries: ['Media & Entertainment'],
  },
  resumeio: {
    id: 'resumeio', name: 'Resume.io', url: 'https://resume.io',
    category: 'career',
    bestFor: ['resume improvement', 'job transition', 'cover letters', 'career documents'],
    industries: [],
  },
  perplexity: {
    id: 'perplexity', name: 'Perplexity', url: 'https://www.perplexity.ai',
    category: 'tool',
    bestFor: ['research tools', 'knowledge work', 'information gathering', 'faster research'],
    industries: [],
  },
  base44: {
    id: 'base44', name: 'Base44', url: 'https://www.base44.com',
    category: 'tool',
    bestFor: ['builder tools', 'rapid prototyping', 'no-code apps', 'productivity workflows'],
    industries: ['Technology'],
  },
}

// Phrase-to-partner mapping for inline links
// Maps common contextual phrases to relevant affiliate partners
export interface PhraseLinkMapping {
  phrase: string
  partnerId: string
  contexts: string[] // article types or topics where this is relevant
}

export const phraseMappings: PhraseLinkMapping[] = [
  // Training phrases
  { phrase: 'upskilling', partnerId: 'coursera', contexts: ['all'] },
  { phrase: 'training', partnerId: 'coursera', contexts: ['all'] },
  { phrase: 'retraining', partnerId: 'udemy', contexts: ['all'] },
  { phrase: 'skill development', partnerId: 'coursera', contexts: ['all'] },
  { phrase: 'AI skills', partnerId: 'datacamp', contexts: ['tech', 'finance'] },
  { phrase: 'coding skills', partnerId: 'codecademy', contexts: ['tech'] },
  { phrase: 'analytics training', partnerId: 'datacamp', contexts: ['finance', 'tech'] },
  { phrase: 'automation skills', partnerId: 'pluralsight', contexts: ['tech', 'manufacturing'] },
  { phrase: 'digital skills', partnerId: 'skillshare', contexts: ['all'] },
  { phrase: 'technical training', partnerId: 'pluralsight', contexts: ['tech'] },
  { phrase: 'creative training', partnerId: 'skillshare', contexts: ['media'] },
  { phrase: 'leadership training', partnerId: 'edx', contexts: ['all'] },
  { phrase: 'career transition', partnerId: 'resumeio', contexts: ['all'] },
  { phrase: 'learn new skills', partnerId: 'coursera', contexts: ['all'] },

  // Tool phrases
  { phrase: 'resume tools', partnerId: 'resumeio', contexts: ['all'] },
  { phrase: 'research tools', partnerId: 'perplexity', contexts: ['all'] },
  { phrase: 'workflow tools', partnerId: 'perplexity', contexts: ['all'] },
  { phrase: 'AI tools', partnerId: 'perplexity', contexts: ['all'] },
  { phrase: 'builder tools', partnerId: 'base44', contexts: ['tech'] },
  { phrase: 'productivity tools', partnerId: 'perplexity', contexts: ['all'] },
  { phrase: 'job search help', partnerId: 'resumeio', contexts: ['all'] },
]

// Get the affiliate URL for a partner (will be tracking URL once set up)
export function getAffiliateUrl(partnerId: string): string {
  const partner = affiliatePartners[partnerId]
  return partner?.url || '#'
}

// Get relevant partners for a given industry/topic
export function getRelevantPartners(industry?: string, topic?: string): AffiliatePartner[] {
  return Object.values(affiliatePartners).filter(p => {
    if (p.industries.length === 0) return true
    if (industry && p.industries.some(i => industry.toLowerCase().includes(i.toLowerCase()))) return true
    return false
  })
}

// Get recommendation set for article-end module (max 3)
export function getArticleRecommendations(industry?: string): { training: AffiliatePartner; career: AffiliatePartner; tool: AffiliatePartner } {
  const relevant = getRelevantPartners(industry)
  return {
    training: relevant.find(p => p.category === 'training') || affiliatePartners.coursera,
    career: affiliatePartners.resumeio,
    tool: relevant.find(p => p.category === 'tool') || affiliatePartners.perplexity,
  }
}
