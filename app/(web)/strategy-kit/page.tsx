/**
 * CATALYST - Strategy Kit Page
 *
 * Lead magnet download page for Prime Capital Dubai.
 * Conversion-optimized design with "quiet luxury" aesthetic.
 *
 * Design principles:
 * - Parallax image hero matching site-wide pattern
 * - Three strategies as the centrepiece visual
 * - Clean vertical rhythm with architectural section transitions
 * - Subtle scroll-reveal animations throughout
 */

import Image from "next/image"
import { Container, Stack, Grid, Text, Title } from "@/components/core"
import { LeadForm } from "@/components/shared/lead-form"
import { config } from "@/lib/config"
import {
  CheckIcon,
  ArrowRightIcon,
  TrendingUpIcon,
  MapPinIcon,
  ShieldCheckIcon,
  BarChart3Icon,
  FileTextIcon,
  GlobeIcon,
  BuildingIcon,
  CircleDollarSignIcon,
  LandmarkIcon,
} from "lucide-react"

export const metadata = {
  title: "Dubai Investment Strategy Kit | Prime Capital Dubai",
  description:
    "Download our comprehensive guide to Dubai real estate investment. Three proven strategies, area-by-area analysis, rental yields, Golden Visa guide, and full cost transparency.",
  alternates: {
    canonical: "/strategy-kit",
  },
}

export default function StrategyKitPage() {
  return (
    <div className="web-strategy-kit">
      <HeroSection />
      <StrategiesSection />
      <InsideSection />
      <TransparencySection />
      <FinalCTASection />
    </div>
  )
}

// =============================================================================
// HERO SECTION
// Full-bleed image hero with side-by-side content + form card.
// Matches the site-wide parallax hero pattern.
// =============================================================================

