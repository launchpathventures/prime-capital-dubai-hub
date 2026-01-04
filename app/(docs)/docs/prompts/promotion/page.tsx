/**
 * CATALYST - Stage Promotion Prompts
 *
 * Prompts for transitioning between stages with the right quality bar.
 * Includes POC→MVP, MVP→MMP, and MMP→PROD promotion checklists.
 */

import Link from "next/link"
import { Stack, Text, Row } from "@/components/core"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { MarkdownViewer } from "@/components/shared"
import {
  ArrowLeftIcon,
  TrendingUpIcon,
  ArrowRightIcon,
  AlertTriangleIcon,
} from "lucide-react"
import { getPrompts } from "@/lib/prompts"
import { cn } from "@/lib/utils"

// =============================================================================
// Load prompts from files at build time
// =============================================================================

const promptDefs = [
  { name: "POC → MVP", source: "codingai-promotion-poc-mvp.md" },
  { name: "MVP → MMP", source: "codingai-promotion-mvp-mmp.md" },
  { name: "MMP → PROD", source: "codingai-promotion-mmp-prod.md" },
]

// =============================================================================
// Page Component
// =============================================================================

export default function StagePromotionPage() {
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
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-100 dark:bg-sky-900/30">
              <TrendingUpIcon className="h-5 w-5 text-sky-600 dark:text-sky-400" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              Stage Promotion
            </h1>
          </Row>
          <Text size="lg" variant="muted" className="leading-relaxed">
            Transition between stages with the right quality bar. These prompts
            guide systematic review and hardening before promotion.
          </Text>
        </header>

        {/* Why staged promotion */}
        <section className="rounded-xl border border-dashed p-5">
          <Text weight="semibold" className="mb-2">
            Why staged promotion matters
          </Text>
          <Text size="sm" variant="muted" className="leading-relaxed">
            Production is a choice, not an accident. Each stage has different
            quality expectations. These prompts help you systematically verify
            you&apos;ve met the bar before moving forward — preventing
            &ldquo;accidental production&rdquo; where a rough proof becomes the
            live system.
          </Text>
        </section>

        {/* Tabbed Prompts */}
        <Tabs defaultValue="pocMvp">
          <TabsList className="mb-4">
            {prompts.map((prompt, index) => (
              <TabsTrigger
                key={prompt.source}
                value={
                  index === 0 ? "pocMvp" : index === 1 ? "mvpMmp" : "mmpProd"
                }
              >
                {prompt.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {prompts.map((prompt, index) => (
            <TabsContent
              key={prompt.source}
              value={
                index === 0 ? "pocMvp" : index === 1 ? "mvpMmp" : "mmpProd"
              }
            >
              <MarkdownViewer
                title={prompt.name}
                filename={prompt.source}
                content={prompt.content}
              />
            </TabsContent>
          ))}
        </Tabs>

        {/* Promotion overview */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Promotion overview</h2>
          <div className="space-y-4">
            <PromotionCard
              from="POC"
              to="MVP"
              fromColor="blue"
              toColor="amber"
              focus="Adding real users and data"
              keyChanges={[
                "Add authentication",
                "Connect real database",
                "Implement core happy paths",
                "Basic error handling",
                "Responsive design",
              ]}
            />
            <PromotionCard
              from="MVP"
              to="MMP"
              fromColor="amber"
              toColor="purple"
              focus="Ready for paying customers"
              keyChanges={[
                "Polish UI/UX",
                "Comprehensive error handling",
                "Performance optimisation",
                "Security review",
                "User documentation",
              ]}
            />
            <PromotionCard
              from="MMP"
              to="PROD"
              fromColor="purple"
              toColor="emerald"
              focus="Enterprise-ready operations"
              keyChanges={[
                "Monitoring and alerting",
                "Backup and recovery",
                "Incident response process",
                "Support runbooks",
                "SLA definition",
              ]}
            />
          </div>
        </section>

        {/* Stage skipping warning */}
        <section className="rounded-xl border border-destructive/30 bg-destructive/5 p-5">
          <Row gap="sm" className="mb-2 items-center">
            <AlertTriangleIcon className="h-5 w-5 text-destructive" />
            <Text weight="semibold" className="text-destructive">
              The risk of skipping stages
            </Text>
          </Row>
          <Text size="sm" variant="muted" className="mb-3 leading-relaxed">
            Skipping stages is the primary cause of &ldquo;accidental
            production&rdquo; — where a prototype becomes the live system
            without proper hardening.
          </Text>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <strong>POC → PROD skip:</strong> Security vulnerabilities, data
              loss risks, operational fragility
            </li>
            <li>
              <strong>MVP → PROD skip:</strong> Poor user experience, missing
              features, support chaos
            </li>
            <li>
              <strong>MMP → PROD skip:</strong> Operational failures, missing
              runbooks, incident response gaps
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
                href="/docs/workflow/poc"
                className="text-primary hover:underline"
              >
                POC Workflow
              </Link>{" "}
              →{" "}
              <Link
                href="/docs/workflow/mvp"
                className="text-primary hover:underline"
              >
                MVP Workflow
              </Link>{" "}
              →{" "}
              <Link
                href="/docs/workflow/mmp"
                className="text-primary hover:underline"
              >
                MMP Workflow
              </Link>{" "}
              →{" "}
              <Link
                href="/docs/workflow/production"
                className="text-primary hover:underline"
              >
                PROD Workflow
              </Link>
            </li>
            <li>
              <Link
                href="/docs/prompts/quality"
                className="text-primary hover:underline"
              >
                Quality & Audits
              </Link>{" "}
              — Run audits before promotion
            </li>
            <li>
              <Link
                href="/docs/workflow/delivery"
                className="text-primary hover:underline"
              >
                Delivery Cycles
              </Link>{" "}
              — Advancement criteria for production
            </li>
          </ul>
        </section>

        {/* Navigation */}
        <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/docs/prompts/quality"
            className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Quality
          </Link>
          <Link
            href="/docs/prompts"
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
          >
            Prompts Overview
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

const stageColors = {
  blue: {
    badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
  amber: {
    badge:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  },
  purple: {
    badge:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  },
  emerald: {
    badge:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
} as const

function PromotionCard({
  from,
  to,
  fromColor,
  toColor,
  focus,
  keyChanges,
}: {
  from: string
  to: string
  fromColor: keyof typeof stageColors
  toColor: keyof typeof stageColors
  focus: string
  keyChanges: string[]
}) {
  return (
    <div className="rounded-xl border p-5">
      <div className="mb-4 flex items-center gap-3">
        <span
          className={cn(
            "rounded-lg px-2.5 py-1 text-sm font-bold",
            stageColors[fromColor].badge
          )}
        >
          {from}
        </span>
        <ArrowRightIcon className="h-4 w-4 text-muted-foreground" />
        <span
          className={cn(
            "rounded-lg px-2.5 py-1 text-sm font-bold",
            stageColors[toColor].badge
          )}
        >
          {to}
        </span>
        <Text size="sm" variant="muted" className="ml-2">
          {focus}
        </Text>
      </div>

      <div>
        <Text size="xs" weight="medium" className="mb-2 text-muted-foreground">
          Key changes:
        </Text>
        <ul className="flex flex-wrap gap-2">
          {keyChanges.map((change, i) => (
            <li
              key={i}
              className="rounded bg-muted px-2 py-1 text-xs text-muted-foreground"
            >
              {change}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
