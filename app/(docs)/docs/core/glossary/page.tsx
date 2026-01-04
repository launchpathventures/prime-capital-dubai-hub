/**
 * CATALYST - Glossary
 *
 * Key terminology explained in everyday language.
 * Visual page for humans + raw MD tab for AI agents.
 */

import Link from "next/link"
import { Stack, Text, Row } from "@/components/core"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { MarkdownViewer } from "@/components/shared"
import { getCatalystDoc } from "@/lib/prompts"
import {
  BookOpenIcon,
  ArrowRightIcon,
  LayersIcon,
  TargetIcon,
  CheckCircle2Icon,
  ZapIcon,
  CompassIcon,
  LayoutIcon,
  SettingsIcon,
  Repeat2Icon,
  ShieldCheckIcon,
  CodeIcon,
  TrendingUpIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

// =============================================================================
// Load Glossary markdown at build time
// =============================================================================

const glossaryContent = getCatalystDoc("GLOSSARY.md")

// =============================================================================
// Page Component
// =============================================================================

export default function GlossaryPage() {
  return (
    <article className="mx-auto max-w-4xl">
      <Stack gap="xl">
        {/* Header */}
        <header className="space-y-3">
          <Row gap="sm" className="items-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-900/30">
              <BookOpenIcon className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Glossary</h1>
          </Row>
          <Text size="lg" variant="muted" className="leading-relaxed">
            Key Catalyst terms explained in everyday language. Use these
            consistently in conversations, docs, and code.
          </Text>
        </header>

        {/* Tabs: Visual / Source */}
        <Tabs defaultValue="visual">
          <TabsList className="mb-6">
            <TabsTrigger value="visual">For Humans</TabsTrigger>
            <TabsTrigger value="source">For AI Agents</TabsTrigger>
          </TabsList>

          {/* Visual Content Tab */}
          <TabsContent value="visual">
            <Stack gap="2xl">
              {/* ============================================================ */}
              {/* Delivery Workflow Section */}
              {/* ============================================================ */}
              <section className="space-y-6">
                <SectionHeader
                  icon={Repeat2Icon}
                  title="Delivery Workflow"
                  description="How Catalyst projects move from idea to production"
                />

                {/* Delivery Phases - The Delivery Loop */}
                <TermGroup title="Delivery Loop — What you do repeatedly">
                  <Text size="sm" variant="muted" className="mb-4">
                    Every feature, every sprint, every major update follows this
                    rhythm. You&apos;ll cycle through these delivery phases many times at
                    each stage. Each phase has a natural checkpoint — a moment to
                    confirm you&apos;re ready to move on.
                  </Text>

                  {/* 2x2 Grid - Standard order */}
                  <div className="mb-4 grid gap-3 md:grid-cols-2">
                    <LoopPhaseCard
                      number={1}
                      name="Brief"
                      description="Define what you're building and why"
                      details="Capture intent. First cycle = establish direction. Later cycles = update with learnings."
                      color="violet"
                    />
                    <LoopPhaseCard
                      number={2}
                      name="Build"
                      description="Ship working software"
                      details="Work with Coding AI. Follow conventions. Make it real and ready to show."
                      color="emerald"
                    />
                    <LoopPhaseCard
                      number={3}
                      name="Review"
                      description="Get feedback on the real thing"
                      details="Show stakeholders. Validate intent against reality. Capture what you learn."
                      color="amber"
                    />
                    <LoopPhaseCard
                      number={4}
                      name="Refine"
                      description="Decide what changes"
                      details="Update the brief with learnings. Prepare for the next cycle, or decide to advance."
                      color="sky"
                      loopBack
                    />
                  </div>

                  {/* Advance - Full Width */}
                  <div className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 flex items-center gap-4 rounded-xl border border-dashed border-primary/30 p-4">
                    <div className="bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
                      <TrendingUpIcon className="text-primary h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <Text weight="medium">Advance</Text>
                      <Text size="sm" variant="muted">
                        After several cycles, when the work is validated and solid, advance to the next stage.
                        This is a deliberate decision — not automatic.
                      </Text>
                    </div>
                    <Link
                      href="/docs/workflow/delivery"
                      className="text-primary shrink-0 text-sm font-medium hover:underline"
                    >
                      Learn more →
                    </Link>
                  </div>
                </TermGroup>

                {/* Stages */}
                <TermGroup title="Stages — Where you are">
                  <Text size="sm" variant="muted" className="mb-4">
                    Each stage has different expectations for what
                    &quot;good&quot; looks like. Don&apos;t overbuild early,
                    don&apos;t underbuild late.
                  </Text>
                  <div className="grid gap-3 md:grid-cols-2">
                    <StageCard
                      humanName="Proof"
                      technicalName="POC"
                      fullName="Proof of Concept"
                      description="Validate the idea works. Rough is fine."
                      quality="Working demo, happy path only"
                      color="blue"
                    />
                    <StageCard
                      humanName="Early Product"
                      technicalName="MVP"
                      fullName="Minimum Viable Product"
                      description="Real users, real data. Core flows work."
                      quality="Auth, database, error handling"
                      color="amber"
                    />
                    <StageCard
                      humanName="Market Ready"
                      technicalName="MMP"
                      fullName="Minimum Marketable Product"
                      description="Ready for paying customers. Polished."
                      quality="Polish, security, performance"
                      color="emerald"
                    />
                    <StageCard
                      humanName="Production"
                      technicalName="PROD"
                      fullName="Production Release"
                      description="Enterprise-ready. Fully hardened."
                      quality="Monitoring, backups, SLAs"
                      color="violet"
                    />
                  </div>
                  <Link
                    href="/docs/workflow"
                    className="text-primary mt-4 inline-flex items-center gap-1 text-sm font-medium hover:underline"
                  >
                    Learn about stage workflows
                    <ArrowRightIcon className="h-3.5 w-3.5" />
                  </Link>
                </TermGroup>

                {/* Stacks */}
                <TermGroup title="Stacks — How you configure the kit">
                  <Text size="sm" variant="muted" className="mb-4">
                    Choose the stack that fits your project. You can start simple
                    and add complexity later.
                  </Text>
                  <div className="grid gap-3 md:grid-cols-3">
                    <StackCard
                      name="Simple"
                      description="No database, no auth"
                      bestFor="Landing pages, marketing sites"
                    />
                    <StackCard
                      name="Supabase"
                      description="Auth + Postgres included"
                      bestFor="Apps with users and data"
                    />
                    <StackCard
                      name="Laravel"
                      description="Custom API backend"
                      bestFor="Complex enterprise needs"
                    />
                  </div>
                  <Link
                    href="/docs/core/stacks"
                    className="text-primary mt-3 inline-flex items-center gap-1 text-sm font-medium hover:underline"
                  >
                    Compare stacks in detail
                    <ArrowRightIcon className="h-3.5 w-3.5" />
                  </Link>
                </TermGroup>
              </section>

              {/* ============================================================ */}
              {/* Development Kit Section */}
              {/* ============================================================ */}
              <section className="space-y-6">
                <SectionHeader
                  icon={CodeIcon}
                  title="Development Kit"
                  description="How the Catalyst codebase is structured"
                />

                {/* Foundations */}
                <TermGroup title="Foundations — Basic terms you'll encounter">
                  <Text size="sm" variant="muted" className="mb-4">
                    If you&apos;re new to web development, these terms come up constantly.
                  </Text>
                  <div className="grid gap-3 md:grid-cols-2">
                    <FoundationCard
                      term="Route"
                      definition="A URL path that displays a page"
                      example="/docs/core/glossary shows this glossary"
                      color="blue"
                    />
                    <FoundationCard
                      term="Page"
                      definition="The content shown at a specific URL"
                      example="Each route has a page.tsx file"
                      color="teal"
                    />
                    <FoundationCard
                      term="Layout"
                      definition="Shared structure that wraps multiple pages"
                      example="Header, sidebar, footer — stays consistent"
                      color="amber"
                    />
                    <FoundationCard
                      term="Environment"
                      definition="Where code runs"
                      example="Dev (local), Preview (test), Prod (live)"
                      color="emerald"
                    />
                    <FoundationCard
                      term="Config"
                      definition="Central settings file (lib/config.ts)"
                      example="App name, feature flags, external links"
                      color="violet"
                    />
                  </div>
                </TermGroup>

                {/* Surfaces */}
                <TermGroup title="Surfaces — Different experiences in one codebase">
                  <Text size="sm" variant="muted" className="mb-4">
                    Your platform might have marketing pages, a dashboard,
                    documentation, and presentations. Each is a surface with its
                    own layout.
                  </Text>
                  <div className="grid gap-2 md:grid-cols-2">
                    <SurfaceCard
                      name="(web)"
                      audience="Visitors"
                      layout="Header + content"
                      purpose="Marketing, landing pages"
                    />
                    <SurfaceCard
                      name="(app)"
                      audience="Users"
                      layout="Sidebar + header"
                      purpose="Authenticated dashboard"
                    />
                    <SurfaceCard
                      name="(docs)"
                      audience="Developers"
                      layout="Sidebar + accordion"
                      purpose="Documentation"
                    />
                    <SurfaceCard
                      name="(present)"
                      audience="Stakeholders"
                      layout="Full-screen slides"
                      purpose="Presentations"
                    />
                  </div>
                  <Link
                    href="/docs/develop/surfaces"
                    className="text-primary mt-3 inline-flex items-center gap-1 text-sm font-medium hover:underline"
                  >
                    Learn about surfaces
                    <ArrowRightIcon className="h-3.5 w-3.5" />
                  </Link>
                </TermGroup>

                {/* Components */}
                <TermGroup title="Components — Building blocks">
                  <div className="grid gap-3 md:grid-cols-2">
                    <ComponentTypeCard
                      name="Core Components"
                      description="Layout and typography primitives"
                      examples="Stack, Row, Grid, Text, Title"
                      folder="components/core/"
                    />
                    <ComponentTypeCard
                      name="UI Components"
                      description="Interactive elements (shadcn)"
                      examples="Button, Dialog, Input, Tabs"
                      folder="components/ui/"
                    />
                    <ComponentTypeCard
                      name="Shared Components"
                      description="Project-specific composed components"
                      examples="StatCard, LabelValue"
                      folder="components/shared/"
                    />
                    <ComponentTypeCard
                      name="Layout Components"
                      description="Shell building blocks"
                      examples="Shell, Sidebar, Header"
                      folder="components/layout/"
                    />
                  </div>
                  <Link
                    href="/docs/develop/components"
                    className="text-primary mt-3 inline-flex items-center gap-1 text-sm font-medium hover:underline"
                  >
                    Component guide
                    <ArrowRightIcon className="h-3.5 w-3.5" />
                  </Link>
                </TermGroup>

                {/* Key Terms */}
                <TermGroup title="Other terms you'll see">
                  <div className="space-y-3">
                    <DefinitionRow
                      term="Shell"
                      definition="The layout wrapper for a surface. Composes sidebar, header, and content areas."
                    />
                    <DefinitionRow
                      term="Token"
                      definition="A design system value (colour, spacing) defined as a CSS variable. Ensures consistency."
                    />
                    <DefinitionRow
                      term="Variant"
                      definition="A predefined style option for a component. Like Button variant='ghost' or Text variant='muted'."
                    />
                    <DefinitionRow
                      term="Artefact"
                      definition="A document that captures decisions: Vision, Architecture, Voice, PRD, State of Play."
                    />
                  </div>
                </TermGroup>
              </section>

              {/* ============================================================ */}
              {/* Quick Reference */}
              {/* ============================================================ */}
              <section className="border-border bg-muted/30 space-y-4 rounded-xl border p-5">
                <Row gap="sm">
                  <ShieldCheckIcon className="text-primary h-5 w-5" />
                  <h3 className="font-semibold">Quick reference</h3>
                </Row>
                <div className="grid gap-x-8 gap-y-2 text-sm md:grid-cols-2">
                  <QuickRef term="The Loop" meaning="Brief → Build → Review → Refine" />
                  <QuickRef term="Advance" meaning="Move to the next stage deliberately" />
                  <QuickRef term="Brief" meaning="Define what you're building and why" />
                  <QuickRef term="Review" meaning="Get feedback on the real thing" />
                  <QuickRef term="Checkpoint" meaning="Decision point within a phase" />
                  <QuickRef term="Surface" meaning="Distinct area with its own layout" />
                </div>
              </section>

              {/* Next step */}
              <section className="border-border flex items-center justify-between gap-4 rounded-xl border p-5">
                <div>
                  <Text weight="medium">Ready to start building?</Text>
                  <Text size="sm" variant="muted">
                    Jump into the quickstart or explore the approach.
                  </Text>
                </div>
                <Link
                  href="/docs/core/quickstart"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex shrink-0 items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
                >
                  Quickstart
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </section>
            </Stack>
          </TabsContent>

          {/* Source MD Tab */}
          <TabsContent value="source">
            <MarkdownViewer
              title="Glossary"
              filename="GLOSSARY.md"
              content={glossaryContent}
              maxHeight={800}
            />
          </TabsContent>
        </Tabs>
      </Stack>
    </article>
  )
}

// =============================================================================
// Helper Components
// =============================================================================

function SectionHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType
  title: string
  description: string
}) {
  return (
    <div className="space-y-1">
      <Row gap="sm" className="items-center">
        <Icon className="text-primary h-5 w-5" />
        <h2 className="text-xl font-semibold">{title}</h2>
      </Row>
      <Text size="sm" variant="muted">
        {description}
      </Text>
    </div>
  )
}

