'use client'

import { useSession } from 'next-auth/react'
import { useLocale } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getInitials } from '@/lib/utils'
import { Bell, Globe } from 'lucide-react'

interface HeaderProps {
  title: string
  description?: string
}

const languages = [
  { code: 'en', name: 'EN' },
  { code: 'de', name: 'DE' },
  { code: 'fr', name: 'FR' },
]

export function Header({ title, description }: HeaderProps) {
  const { data: session } = useSession()
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()

  const switchLocale = (newLocale: string) => {
    // Remove current locale from pathname and prepend new one
    const pathWithoutLocale = pathname.replace(/^\/(en|de|fr)/, '')
    const newPath = newLocale === 'en' ? pathWithoutLocale || '/' : `/${newLocale}${pathWithoutLocale || ''}`
    router.push(newPath)
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-100 bg-white px-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
        {description && (
          <p className="text-sm text-gray-500">{description}</p>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Language Switcher */}
        <div className="hidden sm:flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-lg">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => switchLocale(lang.code)}
              className={`px-2 py-1 text-sm rounded transition ${
                locale === lang.code
                  ? 'bg-white text-gray-900 font-medium shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {lang.name}
            </button>
          ))}
        </div>

        {/* Plan badge */}
        <span className="hidden sm:flex px-3 py-1 text-xs font-medium rounded-full bg-gradient-to-r from-purple-50 to-indigo-50 text-[#667eea] border border-purple-100">
          {session?.user?.plan || 'FREE'} Plan
        </span>

        {/* Notifications */}
        <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-[#667eea]" />
        </button>

        {/* User avatar - links to settings */}
        <Link href="/dashboard/settings" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <Avatar className="h-8 w-8 border-2 border-purple-100 cursor-pointer">
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
        </Link>
      </div>
    </header>
  )
}
