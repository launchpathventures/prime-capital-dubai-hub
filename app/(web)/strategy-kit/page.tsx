/**
 * CATALYST - Strategy Kit Page
 *
 * Lead magnet download page for Prime Capital Dubai.
 * World-class, conversion-optimized design with elegant visual hierarchy.
 * 
 * Design principles:
 * - "Quiet luxury" aesthetic matching brand guidelines
 * - Trust-building social proof and credibility markers
 * - Clear value proposition with scannable benefits
 * - Minimal friction form placement
 */

import { Container, Stack, Grid, Text, Title } from "@/components/core"
import { LeadForm } from "@/components/shared/lead-form"
import { 
  CheckIcon, 
  FileTextIcon, 
  TrendingUpIcon, 
  MapPinIcon,
  ShieldCheckIcon,
  UsersIcon,
  BarChart3Icon,
  BuildingIcon,
  GlobeIcon,
  SparklesIcon,
} from "lucide-react"

// Strategy Kit download URL
const STRATEGY_KIT_URL = "https://gamma.app/docs/The-Prime-Capital-2026-Investor-Strategy-Kit-nra1olekeesasny"

export const metadata = {
  title: "Dubai Investment Strategy Kit | Prime Capital Dubai",
  description: "Download our comprehensive 48-page guide to Dubai real estate investment. Area-by-area analysis, rental yields, Golden Visa guide, and more.",
}

export default function StrategyKitPage() {
  return (
    <div className="web-strategy-kit">
      {/* Hero Section with Form */}
      <HeroSection />
      
      {/* Social Proof Bar */}
      <SocialProofBar />
      
      {/* What's Inside Preview */}
      <WhatsInsideSection />
      
      {/* Key Insights */}
      <KeyInsightsSection />
      
      {/* Who This Is For */}
      <WhoThisIsForSection />
      
      {/* Final CTA */}
      <FinalCTASection />
    </div>
  )
}

// =============================================================================
// HERO SECTION
// Full-impact hero with side-by-side content and form
// =============================================================================

function HeroSection() {
  const benefits = [
    { icon: TrendingUpIcon, text: "5-year market projections with data-backed forecasts" },
    { icon: MapPinIcon, text: "Area-by-area investment ratings and analysis" },
    { icon: BarChart3Icon, text: "Rental yield comparison by property type" },
    { icon: ShieldCheckIcon, text: "Golden Visa qualification pathways" },
    { icon: FileTextIcon, text: "Due diligence checklist for remote investors" },
  ]

  return (
    <section className="strategy-kit-hero bg-[var(--web-spruce)] relative overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/10 pointer-events-none" />
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--web-serenity)]/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[var(--web-ash)]/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />
      
      <Container size="xl" className="relative z-10">
        <div className="py-24 lg:py-32">
          <Grid cols={1} className="lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-16 xl:gap-24 items-start">
            {/* Left Column - Content */}
            <div className="lg:py-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full mb-6">
                <SparklesIcon className="h-3.5 w-3.5 text-[var(--web-serenity)]" />
                <span className="text-[var(--web-off-white)] text-[11px] font-normal uppercase tracking-[0.15em]">
                  Free Resource — 48 Pages
                </span>
              </div>
              
              {/* Headline */}
              <Title
                as="h1"
                className="font-headline text-[var(--web-off-white)] text-[clamp(36px,5vw,56px)] font-normal leading-[1.1] tracking-tight mb-6"
              >
                The Dubai 2026
                <br />
                <span className="text-[var(--web-serenity)]">Investor Strategy Kit</span>
              </Title>
              
              {/* Subheadline */}
              <Text className="text-white/80 text-[17px] lg:text-[19px] font-light leading-relaxed mb-10 max-w-[520px]">
                Institutional-grade market research, distilled into actionable insights 
                for sophisticated investors. No sales pitch — just data.
              </Text>

              {/* Benefits list */}
              <Stack gap="md" className="mb-8">
                {benefits.map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-8 h-8 bg-white/10 rounded-full shrink-0 mt-0.5">
                      <Icon className="h-4 w-4 text-[var(--web-serenity)]" />
                    </div>
                    <Text className="text-white/75 text-[15px] font-light leading-relaxed">
                      {text}
                    </Text>
                  </div>
                ))}
              </Stack>
              
              {/* Trust indicators */}
              <div className="flex items-center gap-6 pt-4 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <UsersIcon className="h-4 w-4 text-[var(--web-serenity)]/70" />
                  <span className="text-white/60 text-[13px] font-light">
                    Downloaded by 500+ investors
                  </span>
                </div>
                <div className="hidden sm:flex items-center gap-2">
                  <GlobeIcon className="h-4 w-4 text-[var(--web-serenity)]/70" />
                  <span className="text-white/60 text-[13px] font-light">
                    Updated January 2026
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column - Form Card */}
            <div id="download-form" className="lg:sticky lg:top-28">
              <div className="strategy-kit-form-card bg-white rounded-sm shadow-2xl overflow-hidden">
                {/* Form header */}
                <div className="bg-[var(--web-ash)] px-8 py-6">
                  <Title
                    as="h2"
                    className="font-headline text-[var(--web-off-white)] text-xl font-normal mb-1"
                  >
                    Get Your Free Copy
                  </Title>
                  <Text className="text-white/70 text-[14px] font-light">
                    Instant access • No spam • Unsubscribe anytime
                  </Text>
                </div>
                
                {/* Form body */}
                <div className="px-8 py-8">
                  <LeadForm 
                    mode="download" 
                    theme="light" 
                    downloadAsset="Dubai Investment Strategy Kit"
                    redirectUrl={STRATEGY_KIT_URL}
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
// SOCIAL PROOF BAR
// Quick credibility markers
// =============================================================================

