/**
 * Main YouTube module — public API with three-tier fallback:
 *   1. YouTube Data API v3 (requires YOUTUBE_API_KEY)
 *   2. RSS/Atom feed (free, no key)
 *   3. Empty state (never crashes the site)
 *
 * Server-side only. Do not import in Client Components.
 */
import type { Video, Playlist, LiveStatus } from './types'
import { fetchRssVideos, rssHasRecentVideo } from './rss'
import {
  apiGetLatestUploads,
  apiGetPlaylistVideos,
  apiGetChannelPlaylists,
  apiGetLiveStreamStatus,
  apiGetVideoById,
} from './api'

const hasApiKey = () => Boolean(process.env.YOUTUBE_API_KEY)

function warn(msg: string) {
  if (process.env.NODE_ENV !== 'test') console.warn(`[youtube]`, msg)
}

// ─── Exports ─────────────────────────────────────────────────────────────────

export async function getLatestUploads(limit = 8): Promise<Video[]> {
  if (hasApiKey()) {
    try {
      return await apiGetLatestUploads(limit)
    } catch (err) {
      warn(`API getLatestUploads failed, falling back to RSS: ${err}`)
    }
  } else {
    warn('YOUTUBE_API_KEY not set — using RSS feed for latest uploads')
  }
  try {
    return await fetchRssVideos(limit)
  } catch (err) {
    warn(`RSS fallback also failed: ${err}`)
    return []
  }
}

export async function getLiveStreamStatus(): Promise<LiveStatus> {
  if (hasApiKey()) {
    try {
      // Pre-check: skip expensive search.list if RSS shows no recent activity
      const recentActivity = await rssHasRecentVideo(2 * 60 * 60 * 1000) // 2h window
      if (!recentActivity) {
        // No live stream likely — save the 100-unit search.list call
        const latest = await fetchRssVideos(1)
        return { isLive: false, latestVideoId: latest[0]?.id ?? null }
      }
      return await apiGetLiveStreamStatus()
    } catch (err) {
      warn(`API getLiveStreamStatus failed: ${err}`)
    }
  }
  // No API key or API failed — infer from RSS (no true live detection possible)
  try {
    const latest = await fetchRssVideos(1)
    return { isLive: false, latestVideoId: latest[0]?.id ?? null }
  } catch {
    return { isLive: false, latestVideoId: null }
  }
}

export async function getChannelPlaylists(): Promise<Playlist[]> {
  if (!hasApiKey()) {
    warn('YOUTUBE_API_KEY not set — cannot fetch channel playlists')
    return []
  }
  try {
    return await apiGetChannelPlaylists()
  } catch (err) {
    warn(`API getChannelPlaylists failed: ${err}`)
    return []
  }
}

export async function getPlaylistVideos(playlistId: string, limit = 24): Promise<Video[]> {
  if (!hasApiKey()) {
    warn('YOUTUBE_API_KEY not set — cannot fetch playlist videos')
    return []
  }
  try {
    return await apiGetPlaylistVideos(playlistId, limit)
  } catch (err) {
    warn(`API getPlaylistVideos(${playlistId}) failed: ${err}`)
    return []
  }
}

export async function getVideoById(videoId: string): Promise<Video | null> {
  if (!hasApiKey()) return null
  try {
    return await apiGetVideoById(videoId)
  } catch (err) {
    warn(`API getVideoById(${videoId}) failed: ${err}`)
    return null
  }
}

export type { Video, Playlist, LiveStatus }
