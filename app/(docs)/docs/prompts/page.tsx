/**
 * CATALYST - Prompts Overview
 *
 * Introduction to Catalyst prompts: what they are, how they work with
 * the workflow, and an overview of available prompt categories.
 */

import Link from "next/link"
import { Stack, Text, Row } from "@/components/core"
import {
  ArrowRightIcon,
  MessageSquareIcon,
  FileTextIcon,
  CodeIcon,
  ShieldCheckIcon,
  TrendingUpIcon,
  BotIcon,
  UserIcon,
  LightbulbIcon,
  CopyIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function PromptsOverviewPage() {
  return (
    <article>
      <Stack gap="xl">
        {/* Header */}
        <header className="space-y-3">
          <h1 className="text-3xl font-bold tracking-tight">Prompts</h1>
          <Text size="lg" variant="muted" className="leading-relaxed">
            Ready-to-use prompts for AI agents. Copy, paste, and go — or adapt
            to your project's needs.
          </Text>
        </header>

        {/* ================================================================ */}
        {/* What are prompts */}
        {/* ================================================================ */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">What are Catalyst prompts?</h2>
          <Text variant="muted" className="leading-relaxed">
            Catalyst prompts are <strong>structured instructions</strong> you
            give to AI agents (Claude, GPT, Cursor, Copilot) to guide their
            behaviour. Instead of starting from scratch each session, you paste
            a prompt that sets expectations, constraints, and working style.
          </Text>

          <div className="grid gap-4 md:grid-cols-3">
            <FeatureCard
              icon={CopyIcon}
              title="Copy & paste"
              description="Each prompt is ready to use. Paste it at the start of a chat or session."
            />
            <FeatureCard
              icon={BotIcon}
              title="Agent-aware"
              description="Different prompts for different AI roles — Project Agent vs. Coding Agent."
            />
            <FeatureCard
              icon={FileTextIcon}
              title="Workflow-aligned"
              description="Prompts map to the delivery loop: Brief, Build, Review, Refine."
            />
          </div>
        </section>

        {/* ================================================================ */}
        {/* Two agent types */}
        {/* ================================================================ */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Two types of AI agent</h2>
          <Text size="sm" variant="muted">
            Catalyst separates responsibilities between two agent types. Use the
            right prompts for each.
          </Text>

          <div className="grid gap-4 md:grid-cols-2">
            <AgentCard
              icon={UserIcon}
              title="Project Agent"
              color="violet"
              description="Thinks about scope, decisions, and direction. Produces artefacts like Vision, Architecture, and Requirements. Challenges assumptions and keeps the project aligned."
              capabilities={[
                "Clarify intent and goals",
                "Produce handover documents",
                "Stress test decisions",
                "Track project state",
              ]}
            />
            <AgentCard
              icon={CodeIcon}
              title="Coding Agent"
              color="emerald"
              description="Executes against intent with discipline. Builds features, maintains quality, and follows repo conventions. Proposes phased plans and implements incrementally."
              capabilities={[
                "Build features in phases",
                "Follow AGENTS.md conventions",
                "Run quality audits",
                "Debug and troubleshoot",
              ]}
            />
          </div>
        </section>

        {/* ================================================================ */}
        {/* How prompts fit the workflow */}
        {/* ================================================================ */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">How prompts fit the workflow</h2>
          <Text size="sm" variant="muted">
            The{" "}
            <Link href="/docs/workflow" className="text-primary hover:underline">
              Catalyst workflow
            </Link>{" "}
            has four phases. Prompts help at each phase.
          </Text>

          <div className="rounded-xl border p-5">
            <div className="grid gap-4 md:grid-cols-4">
              <WorkflowPhase
                phase="Brief"
                color="blue"
                prompts={["Project Sessions", "Project Artefacts"]}
                gate="Checkpoint"
              />
              <WorkflowPhase
                phase="Build"
                color="amber"
                prompts={["Coding Sessions"]}
                gate="Checkpoint"
              />
              <WorkflowPhase
                phase="Review"
                color="teal"
                prompts={["Project Sessions", "Quality & Audits"]}
                gate=""
              />
              <WorkflowPhase
                phase="Refine"
                color="emerald"
                prompts={["Stage Advancement", "Quality & Audits"]}
                gate="Checkpoint"
              />
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* Prompt categories */}
        {/* ================================================================ */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Prompt categories</h2>
          <Text size="sm" variant="muted">
            Five categories covering the full delivery lifecycle. Each page has
            multiple prompts as tabs.
          </Text>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <CategoryCard
              icon={MessageSquareIcon}
              title="Project Sessions"
              href="/docs/prompts/project-sessions"
              color="violet"
              description="Start, continue, and validate project conversations with the Project Agent."
              prompts={["Starter", "Continue", "Stress Test", "State of Play"]}
            />
            <CategoryCard
              icon={FileTextIcon}
              title="Project Artefacts"
              href="/docs/prompts/project-artefacts"
              color="rose"
              description="Generate handover documents that capture intent and decisions."
              prompts={["Vision", "Architecture", "Voice", "Requirements"]}
            />
            <CategoryCard
              icon={CodeIcon}
              title="Coding Sessions"
              href="/docs/prompts/coding-sessions"
              color="emerald"
              description="Set up coding sessions with proper context and constraints."
              prompts={["Starter", "Feature", "Debug"]}
            />
            <CategoryCard
              icon={ShieldCheckIcon}
              title="Quality & Audits"
              href="/docs/prompts/quality"
              color="amber"
              description="Run structured quality checks against your codebase."
              prompts={["Audit Runner", "Hardening"]}
            />
            <CategoryCard
              icon={TrendingUpIcon}
              title="Stage Promotion"
              href="/docs/prompts/promotion"
              color="sky"
              description="Transition between stages with the right quality bar."
              prompts={["POC → MVP", "MVP → MMP", "MMP → PROD"]}
            />
          </div>
        </section>

        {/* ================================================================ */}
        {/* How to use */}
        {/* ================================================================ */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">How to use prompts</h2>

          <div className="space-y-3">
            <StepItem number={1} title="Choose the right prompt">
              Pick based on what you're doing: starting a project, building a
              feature, running an audit, or promoting a stage.
            </StepItem>
            <StepItem number={2} title="Copy the prompt">
              Each prompt page has a copy button. The prompt is ready to use
              as-is.
            </StepItem>
            <StepItem number={3} title="Paste at the start of your session">
              In Claude, ChatGPT, Cursor, or your AI tool — paste the prompt
              first, then continue your conversation.
            </StepItem>
            <StepItem number={4} title="Provide context">
              The prompt will guide the AI to ask for what it needs, or you can
              attach relevant artefacts upfront.
            </StepItem>
          </div>
        </section>

        {/* ================================================================ */}
        {/* Key insight */}
        {/* ================================================================ */}
        <section className="rounded-xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-900/50 dark:bg-amber-950/20">
          <Row gap="sm" className="mb-3 items-center">
            <LightbulbIcon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            <Text weight="semibold">Key insight</Text>
          </Row>
          <Text
            size="sm"
            className="leading-relaxed text-amber-900 dark:text-amber-200"
          >
            Different AIs should own different responsibilities. A single agent
            trying to handle context, scope, code, and sequencing produces
            inconsistent results. Use <strong>Project Agent</strong> prompts for
            scope and artefacts, <strong>Coding Agent</strong> prompts for build
            and quality. Hand off between them with clear artefacts.
          </Text>
        </section>

        {/* ================================================================ */}
        {/* Quick links */}
        {/* ================================================================ */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Start here</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <QuickLink
              title="Project Sessions"
              description="Start a new project or continue an existing one with the Project Agent."
              href="/docs/prompts/project-sessions"
              color="violet"
            />
            <QuickLink
              title="Coding Sessions"
              description="Set up a coding session with proper context and constraints."
              href="/docs/prompts/coding-sessions"
              color="emerald"
            />
          </div>
        </section>

        {/* ================================================================ */}
        {/* Related docs */}
        {/* ================================================================ */}
        <section className="border-border rounded-xl border border-dashed p-5">
          <Text weight="medium" className="mb-3">
            Related docs
          </Text>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href="/docs/workflow"
                className="text-primary hover:underline"
              >
                Workflow
              </Link>{" "}
              — The delivery loop these prompts support
            </li>
            <li>
              <Link
                href="/docs/workflow/roles"
                className="text-primary hover:underline"
              >
                Roles & Collaboration
              </Link>{" "}
              — How Project Agent and Coding Agent work together
            </li>
            <li>
              <Link
                href="/docs/audits"
                className="text-primary hover:underline"
              >
                Audits
              </Link>{" "}
              — Quality checks you can run with prompts
            </li>
          </ul>
        </section>
      </Stack>
    </article>
  )
}

// =============================================================================
// Helper Components
// =============================================================================

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType
  title: string
  description: string
}) {
  return (
    <div className="rounded-xl border p-4">
      <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
        <Icon className="h-5 w-5 text-muted-foreground" />
      </div>
      <Text weight="medium">{title}</Text>
      <Text size="sm" variant="muted" className="mt-1">
        {description}
      </Text>
    </div>
  )
}

const agentColors = {
  violet: {
    bg: "bg-gradient-to-br from-violet-50 to-purple-50/50 dark:from-violet-950/20 dark:to-purple-950/10",
    iconBg: "bg-violet-100 dark:bg-violet-900/30",
    icon: "text-violet-600 dark:text-violet-400",
    border: "border-violet-200 dark:border-violet-900/50",
  },
  emerald: {
    bg: "bg-gradient-to-br from-emerald-50 to-teal-50/50 dark:from-emerald-950/20 dark:to-teal-950/10",
    iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
    icon: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-200 dark:border-emerald-900/50",
  },
} as const

function AgentCard({
  icon: Icon,
  title,
  color,
  description,
  capabilities,
}: {
  icon: React.ElementType
  title: string
  color: keyof typeof agentColors
  description: string
  capabilities: string[]
}) {
  const colors = agentColors[color]

  return (
    <div className={cn("rounded-xl border p-5", colors.bg, colors.border)}>
      <div className="mb-3 flex items-center gap-3">
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-lg",
            colors.iconBg
          )}
        >
          <Icon className={cn("h-5 w-5", colors.icon)} />
        </div>
        <Text weight="semibold" size="lg">
          {title}
        </Text>
      </div>
      <Text size="sm" variant="muted" className="mb-3 leading-relaxed">
        {description}
      </Text>
      <ul className="space-y-1 text-sm">
        {capabilities.map((cap, i) => (
          <li key={i} className="text-muted-foreground">
            • {cap}
          </li>
        ))}
      </ul>
    </div>
  )
}

const phaseColors = {
  blue: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  amber: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  teal: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
  emerald:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
} as const

function WorkflowPhase({
  phase,
  color,
  prompts,
  gate,
}: {
  phase: string
  color: keyof typeof phaseColors
  prompts: string[]
  gate: string
}) {
  return (
    <div className="space-y-2">
      <span
        className={cn(
          "inline-block rounded-lg px-2.5 py-1 text-sm font-bold",
          phaseColors[color]
        )}
      >
        {phase}
      </span>
      <ul className="space-y-1 text-sm">
        {prompts.map((p, i) => (
          <li key={i} className="text-muted-foreground">
            • {p}
          </li>
        ))}
      </ul>
      {gate && (
        <Text size="xs" variant="muted" className="italic">
          → {gate}
        </Text>
      )}
    </div>
  )
}

const categoryColors = {
  violet: {
    iconBg: "bg-violet-100 dark:bg-violet-900/30",
    icon: "text-violet-600 dark:text-violet-400",
    border: "border-violet-200 dark:border-violet-900/50",
  },
  rose: {
    iconBg: "bg-rose-100 dark:bg-rose-900/30",
    icon: "text-rose-600 dark:text-rose-400",
    border: "border-rose-200 dark:border-rose-900/50",
  },
  emerald: {
    iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
    icon: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-200 dark:border-emerald-900/50",
  },
  amber: {
    iconBg: "bg-amber-100 dark:bg-amber-900/30",
    icon: "text-amber-600 dark:text-amber-400",
    border: "border-amber-200 dark:border-amber-900/50",
  },
  sky: {
    iconBg: "bg-sky-100 dark:bg-sky-900/30",
    icon: "text-sky-600 dark:text-sky-400",
    border: "border-sky-200 dark:border-sky-900/50",
  },
} as const

function CategoryCard({
  icon: Icon,
  title,
  href,
  color,
  description,
  prompts,
}: {
  icon: React.ElementType
  title: string
  href: string
  color: keyof typeof categoryColors
  description: string
  prompts: string[]
}) {
  const colors = categoryColors[color]

  return (
    <Link
      href={href}
      className={cn(
        "group flex flex-col rounded-xl border p-5 transition-colors hover:border-primary/50",
        colors.border
      )}
    >
      <div className="mb-3 flex items-center gap-3">
        <div
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg",
            colors.iconBg
          )}
        >
          <Icon className={cn("h-5 w-5", colors.icon)} />
        </div>
        <Text weight="semibold" className="group-hover:text-primary">
          {title}
        </Text>
      </div>
      <Text size="sm" variant="muted" className="mb-3 leading-relaxed">
        {description}
      </Text>
      <div className="mt-auto flex flex-wrap gap-1.5">
        {prompts.map((p, i) => (
          <span
            key={i}
            className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground"
          >
            {p}
          </span>
        ))}
      </div>
    </Link>
  )
}

