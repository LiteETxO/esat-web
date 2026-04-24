import Link from 'next/link'

interface Props {
  locale: string
  className?: string
}

export function WordmarkLogo({ locale, className = '' }: Props) {
  return (
    <Link href={`/${locale}`} className={`flex flex-col leading-none ${className}`}>
      <span className="text-2xl font-black tracking-widest text-white">ESAT</span>
      <span className="text-[10px] font-medium tracking-[0.2em] text-red-500 uppercase">ኢሳት</span>
    </Link>
  )
}
