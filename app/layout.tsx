// Root layout - minimal, just provides HTML structure
// Locale-specific content is handled by app/[locale]/layout.tsx

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
