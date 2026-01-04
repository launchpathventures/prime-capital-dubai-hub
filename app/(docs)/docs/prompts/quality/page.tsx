/**
 * CATALYST - Quality & Audits Prompts
 *
 * Prompts for running structured quality checks against your codebase.
 * Includes Audit Runner and Hardening prompts.
 */

import Link from "next/link"
import { Stack, Text, Row } from "@/components/core"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { MarkdownViewer } from "@/components/shared"
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
  LightbulbIcon,
} from "lucide-react"
import { getPrompts } from "@/lib/prompts"

// =============================================================================
// Load prompts from files at build time
// =============================================================================

const promptDefs = [
  { name: "Audit Runner", source: "codingai-audit.md" },
  { name: "Hardening", source: "codingai-hardening.md" },
]

// =============================================================================
// Page Component
// =============================================================================

export default function QualityPromptsPage() {
  const prompts = getPrompts(promptDefs)

  return (
    <article>
      <Stack gap="xl">
        {/* Breadcrumb */}
        <Link
          href="/docs/prompts"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm"
        >
          <ArrowLeftIcon className="h-3.5 w-3.5" />
          Back to Prompts
        </Link>

        {/* Header */}
        <header className="space-y-3">
          <Row gap="sm" className="items-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
              <ShieldCheckIcon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              Quality & Audits
            </h1>
          </Row>
          <Text size="lg" variant="muted" className="leading-relaxed">
            Run structured quality checks against your codebase. These prompts
            help the Coding Agent systematically verify quality across security,
            accessibility, performance, and more.
          </Text>
        </header>

        {/* How audits work */}
        <section className="rounded-xl border border-dashed p-5">
          <Text weight="semibold" className="mb-2">
            How audits work with prompts
          </Text>
          <Text size="sm" variant="muted" className="leading-relaxed">
            The{" "}
            <Link href="/docs/audits" className="text-primary hover:underline">
              Audits section
            </Link>{" "}
            defines <strong>what to check</strong> — checklists organised by
            category with stage-appropriate expectations. These prompts tell the
            Coding Agent <strong>how to run</strong> the audits: what to examine,
            how to report findings, and what to fix.
          </Text>
        </section>

        {/* Tabbed Prompts */}
        <Tabs defaultValue="audit">
          <TabsList className="mb-4">
            {prompts.map((prompt, index) => (
              <TabsTrigger
                key={prompt.source}
                value={index === 0 ? "audit" : "hardening"}
              >
                {prompt.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {prompts.map((prompt, index) => (
            <TabsContent
              key={prompt.source}
              value={index === 0 ? "audit" : "hardening"}
            >
              <MarkdownViewer
                title={prompt.name}
                filename={prompt.source}
                content={prompt.content}
              />
            </TabsContent>
          ))}
        </Tabs>

        {/* Usage examples */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Example usage</h2>
          <div className="space-y-3">
            <ExampleCard
              prompt="Run the Security audit at MVP level for the App surface"
              result="Agent checks auth, secrets, input validation — reports pass/fail with specific file locations"
            />
            <ExampleCard
              prompt="Run the Accessibility audit at MVP level"
              result="Agent checks keyboard navigation, screen reader support, color contrast — reports 3 failures with fixes"
            />
            <ExampleCard
              prompt="Harden this codebase for MMP release"
              result="Agent runs all audits at MMP level, finds 12 issues, prioritises 4 as critical blockers"
            />
          </div>
        </section>

        {/* Audit categories */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Available audits</h2>
          <Text size="sm" variant="muted">
            These prompts can run any of the 8 audit categories:
          </Text>
          <div className="grid gap-2 md:grid-cols-2">
            <AuditLink name="Data & Security" href="/docs/audits/data" />
            <AuditLink
              name="Accessibility & Inclusion"
              href="/docs/audits/accessibility"
            />
            <AuditLink name="Design & Experience" href="/docs/audits/experience" />
            <AuditLink name="Speed & Performance" href="/docs/audits/performance" />
            <AuditLink name="Code & Testing" href="/docs/audits/code" />
            <AuditLink name="Deploy & Observe" href="/docs/audits/deploy" />
            <AuditLink name="Content & SEO" href="/docs/audits/content" />
            <AuditLink
              name="Integrations & Services"
              href="/docs/audits/integrations"
            />
          </div>
        </section>

        {/* Tips */}
        <section className="rounded-xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-900/50 dark:bg-amber-950/20">
          <Row gap="sm" className="mb-3 items-center">
            <LightbulbIcon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            <Text weight="semibold">Tips</Text>
          </Row>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              • Always specify the <strong>stage level</strong> — POC has
              different expectations than PROD
            </li>
            <li>
              • Use <strong>Hardening</strong> before stage promotion to get a
              comprehensive gap analysis
            </li>
            <li>
              • Run specific audits to focus on one area (e.g., &ldquo;Run
              Security audit only&rdquo;)
            </li>
            <li>
              • The agent will provide file locations and suggested fixes for
              failures
            </li>
          </ul>
        </section>

        {/* Related docs */}
        <section className="border-border rounded-xl border border-dashed p-5">
          <Text weight="medium" className="mb-3">
            Related docs
          </Text>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href="/docs/audits"
                className="text-primary hover:underline"
              >
                Audits
              </Link>{" "}
              — Full audit checklists by category
            </li>
            <li>
              <Link
                href="/docs/prompts/promotion"
                className="text-primary hover:underline"
              >
                Stage Promotion
              </Link>{" "}
              — Use hardening before promoting stages
            </li>
            <li>
              <Link
                href="/docs/workflow/delivery"
                className="text-primary hover:underline"
              >
                Delivery Cycles
              </Link>{" "}
              — Audits validate phase checkpoints
            </li>
          </ul>
        </section>

        {/* Navigation */}
        <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/docs/prompts/coding-sessions"
            className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Coding Sessions
          </Link>
          <Link
            href="/docs/prompts/promotion"
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
          >
            Promotion
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

function ExampleCard({ prompt, result }: { prompt: string; result: string }) {
  return (
    <div className="rounded-lg border p-4">
      <Text size="sm" weight="medium" className="italic">
        &ldquo;{prompt}&rdquo;
      </Text>
      <Text size="sm" variant="muted" className="mt-2">
        → {result}
      </Text>
    </div>
  )
}

function AuditLink({ name, href }: { name: string; href: string }) {
  return (
    <Link
      href={href}
      className="rounded-lg border p-3 text-sm transition-colors hover:border-primary/50 hover:text-primary"
    >
      {name}
    </Link>
  )
}
