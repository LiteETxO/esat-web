import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'am', 'or'],
  defaultLocale: 'en',
  localePrefix: 'as-needed', // English at root, /am/, /or/ prefixed
})
