import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { generateAllSchemas, validateSchema } from '@/lib/schema/generators'

// GET /api/schema?businessId=xxx - Get schemas for a business
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
        schemaItems: {
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 })
    }

    return NextResponse.json({
      schemaItems: business.schemaItems,
      stats: {
        total: business.schemaItems.length,
        implemented: business.schemaItems.filter(s => s.status === 'implemented').length,
        pending: business.schemaItems.filter(s => s.status === 'generated').length,
      },
    })
  } catch (error) {
    console.error('Error fetching schemas:', error)
    return NextResponse.json(
      { error: 'Failed to fetch schemas' },
      { status: 500 }
    )
  }
}

// POST /api/schema - Generate schemas for a business
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
    })

    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 })
    }

    // Generate all schemas
    const schemas = generateAllSchemas({
      id: business.id,
      name: business.name,
      uid: business.uid,
      industry: business.industry,
      description: business.description,
      addressStreet: business.addressStreet,
      addressCity: business.addressCity,
      addressPostal: business.addressPostal,
      addressCanton: business.addressCanton,
      phone: business.phone,
      email: business.email,
      website: business.website,
      services: business.services ? JSON.parse(business.services) : [],
      openingHours: business.openingHours ? JSON.parse(business.openingHours) : {},
    })

    // Delete existing schemas and create new ones
    await db.schemaItem.deleteMany({
      where: { businessId },
    })

    const createdSchemas = await Promise.all(
      schemas.map(schema =>
        db.schemaItem.create({
          data: {
            businessId,
            schemaType: schema.schemaType,
            jsonLd: JSON.stringify(schema.jsonLd),
            status: 'generated',
          },
        })
      )
    )

    // Update schema score
    await updateSchemaScore(businessId, createdSchemas.length)

    // Log the action
    await db.auditLog.create({
      data: {
        userId: session.user.id,
        businessId,
        action: 'schema.generated',
        entityType: 'schema',
        entityId: businessId,
        metadata: JSON.stringify({ count: createdSchemas.length }),
      },
    })

    return NextResponse.json({
      schemas: createdSchemas,
      message: `Generated ${createdSchemas.length} schema items`,
    })
  } catch (error) {
    console.error('Error generating schemas:', error)
    return NextResponse.json(
      { error: 'Failed to generate schemas' },
      { status: 500 }
    )
  }
}

// Helper to update schema score
async function updateSchemaScore(businessId: string, schemaCount: number) {
  // Base score on number of schemas
  // Organization schema = 40 points
  // Website schema = 20 points
  // Service schemas = 10 points each (up to 40)
  const baseScore = 40 // Organization
  const websiteScore = 20
  const serviceScore = Math.min(40, (schemaCount - 2) * 10) // Excluding org and website

  const score = Math.min(100, baseScore + (schemaCount > 1 ? websiteScore : 0) + serviceScore)

  await db.business.update({
    where: { id: businessId },
    data: { schemaScore: score },
  })
}
