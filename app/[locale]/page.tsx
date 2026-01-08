import { getTranslations, setRequestLocale } from 'next-intl/server'
import Link from 'next/link'
import { Link as LocaleLink } from '@/i18n/routing'
import FaqAccordion from '@/components/landing/FaqAccordion'

interface PageProps {
  params: { locale: string }
}

export default async function LandingPage({ params: { locale } }: PageProps) {
  // Enable static rendering
  setRequestLocale(locale)

  const t = await getTranslations()

  // Helper to generate locale-aware paths
  const localePath = (path: string) => {
    if (locale === 'en') return path
    return `/${locale}${path}`
  }

  // Language switcher options
  const languages = [
    { code: 'en', name: 'EN' },
    { code: 'de', name: 'DE' },
    { code: 'fr', name: 'FR' },
  ]

  // Get FAQ questions for the accordion
  const faqQuestions = t.raw('faq.questions') as Array<{ q: string; a: string }>

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href={localePath('/')} className="flex items-center gap-2">
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
              <Link href={localePath('/audit')} className="text-purple-600 hover:text-purple-700 transition font-medium">{t('hero.freeAudit')}</Link>
              <Link href={localePath('/visibility')} className="text-gray-600 hover:text-gray-900 transition font-medium flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                KI-Sichtbarkeit
              </Link>
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition font-medium">{t('nav.features')}</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition font-medium">{t('nav.pricing')}</a>
              <a href="#faq" className="text-gray-600 hover:text-gray-900 transition font-medium">{t('nav.faq')}</a>

              {/* Language Switcher */}
              <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-lg">
                {languages.map((lang) => (
                  <LocaleLink
                    key={lang.code}
                    href="/"
                    locale={lang.code}
                    className={`px-2 py-1 text-sm rounded transition ${
                      locale === lang.code
                        ? 'bg-white text-gray-900 font-medium shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {lang.name}
                  </LocaleLink>
                ))}
              </div>

              <Link href={localePath('/login')} className="px-5 py-2.5 text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition font-medium">
                {t('nav.login')}
              </Link>
              <Link href={localePath('/register')} className="px-5 py-2.5 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-xl hover:opacity-90 transition font-medium shadow-lg shadow-purple-500/25">
                {t('nav.getStarted')}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-purple-200 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute top-40 right-1/4 w-80 h-80 bg-indigo-200 rounded-full blur-3xl opacity-40"></div>

        <div className="container mx-auto px-6 pt-20 pb-32 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 rounded-full text-purple-700 text-sm mb-8 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
              {t('hero.badge')}
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight mb-6">
              {t('hero.title')}
              <span className="bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent"> ChatGPT</span>
            </h1>

            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              {t('hero.subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link href={localePath('/audit')} className="px-8 py-4 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white text-lg font-semibold rounded-xl hover:opacity-90 transition shadow-xl shadow-purple-500/30 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {t('hero.checkVisibility')}
              </Link>
              <Link href={localePath('/register')} className="px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 text-lg font-semibold rounded-xl hover:border-gray-300 hover:bg-gray-50 transition flex items-center justify-center gap-2">
                {t('hero.cta')}
              </Link>
            </div>
            <p className="text-sm text-gray-500 mb-12">{t('hero.noSignupRequired')}</p>

            <div className="flex flex-wrap items-center justify-center gap-6 text-gray-500 text-sm">
              <span>{t('hero.trustedBy')}</span>
              <span className="text-gray-700 font-medium">Zurich</span>
              <span className="text-gray-300">•</span>
              <span className="text-gray-700 font-medium">Basel</span>
              <span className="text-gray-300">•</span>
              <span className="text-gray-700 font-medium">Bern</span>
              <span className="text-gray-300">•</span>
              <span className="text-gray-700 font-medium">{t('hero.geneva')}</span>
            </div>
          </div>

          <div className="max-w-5xl mx-auto mt-20">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#667eea]/20 to-[#764ba2]/20 blur-3xl rounded-full scale-110"></div>
              <div className="relative bg-white rounded-2xl p-8 shadow-2xl shadow-gray-200/50 border border-gray-100">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 text-sm font-medium">U</div>
                    <div className="bg-gray-100 rounded-2xl rounded-tl-none px-4 py-3 text-gray-700">
                      {t('hero.chatQuestion')}
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-[#667eea] to-[#764ba2] rounded-full flex items-center justify-center shadow-lg shadow-purple-500/30">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                    </div>
                    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 rounded-2xl rounded-tl-none px-4 py-3 text-gray-700 max-w-2xl">
                      {t('hero.chatAnswerPart1')}<span className="text-purple-600 font-semibold">{t('hero.chatAnswerCompany')}</span>{t('hero.chatAnswerPart2')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-6">
              {t('problem.seoTitle')}
            </h2>
            <p className="text-xl text-gray-600 text-center mb-16">
              {t('problem.seoSubtitle')}
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-lg shadow-red-100/50 border border-red-100">
                <div className="text-red-500 text-lg font-semibold mb-6 flex items-center gap-2">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  {t('problem.whatDoesntWork')}
                </div>
                <ul className="space-y-4 text-gray-600">
                  <li className="flex items-start gap-3"><span className="text-red-400 mt-0.5">✕</span> {t('problem.doesntWork1')}</li>
                  <li className="flex items-start gap-3"><span className="text-red-400 mt-0.5">✕</span> {t('problem.doesntWork2')}</li>
                  <li className="flex items-start gap-3"><span className="text-red-400 mt-0.5">✕</span> {t('problem.doesntWork3')}</li>
                  <li className="flex items-start gap-3"><span className="text-red-400 mt-0.5">✕</span> {t('problem.doesntWork4')}</li>
                </ul>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg shadow-green-100/50 border border-green-100">
                <div className="text-green-600 text-lg font-semibold mb-6 flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  {t('problem.whatLLMsNeed')}
                </div>
                <ul className="space-y-4 text-gray-600">
                  <li className="flex items-start gap-3"><span className="text-green-500 mt-0.5">✓</span> {t('problem.llmsNeed1')}</li>
                  <li className="flex items-start gap-3"><span className="text-green-500 mt-0.5">✓</span> {t('problem.llmsNeed2')}</li>
                  <li className="flex items-start gap-3"><span className="text-green-500 mt-0.5">✓</span> {t('problem.llmsNeed3')}</li>
                  <li className="flex items-start gap-3"><span className="text-green-500 mt-0.5">✓</span> {t('problem.llmsNeed4')}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('features.title')}
            </h2>
            <p className="text-xl text-gray-600">
              {t('features.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 mb-5">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('features.entityBuilder')}</h3>
              <p className="text-gray-600 text-sm">{t('features.entityBuilderDesc')}</p>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-400 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30 mb-5">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('features.citationsManager')}</h3>
              <p className="text-gray-600 text-sm">{t('features.citationsManagerDesc')}</p>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-400 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/30 mb-5">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('features.schemaGenerator')}</h3>
              <p className="text-gray-600 text-sm">{t('features.schemaGeneratorDesc')}</p>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-400 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/30 mb-5">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('features.aiVisibilityTracker')}</h3>
              <p className="text-gray-600 text-sm">{t('features.aiVisibilityTrackerDesc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('pricing.title')}
            </h2>
            <p className="text-xl text-gray-600">
              {t('pricing.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto items-center">
            {/* Free/Starter Plan */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg shadow-gray-100/50">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t('pricingPage.plans.free.name')}</h3>
              <p className="text-gray-500 mb-6">{t('pricingPage.plans.free.description')}</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">{t('pricingPage.free')}</span>
              </div>
              <ul className="space-y-3 mb-8 text-gray-600">
                {(t.raw('pricingPage.plans.free.features') as string[]).map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href={localePath('/register')} className="block w-full py-3 text-center border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition font-medium">{t('pricingPage.plans.free.cta')}</Link>
            </div>

            {/* Professional Plan - Most Popular */}
            <div className="bg-gradient-to-b from-white to-purple-50 border-2 border-purple-200 rounded-2xl p-8 relative shadow-xl shadow-purple-100/50 scale-105">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white text-sm font-semibold px-4 py-1.5 rounded-full shadow-lg">{t('pricingPage.mostPopular')}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t('pricingPage.plans.professional.name')}</h3>
              <p className="text-gray-500 mb-6">{t('pricingPage.plans.professional.description')}</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">CHF 149</span>
                <span className="text-gray-500">/{t('pricingPage.mo')}</span>
              </div>
              <ul className="space-y-3 mb-8 text-gray-600">
                {(t.raw('pricingPage.plans.professional.features') as string[]).map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href={localePath('/register')} className="block w-full py-3 text-center bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-xl hover:opacity-90 transition font-semibold shadow-lg">{t('pricingPage.plans.professional.cta')}</Link>
            </div>

            {/* Business Plan */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg shadow-gray-100/50">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t('pricingPage.plans.business.name')}</h3>
              <p className="text-gray-500 mb-6">{t('pricingPage.plans.business.description')}</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">CHF 299</span>
                <span className="text-gray-500">/{t('pricingPage.mo')}</span>
              </div>
              <ul className="space-y-3 mb-8 text-gray-600">
                {(t.raw('pricingPage.plans.business.features') as string[]).map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href={localePath('/register')} className="block w-full py-3 text-center border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition font-medium">{t('pricingPage.plans.business.cta')}</Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-16">
              {t('faq.title')}
            </h2>

            <FaqAccordion questions={faqQuestions} />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-[#667eea] to-[#764ba2]">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {t('cta.title')}
          </h2>
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            {t('cta.subtitle')}
          </p>
          <Link href={localePath('/register')} className="inline-block px-8 py-4 bg-white text-gray-900 text-lg font-semibold rounded-xl hover:bg-gray-100 transition shadow-xl hover:-translate-y-0.5">
            {t('cta.button')}
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-12">
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
              <Link href={localePath('/privacy')} className="hover:text-gray-900 transition">{t('footer.privacy')}</Link>
              <Link href={localePath('/terms')} className="hover:text-gray-900 transition">{t('footer.terms')}</Link>
              <Link href={localePath('/contact')} className="hover:text-gray-900 transition">{t('footer.contact')}</Link>
            </div>
            <p className="text-gray-500">© 2025 GetCitedBy. {t('footer.madeIn')}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
