import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Seed Swiss citation sources
  const citationSources = [
    // Major platforms
    {
      slug: 'google_business',
      name: 'Google Business Profile',
      url: 'https://business.google.com',
      category: 'MAJOR_PLATFORM',
      country: 'CH',
      priority: 1,
      hasApi: true,
      submissionUrl: 'https://business.google.com/create',
      submissionGuide: 'Create or claim your Google Business Profile to appear in Google Search and Maps.',
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
      submissionGuide: 'Register with Apple Business Connect to manage your presence in Apple Maps.',
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
      submissionGuide: 'Claim your business on Bing Places for Business.',
    },
    // Swiss national directories
    {
      slug: 'local_ch',
      name: 'local.ch',
      url: 'https://www.local.ch',
      category: 'NATIONAL_DIRECTORY',
      country: 'CH',
      priority: 1,
      hasApi: false,
      submissionUrl: 'https://www.local.ch/de/eintrag',
      submissionGuide: 'Create or update your entry on local.ch, Switzerland\'s largest business directory.',
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
      submissionGuide: 'Register your business on search.ch.',
    },
    {
      slug: 'directories_ch',
      name: 'directories.ch',
      url: 'https://www.directories.ch',
      category: 'NATIONAL_DIRECTORY',
      country: 'CH',
      priority: 3,
      hasApi: false,
      submissionUrl: 'https://www.directories.ch/eintrag',
      submissionGuide: 'The official Swiss phone directory. Most entries are auto-synced from telecom providers.',
    },
    // Industry-specific
    {
      slug: 'treuhand_suisse',
      name: 'Treuhand Suisse',
      url: 'https://www.treuhandsuisse.ch',
      category: 'INDUSTRY_SPECIFIC',
      country: 'CH',
      priority: 1,
      industries: JSON.stringify(['treuhand']),
      hasApi: false,
      submissionGuide: 'Join Treuhand Suisse to be listed in their member directory (requires membership).',
    },
    {
      slug: 'sav_fsa',
      name: 'Swiss Bar Association',
      url: 'https://www.sav-fsa.ch',
      category: 'INDUSTRY_SPECIFIC',
      country: 'CH',
      priority: 1,
      industries: JSON.stringify(['legal']),
      hasApi: false,
      submissionGuide: 'Register with the Swiss Bar Association for lawyer directory listing.',
    },
    {
      slug: 'comparis',
      name: 'Comparis',
      url: 'https://www.comparis.ch',
      category: 'INDUSTRY_SPECIFIC',
      country: 'CH',
      priority: 2,
      industries: JSON.stringify(['insurance', 'healthcare', 'real_estate']),
      hasApi: false,
      submissionGuide: 'List your business on Comparis for comparison visibility.',
    },
    // Review platforms
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
    },
    {
      slug: 'tripadvisor',
      name: 'TripAdvisor',
      url: 'https://www.tripadvisor.ch',
      category: 'REVIEW_PLATFORM',
      country: 'CH',
      priority: 3,
      industries: JSON.stringify(['hospitality', 'retail']),
      hasApi: false,
      submissionUrl: 'https://www.tripadvisor.ch/Owners',
      submissionGuide: 'Claim your TripAdvisor listing for review management.',
    },
    // Social platforms
    {
      slug: 'facebook',
      name: 'Facebook Business',
      url: 'https://www.facebook.com/business',
      category: 'SOCIAL_PLATFORM',
      country: 'CH',
      priority: 2,
      hasApi: true,
      submissionUrl: 'https://www.facebook.com/pages/create',
      submissionGuide: 'Create a Facebook Business Page for social presence.',
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
      submissionGuide: 'Create a LinkedIn Company Page for professional visibility.',
    },
  ]

  for (const source of citationSources) {
    await db.citationSource.upsert({
      where: { slug: source.slug },
      update: source,
      create: source,
    })
  }

  console.log(`Seeded ${citationSources.length} citation sources`)
  console.log('Database seeding complete!')
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
