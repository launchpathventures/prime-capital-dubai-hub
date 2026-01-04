/**
 * CATALYST - MMP Workflow
 *
 * Stage-specific guidance for running an MMP: ready for paying customers,
 * polished UI, proper error handling, basic monitoring.
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
  ShieldCheckIcon,
} from "lucide-react"

export default function MMPWorkflowPage() {
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
            <span className="rounded-lg bg-purple-100 px-2.5 py-1 text-sm font-bold text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
              MMP
            </span>
            <h1 className="text-3xl font-bold tracking-tight">MMP Workflow</h1>
          </Row>
          <Text size="lg" variant="muted" className="leading-relaxed">
            Ready for paying customers. Polished UI, proper error handling,
            and basic monitoring. The product is marketable.
          </Text>
        </header>

        {/* Purpose Section */}
        <section className="border-border bg-muted/30 rounded-xl border p-5">
          <Text weight="semibold" className="mb-2">
            What you&apos;re delivering
          </Text>
          <Text size="sm" variant="muted" className="leading-relaxed">
            An MMP is ready for paying customers. You&apos;ve validated the
            concept and refined the core flows. Now you&apos;re polishing the
            experience, hardening the system, and ensuring everything works
            reliably under real-world conditions.
          </Text>
        </section>

        {/* Quick summary */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Overview</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border p-4">
              <Row gap="sm" className="mb-2 items-center">
                <UsersIcon className="h-4 w-4 text-purple-600" />
                <Text weight="medium">Who it&apos;s for</Text>
              </Row>
              <Text size="sm" variant="muted">
                Paying customers. Real users who expect a professional, reliable
                experience. No more &quot;beta&quot; excuses.
              </Text>
            </div>
            <div className="rounded-xl border p-4">
              <Row gap="sm" className="mb-2 items-center">
                <CalendarIcon className="h-4 w-4 text-purple-600" />
                <Text weight="medium">Typical duration</Text>
              </Row>
              <Text size="sm" variant="muted">
                2-6 weeks depending on polish requirements. This is where you
                pay down technical debt from MVP.
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
              meeting="QA check-in"
              description="Review bug reports, prioritize fixes. Track polish items."
            />
            <CadenceCard
              frequency="Weekly"
              meeting="Stakeholder sign-off"
              description="Demo polished features. Get explicit approval to ship."
            />
            <CadenceCard
              frequency="Before launch"
              meeting="Security review"
              description="Run security audit. Address all high-severity issues."
            />
            <CadenceCard
              frequency="Before launch"
              meeting="Load testing"
              description="Verify performance under expected load. Fix bottlenecks."
            />
          </div>
        </section>

        {/* Key Activities */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Key activities</h2>
          <div className="space-y-3">
            <ActivityItem
              number={1}
              title="UI/UX polish and consistency pass"
              description="Review every screen for design consistency. Fix spacing, typography, and interaction patterns."
            />
            <ActivityItem
              number={2}
              title="Comprehensive error handling"
              description="Every error should have a clear, helpful message. No stack traces in production. Graceful degradation."
            />
            <ActivityItem
              number={3}
              title="Performance optimization"
              description="Measure Core Web Vitals. Optimize slow queries, lazy load where appropriate, and configure caching."
            />
            <ActivityItem
              number={4}
              title="Security review and hardening"
              description="Run security audit. Fix vulnerabilities. Review authentication and authorization flows."
            />
            <ActivityItem
              number={5}
              title="Documentation for users"
              description="Help docs, FAQs, and onboarding guides. Users should be able to self-serve common questions."
            />
            <ActivityItem
              number={6}
              title="Basic monitoring setup"
              description="Error tracking, uptime monitoring, and basic analytics. Know when things break."
            />
          </div>
        </section>

        {/* AI Patterns */}
        <section className="rounded-xl border border-purple-200 bg-purple-50 p-5 dark:border-purple-900/50 dark:bg-purple-950/20">
          <Row gap="sm" className="mb-3 items-center">
            <BotIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            <Text weight="semibold">AI-assisted development patterns</Text>
          </Row>
          <div className="space-y-2 text-sm text-purple-900 dark:text-purple-200">
            <p>
              <strong>AI runs audits:</strong> Use AI to systematically check
              accessibility, security, and performance. It catches issues humans miss.
            </p>
            <p>
              <strong>Human reviews findings:</strong> AI reports issues; human
              decides priority. Not everything needs fixing before launch.
            </p>
            <p>
              <strong>AI handles documentation:</strong> Generate help docs,
              API documentation, and changelog entries. Human reviews for accuracy.
            </p>
          </div>
        </section>

        {/* Quality Bar */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Quality bar</h2>
          <Text size="sm" variant="muted">
            What &quot;ready for market&quot; looks like at MMP stage:
          </Text>
          <div className="grid gap-3 sm:grid-cols-2">
            <QualityItem text="Feature complete for target market" />
            <QualityItem text="Polished, consistent UI/UX" />
            <QualityItem text="Comprehensive error handling" />
            <QualityItem text="Performance optimized (fast load times)" />
            <QualityItem text="Security reviewed and hardened" />
            <QualityItem text="Basic monitoring in place" />
          </div>
        </section>

        {/* Boundaries */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Boundaries</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-success/30 bg-success/5 p-4">
              <h4 className="mb-2 font-medium text-success">Allowed</h4>
              <ul className="text-muted-foreground space-y-1 text-sm">
                <li>• Phased feature rollout</li>
                <li>• Beta labelling for some features</li>
                <li>• Manual processes for edge cases</li>
                <li>• Known limitations documented</li>
                <li>• Limited feature set (save extras for v2)</li>
              </ul>
            </div>
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
              <h4 className="mb-2 font-medium text-destructive">Not Allowed</h4>
              <ul className="text-muted-foreground space-y-1 text-sm">
                <li>• Unhandled errors (crashes, blank screens)</li>
                <li>• Performance degradation under load</li>
                <li>• Missing critical features</li>
                <li>• Known security vulnerabilities</li>
                <li>• No way to contact support</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Anti-Patterns */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Anti-patterns to avoid</h2>
          <div className="space-y-3">
            <AntiPatternItem
              title="Launching without load testing"
              description="You will find out about performance issues from angry customers instead of before launch."
            />
            <AntiPatternItem
              title="Skipping security review"
              description="Security issues at this stage can destroy trust. Pay for a professional review if needed."
            />
            <AntiPatternItem
              title="No monitoring in place"
              description="If you can't see errors, you can't fix them. Users will leave before telling you what's broken."
            />
            <AntiPatternItem
              title="Missing support documentation"
              description="Every support ticket is a sign you didn't document something obvious. Invest in help docs."
            />
          </div>
        </section>

        {/* Audit Requirements */}
        <section className="rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-violet-50/50 p-5 dark:border-purple-900/50 dark:from-purple-950/20 dark:to-violet-950/10">
          <Row gap="sm" className="mb-3 items-center">
            <ShieldCheckIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            <Text weight="semibold">Required audits at MMP</Text>
          </Row>
          <Text size="sm" variant="muted" className="mb-3 leading-relaxed">
            All audits should pass at full level before MMP launch:
          </Text>
          <div className="grid gap-2 text-sm">
            <Link href="/docs/audits/data" className="text-primary hover:underline">
              Data & Security — Is this safe to use?
            </Link>
            <Link href="/docs/audits/accessibility" className="text-primary hover:underline">
              Accessibility — Can everyone use this?
            </Link>
            <Link href="/docs/audits/experience" className="text-primary hover:underline">
              Design & Experience — Is this pleasant to use?
            </Link>
            <Link href="/docs/audits/performance" className="text-primary hover:underline">
              Speed & Performance — Is this fast enough?
            </Link>
          </div>
        </section>

        {/* Promotion Criteria */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Promotion to Production</h2>
          <Text size="sm" variant="muted">
            Before moving to Production stage, verify:
          </Text>
          <div className="rounded-xl border p-4">
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle2Icon className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                <span>All audits pass at full level</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2Icon className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                <span>Stakeholder sign-off on launch readiness</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2Icon className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                <span>Support processes defined (how to handle issues)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2Icon className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                <span>Backup and recovery tested</span>
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
            </ul>
          </div>
        </section>

        {/* Design System callout */}
        <section className="rounded-xl border border-violet-200 bg-gradient-to-br from-violet-50 to-purple-50/50 p-5 dark:border-violet-900/50 dark:from-violet-950/20 dark:to-purple-950/10">
          <Row gap="sm" className="mb-3 items-center">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-900/30">
              <PaletteIcon className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            </div>
            <Text weight="semibold">Design at MMP</Text>
          </Row>
          <Text size="sm" variant="muted" className="mb-3 leading-relaxed">
            Full design system compliance at MMP stage. Run the Design &
            Experience audit and fix all issues. This is where polish happens.
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
            href="/docs/workflow/mvp"
            className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            MVP Workflow
          </Link>
          <Link
            href="/docs/workflow/production"
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
          >
            Production Workflow
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
      <div className="mb-1 text-xs font-medium text-purple-600 dark:text-purple-400">
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
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-purple-100 text-sm font-bold text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
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
      <CheckCircle2Icon className="h-4 w-4 shrink-0 text-purple-500" />
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
    <div className="flex gap-3 rounded-lg border border-purple-200 bg-purple-50 p-4 dark:border-purple-900/50 dark:bg-purple-950/20">
      <AlertTriangleIcon className="mt-0.5 h-4 w-4 shrink-0 text-purple-600 dark:text-purple-400" />
      <div>
        <Text weight="medium" className="text-purple-900 dark:text-purple-200">
          {title}
        </Text>
        <Text size="sm" className="mt-0.5 text-purple-800 dark:text-purple-300">
          {description}
        </Text>
      </div>
    </div>
  )
}
