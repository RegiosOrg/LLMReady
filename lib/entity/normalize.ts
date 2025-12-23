/**
 * Entity Normalization Utilities
 * Standardizes business information for consistent LLM representation
 */

import { formatUID, isValidUID } from '@/lib/zefix'

/**
 * Swiss industry categories with search intent mappings
 */
export const SWISS_INDUSTRIES = {
  treuhand: {
    name: 'Treuhand & Buchhaltung',
    nameEn: 'Accounting & Fiduciary',
    searchIntents: [
      'Treuhand in der Nähe',
      'Buchhaltung auslagern',
      'Steuerberater Schweiz',
      'Jahresabschluss erstellen lassen',
      'Lohnbuchhaltung Service',
      'MWST Abrechnung',
    ],
    servicePrimitives: [
      'Buchhaltung',
      'Jahresabschluss',
      'Steuererklärung',
      'Lohnbuchhaltung',
      'MWST-Abrechnung',
      'Unternehmensberatung',
      'Wirtschaftsprüfung',
      'Firmengründung',
    ],
  },
  legal: {
    name: 'Recht & Anwalt',
    nameEn: 'Legal Services',
    searchIntents: [
      'Anwalt in der Nähe',
      'Rechtsberatung Schweiz',
      'Vertragsrecht Anwalt',
      'Scheidungsanwalt',
      'Arbeitsrecht Beratung',
    ],
    servicePrimitives: [
      'Vertragsrecht',
      'Arbeitsrecht',
      'Familienrecht',
      'Erbrecht',
      'Immobilienrecht',
      'Strafrecht',
      'Gesellschaftsrecht',
      'Inkasso',
    ],
  },
  notary: {
    name: 'Notar',
    nameEn: 'Notary Services',
    searchIntents: [
      'Notar in der Nähe',
      'Beglaubigung Dokumente',
      'Testament erstellen',
      'Kaufvertrag beurkunden',
    ],
    servicePrimitives: [
      'Beurkundung',
      'Beglaubigung',
      'Testament',
      'Erbvertrag',
      'Kaufvertrag',
      'Gesellschaftsvertrag',
      'Vorsorgeauftrag',
    ],
  },
  healthcare: {
    name: 'Gesundheit & Medizin',
    nameEn: 'Healthcare',
    searchIntents: [
      'Arzt in der Nähe',
      'Hausarzt Termin',
      'Zahnarzt Notfall',
      'Physiotherapie',
    ],
    servicePrimitives: [
      'Allgemeinmedizin',
      'Zahnmedizin',
      'Physiotherapie',
      'Psychologie',
      'Dermatologie',
      'Kardiologie',
      'Orthopädie',
    ],
  },
  real_estate: {
    name: 'Immobilien',
    nameEn: 'Real Estate',
    searchIntents: [
      'Immobilienmakler',
      'Wohnung mieten',
      'Haus kaufen',
      'Immobilienbewertung',
    ],
    servicePrimitives: [
      'Immobilienvermittlung',
      'Vermietung',
      'Verkauf',
      'Bewertung',
      'Verwaltung',
      'Finanzierung',
    ],
  },
  hospitality: {
    name: 'Gastronomie & Hotellerie',
    nameEn: 'Hospitality',
    searchIntents: [
      'Restaurant in der Nähe',
      'Hotel buchen',
      'Catering Service',
    ],
    servicePrimitives: [
      'Restaurant',
      'Hotel',
      'Bar',
      'Catering',
      'Event Location',
    ],
  },
  retail: {
    name: 'Einzelhandel',
    nameEn: 'Retail',
    searchIntents: [
      'Geschäft in der Nähe',
      'Online Shop',
      'Laden öffnungszeiten',
    ],
    servicePrimitives: [
      'Verkauf',
      'Beratung',
      'Lieferung',
      'Reparatur',
    ],
  },
  it_services: {
    name: 'IT & Software',
    nameEn: 'IT Services',
    searchIntents: [
      'IT Support',
      'Webentwicklung',
      'Software Entwicklung',
      'Cloud Services',
    ],
    servicePrimitives: [
      'Webentwicklung',
      'App-Entwicklung',
      'IT-Support',
      'Cloud-Services',
      'Cybersecurity',
      'Datenanalyse',
    ],
  },
  construction: {
    name: 'Bau & Handwerk',
    nameEn: 'Construction',
    searchIntents: [
      'Handwerker in der Nähe',
      'Bauunternehmen',
      'Renovation',
      'Elektriker',
      'Sanitär',
    ],
    servicePrimitives: [
      'Hochbau',
      'Tiefbau',
      'Renovation',
      'Elektroinstallation',
      'Sanitär',
      'Heizung',
      'Malerei',
      'Schreinerei',
    ],
  },
  insurance: {
    name: 'Versicherung',
    nameEn: 'Insurance',
    searchIntents: [
      'Versicherungsberater',
      'Krankenversicherung wechseln',
      'Autoversicherung',
    ],
    servicePrimitives: [
      'Krankenversicherung',
      'Lebensversicherung',
      'Sachversicherung',
      'Haftpflicht',
      'Beratung',
    ],
  },
  finance: {
    name: 'Finanzdienstleistungen',
    nameEn: 'Financial Services',
    searchIntents: [
      'Finanzberater',
      'Hypothek',
      'Vermögensverwaltung',
    ],
    servicePrimitives: [
      'Vermögensverwaltung',
      'Finanzplanung',
      'Hypotheken',
      'Vorsorge',
      'Anlageberatung',
    ],
  },
  consulting: {
    name: 'Unternehmensberatung',
    nameEn: 'Business Consulting',
    searchIntents: [
      'Unternehmensberater',
      'Strategieberatung',
      'HR Beratung',
    ],
    servicePrimitives: [
      'Strategieberatung',
      'Organisationsentwicklung',
      'HR-Beratung',
      'Digitalisierung',
      'Prozessoptimierung',
    ],
  },
} as const

