/**
 * CATALYST - Roles & Collaboration
 *
 * The operating model for Catalyst delivery: who does what,
 * how humans and AI collaborate, and what artefacts get produced.
 */

import Link from "next/link"
import { Stack, Text, Row } from "@/components/core"
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  UsersIcon,
  BotIcon,
  UserIcon,
  FileTextIcon,
  PaletteIcon,
  CheckCircle2Icon,
  ShieldCheckIcon,
} from "lucide-react"

export default function RolesPage() {
  return (
    <article>
      <Stack gap="xl">
        {/* Header */}
        <header className="space-y-3">
          <Row gap="sm" className="items-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-900/30">
              <UsersIcon className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              Roles & Collaboration
            </h1>
          </Row>
          <Text size="lg" variant="muted" className="leading-relaxed">
            Clear roles prevent confusion. Humans lead; AI assists. Every
            project has defined responsibilities for scope, build, and quality.
          </Text>
        </header>

        {/* Purpose Section */}
        <section className="border-border bg-muted/30 rounded-xl border p-5">
          <Text weight="semibold" className="mb-2">
            Why roles matter
          </Text>
          <Text size="sm" variant="muted" className="leading-relaxed">
            The Catalyst operating model prevents drift between stakeholder
            intent and delivered product. It reduces rework, provides a safe
            pathway from POC to production, and enables consistent, repeatable
            delivery.
          </Text>
        </section>

        {/* Principles */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Non-negotiables</h2>
          <div className="grid gap-3 md:grid-cols-2">
            <PrincipleCard
              title="Proof over wireframes"
              description="Working code is the source of truth, not static designs or slide decks."
            />
            <PrincipleCard
              title="Intent captured durably"
              description="Vision, Architecture, and Requirements are written artefacts, not verbal agreements."
            />
            <PrincipleCard
              title="Checkpoints are mandatory"
              description="Each delivery phase has a checkpoint. No skipping—they keep projects aligned."
            />
            <PrincipleCard
              title="Stages have standards"
              description="POC quality is not production quality. Each stage has defined expectations."
            />
          </div>
        </section>

        {/* Human Roles */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Human roles</h2>
          <Text size="sm" variant="muted">
            Humans own decisions, relationships, and outcomes:
          </Text>
          <div className="space-y-3">
            <RoleCard
              icon={UserIcon}
              title="Project Lead"
              color="violet"
              responsibilities={[
                "Drives clarity and momentum",
                "Manages client expectations",
                "Approves phase plans and checkpoint decisions",
                "Owns delivery outcomes",
              ]}
            />
            <RoleCard
              icon={ShieldCheckIcon}
              title="Reviewer"
              color="violet"
              responsibilities={[
                "Reviews code and artefacts",
                "Validates checkpoint criteria",
                "Provides technical guidance",
                "Approves stage transitions",
              ]}
            />
            <RoleCard
              icon={UsersIcon}
              title="Client / Stakeholder"
              color="violet"
              responsibilities={[
                "Provides context and requirements",
                "Participates in workshops and reviews",
                "Makes scope decisions",
                "Approves stage completions",
              ]}
            />
          </div>
        </section>

        {/* AI Roles */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">AI agent roles</h2>
          <Text size="sm" variant="muted">
            AI agents assist with execution but don&apos;t make decisions:
          </Text>
          <div className="space-y-3">
            <RoleCard
              icon={BotIcon}
              title="Project Agent"
              color="blue"
              responsibilities={[
                "Crystallises intent, vision, and scope",
                "Produces Vision, Architecture, and Requirements docs",
                "Challenges assumptions via stress testing",
                "Maintains State of Play document",
              ]}
              link={{ href: "/docs/prompts/project-sessions", label: "Project prompts" }}
            />
            <RoleCard
              icon={BotIcon}
              title="Coding Agent"
              color="emerald"
              responsibilities={[
                "Executes against intent with discipline",
                "Proposes phased build plans",
                "Implements incrementally with review points",
                "Maintains code quality and standards",
              ]}
              link={{ href: "/docs/prompts/coding-sessions", label: "Coding prompts" }}
            />
          </div>
        </section>

        {/* Artefacts */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Artefacts</h2>
          <Text size="sm" variant="muted">
            Durable documents that capture intent and track progress:
          </Text>
          <div className="grid gap-3 md:grid-cols-2">
            <ArtefactCard
              title="Vision"
              description="What success looks like. The north star for the project."
              href="/docs/prompts/project-artefacts"
            />
            <ArtefactCard
              title="Architecture"
              description="Technical approach, design decisions, and system boundaries."
              href="/docs/prompts/project-artefacts"
            />
            <ArtefactCard
              title="Requirements"
              description="Specific features and acceptance criteria by phase."
              href="/docs/prompts/project-artefacts"
            />
            <ArtefactCard
              title="State of Play"
              description="Current status, decisions made, and next actions."
              href="/docs/prompts/project-sessions"
            />
          </div>
          <Text size="sm" variant="muted">
            Artefacts live in{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
              /catalyst/specs/
            </code>{" "}
            and are read by the Coding Agent automatically.
          </Text>
        </section>

        {/* Collaboration flow */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">How it flows</h2>
          <div className="rounded-xl border p-5">
            <ol className="space-y-3 text-sm">
              <FlowStep
                number={1}
                title="Human defines intent"
                description="Client shares context and requirements in a workshop"
              />
              <FlowStep
                number={2}
                title="Project Agent crystallises"
                description="Produces Vision, Architecture, and Requirements documents"
              />
              <FlowStep
                number={3}
                title="Human approves at Brief checkpoint"
                description="Stakeholders sign off on direction before build"
              />
              <FlowStep
                number={4}
                title="Coding Agent builds in phases"
                description="Proposes plan, implements incrementally, summarises after each phase"
              />
              <FlowStep
                number={5}
                title="Human reviews at Review checkpoint"
                description="Validates work matches intent, approves to continue"
              />
              <FlowStep
                number={6}
                title="Human approves at Refine checkpoint"
                description="Confirms production-readiness, signs off on deployment"
              />
            </ol>
          </div>
        </section>

        {/* Stages summary */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Delivery stages</h2>
          <Text size="sm" variant="muted">
            Projects progress through defined stages with increasing quality:
          </Text>
          <div className="grid gap-3 md:grid-cols-2">
            <StageCard
              stage="POC"
              color="blue"
              description="Prove the concept. Validate with stakeholders."
              href="/docs/workflow/poc"
            />
            <StageCard
              stage="MVP"
              color="amber"
              description="Core features for early users. Real data."
              href="/docs/workflow/mvp"
            />
            <StageCard
              stage="MMP"
              color="purple"
              description="Ready for paying customers. Polished."
              href="/docs/workflow/mmp"
            />
            <StageCard
              stage="PROD"
              color="emerald"
              description="Full production. Operationally ready."
              href="/docs/workflow/production"
            />
          </div>
        </section>

        {/* Design System callout */}
        <section className="rounded-xl border border-violet-200 bg-gradient-to-br from-violet-50 to-purple-50/50 p-5 dark:border-violet-900/50 dark:from-violet-950/20 dark:to-purple-950/10">
          <Row gap="sm" className="mb-3 items-center">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-900/30">
              <PaletteIcon className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            </div>
            <Text weight="semibold">Role of design</Text>
          </Row>
          <Text size="sm" variant="muted" className="mb-3 leading-relaxed">
            Design expectations scale with stages. POC uses basics; Production
            requires full design system compliance. The Design System provides
            consistency without slowing down early stages.
          </Text>
          <Link
            href="/docs/design"
            className="text-primary inline-flex items-center gap-1 text-sm font-medium hover:underline"
          >
            Explore the Design System
            <ArrowRightIcon className="h-3.5 w-3.5" />
          </Link>
        </section>

        {/* Navigation */}
        <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/docs/workflow"
            className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Workflow Overview
          </Link>
          <Link
            href="/docs/workflow/delivery"
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
          >
            Delivery Cycles
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

function PrincipleCard({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="flex items-start gap-2 rounded-lg border p-4">
      <CheckCircle2Icon className="mt-0.5 h-4 w-4 shrink-0 text-violet-500" />
      <div>
        <Text weight="medium">{title}</Text>
        <Text size="sm" variant="muted" className="mt-0.5">
          {description}
        </Text>
      </div>
    </div>
  )
}

const roleColors = {
  violet: {
    icon: "bg-violet-100 dark:bg-violet-900/30",
    iconText: "text-violet-600 dark:text-violet-400",
  },
  blue: {
    icon: "bg-blue-100 dark:bg-blue-900/30",
    iconText: "text-blue-600 dark:text-blue-400",
  },
  emerald: {
    icon: "bg-emerald-100 dark:bg-emerald-900/30",
    iconText: "text-emerald-600 dark:text-emerald-400",
  },
} as const

function RoleCard({
  icon: Icon,
  title,
  color,
  responsibilities,
  link,
}: {
  icon: React.ElementType
  title: string
  color: keyof typeof roleColors
  responsibilities: string[]
  link?: { href: string; label: string }
}) {
  const colors = roleColors[color]
  return (
    <div className="rounded-xl border p-4">
      <div className="mb-3 flex items-center gap-3">
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${colors.icon}`}>
          <Icon className={`h-5 w-5 ${colors.iconText}`} />
        </div>
        <Text weight="semibold">{title}</Text>
      </div>
      <ul className="space-y-1 text-sm text-muted-foreground">
        {responsibilities.map((item, i) => (
          <li key={i}>• {item}</li>
        ))}
      </ul>
      {link && (
        <Link
          href={link.href}
          className="text-primary mt-3 inline-flex items-center gap-1 text-sm hover:underline"
        >
          {link.label}
          <ArrowRightIcon className="h-3 w-3" />
        </Link>
      )}
    </div>
  )
}

function ArtefactCard({
  title,
  description,
  href,
}: {
  title: string
  description: string
  href: string
}) {
  return (
    <Link
      href={href}
      className="group rounded-xl border p-4 transition-colors hover:border-primary/50"
    >
      <div className="mb-1 flex items-center gap-2">
        <FileTextIcon className="h-4 w-4 text-muted-foreground" />
        <Text weight="medium" className="group-hover:text-primary">
          {title}
        </Text>
      </div>
      <Text size="sm" variant="muted">
        {description}
      </Text>
    </Link>
  )
}

function FlowStep({
  number,
  title,
  description,
}: {
  number: number
  title: string
  description: string
}) {
  return (
    <li className="flex gap-3">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-700 dark:bg-violet-900/30 dark:text-violet-400">
        {number}
      </span>
      <div>
        <Text weight="medium">{title}</Text>
        <Text size="sm" variant="muted">
          {description}
        </Text>
      </div>
    </li>
  )
}

const stageColors = {
  blue: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  amber: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  purple: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  emerald: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
} as const

function StageCard({
  stage,
  color,
  description,
  href,
}: {
  stage: string
  color: keyof typeof stageColors
  description: string
  href: string
}) {
  return (
    <Link
      href={href}
      className="group flex items-start gap-3 rounded-xl border p-4 transition-colors hover:border-primary/50"
    >
      <span className={`rounded-lg px-2 py-0.5 text-xs font-bold ${stageColors[color]}`}>
        {stage}
      </span>
      <Text size="sm" variant="muted" className="group-hover:text-foreground">
        {description}
      </Text>
    </Link>
  )
}
