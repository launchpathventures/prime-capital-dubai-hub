/**
 * CATALYST - Coding Sessions Prompts
 *
 * Prompts for setting up coding sessions with proper context and constraints.
 * Includes Starter, Feature, and Debug prompts for the Coding Agent.
 */

import Link from "next/link"
import { Stack, Text, Row } from "@/components/core"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { MarkdownViewer } from "@/components/shared"
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CodeIcon,
  LightbulbIcon,
  AlertTriangleIcon,
} from "lucide-react"
import { getPrompts } from "@/lib/prompts"

// =============================================================================
// Load prompts from files at build time
// =============================================================================

const promptDefs = [
  { name: "Starter", source: "codingai-1-starter.md" },
  { name: "Feature", source: "codingai-2-feature.md" },
  { name: "Debug", source: "codingai-debug.md" },
]

// =============================================================================
// Page Component
// =============================================================================

export default function CodingSessionsPage() {
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
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
              <CodeIcon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              Coding Sessions
            </h1>
          </Row>
          <Text size="lg" variant="muted" className="leading-relaxed">
            Set up coding sessions with proper context and constraints. These
            prompts establish the Coding Agent&apos;s behaviour, load project
            artefacts, and ensure quality output.
          </Text>
        </header>

        {/* How Coding Agent works */}
        <section className="rounded-xl border border-dashed p-5">
          <Text weight="semibold" className="mb-2">
            How the Coding Agent works
          </Text>
          <Text size="sm" variant="muted" className="leading-relaxed">
            The Coding Agent reads project artefacts from{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
              /catalyst/specs/
            </code>{" "}
            and follows conventions from{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
              AGENTS.md
            </code>
            . It proposes phased build plans, implements incrementally, and
            validates its work.
          </Text>
        </section>

        {/* Tabbed Prompts */}
        <Tabs defaultValue="starter">
          <TabsList className="mb-4">
            {prompts.map((prompt, index) => (
              <TabsTrigger
                key={prompt.source}
                value={index === 0 ? "starter" : index === 1 ? "feature" : "debug"}
              >
                {prompt.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {prompts.map((prompt, index) => (
            <TabsContent
              key={prompt.source}
              value={index === 0 ? "starter" : index === 1 ? "feature" : "debug"}
            >
              <MarkdownViewer
                title={prompt.name}
                filename={prompt.source}
                content={prompt.content}
              />
            </TabsContent>
          ))}
        </Tabs>

        {/* When to use each */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">When to use each prompt</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <WhenToUseCard
              title="Starter"
              description="Every new coding session. Establishes behaviour, loads artefacts, sets guardrails."
            />
            <WhenToUseCard
              title="Feature"
              description="Starting a new feature or major piece of work. Proposes phased plan before building."
            />
            <WhenToUseCard
              title="Debug"
              description="When something is broken. Systematic troubleshooting with hypothesis testing."
            />
          </div>
        </section>

        {/* Session workflow */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Session workflow</h2>
          <div className="rounded-xl border p-5">
            <ol className="space-y-3 text-sm">
              <WorkflowStep number={1} title="Paste Starter prompt">
                Sets up the Coding Agent and loads artefacts
              </WorkflowStep>
              <WorkflowStep number={2} title="Describe what you want to build">
                Reference the Requirements doc or describe the task
              </WorkflowStep>
              <WorkflowStep number={3} title="Review the phased plan">
                Agent proposes phases — approve or adjust before building
              </WorkflowStep>
              <WorkflowStep number={4} title="Build incrementally">
                One phase at a time, with summary after each
              </WorkflowStep>
              <WorkflowStep number={5} title="Validate and review">
                Run typecheck, lint, test — approve or iterate
              </WorkflowStep>
            </ol>
          </div>
        </section>

        {/* What the agent reads */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">
            What the agent reads automatically
          </h2>
          <div className="grid gap-3 md:grid-cols-2">
            <FileCard
              path="AGENTS.md"
              description="Repo conventions, coding standards, non-negotiables"
            />
            <FileCard
              path="catalyst/specs/project-vision.md"
              description="North star, success criteria, personas"
            />
            <FileCard
              path="catalyst/specs/project-architecture.md"
              description="Design decisions, trade-offs, structure"
            />
            <FileCard
              path="catalyst/specs/project-requirements.md"
              description="Current phase scope, in/out boundaries"
            />
          </div>
        </section>

        {/* Tips */}
        <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-900/50 dark:bg-emerald-950/20">
          <Row gap="sm" className="mb-3 items-center">
            <LightbulbIcon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            <Text weight="semibold">Tips</Text>
          </Row>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              • Always paste <strong>Starter prompt first</strong> — it sets
              guardrails
            </li>
            <li>
              • Break large work into phases — easier to review, less rework
            </li>
            <li>• The agent will ask clarifying questions — answer them</li>
            <li>
              • Run validation after implementation (the agent might suggest
              this)
            </li>
          </ul>
        </section>

        {/* Common mistakes */}
        <section className="rounded-xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-900/50 dark:bg-amber-950/20">
          <Row gap="sm" className="mb-3 items-center">
            <AlertTriangleIcon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            <Text weight="semibold">Common mistakes</Text>
          </Row>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              • Skipping Starter prompt — agent invents scope, ignores
              conventions
            </li>
            <li>
              • Not having artefacts in{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-xs">
                /catalyst/specs/
              </code>{" "}
              — agent has no context
            </li>
            <li>
              • Approving phases without review — hard to course-correct later
            </li>
            <li>• Not running validation — type errors, lint issues accumulate</li>
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
                href="/docs/prompts/project-artefacts"
                className="text-primary hover:underline"
              >
                Project Artefacts
              </Link>{" "}
              — Create the artefacts the Coding Agent reads
            </li>
            <li>
              <Link
                href="/docs/prompts/quality"
                className="text-primary hover:underline"
              >
                Quality & Audits
              </Link>{" "}
              — Run quality checks on what you&apos;ve built
            </li>
            <li>
              <Link
                href="/docs/workflow/poc"
                className="text-primary hover:underline"
              >
                POC Workflow
              </Link>{" "}
              — Quality expectations for proof-of-concept builds
            </li>
          </ul>
        </section>

        {/* Navigation */}
        <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/docs/prompts/project-artefacts"
            className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Project Artefacts
          </Link>
          <Link
            href="/docs/prompts/quality"
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
          >
            Quality
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

function WhenToUseCard({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="rounded-lg border p-4">
      <Text weight="semibold" className="mb-1">
        {title}
      </Text>
      <Text size="sm" variant="muted">
        {description}
      </Text>
    </div>
  )
}

function WorkflowStep({
  number,
  title,
  children,
}: {
  number: number
  title: string
  children: React.ReactNode
}) {
  return (
    <li className="flex gap-3">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
        {number}
      </span>
      <div>
        <Text weight="medium">{title}</Text>
        <Text size="sm" variant="muted">
          {children}
        </Text>
      </div>
    </li>
  )
}

function FileCard({ path, description }: { path: string; description: string }) {
  return (
    <div className="rounded-lg bg-muted/50 p-3">
      <code className="text-sm font-medium">{path}</code>
      <Text size="xs" variant="muted" className="mt-1">
        {description}
      </Text>
    </div>
  )
}
