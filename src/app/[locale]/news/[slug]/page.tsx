import { setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'

interface Props { params: Promise<{ locale: string; slug: string }> }

export default async function ArticlePage({ params }: Props) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  // TODO (M3): fetch from Sanity by slug — real Wayback archive content only, no fabricated articles
  if (slug !== 'placeholder') notFound()
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <p style={{ color: 'var(--fg-muted)' }}>
        Article — TODO: wire Sanity fetch for slug: {slug}
      </p>
    </div>
  )
}
