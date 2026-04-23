/**
 * CATALYST - Livestream Event Landing Page
 *
 * Dynamic route powering /live/[slug]. Content is driven by
 * content/livestreams.ts — add a new entry there to ship a new event.
 *
 * Pattern mirrors the distressed and strategy-kit pages:
 * - Parallax hero + sticky lead form card
 * - Follow-up sections: topics, audience, host, logistics, FAQ, final CTA
 * - Lead form uses mode="landing" (name + email + whatsapp) with per-event leadTag
 */

import Image from "next/image"
import { notFound } from "next/navigation"
import { Container, Stack, Grid, Text, Title } from "@/components/core"
import { LeadForm } from "@/components/shared/lead-form"
import { getLivestream, getLivestreamSlugs } from "@/content/livestreams"
import type { Livestream, LivestreamTopicIcon } from "@/content/livestreams"
import { LocalTime } from "./_components/local-time"
import {
  CheckIcon,
  ArrowRightIcon,
  GlobeIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  CompassIcon,
  ShieldCheckIcon,
  BuildingIcon,
  LandmarkIcon,
  CalendarIcon,
  ClockIcon,
  PlayCircleIcon,
  HelpCircleIcon,
} from "lucide-react"

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=2500&auto=format&fit=crop"

const TOPIC_ICONS: Record<LivestreamTopicIcon, React.ComponentType<{ className?: string }>> = {
  globe: GlobeIcon,
  "trending-down": TrendingDownIcon,
  "trending-up": TrendingUpIcon,
  compass: CompassIcon,
  shield: ShieldCheckIcon,
  building: BuildingIcon,
  landmark: LandmarkIcon,
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getLivestreamSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const event = getLivestream(slug)

  if (!event) {
    return { title: "Livestream Not Found" }
  }

  const url = `/live/${event.slug}`
  const image = event.ogImage || HERO_IMAGE

  return {
    title: event.metaTitle,
    description: event.metaDescription,
    alternates: { canonical: url },
    robots: { index: false, follow: false },
    openGraph: {
      title: event.metaTitle,
      description: event.metaDescription,
      url,
      images: [{ url: image, width: 1200, height: 630, alt: event.headline }],
    },
    twitter: {
      card: "summary_large_image",
      title: event.metaTitle,
      description: event.metaDescription,
      images: [image],
    },
  }
}

export default async function LivestreamPage({ params }: PageProps) {
  const { slug } = await params
  const event = getLivestream(slug)

  if (!event) {
    notFound()
  }

  return (
    <div className="web-livestream">
      <HeroSection event={event} />
      <TopicsSection event={event} />
      <AudienceSection event={event} />
      <HostSection event={event} />
      <LogisticsSection event={event} />
      <FAQSection event={event} />
      <FinalCTASection event={event} />
    </div>
  )
}

// =============================================================================
// HERO SECTION
// Parallax hero with live-event badge, content + sticky form card.
// =============================================================================

