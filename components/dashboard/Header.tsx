'use client'

import { useSession } from 'next-auth/react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { getInitials } from '@/lib/utils'
import { Bell } from 'lucide-react'

interface HeaderProps {
  title: string
  description?: string
}

export function Header({ title, description }: HeaderProps) {
  const { data: session } = useSession()

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-800 px-6">
      <div>
        <h1 className="text-xl font-semibold text-white">{title}</h1>
        {description && (
          <p className="text-sm text-slate-400">{description}</p>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Plan badge */}
        <Badge variant="outline" className="hidden sm:flex">
          {session?.user?.plan || 'Free'} Plan
        </Badge>

        {/* Notifications */}
        <button className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-emerald-500" />
        </button>

        {/* User avatar */}
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={session?.user?.image || undefined} />
            <AvatarFallback>
              {session?.user?.name ? getInitials(session.user.name) : session?.user?.email?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-white">
              {session?.user?.name || session?.user?.email?.split('@')[0]}
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}