export type IndustryKey = keyof typeof SWISS_INDUSTRIES

/**
 * Normalize phone number to Swiss format
 */
export function normalizePhoneNumber(phone: string): string {
  // Remove all non-digit characters except +
  let cleaned = phone.replace(/[^\d+]/g, '')

  // Handle Swiss numbers
  if (cleaned.startsWith('0')) {
    cleaned = '+41' + cleaned.slice(1)
  } else if (cleaned.startsWith('41') && !cleaned.startsWith('+')) {
    cleaned = '+' + cleaned
  } else if (cleaned.startsWith('0041')) {
    cleaned = '+41' + cleaned.slice(4)
  }

  // Format: +41 XX XXX XX XX
  if (cleaned.startsWith('+41') && cleaned.length === 12) {
    return `+41 ${cleaned.slice(3, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8, 10)} ${cleaned.slice(10, 12)}`
  }

  return cleaned
}

/**
 * Normalize website URL
 */
export function normalizeWebsiteUrl(url: string): string {
  let normalized = url.trim().toLowerCase()

  // Remove trailing slash
  normalized = normalized.replace(/\/+$/, '')

  // Add https if no protocol
  if (!normalized.startsWith('http://') && !normalized.startsWith('https://')) {
    normalized = 'https://' + normalized
  }

  // Remove www. for consistency
  normalized = normalized.replace(/^(https?:\/\/)www\./, '$1')

  return normalized
}

/**
 * Normalize email address
 */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

/**
 * Normalize business name (preserve case but trim)
 */
export function normalizeBusinessName(name: string): string {
  return name.trim().replace(/\s+/g, ' ')
}

/**
 * Generate name variants for multilingual indexing
 */
export function generateNameVariants(name: string, industry?: IndustryKey): Record<string, string> {
  const variants: Record<string, string> = {
    original: name,
  }

  // Common suffix translations
  const suffixes: Record<string, Record<string, string>> = {
    GmbH: { de: 'GmbH', fr: 'Sàrl', it: 'Sagl', en: 'LLC' },
    AG: { de: 'AG', fr: 'SA', it: 'SA', en: 'Inc' },
  }

  // Check for legal form suffixes
  for (const [suffix, translations] of Object.entries(suffixes)) {
    if (name.includes(suffix)) {
      const baseName = name.replace(suffix, '').trim()
      variants.de = `${baseName} ${translations.de}`
      variants.fr = `${baseName} ${translations.fr}`
      variants.it = `${baseName} ${translations.it}`
      variants.en = `${baseName} ${translations.en}`
      break
    }
  }

  return variants
}

/**
 * Calculate NAP (Name, Address, Phone) consistency score
 */
export function calculateNapScore(
  canonical: { name: string; address: string; phone: string },
  listing: { name?: string; address?: string; phone?: string }
): { score: number; issues: string[] } {
  const issues: string[] = []
  let matches = 0
  let total = 0

  // Name comparison (fuzzy)
  if (listing.name) {
    total++
    const similarity = stringSimilarity(
      canonical.name.toLowerCase(),
      listing.name.toLowerCase()
    )
    if (similarity >= 0.8) {
      matches++
    } else {
      issues.push(`Name mismatch: "${listing.name}" vs "${canonical.name}"`)
    }
  }

  // Address comparison (fuzzy)
  if (listing.address) {
    total++
    const similarity = stringSimilarity(
      normalizeAddress(canonical.address),
      normalizeAddress(listing.address)
    )
    if (similarity >= 0.8) {
      matches++
    } else {
      issues.push(`Address mismatch: "${listing.address}" vs "${canonical.address}"`)
    }
  }

  // Phone comparison (exact after normalization)
  if (listing.phone) {
    total++
    const normalizedCanonical = normalizePhoneNumber(canonical.phone)
    const normalizedListing = normalizePhoneNumber(listing.phone)
    if (normalizedCanonical === normalizedListing) {
      matches++
    } else {
      issues.push(`Phone mismatch: "${listing.phone}" vs "${canonical.phone}"`)
    }
  }

  const score = total > 0 ? Math.round((matches / total) * 100) : 0

  return { score, issues }
}

