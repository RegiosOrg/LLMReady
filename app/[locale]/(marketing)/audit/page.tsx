'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, Loader2, AlertCircle, CheckCircle2, XCircle, ArrowRight, TrendingUp, Download } from 'lucide-react'

const SWISS_CITIES = [
  'Zürich',
  'Genf',
  'Basel',
  'Bern',
  'Lausanne',
  'Winterthur',
  'Luzern',
  'St. Gallen',
  'Lugano',
  'Biel/Bienne',
  'Thun',
  'Köniz',
  'La Chaux-de-Fonds',
  'Schaffhausen',
  'Fribourg',
  'Chur',
  'Neuchâtel',
  'Vernier',
  'Uster',
  'Sion',
  'Zug',
]

const INDUSTRIES = [
  { value: 'treuhand', label: 'Treuhand / Buchhalter' },
  { value: 'anwalt', label: 'Rechtsanwalt / Notar' },
  { value: 'zahnarzt', label: 'Zahnarzt / Zahnklinik' },
  { value: 'arzt', label: 'Arzt / Klinik' },
  { value: 'immobilien', label: 'Immobilien / Makler' },
  { value: 'handwerk', label: 'Handwerker / Bauunternehmen' },
  { value: 'restaurant', label: 'Restaurant / Gastronomie' },
  { value: 'hotel', label: 'Hotel / Unterkunft' },
  { value: 'auto', label: 'Autohandel / Werkstatt' },
  { value: 'versicherung', label: 'Versicherung / Finanzen' },
  { value: 'it', label: 'IT / Software' },
  { value: 'other', label: 'Andere Branche' },
]

interface AuditResult {
  provider: string
  prompt: string
  response: string
  mentioned: boolean
  score: number
}

interface AuditResponse {
  businessName: string
  city: string
  industry: string
  overallScore: number
  mentionedIn: string
  results: AuditResult[]
  recommendations: string[]
  timestamp: string
}

export default function AuditPage() {
  const router = useRouter()
  const [businessName, setBusinessName] = useState('')
  const [city, setCity] = useState('')
  const [industry, setIndustry] = useState('')
  const [loading, setLoading] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<AuditResponse | null>(null)

  const downloadPDF = async () => {
    if (!results) return
    setDownloading(true)
    try {
      const response = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(results),
      })

      if (!response.ok) {
        throw new Error('Failed to generate PDF')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `audit-report-${results.businessName.replace(/\s+/g, '-').toLowerCase()}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      console.error('Download error:', err)
    } finally {
      setDownloading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName,
          city,
          industry: INDUSTRIES.find(i => i.value === industry)?.label || industry,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to run audit')
      }

      const data: AuditResponse = await response.json()
      setResults(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-400'
    if (score >= 40) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getScoreBg = (score: number) => {
    if (score >= 70) return 'from-green-500/20 to-green-500/5'
    if (score >= 40) return 'from-yellow-500/20 to-yellow-500/5'
    return 'from-red-500/20 to-red-500/5'
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
            <Link href="/pricing" className="text-slate-300 hover:text-white">
              Pricing
            </Link>
            <Link href="/login" className="text-slate-300 hover:text-white">
              Sign in
            </Link>
            <Button asChild>
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-12">
        {!results ? (
          <>
            {/* Hero */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-indigo-500/10 text-indigo-400 px-4 py-2 rounded-full mb-6">
                <Search className="w-4 h-4" />
                <span className="text-sm font-medium">Free AI Visibility Check</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Is Your Business Visible to AI?
              </h1>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                Check if ChatGPT, Claude, and other AI assistants know about your business.
                Takes 30 seconds, no signup required.
              </p>
            </div>

            {/* Form */}
            <Card className="max-w-xl mx-auto">
              <CardHeader>
                <CardTitle>Enter Your Business Details</CardTitle>
                <CardDescription>
                  We'll check how AI assistants respond to queries about your business.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name</Label>
                    <Input
                      id="businessName"
                      placeholder="e.g., Müller Treuhand AG"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Select value={city} onValueChange={setCity} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a city" />
                      </SelectTrigger>
                      <SelectContent>
                        {SWISS_CITIES.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Select value={industry} onValueChange={setIndustry} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your industry" />
                      </SelectTrigger>
                      <SelectContent>
                        {INDUSTRIES.map((ind) => (
                          <SelectItem key={ind.value} value={ind.value}>
                            {ind.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 text-red-400 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {error}
                    </div>
                  )}

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Checking AI Visibility...
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4 mr-2" />
                        Check My Visibility
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Trust indicators */}
            <div className="mt-12 text-center">
              <p className="text-slate-500 text-sm mb-4">Trusted by Swiss businesses</p>
              <div className="flex justify-center gap-8 text-slate-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span className="text-sm">No signup required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Free forever</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Instant results</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Results */
          <div className="max-w-3xl mx-auto">
            {/* Score Hero */}
            <Card className={`mb-8 bg-gradient-to-br ${getScoreBg(results.overallScore)} border-0`}>
              <CardContent className="py-12 text-center">
                <p className="text-slate-400 mb-2">AI Visibility Score</p>
                <div className={`text-7xl font-bold ${getScoreColor(results.overallScore)} mb-2`}>
                  {results.overallScore}
                </div>
                <p className="text-slate-400">out of 100</p>
                <p className="text-xl text-white mt-4">
                  {results.businessName} - {results.city}
                </p>
                <p className="text-slate-400 mt-2">
                  Mentioned in {results.mentionedIn} AI checks
                </p>
              </CardContent>
            </Card>

            {/* Individual Results */}
            <h2 className="text-xl font-semibold text-white mb-4">Check Results</h2>
            <div className="space-y-4 mb-8">
              {results.results.map((result, index) => (
                <Card key={index}>
                  <CardContent className="py-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-300">
                          {result.provider}
                        </span>
                        {result.mentioned ? (
                          <span className="flex items-center gap-1 text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded">
                            <CheckCircle2 className="w-3 h-3" />
                            Mentioned
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs text-red-400 bg-red-500/10 px-2 py-1 rounded">
                            <XCircle className="w-3 h-3" />
                            Not Found
                          </span>
                        )}
                      </div>
                      <span className={`text-sm font-medium ${getScoreColor(result.score)}`}>
                        Score: {result.score}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mb-2">Prompt: "{result.prompt}"</p>
                    <p className="text-sm text-slate-400 line-clamp-4">{result.response}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recommendations */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-indigo-400" />
                  Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {results.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-3 text-slate-300">
                      <span className="flex-shrink-0 w-6 h-6 bg-indigo-500/10 text-indigo-400 rounded-full flex items-center justify-center text-sm">
                        {index + 1}
                      </span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* CTA */}
            <Card className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-indigo-500/20">
              <CardContent className="py-8 text-center">
                <h3 className="text-2xl font-bold text-white mb-2">
                  Want to Improve Your Score?
                </h3>
                <p className="text-slate-400 mb-6">
                  GetCitedBy monitors your AI visibility and helps you get recommended by ChatGPT, Claude, and more.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg">
                    <Link href="/register">
                      Start Free Trial
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" onClick={downloadPDF} disabled={downloading}>
                    {downloading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF
                      </>
                    )}
                  </Button>
                  <Button variant="ghost" size="lg" onClick={() => setResults(null)}>
                    Run Another Check
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Share */}
            <div className="mt-8 text-center">
              <p className="text-slate-500 text-sm">
                Report generated on {new Date(results.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
        )}
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
              <Link href="/pricing" className="hover:text-white">Pricing</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