function TermGroup({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="border-border rounded-xl border p-5">
      <h3 className="mb-3 font-medium">{title}</h3>
      {children}
    </div>
  )
}

const phaseColors = {
  violet: "bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400",
  emerald: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
  amber: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400",
  sky: "bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400",
} as const

const phaseColorsBorder = {
  violet: "border-violet-200 dark:border-violet-800/50",
  emerald: "border-emerald-200 dark:border-emerald-800/50",
  amber: "border-amber-200 dark:border-amber-800/50",
  sky: "border-sky-200 dark:border-sky-800/50",
} as const

function LoopPhaseCard({
  number,
  name,
  description,
  details,
  color,
  loopBack,
}: {
  number: number
  name: string
  description: string
  details: string
  color: keyof typeof phaseColors
  loopBack?: boolean
}) {
  return (
    <div
      className={cn(
        "relative rounded-xl border bg-gradient-to-br from-white to-muted/30 p-4 transition-all hover:shadow-md dark:from-muted/20 dark:to-muted/5",
        phaseColorsBorder[color]
      )}
    >
      {/* Number badge */}
      <div
        className={cn(
          "absolute -top-2 -left-2 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold shadow-sm",
          phaseColors[color]
        )}
      >
        {number}
      </div>

      {/* Loop indicator for Refine - top right */}
      {loopBack && (
        <div className="text-muted-foreground/60 absolute -top-2 right-3 flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-xs dark:bg-background">
          <span>↩ back to 1</span>
        </div>
      )}

      <div className="space-y-1.5 pt-1">
        <Text weight="semibold">{name}</Text>
        <Text size="sm" variant="muted">
          {description}
        </Text>
        <Text size="xs" variant="muted" className="italic">
          {details}
        </Text>
      </div>
    </div>
  )
}

