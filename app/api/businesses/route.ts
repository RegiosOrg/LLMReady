import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { z } from 'zod'

const createBusinessSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  uid: z.string().optional(),
  industry: z.string().min(1, 'Industry is required'),
  description: z.string().optional(),
  addressStreet: z.string().optional(),
  addressCity: z.string().min(1, 'City is required'),
  addressPostal: z.string().optional(),
  addressCanton: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  website: z.string().optional(),
  services: z.array(z.string()).optional(),
})

// GET /api/businesses - List all businesses for the current user
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const businesses = await db.business.findMany({
      where: {
        userId: session.user.id,
        status: { not: 'ARCHIVED' },
      },
      orderBy: { updatedAt: 'desc' },
      include: {
        _count: {
          select: {
            citations: true,
            llmChecks: true,
            schemaItems: true,
          },
        },
      },
    })

    return NextResponse.json(businesses)
  } catch (error) {
    console.error('Error fetching businesses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch businesses' },
      { status: 500 }
    )
  }
}

// POST /api/businesses - Create a new business
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const validatedData = createBusinessSchema.parse(body)

    // Check business limit
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      include: {
        subscription: true,
        _count: { select: { businesses: true } },
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const limit = user.plan === 'FREE' ? 1 : user.plan === 'STARTER' ? 3 : 10
    if (user._count.businesses >= limit) {
      return NextResponse.json(
        { error: 'Business limit reached. Please upgrade your plan.' },
        { status: 403 }
      )
    }

    // Create the business
    const business = await db.business.create({
      data: {
        userId: session.user.id,
        name: validatedData.name,
        uid: validatedData.uid || null,
        industry: validatedData.industry,
        description: validatedData.description || null,
        addressStreet: validatedData.addressStreet || null,
        addressCity: validatedData.addressCity,
        addressPostal: validatedData.addressPostal || null,
        addressCanton: validatedData.addressCanton || null,
        phone: validatedData.phone || null,
        email: validatedData.email || null,
        website: validatedData.website || null,
        services: JSON.stringify(validatedData.services || []),
        status: 'ACTIVE',
        onboardingStep: 5, // Completed
      },
    })

    // Update subscription usage
    if (user.subscription) {
      await db.subscription.update({
        where: { userId: session.user.id },
        data: { businessesUsed: { increment: 1 } },
      })
    }

    // Log the action
    await db.auditLog.create({
      data: {
        userId: session.user.id,
        businessId: business.id,
        action: 'business.created',
        entityType: 'business',
        entityId: business.id,
        metadata: JSON.stringify({ name: business.name }),
      },
    })

    return NextResponse.json(business, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating business:', error)
    return NextResponse.json(
      { error: 'Failed to create business' },
      { status: 500 }
    )
  }
}
