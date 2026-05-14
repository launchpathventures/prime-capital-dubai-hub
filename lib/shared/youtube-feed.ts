/**
 * CATALYST - YouTube Feed Fetcher
 *
 * Pulls public YouTube RSS feed data for a channel without API keys.
 * The channel page scrape splits long-form videos from Shorts when RSS
 * alone cannot provide enough structure.
 */

export interface YouTubeFeedItem {
  videoId: string
  title: string
  description: string
  publishedAt: string
  thumbnailUrl: string
  link: string
  isShort: boolean
}

interface YouTubeFeedOptions {
  channelId: string
  limit?: number
  revalidateSeconds?: number
}

interface YouTubeLibraryOptions {
  handle: string
  channelId?: string
  limitPerTab?: number
  revalidateSeconds?: number
}

type YouTubeLibraryResult = {
  videos: YouTubeFeedItem[]
  shorts: YouTubeFeedItem[]
}

function decodeEntities(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
}

function extractTag(entry: string, tag: string): string {
  const match = entry.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`))
  return match ? match[1].trim() : ""
}

function extractThumbnail(entry: string): string {
  const match = entry.match(/<media:thumbnail[^>]*url="([^"]+)"/)
  return match ? match[1] : ""
}

function extractThumbnailSize(entry: string): { width?: number; height?: number } {
  const match = entry.match(/<media:thumbnail[^>]*width="(\d+)"[^>]*height="(\d+)"/)
  if (!match) return {}
  return { width: Number(match[1]), height: Number(match[2]) }
}

function extractDurationSeconds(entry: string): number | null {
  const match = entry.match(/<yt:duration[^>]*seconds="(\d+)"/)
  return match ? Number(match[1]) : null
}

function extractAlternateLink(entry: string): string {
  const match = entry.match(/<link[^>]*rel="alternate"[^>]*href="([^"]+)"/)
  return match ? match[1] : ""
}

function isShortForm(title: string, description: string): boolean {
  const combined = `${title} ${description}`.toLowerCase()
  return /(^|\s)#shorts?\b/.test(combined) || /\bshorts\b/.test(combined)
}

function logYouTubeFetchIssue(message: string, ...args: unknown[]) {
  if (process.env.NODE_ENV !== "production") {
    console.warn(message, ...args)
  }
}

export async function getYouTubeFeed({
  channelId,
  limit = 6,
  revalidateSeconds = 3600,
}: YouTubeFeedOptions): Promise<YouTubeFeedItem[]> {
  const feedUrls = [
    `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`,
    `https://youtube.com/feeds/videos.xml?channel_id=${channelId}`,
  ]

  try {
    let xml = ""

    for (const url of feedUrls) {
      const response = await fetch(url, {
        next: { revalidate: revalidateSeconds },
        headers: {
          "User-Agent": "Mozilla/5.0",
          "Accept": "application/rss+xml, application/xml;q=0.9, */*;q=0.8",
        },
      })

      if (response.ok) {
        xml = await response.text()
        break
      }

      logYouTubeFetchIssue("YouTube feed unavailable:", response.status, url)
    }

    if (!xml) {
      return []
    }

    const entries = xml.split("<entry>").slice(1).map((chunk) => chunk.split("</entry>")[0])

    const items = entries.map((entry) => {
      const videoId = extractTag(entry, "yt:videoId")
      const title = decodeEntities(extractTag(entry, "title"))
      const description = decodeEntities(extractTag(entry, "media:description"))
      const publishedAt = extractTag(entry, "published")
      const thumbnailUrl = extractThumbnail(entry)
      const thumbnailSize = extractThumbnailSize(entry)
      const durationSeconds = extractDurationSeconds(entry)
      const alternateLink = extractAlternateLink(entry)
      const link = alternateLink || (videoId ? `https://www.youtube.com/watch?v=${videoId}` : "")
      const shortByDuration = durationSeconds !== null ? durationSeconds <= 60 : false
      const shortByAspect =
        typeof thumbnailSize.width === "number" &&
        typeof thumbnailSize.height === "number"
          ? thumbnailSize.height > thumbnailSize.width
          : false
      const shortFlag =
        link.includes("/shorts/") || shortByDuration || shortByAspect || isShortForm(title, description)

      return {
        videoId,
        title,
        description,
        publishedAt,
        thumbnailUrl: videoId ? stableThumbnailUrl(videoId) : thumbnailUrl,
        link,
        isShort: shortFlag,
      }
    })

    return items.filter((item) => item.videoId && item.title).slice(0, limit)
  } catch (error) {
    logYouTubeFetchIssue("YouTube feed fetch failed:", error)
    return []
  }
}

