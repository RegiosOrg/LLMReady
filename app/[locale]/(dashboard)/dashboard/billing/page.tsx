'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check } from 'lucide-react'

const plans = [
  {
    name: 'Free',
    price: 'CHF 0',
    period: '/month',
    description: 'Get started with basic AI visibility tracking',
    features: [
      '1 business profile',
      '5 AI visibility checks/month',
      'Basic citation tracking',
      'Schema generator',
    ],
    cta: 'Current Plan',
    disabled: true,
    plan: 'FREE',
  },
  {
    name: 'Professional',
    price: 'CHF 49',
    period: '/month',
    description: 'For growing businesses serious about AI visibility',
    features: [
      '5 business profiles',
      '100 AI visibility checks/month',
      'Full citation management',
      'Advanced schema markup',
      'Priority support',
      'Monthly reports',
    ],
    cta: 'Upgrade',
    popular: true,
    plan: 'PROFESSIONAL',
  },
  {
    name: 'Business',
    price: 'CHF 149',
    period: '/month',
    description: 'For agencies and multi-location businesses',
    features: [
      'Unlimited business profiles',
      'Unlimited AI visibility checks',
      'White-label reports',
      'API access',
      'Dedicated support',
      'Custom integrations',
    ],
    cta: 'Contact Sales',
    plan: 'BUSINESS',
  },
]

export default function BillingPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const upgrade = searchParams.get('upgrade')
  const [loading, setLoading] = useState<string | null>(null)

  const handleUpgrade = async (plan: string) => {
    if (plan === 'FREE') return

    setLoading(plan)
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })

      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert('Failed to create checkout session')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Failed to start checkout')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {upgrade ? 'Upgrade Your Plan' : 'Billing & Plans'}
        </h1>
        <p className="text-gray-500">
          {upgrade
            ? 'You\'ve reached your plan limit. Upgrade to continue adding businesses.'
            : 'Manage your subscription and billing information'}
        </p>
      </div>

      {upgrade && (
        <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-800">
          <p className="font-medium">You've reached your free plan limit</p>
          <p className="text-sm mt-1">Upgrade to Professional to add more businesses and get more AI visibility checks.</p>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={plan.popular ? 'border-[#667eea] shadow-lg relative' : ''}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-[#667eea]">Most Popular</Badge>
              </div>
            )}
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-gray-500">{plan.period}</span>
              </div>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                className={`w-full ${plan.popular ? 'bg-[#667eea] hover:bg-[#5a6fd6]' : ''}`}
                variant={plan.disabled ? 'outline' : 'default'}
                disabled={plan.disabled || loading === plan.plan}
                onClick={() => handleUpgrade(plan.plan)}
              >
                {loading === plan.plan ? 'Loading...' : plan.cta}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Need Help?</CardTitle>
          <CardDescription>
            Questions about billing or need a custom plan?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            Contact us at <a href="mailto:support@getcitedby.com" className="text-[#667eea] hover:underline">support@getcitedby.com</a>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
