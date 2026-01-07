'use client'

import { useSession } from 'next-auth/react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getInitials } from '@/lib/utils'
import { Bell } from 'lucide-react'

interface HeaderProps {
  title: string
  description?: string
}

export function Header({ title, description }: HeaderProps) {
  const { data: session } = useSession()

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-100 bg-white px-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
        {description && (
          <p className="text-sm text-gray-500">{description}</p>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Plan badge */}
        <span className="hidden sm:flex px-3 py-1 text-xs font-medium rounded-full bg-gradient-to-r from-purple-50 to-indigo-50 text-[#667eea] border border-purple-100">
          {session?.user?.plan || 'Free'} Plan
        </span>

        {/* Notifications */}
        <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-[#667eea]" />
        </button>

        {/* User avatar */}
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 border-2 border-purple-100">
            <AvatarImage src={session?.user?.image || undefined} />
            <AvatarFallback className="bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white text-sm">
              {session?.user?.name ? getInitials(session.user.name) : session?.user?.email?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-gray-900">
              {session?.user?.name || session?.user?.email?.split('@')[0]}
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}
