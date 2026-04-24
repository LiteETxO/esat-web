'use client'

import { useState, useCallback } from 'react'

interface Props {
  videoId: string
  title: string
  thumbnailUrl?: string
  autoplay?: boolean
  start?: number
  className?: string
  /** Show a "Watch on YouTube" link below the player */
  showWatchLink?: boolean
}

/**
 * Facade-pattern YouTube embed.
 * Renders a thumbnail + play button on first paint (no YouTube JS loaded).
 * Swaps in the real iframe only when the user clicks play.
 * Uses youtube-nocookie.com — no tracking cookies.
 */
export function YouTubeEmbed({
  videoId,
  title,
  thumbnailUrl,
  autoplay = false,
  start,
  className = '',
  showWatchLink = false,
}: Props) {
  const [active, setActive] = useState(autoplay)

  const thumb = thumbnailUrl ?? `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`

  const params = new URLSearchParams({
    rel: '0',
    modestbranding: '1',
    ...(autoplay || active ? { autoplay: '1' } : {}),
    ...(start ? { start: String(start) } : {}),
  })
  const src = `https://www.youtube-nocookie.com/embed/${videoId}?${params}`
  const watchUrl = `https://www.youtube.com/watch?v=${videoId}`

  const handleClick = useCallback(() => setActive(true), [])

  return (
    <div className={`relative ${className}`}>
      <div
        className="relative w-full overflow-hidden rounded"
        style={{ aspectRatio: '16/9', background: '#000' }}
      >
        {active ? (
          <iframe
            src={src}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
            className="absolute inset-0 w-full h-full border-0"
          />
        ) : (
          <button
            onClick={handleClick}
            aria-label={`Play: ${title}`}
            className="absolute inset-0 w-full h-full group"
            style={{ cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
          >
            {/* Thumbnail */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={thumb}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                // Fall back to hqdefault if maxres doesn't exist
                const img = e.currentTarget
                if (!img.src.includes('hqdefault')) {
                  img.src = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
                }
              }}
            />

            {/* Dark overlay on hover */}
            <span
              className="absolute inset-0 transition-opacity group-hover:opacity-20"
              style={{ background: '#000', opacity: 0 }}
              aria-hidden="true"
            />

            {/* Play button */}
            <span
              className="absolute inset-0 flex items-center justify-center"
              aria-hidden="true"
            >
              <span
                className="flex items-center justify-center rounded-full transition-transform group-hover:scale-110"
                style={{
                  width: 68,
                  height: 68,
                  background: 'rgba(0,0,0,0.75)',
                }}
              >
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                  <polygon points="9,5 24,14 9,23" fill="white" />
                </svg>
              </span>
            </span>
          </button>
        )}
      </div>

      {showWatchLink && (
        <a
          href={watchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs mt-1 inline-flex items-center gap-1 transition-opacity hover:opacity-70"
          style={{ color: 'var(--fg-muted)' }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.2 8.2 0 004.79 1.53V6.77a4.85 4.85 0 01-1.02-.08z" />
          </svg>
          Watch on YouTube
        </a>
      )}
    </div>
  )
}