function PhaseCard({
  name,
  description,
  activities,
  color,
}: {
  name: string
  description: string
  activities: string
  color: keyof typeof phaseColors
}) {
  return (
    <div className="bg-muted/50 flex items-start gap-3 rounded-lg p-3">
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold",
          phaseColors[color]
        )}
      >
        {name[0]}
      </div>
      <div className="min-w-0">
        <Text weight="medium" className="text-sm">
          {name}
        </Text>
        <Text size="xs" variant="muted">
          {description}
        </Text>
        <Text size="xs" variant="muted" className="mt-1 italic">
          {activities}
        </Text>
      </div>
    </div>
  )
}

const stageColors = {
  blue: "from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20 border-blue-200 dark:border-blue-800/50",
  amber: "from-amber-50 to-amber-100/50 dark:from-amber-950/30 dark:to-amber-900/20 border-amber-200 dark:border-amber-800/50",
  emerald: "from-emerald-50 to-emerald-100/50 dark:from-emerald-950/30 dark:to-emerald-900/20 border-emerald-200 dark:border-emerald-800/50",
  violet: "from-violet-50 to-violet-100/50 dark:from-violet-950/30 dark:to-violet-900/20 border-violet-200 dark:border-violet-800/50",
}

const foundationColors = {
  blue: "from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20 border-blue-200 dark:border-blue-800/50",
  teal: "from-teal-50 to-teal-100/50 dark:from-teal-950/30 dark:to-teal-900/20 border-teal-200 dark:border-teal-800/50",
  amber: "from-amber-50 to-amber-100/50 dark:from-amber-950/30 dark:to-amber-900/20 border-amber-200 dark:border-amber-800/50",
  emerald: "from-emerald-50 to-emerald-100/50 dark:from-emerald-950/30 dark:to-emerald-900/20 border-emerald-200 dark:border-emerald-800/50",
  violet: "from-violet-50 to-violet-100/50 dark:from-violet-950/30 dark:to-violet-900/20 border-violet-200 dark:border-violet-800/50",
}

