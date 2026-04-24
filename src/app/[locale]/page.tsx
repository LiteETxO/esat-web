import { getTranslations, setRequestLocale } from 'next-intl/server'
import Link from 'next/link'

const MOCK_ARTICLES = [
  { id: '1', title: 'Ethiopia opposition leaders call for talks', titleAm: 'የኢትዮጵያ ተቃዋሚ መሪዎች ድርድር ጠሩ', slug: 'opposition-calls-for-talks', category: 'Politics', publishedAt: '2026-04-22' },
  { id: '2', title: 'Addis Ababa infrastructure expansion plan announced', titleAm: 'የአዲስ አበባ መሠረተ ልማት ማስፋፊያ ዕቅድ ታወቀ', slug: 'addis-infrastructure', category: 'Economy', publishedAt: '2026-04-21' },
  { id: '3', title: 'Diaspora solidarity rally draws thousands in Washington', titleAm: 'ዲያስፖራ ሰልፍ በዋሽንግተን ሺዎችን ሳበ', slug: 'diaspora-rally-dc', category: 'Diaspora', publishedAt: '2026-04-20' },
  { id: '4', title: 'ESAT special report: Tigray humanitarian crisis update', titleAm: 'ኢሳት ልዩ ዘገባ፡ የትግራይ ሰብዓዊ ቀውስ ዘመናዊ ሁኔታ', slug: 'tigray-update', category: 'Human Rights', publishedAt: '2026-04-19' },
  { id: '5', title: 'Ethiopian coffee exports hit record high in 2026', titleAm: 'የኢትዮጵያ ቡና ወጪ ንግድ በ2026 ሪከርድ ሰበረ', slug: 'coffee-record', category: 'Economy', publishedAt: '2026-04-18' },
  { id: '6', title: 'New media freedom index places Ethiopia in top risers', titleAm: 'አዲሱ የሚዲያ ነፃነት መረጃ ኢትዮጵያን በላይ አሳዩ', slug: 'media-freedom-index', category: 'Media', publishedAt: '2026-04-17' },
]

const MOCK_PROGRAMS = [
  { id: 'p1', title: 'Ye Ethiopia Lijoch', titleAm: 'የኢትዮጵያ ልጆች', bucket: 'talk' },
  { id: 'p2', title: 'Amsterdam Bureau', titleAm: 'አምስተርዳም ቢሮ', bucket: 'amsterdam' },
  { id: 'p3', title: 'Human Rights Watch', titleAm: 'የሰብዓዊ መብት ክትትል', bucket: 'human-rights' },
]

interface Props {
  params: Promise<{ locale: string }>
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('home')

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">

      <section className="rounded-xl bg-gradient-to-r from-red-900/60 to-gray-900 border border-red-800/40 p-6 flex items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-red-400 uppercase mb-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            {t('liveNow')}
          </span>
          <h2 className="text-xl font-bold">ESAT Live Broadcast</h2>
          <p className="text-gray-400 text-sm mt-1">24/7 independent Ethiopian television</p>
        </div>
        <Link
          href={`/${locale}/live`}
          className="shrink-0 bg-red-600 hover:bg-red-500 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors"
        >
          {t('goLive')}
        </Link>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-200 mb-4 pb-2 border-b border-gray-800">
          {t('latestNews')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {MOCK_ARTICLES.map(article => (
            <Link
              key={article.id}
              href={`/${locale}/news/${article.slug}`}
              className="group rounded-lg bg-gray-900 border border-gray-800 overflow-hidden hover:border-gray-600 transition-colors"
            >
              <div className="aspect-video bg-gray-800 flex items-center justify-center text-gray-600 text-xs">
                <span>Photo</span>
              </div>
              <div className="p-4">
                <span className="text-xs text-red-400 font-medium uppercase tracking-wide">{article.category}</span>
                <h3 className="mt-1 text-sm font-semibold leading-snug group-hover:text-white transition-colors line-clamp-2">
                  {locale === 'am' ? article.titleAm : article.title}
                </h3>
                <p className="text-xs text-gray-500 mt-2">{article.publishedAt}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-200 mb-4 pb-2 border-b border-gray-800">
          {t('featuredPrograms')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {MOCK_PROGRAMS.map(program => (
            <Link
              key={program.id}
              href={`/${locale}/programs/${program.id}`}
              className="group rounded-lg bg-gray-900 border border-gray-800 overflow-hidden hover:border-gray-600 transition-colors"
            >
              <div className="aspect-video bg-gray-800 flex items-center justify-center text-gray-600 text-xs">
                <span>Thumbnail</span>
              </div>
              <div className="p-4">
                <span className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">{program.bucket}</span>
                <h3 className="mt-1 text-sm font-semibold group-hover:text-white transition-colors">
                  {locale === 'am' ? program.titleAm : program.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-xl bg-gray-900 border border-gray-800 p-8 text-center">
        <h2 className="text-2xl font-bold mb-2">Support Independent Ethiopian Journalism</h2>
        <p className="text-gray-400 mb-6 max-w-lg mx-auto">
          ESAT is viewer-funded. Your donation keeps our reporters on the ground and our signal in the air.
        </p>
        <Link
          href={`/${locale}/donate`}
          className="inline-block bg-red-600 hover:bg-red-500 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
        >
          Donate Now
        </Link>
      </section>

    </div>
  )
}
