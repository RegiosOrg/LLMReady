'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  INDUSTRY_BENCHMARKS,
  OVERALL_STATS,
  type IndustryBenchmark
} from '@/lib/benchmarks/industryData'

// Score bar component
function ScoreBar({ score, name, highlight = false }: { score: number; name: string; highlight?: boolean }) {
  const getColor = (s: number) => {
    if (s >= 80) return 'bg-emerald-500'
    if (s >= 60) return 'bg-lime-500'
    if (s >= 40) return 'bg-amber-500'
    if (s >= 20) return 'bg-orange-500'
    return 'bg-red-500'
  }

  return (
    <div className={`flex items-center gap-3 py-2 px-3 rounded-lg transition-all ${highlight ? 'bg-slate-800 ring-2 ring-amber-500' : 'hover:bg-slate-800/50'}`}>
      <div className="w-48 truncate text-sm font-medium">
        {highlight && <span className="text-amber-400 mr-2">{">"}</span>}
        {name}
      </div>
      <div className="flex-1 h-6 bg-slate-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${getColor(score)} transition-all duration-500 flex items-center justify-end pr-2`}
          style={{ width: `${score}%` }}
        >
          {score >= 30 && <span className="text-xs font-bold text-white">{score}</span>}
        </div>
      </div>
      {score < 30 && <span className="text-xs font-bold text-slate-400 w-8">{score}</span>}
    </div>
  )
}

