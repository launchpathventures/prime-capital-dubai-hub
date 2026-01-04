/**
 * CATALYST - Stacks
 *
 * Stack selection guide. Start simple, advance deliberately.
 */

import Link from "next/link"
import { Stack, Text, Row } from "@/components/core"
import {
  ArrowRightIcon,
  CheckIcon,
  XIcon,
  AlertTriangleIcon,
  LightbulbIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function StacksPage() {
  return (
    <article>
      <Stack gap="xl">
        {/* Header */}
        <header className="space-y-3">
          <h1 className="text-3xl font-bold tracking-tight">Stacks</h1>
          <Text size="lg" variant="muted" className="leading-relaxed">
            Pick the simplest stack that proves your idea works. Add complexity
            only when you need it.
          </Text>
        </header>

        {/* Why this matters */}
        <section className="border-border bg-muted/30 space-y-3 rounded-xl border p-5">
          <Row gap="sm" className="items-center">
            <LightbulbIcon className="h-5 w-5 text-amber-500" />
            <h2 className="font-semibold">Why start simple?</h2>
          </Row>
          <Text size="sm" variant="muted" className="leading-relaxed">
            Every technology you add is a decision you&apos;re committing to.
            Databases need migrations. Auth needs security reviews. APIs need
            documentation. If you don&apos;t need them yet, don&apos;t add them
            yet.
          </Text>
          <Text size="sm" variant="muted" className="leading-relaxed">
            The goal is to <strong>prove value fast</strong>, then upgrade
            deliberately when the proof justifies it.
          </Text>
        </section>

        {/* Stack A */}
        <StackSection
          badge="A"
          title="Next.js Only"
          subtitle="Prove the idea. No backend complexity."
          color="blue"
          includes={[
            "Next.js 16+ with App Router",
            "Tailwind CSS 4",
            "shadcn/ui components",
            "Mock data and static content",
          ]}
          useWhen={[
            "Testing if the concept works",
            "Validating UI/UX with stakeholders",
            "Marketing sites and landing pages",
            "Demos and presentations",
          ]}
          avoid={[
            "Adding a database 'just in case'",
            "Setting up auth before you need it",
            "Building API routes prematurely",
          ]}
        />

        {/* Stack B */}
        <StackSection
          badge="B"
          title="Next.js + Supabase"
          subtitle="Real users. Real data. Still simple."
          color="amber"
          includes={[
            "Everything in Stack A",
            "Supabase for auth and database",
            "Row-level security (data protection)",
            "Real-time updates",
            "File uploads and storage",
          ]}
          useWhen={[
            "Users need to log in",
            "Data needs to persist between sessions",
            "You need real-time features",
            "Users upload files",
          ]}
          avoid={[
            "Complex business logic in the database",
            "Heavy third-party integrations",
            "Background jobs that run for minutes",
          ]}
        />

        {/* Stack C */}
        <StackSection
          badge="C"
          title="Next.js + Laravel"
          subtitle="Complex backend. Full control."
          color="purple"
          includes={[
            "Everything in Stack A",
            "Laravel API backend",
            "Queues and background jobs",
            "Custom API design",
            "Advanced caching and performance",
          ]}
          useWhen={[
            "Complex business rules that don't fit in Supabase",
            "Many third-party API integrations",
            "Background processing (emails, reports, syncs)",
            "Custom auth requirements",
          ]}
          avoid={[
            "Over-engineering simple CRUD apps",
            "Choosing Laravel when Supabase would do",
          ]}
        />

        {/* Quick decision */}
        <section className="bg-muted/50 space-y-3 rounded-xl p-5">
          <h3 className="font-semibold">Quick decision</h3>
          <div className="space-y-2 text-sm">
            <Row gap="md" className="items-center">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-xs font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                A
              </span>
              <Text size="sm" variant="muted">
                No login? No saved data? → <strong>Stack A</strong>
              </Text>
            </Row>
            <Row gap="md" className="items-center">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-xs font-bold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                B
              </span>
              <Text size="sm" variant="muted">
                Users + database + standard features? →{" "}
                <strong>Stack B</strong>
              </Text>
            </Row>
            <Row gap="md" className="items-center">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-xs font-bold text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                C
              </span>
              <Text size="sm" variant="muted">
                Complex logic? Many integrations? → <strong>Stack C</strong>
              </Text>
            </Row>
          </div>
        </section>

        {/* Progressions */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">How stacks evolve</h2>
          <Text size="sm" variant="muted">
            Most projects start at A and advance when the proof justifies it.
          </Text>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl bg-gradient-to-br from-blue-50 to-amber-50/50 p-4 dark:from-blue-950/20 dark:to-amber-950/10">
              <Row gap="sm" className="mb-2 items-center">
                <span className="flex h-6 w-6 items-center justify-center rounded bg-blue-100 text-xs font-bold text-blue-700 dark:bg-blue-900/50 dark:text-blue-400">
                  A
                </span>
                <ArrowRightIcon className="h-4 w-4 text-muted-foreground" />
                <span className="flex h-6 w-6 items-center justify-center rounded bg-amber-100 text-xs font-bold text-amber-700 dark:bg-amber-900/50 dark:text-amber-400">
                  B
                </span>
                <Text size="sm" weight="medium" className="ml-1">
                  Most common
                </Text>
              </Row>
              <Text size="sm" variant="muted">
                Prove the concept first, then add users and persistence once
                you&apos;re confident it&apos;s worth building.
              </Text>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-blue-50 to-purple-50/50 p-4 dark:from-blue-950/20 dark:to-purple-950/10">
              <Row gap="sm" className="mb-2 items-center">
                <span className="flex h-6 w-6 items-center justify-center rounded bg-blue-100 text-xs font-bold text-blue-700 dark:bg-blue-900/50 dark:text-blue-400">
                  A
                </span>
                <ArrowRightIcon className="h-4 w-4 text-muted-foreground" />
                <span className="flex h-6 w-6 items-center justify-center rounded bg-purple-100 text-xs font-bold text-purple-700 dark:bg-purple-900/50 dark:text-purple-400">
                  C
                </span>
                <Text size="sm" weight="medium" className="ml-1">
                  Skip the middle
                </Text>
              </Row>
              <Text size="sm" variant="muted">
                If you know you need Laravel from day one (complex integrations,
                heavy backend), skip Supabase entirely.
              </Text>
            </div>
          </div>
          <div className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-900/50 dark:bg-amber-950/20">
            <AlertTriangleIcon className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <Text size="sm" variant="muted">
              <strong className="text-foreground">B → C is involved.</strong> If
              you start with Supabase and later need Laravel, you&apos;ll need
              to migrate your data. Plan carefully before choosing B if
              there&apos;s a strong chance you&apos;ll need stack C
              for a complex back-end.
            </Text>
          </div>
        </section>

        {/* Next step */}
        <section className="border-border flex items-center justify-between gap-4 rounded-xl border p-5">
          <div>
            <Text weight="medium">Ready to start?</Text>
            <Text size="sm" variant="muted">
              Find the right next step based on where you are now.
            </Text>
          </div>
          <Link
            href="/docs/core/what-next"
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex shrink-0 items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
          >
            What Next
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

const stackColors = {
  blue: {
    badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    border: "border-blue-200 dark:border-blue-900/50",
    bg: "bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-950/10",
  },
  amber: {
    badge:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    border: "border-amber-200 dark:border-amber-900/50",
    bg: "bg-gradient-to-br from-amber-50/50 to-transparent dark:from-amber-950/10",
  },
  purple: {
    badge:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    border: "border-purple-200 dark:border-purple-900/50",
    bg: "bg-gradient-to-br from-purple-50/50 to-transparent dark:from-purple-950/10",
  },
} as const

function StackSection({
  badge,
  title,
  subtitle,
  color,
  includes,
  useWhen,
  avoid,
}: {
  badge: string
  title: string
  subtitle: string
  color: keyof typeof stackColors
  includes: string[]
  useWhen: string[]
  avoid: string[]
}) {
  const colors = stackColors[color]

  return (
    <section
      className={cn("space-y-4 rounded-xl border p-5", colors.border, colors.bg)}
    >
      <div>
        <Row gap="md" className="mb-1 items-center">
          <div
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-lg text-lg font-bold",
              colors.badge
            )}
          >
            {badge}
          </div>
          <h2 className="text-xl font-semibold">{title}</h2>
        </Row>
        <Text size="sm" variant="muted" className="ml-11">
          {subtitle}
        </Text>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <ListBox title="Includes" items={includes} icon="check" />
        <ListBox title="Use when" items={useWhen} icon="arrow" />
        <ListBox title="Avoid" items={avoid} icon="x" />
      </div>
    </section>
  )
}

function ListBox({
  title,
  items,
  icon,
}: {
  title: string
  items: string[]
  icon: "check" | "arrow" | "x"
}) {
  const iconEl = {
    check: <CheckIcon className="h-3 w-3 text-emerald-600" />,
    arrow: <span className="text-primary text-xs">→</span>,
    x: <XIcon className="text-muted-foreground h-3 w-3" />,
  }

  return (
    <div>
      <Text size="xs" weight="medium" className="text-muted-foreground mb-2">
        {title}
      </Text>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-xs">
            <span className="mt-0.5 shrink-0">{iconEl[icon]}</span>
            <span className="text-muted-foreground">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
