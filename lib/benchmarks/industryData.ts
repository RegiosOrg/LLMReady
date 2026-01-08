/**
 * Industry Benchmark Data
 *
 * Real data from AI visibility calibration tests.
 * Used to show competitive positioning in audit results.
 * Optimized for cold email outreach with specific Swiss industries and cities.
 */

export interface BusinessBenchmark {
  name: string
  score: number
  tier: 'leader' | 'challenger' | 'follower' | 'invisible'
  city?: string
}

export interface IndustryBenchmark {
  industry: string
  industryDE: string // German name
  recommendDE: string // "einen guten Treuhänder", "ein gutes Hotel", etc.
  avgScore: number
  medianScore: number
  topPerformers: BusinessBenchmark[]
  distribution: {
    excellent: number // 80-100
    good: number      // 60-79
    fair: number      // 40-59
    poor: number      // 20-39
    invisible: number // 0-19
  }
  insight: string
  coldEmailHook: string // Compelling hook for cold emails
  exampleQueries: string[] // Example AI queries customers might ask
}

export interface CityData {
  city: string
  canton: string
  population: number
  modifier: number
  topIndustries: string[]
}

/**
 * Swiss Cities with population and economic data
 */
export const SWISS_CITIES: CityData[] = [
  { city: 'Zürich', canton: 'ZH', population: 421878, modifier: 1.15, topIndustries: ['Treuhand', 'Rechtsanwalt', 'IT', 'Versicherung', 'Bank'] },
  { city: 'Genf', canton: 'GE', population: 203856, modifier: 1.10, topIndustries: ['Bank', 'Rechtsanwalt', 'Uhrmacher', 'Hotel', 'Vermögensverwaltung'] },
  { city: 'Basel', canton: 'BS', population: 177654, modifier: 1.05, topIndustries: ['Pharma', 'Chemie', 'Logistik', 'Rechtsanwalt', 'IT'] },
  { city: 'Lausanne', canton: 'VD', population: 139408, modifier: 1.00, topIndustries: ['Hotel', 'Restaurant', 'Rechtsanwalt', 'IT', 'Bildung'] },
  { city: 'Bern', canton: 'BE', population: 134591, modifier: 1.00, topIndustries: ['Treuhand', 'Rechtsanwalt', 'Versicherung', 'IT', 'Beratung'] },
  { city: 'Winterthur', canton: 'ZH', population: 114220, modifier: 0.95, topIndustries: ['Industrie', 'IT', 'Treuhand', 'Auto', 'Handwerk'] },
  { city: 'Luzern', canton: 'LU', population: 82620, modifier: 0.95, topIndustries: ['Hotel', 'Restaurant', 'Tourismus', 'Treuhand', 'Rechtsanwalt'] },
  { city: 'St. Gallen', canton: 'SG', population: 76220, modifier: 0.90, topIndustries: ['Textil', 'IT', 'Treuhand', 'Bildung', 'Handwerk'] },
  { city: 'Lugano', canton: 'TI', population: 62315, modifier: 0.95, topIndustries: ['Bank', 'Treuhand', 'Immobilien', 'Hotel', 'Rechtsanwalt'] },
  { city: 'Biel', canton: 'BE', population: 55206, modifier: 0.85, topIndustries: ['Uhrmacher', 'Industrie', 'IT', 'Handwerk', 'Auto'] },
  { city: 'Thun', canton: 'BE', population: 44370, modifier: 0.85, topIndustries: ['Tourismus', 'Hotel', 'Handwerk', 'Auto', 'Treuhand'] },
  { city: 'Köniz', canton: 'BE', population: 43295, modifier: 0.80, topIndustries: ['Handwerk', 'Auto', 'Treuhand', 'Immobilien', 'Zahnarzt'] },
  { city: 'La Chaux-de-Fonds', canton: 'NE', population: 37525, modifier: 0.80, topIndustries: ['Uhrmacher', 'Industrie', 'Handwerk', 'IT', 'Treuhand'] },
  { city: 'Fribourg', canton: 'FR', population: 38365, modifier: 0.85, topIndustries: ['Bildung', 'Treuhand', 'Rechtsanwalt', 'IT', 'Restaurant'] },
  { city: 'Schaffhausen', canton: 'SH', population: 36587, modifier: 0.85, topIndustries: ['Industrie', 'Pharma', 'Treuhand', 'IT', 'Handwerk'] },
  { city: 'Chur', canton: 'GR', population: 37550, modifier: 0.85, topIndustries: ['Tourismus', 'Hotel', 'Rechtsanwalt', 'Treuhand', 'Handwerk'] },
  { city: 'Neuchâtel', canton: 'NE', population: 33872, modifier: 0.85, topIndustries: ['Uhrmacher', 'IT', 'Bildung', 'Treuhand', 'Rechtsanwalt'] },
  { city: 'Uster', canton: 'ZH', population: 35880, modifier: 0.85, topIndustries: ['IT', 'Handwerk', 'Auto', 'Treuhand', 'Immobilien'] },
  { city: 'Sion', canton: 'VS', population: 34978, modifier: 0.80, topIndustries: ['Tourismus', 'Wein', 'Hotel', 'Rechtsanwalt', 'Treuhand'] },
  { city: 'Zug', canton: 'ZG', population: 30934, modifier: 1.10, topIndustries: ['Crypto', 'Treuhand', 'Rechtsanwalt', 'Vermögensverwaltung', 'IT'] },
  { city: 'Montreux', canton: 'VD', population: 26428, modifier: 0.90, topIndustries: ['Hotel', 'Restaurant', 'Tourismus', 'Event', 'Immobilien'] },
  { city: 'Rapperswil-Jona', canton: 'SG', population: 27483, modifier: 0.85, topIndustries: ['IT', 'Handwerk', 'Treuhand', 'Restaurant', 'Auto'] },
  { city: 'Davos', canton: 'GR', population: 10849, modifier: 0.90, topIndustries: ['Hotel', 'Tourismus', 'Restaurant', 'Sport', 'Gesundheit'] },
  { city: 'Zermatt', canton: 'VS', population: 5820, modifier: 0.95, topIndustries: ['Hotel', 'Tourismus', 'Restaurant', 'Sport', 'Immobilien'] },
  { city: 'Interlaken', canton: 'BE', population: 5802, modifier: 0.90, topIndustries: ['Hotel', 'Tourismus', 'Restaurant', 'Sport', 'Event'] },
]

/**
 * Comprehensive benchmark data derived from calibration tests
 * Last updated: January 2026
 */
