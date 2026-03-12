export interface SourceSeed {
  name: string; url: string; type: string; category: string;
  region?: string; country?: string; language?: string; description?: string;
  tier: number; checkFrequency?: string; hasApi?: boolean; hasRss?: boolean;
  rssUrl?: string; paywalled?: boolean;
}

export const newsPublicationSources: SourceSeed[] = [
  // ============================================================
  // NORTH AMERICA — United States
  // ============================================================
  { name: 'The New York Times', url: 'https://www.nytimes.com/', type: 'news', category: 'both', region: 'US', country: 'US', language: 'en', description: "America's newspaper of record", tier: 3, paywalled: true, hasRss: true },
  { name: 'The Washington Post', url: 'https://www.washingtonpost.com/', type: 'news', category: 'both', region: 'US', country: 'US', language: 'en', description: "America's leading political newspaper", tier: 3, paywalled: true, hasRss: true },
  { name: 'USA Today', url: 'https://www.usatoday.com/', type: 'news', category: 'both', region: 'US', country: 'US', language: 'en', description: "America's widely circulated national daily", tier: 3, hasRss: true },
  { name: 'Los Angeles Times', url: 'https://www.latimes.com/', type: 'news', category: 'both', region: 'US', country: 'US', language: 'en', description: "California's largest newspaper", tier: 3, paywalled: true, hasRss: true },
  { name: 'Chicago Tribune', url: 'https://www.chicagotribune.com/', type: 'news', category: 'both', region: 'US', country: 'US', language: 'en', description: "Chicago's major daily newspaper", tier: 4, paywalled: true, hasRss: true },
  { name: 'The Boston Globe', url: 'https://www.bostonglobe.com/', type: 'news', category: 'both', region: 'US', country: 'US', language: 'en', description: "Boston's leading newspaper", tier: 4, paywalled: true, hasRss: true },
  { name: 'The Seattle Times', url: 'https://www.seattletimes.com/', type: 'news', category: 'both', region: 'US', country: 'US', language: 'en', description: "Seattle's largest daily newspaper", tier: 4, paywalled: true, hasRss: true },
  { name: 'San Francisco Chronicle', url: 'https://www.sfchronicle.com/', type: 'news', category: 'both', region: 'US', country: 'US', language: 'en', description: "San Francisco's major daily", tier: 4, paywalled: true, hasRss: true },
  { name: 'Newsday', url: 'https://www.newsday.com/', type: 'news', category: 'both', region: 'US', country: 'US', language: 'en', description: "Long Island's major daily", tier: 4, paywalled: true, hasRss: true },
  { name: 'The Philadelphia Inquirer', url: 'https://www.inquirer.com/', type: 'news', category: 'both', region: 'US', country: 'US', language: 'en', description: "Philadelphia's leading newspaper", tier: 4, paywalled: true, hasRss: true },
  { name: 'The Dallas Morning News', url: 'https://www.dallasnews.com/', type: 'news', category: 'both', region: 'US', country: 'US', language: 'en', description: "Dallas's major daily newspaper", tier: 4, paywalled: true, hasRss: true },
  { name: 'Houston Chronicle', url: 'https://www.houstonchronicle.com/', type: 'news', category: 'both', region: 'US', country: 'US', language: 'en', description: "Houston's leading newspaper", tier: 4, paywalled: true, hasRss: true },
  { name: 'The Miami Herald', url: 'https://www.miamiherald.com/', type: 'news', category: 'both', region: 'US', country: 'US', language: 'en', description: "Miami's major daily newspaper", tier: 4, hasRss: true },
  { name: 'The Atlanta Journal-Constitution', url: 'https://www.ajc.com/', type: 'news', category: 'both', region: 'US', country: 'US', language: 'en', description: "Atlanta's leading newspaper", tier: 4, paywalled: true, hasRss: true },
  { name: 'The Denver Post', url: 'https://www.denverpost.com/', type: 'news', category: 'both', region: 'US', country: 'US', language: 'en', description: "Denver's major daily newspaper", tier: 4, hasRss: true },
  { name: 'Star Tribune', url: 'https://www.startribune.com/', type: 'news', category: 'both', region: 'US', country: 'US', language: 'en', description: "Minneapolis's leading newspaper", tier: 4, paywalled: true, hasRss: true },
  { name: 'The Detroit News', url: 'https://www.detroitnews.com/', type: 'news', category: 'both', region: 'US', country: 'US', language: 'en', description: "Detroit's major daily newspaper", tier: 4, hasRss: true },
  { name: 'Detroit Free Press', url: 'https://www.freep.com/', type: 'news', category: 'both', region: 'US', country: 'US', language: 'en', description: "Detroit's oldest daily newspaper", tier: 4, hasRss: true },
  { name: 'Las Vegas Review-Journal', url: 'https://www.reviewjournal.com/', type: 'news', category: 'both', region: 'US', country: 'US', language: 'en', description: "Las Vegas's largest newspaper", tier: 5, paywalled: true, hasRss: true },
  { name: 'The Oregonian', url: 'https://www.oregonlive.com/', type: 'news', category: 'both', region: 'US', country: 'US', language: 'en', description: "Oregon's largest newspaper", tier: 4, hasRss: true },
  { name: 'New York Post', url: 'https://nypost.com/', type: 'news', category: 'both', region: 'US', country: 'US', language: 'en', description: "New York's tabloid daily", tier: 4, hasRss: true },
  { name: 'Politico', url: 'https://www.politico.com/', type: 'news', category: 'both', region: 'US', country: 'US', language: 'en', description: "US political news outlet", tier: 3, hasRss: true },
  { name: 'Associated Press', url: 'https://apnews.com/', type: 'news', category: 'both', region: 'Global', country: 'US', language: 'en', description: "Global news wire service", tier: 3, hasRss: true },

  // ============================================================
  // NORTH AMERICA — Canada
  // ============================================================
  { name: 'The Globe and Mail', url: 'https://www.theglobeandmail.com/', type: 'news', category: 'both', region: 'Canada', country: 'CA', language: 'en', description: "Canada's national newspaper of record", tier: 3, paywalled: true, hasRss: true },
  { name: 'Toronto Star', url: 'https://www.thestar.com/', type: 'news', category: 'both', region: 'Canada', country: 'CA', language: 'en', description: "Canada's largest daily newspaper", tier: 3, paywalled: true, hasRss: true },
  { name: 'National Post', url: 'https://nationalpost.com/', type: 'news', category: 'both', region: 'Canada', country: 'CA', language: 'en', description: "Canada's national conservative daily", tier: 3, hasRss: true },
  { name: 'CBC News', url: 'https://www.cbc.ca/news', type: 'news', category: 'both', region: 'Canada', country: 'CA', language: 'en', description: "Canada's public broadcaster", tier: 3, hasRss: true },
  { name: 'Montreal Gazette', url: 'https://montrealgazette.com/', type: 'news', category: 'both', region: 'Canada', country: 'CA', language: 'en', description: "Montreal's English-language daily", tier: 4, hasRss: true },
  { name: 'Vancouver Sun', url: 'https://vancouversun.com/', type: 'news', category: 'both', region: 'Canada', country: 'CA', language: 'en', description: "Vancouver's major daily newspaper", tier: 4, hasRss: true },
  { name: 'Ottawa Citizen', url: 'https://ottawacitizen.com/', type: 'news', category: 'both', region: 'Canada', country: 'CA', language: 'en', description: "Ottawa's major daily newspaper", tier: 4, hasRss: true },
  { name: 'Calgary Herald', url: 'https://calgaryherald.com/', type: 'news', category: 'both', region: 'Canada', country: 'CA', language: 'en', description: "Calgary's major daily newspaper", tier: 4, hasRss: true },
  { name: 'Edmonton Journal', url: 'https://edmontonjournal.com/', type: 'news', category: 'both', region: 'Canada', country: 'CA', language: 'en', description: "Edmonton's major daily newspaper", tier: 4, hasRss: true },
  { name: 'Winnipeg Free Press', url: 'https://www.winnipegfreepress.com/', type: 'news', category: 'both', region: 'Canada', country: 'CA', language: 'en', description: "Winnipeg's leading newspaper", tier: 4, paywalled: true, hasRss: true },
  { name: 'Le Devoir', url: 'https://www.ledevoir.com/', type: 'news', category: 'both', region: 'Canada', country: 'CA', language: 'fr', description: "Quebec's independent French-language daily", tier: 4, paywalled: true, hasRss: true },
  { name: 'La Presse', url: 'https://www.lapresse.ca/', type: 'news', category: 'both', region: 'Canada', country: 'CA', language: 'fr', description: "Quebec's largest French-language daily", tier: 4, hasRss: true },

  // ============================================================
  // NORTH AMERICA — Mexico
  // ============================================================
  { name: 'El Universal', url: 'https://www.eluniversal.com.mx/', type: 'news', category: 'both', region: 'Americas', country: 'MX', language: 'es', description: "Mexico's oldest national daily", tier: 3, hasRss: true },
  { name: 'Milenio', url: 'https://www.milenio.com/', type: 'news', category: 'both', region: 'Americas', country: 'MX', language: 'es', description: "Mexico's major national daily", tier: 4, hasRss: true },
  { name: 'Reforma', url: 'https://www.reforma.com/', type: 'news', category: 'both', region: 'Americas', country: 'MX', language: 'es', description: "Mexico's leading quality daily", tier: 3, paywalled: true, hasRss: true },
  { name: 'La Jornada', url: 'https://www.jornada.com.mx/', type: 'news', category: 'both', region: 'Americas', country: 'MX', language: 'es', description: "Mexico's left-leaning national daily", tier: 4, hasRss: true },
  { name: 'Excélsior', url: 'https://www.excelsior.com.mx/', type: 'news', category: 'both', region: 'Americas', country: 'MX', language: 'es', description: "Mexico's historic national daily", tier: 4, hasRss: true },
  { name: 'El Financiero', url: 'https://www.elfinanciero.com.mx/', type: 'news', category: 'both', region: 'Americas', country: 'MX', language: 'es', description: "Mexico's leading business daily", tier: 4, hasRss: true },
  { name: 'Animal Político', url: 'https://www.animalpolitico.com/', type: 'news', category: 'both', region: 'Americas', country: 'MX', language: 'es', description: "Mexico's digital investigative outlet", tier: 4, hasRss: true },
  { name: 'Aristegui Noticias', url: 'https://aristeguinoticias.com/', type: 'news', category: 'both', region: 'Americas', country: 'MX', language: 'es', description: "Mexico's independent news site", tier: 4, hasRss: true },

  // ============================================================
  // SOUTH AMERICA — Brazil
  // ============================================================
  { name: 'Folha de S.Paulo', url: 'https://www.folha.uol.com.br/', type: 'news', category: 'both', region: 'Americas', country: 'BR', language: 'pt', description: "Brazil's largest-circulation quality daily", tier: 3, paywalled: true, hasRss: true },
  { name: 'O Globo', url: 'https://oglobo.globo.com/', type: 'news', category: 'both', region: 'Americas', country: 'BR', language: 'pt', description: "Brazil's major national daily", tier: 3, paywalled: true, hasRss: true },
  { name: 'Estadão', url: 'https://www.estadao.com.br/', type: 'news', category: 'both', region: 'Americas', country: 'BR', language: 'pt', description: "Brazil's oldest São Paulo daily", tier: 3, paywalled: true, hasRss: true },
  { name: 'Valor Econômico', url: 'https://valor.globo.com/', type: 'news', category: 'both', region: 'Americas', country: 'BR', language: 'pt', description: "Brazil's leading business newspaper", tier: 4, paywalled: true, hasRss: true },
  { name: 'G1', url: 'https://g1.globo.com/', type: 'news', category: 'both', region: 'Americas', country: 'BR', language: 'pt', description: "Brazil's largest news portal", tier: 3, hasRss: true },
  { name: 'UOL Notícias', url: 'https://noticias.uol.com.br/', type: 'news', category: 'both', region: 'Americas', country: 'BR', language: 'pt', description: "Brazil's major news portal", tier: 4, hasRss: true },

  // ============================================================
  // SOUTH AMERICA — Argentina
  // ============================================================
  { name: 'Clarín', url: 'https://www.clarin.com/', type: 'news', category: 'both', region: 'Americas', country: 'AR', language: 'es', description: "Argentina's largest daily newspaper", tier: 3, hasRss: true },
  { name: 'La Nación', url: 'https://www.lanacion.com.ar/', type: 'news', category: 'both', region: 'Americas', country: 'AR', language: 'es', description: "Argentina's newspaper of record", tier: 3, hasRss: true },
  { name: 'Página/12', url: 'https://www.pagina12.com.ar/', type: 'news', category: 'both', region: 'Americas', country: 'AR', language: 'es', description: "Argentina's progressive daily", tier: 4, hasRss: true },
  { name: 'Ámbito Financiero', url: 'https://www.ambito.com/', type: 'news', category: 'both', region: 'Americas', country: 'AR', language: 'es', description: "Argentina's financial daily", tier: 4, hasRss: true },
  { name: 'Infobae', url: 'https://www.infobae.com/', type: 'news', category: 'both', region: 'Americas', country: 'AR', language: 'es', description: "Argentina's leading digital news outlet", tier: 3, hasRss: true },

  // ============================================================
  // SOUTH AMERICA — Chile
  // ============================================================
  { name: 'El Mercurio', url: 'https://www.elmercurio.com/', type: 'news', category: 'both', region: 'Americas', country: 'CL', language: 'es', description: "Chile's oldest and most influential daily", tier: 3, paywalled: true, hasRss: true },
  { name: 'La Tercera', url: 'https://www.latercera.com/', type: 'news', category: 'both', region: 'Americas', country: 'CL', language: 'es', description: "Chile's major national daily", tier: 4, hasRss: true },
  { name: 'BioBioChile', url: 'https://www.biobiochile.cl/', type: 'news', category: 'both', region: 'Americas', country: 'CL', language: 'es', description: "Chile's popular digital news outlet", tier: 4, hasRss: true },
  { name: 'Diario Financiero', url: 'https://www.df.cl/', type: 'news', category: 'both', region: 'Americas', country: 'CL', language: 'es', description: "Chile's leading business daily", tier: 4, paywalled: true, hasRss: true },

  // ============================================================
  // SOUTH AMERICA — Colombia
  // ============================================================
  { name: 'El Tiempo', url: 'https://www.eltiempo.com/', type: 'news', category: 'both', region: 'Americas', country: 'CO', language: 'es', description: "Colombia's largest national daily", tier: 3, hasRss: true },
  { name: 'El Espectador', url: 'https://www.elespectador.com/', type: 'news', category: 'both', region: 'Americas', country: 'CO', language: 'es', description: "Colombia's oldest national daily", tier: 4, hasRss: true },
  { name: 'Semana', url: 'https://www.semana.com/', type: 'news', category: 'both', region: 'Americas', country: 'CO', language: 'es', description: "Colombia's leading news magazine", tier: 4, hasRss: true },
  { name: 'Portafolio', url: 'https://www.portafolio.co/', type: 'news', category: 'both', region: 'Americas', country: 'CO', language: 'es', description: "Colombia's business newspaper", tier: 4, hasRss: true },

  // ============================================================
  // SOUTH AMERICA — Peru
  // ============================================================
  { name: 'El Comercio', url: 'https://elcomercio.pe/', type: 'news', category: 'both', region: 'Americas', country: 'PE', language: 'es', description: "Peru's oldest and most respected daily", tier: 4, hasRss: true },
  { name: 'La República', url: 'https://larepublica.pe/', type: 'news', category: 'both', region: 'Americas', country: 'PE', language: 'es', description: "Peru's major national daily", tier: 4, hasRss: true },
  { name: 'Perú21', url: 'https://peru21.pe/', type: 'news', category: 'both', region: 'Americas', country: 'PE', language: 'es', description: "Peru's popular daily newspaper", tier: 4, hasRss: true },
  { name: 'Gestión', url: 'https://gestion.pe/', type: 'news', category: 'both', region: 'Americas', country: 'PE', language: 'es', description: "Peru's leading business daily", tier: 4, hasRss: true },

  // ============================================================
  // SOUTH AMERICA — Venezuela
  // ============================================================
  { name: 'El Nacional', url: 'https://www.elnacional.com/', type: 'news', category: 'both', region: 'Americas', country: 'VE', language: 'es', description: "Venezuela's independent national daily", tier: 4, hasRss: true },
  { name: 'TalCual', url: 'https://talcualdigital.com/', type: 'news', category: 'both', region: 'Americas', country: 'VE', language: 'es', description: "Venezuela's independent digital outlet", tier: 5, hasRss: true },
  { name: 'Efecto Cocuyo', url: 'https://efectococuyo.com/', type: 'news', category: 'both', region: 'Americas', country: 'VE', language: 'es', description: "Venezuela's investigative digital outlet", tier: 5, hasRss: true },
  { name: 'Últimas Noticias', url: 'https://ultimasnoticias.com.ve/', type: 'news', category: 'both', region: 'Americas', country: 'VE', language: 'es', description: "Venezuela's largest-circulation daily", tier: 4, hasRss: true },

  // ============================================================
  // EUROPE — United Kingdom
  // ============================================================
  { name: 'BBC News', url: 'https://www.bbc.com/news', type: 'news', category: 'both', region: 'UK', country: 'GB', language: 'en', description: "UK's public service broadcaster", tier: 3, hasRss: true },
  { name: 'The Times', url: 'https://www.thetimes.com/', type: 'news', category: 'both', region: 'UK', country: 'GB', language: 'en', description: "UK's prestigious national daily", tier: 3, paywalled: true, hasRss: true },
  { name: 'The Daily Telegraph', url: 'https://www.telegraph.co.uk/', type: 'news', category: 'both', region: 'UK', country: 'GB', language: 'en', description: "UK's broadsheet conservative daily", tier: 3, paywalled: true, hasRss: true },
  { name: 'The Independent', url: 'https://www.independent.co.uk/', type: 'news', category: 'both', region: 'UK', country: 'GB', language: 'en', description: "UK's digital-only quality newspaper", tier: 4, hasRss: true },
  { name: 'The Economist', url: 'https://www.economist.com/', type: 'news', category: 'both', region: 'UK', country: 'GB', language: 'en', description: "UK's global affairs weekly", tier: 3, paywalled: true, hasRss: true },
  { name: 'Daily Mail', url: 'https://www.dailymail.co.uk/', type: 'news', category: 'both', region: 'UK', country: 'GB', language: 'en', description: "UK's highest-circulation tabloid", tier: 4, hasRss: true },
  { name: 'The Sun', url: 'https://www.thesun.co.uk/', type: 'news', category: 'both', region: 'UK', country: 'GB', language: 'en', description: "UK's popular tabloid daily", tier: 4, hasRss: true },
  { name: 'Mirror', url: 'https://www.mirror.co.uk/', type: 'news', category: 'both', region: 'UK', country: 'GB', language: 'en', description: "UK's left-leaning tabloid daily", tier: 4, hasRss: true },
  { name: 'Sky News', url: 'https://news.sky.com/', type: 'news', category: 'both', region: 'UK', country: 'GB', language: 'en', description: "UK's 24-hour news channel", tier: 3, hasRss: true },

  // ============================================================
  // EUROPE — Ireland
  // ============================================================
  { name: 'The Irish Times', url: 'https://www.irishtimes.com/', type: 'news', category: 'both', region: 'Europe', country: 'IE', language: 'en', description: "Ireland's newspaper of record", tier: 3, paywalled: true, hasRss: true },
  { name: 'Irish Independent', url: 'https://www.independent.ie/', type: 'news', category: 'both', region: 'Europe', country: 'IE', language: 'en', description: "Ireland's largest-circulation daily", tier: 4, hasRss: true },
  { name: 'The Journal', url: 'https://www.thejournal.ie/', type: 'news', category: 'both', region: 'Europe', country: 'IE', language: 'en', description: "Ireland's popular digital news outlet", tier: 4, hasRss: true },
  { name: 'RTÉ News', url: 'https://www.rte.ie/news/', type: 'news', category: 'both', region: 'Europe', country: 'IE', language: 'en', description: "Ireland's public broadcaster", tier: 3, hasRss: true },
  { name: 'Business Post', url: 'https://www.businesspost.ie/', type: 'news', category: 'both', region: 'Europe', country: 'IE', language: 'en', description: "Ireland's business weekly", tier: 4, paywalled: true, hasRss: true },

  // ============================================================
  // EUROPE — France
  // ============================================================
  { name: 'Le Monde', url: 'https://www.lemonde.fr/', type: 'news', category: 'both', region: 'Europe', country: 'FR', language: 'fr', description: "France's newspaper of record", tier: 3, paywalled: true, hasRss: true },
  { name: 'Le Figaro', url: 'https://www.lefigaro.fr/', type: 'news', category: 'both', region: 'Europe', country: 'FR', language: 'fr', description: "France's oldest national daily", tier: 3, paywalled: true, hasRss: true },
  { name: 'Libération', url: 'https://www.liberation.fr/', type: 'news', category: 'both', region: 'Europe', country: 'FR', language: 'fr', description: "France's left-leaning national daily", tier: 4, paywalled: true, hasRss: true },
  { name: 'Mediapart', url: 'https://www.mediapart.fr/', type: 'news', category: 'both', region: 'Europe', country: 'FR', language: 'fr', description: "France's investigative digital outlet", tier: 4, paywalled: true, hasRss: true },
  { name: 'France 24', url: 'https://www.france24.com/', type: 'news', category: 'both', region: 'Europe', country: 'FR', language: 'fr', description: "France's international news channel", tier: 3, hasRss: true },
  { name: 'AFP', url: 'https://www.afp.com/', type: 'news', category: 'both', region: 'Global', country: 'FR', language: 'fr', description: "France's global news wire service", tier: 3, hasRss: true },

  // ============================================================
  // EUROPE — Germany
  // ============================================================
  { name: 'Der Spiegel', url: 'https://www.spiegel.de/', type: 'news', category: 'both', region: 'Europe', country: 'DE', language: 'de', description: "Germany's leading news magazine", tier: 3, paywalled: true, hasRss: true },
  { name: 'Die Zeit', url: 'https://www.zeit.de/', type: 'news', category: 'both', region: 'Europe', country: 'DE', language: 'de', description: "Germany's respected weekly newspaper", tier: 3, paywalled: true, hasRss: true },
  { name: 'Frankfurter Allgemeine Zeitung', url: 'https://www.faz.net/', type: 'news', category: 'both', region: 'Europe', country: 'DE', language: 'de', description: "Germany's conservative quality daily", tier: 3, paywalled: true, hasRss: true },
  { name: 'Süddeutsche Zeitung', url: 'https://www.sueddeutsche.de/', type: 'news', category: 'both', region: 'Europe', country: 'DE', language: 'de', description: "Germany's largest-circulation quality daily", tier: 3, paywalled: true, hasRss: true },
  { name: 'Bild', url: 'https://www.bild.de/', type: 'news', category: 'both', region: 'Europe', country: 'DE', language: 'de', description: "Germany's largest tabloid daily", tier: 4, hasRss: true },
  { name: 'Tagesschau', url: 'https://www.tagesschau.de/', type: 'news', category: 'both', region: 'Europe', country: 'DE', language: 'de', description: "Germany's public broadcaster news", tier: 3, hasRss: true },

  // ============================================================
  // EUROPE — Spain
  // ============================================================
  { name: 'El País', url: 'https://elpais.com/', type: 'news', category: 'both', region: 'Europe', country: 'ES', language: 'es', description: "Spain's largest-circulation quality daily", tier: 3, paywalled: true, hasRss: true },
  { name: 'El Mundo', url: 'https://www.elmundo.es/', type: 'news', category: 'both', region: 'Europe', country: 'ES', language: 'es', description: "Spain's second-largest national daily", tier: 3, hasRss: true },
  { name: 'ABC', url: 'https://www.abc.es/', type: 'news', category: 'both', region: 'Europe', country: 'ES', language: 'es', description: "Spain's conservative national daily", tier: 4, hasRss: true },
  { name: 'La Vanguardia', url: 'https://www.lavanguardia.com/', type: 'news', category: 'both', region: 'Europe', country: 'ES', language: 'es', description: "Spain's Barcelona-based quality daily", tier: 4, hasRss: true },
  { name: 'El Confidencial', url: 'https://www.elconfidencial.com/', type: 'news', category: 'both', region: 'Europe', country: 'ES', language: 'es', description: "Spain's leading digital newspaper", tier: 4, hasRss: true },
  { name: 'Expansión', url: 'https://www.expansion.com/', type: 'news', category: 'both', region: 'Europe', country: 'ES', language: 'es', description: "Spain's leading business daily", tier: 4, hasRss: true },

  // ============================================================
  // EUROPE — Italy
  // ============================================================
  { name: 'Corriere della Sera', url: 'https://www.corriere.it/', type: 'news', category: 'both', region: 'Europe', country: 'IT', language: 'it', description: "Italy's leading national daily", tier: 3, paywalled: true, hasRss: true },
  { name: 'la Repubblica', url: 'https://www.repubblica.it/', type: 'news', category: 'both', region: 'Europe', country: 'IT', language: 'it', description: "Italy's major national daily", tier: 3, hasRss: true },
  { name: 'Il Sole 24 Ore', url: 'https://www.ilsole24ore.com/', type: 'news', category: 'both', region: 'Europe', country: 'IT', language: 'it', description: "Italy's leading business daily", tier: 3, paywalled: true, hasRss: true },
  { name: 'La Stampa', url: 'https://www.lastampa.it/', type: 'news', category: 'both', region: 'Europe', country: 'IT', language: 'it', description: "Italy's Turin-based national daily", tier: 4, paywalled: true, hasRss: true },
  { name: 'ANSA', url: 'https://www.ansa.it/', type: 'news', category: 'both', region: 'Europe', country: 'IT', language: 'it', description: "Italy's national news agency", tier: 3, hasRss: true },

  // ============================================================
  // EUROPE — Netherlands
  // ============================================================
  { name: 'NRC', url: 'https://www.nrc.nl/', type: 'news', category: 'both', region: 'Europe', country: 'NL', language: 'nl', description: "Netherlands' quality evening newspaper", tier: 3, paywalled: true, hasRss: true },
  { name: 'de Volkskrant', url: 'https://www.volkskrant.nl/', type: 'news', category: 'both', region: 'Europe', country: 'NL', language: 'nl', description: "Netherlands' progressive quality daily", tier: 3, paywalled: true, hasRss: true },
  { name: 'Algemeen Dagblad', url: 'https://www.ad.nl/', type: 'news', category: 'both', region: 'Europe', country: 'NL', language: 'nl', description: "Netherlands' popular national daily", tier: 4, hasRss: true },
  { name: 'De Telegraaf', url: 'https://www.telegraaf.nl/', type: 'news', category: 'both', region: 'Europe', country: 'NL', language: 'nl', description: "Netherlands' largest-circulation daily", tier: 4, hasRss: true },
  { name: 'Trouw', url: 'https://www.trouw.nl/', type: 'news', category: 'both', region: 'Europe', country: 'NL', language: 'nl', description: "Netherlands' quality broadsheet", tier: 4, paywalled: true, hasRss: true },

  // ============================================================
  // EUROPE — Belgium
  // ============================================================
  { name: 'De Standaard', url: 'https://www.standaard.be/', type: 'news', category: 'both', region: 'Europe', country: 'BE', language: 'nl', description: "Belgium's Flemish quality daily", tier: 4, paywalled: true, hasRss: true },
  { name: 'Het Laatste Nieuws', url: 'https://www.hln.be/', type: 'news', category: 'both', region: 'Europe', country: 'BE', language: 'nl', description: "Belgium's largest Flemish daily", tier: 4, hasRss: true },
  { name: 'Le Soir', url: 'https://www.lesoir.be/', type: 'news', category: 'both', region: 'Europe', country: 'BE', language: 'fr', description: "Belgium's leading French-language daily", tier: 4, paywalled: true, hasRss: true },
  { name: 'La Libre', url: 'https://www.lalibre.be/', type: 'news', category: 'both', region: 'Europe', country: 'BE', language: 'fr', description: "Belgium's French-language quality daily", tier: 4, hasRss: true },

  // ============================================================
  // EUROPE — Switzerland
  // ============================================================
  { name: 'Neue Zürcher Zeitung', url: 'https://www.nzz.ch/', type: 'news', category: 'both', region: 'Europe', country: 'CH', language: 'de', description: "Switzerland's prestigious German-language daily", tier: 3, paywalled: true, hasRss: true },
  { name: 'Tages-Anzeiger', url: 'https://www.tagesanzeiger.ch/', type: 'news', category: 'both', region: 'Europe', country: 'CH', language: 'de', description: "Switzerland's largest German-language daily", tier: 4, paywalled: true, hasRss: true },
  { name: 'Blick', url: 'https://www.blick.ch/', type: 'news', category: 'both', region: 'Europe', country: 'CH', language: 'de', description: "Switzerland's popular tabloid daily", tier: 4, hasRss: true },
  { name: 'Le Temps', url: 'https://www.letemps.ch/', type: 'news', category: 'both', region: 'Europe', country: 'CH', language: 'fr', description: "Switzerland's French-language quality daily", tier: 4, paywalled: true, hasRss: true },

  // ============================================================
  // EUROPE — Austria
  // ============================================================
  { name: 'Der Standard', url: 'https://www.derstandard.at/', type: 'news', category: 'both', region: 'Europe', country: 'AT', language: 'de', description: "Austria's liberal quality daily", tier: 4, hasRss: true },
  { name: 'Die Presse', url: 'https://www.diepresse.com/', type: 'news', category: 'both', region: 'Europe', country: 'AT', language: 'de', description: "Austria's conservative quality daily", tier: 4, paywalled: true, hasRss: true },
  { name: 'Kronen Zeitung', url: 'https://www.krone.at/', type: 'news', category: 'both', region: 'Europe', country: 'AT', language: 'de', description: "Austria's largest-circulation tabloid", tier: 4, hasRss: true },
  { name: 'ORF News', url: 'https://orf.at/', type: 'news', category: 'both', region: 'Europe', country: 'AT', language: 'de', description: "Austria's public broadcaster", tier: 3, hasRss: true },

  // ============================================================
  // EUROPE — Portugal
  // ============================================================
  { name: 'Público', url: 'https://www.publico.pt/', type: 'news', category: 'both', region: 'Europe', country: 'PT', language: 'pt', description: "Portugal's quality reference daily", tier: 4, paywalled: true, hasRss: true },
  { name: 'Diário de Notícias', url: 'https://www.dn.pt/', type: 'news', category: 'both', region: 'Europe', country: 'PT', language: 'pt', description: "Portugal's historic national daily", tier: 4, hasRss: true },
  { name: 'Expresso', url: 'https://expresso.pt/', type: 'news', category: 'both', region: 'Europe', country: 'PT', language: 'pt', description: "Portugal's leading weekly newspaper", tier: 4, paywalled: true, hasRss: true },
  { name: 'Observador', url: 'https://observador.pt/', type: 'news', category: 'both', region: 'Europe', country: 'PT', language: 'pt', description: "Portugal's digital-native news outlet", tier: 4, hasRss: true },

  // ============================================================
  // EUROPE — Sweden
  // ============================================================
  { name: 'Dagens Nyheter', url: 'https://www.dn.se/', type: 'news', category: 'both', region: 'Europe', country: 'SE', language: 'sv', description: "Sweden's largest morning newspaper", tier: 3, paywalled: true, hasRss: true },
  { name: 'Svenska Dagbladet', url: 'https://www.svd.se/', type: 'news', category: 'both', region: 'Europe', country: 'SE', language: 'sv', description: "Sweden's conservative quality daily", tier: 4, paywalled: true, hasRss: true },
  { name: 'Aftonbladet', url: 'https://www.aftonbladet.se/', type: 'news', category: 'both', region: 'Europe', country: 'SE', language: 'sv', description: "Sweden's largest evening tabloid", tier: 4, hasRss: true },
  { name: 'Dagens Industri', url: 'https://www.di.se/', type: 'news', category: 'both', region: 'Europe', country: 'SE', language: 'sv', description: "Sweden's leading business daily", tier: 4, paywalled: true, hasRss: true },

  // ============================================================
  // EUROPE — Norway
  // ============================================================
  { name: 'Aftenposten', url: 'https://www.aftenposten.no/', type: 'news', category: 'both', region: 'Europe', country: 'NO', language: 'no', description: "Norway's largest subscription newspaper", tier: 3, paywalled: true, hasRss: true },
  { name: 'VG', url: 'https://www.vg.no/', type: 'news', category: 'both', region: 'Europe', country: 'NO', language: 'no', description: "Norway's largest tabloid newspaper", tier: 4, hasRss: true },
  { name: 'Dagbladet', url: 'https://www.dagbladet.no/', type: 'news', category: 'both', region: 'Europe', country: 'NO', language: 'no', description: "Norway's popular tabloid daily", tier: 4, hasRss: true },
  { name: 'NRK', url: 'https://www.nrk.no/', type: 'news', category: 'both', region: 'Europe', country: 'NO', language: 'no', description: "Norway's public broadcaster", tier: 3, hasRss: true },

  // ============================================================
  // EUROPE — Denmark
  // ============================================================
  { name: 'Politiken', url: 'https://politiken.dk/', type: 'news', category: 'both', region: 'Europe', country: 'DK', language: 'da', description: "Denmark's leading quality daily", tier: 3, paywalled: true, hasRss: true },
  { name: 'Berlingske', url: 'https://www.berlingske.dk/', type: 'news', category: 'both', region: 'Europe', country: 'DK', language: 'da', description: "Denmark's oldest newspaper", tier: 4, paywalled: true, hasRss: true },
  { name: 'Jyllands-Posten', url: 'https://jyllands-posten.dk/', type: 'news', category: 'both', region: 'Europe', country: 'DK', language: 'da', description: "Denmark's major Jutland-based daily", tier: 4, paywalled: true, hasRss: true },
  { name: 'Ekstra Bladet', url: 'https://ekstrabladet.dk/', type: 'news', category: 'both', region: 'Europe', country: 'DK', language: 'da', description: "Denmark's popular tabloid daily", tier: 4, hasRss: true },

  // ============================================================
  // EUROPE — Finland
  // ============================================================
  { name: 'Helsingin Sanomat', url: 'https://www.hs.fi/', type: 'news', category: 'both', region: 'Europe', country: 'FI', language: 'fi', description: "Finland's largest subscription daily", tier: 3, paywalled: true, hasRss: true },
  { name: 'Ilta-Sanomat', url: 'https://www.is.fi/', type: 'news', category: 'both', region: 'Europe', country: 'FI', language: 'fi', description: "Finland's largest tabloid daily", tier: 4, hasRss: true },
  { name: 'Kauppalehti', url: 'https://www.kauppalehti.fi/', type: 'news', category: 'both', region: 'Europe', country: 'FI', language: 'fi', description: "Finland's leading business daily", tier: 4, paywalled: true, hasRss: true },
  { name: 'Yle News', url: 'https://yle.fi/news', type: 'news', category: 'both', region: 'Europe', country: 'FI', language: 'fi', description: "Finland's public broadcaster", tier: 3, hasRss: true },

  // ============================================================
  // EUROPE — Poland
  // ============================================================
  { name: 'Gazeta Wyborcza', url: 'https://wyborcza.pl/', type: 'news', category: 'both', region: 'Europe', country: 'PL', language: 'pl', description: "Poland's largest quality daily", tier: 3, paywalled: true, hasRss: true },
  { name: 'Rzeczpospolita', url: 'https://www.rp.pl/', type: 'news', category: 'both', region: 'Europe', country: 'PL', language: 'pl', description: "Poland's conservative quality daily", tier: 4, paywalled: true, hasRss: true },
  { name: 'Onet', url: 'https://www.onet.pl/', type: 'news', category: 'both', region: 'Europe', country: 'PL', language: 'pl', description: "Poland's largest news portal", tier: 4, hasRss: true },
  { name: 'Dziennik Gazeta Prawna', url: 'https://www.gazetaprawna.pl/', type: 'news', category: 'both', region: 'Europe', country: 'PL', language: 'pl', description: "Poland's legal and business daily", tier: 4, hasRss: true },

  // ============================================================
  // EUROPE — Ukraine
  // ============================================================
  { name: 'Ukrainska Pravda', url: 'https://www.pravda.com.ua/', type: 'news', category: 'both', region: 'Europe', country: 'UA', language: 'uk', description: "Ukraine's most-read news site", tier: 3, hasRss: true },
  { name: 'Kyiv Independent', url: 'https://kyivindependent.com/', type: 'news', category: 'both', region: 'Europe', country: 'UA', language: 'en', description: "Ukraine's English-language independent outlet", tier: 4, hasRss: true },
  { name: 'Interfax-Ukraine', url: 'https://en.interfax.com.ua/', type: 'news', category: 'both', region: 'Europe', country: 'UA', language: 'en', description: "Ukraine's wire news service", tier: 4, hasRss: true },
  { name: 'NV', url: 'https://nv.ua/', type: 'news', category: 'both', region: 'Europe', country: 'UA', language: 'uk', description: "Ukraine's popular news magazine", tier: 4, hasRss: true },

  // ============================================================
  // EUROPE — Turkey
  // ============================================================
  { name: 'Hürriyet', url: 'https://www.hurriyet.com.tr/', type: 'news', category: 'both', region: 'Europe', country: 'TR', language: 'tr', description: "Turkey's largest-circulation daily", tier: 3, hasRss: true },
  { name: 'Sabah', url: 'https://www.sabah.com.tr/', type: 'news', category: 'both', region: 'Europe', country: 'TR', language: 'tr', description: "Turkey's major pro-government daily", tier: 4, hasRss: true },
  { name: 'Cumhuriyet', url: 'https://www.cumhuriyet.com.tr/', type: 'news', category: 'both', region: 'Europe', country: 'TR', language: 'tr', description: "Turkey's oldest secular daily", tier: 4, hasRss: true },
  { name: 'Anadolu Agency', url: 'https://www.aa.com.tr/', type: 'news', category: 'both', region: 'Europe', country: 'TR', language: 'tr', description: "Turkey's state news agency", tier: 3, hasRss: true },

  // ============================================================
  // EUROPE — Russia
  // ============================================================
  { name: 'Kommersant', url: 'https://www.kommersant.ru/', type: 'news', category: 'both', region: 'Europe', country: 'RU', language: 'ru', description: "Russia's leading business daily", tier: 3, hasRss: true },
  { name: 'Vedomosti', url: 'https://www.vedomosti.ru/', type: 'news', category: 'both', region: 'Europe', country: 'RU', language: 'ru', description: "Russia's quality business newspaper", tier: 4, paywalled: true, hasRss: true },
  { name: 'Meduza', url: 'https://meduza.io/', type: 'news', category: 'both', region: 'Europe', country: 'RU', language: 'ru', description: "Russia's independent exile news outlet", tier: 4, hasRss: true },
  { name: 'The Moscow Times', url: 'https://www.themoscowtimes.com/', type: 'news', category: 'both', region: 'Europe', country: 'RU', language: 'en', description: "Russia's English-language independent newspaper", tier: 4, hasRss: true },

  // ============================================================
  // AFRICA — South Africa
  // ============================================================
  { name: 'News24', url: 'https://www.news24.com/', type: 'news', category: 'both', region: 'Africa', country: 'ZA', language: 'en', description: "South Africa's largest news website", tier: 3, hasRss: true },
  { name: 'Daily Maverick', url: 'https://www.dailymaverick.co.za/', type: 'news', category: 'both', region: 'Africa', country: 'ZA', language: 'en', description: "South Africa's investigative news outlet", tier: 3, hasRss: true },
  { name: 'Mail & Guardian', url: 'https://mg.co.za/', type: 'news', category: 'both', region: 'Africa', country: 'ZA', language: 'en', description: "South Africa's independent weekly", tier: 4, paywalled: true, hasRss: true },
  { name: 'Business Day', url: 'https://www.businesslive.co.za/bd/', type: 'news', category: 'both', region: 'Africa', country: 'ZA', language: 'en', description: "South Africa's leading business daily", tier: 4, paywalled: true, hasRss: true },
  { name: 'TimesLIVE', url: 'https://www.timeslive.co.za/', type: 'news', category: 'both', region: 'Africa', country: 'ZA', language: 'en', description: "South Africa's major news portal", tier: 4, hasRss: true },
  { name: 'IOL', url: 'https://www.iol.co.za/', type: 'news', category: 'both', region: 'Africa', country: 'ZA', language: 'en', description: "South Africa's popular news website", tier: 4, hasRss: true },

  // ============================================================
  // AFRICA — Nigeria
  // ============================================================
  { name: 'Punch', url: 'https://punchng.com/', type: 'news', category: 'both', region: 'Africa', country: 'NG', language: 'en', description: "Nigeria's most widely read newspaper", tier: 3, hasRss: true },
  { name: 'The Guardian Nigeria', url: 'https://guardian.ng/', type: 'news', category: 'both', region: 'Africa', country: 'NG', language: 'en', description: "Nigeria's quality broadsheet daily", tier: 4, hasRss: true },
  { name: 'Vanguard', url: 'https://www.vanguardngr.com/', type: 'news', category: 'both', region: 'Africa', country: 'NG', language: 'en', description: "Nigeria's major national daily", tier: 4, hasRss: true },
  { name: 'Premium Times', url: 'https://www.premiumtimesng.com/', type: 'news', category: 'both', region: 'Africa', country: 'NG', language: 'en', description: "Nigeria's investigative news outlet", tier: 4, hasRss: true },
  { name: 'Daily Trust', url: 'https://dailytrust.com/', type: 'news', category: 'both', region: 'Africa', country: 'NG', language: 'en', description: "Nigeria's northern-focused national daily", tier: 4, hasRss: true },
  { name: 'BusinessDay NG', url: 'https://businessday.ng/', type: 'news', category: 'both', region: 'Africa', country: 'NG', language: 'en', description: "Nigeria's leading business newspaper", tier: 4, hasRss: true },

  // ============================================================
  // AFRICA — Kenya
  // ============================================================
  { name: 'Daily Nation', url: 'https://nation.africa/', type: 'news', category: 'both', region: 'Africa', country: 'KE', language: 'en', description: "Kenya's largest-circulation daily", tier: 3, hasRss: true },
  { name: 'The Standard', url: 'https://www.standardmedia.co.ke/', type: 'news', category: 'both', region: 'Africa', country: 'KE', language: 'en', description: "Kenya's oldest newspaper", tier: 4, hasRss: true },
  { name: 'The Star Kenya', url: 'https://www.the-star.co.ke/', type: 'news', category: 'both', region: 'Africa', country: 'KE', language: 'en', description: "Kenya's independent national daily", tier: 4, hasRss: true },
  { name: 'Business Daily Africa', url: 'https://www.businessdailyafrica.com/', type: 'news', category: 'both', region: 'Africa', country: 'KE', language: 'en', description: "Kenya's leading business newspaper", tier: 4, hasRss: true },

  // ============================================================
  // AFRICA — Ghana
  // ============================================================
  { name: 'Daily Graphic', url: 'https://www.graphic.com.gh/', type: 'news', category: 'both', region: 'Africa', country: 'GH', language: 'en', description: "Ghana's largest-circulation daily", tier: 4, hasRss: true },
  { name: 'GhanaWeb', url: 'https://www.ghanaweb.com/', type: 'news', category: 'both', region: 'Africa', country: 'GH', language: 'en', description: "Ghana's leading news portal", tier: 4, hasRss: true },
  { name: 'Joy Online', url: 'https://www.myjoyonline.com/', type: 'news', category: 'both', region: 'Africa', country: 'GH', language: 'en', description: "Ghana's popular news website", tier: 4, hasRss: true },
  { name: 'Citi Newsroom', url: 'https://citinewsroom.com/', type: 'news', category: 'both', region: 'Africa', country: 'GH', language: 'en', description: "Ghana's independent news outlet", tier: 5, hasRss: true },

  // ============================================================
  // AFRICA — Egypt
  // ============================================================
  { name: 'Ahram Online', url: 'https://english.ahram.org.eg/', type: 'news', category: 'both', region: 'Africa', country: 'EG', language: 'en', description: "Egypt's state-owned flagship newspaper", tier: 3, hasRss: true },
  { name: 'Al-Masry Al-Youm', url: 'https://www.almasryalyoum.com/', type: 'news', category: 'both', region: 'Africa', country: 'EG', language: 'ar', description: "Egypt's leading independent daily", tier: 4, hasRss: true },
  { name: 'Youm7', url: 'https://www.youm7.com/', type: 'news', category: 'both', region: 'Africa', country: 'EG', language: 'ar', description: "Egypt's most-read digital newspaper", tier: 4, hasRss: true },
  { name: 'Daily News Egypt', url: 'https://www.dailynewsegypt.com/', type: 'news', category: 'both', region: 'Africa', country: 'EG', language: 'en', description: "Egypt's English-language daily", tier: 5, hasRss: true },
  { name: 'Mada Masr', url: 'https://www.madamasr.com/', type: 'news', category: 'both', region: 'Africa', country: 'EG', language: 'en', description: "Egypt's independent investigative outlet", tier: 4, hasRss: true },

  // ============================================================
  // AFRICA — Morocco
  // ============================================================
  { name: 'Hespress', url: 'https://www.hespress.com/', type: 'news', category: 'both', region: 'Africa', country: 'MA', language: 'ar', description: "Morocco's most-visited news site", tier: 4, hasRss: true },
  { name: 'Le Matin', url: 'https://lematin.ma/', type: 'news', category: 'both', region: 'Africa', country: 'MA', language: 'fr', description: "Morocco's French-language daily", tier: 4, hasRss: true },
  { name: 'TelQuel', url: 'https://telquel.ma/', type: 'news', category: 'both', region: 'Africa', country: 'MA', language: 'fr', description: "Morocco's independent newsmagazine", tier: 4, hasRss: true },
  { name: 'Medias24', url: 'https://medias24.com/', type: 'news', category: 'both', region: 'Africa', country: 'MA', language: 'fr', description: "Morocco's economic news site", tier: 5, hasRss: true },

  // ============================================================
  // AFRICA — Ethiopia
  // ============================================================
  { name: 'Addis Standard', url: 'https://addisstandard.com/', type: 'news', category: 'both', region: 'Africa', country: 'ET', language: 'en', description: "Ethiopia's independent news magazine", tier: 5, hasRss: true },
  { name: 'The Reporter Ethiopia', url: 'https://www.thereporterethiopia.com/', type: 'news', category: 'both', region: 'Africa', country: 'ET', language: 'en', description: "Ethiopia's leading English-language weekly", tier: 5, hasRss: true },
  { name: 'Capital Ethiopia', url: 'https://capitalethiopia.com/', type: 'news', category: 'both', region: 'Africa', country: 'ET', language: 'en', description: "Ethiopia's business newspaper", tier: 5, hasRss: true },

  // ============================================================
  // AFRICA — Zimbabwe
  // ============================================================
  { name: 'The Herald', url: 'https://www.herald.co.zw/', type: 'news', category: 'both', region: 'Africa', country: 'ZW', language: 'en', description: "Zimbabwe's largest daily newspaper", tier: 5, hasRss: true },
  { name: 'NewsDay Zimbabwe', url: 'https://www.newsday.co.zw/', type: 'news', category: 'both', region: 'Africa', country: 'ZW', language: 'en', description: "Zimbabwe's independent daily", tier: 5, hasRss: true },
  { name: 'Zimbabwe Independent', url: 'https://www.theindependent.co.zw/', type: 'news', category: 'both', region: 'Africa', country: 'ZW', language: 'en', description: "Zimbabwe's business weekly", tier: 5, hasRss: true },

  // ============================================================
  // MIDDLE EAST — Israel
  // ============================================================
  { name: 'The Times of Israel', url: 'https://www.timesofisrael.com/', type: 'news', category: 'both', region: 'Middle East', country: 'IL', language: 'en', description: "Israel's English-language news site", tier: 4, hasRss: true },
  { name: 'Haaretz', url: 'https://www.haaretz.com/', type: 'news', category: 'both', region: 'Middle East', country: 'IL', language: 'he', description: "Israel's oldest quality daily", tier: 3, paywalled: true, hasRss: true },
  { name: 'The Jerusalem Post', url: 'https://www.jpost.com/', type: 'news', category: 'both', region: 'Middle East', country: 'IL', language: 'en', description: "Israel's leading English-language daily", tier: 3, hasRss: true },
  { name: 'Ynet', url: 'https://www.ynetnews.com/', type: 'news', category: 'both', region: 'Middle East', country: 'IL', language: 'en', description: "Israel's most-read news website", tier: 4, hasRss: true },
  { name: 'Globes', url: 'https://en.globes.co.il/', type: 'news', category: 'both', region: 'Middle East', country: 'IL', language: 'en', description: "Israel's leading business daily", tier: 4, hasRss: true },

  // ============================================================
  // MIDDLE EAST — Saudi Arabia
  // ============================================================
  { name: 'Arab News', url: 'https://www.arabnews.com/', type: 'news', category: 'both', region: 'Middle East', country: 'SA', language: 'en', description: "Saudi Arabia's leading English-language daily", tier: 3, hasRss: true },
  { name: 'Saudi Gazette', url: 'https://saudigazette.com.sa/', type: 'news', category: 'both', region: 'Middle East', country: 'SA', language: 'en', description: "Saudi Arabia's English-language newspaper", tier: 4, hasRss: true },
  { name: 'Okaz', url: 'https://www.okaz.com.sa/', type: 'news', category: 'both', region: 'Middle East', country: 'SA', language: 'ar', description: "Saudi Arabia's major Arabic daily", tier: 4, hasRss: true },
  { name: 'Asharq Al-Awsat', url: 'https://english.aawsat.com/', type: 'news', category: 'both', region: 'Middle East', country: 'SA', language: 'ar', description: "Saudi Arabia's pan-Arab international daily", tier: 3, hasRss: true },

  // ============================================================
  // MIDDLE EAST — United Arab Emirates
  // ============================================================
  { name: 'The National', url: 'https://www.thenationalnews.com/', type: 'news', category: 'both', region: 'Middle East', country: 'AE', language: 'en', description: "UAE's leading English-language newspaper", tier: 3, hasRss: true },
  { name: 'Gulf News', url: 'https://gulfnews.com/', type: 'news', category: 'both', region: 'Middle East', country: 'AE', language: 'en', description: "UAE's largest-circulation English daily", tier: 3, hasRss: true },
  { name: 'Khaleej Times', url: 'https://www.khaleejtimes.com/', type: 'news', category: 'both', region: 'Middle East', country: 'AE', language: 'en', description: "UAE's oldest English-language daily", tier: 4, hasRss: true },
  { name: 'WAM', url: 'https://www.wam.ae/', type: 'news', category: 'both', region: 'Middle East', country: 'AE', language: 'en', description: "UAE's official news agency", tier: 4, hasRss: true },
  { name: 'Arabian Business', url: 'https://www.arabianbusiness.com/', type: 'news', category: 'both', region: 'Middle East', country: 'AE', language: 'en', description: "UAE's business news outlet", tier: 4, hasRss: true },

  // ============================================================
  // MIDDLE EAST — Qatar
  // ============================================================
  { name: 'Al Jazeera', url: 'https://www.aljazeera.com/', type: 'news', category: 'both', region: 'Middle East', country: 'QA', language: 'en', description: "Qatar's global news network", tier: 3, hasRss: true },
  { name: 'Gulf Times', url: 'https://www.gulf-times.com/', type: 'news', category: 'both', region: 'Middle East', country: 'QA', language: 'en', description: "Qatar's English-language daily", tier: 4, hasRss: true },
  { name: 'The Peninsula Qatar', url: 'https://thepeninsulaqatar.com/', type: 'news', category: 'both', region: 'Middle East', country: 'QA', language: 'en', description: "Qatar's independent English daily", tier: 5, hasRss: true },
  { name: 'Qatar Tribune', url: 'https://www.qatar-tribune.com/', type: 'news', category: 'both', region: 'Middle East', country: 'QA', language: 'en', description: "Qatar's English-language newspaper", tier: 5, hasRss: true },

  // ============================================================
  // MIDDLE EAST — Iran
  // ============================================================
  { name: 'Tehran Times', url: 'https://www.tehrantimes.com/', type: 'news', category: 'both', region: 'Middle East', country: 'IR', language: 'en', description: "Iran's English-language daily", tier: 4, hasRss: true },
  { name: 'Financial Tribune', url: 'https://financialtribune.com/', type: 'news', category: 'both', region: 'Middle East', country: 'IR', language: 'en', description: "Iran's English-language business daily", tier: 5, hasRss: true },
  { name: 'IRNA', url: 'https://en.irna.ir/', type: 'news', category: 'both', region: 'Middle East', country: 'IR', language: 'en', description: "Iran's official news agency", tier: 4, hasRss: true },
  { name: 'Mehr News', url: 'https://en.mehrnews.com/', type: 'news', category: 'both', region: 'Middle East', country: 'IR', language: 'en', description: "Iran's semi-official news agency", tier: 4, hasRss: true },

  // ============================================================
  // ASIA — India
  // ============================================================
  { name: 'The Times of India', url: 'https://timesofindia.indiatimes.com/', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'IN', language: 'en', description: "India's largest English-language daily", tier: 3, hasRss: true },
  { name: 'The Hindu', url: 'https://www.thehindu.com/', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'IN', language: 'en', description: "India's respected national daily", tier: 3, hasRss: true },
  { name: 'Hindustan Times', url: 'https://www.hindustantimes.com/', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'IN', language: 'en', description: "India's major national daily", tier: 3, hasRss: true },
  { name: 'Indian Express', url: 'https://indianexpress.com/', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'IN', language: 'en', description: "India's quality national daily", tier: 3, hasRss: true },
  { name: 'Business Standard', url: 'https://www.business-standard.com/', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'IN', language: 'en', description: "India's leading business daily", tier: 4, hasRss: true },
  { name: 'Mint', url: 'https://www.livemint.com/', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'IN', language: 'en', description: "India's business and financial daily", tier: 4, paywalled: true, hasRss: true },
  { name: 'NDTV', url: 'https://www.ndtv.com/', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'IN', language: 'en', description: "India's major news broadcaster", tier: 3, hasRss: true },
  { name: 'Scroll.in', url: 'https://scroll.in/', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'IN', language: 'en', description: "India's independent digital news outlet", tier: 4, hasRss: true },

  // ============================================================
  // ASIA — China (skip Caixin Global, SCMP)
  // ============================================================
  { name: "People's Daily", url: 'http://en.people.cn/', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'CN', language: 'zh', description: "China's official state newspaper", tier: 3, hasRss: true },
  { name: 'Xinhua', url: 'https://english.news.cn/', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'CN', language: 'zh', description: "China's official state news agency", tier: 3, hasRss: true },
  { name: 'China Daily', url: 'https://www.chinadaily.com.cn/', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'CN', language: 'en', description: "China's English-language state newspaper", tier: 4, hasRss: true },
  { name: 'Global Times', url: 'https://www.globaltimes.cn/', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'CN', language: 'en', description: "China's nationalist English-language tabloid", tier: 4, hasRss: true },

  // ============================================================
  // ASIA — Japan (skip Nikkei Asia)
  // ============================================================
  { name: 'Yomiuri Shimbun', url: 'https://www.yomiuri.co.jp/', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'JP', language: 'ja', description: "Japan's largest-circulation newspaper", tier: 3, hasRss: true },
  { name: 'Asahi Shimbun', url: 'https://www.asahi.com/', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'JP', language: 'ja', description: "Japan's second-largest national daily", tier: 3, hasRss: true },
  { name: 'Mainichi', url: 'https://mainichi.jp/', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'JP', language: 'ja', description: "Japan's major national daily", tier: 3, hasRss: true },
  { name: 'Nikkei', url: 'https://www.nikkei.com/', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'JP', language: 'ja', description: "Japan's leading business daily", tier: 3, paywalled: true, hasRss: true },
  { name: 'The Japan Times', url: 'https://www.japantimes.co.jp/', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'JP', language: 'en', description: "Japan's oldest English-language newspaper", tier: 4, paywalled: true, hasRss: true },
  { name: 'Kyodo News', url: 'https://english.kyodonews.net/', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'JP', language: 'en', description: "Japan's major wire service", tier: 3, hasRss: true },

  // ============================================================
  // ASIA — South Korea
  // ============================================================
  { name: 'Chosun Ilbo', url: 'https://www.chosun.com/', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'KR', language: 'ko', description: "South Korea's largest daily newspaper", tier: 3, hasRss: true },
  { name: 'JoongAng Ilbo', url: 'https://koreajoongangdaily.joins.com/', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'KR', language: 'en', description: "South Korea's major quality daily", tier: 3, hasRss: true },
  { name: 'Dong-A Ilbo', url: 'https://www.donga.com/', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'KR', language: 'ko', description: "South Korea's conservative national daily", tier: 4, hasRss: true },
  { name: 'The Korea Herald', url: 'https://www.koreaherald.com/', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'KR', language: 'en', description: "South Korea's leading English-language daily", tier: 4, hasRss: true },
  { name: 'The Korea Times', url: 'https://www.koreatimes.co.kr/', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'KR', language: 'en', description: "South Korea's oldest English-language newspaper", tier: 4, hasRss: true },
  { name: 'Yonhap', url: 'https://en.yna.co.kr/', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'KR', language: 'en', description: "South Korea's national news agency", tier: 3, hasRss: true },

  // ============================================================
  // ASIA — Taiwan
  // ============================================================
  { name: 'Taipei Times', url: 'https://www.taipeitimes.com/', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'TW', language: 'en', description: "Taiwan's English-language daily", tier: 4, hasRss: true },
  { name: 'United Daily News', url: 'https://udn.com/', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'TW', language: 'zh', description: "Taiwan's major Chinese-language daily", tier: 4, hasRss: true },
  { name: 'Liberty Times', url: 'https://news.ltn.com.tw/', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'TW', language: 'zh', description: "Taiwan's largest-circulation daily", tier: 3, hasRss: true },
  { name: 'China Times', url: 'https://www.chinatimes.com/', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'TW', language: 'zh', description: "Taiwan's established Chinese-language daily", tier: 4, hasRss: true },
  { name: 'Taiwan News', url: 'https://www.taiwannews.com.tw/', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'TW', language: 'en', description: "Taiwan's bilingual news outlet", tier: 4, hasRss: true },

  // ============================================================
  // ASIA — Hong Kong (skip SCMP, already in existing seed)
  // ============================================================
  { name: 'Hong Kong Free Press', url: 'https://hongkongfp.com/', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'HK', language: 'en', description: "Hong Kong's independent English-language outlet", tier: 4, hasRss: true },
  { name: 'Ming Pao', url: 'https://news.mingpao.com/', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'HK', language: 'zh', description: "Hong Kong's respected Chinese-language daily", tier: 4, hasRss: true },
  { name: 'The Standard HK', url: 'https://www.thestandard.com.hk/', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'HK', language: 'en', description: "Hong Kong's free English-language daily", tier: 4, hasRss: true },
  { name: 'HK01', url: 'https://www.hk01.com/', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'HK', language: 'zh', description: "Hong Kong's popular digital news outlet", tier: 4, hasRss: true },

  // ============================================================
  // ASIA — Singapore
  // ============================================================
  { name: 'The Straits Times', url: 'https://www.straitstimes.com/', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'SG', language: 'en', description: "Singapore's newspaper of record", tier: 3, paywalled: true, hasRss: true },
  { name: 'Channel NewsAsia', url: 'https://www.channelnewsasia.com/', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'SG', language: 'en', description: "Singapore's 24-hour news channel", tier: 3, hasRss: true },
  { name: 'The Business Times', url: 'https://www.businesstimes.com.sg/', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'SG', language: 'en', description: "Singapore's leading business daily", tier: 4, paywalled: true, hasRss: true },
  { name: 'TODAY', url: 'https://www.todayonline.com/', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'SG', language: 'en', description: "Singapore's digital news outlet", tier: 4, hasRss: true },
  { name: 'Lianhe Zaobao', url: 'https://www.zaobao.com.sg/', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'SG', language: 'zh', description: "Singapore's Chinese-language daily", tier: 4, hasRss: true },

  // ============================================================
  // ASIA — Malaysia
  // ============================================================
  { name: 'The Star Malaysia', url: 'https://www.thestar.com.my/', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'MY', language: 'en', description: "Malaysia's largest English-language daily", tier: 3, hasRss: true },
  { name: 'New Straits Times', url: 'https://www.nst.com.my/', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'MY', language: 'en', description: "Malaysia's oldest English-language newspaper", tier: 4, hasRss: true },
  { name: 'The Edge Malaysia', url: 'https://theedgemalaysia.com/', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'MY', language: 'en', description: "Malaysia's business and investment weekly", tier: 4, paywalled: true, hasRss: true },
  { name: 'Malay Mail', url: 'https://www.malaymail.com/', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'MY', language: 'en', description: "Malaysia's popular English-language daily", tier: 4, hasRss: true },
  { name: 'Free Malaysia Today', url: 'https://www.freemalaysiatoday.com/', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'MY', language: 'en', description: "Malaysia's independent news portal", tier: 4, hasRss: true },

  // ============================================================
  // ASIA — Indonesia
  // ============================================================
  { name: 'Kompas', url: 'https://www.kompas.com/', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'ID', language: 'id', description: "Indonesia's largest-circulation daily", tier: 3, hasRss: true },
  { name: 'Jakarta Post', url: 'https://www.thejakartapost.com/', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'ID', language: 'en', description: "Indonesia's leading English-language daily", tier: 3, hasRss: true },
  { name: 'Tempo', url: 'https://en.tempo.co/', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'ID', language: 'en', description: "Indonesia's investigative newsmagazine", tier: 4, hasRss: true },
  { name: 'Detik', url: 'https://news.detik.com/', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'ID', language: 'id', description: "Indonesia's most-visited news portal", tier: 3, hasRss: true },
  { name: 'Antara', url: 'https://en.antaranews.com/', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'ID', language: 'en', description: "Indonesia's national news agency", tier: 4, hasRss: true },

  // ============================================================
  // ASIA — Philippines
  // ============================================================
  { name: 'Philippine Daily Inquirer', url: 'https://newsinfo.inquirer.net/', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'PH', language: 'en', description: "Philippines' largest-circulation broadsheet", tier: 3, hasRss: true },
  { name: 'Manila Bulletin', url: 'https://mb.com.ph/', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'PH', language: 'en', description: "Philippines' oldest national daily", tier: 4, hasRss: true },
  { name: 'The Philippine Star', url: 'https://www.philstar.com/', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'PH', language: 'en', description: "Philippines' major national daily", tier: 4, hasRss: true },
  { name: 'Rappler', url: 'https://www.rappler.com/', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'PH', language: 'en', description: "Philippines' leading digital news outlet", tier: 3, hasRss: true },
  { name: 'BusinessWorld', url: 'https://www.bworldonline.com/', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'PH', language: 'en', description: "Philippines' leading business daily", tier: 4, hasRss: true },

  // ============================================================
  // ASIA — Thailand
  // ============================================================
  { name: 'Bangkok Post', url: 'https://www.bangkokpost.com/', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'TH', language: 'en', description: "Thailand's leading English-language daily", tier: 3, hasRss: true },
  { name: 'The Nation Thailand', url: 'https://www.nationthailand.com/', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'TH', language: 'en', description: "Thailand's English-language daily", tier: 4, hasRss: true },
  { name: 'Thai PBS World', url: 'https://www.thaipbsworld.com/', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'TH', language: 'en', description: "Thailand's public broadcaster English news", tier: 4, hasRss: true },
  { name: 'Khaosod English', url: 'https://www.khaosodenglish.com/', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'TH', language: 'en', description: "Thailand's progressive English-language outlet", tier: 5, hasRss: true },
  { name: 'Prachatai', url: 'https://prachataienglish.com/', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'TH', language: 'en', description: "Thailand's independent news outlet", tier: 5, hasRss: true },

  // ============================================================
  // ASIA — Vietnam
  // ============================================================
  { name: 'VnExpress', url: 'https://e.vnexpress.net/', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'VN', language: 'en', description: "Vietnam's most-read news site", tier: 3, hasRss: true },
  { name: 'Vietnam News', url: 'https://vietnamnews.vn/', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'VN', language: 'en', description: "Vietnam's national English-language daily", tier: 4, hasRss: true },
  { name: 'Tuoi Tre News', url: 'https://tuoitrenews.vn/', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'VN', language: 'en', description: "Vietnam's popular youth newspaper", tier: 4, hasRss: true },
  { name: 'Thanh Nien', url: 'https://thanhnien.vn/', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'VN', language: 'vi', description: "Vietnam's major national daily", tier: 4, hasRss: true },
  { name: 'VietnamPlus', url: 'https://en.vietnamplus.vn/', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'VN', language: 'en', description: "Vietnam's state news agency English portal", tier: 4, hasRss: true },

  // ============================================================
  // ASIA — Pakistan
  // ============================================================
  { name: 'Dawn', url: 'https://www.dawn.com/', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'PK', language: 'en', description: "Pakistan's oldest English-language daily", tier: 3, hasRss: true },
  { name: 'The News International', url: 'https://www.thenews.com.pk/', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'PK', language: 'en', description: "Pakistan's largest English-language daily", tier: 3, hasRss: true },
  { name: 'Express Tribune', url: 'https://tribune.com.pk/', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'PK', language: 'en', description: "Pakistan's major English-language daily", tier: 4, hasRss: true },
  { name: 'Business Recorder', url: 'https://www.brecorder.com/', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'PK', language: 'en', description: "Pakistan's leading business newspaper", tier: 4, hasRss: true },
  { name: 'Geo News', url: 'https://www.geo.tv/', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'PK', language: 'en', description: "Pakistan's largest news broadcaster", tier: 3, hasRss: true },

  // ============================================================
  // ASIA — Bangladesh
  // ============================================================
  { name: 'The Daily Star', url: 'https://www.thedailystar.net/', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'BD', language: 'en', description: "Bangladesh's largest English-language daily", tier: 3, hasRss: true },
  { name: 'Dhaka Tribune', url: 'https://www.dhakatribune.com/', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'BD', language: 'en', description: "Bangladesh's major English-language daily", tier: 4, hasRss: true },
  { name: 'bdnews24.com', url: 'https://bdnews24.com/', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'BD', language: 'en', description: "Bangladesh's first online newspaper", tier: 4, hasRss: true },
  { name: 'New Age', url: 'https://www.newagebd.net/', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'BD', language: 'en', description: "Bangladesh's independent daily", tier: 4, hasRss: true },
  { name: 'Prothom Alo', url: 'https://en.prothomalo.com/', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'BD', language: 'en', description: "Bangladesh's largest Bengali daily", tier: 3, hasRss: true },

  // ============================================================
  // ASIA — Nepal
  // ============================================================
  { name: 'The Kathmandu Post', url: 'https://kathmandupost.com/', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'NP', language: 'en', description: "Nepal's leading English-language daily", tier: 4, hasRss: true },
  { name: 'The Himalayan Times', url: 'https://thehimalayantimes.com/', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'NP', language: 'en', description: "Nepal's largest English-language daily", tier: 4, hasRss: true },
  { name: 'Onlinekhabar', url: 'https://english.onlinekhabar.com/', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'NP', language: 'en', description: "Nepal's popular digital news outlet", tier: 5, hasRss: true },
  { name: 'Republica', url: 'https://myrepublica.nagariknetwork.com/', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'NP', language: 'en', description: "Nepal's national English daily", tier: 5, hasRss: true },

  // ============================================================
  // ASIA — Sri Lanka
  // ============================================================
  { name: 'Daily FT', url: 'https://www.ft.lk/', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'LK', language: 'en', description: "Sri Lanka's leading business daily", tier: 4, hasRss: true },
  { name: 'Daily Mirror Sri Lanka', url: 'https://www.dailymirror.lk/', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'LK', language: 'en', description: "Sri Lanka's major English-language daily", tier: 4, hasRss: true },
  { name: 'The Island', url: 'https://island.lk/', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'LK', language: 'en', description: "Sri Lanka's independent English daily", tier: 5, hasRss: true },
  { name: 'Sunday Observer', url: 'https://www.sundayobserver.lk/', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'LK', language: 'en', description: "Sri Lanka's oldest Sunday newspaper", tier: 5, hasRss: true },

  // ============================================================
  // OCEANIA — Australia (skip AFR, Guardian Australia)
  // ============================================================
  { name: 'The Australian', url: 'https://www.theaustralian.com.au/', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'AU', language: 'en', description: "Australia's national broadsheet", tier: 3, paywalled: true, hasRss: true },
  { name: 'The Sydney Morning Herald', url: 'https://www.smh.com.au/', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'AU', language: 'en', description: "Australia's oldest quality broadsheet", tier: 3, paywalled: true, hasRss: true },
  { name: 'The Age', url: 'https://www.theage.com.au/', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'AU', language: 'en', description: "Melbourne's quality broadsheet", tier: 3, paywalled: true, hasRss: true },
  { name: 'ABC News Australia', url: 'https://www.abc.net.au/news', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'AU', language: 'en', description: "Australia's public broadcaster", tier: 3, hasRss: true },
  { name: 'news.com.au', url: 'https://www.news.com.au/', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'AU', language: 'en', description: "Australia's most-read news site", tier: 4, hasRss: true },
  { name: 'The Daily Telegraph AU', url: 'https://www.dailytelegraph.com.au/', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'AU', language: 'en', description: "Sydney's tabloid daily", tier: 4, paywalled: true, hasRss: true },
  { name: 'Herald Sun', url: 'https://www.heraldsun.com.au/', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'AU', language: 'en', description: "Melbourne's tabloid daily", tier: 4, paywalled: true, hasRss: true },
  { name: 'The Courier-Mail', url: 'https://www.couriermail.com.au/', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'AU', language: 'en', description: "Brisbane's major daily", tier: 4, paywalled: true, hasRss: true },
  { name: 'The West Australian', url: 'https://thewest.com.au/', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'AU', language: 'en', description: "Perth's major daily newspaper", tier: 4, paywalled: true, hasRss: true },
  { name: 'Crikey', url: 'https://www.crikey.com.au/', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'AU', language: 'en', description: "Australia's independent digital news outlet", tier: 4, paywalled: true, hasRss: true },
  { name: 'SBS News', url: 'https://www.sbs.com.au/news/', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'AU', language: 'en', description: "Australia's multicultural public broadcaster", tier: 4, hasRss: true },

  // ============================================================
  // OCEANIA — New Zealand
  // ============================================================
  { name: 'NZ Herald', url: 'https://www.nzherald.co.nz/', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'NZ', language: 'en', description: "New Zealand's largest daily newspaper", tier: 3, paywalled: true, hasRss: true },
  { name: 'Stuff', url: 'https://www.stuff.co.nz/', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'NZ', language: 'en', description: "New Zealand's largest news website", tier: 3, hasRss: true },
  { name: 'The Post NZ', url: 'https://www.thepost.co.nz/', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'NZ', language: 'en', description: "Wellington's daily newspaper", tier: 4, hasRss: true },
  { name: 'Otago Daily Times', url: 'https://www.odt.co.nz/', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'NZ', language: 'en', description: "New Zealand's oldest daily newspaper", tier: 5, hasRss: true },
  { name: 'Radio New Zealand', url: 'https://www.rnz.co.nz/', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'NZ', language: 'en', description: "New Zealand's public broadcaster", tier: 3, hasRss: true },
  { name: 'Newsroom NZ', url: 'https://newsroom.co.nz/', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'NZ', language: 'en', description: "New Zealand's investigative news outlet", tier: 4, hasRss: true },

  // ============================================================
  // OCEANIA — Papua New Guinea
  // ============================================================
  { name: 'Post-Courier', url: 'https://postcourier.com.pg/', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'PG', language: 'en', description: "Papua New Guinea's oldest daily", tier: 5, hasRss: true },
  { name: 'The National PNG', url: 'https://www.thenational.com.pg/', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'PG', language: 'en', description: "Papua New Guinea's national daily", tier: 5, hasRss: true },
  { name: 'EMTV Online', url: 'https://emtv.com.pg/', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'PG', language: 'en', description: "Papua New Guinea's TV news outlet", tier: 5, hasRss: true },

  // ============================================================
  // OCEANIA — Fiji
  // ============================================================
  { name: 'Fiji Times', url: 'https://www.fijitimes.com.fj/', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'FJ', language: 'en', description: "Fiji's oldest and largest daily", tier: 5, hasRss: true },
  { name: 'Fiji Sun', url: 'https://fijisun.com.fj/', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'FJ', language: 'en', description: "Fiji's national daily newspaper", tier: 5, hasRss: true },
  { name: 'FBC News', url: 'https://www.fbcnews.com.fj/', type: 'news', category: 'both', region: 'Asia-Pacific', country: 'FJ', language: 'en', description: "Fiji's broadcasting corporation news", tier: 5, hasRss: true },
];
