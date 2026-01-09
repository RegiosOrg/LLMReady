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
  Code2,
  RefreshCw,
  CheckCircle2,
  Clock,
  Loader2,
  AlertCircle,
  Copy,
  Check,
  Sparkles,
  FileCode,
  Download,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'

interface Business {
  id: string
  name: string
  addressCity: string | null
}

interface SchemaItem {
  id: string
  schemaType: string
  jsonLd: string
  status: string
  createdAt: string
}

export default function SchemaPage() {
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [selectedBusiness, setSelectedBusiness] = useState<string>('')
  const [schemaItems, setSchemaItems] = useState<SchemaItem[]>([])
  const [stats, setStats] = useState({ total: 0, implemented: 0, pending: 0 })
  const [loading, setLoading] = useState(true)
  const [loadingSchemas, setLoadingSchemas] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

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

  // Fetch schemas when business changes
  useEffect(() => {
    if (!selectedBusiness) return

    async function fetchSchemas() {
      setLoadingSchemas(true)
      setError(null)
      try {
        const res = await fetch(`/api/schema?businessId=${selectedBusiness}`)
        if (res.ok) {
          const data = await res.json()
          setSchemaItems(data.schemaItems || [])
          setStats(data.stats || { total: 0, implemented: 0, pending: 0 })
        } else {
          setError('Failed to load schemas')
        }
      } catch {
        setError('Failed to load schemas')
      } finally {
        setLoadingSchemas(false)
      }
    }
    fetchSchemas()
  }, [selectedBusiness])

  // Generate schemas
  const generateSchemas = async () => {
    if (!selectedBusiness) return

    setGenerating(true)
    setError(null)

    try {
      const res = await fetch('/api/schema', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessId: selectedBusiness }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to generate schemas')
      }

      const data = await res.json()
      setSchemaItems(data.schemas || [])
      setStats({
        total: data.schemas?.length || 0,
        implemented: 0,
        pending: data.schemas?.length || 0,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate schemas')
    } finally {
      setGenerating(false)
    }
  }

  // Copy to clipboard
  const copyToClipboard = async (id: string, jsonLd: string) => {
    try {
      // Pretty print the JSON
      const formatted = JSON.stringify(JSON.parse(jsonLd), null, 2)
      await navigator.clipboard.writeText(formatted)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch {
      setError('Failed to copy to clipboard')
    }
  }

  // Download all schemas
  const downloadAll = () => {
    if (schemaItems.length === 0) return

    const allSchemas = schemaItems.map(item => JSON.parse(item.jsonLd))
    const blob = new Blob([JSON.stringify(allSchemas, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `schemas-${selectedBusiness}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getSchemaTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      Organization: 'Organization',
      LocalBusiness: 'Local Business',
      WebSite: 'Website',
      Service: 'Service',
      Product: 'Product',
      FAQPage: 'FAQ',
      BreadcrumbList: 'Breadcrumbs',
    }
    return labels[type] || type
  }

  const getSchemaTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      Organization: 'from-[#667eea] to-[#764ba2]',
      LocalBusiness: 'from-blue-500 to-cyan-400',
      WebSite: 'from-green-500 to-emerald-400',
      Service: 'from-amber-500 to-orange-400',
      Product: 'from-pink-500 to-rose-400',
      FAQPage: 'from-indigo-500 to-purple-400',
    }
    return colors[type] || 'from-gray-400 to-gray-500'
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header
          title="Schema Generator"
          description="Generate structured data markup for your business"
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
        title="Schema Generator"
        description="Generate structured data markup for your business"
      />

      <div className="p-6 space-y-6">
        {/* Generate Schema Section */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-green-500/20">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Schema Markup Generator</h2>
              <p className="text-sm text-gray-500">Create JSON-LD structured data that helps AI understand your business</p>
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
              onClick={generateSchemas}
              disabled={generating || !selectedBusiness}
              className="min-w-[180px] bg-gradient-to-r from-green-500 to-emerald-400 hover:opacity-90"
            >
              {generating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Schemas
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
              Add a business first to generate schema markup.
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Schemas</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center shadow-lg shadow-purple-500/30">
                <FileCode className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Implemented</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{stats.implemented}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-green-500/30">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <p className="text-3xl font-bold text-amber-600 mt-1">{stats.pending}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-400 flex items-center justify-center shadow-lg shadow-amber-500/30">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Schema Items */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Generated Schemas</h2>
              <p className="text-sm text-gray-500">Copy and add these to your website&apos;s &lt;head&gt; section</p>
            </div>
            {schemaItems.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                className="border-green-200 text-green-700 hover:bg-green-50"
                onClick={downloadAll}
              >
                <Download className="w-4 h-4 mr-2" />
                Download All
              </Button>
            )}
          </div>
          <div className="p-6">
            {loadingSchemas ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-[#667eea]" />
              </div>
            ) : schemaItems.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <Code2 className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500">No schemas generated yet.</p>
                <p className="text-sm text-gray-400 mt-1">Click &quot;Generate Schemas&quot; to create structured data markup.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {schemaItems.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-gray-100 hover:border-purple-200 transition-all overflow-hidden"
                  >
                    <div
                      className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                      onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getSchemaTypeColor(item.schemaType)} flex items-center justify-center text-white font-semibold shadow-lg`}>
                          <Code2 className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{getSchemaTypeLabel(item.schemaType)}</p>
                          <p className="text-xs text-gray-500">
                            {item.status === 'implemented' ? (
                              <span className="text-green-600 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                Implemented
                              </span>
                            ) : (
                              <span className="text-amber-600 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Pending implementation
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-purple-200 text-[#667eea] hover:bg-purple-50"
                          onClick={(e) => {
                            e.stopPropagation()
                            copyToClipboard(item.id, item.jsonLd)
                          }}
                        >
                          {copiedId === item.id ? (
                            <>
                              <Check className="w-4 h-4 mr-1" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4 mr-1" />
                              Copy
                            </>
                          )}
                        </Button>
                        {expandedId === item.id ? (
                          <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </div>

                    {expandedId === item.id && (
                      <div className="border-t border-gray-100 bg-gray-900 p-4">
                        <pre className="text-sm text-green-400 overflow-x-auto">
                          <code>
                            {`<script type="application/ld+json">\n${JSON.stringify(JSON.parse(item.jsonLd), null, 2)}\n</script>`}
                          </code>
                        </pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Implementation Guide */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl border border-purple-100 p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-3">How to Implement</h3>
          <ol className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-[#667eea] text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
              <span>Copy the schema markup using the &quot;Copy&quot; button above</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-[#667eea] text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
              <span>Paste it inside the &lt;head&gt; section of your website&apos;s HTML</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-[#667eea] text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
              <span>Validate using <a href="https://validator.schema.org/" target="_blank" rel="noopener noreferrer" className="text-[#667eea] hover:underline">Google&apos;s Rich Results Test</a></span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-[#667eea] text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5">4</span>
              <span>Mark as &quot;Implemented&quot; once added to your website</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  )
}
