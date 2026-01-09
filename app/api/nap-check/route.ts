/**
 * NAP Consistency Check API
 * Runs NAP (Name, Address, Phone) consistency analysis across citations
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { checkNapConsistency, buildCanonicalNap, type CitationNapData } from '@/lib/citations/napChecker'

// POST /api/nap-check - Run NAP consistency check for a business
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { businessId } = body

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
        citations: true,
      },
    })

    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 })
    }

    // Build canonical NAP from business data
    const canonicalNap = buildCanonicalNap({
      name: business.name,
      addressStreet: business.addressStreet,
      addressCity: business.addressCity,
      addressPostal: business.addressPostal,
      addressCanton: business.addressCanton,
      phone: business.phone,
    })

    // Get citation NAP data
    const citationNapData: CitationNapData[] = business.citations.map(citation => ({
      source: citation.source,
      name: citation.listedName,
      address: citation.listedAddress,
      phone: citation.listedPhone,
    }))

    // Run NAP consistency check
    const result = checkNapConsistency(canonicalNap, citationNapData)

    // Update citation statuses based on NAP check
    for (const citationScore of result.citationScores) {
      const citation = business.citations.find(c => c.source === citationScore.source)
      if (citation) {
        const newStatus = citationScore.score < 70 ? 'conflict' :
                          citationScore.score >= 90 ? 'verified' : 'submitted'

        // Only update if there's an actual conflict or we can verify
        if (citationScore.issues.length > 0 || newStatus === 'verified') {
          await db.citation.update({
            where: { id: citation.id },
            data: { status: newStatus },
          })
        }
      }
    }

    // Update business citation score
    await db.business.update({
      where: { id: businessId },
      data: { citationScore: result.overallScore },
    })

    // Log the action
    await db.auditLog.create({
      data: {
        userId: session.user.id,
        businessId,
        action: 'nap.checked',
        entityType: 'business',
        entityId: businessId,
        metadata: JSON.stringify({
          score: result.overallScore,
          issueCount: result.issues.length,
        }),
      },
    })

    return NextResponse.json({
      canonicalNap,
      result,
      message: `NAP check completed. Score: ${result.overallScore}%`,
    })
  } catch (error) {
    console.error('NAP check error:', error)
    return NextResponse.json(
      { error: 'Failed to run NAP check' },
      { status: 500 }
    )
  }
}

// GET /api/nap-check?businessId=xxx - Get last NAP check result
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

    // Verify business ownership and get data
    const business = await db.business.findFirst({
      where: {
        id: businessId,
        userId: session.user.id,
      },
      include: {
        citations: true,
      },
    })

    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 })
    }

    // Build canonical NAP
    const canonicalNap = buildCanonicalNap({
      name: business.name,
      addressStreet: business.addressStreet,
      addressCity: business.addressCity,
      addressPostal: business.addressPostal,
      addressCanton: business.addressCanton,
      phone: business.phone,
    })

    // Get citation NAP data
    const citationNapData: CitationNapData[] = business.citations
      .filter(c => c.listedName || c.listedAddress || c.listedPhone) // Only include citations with NAP data
      .map(citation => ({
        source: citation.source,
        name: citation.listedName,
        address: citation.listedAddress,
        phone: citation.listedPhone,
      }))

    // Run NAP consistency check
    const result = checkNapConsistency(canonicalNap, citationNapData)

    return NextResponse.json({
      canonicalNap,
      result,
      citationCount: business.citations.length,
      citationsWithNap: citationNapData.length,
    })
  } catch (error) {
    console.error('Error fetching NAP status:', error)
    return NextResponse.json(
      { error: 'Failed to fetch NAP status' },
      { status: 500 }
    )
  }
}