const badgeColors = {
  blue: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 border-blue-200 dark:border-blue-700",
  amber: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300 border-amber-200 dark:border-amber-700",
  emerald: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700",
  violet: "bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300 border-violet-200 dark:border-violet-700",
}

function StageCard({
  humanName,
  technicalName,
  fullName,
  description,
  quality,
  color,
}: {
  humanName: string
  technicalName: string
  fullName: string
  description: string
  quality: string
  color: keyof typeof stageColors
}) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-gradient-to-br p-4 transition-all hover:shadow-md",
        stageColors[color]
      )}
    >
      <div className="space-y-2">
        {/* Header with name and badge */}
        <div className="flex items-center gap-2">
          <span className="font-medium">{humanName}</span>
          <Tooltip>
            <TooltipTrigger
              className={cn(
                "rounded-md border px-1.5 py-0.5 text-xs font-bold uppercase tracking-wide",
                badgeColors[color]
              )}
            >
              {technicalName}
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-medium">{fullName}</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Description */}
        <Text size="sm" variant="muted">
          {description}
        </Text>

        {/* Quality expectations */}
        <Text size="xs" variant="muted" className="italic">
          {quality}
        </Text>
      </div>
    </div>
  )
}

function FoundationCard({
  term,
  definition,
  example,
  color,
}: {
  term: string
  definition: string
  example: string
  color: keyof typeof foundationColors
}) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-gradient-to-br p-4 transition-all hover:shadow-md",
        foundationColors[color]
      )}
    >
      <div className="space-y-1.5">
        <span className="font-medium">{term}</span>
        <Text size="sm" variant="muted">
          {definition}
        </Text>
        <Text size="xs" variant="muted" className="italic">
          Example: {example}
        </Text>
      </div>
    </div>
  )
}

