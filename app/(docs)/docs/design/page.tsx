/**
 * CATALYST - Design Overview
 *
 * Hub for design documentation. Covers the visual foundations, principles,
 * and patterns that make Catalyst interfaces feel cohesive and professional.
 */

import Link from "next/link"
import { Stack, Text, Row } from "@/components/core"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRightIcon,
  PaletteIcon,
  TypeIcon,
  LayoutGridIcon,
  SparklesIcon,
  EyeIcon,
  LightbulbIcon,
  SunIcon,
  MoonIcon,
  LayersIcon,
  ComponentIcon,
  CheckCircleIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function DesignPage() {
  return (
    <article>
      <Stack gap="xl">
        {/* Header */}
        <header className="space-y-3">
          <h1 className="text-3xl font-bold tracking-tight">Design</h1>
          <Text size="lg" variant="muted" className="leading-relaxed">
            Visual foundations for building consistent, accessible interfaces.
            From color tokens to layout patterns, everything you need to make
            Catalyst look and feel cohesive.
          </Text>
        </header>

        {/* ================================================================ */}
        {/* Design Principles */}
        {/* ================================================================ */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Principles</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <PrincipleCard
              title="Simple over clever"
              description="Prefer readable, obvious solutions. Avoid complex animations or interactions that don't add value."
              color="teal"
            />
            <PrincipleCard
              title="Consistent and predictable"
              description="Use the same patterns everywhere. Users and AI agents should be able to predict behavior."
              color="violet"
            />
            <PrincipleCard
              title="Accessible by default"
              description="All components follow ARIA patterns. Color contrast meets WCAG AA. Keyboard navigation works."
              color="amber"
            />
            <PrincipleCard
              title="AI-friendly"
              description="Components are easy for AI to understand and modify. No magic, no hidden behavior."
              color="sky"
            />
          </div>
        </section>

        {/* ================================================================ */}
        {/* Proof-Led UX */}
        {/* ================================================================ */}
        <section className="rounded-xl border border-violet-200 bg-gradient-to-br from-violet-50 to-purple-50/50 p-5 dark:border-violet-900/50 dark:from-violet-950/20 dark:to-purple-950/10">
          <Row gap="sm" className="mb-3 items-center">
            <LightbulbIcon className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            <Text weight="semibold">Proof-Led UX</Text>
          </Row>
          <Text size="sm" className="text-violet-900 dark:text-violet-200">
            In Catalyst, design supports validation. Every UI element should help
            stakeholders understand what&apos;s being built and make decisions.
            Polish is secondary to clarity at POC stage — invest in aesthetics
            as you progress toward production.
          </Text>
        </section>

        {/* ================================================================ */}
        {/* The Design System */}
        {/* ================================================================ */}
        <section className="space-y-4">
          <div>
            <Row gap="sm" className="items-center">
              <LayersIcon className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">The Design System</h2>
            </Row>
            <Text size="sm" variant="muted" className="mt-1">
              A layered approach to visual consistency.
            </Text>
          </div>

          <div className="rounded-xl border border-sky-200 bg-gradient-to-br from-sky-50 to-cyan-50/50 p-5 dark:border-sky-900/50 dark:from-sky-950/20 dark:to-cyan-950/10">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Row gap="xs" className="items-center">
                  <CheckCircleIcon className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                  <Text weight="medium" size="sm">CSS Variables (Tokens)</Text>
                </Row>
                <Text size="sm" variant="muted" className="mt-1">
                  Colors, spacing, and typography defined in globals.css. Change
                  a token, everything updates.
                </Text>
              </div>
              <div>
                <Row gap="xs" className="items-center">
                  <CheckCircleIcon className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                  <Text weight="medium" size="sm">Tailwind CSS 4</Text>
                </Row>
                <Text size="sm" variant="muted" className="mt-1">
                  Utility-first styling with CSS variable integration. Fast to
                  write, easy to maintain.
                </Text>
              </div>
              <div>
                <Row gap="xs" className="items-center">
                  <CheckCircleIcon className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                  <Text weight="medium" size="sm">shadcn/ui + base-ui</Text>
                </Row>
                <Text size="sm" variant="muted" className="mt-1">
                  Accessible, unstyled primitives. You own the code, not a
                  dependency.
                </Text>
              </div>
              <div>
                <Row gap="xs" className="items-center">
                  <CheckCircleIcon className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                  <Text weight="medium" size="sm">Dark Mode</Text>
                </Row>
                <Text size="sm" variant="muted" className="mt-1">
                  Class-based switching via next-themes. Variables adapt
                  automatically.
                </Text>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* Documentation */}
        {/* ================================================================ */}
        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Documentation</h2>
            <Text size="sm" variant="muted" className="mt-1">
              Everything you need to work with the design system.
            </Text>
          </div>

          {/* Featured: Customisation */}
          <Link
            href="/docs/design/customisation"
            className="group block rounded-xl border border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10 p-5 transition-colors hover:border-primary/50 hover:from-primary/10 hover:to-primary/15"
          >
            <Row gap="sm" className="mb-2 items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <SparklesIcon className="h-4 w-4 text-primary" />
              </div>
              <Text weight="semibold" className="group-hover:text-primary">
                Customisation
              </Text>
              <Badge variant="secondary" className="text-xs">Start here</Badge>
            </Row>
            <Text size="sm" variant="muted">
              Transform Catalyst into your project. Personality presets, colour palettes,
              border radius, typography, and more. Copy prompts, let AI do the work.
            </Text>
            <Row gap="xs" className="mt-3 items-center text-primary">
              <Text size="sm" weight="medium">Make it yours</Text>
              <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Row>
          </Link>

          <div className="grid gap-4 md:grid-cols-2">
            <DocCard
              icon={EyeIcon}
              title="Demo"
              description="Live preview of the entire design system. Great for validating changes at a glance."
              href="/docs/design/demo"
              color="violet"
            />
            <DocCard
              icon={PaletteIcon}
              title="Colours"
              description="Theme colors, semantic tokens, and usage guidelines. Where your brand lives."
              href="/docs/design/colors"
              color="pink"
            />
            <DocCard
              icon={TypeIcon}
              title="Typography"
              description="Font scales, text styles, and heading hierarchy. Words matter."
              href="/docs/design/typography"
              color="blue"
            />
            <DocCard
              icon={LayoutGridIcon}
              title="Layout"
              description="Spacing scale, page templates, and grid patterns. Structure for your UI."
              href="/docs/design/layout"
              color="emerald"
            />
            <DocCard
              icon={SparklesIcon}
              title="Patterns"
              description="Content patterns for websites, apps, and presentations. Narrative structures that work."
              href="/docs/design/content-patterns"
              color="amber"
            />
          </div>
        </section>

        {/* ================================================================ */}
        {/* Token Architecture */}
        {/* ================================================================ */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Token Architecture</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border p-5">
              <Text weight="semibold" size="sm">:root (Raw Values)</Text>
              <Text size="sm" variant="muted" className="mt-1">
                Color scales, spacing, and base values. AI can regenerate these
                from a palette.
              </Text>
              <div className="mt-3 rounded-lg bg-muted p-3">
                <code className="text-xs">--primary-500: oklch(0.65 0.2 180)</code>
              </div>
            </div>
            <div className="rounded-xl border p-5">
              <Text weight="semibold" size="sm">@theme (Semantic Tokens)</Text>
              <Text size="sm" variant="muted" className="mt-1">
                Maps raw values to meanings. Components reference these names.
              </Text>
              <div className="mt-3 rounded-lg bg-muted p-3">
                <code className="text-xs">--color-primary: var(--primary-500)</code>
              </div>
            </div>
          </div>
          <Text size="sm" variant="muted">
            See <code className="bg-muted rounded px-1.5 py-0.5">app/globals.css</code> for
            the complete token definitions.
          </Text>
        </section>

        {/* ================================================================ */}
        {/* Quick Start */}
        {/* ================================================================ */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Quick start</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <QuickCard
              title="Exploring the system?"
              description="Start with the Demo page to see everything in one place. Then dive into specific topics."
              href="/docs/design/demo"
              cta="View demo"
              color="violet"
            />
            <QuickCard
              title="Changing the theme?"
              description="Update tokens in globals.css, then check the Demo page to validate your changes."
              href="/docs/design/colors"
              cta="Colour tokens"
              color="pink"
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
                href="/docs/components"
                className="text-primary hover:underline"
              >
                Components
              </Link>{" "}
              — UI, Core, Shared, and Layout components
            </li>
            <li>
              <Link
                href="/docs/develop/standards"
                className="text-primary hover:underline"
              >
                Standards
              </Link>{" "}
              — Coding conventions and file structure
            </li>
            <li>
              <Link
                href="/docs/audits/experience"
                className="text-primary hover:underline"
              >
                Design &amp; Experience Audit
              </Link>{" "}
              — Quality checklist for UI polish
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

const principleColors = {
  amber: "bg-gradient-to-br from-amber-50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/10",
  teal: "bg-gradient-to-br from-teal-50 to-emerald-50/50 dark:from-teal-950/20 dark:to-emerald-950/10",
  violet: "bg-gradient-to-br from-violet-50 to-purple-50/50 dark:from-violet-950/20 dark:to-purple-950/10",
  sky: "bg-gradient-to-br from-sky-50 to-cyan-50/50 dark:from-sky-950/20 dark:to-cyan-950/10",
} as const

function PrincipleCard({
  title,
  description,
  color,
}: {
  title: string
  description: string
  color: keyof typeof principleColors
}) {
  return (
    <div className={cn("rounded-xl p-5", principleColors[color])}>
      <Text weight="semibold">{title}</Text>
      <Text size="sm" variant="muted" className="mt-2 leading-relaxed">
        {description}
      </Text>
    </div>
  )
}

const docColors = {
  violet: {
    iconBg: "bg-violet-100 dark:bg-violet-900/30",
    icon: "text-violet-600 dark:text-violet-400",
    border: "border-violet-200 dark:border-violet-900/50",
  },
  pink: {
    iconBg: "bg-pink-100 dark:bg-pink-900/30",
    icon: "text-pink-600 dark:text-pink-400",
    border: "border-pink-200 dark:border-pink-900/50",
  },
  blue: {
    iconBg: "bg-blue-100 dark:bg-blue-900/30",
    icon: "text-blue-600 dark:text-blue-400",
    border: "border-blue-200 dark:border-blue-900/50",
  },
  emerald: {
    iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
    icon: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-200 dark:border-emerald-900/50",
  },
  amber: {
    iconBg: "bg-amber-100 dark:bg-amber-900/30",
    icon: "text-amber-600 dark:text-amber-400",
    border: "border-amber-200 dark:border-amber-900/50",
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
  violet: "border-violet-200 dark:border-violet-900/50",
  pink: "border-pink-200 dark:border-pink-900/50",
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
