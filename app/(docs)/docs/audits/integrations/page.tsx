/**
 * CATALYST - Integrations & Services Audit
 *
 * Structured review of external dependencies covering third-party APIs,
 * webhooks, and service reliability. Ensure external services work.
 */

import Link from "next/link"
import { Stack, Text, Row } from "@/components/core"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  PlugIcon,
  WebhookIcon,
  HeartPulseIcon,
  ArrowLeftIcon,
  CircleIcon,
  ExternalLinkIcon,
  WrenchIcon,
  AlertCircleIcon,
  CloudIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function IntegrationsAuditPage() {
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
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-100 dark:bg-cyan-900/30">
              <PlugIcon className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Integrations &amp; Services
              </h1>
              <Text variant="muted" className="italic">
                Do external services work reliably?
              </Text>
            </div>
          </Row>
          <Text size="lg" variant="muted" className="leading-relaxed">
            Review third-party API usage, webhook reliability, and service
            resilience. External dependencies are common failure points.
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
                "Mock integrations acceptable",
                "No reliability needed",
                "Just prove the concept",
              ]}
            />
            <StageCard
              stage="MVP"
              level="Light"
              expectations={[
                "Real integrations working",
                "Basic error handling",
                "Tokens not hardcoded",
              ]}
            />
            <StageCard
              stage="MMP"
              level="Full"
              expectations={[
                "Retry logic in place",
                "Fallbacks defined",
                "Rate limits handled",
              ]}
            />
            <StageCard
              stage="PROD"
              level="Complete"
              expectations={[
                "Circuit breakers active",
                "Service health monitored",
                "Degraded mode tested",
              ]}
            />
          </div>
        </section>

        {/* ================================================================ */}
        {/* Tabbed Checklists */}
        {/* ================================================================ */}
        <Tabs defaultValue="apis">
          <TabsList className="mb-4">
            <TabsTrigger value="apis">
              <CloudIcon className="h-4 w-4" />
              Third-Party APIs
            </TabsTrigger>
            <TabsTrigger value="webhooks">
              <WebhookIcon className="h-4 w-4" />
              Webhooks & Events
            </TabsTrigger>
            <TabsTrigger value="reliability">
              <HeartPulseIcon className="h-4 w-4" />
              Service Reliability
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Third-Party APIs */}
          <TabsContent value="apis">
            <Stack gap="lg">
              <ChecklistSection
                title="Credential Management"
                stage="mvp"
                items={[
                  "API keys stored in environment variables",
                  "Credentials not committed to version control",
                  "Different credentials per environment (dev/staging/prod)",
                  "Credentials rotatable without code changes",
                  "Access to production credentials restricted",
                  "Credential expiry monitored where applicable",
                ]}
              />

              <ChecklistSection
                title="Rate Limit Handling"
                stage="mvp"
                items={[
                  "API rate limits documented and understood",
                  "Rate limit headers parsed and respected",
                  "Exponential backoff on rate limit errors",
                  "Request queuing for burst-prone operations",
                  "Rate limit approaching alerts configured",
                  "Usage tracked against limits",
                ]}
              />

              <ChecklistSection
                title="Error Handling"
                stage="mvp"
                items={[
                  "All API error responses handled (4xx, 5xx)",
                  "Network errors (timeout, connection refused) caught",
                  "Errors logged with context for debugging",
                  "User-facing error messages are helpful",
                  "Sensitive data stripped from error logs",
                  "Error patterns tracked for monitoring",
                ]}
              />

              <ChecklistSection
                title="Timeout Configuration"
                stage="mvp"
                items={[
                  "Request timeouts configured (not default/infinite)",
                  "Timeout values appropriate for operation",
                  "Connection timeout separate from read timeout",
                  "Timeout errors handled gracefully",
                  "Long-running operations use async patterns",
                  "Users informed during long waits",
                ]}
              />

              <ChecklistSection
                title="Fallback Behavior"
                stage="mmp"
                items={[
                  "Fallback defined when service unavailable",
                  "Cached data served when fresh data unavailable",
                  "Feature degrades gracefully vs. full failure",
                  "Users informed of degraded functionality",
                  "Fallback behavior tested regularly",
                  "Recovery automatic when service returns",
                ]}
              />

              <ChecklistSection
                title="API Versioning"
                stage="mmp"
                items={[
                  "API version explicitly specified in requests",
                  "Deprecation warnings monitored",
                  "Migration plan for version upgrades",
                  "Breaking changes tracked in dependencies",
                  "API changelog monitored",
                  "SLA/uptime requirements documented",
                ]}
              />

              <CommonIssues
                items={[
                  { issue: "API key in client-side code", fix: "Move to server-side API route, never expose secrets to browser" },
                  { issue: "No timeout on API calls", fix: "Add timeout option (e.g., 30 seconds) to all fetch calls" },
                  { issue: "Rate limited with no retry", fix: "Parse Retry-After header, implement exponential backoff" },
                  { issue: "API failure crashes entire page", fix: "Catch errors, show fallback UI, log for debugging" },
                  { issue: "Using deprecated API version", fix: "Track version in use, plan migration before EOL" },
                ]}
              />
            </Stack>
          </TabsContent>

          {/* Tab 2: Webhooks & Events */}
          <TabsContent value="webhooks">
            <Stack gap="lg">
              <ChecklistSection
                title="Webhook Security"
                stage="mvp"
                items={[
                  "Webhook signatures verified before processing",
                  "Signature secret stored securely",
                  "Invalid signatures rejected with 401/403",
                  "Webhook endpoint not guessable (or protected)",
                  "IP allowlist for known providers (if supported)",
                  "Payload validated before processing",
                ]}
              />

              <ChecklistSection
                title="Idempotency"
                stage="mmp"
                items={[
                  "Duplicate webhook deliveries handled safely",
                  "Unique event IDs tracked to prevent reprocessing",
                  "Database operations are idempotent",
                  "Side effects (emails, charges) prevented on replay",
                  "Idempotency keys used for outgoing requests",
                  "Event deduplication window defined",
                ]}
              />

              <ChecklistSection
                title="Reliability (Incoming)"
                stage="mmp"
                items={[
                  "Webhook endpoint returns 2xx quickly (< 5s)",
                  "Processing happens async (queue, background job)",
                  "Failed processing retried internally",
                  "Dead letter queue for persistent failures",
                  "Webhook logs retained for debugging",
                  "Provider retry behavior understood",
                ]}
              />

              <ChecklistSection
                title="Reliability (Outgoing)"
                stage="mmp"
                items={[
                  "Outgoing webhooks retry on failure",
                  "Exponential backoff with max retries",
                  "Delivery status tracked per webhook",
                  "Failures surfaced to admin",
                  "Manual retry capability available",
                  "Payload signing for recipient verification",
                ]}
              />

              <ChecklistSection
                title="Event Ordering"
                stage="mmp"
                items={[
                  "Event ordering expectations documented",
                  "Out-of-order events handled correctly",
                  "Timestamp-based ordering where possible",
                  "Sequence numbers used if available",
                  "Race conditions in event handling prevented",
                  "Eventual consistency acceptable for use case",
                ]}
              />

              <CommonIssues
                items={[
                  { issue: "Webhook signature not verified", fix: "Implement signature check before processing any payload" },
                  { issue: "Duplicate events cause duplicate charges", fix: "Store event IDs, check before processing side effects" },
                  { issue: "Webhook processing times out", fix: "Return 200 immediately, process async in background" },
                  { issue: "No visibility into webhook failures", fix: "Add logging, alerting, and admin dashboard for webhooks" },
                  { issue: "Out-of-order events cause data corruption", fix: "Use timestamps/versions, handle ordering in processing logic" },
                ]}
              />
            </Stack>
          </TabsContent>

          {/* Tab 3: Service Reliability */}
          <TabsContent value="reliability">
            <Stack gap="lg">
              <ChecklistSection
                title="Circuit Breakers"
                stage="mmp"
                items={[
                  "Circuit breaker implemented for unstable services",
                  "Failure threshold triggers circuit open",
                  "Circuit allows periodic retry (half-open state)",
                  "Circuit state visible in monitoring",
                  "Different circuits for different services",
                  "Fallback activated when circuit open",
                ]}
              />

              <ChecklistSection
                title="Graceful Degradation"
                stage="mmp"
                items={[
                  "Non-critical features fail silently",
                  "Critical features show meaningful error",
                  "Cached/stale data preferred over failure",
                  "Core functionality works without integrations",
                  "Users informed of reduced functionality",
                  "Degraded mode doesn't cascade to other services",
                ]}
              />

              <ChecklistSection
                title="Health Monitoring"
                stage="mmp"
                items={[
                  "Dependency health included in app health check",
                  "External service status pages monitored",
                  "Alerts configured for dependency failures",
                  "Latency tracked for all external calls",
                  "Error rates tracked per service",
                  "Dashboard shows dependency health",
                ]}
              />

              <ChecklistSection
                title="Connection Management"
                stage="mmp"
                items={[
                  "Connection pooling for database connections",
                  "HTTP keep-alive used where appropriate",
                  "Connections closed on shutdown",
                  "Connection limits not exceeded",
                  "Stale connections detected and recycled",
                  "Connection timeout appropriate",
                ]}
              />

              <ChecklistSection
                title="Retry Strategies"
                stage="mmp"
                items={[
                  "Transient failures retried automatically",
                  "Exponential backoff between retries",
                  "Maximum retry limit defined",
                  "Non-retryable errors identified (4xx client errors)",
                  "Jitter added to prevent thundering herd",
                  "Retry budget prevents cascade",
                ]}
              />

              <ChecklistSection
                title="Disaster Planning"
                stage="prod"
                items={[
                  "Failover strategy for critical services",
                  "Multi-region deployment (if required)",
                  "Recovery procedures documented",
                  "Recovery time objective (RTO) defined",
                  "Regular disaster recovery testing",
                  "Communication plan for outages",
                ]}
              />

              <CommonIssues
                items={[
                  { issue: "One failing service takes down entire app", fix: "Implement circuit breaker, fail gracefully" },
                  { issue: "Retry storms during outages", fix: "Add exponential backoff with jitter, set retry budget" },
                  { issue: "No visibility into service health", fix: "Add dependency health checks, monitor latency/errors" },
                  { issue: "Connection pool exhausted", fix: "Tune pool size, add connection timeout, monitor usage" },
                  { issue: "Don't know when dependencies fail", fix: "Subscribe to status pages, set up alerts" },
                ]}
              />
            </Stack>
          </TabsContent>
        </Tabs>

        {/* ================================================================ */}
        {/* Circuit Breaker Pattern */}
        {/* ================================================================ */}
        <section className="rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900/50">
          <h3 className="mb-3 font-semibold">Circuit Breaker Pattern</h3>
          <div className="grid gap-4 md:grid-cols-3 text-sm">
            <div>
              <Text size="sm" weight="medium" className="text-emerald-600 dark:text-emerald-400">Closed (Normal)</Text>
              <Text size="sm" variant="muted" className="mt-1">Requests pass through. Failures counted.</Text>
            </div>
            <div>
              <Text size="sm" weight="medium" className="text-red-600 dark:text-red-400">Open (Tripped)</Text>
              <Text size="sm" variant="muted" className="mt-1">Requests blocked. Fallback used. Waits for timeout.</Text>
            </div>
            <div>
              <Text size="sm" weight="medium" className="text-amber-600 dark:text-amber-400">Half-Open (Testing)</Text>
              <Text size="sm" variant="muted" className="mt-1">Limited requests allowed. Success closes, failure reopens.</Text>
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* Tools & Resources */}
        {/* ================================================================ */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Tools &amp; Resources</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <ResourceCard
              title="Resilience Libraries"
              items={[
                { name: "opossum", url: "https://nodeshift.dev/opossum/", desc: "Node.js circuit breaker" },
                { name: "cockatiel", url: "https://github.com/connor4312/cockatiel", desc: "Resilience policies for JS/TS" },
                { name: "p-retry", url: "https://www.npmjs.com/package/p-retry", desc: "Promise retry with backoff" },
                { name: "bottleneck", url: "https://www.npmjs.com/package/bottleneck", desc: "Rate limiting and scheduling" },
              ]}
            />
            <ResourceCard
              title="Webhook Tools"
              items={[
                { name: "Svix", url: "https://www.svix.com/", desc: "Webhook infrastructure service" },
                { name: "Hookdeck", url: "https://hookdeck.com/", desc: "Webhook management platform" },
                { name: "ngrok", url: "https://ngrok.com/", desc: "Tunnel for local webhook testing" },
                { name: "Webhook.site", url: "https://webhook.site/", desc: "Test and debug webhooks" },
              ]}
            />
            <ResourceCard
              title="API Development"
              items={[
                { name: "Postman", url: "https://www.postman.com/", desc: "API development and testing" },
                { name: "Insomnia", url: "https://insomnia.rest/", desc: "API client and design" },
                { name: "HTTPie", url: "https://httpie.io/", desc: "Command-line HTTP client" },
                { name: "Hoppscotch", url: "https://hoppscotch.io/", desc: "Open source API client" },
              ]}
            />
            <ResourceCard
              title="Monitoring"
              items={[
                { name: "StatusPage.io", url: "https://www.atlassian.com/software/statuspage", desc: "Status page hosting" },
                { name: "Checkly", url: "https://www.checklyhq.com/", desc: "API and browser monitoring" },
                { name: "Uptime Robot", url: "https://uptimerobot.com/", desc: "Website monitoring" },
                { name: "Incident.io", url: "https://incident.io/", desc: "Incident management" },
              ]}
            />
          </div>
        </section>

        {/* ================================================================ */}
        {/* AI Agent Quick Commands */}
        {/* ================================================================ */}
        <section className="rounded-xl border border-cyan-200 bg-cyan-50 p-5 dark:border-cyan-900/50 dark:bg-cyan-950/20">
          <h3 className="mb-3 font-semibold text-cyan-900 dark:text-cyan-200">AI Agent Commands</h3>
          <Text size="sm" className="mb-3 text-cyan-800 dark:text-cyan-300">
            Use these prompts with your AI coding agent to check integrations:
          </Text>
          <ul className="space-y-2 text-sm text-cyan-800 dark:text-cyan-300">
            <li><code className="rounded bg-cyan-100 px-1.5 py-0.5 dark:bg-cyan-900/50">Run the Integrations &amp; Services audit at MVP level</code></li>
            <li><code className="rounded bg-cyan-100 px-1.5 py-0.5 dark:bg-cyan-900/50">Find API calls missing timeout configuration</code></li>
            <li><code className="rounded bg-cyan-100 px-1.5 py-0.5 dark:bg-cyan-900/50">Check webhook handlers for signature verification</code></li>
            <li><code className="rounded bg-cyan-100 px-1.5 py-0.5 dark:bg-cyan-900/50">Audit error handling in external API calls</code></li>
            <li><code className="rounded bg-cyan-100 px-1.5 py-0.5 dark:bg-cyan-900/50">Find hardcoded API credentials in the codebase</code></li>
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
              description="API credentials and data security"
            />
            <RelatedAuditCard
              href="/docs/audits/deploy"
              title="Deploy & Observe"
              description="Monitoring and resilience"
            />
            <RelatedAuditCard
              href="/docs/audits/performance"
              title="Speed & Performance"
              description="External call performance"
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
