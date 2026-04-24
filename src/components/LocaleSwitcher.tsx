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
    <div className="flex gap-1 text-xs">
      {Object.entries(LABELS).map(([loc, label]) => (
        <button
          key={loc}
          onClick={() => switchTo(loc)}
          className={`px-2 py-1 rounded transition-colors font-medium ${
            locale === loc
              ? 'bg-teal-600 text-white'
              : 'text-stone-400 hover:text-stone-700'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
