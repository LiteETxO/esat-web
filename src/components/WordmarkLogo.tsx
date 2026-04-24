import Link from 'next/link'

interface Props {
  locale: string
  className?: string
}

// TODO: Replace with official supplied logo asset (§ 0.2 Q3)
export function WordmarkLogo({ locale, className = '' }: Props) {
  const href = locale === 'en' ? '/' : `/${locale}`
  return (
    <Link href={href} className={`flex flex-col leading-none select-none ${className}`} aria-label="ESAT — Ethiopian Satellite Television">
      <span
        className="text-2xl font-bold tracking-[0.12em] uppercase"
        style={{ fontFamily: 'var(--font-heading, Georgia, serif)', color: 'var(--fg-primary)' }}
      >
        ESAT
      </span>
      <span
        className="text-[9px] tracking-[0.18em] uppercase"
        style={{ fontFamily: 'var(--font-eth-body, sans-serif)', color: 'var(--accent)', letterSpacing: '0.15em' }}
      >
        ኢሳት
      </span>
    </Link>
  )
}