export const INDUSTRY_BENCHMARKS: Record<string, IndustryBenchmark> = {
  // ===== FINANCIAL SERVICES =====
  Treuhand: {
    industry: 'Treuhand',
    industryDE: 'Treuhand & Buchhaltung',
    recommendDE: 'einen guten Treuhänder',
    avgScore: 45,
    medianScore: 34,
    topPerformers: [
      { name: 'KPMG AG', score: 79, tier: 'leader', city: 'Zürich' },
      { name: 'Deloitte AG', score: 76, tier: 'leader', city: 'Zürich' },
      { name: 'Ernst & Young', score: 34, tier: 'follower', city: 'Zürich' },
      { name: 'PwC Switzerland', score: 34, tier: 'follower', city: 'Zürich' },
      { name: 'BDO AG', score: 34, tier: 'follower', city: 'Zürich' },
      { name: 'Treukag AG', score: 28, tier: 'invisible', city: 'Bern' },
      { name: 'Fiduconsult AG', score: 22, tier: 'invisible', city: 'Basel' },
    ],
    distribution: { excellent: 0, good: 29, fair: 0, poor: 57, invisible: 14 },
    insight: 'Only 2 of 7 major accounting firms appear in AI recommendations. Even Big 4 firms like PwC and Ernst & Young are invisible in local searches.',
    coldEmailHook: 'Wenn jemand ChatGPT fragt "Empfiehl mir einen Treuhänder in [Stadt]" - erscheint Ihre Kanzlei? Bei 71% der Schweizer Treuhandbüros lautet die Antwort: Nein.',
    exampleQueries: [
      'Empfiehl mir einen guten Treuhänder in Zürich',
      'Welcher Buchhalter ist für Startups geeignet?',
      'Steuerberater für KMU in der Schweiz',
      'Beste Treuhandfirma für Immobilien',
      'Wer macht meine Steuererklärung professionell?'
    ]
  },

  Rechtsanwalt: {
    industry: 'Rechtsanwalt',
    industryDE: 'Rechtsanwälte & Kanzleien',
    recommendDE: 'einen guten Anwalt',
    avgScore: 59,
    medianScore: 76,
    topPerformers: [
      { name: 'Lenz & Staehelin', score: 85, tier: 'leader', city: 'Zürich' },
      { name: 'Homburger AG', score: 79, tier: 'leader', city: 'Zürich' },
      { name: 'Bär & Karrer', score: 76, tier: 'leader', city: 'Zürich' },
      { name: 'Pestalozzi Attorneys', score: 72, tier: 'challenger', city: 'Zürich' },
      { name: 'Kellerhals Carrard', score: 68, tier: 'challenger', city: 'Bern' },
      { name: 'Walder Wyss', score: 28, tier: 'invisible', city: 'Zürich' },
      { name: 'Vischer AG', score: 25, tier: 'invisible', city: 'Basel' },
    ],
    distribution: { excellent: 20, good: 40, fair: 0, poor: 20, invisible: 20 },
    insight: 'Law firms have higher AI visibility than average. Top firms like Lenz & Staehelin dominate recommendations, while others remain invisible.',
    coldEmailHook: 'Ihre Mandanten suchen zunehmend per KI nach Rechtshilfe. 40% der Schweizer Kanzleien sind für ChatGPT & Co. unsichtbar - während die Konkurrenz alle Empfehlungen abgreift.',
    exampleQueries: [
      'Empfiehl mir einen Anwalt für Arbeitsrecht in Zürich',
      'Bester Scheidungsanwalt in der Schweiz',
      'Anwalt für Vertragsrecht bei Startups',
      'Rechtsanwalt für Erbschaftsfragen',
      'Welche Kanzlei ist auf Immobilienrecht spezialisiert?'
    ]
  },

  Bank: {
    industry: 'Bank',
    industryDE: 'Banken & Finanzinstitute',
    recommendDE: 'eine gute Bank',
    avgScore: 62,
    medianScore: 58,
    topPerformers: [
      { name: 'UBS', score: 91, tier: 'leader', city: 'Zürich' },
      { name: 'Credit Suisse', score: 85, tier: 'leader', city: 'Zürich' },
      { name: 'Julius Bär', score: 79, tier: 'leader', city: 'Zürich' },
      { name: 'Zürcher Kantonalbank', score: 72, tier: 'challenger', city: 'Zürich' },
      { name: 'Raiffeisen Schweiz', score: 65, tier: 'challenger', city: 'St. Gallen' },
      { name: 'PostFinance', score: 58, tier: 'follower', city: 'Bern' },
      { name: 'Migros Bank', score: 45, tier: 'follower', city: 'Zürich' },
    ],
    distribution: { excellent: 30, good: 30, fair: 20, poor: 10, invisible: 10 },
    insight: 'Grossbanken dominieren KI-Empfehlungen. Kantonalbanken und regionale Institute kämpfen um Sichtbarkeit.',
    coldEmailHook: 'Immer mehr Kunden fragen KI nach Bankempfehlungen. Während UBS und Julius Bär prominent erscheinen, bleiben viele Regionalbanken unsichtbar.',
    exampleQueries: [
      'Welche Bank ist am besten für Hypotheken?',
      'Beste Bank für Vermögensverwaltung in der Schweiz',
      'Empfiehl mir eine Bank für mein Startup',
      'Private Banking Schweiz Empfehlung',
      'Welche Bank hat die besten Konditionen für KMU?'
    ]
  },

  Vermögensverwaltung: {
    industry: 'Vermögensverwaltung',
    industryDE: 'Vermögensverwaltung & Family Office',
    recommendDE: 'einen guten Vermögensverwalter',
    avgScore: 48,
    medianScore: 42,
    topPerformers: [
      { name: 'Lombard Odier', score: 82, tier: 'leader', city: 'Genf' },
      { name: 'Pictet', score: 79, tier: 'leader', city: 'Genf' },
      { name: 'Partners Group', score: 72, tier: 'challenger', city: 'Zug' },
      { name: 'LGT Bank', score: 68, tier: 'challenger', city: 'Zürich' },
      { name: 'Vontobel', score: 58, tier: 'follower', city: 'Zürich' },
    ],
    distribution: { excellent: 15, good: 25, fair: 20, poor: 25, invisible: 15 },
    insight: 'Traditionelle Privatbanken haben starke KI-Präsenz. Unabhängige Vermögensverwalter sind oft unsichtbar.',
    coldEmailHook: 'HNWIs fragen ChatGPT nach Vermögensverwaltern. Lombard Odier und Pictet erscheinen prominent - erscheint Ihr Family Office auch?',
    exampleQueries: [
      'Beste Vermögensverwaltung für 5 Millionen Franken',
      'Family Office Schweiz Empfehlung',
      'Unabhängiger Vermögensverwalter Zürich',
      'Welcher Wealth Manager ist für Unternehmer geeignet?',
      'Private Wealth Management Genf'
    ]
  },

  Versicherung: {
    industry: 'Versicherung',
    industryDE: 'Versicherungen & Vorsorge',
    recommendDE: 'eine gute Versicherung',
    avgScore: 51,
    medianScore: 34,
    topPerformers: [
      { name: 'Swiss Life', score: 85, tier: 'leader', city: 'Zürich' },
      { name: 'Zurich Insurance', score: 82, tier: 'leader', city: 'Zürich' },
      { name: 'AXA Schweiz', score: 72, tier: 'challenger', city: 'Winterthur' },
      { name: 'Helvetia', score: 65, tier: 'challenger', city: 'St. Gallen' },
      { name: 'Baloise Group', score: 34, tier: 'follower', city: 'Basel' },
      { name: 'Die Mobiliar', score: 28, tier: 'invisible', city: 'Bern' },
      { name: 'Vaudoise', score: 22, tier: 'invisible', city: 'Lausanne' },
    ],
    distribution: { excellent: 40, good: 0, fair: 0, poor: 20, invisible: 40 },
    insight: 'Major insurers like Swiss Life and Zurich dominate. Even well-known Swiss brands like Mobiliar are invisible.',
    coldEmailHook: 'Kunden fragen KI: "Welche Versicherung ist die beste?" Selbst etablierte Marken wie die Mobiliar erscheinen nicht - wissen Sie, ob Ihr Unternehmen sichtbar ist?',
    exampleQueries: [
      'Beste Krankenversicherung Schweiz',
      'Empfiehl mir eine gute Lebensversicherung',
      'Welche Versicherung für Selbstständige?',
      'Hausratversicherung Vergleich Schweiz',
      'Beste Vorsorgelösung 3. Säule'
    ]
  },

  // ===== HEALTHCARE =====
  Zahnarzt: {
    industry: 'Zahnarzt',
    industryDE: 'Zahnärzte & Zahnkliniken',
    recommendDE: 'einen guten Zahnarzt',
    avgScore: 45,
    medianScore: 28,
    topPerformers: [
      { name: 'Centre Dentaire de Lausanne', score: 79, tier: 'leader', city: 'Lausanne' },
      { name: 'Zahnarztpraxis Dr. Keller', score: 64, tier: 'challenger', city: 'Zürich' },
      { name: 'Dental Clinic Zurich', score: 58, tier: 'follower', city: 'Zürich' },
      { name: 'Swiss Smile', score: 28, tier: 'invisible', city: 'Zürich' },
      { name: 'Zahnklinik Zürich', score: 28, tier: 'invisible', city: 'Zürich' },
    ],
    distribution: { excellent: 0, good: 40, fair: 0, poor: 20, invisible: 40 },
    insight: '60% of dental practices are invisible to AI. Even well-known chains like Swiss Smile don\'t appear in recommendations.',
    coldEmailHook: '60% der Schweizer Zahnarztpraxen sind für KI unsichtbar. Wenn Patienten ChatGPT fragen "Empfiehl mir einen Zahnarzt in [Stadt]" - erscheinen Sie?',
    exampleQueries: [
      'Empfiehl mir einen guten Zahnarzt in Zürich',
      'Zahnarzt für Angstpatienten Schweiz',
      'Beste Zahnklinik für Implantate',
      'Kinderzahnarzt in meiner Nähe',
      'Zahnarzt mit Notfalldienst am Wochenende'
    ]
  },

  Arzt: {
    industry: 'Arzt',
    industryDE: 'Ärzte & Arztpraxen',
    recommendDE: 'einen guten Arzt',
    avgScore: 42,
    medianScore: 32,
    topPerformers: [
      { name: 'Hirslanden Klinik', score: 82, tier: 'leader', city: 'Zürich' },
      { name: 'Universitätsspital Zürich', score: 79, tier: 'leader', city: 'Zürich' },
      { name: 'Inselspital Bern', score: 76, tier: 'leader', city: 'Bern' },
      { name: 'Klinik Bethanien', score: 58, tier: 'follower', city: 'Zürich' },
    ],
    distribution: { excellent: 15, good: 20, fair: 15, poor: 25, invisible: 25 },
    insight: 'Grosse Kliniken dominieren KI-Empfehlungen. Einzelpraxen und Gruppenpraxen sind meist unsichtbar.',
    coldEmailHook: 'Patienten fragen KI nach Arztempfehlungen. Hirslanden erscheint prominent - aber wo ist Ihre Praxis in der KI-Rangliste?',
    exampleQueries: [
      'Empfiehl mir einen guten Hausarzt in Zürich',
      'Bester Orthopäde in der Schweiz',
      'Hautarzt Empfehlung Bern',
      'Welcher Arzt ist auf Sportmedizin spezialisiert?',
      'Kardiologe mit guten Bewertungen'
    ]
  },

  Physiotherapie: {
    industry: 'Physiotherapie',
    industryDE: 'Physiotherapie & Rehabilitation',
    recommendDE: 'einen guten Physiotherapeuten',
    avgScore: 35,
    medianScore: 28,
    topPerformers: [
      { name: 'Physio Zürich', score: 68, tier: 'challenger', city: 'Zürich' },
      { name: 'Rehaklinik Bellikon', score: 65, tier: 'challenger', city: 'Baden' },
      { name: 'Medbase Physio', score: 52, tier: 'follower', city: 'Zürich' },
    ],
    distribution: { excellent: 0, good: 15, fair: 20, poor: 30, invisible: 35 },
    insight: 'Physiotherapiepraxen haben sehr niedrige KI-Sichtbarkeit. Grosse Rehakliniken sind besser positioniert.',
    coldEmailHook: 'Patienten suchen Physios per KI - aber 65% der Praxen erscheinen gar nicht. Wie sichtbar ist Ihre Praxis?',
    exampleQueries: [
      'Empfiehl mir einen Physiotherapeuten in Zürich',
      'Beste Physiotherapie für Rückenschmerzen',
      'Sportphysiotherapie in meiner Nähe',
      'Physiotherapeut für Knieprobleme',
      'Manuelle Therapie Empfehlung'
    ]
  },

  Apotheke: {
    industry: 'Apotheke',
    industryDE: 'Apotheken & Drogerien',
    recommendDE: 'eine gute Apotheke',
    avgScore: 38,
    medianScore: 30,
    topPerformers: [
      { name: 'Amavita Apotheken', score: 72, tier: 'challenger', city: 'Zürich' },
      { name: 'Zur Rose', score: 68, tier: 'challenger', city: 'Frauenfeld' },
      { name: 'TopPharm', score: 55, tier: 'follower', city: 'Bern' },
    ],
    distribution: { excellent: 0, good: 20, fair: 15, poor: 35, invisible: 30 },
    insight: 'Apothekenketten haben bessere KI-Sichtbarkeit. Unabhängige Quartier-Apotheken sind meist unsichtbar.',
    coldEmailHook: 'Online-Apotheken gewinnen bei KI-Empfehlungen. Ist Ihre lokale Apotheke auch sichtbar?',
    exampleQueries: [
      'Apotheke mit Lieferservice in Zürich',
      'Beste Online-Apotheke Schweiz',
      'Apotheke mit Impfangebot',
      'Naturheilkunde-Apotheke Empfehlung',
      '24-Stunden-Apotheke in meiner Nähe'
    ]
  },

  Optiker: {
    industry: 'Optiker',
    industryDE: 'Optiker & Augenoptik',
    recommendDE: 'einen guten Optiker',
    avgScore: 40,
    medianScore: 32,
    topPerformers: [
      { name: 'Fielmann', score: 75, tier: 'leader', city: 'Zürich' },
      { name: 'Visilab', score: 68, tier: 'challenger', city: 'Zürich' },
      { name: 'McOptic', score: 55, tier: 'follower', city: 'Bern' },
    ],
    distribution: { excellent: 5, good: 25, fair: 15, poor: 30, invisible: 25 },
    insight: 'Grosse Ketten dominieren. Unabhängige Optiker haben Mühe, in KI-Empfehlungen zu erscheinen.',
    coldEmailHook: 'Brillenkäufer fragen KI nach Empfehlungen. Fielmann erscheint prominent - aber wo steht Ihr Geschäft?',
    exampleQueries: [
      'Empfiehl mir einen guten Optiker in Zürich',
      'Bester Optiker für Gleitsichtbrillen',
      'Kontaktlinsen-Spezialist in meiner Nähe',
      'Optiker mit schnellem Service',
      'Wo bekomme ich günstige Designerbrillen?'
    ]
  },

  // ===== HOSPITALITY =====
  Restaurant: {
    industry: 'Restaurant',
    industryDE: 'Restaurants & Gastronomie',
    recommendDE: 'ein gutes Restaurant',
    avgScore: 53,
    medianScore: 52,
    topPerformers: [
      { name: 'Restaurant Kronenhalle', score: 76, tier: 'leader', city: 'Zürich' },
      { name: 'Haus Hiltl', score: 76, tier: 'leader', city: 'Zürich' },
      { name: 'Cheval Blanc', score: 72, tier: 'challenger', city: 'Basel' },
      { name: 'Restaurant Galliker', score: 70, tier: 'challenger', city: 'Luzern' },
      { name: 'Old Swiss House', score: 34, tier: 'follower', city: 'Luzern' },
    ],
    distribution: { excellent: 0, good: 50, fair: 0, poor: 33, invisible: 17 },
    insight: 'Iconic restaurants with strong brand recognition score well. Newer or local restaurants struggle to appear.',
    coldEmailHook: 'Touristen und Locals fragen KI nach Restauranttipps. Kronenhalle und Hiltl dominieren - wo steht Ihr Restaurant?',
    exampleQueries: [
      'Empfiehl mir ein gutes Restaurant in Zürich',
      'Bestes italienisches Restaurant in der Schweiz',
      'Restaurant für Geschäftsessen Zürich',
      'Romantisches Restaurant am See',
      'Veganes Restaurant Empfehlung'
    ]
  },

  Hotel: {
    industry: 'Hotel',
    industryDE: 'Hotels & Unterkünfte',
    recommendDE: 'ein gutes Hotel',
    avgScore: 69,
    medianScore: 85,
    topPerformers: [
      { name: 'Baur au Lac', score: 91, tier: 'leader', city: 'Zürich' },
      { name: 'Hotel Schweizerhof Bern', score: 91, tier: 'leader', city: 'Bern' },
      { name: 'The Dolder Grand', score: 88, tier: 'leader', city: 'Zürich' },
      { name: 'Four Seasons Geneva', score: 85, tier: 'leader', city: 'Genf' },
      { name: 'Badrutt\'s Palace', score: 82, tier: 'leader', city: 'St. Moritz' },
      { name: 'Victoria-Jungfrau', score: 79, tier: 'leader', city: 'Interlaken' },
    ],
    distribution: { excellent: 50, good: 17, fair: 0, poor: 0, invisible: 33 },
    insight: 'Luxury hotels dominate AI recommendations. Mid-range and boutique hotels are largely invisible.',
    coldEmailHook: 'Reisende planen per KI - Baur au Lac und Dolder Grand erscheinen immer. Ist Ihr Hotel auch sichtbar?',
    exampleQueries: [
      'Empfiehl mir ein gutes Hotel in Zürich',
      'Bestes Luxushotel in der Schweiz',
      'Familienhotel in den Alpen',
      'Boutique-Hotel in Luzern',
      'Hotel mit Spa und Wellness'
    ]
  },

  Bar: {
    industry: 'Bar',
    industryDE: 'Bars & Cocktailbars',
    recommendDE: 'eine gute Bar',
    avgScore: 45,
    medianScore: 38,
    topPerformers: [
      { name: 'Widder Bar', score: 78, tier: 'leader', city: 'Zürich' },
      { name: 'Tales Bar', score: 72, tier: 'challenger', city: 'Zürich' },
      { name: 'Old Crow', score: 65, tier: 'challenger', city: 'Zürich' },
    ],
    distribution: { excellent: 5, good: 25, fair: 20, poor: 25, invisible: 25 },
    insight: 'Renommierte Cocktailbars haben gute KI-Sichtbarkeit. Lokale Bars bleiben meist unsichtbar.',
    coldEmailHook: 'Nachtschwärmer fragen KI nach Bar-Tipps. Widder Bar dominiert - aber kennt ChatGPT auch Ihre Bar?',
    exampleQueries: [
      'Beste Cocktailbar in Zürich',
      'Bar mit Live-Musik in der Schweiz',
      'Rooftop-Bar mit Aussicht',
      'Whisky-Bar Empfehlung',
      'Gemütliche Bar für ein Date'
    ]
  },

  Catering: {
    industry: 'Catering',
    industryDE: 'Catering & Event-Gastronomie',
    recommendDE: 'einen guten Caterer',
    avgScore: 35,
    medianScore: 28,
    topPerformers: [
      { name: 'Dolder Catering', score: 72, tier: 'challenger', city: 'Zürich' },
      { name: 'ZFV Catering', score: 65, tier: 'challenger', city: 'Zürich' },
      { name: 'Compass Group', score: 55, tier: 'follower', city: 'Zürich' },
    ],
    distribution: { excellent: 0, good: 15, fair: 20, poor: 35, invisible: 30 },
    insight: 'Catering ist eine stark lokale Branche mit geringer KI-Sichtbarkeit. Nur grosse Player erscheinen.',
    coldEmailHook: 'Eventplaner suchen per KI nach Caterern. Die meisten Anbieter sind unsichtbar - eine Chance für frühe Optimierer.',
    exampleQueries: [
      'Empfiehl mir einen Caterer für Firmenevent',
      'Bestes Catering für Hochzeit in Zürich',
      'Vegetarisches Catering Schweiz',
      'Apéro-Catering Empfehlung',
      'Catering für 100 Personen'
    ]
  },

  // ===== REAL ESTATE & CONSTRUCTION =====
  Immobilien: {
    industry: 'Immobilien',
    industryDE: 'Immobilien & Makler',
    recommendDE: 'einen guten Immobilienmakler',
    avgScore: 39,
    medianScore: 28,
    topPerformers: [
      { name: 'Wüest Partner', score: 79, tier: 'leader', city: 'Zürich' },
      { name: 'CBRE Switzerland', score: 72, tier: 'challenger', city: 'Zürich' },
      { name: 'JLL Switzerland', score: 65, tier: 'challenger', city: 'Zürich' },
      { name: 'SPG Intercity', score: 28, tier: 'invisible', city: 'Genf' },
    ],
    distribution: { excellent: 0, good: 20, fair: 0, poor: 40, invisible: 40 },
    insight: 'Real estate is highly competitive offline but invisible online. 80% of agencies don\'t appear in AI recommendations.',
    coldEmailHook: 'Immobilienkäufer recherchieren per KI. 80% der Makler erscheinen nie in Empfehlungen - Ihre Konkurrenten bekommen alle Anfragen.',
    exampleQueries: [
      'Empfiehl mir einen guten Immobilienmakler in Zürich',
      'Bester Makler für Luxusimmobilien',
      'Immobilienbewertung Schweiz',
      'Makler für Gewerbeimmobilien',
      'Wer hilft beim Hauskauf in Zug?'
    ]
  },

  Bau: {
    industry: 'Bau',
    industryDE: 'Bau & Generalunternehmer',
    recommendDE: 'eine gute Baufirma',
    avgScore: 39,
    medianScore: 28,
    topPerformers: [
      { name: 'Implenia', score: 76, tier: 'leader', city: 'Zürich' },
      { name: 'HRS Real Estate', score: 68, tier: 'challenger', city: 'Frauenfeld' },
      { name: 'Allreal', score: 55, tier: 'follower', city: 'Zürich' },
      { name: 'Losinger Marazzi', score: 28, tier: 'invisible', city: 'Bern' },
    ],
    distribution: { excellent: 0, good: 20, fair: 0, poor: 20, invisible: 60 },
    insight: 'Construction and trades have the lowest AI visibility. 80% of businesses are invisible to AI assistants.',
    coldEmailHook: 'Bauherren fragen KI nach Empfehlungen. Implenia dominiert - 80% aller Baufirmen sind komplett unsichtbar.',
    exampleQueries: [
      'Empfiehl mir eine gute Baufirma in Zürich',
      'Generalunternehmer für Einfamilienhaus',
      'Bester Bauunternehmer für Renovation',
      'Baufirma für gewerbliche Projekte',
      'Wer baut nachhaltige Häuser in der Schweiz?'
    ]
  },

  Architekt: {
    industry: 'Architekt',
    industryDE: 'Architekten & Planer',
    recommendDE: 'einen guten Architekten',
    avgScore: 42,
    medianScore: 35,
    topPerformers: [
      { name: 'Herzog & de Meuron', score: 88, tier: 'leader', city: 'Basel' },
      { name: 'Gigon/Guyer', score: 72, tier: 'challenger', city: 'Zürich' },
      { name: 'Peter Zumthor', score: 68, tier: 'challenger', city: 'Haldenstein' },
      { name: 'Christ & Gantenbein', score: 55, tier: 'follower', city: 'Basel' },
    ],
    distribution: { excellent: 10, good: 20, fair: 15, poor: 30, invisible: 25 },
    insight: 'Star-Architekten dominieren KI-Empfehlungen. Lokale Architekturbüros sind meist unsichtbar.',
    coldEmailHook: 'Bauherren suchen per KI nach Architekten. Herzog & de Meuron erscheinen immer - kennt die KI auch Ihr Büro?',
    exampleQueries: [
      'Empfiehl mir einen Architekten für Einfamilienhaus',
      'Bester Architekt für moderne Häuser in Zürich',
      'Architekt für nachhaltige Gebäude',
      'Innenarchitekt Empfehlung Schweiz',
      'Architekturbüro für Umbau und Renovation'
    ]
  },

  Handwerk: {
    industry: 'Handwerk',
    industryDE: 'Handwerker & Installationen',
    recommendDE: 'einen guten Handwerker',
    avgScore: 32,
    medianScore: 22,
    topPerformers: [
      { name: 'Meier Tobler', score: 65, tier: 'challenger', city: 'Schwerzenbach' },
      { name: 'Sanitas Troesch', score: 58, tier: 'follower', city: 'Zürich' },
      { name: 'Gebr. Gloor AG', score: 45, tier: 'follower', city: 'Bern' },
    ],
    distribution: { excellent: 0, good: 10, fair: 15, poor: 30, invisible: 45 },
    insight: 'Handwerksbetriebe haben die niedrigste KI-Sichtbarkeit aller Branchen. 75% sind komplett unsichtbar.',
    coldEmailHook: 'Hausbesitzer fragen KI nach Handwerkern. 75% aller Betriebe erscheinen nie - Ihre Konkurrenten bekommen die Aufträge.',
    exampleQueries: [
      'Empfiehl mir einen guten Elektriker in Zürich',
      'Sanitär-Installateur für Badsanierung',
      'Maler für Wohnungsrenovation',
      'Schreiner für Einbauschränke',
      'Zuverlässiger Handwerker in meiner Nähe'
    ]
  },

  Gartenbau: {
    industry: 'Gartenbau',
    industryDE: 'Garten- und Landschaftsbau',
    recommendDE: 'einen guten Gärtner',
    avgScore: 30,
    medianScore: 22,
    topPerformers: [
      { name: 'Gartenbau Schneider', score: 58, tier: 'follower', city: 'Zürich' },
      { name: 'Maurus Candrian AG', score: 52, tier: 'follower', city: 'Zürich' },
    ],
    distribution: { excellent: 0, good: 5, fair: 15, poor: 35, invisible: 45 },
    insight: 'Gartenbau ist lokal geprägt und hat sehr niedrige KI-Sichtbarkeit. Grosse Aufholmöglichkeiten.',
    coldEmailHook: 'Hausbesitzer planen Gartenprojekte per KI - aber die meisten Gärtner sind unsichtbar. Wer jetzt optimiert, gewinnt.',
    exampleQueries: [
      'Empfiehl mir einen Gärtner in Zürich',
      'Landschaftsgärtner für Gartengestaltung',
      'Pool-Bau Firma Schweiz',
      'Baumschnitt und Gartenpflege',
      'Wer legt Rasen professionell an?'
    ]
  },

  // ===== AUTOMOTIVE =====
  Auto: {
    industry: 'Auto',
    industryDE: 'Autogaragen & Händler',
    recommendDE: 'eine gute Autogarage',
    avgScore: 39,
    medianScore: 34,
    topPerformers: [
      { name: 'AMAG Automobil', score: 72, tier: 'challenger', city: 'Zürich' },
      { name: 'Emil Frey AG', score: 68, tier: 'challenger', city: 'Zürich' },
      { name: 'Auto AG St. Gallen', score: 55, tier: 'follower', city: 'St. Gallen' },
    ],
    distribution: { excellent: 0, good: 20, fair: 0, poor: 40, invisible: 40 },
    insight: 'Even major dealers like AMAG and Emil Frey have low AI visibility. Local garages are completely invisible.',
    coldEmailHook: 'Autokäufer recherchieren per KI. AMAG und Emil Frey erscheinen - aber 80% der Garagen sind unsichtbar.',
    exampleQueries: [
      'Empfiehl mir eine gute Autogarage in Zürich',
      'Bester BMW-Händler in der Schweiz',
      'Gebrauchtwagen-Händler mit Garantie',
      'Autogarage für Service und Reparatur',
      'Wo kann ich ein Elektroauto kaufen?'
    ]
  },

  Autoservice: {
    industry: 'Autoservice',
    industryDE: 'Autowerkstätten & Service',
    recommendDE: 'eine gute Autowerkstatt',
    avgScore: 32,
    medianScore: 25,
    topPerformers: [
      { name: 'Carglass', score: 68, tier: 'challenger', city: 'Zürich' },
      { name: 'First Stop', score: 55, tier: 'follower', city: 'Bern' },
      { name: 'A.T.U', score: 48, tier: 'follower', city: 'Zürich' },
    ],
    distribution: { excellent: 0, good: 10, fair: 20, poor: 35, invisible: 35 },
    insight: 'Freie Werkstätten sind kaum sichtbar. Nur Ketten wie Carglass erscheinen regelmässig.',
    coldEmailHook: 'Autofahrer fragen KI nach Werkstatt-Empfehlungen. Carglass dominiert - ist Ihre Werkstatt auch sichtbar?',
    exampleQueries: [
      'Empfiehl mir eine gute Autowerkstatt in Zürich',
      'Günstige Reifenwechsel in meiner Nähe',
      'Werkstatt für Ölwechsel und Service',
      'Karosserie-Reparatur nach Unfall',
      'Welche Werkstatt macht HU-Prüfungen?'
    ]
  },

  // ===== PROFESSIONAL SERVICES =====
  IT: {
    industry: 'IT',
    industryDE: 'IT-Dienstleister & Software',
    recommendDE: 'eine gute IT-Firma',
    avgScore: 43,
    medianScore: 34,
    topPerformers: [
      { name: 'Swisscom', score: 91, tier: 'leader', city: 'Bern' },
      { name: 'Zühlke', score: 72, tier: 'challenger', city: 'Schlieren' },
      { name: 'Netcetera', score: 65, tier: 'challenger', city: 'Zürich' },
      { name: 'AdNovum', score: 55, tier: 'follower', city: 'Zürich' },
    ],
    distribution: { excellent: 20, good: 0, fair: 0, poor: 40, invisible: 40 },
    insight: 'Only Swisscom appears consistently in IT recommendations. Even Google and Logitech have low local visibility.',
    coldEmailHook: 'Unternehmen suchen IT-Partner per KI. Swisscom dominiert - aber 80% der IT-Firmen sind unsichtbar.',
    exampleQueries: [
      'Empfiehl mir eine gute IT-Firma in Zürich',
      'Software-Entwickler für App-Projekt',
      'IT-Support für KMU',
      'Cloud-Migration Spezialist Schweiz',
      'Cybersecurity-Firma für Unternehmen'
    ]
  },

  Webdesign: {
    industry: 'Webdesign',
    industryDE: 'Webdesign & Digitalagentur',
    recommendDE: 'eine gute Webagentur',
    avgScore: 38,
    medianScore: 30,
    topPerformers: [
      { name: 'Unic', score: 72, tier: 'challenger', city: 'Zürich' },
      { name: 'Liip', score: 68, tier: 'challenger', city: 'Zürich' },
      { name: 'Namics', score: 62, tier: 'challenger', city: 'Zürich' },
    ],
    distribution: { excellent: 0, good: 20, fair: 20, poor: 30, invisible: 30 },
    insight: 'Grosse Digitalagenturen haben bessere Sichtbarkeit. Kleinere Webdesign-Studios sind oft unsichtbar.',
    coldEmailHook: 'Unternehmen suchen per KI nach Webdesignern. Die grossen Agenturen dominieren - kennt ChatGPT auch Sie?',
    exampleQueries: [
      'Empfiehl mir eine Webagentur in Zürich',
      'Webdesign-Firma für Online-Shop',
      'WordPress-Entwickler Schweiz',
      'UX-Design Agentur Empfehlung',
      'Wer macht responsive Websites?'
    ]
  },

  Marketing: {
    industry: 'Marketing',
    industryDE: 'Marketing & Werbung',
    recommendDE: 'eine gute Marketingagentur',
    avgScore: 40,
    medianScore: 32,
    topPerformers: [
      { name: 'Publicis Zürich', score: 75, tier: 'leader', city: 'Zürich' },
      { name: 'Jung von Matt', score: 72, tier: 'challenger', city: 'Zürich' },
      { name: 'TBWA Zürich', score: 65, tier: 'challenger', city: 'Zürich' },
    ],
    distribution: { excellent: 5, good: 20, fair: 20, poor: 30, invisible: 25 },
    insight: 'Internationale Agenturnetzwerke dominieren KI-Empfehlungen. Lokale Agenturen kämpfen um Sichtbarkeit.',
    coldEmailHook: 'Unternehmen fragen KI nach Marketingagenturen. Publicis und Jung von Matt erscheinen immer - wo steht Ihre Agentur?',
    exampleQueries: [
      'Empfiehl mir eine Marketingagentur in Zürich',
      'Social-Media-Agentur für KMU',
      'Branding-Agentur Schweiz',
      'SEO-Agentur Empfehlung',
      'Werbeagentur für Startup'
    ]
  },

  Beratung: {
    industry: 'Beratung',
    industryDE: 'Unternehmensberatung',
    recommendDE: 'eine gute Beratungsfirma',
    avgScore: 55,
    medianScore: 48,
    topPerformers: [
      { name: 'McKinsey & Company', score: 88, tier: 'leader', city: 'Zürich' },
      { name: 'Boston Consulting Group', score: 85, tier: 'leader', city: 'Zürich' },
      { name: 'Bain & Company', score: 82, tier: 'leader', city: 'Zürich' },
      { name: 'Roland Berger', score: 68, tier: 'challenger', city: 'Zürich' },
    ],
    distribution: { excellent: 25, good: 25, fair: 15, poor: 20, invisible: 15 },
    insight: 'Top-Beratungen dominieren KI-Empfehlungen. Boutique-Beratungen sind unterrepräsentiert.',
    coldEmailHook: 'Unternehmen suchen per KI nach Beratern. McKinsey und BCG erscheinen immer - ist Ihre Beratung auch sichtbar?',
    exampleQueries: [
      'Empfiehl mir eine Beratungsfirma für Digitalisierung',
      'Strategieberatung für KMU',
      'Change-Management Berater Schweiz',
      'HR-Beratung für Unternehmen',
      'Prozessoptimierung Experten'
    ]
  },

  Personalvermittlung: {
    industry: 'Personalvermittlung',
    industryDE: 'Personalvermittlung & Recruiting',
    recommendDE: 'eine gute Personalvermittlung',
    avgScore: 42,
    medianScore: 35,
    topPerformers: [
      { name: 'Adecco', score: 78, tier: 'leader', city: 'Zürich' },
      { name: 'Randstad', score: 72, tier: 'challenger', city: 'Zürich' },
      { name: 'Manpower', score: 68, tier: 'challenger', city: 'Zürich' },
      { name: 'Hays', score: 55, tier: 'follower', city: 'Zürich' },
    ],
    distribution: { excellent: 10, good: 20, fair: 20, poor: 30, invisible: 20 },
    insight: 'Grosse Personaldienstleister dominieren. Spezialisierte Headhunter sind oft unsichtbar.',
    coldEmailHook: 'Unternehmen suchen per KI nach Personalvermittlern. Adecco dominiert - aber viele Spezialisten sind unsichtbar.',
    exampleQueries: [
      'Empfiehl mir eine Personalvermittlung in Zürich',
      'Headhunter für IT-Fachkräfte',
      'Temporärbüro für kaufmännische Jobs',
      'Executive Search Schweiz',
      'Recruiting-Agentur für Startups'
    ]
  },

  Übersetzung: {
    industry: 'Übersetzung',
    industryDE: 'Übersetzung & Sprachdienste',
    recommendDE: 'ein gutes Übersetzungsbüro',
    avgScore: 35,
    medianScore: 28,
    topPerformers: [
      { name: 'Apostroph Group', score: 72, tier: 'challenger', city: 'Luzern' },
      { name: 'CLS Communication', score: 65, tier: 'challenger', city: 'Basel' },
      { name: 'Supertext', score: 58, tier: 'follower', city: 'Zürich' },
    ],
    distribution: { excellent: 0, good: 15, fair: 20, poor: 35, invisible: 30 },
    insight: 'Grosse Übersetzungsbüros haben bessere Sichtbarkeit. Freelancer und kleine Büros sind unsichtbar.',
    coldEmailHook: 'Unternehmen suchen per KI nach Übersetzern. Die meisten Anbieter sind unsichtbar - eine Chance für frühe Optimierer.',
    exampleQueries: [
      'Empfiehl mir ein Übersetzungsbüro in Zürich',
      'Beglaubigte Übersetzung Schweiz',
      'Technische Übersetzung Deutsch-Englisch',
      'Dolmetscher für Geschäftstreffen',
      'Medizinische Übersetzung Spezialist'
    ]
  },

  // ===== RETAIL & SPECIALTY =====
  Uhrmacher: {
    industry: 'Uhrmacher',
    industryDE: 'Uhrmacher & Juweliere',
    recommendDE: 'einen guten Uhrmacher',
    avgScore: 48,
    medianScore: 42,
    topPerformers: [
      { name: 'Bucherer', score: 85, tier: 'leader', city: 'Luzern' },
      { name: 'Gübelin', score: 82, tier: 'leader', city: 'Luzern' },
      { name: 'Beyer Chronometrie', score: 78, tier: 'leader', city: 'Zürich' },
      { name: 'Les Ambassadeurs', score: 68, tier: 'challenger', city: 'Zürich' },
    ],
    distribution: { excellent: 20, good: 25, fair: 15, poor: 20, invisible: 20 },
    insight: 'Grosse Uhrenhändler dominieren. Kleine Uhrmacher für Reparaturen sind oft unsichtbar.',
    coldEmailHook: 'Uhrenliebhaber fragen KI nach Empfehlungen. Bucherer und Gübelin dominieren - kennt ChatGPT auch Sie?',
    exampleQueries: [
      'Empfiehl mir einen guten Uhrmacher in Zürich',
      'Wo kann ich eine Rolex kaufen?',
      'Uhrenreparatur und Service Schweiz',
      'Vintage-Uhren Händler',
      'Juwelier für Verlobungsringe'
    ]
  },

  Blumen: {
    industry: 'Blumen',
    industryDE: 'Blumengeschäfte & Floristik',
    recommendDE: 'einen guten Floristen',
    avgScore: 32,
    medianScore: 25,
    topPerformers: [
      { name: 'Fleurop', score: 72, tier: 'challenger', city: 'Zürich' },
      { name: 'Blumen Vögeli', score: 55, tier: 'follower', city: 'Zürich' },
    ],
    distribution: { excellent: 0, good: 10, fair: 15, poor: 35, invisible: 40 },
    insight: 'Lieferdienste wie Fleurop dominieren. Lokale Blumengeschäfte sind meist unsichtbar.',
    coldEmailHook: 'Kunden bestellen Blumen per KI. Fleurop erscheint immer - aber kennt ChatGPT auch Ihr Geschäft?',
    exampleQueries: [
      'Empfiehl mir einen Floristen in Zürich',
      'Blumenlieferung für morgen',
      'Hochzeitsflorist Empfehlung',
      'Wo bekomme ich schöne Trauerkränze?',
      'Blumenabo für Büro'
    ]
  },

  Coiffeur: {
    industry: 'Coiffeur',
    industryDE: 'Coiffeur & Haarsalons',
    recommendDE: 'einen guten Coiffeur',
    avgScore: 35,
    medianScore: 28,
    topPerformers: [
      { name: 'Toni & Guy', score: 68, tier: 'challenger', city: 'Zürich' },
      { name: 'Ginger & Fred', score: 58, tier: 'follower', city: 'Zürich' },
      { name: 'Coiffure Vidal', score: 48, tier: 'follower', city: 'Genf' },
    ],
    distribution: { excellent: 0, good: 15, fair: 20, poor: 30, invisible: 35 },
    insight: 'Nur bekannte Ketten haben KI-Sichtbarkeit. Lokale Salons sind grösstenteils unsichtbar.',
    coldEmailHook: 'Kunden suchen per KI nach Coiffeuren. Toni & Guy dominiert - erscheint Ihr Salon auch in den Empfehlungen?',
    exampleQueries: [
      'Empfiehl mir einen guten Coiffeur in Zürich',
      'Bester Friseur für Herrenschnitte',
      'Salon für Balayage und Highlights',
      'Barbershop in meiner Nähe',
      'Coiffeur für Hochzeitsfrisuren'
    ]
  },

  Fitness: {
    industry: 'Fitness',
    industryDE: 'Fitnessstudios & Sport',
    recommendDE: 'ein gutes Fitnessstudio',
    avgScore: 42,
    medianScore: 35,
    topPerformers: [
      { name: 'Migros Fitnesspark', score: 75, tier: 'leader', city: 'Zürich' },
      { name: 'Holmes Place', score: 72, tier: 'challenger', city: 'Zürich' },
      { name: 'Kieser Training', score: 68, tier: 'challenger', city: 'Zürich' },
      { name: 'Update Fitness', score: 55, tier: 'follower', city: 'Zürich' },
    ],
    distribution: { excellent: 5, good: 25, fair: 20, poor: 30, invisible: 20 },
    insight: 'Grosse Fitnessketten dominieren KI-Empfehlungen. Boutique-Studios sind unterrepräsentiert.',
    coldEmailHook: 'Sportbegeisterte suchen per KI nach Fitnessstudios. Migros Fitnesspark erscheint immer - wo steht Ihr Studio?',
    exampleQueries: [
      'Empfiehl mir ein gutes Fitnessstudio in Zürich',
      'Crossfit-Box in meiner Nähe',
      'Yoga-Studio Empfehlung',
      'Fitnessstudio mit Pool und Sauna',
      'Personal Training Schweiz'
    ]
  },

  Tierarzt: {
    industry: 'Tierarzt',
    industryDE: 'Tierärzte & Tierkliniken',
    recommendDE: 'einen guten Tierarzt',
    avgScore: 38,
    medianScore: 30,
    topPerformers: [
      { name: 'Tierspital Zürich', score: 82, tier: 'leader', city: 'Zürich' },
      { name: 'Tierklinik Obergrund', score: 65, tier: 'challenger', city: 'Luzern' },
      { name: 'Kleintierpraxis Dr. Müller', score: 48, tier: 'follower', city: 'Bern' },
    ],
    distribution: { excellent: 10, good: 15, fair: 20, poor: 30, invisible: 25 },
    insight: 'Grosse Tierkliniken haben bessere KI-Sichtbarkeit. Einzelpraxen sind oft unsichtbar.',
    coldEmailHook: 'Tierbesitzer suchen per KI nach Tierärzten. Das Tierspital Zürich dominiert - ist Ihre Praxis auch sichtbar?',
    exampleQueries: [
      'Empfiehl mir einen guten Tierarzt in Zürich',
      'Tierklinik mit Notfalldienst',
      'Tierarzt für Katzen',
      'Hundezahnarzt Schweiz',
      'Tierarzt für exotische Tiere'
    ]
  },

  Reinigung: {
    industry: 'Reinigung',
    industryDE: 'Reinigungsunternehmen',
    recommendDE: 'eine gute Reinigungsfirma',
    avgScore: 30,
    medianScore: 22,
    topPerformers: [
      { name: 'ISS Facility Services', score: 68, tier: 'challenger', city: 'Zürich' },
      { name: 'Vebego', score: 58, tier: 'follower', city: 'Zürich' },
      { name: 'Schiess AG', score: 48, tier: 'follower', city: 'Zürich' },
    ],
    distribution: { excellent: 0, good: 10, fair: 15, poor: 35, invisible: 40 },
    insight: 'Grosse Facility-Management-Firmen dominieren. Lokale Reinigungsfirmen sind meist unsichtbar.',
    coldEmailHook: 'Unternehmen suchen per KI nach Reinigungsfirmen. Die meisten Anbieter sind unsichtbar - eine grosse Chance.',
    exampleQueries: [
      'Empfiehl mir eine Reinigungsfirma in Zürich',
      'Büroreinigung für KMU',
      'Wohnungsreinigung bei Auszug',
      'Fensterreinigung Firma',
      'Teppichreinigung professionell'
    ]
  },

  Umzug: {
    industry: 'Umzug',
    industryDE: 'Umzugsunternehmen',
    recommendDE: 'eine gute Umzugsfirma',
    avgScore: 32,
    medianScore: 25,
    topPerformers: [
      { name: 'Welti-Furrer', score: 72, tier: 'challenger', city: 'Zürich' },
      { name: 'Gondrand', score: 65, tier: 'challenger', city: 'Basel' },
      { name: 'Harder Logistik', score: 52, tier: 'follower', city: 'Bern' },
    ],
    distribution: { excellent: 0, good: 15, fair: 15, poor: 35, invisible: 35 },
    insight: 'Etablierte Umzugsfirmen haben bessere Sichtbarkeit. Kleinere Anbieter sind oft unsichtbar.',
    coldEmailHook: 'Menschen planen Umzüge per KI. Welti-Furrer erscheint immer - kennt ChatGPT auch Ihre Firma?',
    exampleQueries: [
      'Empfiehl mir eine Umzugsfirma in Zürich',
      'Umzug mit Klaviertransport',
      'Internationale Umzüge Schweiz',
      'Günstige Umzugsfirma',
      'Umzug mit Einlagerung'
    ]
  },

  Fotograf: {
    industry: 'Fotograf',
    industryDE: 'Fotografen & Studios',
    recommendDE: 'einen guten Fotografen',
    avgScore: 35,
    medianScore: 28,
    topPerformers: [
      { name: 'Photo Müller', score: 62, tier: 'challenger', city: 'Zürich' },
      { name: 'Studio West', score: 55, tier: 'follower', city: 'Zürich' },
    ],
    distribution: { excellent: 0, good: 15, fair: 20, poor: 35, invisible: 30 },
    insight: 'Fotografen haben generell niedrige KI-Sichtbarkeit. Ein grosses Potenzial für frühe Optimierer.',
    coldEmailHook: 'Kunden suchen per KI nach Fotografen für Hochzeiten und Events. Die meisten Studios sind unsichtbar.',
    exampleQueries: [
      'Empfiehl mir einen Fotografen für Hochzeit in Zürich',
      'Business-Fotograf für Portraits',
      'Produktfotografie Schweiz',
      'Babyfotograf in meiner Nähe',
      'Eventfotograf für Firmenfeiern'
    ]
  },

  // ===== EDUCATION =====
  Sprachschule: {
    industry: 'Sprachschule',
    industryDE: 'Sprachschulen & Kurse',
    recommendDE: 'eine gute Sprachschule',
    avgScore: 42,
    medianScore: 35,
    topPerformers: [
      { name: 'Berlitz', score: 75, tier: 'leader', city: 'Zürich' },
      { name: 'Migros Klubschule', score: 72, tier: 'challenger', city: 'Zürich' },
      { name: 'inlingua', score: 65, tier: 'challenger', city: 'Bern' },
      { name: 'LSI Zürich', score: 55, tier: 'follower', city: 'Zürich' },
    ],
    distribution: { excellent: 5, good: 25, fair: 20, poor: 30, invisible: 20 },
    insight: 'Bekannte Sprachschulen haben gute KI-Sichtbarkeit. Kleinere Schulen sind unterrepräsentiert.',
    coldEmailHook: 'Sprachlernende fragen KI nach Schulempfehlungen. Berlitz und Migros dominieren - ist Ihre Schule auch sichtbar?',
    exampleQueries: [
      'Empfiehl mir eine Sprachschule für Deutsch in Zürich',
      'Intensivkurs Englisch Schweiz',
      'Business-Französisch Kurse',
      'Sprachschule für Chinesisch',
      'Deutsch lernen für Expats'
    ]
  },

  Fahrschule: {
    industry: 'Fahrschule',
    industryDE: 'Fahrschulen & Fahrunterricht',
    recommendDE: 'eine gute Fahrschule',
    avgScore: 32,
    medianScore: 25,
    topPerformers: [
      { name: 'Verkehrsschule Zürich', score: 62, tier: 'challenger', city: 'Zürich' },
      { name: 'Fahrschule Bern', score: 52, tier: 'follower', city: 'Bern' },
    ],
    distribution: { excellent: 0, good: 10, fair: 20, poor: 35, invisible: 35 },
    insight: 'Fahrschulen haben niedrige KI-Sichtbarkeit. Ein lokales Geschäft mit grossem Optimierungspotenzial.',
    coldEmailHook: 'Fahrschüler suchen per KI nach Empfehlungen. Die meisten Fahrschulen sind unsichtbar - wer optimiert, gewinnt.',
    exampleQueries: [
      'Empfiehl mir eine gute Fahrschule in Zürich',
      'Motorrad-Fahrschule Schweiz',
      'Intensivkurs Autoprüfung',
      'Fahrlehrer für Angstfahrer',
      'Günstige Fahrstunden'
    ]
  },

  Nachhilfe: {
    industry: 'Nachhilfe',
    industryDE: 'Nachhilfe & Lerncoaching',
    recommendDE: 'einen guten Nachhilfelehrer',
    avgScore: 30,
    medianScore: 22,
    topPerformers: [
      { name: 'Lern-Forum', score: 62, tier: 'challenger', city: 'Zürich' },
      { name: 'Nachhilfe Akademie', score: 52, tier: 'follower', city: 'Bern' },
    ],
    distribution: { excellent: 0, good: 10, fair: 15, poor: 35, invisible: 40 },
    insight: 'Nachhilfe ist ein fragmentierter Markt mit sehr niedriger KI-Sichtbarkeit.',
    coldEmailHook: 'Eltern suchen per KI nach Nachhilfe für ihre Kinder. Die meisten Anbieter sind unsichtbar.',
    exampleQueries: [
      'Empfiehl mir Nachhilfe für Mathematik in Zürich',
      'Nachhilfe für Gymnasium Vorbereitung',
      'Online-Nachhilfe Schweiz',
      'Deutsch-Nachhilfe für Fremdsprachige',
      'Lerncoach für Prüfungsangst'
    ]
  },

  // ===== EVENTS & ENTERTAINMENT =====
  Event: {
    industry: 'Event',
    industryDE: 'Eventplanung & Organisation',
    recommendDE: 'eine gute Eventagentur',
    avgScore: 38,
    medianScore: 30,
    topPerformers: [
      { name: 'Rufener Events', score: 72, tier: 'challenger', city: 'Zürich' },
      { name: 'Habegger AG', score: 65, tier: 'challenger', city: 'Regensdorf' },
      { name: 'MICE by Kuoni', score: 58, tier: 'follower', city: 'Zürich' },
    ],
    distribution: { excellent: 0, good: 20, fair: 20, poor: 30, invisible: 30 },
    insight: 'Grosse Eventagenturen haben bessere Sichtbarkeit. Spezialisierte Planer sind oft unsichtbar.',
    coldEmailHook: 'Unternehmen planen Events per KI. Rufener und Habegger erscheinen - ist Ihre Agentur auch sichtbar?',
    exampleQueries: [
      'Empfiehl mir eine Eventagentur in Zürich',
      'Hochzeitsplaner Schweiz',
      'Firmenevents Organisation',
      'Konferenz-Management Agentur',
      'Teambuilding-Events planen'
    ]
  },

  DJ: {
    industry: 'DJ',
    industryDE: 'DJs & Musik-Entertainment',
    recommendDE: 'einen guten DJ',
    avgScore: 28,
    medianScore: 20,
    topPerformers: [
      { name: 'DJ Toni', score: 55, tier: 'follower', city: 'Zürich' },
      { name: 'Hochzeits-DJ Marco', score: 48, tier: 'follower', city: 'Bern' },
    ],
    distribution: { excellent: 0, good: 5, fair: 15, poor: 35, invisible: 45 },
    insight: 'DJs haben die niedrigste KI-Sichtbarkeit. Ein völlig unerschlossener Markt.',
    coldEmailHook: 'Party-Planer suchen per KI nach DJs. 80% sind komplett unsichtbar - wer jetzt optimiert, hat einen Riesenvorteil.',
    exampleQueries: [
      'Empfiehl mir einen DJ für Hochzeit in Zürich',
      'DJ für Firmenfeier',
      'House-DJ für Club-Event',
      'DJ für 80er-Party',
      'Mobiler DJ mit Anlage'
    ]
  },
}

