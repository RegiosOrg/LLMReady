/**
 * AI Visibility Scoring System v2
 *
 * Scoring Philosophy:
 * - Only count EXACT or very close business name matches as "mentioned"
 * - Differentiate between being RECOMMENDED vs merely ACKNOWLEDGED
 * - Consider position in recommendations (1st vs 5th)
 * - Detect "I don't have information" responses
 * - Calibrated against real-world test data
 */

export interface MentionAnalysis {
  mentioned: boolean
  mentionType: 'exact' | 'partial' | 'acknowledged' | 'none'
  position: number | null  // Position in list (1 = first recommendation)
  hasRealInfo: boolean     // Does AI have actual info vs generic filler?
  sentiment: 'positive' | 'neutral' | 'negative' | 'unknown'
  confidence: number       // 0-100 confidence in the analysis
}

export interface ScoreBreakdown {
  mentionScore: number      // 0-40: Is business mentioned?
  positionScore: number     // 0-25: Position in recommendations
  infoQualityScore: number  // 0-20: Quality of info provided
  sentimentScore: number    // 0-15: Sentiment of mention
  total: number             // 0-100: Overall score
  explanation: string       // Human-readable explanation
}

/**
 * Strict business name matching
 * Only matches if the ACTUAL business name appears, not just common words
 */
export function analyzeNameMention(
  response: string,
  businessName: string
): { mentioned: boolean; mentionType: 'exact' | 'partial' | 'none'; position: number | null } {
  const responseLower = response.toLowerCase()
  const nameLower = businessName.toLowerCase().trim()

  // 1. Check for EXACT match (highest confidence)
  if (responseLower.includes(nameLower)) {
    const position = findPositionInList(response, businessName)
    return { mentioned: true, mentionType: 'exact', position }
  }

  // 2. Check for close variations (e.g., "Hartmann Notar" vs "Notar Hartmann")
  const nameWords = nameLower.split(/\s+/).filter(w => w.length > 2)

  // For short names (1-2 significant words), require ALL words to appear close together
  if (nameWords.length <= 2) {
    // Check if all significant words appear within 50 characters of each other
    const significantWords = nameWords.filter(w => !isGenericWord(w))
    if (significantWords.length >= 1) {
      const allSignificantFound = significantWords.every(word => responseLower.includes(word))
      if (allSignificantFound && significantWords.length > 0) {
        // Verify words are close together (likely referring to same entity)
        const firstWordPos = responseLower.indexOf(significantWords[0])
        if (significantWords.length === 1) {
          // Single significant word - could be the business
          const position = findPositionInList(response, significantWords[0])
          return { mentioned: true, mentionType: 'partial', position }
        }
        const lastWordPos = responseLower.lastIndexOf(significantWords[significantWords.length - 1])
        if (Math.abs(lastWordPos - firstWordPos) < 50) {
          const position = findPositionInList(response, significantWords[0])
          return { mentioned: true, mentionType: 'partial', position }
        }
      }
    }
  }

  // 3. For longer names, require at least 2 significant words together
  if (nameWords.length > 2) {
    const significantWords = nameWords.filter(w => !isGenericWord(w))
    const foundCount = significantWords.filter(w => responseLower.includes(w)).length
    if (foundCount >= 2 && foundCount >= significantWords.length * 0.6) {
      const position = findPositionInList(response, significantWords[0])
      return { mentioned: true, mentionType: 'partial', position }
    }
  }

  return { mentioned: false, mentionType: 'none', position: null }
}

/**
 * Words that are too generic to count as business name matches
 * Includes common industry terms, legal suffixes, etc.
 */
