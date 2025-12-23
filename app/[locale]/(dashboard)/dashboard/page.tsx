import { Header } from '@/components/dashboard/Header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  Building2,
  MapPin,
  Code2,
  BarChart3,
  Plus,
  ArrowRight,
  TrendingUp,
  AlertCircle,
} from 'lucide-react'

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  const businesses = user.businesses || []
  const hasBusinesses = businesses.length > 0

  return (
    <div className="min-h-screen">
      <Header
        title="Dashboard"
        description="Overview of your AI visibility across all businesses"
      />

      <div className="p-6 space-y-6">
        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">
                Businesses
              </CardTitle>
              <Building2 className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{businesses.length}</div>
              <p className="text-xs text-slate-500">
                {user.subscription?.businessesUsed || 0} / {user.plan === 'FREE' ? '1' : '10'} used
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">
                Avg. Visibility Score
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {hasBusinesses
                  ? Math.round(businesses.reduce((acc, b) => acc + b.visibilityScore, 0) / businesses.length)
                  : '-'}
              </div>
              <div className="flex items-center gap-1 text-xs text-emerald-400">
                <TrendingUp className="h-3 w-3" />
                <span>+12% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">
                Citations Health
              </CardTitle>
              <MapPin className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {hasBusinesses
                  ? Math.round(businesses.reduce((acc, b) => acc + b.citationScore, 0) / businesses.length)
                  : '-'}%
              </div>
              <Progress value={72} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">
                Schema Coverage
              </CardTitle>
              <Code2 className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {hasBusinesses
                  ? Math.round(businesses.reduce((acc, b) => acc + b.schemaScore, 0) / businesses.length)
                  : '-'}%
              </div>
              <Progress value={85} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Businesses */}
          <Card className="lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Your Businesses</CardTitle>
                <CardDescription>
                  Manage entities and track their AI visibility
                </CardDescription>
              </div>
              <Button asChild size="sm">
                <Link href="/dashboard/businesses/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Business
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {hasBusinesses ? (
                <div className="space-y-4">
                  {businesses.map((business) => (
                    <Link
                      key={business.id}
                      href={`/dashboard/businesses/${business.id}`}
                      className="flex items-center justify-between p-4 rounded-lg border border-slate-700 hover:border-emerald-500/50 hover:bg-slate-800/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center text-white font-semibold">
                          {business.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-white">{business.name}</p>
                          <p className="text-sm text-slate-400">
                            {business.addressCity || 'No location set'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium text-white">
                            {business.visibilityScore}%
                          </p>
                          <p className="text-xs text-slate-400">visibility</p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-slate-400" />
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Building2 className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400 mb-4">No businesses yet</p>
                  <Button asChild>
                    <Link href="/dashboard/businesses/new">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Business
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Items */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Action Items</CardTitle>
              <CardDescription>
                Tasks to improve your AI visibility
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {!hasBusinesses ? (
                  <div className="flex items-start gap-4 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                      <Building2 className="h-4 w-4 text-emerald-400" />
                    </div>
                    <div>
                      <p className="font-medium text-white">Add your first business</p>
                      <p className="text-sm text-slate-400 mt-1">
                        Get started by adding your business details to build your entity profile.
                      </p>
                      <Button asChild size="sm" className="mt-3">
                        <Link href="/dashboard/businesses/new">Get Started</Link>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start gap-4 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                      <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                        <AlertCircle className="h-4 w-4 text-yellow-400" />
                      </div>
                      <div>
                        <p className="font-medium text-white">3 citations need attention</p>
                        <p className="text-sm text-slate-400 mt-1">
                          NAP inconsistencies detected on Google Business and local.ch
                        </p>
                        <Button asChild size="sm" variant="outline" className="mt-3">
                          <Link href="/dashboard/citations">Review Citations</Link>
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                      <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0">
                        <Code2 className="h-4 w-4 text-slate-400" />
                      </div>
                      <div>
                        <p className="font-medium text-white">Generate schema markup</p>
                        <p className="text-sm text-slate-400 mt-1">
                          Add structured data to help AI understand your business.
                        </p>
                        <Button asChild size="sm" variant="outline" className="mt-3">
                          <Link href="/dashboard/schema">Generate Schema</Link>
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Links */}
        <div className="grid gap-4 md:grid-cols-3">
          <Link href="/dashboard/citations" className="group">
            <Card className="hover:border-emerald-500/50 transition-colors">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                  <MapPin className="h-6 w-6 text-emerald-400" />
                </div>
                <div>
                  <p className="font-medium text-white">Citations Manager</p>
                  <p className="text-sm text-slate-400">Track directory listings</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/schema" className="group">
            <Card className="hover:border-emerald-500/50 transition-colors">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
                  <Code2 className="h-6 w-6 text-cyan-400" />
                </div>
                <div>
                  <p className="font-medium text-white">Schema Generator</p>
                  <p className="text-sm text-slate-400">Create structured data</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/visibility" className="group">
            <Card className="hover:border-emerald-500/50 transition-colors">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                  <BarChart3 className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <p className="font-medium text-white">Visibility Tracker</p>
                  <p className="text-sm text-slate-400">Monitor AI mentions</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
