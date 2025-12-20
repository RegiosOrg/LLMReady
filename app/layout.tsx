import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LLMReady - Get Found by AI Search',
  description: 'Turn your business into an entity that ChatGPT, Claude, and AI assistants can find, trust, and recommend to customers.',
  keywords: 'AI SEO, LLM optimization, ChatGPT visibility, local business AI, entity optimization',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
