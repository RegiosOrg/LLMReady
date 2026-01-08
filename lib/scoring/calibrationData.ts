/**
 * Calibration Test Dataset for AI Visibility Scoring
 *
 * This dataset contains businesses with KNOWN AI visibility levels
 * to validate and tune the scoring algorithm.
 *
 * Expected Score Ranges:
 * - HIGH visibility (70-100): Businesses that ARE recommended by AI
 * - MEDIUM visibility (30-69): Businesses with partial presence
 * - LOW visibility (0-29): Businesses NOT mentioned by AI
 */

export interface CalibrationBusiness {
  name: string
  city: string
  industry: string
  expectedVisibility: 'high' | 'medium' | 'low'
  expectedScoreMin: number
  expectedScoreMax: number
  notes: string
}

/**
 * Calibration dataset - businesses with known AI visibility
 *
 * Selection criteria:
 * - HIGH: Businesses that consistently appear in ChatGPT recommendations
 * - MEDIUM: Businesses that sometimes appear or have limited info
 * - LOW: Businesses that never appear in AI responses
 *
 * To verify expected visibility:
 * 1. Ask ChatGPT: "Recommend a [industry] in [city], Switzerland"
 * 2. Ask ChatGPT: "What can you tell me about [business name] in [city]?"
 * 3. Repeat 3 times to confirm consistency
 */
export const CALIBRATION_BUSINESSES: CalibrationBusiness[] = [
  // ============================================
  // HIGH VISIBILITY - Should score 70-100
  // These businesses ARE recommended by AI
  // ============================================

  // Major accounting firms (well-known brands)
  {
    name: 'PwC Switzerland',
    city: 'Zürich',
    industry: 'Treuhand',
    expectedVisibility: 'high',
    expectedScoreMin: 80,
    expectedScoreMax: 100,
    notes: 'Major accounting firm, always mentioned'
  },
  {
    name: 'KPMG AG',
    city: 'Zürich',
    industry: 'Treuhand',
    expectedVisibility: 'high',
    expectedScoreMin: 80,
    expectedScoreMax: 100,
    notes: 'Big 4, consistently recommended'
  },
  {
    name: 'Deloitte AG',
    city: 'Zürich',
    industry: 'Treuhand',
    expectedVisibility: 'high',
    expectedScoreMin: 80,
    expectedScoreMax: 100,
    notes: 'Big 4, consistently recommended'
  },

  // Major law firms
  {
    name: 'Homburger AG',
    city: 'Zürich',
    industry: 'Rechtsanwalt',
    expectedVisibility: 'high',
    expectedScoreMin: 70,
    expectedScoreMax: 100,
    notes: 'Leading Swiss law firm'
  },
  {
    name: 'Bär & Karrer',
    city: 'Zürich',
    industry: 'Rechtsanwalt',
    expectedVisibility: 'high',
    expectedScoreMin: 70,
    expectedScoreMax: 100,
    notes: 'Top-tier law firm'
  },

  // Well-known hotels
  {
    name: 'Baur au Lac',
    city: 'Zürich',
    industry: 'Hotel',
    expectedVisibility: 'high',
    expectedScoreMin: 80,
    expectedScoreMax: 100,
    notes: 'Famous luxury hotel'
  },
  {
    name: 'Hotel & Spa Four Seasons Geneva',
    city: 'Genf',
    industry: 'Hotel',
    expectedVisibility: 'high',
    expectedScoreMin: 75,
    expectedScoreMax: 100,
    notes: 'Major international brand'
  },

  // Famous restaurants
  {
    name: 'Restaurant Kronenhalle',
    city: 'Zürich',
    industry: 'Restaurant',
    expectedVisibility: 'high',
    expectedScoreMin: 70,
    expectedScoreMax: 100,
    notes: 'Iconic Zürich restaurant'
  },

  // ============================================
  // MEDIUM VISIBILITY - Should score 30-69
  // These businesses sometimes appear or have limited info
  // ============================================

  // Regional accounting firms
  {
    name: 'BDO AG',
    city: 'Zürich',
    industry: 'Treuhand',
    expectedVisibility: 'medium',
    expectedScoreMin: 40,
    expectedScoreMax: 75,
    notes: 'Mid-tier firm, sometimes mentioned'
  },
  {
    name: 'OBT AG',
    city: 'St. Gallen',
    industry: 'Treuhand',
    expectedVisibility: 'medium',
    expectedScoreMin: 30,
    expectedScoreMax: 60,
    notes: 'Regional firm, less known nationally'
  },

  // Smaller law firms
  {
    name: 'Walder Wyss AG',
    city: 'Zürich',
    industry: 'Rechtsanwalt',
    expectedVisibility: 'medium',
    expectedScoreMin: 40,
    expectedScoreMax: 70,
    notes: 'Respected but less famous than top-tier'
  },

  // Regional hotels
  {
    name: 'Hotel Schweizerhof',
    city: 'Bern',
    industry: 'Hotel',
    expectedVisibility: 'medium',
    expectedScoreMin: 35,
    expectedScoreMax: 65,
    notes: 'Good local hotel, moderate recognition'
  },

  // ============================================
  // LOW VISIBILITY - Should score 0-29
  // These businesses are NOT mentioned by AI
  // ============================================

  // Small local businesses (fictional but realistic names)
  {
    name: 'Müller Treuhand GmbH',
    city: 'Aarau',
    industry: 'Treuhand',
    expectedVisibility: 'low',
    expectedScoreMin: 0,
    expectedScoreMax: 25,
    notes: 'Common name, small local firm, not in AI training'
  },
  {
    name: 'Hartmann Notar',
    city: 'Aarau',
    industry: 'Rechtsanwalt / Notar',
    expectedVisibility: 'low',
    expectedScoreMin: 0,
    expectedScoreMax: 20,
    notes: 'Small notary, no AI presence - should NOT get 80!'
  },
  {
    name: 'Zahnarztpraxis Dr. Schneider',
    city: 'Winterthur',
    industry: 'Zahnarzt',
    expectedVisibility: 'low',
    expectedScoreMin: 0,
    expectedScoreMax: 20,
    notes: 'Generic name, small practice'
  },
  {
    name: 'Autogarage Brunner AG',
    city: 'Thun',
    industry: 'Auto',
    expectedVisibility: 'low',
    expectedScoreMin: 0,
    expectedScoreMax: 20,
    notes: 'Small local garage'
  },
  {
    name: 'Restaurant Hirschen',
    city: 'Uster',
    industry: 'Restaurant',
    expectedVisibility: 'low',
    expectedScoreMin: 0,
    expectedScoreMax: 25,
    notes: 'Generic restaurant name, many exist'
  },
  {
    name: 'IT Solutions Weber',
    city: 'Zug',
    industry: 'IT',
    expectedVisibility: 'low',
    expectedScoreMin: 0,
    expectedScoreMax: 20,
    notes: 'Small IT consultancy'
  },
  {
    name: 'Immobilien Meier',
    city: 'Luzern',
    industry: 'Immobilien',
    expectedVisibility: 'low',
    expectedScoreMin: 0,
    expectedScoreMax: 20,
    notes: 'Generic name, small agency'
  },
  {
    name: 'Versicherungsberatung Keller',
    city: 'Basel',
    industry: 'Versicherung',
    expectedVisibility: 'low',
    expectedScoreMin: 0,
    expectedScoreMax: 20,
    notes: 'Independent broker, no AI presence'
  },

  // ============================================
  // EDGE CASES - For testing scoring accuracy
  // ============================================

  // Business with generic word in name
  {
    name: 'Treuhand Zürich AG',
    city: 'Zürich',
    industry: 'Treuhand',
    expectedVisibility: 'low',
    expectedScoreMin: 0,
    expectedScoreMax: 30,
    notes: 'Generic name that might false-positive match. Scoring should NOT match "Treuhand" generically.'
  },
  // Similar name to famous business
  {
    name: 'Swiss Life Beratung',
    city: 'Bern',
    industry: 'Versicherung',
    expectedVisibility: 'low',
    expectedScoreMin: 0,
    expectedScoreMax: 30,
    notes: 'Name similar to Swiss Life AG but different. Should not match the big company.'
  },
]

