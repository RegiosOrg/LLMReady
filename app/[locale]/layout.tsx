import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { SessionProvider } from '@/components/providers/SessionProvider'
import { routing } from '@/i18n/routing'
import '../globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://getcitedby.com'),
  title: 'GetCitedBy - Get Cited by AI Search',
  description: 'Turn your business into an entity that ChatGPT, Claude, and AI assistants can find, trust, and recommend to customers.',
  keywords: 'AI SEO, LLM optimization, ChatGPT visibility, local business AI, entity optimization, AI citations',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'GetCitedBy - Get Cited by AI Search',
    description: 'Turn your business into an entity that ChatGPT, Claude, and AI assistants can find, trust, and recommend.',
    url: 'https://getcitedby.com',
    siteName: 'GetCitedBy',
    type: 'website',
    images: ['/icon-512.png'],
  },
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  // Validate locale
  if (!routing.locales.includes(locale as any)) {
    notFound()
  }

  // Enable static rendering
  setRequestLocale(locale)

  // Get messages for the locale
  const messages = await getMessages()

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
          <SessionProvider>
            {children}
          </SessionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
