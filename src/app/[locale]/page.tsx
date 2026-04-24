import { setRequestLocale } from 'next-intl/server'
import Link from 'next/link'
import { NewsletterForm } from '@/components/NewsletterForm'
import { YouTubeEmbed } from '@/components/YouTubeEmbed'
import { getLiveStreamStatus, getLatestUploads } from '@/lib/youtube'
import { ESAT_CHANNEL_LIVE_URL } from '@/config/programs'

// ISR: re-render at most every 10 min (YouTube upload cadence)
export const revalidate = 600

interface Props {
  params: Promise<{ locale: string }>
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const isAm = locale === 'am'
  const base = locale === 'en' ? '' : `/${locale}`

  // Parallel fetch — both are cached server-side
  const [liveStatus, videos] = await Promise.all([
    getLiveStreamStatus(),
    getLatestUploads(8),
  ])

  const heroVideoId = liveStatus.isLive
    ? liveStatus.videoId
    : (liveStatus.latestVideoId ?? videos[0]?.id ?? '')

  const heroTitle = liveStatus.isLive
    ? liveStatus.title
    : (videos[0]?.title ?? 'ESAT')

  return (
    <div>
      {/* Breaking news ticker */}
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
            {/* Live / latest embed — 2/3 width */}
            <div className="md:col-span-2">
              <div className="text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2" style={{ color: 'var(--accent)' }}>
                {liveStatus.isLive ? (
                  <>
                    <span className="w-2 h-2 rounded-full animate-pulse inline-block" style={{ background: '#E04437' }} />
                    <span style={{ color: '#E04437' }}>{isAm ? 'ቀጥታ ስርጭት' : 'Live Now'}</span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full inline-block" style={{ background: 'var(--accent)' }} />
                    {isAm ? 'ቅርብ ቪዲዮ' : 'Latest Broadcast'}
                  </>
                )}
              </div>

              {heroVideoId ? (
                <YouTubeEmbed
                  videoId={heroVideoId}
                  title={heroTitle}
                  autoplay={false}
                  showWatchLink
                />
              ) : (
                /* Fallback when no video ID resolved yet */
                <div
                  className="aspect-video w-full rounded flex items-center justify-center text-sm"
                  style={{ background: 'var(--bg-muted)', color: 'var(--fg-muted)', border: '1px solid var(--border)' }}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">📡</div>
                    <a
                      href={ESAT_CHANNEL_LIVE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium hover:underline"
                      style={{ color: 'var(--accent)' }}
                    >
                      {isAm ? 'ኢሳት ቀጥታ ስርጭትን ይከታተሉ →' : 'Watch ESAT live on YouTube →'}
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Latest headlines sidebar */}
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--fg-muted)' }}>
                {isAm ? 'የቅርብ ዜናዎች' : 'Latest News'}
              </h2>
              {/* TODO: replace with Sanity news articles */}
              <ul className="space-y-4">
                {videos.slice(0, 4).map((video) => (
                  <li key={video.id} className="border-b pb-3" style={{ borderColor: 'var(--border)' }}>
                    <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: 'var(--accent)' }}>Video</span>
                    <a
                      href={video.watchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-sm font-medium mt-0.5 leading-snug hover:underline"
                      style={{ color: 'var(--fg-secondary)' }}
                    >
                      {video.title}
                    </a>
                  </li>
                ))}
              </ul>
              <Link
                href={`${base}/live`}
                className="mt-4 inline-block text-xs font-semibold uppercase tracking-wide transition-opacity hover:opacity-70"
                style={{ color: 'var(--accent)' }}
              >
                {isAm ? 'ሁሉም ቪዲዮዎች →' : 'All videos →'}
              </Link>
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
        {/* TODO: replace with Sanity news articles when CMS is populated */}
        <div className="rounded p-6 text-center text-sm border" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)', color: 'var(--fg-muted)' }}>
          {isAm ? 'ዜናዎቹ ቶሎ ይመጣሉ' : 'News articles coming soon — awaiting CMS content'}
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
            {isAm ? 'ፕሮግራሞቹ ቶሎ ይመጣሉ' : 'Programs coming soon — awaiting official program slate'}
          </div>
        </div>
      </section>

      {/* Latest 8 video episodes */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
            {isAm ? 'አዳዲስ ቪዲዮዎች' : 'Latest Videos'}
          </h2>
          <a
            href={ESAT_CHANNEL_LIVE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm transition-opacity hover:opacity-70"
            style={{ color: 'var(--accent)' }}
          >
            {isAm ? 'ሁሉም ቪዲዮዎች →' : 'YouTube channel →'}
          </a>
        </div>
        {videos.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {videos.map((video) => (
              <a
                key={video.id}
                href={video.watchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded overflow-hidden border transition-shadow hover:shadow-md block"
                style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={video.thumbnails.medium || video.thumbnails.high}
                  alt={video.title}
                  className="w-full aspect-video object-cover"
                  loading="lazy"
                />
                <div className="p-3">
                  <p className="text-xs font-medium leading-snug line-clamp-2" style={{ color: 'var(--fg-secondary)' }}>
                    {video.title}
                  </p>
                  {video.publishedAt && (
                    <p className="text-[10px] mt-1" style={{ color: 'var(--fg-muted)' }}>
                      {new Date(video.publishedAt).toLocaleDateString(locale === 'am' ? 'am-ET' : locale === 'or' ? 'om-ET' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  )}
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="rounded p-6 text-center text-sm border" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)', color: 'var(--fg-muted)' }}>
            <a href={ESAT_CHANNEL_LIVE_URL} target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: 'var(--accent)' }}>
              {isAm ? 'የዩቲዩብ ቻናሉን ይጎብኙ →' : 'Visit ESAT on YouTube →'}
            </a>
          </div>
        )}
      </section>

      {/* Donate CTA */}
      <section className="py-14 text-center" style={{ background: 'var(--accent)' }}>
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
            {isAm ? 'ኢሳትን ይደግፉ' : 'Support Independent Ethiopian Journalism'}
          </h2>
          {/* TODO: fill in real impact copy — do not invent impact numbers */}
          <p className="text-white/80 mb-6 text-sm">
            {isAm ? 'TODO: ስለ ድጋፍ ጽሑፍ' : 'TODO: Donation impact copy — supply before publishing'}
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