function SocialProofBar() {
  const stats = [
    { value: "48", label: "Pages of Analysis" },
    { value: "12", label: "Areas Covered" },
    { value: "5yr", label: "Forecast Horizon" },
    { value: "500+", label: "Downloads" },
  ]

  return (
    <section className="bg-[var(--web-off-white)] border-b border-[var(--web-serenity)]/20">
      <Container size="xl">
        <div className="py-8 lg:py-10">
          <div className="flex flex-wrap justify-center gap-8 lg:gap-16">
            {stats.map((stat) => (
              <div 
                key={stat.label} 
                className="text-center px-4"
              >
                <div className="text-[var(--web-ash)] text-[clamp(28px,4vw,40px)] font-headline font-normal tracking-tight">
                  {stat.value}
                </div>
                <div className="text-[var(--web-spruce)] text-[11px] font-normal uppercase tracking-[0.15em] mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}

// =============================================================================
// WHAT'S INSIDE SECTION
// Visual preview of chapters
// =============================================================================

function WhatsInsideSection() {
  const chapters = [
    { 
      number: "01", 
      title: "Executive Summary", 
      description: "Dubai 2026 outlook and key market drivers",
      icon: TrendingUpIcon,
    },
    { 
      number: "02", 
      title: "Market Analysis", 
      description: "Price trends, supply data, and 5-year forecasts",
      icon: BarChart3Icon,
    },
    { 
      number: "03", 
      title: "Area Guide", 
      description: "Investment ratings for 12 prime locations",
      icon: MapPinIcon,
    },
    { 
      number: "04", 
      title: "Property Types", 
      description: "ROI comparison: apartments, villas, penthouses",
      icon: BuildingIcon,
    },
    { 
      number: "05", 
      title: "Golden Visa", 
      description: "Complete qualification guide and process",
      icon: ShieldCheckIcon,
    },
    { 
      number: "06", 
      title: "Due Diligence", 
      description: "Remote investor checklist and red flags",
      icon: FileTextIcon,
    },
  ]

  return (
    <section className="bg-white py-[var(--web-section-gap)]">
      <Container size="lg">
        <Stack gap="xl" align="center" className="text-center mb-14">
          <span className="text-[var(--web-spruce)] text-[11px] font-normal uppercase tracking-[0.2em]">
            What's Inside
          </span>
          <Title
            as="h2"
            className="font-headline text-[var(--web-ash)] text-[clamp(28px,4vw,40px)] font-normal leading-[1.25]"
          >
            Six chapters of actionable intelligence
          </Title>
          <Text className="text-[var(--web-spruce)] text-[15px] font-light leading-relaxed max-w-[560px]">
            Each chapter is designed to answer the specific questions sophisticated 
            investors ask before committing capital to Dubai real estate.
          </Text>
        </Stack>

        <Grid cols={1} className="sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {chapters.map((chapter) => {
            const Icon = chapter.icon
            return (
              <div
                key={chapter.number}
                className="group p-6 bg-[var(--web-off-white)]/50 hover:bg-[var(--web-off-white)] border border-[var(--web-serenity)]/10 hover:border-[var(--web-serenity)]/30 rounded-sm transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-[var(--web-spruce)]/10 rounded-full shrink-0 group-hover:bg-[var(--web-spruce)]/15 transition-colors">
                    <Icon className="h-5 w-5 text-[var(--web-spruce)]" />
                  </div>
                  <div>
                    <span className="text-[var(--web-serenity)] text-[11px] font-normal uppercase tracking-[0.15em]">
                      Chapter {chapter.number}
                    </span>
                    <h3 className="font-headline text-[var(--web-ash)] text-[17px] font-normal mt-1 mb-2">
                      {chapter.title}
                    </h3>
                    <p className="text-[var(--web-spruce)] text-[14px] font-light leading-relaxed">
                      {chapter.description}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </Grid>
      </Container>
    </section>
  )
}

// =============================================================================
// KEY INSIGHTS SECTION
// Highlight the unique value
// =============================================================================

function KeyInsightsSection() {
  return (
    <section className="bg-[var(--web-ash)] py-[var(--web-section-gap)] overflow-hidden relative">
      {/* Decorative element */}
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-[var(--web-spruce)]/20 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2" />
      
      <Container size="xl" className="relative z-10">
        <Grid cols={1} className="lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Column - Content */}
          <div>
            <span className="block text-[var(--web-serenity)] text-[11px] font-normal uppercase tracking-[0.2em] mb-4">
              Why This Matters
            </span>
            <Title
              as="h2"
              className="font-headline text-[var(--web-off-white)] text-[clamp(28px,3.5vw,40px)] font-normal leading-[1.2] mb-6"
            >
              Dubai real estate is full of noise.
              <span className="text-[var(--web-serenity)]"> This cuts through it.</span>
            </Title>
            
            <Stack gap="md">
              <Text className="text-white/70 text-[15px] font-light leading-[1.8]">
                Most market reports are written by developers or agents with inventory 
                to sell. This guide was written for sophisticated investors who need 
                objective analysis, not sales pitches.
              </Text>
              
              <Text className="text-white/70 text-[15px] font-light leading-[1.8]">
                We have compiled data from multiple sources, cross-referenced claims, 
                and added our own insights from years of advising international HNW 
                clients on Dubai investments.
              </Text>
            </Stack>

            {/* Insight callout */}
            <div className="mt-8 p-6 bg-[var(--web-spruce)]/30 border-l-2 border-[var(--web-serenity)] rounded-r-sm">
              <Text className="text-white/90 text-[15px] font-light leading-relaxed italic">
                "The difference between a good investment and a regret often comes 
                down to understanding what others miss."
              </Text>
            </div>
          </div>

          {/* Right Column - Visual/Stats */}
          <div className="lg:pl-8">
            <div className="bg-[var(--web-spruce)] rounded-sm p-8 lg:p-10 shadow-xl">
              <Title
                as="h3"
                className="font-headline text-[var(--web-off-white)] text-lg font-normal mb-6"
              >
                This guide is for you if:
              </Title>
              
              <Stack gap="sm">
                {[
                  "You are considering your first Dubai property investment",
                  "You want to diversify internationally with real estate",
                  "You are interested in UAE residency through property",
                  "You need data to present to family office or advisors",
                  "You want a clear framework for evaluating opportunities",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-5 h-5 bg-[var(--web-serenity)]/20 rounded-full shrink-0 mt-0.5">
                      <CheckIcon className="h-3 w-3 text-[var(--web-serenity)]" />
                    </div>
                    <Text className="text-white/80 text-[14px] font-light leading-relaxed">
                      {item}
                    </Text>
                  </div>
                ))}
              </Stack>
            </div>
          </div>
        </Grid>
      </Container>
    </section>
  )
}

// =============================================================================
// WHO THIS IS FOR SECTION
// Target audience clarity
// =============================================================================

function WhoThisIsForSection() {
  const personas = [
    {
      title: "International Investors",
      description: "Looking to diversify into Dubai's tax-free environment with data-backed confidence.",
      icon: GlobeIcon,
    },
    {
      title: "Family Offices",
      description: "Need institutional-grade research to evaluate Dubai real estate allocations.",
      icon: UsersIcon,
    },
    {
      title: "First-Time Buyers",
      description: "Want to understand the market before making a significant commitment.",
      icon: BuildingIcon,
    },
  ]

  return (
    <section className="bg-[var(--web-off-white)] py-[var(--web-section-gap)]">
      <Container size="lg">
        <Stack gap="xl" align="center" className="text-center mb-14">
          <span className="text-[var(--web-spruce)] text-[11px] font-normal uppercase tracking-[0.2em]">
            Who This Is For
          </span>
          <Title
            as="h2"
            className="font-headline text-[var(--web-ash)] text-[clamp(28px,4vw,40px)] font-normal leading-[1.25]"
          >
            Built for serious investors
          </Title>
        </Stack>

        <Grid cols={1} className="md:grid-cols-3 gap-8">
          {personas.map((persona) => {
            const Icon = persona.icon
            return (
              <div
                key={persona.title}
                className="text-center p-8 bg-white border border-[var(--web-serenity)]/10 rounded-sm card-lift"
              >
                <div className="flex items-center justify-center w-14 h-14 bg-[var(--web-spruce)]/10 rounded-full mx-auto mb-5">
                  <Icon className="h-6 w-6 text-[var(--web-spruce)]" />
                </div>
                <h3 className="font-headline text-[var(--web-ash)] text-[18px] font-normal mb-3">
                  {persona.title}
                </h3>
                <p className="text-[var(--web-spruce)] text-[14px] font-light leading-relaxed">
                  {persona.description}
                </p>
              </div>
            )
          })}
        </Grid>
      </Container>
    </section>
  )
}

// =============================================================================
// FINAL CTA SECTION
// Strong closing with download button
// =============================================================================

function FinalCTASection() {
  return (
    <section className="bg-[var(--web-spruce)] py-[var(--web-section-gap)] relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-1/4 w-[300px] h-[300px] bg-[var(--web-serenity)]/10 rounded-full blur-[80px]" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[var(--web-ash)]/20 rounded-full blur-[100px]" />
      
      <Container size="md" className="relative z-10">
        <Stack gap="lg" align="center" className="text-center">
          <span className="text-[var(--web-serenity)] text-[11px] font-normal uppercase tracking-[0.2em]">
            Ready to Start?
          </span>
          
          <Title
            as="h2"
            className="font-headline text-[var(--web-off-white)] text-[clamp(28px,4vw,44px)] font-normal leading-[1.2]"
          >
            Get your Strategy Kit today
          </Title>

          <Text className="text-white/70 text-[15px] font-light leading-relaxed max-w-[480px]">
            Join over 500 investors who have used this guide to make informed 
            decisions about Dubai real estate.
          </Text>

          <a
            href="#download-form"
            className="btn-hover-lift mt-6 h-14 px-12 bg-[var(--web-off-white)] text-[var(--web-ash)] hover:bg-white rounded-[2px] text-[11px] font-normal uppercase tracking-[0.2em] inline-flex items-center justify-center shadow-lg transition-colors"
          >
            Download Free Guide
          </a>

          <Text className="text-white/50 text-[12px] font-light mt-4">
            No credit card required • Instant access • Free forever
          </Text>
        </Stack>
      </Container>
    </section>
  )
}
