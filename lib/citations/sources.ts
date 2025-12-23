/**
 * Citation Sources for Swiss and Global Businesses
 * Organized by category and priority
 */

export type SourceCategory =
  | 'MAJOR_PLATFORM'
  | 'NATIONAL_DIRECTORY'
  | 'INDUSTRY_SPECIFIC'
  | 'REVIEW_PLATFORM'
  | 'SOCIAL_PLATFORM'
  | 'DATA_AGGREGATOR'

export interface CitationSource {
  slug: string
  name: string
  url: string
  category: SourceCategory
  country: string
  priority: number
  industries?: string[]
  hasApi: boolean
  submissionUrl?: string
  submissionGuide: string
  napFields: {
    name: boolean
    address: boolean
    phone: boolean
    website: boolean
    hours: boolean
  }
  estimatedSubmissionTime: string // e.g., "5 minutes", "1-2 days"
  verificationMethod?: 'phone' | 'email' | 'postcard' | 'none'
}

/**
 * Major platforms - essential for any business
 */
export const MAJOR_PLATFORMS: CitationSource[] = [
  {
    slug: 'google_business',
    name: 'Google Business Profile',
    url: 'https://business.google.com',
    category: 'MAJOR_PLATFORM',
    country: 'CH',
    priority: 1,
    hasApi: true,
    submissionUrl: 'https://business.google.com/create',
    submissionGuide: 'Create or claim your Google Business Profile to appear in Google Search and Maps. This is the most important citation for AI visibility.',
    napFields: { name: true, address: true, phone: true, website: true, hours: true },
    estimatedSubmissionTime: '5 minutes',
    verificationMethod: 'phone',
  },
  {
    slug: 'apple_maps',
    name: 'Apple Business Connect',
    url: 'https://businessconnect.apple.com',
    category: 'MAJOR_PLATFORM',
    country: 'CH',
    priority: 2,
    hasApi: true,
    submissionUrl: 'https://businessconnect.apple.com',
    submissionGuide: 'Register with Apple Business Connect to manage your presence in Apple Maps and Siri.',
    napFields: { name: true, address: true, phone: true, website: true, hours: true },
    estimatedSubmissionTime: '10 minutes',
    verificationMethod: 'email',
  },
  {
    slug: 'bing_places',
    name: 'Bing Places',
    url: 'https://www.bingplaces.com',
    category: 'MAJOR_PLATFORM',
    country: 'CH',
    priority: 3,
    hasApi: true,
    submissionUrl: 'https://www.bingplaces.com',
    submissionGuide: 'Claim your business on Bing Places. You can import from Google Business Profile.',
    napFields: { name: true, address: true, phone: true, website: true, hours: true },
    estimatedSubmissionTime: '5 minutes',
    verificationMethod: 'phone',
  },
]

/**
 * Swiss national directories
 */
export const SWISS_DIRECTORIES: CitationSource[] = [
  {
    slug: 'local_ch',
    name: 'local.ch',
    url: 'https://www.local.ch',
    category: 'NATIONAL_DIRECTORY',
    country: 'CH',
    priority: 1,
    hasApi: false,
    submissionUrl: 'https://www.local.ch/de/eintrag',
    submissionGuide: 'local.ch is Switzerland\'s largest business directory, used by millions. Basic listings are free.',
    napFields: { name: true, address: true, phone: true, website: true, hours: true },
    estimatedSubmissionTime: '10 minutes',
    verificationMethod: 'email',
  },
  {
    slug: 'search_ch',
    name: 'search.ch',
    url: 'https://www.search.ch',
    category: 'NATIONAL_DIRECTORY',
    country: 'CH',
    priority: 2,
    hasApi: false,
    submissionUrl: 'https://www.search.ch/eintrag',
    submissionGuide: 'search.ch is another major Swiss directory. Often synced with local.ch.',
    napFields: { name: true, address: true, phone: true, website: true, hours: false },
    estimatedSubmissionTime: '10 minutes',
    verificationMethod: 'email',
  },
  {
    slug: 'directories_ch',
    name: 'directories.ch (Swisscom)',
    url: 'https://www.directories.ch',
    category: 'NATIONAL_DIRECTORY',
    country: 'CH',
    priority: 3,
    hasApi: false,
    submissionUrl: 'https://www.directories.ch/eintrag',
    submissionGuide: 'The official Swiss phone directory operated by Swisscom. Many entries are auto-synced from telecom providers.',
    napFields: { name: true, address: true, phone: true, website: false, hours: false },
    estimatedSubmissionTime: '1-2 days',
    verificationMethod: 'postcard',
  },
  {
    slug: 'zefix',
    name: 'Zefix (Swiss Commercial Registry)',
    url: 'https://www.zefix.ch',
    category: 'NATIONAL_DIRECTORY',
    country: 'CH',
    priority: 1,
    hasApi: true,
    submissionGuide: 'Zefix is the official Swiss commercial registry. Entries are automatic for registered companies.',
    napFields: { name: true, address: true, phone: false, website: false, hours: false },
    estimatedSubmissionTime: 'Automatic',
    verificationMethod: 'none',
  },
]