function CheckpointRow({
  name,
  when,
  question,
}: {
  name: string
  when: string
  question: string
}) {
  return (
    <div className="bg-muted/50 flex flex-col gap-1 rounded-lg p-3 sm:flex-row sm:items-center sm:gap-4">
      <div className="flex shrink-0 items-center gap-2 sm:w-44">
        <CheckCircle2Icon className="h-4 w-4 text-emerald-500" />
        <span className="text-sm font-medium">{name}</span>
      </div>
      <div className="text-muted-foreground text-xs sm:w-28">{when}</div>
      <div className="flex-1">
        <Text size="sm" variant="muted">
          &quot;{question}&quot;
        </Text>
      </div>
    </div>
  )
}

function StackCard({
  name,
  description,
  bestFor,
}: {
  name: string
  description: string
  bestFor: string
}) {
  return (
    <div className="bg-muted/50 space-y-1 rounded-lg p-3">
      <Text weight="medium" className="text-sm">
        {name}
      </Text>
      <Text size="xs" variant="muted">
        {description}
      </Text>
      <Text size="xs" variant="muted" className="italic">
        Best for: {bestFor}
      </Text>
    </div>
  )
}

function SurfaceCard({
  name,
  audience,
  layout,
  purpose,
}: {
  name: string
  audience: string
  layout: string
  purpose: string
}) {
  return (
    <div className="bg-muted/50 flex items-center gap-3 rounded-lg p-3">
      <code className="bg-background rounded border px-2 py-1 text-xs font-medium">
        {name}
      </code>
      <div className="min-w-0 flex-1">
        <Text size="sm">
          <span className="text-muted-foreground">For</span>{" "}
          <span className="font-medium">{audience}</span>
        </Text>
        <Text size="xs" variant="muted">
          {layout} — {purpose}
        </Text>
      </div>
    </div>
  )
}

function ComponentTypeCard({
  name,
  description,
  examples,
  folder,
}: {
  name: string
  description: string
  examples: string
  folder: string
}) {
  return (
    <div className="bg-muted/50 space-y-1 rounded-lg p-3">
      <Text weight="medium" className="text-sm">
        {name}
      </Text>
      <Text size="xs" variant="muted">
        {description}
      </Text>
      <Text size="xs" variant="muted">
        <span className="italic">e.g.</span> {examples}
      </Text>
      <code className="text-muted-foreground text-xs">{folder}</code>
    </div>
  )
}

function DefinitionRow({
  term,
  definition,
}: {
  term: string
  definition: string
}) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:gap-4">
      <span className="shrink-0 font-medium sm:w-24">{term}</span>
      <Text size="sm" variant="muted">
        {definition}
      </Text>
    </div>
  )
}

function QuickRef({ term, meaning }: { term: string; meaning: string }) {
  return (
    <div className="flex gap-2">
      <span className="text-primary font-medium">{term}:</span>
      <span className="text-muted-foreground">{meaning}</span>
    </div>
  )
}
