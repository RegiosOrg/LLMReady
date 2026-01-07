/**
 * Visibility Check API - Protected route for logged-in users
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { checkWithOpenAI, BusinessContext, PROMPT_TEMPLATES } from '@/lib/llm/visibilityCheck'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const businessId = searchParams.get('businessId')

    // Get LLM checks for user's businesses
    const where = businessId
      ? { businessId, business: { userId: session.user.id } }
      : { business: { userId: session.user.id } }

    const checks = await db.llmCheck.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        business: {
          select: {
            id: true,
            name: true,
            addressCity: true,
          },
        },
      },
    })

    return NextResponse.json({ checks })
  } catch (error) {
    console.error('Visibility API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { businessId, promptType = 'localRecommendation' } = body

    if (!businessId) {
      return NextResponse.json({ error: 'Business ID required' }, { status: 400 })
    }

    // Verify business belongs to user
    const business = await db.business.findFirst({
      where: {
        id: businessId,
        userId: session.user.id,
      },
    })

    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 })
    }

    // Build business context
    const businessContext: BusinessContext = {
      name: business.name,
      industry: business.industry || 'business',
      city: business.addressCity || 'Switzerland',
      canton: business.addressCanton || undefined,
      services: business.services ? JSON.parse(business.services).map((s: { name: string }) => s.name) : [],
    }

    // Run OpenAI check (Claude requires API key which isn't set)
    const validPromptTypes = ['localRecommendation', 'directQuery', 'comparisonQuery', 'reputationQuery'] as const
    const prompt = validPromptTypes.includes(promptType) ? promptType : 'localRecommendation'

    const result = await checkWithOpenAI(businessContext, prompt as keyof typeof PROMPT_TEMPLATES)

    // Save to database
    const llmCheck = await db.llmCheck.create({
      data: {
        businessId,
        provider: result.provider,
        model: result.model,
        prompt: result.prompt,
        response: result.response,
        mentioned: result.mentioned,
        accuracyScore: result.accuracyScore,
        sentiment: result.sentiment.toUpperCase(),
        mentionContext: result.mentioned ? extractMentionContext(result.response, business.name) : null,
        extractedInfo: JSON.stringify(result.details),
      },
    })

    // Update business visibility score
    const allChecks = await db.llmCheck.findMany({
      where: { businessId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    })

    const avgScore = Math.round(
      allChecks.reduce((sum, check) => sum + (check.accuracyScore || 0), 0) / allChecks.length
    )

    await db.business.update({
      where: { id: businessId },
      data: { visibilityScore: avgScore },
    })

    return NextResponse.json({
      check: llmCheck,
      result,
    })
  } catch (error) {
    console.error('Visibility check error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function extractMentionContext(response: string, businessName: string): string | null {
  const nameLower = businessName.toLowerCase()
  const responseLower = response.toLowerCase()
  const index = responseLower.indexOf(nameLower)

  if (index === -1) {
    // Try partial match
    const words = nameLower.split(' ').filter(w => w.length > 3)
    for (const word of words) {
      const wordIndex = responseLower.indexOf(word)
      if (wordIndex !== -1) {
        const start = Math.max(0, wordIndex - 50)
        const end = Math.min(response.length, wordIndex + word.length + 100)
        return response.substring(start, end)
      }
    }
    return null
  }

  const start = Math.max(0, index - 50)
  const end = Math.min(response.length, index + businessName.length + 100)
  return response.substring(start, end)
}
