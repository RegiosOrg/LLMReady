'use client'

import { useState, useEffect } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/i18n/routing'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Search, Loader2, AlertCircle, CheckCircle2, XCircle, ArrowRight, TrendingUp, Download, ChevronsUpDown, Check, Users, Target, Award } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  getIndustryBenchmark,
  getCompetitivePosition,
  type IndustryBenchmark
} from '@/lib/benchmarks/industryData'

// Comprehensive list of Swiss cities (alphabetically sorted)
const SWISS_CITIES = [
  'Aarau', 'Aarberg', 'Aarburg', 'Adliswil', 'Affoltern am Albis', 'Aigle', 'Allschwil', 'Altdorf', 'Amriswil', 'Appenzell',
  'Arbon', 'Arlesheim', 'Arosa', 'Arth', 'Ascona', 'Au', 'Aubonne', 'Avenches',
  'Baden', 'Bad Ragaz', 'Bad Zurzach', 'Basel', 'Bassersdorf', 'Bellinzona', 'Belp', 'Bern', 'Biel/Bienne', 'Binningen', 'Birsfelden', 'Bischofszell', 'Bönigen', 'Brig', 'Brugg', 'Buchs', 'Bülach', 'Bulle', 'Burgdorf',
  'Carouge', 'Cham', 'Chêne-Bougeries', 'Chiasso', 'Chur', 'Coire', 'Collombey-Muraz', 'Conthey', 'Coppet', 'Crans-Montana',
  'Davos', 'Delémont', 'Dietikon', 'Dübendorf', 'Düdingen',
  'Ebikon', 'Ecublens', 'Eglisau', 'Einsiedeln', 'Emmen', 'Engelberg',
  'Flawil', 'Frauenfeld', 'Freiburg', 'Fribourg', 'Frutigen',
  'Gams', 'Genf', 'Genève', 'Gland', 'Glarus', 'Gossau', 'Grenchen', 'Grindelwald', 'Gruyères',
  'Herisau', 'Herzogenbuchsee', 'Hinwil', 'Hochdorf', 'Horgen', 'Horw',
  'Illnau-Effretikon', 'Interlaken', 'Ittigen',
  'Jona', 'Jura',
  'Kloten', 'Köniz', 'Kreuzlingen', 'Kriens', 'Küsnacht', 'Küssnacht',
  'La Chaux-de-Fonds', 'La Tour-de-Peilz', 'Lachen', 'Lancy', 'Langenthal', 'Laufen', 'Lausanne', 'Lenzburg', 'Leuk', 'Leukerbad', 'Liestal', 'Locarno', 'Luzern', 'Lyss',
  'Männedorf', 'Martigny', 'Meilen', 'Mels', 'Mendrisio', 'Meyrin', 'Monthey', 'Montreux', 'Morges', 'Moudon', 'Moutier', 'Muri', 'Murten', 'Muttenz',
  'Näfels', 'Naters', 'Neuchâtel', 'Neuhausen am Rheinfall', 'Nidau', 'Nyon',
  'Oberriet', 'Oberwil', 'Oftringen', 'Olten', 'Onex', 'Opfikon', 'Orbe', 'Ostermundigen',
  'Payerne', 'Peseux', 'Pfäffikon', 'Plan-les-Ouates', 'Pontresina', 'Porrentruy', 'Pratteln', 'Prilly', 'Pully',
  'Rapperswil-Jona', 'Regensdorf', 'Reinach', 'Renens', 'Rheinfelden', 'Richterswil', 'Riehen', 'Rorschach', 'Rüti',
  'Sargans', 'Sarnen', 'Schaffhausen', 'Schlieren', 'Schwyz', 'Siders', 'Sierre', 'Sion', 'Solothurn', 'Spiez', 'Spreitenbach', 'St. Gallen', 'St. Margrethen', 'St. Moritz', 'Stäfa', 'Stans', 'Steffisburg', 'Stein am Rhein', 'Sursee',
  'Thalwil', 'Thônex', 'Thun', 'Thusis',
  'Urdorf', 'Uster', 'Uznach',
  'Vevey', 'Vernier', 'Visp', 'Volketswil',
  'Wädenswil', 'Wald', 'Wallisellen', 'Wangen-Brüttisellen', 'Wattwil', 'Weinfelden', 'Wettingen', 'Wetzikon', 'Wil', 'Willisau', 'Winterthur', 'Wohlen',
  'Yverdon-les-Bains',
  'Zermatt', 'Zofingen', 'Zollikon', 'Zug', 'Zürich',
]

