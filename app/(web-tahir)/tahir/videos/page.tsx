/**
 * CATALYST - Tahir Videos
 *
 * RSS-backed YouTube library for Tahir's channel. No API key, database,
 * or cron: data is fetched on demand and cached for an hour.
 */

import type { Metadata } from "next"

import {
  TahirHero,
  TahirSection,
  TahirShare,
  TahirYouTubeSection,
  TahirCtaStrip,
} from "../../_surface"
import { brands } from "@/lib/brand"
import { getCachedYouTubeItems } from "@/lib/shared/youtube-channel"
import type { YouTubeFeedItem } from "@/lib/shared/youtube-feed"

export const revalidate = 3600

export const metadata: Metadata = {
  title: "Videos",
  description:
    "Watch Tahir Majithia's latest Dubai property videos, Shorts, market explainers, and investor guidance.",
}

async function getInitialVideos(limitPerType = 12): Promise<YouTubeFeedItem[]> {
  const youtube = brands.tahir.youtube
  if (!youtube) return []

  return getCachedYouTubeItems({
    channel: youtube,
    limit: limitPerType * 2,
    limitPerType,
    cacheKey: "page",
  })
}

export default async function TahirVideosPage() {
  const initialItems = await getInitialVideos()

  return (
    <>
      <TahirHero
        tone="photographic"
        backgroundImage="/images/hero/home-hero.jpg"
        backgroundAlt="Dubai skyline at sunset"
        backgroundPosition="center 42%"
        eyebrow="Videos"
        headline={
          <>
            Watch Tahir&rsquo;s <em>market thinking</em>.
          </>
        }
        lead="A live library of Dubai property explainers, investor Q&A, project commentary, and short market observations from Tahir's YouTube channel."
        primaryCta={{ label: "Subscribe on YouTube", href: brands.tahir.social.youtube || "#", external: true }}
        secondaryCta={{ label: "Book a 30-minute call", href: "/consultation" }}
        sidecar={
          <div className="tahir-proof-panel">
            <p className="tahir-eyebrow">Channel feed</p>
            <h2 className="tahir-h3">Videos and Shorts refresh hourly.</h2>
            <p className="tahir-body">
              The page mirrors YouTube directly, so new uploads appear without
              another content workflow.
            </p>
            <TahirShare
              title="Tahir Majithia videos"
              text="Dubai property insights, investor Q&A, and market commentary from Tahir Majithia."
              url={`https://${brands.tahir.domain}/videos`}
              label="Share channel"
            />
          </div>
        }
      />

      <TahirSection>
        <TahirYouTubeSection initialItems={initialItems} />
      </TahirSection>

      <TahirCtaStrip
        headline="Want the answer applied to your situation?"
        body="Bring a video, a property, or a question to a 30-minute call and Tahir will make it specific to your goals."
        primaryCta={{ label: "Book a 30-minute call", href: "/consultation" }}
        secondaryCta={{ label: "Share requirements", href: "/property-requirements" }}
      />
    </>
  )
}