function StepItem({
  number,
  title,
  children,
}: {
  number: number
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="flex gap-3">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
        {number}
      </span>
      <div>
        <Text weight="medium">{title}</Text>
        <Text size="sm" variant="muted" className="mt-0.5">
          {children}
        </Text>
      </div>
    </div>
  )
}

const quickLinkColors = {
  violet:
    "bg-gradient-to-br from-violet-50 to-purple-50/50 dark:from-violet-950/20 dark:to-purple-950/10 border-violet-200 dark:border-violet-900/50",
  emerald:
    "bg-gradient-to-br from-emerald-50 to-teal-50/50 dark:from-emerald-950/20 dark:to-teal-950/10 border-emerald-200 dark:border-emerald-900/50",
} as const

function QuickLink({
  title,
  description,
  href,
  color,
}: {
  title: string
  description: string
  href: string
  color: keyof typeof quickLinkColors
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex flex-col rounded-xl border p-5 transition-colors hover:border-primary/50",
        quickLinkColors[color]
      )}
    >
      <Text weight="semibold" className="group-hover:text-primary">
        {title}
      </Text>
      <Text size="sm" variant="muted" className="mt-1 leading-relaxed">
        {description}
      </Text>
      <Text
        size="sm"
        className="text-primary mt-3 inline-flex items-center gap-1 font-medium"
      >
        Get started
        <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
      </Text>
    </Link>
  )
}