function isGenericWord(word: string): boolean {
  const genericWords = new Set([
    // Legal suffixes
    'ag', 'gmbh', 'sarl', 'sa', 'ltd', 'llc', 'inc', 'co', 'kg',
    // Industry terms (German/French/English)
    'treuhand', 'notar', 'notariat', 'notaire', 'anwalt', 'avocat', 'lawyer', 'attorney',
    'zahnarzt', 'dentist', 'dentiste', 'arzt', 'doctor', 'médecin', 'praxis', 'kanzlei',
    'immobilien', 'immobilier', 'real', 'estate', 'maison',
    'restaurant', 'hotel', 'gastro', 'garage', 'auto',
    'versicherung', 'assurance', 'insurance', 'finance', 'bank',
    'it', 'software', 'tech', 'digital', 'consulting', 'beratung',
    // Common location terms
    'zürich', 'zurich', 'genf', 'geneva', 'genève', 'basel', 'bern', 'lausanne',
    'schweiz', 'switzerland', 'suisse', 'svizzera',
    // Generic business terms
    'services', 'solutions', 'group', 'partner', 'partners', 'team', 'firma', 'office',
    'büro', 'bureau', 'center', 'centre', 'professional', 'expert',
  ])
  return genericWords.has(word.toLowerCase())
}

/**
 * Find position of business in a numbered list
 * Returns 1 for first position, 2 for second, etc.
 */
function findPositionInList(response: string, searchTerm: string): number | null {
  const lines = response.split('\n')
  const searchLower = searchTerm.toLowerCase()

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase()
    if (line.includes(searchLower)) {
      // Check if this line starts with a number or bullet
      const match = line.match(/^[\s]*(?:(\d+)[.\):]|[-•*])/)
      if (match && match[1]) {
        return parseInt(match[1])
      }
      // Estimate position based on line number
      return Math.min(i + 1, 5)
    }
  }
  return null
}

/**
 * Detect if AI response contains actual business information
 * vs generic filler or "I don't know" responses
 */
export function hasRealBusinessInfo(response: string, businessName: string): boolean {
  const responseLower = response.toLowerCase()

  // Negative indicators - AI doesn't have real info
  const noInfoPhrases = [
    "i don't have",
    "i do not have",
    "i couldn't find",
    "i could not find",
    "no specific information",
    "not have information",
    "unable to find",
    "cannot provide specific",
    "don't have access to",
    "no data available",
    "i'm not aware of",
    "i am not aware of",
    "would need to search",
    "recommend checking",
    "suggest visiting",
    "contact them directly",
    "verify this information",
    "as of my knowledge cutoff",
    "my knowledge cutoff",
  ]

  const hasNoInfo = noInfoPhrases.some(phrase => responseLower.includes(phrase))
  if (hasNoInfo) return false

  // Positive indicators - AI has real info
  const hasAddress = /\d{4}\s+\w+/.test(response)  // Swiss postal code pattern
  const hasWebsite = /\.(ch|com|swiss|org)/.test(responseLower)
  const hasPhone = /(\+41|0\d{2})[\s.-]?\d/.test(response)
  const hasSpecificServices = response.split(',').length > 2  // Lists specific services

  // If we have concrete details, it's real info
  if (hasAddress || hasWebsite || hasPhone) return true

  // If response is very generic (short, no specifics), it's not real info
  if (response.length < 200 && !hasSpecificServices) return false

  return true
}

/**
 * Analyze sentiment of business mention
 */
export function analyzeSentiment(
  response: string,
  businessName: string
): 'positive' | 'neutral' | 'negative' | 'unknown' {
  const responseLower = response.toLowerCase()
  const nameLower = businessName.toLowerCase()

  // Find context around business mention (100 chars before and after)
  const nameIndex = responseLower.indexOf(nameLower)
  if (nameIndex === -1) return 'unknown'

  const contextStart = Math.max(0, nameIndex - 100)
  const contextEnd = Math.min(responseLower.length, nameIndex + nameLower.length + 100)
  const context = responseLower.slice(contextStart, contextEnd)

  const positiveWords = [
    'recommend', 'excellent', 'trusted', 'reliable', 'professional',
    'quality', 'reputable', 'highly', 'best', 'top', 'leading',
    'experienced', 'specialized', 'expert'
  ]

  const negativeWords = [
    'avoid', 'poor', 'bad', 'negative', 'complaints', 'issues',
    'problems', 'unreliable', 'not recommended'
  ]

  const positiveCount = positiveWords.filter(w => context.includes(w)).length
  const negativeCount = negativeWords.filter(w => context.includes(w)).length

  if (negativeCount > 0) return 'negative'
  if (positiveCount >= 2) return 'positive'
  if (positiveCount === 1) return 'neutral'
  return 'neutral'
}

