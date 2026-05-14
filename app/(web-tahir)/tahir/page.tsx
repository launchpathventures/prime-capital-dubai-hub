/**
 * CATALYST - Tahir Home
 *
 * Internal route: /tahir
 * Visitor URL:    tahirmajithia.com/   (rewritten by proxy.ts)
 *
 * Photographic hero leads with atmosphere and one piece of social proof.
 * The "Meet Tahir" block puts a face to the practice, then services,
 * values, testimonials, and a single closing CTA.
 */

import {
  TahirHero,
  TahirMeet,
  TahirSection,
  TahirServicesGrid,
  TahirValues,
  TahirTestimonialGrid,
  TahirCtaStrip,
  TahirYouTubeSection,
} from "../_surface"
import { brands } from "@/lib/brand"
import { getCachedYouTubeItems } from "@/lib/shared/youtube-channel"
import type { YouTubeFeedItem } from "@/lib/shared/youtube-feed"
import { tahirPageMetadata } from "@/lib/tahir/metadata"
import home from "@/data/tahir/home.json"
import profile from "@/data/tahir/profile.json"
import services from "@/data/tahir/services.json"
import testimonials from "@/data/tahir/testimonials.json"

export const metadata = tahirPageMetadata({
  title: brands.tahir.meta.title,
  description: brands.tahir.meta.description,
  path: "/",
})

const featuredTestimonial = testimonials.testimonials.find(
  (t) => t.id === "nikhil-joshi"
)

async function getHomeVideos(limitPerType = 12): Promise<YouTubeFeedItem[]> {
  const youtube = brands.tahir.youtube
  if (!youtube) return []

  return getCachedYouTubeItems({
    channel: youtube,
    limit: limitPerType * 2,
    limitPerType,
    cacheKey: "home",
  })
}

export default async function TahirHomePage() {
  const initialVideos = await getHomeVideos()

  return (
    <>
      <TahirHero
        tone="photographic"
        backgroundImage="/images/hero/home-hero.jpg"
        backgroundAlt="Dubai skyline at sunset with the Burj Khalifa"
        backgroundPosition="center 35%"
        eyebrow="Invest with ease"
        headline={
          <>
            Dubai real estate, <em>made simple</em>.
          </>
        }
        lead={home.hero.subheadline}
        primaryCta={{ label: "Connect with Tahir", href: "/contact" }}
        secondaryCta={{ label: "Invest with Tahir", href: "/consultation" }}
        pullQuote={
          featuredTestimonial
            ? {
                body: featuredTestimonial.quote,
                author: featuredTestimonial.author,
                date: featuredTestimonial.date,
              }
            : undefined
        }
      />

      <TahirMeet
        eyebrow="Meet Tahir"
        headline={
          <>
            Work with a <em>trusted</em> property partner
          </>
        }
        paragraphs={[
          "Tahir offers exclusive access to Dubai's finest properties, blending deep market expertise with cutting-edge investment strategies.",
          "Whether you seek high-yield opportunities or a luxury residence, you'll get concierge-level service tailored to your goals.",
          "From your first conversation to the final handshake, Tahir provides the insight and support you need to achieve your property goals.",
        ]}
        primaryCta={{ label: "Connect with Tahir", href: "/contact" }}
        secondaryCta={{ label: "Invest with Tahir", href: "/consultation" }}
      />

      <TahirSection
        tone="elevated"
        eyebrow={home.servicesPreview.eyebrow}
        headline={home.servicesPreview.headline}
        lead={home.servicesPreview.intro}
      >
        <TahirServicesGrid services={services.advisory} columns={3} />
      </TahirSection>

      <TahirSection
        tone="dark"
        eyebrow="Why work with Tahir"
        headline={profile.philosophy.headline}
        lead={profile.philosophy.paragraphs[0]}
      >
        <TahirValues values={profile.values} />
      </TahirSection>

      <TahirSection>
        <TahirYouTubeSection initialItems={initialVideos} compact />
      </TahirSection>

      <TahirSection
        eyebrow={home.testimonialsPreview.eyebrow}
        headline={home.testimonialsPreview.headline}
      >
        <TahirTestimonialGrid testimonials={testimonials.testimonials} limit={6} />
      </TahirSection>

      <TahirCtaStrip
        headline={home.contactCta.headline}
        body={home.contactCta.body}
        primaryCta={home.contactCta.primaryCta}
        secondaryCta={home.contactCta.secondaryCta}
      />
    </>
  )
}
