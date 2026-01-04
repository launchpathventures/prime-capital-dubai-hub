/**
 * CATALYST - MVP Workflow
 *
 * Stage-specific guidance for running an MVP: real users, real data,
 * core flows working with auth and persistence.
 */

import Link from "next/link"
import { Stack, Text, Row } from "@/components/core"
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  UsersIcon,
  CalendarIcon,
  CheckCircle2Icon,
  AlertTriangleIcon,
  BotIcon,
  PaletteIcon,
} from "lucide-react"

export default function MVPWorkflowPage() {
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
            <span className="rounded-lg bg-amber-100 px-2.5 py-1 text-sm font-bold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
              MVP
            </span>
            <h1 className="text-3xl font-bold tracking-tight">MVP Workflow</h1>
          </Row>
          <Text size="lg" variant="muted" className="leading-relaxed">
            Real users, real feedback. Core flows working with authentication
            and persistence. Polish is optional — learning is mandatory.
          </Text>
        </header>

        {/* Purpose Section */}
        <section className="border-border bg-muted/30 rounded-xl border p-5">
          <Text weight="semibold" className="mb-2">
            What you&apos;re proving
          </Text>
          <Text size="sm" variant="muted" className="leading-relaxed">
            An MVP validates product-market fit with real users. You&apos;re
            no longer testing if the idea works — you&apos;re testing if people
            will use it. Core flows must work reliably, but polish comes later.
          </Text>
        </section>

        {/* Quick summary */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Overview</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border p-4">
              <Row gap="sm" className="mb-2 items-center">
                <UsersIcon className="h-4 w-4 text-amber-600" />
                <Text weight="medium">Who it&apos;s for</Text>
              </Row>
              <Text size="sm" variant="muted">
                Early adopters and beta users willing to provide feedback. Not
                yet for paying customers.
              </Text>
            </div>
            <div className="rounded-xl border p-4">
              <Row gap="sm" className="mb-2 items-center">
                <CalendarIcon className="h-4 w-4 text-amber-600" />
                <Text weight="medium">Typical duration</Text>
              </Row>
              <Text size="sm" variant="muted">
                2-4 weeks depending on scope complexity. With AI assistance,
                teams often ship MVP features 40-60% faster than traditional
                development.
              </Text>
            </div>
          </div>
        </section>

        {/* Cadence */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Meeting cadence</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <CadenceCard
              frequency="Daily"
              meeting="Standup"
              description="15-min check-in on progress, blockers, and decisions needed."
            />
            <CadenceCard
              frequency="Twice weekly"
              meeting="Demo & feedback"
              description="Show progress to stakeholders. Capture feedback live."
            />
            <CadenceCard
              frequency="Weekly"
              meeting="User testing"
              description="Watch real users interact with the product. Note friction points."
            />
            <CadenceCard
              frequency="End of sprint"
              meeting="Retrospective"
              description="Review what worked, what didn't. Adjust for next sprint."
            />
          </div>
        </section>

        {/* Key Activities */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Key activities</h2>
          <div className="space-y-3">
            <ActivityItem
              number={1}
              title="Add authentication and data persistence"
              description="Move from mock data to real persistence. Add Supabase (or your chosen backend) for auth and database. Real users need real accounts."
            />
            <ActivityItem
              number={2}
              title="Implement core happy paths"
              description="Focus on the 2-3 flows that define your product. Everything else waits."
            />
            <ActivityItem
              number={3}
              title="Deploy to staging environment"
              description="Get the app running somewhere users can access. Configure basic environment separation."
            />
            <ActivityItem
              number={4}
              title="Onboard early users for feedback"
              description="Recruit 5-10 beta users. Watch them use the product. Gather qualitative feedback."
            />
            <ActivityItem
              number={5}
              title="Iterate based on feedback"
              description="Prioritize fixes that unblock core flows. Document edge cases for later."
            />
          </div>
        </section>

        {/* AI Patterns */}
        <section className="rounded-xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-900/50 dark:bg-amber-950/20">
          <Row gap="sm" className="mb-3 items-center">
            <BotIcon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            <Text weight="semibold">AI-assisted development patterns</Text>
          </Row>
          <div className="space-y-2 text-sm text-amber-900 dark:text-amber-200">
            <p>
              <strong>AI handles boilerplate:</strong> Auth flows, CRUD
              operations, form validation — let AI generate the standard
              patterns.
            </p>
            <p>
              <strong>Human focuses on UX decisions:</strong> Flow logic, error
              messages, edge case handling — these need human judgment.
            </p>
            <p>
              <strong>Review velocity is high:</strong> AI can produce code
              faster than you can review. Batch reviews by feature, not by
              commit.
            </p>
          </div>
        </section>

        {/* Quality Bar */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Quality bar</h2>
          <Text size="sm" variant="muted">
            What &quot;good enough&quot; looks like at MVP stage:
          </Text>
          <div className="grid gap-3 sm:grid-cols-2">
            <QualityItem text="Real data persistence (no more mock data)" />
            <QualityItem text="User authentication working" />
            <QualityItem text="Core happy paths tested" />
            <QualityItem text="Basic error handling in place" />
            <QualityItem text="Responsive design (works on mobile)" />
            <QualityItem text="Security fundamentals (no SQL injection, XSS)" />
          </div>
        </section>

        {/* Boundaries */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Boundaries</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-success/30 bg-success/5 p-4">
              <h4 className="mb-2 font-medium text-success">Allowed</h4>
              <ul className="text-muted-foreground space-y-1 text-sm">
                <li>• Limited feature set (core flows only)</li>
                <li>• Basic analytics (page views, key events)</li>
                <li>• Manual operational tasks</li>
                <li>• Minimal documentation</li>
                <li>• Some rough edges in UI</li>
              </ul>
            </div>
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
              <h4 className="mb-2 font-medium text-destructive">Not Allowed</h4>
              <ul className="text-muted-foreground space-y-1 text-sm">
                <li>• Known security vulnerabilities</li>
                <li>• Data loss scenarios</li>
                <li>• Missing core features</li>
                <li>• Broken authentication flows</li>
                <li>• No way to provide feedback</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Anti-Patterns */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Anti-patterns to avoid</h2>
          <div className="space-y-3">
            <AntiPatternItem
              title="Feature creep beyond core"
              description="You can always add more later. Ship the minimum that validates your hypothesis."
            />
            <AntiPatternItem
              title="Premature scaling"
              description="Optimizing for 10,000 users when you have 10 is waste. Focus on learning, not scaling."
            />
            <AntiPatternItem
              title="Over-engineering solutions"
              description="Simple beats clever. Avoid complex architectures until you know what you're building."
            />
            <AntiPatternItem
              title="Building admin before user features"
              description="Users come first. Admin panels can be manual or minimal until users are happy."
            />
          </div>
        </section>

        {/* Promotion Criteria */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Promotion to MMP</h2>
          <Text size="sm" variant="muted">
            Before moving to MMP stage, verify:
          </Text>
          <div className="rounded-xl border p-4">
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle2Icon className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                <span>Core features complete and working reliably</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2Icon className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                <span>Early user feedback positive (validated product-market fit)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2Icon className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                <span>No critical bugs blocking main flows</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2Icon className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                <span>
                  <Link href="/docs/audits/data" className="text-primary hover:underline">
                    Data & Security audit
                  </Link>{" "}
                  passed at MVP level
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2Icon className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                <span>Stakeholder sign-off to proceed</span>
              </li>
            </ul>
          </div>
          <Link
            href="/docs/workflow/delivery"
            className="text-primary inline-flex items-center gap-1 text-sm font-medium hover:underline"
          >
            Learn about delivery cycles
            <ArrowRightIcon className="h-3.5 w-3.5" />
          </Link>
        </section>

        {/* Design System callout */}
        <section className="rounded-xl border border-violet-200 bg-gradient-to-br from-violet-50 to-purple-50/50 p-5 dark:border-violet-900/50 dark:from-violet-950/20 dark:to-purple-950/10">
          <Row gap="sm" className="mb-3 items-center">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-900/30">
              <PaletteIcon className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            </div>
            <Text weight="semibold">Design at MVP</Text>
          </Row>
          <Text size="sm" variant="muted" className="mb-3 leading-relaxed">
            Apply the design system properly at MVP stage. Responsive design
            matters — users will access on mobile. Use consistent spacing,
            typography, and colors. Save the polish for MMP.
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
            href="/docs/workflow/poc"
            className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            POC Workflow
          </Link>
          <Link
            href="/docs/workflow/mmp"
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
          >
            MMP Workflow
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

function CadenceCard({
  frequency,
  meeting,
  description,
}: {
  frequency: string
  meeting: string
  description: string
}) {
  return (
    <div className="rounded-xl border p-4">
      <div className="mb-1 text-xs font-medium text-amber-600 dark:text-amber-400">
        {frequency}
      </div>
      <Text weight="medium">{meeting}</Text>
      <Text size="sm" variant="muted" className="mt-1">
        {description}
      </Text>
    </div>
  )
}

function ActivityItem({
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
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-100 text-sm font-bold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
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

function QualityItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border p-3">
      <CheckCircle2Icon className="h-4 w-4 shrink-0 text-amber-500" />
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
    <div className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-950/20">
      <AlertTriangleIcon className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
      <div>
        <Text weight="medium" className="text-amber-900 dark:text-amber-200">
          {title}
        </Text>
        <Text size="sm" className="mt-0.5 text-amber-800 dark:text-amber-300">
          {description}
        </Text>
      </div>
    </div>
  )
}