function extractInitialData(html: string): Record<string, unknown> | null {
  const markers = ["var ytInitialData = ", "ytInitialData = ", "window[\"ytInitialData\"] = "]
  for (const marker of markers) {
    const index = html.indexOf(marker)
    if (index === -1) continue
    const start = html.indexOf("{", index + marker.length)
    if (start === -1) continue
    let depth = 0
    for (let i = start; i < html.length; i += 1) {
      const char = html[i]
      if (char === "{") depth += 1
      if (char === "}") depth -= 1
      if (depth === 0) {
        const json = html.slice(start, i + 1)
        try {
          return JSON.parse(json)
        } catch {
          return null
        }
      }
    }
  }

  return null
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function getRecord(value: unknown, key: string): Record<string, unknown> | undefined {
  if (!isRecord(value)) return undefined
  const next = value[key]
  return isRecord(next) ? next : undefined
}

function resolveText(value: unknown): string {
  if (!value) return ""
  if (typeof value === "string") return value
  if (!isRecord(value)) return ""

  if (typeof value.content === "string") return value.content
  if (typeof value.simpleText === "string") return value.simpleText
  if (Array.isArray(value.runs)) {
    return value.runs
      .map((run) => (isRecord(run) && typeof run.text === "string" ? run.text : ""))
      .join("")
  }

  return ""
}

function resolveTitle(node: unknown): string {
  if (!isRecord(node)) return ""

  const title = resolveText(node.title) || resolveText(node.headline)
  if (title) return title

  const lockupMetadata = getRecord(getRecord(node, "metadata"), "lockupMetadataViewModel")
  const lockupTitle = resolveText(lockupMetadata?.title)
  if (lockupTitle) return lockupTitle

  const accessibilityData = getRecord(getRecord(node, "accessibility"), "accessibilityData")
  const label = accessibilityData?.label
  if (typeof label === "string") {
    return label.split(" - ")[0]?.trim() || label
  }

  return ""
}

function resolvePublishedAt(node: Record<string, unknown>): string {
  const publishedTime = resolveText(node.publishedTimeText)
  if (publishedTime) return publishedTime

  const lockupMetadata = getRecord(getRecord(node, "metadata"), "lockupMetadataViewModel")
  const contentMetadata = getRecord(
    getRecord(lockupMetadata, "metadata"),
    "contentMetadataViewModel"
  )
  const rows = contentMetadata?.metadataRows
  if (!Array.isArray(rows)) return ""

  for (const row of rows) {
    if (!isRecord(row) || !Array.isArray(row.metadataParts)) continue

    for (const part of row.metadataParts) {
      if (!isRecord(part)) continue
      const text = resolveText(part.text)
      if (/\bago\b/i.test(text) || /\b(streamed|premiered)\b/i.test(text)) {
        return text
      }
    }
  }

  return ""
}

/** Build a stable, public thumbnail URL from a video ID. */
function stableThumbnailUrl(videoId: string): string {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
}

function collectVideoItems(data: unknown, isShort: boolean): YouTubeFeedItem[] {
  const items: YouTubeFeedItem[] = []
  const seen = new Set<string>()

  const walk = (node: unknown) => {
    if (!node) return
    if (Array.isArray(node)) {
      node.forEach(walk)
      return
    }
    if (!isRecord(node)) return

    if (isRecord(node.reelItemRenderer)) {
      walk(node.reelItemRenderer)
    }
    if (isRecord(node.shortsLockupViewModel)) {
      walk(node.shortsLockupViewModel)
    }

    const videoId =
      typeof node.videoId === "string"
        ? node.videoId
        : typeof node.contentId === "string"
          ? node.contentId
          : ""
    const title = resolveTitle(node)
    if (videoId && title && !seen.has(videoId)) {
      const snippets = Array.isArray(node.detailedMetadataSnippets)
        ? node.detailedMetadataSnippets
        : []
      const firstSnippet = snippets[0]
      const link = isShort
        ? `https://www.youtube.com/shorts/${videoId}`
        : `https://www.youtube.com/watch?v=${videoId}`

      items.push({
        videoId,
        title,
        description:
          resolveText(node.descriptionSnippet) ||
          resolveText(isRecord(firstSnippet) ? firstSnippet.snippetText : undefined),
        publishedAt: resolvePublishedAt(node),
        thumbnailUrl: stableThumbnailUrl(videoId),
        link,
        isShort,
      })
      seen.add(videoId)
    }

    Object.values(node).forEach(walk)
  }

  walk(data)
  return items
}

async function fetchYouTubeTab({
  handle,
  tab,
  limitPerTab,
  revalidateSeconds,
}: {
  handle: string
  tab: "videos" | "shorts"
  limitPerTab: number
  revalidateSeconds: number
}): Promise<YouTubeFeedItem[]> {
  const cleanHandle = handle.replace(/^@/, "")
  const urls = [
    `https://www.youtube.com/@${cleanHandle}/${tab}`,
    tab === "shorts"
      ? `https://www.youtube.com/@${cleanHandle}/shorts?view=0&sort=dd&shelf_id=0`
      : `https://www.youtube.com/@${cleanHandle}/videos?view=0&sort=dd&shelf_id=0`,
  ]

  for (const url of urls) {
    const response = await fetch(url, {
      next: { revalidate: revalidateSeconds },
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    })

    if (!response.ok) {
      logYouTubeFetchIssue("YouTube scrape unavailable:", response.status, url)
      continue
    }

    const html = await response.text()
    const initialData = extractInitialData(html)
    if (!initialData) continue

    const items = collectVideoItems(initialData, tab === "shorts")
    if (items.length) return items.slice(0, limitPerTab)
  }

  return []
}

export async function getYouTubeLibrary({
  handle,
  channelId,
  limitPerTab = 50,
  revalidateSeconds = 3600,
}: YouTubeLibraryOptions): Promise<YouTubeLibraryResult> {
  const [videos, shorts] = await Promise.all([
    fetchYouTubeTab({ handle, tab: "videos", limitPerTab, revalidateSeconds }),
    fetchYouTubeTab({ handle, tab: "shorts", limitPerTab, revalidateSeconds }),
  ])

  if (channelId && (!videos.length || !shorts.length)) {
    const fallback = await getYouTubeFeed({
      channelId,
      limit: limitPerTab * 2,
      revalidateSeconds,
    })
    const fallbackVideos = fallback.filter((item) => !item.isShort).slice(0, limitPerTab)
    const fallbackShorts = fallback.filter((item) => item.isShort).slice(0, limitPerTab)

    return {
      videos: videos.length ? videos : fallbackVideos,
      shorts: shorts.length ? shorts : fallbackShorts,
    }
  }

  return { videos, shorts }
}
