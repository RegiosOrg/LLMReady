import { Header } from '@/components/dashboard/Header'
import { Button } from '@/components/ui/button'
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

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600'
    if (score >= 40) return 'text-amber-600'
    return 'text-red-600'
  }

  return (
    <div className="min-h-screen">
      <Header
        title="Dashboard"
        description="Overview of your AI visibility across all businesses"
      />

      <div className="p-6 space-y-6">
        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-500">Businesses</span>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Building2 className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900">{businesses.length}</div>
            <p className="text-xs text-gray-500 mt-1">
              {user.subscription?.businessesUsed || 0} / {user.plan === 'FREE' ? '1' : '10'} used
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-500">Avg. Visibility Score</span>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-400 flex items-center justify-center shadow-lg shadow-purple-500/30">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {hasBusinesses
                ? Math.round(businesses.reduce((acc, b) => acc + b.visibilityScore, 0) / businesses.length)
                : '-'}
            </div>
            <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
              <TrendingUp className="h-3 w-3" />
              <span>+12% from last month</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-500">Citations Health</span>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-400 flex items-center justify-center shadow-lg shadow-amber-500/30">
                <MapPin className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {hasBusinesses
                ? Math.round(businesses.reduce((acc, b) => acc + b.citationScore, 0) / businesses.length)
                : '-'}%
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 mt-3">
              <div className="bg-gradient-to-r from-amber-500 to-orange-400 h-2 rounded-full" style={{ width: '72%' }}></div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-500">Schema Coverage</span>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-green-500/30">
                <Code2 className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {hasBusinesses
                ? Math.round(businesses.reduce((acc, b) => acc + b.schemaScore, 0) / businesses.length)
                : '-'}%
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 mt-3">
              <div className="bg-gradient-to-r from-green-500 to-emerald-400 h-2 rounded-full" style={{ width: '85%' }}></div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Businesses */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Your Businesses</h2>
                <p className="text-sm text-gray-500">Manage entities and track their AI visibility</p>
              </div>
              <Button asChild size="sm" className="bg-gradient-to-r from-[#667eea] to-[#764ba2] hover:opacity-90">
                <Link href="/dashboard/businesses/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Business
                </Link>
              </Button>
            </div>
            <div className="p-6">
              {hasBusinesses ? (
                <div className="space-y-3">
                  {businesses.map((business) => (
                    <Link
                      key={business.id}
                      href={`/dashboard/businesses/${business.id}`}
                      className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-purple-200 hover:bg-purple-50/50 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center text-white font-semibold shadow-lg shadow-purple-500/20">
                          {business.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{business.name}</p>
                          <p className="text-sm text-gray-500">
                            {business.addressCity || 'No location set'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className={`text-sm font-semibold ${getScoreColor(business.visibilityScore)}`}>
                            {business.visibilityScore}%
                          </p>
                          <p className="text-xs text-gray-400">visibility</p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                    <Building2 className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 mb-4">No businesses yet</p>
                  <Button asChild className="bg-gradient-to-r from-[#667eea] to-[#764ba2] hover:opacity-90">
                    <Link href="/dashboard/businesses/new">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Business
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Action Items */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Action Items</h2>
              <p className="text-sm text-gray-500">Tasks to improve your AI visibility</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {!hasBusinesses ? (
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-500/20">
                      <Building2 className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Add your first business</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Get started by adding your business details to build your entity profile.
                      </p>
                      <Button asChild size="sm" className="mt-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] hover:opacity-90">
                        <Link href="/dashboard/businesses/new">Get Started</Link>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start gap-4 p-4 rounded-xl bg-amber-50 border border-amber-100">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-400 flex items-center justify-center flex-shrink-0 shadow-lg shadow-amber-500/30">
                        <AlertCircle className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">3 citations need attention</p>
                        <p className="text-sm text-gray-600 mt-1">
                          NAP inconsistencies detected on Google Business and local.ch
                        </p>
                        <Button asChild size="sm" variant="outline" className="mt-3 border-amber-200 text-amber-700 hover:bg-amber-100">
                          <Link href="/dashboard/citations">Review Citations</Link>
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center flex-shrink-0 shadow-lg shadow-green-500/30">
                        <Code2 className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Generate schema markup</p>
                        <p className="text-sm text-gray-600 mt-1">
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
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid gap-4 md:grid-cols-3">
          <Link href="/dashboard/citations" className="group">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md hover:border-purple-200 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform">
                  <MapPin className="h-7 w-7 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Citations Manager</p>
                  <p className="text-sm text-gray-500">Track directory listings</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/dashboard/schema" className="group">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md hover:border-purple-200 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-400 flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:scale-105 transition-transform">
                  <Code2 className="h-7 w-7 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Schema Generator</p>
                  <p className="text-sm text-gray-500">Create structured data</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/dashboard/visibility" className="group">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md hover:border-purple-200 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-400 flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-105 transition-transform">
                  <BarChart3 className="h-7 w-7 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Visibility Tracker</p>
                  <p className="text-sm text-gray-500">Monitor AI mentions</p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
