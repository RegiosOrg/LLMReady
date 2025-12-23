import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import {
  checkWithOpenAI,
  checkWithAnthropic,
  runComprehensiveCheck,
  PROMPT_TEMPLATES,
} from '@/lib/llm/visibilityCheck'

// GET /api/llm?businessId=xxx - Get visibility checks for a business
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const businessId = searchParams.get('businessId')

    if (!businessId) {
      return NextResponse.json(
        { error: 'Business ID is required' },
        { status: 400 }
      )
    }

    // Verify business ownership
    const business = await db.business.findFirst({
      where: {
        id: businessId,
        userId: session.user.id,
      },
      include: {
        llmChecks: {
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
      },
    })

    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 })
    }

    // Calculate stats
    const recentChecks = business.llmChecks.slice(0, 10)
    const mentionedCount = recentChecks.filter(c => c.mentioned).length
    const avgAccuracy = recentChecks.length > 0
      ? Math.round(
          recentChecks.reduce((sum, c) => sum + (c.accuracyScore || 0), 0) /
            recentChecks.length
        )
      : 0

    return NextResponse.json({
      checks: business.llmChecks,
      stats: {
        totalChecks: business.llmChecks.length,
        recentMentions: mentionedCount,
        avgAccuracy,
        lastCheck: business.llmChecks[0]?.createdAt || null,
      },
    })
  } catch (error) {
    console.error('Error fetching LLM checks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch visibility checks' },
      { status: 500 }
    )
  }
}

// POST /api/llm - Run visibility check for a business
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { businessId, checkType = 'comprehensive' } = body

    if (!businessId) {
      return NextResponse.json(
        { error: 'Business ID is required' },
        { status: 400 }
      )
    }

    // Verify business ownership
    const business = await db.business.findFirst({
      where: {
        id: businessId,
        userId: session.user.id,
      },
    })

    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 })
    }

    // Check usage limits based on plan
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      include: { subscription: true },
    })

    const monthlyLimit = user?.plan === 'FREE' ? 5 : user?.plan === 'STARTER' ? 50 : 200
    const thisMonthChecks = await db.llmCheck.count({
      where: {
        business: { userId: session.user.id },
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    })

    if (thisMonthChecks >= monthlyLimit) {
      return NextResponse.json(
        { error: 'Monthly visibility check limit reached. Please upgrade your plan.' },
        { status: 403 }
      )
    }

    // Build business context
    const parsedServices = business.services ? JSON.parse(business.services) : []
    const businessContext = {
      name: business.name,
      industry: business.industry || 'business',
      city: business.addressCity || 'Zürich',
      canton: business.addressCanton || undefined,
      services: parsedServices as string[],
    }

    let results: any[] = []

    if (checkType === 'comprehensive') {
      // Run comprehensive check
      const { results: checkResults, overallScore, summary } = await runComprehensiveCheck(businessContext)
      results = checkResults

      // Save all results
      for (const result of checkResults) {
        await db.llmCheck.create({
          data: {
            businessId,
            provider: result.provider,
            model: result.model,
            prompt: result.prompt,
            response: result.response,
            mentioned: result.mentioned,
            accuracyScore: result.accuracyScore,
            sentiment: result.sentiment,
          },
        })
      }

      // Update visibility score
      await db.business.update({
        where: { id: businessId },
        data: { visibilityScore: overallScore },
      })

      // Log the action
      await db.auditLog.create({
        data: {
          userId: session.user.id,
          businessId,
          action: 'llm.comprehensive_check',
          entityType: 'llm_check',
          entityId: businessId,
          metadata: JSON.stringify({ checkCount: checkResults.length, score: overallScore }),
        },
      })

      return NextResponse.json({
        results: checkResults,
        overallScore,
        summary,
        checksRemaining: monthlyLimit - thisMonthChecks - checkResults.length,
      })
    } else {
      // Single provider check
      const provider = checkType === 'openai' ? 'openai' : 'anthropic'
      const result = provider === 'openai'
        ? await checkWithOpenAI(businessContext, 'localRecommendation')
        : await checkWithAnthropic(businessContext, 'localRecommendation')

      // Save result
      await db.llmCheck.create({
        data: {
          businessId,
          provider: result.provider,
          model: result.model,
          prompt: result.prompt,
          response: result.response,
          mentioned: result.mentioned,
          accuracyScore: result.accuracyScore,
          sentiment: result.sentiment,
        },
      })

      // Log the action
      await db.auditLog.create({
        data: {
          userId: session.user.id,
          businessId,
          action: `llm.${provider}_check`,
          entityType: 'llm_check',
          entityId: businessId,
          metadata: JSON.stringify({ mentioned: result.mentioned, score: result.accuracyScore }),
        },
      })

      return NextResponse.json({
        result,
        checksRemaining: monthlyLimit - thisMonthChecks - 1,
      })
    }
  } catch (error) {
    console.error('Error running LLM check:', error)
    return NextResponse.json(
      { error: 'Failed to run visibility check' },
      { status: 500 }
    )
  }
}
