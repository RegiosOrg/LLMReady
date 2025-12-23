import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createCheckoutSession, PLANS, PlanKey } from '@/lib/stripe'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { plan, interval = 'monthly' } = body as {
      plan: PlanKey
      interval?: 'monthly' | 'yearly'
    }

    // Validate plan
    if (!plan || !PLANS[plan]) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    const planConfig = PLANS[plan]
    const priceId = planConfig.priceId[interval]

    if (!priceId) {
      return NextResponse.json(
        { error: 'This plan requires contacting sales' },
        { status: 400 }
      )
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    const checkoutSession = await createCheckoutSession({
      userId: session.user.id,
      email: session.user.email,
      priceId,
      successUrl: `${appUrl}/dashboard/settings?success=true`,
      cancelUrl: `${appUrl}/pricing?canceled=true`,
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
