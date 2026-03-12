/**
 * Source reputation scoring.
 *
 * Tier 1 (score 1.0)  — Major global outlets: auto-trusted
 * Tier 2 (score 0.8)  — Strong regional/industry sources: trusted with basic checks
 * Tier 3 (score 0.6)  — Mid-tier outlets: need reasonable confidence from LLM
 * Unknown  (score 0.3) — Never seen before: high scrutiny, need strong evidence
 * Blocked  (score 0.0) — Known junk: always rejected
 */

// Tier 1: Major global news outlets — universally trusted
const TIER_1: string[] = [
  // Wire services
  'reuters.com', 'apnews.com', 'afp.com',
  // US majors
  'nytimes.com', 'washingtonpost.com', 'wsj.com', 'bloomberg.com',
  'cnbc.com', 'cnn.com', 'nbcnews.com', 'abcnews.go.com', 'cbsnews.com',
  'usatoday.com', 'latimes.com', 'chicagotribune.com',
  // UK majors
  'bbc.com', 'bbc.co.uk', 'theguardian.com', 'ft.com', 'telegraph.co.uk',
  'independent.co.uk', 'sky.com',
  // Business/finance
  'forbes.com', 'fortune.com', 'businessinsider.com', 'insider.com',
  'marketwatch.com', 'barrons.com', 'economist.com',
  // Tech
  'techcrunch.com', 'theverge.com', 'arstechnica.com', 'wired.com',
  'zdnet.com', 'cnet.com', 'engadget.com', 'thenextweb.com',
  'venturebeat.com', 'theinformation.com', 'protocol.com',
  // Australia
  'abc.net.au', 'smh.com.au', 'theaustralian.com.au', 'news.com.au',
  'afr.com', 'sbs.com.au', 'theguardian.com.au', '9news.com.au',
  // Canada
  'globalnews.ca', 'cbc.ca', 'theglobeandmail.com',
  // Other international
  'aljazeera.com', 'dw.com', 'france24.com', 'scmp.com',
  'nikkei.com', 'straitstimes.com', 'hindustantimes.com',
  'timesofindia.indiatimes.com', 'ndtv.com',
]

// Tier 2: Strong regional, industry, and specialist sources
const TIER_2: string[] = [
  // US regional
  'sfchronicle.com', 'mercurynews.com', 'seattletimes.com',
  'bostonglobe.com', 'dallasnews.com', 'denverpost.com',
  'startribune.com', 'oregonlive.com', 'ajc.com',
  'detroitnews.com', 'freep.com', 'tampabay.com',
  // Tech/business specialist
  'semafor.com', 'axios.com', 'politico.com', 'thehill.com',
  'fastcompany.com', 'inc.com', 'entrepreneur.com',
  'hbr.org', 'mitsloan.mit.edu', 'techmonitor.ai',
  // HR/workforce specialist
  'shrm.org', 'hrdive.com', 'workforceinstitute.org',
  'personneltoday.com', 'peoplemanagement.co.uk',
  // Industry
  'fierceelectronics.com', 'therobotreport.com', 'automationworld.com',
  'industryweek.com', 'manufacturingdive.com',
  // Finance
  'seekingalpha.com', 'fool.com', 'investopedia.com',
  'morningstar.com', 'thestreet.com',
  // Government/institutional
  'bls.gov', 'dol.gov', 'sec.gov', 'congress.gov',
  'whitehouse.gov', 'europarl.europa.eu',
  // Research
  'mckinsey.com', 'bcg.com', 'bain.com', 'deloitte.com',
  'pwc.com', 'accenture.com', 'gartner.com', 'forrester.com',
  // Australia specialist
  'itnews.com.au', 'zdnet.com.au', 'computerworld.com.au',
  'theconversation.com', 'crikey.com.au',
]

// Tier 3: Mid-tier — decent outlets but need more scrutiny
const TIER_3: string[] = [
  'yahoo.com', 'msn.com', 'huffpost.com', 'vox.com',
  'salon.com', 'slate.com', 'vice.com', 'buzzfeednews.com',
  'dailymail.co.uk', 'nypost.com', 'foxnews.com', 'foxbusiness.com',
  'newsweek.com', 'theatlantic.com', 'newyorker.com',
  'livemint.com', 'moneycontrol.com', 'economictimes.com',
  'gadgets360.com', 'techradar.com', 'tomshardware.com',
  'pcmag.com', 'gizmodo.com', 'lifehacker.com',
  'pymnts.com', 'calcalistech.com', 'technode.com',
]

// Blocked: known junk, content farms, AI-generated sites
const BLOCKED_PATTERNS: RegExp[] = [
  /\.edu\/exp\//,           // university content farms
  /blogspot\./,             // personal blogs
  /wordpress\.com/,         // free wordpress blogs (not self-hosted)
  /\.wixsite\.com/,         // wix free sites
  /sites\.google\.com/,     // google sites
  /tumblr\.com/,            // tumblr
  /livejournal\.com/,       // livejournal
  /angelfire\.com/,         // angelfire
  /geocities/,              // geocities
  /buzzfeed\.com(?!news)/,  // buzzfeed (not buzzfeednews)
]

export interface SourceReputation {
  tier: 1 | 2 | 3 | 'unknown' | 'blocked'
  score: number
  domain: string
  /** Minimum LLM confidence required for this source tier */
  minConfidence: number
  /** Whether the event needs a specific job count (not just "layoffs") */
  requiresJobCount: boolean
  /** Whether multiple corroborating sources should be checked */
  requiresCorroboration: boolean
}

export function getSourceReputation(url: string): SourceReputation {
  const domain = new URL(url).hostname.replace(/^www\./, '')

  // Check blocked patterns first
  if (BLOCKED_PATTERNS.some(p => p.test(url))) {
    return { tier: 'blocked', score: 0, domain, minConfidence: 1, requiresJobCount: true, requiresCorroboration: true }
  }

  // Check tiers by domain (also check parent domain for subdomains)
  const domainParts = domain.split('.')
  const parentDomain = domainParts.slice(-2).join('.')

  if (TIER_1.includes(domain) || TIER_1.includes(parentDomain)) {
    return { tier: 1, score: 1.0, domain, minConfidence: 0.3, requiresJobCount: false, requiresCorroboration: false }
  }

  if (TIER_2.includes(domain) || TIER_2.includes(parentDomain)) {
    return { tier: 2, score: 0.8, domain, minConfidence: 0.4, requiresJobCount: false, requiresCorroboration: false }
  }

  if (TIER_3.includes(domain) || TIER_3.includes(parentDomain)) {
    return { tier: 3, score: 0.6, domain, minConfidence: 0.5, requiresJobCount: false, requiresCorroboration: false }
  }

  // Unknown source — high scrutiny
  return {
    tier: 'unknown',
    score: 0.3,
    domain,
    minConfidence: 0.7,
    requiresJobCount: true,
    requiresCorroboration: true,
  }
}
