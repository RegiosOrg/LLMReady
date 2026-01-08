/**
 * AI Visibility Scoring Calibration Test
 *
 * Tests ~90 businesses across 10 industries and multiple cities
 * to validate scoring accuracy and establish baseline metrics.
 *
 * Usage: node scripts/calibration-test.mjs
 *
 * Output: CSV file with all results + summary statistics
 */

import * as fs from 'fs'

const API_URL = process.env.API_URL || 'https://getcitedby.com/api/audit'
const DELAY_MS = 2500 // Delay between requests to avoid rate limiting

// ============================================
// TEST DATA: 10 Industries × 3 Cities × 3 Businesses = 90 tests
// ============================================

const TEST_BUSINESSES = [
  // ============================================
  // 1. TREUHAND (Accounting) - Zürich, Bern, Basel
  // ============================================
  { name: 'KPMG AG', city: 'Zürich', industry: 'Treuhand', industryKey: 'treuhand', expectedTier: 'high' },
  { name: 'BDO AG', city: 'Zürich', industry: 'Treuhand', industryKey: 'treuhand', expectedTier: 'medium' },
  { name: 'Müller Treuhand GmbH', city: 'Zürich', industry: 'Treuhand', industryKey: 'treuhand', expectedTier: 'low' },
  { name: 'PwC Switzerland', city: 'Bern', industry: 'Treuhand', industryKey: 'treuhand', expectedTier: 'high' },
  { name: 'Mattig-Suter und Partner', city: 'Bern', industry: 'Treuhand', industryKey: 'treuhand', expectedTier: 'medium' },
  { name: 'Treuhand Schneider AG', city: 'Bern', industry: 'Treuhand', industryKey: 'treuhand', expectedTier: 'low' },
  { name: 'Deloitte AG', city: 'Basel', industry: 'Treuhand', industryKey: 'treuhand', expectedTier: 'high' },
  { name: 'Rüegg Treuhand AG', city: 'Basel', industry: 'Treuhand', industryKey: 'treuhand', expectedTier: 'low' },
  { name: 'Fiducia Treuhand', city: 'Basel', industry: 'Treuhand', industryKey: 'treuhand', expectedTier: 'low' },

  // ============================================
  // 2. RECHTSANWALT (Lawyers) - Zürich, Genf, Lugano
  // ============================================
  { name: 'Homburger AG', city: 'Zürich', industry: 'Rechtsanwalt', industryKey: 'anwalt', expectedTier: 'high' },
  { name: 'Bär & Karrer', city: 'Zürich', industry: 'Rechtsanwalt', industryKey: 'anwalt', expectedTier: 'high' },
  { name: 'Kanzlei Weber & Partner', city: 'Zürich', industry: 'Rechtsanwalt', industryKey: 'anwalt', expectedTier: 'low' },
  { name: 'Lenz & Staehelin', city: 'Genf', industry: 'Avocat', industryKey: 'anwalt', expectedTier: 'high' },
  { name: 'BCCC Avocats', city: 'Genf', industry: 'Avocat', industryKey: 'anwalt', expectedTier: 'medium' },
  { name: 'Cabinet Juridique Martin', city: 'Genf', industry: 'Avocat', industryKey: 'anwalt', expectedTier: 'low' },
  { name: 'Studio Legale Bentivoglio', city: 'Lugano', industry: 'Avvocato', industryKey: 'anwalt', expectedTier: 'medium' },
  { name: 'Walder Wyss', city: 'Lugano', industry: 'Avvocato', industryKey: 'anwalt', expectedTier: 'medium' },
  { name: 'Avvocato Rossi', city: 'Lugano', industry: 'Avvocato', industryKey: 'anwalt', expectedTier: 'low' },

  // ============================================
  // 3. ZAHNARZT (Dentists) - Zürich, Lausanne, Winterthur
  // ============================================
  { name: 'Zahnklinik Zürich', city: 'Zürich', industry: 'Zahnarzt', industryKey: 'zahnarzt', expectedTier: 'medium' },
  { name: 'Swiss Smile', city: 'Zürich', industry: 'Zahnarzt', industryKey: 'zahnarzt', expectedTier: 'medium' },
  { name: 'Zahnarztpraxis Dr. Keller', city: 'Zürich', industry: 'Zahnarzt', industryKey: 'zahnarzt', expectedTier: 'low' },
  { name: 'Centre Dentaire de Lausanne', city: 'Lausanne', industry: 'Dentiste', industryKey: 'zahnarzt', expectedTier: 'medium' },
  { name: 'Clinique Dentaire du Flon', city: 'Lausanne', industry: 'Dentiste', industryKey: 'zahnarzt', expectedTier: 'low' },
  { name: 'Cabinet Dr. Dupont', city: 'Lausanne', industry: 'Dentiste', industryKey: 'zahnarzt', expectedTier: 'low' },
  { name: 'Zahnärzte Winterthur', city: 'Winterthur', industry: 'Zahnarzt', industryKey: 'zahnarzt', expectedTier: 'low' },
  { name: 'Zahnarzt Altstadt', city: 'Winterthur', industry: 'Zahnarzt', industryKey: 'zahnarzt', expectedTier: 'low' },
  { name: 'Praxis Dr. Meier', city: 'Winterthur', industry: 'Zahnarzt', industryKey: 'zahnarzt', expectedTier: 'low' },

  // ============================================
  // 4. IMMOBILIEN (Real Estate) - Zürich, Genf, Zug
  // ============================================
  { name: 'Wüest Partner', city: 'Zürich', industry: 'Immobilien', industryKey: 'immobilien', expectedTier: 'high' },
  { name: 'CBRE Switzerland', city: 'Zürich', industry: 'Immobilien', industryKey: 'immobilien', expectedTier: 'high' },
  { name: 'Immo Invest Zürich', city: 'Zürich', industry: 'Immobilien', industryKey: 'immobilien', expectedTier: 'low' },
  { name: 'SPG Intercity Geneva', city: 'Genf', industry: 'Immobilier', industryKey: 'immobilien', expectedTier: 'medium' },
  { name: 'Naef Immobilier', city: 'Genf', industry: 'Immobilier', industryKey: 'immobilien', expectedTier: 'medium' },
  { name: 'Agence Immobilière Léman', city: 'Genf', industry: 'Immobilier', industryKey: 'immobilien', expectedTier: 'low' },
  { name: 'Zug Estates', city: 'Zug', industry: 'Immobilien', industryKey: 'immobilien', expectedTier: 'medium' },
  { name: 'Immobilien Zug AG', city: 'Zug', industry: 'Immobilien', industryKey: 'immobilien', expectedTier: 'low' },
  { name: 'Wohntraum Zug', city: 'Zug', industry: 'Immobilien', industryKey: 'immobilien', expectedTier: 'low' },

  // ============================================
  // 5. RESTAURANT - Zürich, Genf, Luzern
  // ============================================
  { name: 'Restaurant Kronenhalle', city: 'Zürich', industry: 'Restaurant', industryKey: 'restaurant', expectedTier: 'high' },
  { name: 'Haus Hiltl', city: 'Zürich', industry: 'Restaurant', industryKey: 'restaurant', expectedTier: 'high' },
  { name: 'Restaurant zum Löwen', city: 'Zürich', industry: 'Restaurant', industryKey: 'restaurant', expectedTier: 'low' },
  { name: 'Café du Soleil', city: 'Genf', industry: 'Restaurant', industryKey: 'restaurant', expectedTier: 'medium' },
  { name: 'Brasserie du Bourg-de-Four', city: 'Genf', industry: 'Restaurant', industryKey: 'restaurant', expectedTier: 'medium' },
  { name: 'Le Petit Bistro', city: 'Genf', industry: 'Restaurant', industryKey: 'restaurant', expectedTier: 'low' },
  { name: 'Restaurant Galliker', city: 'Luzern', industry: 'Restaurant', industryKey: 'restaurant', expectedTier: 'medium' },
  { name: 'Old Swiss House', city: 'Luzern', industry: 'Restaurant', industryKey: 'restaurant', expectedTier: 'medium' },
  { name: 'Gasthof Hirschen', city: 'Luzern', industry: 'Restaurant', industryKey: 'restaurant', expectedTier: 'low' },

  // ============================================
  // 6. HOTEL - Zürich, Genf, Zermatt
  // ============================================
  { name: 'Baur au Lac', city: 'Zürich', industry: 'Hotel', industryKey: 'hotel', expectedTier: 'high' },
  { name: 'The Dolder Grand', city: 'Zürich', industry: 'Hotel', industryKey: 'hotel', expectedTier: 'high' },
  { name: 'Hotel Limmathof', city: 'Zürich', industry: 'Hotel', industryKey: 'hotel', expectedTier: 'low' },
  { name: 'Four Seasons Hotel des Bergues', city: 'Genf', industry: 'Hôtel', industryKey: 'hotel', expectedTier: 'high' },
  { name: 'Hotel Métropole', city: 'Genf', industry: 'Hôtel', industryKey: 'hotel', expectedTier: 'medium' },
  { name: 'Hôtel du Lac', city: 'Genf', industry: 'Hôtel', industryKey: 'hotel', expectedTier: 'low' },
  { name: 'The Omnia', city: 'Zermatt', industry: 'Hotel', industryKey: 'hotel', expectedTier: 'high' },
  { name: 'Grand Hotel Zermatterhof', city: 'Zermatt', industry: 'Hotel', industryKey: 'hotel', expectedTier: 'high' },
  { name: 'Hotel Alpenblick', city: 'Zermatt', industry: 'Hotel', industryKey: 'hotel', expectedTier: 'low' },

  // ============================================
  // 7. AUTO (Car Dealers/Garages) - Zürich, Bern, St. Gallen
  // ============================================
  { name: 'AMAG Automobil', city: 'Zürich', industry: 'Auto', industryKey: 'auto', expectedTier: 'high' },
  { name: 'Emil Frey AG', city: 'Zürich', industry: 'Auto', industryKey: 'auto', expectedTier: 'high' },
  { name: 'Garage Müller', city: 'Zürich', industry: 'Auto', industryKey: 'auto', expectedTier: 'low' },
  { name: 'Autohaus Bern', city: 'Bern', industry: 'Auto', industryKey: 'auto', expectedTier: 'medium' },
  { name: 'Garage Central Bern', city: 'Bern', industry: 'Auto', industryKey: 'auto', expectedTier: 'low' },
  { name: 'Auto Weber AG', city: 'Bern', industry: 'Auto', industryKey: 'auto', expectedTier: 'low' },
  { name: 'Auto AG St. Gallen', city: 'St. Gallen', industry: 'Auto', industryKey: 'auto', expectedTier: 'medium' },
  { name: 'Garage Helvetia', city: 'St. Gallen', industry: 'Auto', industryKey: 'auto', expectedTier: 'low' },
  { name: 'Occasionen Brunner', city: 'St. Gallen', industry: 'Auto', industryKey: 'auto', expectedTier: 'low' },

  // ============================================
  // 8. VERSICHERUNG (Insurance) - Zürich, Basel, Winterthur
  // ============================================
  { name: 'Swiss Life', city: 'Zürich', industry: 'Versicherung', industryKey: 'versicherung', expectedTier: 'high' },
  { name: 'Zurich Insurance', city: 'Zürich', industry: 'Versicherung', industryKey: 'versicherung', expectedTier: 'high' },
  { name: 'Versicherung Meier', city: 'Zürich', industry: 'Versicherung', industryKey: 'versicherung', expectedTier: 'low' },
  { name: 'Baloise Group', city: 'Basel', industry: 'Versicherung', industryKey: 'versicherung', expectedTier: 'high' },
  { name: 'Sympany', city: 'Basel', industry: 'Versicherung', industryKey: 'versicherung', expectedTier: 'medium' },
  { name: 'Versicherungsberatung Keller', city: 'Basel', industry: 'Versicherung', industryKey: 'versicherung', expectedTier: 'low' },
  { name: 'AXA Winterthur', city: 'Winterthur', industry: 'Versicherung', industryKey: 'versicherung', expectedTier: 'high' },
  { name: 'Die Mobiliar', city: 'Winterthur', industry: 'Versicherung', industryKey: 'versicherung', expectedTier: 'high' },
  { name: 'Assekuranz Brunner', city: 'Winterthur', industry: 'Versicherung', industryKey: 'versicherung', expectedTier: 'low' },

  // ============================================
  // 9. IT / SOFTWARE - Zürich, Lausanne, Zug
  // ============================================
  { name: 'Google Switzerland', city: 'Zürich', industry: 'IT / Software', industryKey: 'it', expectedTier: 'high' },
  { name: 'Swisscom', city: 'Zürich', industry: 'IT / Software', industryKey: 'it', expectedTier: 'high' },
  { name: 'IT Solutions Weber', city: 'Zürich', industry: 'IT / Software', industryKey: 'it', expectedTier: 'low' },
  { name: 'Logitech', city: 'Lausanne', industry: 'IT / Software', industryKey: 'it', expectedTier: 'high' },
  { name: 'ELCA Informatique', city: 'Lausanne', industry: 'IT / Software', industryKey: 'it', expectedTier: 'medium' },
  { name: 'Digital Agency Léman', city: 'Lausanne', industry: 'IT / Software', industryKey: 'it', expectedTier: 'low' },
  { name: 'Crypto Valley Labs', city: 'Zug', industry: 'IT / Software', industryKey: 'it', expectedTier: 'medium' },
  { name: 'Ethereum Foundation', city: 'Zug', industry: 'IT / Software', industryKey: 'it', expectedTier: 'high' },
  { name: 'Software Startup Zug', city: 'Zug', industry: 'IT / Software', industryKey: 'it', expectedTier: 'low' },

  // ============================================
  // 10. HANDWERK (Craftsmen/Construction) - Zürich, Bern, Luzern
  // ============================================
  { name: 'Implenia', city: 'Zürich', industry: 'Handwerk / Bau', industryKey: 'handwerk', expectedTier: 'high' },
  { name: 'HRS Real Estate', city: 'Zürich', industry: 'Handwerk / Bau', industryKey: 'handwerk', expectedTier: 'medium' },
  { name: 'Schreinerei Müller', city: 'Zürich', industry: 'Handwerk / Bau', industryKey: 'handwerk', expectedTier: 'low' },
  { name: 'Losinger Marazzi', city: 'Bern', industry: 'Handwerk / Bau', industryKey: 'handwerk', expectedTier: 'medium' },
  { name: 'Baumeister Keller AG', city: 'Bern', industry: 'Handwerk / Bau', industryKey: 'handwerk', expectedTier: 'low' },
  { name: 'Elektro Schmidt', city: 'Bern', industry: 'Handwerk / Bau', industryKey: 'handwerk', expectedTier: 'low' },
  { name: 'Anliker AG', city: 'Luzern', industry: 'Handwerk / Bau', industryKey: 'handwerk', expectedTier: 'medium' },
  { name: 'Sanitär Weber', city: 'Luzern', industry: 'Handwerk / Bau', industryKey: 'handwerk', expectedTier: 'low' },
  { name: 'Malerei Brunner', city: 'Luzern', industry: 'Handwerk / Bau', industryKey: 'handwerk', expectedTier: 'low' },
]

