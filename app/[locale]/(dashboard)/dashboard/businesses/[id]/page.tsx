'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Business {
  id: string
  name: string
  industry: string
  status: string
  visibilityScore: number
  citationScore: number
  schemaScore: number
  addressCity: string | null
  addressCanton: string | null
}

export default function BusinessDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [business, setBusiness] = useState<Business | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
            <Badge variant={business.status === 'ACTIVE' ? 'default' : 'secondary'}>
              {business.status}
            </Badge>
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
            <div className="text-3xl font-bold">
              {business.visibilityScore}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Citation Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {business.citationScore}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Schema Coverage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {business.schemaScore}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Placeholder for more content */}
      <Card>
        <CardHeader>
          <CardTitle>Business Details</CardTitle>
          <CardDescription>More features coming soon</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Business ID: {business.id}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
