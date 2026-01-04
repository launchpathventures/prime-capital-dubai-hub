/**
 * CATALYST - POC Delivery Rhythm
 *
 * The standard 1-week cadence for delivering a validated proof of concept.
 * Detailed activities, meetings, and decision capture templates.
 */

import Link from "next/link"
import { Stack, Text, Row } from "@/components/core"
import {
  ArrowRightIcon,
  ArrowLeftIcon,
  CheckCircle2Icon,
  AlertTriangleIcon,
  BotIcon,
  PaletteIcon,
  UsersIcon,
  CalendarIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function POCWorkflowPage() {
  return (
    <article>
      <Stack gap="xl">
        {/* Breadcrumb */}
        <Link
          href="/docs/workflow"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm"
        >
          <ArrowLeftIcon className="h-3.5 w-3.5" />
          Back to Workflow
        </Link>

        {/* Header */}
        <header className="space-y-3">
          <Row gap="sm" className="items-center">
            <span className="rounded-lg bg-blue-100 px-2.5 py-1 text-sm font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
              POC
            </span>
            <h1 className="text-3xl font-bold tracking-tight">
              POC Workflow
            </h1>
          </Row>
          <Text size="lg" variant="muted" className="leading-relaxed">
            Validate the idea works. Ship something stakeholders can see and
            steer on. Rough is fine — speed over polish.
          </Text>
        </header>

        {/* Purpose Section */}
        <section className="border-border bg-muted/30 rounded-xl border p-5">
          <Text weight="semibold" className="mb-2">
            What you&apos;re proving
          </Text>
          <Text size="sm" variant="muted" className="leading-relaxed">
            A POC answers the question: &quot;Does this idea work?&quot; You&apos;re
            not building a product yet — you&apos;re building enough to make a
            decision. Ship something stakeholders can see and steer on.
          </Text>
        </section>

        {/* Quick summary */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Overview</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border p-4">
              <Row gap="sm" className="mb-2 items-center">
                <UsersIcon className="h-4 w-4 text-blue-600" />
                <Text weight="medium">Who it&apos;s for</Text>
              </Row>
              <Text size="sm" variant="muted">
                Stakeholders and decision makers. Show them working software
                so they can make informed decisions about what to build next.
              </Text>
            </div>
            <div className="rounded-xl border p-4">
              <Row gap="sm" className="mb-2 items-center">
                <CalendarIcon className="h-4 w-4 text-blue-600" />
                <Text weight="medium">Typical duration</Text>
              </Row>
              <Text size="sm" variant="muted">
                3-5 days with AI assistance. Compress or extend as needed,
                but keep the sequence. Speed is the priority.
              </Text>
            </div>
          </div>
        </section>

        {/* Day-by-day rhythm */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">The rhythm</h2>
          <div className="space-y-3">
            <DayBlock
              day="Day 1"
              title="Workshop"
              color="blue"
              activities={[
                "Capture context, requirements, and constraints",
                "Identify key stakeholders and decision makers",
                "Define success criteria for the POC",
                "Agree on scope boundaries",
              ]}
            />
            <DayBlock
              day="Day 1-2"
              title="Stress Test + Artefacts"
              color="violet"
              activities={[
                "Project Agent stress tests requirements",
                "Challenge assumptions and identify gaps",
                "Produce Vision document",
                "Produce Architecture document",
                "Produce Requirements (Phase 1)",
                "Create initial State of Play",
              ]}
            />
            <DayBlock
              day="Day 2-4"
              title="Build POC"
              color="amber"
              activities={[
                "Coding Agent proposes phase plan",
                "Build against agreed scope with Stack A",
                "Daily check-ins on progress",
                "Update State of Play as decisions are made",
              ]}
            />
            <DayBlock
              day="Day 4-5"
              title="Client Review + Steering"
              color="teal"
              activities={[
                "Live review session with stakeholders",
                "Demonstrate working proof",
                "Capture feedback and decisions",
                "Adjust scope for next phase if needed",
              ]}
            />
            <DayBlock
              day="Day 5+"
              title="User Feedback (Optional)"
              color="rose"
              activities={[
                "Test with representative users",
                "Gather feedback on core assumptions",
                "Validate UX decisions",
                "Document findings in State of Play",
              ]}
            />
          </div>
        </section>

        {/* AI Patterns */}
        <section className="rounded-xl border border-blue-200 bg-blue-50 p-5 dark:border-blue-900/50 dark:bg-blue-950/20">
          <Row gap="sm" className="mb-3 items-center">
            <BotIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <Text weight="semibold">AI-assisted development patterns</Text>
          </Row>
          <div className="space-y-2 text-sm text-blue-900 dark:text-blue-200">
            <p>
              <strong>AI builds fast:</strong> Let the Coding Agent generate
              the initial proof. Focus on the core flow, not edge cases.
            </p>
            <p>
              <strong>Human reviews for intent:</strong> Check that what&apos;s
              built matches what stakeholders expect. Alignment over perfection.
            </p>
            <p>
              <strong>Iterate quickly:</strong> AI can regenerate entire
              features in minutes. Don&apos;t get attached to code.
            </p>
          </div>
        </section>

        {/* Meeting Cadence */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Meeting cadence</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <MeetingCard
              name="Workshop"
              frequency="Start of project"
              duration="2-3 hours"
              attendees={["Project Lead", "Client stakeholders", "Project Agent"]}
              purpose="Capture context and requirements. Define scope."
            />
            <MeetingCard
              name="Client Review"
              frequency="End of each phase"
              duration="1-2 hours"
              attendees={["Project Lead", "Client stakeholders", "Demo of work"]}
              purpose="Review progress. Make decisions. Steer next phase."
            />
            <MeetingCard
              name="Daily Check-in"
              frequency="During build"
              duration="15 min"
              attendees={["Project Lead", "Coding Agent/Dev"]}
              purpose="Progress update. Blockers. Quick decisions."
            />
            <MeetingCard
              name="Follow-up Workshop"
              frequency="As needed"
              duration="1-2 hours"
              attendees={["Project Lead", "Client", "Project Agent"]}
              purpose="Address scope changes. Clarify requirements."
            />
          </div>
        </section>

        {/* Quality Bar */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Quality bar</h2>
          <Text size="sm" variant="muted">
            What &quot;good enough&quot; looks like at POC stage:
          </Text>
          <div className="grid gap-3 sm:grid-cols-2">
            <QualityItem text="Mock data is acceptable" />
            <QualityItem text="UI polish is secondary to function" />
            <QualityItem text="Error handling can be basic" />
            <QualityItem text="No authentication required" />
            <QualityItem text="Speed over completeness" />
            <QualityItem text="Core flow working end-to-end" />
          </div>
        </section>

        {/* Boundaries */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Boundaries</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-success/30 bg-success/5 p-4">
              <h4 className="mb-2 font-medium text-success">Allowed</h4>
              <ul className="text-muted-foreground space-y-1 text-sm">
                <li>• Hardcoded data</li>
                <li>• Simplified UI</li>
                <li>• Missing edge case handling</li>
                <li>• No tests (acceptable, not recommended)</li>
                <li>• Rough design and layout</li>
              </ul>
            </div>
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
              <h4 className="mb-2 font-medium text-destructive">Not Allowed</h4>
              <ul className="text-muted-foreground space-y-1 text-sm">
                <li>• Real user data</li>
                <li>• Production deployment</li>
                <li>• Public URLs without protection</li>
                <li>• Building beyond agreed scope</li>
                <li>• Feature creep</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Anti-Patterns */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Anti-patterns to avoid</h2>
          <div className="space-y-3">
            <AntiPatternItem
              title="Building features beyond scope"
              description="Stick to what was agreed. More features = more time = less validation."
            />
            <AntiPatternItem
              title="Premature optimization"
              description="Don't worry about performance yet. If it's slow, that's fine for a POC."
            />
            <AntiPatternItem
              title="Setting up production infrastructure"
              description="This is a proof, not a deployment. Keep infrastructure minimal."
            />
            <AntiPatternItem
              title="Creating real user accounts"
              description="POCs don't need auth. Use mock users or skip login entirely."
            />
          </div>
        </section>

        {/* When to run follow-up workshop */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">When to run a follow-up workshop</h2>
          <Text size="sm" variant="muted">
            Not every change needs a workshop. Use this guide:
          </Text>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/20">
              <h4 className="mb-2 font-semibold text-emerald-700 dark:text-emerald-400">
                Workshop NOT needed
              </h4>
              <ul className="space-y-1 text-sm text-emerald-800 dark:text-emerald-300">
                <li className="flex gap-2">
                  <CheckCircle2Icon className="mt-0.5 h-4 w-4 shrink-0" />
                  Minor scope adjustments within phase
                </li>
                <li className="flex gap-2">
                  <CheckCircle2Icon className="mt-0.5 h-4 w-4 shrink-0" />
                  UI/UX refinements
                </li>
                <li className="flex gap-2">
                  <CheckCircle2Icon className="mt-0.5 h-4 w-4 shrink-0" />
                  Bug fixes or polish
                </li>
                <li className="flex gap-2">
                  <CheckCircle2Icon className="mt-0.5 h-4 w-4 shrink-0" />
                  Technical implementation decisions
                </li>
              </ul>
            </div>
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-950/20">
              <h4 className="mb-2 font-semibold text-amber-700 dark:text-amber-400">
                Workshop needed
              </h4>
              <ul className="space-y-1 text-sm text-amber-800 dark:text-amber-300">
                <li className="flex gap-2">
                  <AlertTriangleIcon className="mt-0.5 h-4 w-4 shrink-0" />
                  Major scope change
                </li>
                <li className="flex gap-2">
                  <AlertTriangleIcon className="mt-0.5 h-4 w-4 shrink-0" />
                  New stakeholders with different priorities
                </li>
                <li className="flex gap-2">
                  <AlertTriangleIcon className="mt-0.5 h-4 w-4 shrink-0" />
                  Pivot in product direction
                </li>
                <li className="flex gap-2">
                  <AlertTriangleIcon className="mt-0.5 h-4 w-4 shrink-0" />
                  Significant assumption proven wrong
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Promotion Criteria */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Promotion to MVP</h2>
          <Text size="sm" variant="muted">
            Before moving to MVP stage, verify:
          </Text>
          <div className="rounded-xl border p-4">
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle2Icon className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                <span>Stakeholder approval to proceed</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2Icon className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                <span>Core flows validated with stakeholders</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2Icon className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                <span>Learnings documented in State of Play</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2Icon className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                <span>
                  <Link href="/docs/workflow/delivery" className="text-primary hover:underline">
                    Refine checkpoint
                  </Link>{" "}
                  passed
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2Icon className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                <span>Decision to invest in MVP stage documented</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Live Steering */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">How to run live steering</h2>
          <Text size="sm" variant="muted">
            The client review is not just a demo — it&apos;s a decision-making
            session. Here&apos;s how to run it:
          </Text>
          <div className="space-y-3">
            <SteeringStep
              number={1}
              title="Set expectations upfront"
              description="&quot;We'll show progress, then make decisions together about next steps.&quot;"
            />
            <SteeringStep
              number={2}
              title="Demo working software"
              description="Show the actual product, not slides. Let stakeholders interact if possible."
            />
            <SteeringStep
              number={3}
              title="Capture feedback live"
              description="Have State of Play open. Add decisions as they're made."
            />
            <SteeringStep
              number={4}
              title="Force decisions"
              description="&quot;Given what you've seen, should we proceed, adjust scope, or pause?&quot;"
            />
            <SteeringStep
              number={5}
              title="Summarise before ending"
              description="Read back decisions. Confirm next actions. Share updated State of Play."
            />
          </div>
        </section>

        {/* Decision Capture */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Capturing decisions</h2>
          <Text size="sm" variant="muted">
            Every decision should be captured durably. Use the State of Play
            document as the single source of truth.
          </Text>
          <div className="rounded-xl border bg-muted/30 p-5">
            <Text weight="medium" className="mb-3">
              Decision entry template
            </Text>
            <pre className="overflow-x-auto rounded-lg bg-background p-4 text-sm text-muted-foreground">
{`## Decision: [Brief title]
- **Date:** YYYY-MM-DD
- **Context:** Why this decision was needed
- **Decision:** What was decided
- **Rationale:** Why this option was chosen
- **Impact:** What changes as a result
- **Owner:** Who is responsible for action`}
            </pre>
          </div>
        </section>

        {/* Roles Summary */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Roles in POC delivery</h2>
          <div className="grid gap-3">
            <RoleRow
              role="Project Lead"
              responsibilities="Runs meetings. Makes scope calls. Approves phases."
            />
            <RoleRow
              role="Project Agent"
              responsibilities="Stress tests. Produces artefacts. Challenges assumptions."
            />
            <RoleRow
              role="Coding Agent"
              responsibilities="Proposes phase plans. Builds. Maintains quality."
            />
            <RoleRow
              role="Client"
              responsibilities="Provides context. Reviews progress. Makes decisions."
            />
          </div>
          <Text size="sm" variant="muted">
            See{" "}
            <Link
              href="/docs/workflow/roles"
              className="text-primary hover:underline"
            >
              Roles & Collaboration
            </Link>{" "}
            for detailed role definitions.
          </Text>
        </section>

        {/* Key Principle */}
        <section className="rounded-xl border border-primary/20 bg-primary/5 p-5">
          <Text weight="semibold" className="mb-2">
            Key principle
          </Text>
          <Text size="sm" variant="muted">
            Different AIs should own different responsibilities. A single agent
            trying to handle context, scope, code, and sequencing produces
            inconsistent results. Separate Project Agent and Coding Agent roles.
          </Text>
        </section>

        {/* Design System callout */}
        <section className="rounded-xl border border-violet-200 bg-gradient-to-br from-violet-50 to-purple-50/50 p-5 dark:border-violet-900/50 dark:from-violet-950/20 dark:to-purple-950/10">
          <Row gap="sm" className="mb-3 items-center">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-900/30">
              <PaletteIcon className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            </div>
            <Text weight="semibold">Design at POC</Text>
          </Row>
          <Text size="sm" variant="muted" className="mb-3 leading-relaxed">
            Use design system basics (spacing, typography) but don&apos;t polish.
            The goal is to validate the idea, not to win design awards.
          </Text>
          <Link
            href="/docs/design"
            className="text-primary inline-flex items-center gap-1 text-sm font-medium hover:underline"
          >
            Explore the Design System
            <ArrowRightIcon className="h-3.5 w-3.5" />
          </Link>
        </section>

        {/* Navigation */}
        <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/docs/workflow"
            className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Workflow Overview
          </Link>
          <Link
            href="/docs/workflow/mvp"
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
          >
            MVP Workflow
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

const dayColors = {
  blue: {
    badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    border: "border-blue-200 dark:border-blue-900/50",
  },
  violet: {
    badge: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
    border: "border-violet-200 dark:border-violet-900/50",
  },
  amber: {
    badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    border: "border-amber-200 dark:border-amber-900/50",
  },
  teal: {
    badge: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
    border: "border-teal-200 dark:border-teal-900/50",
  },
  rose: {
    badge: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
    border: "border-rose-200 dark:border-rose-900/50",
  },
  emerald: {
    badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    border: "border-emerald-200 dark:border-emerald-900/50",
  },
} as const

function DayBlock({
  day,
  title,
  color,
  activities,
}: {
  day: string
  title: string
  color: keyof typeof dayColors
  activities: string[]
}) {
  const colors = dayColors[color]

  return (
    <div className={cn("flex gap-4 rounded-xl border p-4", colors.border)}>
      <div className="shrink-0">
        <span className={cn("rounded-lg px-2.5 py-1 text-xs font-semibold", colors.badge)}>
          {day}
        </span>
      </div>
      <div>
        <h4 className="font-semibold">{title}</h4>
        <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
          {activities.map((activity, i) => (
            <li key={i}>• {activity}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function MeetingCard({
  name,
  frequency,
  duration,
  attendees,
  purpose,
}: {
  name: string
  frequency: string
  duration: string
  attendees: string[]
  purpose: string
}) {
  return (
    <div className="rounded-xl border p-4">
      <h4 className="font-semibold">{name}</h4>
      <div className="mt-2 space-y-1 text-sm text-muted-foreground">
        <p>
          <strong className="text-foreground">When:</strong> {frequency}
        </p>
        <p>
          <strong className="text-foreground">Duration:</strong> {duration}
        </p>
        <p>
          <strong className="text-foreground">Who:</strong> {attendees.join(", ")}
        </p>
        <p className="mt-2">{purpose}</p>
      </div>
    </div>
  )
}

function SteeringStep({
  number,
  title,
  description,
}: {
  number: number
  title: string
  description: string
}) {
  return (
    <div className="flex gap-4">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
        {number}
      </div>
      <div className="pt-0.5">
        <Text weight="medium">{title}</Text>
        <Text size="sm" variant="muted" className="mt-0.5">
          {description}
        </Text>
      </div>
    </div>
  )
}

function RoleRow({
  role,
  responsibilities,
}: {
  role: string
  responsibilities: string
}) {
  return (
    <div className="flex gap-4 rounded-xl border p-4">
      <span className="shrink-0 font-medium">{role}</span>
      <span className="text-sm text-muted-foreground">{responsibilities}</span>
    </div>
  )
}

function QualityItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border p-3">
      <CheckCircle2Icon className="h-4 w-4 shrink-0 text-blue-500" />
      <Text size="sm">{text}</Text>
    </div>
  )
}

function AntiPatternItem({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="flex gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900/50 dark:bg-blue-950/20">
      <AlertTriangleIcon className="mt-0.5 h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />
      <div>
        <Text weight="medium" className="text-blue-900 dark:text-blue-200">
          {title}
        </Text>
        <Text size="sm" className="mt-0.5 text-blue-800 dark:text-blue-300">
          {description}
        </Text>
      </div>
    </div>
  )
}
