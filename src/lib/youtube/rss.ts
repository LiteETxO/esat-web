/**
 * RSS fallback — fetches ESAT's public Atom feed.
 * No API key required. Used when YOUTUBE_API_KEY is absent or the API fails.
 */
import type { Video } from './types'

const CHANNEL_ID = process.env.NEXT_PUBLIC_ESAT_YT_CHANNEL_ID ?? 'UCSYM-vgRrMYsZbG-Z7Kz0Pw'
const RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`

function thumbs(videoId: string): Video['thumbnails'] {
  return {
    default: `https://i.ytimg.com/vi/${videoId}/default.jpg`,
    medium:  `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`,
    high:    `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
    maxres:  `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
  }
}

function extract(xml: string, tag: string): string {
  const m = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'))
  return m ? m[1].replace(/^<!\[CDATA\[/, '').replace(/]]>$/, '').trim() : ''
}

function extractAttr(xml: string, tag: string, attr: string): string {
  const m = xml.match(new RegExp(`<${tag}[^>]*\\s${attr}="([^"]*)"`, 'i'))
  return m ? m[1] : ''
}

export async function fetchRssVideos(limit = 15): Promise<Video[]> {
  const res = await fetch(RSS_URL, {
    next: { revalidate: 600 }, // 10-min Next.js data cache
    headers: { 'User-Agent': 'ESATweb/1.0' },
  })
  if (!res.ok) throw new Error(`RSS fetch failed: ${res.status}`)

  const xml = await res.text()

  // Split into <entry> blocks
  const entries = xml.split('<entry>').slice(1, limit + 1)

  return entries.map((block): Video => {
    const videoId = extract(block, 'yt:videoId')
    const title   = extract(block, 'title') || extract(block, 'media:title')
    const desc    = extract(block, 'media:description') || ''
    const published = extract(block, 'published') || ''
    const channelTitle = extract(block, 'name') || 'ESAT'

    return {
      id: videoId,
      title,
      description: desc.slice(0, 300),
      publishedAt: published,
      thumbnails: thumbs(videoId),
      channelTitle,
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`,
      watchUrl: `https://www.youtube.com/watch?v=${videoId}`,
    }
  }).filter(v => v.id && v.title)
}

/** Lightweight live-stream heuristic based on RSS alone (free, no quota) */
export async function rssHasRecentVideo(withinMs = 2 * 60 * 60 * 1000): Promise<boolean> {
  try {
    const videos = await fetchRssVideos(5)
    const cutoff = Date.now() - withinMs
    return videos.some(v => new Date(v.publishedAt).getTime() > cutoff)
  } catch {
    return false
  }
}
