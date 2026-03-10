// Map company names to their actual domains for Clearbit logos
const companyDomains: Record<string, string> = {
  // Tech
  'Klarna': 'klarna.com',
  'Dropbox': 'dropbox.com',
  'IBM': 'ibm.com',
  'Meta': 'meta.com',
  'Meta (Reality Labs)': 'meta.com',
  'SAP': 'sap.com',
  'Google': 'google.com',
  'Microsoft': 'microsoft.com',
  'Salesforce': 'salesforce.com',
  'Dell': 'dell.com',
  'Intel': 'intel.com',
  'Cisco': 'cisco.com',
  'Amazon': 'amazon.com',
  'Shopify': 'shopify.com',
  'Intuit': 'intuit.com',
  'Workday': 'workday.com',
  'Fiverr': 'fiverr.com',
  'Freshworks': 'freshworks.com',
  'eBay': 'ebay.com',
  'Wayfair': 'wayfair.com',
  'Dukaan': 'mydukaan.io',
  'Paycom': 'paycom.com',
  'Expedia': 'expedia.com',
  'Oracle': 'oracle.com',
  'Unity Technologies': 'unity.com',
  'Pinterest': 'pinterest.com',
  'Block': 'block.xyz',

  // Media
  'BuzzFeed': 'buzzfeed.com',
  'CNET': 'cnet.com',
  'Sports Illustrated': 'si.com',
  'Washington Post': 'washingtonpost.com',
  'Chegg': 'chegg.com',
  'Duolingo': 'duolingo.com',

  // Finance
  'JPMorgan Chase': 'jpmorganchase.com',
  'Goldman Sachs': 'goldmansachs.com',
  'Deutsche Bank': 'db.com',
  'Citigroup': 'citigroup.com',
  'BNP Paribas': 'bnpparibas.com',
  'ABN Amro': 'abnamro.com',
  'HSBC': 'hsbc.com',
  'Commonwealth Bank': 'commbank.com.au',
  'Morgan Stanley': 'morganstanley.com',
  'BlackRock': 'blackrock.com',
  'PayPal': 'paypal.com',
  'Acrisure': 'acrisure.com',
  'Allianz Partners': 'allianz.com',

  // Telecom
  'BT Group': 'bt.com',
  'Ericsson': 'ericsson.com',
  'Vodafone': 'vodafone.com',
  'Lumen Technologies': 'lumen.com',
  'Verizon': 'verizon.com',
  'AT&T': 'att.com',
  'Nokia': 'nokia.com',
  'Telstra': 'telstra.com.au',

  // Manufacturing
  'BMW': 'bmw.com',
  'Tesla': 'tesla.com',
  'Foxconn': 'foxconn.com',
  'Adidas': 'adidas.com',
  'Samsung': 'samsung.com',
  'Siemens': 'siemens.com',
  'Bosch': 'bosch.com',
  'Dow Chemical': 'dow.com',
  'Bayer': 'bayer.com',
  'Novartis': 'novartis.com',
  'Ocado': 'ocado.com',
  'ASML': 'asml.com',

  // Retail
  'H&M': 'hm.com',
  'Walmart': 'walmart.com',
  'UPS': 'ups.com',

  // Professional Services
  'Baker McKenzie': 'bakermckenzie.com',
  'Accenture': 'accenture.com',
  'PwC': 'pwc.com',
  'KPMG': 'kpmg.com',
  'Deloitte': 'deloitte.com',
  'BP': 'bp.com',

  // IT Services
  'Tata Consultancy Services': 'tcs.com',
  'Infosys': 'infosys.com',
  'Wipro': 'wipro.com',
  'Cognizant': 'cognizant.com',

  // Gaming
  'EA (Electronic Arts)': 'ea.com',

  // Transport
  'CrowdStrike': 'crowdstrike.com',
  'Omnicom': 'omnicomgroup.com',
  'HP': 'hp.com',
  'FedEx': 'fedex.com',
  'Southwest Airlines': 'southwest.com',
  'Panasonic': 'panasonic.com',
  'Mastercard': 'mastercard.com',
  'Banco Santander': 'santander.com',
  'United Airlines': 'united.com',
  'American Airlines': 'aa.com',
  'C.H. Robinson': 'chrobinson.com',

  // Government
  'IRS (US Internal Revenue Service)': 'irs.gov',
  'USPS': 'usps.com',
  'Social Security Administration': 'ssa.gov',
  'Department of Veterans Affairs': 'va.gov',
  'UK Cabinet Office': 'gov.uk',
  'CRA (Canada Revenue Agency)': 'canada.ca',
  'Services Australia': 'servicesaustralia.gov.au',

  // AI Companies
  'OpenAI': 'openai.com',
  'Anthropic': 'anthropic.com',
  'Google DeepMind': 'deepmind.google',
  'Midjourney': 'midjourney.com',
  'Stability AI': 'stability.ai',
  'Cohere': 'cohere.com',
  'Mistral AI': 'mistral.ai',
  'Hugging Face': 'huggingface.co',
  'xAI': 'x.ai',
  'Perplexity AI': 'perplexity.ai',
  'Runway ML': 'runwayml.com',
  'Scale AI': 'scale.com',
  'Databricks': 'databricks.com',
  'NVIDIA': 'nvidia.com',
  'Anduril Industries': 'anduril.com',
  'Shield AI': 'shield.ai',
  'Waymo': 'waymo.com',
  'Figure AI': 'figure.ai',
  'Boston Dynamics': 'bostondynamics.com',
  'Cerebras Systems': 'cerebras.ai',
  'Groq': 'groq.com',
  'Synthesia': 'synthesia.io',
  'Harvey AI': 'harvey.ai',
  'Anysphere (Cursor)': 'cursor.com',
  'Replit': 'replit.com',
  'DeepSeek': 'deepseek.com',
  'Glean': 'glean.com',
  'Abridge AI': 'abridge.com',
  'WiseTech Global': 'wisetechglobal.com',
  'Livspace': 'livspace.com',
  'Sakana AI': 'sakana.ai',

  // More AI
  'SambaNova Systems': 'sambanova.ai',
  'Aurora Innovation': 'aurora.tech',
  'Luma AI': 'lumalabs.ai',
  'Pika': 'pika.art',
  'Writer': 'writer.com',
  'Copy.ai': 'copy.ai',
  'Poolside AI': 'poolside.ai',
  'Character.AI': 'character.ai',
  'Jasper AI': 'jasper.ai',
  'AI21 Labs': 'ai21.com',
  'Aleph Alpha': 'aleph-alpha.com',
  'SenseTime': 'sensetime.com',
  'Together AI': 'together.ai',
  'Adept AI': 'adept.ai',
  'Replicate': 'replicate.com',
  'Weights & Biases': 'wandb.ai',
  'Inflection AI': 'inflection.ai',
}

