/**
 * GET /api/live-status
 * Thin proxy so the client can poll live status without exposing YOUTUBE_API_KEY.
 * Returns JSON matching LiveStatus from @/lib/youtube/types.
 */
import { NextResponse } from 'next/server'
import { getLiveStreamStatus } from '@/lib/youtube'

export async function GET() {
  const status = await getLiveStreamStatus()

  // Cache aggressively: 2 min when live, 15 min when not live
  const maxAge = status.isLive ? 120 : 900

  return NextResponse.json(status, {
    headers: {
      'Cache-Control': `public, s-maxage=${maxAge}, stale-while-revalidate=60`,
    },
  })
}
