import { setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'
import Link from 'next/link'
import { YouTubeEmbed } from '@/components/YouTubeEmbed'
import { getLiveStreamStatus, getLatestUploads } from '@/lib/youtube'
import { ESAT_CHANNEL_URL, ESAT_CHANNEL_LIVE_URL } from '@/config/programs'

export const metadata: Metadata = { title: 'Live TV' }

// Revalidate every 2 min — live-stream check is expensive (100 API quota units)
export const revalidate = 120

interface Props { params: Promise<{ locale: string }> }

export default async function LivePage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const isAm = locale === 'am'
  const base = locale === 'en' ? '' : `/${locale}`

  const [liveStatus, recentVideos] = await Promise.all([
    getLiveStreamStatus(),
    getLatestUploads(12),
  ])

  const heroId = liveStatus.isLive
    ? liveStatus.videoId
    : (liveStatus.latestVideoId ?? recentVideos[0]?.id ?? '')

  const heroTitle = liveStatus.isLive
    ? liveStatus.title
    : (recentVideos[0]?.title ?? 'ESAT')

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Page title */}
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
          {isAm ? 'ቀጥታ ቴሌቪዥን' : 'Live TV'}
        </h1>
        {liveStatus.isLive && (
          <span
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide px-2.5 py-1 rounded-full"
            style={{ background: '#E04437', color: '#fff' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            {isAm ? 'ቀጥታ' : 'Live'}
          </span>
        )}
      </div>

      {/* Hero player */}
      <div className="grid lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2">
          {heroId ? (
            <YouTubeEmbed
              videoId={heroId}
              title={heroTitle}
              thumbnailUrl={liveStatus.isLive ? liveStatus.thumbnailUrl : undefined}
              autoplay={false}
              showWatchLink
              className="w-full"
            />
          ) : (
            <div
              className="aspect-video rounded flex flex-col items-center justify-center gap-3"
              style={{ background: 'var(--bg-muted)', border: '1px solid var(--border)' }}
            >
              <span className="text-3xl">📡</span>
              <p className="text-sm font-medium" style={{ color: 'var(--fg-secondary)' }}>
                {isAm ? 'ቀጥታ ስርጭት አሁን የለም' : 'No live stream currently active'}
              </p>
              <a
                href={ESAT_CHANNEL_LIVE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold hover:underline"
                style={{ color: 'var(--accent)' }}
              >
                {isAm ? 'ዩቲዩብ ላይ ቀጥታ ስርጭትን ይከታተሉ →' : 'Watch live on YouTube →'}
              </a>
            </div>
          )}

          {/* Status note */}
          <p className="text-xs mt-2" style={{ color: 'var(--fg-muted)' }}>
            {liveStatus.isLive
              ? (isAm ? 'አሁን ቀጥታ ስርጭት በሄደ ላይ ነው' : 'ESAT is broadcasting live right now')
              : (isAm ? 'ቀጥታ ስርጭት የለም — አዲሱ ቪዲዮ ይታያል' : 'No live broadcast — showing latest upload')
            }
          </p>
        </div>

        {/* Side info */}
        <div>
          <div
            className="rounded p-5 border text-sm space-y-4"
            style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}
          >
            <h2 className="font-bold text-base" style={{ fontFamily: 'var(--font-heading)' }}>
              {isAm ? 'ስለ ኢሳት ቲቪ' : 'About ESAT TV'}
            </h2>
            <p style={{ color: 'var(--fg-secondary)' }}>
              {isAm
                ? 'ኢሳት ለኢትዮጵያ ሕዝብ ነፃ ዜናና ፕሮግራሞችን ከ2010 ዓ.ም ጀምሮ ያቀርባል።'
                : 'ESAT delivers independent news and programs to the Ethiopian people since April 24, 2010.'}
            </p>
            <div className="space-y-2 pt-1">
              <a
                href={ESAT_CHANNEL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs font-medium hover:underline"
                style={{ color: 'var(--accent)' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                {isAm ? 'የዩቲዩብ ቻናሉ →' : 'YouTube channel →'}
              </a>
              <Link
                href={`${base}/programs`}
                className="flex items-center gap-2 text-xs font-medium hover:underline"
                style={{ color: 'var(--accent)' }}
              >
                {isAm ? 'ፕሮግራሞቹን ይመልከቱ →' : 'Browse programs →'}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent uploads */}
      {recentVideos.length > 0 && (
        <section>
          <h2 className="text-lg font-bold mb-5" style={{ fontFamily: 'var(--font-heading)' }}>
            {isAm ? 'አዳዲስ ቪዲዮዎች' : 'Recent Uploads'}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentVideos.map((video) => (
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
                      {new Date(video.publishedAt).toLocaleDateString(
                        locale === 'am' ? 'am-ET' : locale === 'or' ? 'om-ET' : 'en-US',
                        { month: 'short', day: 'numeric', year: 'numeric' }
                      )}
                    </p>
                  )}
                </div>
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
