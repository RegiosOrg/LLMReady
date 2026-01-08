/**
 * Public Audit API - No authentication required
 * Rate limited to prevent abuse
 *
 * v2: Improved scoring algorithm with strict name matching
 */

import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import {
  calculateVisibilityScore,
  interpretScore,
  analyzeNameMention,
  hasRealBusinessInfo,
  type ScoreBreakdown
} from '@/lib/scoring/visibilityScoring'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Simple in-memory rate limiting (in production, use Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT = 10 // requests per hour per IP
const RATE_LIMIT_WINDOW = 60 * 60 * 1000 // 1 hour

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(ip)

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return true
  }

  if (record.count >= RATE_LIMIT) {
    return false
  }

  record.count++
  return true
}

interface AuditRequest {
  businessName: string
  city: string
  industry: string
}

interface AuditResult {
  provider: string
  prompt: string
  response: string
  mentioned: boolean
  score: number
  scoreBreakdown: ScoreBreakdown
}

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Try again later.' },
        { status: 429 }
      )
    }

    const body: AuditRequest = await req.json()
    const { businessName, city, industry } = body

    // Validation
    if (!businessName || !city || !industry) {
      return NextResponse.json(
        { error: 'Missing required fields: businessName, city, industry' },
        { status: 400 }
      )
    }

    // Run 2 visibility checks with OpenAI
    const prompts = [
      {
        type: 'local_search' as const,
        prompt: `I need a ${industry} in ${city}, Switzerland. Can you recommend some options?`,
      },
      {
        type: 'direct_query' as const,
        prompt: `What can you tell me about ${businessName} in ${city}, Switzerland?`,
      },
    ]

    const results: AuditResult[] = []

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

        // Use new scoring system
        const scoreBreakdown = calculateVisibilityScore(response, businessName, type)
        const nameAnalysis = analyzeNameMention(response, businessName)

        results.push({
          provider: 'ChatGPT',
          prompt,
          response,
          mentioned: nameAnalysis.mentioned,
          score: scoreBreakdown.total,
          scoreBreakdown,
        })
      } catch (error) {
        console.error(`Error running ${type} check:`, error)
        results.push({
          provider: 'ChatGPT',
          prompt,
          response: 'Error running check',
          mentioned: false,
          score: 0,
          scoreBreakdown: {
            mentionScore: 0,
            positionScore: 0,
            infoQualityScore: 0,
            sentimentScore: 0,
            total: 0,
            explanation: 'Error running check'
          },
        })
      }
    }

    // Calculate overall score (weighted average)
    // Local search is more important (60%) than direct query (40%)
    const localResult = results.find(r => r.prompt.includes('recommend'))
    const directResult = results.find(r => r.prompt.includes('tell me about'))

    const overallScore = Math.round(
      (localResult?.score || 0) * 0.6 +
      (directResult?.score || 0) * 0.4
    )

    // Get score interpretation
    const interpretation = interpretScore(overallScore)

    // Generate smart recommendations based on actual issues
    const recommendations = generateSmartRecommendations(results, businessName, industry, overallScore)

    // Count mentions
    const mentionedCount = results.filter(r => r.mentioned).length

    return NextResponse.json({
      businessName,
      city,
      industry,
      overallScore,
      interpretation,
      mentionedIn: `${mentionedCount}/${results.length}`,
      results: results.map(r => ({
        ...r,
        // Include explanation in UI
        explanation: r.scoreBreakdown.explanation
      })),
      recommendations,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Audit API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * Generate recommendations based on actual scoring issues
 */
function generateSmartRecommendations(
  results: AuditResult[],
  businessName: string,
  industry: string,
  overallScore: number
): string[] {
  const recommendations: string[] = []

  const localResult = results.find(r => r.prompt.includes('recommend'))
  const directResult = results.find(r => r.prompt.includes('tell me about'))

  // Not mentioned in local search
  if (localResult && !localResult.mentioned) {
    recommendations.push(
      'Your business is not appearing in AI recommendations for local searches. This is the most important issue to fix.'
    )
    recommendations.push(
      'Register your business on authoritative Swiss directories: local.ch, search.ch, zefix.ch'
    )
    recommendations.push(
      'Create and optimize your Google Business Profile with complete, accurate information.'
    )
  }

  // Mentioned but with low info quality
  if (localResult && localResult.mentioned && localResult.scoreBreakdown.infoQualityScore < 15) {
    recommendations.push(
      'AI mentions your business but lacks detailed information. Add comprehensive service descriptions to your website.'
    )
    recommendations.push(
      'Implement Schema.org LocalBusiness markup on your website to help AI understand your services.'
    )
  }

  // Not mentioned in direct query
  if (directResult && !directResult.mentioned) {
    recommendations.push(
      'AI doesn\'t have specific information about your business. Build your online presence with consistent NAP (Name, Address, Phone) across all platforms.'
    )
  }

  // Has real info but not being recommended
  if (directResult?.mentioned && !localResult?.mentioned) {
    recommendations.push(
      'AI knows about your business but isn\'t recommending it. Focus on building citations and reviews to increase authority.'
    )
  }

  // Low position in recommendations
  if (localResult?.scoreBreakdown.positionScore && localResult.scoreBreakdown.positionScore < 15) {
    recommendations.push(
      'You\'re being mentioned but not as a top recommendation. Increase your authority through customer reviews and industry-specific directory listings.'
    )
  }

  // General recommendations if doing well
  if (overallScore >= 70) {
    recommendations.push(
      'Good visibility! Monitor your AI presence regularly and maintain consistent business information across all platforms.'
    )
    recommendations.push(
      'Continue building quality citations and encourage satisfied customers to leave reviews.'
    )
  }

  // Always add industry-specific recommendation
  if (overallScore < 50) {
    recommendations.push(
      `Register on industry-specific directories for ${industry} in Switzerland.`
    )
  }

  return recommendations.slice(0, 5) // Max 5 recommendations
}
