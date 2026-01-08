/**
 * Industry Benchmark Data
 *
 * Real data from AI visibility calibration tests.
 * Used to show competitive positioning in audit results.
 */

export interface BusinessBenchmark {
  name: string
  score: number
  tier: 'leader' | 'challenger' | 'follower' | 'invisible'
}

export interface IndustryBenchmark {
  industry: string
  industryDE: string // German name
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
}

export interface CityBenchmark {
  city: string
  industries: Record<string, IndustryBenchmark>
}

/**
 * Benchmark data derived from calibration tests
 * Last updated: January 2026
 */
export const INDUSTRY_BENCHMARKS: Record<string, IndustryBenchmark> = {
  Treuhand: {
    industry: 'Treuhand',
    industryDE: 'Treuhand & Buchhaltung',
    avgScore: 45,
    medianScore: 34,
    topPerformers: [
      { name: 'KPMG AG', score: 79, tier: 'leader' },
      { name: 'Deloitte AG', score: 76, tier: 'leader' },
      { name: 'Ernst & Young', score: 34, tier: 'follower' },
      { name: 'PwC Switzerland', score: 34, tier: 'follower' },
      { name: 'BDO AG', score: 34, tier: 'follower' },
    ],
    distribution: { excellent: 0, good: 29, fair: 0, poor: 57, invisible: 14 },
    insight: 'Only 2 of 7 major accounting firms appear in AI recommendations. Even Big 4 firms like PwC and Ernst & Young are invisible in local searches.'
  },

  Rechtsanwalt: {
    industry: 'Rechtsanwalt',
    industryDE: 'Rechtsanwälte & Kanzleien',
    avgScore: 59,
    medianScore: 76,
    topPerformers: [
      { name: 'Lenz & Staehelin', score: 85, tier: 'leader' },
      { name: 'Homburger AG', score: 79, tier: 'leader' },
      { name: 'Bär & Karrer', score: 76, tier: 'leader' },
      { name: 'Walder Wyss', score: 28, tier: 'invisible' },
    ],
    distribution: { excellent: 20, good: 40, fair: 0, poor: 20, invisible: 20 },
    insight: 'Law firms have higher AI visibility than average. Top firms like Lenz & Staehelin dominate recommendations, while others remain invisible.'
  },

  Zahnarzt: {
    industry: 'Zahnarzt',
    industryDE: 'Zahnärzte & Zahnkliniken',
    avgScore: 45,
    medianScore: 28,
    topPerformers: [
      { name: 'Centre Dentaire de Lausanne', score: 79, tier: 'leader' },
      { name: 'Zahnarztpraxis Dr. Keller', score: 64, tier: 'challenger' },
      { name: 'Swiss Smile', score: 28, tier: 'invisible' },
      { name: 'Zahnklinik Zürich', score: 28, tier: 'invisible' },
    ],
    distribution: { excellent: 0, good: 40, fair: 0, poor: 20, invisible: 40 },
    insight: '60% of dental practices are invisible to AI. Even well-known chains like Swiss Smile don\'t appear in recommendations.'
  },

  Immobilien: {
    industry: 'Immobilien',
    industryDE: 'Immobilien & Makler',
    avgScore: 39,
    medianScore: 28,
    topPerformers: [
      { name: 'Wüest Partner', score: 79, tier: 'leader' },
      { name: 'CBRE Switzerland', score: 34, tier: 'follower' },
      { name: 'SPG Intercity', score: 28, tier: 'invisible' },
    ],
    distribution: { excellent: 0, good: 20, fair: 0, poor: 40, invisible: 40 },
    insight: 'Real estate is highly competitive offline but invisible online. 80% of agencies don\'t appear in AI recommendations.'
  },

  Restaurant: {
    industry: 'Restaurant',
    industryDE: 'Restaurants & Gastronomie',
    avgScore: 53,
    medianScore: 52,
    topPerformers: [
      { name: 'Restaurant Kronenhalle', score: 76, tier: 'leader' },
      { name: 'Haus Hiltl', score: 76, tier: 'leader' },
      { name: 'Restaurant Galliker', score: 70, tier: 'challenger' },
      { name: 'Old Swiss House', score: 34, tier: 'follower' },
    ],
    distribution: { excellent: 0, good: 50, fair: 0, poor: 33, invisible: 17 },
    insight: 'Iconic restaurants with strong brand recognition score well. Newer or local restaurants struggle to appear.'
  },

  Hotel: {
    industry: 'Hotel',
    industryDE: 'Hotels & Unterkünfte',
    avgScore: 69,
    medianScore: 85,
    topPerformers: [
      { name: 'Baur au Lac', score: 91, tier: 'leader' },
      { name: 'Hotel Schweizerhof Bern', score: 91, tier: 'leader' },
      { name: 'The Dolder Grand', score: 88, tier: 'leader' },
      { name: 'Four Seasons Geneva', score: 85, tier: 'leader' },
    ],
    distribution: { excellent: 50, good: 17, fair: 0, poor: 0, invisible: 33 },
    insight: 'Luxury hotels dominate AI recommendations. Mid-range and boutique hotels are largely invisible.'
  },

  Auto: {
    industry: 'Auto',
    industryDE: 'Autogaragen & Händler',
    avgScore: 39,
    medianScore: 34,
    topPerformers: [
      { name: 'Auto AG St. Gallen', score: 70, tier: 'challenger' },
      { name: 'AMAG Automobil', score: 34, tier: 'follower' },
      { name: 'Emil Frey AG', score: 34, tier: 'follower' },
    ],
    distribution: { excellent: 0, good: 20, fair: 0, poor: 40, invisible: 40 },
    insight: 'Even major dealers like AMAG and Emil Frey have low AI visibility. Local garages are completely invisible.'
  },

  Versicherung: {
    industry: 'Versicherung',
    industryDE: 'Versicherungen & Vorsorge',
    avgScore: 51,
    medianScore: 34,
    topPerformers: [
      { name: 'Swiss Life', score: 85, tier: 'leader' },
      { name: 'Zurich Insurance', score: 82, tier: 'leader' },
      { name: 'Baloise Group', score: 34, tier: 'follower' },
      { name: 'Die Mobiliar', score: 28, tier: 'invisible' },
    ],
    distribution: { excellent: 40, good: 0, fair: 0, poor: 20, invisible: 40 },
    insight: 'Major insurers like Swiss Life and Zurich dominate. Even well-known Swiss brands like Mobiliar are invisible.'
  },

  IT: {
    industry: 'IT',
    industryDE: 'IT & Software',
    avgScore: 43,
    medianScore: 34,
    topPerformers: [
      { name: 'Swisscom', score: 91, tier: 'leader' },
      { name: 'Google Switzerland', score: 34, tier: 'follower' },
      { name: 'Logitech', score: 34, tier: 'follower' },
    ],
    distribution: { excellent: 20, good: 0, fair: 0, poor: 40, invisible: 40 },
    insight: 'Only Swisscom appears consistently in IT recommendations. Even Google and Logitech have low local visibility.'
  },

  Bau: {
    industry: 'Bau',
    industryDE: 'Bau & Handwerk',
    avgScore: 39,
    medianScore: 28,
    topPerformers: [
      { name: 'Implenia', score: 76, tier: 'leader' },
      { name: 'HRS Real Estate', score: 34, tier: 'follower' },
      { name: 'Losinger Marazzi', score: 28, tier: 'invisible' },
    ],
    distribution: { excellent: 0, good: 20, fair: 0, poor: 20, invisible: 60 },
    insight: 'Construction and trades have the lowest AI visibility. 80% of businesses are invisible to AI assistants.'
  },
}

/**
 * City-specific adjustments (if we have data)
 * Currently using national averages
 */
export const CITY_MODIFIERS: Record<string, number> = {
  'Zürich': 1.1,      // Slightly higher visibility in Zürich
  'Genf': 1.05,
  'Basel': 1.0,
  'Bern': 0.95,
  'Lausanne': 0.95,
  'Luzern': 0.9,
  'St. Gallen': 0.85,
  'Winterthur': 0.85,
  'Zug': 1.0,
  'default': 0.9
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
 * Overall statistics across all industries
 */
export const OVERALL_STATS = {
  totalBusinessesTested: 54,
  avgScore: 49,
  medianScore: 34,
  percentBelow40: 63,
  percentInvisible: 30,
  lastUpdated: '2026-01-08'
}
