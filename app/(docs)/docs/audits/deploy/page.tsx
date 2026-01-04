/**
 * CATALYST - Deploy & Observe Audit
 *
 * Structured operations review covering deployment pipelines,
 * observability, and resilience. Ensure you can run and monitor this.
 */

import Link from "next/link"
import { Stack, Text, Row } from "@/components/core"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  RocketIcon,
  ActivityIcon,
  ShieldIcon,
  ArrowLeftIcon,
  CircleIcon,
  ExternalLinkIcon,
  WrenchIcon,
  AlertCircleIcon,
  GitBranchIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function DeployAuditPage() {
  return (
    <article>
      <Stack gap="xl">
        {/* Breadcrumb */}
        <Link
          href="/docs/audits"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm"
        >
          <ArrowLeftIcon className="h-3.5 w-3.5" />
          Back to Audits
        </Link>

        {/* Header */}
        <header className="space-y-3">
          <Row gap="sm" className="items-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
              <RocketIcon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Deploy &amp; Observe
              </h1>
              <Text variant="muted" className="italic">
                Can we run and monitor this?
              </Text>
            </div>
          </Row>
          <Text size="lg" variant="muted" className="leading-relaxed">
            Review deployment pipelines, monitoring coverage, and resilience
            patterns. Ship confidently and know when things break.
          </Text>
        </header>

        {/* ================================================================ */}
        {/* Stage expectations */}
        {/* ================================================================ */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Stage expectations</h2>
          <div className="grid gap-4 md:grid-cols-4">
            <StageCard
              stage="POC"
              level="Skip"
              expectations={[
                "Manual deploy is acceptable",
                "No monitoring required",
                "Just get it running",
              ]}
            />
            <StageCard
              stage="MVP"
              level="Light"
              expectations={[
                "Basic CI/CD in place",
                "Error tracking active",
                "Can deploy without fear",
              ]}
            />
            <StageCard
              stage="MMP"
              level="Full"
              expectations={[
                "Full pipeline with tests",
                "Monitoring dashboard exists",
                "Alerting configured",
              ]}
            />
            <StageCard
              stage="PROD"
              level="Complete"
              expectations={[
                "Runbooks documented",
                "On-call rotation defined",
                "Incident response ready",
              ]}
            />
          </div>
        </section>

        {/* ================================================================ */}
        {/* Tabbed Checklists */}
        {/* ================================================================ */}
        <Tabs defaultValue="pipeline">
          <TabsList className="mb-4">
            <TabsTrigger value="pipeline">
              <GitBranchIcon className="h-4 w-4" />
              Deployment Pipeline
            </TabsTrigger>
            <TabsTrigger value="observability">
              <ActivityIcon className="h-4 w-4" />
              Observability
            </TabsTrigger>
            <TabsTrigger value="resilience">
              <ShieldIcon className="h-4 w-4" />
              Resilience & Recovery
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Deployment Pipeline */}
          <TabsContent value="pipeline">
            <Stack gap="lg">
              <ChecklistSection
                title="CI/CD Pipeline"
                stage="mvp"
                items={[
                  "Pipeline runs on every push to main",
                  "Pipeline runs on every PR",
                  "Linting runs before build",
                  "Tests run before deploy",
                  "Build fails if tests fail",
                  "Deployments are automated (no manual steps)",
                  "Pipeline status visible to team",
                ]}
              />

              <ChecklistSection
                title="Environment Configuration"
                stage="mvp"
                items={[
                  "Environment variables separated by environment",
                  "Production secrets not accessible in dev/staging",
                  "Environment variable documentation exists",
                  ".env.example updated with required variables",
                  "Secrets stored in platform secret manager",
                  "No secrets in version control",
                ]}
              />

              <ChecklistSection
                title="Preview Deployments"
                stage="mvp"
                items={[
                  "Preview deployments created for PRs",
                  "Preview URLs accessible to reviewers",
                  "Preview deployments cleaned up after merge",
                  "Preview environment has test data (not prod)",
                  "Preview URLs protected if needed",
                ]}
              />

              <ChecklistSection
                title="Rollback Capability"
                stage="mmp"
                items={[
                  "Previous deployment can be restored quickly",
                  "Rollback process documented",
                  "Rollback tested periodically",
                  "Database migrations are reversible",
                  "Feature flags allow quick disable of features",
                  "Rollback doesn't require code changes",
                ]}
              />

              <ChecklistSection
                title="Feature Flags"
                stage="mmp"
                items={[
                  "Feature flag system in place",
                  "New features deployed behind flags",
                  "Flags can be toggled without deploy",
                  "Flag cleanup process defined",
                  "Kill switches for critical features",
                  "Percentage rollouts possible",
                ]}
              />

              <ChecklistSection
                title="Database Migrations"
                stage="mmp"
                items={[
                  "Migrations run automatically in pipeline",
                  "Migrations are backward compatible",
                  "Rollback migrations exist",
                  "Migration history tracked",
                  "No manual database changes",
                  "Migration tested in staging before prod",
                ]}
              />

              <CommonIssues
                items={[
                  { issue: "Manual deployments required", fix: "Set up Vercel/Netlify auto-deploy from main branch" },
                  { issue: "Tests skipped to deploy faster", fix: "Make test passing a hard requirement for merge" },
                  { issue: "No way to rollback", fix: "Use Vercel instant rollback or implement deployment versioning" },
                  { issue: "Secrets in .env committed", fix: "Add .env to .gitignore, use platform secrets" },
                  { issue: "PRs deployed to production", fix: "Use preview deployments for PRs, main for prod" },
                ]}
              />
            </Stack>
          </TabsContent>

          {/* Tab 2: Observability */}
          <TabsContent value="observability">
            <Stack gap="lg">
              <ChecklistSection
                title="Logging"
                stage="mvp"
                items={[
                  "Structured logging in place (JSON format)",
                  "Log levels used appropriately (error, warn, info, debug)",
                  "Request IDs included for tracing",
                  "Sensitive data excluded from logs",
                  "Logs accessible in centralized location",
                  "Log retention period defined",
                  "No console.log in production code",
                ]}
              />

              <ChecklistSection
                title="Error Tracking"
                stage="mvp"
                items={[
                  "Error tracking service configured (Sentry, etc.)",
                  "Client-side errors captured",
                  "Server-side errors captured",
                  "Source maps uploaded for readable stack traces",
                  "Error context includes user info (anonymized)",
                  "Errors grouped by type for analysis",
                  "Error notifications enabled",
                ]}
              />

              <ChecklistSection
                title="Uptime Monitoring"
                stage="mvp"
                items={[
                  "Health check endpoint exists (/api/health)",
                  "External uptime monitoring active",
                  "Monitoring checks critical endpoints",
                  "Alert on downtime within minutes",
                  "Status page available (optional public)",
                  "Historical uptime tracked",
                ]}
              />

              <ChecklistSection
                title="Performance Monitoring"
                stage="mmp"
                items={[
                  "Real User Monitoring (RUM) in place",
                  "Core Web Vitals tracked",
                  "Server response times tracked",
                  "Database query performance monitored",
                  "Performance regression alerts configured",
                  "Slow query logging enabled",
                ]}
              />

              <ChecklistSection
                title="Alerting"
                stage="mmp"
                items={[
                  "Alert thresholds defined for errors",
                  "Alert thresholds defined for latency",
                  "Alert notifications sent to right channels",
                  "On-call rotation defined (PROD)",
                  "Alert fatigue managed (not too noisy)",
                  "Escalation path defined",
                ]}
              />

              <ChecklistSection
                title="Dashboards"
                stage="mmp"
                items={[
                  "Key metrics dashboard exists",
                  "Request volume visible",
                  "Error rates visible",
                  "Response times visible",
                  "Resource utilization visible",
                  "Dashboard accessible to team",
                ]}
              />

              <CommonIssues
                items={[
                  { issue: "No visibility into errors", fix: "Set up Sentry or similar error tracking" },
                  { issue: "Don't know when site is down", fix: "Set up uptime monitoring (Vercel, UptimeRobot, etc.)" },
                  { issue: "Logs not searchable", fix: "Use structured logging, aggregate in log service" },
                  { issue: "Too many alerts (alert fatigue)", fix: "Tune thresholds, group related alerts" },
                  { issue: "Source maps missing in errors", fix: "Configure source map upload in build pipeline" },
                ]}
              />
            </Stack>
          </TabsContent>

          {/* Tab 3: Resilience & Recovery */}
          <TabsContent value="resilience">
            <Stack gap="lg">
              <ChecklistSection
                title="Error Boundaries"
                stage="mvp"
                items={[
                  "React error boundaries wrap critical UI sections",
                  "Error boundary shows user-friendly message",
                  "Error boundary reports to error tracking",
                  "Page-level errors don't crash entire app",
                  "Error boundary includes retry action",
                  "Nested error boundaries for granular recovery",
                ]}
              />

              <ChecklistSection
                title="Graceful Degradation"
                stage="mmp"
                items={[
                  "App works with reduced features when services fail",
                  "Non-critical features fail silently",
                  "Critical features show clear error messages",
                  "Cached data shown when fresh data unavailable",
                  "Offline support where applicable",
                  "Third-party service failures handled gracefully",
                ]}
              />

              <ChecklistSection
                title="Retry & Timeout"
                stage="mmp"
                items={[
                  "API calls have reasonable timeouts",
                  "Failed requests retry with backoff",
                  "Retry limits prevent infinite loops",
                  "Users informed of retry attempts",
                  "Idempotent operations safe to retry",
                  "Circuit breakers prevent cascade failures",
                ]}
              />

              <ChecklistSection
                title="Health Checks"
                stage="mvp"
                items={[
                  "Health endpoint checks critical dependencies",
                  "Database connectivity verified",
                  "External API connectivity verified",
                  "Health check fast (< 500ms)",
                  "Unhealthy status triggers alerts",
                  "Load balancer uses health checks",
                ]}
              />

              <ChecklistSection
                title="Backup & Recovery"
                stage="mmp"
                items={[
                  "Database backups automated",
                  "Backup frequency matches data criticality",
                  "Backup restoration tested quarterly",
                  "Point-in-time recovery available",
                  "Backup location separate from primary",
                  "Recovery time objective (RTO) defined",
                ]}
              />

              <ChecklistSection
                title="Incident Response"
                stage="prod"
                items={[
                  "Incident response runbook exists",
                  "On-call rotation defined",
                  "Escalation path documented",
                  "Communication templates ready",
                  "Post-incident review process defined",
                  "Incident history tracked and accessible",
                ]}
              />

              <CommonIssues
                items={[
                  { issue: "Errors crash entire app", fix: "Add React error boundaries at page and component level" },
                  { issue: "API failures hang forever", fix: "Add timeout to all fetch calls (e.g., 30 seconds)" },
                  { issue: "Database failure = total outage", fix: "Add graceful degradation with cached data fallback" },
                  { issue: "Don't know how to recover from incidents", fix: "Write runbook with step-by-step recovery procedures" },
                  { issue: "Backups never tested", fix: "Schedule quarterly restore tests to staging environment" },
                ]}
              />
            </Stack>
          </TabsContent>
        </Tabs>

        {/* ================================================================ */}
        {/* Incident Response Template */}
        {/* ================================================================ */}
        <section className="rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900/50">
          <h3 className="mb-3 font-semibold">Incident Response Template</h3>
          <ol className="space-y-2 text-sm text-muted-foreground">
            <li><span className="font-medium text-foreground">1. Detect:</span> Alert received, verify the issue exists</li>
            <li><span className="font-medium text-foreground">2. Communicate:</span> Notify stakeholders, update status page</li>
            <li><span className="font-medium text-foreground">3. Contain:</span> Prevent further damage (feature flag, rollback)</li>
            <li><span className="font-medium text-foreground">4. Diagnose:</span> Find root cause using logs and monitoring</li>
            <li><span className="font-medium text-foreground">5. Fix:</span> Implement and deploy solution</li>
            <li><span className="font-medium text-foreground">6. Verify:</span> Confirm issue resolved, monitoring normal</li>
            <li><span className="font-medium text-foreground">7. Review:</span> Post-incident review, document learnings</li>
          </ol>
        </section>

        {/* ================================================================ */}
        {/* Tools & Resources */}
        {/* ================================================================ */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Tools &amp; Resources</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <ResourceCard
              title="CI/CD Platforms"
              items={[
                { name: "Vercel", url: "https://vercel.com/", desc: "Next.js optimized deployment" },
                { name: "GitHub Actions", url: "https://github.com/features/actions", desc: "CI/CD workflows" },
                { name: "Netlify", url: "https://www.netlify.com/", desc: "Jamstack deployment" },
                { name: "Railway", url: "https://railway.app/", desc: "Infrastructure platform" },
              ]}
            />
            <ResourceCard
              title="Error Tracking"
              items={[
                { name: "Sentry", url: "https://sentry.io/", desc: "Error tracking and performance" },
                { name: "LogRocket", url: "https://logrocket.com/", desc: "Session replay and errors" },
                { name: "Bugsnag", url: "https://www.bugsnag.com/", desc: "Error monitoring" },
                { name: "Highlight", url: "https://www.highlight.io/", desc: "Full-stack observability" },
              ]}
            />
            <ResourceCard
              title="Monitoring"
              items={[
                { name: "Vercel Analytics", url: "https://vercel.com/analytics", desc: "Web analytics and vitals" },
                { name: "Datadog", url: "https://www.datadoghq.com/", desc: "APM and infrastructure" },
                { name: "Grafana", url: "https://grafana.com/", desc: "Metrics dashboards" },
                { name: "UptimeRobot", url: "https://uptimerobot.com/", desc: "Uptime monitoring" },
              ]}
            />
            <ResourceCard
              title="Feature Flags"
              items={[
                { name: "LaunchDarkly", url: "https://launchdarkly.com/", desc: "Enterprise feature flags" },
                { name: "Flagsmith", url: "https://www.flagsmith.com/", desc: "Open source feature flags" },
                { name: "PostHog", url: "https://posthog.com/", desc: "Product analytics + flags" },
                { name: "Vercel Edge Config", url: "https://vercel.com/docs/storage/edge-config", desc: "Edge feature flags" },
              ]}
            />
          </div>
        </section>

        {/* ================================================================ */}
        {/* AI Agent Quick Commands */}
        {/* ================================================================ */}
        <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-900/50 dark:bg-emerald-950/20">
          <h3 className="mb-3 font-semibold text-emerald-900 dark:text-emerald-200">AI Agent Commands</h3>
          <Text size="sm" className="mb-3 text-emerald-800 dark:text-emerald-300">
            Use these prompts with your AI coding agent to check deployment readiness:
          </Text>
          <ul className="space-y-2 text-sm text-emerald-800 dark:text-emerald-300">
            <li><code className="rounded bg-emerald-100 px-1.5 py-0.5 dark:bg-emerald-900/50">Run the Deploy &amp; Observe audit at MVP level</code></li>
            <li><code className="rounded bg-emerald-100 px-1.5 py-0.5 dark:bg-emerald-900/50">Check CI/CD configuration for best practices</code></li>
            <li><code className="rounded bg-emerald-100 px-1.5 py-0.5 dark:bg-emerald-900/50">Find missing error boundaries in the app</code></li>
            <li><code className="rounded bg-emerald-100 px-1.5 py-0.5 dark:bg-emerald-900/50">Audit health check endpoint coverage</code></li>
            <li><code className="rounded bg-emerald-100 px-1.5 py-0.5 dark:bg-emerald-900/50">Check for missing environment variable documentation</code></li>
          </ul>
        </section>

        {/* ================================================================ */}
        {/* Related Audits */}
        {/* ================================================================ */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Related audits</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <RelatedAuditCard
              href="/docs/audits/data"
              title="Data & Security"
              description="Security in deployment pipeline"
            />
            <RelatedAuditCard
              href="/docs/audits/code"
              title="Code & Testing"
              description="Tests in CI/CD pipeline"
            />
            <RelatedAuditCard
              href="/docs/audits/performance"
              title="Speed & Performance"
              description="Performance monitoring in production"
            />
          </div>
        </section>
      </Stack>
    </article>
  )
}

// =============================================================================
// Helper Components
// =============================================================================

function StageCard({
  stage,
  level,
  expectations,
}: {
  stage: string
  level: string
  expectations: string[]
}) {
  return (
    <div className="rounded-xl border p-4">
      <Row gap="sm" className="mb-2 items-center">
        <span className="rounded bg-muted px-2 py-0.5 text-xs font-bold">
          {stage}
        </span>
        <Text size="sm" variant="muted">
          {level} check
        </Text>
      </Row>
      <ul className="space-y-1">
        {expectations.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/50" />
            <Text size="sm" variant="muted">
              {item}
            </Text>
          </li>
        ))}
      </ul>
    </div>
  )
}

