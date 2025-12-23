'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CreditCard, User, Shield, CheckCircle, AlertCircle } from 'lucide-react'

interface UserLimits {
  plan: string
  planName: string
  maxBusinesses: number
  maxLlmChecksPerMonth: number
  businessesUsed: number
  llmChecksUsed: number
  canAddBusiness: boolean
  canRunLlmCheck: boolean
}

export default function SettingsPage() {
  const { data: session } = useSession()
  const searchParams = useSearchParams()
  const success = searchParams.get('success')

  const [limits, setLimits] = useState<UserLimits | null>(null)
  const [portalLoading, setPortalLoading] = useState(false)

  useEffect(() => {
    // Fetch user limits
    fetch('/api/user/limits')
      .then((res) => res.json())
      .then(setLimits)
      .catch(console.error)
  }, [])

  const handleManageBilling = async () => {
    setPortalLoading(true)
    try {
      const response = await fetch('/api/stripe/portal', { method: 'POST' })
      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Portal error:', error)
    } finally {
      setPortalLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-slate-400">Manage your account and subscription</p>
      </div>

      {success && (
        <div className="flex items-center gap-2 p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400">
          <CheckCircle className="h-5 w-5" />
          <span>Your subscription has been updated successfully!</span>
        </div>
      )}

      {/* Account Info */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-indigo-400" />
            <CardTitle>Account</CardTitle>
          </div>
          <CardDescription>Your account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center py-2 border-b border-slate-800">
            <span className="text-slate-400">Email</span>
            <span className="text-white">{session?.user?.email}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-slate-800">
            <span className="text-slate-400">Name</span>
            <span className="text-white">{session?.user?.name || 'Not set'}</span>
          </div>
        </CardContent>
      </Card>

      {/* Subscription */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-indigo-400" />
              <CardTitle>Subscription</CardTitle>
            </div>
            {limits && (
              <Badge
                variant={limits.plan === 'FREE' ? 'secondary' : 'default'}
                className={
                  limits.plan === 'PROFESSIONAL'
                    ? 'bg-indigo-500'
                    : limits.plan === 'BUSINESS'
                    ? 'bg-purple-500'
                    : ''
                }
              >
                {limits.planName}
              </Badge>
            )}
          </div>
          <CardDescription>Manage your plan and billing</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {limits ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-slate-800/50">
                  <div className="text-2xl font-bold text-white">
                    {limits.businessesUsed}
                    <span className="text-sm font-normal text-slate-400">
                      {' '}
                      / {limits.maxBusinesses === -1 ? '∞' : limits.maxBusinesses}
                    </span>
                  </div>
                  <div className="text-sm text-slate-400">Businesses</div>
                </div>
                <div className="p-4 rounded-lg bg-slate-800/50">
                  <div className="text-2xl font-bold text-white">
                    {limits.llmChecksUsed}
                    <span className="text-sm font-normal text-slate-400">
                      {' '}
                      / {limits.maxLlmChecksPerMonth === -1 ? '∞' : limits.maxLlmChecksPerMonth}
                    </span>
                  </div>
                  <div className="text-sm text-slate-400">LLM Checks (this month)</div>
                </div>
              </div>

              {limits.plan === 'FREE' ? (
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button asChild className="flex-1">
                    <a href="/pricing">Upgrade Plan</a>
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button
                    onClick={handleManageBilling}
                    disabled={portalLoading}
                    variant="outline"
                    className="flex-1"
                  >
                    {portalLoading ? 'Loading...' : 'Manage Billing'}
                  </Button>
                  <Button asChild variant="outline" className="flex-1">
                    <a href="/pricing">Change Plan</a>
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="animate-pulse space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="h-20 bg-slate-800/50 rounded-lg" />
                <div className="h-20 bg-slate-800/50 rounded-lg" />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-indigo-400" />
            <CardTitle>Security</CardTitle>
          </div>
          <CardDescription>Manage your security settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center py-2 border-b border-slate-800">
            <div>
              <span className="text-white">Magic Link Authentication</span>
              <p className="text-sm text-slate-400">
                Sign in via email link - no password required
              </p>
            </div>
            <Badge variant="secondary">Enabled</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