function HeroSection() {
  return (
    <section className="sk-hero relative overflow-hidden min-h-[90vh] flex items-center">
      {/* Background image */}
      <Image
        src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2500&auto=format&fit=crop"
        alt=""
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />

      {/* Gradient overlay — warm, luxurious, not pure black */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, rgba(63,65,66,0.88) 0%, rgba(87,108,117,0.82) 40%, rgba(63,65,66,0.9) 100%)",
        }}
      />

      <Container size="xl" className="relative z-10 w-full">
        <div className="py-32 lg:py-40">
          <Grid
            cols={1}
            className="lg:grid-cols-[1.15fr_1fr] gap-12 lg:gap-16 xl:gap-24 items-start"
          >
            {/* Left Column — Content */}
            <div className="sk-hero-content">
              {/* Eyebrow */}
              <span
                className="block text-[var(--web-serenity)] text-[11px] font-normal uppercase tracking-[0.2em] mb-5"
                style={{ textShadow: "0 2px 20px rgba(0,0,0,0.3)" }}
              >
                Free Investor Resource
              </span>

              {/* Headline */}
              <h1
                className="font-headline text-[var(--web-off-white)] text-[clamp(36px,5.5vw,56px)] font-normal leading-[1.1] tracking-tight mb-6"
                style={{ textShadow: "0 4px 30px rgba(0,0,0,0.4)" }}
              >
                The 2026 Investor
                <br />
                Strategy Kit
              </h1>

              {/* Subtitle */}
              <p
                className="text-white/80 text-[clamp(16px,2vw,19px)] font-light leading-relaxed mb-10 max-w-[500px]"
                style={{ textShadow: "0 2px 20px rgba(0,0,0,0.3)" }}
              >
                Three proven strategies, four market zones, and the exact 
                process to invest in Dubai real estate — remotely, with full 
                cost transparency.
              </p>

              {/* Compact benefit list */}
              <div className="space-y-3 mb-10">
                {[
                  "Income, growth, and legacy strategies compared",
                  "Area-by-area market zone ratings",
                  "Off-plan leverage and branded residence data",
                  "Golden Visa pathways and full fee breakdown",
                  "5-step remote buying process",
                ].map((benefit) => (
                  <div key={benefit} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-[var(--web-serenity)]/20 flex items-center justify-center shrink-0">
                      <CheckIcon className="h-3 w-3 text-[var(--web-serenity)]" />
                    </div>
                    <span className="text-white/70 text-[14px] font-light">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>

              {/* Trust line */}
              <div className="flex items-center gap-4 pt-5 border-t border-white/10">
                <span className="text-white/40 text-[12px] font-light tracking-wide">
                  Trusted by international investors · Updated February 2026
                </span>
              </div>
            </div>

            {/* Right Column — Form Card */}
            <div id="download-form" className="lg:sticky lg:top-28 sk-hero-form">
              <div className="bg-white rounded-[2px] shadow-2xl overflow-hidden">
                {/* Form header — refined */}
                <div className="px-8 pt-8 pb-0">
                  <Title
                    as="h2"
                    className="font-headline text-[var(--web-ash)] text-[22px] font-normal mb-1"
                  >
                    Get Your Free Copy
                  </Title>
                  <Text className="text-[var(--web-spruce)] text-[13px] font-light mb-6">
                    Instant access · No spam · Unsubscribe anytime
                  </Text>
                  <div className="h-px bg-[var(--web-serenity)]/20" />
                </div>

                {/* Form body */}
                <div className="px-8 py-6">
                  <LeadForm
                    mode="download"
                    theme="light"
                    downloadAsset="Dubai Investment Strategy Kit"
                    redirectUrl={config.links.strategyKit}
                    redirectDelay={3000}
                  />
                </div>
              </div>
            </div>
          </Grid>
        </div>
      </Container>
    </section>
  )
}

// =============================================================================
// STRATEGIES SECTION
// The centrepiece — three investment tracks from the guide.
// This is the USP that makes the kit worth downloading.
// =============================================================================

function StrategiesSection() {
  const strategies = [
    {
      number: "01",
      title: "The Income Generator",
      subtitle: "Monthly Cash Flow",
      description:
        "Ready properties in Business Bay, Marina, and JVC. Buy a 1-2 bedroom apartment, start earning tax-free rental income immediately.",
      stats: [
        { label: "Target Yield", value: "7.5%" },
        { label: "Entry From", value: "AED 1.5M" },
      ],
      icon: CircleDollarSignIcon,
    },
    {
      number: "02",
      title: "The Capital Multiplier",
      subtitle: "3-5 Year Growth",
      description:
        "Off-plan villas and waterfront apartments in Dubai South and Palm Jebel Ali. Buy at launch price, sell at handover for outsized returns.",
      stats: [
        { label: "Target ROI", value: "50%+" },
        { label: "Hold Period", value: "3-5 Years" },
      ],
      icon: TrendingUpIcon,
    },
    {
      number: "03",
      title: "The Legacy Builder",
      subtitle: "Design & Build",
      description:
        "Custom-built trophy homes at cost. We buy the land, hire the architect, and build it — creating instant equity of 30%+ from day one.",
      stats: [
        { label: "Instant Equity", value: "30%+" },
        { label: "Market Value", value: "AED 25M+" },
      ],
      icon: LandmarkIcon,
    },
  ]

  return (
    <section className="bg-[var(--web-off-white)] py-[var(--web-section-gap)]">
      <Container size="lg">
        {/* Section header */}
        <Stack gap="md" align="center" className="text-center mb-14 sk-reveal">
          <span className="text-[var(--web-spruce)] text-[11px] font-normal uppercase tracking-[0.2em]">
            Three Strategies Inside
          </span>
          <Title
            as="h2"
            align="center"
            className="font-headline text-[var(--web-ash)] text-[clamp(28px,4vw,40px)] font-normal leading-[1.25]"
          >
            Choose your investment track
          </Title>
          <Text className="text-[var(--web-spruce)] text-[15px] font-light leading-relaxed max-w-[520px]">
            The strategy kit breaks down three distinct approaches to Dubai real 
            estate — each matched to a different investor goal.
          </Text>
        </Stack>

        {/* Strategy cards */}
        <div className="space-y-6 sk-reveal-stagger">
          {strategies.map((strategy) => {
            const Icon = strategy.icon
            return (
              <div
                key={strategy.number}
                className="sk-strategy-card group"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-0">
                  {/* Left — Number + Icon */}
                  <div className="md:w-[100px] shrink-0 flex md:flex-col items-center md:items-start gap-3 md:gap-2">
                    <span className="font-headline text-[var(--web-serenity)]/60 text-[clamp(28px,3vw,36px)] font-normal leading-none">
                      {strategy.number}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-[var(--web-spruce)]/7 flex items-center justify-center group-hover:bg-[var(--web-spruce)]/12 transition-colors">
                      <Icon className="h-4 w-4 text-[var(--web-spruce)]" />
                    </div>
                  </div>

                  {/* Middle — Content */}
                  <div className="flex-1 md:px-8 md:border-l border-[var(--web-serenity)]/12">
                    <div className="text-[var(--web-serenity)] text-[11px] font-normal uppercase tracking-[0.15em] mb-1">
                      {strategy.subtitle}
                    </div>
                    <h3 className="font-headline text-[var(--web-ash)] text-[clamp(19px,2.5vw,24px)] font-normal mb-2.5 leading-tight">
                      {strategy.title}
                    </h3>
                    <p className="text-[var(--web-spruce)] text-[14px] font-light leading-[1.75] max-w-[480px]">
                      {strategy.description}
                    </p>
                  </div>

                  {/* Right — Stats */}
                  <div className="flex md:flex-col gap-6 md:gap-5 md:w-[160px] shrink-0 md:pl-8 md:border-l border-[var(--web-serenity)]/12 md:justify-center">
                    {strategy.stats.map((stat) => (
                      <div key={stat.label}>
                        <div className="font-headline text-[var(--web-ash)] text-[clamp(20px,2.5vw,26px)] font-normal leading-none tracking-tight">
                          {stat.value}
                        </div>
                        <div className="text-[var(--web-spruce)] text-[10px] font-normal uppercase tracking-[0.12em] mt-1.5">
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}

// =============================================================================
// INSIDE SECTION
// What else the guide covers — secondary chapters beyond the 3 strategies.
// Compact, scannable, no redundancy with the hero.
// =============================================================================

function InsideSection() {
  const topics = [
    {
      icon: ShieldCheckIcon,
      title: "Why Dubai?",
      detail: "Zero capital gains, zero income tax, zero property tax. Plus currency safety pegged to the USD.",
    },
    {
      icon: MapPinIcon,
      title: "Four Market Zones",
      detail: "Income Kings, Future Giants, Safe Harbors, and where not to invest — mapped and rated.",
    },
    {
      icon: BarChart3Icon,
      title: "Off-Plan & Branded",
      detail: "How to control a AED 2M asset with AED 800K cash. Plus why branded residences yield 8% vs 6%.",
    },
    {
      icon: FileTextIcon,
      title: "Buy Remotely in 5 Steps",
      detail: "Strategy call → reserve → sign → register → handover. 90% of our clients never visit Dubai.",
    },
    {
      icon: GlobeIcon,
      title: "Golden Visa Route",
      detail: "Invest AED 2M+ and get a 10-year residency visa for you and your entire family.",
    },
    {
      icon: BuildingIcon,
      title: "Full Cost Table",
      detail: "4% DLD tax, ~AED 4,200 admin, service charges, and zero commission on new builds. No surprises.",
    },
  ]

  return (
    <section className="bg-white py-[var(--web-section-gap)]">
      <Container size="xl">
        <Grid cols={1} className="lg:grid-cols-[1fr_1.6fr] gap-12 lg:gap-20 items-start">
          {/* Left — Sticky header */}
          <div className="lg:sticky lg:top-28 sk-reveal">
            <span className="block text-[var(--web-spruce)] text-[11px] font-normal uppercase tracking-[0.2em] mb-5">
              Also Inside
            </span>
            <Title
              as="h2"
              className="font-headline text-[var(--web-ash)] text-[clamp(26px,3.5vw,36px)] font-normal leading-[1.2] mb-4"
            >
              Everything you need
              <br />
              to invest with clarity
            </Title>
            <Text className="text-[var(--web-spruce)] text-[15px] font-light leading-[1.8] mb-8 max-w-[380px]">
              Beyond the three strategies, the kit covers the full
              landscape — from tax advantages and market zones to legal 
              protections and the exact fees you will pay.
            </Text>

            {/* CTA to scroll to form */}
            <a
              href="#download-form"
              className="btn-hover-lift inline-flex items-center gap-2 h-12 px-8 bg-[var(--web-spruce)] text-[var(--web-off-white)] hover:bg-[var(--web-ash)] rounded-[2px] text-[11px] font-normal uppercase tracking-[0.18em] transition-colors"
            >
              Download the Kit
              <ArrowRightIcon className="h-3.5 w-3.5 opacity-70" />
            </a>
          </div>

          {/* Right — Topic grid */}
          <Grid cols={1} className="sm:grid-cols-2 gap-x-8 gap-y-0 sk-reveal-stagger">
            {topics.map((topic, i) => {
              const Icon = topic.icon
              return (
                <div
                  key={topic.title}
                  className={`sk-topic-item py-7 ${i < 4 ? "border-b border-[var(--web-serenity)]/12" : ""}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-9 h-9 rounded-full bg-[var(--web-spruce)]/7 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="h-[18px] w-[18px] text-[var(--web-spruce)]" />
                    </div>
                    <div>
                      <h3 className="font-headline text-[var(--web-ash)] text-[16px] font-normal mb-1.5">
                        {topic.title}
                      </h3>
                      <p className="text-[var(--web-spruce)] text-[13px] font-light leading-[1.7]">
                        {topic.detail}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </Grid>
        </Grid>
      </Container>
    </section>
  )
}

// =============================================================================
// TRANSPARENCY SECTION
// Cost table and trust-building — matches the "no surprises" promise.
// Dark section for visual rhythm.
// =============================================================================

function TransparencySection() {
  const costs = [
    { fee: "Government Tax (DLD)", amount: "4% of price", when: "At purchase" },
    { fee: "Admin Fee", amount: "~AED 4,200", when: "At purchase" },
    { fee: "Commission (New)", amount: "0%", when: "At purchase" },
    { fee: "Commission (Resale)", amount: "2%", when: "At purchase" },
    { fee: "Service Charge", amount: "AED 15–25 / sq.ft.", when: "Annually" },
  ]

  return (
    <section
      className="py-[var(--web-section-gap)] relative overflow-hidden"
      style={{
        backgroundColor: "var(--web-ash)",
        backgroundImage: "linear-gradient(135deg, var(--web-ash) 0%, #2a2b2c 100%)",
      }}
    >
      {/* Subtle decorative element */}
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-[var(--web-spruce)]/15 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <Container size="lg" className="relative z-10">
        <Grid cols={1} className="lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left — Message */}
          <div className="sk-reveal">
            <span className="block text-[var(--web-serenity)] text-[11px] font-normal uppercase tracking-[0.2em] mb-4">
              The "No Surprises" Promise
            </span>
            <Title
              as="h2"
              className="font-headline text-[var(--web-off-white)] text-[clamp(26px,3.5vw,36px)] font-normal leading-[1.25] mb-6"
            >
              Full cost transparency.
              <br />
              <span className="text-[var(--web-serenity)]">Before you commit.</span>
            </Title>

            <Text className="text-white/70 text-[15px] font-light leading-[1.8] mb-6 max-w-[460px]">
              Most brokers hide the extra costs. The strategy kit lists every fee 
              clearly — so you can budget with confidence before committing a single dirham.
            </Text>

            {/* Golden Visa callout */}
            <div className="p-5 bg-[var(--web-spruce)]/30 border-l-2 border-[var(--web-serenity)] rounded-r-[2px]">
              <div className="text-[var(--web-serenity)] text-[11px] font-normal uppercase tracking-[0.15em] mb-2">
                Golden Visa Bonus
              </div>
              <Text className="text-white/85 text-[14px] font-light leading-relaxed">
                Invest AED 2M+ (≈$545K) and qualify for a 10-year UAE residency 
                visa for you and your family. The kit covers the full process.
              </Text>
            </div>
          </div>

          {/* Right — Cost table */}
          <div className="sk-reveal">
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-[2px] overflow-hidden">
              {/* Table header */}
              <div className="grid grid-cols-[1fr_auto_auto] gap-6 px-6 py-3.5 border-b border-white/[0.08]">
                <span className="text-[var(--web-serenity)] text-[10px] font-normal uppercase tracking-[0.15em]">
                  Fee Type
                </span>
                <span className="text-[var(--web-serenity)] text-[10px] font-normal uppercase tracking-[0.15em] text-right">
                  Amount
                </span>
                <span className="text-[var(--web-serenity)] text-[10px] font-normal uppercase tracking-[0.15em] text-right hidden sm:block">
                  When
                </span>
              </div>

              {/* Table rows */}
              {costs.map((cost, i) => (
                <div
                  key={cost.fee}
                  className={`grid grid-cols-[1fr_auto_auto] gap-6 px-6 py-4 ${i < costs.length - 1 ? "border-b border-white/[0.05]" : ""}`}
                >
                  <span className="text-white/80 text-[14px] font-light">
                    {cost.fee}
                  </span>
                  <span className="font-headline text-[var(--web-off-white)] text-[14px] font-normal text-right whitespace-nowrap">
                    {cost.amount}
                  </span>
                  <span className="text-white/50 text-[13px] font-light text-right hidden sm:block whitespace-nowrap">
                    {cost.when}
                  </span>
                </div>
              ))}
            </div>

            {/* Zero-commission note */}
            <div className="mt-4 flex items-start gap-3 px-1">
              <CheckIcon className="h-4 w-4 text-[var(--web-serenity)] shrink-0 mt-0.5" />
              <span className="text-white/50 text-[12px] font-light leading-relaxed">
                Zero commission on new-build properties. The developer pays our fee, not you.
              </span>
            </div>
          </div>
        </Grid>
      </Container>
    </section>
  )
}

// =============================================================================
// FINAL CTA SECTION
// Strong, clean close. Scroll back to the form.
// =============================================================================

function FinalCTASection() {
  return (
    <section className="bg-[var(--web-off-white)] py-[var(--web-section-gap)] relative overflow-hidden">
      {/* Decorative element */}
      <div
        className="absolute -top-[100px] -right-[100px] w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(166,181,176,0.15) 0%, transparent 70%)",
        }}
      />

      <Container size="md" className="relative z-10">
        <Stack gap="lg" align="center" className="text-center sk-reveal">
          <span className="text-[var(--web-spruce)] text-[11px] font-normal uppercase tracking-[0.2em]">
            Ready to Start?
          </span>

          <Title
            as="h2"
            className="font-headline text-[var(--web-ash)] text-[clamp(28px,4.5vw,44px)] font-normal leading-[1.2]"
          >
            Get the framework. Invest with clarity.
          </Title>

          <Text className="text-[var(--web-spruce)] text-[15px] font-light leading-relaxed max-w-[460px]">
            Three strategies, four market zones, full cost transparency, and the 
            exact process to buy remotely — in one guide.
          </Text>

          <a
            href="#download-form"
            className="btn-hover-lift mt-4 h-14 px-12 bg-[var(--web-spruce)] text-[var(--web-off-white)] hover:bg-[var(--web-ash)] rounded-[2px] text-[11px] font-normal uppercase tracking-[0.2em] shadow-lg inline-flex items-center justify-center transition-colors"
          >
            Download Free Guide
          </a>

          <Text className="text-[var(--web-serenity)] text-[12px] font-light mt-2">
            No credit card required · Instant access · Free forever
          </Text>
        </Stack>
      </Container>
    </section>
  )
}