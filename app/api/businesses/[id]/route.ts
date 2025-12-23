import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { z } from 'zod'

const updateBusinessSchema = z.object({
  name: z.string().min(1).optional(),
  uid: z.string().optional(),
  industry: z.string().optional(),
  description: z.string().optional(),
  addressStreet: z.string().optional(),
  addressCity: z.string().optional(),
  addressPostal: z.string().optional(),
  addressCanton: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  website: z.string().optional(),
  services: z.array(z.string()).optional(),
  status: z.enum(['DRAFT', 'ACTIVE', 'PAUSED', 'ARCHIVED']).optional(),
})

// GET /api/businesses/[id] - Get a single business
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const business = await db.business.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      include: {
        citations: {
          orderBy: { createdAt: 'desc' },
        },
        llmChecks: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        schemaItems: {
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 })
    }

    return NextResponse.json(business)
  } catch (error) {
    console.error('Error fetching business:', error)
    return NextResponse.json(
      { error: 'Failed to fetch business' },
      { status: 500 }
    )
  }
}

// PATCH /api/businesses/[id] - Update a business
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check ownership
    const existing = await db.business.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 })
    }

    const body = await req.json()
    const validatedData = updateBusinessSchema.parse(body)

    // Convert services array to JSON string if present
    const dataToUpdate: Record<string, unknown> = {
      ...validatedData,
      updatedAt: new Date(),
    }
    if (validatedData.services !== undefined) {
      dataToUpdate.services = JSON.stringify(validatedData.services)
    }

    const business = await db.business.update({
      where: { id: params.id },
      data: dataToUpdate,
    })

    // Log the action
    await db.auditLog.create({
      data: {
        userId: session.user.id,
        businessId: business.id,
        action: 'business.updated',
        entityType: 'business',
        entityId: business.id,
        metadata: JSON.stringify({ fields: Object.keys(validatedData) }),
      },
    })

    return NextResponse.json(business)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error updating business:', error)
    return NextResponse.json(
      { error: 'Failed to update business' },
      { status: 500 }
    )
  }
}

// DELETE /api/businesses/[id] - Archive a business
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check ownership
    const existing = await db.business.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 })
    }

    // Soft delete by archiving
    await db.business.update({
      where: { id: params.id },
      data: { status: 'ARCHIVED' },
    })

    // Update subscription usage
    await db.subscription.update({
      where: { userId: session.user.id },
      data: { businessesUsed: { decrement: 1 } },
    })

    // Log the action
    await db.auditLog.create({
      data: {
        userId: session.user.id,
        businessId: params.id,
        action: 'business.archived',
        entityType: 'business',
        entityId: params.id,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error archiving business:', error)
    return NextResponse.json(
      { error: 'Failed to archive business' },
      { status: 500 }
    )
  }
}
