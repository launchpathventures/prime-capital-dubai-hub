/**
 * CATALYST - Speed & Performance Audit
 *
 * Structured performance review covering load times, Core Web Vitals,
 * and runtime efficiency. Ensure your app is fast enough for users.
 */

import Link from "next/link"
import { Stack, Text, Row } from "@/components/core"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  ZapIcon,
  GaugeIcon,
  CpuIcon,
  ArrowLeftIcon,
  CircleIcon,
  ExternalLinkIcon,
  WrenchIcon,
  AlertCircleIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function PerformanceAuditPage() {
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
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
              <ZapIcon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Speed &amp; Performance
              </h1>
              <Text variant="muted" className="italic">
                Is this fast enough?
              </Text>
            </div>
          </Row>
          <Text size="lg" variant="muted" className="leading-relaxed">
            Review load times, Core Web Vitals, and runtime efficiency. Fast
            apps feel better and convert more users.
          </Text>
        </header>

        {/* ================================================================ */}
        {/* Core Web Vitals Summary */}
        {/* ================================================================ */}
        <section className="rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50/50 p-5 dark:border-amber-900/50 dark:from-amber-950/20 dark:to-orange-950/10">
          <h3 className="mb-3 font-semibold">Core Web Vitals Targets</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <Text size="sm" weight="medium">LCP (Largest Contentful Paint)</Text>
              <Text size="sm" variant="muted">&lt; 2.5s good, &lt; 4.0s needs improvement</Text>
            </div>
            <div>
              <Text size="sm" weight="medium">INP (Interaction to Next Paint)</Text>
              <Text size="sm" variant="muted">&lt; 200ms good, &lt; 500ms needs improvement</Text>
            </div>
            <div>
              <Text size="sm" weight="medium">CLS (Cumulative Layout Shift)</Text>
              <Text size="sm" variant="muted">&lt; 0.1 good, &lt; 0.25 needs improvement</Text>
            </div>
          </div>
        </section>

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
                "Speed doesn't matter yet",
                "Focus on proving value",
                "Optimize later",
              ]}
            />
            <StageCard
              stage="MVP"
              level="Light"
              expectations={[
                "Baseline metrics measured",
                "Obvious issues addressed",
                "No blocking performance bugs",
              ]}
            />
            <StageCard
              stage="MMP"
              level="Full"
              expectations={[
                "Performance budget defined",
                "Core Web Vitals passing",
                "Load times acceptable",
              ]}
            />
            <StageCard
              stage="PROD"
              level="Complete"
              expectations={[
                "Actively monitored",
                "CDN and caching optimized",
                "Regression alerts in place",
              ]}
            />
          </div>
        </section>

        {/* ================================================================ */}
        {/* Tabbed Checklists */}
        {/* ================================================================ */}
        <Tabs defaultValue="load">
          <TabsList className="mb-4">
            <TabsTrigger value="load">
              <GaugeIcon className="h-4 w-4" />
              Load Performance
            </TabsTrigger>
            <TabsTrigger value="runtime">
              <CpuIcon className="h-4 w-4" />
              Runtime Efficiency
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Load Performance */}
          <TabsContent value="load">
            <Stack gap="lg">
              <ChecklistSection
                title="Core Web Vitals"
                stage="mmp"
                items={[
                  "LCP (Largest Contentful Paint) under 2.5 seconds",
                  "INP (Interaction to Next Paint) under 200 milliseconds",
                  "CLS (Cumulative Layout Shift) under 0.1",
                  "Metrics measured on real devices (not just dev machine)",
                  "Mobile performance tested (throttled connection)",
                  "Performance tested on key pages (home, login, dashboard)",
                ]}
              />

              <ChecklistSection
                title="Bundle Size"
                stage="mvp"
                items={[
                  "Initial JavaScript bundle under 200KB (gzipped)",
                  "Bundle analyzer run to identify large dependencies",
                  "No duplicate dependencies in bundle",
                  "Dynamic imports used for non-critical code",
                  "Tree shaking working (no unused exports bundled)",
                  "Third-party scripts loaded async or deferred",
                ]}
              />

              <ChecklistSection
                title="Image Optimization"
                stage="mvp"
                items={[
                  "Images use modern formats (WebP, AVIF)",
                  "Images properly sized (not oversized)",
                  "Responsive images with srcset",
                  "Images lazy-loaded below the fold",
                  "Hero images prioritized with priority prop",
                  "Image dimensions specified (prevents CLS)",
                  "Next.js Image component used",
                ]}
              />

              <ChecklistSection
                title="Font Optimization"
                stage="mmp"
                items={[
                  "Fonts preloaded for critical text",
                  "Font display: swap prevents invisible text",
                  "Font subsetting removes unused characters",
                  "Variable fonts used when multiple weights needed",
                  "System fonts considered for non-brand text",
                  "Font files served from same origin or CDN",
                ]}
              />

              <ChecklistSection
                title="Critical Rendering Path"
                stage="mmp"
                items={[
                  "Critical CSS inlined or preloaded",
                  "Render-blocking resources minimized",
                  "Above-the-fold content loads first",
                  "Non-critical CSS deferred",
                  "Preconnect to required origins",
                  "DNS prefetch for third-party domains",
                ]}
              />

              <ChecklistSection
                title="Third-Party Scripts"
                stage="mmp"
                items={[
                  "Third-party scripts audited and justified",
                  "Analytics loaded async",
                  "Chat widgets loaded on interaction",
                  "Social embeds lazy-loaded",
                  "Ad scripts don't block render",
                  "Tag manager usage optimized",
                ]}
              />

              <CommonIssues
                items={[
                  { issue: "LCP too slow", fix: "Optimize hero image, preload critical resources, reduce TTFB" },
                  { issue: "High CLS", fix: "Add dimensions to images, reserve space for dynamic content" },
                  { issue: "Large JavaScript bundle", fix: "Use dynamic imports, remove unused dependencies" },
                  { issue: "Render-blocking CSS", fix: "Inline critical CSS, defer non-critical styles" },
                  { issue: "Slow fonts", fix: "Use font-display: swap, preload critical fonts" },
                ]}
              />
            </Stack>
          </TabsContent>

          {/* Tab 2: Runtime Efficiency */}
          <TabsContent value="runtime">
            <Stack gap="lg">
              <ChecklistSection
                title="Database Queries"
                stage="mvp"
                items={[
                  "No N+1 query problems",
                  "Queries use appropriate indexes",
                  "Only needed columns selected (not SELECT *)",
                  "Pagination implemented for large datasets",
                  "Query execution time monitored",
                  "Connection pooling configured",
                  "Database in same region as server",
                ]}
              />

              <ChecklistSection
                title="React Performance"
                stage="mmp"
                items={[
                  "Unnecessary re-renders eliminated",
                  "React.memo used for expensive components",
                  "useMemo/useCallback used appropriately",
                  "Large lists virtualized (react-window, tanstack-virtual)",
                  "State co-located near where it's used",
                  "Context providers don't cause widespread re-renders",
                  "Key props used correctly in lists",
                ]}
              />

              <ChecklistSection
                title="API & Data Fetching"
                stage="mvp"
                items={[
                  "API responses cached where appropriate",
                  "Stale-while-revalidate pattern used",
                  "Optimistic updates for better UX",
                  "Parallel requests where possible",
                  "Request deduplication in place",
                  "GraphQL queries only request needed fields",
                  "API response pagination for large datasets",
                ]}
              />

              <ChecklistSection
                title="Memory Management"
                stage="mmp"
                items={[
                  "No memory leaks in effects (cleanup functions)",
                  "Event listeners removed on unmount",
                  "Large objects not held in state unnecessarily",
                  "File uploads use streaming (not memory buffer)",
                  "WeakMap/WeakSet used for caches where appropriate",
                  "Memory profiling done on long-running pages",
                ]}
              />

              <ChecklistSection
                title="Caching Strategy"
                stage="mmp"
                items={[
                  "CDN caching configured for static assets",
                  "Browser caching headers set appropriately",
                  "API responses cached at edge where possible",
                  "Service worker caches critical resources",
                  "Cache invalidation strategy defined",
                  "Stale-while-revalidate for frequently changing data",
                ]}
              />

              <ChecklistSection
                title="Server Performance"
                stage="prod"
                items={[
                  "TTFB (Time to First Byte) under 200ms",
                  "Server response time monitored",
                  "CPU and memory usage within limits",
                  "Auto-scaling configured for traffic spikes",
                  "Cold start time optimized (serverless)",
                  "Background tasks don't block requests",
                ]}
              />

              <CommonIssues
                items={[
                  { issue: "N+1 database queries", fix: "Use eager loading or data loaders to batch queries" },
                  { issue: "Entire page re-renders on state change", fix: "Co-locate state, use React.memo, split components" },
                  { issue: "Memory leak in useEffect", fix: "Return cleanup function, cancel subscriptions on unmount" },
                  { issue: "API called multiple times for same data", fix: "Implement request deduplication with SWR/React Query" },
                  { issue: "Slow initial API response", fix: "Add database indexes, optimize queries, cache at edge" },
                ]}
              />
            </Stack>
          </TabsContent>
        </Tabs>

        {/* ================================================================ */}
        {/* Tools & Resources */}
        {/* ================================================================ */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Tools &amp; Resources</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <ResourceCard
              title="Core Web Vitals"
              items={[
                { name: "PageSpeed Insights", url: "https://pagespeed.web.dev/", desc: "Google performance analysis" },
                { name: "web.dev/measure", url: "https://web.dev/measure/", desc: "Web vitals measurement" },
                { name: "WebPageTest", url: "https://www.webpagetest.org/", desc: "Detailed performance analysis" },
                { name: "Lighthouse", url: "https://developer.chrome.com/docs/lighthouse/", desc: "Chrome DevTools audits" },
              ]}
            />
            <ResourceCard
              title="Bundle Analysis"
              items={[
                { name: "@next/bundle-analyzer", url: "https://www.npmjs.com/package/@next/bundle-analyzer", desc: "Next.js bundle visualization" },
                { name: "source-map-explorer", url: "https://www.npmjs.com/package/source-map-explorer", desc: "Analyze bundle composition" },
                { name: "bundlephobia", url: "https://bundlephobia.com/", desc: "Package size lookup" },
                { name: "import-cost", url: "https://marketplace.visualstudio.com/items?itemName=wix.vscode-import-cost", desc: "VS Code extension" },
              ]}
            />
            <ResourceCard
              title="React Performance"
              items={[
                { name: "React DevTools Profiler", url: "https://react.dev/learn/react-developer-tools", desc: "Component render analysis" },
                { name: "Why Did You Render", url: "https://www.npmjs.com/package/@welldone-software/why-did-you-render", desc: "Detect unnecessary re-renders" },
                { name: "Million.js", url: "https://million.dev/", desc: "React performance optimization" },
                { name: "React Scan", url: "https://github.com/aidenybai/react-scan", desc: "Detect performance issues" },
              ]}
            />
            <ResourceCard
              title="Monitoring"
              items={[
                { name: "Vercel Analytics", url: "https://vercel.com/analytics", desc: "Real user performance data" },
                { name: "Sentry Performance", url: "https://sentry.io/for/performance/", desc: "APM and tracing" },
                { name: "web-vitals library", url: "https://www.npmjs.com/package/web-vitals", desc: "Measure Core Web Vitals" },
                { name: "Speedlify", url: "https://www.speedlify.dev/", desc: "Performance monitoring dashboard" },
              ]}
            />
          </div>
        </section>

        {/* ================================================================ */}
        {/* AI Agent Quick Commands */}
        {/* ================================================================ */}
        <section className="rounded-xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-900/50 dark:bg-amber-950/20">
          <h3 className="mb-3 font-semibold text-amber-900 dark:text-amber-200">AI Agent Commands</h3>
          <Text size="sm" className="mb-3 text-amber-800 dark:text-amber-300">
            Use these prompts with your AI coding agent to check performance:
          </Text>
          <ul className="space-y-2 text-sm text-amber-800 dark:text-amber-300">
            <li><code className="rounded bg-amber-100 px-1.5 py-0.5 dark:bg-amber-900/50">Run the Performance audit at MVP level</code></li>
            <li><code className="rounded bg-amber-100 px-1.5 py-0.5 dark:bg-amber-900/50">Find components that could benefit from React.memo</code></li>
            <li><code className="rounded bg-amber-100 px-1.5 py-0.5 dark:bg-amber-900/50">Check for N+1 query patterns in API routes</code></li>
            <li><code className="rounded bg-amber-100 px-1.5 py-0.5 dark:bg-amber-900/50">Audit images for optimization opportunities</code></li>
            <li><code className="rounded bg-amber-100 px-1.5 py-0.5 dark:bg-amber-900/50">Find large dependencies that could be lazy loaded</code></li>
          </ul>
        </section>

        {/* ================================================================ */}
        {/* Related Audits */}
        {/* ================================================================ */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Related audits</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <RelatedAuditCard
              href="/docs/audits/experience"
              title="Design & Experience"
              description="Performance affects user experience"
            />
            <RelatedAuditCard
              href="/docs/audits/deploy"
              title="Deploy & Observe"
              description="Monitor performance in production"
            />
            <RelatedAuditCard
              href="/docs/audits/code"
              title="Code & Testing"
              description="Code quality impacts performance"
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