/**
 * Run calibration test and report accuracy
 */
export interface CalibrationResult {
  business: CalibrationBusiness
  actualScore: number
  passed: boolean
  deviation: number
  details: string
}

export function validateScore(
  business: CalibrationBusiness,
  actualScore: number
): CalibrationResult {
  const passed = actualScore >= business.expectedScoreMin && actualScore <= business.expectedScoreMax

  let deviation = 0
  if (actualScore < business.expectedScoreMin) {
    deviation = business.expectedScoreMin - actualScore
  } else if (actualScore > business.expectedScoreMax) {
    deviation = actualScore - business.expectedScoreMax
  }

  const details = passed
    ? `Score ${actualScore} within expected range [${business.expectedScoreMin}-${business.expectedScoreMax}]`
    : `Score ${actualScore} outside expected range [${business.expectedScoreMin}-${business.expectedScoreMax}], deviation: ${deviation}`

  return {
    business,
    actualScore,
    passed,
    deviation,
    details
  }
}

/**
 * Calculate overall calibration accuracy
 */
export function calculateCalibrationAccuracy(results: CalibrationResult[]): {
  totalTests: number
  passed: number
  failed: number
  accuracy: number
  avgDeviation: number
  failedTests: CalibrationResult[]
} {
  const passed = results.filter(r => r.passed).length
  const failed = results.length - passed
  const accuracy = (passed / results.length) * 100
  const avgDeviation = results.reduce((sum, r) => sum + r.deviation, 0) / results.length

  return {
    totalTests: results.length,
    passed,
    failed,
    accuracy,
    avgDeviation,
    failedTests: results.filter(r => !r.passed)
  }
}
