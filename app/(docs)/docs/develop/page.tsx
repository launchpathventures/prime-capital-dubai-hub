/**
 * CATALYST - Develop Overview
 *
 * Hub for development documentation. Covers the day-to-day of building
 * with Catalyst — from setup to deployment.
 */

import Link from "next/link"
import { Stack, Text, Row } from "@/components/core"
import {
  ArrowRightIcon,
  WrenchIcon,
  BookOpenIcon,
  PackageIcon,
  KeyIcon,
  ArrowUpCircleIcon,
  RocketIcon,
  LightbulbIcon,
  TerminalIcon,
  BrainCircuitIcon,
  LayersIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function DevelopOverviewPage() {
  return (
    <article>
      <Stack gap="xl">
        {/* Header */}
        <header className="space-y-3">
          <h1 className="text-3xl font-bold tracking-tight">Develop</h1>
          <Text size="lg" variant="muted" className="leading-relaxed">
            Everything you need to build with Catalyst. Setup your environment,
            follow conventions, and ship with confidence.
          </Text>
        </header>

        {/* ================================================================ */}
        {/* What's Catalyst for developers */}
        {/* ================================================================ */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">What you get</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <BenefitCard
              title="Ready to code"
              description="Pre-configured Next.js with TypeScript, Tailwind, and a component library. Clone and start building."
              color="teal"
            />
            <BenefitCard
              title="AI-optimised structure"
              description="Clear patterns and conventions that AI agents understand. They follow the rules in AGENTS.md."
              color="violet"
            />
            <BenefitCard
              title="Multi-surface architecture"
              description="Web, app, docs — each surface has its own shell and styles. Delete what you don't need."
              color="amber"
            />
          </div>
        </section>

        {/* ================================================================ */}
        {/* Developer workflow */}
        {/* ================================================================ */}
        <section className="rounded-xl border border-sky-200 bg-gradient-to-br from-sky-50 to-cyan-50/50 p-5 dark:border-sky-900/50 dark:from-sky-950/20 dark:to-cyan-950/10">
          <h2 className="mb-3 font-semibold">Developer workflow</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Row gap="xs" className="items-center">
                <TerminalIcon className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                <Text weight="medium" size="sm">Clone → Configure → Code</Text>
              </Row>
              <Text size="sm" variant="muted" className="mt-1">
                Setup takes minutes. Copy .env.example, install dependencies,
                start the dev server. You're building immediately.
              </Text>
            </div>
            <div>
              <Row gap="xs" className="items-center">
                <LayersIcon className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                <Text weight="medium" size="sm">Use core primitives</Text>
              </Row>
              <Text size="sm" variant="muted" className="mt-1">
                Stack, Row, Grid for layout. Text, Title for typography. Check
                existing components before creating new ones.
              </Text>
            </div>
            <div>
              <Row gap="xs" className="items-center">
                <BrainCircuitIcon className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                <Text weight="medium" size="sm">Work with AI agents</Text>
              </Row>
              <Text size="sm" variant="muted" className="mt-1">
                Point them at AGENTS.md. They'll follow naming conventions, use
                the right components, and respect the file structure.
              </Text>
            </div>
            <div>
              <Row gap="xs" className="items-center">
                <ArrowUpCircleIcon className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                <Text weight="medium" size="sm">Advance through stages</Text>
              </Row>
              <Text size="sm" variant="muted" className="mt-1">
                POC → MVP → MMP → PROD. Each stage has clear expectations. Use
                upgrade checklists when you're ready to level up.
              </Text>
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* Documentation pages */}
        {/* ================================================================ */}
        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Documentation</h2>
            <Text size="sm" variant="muted" className="mt-1">
              Everything organised by topic. Start with Setup if you're new.
            </Text>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <DocCard
              icon={WrenchIcon}
              title="Setup"
              description="Install dependencies, configure environment, run locally. Your first 10 minutes."
              href="/docs/develop/setup"
              color="emerald"
            />
            <DocCard
              icon={BookOpenIcon}
              title="Standards"
              description="Code conventions and AI-friendly patterns. How to write code that scales."
              href="/docs/develop/standards"
              color="blue"
            />
            <DocCard
              icon={PackageIcon}
              title="Helpers"
              description="Utility functions, hooks, and components. What's already built for you."
              href="/docs/develop/helpers"
              color="purple"
            />
            <DocCard
              icon={KeyIcon}
              title="Authentication"
              description="Multi-mode auth with Supabase, demo mode, and bypass options."
              href="/docs/develop/authentication"
              color="red"
            />
            <DocCard
              icon={ArrowUpCircleIcon}
              title="Upgrade"
              description="Checklists for stage transitions (POC→MVP) and stack changes (Supabase→Laravel)."
              href="/docs/develop/upgrade"
              color="amber"
            />
            <DocCard
              icon={RocketIcon}
              title="Deployments"
              description="Branch strategy, Vercel setup, and production deployment checklist."
              href="/docs/develop/deployments"
              color="cyan"
            />
          </div>
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
            Catalyst is opinionated so you can move fast. Don't fight the
            conventions — they're designed for AI readability and team velocity.
            Use the primitives, follow AGENTS.md, and focus on what makes your
            project unique.
          </Text>
        </section>

        {/* ================================================================ */}
        {/* Quick start */}
        {/* ================================================================ */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Quick start</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <QuickCard
              title="New to Catalyst?"
              description="Start with Setup to get running locally, then read Standards to understand the conventions."
              href="/docs/develop/setup"
              cta="Start setup"
              color="emerald"
            />
            <QuickCard
              title="Ready to deploy?"
              description="Check the Upgrade checklists for your stage, then follow the Deployments guide."
              href="/docs/develop/deployments"
              cta="Deployment guide"
              color="cyan"
            />
          </div>
        </section>

        {/* ================================================================ */}
        {/* Related docs */}
        {/* ================================================================ */}
        <section className="border-border rounded-xl border border-dashed p-5">
          <Text weight="medium" className="mb-3">
            Related docs
          </Text>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href="/docs/workflow"
                className="text-primary hover:underline"
              >
                Workflow
              </Link>{" "}
              — Delivery process and decision checkpoints
            </li>
            <li>
              <Link
                href="/docs/audits"
                className="text-primary hover:underline"
              >
                Audits
              </Link>{" "}
              — Quality verification by area
            </li>
            <li>
              <Link
                href="/docs/prompts"
                className="text-primary hover:underline"
              >
                Prompts
              </Link>{" "}
              — AI prompts and project templates
            </li>
            <li>
              <Link
                href="/docs/core"
                className="text-primary hover:underline"
              >
                Core Components
              </Link>{" "}
              — Stack, Row, Grid, Text, Title primitives
            </li>
          </ul>
        </section>
      </Stack>
    </article>
  )
}

// =============================================================================
// Helper Components
// =============================================================================

const benefitColors = {
  amber: "bg-gradient-to-br from-amber-50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/10",
  teal: "bg-gradient-to-br from-teal-50 to-emerald-50/50 dark:from-teal-950/20 dark:to-emerald-950/10",
  violet: "bg-gradient-to-br from-violet-50 to-purple-50/50 dark:from-violet-950/20 dark:to-purple-950/10",
} as const

function BenefitCard({
  title,
  description,
  color,
}: {
  title: string
  description: string
  color: keyof typeof benefitColors
}) {
  return (
    <div className={cn("rounded-xl p-5", benefitColors[color])}>
      <Text weight="semibold">{title}</Text>
      <Text size="sm" variant="muted" className="mt-2 leading-relaxed">
        {description}
      </Text>
    </div>
  )
}

const docColors = {
  emerald: {
    iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
    icon: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-200 dark:border-emerald-900/50",
  },
  blue: {
    iconBg: "bg-blue-100 dark:bg-blue-900/30",
    icon: "text-blue-600 dark:text-blue-400",
    border: "border-blue-200 dark:border-blue-900/50",
  },
  purple: {
    iconBg: "bg-purple-100 dark:bg-purple-900/30",
    icon: "text-purple-600 dark:text-purple-400",
    border: "border-purple-200 dark:border-purple-900/50",
  },
  red: {
    iconBg: "bg-red-100 dark:bg-red-900/30",
    icon: "text-red-600 dark:text-red-400",
    border: "border-red-200 dark:border-red-900/50",
  },
  amber: {
    iconBg: "bg-amber-100 dark:bg-amber-900/30",
    icon: "text-amber-600 dark:text-amber-400",
    border: "border-amber-200 dark:border-amber-900/50",
  },
  cyan: {
    iconBg: "bg-cyan-100 dark:bg-cyan-900/30",
    icon: "text-cyan-600 dark:text-cyan-400",
    border: "border-cyan-200 dark:border-cyan-900/50",
  },
} as const

function DocCard({
  icon: Icon,
  title,
  description,
  href,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  href: string
  color: keyof typeof docColors
}) {
  const colors = docColors[color]
  return (
    <Link
      href={href}
      className={cn(
        "group flex gap-4 rounded-xl border p-4 transition-all",
        "hover:shadow-sm",
        colors.border
      )}
    >
      <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg", colors.iconBg)}>
        <Icon className={cn("h-5 w-5", colors.icon)} />
      </div>
      <div className="flex-1">
        <Row gap="xs" className="items-center">
          <Text weight="semibold">{title}</Text>
          <ArrowRightIcon className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
        </Row>
        <Text size="sm" variant="muted" className="mt-1 leading-relaxed">
          {description}
        </Text>
      </div>
    </Link>
  )
}

const quickColors = {
  emerald: "border-emerald-200 dark:border-emerald-900/50",
  cyan: "border-cyan-200 dark:border-cyan-900/50",
} as const

function QuickCard({
  title,
  description,
  href,
  cta,
  color,
}: {
  title: string
  description: string
  href: string
  cta: string
  color: keyof typeof quickColors
}) {
  return (
    <div className={cn("rounded-xl border p-5", quickColors[color])}>
      <Text weight="semibold">{title}</Text>
      <Text size="sm" variant="muted" className="mt-2 leading-relaxed">
        {description}
      </Text>
      <Link
        href={href}
        className="text-primary mt-3 inline-flex items-center gap-1 text-sm font-medium hover:underline"
      >
        {cta}
        <ArrowRightIcon className="h-4 w-4" />
      </Link>
    </div>
  )
}
