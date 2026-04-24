import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import Link from 'next/link'
import { routing } from '@/i18n/routing'
import { WordmarkLogo } from '@/components/WordmarkLogo'
import { LocaleSwitcher } from '@/components/LocaleSwitcher'
import '../globals.css'

export const metadata: Metadata = {
  title: { default: 'ESAT — Ethiopian Satellite Television', template: '%s | ESAT' },
  description: 'Independent Ethiopian news, programs, and live broadcasting.',
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

  return (
    <html lang={locale} className="bg-stone-50 text-stone-900">
      <body className="min-h-screen flex flex-col antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <header className="sticky top-0 z-50 bg-white border-b border-stone-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
              <WordmarkLogo locale={locale} />
              <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-500">
                <Link href={`/${locale}/news`} className="hover:text-stone-900 transition-colors">News</Link>
                <Link href={`/${locale}/programs`} className="hover:text-stone-900 transition-colors">Programs</Link>
                <Link href={`/${locale}/live`} className="hover:text-stone-900 transition-colors">Live</Link>
                <Link
                  href={`/${locale}/donate`}
                  className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-1.5 rounded-full text-xs font-semibold transition-colors"
                >
                  Donate
                </Link>
              </nav>
              <LocaleSwitcher />
            </div>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="bg-white border-t border-stone-200 py-8 text-center text-sm text-stone-400">
            © {new Date().getFullYear()} Ethiopian Satellite Television &mdash; Independent since 2010
          </footer>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
