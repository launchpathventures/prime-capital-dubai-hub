/**
 * CATALYST - What Next
 *
 * Navigation hub for new and returning Catalyst devs.
 * Clear paths forward plus quick access to common destinations.
 */

import Link from "next/link"
import { Stack, Text, Row } from "@/components/core"
import {
  FileTextIcon,
  TargetIcon,
  PaletteIcon,
  LayoutIcon,
  SettingsIcon,
  ArrowRightIcon,
  RocketIcon,
  BookOpenIcon,
  ZapIcon,
  CompassIcon,
  CheckCircle2Icon,
  CodeIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function WhatNextPage() {
  return (
    <article>
      <Stack gap="xl">
        {/* Header */}
        <header className="space-y-3">
          <h1 className="text-3xl font-bold tracking-tight">What next?</h1>
          <Text size="lg" variant="muted" className="leading-relaxed">
            You&apos;ve read the overview. Now it&apos;s time to build
            something.
          </Text>
        </header>

        {/* ================================================================ */}
        {/* Two paths for new devs */}
        {/* ================================================================ */}
        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Ready to start building?</h2>
            <Text size="sm" variant="muted" className="mt-1">
              Pick the path that matches your situation right now.
            </Text>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {/* Path 1: Jump into code */}
            <PathCard
              color="amber"
              icon={ZapIcon}
              title="Jump straight in"
              tagline="You know what you're building"
              description="Get the repo running, brief your AI with the starter prompt, and start building your proof. Most devs start here."
              steps={[
                {
                  label: "Run the Quickstart",
                  detail: "Clone, install, run locally in 5 minutes",
                },
                {
                  label: "Copy the starter prompt",
                  detail: "Brief your AI (Copilot, Cursor, etc.) on the project",
                },
                {
                  label: "Start building",
                  detail: "Pick a surface and build your first feature",
                },
              ]}
              cta={{ label: "Quickstart", href: "/docs/develop/setup" }}
            />

            {/* Path 2: Get aligned first */}
            <PathCard
              color="sky"
              icon={CompassIcon}
              title="Get aligned first"
              tagline="You need clarity before code"
              description="Run the project prompts to capture what you're building and why. Good for complex projects or multiple stakeholders."
              steps={[
                {
                  label: "Run the Vision prompt",
                  detail: "Capture the purpose and desired outcomes",
                },
                {
                  label: "Run Architecture & Voice",
                  detail: "Lock in technical approach and tone",
                },
                {
                  label: "Then start building",
                  detail: "Move into Quickstart with clear intent",
                },
              ]}
              cta={{ label: "Project prompts", href: "/docs/project/vision" }}
            />
          </div>
        </section>

        {/* ================================================================ */}
        {/* Quick tip */}
        {/* ================================================================ */}
        <section className="border-border bg-muted/30 rounded-xl border p-5">
          <Row gap="sm" className="mb-3 items-center">
            <CheckCircle2Icon className="h-5 w-5 text-emerald-500" />
            <Text weight="semibold">Not sure? Start with Quickstart.</Text>
          </Row>
          <Text size="sm" variant="muted" className="leading-relaxed">
            You can always run the project prompts later. The fastest way to
            learn Catalyst is to get the repo running and explore. The starter
            prompt gives your AI everything it needs to help you build.
          </Text>
        </section>

        {/* ================================================================ */}
        {/* For returning devs */}
        {/* ================================================================ */}
        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Already building?</h2>
            <Text size="sm" variant="muted" className="mt-1">
              Jump to what you need right now.
            </Text>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <DestinationCard
              icon={CodeIcon}
              color="violet"
              title="Coding Prompts"
              href="/docs/project/coding-prompts"
              description="Get the starter prompt for your AI assistant."
            />
            <DestinationCard
              icon={TargetIcon}
              color="teal"
              title="Workflow & Stages"
              href="/docs/workflow"
              description="Understand the delivery loop and maturity stages."
            />
            <DestinationCard
              icon={PaletteIcon}
              color="rose"
              title="Design System"
              href="/docs/design"
              description="Tokens, typography, layout patterns."
            />
            <DestinationCard
              icon={LayoutIcon}
              color="blue"
              title="Components"
              href="/docs/components"
              description="Use existing building blocks."
            />
            <DestinationCard
              icon={BookOpenIcon}
              color="amber"
              title="Surfaces"
              href="/docs/surfaces"
              description="Web, app, docs, and present surfaces."
            />
            <DestinationCard
              icon={SettingsIcon}
              color="emerald"
              title="Upgrade Checklists"
              href="/docs/develop/upgrade"
              description="What changes at each stage."
            />
          </div>
        </section>

        {/* ================================================================ */}
        {/* Back to overview / Glossary */}
        {/* ================================================================ */}
        <section className="grid gap-4 md:grid-cols-2">
          <Link
            href="/docs/core/glossary"
            className="border-border hover:border-primary/50 hover:bg-muted/30 group flex flex-col gap-2 rounded-xl border p-5 transition-colors"
          >
            <Text
              weight="medium"
              className="group-hover:text-primary transition-colors"
            >
              Need to look up a term?
            </Text>
            <Text size="sm" variant="muted">
              Key Catalyst terminology explained in everyday language.
            </Text>
            <Text
              size="sm"
              className="text-primary inline-flex items-center gap-1 font-medium"
            >
              View Glossary
              <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Text>
          </Link>
          <Link
            href="/docs"
            className="border-border hover:border-primary/50 hover:bg-muted/30 group flex flex-col gap-2 rounded-xl border p-5 transition-colors"
          >
            <Text
              weight="medium"
              className="group-hover:text-primary transition-colors"
            >
              Need the overview?
            </Text>
            <Text size="sm" variant="muted">
              Go back to understand what Catalyst is and how it works.
            </Text>
            <Text
              size="sm"
              className="text-primary inline-flex items-center gap-1 font-medium"
            >
              Introduction
              <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Text>
          </Link>
        </section>
      </Stack>
    </article>
  )
}

// =============================================================================
// Helper Components
// =============================================================================

const pathColors = {
  amber: {
    bg: "bg-gradient-to-br from-amber-50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/10",
    iconBg: "bg-amber-100 dark:bg-amber-900/30",
    icon: "text-amber-600 dark:text-amber-400",
    tagline: "text-amber-600 dark:text-amber-400",
    number: "bg-amber-200 text-amber-800 dark:bg-amber-800/50 dark:text-amber-300",
    cta: "bg-amber-600 hover:bg-amber-700 text-white",
  },
  sky: {
    bg: "bg-gradient-to-br from-sky-50 to-cyan-50/50 dark:from-sky-950/20 dark:to-cyan-950/10",
    iconBg: "bg-sky-100 dark:bg-sky-900/30",
    icon: "text-sky-600 dark:text-sky-400",
    tagline: "text-sky-600 dark:text-sky-400",
    number: "bg-sky-200 text-sky-800 dark:bg-sky-800/50 dark:text-sky-300",
    cta: "bg-sky-600 hover:bg-sky-700 text-white",
  },
} as const

function PathCard({
  color,
  icon: Icon,
  title,
  tagline,
  description,
  steps,
  cta,
}: {
  color: keyof typeof pathColors
  icon: React.ElementType
  title: string
  tagline: string
  description: string
  steps: { label: string; detail: string }[]
  cta: { label: string; href: string }
}) {
  const colors = pathColors[color]

  return (
    <div className={cn("flex flex-col rounded-xl p-5", colors.bg)}>
      {/* Header */}
      <div className="mb-4 flex items-start gap-3">
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
          <Text size="sm" className={colors.tagline}>
            {tagline}
          </Text>
        </div>
      </div>

      {/* Description */}
      <Text size="sm" variant="muted" className="mb-4 leading-relaxed">
        {description}
      </Text>

      {/* Steps */}
      <div className="mb-5 space-y-3">
        {steps.map((step, i) => (
          <div key={i} className="flex gap-3">
            <span
              className={cn(
                "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                colors.number
              )}
            >
              {i + 1}
            </span>
            <div>
              <Text size="sm" weight="medium">
                {step.label}
              </Text>
              <Text size="xs" variant="muted">
                {step.detail}
              </Text>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <Link
        href={cta.href}
        className={cn(
          "mt-auto inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
          colors.cta
        )}
      >
        {cta.label}
        <ArrowRightIcon className="h-4 w-4" />
      </Link>
    </div>
  )
}

const destinationColors = {
  violet: {
    iconBg: "bg-violet-100 dark:bg-violet-900/30",
    icon: "text-violet-600 dark:text-violet-400",
  },
  teal: {
    iconBg: "bg-teal-100 dark:bg-teal-900/30",
    icon: "text-teal-600 dark:text-teal-400",
  },
  rose: {
    iconBg: "bg-rose-100 dark:bg-rose-900/30",
    icon: "text-rose-600 dark:text-rose-400",
  },
  blue: {
    iconBg: "bg-blue-100 dark:bg-blue-900/30",
    icon: "text-blue-600 dark:text-blue-400",
  },
  amber: {
    iconBg: "bg-amber-100 dark:bg-amber-900/30",
    icon: "text-amber-600 dark:text-amber-400",
  },
  emerald: {
    iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
    icon: "text-emerald-600 dark:text-emerald-400",
  },
} as const

function DestinationCard({
  icon: Icon,
  title,
  href,
  description,
  color,
}: {
  icon: React.ElementType
  title: string
  href: string
  description: string
  color?: keyof typeof destinationColors
}) {
  const colors = color ? destinationColors[color] : null

  return (
    <Link
      href={href}
      className="border-border hover:border-primary/50 hover:bg-muted/30 group flex gap-3 rounded-xl border p-4 transition-colors"
    >
      <div
        className={cn(
          "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors",
          colors ? colors.iconBg : "bg-muted"
        )}
      >
        <Icon
          className={cn(
            "h-4 w-4 transition-colors",
            colors ? colors.icon : "text-muted-foreground group-hover:text-primary"
          )}
        />
      </div>
      <div>
        <Text
          weight="medium"
          className="group-hover:text-primary transition-colors"
        >
          {title}
        </Text>
        <Text size="sm" variant="muted" className="mt-0.5">
          {description}
        </Text>
      </div>
    </Link>
  )
}
