'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  INDUSTRY_BENCHMARKS,
  OVERALL_STATS,
  type IndustryBenchmark
} from '@/lib/benchmarks/industryData'

// Score bar component - light theme
function ScoreBar({ score, name, highlight = false }: { score: number; name: string; highlight?: boolean }) {
  const getColor = (s: number) => {
    if (s >= 80) return 'bg-emerald-500'
    if (s >= 60) return 'bg-lime-500'
    if (s >= 40) return 'bg-amber-500'
    if (s >= 20) return 'bg-orange-500'
    return 'bg-red-500'
  }

  return (
    <div className={`flex items-center gap-3 py-2 px-3 rounded-lg transition-all ${highlight ? 'bg-purple-50 ring-2 ring-purple-500' : 'hover:bg-gray-50'}`}>
      <div className="w-48 truncate text-sm font-medium text-gray-700">
        {highlight && <span className="text-purple-600 mr-2">{">"}</span>}
        {name}
      </div>
      <div className="flex-1 h-6 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${getColor(score)} transition-all duration-500 flex items-center justify-end pr-2`}
          style={{ width: `${score}%` }}
        >
          {score >= 30 && <span className="text-xs font-bold text-white">{score}</span>}
        </div>
      </div>
      {score < 30 && <span className="text-xs font-bold text-gray-500 w-8">{score}</span>}
    </div>
  )
}

// Industry selector pill - light theme
function IndustryPill({ industry, selected, onClick }: { industry: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
        selected
          ? 'bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white shadow-lg shadow-purple-500/25'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      {INDUSTRY_BENCHMARKS[industry]?.industryDE || industry}
    </button>
  )
}

// Stat card - light theme
function StatCard({ value, label, accent = false }: { value: string; label: string; accent?: boolean }) {
  return (
    <div className={`p-6 rounded-2xl border ${accent ? 'bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200' : 'bg-white border-gray-200'} shadow-sm`}>
      <div className={`text-4xl font-bold ${accent ? 'bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent' : 'text-gray-900'}`}>{value}</div>
      <div className={`text-sm mt-1 ${accent ? 'text-purple-600' : 'text-gray-500'}`}>{label}</div>
    </div>
  )
}

// Priority industries to show first (most common B2B targets)
const PRIORITY_INDUSTRIES = [
  'Treuhand',
  'Rechtsanwalt',
  'Zahnarzt',
  'Immobilien',
  'Restaurant',
  'Hotel',
  'Auto',
  'IT',
  'Handwerk',
  'Architekt',
  'Versicherung',
  'Arzt',
]

