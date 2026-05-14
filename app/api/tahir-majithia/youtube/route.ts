/**
 * CATALYST - Tahir YouTube Feed API
 *
 * Returns Tahir's latest public YouTube videos and Shorts using the same
 * lightweight RSS + channel-page scrape pattern as Steven Leckie.
 */

import { NextRequest, NextResponse } from "next/server"

import { brands } from "@/lib/brand"
import { getCachedYouTubeItems } from "@/lib/shared/youtube-channel"

const DEFAULT_LIMIT_PER_TYPE = 12
const MAX_LIMIT_PER_TYPE = 12

export async function GET(request: NextRequest) {
  const youtube = brands.tahir.youtube

  if (!youtube) {
    return NextResponse.json({ items: [] })
  }

  const { searchParams } = new URL(request.url)
  const limitPerTypeParam = searchParams.get("limitPerType")
  const legacyLimitParam = searchParams.get("limit")
  const limitPerType = limitPerTypeParam
    ? Number(limitPerTypeParam)
    : legacyLimitParam
      ? Math.ceil(Number(legacyLimitParam) / 2)
      : DEFAULT_LIMIT_PER_TYPE

  const safeLimitPerType = Number.isFinite(limitPerType)
    ? limitPerType
    : DEFAULT_LIMIT_PER_TYPE
  const cappedLimitPerType = Math.min(
    MAX_LIMIT_PER_TYPE,
    Math.max(1, safeLimitPerType || DEFAULT_LIMIT_PER_TYPE)
  )

  const items = await getCachedYouTubeItems({
    channel: youtube,
    limit: cappedLimitPerType * 2,
    limitPerType: cappedLimitPerType,
    cacheKey: "library",
  })

  return NextResponse.json({ items })
}
