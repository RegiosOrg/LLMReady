/**
 * Local Calibration Test - Direct API Calls
 *
 * This script calls OpenAI directly and uses the scoring functions
 * without going through the HTTP API (no rate limiting).
 *
 * Usage: node scripts/calibration-local.mjs
 */

import OpenAI from 'openai'
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

// Load environment variables manually
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')

function loadEnvFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    for (const line of content.split('\n')) {
      const trimmed = line.trim()
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=')
        if (key && valueParts.length > 0) {
          let value = valueParts.join('=')
          // Remove quotes
          if ((value.startsWith('"') && value.endsWith('"')) ||
              (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1)
          }
          process.env[key] = value
        }
      }
    }
  } catch (e) {
    // File doesn't exist, ignore
  }
}

loadEnvFile(path.join(projectRoot, '.env'))
loadEnvFile(path.join(projectRoot, '.env.local'))

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// ============================================
// SCORING FUNCTIONS (copied from visibilityScoring.ts)
// ============================================

function isGenericWord(word) {
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

function findPositionInList(response, searchTerm) {
  const lines = response.split('\n')
  const searchLower = searchTerm.toLowerCase()

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase()
    if (line.includes(searchLower)) {
      const match = line.match(/^[\s]*(?:(\d+)[.):]|[-•*])/)
      if (match && match[1]) {
        return parseInt(match[1])
      }
      return Math.min(i + 1, 5)
    }
  }
  return null
}