// ============================================
// TEST RUNNER
// ============================================

async function runTest(business) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        businessName: business.name,
        city: business.city,
        industry: business.industry,
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const data = await response.json()

    const localResult = data.results?.find(r => r.prompt?.includes('recommend'))
    const directResult = data.results?.find(r => r.prompt?.includes('tell me about'))

    return {
      business,
      overallScore: data.overallScore || 0,
      mentionedIn: data.mentionedIn || '0/0',
      localSearchScore: localResult?.score || 0,
      directQueryScore: directResult?.score || 0,
      rating: data.interpretation?.rating || 'unknown',
      timestamp: data.timestamp || new Date().toISOString(),
    }
  } catch (error) {
    return {
      business,
      overallScore: -1,
      mentionedIn: 'error',
      localSearchScore: -1,
      directQueryScore: -1,
      rating: 'error',
      timestamp: new Date().toISOString(),
      error: error.message || 'Unknown error',
    }
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function runAllTests() {
  const results = []
  const total = TEST_BUSINESSES.length

  console.log(`\n🧪 Starting AI Visibility Calibration Test`)
  console.log(`📊 Testing ${total} businesses across 10 industries\n`)
  console.log('─'.repeat(70))

  for (let i = 0; i < TEST_BUSINESSES.length; i++) {
    const business = TEST_BUSINESSES[i]
    const progress = `[${i + 1}/${total}]`

    process.stdout.write(`${progress} Testing: ${business.name.padEnd(35)} `)

    const result = await runTest(business)
    results.push(result)

    if (result.error) {
      console.log(`❌ Error: ${result.error}`)
    } else {
      const scoreEmoji = result.overallScore >= 60 ? '🟢' : result.overallScore >= 30 ? '🟡' : '🔴'
      console.log(`${scoreEmoji} ${String(result.overallScore).padStart(3)} (${result.rating})`)
    }

    if (i < TEST_BUSINESSES.length - 1) {
      await sleep(DELAY_MS)
    }
  }

  return results
}

function generateStatistics(results) {
  const validResults = results.filter(r => r.overallScore >= 0)

  if (validResults.length === 0) {
    console.log('\n❌ No valid results to analyze')
    return
  }

  console.log('\n' + '═'.repeat(70))
  console.log('📈 CALIBRATION RESULTS SUMMARY')
  console.log('═'.repeat(70))

  const scores = validResults.map(r => r.overallScore)
  const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length
  const minScore = Math.min(...scores)
  const maxScore = Math.max(...scores)

  console.log(`\n📊 Overall Statistics:`)
  console.log(`   Total tests: ${results.length}`)
  console.log(`   Successful: ${validResults.length}`)
  console.log(`   Failed: ${results.length - validResults.length}`)
  console.log(`   Average score: ${avgScore.toFixed(1)}`)
  console.log(`   Min score: ${minScore}`)
  console.log(`   Max score: ${maxScore}`)

  const tiers = {
    excellent: validResults.filter(r => r.overallScore >= 80).length,
    good: validResults.filter(r => r.overallScore >= 60 && r.overallScore < 80).length,
    fair: validResults.filter(r => r.overallScore >= 40 && r.overallScore < 60).length,
    poor: validResults.filter(r => r.overallScore >= 20 && r.overallScore < 40).length,
    invisible: validResults.filter(r => r.overallScore < 20).length,
  }

  console.log(`\n📊 Score Distribution:`)
  console.log(`   🟢 Excellent (80-100): ${tiers.excellent} (${((tiers.excellent / validResults.length) * 100).toFixed(1)}%)`)
  console.log(`   🟢 Good (60-79):       ${tiers.good} (${((tiers.good / validResults.length) * 100).toFixed(1)}%)`)
  console.log(`   🟡 Fair (40-59):       ${tiers.fair} (${((tiers.fair / validResults.length) * 100).toFixed(1)}%)`)
  console.log(`   🟠 Poor (20-39):       ${tiers.poor} (${((tiers.poor / validResults.length) * 100).toFixed(1)}%)`)
  console.log(`   🔴 Invisible (0-19):   ${tiers.invisible} (${((tiers.invisible / validResults.length) * 100).toFixed(1)}%)`)

  console.log(`\n📊 Results by Expected Tier:`)
  for (const tier of ['high', 'medium', 'low']) {
    const tierResults = validResults.filter(r => r.business.expectedTier === tier)
    if (tierResults.length > 0) {
      const tierAvg = tierResults.reduce((a, b) => a + b.overallScore, 0) / tierResults.length
      const tierScores = tierResults.map(r => r.overallScore).sort((a, b) => a - b)
      const median = tierScores[Math.floor(tierScores.length / 2)]
      console.log(`   Expected ${tier.toUpperCase().padEnd(6)}: avg ${tierAvg.toFixed(1).padStart(5)}, median ${String(median).padStart(3)} (n=${tierResults.length})`)
    }
  }

  console.log(`\n📊 Results by Industry:`)
  const industries = [...new Set(validResults.map(r => r.business.industryKey))]
  for (const industry of industries) {
    const industryResults = validResults.filter(r => r.business.industryKey === industry)
    const industryAvg = industryResults.reduce((a, b) => a + b.overallScore, 0) / industryResults.length
    console.log(`   ${industry.padEnd(12)}: avg ${industryAvg.toFixed(1).padStart(5)} (n=${industryResults.length})`)
  }

  const lowScoreBusinesses = validResults.filter(r => r.overallScore < 40)
  console.log(`\n🎯 Sales Opportunities (Score < 40): ${lowScoreBusinesses.length} businesses (${((lowScoreBusinesses.length / validResults.length) * 100).toFixed(1)}%)`)
  console.log(`   These businesses need AI visibility optimization!`)

  // Show worst performers
  console.log(`\n📉 Lowest Scores (potential leads):`)
  validResults
    .sort((a, b) => a.overallScore - b.overallScore)
    .slice(0, 10)
    .forEach((r, i) => {
      console.log(`   ${i + 1}. ${r.business.name} (${r.business.city}): ${r.overallScore}`)
    })
}

function exportToCSV(results, filename) {
  const headers = [
    'Business Name',
    'City',
    'Industry',
    'Industry Key',
    'Expected Tier',
    'Overall Score',
    'Local Search Score',
    'Direct Query Score',
    'Mentioned In',
    'Rating',
    'Timestamp',
    'Error',
  ]

  const rows = results.map(r => [
    r.business.name,
    r.business.city,
    r.business.industry,
    r.business.industryKey,
    r.business.expectedTier,
    r.overallScore,
    r.localSearchScore,
    r.directQueryScore,
    r.mentionedIn,
    r.rating,
    r.timestamp,
    r.error || '',
  ])

  const csv = [headers.join(','), ...rows.map(r => r.map(v => `"${v}"`).join(','))].join('\n')

  fs.writeFileSync(filename, csv, 'utf8')
  console.log(`\n💾 Results exported to: ${filename}`)
}

// ============================================
// MAIN
// ============================================

async function main() {
  const startTime = Date.now()

  console.log('═'.repeat(70))
  console.log('🔬 GetCitedBy AI Visibility Scoring Calibration')
  console.log('═'.repeat(70))
  console.log(`API URL: ${API_URL}`)
  console.log(`Test businesses: ${TEST_BUSINESSES.length}`)
  console.log(`Delay between requests: ${DELAY_MS}ms`)
  console.log(`Estimated time: ${Math.ceil((TEST_BUSINESSES.length * DELAY_MS) / 60000)} minutes`)

  const results = await runAllTests()

  generateStatistics(results)

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
  const csvFilename = `calibration-results-${timestamp}.csv`
  exportToCSV(results, csvFilename)

  const elapsed = ((Date.now() - startTime) / 1000 / 60).toFixed(1)
  console.log(`\n⏱️  Total time: ${elapsed} minutes`)
  console.log('═'.repeat(70))
}

main().catch(console.error)
