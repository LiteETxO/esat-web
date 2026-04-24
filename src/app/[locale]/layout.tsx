import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { WordmarkLogo } from '@/components/WordmarkLogo'
import { LocaleSwitcher } from '@/components/LocaleSwitcher'
import '../globals.css'

export const metadata: Metadata = {
  title: { default: 'ESAT — Ethiopian Satellite Television', template: '%s | ESAT' },
  description: 'Independent Ethiopian news, programs, and live broadcasting.',
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

  const messages = await getMessages()

  return (
    <html lang={locale} className="bg-gray-950 text-gray-100">
      <body className="min-h-screen flex flex-col antialiased">
        <NextIntlClientProvider messages={messages}>
          <header className="sticky top-0 z-50 bg-gray-950/90 backdrop-blur border-b border-gray-800">
            <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
              <WordmarkLogo locale={locale} />
              <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-300">
                <a href={`/${locale}/news`} className="hover:text-white transition-colors">News</a>
                <a href={`/${locale}/programs`} className="hover:text-white transition-colors">Programs</a>
                <a href={`/${locale}/live`} className="hover:text-white transition-colors">Live</a>
                <a href={`/${locale}/donate`} className="hover:text-red-400 transition-colors font-semibold">Donate</a>
              </nav>
              <LocaleSwitcher />
            </div>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="border-t border-gray-800 py-8 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Ethiopian Satellite Television
          </footer>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
