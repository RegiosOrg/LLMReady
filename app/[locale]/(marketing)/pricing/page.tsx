'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/i18n/routing'
import { Button } from '@/components/ui/button'
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
  const t = useTranslations()
  const locale = useLocale()
  const [interval, setInterval] = useState<'monthly' | 'yearly'>('monthly')
  const [loading, setLoading] = useState<string | null>(null)

  const languages = [
    { code: 'en', name: 'EN' },
    { code: 'de', name: 'DE' },
    { code: 'fr', name: 'FR' },
  ]

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
        window.location.href = '/register'
      }
    } catch (error) {
      console.error('Checkout error:', error)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-[#667eea] to-[#764ba2] rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
                GetCitedBy
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link href="/audit" className="text-purple-600 hover:text-purple-700 transition font-medium">Free Audit</Link>

              {/* Language Switcher */}
              <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-lg">
                {languages.map((lang) => (
                  <Link
                    key={lang.code}
                    href="/pricing"
                    locale={lang.code}
                    className={`px-2 py-1 text-sm rounded transition ${
                      locale === lang.code
                        ? 'bg-white text-gray-900 font-medium shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {lang.name}
                  </Link>
                ))}
              </div>

              <Link href="/login" className="px-5 py-2.5 text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition font-medium">
                {t('nav.login')}
              </Link>
              <Link href="/register" className="px-5 py-2.5 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-xl hover:opacity-90 transition font-medium shadow-lg shadow-purple-500/25">
                {t('nav.getStarted')}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Pricing Section */}
      <main className="container mx-auto px-6 py-16">
        <div className="text-center mb-12 relative">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-200 rounded-full blur-3xl opacity-20"></div>
          <div className="absolute top-10 right-1/4 w-64 h-64 bg-indigo-200 rounded-full blur-3xl opacity-30"></div>

          <div className="relative">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Simple, transparent pricing
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Start free, upgrade when you need more. All plans include our core AI visibility tools.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <span className={`font-medium ${interval === 'monthly' ? 'text-gray-900' : 'text-gray-400'}`}>
                Monthly
              </span>
              <button
                onClick={() => setInterval(interval === 'monthly' ? 'yearly' : 'monthly')}
                className="relative w-14 h-7 bg-gray-200 rounded-full p-1 transition-colors"
              >
                <div
                  className={`w-5 h-5 bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-full transition-transform shadow-lg ${
                    interval === 'yearly' ? 'translate-x-7' : 'translate-x-0'
                  }`}
                />
              </button>
              <span className={`font-medium ${interval === 'yearly' ? 'text-gray-900' : 'text-gray-400'}`}>
                Yearly
                <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                  Save 17%
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => {
            const Icon = plan.icon
            return (
              <div
                key={plan.key}
                className={`relative bg-white rounded-2xl border p-8 transition-all hover:shadow-xl ${
                  plan.popular
                    ? 'border-purple-200 shadow-xl shadow-purple-100/50 scale-105'
                    : 'border-gray-200 shadow-lg shadow-gray-100/50 hover:-translate-y-1'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white text-sm font-semibold px-4 py-1.5 rounded-full shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
                    plan.popular
                      ? 'bg-gradient-to-br from-[#667eea] to-[#764ba2] shadow-lg shadow-purple-500/30'
                      : 'bg-gray-100'
                  }`}>
                    <Icon className={`h-7 w-7 ${plan.popular ? 'text-white' : 'text-gray-600'}`} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{plan.name}</h3>
                  <p className="text-gray-500">{plan.description}</p>
                </div>

                <div className="text-center mb-6">
                  <span className="text-5xl font-bold text-gray-900">
                    ${plan.price[interval]}
                  </span>
                  {plan.price[interval] > 0 && (
                    <span className="text-gray-500 ml-1">
                      /{interval === 'monthly' ? 'mo' : 'yr'}
                    </span>
                  )}
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li
                      key={i}
                      className={`flex items-center gap-3 text-sm ${
                        feature.included ? 'text-gray-700' : 'text-gray-400'
                      }`}
                    >
                      {feature.included ? (
                        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                          <Check className="h-3 w-3 text-green-600" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                          <X className="h-3 w-3 text-gray-400" />
                        </div>
                      )}
                      {feature.text}
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleCheckout(plan.key)}
                  disabled={loading === plan.key}
                  className={`w-full ${
                    plan.popular
                      ? 'bg-gradient-to-r from-[#667eea] to-[#764ba2] hover:opacity-90 shadow-lg shadow-purple-500/25'
                      : 'bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                  }`}
                  size="lg"
                >
                  {loading === plan.key ? 'Loading...' : plan.cta}
                </Button>
              </div>
            )
          })}
        </div>

        {/* Enterprise CTA */}
        <div className="mt-16 text-center">
          <div className="max-w-2xl mx-auto bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl border border-purple-100 p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Need more? Contact us for Enterprise
            </h3>
            <p className="text-gray-600 mb-6">
              Unlimited businesses, custom integrations, dedicated support, and SLA guarantees.
            </p>
            <Button variant="outline" className="border-gray-300" asChild>
              <a href="mailto:enterprise@getcitedby.com">Contact Sales</a>
            </Button>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-8">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What&apos;s included in the free plan?
              </h3>
              <p className="text-gray-600">
                The Starter plan includes 1 business profile, basic entity extraction, 5 citation sources, 3 LLM visibility checks per month, and basic schema generation. Perfect for testing if GetCitedBy works for you.
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I cancel anytime?
              </h3>
              <p className="text-gray-600">
                Yes! All paid plans are billed monthly or yearly with no long-term commitment. You can cancel anytime from your account settings, and you&apos;ll retain access until the end of your billing period.
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What LLM platforms do you check?
              </h3>
              <p className="text-gray-600">
                We currently check visibility on ChatGPT (OpenAI) and Claude (Anthropic). We&apos;re continuously adding support for more AI platforms including Perplexity, Google Gemini, and others.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-12 mt-20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-[#667eea] to-[#764ba2] rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/20">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">GetCitedBy</span>
            </div>
            <div className="flex items-center gap-8 text-gray-600">
              <Link href="/privacy" className="hover:text-gray-900 transition">{t('footer.privacy')}</Link>
              <Link href="/terms" className="hover:text-gray-900 transition">{t('footer.terms')}</Link>
              <a href="mailto:support@getcitedby.com" className="hover:text-gray-900 transition">Support</a>
            </div>
            <p className="text-gray-500">&copy; 2025 GetCitedBy. {t('footer.madeIn')}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
