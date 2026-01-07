import createMiddleware from 'next-intl/middleware'
import { withAuth } from 'next-auth/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { routing } from './i18n/routing'

// Create the intl middleware
const intlMiddleware = createMiddleware(routing)

// Public routes that don't require authentication
const publicRoutes = [
  '/',
  '/login',
  '/register',
  '/verify',
  '/pricing',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/audit',
]

// Create the auth middleware
const authMiddleware = withAuth(
  function onSuccess(req) {
    return intlMiddleware(req)
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname

        // Remove locale prefix for checking
        const pathnameWithoutLocale = pathname.replace(/^\/(en|de|fr)/, '') || '/'

        // API routes that are public
        const publicApiRoutes = ['/api/auth', '/api/billing/webhook', '/api/audit']

        // Check if current path is public
        if (publicRoutes.includes(pathnameWithoutLocale)) {
          return true
        }

        // Check if API route is public
        if (publicApiRoutes.some(route => pathnameWithoutLocale.startsWith(route))) {
          return true
        }

        // All other routes require authentication
        return !!token
      },
    },
    pages: {
      signIn: '/login',
    },
  }
)

export default function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname

  // Skip middleware for static files and API auth routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth') ||
    pathname.includes('.') // static files
  ) {
    return NextResponse.next()
  }

  // Remove locale prefix for checking
  const pathnameWithoutLocale = pathname.replace(/^\/(en|de|fr)/, '') || '/'

  // For public routes, just handle i18n
  const isPublicRoute = publicRoutes.includes(pathnameWithoutLocale)
  const isPublicApi = pathname.startsWith('/api/billing/webhook')

  if (isPublicRoute || isPublicApi) {
    return intlMiddleware(req)
  }

  // For protected routes, run auth middleware (which also handles i18n)
  return (authMiddleware as any)(req)
}

export const config = {
  matcher: [
    // Match all pathnames except for
    // - API routes (except those we want to protect)
    // - Static files
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
}
