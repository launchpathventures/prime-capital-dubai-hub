/**
 * CATALYST - Coding Standards
 *
 * Coding conventions for Catalyst projects. Focuses on coding philosophy,
 * AI-friendly patterns, and repo conventions. Links to Audits for quality checks.
 */

import Link from "next/link"
import { Stack, Text, Row } from "@/components/core"
import {
  LightbulbIcon,
  BrainCircuitIcon,
  FileCodeIcon,
  ShieldAlertIcon,
  SettingsIcon,
  CheckCircleIcon,
  BookOpenIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function StandardsPage() {
  return (
    <article>
      <Stack gap="xl">
        {/* Header */}
        <header className="space-y-3">
          <h1 className="text-3xl font-bold tracking-tight">Standards</h1>
          <Text size="lg" variant="muted" className="leading-relaxed">
            Coding conventions for Catalyst projects. Clarity over cleverness.
          </Text>
        </header>

        {/* ================================================================ */}
        {/* Philosophy */}
        {/* ================================================================ */}
        <section className="rounded-xl border border-violet-200 bg-gradient-to-br from-violet-50 to-purple-50/50 p-5 dark:border-violet-900/50 dark:from-violet-950/20 dark:to-purple-950/10">
          <Row gap="sm" className="mb-3 items-center">
            <LightbulbIcon className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            <Text weight="semibold">Philosophy</Text>
          </Row>
          <Text size="sm" className="leading-relaxed text-violet-900 dark:text-violet-200">
            Catalyst prioritises <strong>clarity over cleverness</strong>. Code
            should be simple, explicit, and easy for both humans and AI to read
            and modify. No over-abstraction. No premature optimisation.
          </Text>
        </section>

        {/* ================================================================ */}
        {/* Core Rules */}
        {/* ================================================================ */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Core rules</h2>
          <div className="grid gap-3 md:grid-cols-2">
            <RuleCard
              icon={CheckCircleIcon}
              title="Keep it simple"
              description="No over-abstraction or over-engineering. Prefer straightforward solutions."
              color="emerald"
            />
            <RuleCard
              icon={CheckCircleIcon}
              title="Be explicit"
              description="Avoid implicit behavior. Name things clearly. Make types explicit."
              color="emerald"
            />
            <RuleCard
              icon={CheckCircleIcon}
              title="Document the why"
              description="Comments explain WHY, not what. Let the code speak for itself."
              color="emerald"
            />
            <RuleCard
              icon={CheckCircleIcon}
              title="Use consistent patterns"
              description="Same patterns throughout. Inconsistency confuses humans and AI."
              color="emerald"
            />
          </div>
        </section>

        {/* ================================================================ */}
        {/* AI-Friendly Code */}
        {/* ================================================================ */}
        <section className="space-y-4">
          <div>
            <Row gap="sm" className="items-center">
              <BrainCircuitIcon className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">AI-friendly code</h2>
            </Row>
            <Text size="sm" variant="muted" className="mt-1">
              Patterns that help AI agents understand and modify your code correctly.
            </Text>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <PrincipleCard
              title="Simple is better"
              description="Prefer straightforward solutions. AI struggles with clever abstractions and indirection."
            />
            <PrincipleCard
              title="Minimal abstraction"
              description="Only abstract when there's clear repetition. Don't preemptively abstract 'just in case'."
            />
            <PrincipleCard
              title="Good file structure"
              description="One concept per file. Clear naming. Logical folder organisation."
            />
            <PrincipleCard
              title="Explicit types"
              description="TypeScript types help AI understand intent. Avoid 'any' and implicit types."
            />
          </div>
        </section>

        {/* ================================================================ */}
        {/* File Headers */}
        {/* ================================================================ */}
        <section className="space-y-4">
          <div>
            <Row gap="sm" className="items-center">
              <FileCodeIcon className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">File headers</h2>
            </Row>
            <Text size="sm" variant="muted" className="mt-1">
              Every new file should include a header comment.
            </Text>
          </div>

          <div className="rounded-lg border bg-muted/30 p-4">
            <pre className="overflow-x-auto text-sm">
              <code>{`/**
 * CATALYST - {File Purpose}
 *
 * Brief description of what this file does.
 */`}</code>
            </pre>
          </div>

          <div className="space-y-3">
            <Text size="sm" variant="muted">
              UI components in <code className="bg-muted rounded px-1.5 py-0.5">components/ui/</code>{" "}
              include source tracking:
            </Text>
            <div className="rounded-lg border bg-muted/30 p-4">
              <pre className="overflow-x-auto text-sm">
                <code>{`/**
 * CATALYST - Button Component
 *
 * @source shadcn/ui v3.6.2 + @base-ui/react v1.0.0
 * @customised No — stock component
 */`}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* Configuration */}
        {/* ================================================================ */}
        <section className="space-y-4">
          <div>
            <Row gap="sm" className="items-center">
              <SettingsIcon className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Configuration</h2>
            </Row>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <ConfigCard
              file="lib/config.ts"
              description="App name, feature flags, external links. Never hardcode."
            />
            <ConfigCard
              file="lib/navigation.ts"
              description="Navigation items for all layouts. Data, not JSX."
            />
            <ConfigCard
              file="AGENTS.md"
              description="AI agent conventions. Point your agents here."
            />
            <ConfigCard
              file=".env.local"
              description="Environment variables. Copy from .env.example."
            />
          </div>
        </section>

        {/* ================================================================ */}
        {/* PR/Review by Stage */}
        {/* ================================================================ */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Review expectations</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-teal-200 bg-gradient-to-br from-teal-50 to-emerald-50/50 p-5 dark:border-teal-900/50 dark:from-teal-950/20 dark:to-emerald-950/10">
              <Text weight="semibold">POC stage</Text>
              <ul className="text-muted-foreground mt-2 space-y-1 text-sm">
                <li>• Lightweight review</li>
                <li>• Focus on "does it work?"</li>
                <li>• No blocking on style issues</li>
              </ul>
            </div>
            <div className="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-sky-50/50 p-5 dark:border-blue-900/50 dark:from-blue-950/20 dark:to-sky-950/10">
              <Text weight="semibold">MVP+ stages</Text>
              <ul className="text-muted-foreground mt-2 space-y-1 text-sm">
                <li>• Full code review required</li>
                <li>• Check for security issues</li>
                <li>• Verify test coverage</li>
                <li>• Enforce coding standards</li>
              </ul>
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* What NOT to do */}
        {/* ================================================================ */}
        <section className="space-y-4">
          <div>
            <Row gap="sm" className="items-center">
              <ShieldAlertIcon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <h2 className="text-xl font-semibold">What NOT to do</h2>
            </Row>
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-5 dark:border-amber-900/50 dark:bg-amber-950/10">
            <ul className="grid gap-2 md:grid-cols-2">
              <AntiPattern text="Over-abstract or over-engineer" />
              <AntiPattern text="Add defensive fallbacks without need" />
              <AntiPattern text="Invent scope beyond provided docs" />
              <AntiPattern text="Duplicate config values" />
              <AntiPattern text="Hardcode URLs — use config.links" />
              <AntiPattern text="Create new UI when components exist" />
            </ul>
          </div>
        </section>

        {/* ================================================================ */}
        {/* Quality reference */}
        {/* ================================================================ */}
        <section className="rounded-xl border border-sky-200 bg-gradient-to-br from-sky-50 to-cyan-50/50 p-5 dark:border-sky-900/50 dark:from-sky-950/20 dark:to-cyan-950/10">
          <Row gap="sm" className="mb-3 items-center">
            <BookOpenIcon className="h-5 w-5 text-sky-600 dark:text-sky-400" />
            <Text weight="semibold">Quality expectations by stage</Text>
          </Row>
          <Text size="sm" className="text-sky-900 dark:text-sky-200">
            Code quality requirements change as you progress from POC to Production.
            See the{" "}
            <Link href="/docs/audits/code" className="underline hover:no-underline">
              Code &amp; Testing Audit
            </Link>{" "}
            for stage-specific expectations and detailed checklists.
          </Text>
        </section>

        {/* ================================================================ */}
        {/* Reference */}
        {/* ================================================================ */}
        <section className="border-border rounded-xl border border-dashed p-5">
          <Text weight="medium" className="mb-2">Reference</Text>
          <Text size="sm" variant="muted">
            See{" "}
            <code className="bg-muted rounded px-1.5 py-0.5">AGENTS.md</code> in
            the repo root for the complete AI agent reference with all
            conventions, guardrails, and examples.
          </Text>
        </section>
      </Stack>
    </article>
  )
}

// =============================================================================
// Helper Components
// =============================================================================

const ruleColors = {
  emerald: {
    iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
    icon: "text-emerald-600 dark:text-emerald-400",
  },
} as const

function RuleCard({
  icon: Icon,
  title,
  description,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  color: keyof typeof ruleColors
}) {
  const colors = ruleColors[color]
  return (
    <div className="flex gap-3 rounded-lg border p-4">
      <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-md", colors.iconBg)}>
        <Icon className={cn("h-4 w-4", colors.icon)} />
      </div>
      <div>
        <Text weight="medium" size="sm">{title}</Text>
        <Text size="sm" variant="muted" className="mt-0.5">
          {description}
        </Text>
      </div>
    </div>
  )
}

function PrincipleCard({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="border-l-2 border-primary pl-4">
      <Text weight="medium" size="sm">{title}</Text>
      <Text size="sm" variant="muted" className="mt-0.5">
        {description}
      </Text>
    </div>
  )
}

function ConfigCard({
  file,
  description,
}: {
  file: string
  description: string
}) {
  return (
    <div className="rounded-lg border bg-muted/20 p-3">
      <code className="text-sm font-medium">{file}</code>
      <Text size="sm" variant="muted" className="mt-1">
        {description}
      </Text>
    </div>
  )
}

function AntiPattern({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2 text-sm text-amber-900 dark:text-amber-200">
      <span className="mt-0.5 text-amber-600 dark:text-amber-400">✗</span>
      {text}
    </li>
  )
}
