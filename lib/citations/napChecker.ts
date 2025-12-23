/**
 * NAP Consistency Checker
 * Validates Name, Address, Phone consistency across citations
 */

import { normalizePhoneNumber, calculateNapScore } from '@/lib/entity/normalize'

export interface NapData {
  name: string
  address: string
  phone: string
}

export interface CitationNapData {
  source: string
  name?: string | null
  address?: string | null
  phone?: string | null
}

export interface NapCheckResult {
  overallScore: number
  issues: NapIssue[]
  citationScores: CitationScore[]
  recommendations: string[]
}

export interface NapIssue {
  severity: 'high' | 'medium' | 'low'
  field: 'name' | 'address' | 'phone'
  source: string
  expected: string
  found: string
  message: string
}

export interface CitationScore {
  source: string
  score: number
  issues: string[]
}

/**
 * Check NAP consistency across all citations
 */
export function checkNapConsistency(
  canonical: NapData,
  citations: CitationNapData[]
): NapCheckResult {
  const issues: NapIssue[] = []
  const citationScores: CitationScore[] = []
  let totalScore = 0

  for (const citation of citations) {
    const { score, issues: citationIssues } = calculateNapScore(
      canonical,
      {
        name: citation.name || undefined,
        address: citation.address || undefined,
        phone: citation.phone || undefined,
      }
    )

    // Convert issues to detailed format
    for (const issue of citationIssues) {
      const field = issue.toLowerCase().includes('name')
        ? 'name'
        : issue.toLowerCase().includes('address')
        ? 'address'
        : 'phone'

      const severity = determineSeverity(field, score)

      issues.push({
        severity,
        field,
        source: citation.source,
        expected: canonical[field],
        found: (citation[field] as string) || 'Not provided',
        message: issue,
      })
    }

    citationScores.push({
      source: citation.source,
      score,
      issues: citationIssues,
    })

    totalScore += score
  }

  const overallScore = citations.length > 0
    ? Math.round(totalScore / citations.length)
    : 0

  const recommendations = generateRecommendations(issues, overallScore)

  return {
    overallScore,
    issues: issues.sort((a, b) => severityOrder(a.severity) - severityOrder(b.severity)),
    citationScores,
    recommendations,
  }
}

/**
 * Determine issue severity based on field and score
 */
function determineSeverity(field: 'name' | 'address' | 'phone', score: number): 'high' | 'medium' | 'low' {
  // Phone and name mismatches are more critical
  if (field === 'phone' || field === 'name') {
    return score < 50 ? 'high' : 'medium'
  }
  // Address variations are often acceptable
  return score < 30 ? 'medium' : 'low'
}

/**
 * Severity order for sorting
 */
function severityOrder(severity: 'high' | 'medium' | 'low'): number {
  return severity === 'high' ? 0 : severity === 'medium' ? 1 : 2
}

/**
 * Generate recommendations based on issues
 */
function generateRecommendations(issues: NapIssue[], overallScore: number): string[] {
  const recommendations: string[] = []

  // High priority issues
  const highPriorityIssues = issues.filter(i => i.severity === 'high')
  if (highPriorityIssues.length > 0) {
    recommendations.push(
      `Fix ${highPriorityIssues.length} critical NAP inconsistencies immediately. These can confuse AI systems.`
    )
  }

  // Phone number issues
  const phoneIssues = issues.filter(i => i.field === 'phone')
  if (phoneIssues.length > 0) {
    recommendations.push(
      'Standardize phone number format across all listings to +41 XX XXX XX XX format.'
    )
  }

  // Name variations
  const nameIssues = issues.filter(i => i.field === 'name')
  if (nameIssues.length > 0) {
    recommendations.push(
      'Use your exact legal business name consistently. Minor variations can fragment your entity identity.'
    )
  }

  // Address issues
  const addressIssues = issues.filter(i => i.field === 'address')
  if (addressIssues.length > 0) {
    recommendations.push(
      'Standardize address format. Use consistent abbreviations (Str. vs Strasse, etc.).'
    )
  }

  // Overall score recommendations
  if (overallScore < 50) {
    recommendations.push(
      'Your NAP consistency is critical. AI systems may not recognize your business as a single entity.'
    )
  } else if (overallScore < 70) {
    recommendations.push(
      'Improve NAP consistency to strengthen your entity identity in AI systems.'
    )
  } else if (overallScore < 90) {
    recommendations.push(
      'Good NAP consistency. Focus on the remaining inconsistencies for optimal AI visibility.'
    )
  }

  return recommendations
}

/**
 * Build canonical NAP from business data
 */
export function buildCanonicalNap(business: {
  name: string
  addressStreet?: string | null
  addressCity?: string | null
  addressPostal?: string | null
  addressCanton?: string | null
  phone?: string | null
}): NapData {
  // Build address string
  const addressParts = []
  if (business.addressStreet) {
    addressParts.push(business.addressStreet)
  }
  if (business.addressPostal && business.addressCity) {
    addressParts.push(`${business.addressPostal} ${business.addressCity}`)
  } else if (business.addressCity) {
    addressParts.push(business.addressCity)
  }
  if (business.addressCanton) {
    addressParts.push(business.addressCanton)
  }

  return {
    name: business.name,
    address: addressParts.join(', '),
    phone: business.phone ? normalizePhoneNumber(business.phone) : '',
  }
}

/**
 * Format NAP for display
 */
export function formatNapForDisplay(nap: NapData): string {
  const parts = []
  if (nap.name) parts.push(`Name: ${nap.name}`)
  if (nap.address) parts.push(`Address: ${nap.address}`)
  if (nap.phone) parts.push(`Phone: ${nap.phone}`)
  return parts.join('\n')
}
