/**
 * CATALYST - Shared YouTube Feed Grid
 *
 * Lightweight, click-to-play video cards for RSS-backed YouTube feeds.
 */

"use client"

import * as React from "react"
import Image from "next/image"
import { ExternalLink, Play } from "lucide-react"

import type { YouTubeFeedItem } from "@/lib/shared/youtube-feed"

interface YouTubeFeedGridProps {
  items: YouTubeFeedItem[]
}

function formatDate(value: string): string {
  if (!value) return ""
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return value
  return parsed.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

function YouTubeCard({ item }: { item: YouTubeFeedItem }) {
  const [isPlaying, setIsPlaying] = React.useState(false)
  const date = formatDate(item.publishedAt)

  return (
    <article className="youtube-feed-card">
      <div className="youtube-feed-card__media">
        {isPlaying ? (
          <iframe
            src={`https://www.youtube.com/embed/${item.videoId}?autoplay=1&rel=0`}
            title={item.title}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            className="youtube-feed-card__thumb"
            onClick={() => setIsPlaying(true)}
            aria-label={`Play ${item.title}`}
          >
            {item.thumbnailUrl ? (
              <Image
                src={item.thumbnailUrl}
                alt={item.title}
                fill
                sizes="(min-width: 1080px) 33vw, (min-width: 720px) 50vw, 100vw"
                className="youtube-feed-card__image"
              />
            ) : (
              <span className="youtube-feed-card__fallback" aria-hidden />
            )}
            <span className="youtube-feed-card__play" aria-hidden>
              <Play size={22} fill="currentColor" />
            </span>
          </button>
        )}
      </div>

      <div className="youtube-feed-card__content">
        <div className="youtube-feed-card__meta">
          {date ? <time dateTime={item.publishedAt}>{date}</time> : null}
          <span>{item.isShort ? "Short" : "Video"}</span>
        </div>
        <h3 className="youtube-feed-card__title">{item.title}</h3>
        {item.description ? (
          <p className="youtube-feed-card__description">{item.description}</p>
        ) : null}
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="youtube-feed-card__link"
        >
          Watch on YouTube
          <ExternalLink size={15} aria-hidden />
        </a>
      </div>
    </article>
  )
}

export function YouTubeFeedGrid({ items }: YouTubeFeedGridProps) {
  if (!items.length) return null

  return (
    <div className="youtube-feed-grid">
      {items.map((item) => (
        <YouTubeCard key={item.videoId} item={item} />
      ))}
    </div>
  )
}
