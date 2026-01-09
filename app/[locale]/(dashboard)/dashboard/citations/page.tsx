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
  MapPin,
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Loader2,
  AlertCircle,
  ExternalLink,
  Plus,
  Globe,
  Phone,
  Building2,
  Shield,
  Sparkles,
} from 'lucide-react'

interface Business {
  id: string
  name: string
  addressCity: string | null
  addressStreet: string | null
  phone: string | null
}

interface CitationSource {
  id: string
  name: string
  slug: string
  url: string
  category: string
  priority: number
}

interface Citation {
  id: string
  source: string
  sourceUrl: string | null
  listedName: string | null
  listedAddress: string | null
  listedPhone: string | null
  status: string
  createdAt: string
}

interface ChecklistItem {
  source: CitationSource
  citation: Citation | null
  status: string
}

interface NapCheckResult {
  overallScore: number
  issues: Array<{
    severity: 'high' | 'medium' | 'low'
    field: 'name' | 'address' | 'phone'
    source: string
    expected: string
    found: string
    message: string
  }>
  recommendations: string[]
}

export default function CitationsPage() {
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [selectedBusiness, setSelectedBusiness] = useState<string>('')
  const [checklist, setChecklist] = useState<ChecklistItem[]>([])
  const [stats, setStats] = useState({ total: 0, started: 0, verified: 0, conflicts: 0 })
  const [loading, setLoading] = useState(true)
  const [loadingCitations, setLoadingCitations] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [runningNapCheck, setRunningNapCheck] = useState(false)
  const [napResult, setNapResult] = useState<NapCheckResult | null>(null)

  // Fetch businesses
  useEffect(() => {
    async function fetchBusinesses() {
      try {
        const res = await fetch('/api/businesses')
        if (res.ok) {
          const data = await res.json()
          const bizList = Array.isArray(data) ? data : (data.businesses || [])
          setBusinesses(bizList)
          if (bizList.length > 0) {
            setSelectedBusiness(bizList[0].id)
          }
        }
      } catch {
        setError('Failed to load businesses')
      } finally {
        setLoading(false)
      }
    }
    fetchBusinesses()
  }, [])

  // Fetch citations when business changes
  useEffect(() => {
    if (!selectedBusiness) return

    async function fetchCitations() {
      setLoadingCitations(true)
      setError(null)
      try {
        const res = await fetch(`/api/citations?businessId=${selectedBusiness}`)
        if (res.ok) {
          const data = await res.json()
          setChecklist(data.checklist || [])
          setStats(data.stats || { total: 0, started: 0, verified: 0, conflicts: 0 })
        } else {
          setError('Failed to load citations')
        }
      } catch {
        setError('Failed to load citations')
      } finally {
        setLoadingCitations(false)
      }
    }
    fetchCitations()
  }, [selectedBusiness])

  // Run NAP consistency check
  const runNapCheck = async () => {
    if (!selectedBusiness) return

    setRunningNapCheck(true)
    setError(null)

    try {
      const res = await fetch('/api/nap-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessId: selectedBusiness }),
      })

      if (res.ok) {
        const data = await res.json()
        setNapResult(data.result)
        // Refresh citations to show updated statuses
        const citationsRes = await fetch(`/api/citations?businessId=${selectedBusiness}`)
        if (citationsRes.ok) {
          const citationsData = await citationsRes.json()
          setChecklist(citationsData.checklist || [])
          setStats(citationsData.stats || { total: 0, started: 0, verified: 0, conflicts: 0 })
        }
      } else {
        const data = await res.json()
        setError(data.error || 'Failed to run NAP check')
      }
    } catch {
      setError('Failed to run NAP check')
    } finally {
      setRunningNapCheck(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />
      case 'submitted':
        return <Clock className="w-4 h-4 text-blue-500" />
      case 'conflict':
        return <AlertTriangle className="w-4 h-4 text-amber-500" />
      case 'pending':
        return <Clock className="w-4 h-4 text-gray-400" />
      default:
        return <XCircle className="w-4 h-4 text-gray-300" />
    }
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      verified: 'bg-green-50 text-green-600 border-green-200',
      submitted: 'bg-blue-50 text-blue-600 border-blue-200',
      conflict: 'bg-amber-50 text-amber-600 border-amber-200',
      pending: 'bg-gray-50 text-gray-600 border-gray-200',
      not_started: 'bg-gray-50 text-gray-400 border-gray-200',
    }
    const labels: Record<string, string> = {
      verified: 'Verified',
      submitted: 'Submitted',
      conflict: 'NAP Conflict',
      pending: 'Pending',
      not_started: 'Not Started',
    }
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status] || styles.not_started}`}>
        {getStatusIcon(status)}
        <span className="ml-1">{labels[status] || 'Not Started'}</span>
      </span>
    )
  }

  const selectedBusinessData = businesses.find(b => b.id === selectedBusiness)

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header
          title="Citations Manager"
          description="Track and manage your business directory listings"
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
        title="Citations Manager"
        description="Track and manage your business directory listings"
      />

      <div className="p-6 space-y-6">
        {/* Business Selector */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Citation Tracking</h2>
              <p className="text-sm text-gray-500">Monitor your business listings across Swiss directories</p>
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

            <Button
              variant="outline"
              disabled={!selectedBusiness || loadingCitations}
              className="min-w-[140px] border-blue-200 text-blue-700 hover:bg-blue-50"
              onClick={() => {
                // Re-fetch citations
                if (selectedBusiness) {
                  setLoadingCitations(true)
                  fetch(`/api/citations?businessId=${selectedBusiness}`)
                    .then(res => res.json())
                    .then(data => {
                      setChecklist(data.checklist || [])
                      setStats(data.stats || { total: 0, started: 0, verified: 0, conflicts: 0 })
                    })
                    .finally(() => setLoadingCitations(false))
                }
              }}
            >
              {loadingCitations ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
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
              Add a business first to track citations.
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Sources</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center shadow-lg shadow-purple-500/30">
                <Globe className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Started</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {stats.started}/{stats.total}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <MapPin className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Verified</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{stats.verified}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-green-500/30">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">NAP Conflicts</p>
                <p className={`text-3xl font-bold mt-1 ${stats.conflicts > 0 ? 'text-amber-600' : 'text-gray-900'}`}>
                  {stats.conflicts}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-400 flex items-center justify-center shadow-lg shadow-amber-500/30">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* NAP Monitoring Section */}
        {selectedBusiness && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-100 p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-400 flex items-center justify-center shadow-lg shadow-amber-500/20">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">NAP Consistency Monitor</h2>
                  <p className="text-sm text-gray-500">Check Name, Address, Phone consistency across all citations</p>
                </div>
              </div>
              <Button
                onClick={runNapCheck}
                disabled={runningNapCheck}
                className="bg-gradient-to-r from-amber-500 to-orange-400 hover:opacity-90"
              >
                {runningNapCheck ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Checking...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Run NAP Check
                  </>
                )}
              </Button>
            </div>

            {/* NAP Check Results */}
            {napResult && (
              <div className="mt-4 pt-4 border-t border-amber-200">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`text-3xl font-bold ${
                    napResult.overallScore >= 80 ? 'text-green-600' :
                    napResult.overallScore >= 50 ? 'text-amber-600' : 'text-red-600'
                  }`}>
                    {napResult.overallScore}%
                  </div>
                  <div className="text-sm text-gray-600">
                    NAP Consistency Score
                    {napResult.issues.length > 0 && (
                      <span className="ml-2 text-amber-600">({napResult.issues.length} issues found)</span>
                    )}
                  </div>
                </div>

                {/* Issues */}
                {napResult.issues.length > 0 && (
                  <div className="space-y-2 mb-4">
                    {napResult.issues.slice(0, 5).map((issue, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-lg text-sm ${
                          issue.severity === 'high' ? 'bg-red-50 border border-red-200 text-red-700' :
                          issue.severity === 'medium' ? 'bg-amber-50 border border-amber-200 text-amber-700' :
                          'bg-yellow-50 border border-yellow-200 text-yellow-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4" />
                          <span className="font-medium">{issue.source}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-white/50">{issue.field}</span>
                        </div>
                        <p className="mt-1 text-xs">{issue.message}</p>
                      </div>
                    ))}
                    {napResult.issues.length > 5 && (
                      <p className="text-xs text-amber-600">
                        + {napResult.issues.length - 5} more issues
                      </p>
                    )}
                  </div>
                )}

                {/* Recommendations */}
                {napResult.recommendations.length > 0 && (
                  <div className="bg-white/50 rounded-lg p-4">
                    <p className="text-xs font-semibold text-gray-700 mb-2">Recommendations:</p>
                    <ul className="space-y-1">
                      {napResult.recommendations.map((rec, idx) => (
                        <li key={idx} className="text-xs text-gray-600 flex items-start gap-2">
                          <CheckCircle2 className="w-3 h-3 text-amber-500 mt-0.5 flex-shrink-0" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Your Business Info */}
        {selectedBusinessData && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Your Canonical Business Info (NAP)</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex items-center gap-3 text-sm">
                <Building2 className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{selectedBusinessData.name}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">
                  {selectedBusinessData.addressStreet || 'No address'}, {selectedBusinessData.addressCity || 'N/A'}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{selectedBusinessData.phone || 'No phone'}</span>
              </div>
            </div>
          </div>
        )}

        {/* Citations Checklist */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Citation Sources</h2>
            <p className="text-sm text-gray-500">Swiss business directories to list your business on</p>
          </div>
          <div className="p-6">
            {loadingCitations ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-[#667eea]" />
              </div>
            ) : checklist.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500">No citation sources found.</p>
                <p className="text-sm text-gray-400 mt-1">Select a business to view citation sources.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {checklist.map((item) => (
                  <div
                    key={item.source.id}
                    className={`p-4 rounded-xl border transition-all ${
                      item.status === 'conflict'
                        ? 'border-amber-200 bg-amber-50/50'
                        : item.status === 'verified'
                        ? 'border-green-200 bg-green-50/50'
                        : 'border-gray-100 hover:border-purple-200 hover:bg-purple-50/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-semibold shadow-lg ${
                          item.source.category === 'essential'
                            ? 'bg-gradient-to-br from-[#667eea] to-[#764ba2] shadow-purple-500/20'
                            : item.source.category === 'industry'
                            ? 'bg-gradient-to-br from-blue-500 to-cyan-400 shadow-blue-500/20'
                            : 'bg-gradient-to-br from-gray-400 to-gray-500 shadow-gray-500/20'
                        }`}>
                          {item.source.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-gray-900">{item.source.name}</p>
                            {item.source.category === 'essential' && (
                              <span className="px-2 py-0.5 rounded-full bg-purple-100 text-[#667eea] text-xs font-medium">
                                Essential
                              </span>
                            )}
                          </div>
                          <a
                            href={item.source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-gray-500 hover:text-[#667eea] flex items-center gap-1"
                          >
                            {item.source.url.replace('https://', '').split('/')[0]}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {getStatusBadge(item.status)}
                        {item.status === 'not_started' && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-purple-200 text-[#667eea] hover:bg-purple-50"
                            onClick={() => window.open(item.source.url, '_blank')}
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Add
                          </Button>
                        )}
                        {item.citation?.sourceUrl && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-gray-500 hover:text-[#667eea]"
                            onClick={() => window.open(item.citation!.sourceUrl!, '_blank')}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Show conflict details */}
                    {item.status === 'conflict' && item.citation && (
                      <div className="mt-3 pt-3 border-t border-amber-200">
                        <p className="text-xs font-medium text-amber-700 mb-2">NAP Inconsistency Detected:</p>
                        <div className="grid gap-2 md:grid-cols-3 text-xs">
                          {item.citation.listedName && item.citation.listedName !== selectedBusinessData?.name && (
                            <div className="flex items-center gap-2">
                              <Building2 className="w-3 h-3 text-amber-500" />
                              <span className="text-amber-700">Listed as: {item.citation.listedName}</span>
                            </div>
                          )}
                          {item.citation.listedAddress && (
                            <div className="flex items-center gap-2">
                              <MapPin className="w-3 h-3 text-amber-500" />
                              <span className="text-amber-700">Address: {item.citation.listedAddress}</span>
                            </div>
                          )}
                          {item.citation.listedPhone && item.citation.listedPhone !== selectedBusinessData?.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="w-3 h-3 text-amber-500" />
                              <span className="text-amber-700">Phone: {item.citation.listedPhone}</span>
                            </div>
                          )}
                        </div>
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