// Industry-based fallback images from Unsplash (free, no API key needed)
const industryImages: Record<string, string> = {
  'Technology': 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=200&fit=crop',
  'Banking': 'https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?w=400&h=200&fit=crop',
  'Financial Services': 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=200&fit=crop',
  'Insurance': 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=200&fit=crop',
  'Asset Management': 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=200&fit=crop',
  'Telecommunications': 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=200&fit=crop',
  'Manufacturing': 'https://images.unsplash.com/photo-1565043666747-69f6646db940?w=400&h=200&fit=crop',
  'Automotive': 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=200&fit=crop',
  'Healthcare': 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=200&fit=crop',
  'Pharmaceutical': 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=400&h=200&fit=crop',
  'Retail': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=200&fit=crop',
  'E-commerce': 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=200&fit=crop',
  'Government': 'https://images.unsplash.com/photo-1523292562811-8fa7962a78c8?w=400&h=200&fit=crop',
  'Legal': 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=200&fit=crop',
  'Media': 'https://images.unsplash.com/photo-1504711434969-e33886168d6c?w=400&h=200&fit=crop',
  'Digital Media': 'https://images.unsplash.com/photo-1504711434969-e33886168d6c?w=400&h=200&fit=crop',
  'Gaming': 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&h=200&fit=crop',
  'Airlines': 'https://images.unsplash.com/photo-1436491865332-7a61a109db05?w=400&h=200&fit=crop',
  'Logistics': 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=200&fit=crop',
  'AI': 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=200&fit=crop',
  'Robotics': 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=200&fit=crop',
  'Defense': 'https://images.unsplash.com/photo-1580752300992-559f8e0734e0?w=400&h=200&fit=crop',
  'Autonomous Vehicles': 'https://images.unsplash.com/photo-1549317661-bd32c8ce0aca?w=400&h=200&fit=crop',
  'Consulting': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=200&fit=crop',
  'IT Services': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=200&fit=crop',
  'default': 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&h=200&fit=crop',
}

export function getCompanyLogoUrl(companyName: string | null): string {
  if (!companyName) return ''
  const domain = companyDomains[companyName]
  if (domain) return `https://logo.clearbit.com/${domain}?size=200`
  // Try fuzzy match
  const lower = companyName.toLowerCase()
  for (const [name, d] of Object.entries(companyDomains)) {
    if (lower.includes(name.toLowerCase()) || name.toLowerCase().includes(lower)) {
      return `https://logo.clearbit.com/${d}?size=200`
    }
  }
  return ''
}

export function getIndustryImageUrl(industry: string | null): string {
  if (!industry) return industryImages.default
  // Direct match
  if (industryImages[industry]) return industryImages[industry]
  // Partial match
  const lower = industry.toLowerCase()
  for (const [key, url] of Object.entries(industryImages)) {
    if (lower.includes(key.toLowerCase()) || key.toLowerCase().includes(lower)) {
      return url
    }
  }
  return industryImages.default
}
