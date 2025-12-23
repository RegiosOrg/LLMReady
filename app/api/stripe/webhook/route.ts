import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe, getPlanByPriceId } from '@/lib/stripe'
import { db } from '@/lib/db'
import Stripe from 'stripe'

export async function POST(request: Request) {
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.userId

        if (!userId || !session.subscription || !session.customer) {
          console.error('Missing data in checkout session:', { userId, session })
          break
        }

        // Get subscription details
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        )
        const priceId = subscription.items.data[0]?.price.id
        const plan = getPlanByPriceId(priceId)

        // Update user
        await db.user.update({
          where: { id: userId },
          data: {
            stripeCustomerId: session.customer as string,
            plan,
          },
        })

        // Create or update subscription record
        await db.subscription.upsert({
          where: { userId },
          create: {
            userId,
            stripeSubscriptionId: subscription.id,
            stripePriceId: priceId,
            plan,
            status: 'ACTIVE',
            currentPeriodStart: new Date(subscription.current_period_start * 1000),
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
          },
          update: {
            stripeSubscriptionId: subscription.id,
            stripePriceId: priceId,
            plan,
            status: 'ACTIVE',
            currentPeriodStart: new Date(subscription.current_period_start * 1000),
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
          },
        })

        console.log(`Subscription created for user ${userId}: ${plan}`)
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata?.userId

        if (!userId) {
          console.error('No userId in subscription metadata')
          break
        }

        const priceId = subscription.items.data[0]?.price.id
        const plan = getPlanByPriceId(priceId)

        // Map Stripe status to our status
        let status = 'ACTIVE'
        if (subscription.status === 'past_due') status = 'PAST_DUE'
        if (subscription.status === 'canceled') status = 'CANCELED'
        if (subscription.status === 'incomplete') status = 'INCOMPLETE'
        if (subscription.status === 'trialing') status = 'TRIALING'

        await db.user.update({
          where: { id: userId },
          data: { plan },
        })

        await db.subscription.update({
          where: { userId },
          data: {
            stripePriceId: priceId,
            plan,
            status,
            currentPeriodStart: new Date(subscription.current_period_start * 1000),
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
          },
        })

        console.log(`Subscription updated for user ${userId}: ${plan} (${status})`)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata?.userId

        if (!userId) {
          console.error('No userId in subscription metadata')
          break
        }

        await db.user.update({
          where: { id: userId },
          data: { plan: 'FREE' },
        })

        await db.subscription.update({
          where: { userId },
          data: {
            plan: 'FREE',
            status: 'CANCELED',
          },
        })

        console.log(`Subscription canceled for user ${userId}`)
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = invoice.customer as string

        // Find user by customer ID
        const user = await db.user.findFirst({
          where: { stripeCustomerId: customerId },
        })

        if (user) {
          await db.subscription.update({
            where: { userId: user.id },
            data: { status: 'PAST_DUE' },
          })
          console.log(`Payment failed for user ${user.id}`)
        }
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