function HeroSection({ event }: { event: Livestream }) {
  return (
    <section className="relative overflow-hidden min-h-[90vh] flex items-center">
      <Image
        src={HERO_IMAGE}
        alt=""
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, rgba(63,65,66,0.92) 0%, rgba(87,108,117,0.85) 40%, rgba(63,65,66,0.93) 100%)",
        }}
      />

      <Container size="xl" className="relative z-10 w-full">
        <div className="py-32 lg:py-40">
          <Grid
            cols={1}
            className="lg:grid-cols-[1.15fr_1fr] gap-12 lg:gap-16 xl:gap-24 items-start"
          >
            {/* Left Column — Content */}
            <div>
              {/* Live event badge */}
              <div className="inline-flex items-center gap-2 mb-3 px-3 py-1.5 rounded-full bg-[var(--web-serenity)]/15 border border-[var(--web-serenity)]/30">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--web-serenity)] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--web-serenity)]" />
                </span>
                <span
                  className="text-[var(--web-serenity)] text-[11px] font-normal uppercase tracking-[0.2em]"
                  style={{ textShadow: "0 2px 20px rgba(0,0,0,0.3)" }}
                >
                  {event.eyebrow}
                </span>
              </div>

              {/* Local time — auto-detects the visitor's timezone so they don't have to convert */}
              <div className="mb-8">
                <LocalTime
                  startsAt={event.startsAt}
                  className="text-white/70 text-[12px] font-light tracking-wide"
                />
              </div>

              <h1
                className="font-headline text-[var(--web-off-white)] text-[clamp(36px,5.5vw,56px)] font-normal leading-[1.1] tracking-tight mb-6"
                style={{ textShadow: "0 4px 30px rgba(0,0,0,0.4)" }}
              >
                {event.headline}
              </h1>

              <p
                className="text-white/80 text-[clamp(16px,2vw,19px)] font-light leading-relaxed mb-8 max-w-[540px]"
                style={{ textShadow: "0 2px 20px rgba(0,0,0,0.3)" }}
              >
                {event.subtitle}
              </p>

              {event.benefits && event.benefits.length > 0 && (
                <div className="space-y-2.5 mb-10">
                  {event.benefits.map((benefit) => (
                    <div key={benefit} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-[var(--web-serenity)]/20 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckIcon className="h-3 w-3 text-[var(--web-serenity)]" />
                      </div>
                      <span className="text-white/75 text-[14px] font-light leading-snug">
                        {benefit}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Host block — Tahir's face front-and-centre so visitors know who's running the session */}
              <div className="flex items-center gap-5 pt-6 border-t border-white/10">
                {event.host.imageUrl && (
                  <div className="relative h-24 w-24 md:h-28 md:w-28 rounded-full overflow-hidden shrink-0">
                    <Image
                      src={event.host.imageUrl}
                      alt={event.host.name}
                      fill
                      sizes="(min-width: 768px) 112px, 96px"
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="min-w-0">
                  <div
                    className="text-[var(--web-serenity)] text-[10px] font-normal uppercase tracking-[0.2em] mb-1"
                    style={{ textShadow: "0 2px 20px rgba(0,0,0,0.3)" }}
                  >
                    Hosted by
                  </div>
                  <div
                    className="font-headline text-[var(--web-off-white)] text-[clamp(20px,2.5vw,26px)] font-normal leading-tight"
                    style={{ textShadow: "0 2px 20px rgba(0,0,0,0.3)" }}
                  >
                    {event.host.name}
                  </div>
                  <div className="text-white/60 text-[12px] font-light tracking-wide mt-1">
                    {event.host.role}
                    {event.trustLine && event.trustLine.includes("RERA")
                      ? " · RERA Licensed"
                      : ""}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column — Form Card */}
            <div id="register-form" className="lg:sticky lg:top-28">
              <div className="bg-white rounded-[2px] shadow-2xl overflow-hidden">
                <div className="px-8 pt-8 pb-0">
                  <Title
                    as="h2"
                    className="font-headline text-[var(--web-ash)] text-[22px] font-normal mb-1"
                  >
                    {event.formHeadline}
                  </Title>
                  <Text className="text-[var(--web-spruce)] text-[13px] font-light mb-6">
                    {event.formSubtitle}
                  </Text>
                  <div className="h-px bg-[var(--web-serenity)]/20" />
                </div>

                <div className="px-8 py-6">
                  <LeadForm
                    mode="event"
                    theme="light"
                    tag={event.leadTag}
                    successMessage={event.successMessage}
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
// TOPICS SECTION
// Three cards covering the core topics of the session.
// =============================================================================

function TopicsSection({ event }: { event: Livestream }) {
  return (
    <section className="bg-[var(--web-off-white)] py-[var(--web-section-gap)]">
      <Container size="lg">
        <Stack gap="md" align="center" className="text-center mb-14">
          <span className="text-[var(--web-spruce)] text-[11px] font-normal uppercase tracking-[0.2em]">
            {event.topicsEyebrow}
          </span>
          <Title
            as="h2"
            align="center"
            className="font-headline text-[var(--web-ash)] text-[clamp(28px,4vw,40px)] font-normal leading-[1.25]"
          >
            {event.topicsHeadline}
          </Title>
        </Stack>

        <Grid cols={1} className="md:grid-cols-3 gap-6">
          {event.topics.map((topic) => {
            const Icon = TOPIC_ICONS[topic.icon] ?? GlobeIcon
            return (
              <div
                key={topic.title}
                className="p-8 bg-white rounded-[2px] border border-[var(--web-serenity)]/12"
              >
                <div className="w-12 h-12 rounded-full bg-[var(--web-spruce)]/7 flex items-center justify-center mb-5">
                  <Icon className="h-5 w-5 text-[var(--web-spruce)]" />
                </div>
                <h3 className="font-headline text-[var(--web-ash)] text-[18px] font-normal mb-3 leading-tight">
                  {topic.title}
                </h3>
                <p className="text-[var(--web-spruce)] text-[14px] font-light leading-[1.75]">
                  {topic.description}
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
// AUDIENCE SECTION
// "Who this is for" — qualifies the viewer and reinforces relevance.
// =============================================================================

function AudienceSection({ event }: { event: Livestream }) {
  return (
    <section className="bg-white py-[var(--web-section-gap)]">
      <Container size="md">
        <Stack gap="md" align="center" className="text-center mb-10">
          <span className="text-[var(--web-spruce)] text-[11px] font-normal uppercase tracking-[0.2em]">
            {event.audienceEyebrow}
          </span>
          <Title
            as="h2"
            align="center"
            className="font-headline text-[var(--web-ash)] text-[clamp(26px,3.5vw,36px)] font-normal leading-[1.25]"
          >
            {event.audienceHeadline}
          </Title>
        </Stack>

        <Stack gap="sm" className="max-w-[640px] mx-auto">
          {event.audience.map((item) => (
            <div
              key={item}
              className="flex items-start gap-4 py-4 border-b border-[var(--web-serenity)]/15 last:border-b-0"
            >
              <div className="w-6 h-6 rounded-full bg-[var(--web-spruce)]/10 flex items-center justify-center shrink-0 mt-0.5">
                <CheckIcon className="h-3.5 w-3.5 text-[var(--web-spruce)]" />
              </div>
              <span className="text-[var(--web-ash)] text-[15px] font-light leading-relaxed">
                {item}
              </span>
            </div>
          ))}
        </Stack>
      </Container>
    </section>
  )
}

// =============================================================================
// HOST SECTION
// Brief host credibility block. Keeps page moving — full bio is on /team.
// =============================================================================

function HostSection({ event }: { event: Livestream }) {
  const { host } = event
  const hasPhoto = !!host.imageUrl
  const hasQuote = !!host.quote

  return (
    <section className="bg-[var(--web-off-white)] py-[var(--web-section-gap)]">
      <Container size="md">
        <Stack gap="md" align="center" className="text-center mb-10">
          <span className="text-[var(--web-spruce)] text-[11px] font-normal uppercase tracking-[0.2em]">
            Your Host
          </span>
          <Title
            as="h2"
            align="center"
            className="font-headline text-[var(--web-ash)] text-[clamp(26px,3.5vw,36px)] font-normal leading-[1.25]"
          >
            Straight talk, on the ground
          </Title>
        </Stack>

        <div className="bg-white p-8 md:p-10 rounded-[2px] border border-[var(--web-serenity)]/12 max-w-[760px] mx-auto">
          {/* Quote — lead with the host's voice if provided */}
          {hasQuote && (
            <blockquote className="relative mb-8">
              <span
                aria-hidden="true"
                className="absolute -top-4 -left-1 font-headline text-[var(--web-serenity)]/40 text-[72px] leading-none select-none"
              >
                &ldquo;
              </span>
              <p className="relative pl-8 font-headline text-[var(--web-ash)] text-[clamp(18px,2.2vw,22px)] font-normal leading-[1.5] italic">
                {host.quote}
              </p>
            </blockquote>
          )}

          {/* Host identity row — photo + name + role */}
          <div className="flex items-center gap-5 pt-6 border-t border-[var(--web-serenity)]/15">
            {hasPhoto && (
              <div className="relative h-16 w-16 md:h-20 md:w-20 rounded-full overflow-hidden bg-[var(--web-off-white)] shrink-0">
                <Image
                  src={host.imageUrl!}
                  alt={host.name}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>
            )}
            <div>
              <h3 className="font-headline text-[var(--web-ash)] text-[20px] font-normal leading-tight">
                {host.name}
              </h3>
              <p className="text-[var(--web-spruce)] text-[11px] font-normal uppercase tracking-[0.15em] mt-1">
                {host.role}
              </p>
            </div>
          </div>

          <p className="text-[var(--web-spruce)] text-[15px] font-light leading-[1.8] mt-6">
            {host.bio}
          </p>

          {host.teamSlug && (
            <a
              href={`/team/${host.teamSlug}`}
              className="inline-flex items-center gap-2 mt-6 text-[var(--web-spruce)] text-[12px] font-normal uppercase tracking-[0.15em] hover:text-[var(--web-ash)] transition-colors"
            >
              Full bio
              <ArrowRightIcon className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </Container>
    </section>
  )
}

// =============================================================================
// LOGISTICS SECTION
// Compact event-details card — date, time, platform, duration.
// =============================================================================

function LogisticsSection({ event }: { event: Livestream }) {
  const details: { icon: typeof CalendarIcon; label: string; value: string; sub?: string }[] = [
    { icon: CalendarIcon, label: "Date", value: event.dateLabel },
    {
      icon: ClockIcon,
      label: "Time",
      value: event.timeLabel,
      sub: event.timeSecondary,
    },
    { icon: PlayCircleIcon, label: "Platform", value: event.platform, sub: event.durationLabel },
  ]

  return (
    <section className="bg-white py-[var(--web-section-gap)]">
      <Container size="md">
        <Stack gap="md" align="center" className="text-center mb-10">
          <span className="text-[var(--web-spruce)] text-[11px] font-normal uppercase tracking-[0.2em]">
            Event Details
          </span>
          <Title
            as="h2"
            align="center"
            className="font-headline text-[var(--web-ash)] text-[clamp(26px,3.5vw,36px)] font-normal leading-[1.25]"
          >
            Save the date
          </Title>
        </Stack>

        <Grid cols={1} className="md:grid-cols-3 gap-4 max-w-[720px] mx-auto">
          {details.map((detail) => {
            const Icon = detail.icon
            return (
              <div
                key={detail.label}
                className="p-6 bg-[var(--web-off-white)] rounded-[2px] text-center"
              >
                <div className="w-10 h-10 rounded-full bg-[var(--web-spruce)]/10 flex items-center justify-center mx-auto mb-4">
                  <Icon className="h-4 w-4 text-[var(--web-spruce)]" />
                </div>
                <div className="text-[var(--web-spruce)] text-[10px] font-normal uppercase tracking-[0.15em] mb-2">
                  {detail.label}
                </div>
                <div className="font-headline text-[var(--web-ash)] text-[16px] font-normal leading-tight">
                  {detail.value}
                </div>
                {detail.sub && (
                  <div className="text-[var(--web-spruce)] text-[12px] font-light mt-1.5">
                    {detail.sub}
                  </div>
                )}
              </div>
            )
          })}
        </Grid>
      </Container>
    </section>
  )
}

// =============================================================================
// FAQ SECTION
// Disarms common hesitations before asking for the email.
// =============================================================================

function FAQSection({ event }: { event: Livestream }) {
  return (
    <section className="bg-[var(--web-off-white)] py-[var(--web-section-gap)]">
      <Container size="md">
        <Stack gap="md" align="center" className="text-center mb-10">
          <span className="text-[var(--web-spruce)] text-[11px] font-normal uppercase tracking-[0.2em]">
            Common Questions
          </span>
          <Title
            as="h2"
            align="center"
            className="font-headline text-[var(--web-ash)] text-[clamp(26px,3.5vw,36px)] font-normal leading-[1.25]"
          >
            Before you sign up
          </Title>
        </Stack>

        <div className="max-w-[720px] mx-auto space-y-4">
          {event.faq.map((item) => (
            <details
              key={item.question}
              className="group bg-white rounded-[2px] border border-[var(--web-serenity)]/15 overflow-hidden"
            >
              <summary className="flex items-center gap-4 px-6 py-5 cursor-pointer list-none">
                <HelpCircleIcon className="h-4 w-4 text-[var(--web-spruce)] shrink-0" />
                <span className="flex-1 font-headline text-[var(--web-ash)] text-[16px] font-normal">
                  {item.question}
                </span>
                <span className="text-[var(--web-spruce)] text-[20px] leading-none transition-transform group-open:rotate-45 shrink-0">
                  +
                </span>
              </summary>
              <div className="px-6 pb-5 pl-[42px]">
                <p className="text-[var(--web-spruce)] text-[14px] font-light leading-[1.8]">
                  {item.answer}
                </p>
              </div>
            </details>
          ))}
        </div>
      </Container>
    </section>
  )
}

// =============================================================================
// FINAL CTA SECTION
// Strong, quiet close — scroll back to the form.
// =============================================================================

function FinalCTASection({ event }: { event: Livestream }) {
  return (
    <section
      className="py-[var(--web-section-gap)] relative overflow-hidden"
      style={{
        backgroundColor: "var(--web-ash)",
        backgroundImage: "linear-gradient(135deg, var(--web-ash) 0%, #2a2b2c 100%)",
      }}
    >
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-[var(--web-spruce)]/15 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <Container size="md" className="relative z-10">
        <Stack gap="lg" align="center" className="text-center">
          <span className="text-[var(--web-serenity)] text-[11px] font-normal uppercase tracking-[0.2em]">
            {event.dateLabel} · {event.timeLabel}
          </span>

          <Title
            as="h2"
            className="font-headline text-[var(--web-off-white)] text-[clamp(28px,4.5vw,44px)] font-normal leading-[1.2]"
          >
            Skip the headlines.
            <br />
            <span className="text-[var(--web-serenity)]">Get the real picture.</span>
          </Title>

          <Text className="text-white/60 text-[15px] font-light leading-relaxed max-w-[460px]">
            45 minutes. Live Q&amp;A. Replay included. Reserve your seat and we&apos;ll send the link.
          </Text>

          <a
            href="#register-form"
            className="btn-hover-lift mt-4 h-14 px-12 bg-[var(--web-spruce)] text-[var(--web-off-white)] hover:bg-[var(--web-spruce)]/90 rounded-[2px] text-[11px] font-normal uppercase tracking-[0.2em] shadow-lg inline-flex items-center justify-center transition-colors"
          >
            Reserve Your Seat
          </a>

          <Text className="text-[var(--web-serenity)] text-[12px] font-light mt-2">
            Free · No obligation · Replay goes to registrants first
          </Text>
        </Stack>
      </Container>
    </section>
  )
}
