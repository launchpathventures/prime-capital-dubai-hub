/**
 * CATALYST - Tahir YouTube Section
 *
 * Brand wrapper around the shared RSS-backed YouTube feed.
 */

import { YouTubeFeedSection } from "@/components/shared/youtube-feed-section"
import type { YouTubeFeedItem } from "@/lib/shared/youtube-feed"

import { TahirLink } from "./tahir-link"

const TAHIR_YOUTUBE_LIMIT_PER_TYPE = 12
const TAHIR_YOUTUBE_LIMIT = TAHIR_YOUTUBE_LIMIT_PER_TYPE * 2

interface TahirYouTubeSectionProps {
  initialItems: YouTubeFeedItem[]
  compact?: boolean
}

export function TahirYouTubeSection({
  initialItems,
  compact = false,
}: TahirYouTubeSectionProps) {
  return (
    <div className={compact ? "tahir-youtube tahir-youtube--compact" : "tahir-youtube"}>
      <div className="tahir-youtube__header">
        <div>
          <p className="tahir-eyebrow">Watch and learn</p>
          <h2 className="tahir-h2">Dubai property insights, straight from Tahir.</h2>
          <p className="tahir-lead">
            Market context, investor questions, developer conversations, and short
            explainers from the channel.
          </p>
        </div>
        {compact ? (
          <TahirLink href="/videos" className="tahir-btn tahir-btn--secondary">
            View all videos
          </TahirLink>
        ) : null}
      </div>

      <YouTubeFeedSection
        endpoint="/api/tahir-majithia/youtube"
        initialItems={initialItems}
        limit={TAHIR_YOUTUBE_LIMIT}
        limitPerType={TAHIR_YOUTUBE_LIMIT_PER_TYPE}
        pageSize={compact ? 6 : 12}
        emptyLabel="Tahir's latest videos could not be loaded yet."
      />
    </div>
  )
}
