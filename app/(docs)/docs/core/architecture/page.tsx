/**
 * CATALYST - Features
 *
 * Comprehensive overview of what Catalyst provides and why it matters.
 * Benefit-led features that address real pain points.
 */

import Link from "next/link"
import { Stack, Text, Row } from "@/components/core"
import {
  ZapIcon,
  BotIcon,
  RocketIcon,
  PaletteIcon,
  CompassIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  CheckCircle2Icon,
  SparklesIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Feature color schemes
const featureColors = {
  amber: {
    bg: "bg-gradient-to-br from-amber-50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/10",
    iconBg: "bg-amber-100 dark:bg-amber-900/30",
    icon: "text-amber-600 dark:text-amber-400",
    subtitle: "text-amber-600 dark:text-amber-400",
    check: "text-amber-500",
  },
  violet: {
    bg: "bg-gradient-to-br from-violet-50 to-purple-50/50 dark:from-violet-950/20 dark:to-purple-950/10",
    iconBg: "bg-violet-100 dark:bg-violet-900/30",
    icon: "text-violet-600 dark:text-violet-400",
    subtitle: "text-violet-600 dark:text-violet-400",
    check: "text-violet-500",
  },
  rose: {
    bg: "bg-gradient-to-br from-rose-50 to-pink-50/50 dark:from-rose-950/20 dark:to-pink-950/10",
    iconBg: "bg-rose-100 dark:bg-rose-900/30",
    icon: "text-rose-600 dark:text-rose-400",
    subtitle: "text-rose-600 dark:text-rose-400",
    check: "text-rose-500",
  },
  sky: {
    bg: "bg-gradient-to-br from-sky-50 to-cyan-50/50 dark:from-sky-950/20 dark:to-cyan-950/10",
    iconBg: "bg-sky-100 dark:bg-sky-900/30",
    icon: "text-sky-600 dark:text-sky-400",
    subtitle: "text-sky-600 dark:text-sky-400",
    check: "text-sky-500",
  },
  teal: {
    bg: "bg-gradient-to-br from-teal-50 to-emerald-50/50 dark:from-teal-950/20 dark:to-emerald-950/10",
    iconBg: "bg-teal-100 dark:bg-teal-900/30",
    icon: "text-teal-600 dark:text-teal-400",
    subtitle: "text-teal-600 dark:text-teal-400",
    check: "text-teal-500",
  },
  emerald: {
    bg: "bg-gradient-to-br from-emerald-50 to-green-50/50 dark:from-emerald-950/20 dark:to-green-950/10",
    iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
    icon: "text-emerald-600 dark:text-emerald-400",
    subtitle: "text-emerald-600 dark:text-emerald-400",
    check: "text-emerald-500",
  },
} as const

type ColorScheme = keyof typeof featureColors

export default function FeaturesPage() {
  return (
    <article className="mx-auto max-w-4xl">
      <Stack gap="2xl">
        {/* ================================================================ */}
        {/* Header */}
        {/* ================================================================ */}
        <header className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">Features</h1>
          <Text size="lg" variant="muted" className="leading-relaxed">
            A delivery methodology paired with a development kit. The method
            keeps you aligned; the kit keeps you fast.
          </Text>
        </header>

        {/* ================================================================ */}
        {/* Intro context */}
        {/* ================================================================ */}
        <div className="border-border bg-muted/30 flex items-start gap-4 rounded-xl border p-5">
          <div className="bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
            <SparklesIcon className="text-primary h-5 w-5" />
          </div>
          <div>
            <Text weight="semibold">Built for the AI era</Text>
            <Text size="sm" variant="muted" className="mt-1">
              AI can generate code fast — but speed creates drift. Catalyst
              gives you the structure to move quickly while staying aligned with
              what you&apos;re actually building.
            </Text>
          </div>
        </div>

        {/* ================================================================ */}
        {/* Feature Cards Grid */}
        {/* ================================================================ */}
        <div className="grid gap-5 md:grid-cols-2">
          <FeatureCard
            icon={ZapIcon}
            color="amber"
            title="Rapid Development"
            subtitle="POC in days. Launch-ready in a week."
            description="The infrastructure is done. Four surfaces (Web, App, Docs, Present), component library, design system, and one-click deployment. Start from patterns, not blank files."
            benefits={[
              "Four ready-to-use surfaces for different needs",
              "Component library with design tokens configured",
              "Deploy to Vercel in 30 seconds",
              "Start from patterns, not empty folders",
            ]}
          />

          <FeatureCard
            icon={BotIcon}
            color="violet"
            title="AI-Ready Codebase"
            subtitle="AI generates code that actually fits."
            description="A predictable structure AI can navigate. AGENTS.md gives every session project context. File conventions AI follows reliably. A tech stack AI has trained on extensively."
            benefits={[
              "AGENTS.md gives AI project guardrails",
              "Starter prompts for consistent collaboration",
              "File structure AI can navigate reliably",
              "Next.js, Tailwind, shadcn — AI-friendly stack",
            ]}
          />

          <FeatureCard
            icon={RocketIcon}
            color="rose"
            title="Production Pathway"
            subtitle="POC to production without rewrites."
            description="Clear stages: POC → MVP → MMP → PROD. Explicit promotion with checklists. Architecture designed to scale from day one. Production features ready when you need them."
            benefits={[
              "Clear stages with explicit promotion",
              "Architecture that scales without rewrites",
              "Auth, deployment, integrations ready to enable",
              "The code you write today is the code you ship",
            ]}
          />

          <FeatureCard
            icon={PaletteIcon}
            color="sky"
            title="Design System Included"
            subtitle="Consistent UI out of the box."
            description="Design tokens, component library, typography, spacing, and dark mode — all configured. Core primitives for layout. shadcn/ui for common patterns. Every page looks like it belongs."
            benefits={[
              "Design tokens, typography, spacing configured",
              "Core primitives: Stack, Row, Grid, Text",
              "shadcn/ui components for common patterns",
              "Dark mode and responsive design built in",
            ]}
          />

          <FeatureCard
            icon={CompassIcon}
            color="teal"
            title="Drift Prevention"
            subtitle="Intent that survives the whole project."
            description="Artefacts (Vision, Architecture, Voice) capture the 'why.' PRDs turn stakeholder feedback into documented decisions. Three months in, you still know why you built it this way."
            benefits={[
              "Vision, Architecture, Voice documents",
              "PRDs turn feedback into decisions",
              "Proof-led steering: show, capture, decide",
              "No archaeology to understand your codebase",
            ]}
          />

          <FeatureCard
            icon={ShieldCheckIcon}
            color="emerald"
            title="Battle-Tested Patterns"
            subtitle="15 years of experience baked in."
            description="Real production patterns from hundreds of shipped projects. Common mistakes already avoided. Folder structures, naming conventions, and architectural decisions that scale."
            benefits={[
              "Patterns from hundreds of shipped projects",
              "Common mistakes already avoided",
              "Conventions that scale to large teams",
              "Build with confidence from day one",
            ]}
          />
        </div>

        {/* ================================================================ */}
        {/* The Bottom Line */}
        {/* ================================================================ */}
        <section className="border-border bg-muted/30 space-y-4 rounded-xl border p-6">
          <h2 className="text-lg font-semibold">The bottom line</h2>
          <Text variant="muted" className="leading-relaxed">
            Whether you&apos;ve tried vibe coding and hit walls, you&apos;re
            looking to accelerate traditional development, or you need
            enterprise-quality results at the speed of AI — Catalyst is built
            for you. It&apos;s the structure that lets you move fast without
            the mess.
          </Text>
          <div className="grid gap-3 pt-2 md:grid-cols-2">
            <BenefitItem text="Show stakeholders working proof this week" />
            <BenefitItem text="AI becomes a collaborator, not a liability" />
            <BenefitItem text="Scale when ready, not before" />
            <BenefitItem text="Professional results without deep expertise" />
          </div>
        </section>

        {/* ================================================================ */}
        {/* Next step */}
        {/* ================================================================ */}
        <section className="border-border flex items-center justify-between gap-4 rounded-xl border p-5">
          <div>
            <Text weight="medium">See the methodology</Text>
            <Text size="sm" variant="muted">
              Understand how proof-led delivery keeps projects aligned.
            </Text>
          </div>
          <Link
            href="/docs/core/approach"
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex shrink-0 items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
          >
            Approach
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </section>
      </Stack>
    </article>
  )
}

// =============================================================================
// Helper Components
// =============================================================================

function FeatureCard({
  icon: Icon,
  color,
  title,
  subtitle,
  description,
  benefits,
}: {
  icon: React.ElementType
  color: ColorScheme
  title: string
  subtitle: string
  description: string
  benefits: string[]
}) {
  const colors = featureColors[color]

  return (
    <div
      className={cn(
        "flex flex-col rounded-xl border border-transparent p-5 transition-shadow hover:shadow-md",
        colors.bg
      )}
    >
      <div className="mb-3 flex items-start gap-3">
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
            colors.iconBg
          )}
        >
          <Icon className={cn("h-5 w-5", colors.icon)} />
        </div>
        <div>
          <h3 className="font-semibold">{title}</h3>
          <Text size="sm" className={colors.subtitle}>
            {subtitle}
          </Text>
        </div>
      </div>
      <Text size="sm" variant="muted" className="mb-4 leading-relaxed">
        {description}
      </Text>
      <ul className="mt-auto space-y-2">
        {benefits.map((benefit) => (
          <li key={benefit} className="flex items-start gap-2 text-sm">
            <CheckCircle2Icon
              className={cn("mt-0.5 h-3.5 w-3.5 shrink-0", colors.check)}
            />
            <span className="text-muted-foreground">{benefit}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function BenefitItem({ text }: { text: string }) {
  return (
    <Row gap="sm" className="items-start">
      <CheckCircle2Icon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
      <Text size="sm" variant="muted">
        {text}
      </Text>
    </Row>
  )
}
