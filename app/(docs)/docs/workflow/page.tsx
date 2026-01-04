/**
 * CATALYST - Workflow Overview
 *
 * The Catalyst delivery workflow: proof-led alignment, staged promotion,
 * and durable decisions. Links to detailed stage-specific pages.
 */

import Link from "next/link"
import { Stack, Text, Row } from "@/components/core"
import {
  ArrowRightIcon,
  EyeIcon,
  TargetIcon,
  LayersIcon,
  FileTextIcon,
  UsersIcon,
  BotIcon,
  LightbulbIcon,
  PaletteIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function WorkflowPage() {
  return (
    <article>
      <Stack gap="xl">
        {/* Header */}
        <header className="space-y-3">
          <h1 className="text-3xl font-bold tracking-tight">Workflow</h1>
          <Text size="lg" variant="muted" className="leading-relaxed">
            Build something real. Show people → Get feedback → Improve. Advance
            toward production.
          </Text>
        </header>

        {/* ================================================================ */}
        {/* The core loop */}
        {/* ================================================================ */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">The delivery loop</h2>
          <Text size="sm" variant="muted">
            Every Catalyst project follows the same basic rhythm, regardless of
            stage.
          </Text>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <LoopStep
              number={1}
              title="Brief"
              description="Capture what you're building and why. Use prompts to anchor intent."
              color="blue"
            />
            <LoopStep
              number={2}
              title="Build"
              description="Ship working software fast. Pick the simplest stack that proves value."
              color="amber"
            />
            <LoopStep
              number={3}
              title="Review"
              description="Show stakeholders. Capture feedback. Make decisions together."
              color="teal"
            />
            <LoopStep
              number={4}
              title="Refine"
              description="Improve based on feedback. Loop back to Brief, or advance when ready."
              color="emerald"
            />
          </div>
        </section>

        {/* ================================================================ */}
        {/* Core principles */}
        {/* ================================================================ */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">How it works</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <PrincipleCard
              icon={EyeIcon}
              title="Proof-led alignment"
              description="Working software surfaces assumptions faster than documents. Show people something real and let them react."
              color="violet"
            />
            <PrincipleCard
              icon={FileTextIcon}
              title="Durable decisions"
              description="Key decisions get captured in artefacts. Three months later, you still know why you built it this way."
              color="rose"
            />
            <PrincipleCard
              icon={LayersIcon}
              title="Staged advancement"
              description="POC quality is not production quality. Harden deliberately as you advance through stages."
              color="sky"
            />
          </div>
        </section>

        {/* ================================================================ */}
        {/* The stages */}
        {/* ================================================================ */}
        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">The stages</h2>
            <Text size="sm" variant="muted" className="mt-1">
              Production is a choice, not an accident. Each stage has different
              expectations.
            </Text>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <StageCard
              badge="POC"
              title="Proof of Concept"
              color="blue"
              description="Validate the idea works. Ship something stakeholders can see and steer on. Rough is fine."
              href="/docs/workflow/poc"
              linkText="POC workflow"
            />
            <StageCard
              badge="MVP"
              title="Minimum Viable Product"
              color="amber"
              description="Real users, real feedback. Core flows working. Auth and persistence added. Polish optional."
              href="/docs/workflow/mvp"
              linkText="MVP workflow"
            />
            <StageCard
              badge="MMP"
              title="Minimum Marketable Product"
              color="purple"
              description="Ready for paying customers. Polished UI, proper error handling, basic monitoring."
              href="/docs/workflow/mmp"
              linkText="MMP workflow"
            />
            <StageCard
              badge="PROD"
              title="Production"
              color="emerald"
              description="Enterprise-ready. Security hardened, scalable, monitored, documented."
              href="/docs/workflow/production"
              linkText="Production workflow"
            />
          </div>
        </section>

        {/* ================================================================ */}
        {/* Delivery cycles */}
        {/* ================================================================ */}
        <section className="border-border bg-muted/30 space-y-4 rounded-xl border p-5">
          <Row gap="sm" className="items-center">
            <TargetIcon className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">Running delivery cycles</h2>
          </Row>
          <Text size="sm" variant="muted" className="leading-relaxed">
            One cycle = one pass through Brief → Build → Review → Refine.
            Each phase has a natural checkpoint to confirm you&apos;re ready
            to move on. Run many cycles, advance when the work is validated.
          </Text>
          <div className="grid gap-3 md:grid-cols-4">
            <CheckpointCard
              phase="Brief"
              question="Is intent clear enough to build?"
            />
            <CheckpointCard
              phase="Build"
              question="Is it ready to show people?"
            />
            <CheckpointCard
              phase="Review"
              question="Do we understand what to change?"
            />
            <CheckpointCard
              phase="Refine"
              question="Loop again, or advance?"
            />
          </div>
          <Link
            href="/docs/workflow/delivery"
            className="text-primary inline-flex items-center gap-1 text-sm font-medium hover:underline"
          >
            Learn about delivery cycles
            <ArrowRightIcon className="h-3.5 w-3.5" />
          </Link>
        </section>

        {/* ================================================================ */}
        {/* Roles */}
        {/* ================================================================ */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Who does what</h2>
          <Text size="sm" variant="muted">
            Clear roles prevent confusion. Humans lead; AI assists.
          </Text>
          <div className="grid gap-3 md:grid-cols-2">
            <RoleCard
              icon={UsersIcon}
              title="Project Lead"
              description="Runs meetings, makes scope calls, approves phases. The human accountable for delivery."
            />
            <RoleCard
              icon={BotIcon}
              title="Project Agent"
              description="Stress tests requirements, produces artefacts, challenges assumptions. AI that thinks about scope."
            />
            <RoleCard
              icon={BotIcon}
              title="Coding Agent"
              description="Proposes phase plans, builds features, maintains quality. AI that writes code."
            />
            <RoleCard
              icon={UsersIcon}
              title="Client / Stakeholder"
              description="Provides context, reviews progress, makes decisions. The humans you're building for."
            />
          </div>
          <Link
            href="/docs/workflow/roles"
            className="text-primary inline-flex items-center gap-1 text-sm font-medium hover:underline"
          >
            See roles & collaboration
            <ArrowRightIcon className="h-3.5 w-3.5" />
          </Link>
        </section>

        {/* ================================================================ */}
        {/* Key insight */}
        {/* ================================================================ */}
        <section className="rounded-xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-900/50 dark:bg-amber-950/20">
          <Row gap="sm" className="mb-3 items-center">
            <LightbulbIcon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            <Text weight="semibold">Key insight</Text>
          </Row>
          <Text size="sm" className="leading-relaxed text-amber-900 dark:text-amber-200">
            Different AIs should own different responsibilities. A single agent
            trying to handle context, scope, code, and sequencing produces
            inconsistent results. Separate the <strong>Project Agent</strong>{" "}
            (scope and artefacts) from the <strong>Coding Agent</strong> (build
            and quality).
          </Text>
        </section>

        {/* ================================================================ */}
        {/* Design System */}
        {/* ================================================================ */}
        <section className="rounded-xl border border-violet-200 bg-gradient-to-br from-violet-50 to-purple-50/50 p-5 dark:border-violet-900/50 dark:from-violet-950/20 dark:to-purple-950/10">
          <Row gap="sm" className="mb-3 items-center">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-900/30">
              <PaletteIcon className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            </div>
            <Text weight="semibold">Make it yours</Text>
          </Row>
          <Text size="sm" variant="muted" className="mb-3 leading-relaxed">
            Catalyst ships with a flexible design system. Colors, typography, and
            spacing are all customizable through CSS variables. Change the primary
            color and the whole UI updates. Most customization takes minutes, not
            hours.
          </Text>
          <Link
            href="/docs/design"
            className="text-primary inline-flex items-center gap-1 text-sm font-medium hover:underline"
          >
            Explore the Design System
            <ArrowRightIcon className="h-3.5 w-3.5" />
          </Link>
        </section>

        {/* ================================================================ */}
        {/* Start here */}
        {/* ================================================================ */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Start here</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <StartCard
              title="POC Delivery Rhythm"
              description="The standard 1-week cadence for delivering a validated proof of concept."
              href="/docs/workflow/poc"
              color="blue"
            />
            <StartCard
              title="Delivery Cycles"
              description="Understand the checkpoints that keep your project aligned."
              href="/docs/workflow/delivery"
              color="teal"
            />
          </div>
        </section>
      </Stack>
    </article>
  )
}

// =============================================================================
// Helper Components
// =============================================================================

const loopColors = {
  blue: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  amber: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  teal: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
  emerald: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
} as const

function LoopStep({
  number,
  title,
  description,
  color,
}: {
  number: number
  title: string
  description: string
  color: keyof typeof loopColors
}) {
  return (
    <div className="rounded-xl border p-4">
      <div className="mb-3 flex items-center gap-2">
        <span
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold",
            loopColors[color]
          )}
        >
          {number}
        </span>
        <h3 className="font-semibold">{title}</h3>
      </div>
      <Text size="sm" variant="muted" className="leading-relaxed">
        {description}
      </Text>
    </div>
  )
}

const principleColors = {
  violet: {
    bg: "bg-gradient-to-br from-violet-50 to-purple-50/50 dark:from-violet-950/20 dark:to-purple-950/10",
    iconBg: "bg-violet-100 dark:bg-violet-900/30",
    icon: "text-violet-600 dark:text-violet-400",
  },
  rose: {
    bg: "bg-gradient-to-br from-rose-50 to-pink-50/50 dark:from-rose-950/20 dark:to-pink-950/10",
    iconBg: "bg-rose-100 dark:bg-rose-900/30",
    icon: "text-rose-600 dark:text-rose-400",
  },
  sky: {
    bg: "bg-gradient-to-br from-sky-50 to-cyan-50/50 dark:from-sky-950/20 dark:to-cyan-950/10",
    iconBg: "bg-sky-100 dark:bg-sky-900/30",
    icon: "text-sky-600 dark:text-sky-400",
  },
} as const

function PrincipleCard({
  icon: Icon,
  title,
  description,
  color,
}: {
  icon: React.ElementType
  title: string
  description: string
  color: keyof typeof principleColors
}) {
  const colors = principleColors[color]

  return (
    <div className={cn("rounded-xl p-5", colors.bg)}>
      <div
        className={cn(
          "mb-3 flex h-10 w-10 items-center justify-center rounded-lg",
          colors.iconBg
        )}
      >
        <Icon className={cn("h-5 w-5", colors.icon)} />
      </div>
      <h3 className="font-semibold">{title}</h3>
      <Text size="sm" variant="muted" className="mt-2 leading-relaxed">
        {description}
      </Text>
    </div>
  )
}

const stageColors = {
  blue: {
    badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    border: "border-blue-200 dark:border-blue-900/50",
  },
  amber: {
    badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    border: "border-amber-200 dark:border-amber-900/50",
  },
  purple: {
    badge: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    border: "border-purple-200 dark:border-purple-900/50",
  },
  emerald: {
    badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    border: "border-emerald-200 dark:border-emerald-900/50",
  },
} as const

function StageCard({
  badge,
  title,
  color,
  description,
  href,
  linkText,
}: {
  badge: string
  title: string
  color: keyof typeof stageColors
  description: string
  href: string
  linkText: string
}) {
  const colors = stageColors[color]

  return (
    <div className={cn("rounded-xl border p-5", colors.border)}>
      <Row gap="sm" className="mb-2 items-center">
        <span
          className={cn(
            "rounded-lg px-2 py-0.5 text-xs font-bold uppercase",
            colors.badge
          )}
        >
          {badge}
        </span>
        <h3 className="font-semibold">{title}</h3>
      </Row>
      <Text size="sm" variant="muted" className="mb-3 leading-relaxed">
        {description}
      </Text>
      <Link
        href={href}
        className="text-primary inline-flex items-center gap-1 text-sm font-medium hover:underline"
      >
        {linkText}
        <ArrowRightIcon className="h-3.5 w-3.5" />
      </Link>
    </div>
  )
}

function CheckpointCard({
  phase,
  question,
}: {
  phase: string
  question: string
}) {
  return (
    <div className="rounded-lg bg-background p-4">
      <Text weight="medium" size="sm">
        {phase}
      </Text>
      <Text size="sm" variant="muted" className="mt-2 italic">
        &quot;{question}&quot;
      </Text>
    </div>
  )
}

function RoleCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType
  title: string
  description: string
}) {
  return (
    <div className="flex gap-3 rounded-xl border p-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
        <Icon className="h-5 w-5 text-muted-foreground" />
      </div>
      <div>
        <Text weight="medium">{title}</Text>
        <Text size="sm" variant="muted" className="mt-0.5">
          {description}
        </Text>
      </div>
    </div>
  )
}

const startColors = {
  blue: "bg-gradient-to-br from-blue-50 to-sky-50/50 dark:from-blue-950/20 dark:to-sky-950/10 border-blue-200 dark:border-blue-900/50",
  teal: "bg-gradient-to-br from-teal-50 to-emerald-50/50 dark:from-teal-950/20 dark:to-emerald-950/10 border-teal-200 dark:border-teal-900/50",
} as const

function StartCard({
  title,
  description,
  href,
  color,
}: {
  title: string
  description: string
  href: string
  color: keyof typeof startColors
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex flex-col rounded-xl border p-5 transition-colors hover:border-primary/50",
        startColors[color]
      )}
    >
      <Text weight="semibold" className="group-hover:text-primary">
        {title}
      </Text>
      <Text size="sm" variant="muted" className="mt-1 leading-relaxed">
        {description}
      </Text>
      <Text
        size="sm"
        className="text-primary mt-3 inline-flex items-center gap-1 font-medium"
      >
        Learn more
        <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
      </Text>
    </Link>
  )
}