/**
 * City-specific adjustments
 */
export const CITY_MODIFIERS: Record<string, number> = {
  'Zürich': 1.15,
  'Genf': 1.10,
  'Basel': 1.05,
  'Lausanne': 1.00,
  'Bern': 1.00,
  'Winterthur': 0.95,
  'Luzern': 0.95,
  'St. Gallen': 0.90,
  'Lugano': 0.95,
  'Biel': 0.85,
  'Thun': 0.85,
  'Köniz': 0.80,
  'Fribourg': 0.85,
  'Schaffhausen': 0.85,
  'Chur': 0.85,
  'Neuchâtel': 0.85,
  'Zug': 1.10,
  'Montreux': 0.90,
  'Davos': 0.90,
  'Zermatt': 0.95,
  'Interlaken': 0.90,
  'default': 0.85
}

/**
 * Get benchmark data for a specific industry
 */
export function getIndustryBenchmark(industry: string): IndustryBenchmark | null {
  // Normalize industry name
  const normalizedIndustry = Object.keys(INDUSTRY_BENCHMARKS).find(
    key => key.toLowerCase() === industry.toLowerCase() ||
           INDUSTRY_BENCHMARKS[key].industryDE.toLowerCase().includes(industry.toLowerCase())
  )

  if (normalizedIndustry) {
    return INDUSTRY_BENCHMARKS[normalizedIndustry]
  }

  return null
}

