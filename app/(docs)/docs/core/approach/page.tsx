/**
 * CATALYST - The Approach
 *
 * Explains the Catalyst methodology: why it exists, how it works,
 * and how to start using it. Two entry paths for different situations.
 */

import Link from "next/link"
import { Stack, Text, Row } from "@/components/core"
import {
  TargetIcon,
  LayersIcon,
  ArrowRightIcon,
  CheckCircle2Icon,
  ZapIcon,
  FileTextIcon,
  AlertTriangleIcon,
  CompassIcon,
  TrendingUpIcon,
  EyeIcon,
  ShieldCheckIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function ApproachPage() {
  return (
    <article className="mx-auto max-w-4xl">
      <Stack gap="2xl">
        {/* ================================================================ */}
        {/* Header */}
        {/* ================================================================ */}
        <header className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">
            The Catalyst Approach
          </h1>
          <Text size="lg" variant="muted" className="leading-relaxed">
            Build something real. Show people. Get feedback. Improve. Repeat
            until it&apos;s production-ready.
          </Text>
        </header>

        {/* ================================================================ */}
        {/* The Problem */}
        {/* ================================================================ */}
        <section className="border-border bg-muted/30 space-y-4 rounded-xl border p-5">
          <Row gap="sm">
            <AlertTriangleIcon className="h-5 w-5 text-amber-500" />
            <h2 className="font-semibold">The problem we&apos;re solving</h2>
          </Row>
          <Text variant="muted" className="leading-relaxed">
            You can build fast with AI, but fast doesn&apos;t mean aligned.
            Projects still go sideways because stakeholders don&apos;t see the
            real thing until it&apos;s too late, decisions get buried in chat
            threads, and rough prototypes accidentally ship as the final
            product.
          </Text>
          <Text variant="muted" className="leading-relaxed">
            The hard part isn&apos;t building — it&apos;s keeping everyone on
            the same page while you move quickly.
          </Text>
        </section>

        {/* ================================================================ */}
        {/* The Core Idea */}
        {/* ================================================================ */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">The core idea</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <IdeaCard
              icon={EyeIcon}
              title="Show, don't tell"
              description="Put working software in front of people early. Let them react to reality, not slide decks."
            />
            <IdeaCard
              icon={TargetIcon}
              title="Decisions that stick"
              description="Write down what you decided and why. Three months later, you'll still know."
            />
            <IdeaCard
              icon={TrendingUpIcon}
              title="Grow into production"
              description="Start rough, improve deliberately. Your prototype becomes the product — properly hardened."
            />
          </div>
        </section>

        {/* ================================================================ */}
        {/* The Rhythm */}
        {/* ================================================================ */}
        <section className="space-y-5">
          <div>
            <h2 className="text-xl font-semibold">The rhythm</h2>
            <Text size="sm" variant="muted" className="mt-1">
              Every Catalyst project follows the same basic loop.
            </Text>
          </div>
          <div className="space-y-3">
            <RhythmStep
              number={1}
              title="Get aligned on what you're building"
              description="Use the project prompts to capture the vision, technical approach, and voice. Just enough to stay on track — not a 50-page spec."
            />
            <RhythmStep
              number={2}
              title="Build something people can use"
              description="Ship working software that stakeholders can see and click. Pick the fastest path that proves the idea works."
            />
            <RhythmStep
              number={3}
              title="Show it and get feedback"
              description="Put it in front of real people. Watch what they do. Ask questions. Write down what you learn."
            />
            <RhythmStep
              number={4}
              title="Decide what's next"
              description="Stop (you learned what you needed), refine (another cycle), or advance (move toward production)."
            />
            <RhythmStep
              number={5}
              title="Harden as you advance"
              description="Early versions can be rough. Production can't. Each stage advance adds the quality needed for that level."
            />
          </div>
        </section>

        {/* ================================================================ */}
        {/* Two Entry Paths */}
        {/* ================================================================ */}
        <section className="space-y-5">
          <div>
            <h2 className="text-xl font-semibold">Two ways to start</h2>
            <Text size="sm" variant="muted" className="mt-1">
              Pick the path that fits your situation. Both lead to the same
              place.
            </Text>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <PathCard
              icon={ZapIcon}
              color="amber"
              title="Proof-first"
              tagline="When you know what to build"
              description="The problem is clear. Jump straight into building and let the working software guide the conversation."
              steps={[
                "Use the starter prompt to brief your AI",
                "Build a focused proof in hours or days",
                "Show it to stakeholders and capture feedback",
                "Decide together: stop, refine, or advance",
              ]}
              bestFor="Clear problems, tight timelines, technical validation"
            />
            <PathCard
              icon={FileTextIcon}
              color="sky"
              title="Intent-first"
              tagline="When you need alignment first"
              description="Stakeholders need to agree before you build. Start with lightweight docs that capture what 'good' looks like."
              steps={[
                "Run Vision, Architecture, and Voice prompts",
                "Draft a focused PRD for the first sprint",
                "Get stakeholder sign-off on success criteria",
                "Move into build with clear expectations",
              ]}
              bestFor="Multiple stakeholders, unclear scope, high-stakes decisions"
            />
          </div>
        </section>

        {/* ================================================================ */}
        {/* Core Concepts */}
        {/* ================================================================ */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Two ideas to know</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <ConceptCard
              icon={CompassIcon}
              title="Check-in points"
              description="Regular moments to ask: are we building the right thing? Should we keep going? What needs to change?"
              href="/docs/workflow/delivery"
              linkText="Learn more"
            />
            <ConceptCard
              icon={LayersIcon}
              title="Proof → Production"
              description="Early versions can be rough. Production can't. Quality increases deliberately as you advance through stages."
              href="/docs/workflow/stages"
              linkText="Learn more"
            />
          </div>
        </section>

        {/* ================================================================ */}
        {/* Why it works */}
        {/* ================================================================ */}
        <section className="border-border bg-muted/30 space-y-4 rounded-xl border p-5">
          <Row gap="sm">
            <ShieldCheckIcon className="text-primary h-5 w-5" />
            <h3 className="font-semibold">Why this works</h3>
          </Row>
          <div className="grid gap-3 md:grid-cols-2">
            <BenefitItem text="Real software reveals problems faster than documents" />
            <BenefitItem text="People give better feedback when they can click around" />
            <BenefitItem text="Written decisions don't get lost in Slack" />
            <BenefitItem text="Clear stages prevent 'oops, that's live now'" />
            <BenefitItem text="Anyone can follow the method — it's not tribal knowledge" />
            <BenefitItem text="AI works better when the codebase is predictable" />
          </div>
        </section>

        {/* ================================================================ */}
        {/* Getting Started */}
        {/* ================================================================ */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Start using the approach</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <StartCard
              title="Jump straight into building"
              description="Use the starter prompt to brief your AI, then start building your proof."
              href="/docs/project/coding-prompts"
              linkText="Get the starter prompt"
            />
            <StartCard
              title="Align intent first"
              description="Run the Vision, Architecture, and Voice prompts to capture what matters."
              href="/docs/project/vision"
              linkText="See the project prompts"
            />
          </div>
        </section>

        {/* ================================================================ */}
        {/* Next step */}
        {/* ================================================================ */}
        <section className="border-border flex items-center justify-between gap-4 rounded-xl border p-5">
          <div>
            <Text weight="medium">Ready to pick a stack?</Text>
            <Text size="sm" variant="muted">
              Choose the simplest stack that lets you prove value.
            </Text>
          </div>
          <Link
            href="/docs/core/stacks"
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex shrink-0 items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
          >
            Stacks
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

function IdeaCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType
  title: string
  description: string
}) {
  return (
    <div className="border-border space-y-2 rounded-lg border p-4">
      <Row gap="sm">
        <Icon className="text-primary h-4 w-4" />
        <h3 className="text-sm font-medium">{title}</h3>
      </Row>
      <Text size="sm" variant="muted" className="leading-relaxed">
        {description}
      </Text>
    </div>
  )
}

function RhythmStep({
  number,
  title,
  description,
}: {
  number: number
  title: string
  description: string
}) {
  return (
    <div className="flex gap-4">
      <div className="bg-primary text-primary-foreground flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold">
        {number}
      </div>
      <div className="pt-0.5">
        <Text weight="medium">{title}</Text>
        <Text size="sm" variant="muted" className="mt-0.5 leading-relaxed">
          {description}
        </Text>
      </div>
    </div>
  )
}

const pathColors = {
  amber: {
    bg: "bg-gradient-to-br from-amber-50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/10",
    iconBg: "bg-amber-100 dark:bg-amber-900/30",
    icon: "text-amber-600 dark:text-amber-400",
    tagline: "text-amber-600 dark:text-amber-400",
    arrow: "text-amber-500",
  },
  sky: {
    bg: "bg-gradient-to-br from-sky-50 to-cyan-50/50 dark:from-sky-950/20 dark:to-cyan-950/10",
    iconBg: "bg-sky-100 dark:bg-sky-900/30",
    icon: "text-sky-600 dark:text-sky-400",
    tagline: "text-sky-600 dark:text-sky-400",
    arrow: "text-sky-500",
  },
} as const

function PathCard({
  icon: Icon,
  color,
  title,
  tagline,
  description,
  steps,
  bestFor,
}: {
  icon: React.ElementType
  color: keyof typeof pathColors
  title: string
  tagline: string
  description: string
  steps: string[]
  bestFor: string
}) {
  const colors = pathColors[color]

  return (
    <div className={cn("flex flex-col rounded-xl p-5", colors.bg)}>
      <div className="mb-3 flex items-start gap-3">
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
            colors.iconBg
          )}
        >
          <Icon className={cn("h-5 w-5", colors.icon)} />
        </div>
        <div>
          <h3 className="font-semibold">{title}</h3>
          <Text size="sm" className={colors.tagline}>
            {tagline}
          </Text>
        </div>
      </div>
      <Text size="sm" variant="muted" className="mb-4 leading-relaxed">
        {description}
      </Text>
      <ul className="mb-4 space-y-2">
        {steps.map((step, i) => (
          <li key={i} className="flex items-start gap-2 text-sm">
            <span className={cn("shrink-0", colors.arrow)}>→</span>
            <span className="text-muted-foreground">{step}</span>
          </li>
        ))}
      </ul>
      <div className="mt-auto border-t border-black/5 pt-3 dark:border-white/5">
        <Text size="xs" variant="muted">
          <span className="font-medium">Best for:</span> {bestFor}
        </Text>
      </div>
    </div>
  )
}

function ConceptCard({
  icon: Icon,
  title,
  description,
  href,
  linkText,
}: {
  icon: React.ElementType
  title: string
  description: string
  href: string
  linkText: string
}) {
  return (
    <div className="border-border space-y-3 rounded-xl border p-4">
      <Row gap="sm" className="items-center">
        <Icon className="text-primary h-5 w-5" />
        <h3 className="font-medium">{title}</h3>
      </Row>
      <Text size="sm" variant="muted" className="leading-relaxed">
        {description}
      </Text>
      <Link
        href={href}
        className="text-primary inline-flex items-center gap-1 text-sm font-medium hover:underline"
      >
        {linkText}
        <ArrowRightIcon className="h-3.5 w-3.5" />
      </Link>
    </div>
  )
}

function StartCard({
  title,
  description,
  href,
  linkText,
}: {
  title: string
  description: string
  href: string
  linkText: string
}) {
  return (
    <Link
      href={href}
      className="border-border hover:border-primary/50 group flex flex-col rounded-xl border p-4 transition-colors"
    >
      <Text weight="medium" className="group-hover:text-primary">
        {title}
      </Text>
      <Text size="sm" variant="muted" className="mt-1 leading-relaxed">
        {description}
      </Text>
      <Text
        size="sm"
        className="text-primary mt-3 inline-flex items-center gap-1 font-medium"
      >
        {linkText}
        <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
      </Text>
    </Link>
  )
}

function BenefitItem({ text }: { text: string }) {
  return (
    <Row gap="sm" className="items-start">
      <CheckCircle2Icon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
      <Text size="sm" variant="muted">
        {text}
      </Text>
    </Row>
  )
}
