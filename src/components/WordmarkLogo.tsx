import Link from 'next/link'
import Image from 'next/image'

interface Props {
  locale: string
  className?: string
  variant?: 'light' | 'dark'
}

export function WordmarkLogo({ locale, className = '', variant = 'light' }: Props) {
  const href = locale === 'en' ? '/' : `/${locale}`
  const textColor = variant === 'dark' ? 'rgba(255,255,255,0.92)' : 'var(--text)'
  const subColor = variant === 'dark' ? 'var(--gold-soft)' : 'var(--accent)'
  return (
    <Link href={href} className={`flex items-center gap-3 select-none ${className}`} aria-label="ESAT — Ethiopian Satellite Television">
      <Image src="/esat-logo.svg" alt="ESAT logo" width={36} height={38} priority />
      <div className="flex flex-col leading-none">
        <span
          className="text-[13px] font-bold tracking-[0.03em] uppercase"
          style={{ fontFamily: 'var(--font-heading, Georgia, serif)', color: textColor }}
        >
          Ethiopian Satellite Television
        </span>
        <span
          className="text-[9px] tracking-[0.18em] uppercase"
          style={{ fontFamily: 'var(--font-eth-body, sans-serif)', color: subColor, letterSpacing: '0.15em' }}
        >
          ኢሳት
        </span>
      </div>
    </Link>
  )
}