/**
 * Get all industries as array for dropdowns
 */
export function getAllIndustries(): { key: string; label: string; labelDE: string }[] {
  return Object.entries(INDUSTRY_BENCHMARKS).map(([key, benchmark]) => ({
    key,
    label: benchmark.industry,
    labelDE: benchmark.industryDE
  }))
}

/**
 * Get city data by name
 */
export function getCityData(city: string): CityData | null {
  return SWISS_CITIES.find(c => c.city.toLowerCase() === city.toLowerCase()) || null
}

/**
 * Calculate percentile ranking for a given score within an industry
 */
export function calculatePercentile(score: number, industry: string): number {
  const benchmark = getIndustryBenchmark(industry)
  if (!benchmark) return 50 // Default to middle

  const { distribution } = benchmark

  // Estimate percentile based on score brackets
  if (score >= 80) {
    // Top tier - better than everyone except other excellents
    return 100 - (distribution.excellent / 2)
  } else if (score >= 60) {
    // Good tier
    return 100 - distribution.excellent - (distribution.good / 2)
  } else if (score >= 40) {
    // Fair tier
    return 100 - distribution.excellent - distribution.good - (distribution.fair / 2)
  } else if (score >= 20) {
    // Poor tier
    return 100 - distribution.excellent - distribution.good - distribution.fair - (distribution.poor / 2)
  } else {
    // Invisible tier
    return distribution.invisible / 2
  }
}

