import { setRequestLocale } from 'next-intl/server'
import Link from 'next/link'
import { NewsletterForm } from '@/components/NewsletterForm'

interface Props {
  params: Promise<{ locale: string }>
}

// REPLACE BEFORE PUBLISH — placeholder article cards. Do not use real Ethiopian news headlines here.
const PLACEHOLDER_ARTICLES = Array.from({ length: 6 }, (_, i) => ({
  id: String(i + 1),
  title: 'Sample headline — REPLACE BEFORE PUBLISH',
  category: ['Politics', 'Economy', 'Diaspora', 'Human Rights', 'World', 'Opinion'][i],
  date: '—',
  slug: 'placeholder',
}))

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const isAm = locale === 'am'
  const base = locale === 'en' ? '' : `/${locale}`

  return (
    <div>
      {/* Breaking news ticker — TODO: wire to Sanity liveEvent */}
      <div className="text-xs font-medium py-1.5 px-4 flex items-center gap-3" style={{ background: 'var(--accent)', color: '#fff' }}>
        <span className="font-bold uppercase tracking-widest shrink-0">
          {isAm ? 'አዲስ ዜና' : 'Breaking'}
        </span>
        <span className="truncate">
          {/* TODO: replace with live Sanity query */}
          {isAm ? 'TODO: አዲስ ዜና ከ Sanity' : 'TODO: Breaking news ticker — wire to Sanity'}
        </span>
      </div>

      {/* Hero — live player */}
      <section className="border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Live embed — 2/3 width */}
            <div className="md:col-span-2">
              <div className="text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2" style={{ color: 'var(--accent)' }}>
                <span className="w-2 h-2 rounded-full animate-pulse inline-block" style={{ background: 'var(--accent)' }} />
                {isAm ? 'ቀጥታ ስርጭት' : 'Live Broadcast'}
              </div>
              {/* TODO (Milestone 2): Replace with functional YouTube Live embed.
                  Channel: @ESATtv / UCSYM-vgRrMYsZbG-Z7Kz0Pw
                  Fallback to latest video if no live stream active. */}
              <div
                className="aspect-video w-full rounded flex items-center justify-center text-sm"
                style={{ background: 'var(--bg-muted)', color: 'var(--fg-muted)', border: '1px solid var(--border)' }}
                aria-label="ESAT live stream — loading"
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">📡</div>
                  <div className="font-medium">TODO: YouTube Live embed</div>
                  <div className="text-xs mt-1" style={{ color: 'var(--fg-muted)' }}>Channel: @ESATtv — wire in Milestone 2</div>
                </div>
              </div>
            </div>

            {/* Latest headlines sidebar */}
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--fg-muted)' }}>
                {isAm ? 'የቅርብ ዜናዎች' : 'Latest News'}
              </h2>
              <ul className="space-y-4">
                {PLACEHOLDER_ARTICLES.slice(0, 4).map((a) => (
                  <li key={a.id} className="border-b pb-3" style={{ borderColor: 'var(--border)' }}>
                    <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: 'var(--accent)' }}>{a.category}</span>
                    {/* TODO: replace with Sanity article data */}
                    <p className="text-sm font-medium mt-0.5 leading-snug" style={{ color: 'var(--fg-secondary)' }}>{a.title}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Latest 6 news articles */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
            {isAm ? 'አዳዲስ ዜናዎች' : 'Latest News'}
          </h2>
          <Link href={`${base}/news`} className="text-sm transition-opacity hover:opacity-70" style={{ color: 'var(--accent)' }}>
            {isAm ? 'ሁሉንም ተመልከት →' : 'All news →'}
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {PLACEHOLDER_ARTICLES.map((article) => (
            <article key={article.id} className="rounded overflow-hidden border group transition-shadow hover:shadow-md" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
              {/* TODO: replace with next/image from Sanity heroImage */}
              {/* <!-- TODO: replace before publish --> */}
              <div className="aspect-video flex items-center justify-center text-xs" style={{ background: 'var(--bg-muted)', color: 'var(--fg-muted)' }}>
                <span className="px-2 py-1 rounded text-xs font-medium" style={{ background: 'var(--border)' }}>{article.category}</span>
              </div>
              <div className="p-4">
                <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: 'var(--accent)' }}>{article.category}</span>
                <h3 className="mt-1 text-sm font-semibold leading-snug" style={{ fontFamily: 'var(--font-heading)', color: 'var(--fg-primary)' }}>
                  {article.title}
                </h3>
                <p className="text-xs mt-2" style={{ color: 'var(--fg-muted)' }}>{article.date}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Featured programs strip */}
      <section className="border-t border-b py-10" style={{ borderColor: 'var(--border)', background: 'var(--bg-muted)' }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
              {isAm ? 'ፕሮግራሞች' : 'Programs'}
            </h2>
            <Link href={`${base}/programs`} className="text-sm transition-opacity hover:opacity-70" style={{ color: 'var(--accent)' }}>
              {isAm ? 'ሁሉም ፕሮግራሞች →' : 'All programs →'}
            </Link>
          </div>
          {/* TODO: populate with real program list from § 4 once supplied */}
          <div className="rounded p-6 text-center text-sm border" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)', color: 'var(--fg-muted)' }}>
            Programs coming soon — awaiting official program slate
          </div>
        </div>
      </section>

      {/* Latest 8 video episodes */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-lg font-bold mb-5" style={{ fontFamily: 'var(--font-heading)' }}>
          {isAm ? 'አዳዲስ ቪዲዮዎች' : 'Latest Videos'}
        </h2>
        {/* TODO (Milestone 2): pull from YouTube Data API v3, channel @ESATtv, 10-min ISR cache */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded overflow-hidden border" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
              <div className="aspect-video flex items-center justify-center" style={{ background: 'var(--bg-muted)', color: 'var(--fg-muted)' }}>
                <span className="text-xs">TODO: YouTube thumbnail</span>
              </div>
              <div className="p-3">
                <p className="text-xs font-medium" style={{ color: 'var(--fg-secondary)' }}>
                  Sample video title — REPLACE BEFORE PUBLISH
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Donate CTA */}
      <section className="py-14 text-center" style={{ background: 'var(--accent)' }}>
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
            {isAm ? 'ኢሳትን ይደግፉ' : 'Support Independent Ethiopian Journalism'}
          </h2>
          {/* TODO: fill in real impact copy — do not invent impact numbers */}
          <p className="text-white/80 mb-6 text-sm">
            TODO: Donation impact copy — supply before publishing
          </p>
          <Link
            href={`${base}/donate`}
            className="inline-block bg-white font-semibold px-8 py-3 rounded transition-opacity hover:opacity-90"
            style={{ color: 'var(--accent)' }}
          >
            {isAm ? 'አሁን ይደግፉ' : 'Donate Now'}
          </Link>
        </div>
      </section>

      {/* Newsletter signup */}
      <section className="border-t py-10" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-xl mx-auto px-4 text-center">
          <h2 className="text-base font-bold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
            {isAm ? 'ዜና ደብዳቤ ይምዝገቡ' : 'Stay informed'}
          </h2>
          <p className="text-sm mb-4" style={{ color: 'var(--fg-secondary)' }}>
            {isAm ? 'TODO: Amharic newsletter description' : 'TODO: Newsletter description — supply before publishing'}
          </p>
          {/* TODO: wire to Resend/Buttondown */}
          <NewsletterForm locale={locale} />
        </div>
      </section>
    </div>
  )
}
