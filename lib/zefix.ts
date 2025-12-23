/**
 * Zefix API Client
 * Swiss central business register (Zentraler Firmenindex)
 * https://www.zefix.ch/ZefixREST/api/v1
 */

const ZEFIX_API_URL = process.env.ZEFIX_API_URL || 'https://www.zefix.ch/ZefixREST/api/v1'

export interface ZefixCompany {
  uid: string
  name: string
  legalForm: string
  legalSeat: string
  status: string
  canton: string
  chid: string
  registryOfCommerceId: string
  deleteDate: string | null
  address?: {
    street: string
    houseNumber: string
    swissZipCode: string
    city: string
    country: string
  }
  purpose?: string
}

export interface ZefixSearchResult {
  list: ZefixCompany[]
  maxRecords: number
  offset: number
  hasMoreResults: boolean
}

/**
 * Format UID to standard format: CHE-XXX.XXX.XXX
 */
export function formatUID(uid: string): string {
  // Remove all non-alphanumeric characters
  const clean = uid.replace(/[^A-Za-z0-9]/g, '').toUpperCase()

  // Check if it starts with CHE
  if (clean.startsWith('CHE') && clean.length === 12) {
    return `CHE-${clean.slice(3, 6)}.${clean.slice(6, 9)}.${clean.slice(9, 12)}`
  }

  // If just 9 digits, add CHE prefix
  if (/^\d{9}$/.test(clean)) {
    return `CHE-${clean.slice(0, 3)}.${clean.slice(3, 6)}.${clean.slice(6, 9)}`
  }

  return uid
}

/**
 * Validate Swiss UID format
 */
export function isValidUID(uid: string): boolean {
  const formatted = formatUID(uid)
  return /^CHE-\d{3}\.\d{3}\.\d{3}$/.test(formatted)
}

/**
 * Search companies by name
 */
export async function searchByName(
  name: string,
  options: {
    canton?: string
    maxRecords?: number
    offset?: number
  } = {}
): Promise<ZefixSearchResult> {
  const { canton, maxRecords = 10, offset = 0 } = options

  const params = new URLSearchParams({
    name: name,
    maxRecords: maxRecords.toString(),
    offset: offset.toString(),
  })

  if (canton) {
    params.append('registryOfCommerceCanton', canton)
  }

  try {
    const response = await fetch(`${ZEFIX_API_URL}/firm/search.json?${params}`, {
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!response.ok) {
      throw new Error(`Zefix API error: ${response.status}`)
    }

    const data = await response.json()
    return {
      list: data.list || [],
      maxRecords: data.maxRecords || maxRecords,
      offset: data.offset || offset,
      hasMoreResults: data.hasMoreResults || false,
    }
  } catch (error) {
    console.error('Zefix search error:', error)
    return {
      list: [],
      maxRecords,
      offset,
      hasMoreResults: false,
    }
  }
}

/**
 * Get company by UID
 */
export async function getByUID(uid: string): Promise<ZefixCompany | null> {
  const formattedUID = formatUID(uid)

  if (!isValidUID(formattedUID)) {
    return null
  }

  // Convert to API format (remove dashes and dots)
  const apiUID = formattedUID.replace(/[-\.]/g, '')

  try {
    const response = await fetch(`${ZEFIX_API_URL}/firm/${apiUID}.json`, {
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error(`Zefix API error: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Zefix lookup error:', error)
    return null
  }
}

/**
 * Search companies by canton
 */
export async function searchByCanton(
  canton: string,
  options: {
    maxRecords?: number
    offset?: number
    activeOnly?: boolean
  } = {}
): Promise<ZefixSearchResult> {
  const { maxRecords = 10, offset = 0, activeOnly = true } = options

  const params = new URLSearchParams({
    registryOfCommerceCanton: canton.toUpperCase(),
    maxRecords: maxRecords.toString(),
    offset: offset.toString(),
  })

  if (activeOnly) {
    params.append('activeOnly', 'true')
  }

  try {
    const response = await fetch(`${ZEFIX_API_URL}/firm/search.json?${params}`, {
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      throw new Error(`Zefix API error: ${response.status}`)
    }

    const data = await response.json()
    return {
      list: data.list || [],
      maxRecords: data.maxRecords || maxRecords,
      offset: data.offset || offset,
      hasMoreResults: data.hasMoreResults || false,
    }
  } catch (error) {
    console.error('Zefix search error:', error)
    return {
      list: [],
      maxRecords,
      offset,
      hasMoreResults: false,
    }
  }
}

/**
 * Map Zefix company data to business form fields
 */
export function mapZefixToBusinessData(company: ZefixCompany) {
  return {
    name: company.name,
    uid: formatUID(company.uid),
    addressStreet: company.address
      ? `${company.address.street} ${company.address.houseNumber}`.trim()
      : undefined,
    addressCity: company.address?.city || company.legalSeat,
    addressPostal: company.address?.swissZipCode,
    addressCanton: company.canton,
    description: company.purpose,
  }
}

/**
 * Swiss cantons for dropdown
 */
export const SWISS_CANTONS = [
  { code: 'AG', name: 'Aargau' },
  { code: 'AI', name: 'Appenzell Innerrhoden' },
  { code: 'AR', name: 'Appenzell Ausserrhoden' },
  { code: 'BE', name: 'Bern' },
  { code: 'BL', name: 'Basel-Landschaft' },
  { code: 'BS', name: 'Basel-Stadt' },
  { code: 'FR', name: 'Fribourg' },
  { code: 'GE', name: 'Geneva' },
  { code: 'GL', name: 'Glarus' },
  { code: 'GR', name: 'Graubünden' },
  { code: 'JU', name: 'Jura' },
  { code: 'LU', name: 'Lucerne' },
  { code: 'NE', name: 'Neuchâtel' },
  { code: 'NW', name: 'Nidwalden' },
  { code: 'OW', name: 'Obwalden' },
  { code: 'SG', name: 'St. Gallen' },
  { code: 'SH', name: 'Schaffhausen' },
  { code: 'SO', name: 'Solothurn' },
  { code: 'SZ', name: 'Schwyz' },
  { code: 'TG', name: 'Thurgau' },
  { code: 'TI', name: 'Ticino' },
  { code: 'UR', name: 'Uri' },
  { code: 'VD', name: 'Vaud' },
  { code: 'VS', name: 'Valais' },
  { code: 'ZG', name: 'Zug' },
  { code: 'ZH', name: 'Zürich' },
] as const

export type SwissCanton = typeof SWISS_CANTONS[number]['code']
