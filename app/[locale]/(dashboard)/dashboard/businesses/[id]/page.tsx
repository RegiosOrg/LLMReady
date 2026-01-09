'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'

interface Citation {
  id: string
  source: string
  sourceUrl: string | null
  status: string
  napMatchScore: number | null
  lastCheckedAt: string | null
  createdAt: string
}

interface LlmCheck {
  id: string
  provider: string
  model: string | null
  mentioned: boolean
  accuracyScore: number | null
  sentiment: string | null
  createdAt: string
}

interface SchemaItem {
  id: string
  schemaType: string
  status: string
  createdAt: string
}

interface Business {
  id: string
  name: string
  uid: string | null
  industry: string
  description: string | null
  addressStreet: string | null
  addressCity: string | null
  addressPostal: string | null
  addressCanton: string | null
  phone: string | null
  email: string | null
  website: string | null
  services: string[]
  status: string
  visibilityScore: number
  citationScore: number
  schemaScore: number
  createdAt: string
  updatedAt: string
  citations: Citation[]
  llmChecks: LlmCheck[]
  schemaItems: SchemaItem[]
}

export default function BusinessDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [business, setBusiness] = useState<Business | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'citations' | 'schema' | 'visibility'>('overview')

  useEffect(() => {
    async function fetchBusiness() {
      try {
        const response = await fetch(`/api/businesses/${params.id}`)
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Business not found')
          }
          throw new Error('Failed to fetch business')
        }
        const data = await response.json()
        setBusiness(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchBusiness()
    }
  }, [params.id])

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      ACTIVE: 'default',
      DRAFT: 'secondary',
      PAUSED: 'outline',
      ARCHIVED: 'destructive',
    }
    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>
  }

  const getCitationStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      verified: 'default',
      submitted: 'secondary',
      pending: 'outline',
      conflict: 'destructive',
    }
    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>
  }

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-500'
    if (score >= 40) return 'text-yellow-500'
    return 'text-red-500'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error || !business) {
    return (
      <div className="p-6">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
            <CardDescription>{error || 'Business not found'}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={() => router.push('/dashboard')}>
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Link href="/dashboard" className="hover:underline">
              Dashboard
            </Link>
            <span>/</span>
            <span>{business.name}</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{business.name}</h1>
            {getStatusBadge(business.status)}
          </div>
          <p className="text-muted-foreground mt-1">
            {business.industry}
            {business.addressCity && ` - ${business.addressCity}`}
            {business.addressCanton && `, ${business.addressCanton}`}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Edit</Button>
          <Button>Run Check</Button>
        </div>
      </div>

      {/* Score Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              AI Visibility
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${getScoreColor(business.visibilityScore)}`}>
              {business.visibilityScore}%
            </div>
            <Progress value={business.visibilityScore} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {business.llmChecks.length} checks performed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Citation Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${getScoreColor(business.citationScore)}`}>
              {business.citationScore}%
            </div>
            <Progress value={business.citationScore} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {business.citations.filter(c => c.status === 'verified').length}/
              {business.citations.length} citations verified
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Schema Coverage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${getScoreColor(business.schemaScore)}`}>
              {business.schemaScore}%
            </div>
            <Progress value={business.schemaScore} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {business.schemaItems.filter(s => s.status === 'implemented').length}/
              {business.schemaItems.length} schemas implemented
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <nav className="flex gap-4">
          {(['overview', 'citations', 'schema', 'visibility'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-1 border-b-2 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Business Details */}
          <Card>
            <CardHeader>
              <CardTitle>Business Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {business.uid && (
                <div>
                  <p className="text-sm text-muted-foreground">Swiss UID</p>
                  <p className="font-medium">{business.uid}</p>
                </div>
              )}
              {business.description && (
                <div>
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p>{business.description}</p>
                </div>
              )}
              {business.website && (
                <div>
                  <p className="text-sm text-muted-foreground">Website</p>
                  <a
                    href={business.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {business.website}
                  </a>
                </div>
              )}
              {business.services && business.services.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Services</p>
                  <div className="flex flex-wrap gap-2">
                    {business.services.map((service, index) => (
                      <Badge key={index} variant="secondary">
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {(business.addressStreet || business.addressCity) && (
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p>
                    {business.addressStreet && <span>{business.addressStreet}<br /></span>}
                    {business.addressPostal} {business.addressCity}
                    {business.addressCanton && `, ${business.addressCanton}`}
                  </p>
                </div>
              )}
              {business.phone && (
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p>{business.phone}</p>
                </div>
              )}
              {business.email && (
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <a
                    href={`mailto:${business.email}`}
                    className="text-primary hover:underline"
                  >
                    {business.email}
                  </a>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {business.llmChecks.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No visibility checks yet. Run your first check to see how AI assistants perceive your business.
                </p>
              ) : (
                <div className="space-y-4">
                  {business.llmChecks.slice(0, 5).map((check) => (
                    <div key={check.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">
                          {check.provider} {check.model && `(${check.model})`}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(check.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant={check.mentioned ? 'default' : 'secondary'}>
                          {check.mentioned ? 'Mentioned' : 'Not Found'}
                        </Badge>
                        {check.accuracyScore !== null && (
                          <p className={`text-sm ${getScoreColor(check.accuracyScore)}`}>
                            {check.accuracyScore}% accuracy
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'citations' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Citations</CardTitle>
                <CardDescription>
                  Manage your business listings across directories and platforms.
                </CardDescription>
              </div>
              <Button>Add Citation</Button>
            </div>
          </CardHeader>
          <CardContent>
            {business.citations.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  No citations tracked yet. Start by adding your main business listings.
                </p>
                <Button>Add Your First Citation</Button>
              </div>
            ) : (
              <div className="space-y-4">
                {business.citations.map((citation) => (
                  <div
                    key={citation.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{citation.source}</p>
                      {citation.sourceUrl && (
                        <a
                          href={citation.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline"
                        >
                          {citation.sourceUrl}
                        </a>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      {citation.napMatchScore !== null && (
                        <span className={`text-sm ${getScoreColor(citation.napMatchScore)}`}>
                          NAP: {citation.napMatchScore}%
                        </span>
                      )}
                      {getCitationStatusBadge(citation.status)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'schema' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Schema Markup</CardTitle>
                <CardDescription>
                  JSON-LD structured data for search engines and AI systems.
                </CardDescription>
              </div>
              <Button>Generate Schema</Button>
            </div>
          </CardHeader>
          <CardContent>
            {business.schemaItems.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  No schema markup generated yet. Generate structured data to improve AI discoverability.
                </p>
                <Button>Generate Schema</Button>
              </div>
            ) : (
              <div className="space-y-4">
                {business.schemaItems.map((schema) => (
                  <div
                    key={schema.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{schema.schemaType}</p>
                      <p className="text-sm text-muted-foreground">
                        Generated {new Date(schema.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={schema.status === 'implemented' ? 'default' : 'secondary'}>
                        {schema.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'visibility' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>AI Visibility</CardTitle>
                <CardDescription>
                  Track how AI assistants perceive and recommend your business.
                </CardDescription>
              </div>
              <Button>Run Check</Button>
            </div>
          </CardHeader>
          <CardContent>
            {business.llmChecks.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  No visibility checks performed yet. Run a check to see how ChatGPT and Claude perceive your business.
                </p>
                <Button>Run Your First Check</Button>
              </div>
            ) : (
              <div className="space-y-4">
                {business.llmChecks.map((check) => (
                  <div
                    key={check.id}
                    className="p-4 border rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{check.provider}</p>
                        {check.model && (
                          <span className="text-sm text-muted-foreground">({check.model})</span>
                        )}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(check.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant={check.mentioned ? 'default' : 'destructive'}>
                        {check.mentioned ? 'Mentioned' : 'Not Found'}
                      </Badge>
                      {check.accuracyScore !== null && (
                        <span className={`text-sm ${getScoreColor(check.accuracyScore)}`}>
                          {check.accuracyScore}% accuracy
                        </span>
                      )}
                      {check.sentiment && (
                        <Badge variant="outline">{check.sentiment}</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
