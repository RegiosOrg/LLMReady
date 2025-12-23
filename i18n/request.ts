import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'

// Pre-import all message files to ensure they work in standalone mode
import en from '../messages/en.json'
import de from '../messages/de.json'
import fr from '../messages/fr.json'

const messages: Record<string, typeof en> = {
  en,
  de,
  fr
}

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale

  // Ensure that a valid locale is used
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale
  }

  return {
    locale,
    messages: messages[locale] || messages[routing.defaultLocale]
  }
})

// Re-export for convenience
export const locales = routing.locales
export const defaultLocale = routing.defaultLocale
export type Locale = (typeof routing.locales)[number]
