/**
 * CATALYST - Production Workflow
 *
 * Stage-specific guidance for production: enterprise-ready, security hardened,
 * scalable, monitored, and documented.
 */

import Link from "next/link"
import { Stack, Text, Row } from "@/components/core"
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ServerIcon,
  CalendarIcon,
  CheckCircle2Icon,
  AlertTriangleIcon,
  BotIcon,
  PaletteIcon,
  ShieldAlertIcon,
} from "lucide-react"

export default function ProductionWorkflowPage() {
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
            <span className="rounded-lg bg-emerald-100 px-2.5 py-1 text-sm font-bold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
              PROD
            </span>
            <h1 className="text-3xl font-bold tracking-tight">
              Production Workflow
            </h1>
          </Row>
          <Text size="lg" variant="muted" className="leading-relaxed">
            Enterprise-ready. Security hardened, scalable, monitored, and
            documented. The product is production-grade.
          </Text>
        </header>

        {/* Purpose Section */}
        <section className="border-border bg-muted/30 rounded-xl border p-5">
          <Text weight="semibold" className="mb-2">
            What production means
          </Text>
          <Text size="sm" variant="muted" className="leading-relaxed">
            Production is the steady state. The system is fully operational,
            monitored, and supported. You have runbooks for common issues,
            incident response processes, and continuous improvement cycles.
            This isn&apos;t a destination — it&apos;s an ongoing commitment.
          </Text>
        </section>

        {/* Quick summary */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Overview</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border p-4">
              <Row gap="sm" className="mb-2 items-center">
                <ServerIcon className="h-4 w-4 text-emerald-600" />
                <Text weight="medium">Who it&apos;s for</Text>
              </Row>
              <Text size="sm" variant="muted">
                Enterprise customers, high-value users, and anyone who expects
                24/7 reliability. No tolerance for downtime or data loss.
              </Text>
            </div>
            <div className="rounded-xl border p-4">
              <Row gap="sm" className="mb-2 items-center">
                <CalendarIcon className="h-4 w-4 text-emerald-600" />
                <Text weight="medium">Duration</Text>
              </Row>
              <Text size="sm" variant="muted">
                Ongoing. Production is not a phase — it&apos;s the steady state
                for live products. Continuous improvement, not project completion.
              </Text>
            </div>
          </div>
        </section>

        {/* Cadence */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Operational cadence</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <CadenceCard
              frequency="Daily"
              activity="Monitoring review"
              description="Check dashboards for anomalies, errors, and performance trends."
            />
            <CadenceCard
              frequency="Weekly"
              activity="Incident review"
              description="Review any incidents. Update runbooks. Improve response processes."
            />
            <CadenceCard
              frequency="Scheduled"
              activity="Maintenance windows"
              description="Regular updates, patches, and infrastructure maintenance."
            />
            <CadenceCard
              frequency="Quarterly"
              activity="Security review"
              description="Review access controls, audit logs, and security posture."
            />
          </div>
        </section>

        {/* Key Activities */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Key activities</h2>
          <div className="space-y-3">
            <ActivityItem
              number={1}
              title="Monitoring and alerting setup"
              description="Comprehensive observability: application logs, infrastructure metrics, and business KPIs. Alert on what matters."
            />
            <ActivityItem
              number={2}
              title="Backup and disaster recovery"
              description="Automated backups, tested recovery procedures, and documented RPO/RTO targets."
            />
            <ActivityItem
              number={3}
              title="Runbooks and documentation"
              description="Step-by-step guides for common issues, deployment procedures, and incident response."
            />
            <ActivityItem
              number={4}
              title="On-call and support processes"
              description="Clear escalation paths, response time SLAs, and 24/7 coverage if required."
            />
            <ActivityItem
              number={5}
              title="Continuous improvement"
              description="Regular retrospectives, performance optimization, and incremental feature additions."
            />
            <ActivityItem
              number={6}
              title="Compliance and audit trails"
              description="Maintain audit logs, access controls, and documentation for regulatory requirements."
            />
          </div>
        </section>

        {/* AI Patterns */}
        <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-900/50 dark:bg-emerald-950/20">
          <Row gap="sm" className="mb-3 items-center">
            <BotIcon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            <Text weight="semibold">AI-assisted operations patterns</Text>
          </Row>
          <div className="space-y-2 text-sm text-emerald-900 dark:text-emerald-200">
            <p>
              <strong>AI helps with incident triage:</strong> Analyze logs, correlate events,
              and suggest root causes. Human makes the final call.
            </p>
            <p>
              <strong>AI monitors for anomalies:</strong> Pattern recognition
              across metrics to catch issues before they become outages.
            </p>
            <p>
              <strong>AI assists routine maintenance:</strong> Generate release
              notes, update documentation, and manage repetitive operational tasks.
            </p>
          </div>
        </section>

        {/* Quality Bar */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Quality bar</h2>
          <Text size="sm" variant="muted">
            What &quot;production-ready&quot; looks like:
          </Text>
          <div className="grid gap-3 sm:grid-cols-2">
            <QualityItem text="Full operational readiness" />
            <QualityItem text="Monitoring and alerting active" />
            <QualityItem text="Backup and recovery tested" />
            <QualityItem text="Support runbook complete" />
            <QualityItem text="SLA defined and achievable" />
            <QualityItem text="Incident response process documented" />
          </div>
        </section>

        {/* Boundaries */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Boundaries</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-success/30 bg-success/5 p-4">
              <h4 className="mb-2 font-medium text-success">Allowed</h4>
              <ul className="text-muted-foreground space-y-1 text-sm">
                <li>• Continuous improvement</li>
                <li>• Feature additions via normal process</li>
                <li>• Scheduled maintenance windows</li>
                <li>• Gradual rollout of updates</li>
                <li>• A/B testing and experiments</li>
              </ul>
            </div>
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
              <h4 className="mb-2 font-medium text-destructive">Not Allowed</h4>
              <ul className="text-muted-foreground space-y-1 text-sm">
                <li>• Untested deployments</li>
                <li>• Missing monitoring</li>
                <li>• No disaster recovery plan</li>
                <li>• Deploying without rollback ability</li>
                <li>• Missing incident response process</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Anti-Patterns */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Anti-patterns to avoid</h2>
          <div className="space-y-3">
            <AntiPatternItem
              title="Deploying without a rollback plan"
              description="Every deployment should be reversible. If you can't roll back in 5 minutes, you're not ready."
            />
            <AntiPatternItem
              title="Missing incident response process"
              description="When things break (and they will), you need a documented process. Chaos during outages costs trust."
            />
            <AntiPatternItem
              title="No on-call or support coverage"
              description="Production systems need someone responsible. Define coverage hours and escalation paths."
            />
            <AntiPatternItem
              title="Undocumented operational procedures"
              description="If only one person knows how to fix it, you have a single point of failure."
            />
          </div>
        </section>

        {/* Stage Skipping Risks */}
        <section className="rounded-xl border border-destructive/30 bg-destructive/5 p-5">
          <Row gap="sm" className="mb-3 items-center">
            <ShieldAlertIcon className="h-5 w-5 text-destructive" />
            <Text weight="semibold">Stage skipping risks</Text>
          </Row>
          <Text size="sm" variant="muted" className="mb-3">
            Each stage exists for a reason. Skipping stages leads to:
          </Text>
          <div className="space-y-3">
            <div className="rounded-lg bg-background p-3">
              <Text weight="medium" size="sm">
                POC → PROD skip
              </Text>
              <Text size="sm" variant="muted" className="mt-1">
                Security vulnerabilities, data loss risks, and operational fragility.
                You haven&apos;t validated with real users or hardened the system.
              </Text>
            </div>
            <div className="rounded-lg bg-background p-3">
              <Text weight="medium" size="sm">
                MVP → PROD skip
              </Text>
              <Text size="sm" variant="muted" className="mt-1">
                Poor user experience, missing features, and support chaos.
                Early feedback wasn&apos;t incorporated; polish didn&apos;t happen.
              </Text>
            </div>
            <div className="rounded-lg bg-background p-3">
              <Text weight="medium" size="sm">
                MMP → PROD skip
              </Text>
              <Text size="sm" variant="muted" className="mt-1">
                Operational failures, missing runbooks, and incident response gaps.
                You&apos;re running production without operational readiness.
              </Text>
            </div>
          </div>
        </section>

        {/* Operational Readiness */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Operational readiness checklist</h2>
          <Text size="sm" variant="muted">
            Before going live, verify all items are complete:
          </Text>
          <div className="rounded-xl border p-4">
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle2Icon className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                <span>
                  <Link href="/docs/audits" className="text-primary hover:underline">
                    All audits
                  </Link>{" "}
                  pass at complete level
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2Icon className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                <span>Monitoring dashboards configured and alerting active</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2Icon className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                <span>Backup procedures tested with successful restore</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2Icon className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                <span>Support runbook written and reviewed</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2Icon className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                <span>On-call rotation or support hours defined</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2Icon className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                <span>
                  <Link href="/docs/workflow/delivery" className="text-primary hover:underline">
                    Refine checkpoint
                  </Link>{" "}
                  passed with stakeholder sign-off
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2Icon className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                <span>Rollback procedure tested and documented</span>
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
            <Text weight="semibold">Design in Production</Text>
          </Row>
          <Text size="sm" variant="muted" className="mb-3 leading-relaxed">
            Design system updates in production go through proper review. Use
            feature flags for visual changes and A/B test significant updates.
          </Text>
          <Link
            href="/docs/design"
            className="text-primary inline-flex items-center gap-1 text-sm font-medium hover:underline"
          >
            Explore the Design System
            <ArrowRightIcon className="h-3.5 w-3.5" />
          </Link>
        </section>

        {/* Related docs */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Related docs</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href="/docs/audits/deploy"
                className="text-primary hover:underline"
              >
                Deploy & Observe Audit — Operational readiness checks
              </Link>
            </li>
            <li>
              <Link
                href="/docs/prompts/promotion"
                className="text-primary hover:underline"
              >
                Stage Promotion — Hardening prompts for production
              </Link>
            </li>
            <li>
              <Link
                href="/docs/workflow/delivery"
                className="text-primary hover:underline"
              >
                Delivery Cycles — Phase checkpoints and advancement criteria
              </Link>
            </li>
          </ul>
        </section>

        {/* Navigation */}
        <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/docs/workflow/mmp"
            className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            MMP Workflow
          </Link>
          <Link
            href="/docs/workflow"
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
          >
            Workflow Overview
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
  activity,
  description,
}: {
  frequency: string
  activity: string
  description: string
}) {
  return (
    <div className="rounded-xl border p-4">
      <div className="mb-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
        {frequency}
      </div>
      <Text weight="medium">{activity}</Text>
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
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
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
      <CheckCircle2Icon className="h-4 w-4 shrink-0 text-emerald-500" />
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
    <div className="flex gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/20">
      <AlertTriangleIcon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
      <div>
        <Text weight="medium" className="text-emerald-900 dark:text-emerald-200">
          {title}
        </Text>
        <Text size="sm" className="mt-0.5 text-emerald-800 dark:text-emerald-300">
          {description}
        </Text>
      </div>
    </div>
  )
}
