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

  const navLinks = [
    { href: `/${locale === 'en' ? '' : locale + '/'}news`.replace('//', '/'), label: locale === 'am' ? 'ዜና' : 'News' },
    { href: `/${locale === 'en' ? '' : locale + '/'}programs`.replace('//', '/'), label: locale === 'am' ? 'ፕሮግራሞች' : 'Programs' },
    { href: `/${locale === 'en' ? '' : locale + '/'}live`.replace('//', '/'), label: locale === 'am' ? 'ቀጥታ' : 'Live' },
    { href: `/${locale === 'en' ? '' : locale + '/'}radio`.replace('//', '/'), label: 'Radio' },
    { href: `/${locale === 'en' ? '' : locale + '/'}about`.replace('//', '/'), label: locale === 'am' ? 'ስለ ኢሳት' : 'About' },
  ]

  return (
    <html lang={locale} className={fontVars}>
      <body className="min-h-screen flex flex-col" style={{ background: 'var(--bg-page)', color: 'var(--fg-primary)', fontFamily: 'var(--font-body, Inter, sans-serif)' }}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {/* Header */}
          <header className="sticky top-0 z-50 backdrop-blur" style={{ background: 'var(--header-bg)', borderBottom: '1px solid var(--header-border)' }}>
            <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-6">
              <WordmarkLogo locale={locale} />

              <nav className="hidden md:flex items-center gap-5 text-sm" aria-label="Main navigation">
                {navLinks.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className="transition-colors hover:opacity-100"
                    style={{ color: 'var(--fg-secondary)' }}
                  >
                    {label}
                  </Link>
                ))}
              </nav>

              <div className="flex items-center gap-3">
                <Link
                  href={`/${locale === 'en' ? '' : locale + '/'}donate`.replace('//', '/')}
                  className="hidden sm:inline-flex items-center px-4 py-1.5 rounded text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ background: 'var(--accent)' }}
                >
                  {locale === 'am' ? 'ይደግፉ' : 'Donate'}
                </Link>
                <LocaleSwitcher />
              </div>
            </div>
          </header>

          <main className="flex-1">{children}</main>

          {/* Footer */}
          <footer className="border-t text-sm" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)', color: 'var(--fg-secondary)' }}>
            <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <WordmarkLogo locale={locale} className="mb-3" />
                <p className="text-xs leading-relaxed" style={{ color: 'var(--fg-muted)' }}>
                  Independent Ethiopian broadcasting since April 24, 2010.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-xs uppercase tracking-widest mb-3" style={{ color: 'var(--fg-muted)' }}>Coverage</h3>
                <ul className="space-y-2">
                  {['News', 'Programs', 'Live TV', 'Radio', 'Archives'].map(item => (
                    <li key={item}><Link href="#" className="hover:opacity-80 transition-opacity">{item}</Link></li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-xs uppercase tracking-widest mb-3" style={{ color: 'var(--fg-muted)' }}>Organisation</h3>
                <ul className="space-y-2">
                  {['About ESAT', 'Contact', 'Donate', 'Press inquiries'].map(item => (
                    <li key={item}><Link href="#" className="hover:opacity-80 transition-opacity">{item}</Link></li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-xs uppercase tracking-widest mb-3" style={{ color: 'var(--fg-muted)' }}>Policies</h3>
                <ul className="space-y-2">
                  {[
                    { label: 'Editorial Policy', href: `/${locale === 'en' ? '' : locale + '/'}editorial-policy`.replace('//', '/') },
                    { label: 'Privacy', href: `/${locale === 'en' ? '' : locale + '/'}privacy`.replace('//', '/') },
                    { label: 'Terms', href: `/${locale === 'en' ? '' : locale + '/'}terms`.replace('//', '/') },
                    { label: 'Corrections', href: `/${locale === 'en' ? '' : locale + '/'}corrections`.replace('//', '/') },
                  ].map(({ label, href }) => (
                    <li key={label}><Link href={href} className="hover:opacity-80 transition-opacity">{label}</Link></li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 py-4 border-t flex flex-wrap items-center justify-between gap-2 text-xs" style={{ borderColor: 'var(--border)', color: 'var(--fg-muted)' }}>
              <span>© {new Date().getFullYear()} Foundation Ethiopian Satellite Television and Radio</span>
              {/* TODO: verify legal entity details, registration numbers, and addresses before publishing */}
              <span>Washington D.C. · Amsterdam · London</span>
            </div>
          </footer>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
