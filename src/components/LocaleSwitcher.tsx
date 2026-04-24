'use client'

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'

const LABELS: Record<string, string> = { en: 'EN', am: 'አማ', or: 'OM' }

export function LocaleSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  function switchTo(next: string) {
    const stripped = pathname.replace(/^\/(en|am|or)/, '') || '/'
    router.push(`/${next}${stripped}`)
  }

  return (
    <div className="flex gap-1 text-sm">
      {Object.entries(LABELS).map(([loc, label]) => (
        <button
          key={loc}
          onClick={() => switchTo(loc)}
          className={`px-2 py-0.5 rounded transition-colors ${
            locale === loc
              ? 'bg-red-600 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