// Industry selector pill
function IndustryPill({ industry, selected, onClick }: { industry: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
        selected
          ? 'bg-indigo-600 text-white'
          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
      }`}
    >
      {INDUSTRY_BENCHMARKS[industry]?.industryDE || industry}
    </button>
  )
}

// Stat card
function StatCard({ value, label, accent = false }: { value: string; label: string; accent?: boolean }) {
  return (
    <div className={`p-6 rounded-xl ${accent ? 'bg-gradient-to-br from-indigo-600 to-purple-700' : 'bg-slate-800'}`}>
      <div className={`text-4xl font-bold ${accent ? 'text-white' : 'text-white'}`}>{value}</div>
      <div className={`text-sm mt-1 ${accent ? 'text-indigo-200' : 'text-slate-400'}`}>{label}</div>
    </div>
  )
}

export default function VisibilityPage() {
  const [selectedIndustry, setSelectedIndustry] = useState('Treuhand')
  const industries = Object.keys(INDUSTRY_BENCHMARKS)
  const benchmark = INDUSTRY_BENCHMARKS[selectedIndustry]

  // Simulated "your business" for demo
  const demoBusinessScore = 28

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/50 via-slate-950 to-slate-950" />

        <div className="relative max-w-6xl mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
              <span className="text-amber-400 text-sm font-medium">Live Daten aus Januar 2026</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Wer erscheint, wenn Ihre Kunden
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                ChatGPT fragen?
              </span>
            </h1>

            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Wir haben {OVERALL_STATS.totalBusinessesTested} Schweizer Unternehmen getestet.
              <span className="text-amber-400 font-semibold"> {OVERALL_STATS.percentBelow40}% sind für KI unsichtbar.</span>
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
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Branchenvergleich</h2>
          <p className="text-slate-400">Wählen Sie eine Branche, um die KI-Sichtbarkeit zu sehen</p>
        </div>

        {/* Industry pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {industries.map(industry => (
            <IndustryPill
              key={industry}
              industry={industry}
              selected={selectedIndustry === industry}
              onClick={() => setSelectedIndustry(industry)}
            />
          ))}
        </div>

        {/* Industry details */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left: Rankings */}
          <div className="bg-slate-900 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">KI-Empfehlungsranking</h3>
              <span className="text-sm text-slate-400">
                Ø Score: <span className="text-white font-semibold">{benchmark.avgScore}</span>
              </span>
            </div>

            <div className="space-y-1">
              {benchmark.topPerformers.map((business, i) => (
                <ScoreBar key={i} name={business.name} score={business.score} />
              ))}

              {/* Separator */}
              <div className="flex items-center gap-3 py-3">
                <div className="flex-1 border-t border-dashed border-slate-700" />
                <span className="text-xs text-slate-500">Weitere Unternehmen</span>
                <div className="flex-1 border-t border-dashed border-slate-700" />
              </div>

              {/* Demo "your business" */}
              <ScoreBar name="Ihr Unternehmen?" score={demoBusinessScore} highlight />
            </div>

            <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
              <p className="text-sm text-amber-200">
                <strong className="text-amber-400">Insight:</strong> {benchmark.insight}
              </p>
            </div>
          </div>

          {/* Right: Distribution */}
          <div className="bg-slate-900 rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-6">Score-Verteilung in {benchmark.industryDE}</h3>

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
                  <div className="w-32 text-sm text-slate-400">{item.label}</div>
                  <div className="flex-1 h-8 bg-slate-800 rounded-lg overflow-hidden">
                    <div
                      className={`h-full ${item.color} flex items-center justify-end pr-2 transition-all duration-500`}
                      style={{ width: `${Math.max(item.value, 2)}%` }}
                    >
                      {item.value > 10 && <span className="text-xs font-bold text-white">{item.value}%</span>}
                    </div>
                  </div>
                  {item.value <= 10 && <span className="text-xs text-slate-500 w-10">{item.value}%</span>}
                </div>
              ))}
            </div>

            {/* Key insight */}
            <div className="mt-8 p-4 bg-slate-800 rounded-xl">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-white">Das Problem</h4>
                  <p className="text-sm text-slate-400 mt-1">
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
      <section className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-12 border border-slate-700">
          <div className="w-16 h-16 bg-indigo-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Wo steht <span className="text-indigo-400">Ihr</span> Unternehmen?
          </h2>

          <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
            Wenn ein potenzieller Kunde ChatGPT fragt "Empfehle mir einen {benchmark.industryDE.split(' ')[0]} in Zürich"
            — erscheinen Sie in der Antwort?
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/audit"
              className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-4 rounded-xl transition-all hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              Kostenlos prüfen
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold px-8 py-4 rounded-xl transition-all"
            >
              Preise ansehen
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">So funktioniert KI-Sichtbarkeit</h2>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: '1',
              title: 'Kunde fragt KI',
              description: '"Ich brauche einen Treuhänder in Zürich. Wen kannst du empfehlen?"',
              example: true
            },
            {
              icon: '2',
              title: 'KI durchsucht Training',
              description: 'ChatGPT, Claude und andere KI-Modelle nutzen ihre Trainingsdaten, um Empfehlungen zu generieren.',
              example: false
            },
            {
              icon: '3',
              title: 'Nur Top-Unternehmen erscheinen',
              description: 'Unternehmen mit starker Online-Präsenz, Zitationen und strukturierten Daten werden empfohlen.',
              example: false
            },
          ].map((step, i) => (
            <div key={i} className="bg-slate-900 rounded-2xl p-6">
              <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-xl font-bold mb-4">
                {step.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className={`text-slate-400 ${step.example ? 'italic' : ''}`}>
                {step.example ? `"${step.description}"` : step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Verpassen Sie keine Kunden mehr
          </h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Prüfen Sie jetzt Ihre KI-Sichtbarkeit und erfahren Sie,
            wie Sie von ChatGPT, Claude und anderen KI-Assistenten empfohlen werden.
          </p>
          <Link
            href="/audit"
            className="inline-flex items-center justify-center gap-2 bg-white text-indigo-700 font-semibold px-8 py-4 rounded-xl transition-all hover:scale-105 hover:shadow-xl"
          >
            Jetzt kostenlos prüfen
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer note */}
      <footer className="max-w-6xl mx-auto px-4 py-8 text-center text-sm text-slate-500">
        <p>
          Daten basierend auf Tests mit GPT-4o-mini, Januar 2026.
          Ergebnisse können je nach Zeitpunkt und KI-Modell variieren.
        </p>
      </footer>
    </div>
  )
}
