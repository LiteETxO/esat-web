import { setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'

interface Props { params: Promise<{ locale: string; slug: string }> }

export default async function ProgramPage({ params }: Props) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  // TODO (M4): fetch program + YouTube episodes from Sanity/YouTube API
  if (slug !== 'placeholder') notFound()
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <p style={{ color: 'var(--fg-muted)' }}>
        Program — TODO: wire Sanity + YouTube Data API for slug: {slug}
      </p>
    </div>
  )
}
