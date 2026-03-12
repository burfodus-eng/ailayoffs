export interface SourceSeed {
  name: string; url: string; type: string; category: string;
  region?: string; country?: string; language?: string; description?: string;
  tier: number; checkFrequency?: string; hasApi?: boolean; hasRss?: boolean;
  rssUrl?: string; paywalled?: boolean;
}

export const extendedSources: SourceSeed[] = [
  // ═══════════════════════════════════════════════════════════
  // INDUSTRY TRADE PUBLICATIONS — Banking / Finance
  // ═══════════════════════════════════════════════════════════
  { name: 'Global Banking & Finance Review', url: 'https://globalbankingandfinance.com', type: 'industry', category: 'ai_layoffs', region: 'Global', tier: 3, checkFrequency: 'weekly', description: 'Global banking workforce trends, covered Block AI layoffs.' },
  { name: 'FinTech Weekly', url: 'https://fintechweekly.com', type: 'industry', category: 'ai_layoffs', region: 'Global', tier: 4, checkFrequency: 'weekly', description: 'Fintech restructuring coverage newsletter.' },
  { name: 'CFO Dive', url: 'https://cfodive.com', type: 'industry', category: 'ai_layoffs', region: 'US', tier: 3, checkFrequency: 'weekly', description: 'Challenger data analysis, underreporting of AI cuts.' },
  { name: 'Global Finance Magazine', url: 'https://gfmag.com', type: 'industry', category: 'ai_layoffs', region: 'Global', tier: 4, checkFrequency: 'monthly', description: 'AI + tariffs driving layoffs coverage.' },
  { name: 'The Banker', url: 'https://thebanker.com', type: 'industry', category: 'ai_layoffs', region: 'Global', tier: 4, checkFrequency: 'monthly', paywalled: true, description: 'FT-owned, global banking workforce trends.' },
  { name: 'Euromoney', url: 'https://euromoney.com', type: 'industry', category: 'ai_layoffs', region: 'Europe', tier: 4, checkFrequency: 'monthly', paywalled: true, description: 'European finance sector restructuring.' },
  { name: 'Risk.net', url: 'https://risk.net', type: 'industry', category: 'ai_layoffs', region: 'Global', tier: 4, checkFrequency: 'monthly', paywalled: true, description: 'Risk/compliance automation impact.' },
  { name: 'Banking Technology', url: 'https://bankingtech.com', type: 'industry', category: 'ai_layoffs', region: 'Global', tier: 4, checkFrequency: 'weekly', description: 'Bank IT transformation and headcount changes.' },
  { name: 'Asian Banker', url: 'https://theasianbanker.com', type: 'industry', category: 'ai_layoffs', region: 'Asia-Pacific', tier: 4, checkFrequency: 'monthly', description: 'Asia-Pacific banking workforce trends.' },

  // ═══════════════════════════════════════════════════════════
  // INDUSTRY TRADE PUBLICATIONS — Telecom
  // ═══════════════════════════════════════════════════════════
  { name: 'Light Reading', url: 'https://lightreading.com', type: 'industry', category: 'both', region: 'Global', tier: 3, checkFrequency: 'weekly', description: 'Telecom industry news, workforce changes.' },
  { name: 'Fierce Telecom', url: 'https://fierce-telecom.com', type: 'industry', category: 'both', region: 'Global', tier: 3, checkFrequency: 'weekly', description: 'Telecom restructuring, operator layoffs.' },
  { name: 'Total Telecom', url: 'https://totaltele.com', type: 'industry', category: 'both', region: 'Global', tier: 4, checkFrequency: 'weekly', description: 'Global telecom workforce coverage.' },
  { name: 'Telecoms.com', url: 'https://telecoms.com', type: 'industry', category: 'both', region: 'Global', tier: 4, checkFrequency: 'weekly', description: 'Operator business transformation.' },
  { name: 'Capacity Media', url: 'https://capacitymedia.com', type: 'industry', category: 'both', region: 'Global', tier: 4, checkFrequency: 'weekly', description: 'Wholesale telecom, infrastructure workforce.' },

  // ═══════════════════════════════════════════════════════════
  // INDUSTRY TRADE PUBLICATIONS — Manufacturing / Automotive
  // ═══════════════════════════════════════════════════════════
  { name: 'Manufacturing.net', url: 'https://manufacturing.net', type: 'industry', category: 'robot_automation', region: 'US', tier: 3, checkFrequency: 'weekly', description: 'Factory automation impact on workforce.' },
  { name: 'Assembly Magazine', url: 'https://assemblymag.com', type: 'industry', category: 'robot_automation', region: 'US', tier: 4, checkFrequency: 'monthly', description: 'Assembly line automation, robotics deployment.' },
  { name: 'Plant Engineering', url: 'https://plantengineering.com', type: 'industry', category: 'robot_automation', region: 'US', tier: 4, checkFrequency: 'monthly', description: 'Plant-level automation decisions.' },
  { name: 'Automotive Dive', url: 'https://industrydive.com/automotive', type: 'industry', category: 'robot_automation', region: 'US', tier: 3, checkFrequency: 'weekly', description: 'Automotive industry restructuring and automation.' },
  { name: 'Just Auto', url: 'https://just-auto.com', type: 'industry', category: 'robot_automation', region: 'Global', tier: 4, checkFrequency: 'weekly', description: 'Global automotive restructuring.' },

  // ═══════════════════════════════════════════════════════════
  // INDUSTRY TRADE PUBLICATIONS — Retail / E-commerce
  // ═══════════════════════════════════════════════════════════
  { name: 'Retail Gazette', url: 'https://retailgazette.co.uk', type: 'industry', category: 'robot_automation', region: 'UK', country: 'GB', tier: 4, checkFrequency: 'weekly', description: 'UK retail workforce changes.' },
  { name: 'Modern Retail', url: 'https://modernretail.co', type: 'industry', category: 'ai_layoffs', region: 'US', tier: 4, checkFrequency: 'weekly', description: 'E-commerce automation, DTC brand cuts.' },
  { name: 'Grocery Dive', url: 'https://grocerydive.com', type: 'industry', category: 'robot_automation', region: 'US', tier: 4, checkFrequency: 'weekly', description: 'Grocery/food retail automation.' },
  { name: 'Inside Retail', url: 'https://insideretail.com.au', type: 'industry', category: 'robot_automation', region: 'Asia-Pacific', country: 'AU', tier: 4, checkFrequency: 'weekly', description: 'Australia/Asia-Pacific retail workforce.' },
  { name: 'Retail Week', url: 'https://retailweek.com', type: 'industry', category: 'robot_automation', region: 'Europe', country: 'GB', tier: 4, checkFrequency: 'weekly', description: 'UK/European retail workforce.' },
  { name: 'Chain Store Age', url: 'https://chainstoreage.com', type: 'industry', category: 'robot_automation', region: 'US', tier: 4, checkFrequency: 'weekly', description: 'US retail operations and automation.' },
  { name: 'eMarketer/Insider Intelligence', url: 'https://emarketer.com', type: 'research', category: 'ai_layoffs', region: 'Global', tier: 4, checkFrequency: 'monthly', paywalled: true, description: 'E-commerce trends, digital workforce research.' },

  // ═══════════════════════════════════════════════════════════
  // INDUSTRY TRADE PUBLICATIONS — Healthcare
  // ═══════════════════════════════════════════════════════════
  { name: 'Medical Economics', url: 'https://medicaleconomics.com', type: 'industry', category: 'ai_layoffs', region: 'US', tier: 4, checkFrequency: 'monthly', description: 'Reports healthcare largely immune to AI layoffs so far.' },
  { name: 'Becker\'s Payer Issues', url: 'https://beckerspayer.com', type: 'industry', category: 'ai_layoffs', region: 'US', tier: 3, checkFrequency: 'weekly', description: 'Health insurer workforce cuts.' },
  { name: 'Healthcare Finance News', url: 'https://healthcarefinancenews.com', type: 'industry', category: 'ai_layoffs', region: 'US', tier: 4, checkFrequency: 'weekly', description: 'Health system restructuring.' },
  { name: 'Fierce Healthcare', url: 'https://fiercehealthcare.com', type: 'industry', category: 'ai_layoffs', region: 'US', tier: 3, checkFrequency: 'weekly', description: 'US health system operations and AI adoption.' },
  { name: 'Health Service Journal', url: 'https://hsj.co.uk', type: 'industry', category: 'ai_layoffs', region: 'UK', country: 'GB', tier: 4, checkFrequency: 'weekly', paywalled: true, description: 'UK NHS workforce, AI adoption.' },
  { name: 'Australian Health Review', url: 'https://publish.csiro.au/ah', type: 'research', category: 'ai_layoffs', region: 'Asia-Pacific', country: 'AU', tier: 5, checkFrequency: 'quarterly', description: 'Australian healthcare workforce studies.' },
  { name: 'BMJ', url: 'https://bmj.com', type: 'research', category: 'ai_layoffs', region: 'Global', tier: 4, checkFrequency: 'monthly', description: 'Global health workforce studies.' },
  { name: 'Pulse+IT', url: 'https://pulseitmagazine.com.au', type: 'industry', category: 'ai_layoffs', region: 'Asia-Pacific', country: 'AU', tier: 5, checkFrequency: 'monthly', description: 'Australian health IT.' },

  // ═══════════════════════════════════════════════════════════
  // INDUSTRY TRADE PUBLICATIONS — Legal
  // ═══════════════════════════════════════════════════════════
  { name: 'Legal Cheek', url: 'https://legalcheek.com', type: 'industry', category: 'ai_layoffs', region: 'UK', country: 'GB', tier: 4, checkFrequency: 'weekly', description: 'UK law firm restructuring.' },
  { name: 'The American Lawyer', url: 'https://americanlawyer.com', type: 'industry', category: 'ai_layoffs', region: 'US', tier: 4, checkFrequency: 'monthly', paywalled: true, description: 'Am Law 200 firm workforce changes.' },
  { name: 'National Law Review', url: 'https://natlawreview.com', type: 'industry', category: 'ai_layoffs', region: 'US', tier: 4, checkFrequency: 'weekly', description: 'AI employment law analysis.' },
  { name: 'Legal Futures', url: 'https://legalfutures.co.uk', type: 'industry', category: 'ai_layoffs', region: 'UK', country: 'GB', tier: 4, checkFrequency: 'weekly', description: 'UK/global legal market transformation.' },

  // ═══════════════════════════════════════════════════════════
  // INDUSTRY TRADE PUBLICATIONS — Accounting / Professional Services
  // ═══════════════════════════════════════════════════════════
  { name: 'Accounting Today', url: 'https://accountingtoday.com', type: 'industry', category: 'ai_layoffs', region: 'US', tier: 4, checkFrequency: 'weekly', description: 'Big 4 and mid-tier firm restructuring.' },
  { name: 'Journal of Accountancy', url: 'https://journalofaccountancy.com', type: 'industry', category: 'ai_layoffs', region: 'US', tier: 4, checkFrequency: 'monthly', description: 'AICPA publication, automation impact.' },
  { name: 'Accountancy Age', url: 'https://accountancyage.com', type: 'industry', category: 'ai_layoffs', region: 'UK', country: 'GB', tier: 4, checkFrequency: 'weekly', description: 'UK accounting workforce.' },
  { name: 'Consulting Magazine', url: 'https://consultingmag.com', type: 'industry', category: 'ai_layoffs', region: 'US', tier: 4, checkFrequency: 'monthly', description: 'Consulting firm headcount changes.' },
  { name: 'Management Consulted', url: 'https://managementconsulted.com', type: 'industry', category: 'ai_layoffs', region: 'US', tier: 5, checkFrequency: 'monthly', description: 'McKinsey, BCG, Bain workforce trends.' },

  // ═══════════════════════════════════════════════════════════
  // INDUSTRY TRADE PUBLICATIONS — Education
  // ═══════════════════════════════════════════════════════════
  { name: 'Times Higher Education', url: 'https://timeshighereducation.com', type: 'industry', category: 'ai_layoffs', region: 'Global', tier: 4, checkFrequency: 'weekly', description: 'AI reshaping academic employment.' },
  { name: 'Chronicle of Higher Education', url: 'https://chronicle.com', type: 'industry', category: 'ai_layoffs', region: 'US', tier: 4, checkFrequency: 'weekly', paywalled: true, description: 'US university workforce.' },
  { name: 'Inside Higher Ed', url: 'https://insidehighered.com', type: 'industry', category: 'ai_layoffs', region: 'US', tier: 4, checkFrequency: 'weekly', description: 'Higher ed layoffs and restructuring.' },
  { name: 'EdSurge', url: 'https://edsurge.com', type: 'industry', category: 'ai_layoffs', region: 'US', tier: 3, checkFrequency: 'weekly', description: 'EdTech workforce — Chegg cut 45% of staff.' },
  { name: 'Education Dive', url: 'https://educationdive.com', type: 'industry', category: 'ai_layoffs', region: 'US', tier: 4, checkFrequency: 'weekly', description: 'K-12 and higher ed workforce.' },

  // ═══════════════════════════════════════════════════════════
  // INDUSTRY TRADE PUBLICATIONS — Media / Journalism
  // ═══════════════════════════════════════════════════════════
  { name: 'Nieman Lab', url: 'https://niemanlab.org', type: 'industry', category: 'ai_layoffs', region: 'US', tier: 3, checkFrequency: 'weekly', description: 'Harvard — future of journalism, AI impact on newsrooms.' },
  { name: 'Digiday', url: 'https://digiday.com', type: 'industry', category: 'ai_layoffs', region: 'US', tier: 3, checkFrequency: 'weekly', description: 'Digital media and publishing workforce.' },
  { name: 'The Drum', url: 'https://thedrum.com', type: 'industry', category: 'ai_layoffs', region: 'Global', tier: 4, checkFrequency: 'weekly', description: 'Advertising/media industry workforce.' },
  { name: 'Publishers Weekly', url: 'https://publishersweekly.com', type: 'industry', category: 'ai_layoffs', region: 'US', tier: 4, checkFrequency: 'weekly', description: 'Book publishing workforce.' },
  { name: 'Poynter Institute', url: 'https://poynter.org', type: 'industry', category: 'ai_layoffs', region: 'US', tier: 4, checkFrequency: 'weekly', description: 'Journalism industry health.' },

  // ═══════════════════════════════════════════════════════════
  // INDUSTRY TRADE PUBLICATIONS — Advertising / Marketing
  // ═══════════════════════════════════════════════════════════
  { name: 'Ad Age', url: 'https://adage.com', type: 'industry', category: 'ai_layoffs', region: 'US', tier: 3, checkFrequency: 'weekly', description: 'Agency restructuring, AI creative tools displacing workers.' },
  { name: 'Adweek', url: 'https://adweek.com', type: 'industry', category: 'ai_layoffs', region: 'US', tier: 3, checkFrequency: 'weekly', description: 'Agency layoffs, programmatic displacement.' },
  { name: 'Campaign', url: 'https://campaignlive.co.uk', type: 'industry', category: 'ai_layoffs', region: 'UK', country: 'GB', tier: 4, checkFrequency: 'weekly', description: 'UK/global agency workforce.' },
  { name: 'Marketing Week', url: 'https://marketingweek.com', type: 'industry', category: 'ai_layoffs', region: 'UK', country: 'GB', tier: 4, checkFrequency: 'weekly', description: 'Brand-side marketing team changes.' },
  { name: 'MarTech', url: 'https://martech.org', type: 'industry', category: 'ai_layoffs', region: 'US', tier: 4, checkFrequency: 'weekly', description: 'Marketing technology automation.' },

  // ═══════════════════════════════════════════════════════════
  // INDUSTRY TRADE PUBLICATIONS — Insurance
  // ═══════════════════════════════════════════════════════════
  { name: 'Insurance Journal', url: 'https://insurancejournal.com', type: 'industry', category: 'ai_layoffs', region: 'US', tier: 3, checkFrequency: 'weekly', description: 'Acrisure 400 layoffs from AI (Oct 2025).' },
  { name: 'Agency Height', url: 'https://agencyheight.com', type: 'industry', category: 'ai_layoffs', region: 'US', tier: 5, checkFrequency: 'monthly', description: 'Insurance agent displacement.' },
  { name: 'Insurance Insider', url: 'https://insuranceinsider.com', type: 'industry', category: 'ai_layoffs', region: 'UK', country: 'GB', tier: 4, checkFrequency: 'weekly', paywalled: true, description: 'Lloyd\'s market, UK/global insurance workforce.' },
  { name: 'Coverager', url: 'https://coverager.com', type: 'industry', category: 'ai_layoffs', region: 'US', tier: 4, checkFrequency: 'weekly', description: 'Insurtech workforce changes.' },
  { name: 'Insurance Business', url: 'https://insurancebusinessmag.com', type: 'industry', category: 'ai_layoffs', region: 'Global', tier: 4, checkFrequency: 'weekly', description: 'Global editions (US, UK, AU, NZ, CA, Asia).' },

  // ═══════════════════════════════════════════════════════════
  // INDUSTRY TRADE PUBLICATIONS — Real Estate
  // ═══════════════════════════════════════════════════════════
  { name: 'Inman News', url: 'https://inman.com', type: 'industry', category: 'ai_layoffs', region: 'US', tier: 4, checkFrequency: 'weekly', description: 'Real estate tech disruption, agent displacement.' },
  { name: 'The Real Deal', url: 'https://therealdeal.com', type: 'industry', category: 'ai_layoffs', region: 'US', tier: 4, checkFrequency: 'weekly', description: 'Brokerage layoffs and restructuring.' },
  { name: 'CoStar News', url: 'https://costar.com/news', type: 'industry', category: 'ai_layoffs', region: 'US', tier: 4, checkFrequency: 'weekly', description: 'Commercial real estate workforce.' },
  { name: 'Property Week', url: 'https://propertyweek.com', type: 'industry', category: 'ai_layoffs', region: 'UK', country: 'GB', tier: 4, checkFrequency: 'weekly', description: 'UK commercial real estate.' },
  { name: 'Real Estate Business', url: 'https://rebonline.com.au', type: 'industry', category: 'ai_layoffs', region: 'Asia-Pacific', country: 'AU', tier: 5, checkFrequency: 'monthly', description: 'Australian real estate industry.' },
  { name: 'HousingWire', url: 'https://housingwire.com', type: 'industry', category: 'ai_layoffs', region: 'US', tier: 4, checkFrequency: 'weekly', description: 'Mortgage/lending automation.' },

  // ═══════════════════════════════════════════════════════════
  // INDUSTRY TRADE PUBLICATIONS — Transportation / Logistics
  // ═══════════════════════════════════════════════════════════
  { name: 'Transport Topics', url: 'https://ttnews.com', type: 'industry', category: 'robot_automation', region: 'US', tier: 4, checkFrequency: 'weekly', description: 'Trucking automation, autonomous vehicles.' },
  { name: 'The Loadstar', url: 'https://theloadstar.com', type: 'industry', category: 'robot_automation', region: 'Global', tier: 4, checkFrequency: 'weekly', description: 'Global freight/logistics workforce.' },
  { name: 'Journal of Commerce', url: 'https://joc.com', type: 'industry', category: 'robot_automation', region: 'Global', tier: 4, checkFrequency: 'weekly', paywalled: true, description: 'Shipping/port automation.' },
  { name: 'FleetOwner', url: 'https://fleetowner.com', type: 'industry', category: 'robot_automation', region: 'US', tier: 4, checkFrequency: 'weekly', description: 'Fleet management automation.' },

  // ═══════════════════════════════════════════════════════════
  // INDUSTRY TRADE PUBLICATIONS — Energy
  // ═══════════════════════════════════════════════════════════
  { name: 'Utility Dive', url: 'https://utilitydive.com', type: 'industry', category: 'both', region: 'US', tier: 4, checkFrequency: 'weekly', description: 'Energy utility workforce.' },
  { name: 'Rigzone', url: 'https://rigzone.com', type: 'industry', category: 'both', region: 'Global', tier: 4, checkFrequency: 'weekly', description: 'Oil and gas workforce, automation.' },
  { name: 'Energy Voice', url: 'https://energyvoice.com', type: 'industry', category: 'both', region: 'UK', country: 'GB', tier: 4, checkFrequency: 'weekly', description: 'UK/global energy sector.' },
  { name: 'Renewables Now', url: 'https://renewablesnow.com', type: 'industry', category: 'both', region: 'Global', tier: 4, checkFrequency: 'weekly', description: 'Clean energy workforce.' },
  { name: 'SPE', url: 'https://spe.org', type: 'industry', category: 'robot_automation', region: 'Global', tier: 5, checkFrequency: 'monthly', description: 'Society of Petroleum Engineers — oilfield automation impact.' },
  { name: 'Power Engineering', url: 'https://power-eng.com', type: 'industry', category: 'robot_automation', region: 'US', tier: 4, checkFrequency: 'monthly', description: 'Power generation automation.' },

  // ═══════════════════════════════════════════════════════════
  // INDUSTRY TRADE PUBLICATIONS — Agriculture / Food
  // ═══════════════════════════════════════════════════════════
  { name: 'AgFunder News', url: 'https://agfundernews.com', type: 'industry', category: 'robot_automation', region: 'Global', tier: 4, checkFrequency: 'weekly', description: 'AgTech startup layoffs, automation.' },
  { name: 'Food Dive', url: 'https://fooddive.com', type: 'industry', category: 'robot_automation', region: 'US', tier: 4, checkFrequency: 'weekly', description: 'Food processing automation.' },
  { name: 'Successful Farming', url: 'https://agriculture.com', type: 'industry', category: 'robot_automation', region: 'US', tier: 5, checkFrequency: 'monthly', description: 'Farm automation workforce impact.' },
  { name: 'Food Manufacture', url: 'https://foodmanufacture.co.uk', type: 'industry', category: 'robot_automation', region: 'UK', country: 'GB', tier: 5, checkFrequency: 'monthly', description: 'UK food processing automation.' },
  { name: 'The Packer', url: 'https://thepacker.com', type: 'industry', category: 'robot_automation', region: 'US', tier: 5, checkFrequency: 'monthly', description: 'Fresh produce supply chain automation.' },
  { name: 'Future Farming', url: 'https://futurefarming.com', type: 'industry', category: 'robot_automation', region: 'Europe', tier: 5, checkFrequency: 'monthly', description: 'European agricultural technology.' },

  // ═══════════════════════════════════════════════════════════
  // AI RESEARCH LABS & THINK TANKS
  // ═══════════════════════════════════════════════════════════
  { name: 'AI Now Institute', url: 'https://ainowinstitute.org', type: 'think_tank', category: 'ai_layoffs', region: 'US', tier: 3, checkFrequency: 'monthly', description: 'NYU — algorithmic accountability, labor impact.' },
  { name: 'Ada Lovelace Institute', url: 'https://adalovelaceinstitute.org', type: 'think_tank', category: 'ai_layoffs', region: 'UK', country: 'GB', tier: 3, checkFrequency: 'monthly', description: 'Nuffield Foundation — data and AI for society.' },
  { name: 'Centre for the Governance of AI (GovAI)', url: 'https://governance.ai', type: 'think_tank', category: 'ai_layoffs', region: 'UK', country: 'GB', tier: 3, checkFrequency: 'monthly', description: 'Oxford — AI governance, labor displacement.' },
  { name: 'Oxford Martin School', url: 'https://oxfordmartin.ox.ac.uk', type: 'think_tank', category: 'ai_layoffs', region: 'UK', country: 'GB', tier: 3, checkFrequency: 'quarterly', description: 'Frey & Osborne automation risk research — 47% of US jobs at risk.' },
  { name: 'Partnership on AI', url: 'https://partnershiponai.org', type: 'think_tank', category: 'ai_layoffs', region: 'Global', tier: 3, checkFrequency: 'quarterly', description: 'Multi-stakeholder AI workforce research.' },
  { name: 'Center for AI Safety', url: 'https://safe.ai', type: 'think_tank', category: 'ai_layoffs', region: 'US', tier: 4, checkFrequency: 'quarterly', description: 'AI risk including economic displacement.' },
  { name: 'Institute for the Future of Work', url: 'https://ifow.org', type: 'think_tank', category: 'ai_layoffs', region: 'UK', country: 'GB', tier: 3, checkFrequency: 'monthly', description: 'UK — Good Work Monitor, AI and employment.' },
  { name: 'Chatham House', url: 'https://chathamhouse.org', type: 'think_tank', category: 'ai_layoffs', region: 'UK', country: 'GB', tier: 4, checkFrequency: 'quarterly', description: 'UK — international AI policy.' },
  { name: 'Alan Turing Institute', url: 'https://turing.ac.uk', type: 'research', category: 'ai_layoffs', region: 'UK', country: 'GB', tier: 4, checkFrequency: 'quarterly', description: 'UK national AI institute.' },
  { name: 'CSIRO Data61', url: 'https://data61.csiro.au', type: 'research', category: 'ai_layoffs', region: 'Asia-Pacific', country: 'AU', tier: 4, checkFrequency: 'quarterly', description: 'Australia\'s national AI research body.' },
  { name: 'Mila Quebec AI', url: 'https://mila.quebec', type: 'research', category: 'ai_layoffs', region: 'Canada', country: 'CA', language: 'en', tier: 4, checkFrequency: 'quarterly', description: 'Canadian AI institute.' },
  { name: 'Vector Institute', url: 'https://vectorinstitute.ai', type: 'research', category: 'ai_layoffs', region: 'Canada', country: 'CA', tier: 4, checkFrequency: 'quarterly', description: 'Toronto — AI economic impact.' },
  { name: 'DFKI', url: 'https://dfki.de', type: 'research', category: 'ai_layoffs', region: 'Europe', country: 'DE', language: 'de', tier: 4, checkFrequency: 'quarterly', description: 'German AI research center.' },
  { name: 'RIKEN AIP', url: 'https://aip.riken.jp', type: 'research', category: 'ai_layoffs', region: 'Asia-Pacific', country: 'JP', language: 'ja', tier: 5, checkFrequency: 'quarterly', description: 'Japan\'s flagship AI research center.' },
  { name: 'KAIST AI', url: 'https://ai.kaist.ac.kr', type: 'research', category: 'ai_layoffs', region: 'Asia-Pacific', country: 'KR', language: 'ko', tier: 5, checkFrequency: 'quarterly', description: 'South Korea — AI workforce studies.' },
  { name: 'Tsinghua AIR', url: 'https://air.tsinghua.edu.cn', type: 'research', category: 'ai_layoffs', region: 'Asia-Pacific', country: 'CN', language: 'zh', tier: 5, checkFrequency: 'quarterly', description: 'China — AI research institute.' },

  // ═══════════════════════════════════════════════════════════
  // NON-ENGLISH TECH NEWS
  // ═══════════════════════════════════════════════════════════
  { name: '36Kr', url: 'https://36kr.com', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'CN', language: 'zh', tier: 3, checkFrequency: 'daily', description: 'China\'s leading tech news — startup layoffs, AI.' },
  { name: 'KrASIA', url: 'https://kr-asia.com', type: 'news', category: 'both', region: 'Asia-Pacific', tier: 3, checkFrequency: 'daily', description: '36Kr\'s English-language Asia edition.' },
  { name: 'Japan Times', url: 'https://japantimes.co.jp', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'JP', tier: 3, checkFrequency: 'daily', description: 'Japan tech and business.' },
  { name: 'ITmedia', url: 'https://itmedia.co.jp', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'JP', language: 'ja', tier: 4, checkFrequency: 'daily', description: 'Major Japanese IT/tech news portal.' },
  { name: 'Impress Watch', url: 'https://impress.co.jp', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'JP', language: 'ja', tier: 4, checkFrequency: 'daily', description: 'Japanese tech news.' },
  { name: 'ZDNet Korea', url: 'https://zdnet.co.kr', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'KR', language: 'ko', tier: 4, checkFrequency: 'daily', description: 'Korean IT/tech industry.' },
  { name: 'Electronic Times', url: 'https://etnews.com', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'KR', language: 'ko', tier: 4, checkFrequency: 'daily', description: 'Korean electronics and IT industry.' },
  { name: 'Hankyoreh', url: 'https://hani.co.kr', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'KR', language: 'ko', tier: 4, checkFrequency: 'daily', description: 'Korean progressive — labor/tech coverage.' },
  { name: 'Tech Wire Asia', url: 'https://techwireasia.com', type: 'news', category: 'both', region: 'Asia-Pacific', tier: 3, checkFrequency: 'daily', description: 'Southeast Asia tech.' },
  { name: 'e27', url: 'https://e27.co', type: 'news', category: 'both', region: 'Asia-Pacific', tier: 3, checkFrequency: 'daily', description: 'SE Asia — covered India/Japan AI layoff surge.' },
  { name: 'TechNode Global', url: 'https://technode.global', type: 'news', category: 'both', region: 'Asia-Pacific', tier: 4, checkFrequency: 'daily', description: 'China/Asia tech ecosystem.' },
  { name: 'YourStory', url: 'https://yourstory.com', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'IN', tier: 3, checkFrequency: 'daily', description: 'India startup/tech ecosystem.' },
  { name: 'Inc42', url: 'https://inc42.com', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'IN', tier: 3, checkFrequency: 'daily', description: 'India tech/startup layoffs.' },
  { name: 'Moneycontrol', url: 'https://moneycontrol.com', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'IN', tier: 3, checkFrequency: 'daily', description: 'India business/finance, IT layoffs.' },
  { name: 'Heise Online', url: 'https://heise.de', type: 'news', category: 'both', region: 'Europe', country: 'DE', language: 'de', tier: 3, checkFrequency: 'daily', description: 'Germany\'s largest IT news portal.' },
  { name: 'Golem.de', url: 'https://golem.de', type: 'news', category: 'both', region: 'Europe', country: 'DE', language: 'de', tier: 4, checkFrequency: 'daily', description: 'German tech news.' },
  { name: 'Le Monde Informatique', url: 'https://lemondeinformatique.fr', type: 'news', category: 'both', region: 'Europe', country: 'FR', language: 'fr', tier: 4, checkFrequency: 'daily', description: 'French IT news.' },
  { name: 'L\'Usine Digitale', url: 'https://usine-digitale.fr', type: 'news', category: 'both', region: 'Europe', country: 'FR', language: 'fr', tier: 4, checkFrequency: 'daily', description: 'French digital industry.' },
  { name: 'Convergencia Digital', url: 'https://convergenciadigital.com.br', type: 'news', category: 'both', region: 'Americas', country: 'BR', language: 'pt', tier: 4, checkFrequency: 'daily', description: 'Brazilian IT/telecom news.' },
  { name: 'TecMundo', url: 'https://tecmundo.com.br', type: 'news', category: 'both', region: 'Americas', country: 'BR', language: 'pt', tier: 4, checkFrequency: 'daily', description: 'Brazilian tech news.' },
  { name: 'Xataka', url: 'https://xataka.com', type: 'news', category: 'both', region: 'Americas', country: 'ES', language: 'es', tier: 4, checkFrequency: 'daily', description: 'Spanish tech news (Spain and LatAm).' },
  { name: 'TechCabal', url: 'https://techcabal.com', type: 'news', category: 'both', region: 'Africa', tier: 3, checkFrequency: 'daily', description: 'African tech ecosystem news.' },
  { name: 'Disrupt Africa', url: 'https://disruptafrica.com', type: 'news', category: 'both', region: 'Africa', tier: 4, checkFrequency: 'weekly', description: 'African tech startup news.' },
  { name: 'IT News Africa', url: 'https://itnewsafrica.com', type: 'news', category: 'both', region: 'Africa', tier: 4, checkFrequency: 'weekly', description: 'African IT sector news.' },
  { name: 'Gulf News', url: 'https://gulfnews.com', type: 'news', category: 'both', region: 'Middle East', tier: 4, checkFrequency: 'daily', description: 'Gulf region tech layoffs coverage.' },
  { name: 'Arabian Business', url: 'https://arabianbusiness.com', type: 'news', category: 'both', region: 'Middle East', tier: 4, checkFrequency: 'daily', description: 'GCC business and tech.' },
  { name: 'iProUP', url: 'https://iproup.com', type: 'news', category: 'both', region: 'Americas', country: 'AR', language: 'es', tier: 4, checkFrequency: 'daily', description: 'Argentine tech/fintech news.' },

  // ═══════════════════════════════════════════════════════════
  // DEVELOPER & DATA PLATFORMS
  // ═══════════════════════════════════════════════════════════
  { name: 'Stack Overflow Developer Survey', url: 'https://survey.stackoverflow.co', type: 'dataset', category: 'both', region: 'Global', tier: 3, checkFrequency: 'yearly', description: 'Annual — 49K+ responses, 177 countries. AI tool adoption data.' },
  { name: 'GitHub Octoverse', url: 'https://github.blog/octoverse', type: 'dataset', category: 'both', region: 'Global', tier: 3, checkFrequency: 'yearly', description: 'Annual developer activity, AI coding tool adoption.' },
  { name: 'Kaggle Layoffs Dataset', url: 'https://kaggle.com/datasets/swaptr/layoffs-2022', type: 'dataset', category: 'both', region: 'Global', tier: 3, description: 'Tech layoffs 2020-2024, downloadable CSV.' },
  { name: 'Kaggle Layoffs 2024', url: 'https://kaggle.com/datasets/theakhilb/layoffs-data-2022', type: 'dataset', category: 'both', region: 'Global', tier: 4, description: 'Extended layoffs dataset through 2024.' },
  { name: 'Kaggle Tech Layoffs 2020-2024', url: 'https://kaggle.com/datasets/ulrikeherold/tech-layoffs-2020-2024', type: 'dataset', category: 'both', region: 'Global', tier: 4, description: 'Global tech layoffs with analysis notebooks.' },
  { name: 'HackerNews', url: 'https://news.ycombinator.com', type: 'dataset', category: 'both', region: 'Global', tier: 4, checkFrequency: 'monthly', hasApi: true, description: 'Y Combinator — "Ask HN: Who is hiring?" monthly threads.' },
  { name: 'Levels.fyi', url: 'https://levels.fyi', type: 'job_platform', category: 'both', region: 'Global', tier: 3, checkFrequency: 'weekly', description: 'Tech compensation + layoff tracking.' },
  { name: 'Kaggle Stack Overflow Survey', url: 'https://kaggle.com/datasets/berkayalan/stack-overflow-annual-developer-survey-2024', type: 'dataset', category: 'both', region: 'Global', tier: 4, description: 'Developer survey 2011-2024, AI tool adoption data.' },

  // ═══════════════════════════════════════════════════════════
  // AI POLICY INSTITUTES
  // ═══════════════════════════════════════════════════════════
  { name: 'OECD AI Policy Observatory', url: 'https://oecd.ai', type: 'policy', category: 'ai_layoffs', region: 'Global', tier: 3, hasApi: true, description: 'Tracks AI policies across 60+ countries.' },
  { name: 'UNESCO AI', url: 'https://unesco.org/en/artificial-intelligence', type: 'policy', category: 'ai_layoffs', region: 'Global', tier: 4, checkFrequency: 'quarterly', description: 'AI ethics and employment globally.' },
  { name: 'EU AI Act Observatory', url: 'https://artificialintelligenceact.eu', type: 'policy', category: 'ai_layoffs', region: 'Europe', tier: 3, checkFrequency: 'monthly', description: 'Workplace AI classified as high risk.' },
  { name: 'National Academies (US)', url: 'https://nationalacademies.org', type: 'policy', category: 'ai_layoffs', region: 'US', tier: 4, checkFrequency: 'quarterly', description: 'AI and the Future of Work project.' },
  { name: 'UC Berkeley Labor Center', url: 'https://laborcenter.berkeley.edu', type: 'research', category: 'ai_layoffs', region: 'US', tier: 4, checkFrequency: 'quarterly', description: 'First Look at Labor\'s AI Values report.' },
  { name: 'Singapore AI Governance', url: 'https://pdpc.gov.sg/help-and-resources/2020/01/model-ai-governance-framework', type: 'policy', category: 'ai_layoffs', region: 'Asia-Pacific', country: 'SG', tier: 4, description: 'Model AI governance framework.' },
  { name: 'Japan AI Strategy Council', url: 'https://cao.go.jp', type: 'policy', category: 'ai_layoffs', region: 'Asia-Pacific', country: 'JP', language: 'ja', tier: 4, description: 'Japanese government AI workforce policy.' },
  { name: 'Korea AI Ethics Association', url: 'https://aiethics.or.kr', type: 'policy', category: 'ai_layoffs', region: 'Asia-Pacific', country: 'KR', language: 'ko', tier: 5, description: 'South Korean AI ethics/employment.' },

  // ═══════════════════════════════════════════════════════════
  // STOCK EXCHANGES & FILING DATABASES
  // ═══════════════════════════════════════════════════════════
  { name: 'SEDAR+', url: 'https://sedarplus.ca', type: 'filings', category: 'both', region: 'Canada', country: 'CA', tier: 4, description: 'Canadian equivalent of EDGAR. All public company filings.' },
  { name: 'EDINET', url: 'https://disclosure2.edinet-fsa.go.jp', type: 'filings', category: 'both', region: 'Asia-Pacific', country: 'JP', language: 'ja', tier: 4, description: 'Japanese EDGAR equivalent. Mostly Japanese-language.' },
  { name: 'SSE Disclosure', url: 'https://sse.com.cn/disclosure', type: 'filings', category: 'both', region: 'Asia-Pacific', country: 'CN', language: 'zh', tier: 4, description: 'Shanghai Stock Exchange filings.' },
  { name: 'SZSE Disclosure', url: 'https://szse.cn/disclosure', type: 'filings', category: 'both', region: 'Asia-Pacific', country: 'CN', language: 'zh', tier: 4, description: 'Shenzhen Stock Exchange filings.' },
  { name: 'HKEXnews', url: 'https://hkexnews.hk', type: 'filings', category: 'both', region: 'Asia-Pacific', country: 'HK', tier: 4, description: 'All Hong Kong listed company announcements.' },
  { name: 'BSE India', url: 'https://bseindia.com', type: 'filings', category: 'both', region: 'Asia-Pacific', country: 'IN', tier: 4, description: 'Bombay Stock Exchange filings.' },
  { name: 'NSE India', url: 'https://nseindia.com', type: 'filings', category: 'both', region: 'Asia-Pacific', country: 'IN', tier: 4, description: 'National Stock Exchange of India filings.' },
  { name: 'Bundesanzeiger', url: 'https://bundesanzeiger.de', type: 'filings', category: 'both', region: 'Europe', country: 'DE', language: 'de', tier: 4, description: 'German company filings.' },
  { name: 'AMF BALO', url: 'https://amf-france.org', type: 'filings', category: 'both', region: 'Europe', country: 'FR', language: 'fr', tier: 4, description: 'French market authority filings.' },
  { name: 'CNMV', url: 'https://cnmv.es', type: 'filings', category: 'both', region: 'Europe', country: 'ES', language: 'es', tier: 4, description: 'Spanish market authority filings.' },
  { name: 'SGX', url: 'https://sgx.com', type: 'filings', category: 'both', region: 'Asia-Pacific', country: 'SG', tier: 4, description: 'Singapore Exchange announcements.' },
  { name: 'Euronext', url: 'https://euronext.com', type: 'filings', category: 'both', region: 'Europe', tier: 4, description: 'Pan-European exchange filings.' },
  { name: 'TMX', url: 'https://tmx.com', type: 'filings', category: 'both', region: 'Canada', country: 'CA', tier: 4, description: 'Toronto Stock Exchange.' },
  { name: 'FCA RNS', url: 'https://londonstockexchange.com/news', type: 'filings', category: 'both', region: 'UK', country: 'GB', tier: 4, description: 'Regulatory News Service — restructuring announcements.' },

  // ═══════════════════════════════════════════════════════════
  // COMPANY INTELLIGENCE PLATFORMS
  // ═══════════════════════════════════════════════════════════
  { name: 'Crunchbase', url: 'https://crunchbase.com', type: 'api', category: 'both', region: 'Global', tier: 3, hasApi: true, description: 'Tech layoff tracker + startup funding data.' },
  { name: 'PitchBook', url: 'https://pitchbook.com', type: 'api', category: 'both', region: 'Global', tier: 3, paywalled: true, description: 'Deep financial/valuation data, PE/VC deal-level.' },
  { name: 'CB Insights', url: 'https://cbinsights.com', type: 'api', category: 'both', region: 'Global', tier: 3, paywalled: true, description: 'AI-driven analytics, predictive company tracking.' },
  { name: 'Dealroom', url: 'https://dealroom.co', type: 'api', category: 'both', region: 'Europe', tier: 3, paywalled: true, description: 'Strong European tech ecosystem coverage. Used by governments.' },
  { name: 'Tracxn', url: 'https://tracxn.com', type: 'api', category: 'both', region: 'Global', tier: 4, paywalled: true, description: 'Good for emerging market startups.' },
  { name: 'ZoomInfo', url: 'https://zoominfo.com', type: 'api', category: 'both', region: 'Global', tier: 4, paywalled: true, hasApi: true, description: '260M+ professional profiles, company org changes.' },
  { name: 'Apollo.io', url: 'https://apollo.io', type: 'api', category: 'both', region: 'Global', tier: 4, hasApi: true, description: 'Company workforce size tracking.' },
  { name: 'Global Database', url: 'https://globaldatabase.com', type: 'api', category: 'both', region: 'Global', tier: 4, paywalled: true, description: 'Registry-sourced data, all companies not just funded.' },
  { name: 'Veridion', url: 'https://veridion.com', type: 'api', category: 'both', region: 'Global', tier: 4, paywalled: true, description: 'Global business data from registries.' },
  { name: 'FactSet', url: 'https://factset.com', type: 'api', category: 'both', region: 'Global', tier: 4, paywalled: true, description: 'Institutional-grade, real-time market data.' },
  { name: 'S&P Capital IQ', url: 'https://capitaliq.com', type: 'api', category: 'both', region: 'Global', tier: 4, paywalled: true, description: 'Company fundamentals, restructuring events.' },
  { name: 'Refinitiv/LSEG', url: 'https://lseg.com', type: 'api', category: 'both', region: 'Global', tier: 4, paywalled: true, description: 'London Stock Exchange Group data platform.' },

  // ═══════════════════════════════════════════════════════════
  // WORKFORCE ANALYTICS & JOB PLATFORMS
  // ═══════════════════════════════════════════════════════════
  { name: 'LinkedIn Economic Graph', url: 'https://economicgraph.linkedin.com', type: 'job_platform', category: 'both', region: 'Global', tier: 3, description: 'Workforce trends, hiring rates, migration.' },
  { name: 'Glassdoor Economic Research', url: 'https://glassdoor.com/research', type: 'job_platform', category: 'both', region: 'Global', tier: 3, checkFrequency: 'monthly', description: 'Layoff mentions in reviews, salary impact.' },
  { name: 'Revelio Labs', url: 'https://reveliolabs.com', type: 'job_platform', category: 'both', region: 'Global', tier: 3, paywalled: true, description: 'Workforce intelligence from public data.' },
  { name: 'Live Data Technologies', url: 'https://livedatatechnologies.com', type: 'job_platform', category: 'both', region: 'Global', tier: 3, paywalled: true, description: 'Tracks actual layoffs via LinkedIn profile changes.' },
  { name: 'Lightcast (EMSI)', url: 'https://lightcast.io', type: 'job_platform', category: 'both', region: 'Global', tier: 3, paywalled: true, description: 'Labor market data, skills demand.' },
  { name: 'Talent.com', url: 'https://talent.com', type: 'job_platform', category: 'both', region: 'Global', tier: 4, description: 'Global — 75+ countries, formerly Neuvoo.' },
  { name: 'XING', url: 'https://xing.com', type: 'job_platform', category: 'both', region: 'Europe', country: 'DE', language: 'de', tier: 4, description: 'DACH region (Germany, Austria, Switzerland).' },
  { name: 'Seek', url: 'https://seek.com.au', type: 'job_platform', category: 'both', region: 'Asia-Pacific', country: 'AU', tier: 4, description: 'Australia/NZ — job market trends.' },
  { name: 'Naukri', url: 'https://naukri.com', type: 'job_platform', category: 'both', region: 'Asia-Pacific', country: 'IN', tier: 4, description: 'India — largest Indian job site.' },
  { name: 'StepStone', url: 'https://stepstone.de', type: 'job_platform', category: 'both', region: 'Europe', country: 'DE', language: 'de', tier: 4, description: 'Germany — job market trends.' },
  { name: 'Reed', url: 'https://reed.co.uk', type: 'job_platform', category: 'both', region: 'UK', country: 'GB', tier: 4, description: 'UK — job market data.' },
  { name: 'Totaljobs', url: 'https://totaljobs.com', type: 'job_platform', category: 'both', region: 'UK', country: 'GB', tier: 4, description: 'UK — workforce analytics.' },
  { name: 'Bayt', url: 'https://bayt.com', type: 'job_platform', category: 'both', region: 'Middle East', tier: 4, description: 'Middle East — regional job data.' },
  { name: 'JobKorea', url: 'https://jobkorea.co.kr', type: 'job_platform', category: 'both', region: 'Asia-Pacific', country: 'KR', language: 'ko', tier: 4, description: 'South Korea job market.' },
  { name: 'Saramin', url: 'https://saramin.co.kr', type: 'job_platform', category: 'both', region: 'Asia-Pacific', country: 'KR', language: 'ko', tier: 4, description: 'South Korea job market.' },

  // ═══════════════════════════════════════════════════════════
  // UNIONS — Global Federations
  // ═══════════════════════════════════════════════════════════
  { name: 'IndustriALL Global Union', url: 'https://industriall-union.org', type: 'union', category: 'robot_automation', region: 'Global', tier: 4, description: '50M members in 140 countries — manufacturing, mining, energy unions.' },
  { name: 'International Transport Workers Federation', url: 'https://itfglobal.org', type: 'union', category: 'robot_automation', region: 'Global', tier: 4, description: '18.5M members — transport/logistics automation.' },
  { name: 'Education International', url: 'https://ei-ie.org', type: 'union', category: 'ai_layoffs', region: 'Global', tier: 4, description: '32.5M members — education sector AI impact.' },
  { name: 'Public Services International', url: 'https://publicservices.international', type: 'union', category: 'ai_layoffs', region: 'Global', tier: 4, description: '30M members — public sector AI displacement.' },

  // ═══════════════════════════════════════════════════════════
  // UNIONS — By Country
  // ═══════════════════════════════════════════════════════════
  { name: 'CWA', url: 'https://cwa-union.org', type: 'union', category: 'both', region: 'US', country: 'US', tier: 4, description: 'Communications Workers of America — covers tech, telecom, media workers.' },
  { name: 'OPEIU', url: 'https://opeiu.org', type: 'union', category: 'ai_layoffs', region: 'US', tier: 4, description: 'Office & Professional Employees International Union.' },
  { name: 'IFPTE', url: 'https://ifpte.org', type: 'union', category: 'ai_layoffs', region: 'US', tier: 4, description: 'Engineers, scientists, tech professionals union.' },
  { name: 'Alphabet Workers Union', url: 'https://alphabetworkersunion.org', type: 'union', category: 'ai_layoffs', region: 'US', country: 'US', tier: 4, description: 'Google/Alphabet employees union.' },
  { name: 'Tech Workers Coalition', url: 'https://techworkerscoalition.org', type: 'union', category: 'both', region: 'Global', tier: 4, description: 'Grassroots tech worker advocacy.' },
  { name: 'UTAW', url: 'https://utaw.tech', type: 'union', category: 'ai_layoffs', region: 'UK', country: 'GB', tier: 4, description: 'United Tech & Allied Workers — dedicated UK tech workers union.' },
  { name: 'Prospect', url: 'https://prospect.org.uk', type: 'union', category: 'ai_layoffs', region: 'UK', country: 'GB', tier: 4, description: 'UK professional workers union — tech section launched 2021.' },
  { name: 'Professionals Australia', url: 'https://professionalsaustralia.org.au', type: 'union', category: 'ai_layoffs', region: 'Asia-Pacific', country: 'AU', tier: 4, description: 'Engineers, scientists, IT professionals union.' },
  { name: 'ver.di', url: 'https://verdi.de', type: 'union', category: 'both', region: 'Europe', country: 'DE', language: 'de', tier: 4, description: '1.9M members — services/IT/media.' },
  { name: 'CGT', url: 'https://cgt.fr', type: 'union', category: 'both', region: 'Europe', country: 'FR', language: 'fr', tier: 4, description: 'Major French union covering tech/services.' },
  { name: 'CFDT', url: 'https://cfdt.fr', type: 'union', category: 'both', region: 'Europe', country: 'FR', language: 'fr', tier: 4, description: 'Major French union covering tech/services.' },
  { name: 'RENGO', url: 'https://jtuc-rengo.org', type: 'union', category: 'both', region: 'Asia-Pacific', country: 'JP', language: 'ja', tier: 4, description: '7M members — Japanese Trade Union Confederation.' },
  { name: 'KCTU', url: 'https://kctu.org', type: 'union', category: 'both', region: 'Asia-Pacific', country: 'KR', language: 'ko', tier: 4, description: 'Korean Confederation of Trade Unions — Google Korea unionized under KCTU.' },
  { name: 'FKTU', url: 'https://fktu.or.kr', type: 'union', category: 'both', region: 'Asia-Pacific', country: 'KR', language: 'ko', tier: 4, description: 'Federation of Korean Trade Unions.' },
  { name: 'CITU', url: 'https://caborunions.in', type: 'union', category: 'ai_layoffs', region: 'Asia-Pacific', country: 'IN', tier: 5, description: 'Indian IT/BPO sector organizing.' },
  { name: 'NTUI', url: 'https://ntui.org.in', type: 'union', category: 'ai_layoffs', region: 'Asia-Pacific', country: 'IN', tier: 5, description: 'New Trade Union Initiative — informal/tech sector.' },
  { name: 'ACFTU', url: 'https://acftu.org', type: 'union', category: 'both', region: 'Asia-Pacific', country: 'CN', language: 'zh', tier: 5, description: 'All-China Federation of Trade Unions — limited independent action.' },
  { name: 'SAG-AFTRA', url: 'https://sagaftra.org', type: 'union', category: 'ai_layoffs', region: 'US', country: 'US', tier: 3, description: 'Actors/media — AI contract provisions from 2023 strike.' },
  { name: 'WGA', url: 'https://wga.org', type: 'union', category: 'ai_layoffs', region: 'US', country: 'US', tier: 3, description: 'Writers Guild — AI writing protections from 2023 strike.' },
  { name: 'NUJ', url: 'https://nuj.org.uk', type: 'union', category: 'ai_layoffs', region: 'UK', country: 'GB', tier: 4, description: 'National Union of Journalists — AI in newsrooms.' },
  { name: 'Culinary Workers Union', url: 'https://culinaryunion226.org', type: 'union', category: 'ai_layoffs', region: 'US', country: 'US', tier: 4, description: 'AI severance clause ($2K/year worked) in 2023 Las Vegas contract.' },

  // ═══════════════════════════════════════════════════════════
  // WORKER ADVOCACY / RESEARCH ORGS
  // ═══════════════════════════════════════════════════════════
  { name: 'Center for American Progress', url: 'https://americanprogress.org', type: 'think_tank', category: 'ai_layoffs', region: 'US', tier: 4, description: 'Unions Give Workers a Voice Over How AI Affects Their Jobs.' },
  { name: 'Economic Policy Institute', url: 'https://epi.org', type: 'think_tank', category: 'both', region: 'US', tier: 4, description: 'US labor market analysis, automation impact.' },
  { name: 'TechPolicy.Press', url: 'https://techpolicy.press', type: 'think_tank', category: 'ai_layoffs', region: 'US', tier: 4, description: 'How Major Labor Unions Are Positioning on AI.' },
  { name: 'Open Markets Institute', url: 'https://openmarketsinstitute.org', type: 'think_tank', category: 'ai_layoffs', region: 'US', tier: 4, description: 'Corporate concentration from AI.' },
  { name: 'Coworker.org', url: 'https://coworker.org', type: 'union', category: 'both', region: 'US', tier: 4, description: 'Worker-led campaigns against tech employer practices.' },

  // ═══════════════════════════════════════════════════════════
  // ACADEMIC INSTITUTIONS
  // ═══════════════════════════════════════════════════════════
  { name: 'Harvard Opportunity Insights', url: 'https://opportunityinsights.org', type: 'research', category: 'ai_layoffs', region: 'US', tier: 4, description: 'Raj Chetty — economic mobility and automation.' },
  { name: 'Carnegie Mellon AI', url: 'https://cmu.edu/ai', type: 'research', category: 'ai_layoffs', region: 'US', tier: 4, description: 'AI engineering and labor impact.' },
  { name: 'Wharton School', url: 'https://wharton.upenn.edu', type: 'research', category: 'ai_layoffs', region: 'US', tier: 4, description: 'AI business transformation studies.' },
  { name: 'London School of Economics', url: 'https://lse.ac.uk', type: 'research', category: 'ai_layoffs', region: 'UK', country: 'GB', tier: 4, description: 'Centre for Economic Performance — AI and jobs.' },
  { name: 'University of Toronto Rotman', url: 'https://rotman.utoronto.ca', type: 'research', category: 'ai_layoffs', region: 'Canada', country: 'CA', tier: 4, description: 'AI business adoption research.' },
  { name: 'Nexford University', url: 'https://nexford.edu', type: 'research', category: 'ai_layoffs', region: 'US', tier: 5, description: 'How AI Will Affect Jobs 2026-2030 analysis.' },
  { name: 'ETH Zurich', url: 'https://ethz.ch', type: 'research', category: 'ai_layoffs', region: 'Europe', country: 'CH', tier: 4, description: 'AI governance and labor.' },
  { name: 'Technical University of Munich', url: 'https://tum.de', type: 'research', category: 'robot_automation', region: 'Europe', country: 'DE', language: 'de', tier: 5, description: 'AI in manufacturing research.' },
  { name: 'University of Tokyo', url: 'https://u-tokyo.ac.jp', type: 'research', category: 'ai_layoffs', region: 'Asia-Pacific', country: 'JP', language: 'ja', tier: 5, description: 'AI society impact research.' },
  { name: 'Seoul National University', url: 'https://snu.ac.kr', type: 'research', category: 'ai_layoffs', region: 'Asia-Pacific', country: 'KR', language: 'ko', tier: 5, description: 'AI policy and employment.' },
  { name: 'Tsinghua University', url: 'https://tsinghua.edu.cn', type: 'research', category: 'ai_layoffs', region: 'Asia-Pacific', country: 'CN', language: 'zh', tier: 5, description: 'Institute for AI Industry Research.' },
  { name: 'University of Melbourne', url: 'https://unimelb.edu.au', type: 'research', category: 'ai_layoffs', region: 'Asia-Pacific', country: 'AU', tier: 5, description: 'AI governance and workforce.' },
  { name: 'NBER', url: 'https://nber.org', type: 'research', category: 'both', region: 'US', tier: 3, checkFrequency: 'monthly', description: 'National Bureau of Economic Research — working papers on AI and employment.' },

  // ═══════════════════════════════════════════════════════════
  // REPORTS & CONSULTANCIES
  // ═══════════════════════════════════════════════════════════
  { name: 'BCG AI at Work', url: 'https://bcg.com', type: 'research', category: 'ai_layoffs', region: 'Global', tier: 4, checkFrequency: 'quarterly', description: '20-30% ROI improvement with mature AI adoption.' },
  { name: 'Deloitte', url: 'https://deloitte.com', type: 'research', category: 'both', region: 'Global', tier: 4, checkFrequency: 'quarterly', description: 'Manufacturing enterprise restructuring + AI.' },
  { name: 'Gartner', url: 'https://gartner.com', type: 'research', category: 'ai_layoffs', region: 'Global', tier: 3, checkFrequency: 'quarterly', paywalled: true, description: '20% of orgs flatten org structure via AI by 2026.' },
  { name: 'Oxford Economics', url: 'https://oxfordeconomics.com', type: 'research', category: 'ai_layoffs', region: 'Global', tier: 4, checkFrequency: 'quarterly', description: 'AI layoffs as convenient corporate fiction.' },
  { name: 'Capgemini', url: 'https://capgemini.com', type: 'research', category: 'both', region: 'Global', tier: 4, checkFrequency: 'quarterly', description: 'Robotics and AI transforming OEM operations.' },
  { name: 'Accenture', url: 'https://accenture.com', type: 'research', category: 'both', region: 'Global', tier: 4, checkFrequency: 'quarterly', description: 'Workforce transformation studies.' },
  { name: 'Resume.org', url: 'https://resume.org', type: 'research', category: 'ai_layoffs', region: 'US', tier: 4, description: '58% of companies plan layoffs; 37% expect to replace roles with AI by end 2026.' },
  { name: 'HR Executive', url: 'https://hrexecutive.com', type: 'industry', category: 'ai_layoffs', region: 'US', tier: 4, checkFrequency: 'weekly', description: 'AI Layoff Trap: Why Half Will Be Quietly Rehired.' },
  { name: 'The HR Digest', url: 'https://thehrdigest.com', type: 'industry', category: 'ai_layoffs', region: 'Global', tier: 4, checkFrequency: 'weekly', description: 'AI layoffs and future of work analysis.' },
  { name: 'ILO GenAI Working Paper', url: 'https://ilo.org', type: 'research', category: 'ai_layoffs', region: 'Global', tier: 4, description: 'Task-based exposure analysis by country income.' },

  // ═══════════════════════════════════════════════════════════
  // LAYOFF TRACKERS (not already seeded)
  // ═══════════════════════════════════════════════════════════
  { name: 'TrueUp', url: 'https://trueup.io/layoffs', type: 'tracker', category: 'both', region: 'Global', tier: 2, checkFrequency: 'daily', description: '156 layoffs / 52,955 people in 2026 so far.' },
  { name: 'SkillSyncer', url: 'https://skillsyncer.com/layoffs-tracker', type: 'tracker', category: 'both', region: 'Global', tier: 3, checkFrequency: 'weekly', description: '338 events / 205K people in 2025.' },
  { name: 'opentools.ai', url: 'https://opentools.ai/news', type: 'news', category: 'ai_layoffs', region: 'Global', tier: 4, checkFrequency: 'weekly', description: 'Covered 45K layoffs in March 2026.' },

  // ═══════════════════════════════════════════════════════════
  // ASIA-PACIFIC GOVERNMENT LABOR AGENCIES — East Asia
  // ═══════════════════════════════════════════════════════════
  { name: 'Japan MHLW', url: 'https://www.mhlw.go.jp/english/', type: 'government', category: 'both', region: 'Asia-Pacific', country: 'JP', language: 'ja', tier: 4, checkFrequency: 'monthly', description: 'Ministry of Health, Labour and Welfare — Monthly Labour Survey, wage structure surveys.' },
  { name: 'Japan e-Stat Portal', url: 'https://www.e-stat.go.jp/en', type: 'government', category: 'both', region: 'Asia-Pacific', country: 'JP', language: 'ja', tier: 3, hasApi: true, description: 'REST API (JSON, XML, CSV). All official Japanese statistics including employment.' },
  { name: 'South Korea MOEL', url: 'https://www.moel.go.kr/english/', type: 'government', category: 'both', region: 'Asia-Pacific', country: 'KR', language: 'ko', tier: 4, checkFrequency: 'monthly', description: 'Ministry of Employment and Labor — mass layoff reporting required.' },
  { name: 'KOSIS', url: 'https://kosis.kr/eng/', type: 'government', category: 'both', region: 'Asia-Pacific', country: 'KR', language: 'ko', tier: 3, hasApi: true, description: 'Korean Statistical Information Service — central statistics portal.' },
  { name: 'KEIS', url: 'https://www.keis.or.kr/keis/en/', type: 'government', category: 'both', region: 'Asia-Pacific', country: 'KR', language: 'ko', tier: 4, description: 'Korea Employment Information Service.' },
  { name: 'China MOHRSS', url: 'http://www.mohrss.gov.cn/', type: 'government', category: 'both', region: 'Asia-Pacific', country: 'CN', language: 'zh', tier: 4, description: 'Ministry of Human Resources and Social Security — registered unemployment data.' },
  { name: 'Taiwan MOL', url: 'https://english.mol.gov.tw/', type: 'government', category: 'both', region: 'Asia-Pacific', country: 'TW', tier: 4, checkFrequency: 'monthly', description: 'Taiwan Ministry of Labor.' },
  { name: 'Taiwan DGBAS', url: 'https://eng.stat.gov.tw/', type: 'government', category: 'both', region: 'Asia-Pacific', country: 'TW', tier: 4, checkFrequency: 'monthly', description: 'National Statistics — monthly Manpower Survey.' },
  { name: 'Hong Kong C&SD', url: 'https://www.censtatd.gov.hk/en/', type: 'government', category: 'both', region: 'Asia-Pacific', country: 'HK', tier: 4, checkFrequency: 'quarterly', description: 'Census and Statistics Department — quarterly employment, vacancies, wages.' },
  { name: 'Hong Kong Labour Department', url: 'https://www.labour.gov.hk/eng/', type: 'government', category: 'both', region: 'Asia-Pacific', country: 'HK', tier: 4, description: 'Labour statistics and employment services.' },
  { name: 'Macau DSEC', url: 'https://www.dsec.gov.mo/', type: 'government', category: 'both', region: 'Asia-Pacific', country: 'MO', tier: 5, checkFrequency: 'quarterly', description: 'Statistics and Census Service — quarterly employment surveys.' },

  // ═══════════════════════════════════════════════════════════
  // ASIA-PACIFIC GOVERNMENT — South Asia
  // ═══════════════════════════════════════════════════════════
  { name: 'India Ministry of Labour', url: 'https://www.labour.gov.in/', type: 'government', category: 'both', region: 'Asia-Pacific', country: 'IN', tier: 4, description: 'Oversees all Indian labor policy.' },
  { name: 'India Labour Bureau', url: 'https://labourbureau.gov.in/', type: 'government', category: 'both', region: 'Asia-Pacific', country: 'IN', tier: 3, checkFrequency: 'quarterly', description: 'Quarterly Employment Survey covering 12,038 establishments in 9 sectors.' },
  { name: 'eShram Portal', url: 'https://eshram.gov.in/', type: 'government', category: 'both', region: 'Asia-Pacific', country: 'IN', tier: 5, description: 'National database of unorganized workers (290M+ registered).' },
  { name: 'Pakistan Bureau of Statistics', url: 'https://www.pbs.gov.pk/', type: 'government', category: 'both', region: 'Asia-Pacific', country: 'PK', tier: 5, checkFrequency: 'yearly', description: 'Labour Force Survey since 1963.' },
  { name: 'Bangladesh Bureau of Statistics', url: 'https://bbs.gov.bd/', type: 'government', category: 'both', region: 'Asia-Pacific', country: 'BD', tier: 5, checkFrequency: 'quarterly', description: 'Quarterly Labour Force Survey.' },
  { name: 'Sri Lanka DCS', url: 'https://www.statistics.gov.lk/', type: 'government', category: 'both', region: 'Asia-Pacific', country: 'LK', tier: 5, checkFrequency: 'quarterly', description: 'Quarterly Labour Force Survey.' },
  { name: 'Nepal NSO', url: 'https://www.nso.gov.np/', type: 'government', category: 'both', region: 'Asia-Pacific', country: 'NP', tier: 5, description: 'Labour Force and Economic Activities statistics.' },

  // ═══════════════════════════════════════════════════════════
  // ASIA-PACIFIC GOVERNMENT — Southeast Asia
  // ═══════════════════════════════════════════════════════════
  { name: 'Singapore MOM Statistics', url: 'https://stats.mom.gov.sg/', type: 'government', category: 'both', region: 'Asia-Pacific', country: 'SG', tier: 3, checkFrequency: 'quarterly', description: 'Detailed employment tables, annual Labour Force report.' },
  { name: 'Singapore DOS', url: 'https://www.singstat.gov.sg/', type: 'government', category: 'both', region: 'Asia-Pacific', country: 'SG', tier: 4, description: 'SingStat — labour, employment, wages theme.' },
  { name: 'Malaysia DOSM', url: 'https://www.dosm.gov.my/', type: 'government', category: 'both', region: 'Asia-Pacific', country: 'MY', tier: 3, checkFrequency: 'monthly', description: 'Monthly Labour Force Statistics. OpenDOSM provides machine-readable data.' },
  { name: 'OpenDOSM', url: 'https://open.dosm.gov.my/', type: 'government', category: 'both', region: 'Asia-Pacific', country: 'MY', tier: 3, hasApi: true, description: 'Malaysia open data in machine-readable formats.' },
  { name: 'BPS Indonesia', url: 'https://www.bps.go.id/en/', type: 'government', category: 'both', region: 'Asia-Pacific', country: 'ID', language: 'id', tier: 4, checkFrequency: 'quarterly', description: 'National Labour Force Survey (Sakernas).' },
  { name: 'Philippines PSA', url: 'https://psa.gov.ph/', type: 'government', category: 'both', region: 'Asia-Pacific', country: 'PH', tier: 4, checkFrequency: 'monthly', description: 'Monthly Labor Force Survey. OpenSTAT data portal.' },
  { name: 'Philippines DOLE', url: 'https://www.dole.gov.ph/', type: 'government', category: 'both', region: 'Asia-Pacific', country: 'PH', tier: 4, description: 'Reports on establishment closures/layoffs.' },
  { name: 'Thailand NSO', url: 'https://www.nso.go.th/', type: 'government', category: 'both', region: 'Asia-Pacific', country: 'TH', language: 'th', tier: 4, description: 'Labour Force Survey following ILO/UN standards.' },
  { name: 'Vietnam NSO', url: 'https://www.gso.gov.vn/en/', type: 'government', category: 'both', region: 'Asia-Pacific', country: 'VN', language: 'vi', tier: 4, description: 'Employment statistics. Labour force 52.7M.' },
  { name: 'Cambodia NIS', url: 'https://nis.gov.kh/', type: 'government', category: 'both', region: 'Asia-Pacific', country: 'KH', tier: 5, description: 'National Institute of Statistics — labour force data.' },
  { name: 'Laos LSB', url: 'https://www.lsb.gov.la/', type: 'government', category: 'both', region: 'Asia-Pacific', country: 'LA', tier: 5, description: 'Lao Statistics Bureau — employment data.' },
  { name: 'Myanmar CSO', url: 'https://www.csostat.gov.mm/', type: 'government', category: 'both', region: 'Asia-Pacific', country: 'MM', tier: 5, description: 'Central Statistical Organization — limited data post-2021.' },
  { name: 'Brunei DEPS', url: 'https://deps.mofe.gov.bn/', type: 'government', category: 'both', region: 'Asia-Pacific', country: 'BN', tier: 5, description: 'Labour Force Surveys and Annual Statistical Yearbook.' },

  // ═══════════════════════════════════════════════════════════
  // OCEANIA — Australia State WHS
  // ═══════════════════════════════════════════════════════════
  { name: 'Jobs and Skills Australia', url: 'https://www.jobsandskills.gov.au/', type: 'government', category: 'both', region: 'Asia-Pacific', country: 'AU', tier: 3, checkFrequency: 'monthly', description: 'Monthly Labour Market Dashboards, Internet Vacancy Index, Employment Projections.' },
  { name: 'Fair Work Ombudsman', url: 'https://www.fairwork.gov.au/', type: 'government', category: 'both', region: 'Asia-Pacific', country: 'AU', tier: 4, description: 'Employers must notify of redundancies of 15+ employees.' },
  { name: 'SafeWork NSW', url: 'https://www.safework.nsw.gov.au/', type: 'government', category: 'both', region: 'Asia-Pacific', country: 'AU', tier: 5, description: 'New South Wales workplace health and safety.' },
  { name: 'WorkSafe Victoria', url: 'https://www.worksafe.vic.gov.au/', type: 'government', category: 'both', region: 'Asia-Pacific', country: 'AU', tier: 5, description: 'Victoria workplace health and safety.' },
  { name: 'WorkSafe Queensland', url: 'https://www.worksafe.qld.gov.au/', type: 'government', category: 'both', region: 'Asia-Pacific', country: 'AU', tier: 5, description: 'Queensland workplace health and safety.' },
  { name: 'SafeWork SA', url: 'https://www.safework.sa.gov.au/', type: 'government', category: 'both', region: 'Asia-Pacific', country: 'AU', tier: 5, description: 'South Australia workplace health and safety.' },
  { name: 'WorkSafe WA', url: 'https://www.dmirs.wa.gov.au/worksafe', type: 'government', category: 'both', region: 'Asia-Pacific', country: 'AU', tier: 5, description: 'Western Australia workplace health and safety.' },
  { name: 'WorkSafe Tasmania', url: 'https://worksafe.tas.gov.au/', type: 'government', category: 'both', region: 'Asia-Pacific', country: 'AU', tier: 5, description: 'Tasmania workplace health and safety.' },
  { name: 'WorkSafe ACT', url: 'https://www.worksafe.act.gov.au/', type: 'government', category: 'both', region: 'Asia-Pacific', country: 'AU', tier: 5, description: 'ACT workplace health and safety.' },
  { name: 'NT WorkSafe', url: 'https://worksafe.nt.gov.au/', type: 'government', category: 'both', region: 'Asia-Pacific', country: 'AU', tier: 5, description: 'Northern Territory workplace health and safety.' },

  // ═══════════════════════════════════════════════════════════
  // OCEANIA — New Zealand
  // ═══════════════════════════════════════════════════════════
  { name: 'Stats NZ', url: 'https://www.stats.govt.nz/', type: 'government', category: 'both', region: 'Asia-Pacific', country: 'NZ', tier: 3, hasApi: true, checkFrequency: 'quarterly', description: 'Household Labour Force Survey, Quarterly Employment Survey.' },
  { name: 'MBIE NZ', url: 'https://www.mbie.govt.nz/', type: 'government', category: 'both', region: 'Asia-Pacific', country: 'NZ', tier: 4, checkFrequency: 'quarterly', description: 'Labour Market Statistics Snapshots, Monthly Labour Market Fact Sheets.' },

  // ═══════════════════════════════════════════════════════════
  // OCEANIA — Pacific Islands
  // ═══════════════════════════════════════════════════════════
  { name: 'Fiji Bureau of Statistics', url: 'https://www.statsfiji.gov.fj/', type: 'government', category: 'both', region: 'Asia-Pacific', country: 'FJ', tier: 5, description: 'Employment and Unemployment Survey.' },
  { name: 'PNG NSO', url: 'https://www.nso.gov.pg/', type: 'government', category: 'both', region: 'Asia-Pacific', country: 'PG', tier: 5, description: 'Papua New Guinea — census-based employment data.' },
  { name: 'Samoa Bureau of Statistics', url: 'https://www.sbs.gov.ws/', type: 'government', category: 'both', region: 'Asia-Pacific', country: 'WS', tier: 5, description: 'Labour force data from census and household surveys.' },
  { name: 'Tonga Statistics', url: 'https://tongastats.gov.to/', type: 'government', category: 'both', region: 'Asia-Pacific', country: 'TO', tier: 5, description: 'Census-based employment data.' },
  { name: 'Vanuatu VNSO', url: 'https://vnso.gov.vu/', type: 'government', category: 'both', region: 'Asia-Pacific', country: 'VU', tier: 5, description: 'Labour market data from Household Income and Expenditure Survey.' },
  { name: 'Solomon Islands NSO', url: 'https://www.statistics.gov.sb/', type: 'government', category: 'both', region: 'Asia-Pacific', country: 'SB', tier: 5, description: 'Limited employment data, primarily census-based.' },

  // ═══════════════════════════════════════════════════════════
  // CENTRAL ASIA
  // ═══════════════════════════════════════════════════════════
  { name: 'Mongolia NSO', url: 'https://www.1212.mn/', type: 'government', category: 'both', region: 'Asia-Pacific', country: 'MN', tier: 5, description: 'Employment rate data, labour force survey.' },
  { name: 'Kazakhstan Statistics', url: 'https://stat.gov.kz/en/', type: 'government', category: 'both', region: 'Asia-Pacific', country: 'KZ', tier: 4, description: 'Employment and unemployment section.' },
  { name: 'Uzbekistan Statistics', url: 'https://stat.uz/en/', type: 'government', category: 'both', region: 'Asia-Pacific', country: 'UZ', tier: 5, description: 'Employment and labour data. Open data portal.' },
  { name: 'Kyrgyzstan Statistics', url: 'https://stat.gov.kg/en/', type: 'government', category: 'both', region: 'Asia-Pacific', country: 'KG', tier: 5, hasApi: true, description: 'Employment section with open data portal (JSON, XML, Excel).' },
  { name: 'Tajikistan Statistics', url: 'https://stat.tj/', type: 'government', category: 'both', region: 'Asia-Pacific', country: 'TJ', language: 'ru', tier: 5, description: 'Labour and employment section.' },

  // ═══════════════════════════════════════════════════════════
  // REGIONAL ORGANIZATIONS — Asia-Pacific
  // ═══════════════════════════════════════════════════════════
  { name: 'ADB Key Indicators', url: 'https://kidb.adb.org/', type: 'government', category: 'both', region: 'Asia-Pacific', tier: 3, hasApi: true, description: 'Asian Development Bank — 49 regional members, employment, labour force, wages.' },
  { name: 'ADB Data Library', url: 'https://data.adb.org/', type: 'government', category: 'both', region: 'Asia-Pacific', tier: 3, hasApi: true, description: 'Machine-readable datasets including employment/MSME data.' },
  { name: 'StatsAPEC', url: 'https://statistics.apec.org/', type: 'government', category: 'both', region: 'Asia-Pacific', tier: 4, description: 'Economic and labour indicators for 21 APEC member economies.' },
  { name: 'APEC Skills Map', url: 'https://skillsmap.apec.org/', type: 'government', category: 'both', region: 'Asia-Pacific', tier: 4, description: 'Regional skill shortages, employment trends across APEC economies.' },
  { name: 'ASEANstats', url: 'https://www.aseanstats.org/', type: 'government', category: 'both', region: 'Asia-Pacific', tier: 4, description: 'Employment indicators for 10 ASEAN members.' },
  { name: 'Pacific Community SPC', url: 'https://sdd.spc.int/', type: 'government', category: 'both', region: 'Asia-Pacific', tier: 4, description: 'Pacific Island labour data aggregation.' },

  // ═══════════════════════════════════════════════════════════
  // EUROPEAN GOVERNMENT SOURCES (from govt-academic research)
  // ═══════════════════════════════════════════════════════════
  { name: 'DARES (France)', url: 'https://dares.travail-emploi.gouv.fr', type: 'government', category: 'both', region: 'Europe', country: 'FR', language: 'fr', tier: 3, checkFrequency: 'quarterly', description: 'Publishes PSE collective layoff plans data quarterly.' },
  { name: 'France Travail', url: 'https://www.francetravail.fr', type: 'government', category: 'both', region: 'Europe', country: 'FR', language: 'fr', tier: 4, description: 'Formerly Pole Emploi — unemployment registration, job market data.' },
  { name: 'INPS (Italy)', url: 'https://www.inps.it', type: 'government', category: 'both', region: 'Europe', country: 'IT', language: 'it', tier: 3, checkFrequency: 'monthly', description: 'Cassa Integrazione (wage supplementation for temporary layoffs). Monthly observatory reports.' },
  { name: 'SEPE (Spain)', url: 'https://www.sepe.es', type: 'government', category: 'both', region: 'Europe', country: 'ES', language: 'es', tier: 3, checkFrequency: 'monthly', description: 'ERE/ERTE data (collective/temporary layoff mechanisms).' },
  { name: 'Bundesagentur fur Arbeit', url: 'https://www.arbeitsagentur.de', type: 'government', category: 'both', region: 'Europe', country: 'DE', language: 'de', tier: 3, checkFrequency: 'monthly', description: 'Mass layoff notifications (20+ employees). Monthly labor market reports.' },
  { name: 'IAB Germany', url: 'https://www.iab.de/en', type: 'research', category: 'both', region: 'Europe', country: 'DE', tier: 4, description: 'Institute for Employment Research — AI impact studies.' },
  { name: 'CBS Netherlands', url: 'https://www.cbs.nl/en-gb', type: 'government', category: 'both', region: 'Europe', country: 'NL', tier: 4, hasApi: true, checkFrequency: 'monthly', description: 'Labour market dashboard. Open data portal with API.' },
  { name: 'UWV Netherlands', url: 'https://www.uwv.nl', type: 'government', category: 'both', region: 'Europe', country: 'NL', language: 'nl', tier: 4, description: 'Collective dismissal notifications (20+ employees).' },
  { name: 'Arbetsformedlingen (Sweden)', url: 'https://www.arbetsformedlingen.se', type: 'government', category: 'both', region: 'Europe', country: 'SE', language: 'sv', tier: 3, checkFrequency: 'monthly', description: 'Monthly varsel (layoff notice) statistics.' },
  { name: 'SCB Sweden', url: 'https://www.scb.se/en/', type: 'government', category: 'both', region: 'Europe', country: 'SE', tier: 4, hasApi: true, description: 'Labour Force Survey. Open data API.' },
  { name: 'SSB Norway', url: 'https://www.ssb.no/en', type: 'government', category: 'both', region: 'Europe', country: 'NO', tier: 4, hasApi: true, description: 'Labour Force Survey. PxWeb API. StatBank.' },
  { name: 'NAV Norway', url: 'https://www.nav.no', type: 'government', category: 'both', region: 'Europe', country: 'NO', tier: 4, description: 'Mass layoff notifications. Monthly registered unemployment.' },
  { name: 'Danmarks Statistik', url: 'https://www.dst.dk/en', type: 'government', category: 'both', region: 'Europe', country: 'DK', tier: 4, hasApi: true, description: 'Labour market data. StatBank with API.' },
  { name: 'Statistics Finland', url: 'https://www.stat.fi/en', type: 'government', category: 'both', region: 'Europe', country: 'FI', tier: 4, hasApi: true, description: 'Labour Force Survey. Open data API.' },
  { name: 'GUS Poland', url: 'https://stat.gov.pl/en/', type: 'government', category: 'both', region: 'Europe', country: 'PL', tier: 4, hasApi: true, description: 'Labour market section. BDL local data bank with API.' },
  { name: 'CZSO', url: 'https://www.czso.cz/csu/czso/home', type: 'government', category: 'both', region: 'Europe', country: 'CZ', tier: 4, description: 'Czech Labour Force Survey since 1992.' },
  { name: 'KSH Hungary', url: 'https://www.ksh.hu/labour', type: 'government', category: 'both', region: 'Europe', country: 'HU', tier: 4, description: 'Labour Force Survey. STADAT tables downloadable.' },
  { name: 'Statistics Estonia', url: 'https://stat.ee/en', type: 'government', category: 'both', region: 'Europe', country: 'EE', tier: 4, hasApi: true, description: 'Labour market section. Open data API.' },
  { name: 'CSB Latvia', url: 'https://stat.gov.lv/en', type: 'government', category: 'both', region: 'Europe', country: 'LV', tier: 4, hasApi: true, description: 'Labour Force Survey. PxWeb API.' },
  { name: 'Statistics Lithuania', url: 'https://www.stat.gov.lt/en', type: 'government', category: 'both', region: 'Europe', country: 'LT', tier: 4, description: 'Labour market data. Official Statistics Portal.' },
  { name: 'AMS Austria', url: 'https://www.ams.at', type: 'government', category: 'both', region: 'Europe', country: 'AT', language: 'de', tier: 4, description: 'Monthly labor market data. Collective dismissal notifications.' },
  { name: 'SECO Switzerland', url: 'https://www.seco.admin.ch', type: 'government', category: 'both', region: 'Europe', country: 'CH', tier: 4, description: 'Mass layoff notification process. Monthly unemployment stats.' },
  { name: 'BFS Switzerland', url: 'https://www.bfs.admin.ch/bfs/en/home/statistics/work-income.html', type: 'government', category: 'both', region: 'Europe', country: 'CH', tier: 4, hasApi: true, description: 'Labour Force Survey. API available.' },
  { name: 'Statbel Belgium', url: 'https://statbel.fgov.be/en', type: 'government', category: 'both', region: 'Europe', country: 'BE', tier: 4, description: 'Labour Force Survey. Open data.' },
  { name: 'INE Portugal', url: 'https://www.ine.pt/xportal/xmain?xpgid=ine_main&xpid=INE&xlang=en', type: 'government', category: 'both', region: 'Europe', country: 'PT', tier: 4, checkFrequency: 'quarterly', description: 'Labour Force Survey quarterly.' },
  { name: 'TurkStat', url: 'https://www.tuik.gov.tr', type: 'government', category: 'both', region: 'Europe', country: 'TR', tier: 4, checkFrequency: 'monthly', description: 'Labour Force Survey monthly.' },
  { name: 'Statistics Iceland', url: 'https://www.statice.is', type: 'government', category: 'both', region: 'Europe', country: 'IS', tier: 5, hasApi: true, description: 'Labour market data. PxWeb API.' },
  { name: 'INS Romania', url: 'https://insse.ro/cms/en', type: 'government', category: 'both', region: 'Europe', country: 'RO', tier: 5, description: 'Labour Force Survey. TEMPO online database.' },
  { name: 'NSI Bulgaria', url: 'https://www.nsi.bg/en', type: 'government', category: 'both', region: 'Europe', country: 'BG', tier: 5, description: 'Labour Force Survey. Infostat database.' },
  { name: 'ELSTAT Greece', url: 'https://www.statistics.gr/en/home', type: 'government', category: 'both', region: 'Europe', country: 'GR', tier: 5, checkFrequency: 'quarterly', description: 'Labour Force Survey quarterly.' },
  { name: 'DZS Croatia', url: 'https://dzs.gov.hr/en', type: 'government', category: 'both', region: 'Europe', country: 'HR', tier: 5, description: 'Labour Force Survey.' },
  { name: 'SURS Slovenia', url: 'https://www.stat.si/StatWeb/en', type: 'government', category: 'both', region: 'Europe', country: 'SI', tier: 5, description: 'Labour market data. SiStat database.' },

  // ═══════════════════════════════════════════════════════════
  // UK ADDITIONAL GOVERNMENT
  // ═══════════════════════════════════════════════════════════
  { name: 'DSIT (UK)', url: 'https://www.gov.uk/government/organisations/department-for-science-innovation-and-technology', type: 'government', category: 'ai_layoffs', region: 'UK', country: 'GB', tier: 4, description: 'AI could displace 3M UK jobs; plans to upskill 7.5M.' },

  // ═══════════════════════════════════════════════════════════
  // CANADA PROVINCIAL
  // ═══════════════════════════════════════════════════════════
  { name: 'Statistics Canada Labour', url: 'https://www.statcan.gc.ca/en/subjects-start/labour_', type: 'government', category: 'both', region: 'Canada', country: 'CA', tier: 3, hasApi: true, checkFrequency: 'monthly', description: 'Labour Force Survey monthly. Provincial breakdowns. SDMX/CSV API.' },
  { name: 'Canada Job Bank', url: 'https://www.jobbank.gc.ca/trend-analysis', type: 'government', category: 'both', region: 'Canada', country: 'CA', tier: 4, description: 'Sectoral and regional employment trends.' },
  { name: 'ISQ Quebec', url: 'https://statistique.quebec.ca/en/theme/travail-et-remuneration', type: 'government', category: 'both', region: 'Canada', country: 'CA', language: 'fr', tier: 4, description: 'Quebec labour and compensation data.' },

  // ═══════════════════════════════════════════════════════════
  // AMERICAS GOVERNMENT (non-US)
  // ═══════════════════════════════════════════════════════════
  { name: 'IMSS Mexico', url: 'https://www.imss.gob.mx', type: 'government', category: 'both', region: 'Americas', country: 'MX', language: 'es', tier: 4, checkFrequency: 'monthly', description: 'Formal employment registrations monthly by sector/state.' },
  { name: 'MTE Brazil (CAGED)', url: 'https://www.gov.br/trabalho-e-emprego/', type: 'government', category: 'both', region: 'Americas', country: 'BR', language: 'pt', tier: 3, checkFrequency: 'monthly', description: 'CAGED formal employment registry — monthly hiring/firing data.' },
  { name: 'INDEC Argentina', url: 'https://www.indec.gob.ar', type: 'government', category: 'both', region: 'Americas', country: 'AR', language: 'es', tier: 4, checkFrequency: 'quarterly', description: 'EPH Permanent Household Survey quarterly.' },
  { name: 'INE Chile', url: 'https://www.ine.gob.cl/statistics/social/labour-market', type: 'government', category: 'both', region: 'Americas', country: 'CL', language: 'es', tier: 4, checkFrequency: 'monthly', description: 'ENE National Employment Survey monthly.' },
  { name: 'DANE Colombia', url: 'https://www.dane.gov.co', type: 'government', category: 'both', region: 'Americas', country: 'CO', language: 'es', tier: 4, checkFrequency: 'monthly', description: 'GEIH Integrated Household Survey monthly.' },
  { name: 'INEI Peru', url: 'https://www.inei.gob.pe', type: 'government', category: 'both', region: 'Americas', country: 'PE', language: 'es', tier: 4, description: 'ENAHO National Household Survey.' },
  { name: 'INEC Costa Rica', url: 'https://www.inec.cr', type: 'government', category: 'both', region: 'Americas', country: 'CR', language: 'es', tier: 4, checkFrequency: 'quarterly', description: 'ECE Continuous Employment Survey — best data quality in Central America.' },

  // ═══════════════════════════════════════════════════════════
  // MIDDLE EAST GOVERNMENT
  // ═══════════════════════════════════════════════════════════
  { name: 'GASTAT Saudi Arabia', url: 'https://www.stats.gov.sa', type: 'government', category: 'both', region: 'Middle East', country: 'SA', tier: 4, hasApi: true, checkFrequency: 'quarterly', description: 'Labour Force Survey quarterly. Open data portal.' },
  { name: 'MoHRE UAE', url: 'https://www.mohre.gov.ae', type: 'government', category: 'both', region: 'Middle East', country: 'AE', tier: 4, description: 'Private sector employment data. Open data section.' },
  { name: 'LMRA Bahrain', url: 'https://www.lmra.bh', type: 'government', category: 'both', region: 'Middle East', country: 'BH', tier: 4, checkFrequency: 'quarterly', description: 'Bahrain Labour Market Indicators quarterly.' },
  { name: 'CBS Israel', url: 'https://www.cbs.gov.il/en', type: 'government', category: 'both', region: 'Middle East', country: 'IL', tier: 3, hasApi: true, checkFrequency: 'monthly', description: 'Labour Force Survey monthly. High data quality.' },
  { name: 'SCI Iran', url: 'https://www.amar.org.ir', type: 'government', category: 'both', region: 'Middle East', country: 'IR', language: 'fa', tier: 5, checkFrequency: 'quarterly', description: 'Labour Force Survey quarterly.' },
  { name: 'CAPMAS Egypt', url: 'https://www.capmas.gov.eg', type: 'government', category: 'both', region: 'Africa', country: 'EG', tier: 4, checkFrequency: 'quarterly', description: 'Labour Force Survey quarterly.' },

  // ═══════════════════════════════════════════════════════════
  // AFRICA GOVERNMENT
  // ═══════════════════════════════════════════════════════════
  { name: 'SA Dept of Employment and Labour', url: 'https://www.labour.gov.za', type: 'government', category: 'both', region: 'Africa', country: 'ZA', tier: 4, description: 'Section 189/189A retrenchment notifications (SA WARN equivalent, 50+ employees).' },
  { name: 'NBS Nigeria', url: 'https://nigerianstat.gov.ng', type: 'government', category: 'both', region: 'Africa', country: 'NG', tier: 4, description: 'Nigeria Labour Force Survey. ILO-aligned.' },
  { name: 'Ghana Statistical Service', url: 'https://www.statsghana.gov.gh', type: 'government', category: 'both', region: 'Africa', country: 'GH', tier: 5, description: 'Ghana Living Standards Survey includes employment.' },
  { name: 'KNBS Kenya', url: 'https://www.knbs.or.ke', type: 'government', category: 'both', region: 'Africa', country: 'KE', tier: 4, description: 'Labour Force Survey. Economic Survey annual.' },
  { name: 'HCP Morocco', url: 'https://www.hcp.ma', type: 'government', category: 'both', region: 'Africa', country: 'MA', language: 'fr', tier: 4, checkFrequency: 'quarterly', description: 'National Employment Survey quarterly. Good data quality.' },
  { name: 'NISR Rwanda', url: 'https://www.statistics.gov.rw', type: 'government', category: 'both', region: 'Africa', country: 'RW', tier: 5, description: 'Labour Force Survey annual. Open data portal.' },

  // ═══════════════════════════════════════════════════════════
  // REGIONAL ORGANIZATIONS — Global/Other
  // ═══════════════════════════════════════════════════════════
  { name: 'IDB Labour Markets', url: 'https://www.iadb.org/en/who-we-are/topics/labor-markets-and-pensions', type: 'government', category: 'both', region: 'Americas', tier: 4, hasApi: true, description: 'Inter-American Development Bank — SIMS labor market info for LAC.' },
  { name: 'ECLAC/CEPAL', url: 'https://www.cepal.org/en', type: 'government', category: 'both', region: 'Americas', tier: 4, description: 'CEPALSTAT database includes employment. Annual Statistical Yearbook.' },
  { name: 'AfDB Statistics', url: 'https://www.afdb.org/en/knowledge/statistics', type: 'government', category: 'both', region: 'Africa', tier: 4, description: 'African Development Bank — data portal for Africa.' },
  { name: 'GCC-Stat', url: 'https://gccstat.org', type: 'government', category: 'both', region: 'Middle East', tier: 4, description: 'Labour statistics for all 6 GCC states.' },
  { name: 'GLMM', url: 'https://gulfmigration.grc.net', type: 'research', category: 'both', region: 'Middle East', tier: 4, description: 'Gulf Labour Markets and Migration — detailed employment by nationality/sector across GCC.' },
  { name: 'Geostat Georgia', url: 'https://www.geostat.ge/en', type: 'government', category: 'both', region: 'Europe', country: 'GE', tier: 5, description: 'Labour Force Survey. Employment and wages section.' },
  { name: 'Ukraine Statistics', url: 'https://stat.gov.ua/en', type: 'government', category: 'both', region: 'Europe', country: 'UA', tier: 5, description: 'Labour Force Survey. Wartime data gaps.' },

  // ═══════════════════════════════════════════════════════════
  // ADDITIONAL UK/AU/CA SOURCES
  // ═══════════════════════════════════════════════════════════
  { name: 'DEWR Australia', url: 'https://www.dewr.gov.au/', type: 'government', category: 'both', region: 'Asia-Pacific', country: 'AU', tier: 4, description: 'Department of Employment and Workplace Relations.' },
  { name: 'ESDC Canada', url: 'https://www.canada.ca/en/employment-social-development.html', type: 'government', category: 'both', region: 'Canada', country: 'CA', tier: 4, description: 'Employment and Social Development Canada — federal labor policy, EI data.' },
  { name: 'Federal Reserve (AI research)', url: 'https://federalreserve.gov', type: 'research', category: 'ai_layoffs', region: 'US', tier: 4, description: 'Educational exposure to GenAI research notes.' },
  { name: 'GAO', url: 'https://gao.gov', type: 'government', category: 'ai_layoffs', region: 'US', country: 'US', tier: 4, description: 'Federal AI use cases doubled (571 to 1,110) in 2023-24.' },
]
