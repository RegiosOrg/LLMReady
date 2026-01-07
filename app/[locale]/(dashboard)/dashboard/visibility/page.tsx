'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/dashboard/Header'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  BarChart3,
  RefreshCw,
  CheckCircle2,
  XCircle,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  Minus,
  Loader2,
  AlertCircle,
  Sparkles,
} from 'lucide-react'

interface Business {
  id: string
  name: string
  addressCity: string | null
}

interface LlmCheck {
  id: string
  provider: string
  model: string | null
  prompt: string
  response: string | null
  mentioned: boolean
  accuracyScore: number | null
  sentiment: string | null
  mentionContext: string | null
  createdAt: string
  business: Business
}

const PROMPT_TYPES = [
  { value: 'localRecommendation', label: 'Local Business Recommendation' },
  { value: 'directQuery', label: 'Direct Business Query' },
  { value: 'comparisonQuery', label: 'Business Comparison' },
  { value: 'reputationQuery', label: 'Reputation Check' },
]

export default function VisibilityPage() {
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [selectedBusiness, setSelectedBusiness] = useState<string>('')
  const [selectedPromptType, setSelectedPromptType] = useState('localRecommendation')
  const [checks, setChecks] = useState<LlmCheck[]>([])
  const [loading, setLoading] = useState(true)
  const [running, setRunning] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch businesses and checks
  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch businesses
        const bizRes = await fetch('/api/businesses')
        if (bizRes.ok) {
          const bizData = await bizRes.json()
          // API returns array directly, not { businesses: [...] }
          const bizList = Array.isArray(bizData) ? bizData : (bizData.businesses || [])
          setBusinesses(bizList)
          if (bizList.length > 0 && !selectedBusiness) {
            setSelectedBusiness(bizList[0].id)
          }
        }

        // Fetch checks
        const checksRes = await fetch('/api/visibility')
        if (checksRes.ok) {
          const checksData = await checksRes.json()
          setChecks(checksData.checks || [])
        }
      } catch (err) {
        setError('Failed to load data')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Run new visibility check
  const runCheck = async () => {
    if (!selectedBusiness) return

    setRunning(true)
    setError(null)

    try {
      const response = await fetch('/api/visibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId: selectedBusiness,
          promptType: selectedPromptType,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to run check')
      }

      const data = await response.json()

      // Add new check to list
      const newCheck = {
        ...data.check,
        business: businesses.find(b => b.id === selectedBusiness)!,
      }
      setChecks(prev => [newCheck, ...prev])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setRunning(false)
    }
  }

  const getScoreColor = (score: number | null) => {
    if (score === null) return 'text-gray-400'
    if (score >= 70) return 'text-green-600'
    if (score >= 40) return 'text-amber-600'
    return 'text-red-600'
  }

  const getSentimentIcon = (sentiment: string | null) => {
    switch (sentiment?.toUpperCase()) {
      case 'POSITIVE':
        return <TrendingUp className="w-4 h-4 text-green-500" />
      case 'NEGATIVE':
        return <TrendingDown className="w-4 h-4 text-red-500" />
      default:
        return <Minus className="w-4 h-4 text-gray-400" />
    }
  }

  // Calculate stats
  const filteredChecks = selectedBusiness
    ? checks.filter(c => c.business.id === selectedBusiness)
    : checks

  const stats = {
    total: filteredChecks.length,
    mentioned: filteredChecks.filter(c => c.mentioned).length,
    avgScore: filteredChecks.length > 0
      ? Math.round(filteredChecks.reduce((sum, c) => sum + (c.accuracyScore || 0), 0) / filteredChecks.length)
      : 0,
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header
          title="AI Visibility"
          description="Monitor how AI assistants perceive your business"
        />
        <div className="flex items-center justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#667eea]" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header
        title="AI Visibility"
        description="Monitor how AI assistants perceive your business"
      />

      <div className="p-6 space-y-6">
        {/* Run New Check */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl border border-purple-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Run AI Visibility Check</h2>
              <p className="text-sm text-gray-500">Test how ChatGPT and other AI assistants respond to queries about your business</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Select value={selectedBusiness} onValueChange={setSelectedBusiness}>
              <SelectTrigger className="flex-1 bg-white border-gray-200">
                <SelectValue placeholder="Select a business" />
              </SelectTrigger>
              <SelectContent>
                {businesses.map(biz => (
                  <SelectItem key={biz.id} value={biz.id}>
                    {biz.name} {biz.addressCity && `- ${biz.addressCity}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedPromptType} onValueChange={setSelectedPromptType}>
              <SelectTrigger className="flex-1 bg-white border-gray-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PROMPT_TYPES.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              onClick={runCheck}
              disabled={running || !selectedBusiness}
              className="min-w-[160px] bg-gradient-to-r from-[#667eea] to-[#764ba2] hover:opacity-90"
            >
              {running ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Checking...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Run Check
                </>
              )}
            </Button>
          </div>

          {error && (
            <div className="mt-4 flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          {businesses.length === 0 && (
            <div className="mt-4 text-gray-500 text-sm">
              Add a business first to run visibility checks.
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Checks</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center shadow-lg shadow-purple-500/30">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Mentioned In</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {stats.mentioned}/{stats.total}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-green-500/30">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Avg. Score</p>
                <p className={`text-3xl font-bold mt-1 ${getScoreColor(stats.avgScore)}`}>
                  {stats.avgScore}%
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-400 flex items-center justify-center shadow-lg shadow-amber-500/30">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Results List */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Check History</h2>
            <p className="text-sm text-gray-500">Past AI visibility checks for your businesses</p>
          </div>
          <div className="p-6">
            {filteredChecks.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500">No visibility checks yet.</p>
                <p className="text-sm text-gray-400 mt-1">Run your first check above to see results.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredChecks.map(check => (
                  <div
                    key={check.id}
                    className="p-4 rounded-xl border border-gray-100 hover:border-purple-200 hover:bg-purple-50/30 transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center text-white font-semibold shadow-lg shadow-purple-500/20">
                          {check.business.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{check.business.name}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span className="px-2 py-0.5 rounded-full bg-purple-100 text-[#667eea] font-medium">
                              {check.provider === 'openai' ? 'ChatGPT' : check.provider}
                            </span>
                            <span>{new Date(check.createdAt).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          {getSentimentIcon(check.sentiment)}
                        </div>
                        {check.mentioned ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-green-50 text-green-600 text-xs font-medium border border-green-200">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Mentioned
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-red-50 text-red-600 text-xs font-medium border border-red-200">
                            <XCircle className="w-3 h-3 mr-1" />
                            Not Found
                          </span>
                        )}
                        <span className={`font-semibold ${getScoreColor(check.accuracyScore)}`}>
                          {check.accuracyScore ?? 0}%
                        </span>
                      </div>
                    </div>

                    <div className="text-xs text-gray-500 mb-2">
                      Prompt: &quot;{check.prompt}&quot;
                    </div>

                    {check.response && (
                      <div className="text-sm text-gray-600 line-clamp-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                        {check.response}
                      </div>
                    )}

                    {check.mentionContext && (
                      <div className="mt-2 text-sm text-green-700 bg-green-50 p-2 rounded-lg border border-green-200">
                        <span className="text-xs text-green-600 font-medium">Mention: </span>
                        &quot;...{check.mentionContext}...&quot;
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