const stageColors = {
  poc: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  mvp: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300",
  mmp: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300",
  prod: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
} as const

function ChecklistSection({
  title,
  stage,
  items,
}: {
  title: string
  stage: "poc" | "mvp" | "mmp" | "prod"
  items: string[]
}) {
  const stageLabels = { poc: "POC", mvp: "MVP", mmp: "MMP", prod: "PROD" }
  
  return (
    <div className="rounded-xl border p-5">
      <Row gap="sm" className="mb-4 items-center justify-between">
        <Text weight="semibold">{title}</Text>
        <span className={cn("rounded px-2 py-0.5 text-xs font-medium", stageColors[stage])}>
          {stageLabels[stage]}+
        </span>
      </Row>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-3 text-sm">
            <CircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/40" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function CommonIssues({
  items,
}: {
  items: { issue: string; fix: string }[]
}) {
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-900/50 dark:bg-amber-950/20">
      <Row gap="sm" className="mb-4 items-center">
        <AlertCircleIcon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
        <Text weight="semibold" className="text-amber-900 dark:text-amber-200">Common Issues &amp; Quick Fixes</Text>
      </Row>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex items-start gap-3 text-sm">
            <WrenchIcon className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <div>
              <span className="font-medium text-amber-900 dark:text-amber-200">{item.issue}:</span>{" "}
              <span className="text-amber-800 dark:text-amber-300">{item.fix}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ResourceCard({
  title,
  items,
}: {
  title: string
  items: { name: string; url: string; desc: string }[]
}) {
  return (
    <div className="rounded-xl border p-5">
      <Text weight="semibold" className="mb-3">{title}</Text>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.name} className="text-sm">
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
            >
              {item.name}
              <ExternalLinkIcon className="h-3 w-3" />
            </a>
            <span className="text-muted-foreground"> — {item.desc}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function RelatedAuditCard({
  href,
  title,
  description,
}: {
  href: string
  title: string
  description: string
}) {
  return (
    <Link
      href={href}
      className="rounded-xl border p-4 transition-colors hover:border-primary/50"
    >
      <Text weight="medium" className="text-primary">{title}</Text>
      <Text size="sm" variant="muted" className="mt-1">{description}</Text>
    </Link>
  )
}