export default function VisibilityPage() {
  const params = useParams()
  const locale = params?.locale as string || 'de'
  const [selectedIndustry, setSelectedIndustry] = useState('Treuhand')
  const [showAllIndustries, setShowAllIndustries] = useState(false)
  const allIndustries = Object.keys(INDUSTRY_BENCHMARKS)

  // Show priority industries first, then the rest
  const sortedIndustries = [
    ...PRIORITY_INDUSTRIES.filter(i => allIndustries.includes(i)),
    ...allIndustries.filter(i => !PRIORITY_INDUSTRIES.includes(i))
  ]

  const industries = showAllIndustries ? sortedIndustries : sortedIndustries.slice(0, 12)
  const remainingCount = sortedIndustries.length - 12
  const benchmark = INDUSTRY_BENCHMARKS[selectedIndustry]

  // Simulated "your business" for demo
  const demoBusinessScore = 28

  // Language switcher options
  const languages = [
    { code: 'en', name: 'EN' },
    { code: 'de', name: 'DE' },
    { code: 'fr', name: 'FR' },
  ]

  const localePath = (path: string) => {
    if (locale === 'en') return path
    return `/${locale}${path}`
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation - matching home page */}
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
              <Link href={localePath('/audit')} className="text-purple-600 hover:text-purple-700 transition font-medium">Kostenloser Check</Link>
              <Link href={localePath('/visibility')} className="text-gray-900 font-semibold border-b-2 border-purple-500 pb-1">KI-Sichtbarkeit</Link>
              <Link href={localePath('/pricing')} className="text-gray-600 hover:text-gray-900 transition font-medium">Preise</Link>

              {/* Language Switcher */}
              <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-lg">
                {languages.map((lang) => (
                  <Link
                    key={lang.code}
                    href={`/${lang.code}/visibility`}
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

              <Link href={localePath('/login')} className="px-5 py-2.5 text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition font-medium">
                Login
              </Link>
              <Link href={localePath('/register')} className="px-5 py-2.5 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-xl hover:opacity-90 transition font-medium shadow-lg shadow-purple-500/25">
                Starten
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - light theme */}
      <section className="relative overflow-hidden">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-purple-200 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute top-40 right-1/4 w-80 h-80 bg-indigo-200 rounded-full blur-3xl opacity-40"></div>

        <div className="relative max-w-6xl mx-auto px-6 pt-16 pb-12">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 rounded-full text-purple-700 text-sm mb-8 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
              Live Daten aus Januar 2026
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Wer erscheint, wenn Ihre Kunden
              <br />
              <span className="bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
                ChatGPT fragen?
              </span>
            </h1>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Wir haben <span className="font-semibold text-gray-900">{OVERALL_STATS.totalBusinessesTested} Schweizer Unternehmen</span> getestet.
              <span className="text-red-600 font-semibold"> {OVERALL_STATS.percentBelow40}% sind für KI unsichtbar.</span>
            </p>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            <StatCard value={`${OVERALL_STATS.totalBusinessesTested}`} label="Unternehmen getestet" />
            <StatCard value={`${OVERALL_STATS.avgScore}`} label="Durchschnittlicher Score" />
            <StatCard value={`${OVERALL_STATS.percentBelow40}%`} label="Unter Sichtbarkeitsgrenze" accent />
            <StatCard value={`${OVERALL_STATS.percentInvisible}%`} label="Komplett unsichtbar" />
          </div>
        </div>
      </section>

      {/* Industry Comparison Section */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Branchenvergleich</h2>
          <p className="text-gray-600">Wählen Sie eine Branche, um die KI-Sichtbarkeit zu sehen</p>
        </div>

        {/* Industry pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {industries.map(industry => (
            <IndustryPill
              key={industry}
              industry={industry}
              selected={selectedIndustry === industry}
              onClick={() => setSelectedIndustry(industry)}
            />
          ))}
        </div>

        {/* Show more / Show less button */}
        {remainingCount > 0 && (
          <div className="flex justify-center mb-8">
            <button
              onClick={() => setShowAllIndustries(!showAllIndustries)}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-full transition-all"
            >
              {showAllIndustries ? (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                  Weniger anzeigen
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                  {remainingCount} weitere Branchen anzeigen
                </>
              )}
            </button>
          </div>
        )}

        {/* Industry details */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left: Rankings */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg shadow-gray-100/50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">KI-Empfehlungsranking</h3>
              <span className="text-sm text-gray-500">
                Ø Score: <span className="text-gray-900 font-semibold">{benchmark.avgScore}</span>
              </span>
            </div>

            <div className="space-y-1">
              {benchmark.topPerformers.map((business, i) => (
                <ScoreBar key={i} name={business.name} score={business.score} />
              ))}

              {/* Separator */}
              <div className="flex items-center gap-3 py-3">
                <div className="flex-1 border-t border-dashed border-gray-300" />
                <span className="text-xs text-gray-400">Weitere Unternehmen</span>
                <div className="flex-1 border-t border-dashed border-gray-300" />
              </div>

              {/* Demo "your business" */}
              <ScoreBar name="Ihr Unternehmen?" score={demoBusinessScore} highlight />
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 rounded-xl">
              <p className="text-sm text-purple-800">
                <strong className="text-purple-700">Insight:</strong> {benchmark.insight}
              </p>
            </div>
          </div>

          {/* Right: Distribution */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg shadow-gray-100/50">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Score-Verteilung in {benchmark.industryDE}</h3>

            <div className="space-y-4">
              {/* Distribution bars */}
              {[
                { label: 'Excellent (80-100)', value: benchmark.distribution.excellent, color: 'bg-emerald-500' },
                { label: 'Good (60-79)', value: benchmark.distribution.good, color: 'bg-lime-500' },
                { label: 'Fair (40-59)', value: benchmark.distribution.fair, color: 'bg-amber-500' },
                { label: 'Poor (20-39)', value: benchmark.distribution.poor, color: 'bg-orange-500' },
                { label: 'Invisible (0-19)', value: benchmark.distribution.invisible, color: 'bg-red-500' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-32 text-sm text-gray-600">{item.label}</div>
                  <div className="flex-1 h-8 bg-gray-100 rounded-lg overflow-hidden">
                    <div
                      className={`h-full ${item.color} flex items-center justify-end pr-2 transition-all duration-500`}
                      style={{ width: `${Math.max(item.value, 2)}%` }}
                    >
                      {item.value > 10 && <span className="text-xs font-bold text-white">{item.value}%</span>}
                    </div>
                  </div>
                  {item.value <= 10 && <span className="text-xs text-gray-500 w-10">{item.value}%</span>}
                </div>
              ))}
            </div>

            {/* Key insight */}
            <div className="mt-8 p-4 bg-red-50 border border-red-100 rounded-xl">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-red-800">Das Problem</h4>
                  <p className="text-sm text-red-700 mt-1">
                    {benchmark.distribution.poor + benchmark.distribution.invisible}% der Unternehmen in dieser Branche
                    haben einen Score unter 40. Diese werden von KI-Assistenten praktisch nie empfohlen.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Question */}
      <section className="max-w-4xl mx-auto px-6 py-16 text-center">
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-3xl p-12 border border-purple-100 shadow-lg">
          <div className="w-16 h-16 bg-gradient-to-br from-[#667eea] to-[#764ba2] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-500/30">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Wo steht <span className="bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">Ihr</span> Unternehmen?
          </h2>

          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Wenn ein potenzieller Kunde ChatGPT fragt: «Empfiehl mir {benchmark.recommendDE} in Zürich»
            — erscheint Ihr Unternehmen in der Antwort?
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={localePath('/audit')}
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-semibold px-8 py-4 rounded-xl transition-all hover:opacity-90 shadow-lg shadow-purple-500/30"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              Kostenlos prüfen
            </Link>
            <Link
              href={localePath('/pricing')}
              className="inline-flex items-center justify-center gap-2 bg-white border-2 border-gray-200 text-gray-700 font-semibold px-8 py-4 rounded-xl transition-all hover:bg-gray-50 hover:border-gray-300"
            >
              Preise ansehen
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works - Expanded with larger cards */}
      <section className="max-w-6xl mx-auto px-6 py-16 bg-gradient-to-b from-gray-50 to-white rounded-3xl my-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">So funktioniert KI-Sichtbarkeit</h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Verstehen Sie, wie ChatGPT, Claude und andere KI-Assistenten entscheiden, welche Unternehmen sie empfehlen
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg shadow-gray-100/50 hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 bg-gradient-to-br from-[#667eea] to-[#764ba2] rounded-2xl flex items-center justify-center text-2xl font-bold text-white mb-6 shadow-lg shadow-purple-500/30">
              1
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Kunde fragt KI</h3>
            <div className="bg-gray-50 rounded-xl p-4 mb-4 border border-gray-100">
              <p className="text-gray-700 italic text-sm">
                "Ich brauche einen Treuhänder in Zürich. Wen kannst du empfehlen?"
              </p>
            </div>
            <p className="text-gray-600 text-sm">
              Immer mehr Menschen nutzen ChatGPT, Claude oder Perplexity statt Google, um lokale Dienstleister zu finden.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg shadow-gray-100/50 hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 bg-gradient-to-br from-[#667eea] to-[#764ba2] rounded-2xl flex items-center justify-center text-2xl font-bold text-white mb-6 shadow-lg shadow-purple-500/30">
              2
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">KI durchsucht Wissen</h3>
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">Webseiten & Online-Präsenz</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">Branchenverzeichnisse</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">Strukturierte Daten (Schema)</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">Bewertungen & Erwähnungen</span>
              </div>
            </div>
            <p className="text-gray-600 text-sm">
              Die KI analysiert alle verfügbaren Informationen über Ihr Unternehmen.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg shadow-gray-100/50 hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 bg-gradient-to-br from-[#667eea] to-[#764ba2] rounded-2xl flex items-center justify-center text-2xl font-bold text-white mb-6 shadow-lg shadow-purple-500/30">
              3
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Top-Unternehmen werden empfohlen</h3>
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-green-600 font-bold">1.</span>
                <span className="text-gray-700 text-sm">KPMG AG, Zürich</span>
                <span className="ml-auto text-xs text-green-600 font-medium">Empfohlen</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-600 font-bold">2.</span>
                <span className="text-gray-700 text-sm">Deloitte AG</span>
                <span className="ml-auto text-xs text-green-600 font-medium">Empfohlen</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 font-bold">?</span>
                <span className="text-gray-400 text-sm">Ihr Unternehmen</span>
                <span className="ml-auto text-xs text-red-500 font-medium">Nicht gefunden</span>
              </div>
            </div>
            <p className="text-gray-600 text-sm">
              Nur Unternehmen mit starker Online-Präsenz und strukturierten Daten erscheinen in den Empfehlungen.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-3xl p-12 text-center shadow-2xl shadow-purple-500/30">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Verpassen Sie keine Kunden mehr
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Prüfen Sie jetzt Ihre KI-Sichtbarkeit und erfahren Sie,
            wie Sie von ChatGPT, Claude und anderen KI-Assistenten empfohlen werden.
          </p>
          <Link
            href={localePath('/audit')}
            className="inline-flex items-center justify-center gap-2 bg-white text-gray-900 font-semibold px-8 py-4 rounded-xl transition-all hover:bg-gray-100 shadow-xl"
          >
            Jetzt kostenlos prüfen
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
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
              <Link href={localePath('/privacy')} className="hover:text-gray-900 transition">Datenschutz</Link>
              <Link href={localePath('/terms')} className="hover:text-gray-900 transition">AGB</Link>
              <Link href={localePath('/pricing')} className="hover:text-gray-900 transition">Preise</Link>
            </div>
            <p className="text-gray-500 text-sm">
              Daten: Tests mit GPT-4o-mini, Januar 2026
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
