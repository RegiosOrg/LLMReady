'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Check, X, Zap, Building, Rocket } from 'lucide-react'

const plans = [
  {
    key: 'FREE',
    name: 'Starter',
    description: 'Perfect for trying out GetCitedBy',
    price: { monthly: 0, yearly: 0 },
    features: [
      { text: '1 business profile', included: true },
      { text: 'Basic entity profile', included: true },
      { text: '5 citation sources', included: true },
      { text: '3 LLM checks per month', included: true },
      { text: 'Basic schema generator', included: true },
      { text: 'NAP monitoring', included: false },
      { text: 'Email alerts', included: false },
      { text: 'Priority support', included: false },
    ],
    cta: 'Get Started Free',
    popular: false,
    icon: Zap,
  },
  {
    key: 'PROFESSIONAL',
    name: 'Professional',
    description: 'For growing businesses',
    price: { monthly: 29, yearly: 290 },
    features: [
      { text: 'Up to 3 business profiles', included: true },
      { text: 'Advanced entity profile', included: true },
      { text: 'All 50+ citation sources', included: true },
      { text: '50 LLM checks per month', included: true },
      { text: 'Advanced schema generator', included: true },
      { text: 'NAP consistency monitoring', included: true },
      { text: 'Email alerts', included: true },
      { text: 'Priority support', included: false },
    ],
    cta: 'Start Professional',
    popular: true,
    icon: Building,
  },
  {
    key: 'BUSINESS',
    name: 'Business',
    description: 'For agencies & multi-location',
    price: { monthly: 79, yearly: 790 },
    features: [
      { text: 'Up to 10 business profiles', included: true },
      { text: 'Full entity profile suite', included: true },
      { text: 'Unlimited citation sources', included: true },
      { text: '200 LLM checks per month', included: true },
      { text: 'White-label reports', included: true },
      { text: 'API access', included: true },
      { text: 'Priority support', included: true },
      { text: 'Custom integrations', included: true },
    ],
    cta: 'Start Business',
    popular: false,
    icon: Rocket,
  },
]

export default function PricingPage() {
  const [interval, setInterval] = useState<'monthly' | 'yearly'>('monthly')
  const [loading, setLoading] = useState<string | null>(null)

  const handleCheckout = async (planKey: string) => {
    if (planKey === 'FREE') {
      window.location.href = '/register'
      return
    }

    setLoading(planKey)

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planKey, interval }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        // Not logged in, redirect to register
        window.location.href = '/register'
      }
    } catch (error) {
      console.error('Checkout error:', error)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-white">GetCitedBy</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-slate-300 hover:text-white">
              Sign in
            </Link>
            <Button asChild>
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        </nav>
      </header>

      {/* Pricing Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Start free, upgrade when you need more. All plans include our core AI visibility tools.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <span className={interval === 'monthly' ? 'text-white' : 'text-slate-400'}>
              Monthly
            </span>
            <button
              onClick={() => setInterval(interval === 'monthly' ? 'yearly' : 'monthly')}
              className="relative w-14 h-7 bg-slate-700 rounded-full p-1 transition-colors"
            >
              <div
                className={`w-5 h-5 bg-indigo-500 rounded-full transition-transform ${
                  interval === 'yearly' ? 'translate-x-7' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={interval === 'yearly' ? 'text-white' : 'text-slate-400'}>
              Yearly
              <span className="ml-2 text-xs bg-indigo-500/20 text-indigo-400 px-2 py-1 rounded">
                Save 17%
              </span>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => {
            const Icon = plan.icon
            return (
              <Card
                key={plan.key}
                className={`relative ${
                  plan.popular
                    ? 'border-indigo-500 shadow-lg shadow-indigo-500/20'
                    : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-indigo-500 text-white text-sm font-medium px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardHeader className="text-center pb-2">
                  <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-6 w-6 text-indigo-400" />
                  </div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-6">
                    <span className="text-4xl font-bold text-white">
                      ${plan.price[interval]}
                    </span>
                    {plan.price[interval] > 0 && (
                      <span className="text-slate-400">
                        /{interval === 'monthly' ? 'mo' : 'yr'}
                      </span>
                    )}
                  </div>

                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li
                        key={i}
                        className={`flex items-center gap-2 text-sm ${
                          feature.included ? 'text-slate-300' : 'text-slate-500'
                        }`}
                      >
                        {feature.included ? (
                          <Check className="h-4 w-4 text-indigo-400 flex-shrink-0" />
                        ) : (
                          <X className="h-4 w-4 text-slate-600 flex-shrink-0" />
                        )}
                        {feature.text}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() => handleCheckout(plan.key)}
                    disabled={loading === plan.key}
                    className="w-full"
                    variant={plan.popular ? 'default' : 'outline'}
                  >
                    {loading === plan.key ? 'Loading...' : plan.cta}
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>

        {/* Enterprise CTA */}
        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-indigo-500/20">
            <CardContent className="py-8">
              <h3 className="text-2xl font-bold text-white mb-2">
                Need more? Contact us for Enterprise
              </h3>
              <p className="text-slate-400 mb-6">
                Unlimited businesses, custom integrations, dedicated support, and SLA guarantees.
              </p>
              <Button variant="outline">
                <a href="mailto:enterprise@getcitedby.com">Contact Sales</a>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* FAQ */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-white mb-2">
                What's included in the free plan?
              </h3>
              <p className="text-slate-400">
                The Starter plan includes 1 business profile, basic entity extraction, 5 citation sources, 3 LLM visibility checks per month, and basic schema generation. Perfect for testing if GetCitedBy works for you.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-white mb-2">
                Can I cancel anytime?
              </h3>
              <p className="text-slate-400">
                Yes! All paid plans are billed monthly or yearly with no long-term commitment. You can cancel anytime from your account settings, and you'll retain access until the end of your billing period.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-white mb-2">
                What LLM platforms do you check?
              </h3>
              <p className="text-slate-400">
                We currently check visibility on ChatGPT (OpenAI) and Claude (Anthropic). We're continuously adding support for more AI platforms including Perplexity, Google Gemini, and others.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-sm">
              &copy; {new Date().getFullYear()} GetCitedBy. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-slate-400">
              <Link href="/terms" className="hover:text-white">Terms</Link>
              <Link href="/privacy" className="hover:text-white">Privacy</Link>
              <a href="mailto:support@getcitedby.com" className="hover:text-white">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
