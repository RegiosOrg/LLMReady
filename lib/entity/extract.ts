/**
 * Entity Extraction Utility
 * Uses AI to extract structured business information from websites
 */

import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface ExtractedEntity {
  // Core identity
  name: string
  nameVariants?: {
    de?: string
    fr?: string
    it?: string
    en?: string
  }
  legalForm?: string
  uid?: string

  // Location
  address?: {
    street?: string
    city?: string
    postalCode?: string
    canton?: string
    country?: string
  }

  // Contact
  phone?: string
  email?: string
  website?: string

  // Business details
  industry?: string
  description?: string
  services?: string[]
  keywords?: string[]

  // Hours
  openingHours?: {
    monday?: string
    tuesday?: string
    wednesday?: string
    thursday?: string
    friday?: string
    saturday?: string
    sunday?: string
  }

  // Social
  socialProfiles?: {
    linkedin?: string
    facebook?: string
    instagram?: string
    twitter?: string
  }

  // Additional
  foundedYear?: number
  employees?: string
  languages?: string[]

  // Extraction metadata
  confidence: number
  extractedFrom: string
  extractedAt: string
}

const EXTRACTION_PROMPT = `You are an expert at extracting structured business information from website content.
Analyze the following website content and extract all available business entity information.

Return a JSON object with the following structure (only include fields that have data):
{
  "name": "Official business name",
  "nameVariants": {"de": "...", "fr": "...", "it": "...", "en": "..."},
  "legalForm": "GmbH, AG, Einzelfirma, etc.",
  "uid": "Swiss UID if found (CHE-xxx.xxx.xxx)",
  "address": {
    "street": "Street and number",
    "city": "City",
    "postalCode": "Postal code",
    "canton": "Two-letter canton code (ZH, BE, etc.)",
    "country": "CH for Switzerland"
  },
  "phone": "Phone number",
  "email": "Email address",
  "website": "Main website URL",
  "industry": "Primary industry category",
  "description": "Brief business description (1-2 sentences)",
  "services": ["Service 1", "Service 2", ...],
  "keywords": ["keyword1", "keyword2", ...],
  "openingHours": {
    "monday": "09:00-18:00",
    "tuesday": "09:00-18:00",
    ...
  },
  "socialProfiles": {
    "linkedin": "URL",
    "facebook": "URL",
    ...
  },
  "foundedYear": 2020,
  "employees": "1-10, 11-50, 51-200, etc.",
  "languages": ["de", "fr", "en"]
}

For Swiss businesses, pay special attention to:
- Swiss UID format (CHE-xxx.xxx.xxx)
- Canton codes (ZH, BE, GE, etc.)
- Multilingual content (German, French, Italian)
- Common Swiss business types (Treuhand, Notar, Anwalt, etc.)

Provide a confidence score (0-100) based on how complete and reliable the extracted data is.
Only include fields where you found actual data. Don't make up information.`

/**
 * Fetch website content for analysis
 */
async function fetchWebsiteContent(url: string): Promise<string> {
  try {
    // Normalize URL
    let normalizedUrl = url.trim()
    if (!normalizedUrl.startsWith('http')) {
      normalizedUrl = `https://${normalizedUrl}`
    }

    const response = await fetch(normalizedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; GetCitedBy/1.0; +https://getcitedby.com)',
        'Accept': 'text/html,application/xhtml+xml',
      },
      signal: AbortSignal.timeout(10000), // 10 second timeout
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`)
    }

    const html = await response.text()

    // Basic HTML to text conversion
    // Remove scripts, styles, and HTML tags
    let text = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()

    // Limit to reasonable size for API
    if (text.length > 15000) {
      text = text.substring(0, 15000) + '...'
    }

    return text
  } catch (error) {
    console.error('Failed to fetch website:', error)
    throw new Error(`Could not fetch website content: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Extract entity information from website URL
 */
export async function extractFromWebsite(url: string): Promise<ExtractedEntity> {
  const content = await fetchWebsiteContent(url)

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: EXTRACTION_PROMPT,
      },
      {
        role: 'user',
        content: `Website URL: ${url}\n\nWebsite Content:\n${content}`,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.2,
    max_tokens: 2000,
  })

  const result = completion.choices[0]?.message?.content
  if (!result) {
    throw new Error('No response from AI')
  }

  const parsed = JSON.parse(result)

  return {
    ...parsed,
    website: url,
    extractedFrom: url,
    extractedAt: new Date().toISOString(),
    confidence: parsed.confidence || 50,
  }
}

/**
 * Extract entity from provided text (for manual input)
 */
export async function extractFromText(text: string, context?: string): Promise<ExtractedEntity> {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: EXTRACTION_PROMPT,
      },
      {
        role: 'user',
        content: context
          ? `Context: ${context}\n\nBusiness Information:\n${text}`
          : `Business Information:\n${text}`,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.2,
    max_tokens: 2000,
  })

  const result = completion.choices[0]?.message?.content
  if (!result) {
    throw new Error('No response from AI')
  }

  const parsed = JSON.parse(result)

  return {
    ...parsed,
    extractedFrom: 'text_input',
    extractedAt: new Date().toISOString(),
    confidence: parsed.confidence || 50,
  }
}

/**
 * Merge extracted entity with existing business data
 * Prioritizes existing data over extracted data
 */
export function mergeWithExisting(
  extracted: Partial<ExtractedEntity>,
  existing: Record<string, any>
): Record<string, any> {
  const merged: Record<string, any> = { ...existing }

  // Only fill in missing fields
  if (!merged.name && extracted.name) {
    merged.name = extracted.name
  }
  if (!merged.nameVariants && extracted.nameVariants) {
    merged.nameVariants = extracted.nameVariants
  }
  if (!merged.uid && extracted.uid) {
    merged.uid = extracted.uid
  }
  if (!merged.description && extracted.description) {
    merged.description = extracted.description
  }
  if (!merged.industry && extracted.industry) {
    merged.industry = extracted.industry
  }
  if ((!merged.services || merged.services.length === 0) && extracted.services) {
    merged.services = extracted.services
  }
  if (!merged.phone && extracted.phone) {
    merged.phone = extracted.phone
  }
  if (!merged.email && extracted.email) {
    merged.email = extracted.email
  }

  // Address fields
  if (extracted.address) {
    if (!merged.addressStreet && extracted.address.street) {
      merged.addressStreet = extracted.address.street
    }
    if (!merged.addressCity && extracted.address.city) {
      merged.addressCity = extracted.address.city
    }
    if (!merged.addressPostal && extracted.address.postalCode) {
      merged.addressPostal = extracted.address.postalCode
    }
    if (!merged.addressCanton && extracted.address.canton) {
      merged.addressCanton = extracted.address.canton
    }
  }

  return merged
}
