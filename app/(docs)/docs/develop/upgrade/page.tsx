/**
 * CATALYST - Upgrade Checklists
 *
 * Technical checklists for stage and stack transitions. Uses tabs for
 * easy navigation between different transition types.
 */

import Link from "next/link"
import { Stack, Text, Row } from "@/components/core"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  ArrowRightIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  ClipboardListIcon,
  LayersIcon,
  DatabaseIcon,
  ServerIcon,
  CircleIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function UpgradeChecklistsPage() {
  return (
    <article>
      <Stack gap="xl">
        {/* Header */}
        <header className="space-y-3">
          <Row gap="sm" className="items-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-900/30">
              <ClipboardListIcon className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Upgrade Checklists
              </h1>
              <Text variant="muted" className="italic">
                What needs to change?
              </Text>
            </div>
          </Row>
          <Text size="lg" variant="muted" className="leading-relaxed">
            Technical worklists for stage and stack transitions. Complete these
            items to advance intentionally and avoid accidental production.
          </Text>
        </header>

        {/* How it works callout */}
        <section className="rounded-xl border border-sky-200 bg-gradient-to-br from-sky-50 to-cyan-50/50 p-5 dark:border-sky-900/50 dark:from-sky-950/20 dark:to-cyan-950/10">
          <h2 className="font-semibold">How advancement works</h2>
          <Text size="sm" variant="muted" className="mt-2 leading-relaxed">
            Advancement is intentional, not accidental. Before moving to the next
            stage:
          </Text>
          <ol className="text-muted-foreground mt-3 list-inside list-decimal space-y-1 text-sm">
            <li>
              Complete several{" "}
              <Link
                href="/docs/workflow/delivery"
                className="text-primary hover:underline"
              >
                delivery cycles
              </Link>{" "}
              until the work is validated
            </li>
            <li>Complete the technical checklist below</li>
            <li>
              Run the relevant{" "}
              <Link href="/docs/audits" className="text-primary hover:underline">
                audits
              </Link>{" "}
              at your target stage level
            </li>
          </ol>
        </section>

        {/* ================================================================ */}
        {/* Stage Transitions */}
        {/* ================================================================ */}
        <section className="space-y-4">
          <Row gap="sm" className="items-center">
            <LayersIcon className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Stage Transitions</h2>
          </Row>

          <Tabs defaultValue="poc-mvp">
            <TabsList className="mb-4">
              <TabsTrigger value="poc-mvp">
                POC → MVP
              </TabsTrigger>
              <TabsTrigger value="mvp-mmp">
                MVP → MMP
              </TabsTrigger>
              <TabsTrigger value="mmp-prod">
                MMP → PROD
              </TabsTrigger>
            </TabsList>

            {/* POC → MVP */}
            <TabsContent value="poc-mvp">
              <TransitionCard
                from="POC"
                to="MVP"
                summary="Introduce persistence, auth, and basic quality checks."
                effort="2-3 days"
                entryCriteria={[
                  "POC validated with stakeholders",
                  "Core assumptions proven",
                  "Brief checkpoint passed",
                  "MVP scope defined",
                ]}
                workItems={[
                  "Replace mock data with real database",
                  "Implement user authentication",
                  "Add proper error handling",
                  "Implement core happy-path tests",
                  "Set up environment configuration",
                  "Add basic logging",
                  "Review and fix security basics",
                  "Update State of Play document",
                ]}
                antiPatterns={[
                  "Keeping mock data 'temporarily'",
                  "Skipping auth because 'it's internal'",
                  "No error handling on critical paths",
                  "Hardcoded configuration values",
                ]}
              />
            </TabsContent>

            {/* MVP → MMP */}
            <TabsContent value="mvp-mmp">
              <TransitionCard
                from="MVP"
                to="MMP"
                summary="Polish, harden, and prepare for real users."
                effort="1-2 weeks"
                entryCriteria={[
                  "MVP features complete and tested",
                  "Early user feedback incorporated",
                  "Review checkpoint passed",
                  "Performance baseline established",
                ]}
                workItems={[
                  "UI/UX polish and consistency pass",
                  "Comprehensive error handling",
                  "Edge case handling",
                  "Performance optimisation",
                  "Security review and fixes",
                  "Accessibility audit",
                  "Documentation for users",
                  "Support escalation path defined",
                ]}
                antiPatterns={[
                  "Launching without load testing",
                  "Ignoring accessibility",
                  "No user documentation",
                  "Missing support processes",
                ]}
              />
            </TabsContent>

            {/* MMP → PROD */}
            <TabsContent value="mmp-prod">
              <TransitionCard
                from="MMP"
                to="PROD"
                summary="Operationalise for production traffic."
                effort="1 week"
                entryCriteria={[
                  "MMP features stable",
                  "Performance testing complete",
                  "Security review passed",
                  "Refine checkpoint criteria reviewed",
                ]}
                workItems={[
                  "Monitoring and alerting configured",
                  "Backup and recovery tested",
                  "Incident response process documented",
                  "Runbook created for operations",
                  "SLA defined and achievable",
                  "On-call/support rotation established",
                  "Disaster recovery plan documented",
                  "Final security sign-off",
                ]}
                antiPatterns={[
                  "No monitoring in production",
                  "Untested backup/recovery",
                  "No incident response plan",
                  "Missing operational runbook",
                ]}
              />
            </TabsContent>
          </Tabs>
        </section>

        {/* ================================================================ */}
        {/* Stack Transitions */}
        {/* ================================================================ */}
        <section className="space-y-4">
          <Row gap="sm" className="items-center">
            <ServerIcon className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Stack Transitions</h2>
          </Row>
          <Text size="sm" variant="muted">
            Technical checklists for adding backend capabilities.
          </Text>

          <Tabs defaultValue="a-to-b">
            <TabsList className="mb-4">
              <TabsTrigger value="a-to-b">
                <DatabaseIcon className="h-4 w-4" />
                A → B (Supabase)
              </TabsTrigger>
              <TabsTrigger value="a-to-c">
                <ServerIcon className="h-4 w-4" />
                A → C (Laravel)
              </TabsTrigger>
            </TabsList>

            {/* A → B */}
            <TabsContent value="a-to-b">
              <TransitionCard
                from="Stack A"
                to="Stack B"
                summary="Add auth and persistence with Supabase."
                effort="1-2 days"
                entryCriteria={[
                  "POC validated",
                  "Need for auth or data persistence confirmed",
                  "Supabase is appropriate (not needing Stack C)",
                ]}
                workItems={[
                  "Create Supabase project",
                  "Add environment variables to .env.local",
                  "Install @supabase/supabase-js and @supabase/ssr",
                  "Create lib/supabase/ with client utilities",
                  "Design database schema",
                  "Implement row-level security policies",
                  "Migrate mock data to database",
                  "Implement authentication flow",
                  "Update API calls to use Supabase",
                  "Test auth flow end-to-end",
                ]}
                antiPatterns={[
                  "No row-level security on tables",
                  "Exposing service role key to client",
                  "Skipping database design",
                  "No testing of auth flow",
                ]}
              />
            </TabsContent>

            {/* A → C */}
            <TabsContent value="a-to-c">
              <TransitionCard
                from="Stack A"
                to="Stack C"
                summary="Add a full backend API with Laravel."
                effort="3-5 days"
                entryCriteria={[
                  "POC validated",
                  "Complex backend requirements confirmed",
                  "Laravel expertise available",
                  "Supabase would not be sufficient",
                ]}
                workItems={[
                  "Set up Laravel project (separate repo or monorepo)",
                  "Define API contract (OpenAPI recommended)",
                  "Add NEXT_PUBLIC_API_URL environment variable",
                  "Create lib/api/ with API client utilities",
                  "Implement Laravel Sanctum for auth",
                  "Set up CORS configuration",
                  "Implement API versioning strategy",
                  "Create database migrations",
                  "Implement API endpoints",
                  "Connect Next.js to Laravel API",
                  "Test auth flow end-to-end",
                ]}
                antiPatterns={[
                  "No API contract documentation",
                  "CORS misconfiguration",
                  "No API versioning",
                  "Mixing auth strategies",
                ]}
              />
            </TabsContent>
          </Tabs>
        </section>

        {/* ================================================================ */}
        {/* Related docs */}
        {/* ================================================================ */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Related docs</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <RelatedCard
              href="/docs/workflow/delivery"
              title="Delivery Cycles"
              description="How the loop works at each stage"
            />
            <RelatedCard
              href="/docs/audits"
              title="Audits"
              description="Quality verification by area"
            />
            <RelatedCard
              href="/docs/develop/deployments"
              title="Deployments"
              description="Branch strategy and Vercel setup"
            />
          </div>
        </section>
      </Stack>
    </article>
  )
}

// =============================================================================
// HELPER COMPONENTS
// =============================================================================

function TransitionCard({
  from,
  to,
  summary,
  effort,
  entryCriteria,
  workItems,
  antiPatterns,
}: {
  from: string
  to: string
  summary: string
  effort: string
  entryCriteria: string[]
  workItems: string[]
  antiPatterns: string[]
}) {
  return (
    <div className="space-y-6 rounded-xl border p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <Row gap="sm" className="items-center">
            <span className="rounded bg-muted px-2 py-1 font-mono text-sm font-medium">
              {from}
            </span>
            <ArrowRightIcon className="h-4 w-4 text-muted-foreground" />
            <span className="rounded bg-primary/10 px-2 py-1 font-mono text-sm font-medium text-primary">
              {to}
            </span>
          </Row>
          <Text variant="muted" className="mt-2">
            {summary}
          </Text>
        </div>
        <span className="shrink-0 rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-700 dark:bg-violet-900/30 dark:text-violet-400">
          ~{effort}
        </span>
      </div>

      {/* Entry Criteria & Anti-Patterns */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/20">
          <Row gap="sm" className="mb-3 items-center">
            <CheckCircleIcon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <Text size="sm" weight="semibold" className="text-emerald-900 dark:text-emerald-200">
              Entry Criteria
            </Text>
          </Row>
          <ul className="space-y-2">
            {entryCriteria.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-emerald-800 dark:text-emerald-300">
                <CircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400/60" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-4 dark:border-amber-900/50 dark:bg-amber-950/20">
          <Row gap="sm" className="mb-3 items-center">
            <AlertTriangleIcon className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <Text size="sm" weight="semibold" className="text-amber-900 dark:text-amber-200">
              Anti-Patterns
            </Text>
          </Row>
          <ul className="space-y-2">
            {antiPatterns.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-amber-800 dark:text-amber-300">
                <CircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-amber-400/60" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Work Items */}
      <div className="rounded-lg border p-4">
        <Row gap="sm" className="mb-3 items-center">
          <ClipboardListIcon className="h-4 w-4 text-muted-foreground" />
          <Text size="sm" weight="semibold">
            Required Work Items
          </Text>
        </Row>
        <ul className="grid gap-2 sm:grid-cols-2">
          {workItems.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <CircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/40" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function RelatedCard({
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
      <Text weight="medium" className="text-primary">
        {title}
      </Text>
      <Text size="sm" variant="muted" className="mt-1">
        {description}
      </Text>
    </Link>
  )
}
