/**
 * LLM Visibility Checker
 * Tests how AI assistants perceive and recommend businesses
 */

import OpenAI from 'openai'
import Anthropic from '@anthropic-ai/sdk'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export interface BusinessContext {
  name: string
  industry: string
  city: string
  canton?: string
  services?: string[]
}

export interface VisibilityCheckResult {
  provider: 'openai' | 'anthropic'
  model: string
  prompt: string
  response: string
  mentioned: boolean
  accuracyScore: number
  sentiment: 'positive' | 'neutral' | 'negative'
  details: {
    nameMatch: boolean
    locationMatch: boolean
    servicesMatch: boolean
    recommended: boolean
    competitors: string[]
  }
}

/**
 * Prompt templates for different check types
 */
export const PROMPT_TEMPLATES = {
  // Local business recommendation
  localRecommendation: (business: BusinessContext) =>
    `I need a ${business.industry} in ${business.city}${business.canton ? `, ${business.canton}` : ''}, Switzerland. Can you recommend some options?`,

  // Service-specific query
  serviceQuery: (business: BusinessContext, service: string) =>
    `I'm looking for ${service} services in ${business.city}, Switzerland. What are my options?`,

  // Direct business query
  directQuery: (business: BusinessContext) =>
    `What can you tell me about ${business.name} in ${business.city}, Switzerland?`,

  // Comparison query
  comparisonQuery: (business: BusinessContext) =>
    `What are the best ${business.industry} companies in ${business.city}, Switzerland? I'm comparing options.`,

  // Review/reputation query
  reputationQuery: (business: BusinessContext) =>
    `Is ${business.name} a good ${business.industry} in ${business.city}? What's their reputation?`,
}

/**
 * Run visibility check with OpenAI
 */
export async function checkWithOpenAI(
  business: BusinessContext,
  promptTemplate: keyof typeof PROMPT_TEMPLATES,
  service?: string
): Promise<VisibilityCheckResult> {
  let prompt: string
  if (promptTemplate === 'serviceQuery' && service) {
    prompt = PROMPT_TEMPLATES.serviceQuery(business, service)
  } else {
    const template = PROMPT_TEMPLATES[promptTemplate] as (business: BusinessContext) => string
    prompt = template(business)
  }

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'You are a helpful assistant that provides information about local businesses. Be specific and factual.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.3,
    max_tokens: 1000,
  })

  const response = completion.choices[0]?.message?.content || ''

  return analyzeResponse(business, prompt, response, 'openai', 'gpt-4o-mini')
}

/**
 * Run visibility check with Anthropic Claude
 */
export async function checkWithAnthropic(
  business: BusinessContext,
  promptTemplate: keyof typeof PROMPT_TEMPLATES,
  service?: string
): Promise<VisibilityCheckResult> {
  let prompt: string
  if (promptTemplate === 'serviceQuery' && service) {
    prompt = PROMPT_TEMPLATES.serviceQuery(business, service)
  } else {
    const template = PROMPT_TEMPLATES[promptTemplate] as (business: BusinessContext) => string
    prompt = template(business)
  }

  const message = await anthropic.messages.create({
    model: 'claude-3-haiku-20240307',
    max_tokens: 1000,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  })

  const response = message.content[0].type === 'text'
    ? message.content[0].text
    : ''

  return analyzeResponse(business, prompt, response, 'anthropic', 'claude-3-haiku')
}

/**
 * Analyze LLM response for business visibility
 */
function analyzeResponse(
  business: BusinessContext,
  prompt: string,
  response: string,
  provider: 'openai' | 'anthropic',
  model: string
): VisibilityCheckResult {
  const responseLower = response.toLowerCase()
  const nameLower = business.name.toLowerCase()

  // Check if business is mentioned
  const mentioned = responseLower.includes(nameLower) ||
    // Check for partial name matches (e.g., "Brigger Treuhand" matches "BT Brigger Treuhand")
    nameLower.split(' ').filter(w => w.length > 3).some(word => responseLower.includes(word))

  // Check location match
  const locationMatch = responseLower.includes(business.city.toLowerCase())

  // Check services match (filter out any undefined/null values first)
  const servicesMatch = business.services
    ? business.services.filter(s => s && typeof s === 'string').some(s => responseLower.includes(s.toLowerCase()))
    : false

  // Check if recommended
  const recommendationPhrases = [
    'recommend',
    'suggest',
    'consider',
    'good option',
    'trusted',
    'reliable',
    'reputable',
  ]
  const recommended = mentioned && recommendationPhrases.some(p => responseLower.includes(p))

  // Extract competitor mentions
  const competitors = extractCompetitors(response, business.name)

  // Calculate accuracy score
  let accuracyScore = 0
  if (mentioned) {
    accuracyScore += 40 // Base points for being mentioned
    if (locationMatch) accuracyScore += 20
    if (servicesMatch) accuracyScore += 20
    if (recommended) accuracyScore += 20
  }

  // Determine sentiment
  const sentiment = determineSentiment(response, business.name, mentioned)

  return {
    provider,
    model,
    prompt,
    response,
    mentioned,
    accuracyScore,
    sentiment,
    details: {
      nameMatch: mentioned,
      locationMatch,
      servicesMatch,
      recommended,
      competitors,
    },
  }
}

