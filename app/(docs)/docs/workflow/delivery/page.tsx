/**
 * CATALYST - Delivery Cycles
 *
 * How to run effective delivery cycles. Understanding the rhythm
 * of Brief → Build → Review → Refine, and when to advance.
 */

import Link from "next/link"
import { Stack, Text, Row } from "@/components/core"
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  Repeat2Icon,
  ClipboardListIcon,
  HammerIcon,
  UsersIcon,
  RefreshCwIcon,
  TrendingUpIcon,
  LightbulbIcon,
  ClockIcon,
  CheckCircle2Icon,
  AlertTriangleIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function DeliveryPage() {
  return (
    <article>
      <Stack gap="xl">
        {/* Header */}
        <header className="space-y-3">
          <Row gap="sm" className="items-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-900/30">
              <Repeat2Icon className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              Delivery Cycles
            </h1>
          </Row>
          <Text size="lg" variant="muted" className="leading-relaxed">
            How Catalyst projects move forward. One cycle = one pass through the
            delivery loop. Run many cycles, advance when ready.
          </Text>
        </header>

        {/* What is a cycle */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">What is a delivery cycle?</h2>
          <Text size="sm" variant="muted" className="leading-relaxed">
            A delivery cycle is one complete pass through the four delivery phases:
            Brief → Build → Review → Refine. Most features take multiple cycles.
            Each cycle makes the work clearer, more validated, and closer to done.
          </Text>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <PhaseCard
              number={1}
              icon={ClipboardListIcon}
              name="Brief"
              description="Capture what you're building"
              checkpoint="Is intent clear enough to build?"
              color="violet"
            />
            <PhaseCard
              number={2}
              icon={HammerIcon}
              name="Build"
              description="Ship working software"
              checkpoint="Is it ready to show people?"
              color="emerald"
            />
            <PhaseCard
              number={3}
              icon={UsersIcon}
              name="Review"
              description="Get feedback on the real thing"
              checkpoint="Do we understand what to change?"
              color="amber"
            />
            <PhaseCard
              number={4}
              icon={RefreshCwIcon}
              name="Refine"
              description="Decide what changes"
              checkpoint="Loop again, or advance?"
              color="sky"
            />
          </div>
        </section>

        {/* How long is a cycle */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <ClockIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-xl font-semibold">How long is a cycle?</h2>
          </div>

          <Text size="sm" variant="muted" className="leading-relaxed">
            Short. Hours to days, not weeks. The goal is fast feedback, not
            perfect output. Each cycle validates assumptions and reduces risk.
          </Text>

          <div className="grid gap-4 md:grid-cols-3">
            <CycleDuration
              stage="POC"
              duration="2-4 hours"
              description="Quick proof cycles. Show something real fast."
            />
            <CycleDuration
              stage="MVP"
              duration="1-2 days"
              description="Feature cycles. Build, show, learn, repeat."
            />
            <CycleDuration
              stage="MMP/PROD"
              duration="2-5 days"
              description="Hardening cycles. Quality matters more here."
            />
          </div>
        </section>

        {/* The checkpoint rhythm */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Checkpoints within phases</h2>
          <Text size="sm" variant="muted" className="leading-relaxed">
            Each phase has a natural checkpoint — a moment to confirm you&apos;re
            ready to move on. These aren&apos;t formal gates; they&apos;re just
            good practice to keep delivery on track.
          </Text>

          <div className="space-y-3">
            <CheckpointCard
              phase="Brief"
              question="Is intent clear enough to build?"
              signs={[
                "You can explain what you're building in one sentence",
                "Success criteria are written down",
                "Stakeholders agree on scope for this cycle",
              ]}
              color="violet"
            />
            <CheckpointCard
              phase="Build"
              question="Is it ready to show people?"
              signs={[
                "The core flow works end-to-end",
                "It won't crash when stakeholders click around",
                "You know what feedback you're looking for",
              ]}
              color="emerald"
            />
            <CheckpointCard
              phase="Review"
              question="Do we understand what needs to change?"
              signs={[
                "Feedback is captured, not just heard",
                "You know which feedback to act on",
                "Stakeholders feel heard",
              ]}
              color="amber"
            />
            <CheckpointCard
              phase="Refine"
              question="Loop again, or advance?"
              signs={[
                "Brief is updated with learnings",
                "Next cycle scope is clear (if looping)",
                "Advance criteria are met (if advancing)",
              ]}
              color="sky"
            />
          </div>
        </section>

        {/* When to advance */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/20">
              <TrendingUpIcon className="text-primary h-5 w-5" />
            </div>
            <h2 className="text-xl font-semibold">When to advance</h2>
          </div>

          <Text size="sm" variant="muted" className="leading-relaxed">
            Advancing to the next stage is a deliberate decision. Most cycles
            loop back to Brief. Advance only when the work is validated and
            meets the expectations for the current stage.
          </Text>

          <div className="grid gap-4 md:grid-cols-2">
            <AdvanceCriteria variant="ready">
              <li>Core functionality is validated by stakeholders</li>
              <li>Quality expectations for current stage are met</li>
              <li>Team agrees the work is solid enough to harden</li>
              <li>Next stage requirements are understood</li>
            </AdvanceCriteria>
            <AdvanceCriteria variant="not-ready">
              <li>Major feedback hasn&apos;t been addressed</li>
              <li>Core flows are still unstable</li>
              <li>Stakeholders are requesting significant changes</li>
              <li>Quality doesn&apos;t meet stage expectations</li>
            </AdvanceCriteria>
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-950/20">
            <Row gap="sm" className="mb-2 items-center">
              <AlertTriangleIcon className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <Text size="sm" weight="medium">
                Advancing too early is the #1 cause of rework
              </Text>
            </Row>
            <Text size="sm" variant="muted">
              Run another cycle if you&apos;re unsure. The cost of one more
              cycle is much lower than hardening work that needs to change.
            </Text>
          </div>
        </section>

        {/* By stage */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Delivery by stage</h2>
          <Text size="sm" variant="muted">
            What &quot;good delivery&quot; looks like changes as you advance.
          </Text>

          <div className="space-y-3">
            <StageDelivery
              stage="POC"
              name="Proof of Concept"
              focus="Speed over polish"
              cycles="Many short cycles. Fail fast, learn fast."
              quality="Working demo, happy path only. Rough is fine."
            />
            <StageDelivery
              stage="MVP"
              name="Minimum Viable Product"
              focus="Validation over features"
              cycles="Longer cycles. Real users, real feedback."
              quality="Auth, data persistence, error handling."
            />
            <StageDelivery
              stage="MMP"
              name="Minimum Marketable Product"
              focus="Polish and reliability"
              cycles="Careful cycles. Design system, edge cases."
              quality="Performance, security, accessibility."
            />
            <StageDelivery
              stage="PROD"
              name="Production"
              focus="Stability and observability"
              cycles="Controlled cycles. Testing, monitoring, rollback."
              quality="SLAs, backups, incident response."
            />
          </div>
        </section>

        {/* Key insight */}
        <section className="rounded-xl border border-violet-200 bg-gradient-to-br from-violet-50 to-purple-50/50 p-5 dark:border-violet-900/50 dark:from-violet-950/20 dark:to-purple-950/10">
          <Row gap="sm" className="mb-3 items-center">
            <LightbulbIcon className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            <Text weight="semibold">The key insight</Text>
          </Row>
          <Text size="sm" variant="muted" className="leading-relaxed">
            Delivery isn&apos;t a straight line from idea to production.
            It&apos;s a loop you run many times, advancing only when
            the work is validated. The loop is the mechanism for building
            the right thing — not just building something.
          </Text>
        </section>

        {/* Navigation */}
        <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/docs/workflow/roles"
            className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Roles & Collaboration
          </Link>
          <Link
            href="/docs/workflow/poc"
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
          >
            POC Workflow
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

const phaseColors = {
  violet: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400 border-violet-200 dark:border-violet-800/50",
  emerald: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50",
  amber: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800/50",
  sky: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400 border-sky-200 dark:border-sky-800/50",
} as const

function PhaseCard({
  number,
  icon: Icon,
  name,
  description,
  checkpoint,
  color,
}: {
  number: number
  icon: React.ElementType
  name: string
  description: string
  checkpoint: string
  color: keyof typeof phaseColors
}) {
  return (
    <div className={cn("relative rounded-xl border p-4", phaseColors[color])}>
      <div className="absolute -top-2 -left-2 flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-bold shadow-sm dark:bg-background">
        {number}
      </div>
      <div className="space-y-2 pt-1">
        <Row gap="sm" className="items-center">
          <Icon className="h-4 w-4" />
          <Text weight="semibold">{name}</Text>
        </Row>
        <Text size="sm" className="opacity-80">{description}</Text>
        <Text size="xs" className="italic opacity-70">&quot;{checkpoint}&quot;</Text>
      </div>
    </div>
  )
}

function CycleDuration({
  stage,
  duration,
  description,
}: {
  stage: string
  duration: string
  description: string
}) {
  return (
    <div className="rounded-lg border bg-muted/30 p-4">
      <Row gap="sm" className="mb-2 items-baseline">
        <Text size="sm" weight="semibold">{stage}</Text>
        <Text size="sm" className="text-primary font-medium">{duration}</Text>
      </Row>
      <Text size="xs" variant="muted">{description}</Text>
    </div>
  )
}

const checkpointColors = {
  violet: "border-violet-200 dark:border-violet-800/50",
  emerald: "border-emerald-200 dark:border-emerald-800/50",
  amber: "border-amber-200 dark:border-amber-800/50",
  sky: "border-sky-200 dark:border-sky-800/50",
} as const

function CheckpointCard({
  phase,
  question,
  signs,
  color,
}: {
  phase: string
  question: string
  signs: string[]
  color: keyof typeof checkpointColors
}) {
  return (
    <div className={cn("rounded-lg border bg-muted/30 p-4", checkpointColors[color])}>
      <div className="mb-2 flex items-baseline justify-between">
        <Text size="sm" weight="medium">{phase}</Text>
        <Text size="sm" variant="muted" className="italic">&quot;{question}&quot;</Text>
      </div>
      <ul className="space-y-1">
        {signs.map((sign, i) => (
          <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
            <CheckCircle2Icon className="mt-0.5 h-3 w-3 shrink-0 text-emerald-500" />
            {sign}
          </li>
        ))}
      </ul>
    </div>
  )
}

function AdvanceCriteria({
  variant,
  children,
}: {
  variant: "ready" | "not-ready"
  children: React.ReactNode
}) {
  const styles = {
    ready: {
      border: "border-emerald-200 bg-emerald-50/50 dark:border-emerald-900/50 dark:bg-emerald-950/20",
      title: "text-emerald-700 dark:text-emerald-400",
      icon: CheckCircle2Icon,
      label: "Ready to advance",
    },
    "not-ready": {
      border: "border-amber-200 bg-amber-50/50 dark:border-amber-900/50 dark:bg-amber-950/20",
      title: "text-amber-700 dark:text-amber-400",
      icon: AlertTriangleIcon,
      label: "Not yet — keep looping",
    },
  }
  const config = styles[variant]
  const Icon = config.icon

  return (
    <div className={cn("rounded-xl border p-4", config.border)}>
      <Row gap="sm" className={cn("mb-3 items-center font-medium", config.title)}>
        <Icon className="h-4 w-4" />
        {config.label}
      </Row>
      <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
        {children}
      </ul>
    </div>
  )
}

function StageDelivery({
  stage,
  name,
  focus,
  cycles,
  quality,
}: {
  stage: string
  name: string
  focus: string
  cycles: string
  quality: string
}) {
  return (
    <div className="rounded-lg border bg-muted/30 p-4">
      <Row gap="sm" className="mb-2 items-center">
        <span className="rounded bg-muted px-2 py-0.5 text-xs font-bold">{stage}</span>
        <Text size="sm" weight="medium">{name}</Text>
      </Row>
      <div className="grid gap-2 text-sm text-muted-foreground md:grid-cols-3">
        <div>
          <Text size="xs" weight="medium" className="mb-0.5">Focus</Text>
          {focus}
        </div>
        <div>
          <Text size="xs" weight="medium" className="mb-0.5">Cycles</Text>
          {cycles}
        </div>
        <div>
          <Text size="xs" weight="medium" className="mb-0.5">Quality bar</Text>
          {quality}
        </div>
      </div>
    </div>
  )
}
