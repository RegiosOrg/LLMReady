'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

interface Business {
  id: string
  name: string
  industry: string
  addressCity: string | null
  addressCanton: string | null
  status: string
  visibilityScore: number
  citationScore: number
  schemaScore: number
  createdAt: string
  updatedAt: string
  _count: {
    citations: number
    llmChecks: number
    schemaItems: number
  }
}

export default function BusinessesPage() {
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchBusinesses() {
      try {
        const response = await fetch('/api/businesses')
        if (!response.ok) {
          throw new Error('Failed to fetch businesses')
        }
        const data = await response.json()
        setBusinesses(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchBusinesses()
  }, [])

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      ACTIVE: 'default',
      DRAFT: 'secondary',
      PAUSED: 'outline',
      ARCHIVED: 'destructive',
    }
    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>
  }

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-500'
    if (score >= 40) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getOverallScore = (business: Business) => {
    return Math.round(
      (business.visibilityScore + business.citationScore + business.schemaScore) / 3
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Businesses</h1>
          <p className="text-muted-foreground">
            Manage your business entities and track their AI visibility.
          </p>
        </div>
        <Link href="/businesses/new">
          <Button>Add Business</Button>
        </Link>
      </div>

      {businesses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <svg
              className="h-12 w-12 text-muted-foreground mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <h3 className="text-lg font-medium mb-2">No businesses yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Add your first business to start tracking AI visibility.
            </p>
            <Link href="/businesses/new">
              <Button>Add Your First Business</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {businesses.map((business) => (
            <Link key={business.id} href={`/businesses/${business.id}`}>
              <Card className="hover:border-primary/50 transition-colors cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold">{business.name}</h3>
                        {getStatusBadge(business.status)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                        <span>{business.industry}</span>
                        {business.addressCity && (
                          <>
                            <span>-</span>
                            <span>
                              {business.addressCity}
                              {business.addressCanton && `, ${business.addressCanton}`}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-3xl font-bold ${getScoreColor(getOverallScore(business))}`}>
                        {getOverallScore(business)}%
                      </div>
                      <p className="text-xs text-muted-foreground">Overall Score</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-muted-foreground">Visibility</span>
                        <span className={`text-sm font-medium ${getScoreColor(business.visibilityScore)}`}>
                          {business.visibilityScore}%
                        </span>
                      </div>
                      <Progress value={business.visibilityScore} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-muted-foreground">Citations</span>
                        <span className={`text-sm font-medium ${getScoreColor(business.citationScore)}`}>
                          {business.citationScore}%
                        </span>
                      </div>
                      <Progress value={business.citationScore} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-muted-foreground">Schema</span>
                        <span className={`text-sm font-medium ${getScoreColor(business.schemaScore)}`}>
                          {business.schemaScore}%
                        </span>
                      </div>
                      <Progress value={business.schemaScore} className="h-2" />
                    </div>
                  </div>

                  <div className="flex items-center gap-6 mt-4 pt-4 border-t text-sm text-muted-foreground">
                    <span>{business._count.citations} citations</span>
                    <span>{business._count.schemaItems} schema items</span>
                    <span>{business._count.llmChecks} visibility checks</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
