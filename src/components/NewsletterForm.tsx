'use client'

interface Props { locale: string }

export function NewsletterForm({ locale }: Props) {
  const isAm = locale === 'am'
  return (
    <form className="flex gap-2 max-w-sm mx-auto" onSubmit={(e) => e.preventDefault()}>
      <input
        type="email"
        placeholder="your@email.com"
        className="flex-1 px-3 py-2 rounded border text-sm"
        style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)', color: 'var(--fg-primary)' }}
        aria-label="Email address"
      />
      <button
        type="submit"
        className="px-4 py-2 rounded text-sm font-semibold text-white"
        style={{ background: 'var(--accent)' }}
      >
        {isAm ? 'ይምዝገቡ' : 'Subscribe'}
      </button>
    </form>
  )
}
