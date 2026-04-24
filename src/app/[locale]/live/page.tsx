import { setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Live TV' }

interface Props { params: Promise<{ locale: string }> }

export default async function LivePage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const isAm = locale === 'am'

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
        {isAm ? 'ቀጥታ ቴሌቪዥን' : 'Live TV'}
      </h1>
      <p style={{ color: 'var(--fg-secondary)' }}>
        ESAT live broadcast and schedule. {/* TODO: wire YouTube Live embed */}
      </p>
    </div>
  )
}
