'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Building2,
  LayoutDashboard,
  MapPin,
  Code2,
  BarChart3,
  Settings,
  LogOut,
  CreditCard,
  HelpCircle,
} from 'lucide-react'
import { signOut } from 'next-auth/react'

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Businesses',
    href: '/dashboard/businesses',
    icon: Building2,
  },
]

const tools = [
  {
    name: 'Citations',
    href: '/dashboard/citations',
    icon: MapPin,
    description: 'Manage directory listings',
  },
  {
    name: 'Schema',
    href: '/dashboard/schema',
    icon: Code2,
    description: 'Generate structured data',
  },
  {
    name: 'Visibility',
    href: '/dashboard/visibility',
    icon: BarChart3,
    description: 'Track AI mentions',
  },
]

const secondary = [
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
  {
    name: 'Pricing',
    href: '/pricing',
    icon: CreditCard,
  },
  {
    name: 'Help',
    href: '/dashboard/help',
    icon: HelpCircle,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col bg-slate-900 border-r border-slate-800">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 px-6 border-b border-slate-800">
        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </div>
        <span className="text-xl font-bold text-white">GetCitedBy</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
        {/* Main nav */}
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </div>

        {/* Tools section */}
        <div className="pt-6">
          <p className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
            Tools
          </p>
          <div className="space-y-1">
            {tools.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-indigo-500/10 text-indigo-400'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </div>
        </div>

        {/* Secondary nav */}
        <div className="pt-6">
          <div className="space-y-1">
            {secondary.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-indigo-500/10 text-indigo-400'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </div>
        </div>
      </nav>

      {/* User section */}
      <div className="border-t border-slate-800 p-4">
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <LogOut className="h-5 w-5" />
          Sign out
        </button>
      </div>
    </div>
  )
}
