/**
 * CATALYST - Design Playbook
 *
 * A process playbook for getting AI to produce strong, non-generic design outcomes.
 * Teaches teams how to produce compelling, differentiated designs when working with AI
 * — without slowing delivery or reintroducing heavy design workflows.
 */

import Link from "next/link"
import { Stack, Text, Row } from "@/components/core"
import { Badge } from "@/components/ui/badge"
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible"
import {
  PaletteIcon,
  LightbulbIcon,
  ImageIcon,
  MessageSquareIcon,
  LayoutGridIcon,
  TargetIcon,
  PencilRulerIcon,
  LockIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChevronDownIcon,
  SparklesIcon,
  EyeIcon,
  LayersIcon,
  ArrowRightIcon,
  ExternalLinkIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

// =============================================================================
// COLLAPSIBLE STEP COMPONENT
// =============================================================================

type StepProps = {
  number: number
  title: string
  purpose: string
  color: "blue" | "violet" | "amber" | "teal" | "emerald" | "rose" | "sky"
  defaultOpen?: boolean
  children: React.ReactNode
}

const colorMap = {
  blue: {
    badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    border: "border-blue-200 dark:border-blue-800/50",
    icon: "text-blue-600 dark:text-blue-400",
  },
  violet: {
    badge: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
    border: "border-violet-200 dark:border-violet-800/50",
    icon: "text-violet-600 dark:text-violet-400",
  },
  amber: {
    badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    border: "border-amber-200 dark:border-amber-800/50",
    icon: "text-amber-600 dark:text-amber-400",
  },
  teal: {
    badge: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
    border: "border-teal-200 dark:border-teal-800/50",
    icon: "text-teal-600 dark:text-teal-400",
  },
  emerald: {
    badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    border: "border-emerald-200 dark:border-emerald-800/50",
    icon: "text-emerald-600 dark:text-emerald-400",
  },
  rose: {
    badge: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
    border: "border-rose-200 dark:border-rose-800/50",
    icon: "text-rose-600 dark:text-rose-400",
  },
  sky: {
    badge: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
    border: "border-sky-200 dark:border-sky-800/50",
    icon: "text-sky-600 dark:text-sky-400",
  },
}

function PlaybookStep({ number, title, purpose, color, defaultOpen = false, children }: StepProps) {
  const colors = colorMap[color]
  
  return (
    <Collapsible defaultOpen={defaultOpen}>
      <div className={cn("rounded-xl border", colors.border)}>
        <CollapsibleTrigger
          render={<div role="button" tabIndex={0} />}
          nativeButton={false}
          className="w-full cursor-pointer rounded-t-xl p-5 hover:bg-muted/50 transition-colors"
        >
          <Row gap="md" className="items-start justify-between">
            <Row gap="md" className="items-start">
              <span className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold", colors.badge)}>
                {number}
              </span>
              <div className="space-y-1 text-left">
                <Text weight="semibold" className="text-base">{title}</Text>
                <Text size="sm" variant="muted">{purpose}</Text>
              </div>
            </Row>
            <ChevronDownIcon className="h-5 w-5 shrink-0 text-muted-foreground transition-transform [[data-open]_&]:rotate-180" />
          </Row>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="border-t px-5 py-5 space-y-4">
            {children}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  )
}

// =============================================================================
// CALLOUT COMPONENTS
// =============================================================================

type CalloutProps = {
  type: "why" | "mistake" | "tip" | "catalyst"
  children: React.ReactNode
}

function Callout({ type, children }: CalloutProps) {
  const config = {
    why: {
      icon: LightbulbIcon,
      title: "Why this matters",
      className: "border-sky-200 bg-sky-50 dark:border-sky-900/50 dark:bg-sky-950/20 text-sky-900 dark:text-sky-100",
      iconClass: "text-sky-600 dark:text-sky-400",
    },
    mistake: {
      icon: AlertTriangleIcon,
      title: "Common mistake",
      className: "border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/20 text-amber-900 dark:text-amber-100",
      iconClass: "text-amber-600 dark:text-amber-400",
    },
    tip: {
      icon: CheckCircleIcon,
      title: "Best practice",
      className: "border-emerald-200 bg-emerald-50 dark:border-emerald-900/50 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-100",
      iconClass: "text-emerald-600 dark:text-emerald-400",
    },
    catalyst: {
      icon: SparklesIcon,
      title: "Catalyst note",
      className: "border-violet-200 bg-violet-50 dark:border-violet-900/50 dark:bg-violet-950/20 text-violet-900 dark:text-violet-100",
      iconClass: "text-violet-600 dark:text-violet-400",
    },
  }

  const { icon: Icon, title, className, iconClass } = config[type]

  return (
    <div className={cn("rounded-lg border p-4", className)}>
      <Row gap="sm" className="items-center mb-2">
        <Icon className={cn("h-4 w-4", iconClass)} />
        <Text size="sm" weight="semibold">{title}</Text>
      </Row>
      <div className="text-sm leading-relaxed">{children}</div>
    </div>
  )
}

// =============================================================================
// VOCABULARY LIST
// =============================================================================

type VocabListProps = {
  title: string
  items: string[]
}

function VocabList({ title, items }: VocabListProps) {
  return (
    <div className="rounded-lg border bg-muted/30 p-4">
      <Text size="sm" weight="semibold" className="mb-2">{title}</Text>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span key={item} className="rounded-md bg-background px-2.5 py-1 text-xs font-medium border">
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

// =============================================================================
// REFERENCE LINK
// =============================================================================

function ReferenceLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-primary hover:underline text-sm"
    >
      {children}
      <ExternalLinkIcon className="h-3 w-3" />
    </a>
  )
}

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export default function DesignPlaybookPage() {
  return (
    <article>
      <Stack gap="xl">
        {/* ================================================================ */}
        {/* Header */}
        {/* ================================================================ */}
        <header className="space-y-4">
          <Row gap="sm" className="items-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/60">
              <PaletteIcon className="h-5 w-5 text-primary-foreground" />
            </div>
            <Badge variant="secondary">Process Guide</Badge>
          </Row>
          <h1 className="text-3xl font-bold tracking-tight">Design Playbook</h1>
          <Text size="lg" variant="muted" className="leading-relaxed max-w-3xl">
            AI can build fast, but without clear design intent it will converge
            on safe, generic outcomes. This playbook shows how to give AI the
            right inputs — at the right time — to produce distinctive, high-quality
            design without slowing delivery.
          </Text>
        </header>

        {/* When to use */}
        <div className="rounded-xl border bg-muted/30 p-5">
          <Row gap="sm" className="mb-3 items-center">
            <TargetIcon className="h-5 w-5 text-primary" />
            <Text weight="semibold">When to use this playbook</Text>
          </Row>
          <div className="grid gap-2 md:grid-cols-2 text-sm text-muted-foreground">
            <Row gap="sm" className="items-start">
              <CheckCircleIcon className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>At the start of a new Catalyst project</span>
            </Row>
            <Row gap="sm" className="items-start">
              <CheckCircleIcon className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Mid-project when design feels generic</span>
            </Row>
            <Row gap="sm" className="items-start">
              <CheckCircleIcon className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>When stakeholders say &ldquo;it looks like everything else&rdquo;</span>
            </Row>
            <Row gap="sm" className="items-start">
              <CheckCircleIcon className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Before advancing to a more polished stage</span>
            </Row>
          </div>
        </div>

        {/* ================================================================ */}
        {/* Core Principle */}
        {/* ================================================================ */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Core Principle</h2>
          
          <div className="rounded-xl border border-violet-200 bg-gradient-to-br from-violet-50 to-purple-50/50 p-6 dark:border-violet-900/50 dark:from-violet-950/20 dark:to-purple-950/10">
            <Row gap="sm" className="mb-3 items-center">
              <SparklesIcon className="h-5 w-5 text-violet-600 dark:text-violet-400" />
              <Text weight="semibold" className="text-lg">AI amplifies taste. It doesn&apos;t invent it.</Text>
            </Row>
            <Stack gap="md">
              <Text size="sm" className="text-violet-900 dark:text-violet-200 leading-relaxed">
                When you give AI vague instructions, it defaults to &ldquo;average&rdquo;
                aesthetics — the statistical mean of everything it has seen. This
                produces competent but undifferentiated designs.
              </Text>
              <Text size="sm" className="text-violet-900 dark:text-violet-200 leading-relaxed">
                Strong design requires <strong>declared taste</strong>: specific references,
                precise language, and intentional constraints. Give AI clear inputs
                and it will amplify them. Give it nothing and it will give you nothing
                distinctive in return.
              </Text>
            </Stack>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border p-4">
              <Row gap="sm" className="mb-2 items-center">
                <ImageIcon className="h-4 w-4 text-primary" />
                <Text size="sm" weight="semibold">References</Text>
              </Row>
              <Text size="sm" variant="muted">
                Real examples that show what &ldquo;good&rdquo; looks like for this project
              </Text>
            </div>
            <div className="rounded-lg border p-4">
              <Row gap="sm" className="mb-2 items-center">
                <MessageSquareIcon className="h-4 w-4 text-primary" />
                <Text size="sm" weight="semibold">Language</Text>
              </Row>
              <Text size="sm" variant="muted">
                Precise vocabulary that names what you want, not vague descriptions
              </Text>
            </div>
            <div className="rounded-lg border p-4">
              <Row gap="sm" className="mb-2 items-center">
                <LayoutGridIcon className="h-4 w-4 text-primary" />
                <Text size="sm" weight="semibold">Constraints</Text>
              </Row>
              <Text size="sm" variant="muted">
                Boundaries that focus AI on specific choices, not infinite options
              </Text>
            </div>
          </div>

          <Callout type="catalyst">
            This playbook exists to replace slow, speculative design work — not
            to add more steps. It trades heavy mood boards, early Figma rounds,
            and long design cycles for fast, focused inputs that make AI output
            distinctive from the start.
          </Callout>
        </section>

        {/* ================================================================ */}
        {/* Stage-Aware Guidance */}
        {/* ================================================================ */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Stage-Aware Guidance</h2>
          <Text variant="muted" className="leading-relaxed">
            These steps scale with your project stage. A POC doesn&apos;t need
            production-level design polish, but it still benefits from clear intent.
            Add rigour as you advance.
          </Text>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-left px-4 py-3 font-semibold border-b">Stage</th>
                  <th className="text-left px-4 py-3 font-semibold border-b">Design Expectation</th>
                  <th className="text-left px-4 py-3 font-semibold border-b">Recommended Steps</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="px-4 py-3">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800">POC</Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">Clear hero, consistent tone, credibility</td>
                  <td className="px-4 py-3 text-muted-foreground">Steps 1–4</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-3">
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800">MVP</Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">Coherent system, repeatable patterns</td>
                  <td className="px-4 py-3 text-muted-foreground">Steps 1–6</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-3">
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800">MMP</Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">Polished flows, brand alignment</td>
                  <td className="px-4 py-3 text-muted-foreground">Steps 1–7</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800">PROD</Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">Full system consistency, accessibility, performance</td>
                  <td className="px-4 py-3 text-muted-foreground">All steps + iteration</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ================================================================ */}
        {/* The Playbook Steps */}
        {/* ================================================================ */}
        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">The Playbook</h2>
            <Text size="sm" variant="muted" className="mt-1">
              Seven recommended steps for getting distinctive design from AI.
              Click each step to expand.
            </Text>
          </div>

          <div className="space-y-3">
            {/* Step 1 — Design Intent */}
            <PlaybookStep
              number={1}
              title="Design Intent"
              purpose="Prevent generic output by explicitly declaring intent before writing code"
              color="blue"
              defaultOpen={true}
            >
              <Text size="sm" variant="muted" className="leading-relaxed">
                Before starting a Catalyst build, capture four things that will
                anchor AI toward distinctive output.
              </Text>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border p-4 space-y-3">
                  <Row gap="sm" className="items-center">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">1</span>
                    <Text size="sm" weight="semibold">Real-world reference</Text>
                  </Row>
                  <Text size="sm" variant="muted">
                    A production site or app that&apos;s realistic and credible.
                    Something actually shipped, not a concept.
                  </Text>
                  <div className="flex flex-wrap gap-1.5">
                    <ReferenceLink href="https://linear.app">Linear</ReferenceLink>
                    <ReferenceLink href="https://stripe.com">Stripe</ReferenceLink>
                    <ReferenceLink href="https://notion.so">Notion</ReferenceLink>
                    <ReferenceLink href="https://shopify.com">Shopify</ReferenceLink>
                  </div>
                </div>

                <div className="rounded-lg border p-4 space-y-3">
                  <Row gap="sm" className="items-center">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-700 dark:bg-violet-900/40 dark:text-violet-300">2</span>
                    <Text size="sm" weight="semibold">Aspirational reference</Text>
                  </Row>
                  <Text size="sm" variant="muted">
                    A &ldquo;concept car&rdquo; reference. May be more expressive
                    or experimental than what you&apos;ll actually build.
                  </Text>
                  <div className="flex flex-wrap gap-1.5">
                    <ReferenceLink href="https://dribbble.com">Dribbble</ReferenceLink>
                    <ReferenceLink href="https://mobbin.com">Mobbin</ReferenceLink>
                    <ReferenceLink href="https://www.curated.design">Curated</ReferenceLink>
                  </div>
                </div>

                <div className="rounded-lg border p-4 space-y-3">
                  <Row gap="sm" className="items-center">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-100 text-xs font-bold text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">3</span>
                    <Text size="sm" weight="semibold">Declared vibe</Text>
                  </Row>
                  <Text size="sm" variant="muted">
                    3–5 adjectives that describe the feeling you&apos;re aiming for.
                  </Text>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="rounded-md bg-muted px-2 py-1">&ldquo;technical and restrained&rdquo;</span>
                    <span className="rounded-md bg-muted px-2 py-1">&ldquo;editorial and expressive&rdquo;</span>
                    <span className="rounded-md bg-muted px-2 py-1">&ldquo;enterprise calm&rdquo;</span>
                  </div>
                </div>

                <div className="rounded-lg border p-4 space-y-3">
                  <Row gap="sm" className="items-center">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">4</span>
                    <Text size="sm" weight="semibold">Audience signal</Text>
                  </Row>
                  <Text size="sm" variant="muted">
                    Who must this design convince? Different audiences need
                    different visual signals.
                  </Text>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="rounded-md bg-muted px-2 py-1">founders</span>
                    <span className="rounded-md bg-muted px-2 py-1">operators</span>
                    <span className="rounded-md bg-muted px-2 py-1">executives</span>
                    <span className="rounded-md bg-muted px-2 py-1">consumers</span>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border bg-muted/30 p-4">
                <Row gap="sm" className="items-center mb-2">
                  <EyeIcon className="h-4 w-4 text-primary" />
                  <Text size="sm" weight="semibold">Output</Text>
                </Row>
                <Text size="sm" variant="muted">
                  A short design intent note. This can live in chat context, a
                  project doc, or a markdown file in your repo. Keep it concise
                  — 4–6 sentences is enough.
                </Text>
              </div>

              <Callout type="mistake">
                Skipping this step and planning to &ldquo;fix design later&rdquo;
                is the most common source of generic AI output. By the time you
                realise the design is bland, you&apos;ve already built significant
                code around those patterns.
              </Callout>
            </PlaybookStep>

            {/* Step 2 — Visual Context Injection */}
            <PlaybookStep
              number={2}
              title="Visual Context Injection"
              purpose="Give AI visual grounding so it doesn't default to generic patterns"
              color="violet"
            >
              <div className="rounded-xl border border-violet-200 bg-violet-50 p-4 dark:border-violet-800/50 dark:bg-violet-950/20">
                <Text weight="semibold" className="text-violet-900 dark:text-violet-100">
                  Key rule: Screenshots outperform text prompts.
                </Text>
              </div>

              <Text size="sm" variant="muted" className="leading-relaxed">
                Modern AI models are vision-first. Without visual input, they fall
                back to training priors — the statistical average of everything
                they&apos;ve seen. With visual input, they can adapt specific
                patterns to your context.
              </Text>

              <div className="space-y-3">
                <Text size="sm" weight="semibold">What to do:</Text>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex gap-2">
                    <CheckCircleIcon className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />
                    <span>Capture screenshots of your real-world reference (the homepage, key UI, specific patterns)</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircleIcon className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />
                    <span>Capture screenshots of your aspirational reference</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircleIcon className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />
                    <span>Feed them directly into the AI model when prompting for design work</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircleIcon className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />
                    <span>Explicitly say: &ldquo;Use this as a visual reference. Adapt structure and tone, not content.&rdquo;</span>
                  </li>
                </ul>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-lg border p-3 text-center">
                  <Text size="sm" weight="medium">Browser screenshots</Text>
                  <Text size="xs" variant="muted">Direct captures of reference sites</Text>
                </div>
                <div className="rounded-lg border p-3 text-center">
                  <Text size="sm" weight="medium">Design inspection tools</Text>
                  <Text size="xs" variant="muted">Figma, DevTools, VisBug</Text>
                </div>
                <div className="rounded-lg border p-3 text-center">
                  <Text size="sm" weight="medium">Mobbin exports</Text>
                  <Text size="xs" variant="muted">Curated UI pattern screenshots</Text>
                </div>
              </div>

              <Callout type="why">
                This is the single highest-impact step in the playbook. A few
                well-chosen screenshots will do more for your design quality than
                paragraphs of descriptive text.
              </Callout>
            </PlaybookStep>

            {/* Step 3 — Language Calibration */}
            <PlaybookStep
              number={3}
              title="Language Calibration"
              purpose="Enable better prompts by using shared design vocabulary"
              color="teal"
            >
              <Text size="sm" variant="muted" className="leading-relaxed">
                Teams can&apos;t ask for what they can&apos;t name. Building a
                shared vocabulary makes your prompts more precise and gives AI
                specific targets instead of vague descriptions.
              </Text>

              <div className="grid gap-3 md:grid-cols-2">
                <VocabList
                  title="Layouts"
                  items={["bento", "split", "stacked", "timeline", "masonry", "asymmetric", "centered", "full-bleed"]}
                />
                <VocabList
                  title="Styles"
                  items={["flat", "glass", "editorial", "futuristic", "brutalist", "minimal", "playful", "corporate"]}
                />
                <VocabList
                  title="Interactions"
                  items={["hover reveal", "progressive blur", "scroll-triggered", "parallax", "magnetic", "morph", "stagger"]}
                />
                <VocabList
                  title="Component Intent"
                  items={["conversion hero", "social proof strip", "process explainer", "feature grid", "testimonial carousel", "pricing table"]}
                />
              </div>

              <Callout type="tip">
                Name what you want, don&apos;t just describe it. &ldquo;A bento
                grid with glass cards&rdquo; is more actionable than &ldquo;a nice
                layout with some depth effects.&rdquo;
              </Callout>
            </PlaybookStep>

            {/* Step 4 — Hero-First Design */}
            <PlaybookStep
              number={4}
              title="Hero-First Design"
              purpose="Set the visual and emotional tone early with focused effort"
              color="amber"
            >
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800/50 dark:bg-amber-950/20">
                <Text weight="semibold" className="text-amber-900 dark:text-amber-100">
                  The 50% Rule: Spend roughly half your design effort on the hero.
                </Text>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <Text size="sm" weight="semibold">The hero defines:</Text>
                  <ul className="space-y-1.5 text-sm text-muted-foreground">
                    <li className="flex gap-2 items-center">
                      <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                      Typography scale and weight hierarchy
                    </li>
                    <li className="flex gap-2 items-center">
                      <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                      Colour application and accent usage
                    </li>
                    <li className="flex gap-2 items-center">
                      <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                      Spacing rhythm and density
                    </li>
                    <li className="flex gap-2 items-center">
                      <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                      Animation intensity and style
                    </li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <Text size="sm" weight="semibold">The hero becomes:</Text>
                  <ul className="space-y-1.5 text-sm text-muted-foreground">
                    <li className="flex gap-2 items-center">
                      <div className="h-1.5 w-1.5 rounded-full bg-violet-500" />
                      Demo thumbnail for stakeholders
                    </li>
                    <li className="flex gap-2 items-center">
                      <div className="h-1.5 w-1.5 rounded-full bg-violet-500" />
                      Pitch artefact for presentations
                    </li>
                    <li className="flex gap-2 items-center">
                      <div className="h-1.5 w-1.5 rounded-full bg-violet-500" />
                      Style reference for subsequent pages
                    </li>
                    <li className="flex gap-2 items-center">
                      <div className="h-1.5 w-1.5 rounded-full bg-violet-500" />
                      Visual anchor for brand alignment
                    </li>
                  </ul>
                </div>
              </div>

              <Callout type="catalyst">
                A strong hero is often &ldquo;enough&rdquo; for a POC. Full app
                polish is not required early. Get the hero right and you&apos;ve
                established the design direction for everything else.
              </Callout>
            </PlaybookStep>

            {/* Step 5 — Structured Section Assembly */}
            <PlaybookStep
              number={5}
              title="Structured Section Assembly"
              purpose="Avoid template soup and visual incoherence"
              color="emerald"
            >
              <Text size="sm" variant="muted" className="leading-relaxed">
                When building full pages, explicitly define sections before asking
                AI to build them. This gives AI assembly instructions instead of
                leaving it to guess.
              </Text>

              <div className="space-y-3">
                <Text size="sm" weight="semibold">Define each section with:</Text>
                <div className="grid gap-3 md:grid-cols-3">
                  <div className="rounded-lg border p-3">
                    <LayoutGridIcon className="h-4 w-4 text-emerald-600 mb-2" />
                    <Text size="sm" weight="medium">Layout type</Text>
                    <Text size="xs" variant="muted">split, stacked, bento, etc.</Text>
                  </div>
                  <div className="rounded-lg border p-3">
                    <SparklesIcon className="h-4 w-4 text-emerald-600 mb-2" />
                    <Text size="sm" weight="medium">Animation level</Text>
                    <Text size="xs" variant="muted">none, subtle, prominent</Text>
                  </div>
                  <div className="rounded-lg border p-3">
                    <LayersIcon className="h-4 w-4 text-emerald-600 mb-2" />
                    <Text size="sm" weight="medium">Content density</Text>
                    <Text size="xs" variant="muted">sparse, balanced, dense</Text>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border bg-muted/30 p-4">
                <Text size="sm" weight="semibold" className="mb-3">Example section plan:</Text>
                <div className="space-y-2 text-sm">
                  <Row gap="sm" className="items-baseline">
                    <span className="w-24 shrink-0 font-medium">Hero</span>
                    <span className="text-muted-foreground">Split layout, prominent animation, sparse</span>
                  </Row>
                  <Row gap="sm" className="items-baseline">
                    <span className="w-24 shrink-0 font-medium">Social proof</span>
                    <span className="text-muted-foreground">Stacked logos, subtle fade-in, minimal</span>
                  </Row>
                  <Row gap="sm" className="items-baseline">
                    <span className="w-24 shrink-0 font-medium">Features</span>
                    <span className="text-muted-foreground">Bento grid, hover interactions, balanced</span>
                  </Row>
                  <Row gap="sm" className="items-baseline">
                    <span className="w-24 shrink-0 font-medium">Process</span>
                    <span className="text-muted-foreground">Timeline, scroll-triggered, balanced</span>
                  </Row>
                  <Row gap="sm" className="items-baseline">
                    <span className="w-24 shrink-0 font-medium">CTA</span>
                    <span className="text-muted-foreground">Centered, prominent button, sparse</span>
                  </Row>
                </div>
              </div>
            </PlaybookStep>

            {/* Step 6 — Micro-Iteration */}
            <PlaybookStep
              number={6}
              title="Micro-Iteration"
              purpose="Preserve good decisions while refining design"
              color="rose"
            >
              <Text size="sm" variant="muted" className="leading-relaxed">
                Once you have a working design, iterate on individual elements
                rather than regenerating entire pages or sections.
              </Text>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800/50 dark:bg-emerald-950/20">
                  <Row gap="sm" className="items-center mb-2">
                    <CheckCircleIcon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    <Text size="sm" weight="semibold" className="text-emerald-900 dark:text-emerald-100">Do iterate on:</Text>
                  </Row>
                  <ul className="space-y-1 text-sm text-emerald-800 dark:text-emerald-200">
                    <li>• Individual components</li>
                    <li>• Spacing and alignment</li>
                    <li>• Animation timing and easing</li>
                    <li>• Typography refinements</li>
                    <li>• Color adjustments</li>
                  </ul>
                </div>
                <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 dark:border-rose-800/50 dark:bg-rose-950/20">
                  <Row gap="sm" className="items-center mb-2">
                    <XCircleIcon className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                    <Text size="sm" weight="semibold" className="text-rose-900 dark:text-rose-100">Avoid:</Text>
                  </Row>
                  <ul className="space-y-1 text-sm text-rose-800 dark:text-rose-200">
                    <li>• Regenerating entire pages</li>
                    <li>• Starting over when one element is wrong</li>
                    <li>• Losing accumulated design decisions</li>
                    <li>• &ldquo;Just make it look better&rdquo;</li>
                  </ul>
                </div>
              </div>

              <Callout type="why">
                Full regeneration destroys accumulated intent. Every time you
                rebuild from scratch, you lose the specific decisions that were
                working. Surgical changes preserve alignment while improving
                specific elements.
              </Callout>
            </PlaybookStep>

            {/* Step 7 — Style Extraction & Lock */}
            <PlaybookStep
              number={7}
              title="Style Extraction & Lock"
              purpose="Prevent late-stage design drift as you mature"
              color="sky"
            >
              <Text size="sm" variant="muted" className="leading-relaxed">
                As you move from MVP onward, extract your design decisions into
                a durable format that AI can reference in future sessions. This
                creates &ldquo;design memory&rdquo; that persists beyond a single
                conversation.
              </Text>

              <div className="space-y-3">
                <Text size="sm" weight="semibold">What to extract:</Text>
                <div className="grid gap-3 md:grid-cols-3">
                  <div className="rounded-lg border p-3">
                    <PaletteIcon className="h-4 w-4 text-sky-600 mb-2" />
                    <Text size="sm" weight="medium">Colour tokens</Text>
                    <Text size="xs" variant="muted">Primary, accent, neutrals, semantics</Text>
                  </div>
                  <div className="rounded-lg border p-3">
                    <PencilRulerIcon className="h-4 w-4 text-sky-600 mb-2" />
                    <Text size="sm" weight="medium">Typography rules</Text>
                    <Text size="xs" variant="muted">Font stack, scale, weights</Text>
                  </div>
                  <div className="rounded-lg border p-3">
                    <LayoutGridIcon className="h-4 w-4 text-sky-600 mb-2" />
                    <Text size="sm" weight="medium">Spacing principles</Text>
                    <Text size="xs" variant="muted">Rhythm, container widths, gaps</Text>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border bg-muted/30 p-4">
                <Row gap="sm" className="items-center mb-2">
                  <LockIcon className="h-4 w-4 text-primary" />
                  <Text size="sm" weight="semibold">Create a style.md file</Text>
                </Row>
                <Text size="sm" variant="muted">
                  Save your extracted tokens and rules into a simple markdown
                  file. Feed this back into future AI prompts and reference it
                  when building downstream surfaces (docs, app, presentations).
                </Text>
              </div>

              <Callout type="catalyst">
                This step is optional for POC but highly recommended from MVP
                onward. A style.md file takes 15 minutes to create and saves
                hours of re-establishing design direction in future sessions.
              </Callout>
            </PlaybookStep>
          </div>
        </section>

        {/* ================================================================ */}
        {/* How to Use This Playbook */}
        {/* ================================================================ */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">How to Use This Playbook</h2>
          
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border p-5 space-y-3">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800">Early POC</Badge>
              <Text size="sm" variant="muted">
                Focus on <strong>Steps 1–4</strong>. Capture intent, inject visual
                context, and get the hero right. Skip the later steps until you
                need them.
              </Text>
            </div>
            <div className="rounded-xl border p-5 space-y-3">
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800">MVP / MMP</Badge>
              <Text size="sm" variant="muted">
                Add <strong>Steps 5–7</strong>. Structure your sections, iterate
                surgically, and extract style tokens to prevent drift across
                multiple surfaces.
              </Text>
            </div>
            <div className="rounded-xl border p-5 space-y-3">
              <Badge variant="outline" className="bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950 dark:text-violet-300 dark:border-violet-800">Mid-Project Fix</Badge>
              <Text size="sm" variant="muted">
                Apply this playbook retroactively if design feels generic. Start
                with Step 1 (intent) even if you&apos;ve already built. It&apos;s
                never too late to redirect.
              </Text>
            </div>
          </div>

          <Callout type="catalyst">
            These steps are recommendations, not gates. Use what helps, skip what
            doesn&apos;t apply. The goal is distinctive design, not process
            compliance.
          </Callout>
        </section>

        {/* ================================================================ */}
        {/* Common Failure Modes */}
        {/* ================================================================ */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Common Failure Modes</h2>
          <Text variant="muted">
            Patterns that consistently lead to generic or weak design outcomes.
          </Text>

          <div className="grid gap-3 md:grid-cols-2">
            <FailureCard
              title="No references"
              description="Starting with no visual grounding, expecting AI to invent a distinctive style"
            />
            <FailureCard
              title="Text-only prompts"
              description="Describing design in words when a screenshot would be 10x more effective"
            />
            <FailureCard
              title="Full regeneration loops"
              description="Re-generating entire pages when one element is wrong, losing good decisions"
            />
            <FailureCard
              title="Skipping the hero"
              description="Trying to design everything at once instead of nailing the visual anchor first"
            />
            <FailureCard
              title="Polish at the end"
              description="Treating design as a final coat of paint rather than a foundational input"
            />
            <FailureCard
              title="Vague direction"
              description="'Make it look modern' instead of specific vocabulary and concrete references"
            />
          </div>
        </section>

        {/* ================================================================ */}
        {/* How This Fits Catalyst */}
        {/* ================================================================ */}
        <section className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-6">
          <Row gap="sm" className="mb-3 items-center">
            <SparklesIcon className="h-5 w-5 text-primary" />
            <Text weight="semibold" className="text-lg">How This Fits Catalyst</Text>
          </Row>
          <Stack gap="sm">
            <Text size="sm" className="leading-relaxed">
              This playbook replaces slow, speculative design work. Instead of
              mood boards, Figma rounds, and long design debates, you give AI
              focused inputs upfront and let it amplify your declared taste.
            </Text>
            <Text size="sm" className="leading-relaxed">
              The result: distinctive design at Catalyst speed. You keep the
              proof-led delivery model, stakeholders still see real software
              fast, and the output looks like it belongs to your project — not
              a template.
            </Text>
          </Stack>
        </section>

        {/* ================================================================ */}
        {/* Next Steps */}
        {/* ================================================================ */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Next Steps</h2>
          <div className="grid gap-3 md:grid-cols-2">
            <Link
              href="/docs/design/customisation"
              className="group rounded-xl border p-4 hover:border-primary/50 hover:bg-muted/50 transition-colors"
            >
              <Row gap="sm" className="items-center justify-between">
                <div>
                  <Text weight="semibold">Customisation</Text>
                  <Text size="sm" variant="muted">Apply your design intent to Catalyst tokens</Text>
                </div>
                <ArrowRightIcon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </Row>
            </Link>
            <Link
              href="/docs/design/colors"
              className="group rounded-xl border p-4 hover:border-primary/50 hover:bg-muted/50 transition-colors"
            >
              <Row gap="sm" className="items-center justify-between">
                <div>
                  <Text weight="semibold">Colours</Text>
                  <Text size="sm" variant="muted">Understand the colour token system</Text>
                </div>
                <ArrowRightIcon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </Row>
            </Link>
          </div>
        </section>
      </Stack>
    </article>
  )
}

// =============================================================================
// SUPPORTING COMPONENTS
// =============================================================================

function FailureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-lg border border-rose-200 bg-rose-50/50 p-4 dark:border-rose-900/50 dark:bg-rose-950/20">
      <Row gap="sm" className="items-start">
        <XCircleIcon className="h-4 w-4 shrink-0 text-rose-500 mt-0.5" />
        <div>
          <Text size="sm" weight="semibold" className="text-rose-900 dark:text-rose-100">{title}</Text>
          <Text size="sm" className="text-rose-700 dark:text-rose-300">{description}</Text>
        </div>
      </Row>
    </div>
  )
}