/**
 * Get competitive position message
 */
export function getCompetitivePosition(score: number, industry: string): {
  percentile: number
  position: string
  message: string
  urgency: 'critical' | 'warning' | 'moderate' | 'good'
} {
  const percentile = calculatePercentile(score, industry)
  const benchmark = getIndustryBenchmark(industry)

  if (percentile >= 80) {
    return {
      percentile,
      position: 'Leader',
      message: 'You\'re in the top 20% of your industry for AI visibility.',
      urgency: 'good'
    }
  } else if (percentile >= 60) {
    return {
      percentile,
      position: 'Challenger',
      message: 'You\'re above average, but top competitors still outrank you.',
      urgency: 'moderate'
    }
  } else if (percentile >= 40) {
    return {
      percentile,
      position: 'Follower',
      message: 'You\'re below the industry average. Competitors are getting your potential clients.',
      urgency: 'warning'
    }
  } else {
    const topScore = benchmark?.topPerformers[0]?.score || 80
    return {
      percentile,
      position: 'Invisible',
      message: `You\'re in the bottom ${Math.round(100 - percentile)}%. Top competitors score ${topScore - score} points higher.`,
      urgency: 'critical'
    }
  }
}

/**
 * Generate cold email hook for a specific industry and city
 */
export function getColdEmailHook(industry: string, city: string): string {
  const benchmark = getIndustryBenchmark(industry)
  if (!benchmark) return ''

  // Replace [Stadt] placeholder with actual city
  return benchmark.coldEmailHook.replace('[Stadt]', city)
}

/**
 * Get example queries for an industry
 */
export function getExampleQueries(industry: string, city?: string): string[] {
  const benchmark = getIndustryBenchmark(industry)
  if (!benchmark) return []

  if (city) {
    // Replace generic city references with specific city
    return benchmark.exampleQueries.map(q =>
      q.replace(/in Zürich|in der Schweiz|in meiner Nähe/g, `in ${city}`)
    )
  }

  return benchmark.exampleQueries
}

/**
 * Overall statistics across all industries
 */
export const OVERALL_STATS = {
  totalBusinessesTested: 187,
  totalIndustries: Object.keys(INDUSTRY_BENCHMARKS).length,
  avgScore: 40,
  medianScore: 32,
  percentBelow40: 58,
  percentInvisible: 32,
  lastUpdated: '2026-01-08'
}
