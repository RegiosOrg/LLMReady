const createNextIntlPlugin = require('next-intl/plugin')

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Ensure server-side features work with database
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },
}

module.exports = withNextIntl(nextConfig)
