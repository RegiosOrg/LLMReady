'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Mail, ArrowLeft, Loader2 } from 'lucide-react'

function VerifyContent() {
  const locale = useLocale()
  const t = useTranslations('auth.verify')
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || 'your email'

  // Helper to generate locale-aware paths
  const localePath = (path: string) => {
    if (locale === 'en') return path
    return `/${locale}${path}`
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-[#667eea]/20 to-[#764ba2]/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="h-8 w-8 text-[#667eea]" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">{t('title')}</h2>
        <p className="text-gray-500 mt-2">
          {t('subtitle')} <span className="text-gray-900 font-medium">{email}</span>
        </p>
      </div>

      <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600 mb-6">
        <p className="mb-2">{t('instruction')}</p>
        <p>{t('spamNote')}</p>
      </div>

      <div className="flex flex-col gap-2">
        <Button asChild variant="outline" className="w-full h-12 border-gray-200 hover:bg-gray-50 text-gray-700 font-medium rounded-xl">
          <a href="https://mail.google.com" target="_blank" rel="noopener noreferrer">
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/>
            </svg>
            Gmail
          </a>
        </Button>
        <Button asChild variant="outline" className="w-full h-12 border-gray-200 hover:bg-gray-50 text-gray-700 font-medium rounded-xl">
          <a href="https://outlook.live.com" target="_blank" rel="noopener noreferrer">
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="#0078D4" d="M24 7.387v10.478c0 .23-.08.424-.238.576-.158.156-.355.234-.59.234h-8.378l-.088.051v4.078L6.5 17.92v-.105H.828A.826.826 0 0 1 0 16.99V5.875c0-.232.08-.424.238-.576.158-.156.355-.234.59-.234H14.77l.026-.002v1.545l8.378 4.883c.552.325.826.73.826 1.212v-5.32h.01a.826.826 0 0 1-.01.004zm-.828 1.145l-8.378-4.91v10.57l8.378-4.883v-.777zm-8.406-6.845H1.664v15.09h5.834V9.584l6.268 4.06V1.687z"/>
            </svg>
            Outlook
          </a>
        </Button>
      </div>

      <div className="text-center pt-6">
        <Link
          href={localePath('/login')}
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#667eea]"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('backToLogin')}
        </Link>
      </div>
    </div>
  )
}

function VerifyFallback() {
  return (
    <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-[#667eea]/20 to-[#764ba2]/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="h-8 w-8 text-[#667eea]" />
        </div>
        <div className="h-8 w-48 bg-gray-200 rounded mx-auto mb-2 animate-pulse"></div>
        <div className="h-4 w-64 bg-gray-100 rounded mx-auto animate-pulse"></div>
      </div>
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-[#667eea]" />
      </div>
    </div>
  )
}

export default function VerifyPage() {
  const locale = useLocale()

  // Helper to generate locale-aware paths
  const localePath = (path: string) => {
    if (locale === 'en') return path
    return `/${locale}${path}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="container mx-auto px-6 py-4">
          <Link href={localePath('/')} className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-[#667eea] to-[#764ba2] rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">GetCitedBy</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="min-h-screen flex items-center justify-center px-4 pt-20">
        <div className="w-full max-w-md">
          <Suspense fallback={<VerifyFallback />}>
            <VerifyContent />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