/**
 * Calculate comprehensive visibility score
 */
export function calculateVisibilityScore(
  response: string,
  businessName: string,
  promptType: 'local_search' | 'direct_query'
): ScoreBreakdown {
  const nameAnalysis = analyzeNameMention(response, businessName)
  const hasRealInfo = hasRealBusinessInfo(response, businessName)
  const sentiment = nameAnalysis.mentioned ? analyzeSentiment(response, businessName) : 'unknown'

  let mentionScore = 0
  let positionScore = 0
  let infoQualityScore = 0
  let sentimentScore = 0
  let explanation = ''

  if (!nameAnalysis.mentioned) {
    // Business not mentioned at all
    mentionScore = 0
    explanation = 'Business was not mentioned in AI response.'

    return {
      mentionScore: 0,
      positionScore: 0,
      infoQualityScore: 0,
      sentimentScore: 0,
      total: 0,
      explanation
    }
  }

  // Mention Score (0-40)
  if (nameAnalysis.mentionType === 'exact') {
    mentionScore = 40
    explanation = 'Business name found exactly. '
  } else if (nameAnalysis.mentionType === 'partial') {
    mentionScore = 25
    explanation = 'Business name partially matched. '
  }

  // Position Score (0-25) - only for local search queries
  if (promptType === 'local_search' && nameAnalysis.position !== null) {
    if (nameAnalysis.position === 1) {
      positionScore = 25
      explanation += 'Listed as #1 recommendation. '
    } else if (nameAnalysis.position === 2) {
      positionScore = 20
      explanation += 'Listed as #2 recommendation. '
    } else if (nameAnalysis.position <= 3) {
      positionScore = 15
      explanation += `Listed as #${nameAnalysis.position} recommendation. `
    } else if (nameAnalysis.position <= 5) {
      positionScore = 10
      explanation += `Listed as #${nameAnalysis.position} recommendation. `
    } else {
      positionScore = 5
      explanation += 'Listed but not in top recommendations. '
    }
  } else if (promptType === 'direct_query') {
    // For direct queries, position is less relevant
    positionScore = nameAnalysis.mentioned ? 15 : 0
  }

  // Info Quality Score (0-20)
  if (hasRealInfo) {
    infoQualityScore = 20
    explanation += 'AI has real information about the business. '
  } else {
    infoQualityScore = 5
    explanation += 'AI has limited or generic information. '
  }

  // Sentiment Score (0-15)
  switch (sentiment) {
    case 'positive':
      sentimentScore = 15
      explanation += 'Positive sentiment.'
      break
    case 'neutral':
      sentimentScore = 10
      explanation += 'Neutral sentiment.'
      break
    case 'negative':
      sentimentScore = 0
      explanation += 'Negative sentiment detected.'
      break
    default:
      sentimentScore = 5
  }

  const total = mentionScore + positionScore + infoQualityScore + sentimentScore

  return {
    mentionScore,
    positionScore,
    infoQualityScore,
    sentimentScore,
    total,
    explanation: explanation.trim()
  }
}

/**
 * Overall score interpretation
 */
export function interpretScore(score: number): {
  rating: 'excellent' | 'good' | 'fair' | 'poor' | 'invisible'
  color: 'green' | 'lime' | 'amber' | 'orange' | 'red'
  description: string
} {
  if (score >= 80) {
    return {
      rating: 'excellent',
      color: 'green',
      description: 'Your business is highly visible and well-recommended by AI assistants.'
    }
  } else if (score >= 60) {
    return {
      rating: 'good',
      color: 'lime',
      description: 'Your business has good AI visibility with room for improvement.'
    }
  } else if (score >= 40) {
    return {
      rating: 'fair',
      color: 'amber',
      description: 'Your business has partial AI visibility. Optimization recommended.'
    }
  } else if (score >= 20) {
    return {
      rating: 'poor',
      color: 'orange',
      description: 'Your business has limited AI visibility. Action needed.'
    }
  } else {
    return {
      rating: 'invisible',
      color: 'red',
      description: 'Your business is not visible to AI assistants. Immediate action required.'
    }
  }
}