function analyzeNameMention(response, businessName) {
  const responseLower = response.toLowerCase()
  const nameLower = businessName.toLowerCase().trim()

  // 1. Check for EXACT match
  if (responseLower.includes(nameLower)) {
    const position = findPositionInList(response, businessName)
    return { mentioned: true, mentionType: 'exact', position }
  }

  // 2. Check for close variations
  const nameWords = nameLower.split(/\s+/).filter(w => w.length > 2)

  if (nameWords.length <= 2) {
    const significantWords = nameWords.filter(w => !isGenericWord(w))
    if (significantWords.length >= 1) {
      const allSignificantFound = significantWords.every(word => responseLower.includes(word))
      if (allSignificantFound && significantWords.length > 0) {
        const firstWordPos = responseLower.indexOf(significantWords[0])
        if (significantWords.length === 1) {
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

  // 3. For longer names
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

function hasRealBusinessInfo(response, businessName) {
  const responseLower = response.toLowerCase()

  const noInfoPhrases = [
    "i don't have", "i do not have", "i couldn't find", "i could not find",
    "no specific information", "not have information", "unable to find",
    "cannot provide specific", "don't have access to", "no data available",
    "i'm not aware of", "i am not aware of", "would need to search",
    "recommend checking", "suggest visiting", "contact them directly",
    "verify this information", "as of my knowledge cutoff", "my knowledge cutoff",
  ]

  const hasNoInfo = noInfoPhrases.some(phrase => responseLower.includes(phrase))
  if (hasNoInfo) return false

  const hasAddress = /\d{4}\s+\w+/.test(response)
  const hasWebsite = /\.(ch|com|swiss|org)/.test(responseLower)
  const hasPhone = /(\+41|0\d{2})[\s.-]?\d/.test(response)
  const hasSpecificServices = response.split(',').length > 2

  if (hasAddress || hasWebsite || hasPhone) return true
  if (response.length < 200 && !hasSpecificServices) return false

  return true
}

function analyzeSentiment(response, businessName) {
  const responseLower = response.toLowerCase()
  const nameLower = businessName.toLowerCase()

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

function calculateVisibilityScore(response, businessName, promptType) {
  const nameAnalysis = analyzeNameMention(response, businessName)
  const hasRealInfo = hasRealBusinessInfo(response, businessName)
  const sentiment = nameAnalysis.mentioned ? analyzeSentiment(response, businessName) : 'unknown'

  let mentionScore = 0
  let positionScore = 0
  let infoQualityScore = 0
  let sentimentScore = 0
  let explanation = ''

  if (!nameAnalysis.mentioned) {
    return {
      mentionScore: 0,
      positionScore: 0,
      infoQualityScore: 0,
      sentimentScore: 0,
      total: 0,
      explanation: 'Business was not mentioned in AI response.'
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

  // Position Score (0-25)
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

// ============================================
// TEST BUSINESSES
// ============================================

const TEST_BUSINESSES = [
  // TREUHAND
  { name: 'KPMG AG', city: 'Zürich', industry: 'Treuhand', expectedTier: 'high' },
  { name: 'BDO AG', city: 'Zürich', industry: 'Treuhand', expectedTier: 'medium' },
  { name: 'Müller Treuhand GmbH', city: 'Zürich', industry: 'Treuhand', expectedTier: 'low' },
  { name: 'PwC Switzerland', city: 'Bern', industry: 'Treuhand', expectedTier: 'high' },
  { name: 'Treuhand Schneider AG', city: 'Bern', industry: 'Treuhand', expectedTier: 'low' },
  { name: 'Deloitte AG', city: 'Basel', industry: 'Treuhand', expectedTier: 'high' },
  { name: 'Ernst & Young', city: 'Basel', industry: 'Treuhand', expectedTier: 'high' },

  // LAWYERS
  { name: 'Homburger AG', city: 'Zürich', industry: 'Rechtsanwalt', expectedTier: 'high' },
  { name: 'Bär & Karrer', city: 'Zürich', industry: 'Rechtsanwalt', expectedTier: 'high' },
  { name: 'Kanzlei Weber & Partner', city: 'Zürich', industry: 'Rechtsanwalt', expectedTier: 'low' },
  { name: 'Lenz & Staehelin', city: 'Genf', industry: 'Rechtsanwalt', expectedTier: 'high' },
  { name: 'Walder Wyss', city: 'Basel', industry: 'Rechtsanwalt', expectedTier: 'high' },

  // DENTISTS
  { name: 'Zahnklinik Zürich', city: 'Zürich', industry: 'Zahnarzt', expectedTier: 'medium' },
  { name: 'Swiss Smile', city: 'Zürich', industry: 'Zahnarzt', expectedTier: 'high' },
  { name: 'Zahnarztpraxis Dr. Keller', city: 'Zürich', industry: 'Zahnarzt', expectedTier: 'low' },
  { name: 'Centre Dentaire de Lausanne', city: 'Lausanne', industry: 'Zahnarzt', expectedTier: 'medium' },
  { name: 'Zahnärzte Winterthur', city: 'Winterthur', industry: 'Zahnarzt', expectedTier: 'low' },

  // REAL ESTATE
  { name: 'Wüest Partner', city: 'Zürich', industry: 'Immobilien', expectedTier: 'high' },
  { name: 'CBRE Switzerland', city: 'Zürich', industry: 'Immobilien', expectedTier: 'high' },
  { name: 'Immo Invest Zürich', city: 'Zürich', industry: 'Immobilien', expectedTier: 'low' },
  { name: 'SPG Intercity Geneva', city: 'Genf', industry: 'Immobilien', expectedTier: 'medium' },
  { name: 'Immobilien Meier AG', city: 'Basel', industry: 'Immobilien', expectedTier: 'low' },

  // RESTAURANTS
  { name: 'Restaurant Kronenhalle', city: 'Zürich', industry: 'Restaurant', expectedTier: 'high' },
  { name: 'Haus Hiltl', city: 'Zürich', industry: 'Restaurant', expectedTier: 'high' },
  { name: 'Restaurant zum Löwen', city: 'Zürich', industry: 'Restaurant', expectedTier: 'low' },
  { name: 'Café du Soleil', city: 'Genf', industry: 'Restaurant', expectedTier: 'low' },
  { name: 'Restaurant Galliker', city: 'Luzern', industry: 'Restaurant', expectedTier: 'medium' },
  { name: 'Old Swiss House', city: 'Luzern', industry: 'Restaurant', expectedTier: 'high' },

  // HOTELS
  { name: 'Baur au Lac', city: 'Zürich', industry: 'Hotel', expectedTier: 'high' },
  { name: 'The Dolder Grand', city: 'Zürich', industry: 'Hotel', expectedTier: 'high' },
  { name: 'Hotel Limmathof', city: 'Zürich', industry: 'Hotel', expectedTier: 'low' },
  { name: 'Four Seasons Hotel des Bergues', city: 'Genf', industry: 'Hotel', expectedTier: 'high' },
  { name: 'Hotel Schweizerhof', city: 'Bern', industry: 'Hotel', expectedTier: 'high' },
  { name: 'Grand Hotel Zermatterhof', city: 'Zermatt', industry: 'Hotel', expectedTier: 'high' },

  // AUTO/GARAGE
  { name: 'AMAG Automobil', city: 'Zürich', industry: 'Auto', expectedTier: 'high' },
  { name: 'Emil Frey AG', city: 'Zürich', industry: 'Auto', expectedTier: 'high' },
  { name: 'Garage Müller', city: 'Zürich', industry: 'Auto', expectedTier: 'low' },
  { name: 'Auto AG St. Gallen', city: 'St. Gallen', industry: 'Auto', expectedTier: 'medium' },
  { name: 'Garage Central', city: 'Bern', industry: 'Auto', expectedTier: 'low' },

  // INSURANCE
  { name: 'Swiss Life', city: 'Zürich', industry: 'Versicherung', expectedTier: 'high' },
  { name: 'Zurich Insurance', city: 'Zürich', industry: 'Versicherung', expectedTier: 'high' },
  { name: 'Versicherung Meier', city: 'Zürich', industry: 'Versicherung', expectedTier: 'low' },
  { name: 'Baloise Group', city: 'Basel', industry: 'Versicherung', expectedTier: 'high' },
  { name: 'Die Mobiliar', city: 'Bern', industry: 'Versicherung', expectedTier: 'high' },

  // IT
  { name: 'Google Switzerland', city: 'Zürich', industry: 'IT', expectedTier: 'high' },
  { name: 'Swisscom', city: 'Bern', industry: 'IT', expectedTier: 'high' },
  { name: 'IT Solutions Weber', city: 'Zürich', industry: 'IT', expectedTier: 'low' },
  { name: 'Logitech', city: 'Lausanne', industry: 'IT', expectedTier: 'high' },
  { name: 'Crypto Valley Labs', city: 'Zug', industry: 'IT', expectedTier: 'low' },

  // CONSTRUCTION/HANDWERK
  { name: 'Implenia', city: 'Zürich', industry: 'Bau', expectedTier: 'high' },
  { name: 'HRS Real Estate', city: 'Zürich', industry: 'Bau', expectedTier: 'medium' },
  { name: 'Schreinerei Müller', city: 'Zürich', industry: 'Bau', expectedTier: 'low' },
  { name: 'Losinger Marazzi', city: 'Bern', industry: 'Bau', expectedTier: 'high' },
  { name: 'Elektro Schmidt', city: 'Basel', industry: 'Bau', expectedTier: 'low' },
]

// ============================================
// MAIN TEST RUNNER
// ============================================

async function runAudit(business) {
  const { name, city, industry } = business

  const prompts = [
    {
      type: 'local_search',
      prompt: `I need a ${industry} in ${city}, Switzerland. Can you recommend some options?`,
    },
    {
      type: 'direct_query',
      prompt: `What can you tell me about ${name} in ${city}, Switzerland?`,
    },
  ]

  const results = []

  for (const { type, prompt } of prompts) {
    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that provides information about local businesses in Switzerland. Be specific and factual. If you don\'t have information about a specific business, clearly say so rather than making up information.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 800,
      })

      const response = completion.choices[0]?.message?.content || ''
      const scoreBreakdown = calculateVisibilityScore(response, name, type)
      const nameAnalysis = analyzeNameMention(response, name)

      results.push({
        type,
        prompt,
        response,
        mentioned: nameAnalysis.mentioned,
        score: scoreBreakdown.total,
        scoreBreakdown,
      })
    } catch (error) {
      console.error(`Error for ${name}:`, error.message)
      results.push({
        type,
        prompt,
        response: 'Error',
        mentioned: false,
        score: 0,
        scoreBreakdown: { total: 0 },
      })
    }
  }

  // Calculate overall score (weighted average)
  const localResult = results.find(r => r.type === 'local_search')
  const directResult = results.find(r => r.type === 'direct_query')

  const overallScore = Math.round(
    (localResult?.score || 0) * 0.6 +
    (directResult?.score || 0) * 0.4
  )

  return {
    ...business,
    overallScore,
    localScore: localResult?.score || 0,
    directScore: directResult?.score || 0,
    localMentioned: localResult?.mentioned || false,
    directMentioned: directResult?.mentioned || false,
    localResponse: localResult?.response || '',
    directResponse: directResult?.response || '',
  }
}

async function main() {
  console.log('═'.repeat(70))
  console.log('🔬 GetCitedBy AI Visibility Scoring - LOCAL Calibration Test')
  console.log('═'.repeat(70))
  console.log(`Test businesses: ${TEST_BUSINESSES.length}`)
  console.log(`Estimated time: ${Math.ceil(TEST_BUSINESSES.length * 3 / 60)} minutes\n`)

  const results = []
  const startTime = Date.now()

  for (let i = 0; i < TEST_BUSINESSES.length; i++) {
    const business = TEST_BUSINESSES[i]
    process.stdout.write(`[${i + 1}/${TEST_BUSINESSES.length}] Testing: ${business.name.padEnd(35)} `)

    const result = await runAudit(business)
    results.push(result)

    // Display result
    const scoreIcon = result.overallScore >= 80 ? '🟢' :
                      result.overallScore >= 60 ? '🟢' :
                      result.overallScore >= 40 ? '🟡' :
                      result.overallScore >= 20 ? '🟠' : '🔴'
    console.log(`${scoreIcon} ${result.overallScore.toString().padStart(3)}`)

    // Small delay between requests to not hit OpenAI rate limits
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  const endTime = Date.now()
  const duration = ((endTime - startTime) / 1000 / 60).toFixed(1)

  // Generate summary
  console.log('\n' + '═'.repeat(70))
  console.log('📈 CALIBRATION RESULTS SUMMARY')
  console.log('═'.repeat(70))

  // Overall stats
  const scores = results.map(r => r.overallScore)
  const avgScore = (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)
  const minScore = Math.min(...scores)
  const maxScore = Math.max(...scores)

  console.log(`\n📊 Overall Statistics:`)
  console.log(`   Total tests: ${results.length}`)
  console.log(`   Average score: ${avgScore}`)
  console.log(`   Min score: ${minScore}`)
  console.log(`   Max score: ${maxScore}`)

  // Score distribution
  const excellent = results.filter(r => r.overallScore >= 80).length
  const good = results.filter(r => r.overallScore >= 60 && r.overallScore < 80).length
  const fair = results.filter(r => r.overallScore >= 40 && r.overallScore < 60).length
  const poor = results.filter(r => r.overallScore >= 20 && r.overallScore < 40).length
  const invisible = results.filter(r => r.overallScore < 20).length

  console.log(`\n📊 Score Distribution:`)
  console.log(`   🟢 Excellent (80-100): ${excellent} (${(excellent/results.length*100).toFixed(1)}%)`)
  console.log(`   🟢 Good (60-79):       ${good} (${(good/results.length*100).toFixed(1)}%)`)
  console.log(`   🟡 Fair (40-59):       ${fair} (${(fair/results.length*100).toFixed(1)}%)`)
  console.log(`   🟠 Poor (20-39):       ${poor} (${(poor/results.length*100).toFixed(1)}%)`)
  console.log(`   🔴 Invisible (0-19):   ${invisible} (${(invisible/results.length*100).toFixed(1)}%)`)

  // By expected tier
  console.log(`\n📊 Results by Expected Tier:`)
  for (const tier of ['high', 'medium', 'low']) {
    const tierResults = results.filter(r => r.expectedTier === tier)
    if (tierResults.length > 0) {
      const tierScores = tierResults.map(r => r.overallScore)
      const tierAvg = (tierScores.reduce((a, b) => a + b, 0) / tierScores.length).toFixed(1)
      const tierMedian = tierScores.sort((a, b) => a - b)[Math.floor(tierScores.length / 2)]
      console.log(`   Expected ${tier.toUpperCase().padEnd(6)}: avg ${tierAvg.toString().padStart(5)}, median ${tierMedian.toString().padStart(3)} (n=${tierResults.length})`)
    }
  }

  // By industry
  console.log(`\n📊 Results by Industry:`)
  const industries = [...new Set(results.map(r => r.industry))]
  for (const industry of industries) {
    const indResults = results.filter(r => r.industry === industry)
    const indAvg = (indResults.reduce((a, b) => a + b.overallScore, 0) / indResults.length).toFixed(1)
    console.log(`   ${industry.padEnd(15)}: avg ${indAvg.toString().padStart(5)} (n=${indResults.length})`)
  }

  // Calibration accuracy
  console.log(`\n📊 Calibration Accuracy:`)
  let correct = 0
  let incorrect = 0
  const incorrectList = []

  for (const r of results) {
    const score = r.overallScore
    let expectedRange
    if (r.expectedTier === 'high') {
      expectedRange = [60, 100]
    } else if (r.expectedTier === 'medium') {
      expectedRange = [30, 70]
    } else {
      expectedRange = [0, 40]
    }

    if (score >= expectedRange[0] && score <= expectedRange[1]) {
      correct++
    } else {
      incorrect++
      incorrectList.push({
        name: r.name,
        score,
        expected: r.expectedTier,
        range: expectedRange
      })
    }
  }

  console.log(`   Correct: ${correct}/${results.length} (${(correct/results.length*100).toFixed(1)}%)`)
  console.log(`   Incorrect: ${incorrect}/${results.length} (${(incorrect/results.length*100).toFixed(1)}%)`)

  if (incorrectList.length > 0) {
    console.log(`\n   ⚠️  Incorrect predictions:`)
    for (const item of incorrectList.slice(0, 10)) {
      console.log(`      ${item.name}: got ${item.score}, expected ${item.expected} (${item.range[0]}-${item.range[1]})`)
    }
  }

  // Sales opportunities
  const salesOps = results.filter(r => r.overallScore < 40)
  console.log(`\n🎯 Sales Opportunities (Score < 40): ${salesOps.length} businesses (${(salesOps.length/results.length*100).toFixed(1)}%)`)

  // Export CSV
  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')
  const csvFilename = `calibration-local-${timestamp}.csv`
  const csvHeaders = 'Name,City,Industry,Expected Tier,Overall Score,Local Score,Direct Score,Local Mentioned,Direct Mentioned\n'
  const csvRows = results.map(r =>
    `"${r.name}","${r.city}","${r.industry}","${r.expectedTier}",${r.overallScore},${r.localScore},${r.directScore},${r.localMentioned},${r.directMentioned}`
  ).join('\n')

  fs.writeFileSync(csvFilename, csvHeaders + csvRows)
  console.log(`\n💾 Results exported to: ${csvFilename}`)
  console.log(`\n⏱️  Total time: ${duration} minutes`)
  console.log('═'.repeat(70))
}

main().catch(console.error)
