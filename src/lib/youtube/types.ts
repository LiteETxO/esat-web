export type Video = {
  id: string
  title: string
  description: string
  publishedAt: string // ISO 8601
  thumbnails: {
    default: string  // 120x90
    medium: string   // 320x180
    high: string     // 480x360
    maxres?: string  // 1280x720 when available
  }
  duration?: string   // ISO 8601, e.g. "PT1H23M45S"
  viewCount?: number
  channelTitle: string
  embedUrl: string    // youtube-nocookie.com/embed/{id}
  watchUrl: string    // youtube.com/watch?v={id}
}

export type Playlist = {
  id: string
  title: string
  description: string
  itemCount: number
  thumbnails: Video['thumbnails']
}

export type LiveStatus =
  | { isLive: true; videoId: string; title: string; thumbnailUrl: string; startedAt: string }
  | { isLive: false; latestVideoId: string | null }

export type CachedResult<T> = {
  data: T
  cachedAt: number  // Unix ms
  stale?: boolean
}
