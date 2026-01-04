/**
 * CATALYST - Docs Introduction
 *
 * The docs landing page. Tells the Catalyst story for potential devs and stakeholders.
 * Human-first, not technical-first.
 */

import Link from "next/link"
import { Stack, Text, Row } from "@/components/core"
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip"
import {
  RocketIcon,
  TargetIcon,
  LayersIcon,
  ZapIcon,
  UsersIcon,
  CheckCircle2Icon,
  ArrowRightIcon,
  LightbulbIcon,
  ChevronRightIcon,
  AtomIcon,
  WindIcon,
  ComponentIcon,
  FileCodeIcon,
} from "lucide-react"

export default function DocsPage() {
  return (
    <div className="docs-bleed">
      {/* ================================================================ */}
      {/* Hero: Full-width background, constrained content */}
      {/* ================================================================ */}
      <section className="bg-gradient-to-b from-primary/5 to-transparent pb-8 pt-6">
        <div className="docs-section space-y-6">
          {/* Title */}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              Ship in weeks,
              <br />
              <span className="text-muted-foreground font-medium">
                without losing alignment.
              </span>
            </h1>
            <p className="text-muted-foreground max-w-2xl text-lg leading-relaxed">
              <strong>As AI collapses build time, speed isn't the problem — drift is.</strong>
              <br />
              Catalyst is the operating system and dev kit for rapid AI-enabled delivery.
              It helps you steer, build fast, and stay aligned —
              from proof to production.
            </p>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { stat: "~2 weeks", label: "Idea to proof" },
              { stat: "4× faster", label: "Than traditional" },
              { stat: "Live steering", label: "On working proof" },
              { stat: "Staged path", label: "To production" },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-background/80 border-primary/20 rounded-xl border p-4 text-center"
              >
                <Text size="lg" weight="bold" className="text-primary">
                  {item.stat}
                </Text>
                <Text size="xs" variant="muted" className="mt-0.5">
                  {item.label}
                </Text>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* Main content */}
      {/* ================================================================ */}
      <Stack gap="2xl" className="docs-section">
        {/* The Pain Point */}
        {/* ================================================================ */}
        <section className="border-l-2 border-muted pl-6">
          <p className="text-muted-foreground leading-relaxed">
            Most projects don&apos;t fail because teams can&apos;t build — they
            fail because teams <em>build fast in the wrong direction</em>.
            Stakeholders see the real thing too late, decisions get buried in
            Slack, and rough prototypes quietly ship as the final product.
          </p>
          <p className="mt-3 leading-relaxed">
            <strong>Catalyst fixes this</strong> by replacing slow speculation
            with <strong>proof-led alignment</strong>: build something real,
            show people, get feedback, and only harden what&apos;s proven.
          </p>
        </section>

        {/* ================================================================ */}
        {/* Two Things Working Together */}
        {/* ================================================================ */}
        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">What you get</h2>
            <p className="text-muted-foreground mt-1">
              A delivery method paired with a development kit.
            </p>
          </div>

          {/* Tech stack badges */}
          <Row gap="sm" className="flex-wrap">
            <TechBadge label="Next.js 16" color="orange" icon={ZapIcon} />
            <TechBadge label="React 19" color="cyan" icon={AtomIcon} />
            <TechBadge label="Shadcn" color="violet" icon={ComponentIcon} />
            <TechBadge label="Tailwind 4" color="sky" icon={WindIcon} />
            <TechBadge label="TypeScript" color="blue" icon={FileCodeIcon} />
          </Row>

          <div className="grid gap-4 md:grid-cols-2">
            <FeatureCard
              icon={TargetIcon}
              title="The Method"
              color="teal"
              points={[
                "Check-in points that keep everyone aligned",
                "Clear stages from proof to production",
                "Show, capture, decide — then repeat",
              ]}
            />
            <FeatureCard
              icon={LayersIcon}
              title="The Kit"
              color="violet"
              points={[
                "Four surfaces: web, app, docs, present",
                "Design system + component library",
                "AI prompts that work with Copilot & Cursor",
              ]}
            />
          </div>

          {/* Quick positioning */}
          <div className="bg-muted/50 rounded-xl p-4">
            <Row gap="lg" className="flex-wrap text-sm">
              <span className="flex items-center gap-1.5">
                <CheckCircle2Icon className="h-4 w-4 text-emerald-600" />
                Show stakeholders working proof this week
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2Icon className="h-4 w-4 text-emerald-600" />
                AI becomes a collaborator, not a liability
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2Icon className="h-4 w-4 text-emerald-600" />
                Scale when ready, not before
              </span>
            </Row>
          </div>
        </section>

        {/* ================================================================ */}
        {/* Who it's for */}
        {/* ================================================================ */}
        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Who it&apos;s for</h2>
            <p className="text-muted-foreground mt-1">
              Catalyst is for people responsible for shipping — not just writing code.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <PersonaCard
              title="Delivery leads"
              color="amber"
              description="Running fast projects that need to stay defensible. You want less debate, clear decisions, and a reliable path from proof to production."
            />
            <PersonaCard
              title="Agencies & consultancies"
              color="sky"
              description="Building a repeatable delivery capability. You need a method your team can learn — not hero-led delivery that doesn't scale."
            />
            <PersonaCard
              title="Founders & solopreneurs"
              color="emerald"
              description="Moving fast on your own product. You want speed without losing the thread, and a way to harden what's proven."
            />
          </div>
        </section>

        {/* ================================================================ */}
        {/* The Journey: Staged Path */}
        {/* ================================================================ */}
        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">The journey to production</h2>
            <p className="text-muted-foreground mt-1">
              Production is a choice, not an accident. Four stages, each with
              clear expectations.
            </p>
          </div>

          {/* Vertical timeline */}
          <div className="relative">
            {/* Connection line */}
            <div className="absolute bottom-0 left-[11px] top-0 w-0.5 bg-gradient-to-b from-blue-500 via-amber-500 via-40% via-purple-500 via-70% to-emerald-500" />

            <div className="space-y-6">
              {[
                {
                  stage: "Proof",
                  badge: "POC",
                  badgeFull: "Proof of Concept",
                  week: "Week 1",
                  desc: "Validate the idea works. Ship something stakeholders can steer on.",
                  dot: "bg-blue-500",
                  badgeBg: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400",
                },
                {
                  stage: "Early Product",
                  badge: "MVP",
                  badgeFull: "Minimum Viable Product",
                  week: "Week 2",
                  desc: "Real users, early feedback. Core flows working, rough edges acceptable.",
                  dot: "bg-amber-500",
                  badgeBg: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400",
                },
                {
                  stage: "Market Ready",
                  badge: "MMP",
                  badgeFull: "Minimum Marketable Product",
                  week: "Week 3",
                  desc: "Polished product for launch. Ready for paying customers.",
                  dot: "bg-purple-500",
                  badgeBg: "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400",
                },
                {
                  stage: "Production",
                  badge: "PROD",
                  badgeFull: "Production Ready",
                  week: "Week 4+",
                  desc: "Hardened and enterprise ready. Monitoring, security, scale.",
                  dot: "bg-emerald-500",
                  badgeBg: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400",
                },
              ].map((item, i) => (
                <div key={item.stage} className="relative flex gap-4">
                  {/* Dot */}
                  <div
                    className={`relative z-10 mt-1 h-6 w-6 shrink-0 rounded-full ring-4 ring-background ${item.dot}`}
                  >
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                      {i + 1}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Text size="base" weight="semibold">
                        {item.stage}
                      </Text>
                      <Tooltip>
                        <TooltipTrigger
                          className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${item.badgeBg}`}
                        >
                          {item.badge}
                        </TooltipTrigger>
                        <TooltipContent>{item.badgeFull}</TooltipContent>
                      </Tooltip>
                      <Text size="xs" variant="muted">
                        {item.week}
                      </Text>
                    </div>
                    <Text size="sm" variant="muted" className="mt-1 leading-relaxed">
                      {item.desc}
                    </Text>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* Start Here */}
        {/* ================================================================ */}
        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Start here</h2>
            <p className="text-muted-foreground mt-1">
              Pick the path that matches where you are right now.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <StartCard
              icon={ZapIcon}
              title="Need speed today"
              description="You know what to build. Get the repo running and ship proof this week."
              steps={[
                "Quickstart → run locally",
                "Coding prompts → brief your AI",
                "Ship proof → book steering",
              ]}
              cta={{ label: "Quickstart", href: "/docs/develop/setup" }}
              accent
            />
            <StartCard
              icon={TargetIcon}
              title="Need clarity first"
              description="Not sure what to build, or stakeholders aren't aligned yet."
              steps={[
                "Vision, Architecture, Voice prompts",
                "Draft a focused PRD",
                "Then move into Quickstart",
              ]}
              cta={{ label: "Project prompts", href: "/docs/project/requirements" }}
            />
          </div>
        </section>

        {/* ================================================================ */}
        {/* Two Ways to Use Catalyst */}
        {/* ================================================================ */}
        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Two ways to run Catalyst</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="bg-card rounded-xl border p-5">
              <Row gap="sm" className="mb-3 items-center">
                <UsersIcon className="text-muted-foreground h-5 w-5" />
                <Text weight="semibold">Managed</Text>
              </Row>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Work with <strong>RIVER Group</strong> to run Catalyst with you.
                We handle delivery, you stay in control of steering.
              </p>
              <Text size="xs" variant="muted" className="mt-3">
                Best for teams who want velocity without hiring.
              </Text>
            </div>

            <div className="bg-card rounded-xl border p-5 ring-2 ring-primary/20">
              <Row gap="sm" className="mb-3 items-center">
                <RocketIcon className="text-primary h-5 w-5" />
                <Text weight="semibold">DIY</Text>
                <span className="bg-primary/10 text-primary ml-auto rounded-full px-2 py-0.5 text-xs font-medium">
                  You are here
                </span>
              </Row>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Use this kit + methodology to run your own project. These docs
                are your playbook.
              </p>
              <Text size="xs" variant="muted" className="mt-3">
                Best for teams with dev capacity who want the structure.
              </Text>
            </div>
          </div>

          {/* Callout */}
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
            <Row gap="sm" className="items-start">
              <LightbulbIcon className="text-primary mt-0.5 h-5 w-5 shrink-0" />
              <div>
                <Text weight="medium">You&apos;re reading the DIY playbook</Text>
                <Text size="sm" variant="muted" className="mt-1">
                  Everything here helps you run Catalyst yourself. No
                  gatekeeping, no upsells — just the method and the kit.
                </Text>
              </div>
            </Row>
          </div>
        </section>

        {/* ================================================================ */}
        {/* Footer CTA */}
        {/* ================================================================ */}
        <section className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-6 md:p-8">
          <div className="text-center">
            <h2 className="text-xl font-semibold">Ready to move?</h2>
            <p className="text-muted-foreground mx-auto mt-2 max-w-md text-sm">
              Most teams start with Quickstart and ship a proof in the first
              week. These are the sections you&apos;ll use most.
            </p>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <NavLink
              href="/docs/develop/setup"
              label="Quickstart"
              desc="Get the repo running in 5 minutes"
              primary
            />
            <NavLink
              href="/docs/workflow"
              label="Workflow"
              desc="The delivery rhythm explained"
            />
            <NavLink
              href="/docs/project/requirements"
              label="Project Prompts"
              desc="Vision, architecture, voice"
            />
            <NavLink
              href="/docs/core/stacks"
              label="Stacks"
              desc="Choose your tech for each stage"
            />
          </div>
        </section>
      </Stack>
    </div>
  )
}

// -----------------------------------------------------------------------------
// Helper Components
// -----------------------------------------------------------------------------

const featureCardColors = {
  teal: {
    bg: "bg-gradient-to-br from-teal-50 to-emerald-50/50 dark:from-teal-950/20 dark:to-emerald-950/10",
    iconBg: "bg-teal-100 dark:bg-teal-900/30",
    icon: "text-teal-600 dark:text-teal-400",
    chevron: "text-teal-500",
  },
  violet: {
    bg: "bg-gradient-to-br from-violet-50 to-purple-50/50 dark:from-violet-950/20 dark:to-purple-950/10",
    iconBg: "bg-violet-100 dark:bg-violet-900/30",
    icon: "text-violet-600 dark:text-violet-400",
    chevron: "text-violet-500",
  },
} as const

function FeatureCard({
  icon: Icon,
  title,
  points,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  points: string[]
  color?: keyof typeof featureCardColors
}) {
  const colors = color ? featureCardColors[color] : null

  return (
    <div className={`rounded-xl p-5 ${colors ? colors.bg : "bg-card border"}`}>
      <div className="mb-4 flex items-center gap-2.5">
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${colors ? colors.iconBg : "bg-primary/10"}`}>
          <Icon className={`h-5 w-5 ${colors ? colors.icon : "text-primary"}`} />
        </div>
        <h3 className="font-semibold">{title}</h3>
      </div>
      <ul className="space-y-2">
        {points.map((point) => (
          <li key={point} className="text-muted-foreground flex gap-2 text-sm">
            <ChevronRightIcon className={`mt-0.5 h-4 w-4 shrink-0 ${colors ? colors.chevron : "text-primary"}`} />
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function StartCard({
  icon: Icon,
  title,
  description,
  steps,
  cta,
  accent,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  steps: string[]
  cta: { label: string; href: string }
  accent?: boolean
}) {
  return (
    <div
      className={`bg-card overflow-hidden rounded-xl border ${accent ? "ring-2 ring-primary/20" : ""}`}
    >
      <div
        className={`border-b px-5 py-3 ${accent ? "bg-primary/5" : "bg-muted/30"}`}
      >
        <Row gap="sm" className="items-center">
          <Icon
            className={`h-4 w-4 ${accent ? "text-primary" : "text-muted-foreground"}`}
          />
          <Text weight="semibold">{title}</Text>
        </Row>
      </div>
      <div className="space-y-4 p-5">
        <p className="text-muted-foreground text-sm leading-relaxed">
          {description}
        </p>
        <ul className="space-y-1.5">
          {steps.map((step, i) => (
            <li key={step} className="flex gap-2 text-sm">
              <span className="text-muted-foreground font-medium">{i + 1}.</span>
              <span>{step}</span>
            </li>
          ))}
        </ul>
        <Link
          href={cta.href}
          className={`inline-flex items-center gap-1 text-sm font-medium transition-colors ${accent ? "text-primary hover:text-primary/80" : "text-foreground hover:text-primary"}`}
        >
          {cta.label}
          <ArrowRightIcon className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  )
}

function NavLink({
  href,
  label,
  desc,
  primary,
}: {
  href: string
  label: string
  desc: string
  primary?: boolean
}) {
  return (
    <Link
      href={href}
      className={`flex items-center justify-between rounded-xl border p-4 transition-colors ${
        primary
          ? "bg-primary text-primary-foreground hover:bg-primary/90 border-primary"
          : "bg-card hover:border-primary/30"
      }`}
    >
      <div>
        <Text
          size="sm"
          weight="semibold"
          className={primary ? "text-primary-foreground" : ""}
        >
          {label}
        </Text>
        <Text
          size="xs"
          className={primary ? "text-primary-foreground/80" : "text-muted-foreground"}
        >
          {desc}
        </Text>
      </div>
      <ArrowRightIcon
        className={`h-4 w-4 ${primary ? "text-primary-foreground" : "text-muted-foreground"}`}
      />
    </Link>
  )
}

function TechBadge({
  label,
  color,
  icon: Icon,
}: {
  label: string
  color: "orange" | "cyan" | "sky" | "violet" | "blue" | "emerald"
  icon: React.ElementType
}) {
  const colors = {
    orange: "border-orange-400/60 text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/30",
    cyan: "border-cyan-400/60 text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/30",
    sky: "border-sky-400/60 text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/30",
    violet: "border-violet-400/60 text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/30",
    blue: "border-blue-400/60 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30",
    emerald: "border-emerald-400/60 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30",
  }

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium ${colors[color]}`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </span>
  )
}

const personaColors = {
  amber: "bg-gradient-to-br from-amber-50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/10",
  sky: "bg-gradient-to-br from-sky-50 to-cyan-50/50 dark:from-sky-950/20 dark:to-cyan-950/10",
  emerald: "bg-gradient-to-br from-emerald-50 to-green-50/50 dark:from-emerald-950/20 dark:to-green-950/10",
} as const

function PersonaCard({
  title,
  description,
  color,
}: {
  title: string
  description: string
  color?: keyof typeof personaColors
}) {
  return (
    <div className={`rounded-xl p-4 ${color ? personaColors[color] : "bg-card border"}`}>
      <Text weight="semibold" className="mb-2">
        {title}
      </Text>
      <Text size="sm" variant="muted" className="leading-relaxed">
        {description}
      </Text>
    </div>
  )
}
