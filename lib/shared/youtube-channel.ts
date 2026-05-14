/**
 * CATALYST - Cached YouTube Channel Items
 *
 * Shared channel-level cache wrapper for RSS-backed YouTube feeds.
 */

import { ttlCache } from "./ttl-cache"
import { getYouTubeLibrary, type YouTubeFeedItem } from "./youtube-feed"

interface YouTubeChannelConfig {
  channelId: string
  handle: string
  cachePrefix: string
}

interface GetCachedYouTubeItemsOptions {
  channel: YouTubeChannelConfig
  limit?: number
  limitPerType?: number
  cacheKey: string
  ttlMs?: number
  revalidateSeconds?: number
}

function getPublishedTime(item: YouTubeFeedItem) {
  const time = new Date(item.publishedAt).getTime()
  return Number.isFinite(time) ? time : 0
}

export async function getCachedYouTubeItems({
  channel,
  limit = 100,
  limitPerType,
  cacheKey,
  ttlMs = 60 * 60 * 1000,
  revalidateSeconds = 3600,
}: GetCachedYouTubeItemsOptions): Promise<YouTubeFeedItem[]> {
  const cacheLimit = limitPerType ? `per-type:${limitPerType}` : String(limit)

  return ttlCache(`${channel.cachePrefix}:youtube:${cacheKey}:${cacheLimit}`, ttlMs, async () => {
    const perTab = Math.max(12, limitPerType ?? limit)
    const library = await getYouTubeLibrary({
      handle: channel.handle,
      channelId: channel.channelId,
      limitPerTab: perTab,
      revalidateSeconds,
    })

    const items = limitPerType
      ? [
          ...library.videos.slice(0, limitPerType),
          ...library.shorts.slice(0, limitPerType),
        ]
      : [...library.videos, ...library.shorts]

    const sortedItems = items
      .sort((a, b) => getPublishedTime(b) - getPublishedTime(a))
      .map((item) => ({
        ...item,
        description: item.description?.slice(0, 280) || "",
      }))

    return limitPerType ? sortedItems : sortedItems.slice(0, limit)
  })
}
