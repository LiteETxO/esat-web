import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import Link from 'next/link'
import { Source_Serif_4, Inter, Noto_Serif_Ethiopic, Noto_Sans_Ethiopic } from 'next/font/google'
import { routing } from '@/i18n/routing'
import { WordmarkLogo } from '@/components/WordmarkLogo'
import { LocaleSwitcher } from '@/components/LocaleSwitcher'
import '../globals.css'

const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
  weight: ['400', '600', '700'],
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

const notoSerifEthiopic = Noto_Serif_Ethiopic({
  subsets: ['ethiopic'],
  variable: '--font-eth-heading',
  display: 'swap',
  weight: ['400', '600', '700'],
})

const notoSansEthiopic = Noto_Sans_Ethiopic({
  subsets: ['ethiopic'],
  variable: '--font-eth-body',
  display: 'swap',
  weight: ['400', '500', '600'],
})

export const metadata: Metadata = {
  title: { default: 'ESAT — Ethiopian Satellite Television & Radio', template: '%s | ESAT' },
  description: 'Independent Ethiopian news, programs, and live broadcasting. Founded 2010.',
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

interface Props {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params

  if (!routing.locales.includes(locale as typeof routing.locales[number])) {
    notFound()
  }

  setRequestLocale(locale)
  const messages = await getMessages()

  const fontVars = [
    sourceSerif.variable,
    inter.variable,
    notoSerifEthiopic.variable,
    notoSansEthiopic.variable,
  ].join(' ')

  const base = locale === 'en' ? '' : `/${locale}`

  const navLinks = [
    { href: `/${locale === 'en' ? '' : locale + '/'}news`.replace('//', '/'), label: locale === 'am' ? 'ዜና' : 'News' },
    { href: `/${locale === 'en' ? '' : locale + '/'}programs`.replace('//', '/'), label: locale === 'am' ? 'ፕሮግራሞች' : 'Programs' },
    { href: `/${locale === 'en' ? '' : locale + '/'}live`.replace('//', '/'), label: locale === 'am' ? 'ቀጥታ' : 'Live' },
    { href: `/${locale === 'en' ? '' : locale + '/'}radio`.replace('//', '/'), label: 'Radio' },
    { href: `/${locale === 'en' ? '' : locale + '/'}about`.replace('//', '/'), label: locale === 'am' ? 'ስለ ኢሳት' : 'About' },
  ]

  const donateHref = `/${locale === 'en' ? '' : locale + '/'}donate`.replace('//', '/')

  return (
    <html lang={locale} className={fontVars}>
      <body className="min-h-screen flex flex-col" style={{ background: 'var(--paper)', color: 'var(--text)' }}>
        <NextIntlClientProvider locale={locale} messages={messages}>

          {/* Studio time strip */}
          <div className="studio-strip">
            <div className="max-w-[1280px] mx-auto px-6 py-2 flex items-center gap-5 overflow-x-auto text-[11px]">
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--gold-soft)' }} />
                <span className="font-semibold" style={{ color: 'rgba(255,255,255,0.9)' }}>ADDIS ABABA</span>
                <span style={{ color: 'var(--gold-soft)' }}>·</span>
                <span style={{ color: 'rgba(255,255,255,0.65)' }}>EAT</span>
              </div>
              <span style={{ color: 'var(--gold-soft)' }}>·</span>
              <span className="shrink-0 ethiopic" style={{ color: 'rgba(255,255,255,0.75)' }}>ኢሳት — ኢትዮጵያ ሳተላይት ቴሌቪዥን እና ሬዲዮ</span>
              <span className="ml-auto shrink-0" style={{ color: 'rgba(255,255,255,0.55)', fontFamily: 'var(--font-mono)' }}>
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
          </div>

          {/* Masthead */}
          <header className="sticky top-0 z-50" style={{ background: 'var(--header-bg)', borderBottom: '1px solid var(--header-border)', backdropFilter: 'blur(8px)' }}>
            <div className="max-w-[1280px] mx-auto px-6 h-[72px] flex items-center justify-between gap-6">
              <WordmarkLogo locale={locale} />

              <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
                {navLinks.map(({ href, label }) => (
                  <Link key={href} href={href} className="nav-link" style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)', padding: '6px 2px', transition: 'color 0.15s ease' }}>
                    {label}
                  </Link>
                ))}
              </nav>

              <div className="flex items-center gap-3">
                <Link href={donateHref} className="btn-gold hidden sm:inline-flex">
                  {locale === 'am' ? 'ኢሳትን ይደግፉ' : 'Support ESAT'}
                </Link>
                <LocaleSwitcher />
              </div>
            </div>
          </header>

          <main className="flex-1">{children}</main>

          {/* Footer */}
          <footer className="border-t text-sm" style={{ background: 'var(--bg-dark)', borderColor: '#2a2520', color: 'rgba(255,255,255,0.5)' }}>
            <div className="max-w-[1280px] mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <WordmarkLogo locale={locale} className="mb-4" variant="dark" />
                <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  Independent Ethiopian broadcasting since April 24, 2010.
                  Washington D.C. · Amsterdam · London
                </p>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--gold)', fontFamily: 'var(--font-mono)' }}>Coverage</h3>
                <ul className="space-y-2">
                  {[
                    { label: 'News', href: `${base}/news` },
                    { label: 'Programs', href: `${base}/programs` },
                    { label: 'Live TV', href: `${base}/live` },
                    { label: 'Radio', href: `${base}/radio` },
                    { label: 'Archives', href: `${base}/archives` },
                  ].map(({ label, href }) => (
                    <li key={label}><Link href={href} className="hover:opacity-80 transition-opacity" style={{ color: 'rgba(255,255,255,0.55)' }}>{label}</Link></li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--gold)', fontFamily: 'var(--font-mono)' }}>Organisation</h3>
                <ul className="space-y-2">
                  {[
                    { label: 'About ESAT', href: `${base}/about` },
                    { label: 'Contact', href: `${base}/contact` },
                    { label: 'Donate', href: donateHref },
                  ].map(({ label, href }) => (
                    <li key={label}><Link href={href} className="hover:opacity-80 transition-opacity" style={{ color: 'rgba(255,255,255,0.55)' }}>{label}</Link></li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--gold)', fontFamily: 'var(--font-mono)' }}>Policies</h3>
                <ul className="space-y-2">
                  {[
                    { label: 'Editorial Policy', href: `${base}/editorial-policy` },
                    { label: 'Privacy', href: `${base}/privacy` },
                    { label: 'Terms', href: `${base}/terms` },
                    { label: 'Corrections', href: `${base}/corrections` },
                  ].map(({ label, href }) => (
                    <li key={label}><Link href={href} className="hover:opacity-80 transition-opacity" style={{ color: 'rgba(255,255,255,0.55)' }}>{label}</Link></li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="max-w-[1280px] mx-auto px-6 py-4 border-t flex flex-wrap items-center justify-between gap-2 text-xs" style={{ borderColor: '#2a2520', color: 'rgba(255,255,255,0.3)' }}>
              <span>© {new Date().getFullYear()} Foundation Ethiopian Satellite Television and Radio</span>
            </div>
          </footer>

        </NextIntlClientProvider>
      </body>
    </html>
  )
}
