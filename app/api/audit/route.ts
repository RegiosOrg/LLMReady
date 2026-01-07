/**
 * Public Audit API - No authentication required
 * Rate limited to prevent abuse
 */

import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

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
        type: 'local',
        prompt: `I need a ${industry} in ${city}, Switzerland. Can you recommend some options?`,
      },
      {
        type: 'direct',
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
              content: 'You are a helpful assistant that provides information about local businesses in Switzerland. Be specific and factual. If you don\'t have information about a specific business, say so.',
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
        const mentioned = checkMention(response, businessName)
        const score = calculateScore(response, businessName, city)

        results.push({
          provider: 'ChatGPT',
          prompt,
          response,
          mentioned,
          score,
        })
      } catch (error) {
        console.error(`Error running ${type} check:`, error)
        results.push({
          provider: 'ChatGPT',
          prompt,
          response: 'Error running check',
          mentioned: false,
          score: 0,
        })
      }
    }

    // Calculate overall score
    const overallScore = Math.round(
      results.reduce((sum, r) => sum + r.score, 0) / results.length
    )

    // Generate recommendations
    const mentionedCount = results.filter(r => r.mentioned).length
    const recommendations = generateRecommendations(mentionedCount, results.length, industry)

    return NextResponse.json({
      businessName,
      city,
      industry,
      overallScore,
      mentionedIn: `${mentionedCount}/${results.length}`,
      results,
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

function checkMention(response: string, businessName: string): boolean {
  const responseLower = response.toLowerCase()
  const nameLower = businessName.toLowerCase()

  // Direct match
  if (responseLower.includes(nameLower)) return true

  // Partial match for multi-word names
  const words = nameLower.split(' ').filter(w => w.length > 3)
  return words.some(word => responseLower.includes(word))
}

function calculateScore(response: string, businessName: string, city: string): number {
  const responseLower = response.toLowerCase()
  const nameLower = businessName.toLowerCase()
  const cityLower = city.toLowerCase()

  let score = 0

  // Mentioned at all
  if (checkMention(response, businessName)) {
    score += 40

    // City also mentioned in context
    if (responseLower.includes(cityLower)) {
      score += 20
    }

    // Positive sentiment
    const positiveWords = ['recommend', 'trusted', 'reliable', 'professional', 'excellent', 'quality']
    if (positiveWords.some(w => responseLower.includes(w))) {
      score += 20
    }

    // Listed as an option
    if (responseLower.includes('option') || responseLower.includes('consider')) {
      score += 20
    }
  }

  return score
}

function generateRecommendations(mentionedCount: number, totalChecks: number, industry: string): string[] {
  const recommendations: string[] = []

  if (mentionedCount === 0) {
    recommendations.push('Your business is not visible to AI assistants. This is a critical issue.')
    recommendations.push('Claim and optimize your Google Business Profile immediately.')
    recommendations.push(`Register on Swiss business directories (local.ch, search.ch) as a ${industry}.`)
    recommendations.push('Add structured data (Schema.org) to your website.')
    recommendations.push('Build citations on industry-specific directories.')
  } else if (mentionedCount < totalChecks) {
    recommendations.push('Your business has partial AI visibility. There\'s room for improvement.')
    recommendations.push('Ensure consistent NAP (Name, Address, Phone) across all directories.')
    recommendations.push('Add more detailed service descriptions to your profiles.')
    recommendations.push('Collect and respond to customer reviews.')
  } else {
    recommendations.push('Good news! Your business is visible to AI assistants.')
    recommendations.push('Monitor your visibility regularly to maintain your position.')
    recommendations.push('Continue building quality citations and reviews.')
  }

  return recommendations
}
