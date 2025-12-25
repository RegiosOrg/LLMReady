'use client'

import { useState, Suspense } from 'react'
import { signIn } from 'next-auth/react'
import { signInWithPopup } from 'firebase/auth'
import { auth, googleProvider } from '@/lib/firebase'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertCircle, Mail, Loader2 } from 'lucide-react'

function LoginForm() {
  const locale = useLocale()
  const t = useTranslations('auth.login')
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'
  const authError = searchParams.get('error')

  // Helper to generate locale-aware paths
  const localePath = (path: string) => {
    if (locale === 'en') return path
    return `/${locale}${path}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const result = await signIn('email', {
        email,
        callbackUrl,
        redirect: false,
      })

      if (result?.error) {
        setError(t('errorMagicLink'))
      } else {
        // Redirect to verify page
        window.location.href = localePath(`/verify?email=${encodeURIComponent(email)}`)
      }
    } catch (err) {
      setError(t('errorGeneric'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true)
    setError(null)

    try {
      if (!auth || !googleProvider) {
        setError(t('errorGeneric'))
        return
      }

      // Sign in with Firebase
      const result = await signInWithPopup(auth, googleProvider)
      const user = result.user
      const idToken = await user.getIdToken()

      // Sign in with NextAuth using the Firebase credentials
      const authResult = await signIn('firebase-google', {
        idToken,
        email: user.email,
        name: user.displayName,
        image: user.photoURL,
        callbackUrl,
        redirect: false,
      })

      if (authResult?.error) {
        setError(t('errorGeneric'))
      } else if (authResult?.ok) {
        window.location.href = callbackUrl
      }
    } catch (err: any) {
      console.error('Google sign-in error:', err)
      if (err.code === 'auth/popup-closed-by-user') {
        // User closed the popup, don't show error
      } else {
        setError(t('errorGeneric'))
      }
    } finally {
      setIsGoogleLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{t('title')}</h2>
        <p className="text-gray-500 mt-2">{t('subtitle')}</p>
      </div>

      {(error || authError) && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm mb-4">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error || t('errorGeneric')}</span>
        </div>
      )}

      {/* Google Sign In - Primary */}
      <Button
        type="button"
        variant="outline"
        onClick={handleGoogleSignIn}
        disabled={isGoogleLoading}
        className="w-full h-12 border-gray-200 hover:bg-gray-50 text-gray-700 font-medium rounded-xl mb-4"
      >
        {isGoogleLoading ? (
          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
        ) : (
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
        )}
        {t('googleButton')}
      </Button>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-500">{t('orContinueWith')}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-700">{t('emailLabel')}</Label>
          <Input
            id="email"
            type="email"
            placeholder={t('emailPlaceholder')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            className="h-12 bg-gray-50 border-gray-200 focus:bg-white focus:border-[#667eea] focus:ring-[#667eea]/20"
          />
        </div>

        <Button
          type="submit"
          className="w-full h-12 bg-gradient-to-r from-[#667eea] to-[#764ba2] hover:opacity-90 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/25"
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Mail className="h-4 w-4 mr-2" />}
          {isLoading ? t('submitting') : t('submitButton')}
        </Button>
      </form>

      <div className="mt-6 pt-6 border-t border-gray-100 text-center">
        <span className="text-gray-500">{t('noAccount')}</span>{' '}
        <Link href={localePath('/register')} className="text-[#667eea] hover:text-[#764ba2] font-medium">
          {t('signUp')}
        </Link>
      </div>
    </div>
  )
}

function LoginFormFallback() {
  return (
    <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8">
      <div className="text-center mb-6">
        <div className="h-8 w-48 bg-gray-200 rounded mx-auto mb-2 animate-pulse"></div>
        <div className="h-4 w-64 bg-gray-100 rounded mx-auto animate-pulse"></div>
      </div>
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-[#667eea]" />
      </div>
    </div>
  )
}

export default function LoginPage() {
  const locale = useLocale()
  const t = useTranslations('auth.register')

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
          <Suspense fallback={<LoginFormFallback />}>
            <LoginForm />
          </Suspense>

          <p className="text-center text-sm text-gray-500 mt-6">
            {t('termsText')}{' '}
            <Link href={localePath('/terms')} className="text-gray-700 hover:text-[#667eea]">{t('termsLink')}</Link>
            {' '}{t('andText')}{' '}
            <Link href={localePath('/privacy')} className="text-gray-700 hover:text-[#667eea]">{t('privacyLink')}</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