/**
 * Normalize address for comparison
 */
function normalizeAddress(address: string): string {
  return address
    .toLowerCase()
    .replace(/str\./g, 'strasse')
    .replace(/str$/g, 'strasse')
    .replace(/\s+/g, ' ')
    .replace(/[.,]/g, '')
    .trim()
}

/**
 * Simple string similarity (Dice coefficient)
 */
function stringSimilarity(a: string, b: string): number {
  if (a === b) return 1
  if (a.length < 2 || b.length < 2) return 0

  const getBigrams = (str: string): Set<string> => {
    const bigrams = new Set<string>()
    for (let i = 0; i < str.length - 1; i++) {
      bigrams.add(str.slice(i, i + 2))
    }
    return bigrams
  }

  const aBigrams = getBigrams(a)
  const bBigrams = getBigrams(b)

  let intersection = 0
  Array.from(aBigrams).forEach(bigram => {
    if (bBigrams.has(bigram)) {
      intersection++
    }
  })

  return (2 * intersection) / (aBigrams.size + bBigrams.size)
}

/**
 * Get service primitives for an industry
 */
export function getServicePrimitives(industry: IndustryKey): string[] {
  const primitives = SWISS_INDUSTRIES[industry]?.servicePrimitives
  return primitives ? [...primitives] : []
}

/**
 * Get search intents for an industry
 */
export function getSearchIntents(industry: IndustryKey): string[] {
  const intents = SWISS_INDUSTRIES[industry]?.searchIntents
  return intents ? [...intents] : []
}

/**
 * Map free-text services to service primitives
 */
export function mapServicesToPrimitives(
  services: string[],
  industry: IndustryKey
): { mapped: string[]; unmapped: string[] } {
  const primitives = getServicePrimitives(industry)
  const mapped: string[] = []
  const unmapped: string[] = []

  for (const service of services) {
    const normalized = service.toLowerCase().trim()
    const match = primitives.find(p =>
      p.toLowerCase().includes(normalized) ||
      normalized.includes(p.toLowerCase())
    )
    if (match) {
      if (!mapped.includes(match)) {
        mapped.push(match)
      }
    } else {
      unmapped.push(service)
    }
  }

  return { mapped, unmapped }
}

/**
 * Build canonical entity representation
 */
export function buildCanonicalEntity(data: {
  name: string
  uid?: string
  industry?: IndustryKey
  addressStreet?: string
  addressCity?: string
  addressPostal?: string
  addressCanton?: string
  phone?: string
  email?: string
  website?: string
  services?: string[]
  description?: string
}) {
  const canonical: Record<string, any> = {
    name: normalizeBusinessName(data.name),
    nameVariants: generateNameVariants(data.name, data.industry),
  }

  if (data.uid && isValidUID(data.uid)) {
    canonical.uid = formatUID(data.uid)
  }

  if (data.industry) {
    canonical.industry = data.industry
    canonical.industryLabel = SWISS_INDUSTRIES[data.industry]?.name
  }

  // Build full address
  const addressParts = []
  if (data.addressStreet) addressParts.push(data.addressStreet)
  if (data.addressPostal && data.addressCity) {
    addressParts.push(`${data.addressPostal} ${data.addressCity}`)
  } else if (data.addressCity) {
    addressParts.push(data.addressCity)
  }
  if (addressParts.length > 0) {
    canonical.address = addressParts.join(', ')
    canonical.addressComponents = {
      street: data.addressStreet,
      city: data.addressCity,
      postalCode: data.addressPostal,
      canton: data.addressCanton,
      country: 'CH',
    }
  }

  if (data.phone) {
    canonical.phone = normalizePhoneNumber(data.phone)
  }

  if (data.email) {
    canonical.email = normalizeEmail(data.email)
  }

  if (data.website) {
    canonical.website = normalizeWebsiteUrl(data.website)
  }

  if (data.services && data.services.length > 0) {
    if (data.industry) {
      const { mapped, unmapped } = mapServicesToPrimitives(data.services, data.industry)
      canonical.servicePrimitives = mapped
      canonical.customServices = unmapped
    } else {
      canonical.services = data.services
    }
  }

  if (data.description) {
    canonical.description = data.description.trim()
  }

  return canonical
}
