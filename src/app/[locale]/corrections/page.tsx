import { setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Corrections' }

interface Props { params: Promise<{ locale: string }> }

export default async function CorrectionsPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const isAm = locale === 'am'

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
        {isAm ? 'ማስተካከያዎች' : 'Corrections'}
      </h1>
      <p style={{ color: 'var(--fg-secondary)' }}>
        ESAT corrections and clarifications policy. {/* TODO: supply from editorial team */}
      </p>
    </div>
  )
}
