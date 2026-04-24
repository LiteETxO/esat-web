import Link from 'next/link'
import Image from 'next/image'

interface Props {
  locale: string
  className?: string
}

export function WordmarkLogo({ locale, className = '' }: Props) {
  return (
    <Link href={`/${locale}`} className={`flex items-center ${className}`}>
      <Image
        src="/esat-web/esat-logo.png"
        alt="ESAT — Ethiopian Satellite Television"
        width={36}
        height={38}
        className="object-contain"
        priority
      />
    </Link>
  )
}
