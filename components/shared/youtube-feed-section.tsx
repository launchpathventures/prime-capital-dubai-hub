/**
 * CATALYST - Shared YouTube Feed Section
 *
 * Tabs, client fallback fetch, and load-more pagination for a YouTube feed.
 */

"use client"

import * as React from "react"

import type { YouTubeFeedItem } from "@/lib/shared/youtube-feed"
import { YouTubeFeedGrid } from "./youtube-feed"

interface YouTubeFeedSectionProps {
  initialItems: YouTubeFeedItem[]
  endpoint: string
  limit?: number
  limitPerType?: number
  defaultTab?: "videos" | "shorts"
  pageSize?: number
  emptyLabel?: string
}

export function YouTubeFeedSection({
  initialItems,
  endpoint,
  limit = 100,
  limitPerType,
  defaultTab = "videos",
  pageSize = 12,
  emptyLabel = "No videos available yet.",
}: YouTubeFeedSectionProps) {
  const [items, setItems] = React.useState<YouTubeFeedItem[]>(initialItems)
  const [hasAttempted, setHasAttempted] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState<"videos" | "shorts">(defaultTab)
  const [pageMap, setPageMap] = React.useState<{ videos: number; shorts: number }>({
    videos: 1,
    shorts: 1,
  })
  const [hasMoreMap, setHasMoreMap] = React.useState<{ videos: boolean; shorts: boolean }>({
    videos: true,
    shorts: true,
  })

  const fetchItems = React.useCallback(
    async (nextLimit: number) => {
      const params = new URLSearchParams({ limit: String(nextLimit) })
      if (limitPerType) params.set("limitPerType", String(limitPerType))

      const response = await fetch(`${endpoint}?${params.toString()}`)
      const data = await response.json()
      return Array.isArray(data?.items) ? (data.items as YouTubeFeedItem[]) : []
    },
    [endpoint, limitPerType]
  )

  React.useEffect(() => {
    if (initialItems.length > 0 || hasAttempted) return

    const runFallbackFetch = async () => {
      try {
        setHasAttempted(true)
        const nextItems = await fetchItems(limit)
        if (nextItems.length) {
          setItems(nextItems)
        }
      } catch {
        // Keep the empty state below if YouTube is unreachable.
      }
    }

    runFallbackFetch()
  }, [fetchItems, hasAttempted, initialItems.length, limit])

  const videos = React.useMemo(() => items.filter((item) => !item.isShort), [items])
  const shorts = React.useMemo(() => items.filter((item) => item.isShort), [items])
  const activeItems = activeTab === "videos" ? videos : shorts
  const activePage = activeTab === "videos" ? pageMap.videos : pageMap.shorts
  const visibleItems = activeItems.slice(0, activePage * pageSize)
  const hasHiddenFetchedItems = activeItems.length > visibleItems.length
  const canFetchMore = items.length < limit && activeItems.length >= activePage * pageSize
  const canLoadMore =
    hasMoreMap[activeTab] && (hasHiddenFetchedItems || canFetchMore)

  const handleLoadMore = async () => {
    const nextPage = activePage + 1

    if (hasHiddenFetchedItems) {
      setPageMap((prev) => ({
        ...prev,
        [activeTab]: prev[activeTab] + 1,
      }))
      return
    }

    const nextLimit = Math.min(limit, nextPage * pageSize)

    try {
      const nextItems = await fetchItems(nextLimit)
      if (nextItems.length) {
        if (nextItems.length > items.length) {
          setItems(nextItems)
        } else {
          setHasMoreMap((prev) => ({ ...prev, [activeTab]: false }))
        }
      } else {
        setHasMoreMap((prev) => ({ ...prev, [activeTab]: false }))
      }
    } catch {
      setHasMoreMap((prev) => ({ ...prev, [activeTab]: false }))
    }

    setPageMap((prev) => ({
      ...prev,
      [activeTab]: prev[activeTab] + 1,
    }))
  }

  if (!items.length && !hasAttempted) {
    return (
      <div className="youtube-feed-empty">
        <p>Loading videos...</p>
      </div>
    )
  }

  if (!items.length) {
    return (
      <div className="youtube-feed-empty">
        <p>{emptyLabel}</p>
      </div>
    )
  }

  return (
    <div className="youtube-feed-section">
      <div className="youtube-feed-tabs" role="tablist" aria-label="YouTube feed">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "videos"}
          className={
            activeTab === "videos"
              ? "youtube-feed-pill youtube-feed-pill--active"
              : "youtube-feed-pill"
          }
          onClick={() => setActiveTab("videos")}
        >
          Videos <span>{videos.length}</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "shorts"}
          className={
            activeTab === "shorts"
              ? "youtube-feed-pill youtube-feed-pill--active"
              : "youtube-feed-pill"
          }
          onClick={() => setActiveTab("shorts")}
        >
          Shorts <span>{shorts.length}</span>
        </button>
      </div>

      {visibleItems.length === 0 ? (
        <div className="youtube-feed-empty">
          <p>
            {activeTab === "shorts"
              ? "No shorts available yet."
              : "No videos available yet."}
          </p>
        </div>
      ) : (
        <>
          <YouTubeFeedGrid items={visibleItems} />
          {canLoadMore ? (
            <div className="youtube-feed-load">
              <button
                type="button"
                className="youtube-feed-load__button"
                onClick={handleLoadMore}
              >
                Load more
              </button>
            </div>
          ) : null}
        </>
      )}
    </div>
  )
}
