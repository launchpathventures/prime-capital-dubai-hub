/**
 * CATALYST - Project Artefacts Prompts
 *
 * Prompts for generating handover documents that capture intent and decisions.
 * Includes Vision, Architecture, Voice, and Requirements.
 */

import Link from "next/link"
import { Stack, Text, Row } from "@/components/core"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { MarkdownViewer } from "@/components/shared"
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  FileTextIcon,
  LightbulbIcon,
  AlertTriangleIcon,
} from "lucide-react"
import { getPrompts } from "@/lib/prompts"
import { cn } from "@/lib/utils"

// =============================================================================
// Load prompts from files at build time
// =============================================================================

const promptDefs = [
  { name: "Vision", source: "projectai-handover-1-vision.md", output: "project-vision.md" },
  { name: "Architecture", source: "projectai-handover-2-architecture.md", output: "project-architecture.md" },
  { name: "Voice", source: "projectai-handover-3-voice.md", output: "project-voice.md" },
  { name: "Requirements", source: "projectai-feature-prd.md", output: "project-requirements.md" },
]

// =============================================================================
// Page Component
// =============================================================================

export default function ProjectArtefactsPage() {
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
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-100 dark:bg-rose-900/30">
              <FileTextIcon className="h-5 w-5 text-rose-600 dark:text-rose-400" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              Project Artefacts
            </h1>
          </Row>
          <Text size="lg" variant="muted" className="leading-relaxed">
            Generate handover documents that capture intent and decisions. These
            artefacts are read by the Coding Agent and persist beyond chat
            history.
          </Text>
        </header>

        {/* Why artefacts matter */}
        <section className="rounded-xl border border-dashed p-5">
          <Text weight="semibold" className="mb-2">
            Why artefacts matter
          </Text>
          <Text size="sm" variant="muted" className="leading-relaxed">
            They create durable decisions that persist beyond chat windows,
            enabling multiple sessions to work from the same source of truth.
            This prevents &ldquo;context loss&rdquo; when AI chat history gets
            too long or resets.
          </Text>
        </section>

        {/* Tabbed Prompts */}
        <Tabs defaultValue="vision">
          <TabsList className="mb-4">
            {promptDefs.map((def, index) => (
              <TabsTrigger
                key={def.source}
                value={
                  index === 0
                    ? "vision"
                    : index === 1
                      ? "architecture"
                      : index === 2
                        ? "voice"
                        : "requirements"
                }
              >
                {def.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {prompts.map((prompt, index) => (
            <TabsContent
              key={prompt.source}
              value={
                index === 0
                  ? "vision"
                  : index === 1
                    ? "architecture"
                    : index === 2
                      ? "voice"
                      : "requirements"
              }
            >
              <MarkdownViewer
                title={prompt.name}
                filename={`${prompt.source} → ${promptDefs[index].output}`}
                content={prompt.content}
              />
            </TabsContent>
          ))}
        </Tabs>

        {/* Artefact flow */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Artefact flow</h2>
          <div className="rounded-xl border p-5">
            <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
              <ArtefactBadge name="Vision" order={1} />
              <span className="text-muted-foreground">→</span>
              <ArtefactBadge name="Architecture" order={2} />
              <span className="text-muted-foreground">→</span>
              <ArtefactBadge name="Voice" order={3} optional />
              <span className="text-muted-foreground">→</span>
              <ArtefactBadge name="Requirements" order={4} />
            </div>
            <Text
              size="sm"
              variant="muted"
              className="mt-4 text-center leading-relaxed"
            >
              Vision anchors intent. Architecture explains structure. Voice
              ensures consistency. Requirements scope the build.
            </Text>
          </div>
        </section>

        {/* Where artefacts live */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Where artefacts live</h2>
          <div className="rounded-xl bg-muted/50 p-5 font-mono text-sm">
            <div className="space-y-1">
              <div>
                <span className="text-muted-foreground">catalyst/</span>
              </div>
              <div className="pl-4">
                <span className="text-muted-foreground">specs/</span>
              </div>
              <div className="pl-8">
                <span className="text-foreground">project-vision.md</span>
              </div>
              <div className="pl-8">
                <span className="text-foreground">project-architecture.md</span>
              </div>
              <div className="pl-8">
                <span className="text-foreground">project-voice.md</span>
              </div>
              <div className="pl-8">
                <span className="text-foreground">project-requirements.md</span>
              </div>
            </div>
          </div>
          <Text size="sm" variant="muted">
            The Coding Agent automatically looks for these files when starting a
            session.
          </Text>
        </section>

        {/* When to create each */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">When to create each</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <WhenToCreateCard
              title="Vision"
              description="At project start, after initial alignment conversations"
            />
            <WhenToCreateCard
              title="Architecture"
              description="After key technical decisions are made"
            />
            <WhenToCreateCard
              title="Voice"
              description="When tone/messaging consistency matters (marketing, user-facing content)"
            />
            <WhenToCreateCard
              title="Requirements"
              description="Before each phase of work (POC, MVP, MMP, etc.)"
            />
          </div>
        </section>

        {/* Tips */}
        <section className="rounded-xl border border-rose-200 bg-rose-50 p-5 dark:border-rose-900/50 dark:bg-rose-950/20">
          <Row gap="sm" className="mb-3 items-center">
            <LightbulbIcon className="h-5 w-5 text-rose-600 dark:text-rose-400" />
            <Text weight="semibold">Artefact quality tips</Text>
          </Row>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              • Keep artefacts <strong>focused and concise</strong> — AI context
              windows are limited
            </li>
            <li>
              • Update artefacts when decisions change — don&apos;t let them
              drift
            </li>
            <li>
              • Requirements should be <strong>phase-specific</strong>, not a
              wishlist
            </li>
            <li>• Vision is long-lived; Requirements are phase-lived</li>
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
              • Creating artefacts that are <strong>too long</strong> — bloats
              AI context
            </li>
            <li>• Not updating artefacts when scope changes</li>
            <li>• Writing requirements before vision is clear</li>
            <li>
              • Skipping architecture — leads to inconsistent Coding Agent
              decisions
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
                href="/docs/prompts/project-sessions"
                className="text-primary hover:underline"
              >
                Project Sessions
              </Link>{" "}
              — Start and continue project conversations
            </li>
            <li>
              <Link
                href="/docs/prompts/coding-sessions"
                className="text-primary hover:underline"
              >
                Coding Sessions
              </Link>{" "}
              — The Coding Agent reads these artefacts
            </li>
            <li>
              <Link
                href="/docs/workflow/delivery"
                className="text-primary hover:underline"
              >
                Delivery Cycles
              </Link>{" "}
              — Artefacts are reviewed at Brief checkpoint
            </li>
          </ul>
        </section>
        {/* Navigation */}
        <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/docs/prompts/project-sessions"
            className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Project Sessions
          </Link>
          <Link
            href="/docs/prompts/coding-sessions"
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
          >
            Coding Sessions
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

function ArtefactBadge({
  name,
  order,
  optional,
}: {
  name: string
  order: number
  optional?: boolean
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-lg border px-3 py-2",
        optional && "border-dashed"
      )}
    >
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-100 text-xs font-bold text-rose-700 dark:bg-rose-900/30 dark:text-rose-400">
        {order}
      </span>
      <span className="text-sm font-medium">{name}</span>
      {optional && (
        <span className="text-xs text-muted-foreground">(optional)</span>
      )}
    </div>
  )
}

function WhenToCreateCard({
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
