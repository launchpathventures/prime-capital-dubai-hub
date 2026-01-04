/**
 * CATALYST - Project Sessions Prompts
 *
 * Prompts for starting, continuing, and validating project conversations
 * with the Project Agent. Includes Starter, Continue, Stress Test, and State of Play.
 */

import Link from "next/link"
import { Stack, Text, Row } from "@/components/core"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { MarkdownViewer } from "@/components/shared"
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  MessageSquareIcon,
  LightbulbIcon,
  AlertTriangleIcon,
} from "lucide-react"
import { getPrompts } from "@/lib/prompts"

// =============================================================================
// Load prompts from files at build time
// =============================================================================

const promptDefs = [
  { name: "Starter", source: "projectai-1-starter.md" },
  { name: "Continue", source: "projectai-2-continue.md" },
  { name: "Stress Test", source: "projectai-3-stresstest.md" },
  { name: "State of Play", source: "projectai-4-stateofplay.md" },
]

// =============================================================================
// Page Component
// =============================================================================

export default function ProjectSessionsPage() {
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
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-900/30">
              <MessageSquareIcon className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              Project Sessions
            </h1>
          </Row>
          <Text size="lg" variant="muted" className="leading-relaxed">
            Start, continue, and validate project conversations with the Project
            Agent. These prompts establish context and keep the project aligned.
          </Text>
        </header>

        {/* Tabbed Prompts */}
        <Tabs defaultValue="starter">
          <TabsList className="mb-4">
            {prompts.map((prompt, index) => (
              <TabsTrigger
                key={prompt.source}
                value={
                  index === 0
                    ? "starter"
                    : index === 1
                      ? "continue"
                      : index === 2
                        ? "stressTest"
                        : "stateOfPlay"
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
                index === 0
                  ? "starter"
                  : index === 1
                    ? "continue"
                    : index === 2
                      ? "stressTest"
                      : "stateOfPlay"
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

        {/* When to use each */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">When to use each prompt</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <WhenToUseCard
              title="Starter"
              description="Beginning of a new project or major initiative. Sets up the Project Agent with its core responsibilities."
            />
            <WhenToUseCard
              title="Continue"
              description="Starting a new chat session for an ongoing project. Loads context from existing artefacts."
            />
            <WhenToUseCard
              title="Stress Test"
              description="Before Refine checkpoint or major handovers. Validates assumptions and confirms readiness."
            />
            <WhenToUseCard
              title="State of Play"
              description="End of sprint, before handover, or when resuming work. Captures current status as a snapshot."
            />
          </div>
        </section>

        {/* Session workflow */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Session workflow</h2>
          <div className="rounded-xl border p-5">
            <ol className="space-y-3 text-sm">
              <WorkflowStep number={1}>
                Paste Starter prompt (first conversation) or Continue prompt
                (ongoing work)
              </WorkflowStep>
              <WorkflowStep number={2}>
                Share project context (goals, users, constraints)
              </WorkflowStep>
              <WorkflowStep number={3}>
                Work through alignment, decisions, and artefacts
              </WorkflowStep>
              <WorkflowStep number={4}>
                Use Stress Test before handover to catch gaps
              </WorkflowStep>
              <WorkflowStep number={5}>
                Generate State of Play before ending session
              </WorkflowStep>
            </ol>
          </div>
        </section>

        {/* Tips */}
        <section className="rounded-xl border border-violet-200 bg-violet-50 p-5 dark:border-violet-900/50 dark:bg-violet-950/20">
          <Row gap="sm" className="mb-3 items-center">
            <LightbulbIcon className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            <Text weight="semibold">Tips</Text>
          </Row>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              • The Project Agent is a <strong>thinking partner</strong>, not a
              passive assistant — it should challenge you and ask clarifying
              questions
            </li>
            <li>• Keep sessions focused on one goal or decision at a time</li>
            <li>• Generate State of Play frequently for handover hygiene</li>
            <li>
              • Attach Vision, Architecture, or State of Play documents when
              using Continue prompt
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
              • Using Project Agent when you should be coding — use{" "}
              <Link
                href="/docs/prompts/coding-sessions"
                className="text-primary hover:underline"
              >
                Coding Agent
              </Link>{" "}
              instead
            </li>
            <li>• Not providing enough context at session start</li>
            <li>
              • Skipping Stress Test before handover — leads to gaps in
              artefacts
            </li>
            <li>
              • Not generating State of Play — causes context loss between
              sessions
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
                href="/docs/prompts/project-artefacts"
                className="text-primary hover:underline"
              >
                Project Artefacts
              </Link>{" "}
              — Prompts for generating handover documents
            </li>
            <li>
              <Link
                href="/docs/workflow/roles"
                className="text-primary hover:underline"
              >
                Roles & Collaboration
              </Link>{" "}
              — How Project Agent fits the delivery model
            </li>
            <li>
              <Link
                href="/docs/workflow/delivery"
                className="text-primary hover:underline"
              >
                Delivery Cycles
              </Link>{" "}
              — When to use Stress Test (Refine checkpoint)
            </li>
          </ul>
        </section>

        {/* Navigation */}
        <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/docs/prompts"
            className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Prompts Overview
          </Link>
          <Link
            href="/docs/prompts/project-artefacts"
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
          >
            Project Artefacts
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
  children,
}: {
  number: number
  children: React.ReactNode
}) {
  return (
    <li className="flex gap-3">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
        {number}
      </span>
      <div>
        <Text weight="medium">{children}</Text>
      </div>
    </li>
  )
}
