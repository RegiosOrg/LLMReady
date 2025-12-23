/**
 * Schema.org JSON-LD Generators
 * Generates structured data for improved AI and search engine visibility
 */

import { SWISS_INDUSTRIES, IndustryKey } from '@/lib/entity/normalize'

export interface BusinessData {
  id: string
  name: string
  uid?: string | null
  industry?: string | null
  description?: string | null
  addressStreet?: string | null
  addressCity?: string | null
  addressPostal?: string | null
  addressCanton?: string | null
  phone?: string | null
  email?: string | null
  website?: string | null
  services?: string[]
  openingHours?: Record<string, string>
}

/**
 * Map industry to Schema.org type
 */
const INDUSTRY_SCHEMA_TYPES: Record<string, string> = {
  treuhand: 'AccountingService',
  legal: 'LegalService',
  notary: 'Notary',
  healthcare: 'MedicalBusiness',
  real_estate: 'RealEstateAgent',
  hospitality: 'LodgingBusiness',
  retail: 'Store',
  it_services: 'ProfessionalService',
  construction: 'HomeAndConstructionBusiness',
  insurance: 'InsuranceAgency',
  finance: 'FinancialService',
  consulting: 'ProfessionalService',
}

/**
 * Generate Organization/LocalBusiness schema
 */
export function generateOrganizationSchema(business: BusinessData): object {
  const schemaType = business.industry
    ? INDUSTRY_SCHEMA_TYPES[business.industry] || 'LocalBusiness'
    : 'LocalBusiness'

  const schema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': schemaType,
    name: business.name,
    '@id': business.website ? `${business.website}/#organization` : undefined,
  }

  // Swiss UID as identifier
  if (business.uid) {
    schema.identifier = {
      '@type': 'PropertyValue',
      propertyID: 'Swiss UID',
      value: business.uid,
    }
  }

  // Description
  if (business.description) {
    schema.description = business.description
  }

  // Address
  if (business.addressCity) {
    schema.address = {
      '@type': 'PostalAddress',
      streetAddress: business.addressStreet,
      addressLocality: business.addressCity,
      postalCode: business.addressPostal,
      addressRegion: business.addressCanton,
      addressCountry: 'CH',
    }
  }

  // Contact
  if (business.phone) {
    schema.telephone = business.phone
  }

  if (business.email) {
    schema.email = business.email
  }

  if (business.website) {
    schema.url = business.website
  }

  // Area served (Switzerland)
  schema.areaServed = {
    '@type': 'Country',
    name: 'Switzerland',
  }

  // Opening hours
  if (business.openingHours) {
    schema.openingHoursSpecification = generateOpeningHours(business.openingHours)
  }

  // Clean undefined values
  return cleanSchema(schema)
}

/**
 * Generate Service schema for a specific service
 */
export function generateServiceSchema(
  business: BusinessData,
  service: string,
  serviceDescription?: string
): object {
  const schema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service,
    provider: {
      '@type': 'Organization',
      name: business.name,
      url: business.website,
    },
  }

  if (serviceDescription) {
    schema.description = serviceDescription
  }

  if (business.addressCity) {
    schema.areaServed = {
      '@type': 'City',
      name: business.addressCity,
    }
  }

  return cleanSchema(schema)
}

/**
 * Generate FAQ schema from common questions
 */
export function generateFaqSchema(
  faqs: { question: string; answer: string }[]
): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

/**
 * Generate BreadcrumbList schema
 */
export function generateBreadcrumbSchema(
  items: { name: string; url: string }[]
): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

/**
 * Generate WebSite schema
 */
export function generateWebsiteSchema(
  business: BusinessData,
  searchUrl?: string
): object {
  const schema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: business.name,
    url: business.website,
  }

  if (searchUrl) {
    schema.potentialAction = {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${searchUrl}?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    }
  }

  return cleanSchema(schema)
}

/**
 * Generate all relevant schemas for a business
 */
export function generateAllSchemas(business: BusinessData): {
  schemaType: string
  jsonLd: object
  embedCode: string
}[] {
  const schemas: { schemaType: string; jsonLd: object; embedCode: string }[] = []

  // Organization/LocalBusiness schema
  const orgSchema = generateOrganizationSchema(business)
  schemas.push({
    schemaType: 'Organization',
    jsonLd: orgSchema,
    embedCode: generateEmbedCode(orgSchema),
  })

  // Website schema
  if (business.website) {
    const websiteSchema = generateWebsiteSchema(business)
    schemas.push({
      schemaType: 'WebSite',
      jsonLd: websiteSchema,
      embedCode: generateEmbedCode(websiteSchema),
    })
  }

  // Service schemas
  if (business.services && business.services.length > 0) {
    for (const service of business.services.slice(0, 5)) {
      const serviceSchema = generateServiceSchema(business, service)
      schemas.push({
        schemaType: 'Service',
        jsonLd: serviceSchema,
        embedCode: generateEmbedCode(serviceSchema),
      })
    }
  }

  return schemas
}

/**
 * Generate opening hours specification
 */
function generateOpeningHours(hours: Record<string, string>): object[] {
  const dayMap: Record<string, string> = {
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday',
  }

  const specs: object[] = []

  for (const [day, timeRange] of Object.entries(hours)) {
    if (!timeRange || timeRange.toLowerCase() === 'closed') continue

    const [opens, closes] = timeRange.split('-').map(t => t.trim())
    if (opens && closes) {
      specs.push({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: dayMap[day.toLowerCase()],
        opens,
        closes,
      })
    }
  }

  return specs
}

/**
 * Generate HTML embed code for schema
 */
export function generateEmbedCode(schema: object): string {
  const json = JSON.stringify(schema, null, 2)
  return `<script type="application/ld+json">
${json}
</script>`
}

/**
 * Clean undefined values from schema object
 */
function cleanSchema(obj: Record<string, any>): Record<string, any> {
  const cleaned: Record<string, any> = {}

  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined || value === null || value === '') continue

    if (typeof value === 'object' && !Array.isArray(value)) {
      const cleanedNested = cleanSchema(value)
      if (Object.keys(cleanedNested).length > 0) {
        cleaned[key] = cleanedNested
      }
    } else if (Array.isArray(value)) {
      const cleanedArray = value
        .map(item => typeof item === 'object' ? cleanSchema(item) : item)
        .filter(item => item !== undefined && item !== null)
      if (cleanedArray.length > 0) {
        cleaned[key] = cleanedArray
      }
    } else {
      cleaned[key] = value
    }
  }

  return cleaned
}

/**
 * Validate schema against Schema.org requirements
 */
export function validateSchema(schema: object): {
  valid: boolean
  errors: string[]
  warnings: string[]
} {
  const errors: string[] = []
  const warnings: string[] = []
  const schemaObj = schema as Record<string, any>

  // Check required fields
  if (!schemaObj['@context']) {
    errors.push('Missing @context (should be "https://schema.org")')
  }

  if (!schemaObj['@type']) {
    errors.push('Missing @type')
  }

  if (!schemaObj.name) {
    errors.push('Missing name property')
  }

  // Check recommended fields
  if (!schemaObj.url) {
    warnings.push('Missing url - recommended for better linking')
  }

  if (!schemaObj.address && schemaObj['@type'] !== 'WebSite') {
    warnings.push('Missing address - recommended for local businesses')
  }

  if (!schemaObj.telephone && schemaObj['@type'] !== 'WebSite') {
    warnings.push('Missing telephone - recommended for contact')
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  }
}
