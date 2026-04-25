import { setRequestLocale } from 'next-intl/server'
import Link from 'next/link'
import { NewsletterForm } from '@/components/NewsletterForm'
import { getLiveStreamStatus, getLatestUploads } from '@/lib/youtube'
import { ESAT_CHANNEL_URL } from '@/config/programs'

export const revalidate = 600

interface Props {
  params: Promise<{ locale: string }>
}

function detectLang(title: string): string {
  if (/oduu/i.test(title)) return 'Afaan Oromoo'
  if (/tigrigna/i.test(title)) return 'Tigrigna'
  if (/amharic/i.test(title)) return 'Amharic'
  if (/english/i.test(title)) return 'English'
  return 'ESAT'
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const isAm = locale === 'am'
  const base = locale === 'en' ? '' : `/${locale}`

  const [liveStatus, videos] = await Promise.all([
    getLiveStreamStatus(),
    getLatestUploads(12),
  ])

  const heroVideo = liveStatus.isLive
    ? { id: liveStatus.videoId, title: liveStatus.title, thumbnails: { high: liveStatus.thumbnailUrl, medium: liveStatus.thumbnailUrl }, publishedAt: liveStatus.startedAt, watchUrl: `https://www.youtube.com/watch?v=${liveStatus.videoId}` }
    : videos[0]

  const sidebarVideos = videos.slice(1, 6)
  const gridVideos = videos.slice(1)

  return (
    <div>
      {/* Hero */}
      <section className="max-w-[1280px] mx-auto px-6 pt-10 pb-14">
        <div className="grid lg:grid-cols-5 gap-10">

          {/* Featured video */}
          <div className="lg:col-span-3">
            <div className="flex items-center gap-3 mb-4">
              {liveStatus.isLive ? (
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--live)' }} />
                  <span className="font-mono text-[11px] font-semibold tracking-widest uppercase" style={{ color: 'var(--live)' }}>Live Now</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--gold)' }} />
                  <span className="font-mono text-[11px] font-semibold tracking-widest uppercase" style={{ color: 'var(--gold)' }}>
                    {isAm ? 'ቅርብ ስርጭት' : 'Latest Broadcast'}
                  </span>
                </div>
              )}
            </div>

            {heroVideo ? (
              <a href={heroVideo.watchUrl} target="_blank" rel="noopener noreferrer" className="block group">
                <div className="featured-thumb">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://i.ytimg.com/vi/${heroVideo.id}/hqdefault.jpg`}
                    alt={heroVideo.title}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-[76px] h-[76px] rounded-full flex items-center justify-center shadow-xl group-hover:scale-105 transition-transform" style={{ background: 'rgba(255,255,255,0.95)' }}>
                      <svg width="30" height="30" viewBox="0 0 24 24" fill="var(--text)"><path d="M8 5v14l11-7z"/></svg>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <span className="category">{detectLang(heroVideo.title)}</span>
                  <h1 className="font-serif font-bold text-[28px] leading-[1.1] tracking-tight mt-2" style={{ color: 'var(--text)' }}>
                    {heroVideo.title}
                  </h1>
                  <div className="flex items-center gap-3 mt-4 meta">
                    {heroVideo.publishedAt && (
                      <span>{new Date(heroVideo.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    )}
                    <span className="w-px h-3" style={{ background: 'var(--border-strong)' }} />
                    <span className="font-semibold" style={{ color: 'var(--gold)' }}>
                      {isAm ? 'ዩቲዩብ ላይ ይመልከቱ →' : 'Watch on YouTube →'}
                    </span>
                  </div>
                </div>
              </a>
            ) : (
              <a href={ESAT_CHANNEL_URL} target="_blank" rel="noopener noreferrer" className="featured-thumb flex items-center justify-center" style={{ color: 'var(--gold)' }}>
                {isAm ? 'ኢሳትን ዩቲዩብ ላይ ይከታተሉ →' : 'Watch ESAT on YouTube →'}
              </a>
            )}
          </div>

          {/* Recent broadcasts sidebar */}
          <aside className="lg:col-span-2">
            <div className="flex items-baseline gap-3 mb-2 pb-4" style={{ borderBottom: '1px solid var(--border)' }}>
              <span className="ethiopic font-semibold text-[18px]" style={{ color: 'var(--text)' }}>የቅርብ ጊዜ</span>
              <span className="font-serif font-bold text-[18px]">{isAm ? 'ቅርብ ስርጭቶች' : 'Recent'}</span>
              <Link href={`${base}/live`} className="ml-auto text-[11px] font-semibold tracking-wider uppercase link-hover" style={{ color: 'var(--gold)' }}>
                {isAm ? 'ሁሉም →' : 'All →'}
              </Link>
            </div>

            {sidebarVideos.map((video) => (
              <a key={video.id} href={video.watchUrl} target="_blank" rel="noopener noreferrer" className="update-item">
                <div className="update-meta">
                  <div className="update-date">
                    {video.publishedAt ? new Date(video.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase() : ''}
                  </div>
                  <div className="update-lang">{detectLang(video.title)}</div>
                </div>
                <div className="update-title">{video.title}</div>
              </a>
            ))}

            <a
              href={ESAT_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex items-center justify-center gap-2 py-3 border rounded text-[13px] font-semibold transition hover:bg-black hover:text-white"
              style={{ borderColor: 'var(--border-strong)', color: 'var(--text)' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              {isAm ? 'ዩቲዩብ ላይ ይከታተሉ' : 'Subscribe on YouTube'}
            </a>
          </aside>
        </div>
      </section>

      {/* Broadcast schedule strip */}
      <section className="border-y" style={{ borderColor: 'var(--border)', background: 'var(--bg-alt)' }}>
        <div className="max-w-[1280px] mx-auto px-6 py-5">
          <div className="flex flex-wrap items-center gap-x-10 gap-y-3 text-[13px]">
            <div className="flex items-center gap-2 font-semibold" style={{ color: 'var(--text)' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ color: 'var(--gold)' }}>
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
              <span>{isAm ? 'ስርጭት' : 'On Air'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium" style={{ color: 'var(--text)' }}>{isAm ? 'የአማርኛ ዜና' : 'Amharic News'}</span>
              <span className="meta font-mono">weeknights · 20:00 EAT</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium" style={{ color: 'var(--text)' }}>Afaan Oromoo</span>
              <span className="meta font-mono">Mon–Fri · 19:30 EAT</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium" style={{ color: 'var(--text)' }}>Tigrigna</span>
              <span className="meta font-mono">Thu · 21:00 EAT</span>
            </div>
            <Link href={`${base}/programs`} className="ml-auto text-[11px] font-semibold tracking-wider uppercase link-hover" style={{ color: 'var(--gold)' }}>
              {isAm ? 'ሙሉ ሰዓት →' : 'Full schedule →'}
            </Link>
          </div>
        </div>
      </section>

      {/* Latest broadcasts grid */}
      <section className="max-w-[1280px] mx-auto px-6 py-16">
        <div className="section-header">
          <span className="section-header-am">ዜና</span>
          <span className="section-header-en">{isAm ? 'አዳዲስ ስርጭቶች' : 'Latest Broadcasts'}</span>
          <div className="section-header-rule" />
          <Link href={`${base}/live`} className="section-header-link link-hover">
            {isAm ? 'ሁሉም →' : 'View archive'}
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
          {gridVideos.slice(0, 8).map((video) => (
            <a key={video.id} href={video.watchUrl} target="_blank" rel="noopener noreferrer" className="card-video block">
              <div className="card-video-thumb">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={video.thumbnails.medium || video.thumbnails.high} alt={video.title} loading="lazy" />
                <div className="play-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
                </div>
              </div>
              <div className="mt-3">
                <span className="category">{detectLang(video.title)}</span>
                <h3 className="card-video-title mt-1.5">{video.title}</h3>
                <div className="meta mt-2">
                  {video.publishedAt && new Date(video.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Manifesto */}
      <section style={{ background: 'var(--bg-dark)', color: 'white' }}>
        <div className="max-w-[1280px] mx-auto px-6 py-24">
          <div className="max-w-4xl">
            <div className="manifesto-kicker">
              {isAm ? 'በ16ኛ ዓመታችን' : 'On our sixteenth year'}
            </div>
            <p className="manifesto-body mt-6" style={{ color: 'rgba(255,255,255,0.9)' }}>
              {isAm
                ? 'ኢሳት እ.ኤ.አ. ኤፕሪል 24 ቀን 2010 ዓ.ም. ተቋቋሟል — በሰቁ፣ ለሰቅ ወይም ለስደት ምክንያት ሃገራቸውን ለቀው በወጡ ጋዜጠኞች። ሲጀምር ምልክቱ 24 ጊዜ ታፍኗል። ዛሬ ኢሳት ከ'
                : <>
                    ESAT was founded <span style={{ color: 'var(--gold-soft)' }}>in exile</span> on April 24, 2010, by journalists who had been jailed, tortured, or forced from their country for the work they did. For years our signal was jammed <span style={{ color: 'var(--gold-soft)' }}>twenty-four times</span>. Today, we broadcast from <span style={{ color: 'var(--gold-soft)' }}>Addis Ababa itself</span> — home, on home soil — in Amharic, Afaan Oromoo, Tigrigna, and English, serving the people we always served.
                  </>
              }
            </p>
            <p className="mt-8 text-[15px] leading-relaxed max-w-2xl" style={{ color: 'rgba(255,255,255,0.55)' }}>
              {isAm
                ? 'ከምንም መንግሥት ገንዘብ አንቀበልም። ማስታወቂያ አናስቀምጥም። የምንደገፈው በተመልካቾቻችን እና ነፃ ፕሬስ የነፃ ማህበረሰብ መሰረት ነው ብለው በሚያምኑ ሰዎች ነው።'
                : 'We accept no government funding. We carry no advertising. We are sustained by our viewers and by supporters who believe, as we do, that a free press is the foundation of every free society.'
              }
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href={`${base}/donate`} className="btn-gold">
                {isAm ? 'ኢሳትን ይደግፉ' : 'Support ESAT'}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M5 12h14M13 5l7 7-7 7"/>
                </svg>
              </Link>
              <Link
                href={`${base}/editorial-policy`}
                className="inline-flex items-center gap-2 px-6 py-[9px] text-[13px] font-semibold border rounded transition"
                style={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}
              >
                {isAm ? 'የዝግጅት ፖሊሲያችን' : 'Read our editorial policy'}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="border-t py-16" style={{ borderColor: 'var(--border)', background: 'var(--bg-alt)' }}>
        <div className="max-w-xl mx-auto px-6 text-center">
          <div className="manifesto-kicker justify-center mb-4">
            {isAm ? 'ዜና ደብዳቤ' : 'Newsletter'}
          </div>
          <h2 className="font-serif font-bold text-[28px] tracking-tight mb-3" style={{ color: 'var(--text)' }}>
            {isAm ? 'ዜናውን ይከታተሉ' : 'Stay informed'}
          </h2>
          <p className="text-[14px] mb-6" style={{ color: 'var(--text-secondary)' }}>
            {isAm
              ? 'TODO: Amharic newsletter description'
              : 'TODO: Newsletter description — supply before publishing'
            }
          </p>
          <NewsletterForm locale={locale} />
        </div>
      </section>
    </div>
  )
}