/**
 * Industry-specific directories
 */
export const INDUSTRY_DIRECTORIES: CitationSource[] = [
  // Treuhand / Accounting
  {
    slug: 'treuhand_suisse',
    name: 'Treuhand Suisse',
    url: 'https://www.treuhandsuisse.ch',
    category: 'INDUSTRY_SPECIFIC',
    country: 'CH',
    priority: 1,
    industries: ['treuhand', 'accounting'],
    hasApi: false,
    submissionGuide: 'Join Treuhand Suisse to be listed in their member directory. Requires membership.',
    napFields: { name: true, address: true, phone: true, website: true, hours: false },
    estimatedSubmissionTime: 'Membership required',
    verificationMethod: 'email',
  },
  {
    slug: 'expertsuisse',
    name: 'EXPERTsuisse',
    url: 'https://www.expertsuisse.ch',
    category: 'INDUSTRY_SPECIFIC',
    country: 'CH',
    priority: 2,
    industries: ['treuhand', 'accounting', 'audit'],
    hasApi: false,
    submissionGuide: 'EXPERTsuisse is the association of audit, tax, and fiduciary experts. Requires professional certification.',
    napFields: { name: true, address: true, phone: true, website: true, hours: false },
    estimatedSubmissionTime: 'Membership required',
    verificationMethod: 'email',
  },
  // Legal
  {
    slug: 'sav_fsa',
    name: 'Swiss Bar Association (SAV-FSA)',
    url: 'https://www.sav-fsa.ch',
    category: 'INDUSTRY_SPECIFIC',
    country: 'CH',
    priority: 1,
    industries: ['legal', 'lawyer'],
    hasApi: false,
    submissionGuide: 'Register with the Swiss Bar Association for lawyer directory listing.',
    napFields: { name: true, address: true, phone: true, website: true, hours: false },
    estimatedSubmissionTime: 'Membership required',
    verificationMethod: 'email',
  },
  // Real Estate
  {
    slug: 'svit',
    name: 'SVIT (Swiss Real Estate Association)',
    url: 'https://www.svit.ch',
    category: 'INDUSTRY_SPECIFIC',
    country: 'CH',
    priority: 1,
    industries: ['real_estate', 'immobilien'],
    hasApi: false,
    submissionGuide: 'Join SVIT for listing in the Swiss real estate professionals directory.',
    napFields: { name: true, address: true, phone: true, website: true, hours: false },
    estimatedSubmissionTime: 'Membership required',
    verificationMethod: 'email',
  },
  // Healthcare
  {
    slug: 'doctorfmh',
    name: 'doctorfmh.ch',
    url: 'https://www.doctorfmh.ch',
    category: 'INDUSTRY_SPECIFIC',
    country: 'CH',
    priority: 1,
    industries: ['healthcare', 'medical', 'doctor'],
    hasApi: false,
    submissionUrl: 'https://www.doctorfmh.ch/de/arzt-eintragen',
    submissionGuide: 'Register as a doctor on doctorfmh.ch, the official FMH physician directory.',
    napFields: { name: true, address: true, phone: true, website: true, hours: true },
    estimatedSubmissionTime: '1-2 weeks',
    verificationMethod: 'email',
  },
  // Comparison platforms
  {
    slug: 'comparis',
    name: 'Comparis',
    url: 'https://www.comparis.ch',
    category: 'INDUSTRY_SPECIFIC',
    country: 'CH',
    priority: 2,
    industries: ['insurance', 'healthcare', 'real_estate', 'telecom'],
    hasApi: false,
    submissionGuide: 'List your business on Comparis for comparison visibility.',
    napFields: { name: true, address: true, phone: true, website: true, hours: false },
    estimatedSubmissionTime: 'Varies',
    verificationMethod: 'email',
  },
]

/**
 * Review platforms
 */
