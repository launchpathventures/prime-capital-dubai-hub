/**
 * CATALYST - Strategy Kit Page
 *
 * Lead magnet download page for Prime Capital Dubai.
 * Matches design: hero with inline form, table of contents, "Why this matters" section, CTA
 */

import { Container, Stack, Grid, Text, Title } from "@/components/core"
import { CheckIcon, DownloadIcon } from "lucide-react"

export const metadata = {
  title: "Dubai Investment Strategy Kit | Prime Capital Dubai",
  description: "Download our comprehensive guide to Dubai real estate investment.",
}

export default function StrategyKitPage() {
  return (
    <div className="web-strategy-kit">
      {/* Hero Section with Form */}
      <HeroSection />
      
      {/* Table of Contents */}
      <TableOfContentsSection />
      
      {/* Why This Matters */}
      <WhyThisMattersSection />
      
      {/* CTA Section */}
      <CTASection />
    </div>
  )
}

// =============================================================================
// HERO SECTION
// Dark background with content and inline form
// =============================================================================

function HeroSection() {
  const benefits = [
    "Current market analysis with 5-year projections",
    "Area-by-area investment ratings",
    "Rental yield comparison by property type",
    "Golden Visa qualification guide",
    "Due diligence checklist for remote investors",
  ]

  return (
    <section className="bg-[var(--web-spruce)] py-[var(--web-section-gap)]">
      <Container size="xl">
        <Grid cols={1} className="lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left Column - Content */}
          <div>
            <span className="block text-[var(--web-serenity)] text-[11px] font-normal uppercase tracking-[0.2em] mb-4">
              Free Resource
            </span>
            <Title
              as="h1"
              className="font-headline text-[var(--web-off-white)] text-[clamp(32px,4vw,44px)] font-normal leading-[1.2] mb-6"
            >
              Dubai 2026 Investment Strategy Kit
            </Title>
            
            <Text className="text-white/80 text-[15px] font-light leading-relaxed mb-8">
              A comprehensive 48-page analysis of Dubai's real estate market, including area-by-area
              breakdowns, price trend analysis, rental yield data, and our proprietary investment
              framework.
            </Text>

            <Stack gap="sm">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-start gap-3">
                  <CheckIcon className="h-4 w-4 text-[var(--web-serenity)] shrink-0 mt-1" />
                  <Text className="text-white/70 text-[14px] font-light">
                    {benefit}
                  </Text>
                </div>
              ))}
            </Stack>
          </div>

          {/* Right Column - Form */}
          <div id="download-form" className="bg-white rounded-[2px] p-8 shadow-xl">
            <div className="text-center mb-6">
              <Title
                as="h2"
                className="font-headline text-[var(--web-ash)] text-xl font-normal mb-2"
              >
                Get Your Free Copy
              </Title>
              <Text className="text-[var(--web-spruce)] text-[13px] font-light">
                48 pages of institutional-grade research
              </Text>
            </div>

            <form className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Your name"
                  className="w-full px-4 py-3 border border-[var(--web-serenity)]/40 rounded-[2px] text-[14px] text-[var(--web-ash)] placeholder:text-[var(--web-spruce)]/50 focus:outline-none focus:border-[var(--web-spruce)] transition-colors"
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full px-4 py-3 border border-[var(--web-serenity)]/40 rounded-[2px] text-[14px] text-[var(--web-ash)] placeholder:text-[var(--web-spruce)]/50 focus:outline-none focus:border-[var(--web-spruce)] transition-colors"
                />
              </div>
              <button
                type="submit"
                className="w-full h-12 bg-[var(--web-spruce)] text-[var(--web-off-white)] hover:bg-[var(--web-ash)] rounded-[2px] text-[11px] font-normal uppercase tracking-[0.2em] transition-colors flex items-center justify-center gap-2"
              >
                <DownloadIcon className="h-4 w-4" />
                Download Strategy Kit
              </button>
            </form>

            <Text className="text-[var(--web-spruce)] text-[11px] font-light text-center mt-4">
              No spam. Unsubscribe anytime.
            </Text>
          </div>
        </Grid>
      </Container>
    </section>
  )
}

// =============================================================================
// TABLE OF CONTENTS SECTION
// White background with numbered list
// =============================================================================

