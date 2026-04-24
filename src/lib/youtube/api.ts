/**
 * YouTube Data API v3 client — server-side only.
 * YOUTUBE_API_KEY must never appear in NEXT_PUBLIC_ or in the client bundle.
 */
import type { Video, Playlist, LiveStatus } from './types'

const CHANNEL_ID     = process.env.NEXT_PUBLIC_ESAT_YT_CHANNEL_ID ?? 'UCSYM-vgRrMYsZbG-Z7Kz0Pw'
const UPLOADS_PL_ID  = CHANNEL_ID.replace(/^UC/, 'UU')
const API_BASE       = 'https://www.googleapis.com/youtube/v3'

function getKey(): string {
  const k = process.env.YOUTUBE_API_KEY
  if (!k) throw new Error('YOUTUBE_API_KEY not configured')
  return k
}

function thumbs(t: Record<string, { url: string }> = {}): Video['thumbnails'] {
  return {
    default: t.default?.url ?? '',
    medium:  t.medium?.url  ?? '',
    high:    t.high?.url    ?? '',
    maxres:  t.maxres?.url,
  }
}

function toEmbedUrl(id: string) {
  return `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1`
}

async function apiFetch<T>(path: string, params: Record<string, string>, revalidate: number): Promise<T> {
  const key = getKey()
  const url = new URL(`${API_BASE}${path}`)
  Object.entries({ ...params, key }).forEach(([k, v]) => url.searchParams.set(k, v))

  const res = await fetch(url.toString(), { next: { revalidate } })
  if (!res.ok) throw new Error(`YouTube API ${path} ${res.status}: ${await res.text()}`)
  return res.json() as Promise<T>
}

// ─── Public functions ────────────────────────────────────────────────────────

export async function apiGetLatestUploads(limit: number): Promise<Video[]> {
  // Cost: 1 unit per call  |  TTL: 10 min
  const data = await apiFetch<any>('/playlistItems', {
    part: 'snippet',
    playlistId: UPLOADS_PL_ID,
    maxResults: String(Math.min(limit, 50)),
  }, 600)

  return (data.items ?? []).map((item: any): Video => {
    const s = item.snippet
    const vid = s.resourceId?.videoId ?? ''
    return {
      id: vid,
      title: s.title ?? '',
      description: (s.description ?? '').slice(0, 300),
      publishedAt: s.publishedAt ?? '',
      thumbnails: thumbs(s.thumbnails),
      channelTitle: s.channelTitle ?? 'ESAT',
      embedUrl: toEmbedUrl(vid),
      watchUrl: `https://www.youtube.com/watch?v=${vid}`,
    }
  }).filter((v: Video) => v.id && v.title !== 'Private video' && v.title !== 'Deleted video')
}

export async function apiGetPlaylistVideos(playlistId: string, limit: number): Promise<Video[]> {
  // Cost: 1 unit per call  |  TTL: 1 hour
  const data = await apiFetch<any>('/playlistItems', {
    part: 'snippet',
    playlistId,
    maxResults: String(Math.min(limit, 50)),
  }, 3600)

  return (data.items ?? []).map((item: any): Video => {
    const s = item.snippet
    const vid = s.resourceId?.videoId ?? ''
    return {
      id: vid,
      title: s.title ?? '',
      description: (s.description ?? '').slice(0, 300),
      publishedAt: s.publishedAt ?? '',
      thumbnails: thumbs(s.thumbnails),
      channelTitle: s.channelTitle ?? 'ESAT',
      embedUrl: toEmbedUrl(vid),
      watchUrl: `https://www.youtube.com/watch?v=${vid}`,
    }
  }).filter((v: Video) => v.id && v.title !== 'Private video')
}

export async function apiGetChannelPlaylists(): Promise<Playlist[]> {
  // Cost: 1 unit per call  |  TTL: 24 hours
  const data = await apiFetch<any>('/playlists', {
    part: 'snippet,contentDetails',
    channelId: CHANNEL_ID,
    maxResults: '50',
  }, 86400)

  return (data.items ?? []).map((item: any): Playlist => ({
    id: item.id,
    title: item.snippet?.title ?? '',
    description: item.snippet?.description ?? '',
    itemCount: item.contentDetails?.itemCount ?? 0,
    thumbnails: thumbs(item.snippet?.thumbnails),
  }))
}

export async function apiGetLiveStreamStatus(): Promise<LiveStatus> {
  // Cost: 100 units per call — use sparingly, gated by rssHasRecentVideo() in index.ts
  // TTL: 2 min when live, 15 min when not live (caller controls via revalidate)
  const data = await apiFetch<any>('/search', {
    part: 'snippet',
    channelId: CHANNEL_ID,
    eventType: 'live',
    type: 'video',
    maxResults: '1',
  }, 120) // 2 min base; route handler extends to 15 min when not live

  const item = data.items?.[0]
  if (item?.snippet?.liveBroadcastContent === 'live') {
    const vid = item.id?.videoId ?? ''
    return {
      isLive: true,
      videoId: vid,
      title: item.snippet.title ?? '',
      thumbnailUrl: item.snippet.thumbnails?.high?.url ?? `https://i.ytimg.com/vi/${vid}/hqdefault.jpg`,
      startedAt: item.snippet.publishedAt ?? new Date().toISOString(),
    }
  }
  return { isLive: false, latestVideoId: null }
}

export async function apiGetVideoById(videoId: string): Promise<Video | null> {
  // Cost: 1 unit per call  |  TTL: 6 hours
  const data = await apiFetch<any>('/videos', {
    part: 'snippet,contentDetails,statistics',
    id: videoId,
  }, 21600)

  const item = data.items?.[0]
  if (!item) return null
  const s = item.snippet
  return {
    id: videoId,
    title: s.title ?? '',
    description: (s.description ?? '').slice(0, 300),
    publishedAt: s.publishedAt ?? '',
    thumbnails: thumbs(s.thumbnails),
    duration: item.contentDetails?.duration,
    viewCount: parseInt(item.statistics?.viewCount ?? '0', 10) || undefined,
    channelTitle: s.channelTitle ?? 'ESAT',
    embedUrl: toEmbedUrl(videoId),
    watchUrl: `https://www.youtube.com/watch?v=${videoId}`,
  }
}
