import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { z } from 'zod'

const createCitationSchema = z.object({
  businessId: z.string().min(1),
  source: z.string().min(1),
  sourceUrl: z.string().url().optional().or(z.literal('')),
  listedName: z.string().optional(),
  listedAddress: z.string().optional(),
  listedPhone: z.string().optional(),
  status: z.enum(['pending', 'submitted', 'verified', 'conflict']).optional(),
})

// GET /api/citations?businessId=xxx - Get citations for a business
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
    })

    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 })
    }

    const citations = await db.citation.findMany({
      where: { businessId },
      orderBy: [
        { status: 'asc' },
        { createdAt: 'desc' },
      ],
    })

    // Get all available sources for comparison
    const citationSources = await db.citationSource.findMany({
      where: { country: 'CH' },
      orderBy: { priority: 'asc' },
    })

    // Map citations to sources for checklist view
    const checklist = citationSources.map(source => {
      const existingCitation = citations.find(c => c.source === source.slug)
      return {
        source,
        citation: existingCitation || null,
        status: existingCitation?.status || 'not_started',
      }
    })

    return NextResponse.json({
      citations,
      checklist,
      stats: {
        total: citationSources.length,
        started: citations.length,
        verified: citations.filter(c => c.status === 'verified').length,
        conflicts: citations.filter(c => c.status === 'conflict').length,
      },
    })
  } catch (error) {
    console.error('Error fetching citations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch citations' },
      { status: 500 }
    )
  }
}

// POST /api/citations - Create a new citation
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const validatedData = createCitationSchema.parse(body)

    // Verify business ownership
    const business = await db.business.findFirst({
      where: {
        id: validatedData.businessId,
        userId: session.user.id,
      },
    })

    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 })
    }

    // Check if citation already exists for this source
    const existingCitation = await db.citation.findFirst({
      where: {
        businessId: validatedData.businessId,
        source: validatedData.source,
      },
    })

    if (existingCitation) {
      return NextResponse.json(
        { error: 'Citation already exists for this source' },
        { status: 409 }
      )
    }

    // Create citation
    const citation = await db.citation.create({
      data: {
        businessId: validatedData.businessId,
        source: validatedData.source,
        sourceUrl: validatedData.sourceUrl || null,
        listedName: validatedData.listedName || null,
        listedAddress: validatedData.listedAddress || null,
        listedPhone: validatedData.listedPhone || null,
        status: validatedData.status || 'pending',
      },
    })

    // Log the action
    await db.auditLog.create({
      data: {
        userId: session.user.id,
        businessId: validatedData.businessId,
        action: 'citation.created',
        entityType: 'citation',
        entityId: citation.id,
        metadata: JSON.stringify({ source: validatedData.source }),
      },
    })

    // Recalculate citation score
    await updateCitationScore(validatedData.businessId)

    return NextResponse.json(citation, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating citation:', error)
    return NextResponse.json(
      { error: 'Failed to create citation' },
      { status: 500 }
    )
  }
}

// Helper to update citation score
async function updateCitationScore(businessId: string) {
  const citations = await db.citation.findMany({
    where: { businessId },
  })

  const totalSources = await db.citationSource.count({
    where: { country: 'CH' },
  })

  // Score calculation:
  // - Base: percentage of sources with citations
  // - Bonus for verified citations
  // - Penalty for conflicts
  const baseCoverage = (citations.length / Math.max(totalSources, 1)) * 60
  const verifiedBonus = citations.filter(c => c.status === 'verified').length * 5
  const conflictPenalty = citations.filter(c => c.status === 'conflict').length * 10

  const score = Math.min(100, Math.max(0, Math.round(baseCoverage + verifiedBonus - conflictPenalty)))

  await db.business.update({
    where: { id: businessId },
    data: { citationScore: score },
  })
}
