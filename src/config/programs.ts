/**
 * Maps canonical ESAT program slugs to YouTube playlist IDs.
 * TODO: populate once the real program slate (§ 4 of main brief) is supplied
 * and playlist IDs are confirmed from the channel.
 *
 * Example when filled in:
 *   'yebier-tebita': 'PLxxxxxxxxxxxxxxxxxxxxxxxx',
 *   'ethiopia-nege': 'PLxxxxxxxxxxxxxxxxxxxxxxxx',
 */
export const programPlaylistMap: Record<string, string> = {
  // TODO: awaiting program slate and playlist ID mapping
}

export const ESAT_CHANNEL_ID = process.env.NEXT_PUBLIC_ESAT_YT_CHANNEL_ID ?? 'UCSYM-vgRrMYsZbG-Z7Kz0Pw'
export const ESAT_CHANNEL_HANDLE = process.env.NEXT_PUBLIC_ESAT_YT_HANDLE ?? 'ESATtvEthiopia'
export const ESAT_CHANNEL_URL = `https://www.youtube.com/@${ESAT_CHANNEL_HANDLE}`
export const ESAT_CHANNEL_LIVE_URL = `${ESAT_CHANNEL_URL}/live`
