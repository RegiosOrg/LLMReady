import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
  typescript: true,
})

// Plan configuration
export const PLANS = {
  FREE: {
    name: 'Starter',
    maxBusinesses: 1,
    maxCitationsPerBusiness: 5,
    maxLlmChecksPerMonth: 3,
    features: [
      'Basic entity profile',
      'Up to 5 citation sources',
      '3 LLM visibility checks/month',
      'Basic schema generator',
    ],
    price: { monthly: 0, yearly: 0 },
    priceId: { monthly: null, yearly: null },
  },
  PROFESSIONAL: {
    name: 'Professional',
    maxBusinesses: 3,
    maxCitationsPerBusiness: 25,
    maxLlmChecksPerMonth: 50,
    features: [
      'Up to 3 business profiles',
      'All 50+ citation sources',
      '50 LLM visibility checks/month',
      'Advanced schema generator',
      'NAP consistency monitoring',
      'Email alerts',
    ],
    price: { monthly: 29, yearly: 290 },
    priceId: {
      monthly: process.env.STRIPE_PRICE_PROFESSIONAL_MONTHLY,
      yearly: process.env.STRIPE_PRICE_PROFESSIONAL_YEARLY,
    },
  },
  BUSINESS: {
    name: 'Business',
    maxBusinesses: 10,
    maxCitationsPerBusiness: -1, // Unlimited
    maxLlmChecksPerMonth: 200,
    features: [
      'Up to 10 business profiles',
      'Unlimited citation sources',
      '200 LLM visibility checks/month',
      'Full schema generator suite',
      'Priority support',
      'White-label reports',
      'API access',
    ],
    price: { monthly: 79, yearly: 790 },
    priceId: {
      monthly: process.env.STRIPE_PRICE_BUSINESS_MONTHLY,
      yearly: process.env.STRIPE_PRICE_BUSINESS_YEARLY,
    },
  },
  ENTERPRISE: {
    name: 'Enterprise',
    maxBusinesses: -1, // Unlimited
    maxCitationsPerBusiness: -1,
    maxLlmChecksPerMonth: -1,
    features: [
      'Unlimited business profiles',
      'Unlimited everything',
      'Dedicated account manager',
      'Custom integrations',
      'SLA guarantee',
      'On-premise deployment option',
    ],
    price: { monthly: null, yearly: null }, // Custom pricing
    priceId: { monthly: null, yearly: null },
  },
} as const

export type PlanKey = keyof typeof PLANS

export function getPlanByPriceId(priceId: string): PlanKey {
  for (const [key, plan] of Object.entries(PLANS)) {
    if (plan.priceId.monthly === priceId || plan.priceId.yearly === priceId) {
      return key as PlanKey
    }
  }
  return 'FREE'
}

export function getPlanLimits(plan: PlanKey) {
  return PLANS[plan]
}

export async function createCheckoutSession({
  userId,
  email,
  priceId,
  successUrl,
  cancelUrl,
}: {
  userId: string
  email: string
  priceId: string
  successUrl: string
  cancelUrl: string
}) {
  const session = await stripe.checkout.sessions.create({
    customer_email: email,
    mode: 'subscription',
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      userId,
    },
    subscription_data: {
      metadata: {
        userId,
      },
    },
    allow_promotion_codes: true,
  })

  return session
}

export async function createPortalSession({
  customerId,
  returnUrl,
}: {
  customerId: string
  returnUrl: string
}) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  })

  return session
}