function TableOfContentsSection() {
  const chapters = [
    { number: "01", title: "Executive Summary: Dubai 2026 Outlook" },
    { number: "02", title: "Market Analysis: Price Trends & Forecasts" },
    { number: "03", title: "Area Guide: Investment Ratings by Location" },
    { number: "04", title: "Property Types: ROI Comparison Analysis" },
    { number: "05", title: "Golden Visa: Complete Qualification Guide" },
    { number: "06", title: "Due Diligence: Remote Investor Checklist" },
    { number: "07", title: "Case Studies: Recent Client Acquisitions" },
    { number: "08", title: "Appendix: Developer Profiles & Ratings" },
  ]

  return (
    <section className="bg-[var(--web-off-white)] py-[var(--web-section-gap)]">
      <Container size="md">
        <Stack gap="xl" align="center" className="text-center mb-12">
          <span className="text-[var(--web-spruce)] text-[11px] font-normal uppercase tracking-[0.2em]">
            What's Inside
          </span>
          <Title
            as="h2"
            className="font-headline text-[var(--web-ash)] text-[clamp(28px,4vw,40px)] font-normal leading-[1.3]"
          >
            Table of Contents
          </Title>
        </Stack>

        <Stack gap="none">
          {chapters.map((chapter, index) => (
            <div
              key={chapter.number}
              className={`flex items-center gap-6 py-4 ${
                index < chapters.length - 1 ? "border-b border-[var(--web-serenity)]/20" : ""
              }`}
            >
              <span className="text-[var(--web-spruce)]/40 text-[13px] font-light w-8">
                {chapter.number}
              </span>
              <span className="text-[var(--web-ash)] text-[15px] font-light">
                {chapter.title}
              </span>
            </div>
          ))}
        </Stack>
      </Container>
    </section>
  )
}

// =============================================================================
// WHY THIS MATTERS SECTION
// Dark background with two columns
// =============================================================================

function WhyThisMattersSection() {
  const forYouIf = [
    "You're considering your first Dubai property investment",
    "You want to diversify internationally with real estate",
    "You're interested in UAE residency through property",
    "You need data to present to family office or advisors",
    "You want a clear framework for evaluating opportunities",
  ]

  return (
    <section className="bg-[var(--web-ash)] py-[var(--web-section-gap)]">
      <Container size="xl">
        <Grid cols={1} className="lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left Column - Why This Matters */}
          <div>
            <span className="block text-[var(--web-serenity)] text-[11px] font-normal uppercase tracking-[0.2em] mb-4">
              Why This Matters
            </span>
            <Title
              as="h2"
              className="font-headline text-[var(--web-off-white)] text-[clamp(28px,3.5vw,36px)] font-normal leading-[1.25] mb-6"
            >
              Dubai real estate is full of noise.
              <br />
              This cuts through it.
            </Title>
            
            <Stack gap="md">
              <Text className="text-white/70 text-[15px] font-light leading-relaxed">
                Most market reports are written by developers or agents with inventory to sell. This
                guide was written for sophisticated investors who need objective analysis, not sales
                pitches.
              </Text>
              
              <Text className="text-white/70 text-[15px] font-light leading-relaxed">
                We've compiled data from multiple sources, cross-referenced claims, and added our
                own insights from years of advising international HNW clients on Dubai investments.
              </Text>
            </Stack>
          </div>

          {/* Right Column - This Guide is For You If */}
          <div className="bg-[var(--web-spruce)] rounded-[2px] p-8">
            <Title
              as="h3"
              className="font-headline text-[var(--web-off-white)] text-lg font-normal mb-6"
            >
              This guide is for you if:
            </Title>
            
            <Stack gap="sm">
              {forYouIf.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckIcon className="h-4 w-4 text-[var(--web-serenity)] shrink-0 mt-1" />
                  <Text className="text-white/80 text-[14px] font-light">
                    {item}
                  </Text>
                </div>
              ))}
            </Stack>
          </div>
        </Grid>
      </Container>
    </section>
  )
}

// =============================================================================
// CTA SECTION
// Light background with centered download button
// =============================================================================

function CTASection() {
  return (
    <section className="bg-[var(--web-off-white)] py-[var(--web-section-gap)]">
      <Container size="md">
        <Stack gap="lg" align="center" className="text-center">
          <Title
            as="h2"
            className="font-headline text-[var(--web-ash)] text-[clamp(28px,4vw,40px)] font-normal leading-[1.3]"
          >
            Get your copy today
          </Title>

          <Text className="text-[var(--web-spruce)] text-[15px] font-light leading-relaxed max-w-[480px]">
            Join over 500 investors who've used this guide to inform their Dubai
            investment decisions.
          </Text>

          <a
            href="#download-form"
            className="btn-hover-lift mt-4 h-14 px-12 bg-[var(--web-spruce)] text-[var(--web-off-white)] hover:bg-[var(--web-ash)] rounded-[2px] text-[11px] font-normal uppercase tracking-[0.2em] inline-flex items-center justify-center"
          >
            <DownloadIcon className="mr-2 h-4 w-4" />
            Download Free Guide
          </a>
        </Stack>
      </Container>
    </section>
  )
}