export const REVIEW_PLATFORMS: CitationSource[] = [
  {
    slug: 'yelp',
    name: 'Yelp',
    url: 'https://www.yelp.ch',
    category: 'REVIEW_PLATFORM',
    country: 'CH',
    priority: 3,
    hasApi: true,
    submissionUrl: 'https://biz.yelp.ch',
    submissionGuide: 'Claim your business on Yelp for review management.',
    napFields: { name: true, address: true, phone: true, website: true, hours: true },
    estimatedSubmissionTime: '10 minutes',
    verificationMethod: 'phone',
  },
  {
    slug: 'tripadvisor',
    name: 'TripAdvisor',
    url: 'https://www.tripadvisor.ch',
    category: 'REVIEW_PLATFORM',
    country: 'CH',
    priority: 2,
    industries: ['hospitality', 'restaurant', 'hotel', 'tourism'],
    hasApi: false,
    submissionUrl: 'https://www.tripadvisor.ch/Owners',
    submissionGuide: 'Claim your TripAdvisor listing for review management. Essential for hospitality businesses.',
    napFields: { name: true, address: true, phone: true, website: true, hours: true },
    estimatedSubmissionTime: '10 minutes',
    verificationMethod: 'phone',
  },
  {
    slug: 'trustpilot',
    name: 'Trustpilot',
    url: 'https://www.trustpilot.com',
    category: 'REVIEW_PLATFORM',
    country: 'CH',
    priority: 3,
    hasApi: true,
    submissionUrl: 'https://business.trustpilot.com',
    submissionGuide: 'Claim your Trustpilot profile to collect and showcase reviews.',
    napFields: { name: true, address: false, phone: false, website: true, hours: false },
    estimatedSubmissionTime: '10 minutes',
    verificationMethod: 'email',
  },
]

/**
 * Social platforms
 */
export const SOCIAL_PLATFORMS: CitationSource[] = [
  {
    slug: 'facebook',
    name: 'Facebook Business',
    url: 'https://www.facebook.com/business',
    category: 'SOCIAL_PLATFORM',
    country: 'CH',
    priority: 2,
    hasApi: true,
    submissionUrl: 'https://www.facebook.com/pages/create',
    submissionGuide: 'Create a Facebook Business Page for social presence and local discovery.',
    napFields: { name: true, address: true, phone: true, website: true, hours: true },
    estimatedSubmissionTime: '10 minutes',
    verificationMethod: 'none',
  },
  {
    slug: 'linkedin',
    name: 'LinkedIn Company Page',
    url: 'https://www.linkedin.com/company',
    category: 'SOCIAL_PLATFORM',
    country: 'CH',
    priority: 2,
    hasApi: true,
    submissionUrl: 'https://www.linkedin.com/company/setup/new/',
    submissionGuide: 'Create a LinkedIn Company Page for professional visibility and B2B discovery.',
    napFields: { name: true, address: true, phone: true, website: true, hours: false },
    estimatedSubmissionTime: '10 minutes',
    verificationMethod: 'email',
  },
  {
    slug: 'instagram',
    name: 'Instagram Business',
    url: 'https://www.instagram.com',
    category: 'SOCIAL_PLATFORM',
    country: 'CH',
    priority: 3,
    hasApi: true,
    submissionUrl: 'https://www.instagram.com',
    submissionGuide: 'Convert to an Instagram Business Profile for contact buttons and insights.',
    napFields: { name: true, address: true, phone: true, website: true, hours: false },
    estimatedSubmissionTime: '5 minutes',
    verificationMethod: 'none',
  },
]

/**
 * Get all sources for a country
 */
export function getSourcesForCountry(country: string = 'CH'): CitationSource[] {
  const allSources = [
    ...MAJOR_PLATFORMS,
    ...SWISS_DIRECTORIES,
    ...INDUSTRY_DIRECTORIES,
    ...REVIEW_PLATFORMS,
    ...SOCIAL_PLATFORMS,
  ]

  return allSources.filter(s => s.country === country || s.country === 'GLOBAL')
}

/**
 * Get sources for a specific industry
 */
export function getSourcesForIndustry(industry: string, country: string = 'CH'): CitationSource[] {
  const allSources = getSourcesForCountry(country)

  return allSources.filter(source => {
    // Include if no industry restriction or matches
    if (!source.industries) return true
    return source.industries.some(i =>
      i.toLowerCase().includes(industry.toLowerCase()) ||
      industry.toLowerCase().includes(i.toLowerCase())
    )
  })
}

/**
 * Get sources by category
 */
export function getSourcesByCategory(category: SourceCategory): CitationSource[] {
  const allSources = [
    ...MAJOR_PLATFORMS,
    ...SWISS_DIRECTORIES,
    ...INDUSTRY_DIRECTORIES,
    ...REVIEW_PLATFORMS,
    ...SOCIAL_PLATFORMS,
  ]

  return allSources.filter(s => s.category === category)
}

/**
 * Get priority sources (essential for all businesses)
 */
export function getPrioritySources(): CitationSource[] {
  return [
    ...MAJOR_PLATFORMS,
    ...SWISS_DIRECTORIES.filter(s => s.priority <= 2),
  ].sort((a, b) => a.priority - b.priority)
}