/**
 * Extract competitor names from response
 */
function extractCompetitors(response: string, businessName: string): string[] {
  // Simple extraction - look for capitalized phrases that might be business names
  const competitors: string[] = []

  // Pattern to find business-like names (capitalized words followed by common suffixes)
  const patterns = [
    /([A-Z][a-z]+ (?:AG|GmbH|Treuhand|Notar|Partner|Associates))/g,
    /([A-Z][a-z]+ & [A-Z][a-z]+)/g,
    /([A-Z][a-z]+ [A-Z][a-z]+ (?:AG|GmbH))/g,
  ]

  for (const pattern of patterns) {
    const matches = response.match(pattern) || []
    for (const match of matches) {
      if (!match.toLowerCase().includes(businessName.toLowerCase()) &&
          !competitors.includes(match)) {
        competitors.push(match)
      }
    }
  }

  return competitors.slice(0, 5) // Limit to 5 competitors
}

/**
 * Determine sentiment from response
 */
function determineSentiment(
  response: string,
  businessName: string,
  mentioned: boolean
): 'positive' | 'neutral' | 'negative' {
  if (!mentioned) return 'neutral'

  const responseLower = response.toLowerCase()

  const positiveWords = [
    'excellent', 'great', 'trusted', 'reliable', 'professional',
    'recommend', 'reputable', 'experienced', 'quality', 'best',
  ]

  const negativeWords = [
    'avoid', 'bad', 'poor', 'unreliable', 'unprofessional',
    'issues', 'problems', 'complaints', 'concerns', 'negative',
  ]

  // Look for words near the business name mention
  const nameIndex = responseLower.indexOf(businessName.toLowerCase())
  if (nameIndex === -1) return 'neutral'

  // Check 200 characters around the mention
  const context = responseLower.substring(
    Math.max(0, nameIndex - 100),
    Math.min(responseLower.length, nameIndex + 100)
  )

  const positiveCount = positiveWords.filter(w => context.includes(w)).length
  const negativeCount = negativeWords.filter(w => context.includes(w)).length

  if (positiveCount > negativeCount) return 'positive'
  if (negativeCount > positiveCount) return 'negative'
  return 'neutral'
}

/**
 * Run comprehensive visibility check across all providers
 */
export async function runComprehensiveCheck(
  business: BusinessContext
): Promise<{
  results: VisibilityCheckResult[]
  overallScore: number
  summary: string
}> {
  const results: VisibilityCheckResult[] = []

  // Run checks in parallel
  const [
    openaiLocal,
    anthropicLocal,
    openaiDirect,
    anthropicDirect,
  ] = await Promise.allSettled([
    checkWithOpenAI(business, 'localRecommendation'),
    checkWithAnthropic(business, 'localRecommendation'),
    checkWithOpenAI(business, 'directQuery'),
    checkWithAnthropic(business, 'directQuery'),
  ])

  // Collect successful results
  if (openaiLocal.status === 'fulfilled') results.push(openaiLocal.value)
  if (anthropicLocal.status === 'fulfilled') results.push(anthropicLocal.value)
  if (openaiDirect.status === 'fulfilled') results.push(openaiDirect.value)
  if (anthropicDirect.status === 'fulfilled') results.push(anthropicDirect.value)

  // Calculate overall score
  const overallScore = results.length > 0
    ? Math.round(results.reduce((sum, r) => sum + r.accuracyScore, 0) / results.length)
    : 0

  // Generate summary
  const mentionedCount = results.filter(r => r.mentioned).length
  const totalChecks = results.length
  const summary = generateSummary(results, overallScore, business)

  return {
    results,
    overallScore,
    summary,
  }
}

/**
 * Generate human-readable summary
 */
function generateSummary(
  results: VisibilityCheckResult[],
  overallScore: number,
  business: BusinessContext
): string {
  const mentionedCount = results.filter(r => r.mentioned).length
  const totalChecks = results.length

  if (mentionedCount === 0) {
    return `${business.name} was not found in any AI responses. This suggests low visibility in LLM training data. Focus on building citations and schema markup to improve discoverability.`
  }

  if (mentionedCount === totalChecks) {
    return `${business.name} was mentioned in all ${totalChecks} AI checks with an average accuracy of ${overallScore}%. Your business has good AI visibility.`
  }

  return `${business.name} was found in ${mentionedCount} out of ${totalChecks} AI checks. Current visibility score: ${overallScore}%. There's room for improvement.`
}
