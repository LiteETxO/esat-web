'use client'

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'

const LOCALES: { code: string; label: string; lang: string }[] = [
  { code: 'en', label: 'EN', lang: 'English' },
  { code: 'am', label: 'አማ', lang: 'Amharic' },
  { code: 'or', label: 'OM', lang: 'Afaan Oromo' },
]

export function LocaleSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  function switchTo(next: string) {
    // Strip current locale prefix, re-prefix with target
    const stripped = pathname.replace(/^\/(am|or)/, '') || '/'
    const prefix = next === 'en' ? '' : `/${next}`
    router.push(`${prefix}${stripped}`)
  }

  return (
    <div className="flex gap-0.5 text-xs font-medium" role="group" aria-label="Language">
      {LOCALES.map(({ code, label, lang }) => (
        <button
          key={code}
          onClick={() => switchTo(code)}
          aria-label={lang}
          aria-pressed={locale === code}
          className="px-2 py-1 rounded transition-colors"
          style={{
            background: locale === code ? 'var(--accent)' : 'transparent',
            color: locale === code ? '#fff' : 'var(--fg-secondary)',
          }}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