const INDUSTRY_KEYS = [
  'treuhand',
  'anwalt',
  'zahnarzt',
  'arzt',
  'immobilien',
  'handwerk',
  'restaurant',
  'hotel',
  'auto',
  'versicherung',
  'it',
  'other',
] as const

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
  const t = useTranslations()
  const locale = useLocale()

  const [businessName, setBusinessName] = useState('')
  const [city, setCity] = useState('')
  const [cityOpen, setCityOpen] = useState(false)
  const [citySearch, setCitySearch] = useState('')
  const [industry, setIndustry] = useState('')
  const [customIndustry, setCustomIndustry] = useState('')
  const [loading, setLoading] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<AuditResponse | null>(null)
  const [benchmark, setBenchmark] = useState<IndustryBenchmark | null>(null)
  const [competitivePosition, setCompetitivePosition] = useState<ReturnType<typeof getCompetitivePosition> | null>(null)

  // Fetch benchmark data when results are available
  useEffect(() => {
    if (results) {
      const industryBenchmark = getIndustryBenchmark(results.industry)
      setBenchmark(industryBenchmark)

      if (industryBenchmark) {
        const position = getCompetitivePosition(results.overallScore, results.industry)
        setCompetitivePosition(position)
      }
    } else {
      setBenchmark(null)
      setCompetitivePosition(null)
    }
  }, [results])

  const languages = [
    { code: 'en', name: 'EN' },
    { code: 'de', name: 'DE' },
    { code: 'fr', name: 'FR' },
  ]

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
      // Use custom industry text if "other" is selected, otherwise use translated industry name
      const industryValue = industry === 'other' && customIndustry
        ? customIndustry
        : t(`audit.industries.${industry}`)

      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName,
          city,
          industry: industryValue,
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
    if (score >= 70) return 'text-green-600'
    if (score >= 40) return 'text-amber-600'
    return 'text-red-600'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 70) return 'from-green-50 to-emerald-50 border-green-200'
    if (score >= 40) return 'from-amber-50 to-orange-50 border-amber-200'
    return 'from-red-50 to-rose-50 border-red-200'
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
              <Link href="/pricing" className="text-gray-600 hover:text-gray-900 transition font-medium">{t('nav.pricing')}</Link>

              {/* Language Switcher */}
              <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-lg">
                {languages.map((lang) => (
                  <Link
                    key={lang.code}
                    href="/audit"
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

      <main className="container mx-auto px-6 py-16">
        {!results ? (
          <>
            {/* Hero */}
            <div className="text-center mb-12 relative">
              <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-200 rounded-full blur-3xl opacity-20"></div>
              <div className="absolute top-10 right-1/4 w-64 h-64 bg-indigo-200 rounded-full blur-3xl opacity-30"></div>

              <div className="relative">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 rounded-full text-purple-700 text-sm mb-8 shadow-sm">
                  <Search className="w-4 h-4" />
                  <span className="font-medium">{t('audit.badge')}</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  {t('audit.title')}
                  <span className="bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent"> {t('audit.titleHighlight')}</span>
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                  {t('audit.subtitle')}
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="max-w-xl mx-auto">
              <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-xl shadow-gray-100/50">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{t('audit.formTitle')}</h2>
                <p className="text-gray-500 mb-6">{t('audit.formSubtitle')}</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="businessName" className="text-gray-700">{t('audit.businessName')}</Label>
                    <Input
                      id="businessName"
                      placeholder={t('audit.businessNamePlaceholder')}
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      required
                      className="border-gray-200 focus:border-purple-300 focus:ring-purple-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-gray-700">{t('audit.city')}</Label>
                    <Popover open={cityOpen} onOpenChange={setCityOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={cityOpen}
                          className="w-full justify-between border-gray-200 font-normal"
                        >
                          {city || t('audit.cityPlaceholder')}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0" align="start">
                        <Command>
                          <CommandInput
                            placeholder={t('audit.citySearchPlaceholder') || 'Search city...'}
                            value={citySearch}
                            onValueChange={setCitySearch}
                          />
                          <CommandList>
                            <CommandEmpty>
                              {citySearch && (
                                <button
                                  className="w-full px-2 py-3 text-sm text-left hover:bg-gray-100 cursor-pointer"
                                  onClick={() => {
                                    setCity(citySearch)
                                    setCityOpen(false)
                                    setCitySearch('')
                                  }}
                                >
                                  {t('audit.useCustomCity') || 'Use'}: &quot;{citySearch}&quot;
                                </button>
                              )}
                            </CommandEmpty>
                            <CommandGroup>
                              {SWISS_CITIES.filter(c =>
                                c.toLowerCase().includes(citySearch.toLowerCase())
                              ).slice(0, 50).map((c) => (
                                <CommandItem
                                  key={c}
                                  value={c}
                                  onSelect={(value) => {
                                    setCity(value)
                                    setCityOpen(false)
                                    setCitySearch('')
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      city === c ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  {c}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="industry" className="text-gray-700">{t('audit.industry')}</Label>
                    <Select value={industry} onValueChange={(value) => {
                      setIndustry(value)
                      if (value !== 'other') setCustomIndustry('')
                    }} required>
                      <SelectTrigger className="border-gray-200">
                        <SelectValue placeholder={t('audit.industryPlaceholder')} />
                      </SelectTrigger>
                      <SelectContent>
                        {INDUSTRY_KEYS.map((key) => (
                          <SelectItem key={key} value={key}>
                            {t(`audit.industries.${key}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {industry === 'other' && (
                      <Input
                        placeholder={t('audit.customIndustryPlaceholder') || 'Enter your industry/niche...'}
                        value={customIndustry}
                        onChange={(e) => setCustomIndustry(e.target.value)}
                        className="border-gray-200 focus:border-purple-300 focus:ring-purple-200 mt-2"
                        required
                      />
                    )}
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
                      <AlertCircle className="w-4 h-4" />
                      {error}
                    </div>
                  )}

                  <Button type="submit" className="w-full bg-gradient-to-r from-[#667eea] to-[#764ba2] hover:opacity-90 shadow-lg shadow-purple-500/25" size="lg" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {t('audit.checking')}
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4 mr-2" />
                        {t('audit.submitButton')}
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>

            {/* Trust indicators */}
            <div className="mt-12 text-center">
              <p className="text-gray-500 text-sm mb-4">{t('audit.trustedBy')}</p>
              <div className="flex flex-wrap justify-center gap-8 text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span className="text-sm">{t('audit.noSignup')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span className="text-sm">{t('audit.freeForever')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span className="text-sm">{t('audit.instantResults')}</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Results */
          <div className="max-w-3xl mx-auto">
            {/* Score Hero */}
            <div className={`mb-8 bg-gradient-to-br ${getScoreBgColor(results.overallScore)} rounded-2xl border p-12 text-center shadow-lg`}>
              <p className="text-gray-500 mb-2 font-medium">{t('audit.scoreLabel')}</p>
              <div className={`text-7xl font-bold ${getScoreColor(results.overallScore)} mb-2`}>
                {results.overallScore}
              </div>
              <p className="text-gray-500">{t('audit.outOf')}</p>
              <p className="text-xl text-gray-900 mt-4 font-semibold">
                {results.businessName} - {results.city}
              </p>
              <p className="text-gray-500 mt-2">
                {t('audit.mentionedIn', { count: results.mentionedIn })}
              </p>
            </div>

            {/* Competitive Position Section */}
            {benchmark && competitivePosition && (
              <div className="mb-8 bg-white rounded-2xl border border-gray-200 p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Wettbewerbsanalyse</h3>
                    <p className="text-sm text-gray-500">Ihre Position in {benchmark.industryDE}</p>
                  </div>
                </div>

                {/* Position Badge */}
                <div className={`mb-6 p-4 rounded-xl border ${
                  competitivePosition.urgency === 'critical' ? 'bg-red-50 border-red-200' :
                  competitivePosition.urgency === 'warning' ? 'bg-amber-50 border-amber-200' :
                  competitivePosition.urgency === 'moderate' ? 'bg-blue-50 border-blue-200' :
                  'bg-green-50 border-green-200'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-lg font-bold ${
                      competitivePosition.urgency === 'critical' ? 'text-red-700' :
                      competitivePosition.urgency === 'warning' ? 'text-amber-700' :
                      competitivePosition.urgency === 'moderate' ? 'text-blue-700' :
                      'text-green-700'
                    }`}>
                      {competitivePosition.position}
                    </span>
                    <span className="text-sm text-gray-600">
                      Top {Math.round(100 - competitivePosition.percentile)}%
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{competitivePosition.message}</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <div className="text-2xl font-bold text-gray-900">{results.overallScore}</div>
                    <div className="text-xs text-gray-500">Ihr Score</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <div className="text-2xl font-bold text-gray-900">{benchmark.avgScore}</div>
                    <div className="text-xs text-gray-500">Branchenschnitt</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <div className="text-2xl font-bold text-emerald-600">{benchmark.topPerformers[0]?.score || 0}</div>
                    <div className="text-xs text-gray-500">Branchenführer</div>
                  </div>
                </div>

                {/* Top Competitors */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    Top Wettbewerber in Ihrer Branche
                  </h4>
                  <div className="space-y-2">
                    {benchmark.topPerformers.slice(0, 4).map((competitor, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          i === 0 ? 'bg-amber-100 text-amber-700' :
                          i === 1 ? 'bg-gray-100 text-gray-600' :
                          i === 2 ? 'bg-orange-100 text-orange-700' :
                          'bg-gray-50 text-gray-500'
                        }`}>
                          {i + 1}
                        </span>
                        <div className="flex-1 flex items-center gap-2">
                          <span className="text-sm text-gray-700 truncate">{competitor.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                competitor.score >= 80 ? 'bg-emerald-500' :
                                competitor.score >= 60 ? 'bg-lime-500' :
                                competitor.score >= 40 ? 'bg-amber-500' :
                                'bg-red-500'
                              }`}
                              style={{ width: `${competitor.score}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-900 w-8">{competitor.score}</span>
                        </div>
                      </div>
                    ))}

                    {/* Show user's position */}
                    <div className="flex items-center gap-3 bg-purple-50 p-2 rounded-lg border border-purple-200 mt-3">
                      <span className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold">
                        Sie
                      </span>
                      <div className="flex-1 flex items-center gap-2">
                        <span className="text-sm font-medium text-purple-900 truncate">{results.businessName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-purple-200 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-purple-600"
                            style={{ width: `${results.overallScore}%` }}
                          />
                        </div>
                        <span className="text-sm font-bold text-purple-900 w-8">{results.overallScore}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Gap to Leader */}
                {benchmark.topPerformers[0] && results.overallScore < benchmark.topPerformers[0].score && (
                  <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-indigo-600" />
                      <div>
                        <p className="text-sm font-medium text-indigo-900">
                          Gap zum Branchenführer: <span className="font-bold">{benchmark.topPerformers[0].score - results.overallScore} Punkte</span>
                        </p>
                        <p className="text-xs text-indigo-700 mt-1">
                          {benchmark.insight}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Individual Results */}
            <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('audit.checkResults')}</h2>
            <div className="space-y-4 mb-8">
              {results.results.map((result, index) => (
                <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-gray-900">
                        {result.provider}
                      </span>
                      {result.mentioned ? (
                        <span className="flex items-center gap-1 text-xs text-green-700 bg-green-50 px-2.5 py-1 rounded-full border border-green-200 font-medium">
                          <CheckCircle2 className="w-3 h-3" />
                          {t('audit.mentioned')}
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs text-red-700 bg-red-50 px-2.5 py-1 rounded-full border border-red-200 font-medium">
                          <XCircle className="w-3 h-3" />
                          {t('audit.notFound')}
                        </span>
                      )}
                    </div>
                    <span className={`text-sm font-semibold ${getScoreColor(result.score)}`}>
                      {t('audit.score')}: {result.score}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">{t('audit.prompt')}: &quot;{result.prompt}&quot;</p>
                  <p className="text-sm text-gray-600 line-clamp-4 bg-gray-50 p-3 rounded-lg">{result.response}</p>
                </div>
              ))}
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-8">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center shadow-lg shadow-purple-500/20">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                {t('audit.recommendations')}
              </h3>
              <ul className="space-y-3">
                {results.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-3 text-gray-600">
                    <span className="flex-shrink-0 w-6 h-6 bg-purple-100 text-[#667eea] rounded-full flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl border border-purple-100 p-8 text-center shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {t('audit.improveTitle')}
              </h3>
              <p className="text-gray-600 mb-6">
                {t('audit.improveSubtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-gradient-to-r from-[#667eea] to-[#764ba2] hover:opacity-90 shadow-lg shadow-purple-500/25">
                  <Link href="/register">
                    {t('audit.startTrial')}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" onClick={downloadPDF} disabled={downloading} className="border-gray-300">
                  {downloading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {t('audit.generating')}
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      {t('audit.downloadPdf')}
                    </>
                  )}
                </Button>
                <Button variant="ghost" size="lg" onClick={() => setResults(null)} className="text-gray-600 hover:text-gray-900">
                  {t('audit.runAnother')}
                </Button>
              </div>
            </div>

            {/* Timestamp */}
            <div className="mt-8 text-center">
              <p className="text-gray-400 text-sm">
                {t('audit.reportGenerated')} {new Date(results.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
        )}
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
              <Link href="/pricing" className="hover:text-gray-900 transition">{t('nav.pricing')}</Link>
            </div>
            <p className="text-gray-500">&copy; 2025 GetCitedBy. {t('footer.madeIn')}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
