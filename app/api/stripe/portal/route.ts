import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createPortalSession } from '@/lib/stripe'
import { db } from '@/lib/db'

export async function POST() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's Stripe customer ID
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { stripeCustomerId: true },
    })

    if (!user?.stripeCustomerId) {
      return NextResponse.json(
        { error: 'No billing information found' },
        { status: 400 }
      )
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    const portalSession = await createPortalSession({
      customerId: user.stripeCustomerId,
      returnUrl: `${appUrl}/dashboard/settings`,
    })

    return NextResponse.json({ url: portalSession.url })
  } catch (error) {
    console.error('Portal error:', error)
    return NextResponse.json(
      { error: 'Failed to create portal session' },
      { status: 500 }
    )
  }
}
