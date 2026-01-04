/**
 * CATALYST - Audits Overview
 *
 * Structured quality reviews you can run at any stage. Each audit has
 * stage-appropriate expectations so you know what "good" looks like
 * for POC vs. production.
 */

import Link from "next/link"
import { Stack, Text, Row } from "@/components/core"
import {
  ArrowRightIcon,
  ShieldCheckIcon,
  AccessibilityIcon,
  PaletteIcon,
  ZapIcon,
  CodeIcon,
  RocketIcon,
  FileTextIcon,
  PlugIcon,
  CheckCircleIcon,
  CircleIcon,
  MinusIcon,
  LightbulbIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function AuditsPage() {
  return (
    <article>
      <Stack gap="xl">
        {/* Header */}
        <header className="space-y-3">
          <h1 className="text-3xl font-bold tracking-tight">Audits</h1>
          <Text size="lg" variant="muted" className="leading-relaxed">
            Structured quality reviews you can run at any time. Each audit has
            clear checklists and stage-appropriate expectations.
          </Text>
        </header>

        {/* ================================================================ */}
        {/* Why audits exist */}
        {/* ================================================================ */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Why audits?</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <WhyCard
              title="Checkpoints ask permission"
              description="Decision points check if you should proceed. But they don't tell you HOW to check if your work is actually good."
              color="amber"
            />
            <WhyCard
              title="Audits verify quality"
              description="Concrete checklists you can run through — alone or with AI — to systematically check different quality dimensions."
              color="teal"
            />
            <WhyCard
              title="Stage-appropriate rigor"
              description="POC doesn't need WCAG compliance. Production does. Same audit, different expectations per stage."
              color="violet"
            />
          </div>
        </section>

        {/* ================================================================ */}
        {/* When to use */}
        {/* ================================================================ */}
        <section className="rounded-xl border border-sky-200 bg-gradient-to-br from-sky-50 to-cyan-50/50 p-5 dark:border-sky-900/50 dark:from-sky-950/20 dark:to-cyan-950/10">
          <h2 className="mb-3 font-semibold">When to run audits</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Text weight="medium" size="sm">
                At decision points
              </Text>
              <Text size="sm" variant="muted" className="mt-1">
                Before Refine checkpoint, run relevant audits at
                the target stage level to confirm readiness.
              </Text>
            </div>
            <div>
              <Text weight="medium" size="sm">
                During development
              </Text>
              <Text size="sm" variant="muted" className="mt-1">
                Run targeted audits anytime — after building a new feature, before
                a demo, or when something feels off.
              </Text>
            </div>
            <div>
              <Text weight="medium" size="sm">
                Per surface
              </Text>
              <Text size="sm" variant="muted" className="mt-1">
                Audit the whole project or focus on a specific surface. Content &
                SEO applies to web; most others apply everywhere.
              </Text>
            </div>
            <div>
              <Text weight="medium" size="sm">
                With AI
              </Text>
              <Text size="sm" variant="muted" className="mt-1">
                Each audit is designed to be AI-runnable. Ask your coding agent to
                &quot;run the Security audit at MVP level.&quot;
              </Text>
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* The 8 audits */}
        {/* ================================================================ */}
        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">The 8 audits</h2>
            <Text size="sm" variant="muted" className="mt-1">
              Each audit covers a distinct quality dimension with 2-4 focused
              parts.
            </Text>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <AuditCard
              icon={ShieldCheckIcon}
              title="Data & Security"
              question="Is this safe to use?"
              parts={["Auth & Access", "Data Protection", "API Security"]}
              href="/docs/audits/data"
              color="red"
            />
            <AuditCard
              icon={AccessibilityIcon}
              title="Accessibility & Inclusion"
              question="Can everyone use this?"
              parts={["Keyboard & Focus", "Screen Readers", "Visual Clarity"]}
              href="/docs/audits/accessibility"
              color="purple"
            />
            <AuditCard
              icon={PaletteIcon}
              title="Design & Experience"
              question="Is this pleasant to use?"
              parts={["Design Consistency", "Interaction Quality", "Responsive Behavior"]}
              href="/docs/audits/experience"
              color="pink"
            />
            <AuditCard
              icon={ZapIcon}
              title="Speed & Performance"
              question="Is this fast enough?"
              parts={["Load Performance", "Runtime Efficiency"]}
              href="/docs/audits/performance"
              color="amber"
            />
            <AuditCard
              icon={CodeIcon}
              title="Code & Testing"
              question="Is this maintainable?"
              parts={["Standards & Style", "Test Coverage", "Dependencies & Debt"]}
              href="/docs/audits/code"
              color="blue"
            />
            <AuditCard
              icon={RocketIcon}
              title="Deploy & Observe"
              question="Can we run and monitor this?"
              parts={["Deployment Pipeline", "Observability", "Resilience & Recovery"]}
              href="/docs/audits/deploy"
              color="emerald"
            />
            <AuditCard
              icon={FileTextIcon}
              title="Content & SEO"
              question="Is content ready for users?"
              parts={["Copy & Legal", "Search & Discovery"]}
              href="/docs/audits/content"
              color="orange"
              badge="Web"
            />
            <AuditCard
              icon={PlugIcon}
              title="Integrations & Services"
              question="Do external services work?"
              parts={["Third-Party APIs", "Webhooks & Events", "Service Reliability"]}
              href="/docs/audits/integrations"
              color="cyan"
            />
          </div>
        </section>

        {/* ================================================================ */}
        {/* Stage expectations */}
        {/* ================================================================ */}
        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Stage expectations</h2>
            <Text size="sm" variant="muted" className="mt-1">
              Not every audit matters at every stage. Use this as a guide.
            </Text>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-3 pr-4 text-left font-medium">Audit</th>
                  <th className="px-3 py-3 text-center font-medium">POC</th>
                  <th className="px-3 py-3 text-center font-medium">MVP</th>
                  <th className="px-3 py-3 text-center font-medium">MMP</th>
                  <th className="px-3 py-3 text-center font-medium">PROD</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <StageRow audit="Data & Security" poc="light" mvp="full" mmp="full" prod="full" />
                <StageRow audit="Accessibility & Inclusion" poc="light" mvp="light" mmp="full" prod="full" />
                <StageRow audit="Design & Experience" poc="skip" mvp="light" mmp="full" prod="full" />
                <StageRow audit="Speed & Performance" poc="skip" mvp="light" mmp="full" prod="full" />
                <StageRow audit="Code & Testing" poc="skip" mvp="light" mmp="full" prod="full" />
                <StageRow audit="Deploy & Observe" poc="skip" mvp="light" mmp="full" prod="full" />
                <StageRow audit="Content & SEO" poc="skip" mvp="skip" mmp="full" prod="full" />
                <StageRow audit="Integrations & Services" poc="skip" mvp="light" mmp="full" prod="full" />
              </tbody>
            </table>
          </div>

          <Row gap="md" className="flex-wrap text-sm">
            <Row gap="xs" className="items-center">
              <MinusIcon className="h-4 w-4 text-muted-foreground/50" />
              <Text size="sm" variant="muted">Skip</Text>
            </Row>
            <Row gap="xs" className="items-center">
              <CircleIcon className="h-4 w-4 text-amber-500" />
              <Text size="sm" variant="muted">Light check</Text>
            </Row>
            <Row gap="xs" className="items-center">
              <CheckCircleIcon className="h-4 w-4 text-emerald-500" />
              <Text size="sm" variant="muted">Full audit</Text>
            </Row>
          </Row>
        </section>

        {/* ================================================================ */}
        {/* How to use */}
        {/* ================================================================ */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">How to use audits</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <HowCard
              step="1"
              title="Pick the audit"
              description="Choose based on what you're checking. Use the stage matrix to know what level of rigor to apply."
            />
            <HowCard
              step="2"
              title="Work through each part"
              description="Each audit has 2-4 parts. Go through the checklist items, noting passes and issues."
            />
            <HowCard
              step="3"
              title="Document findings"
              description="Capture issues with severity. Decide: fix now, fix later, or accept as known limitation."
            />
            <HowCard
              step="4"
              title="Track over time"
              description="Re-run audits as you advance. What was acceptable at MVP may not be at MMP."
            />
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
          <Text size="sm" className="leading-relaxed text-amber-900 dark:text-amber-200">
            Audits work best when they&apos;re routine, not reactive. Run a quick
            Security check after adding auth. Run Accessibility after building a
            form. Small, frequent audits catch issues before they compound.
          </Text>
        </section>

        {/* ================================================================ */}
        {/* Start here */}
        {/* ================================================================ */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Start here</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <StartCard
              title="Data & Security"
              description="The most critical audit. Start here to ensure your app is safe to use."
              href="/docs/audits/data"
              color="red"
            />
            <StartCard
              title="Code & Testing"
              description="Establish good habits early. Run this to check your codebase health."
              href="/docs/audits/code"
              color="blue"
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
                href="/docs/workflow/delivery"
                className="text-primary hover:underline"
              >
                Delivery Cycles
              </Link>{" "}
              — Checkpoints where audits verify readiness
            </li>
            <li>
              <Link
                href="/docs/prompts/quality"
                className="text-primary hover:underline"
              >
                Quality Prompts
              </Link>{" "}
              — Prompts for running audits with AI
            </li>
            <li>
              <Link
                href="/docs/workflow"
                className="text-primary hover:underline"
              >
                Workflow
              </Link>{" "}
              — The delivery loop audits support
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

const whyColors = {
  amber: "bg-gradient-to-br from-amber-50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/10",
  teal: "bg-gradient-to-br from-teal-50 to-emerald-50/50 dark:from-teal-950/20 dark:to-emerald-950/10",
  violet: "bg-gradient-to-br from-violet-50 to-purple-50/50 dark:from-violet-950/20 dark:to-purple-950/10",
} as const

function WhyCard({
  title,
  description,
  color,
}: {
  title: string
  description: string
  color: keyof typeof whyColors
}) {
  return (
    <div className={cn("rounded-xl p-5", whyColors[color])}>
      <Text weight="semibold">{title}</Text>
      <Text size="sm" variant="muted" className="mt-2 leading-relaxed">
        {description}
      </Text>
    </div>
  )
}

const auditColors = {
  red: {
    iconBg: "bg-red-100 dark:bg-red-900/30",
    icon: "text-red-600 dark:text-red-400",
    border: "border-red-200 dark:border-red-900/50",
  },
  purple: {
    iconBg: "bg-purple-100 dark:bg-purple-900/30",
    icon: "text-purple-600 dark:text-purple-400",
    border: "border-purple-200 dark:border-purple-900/50",
  },
  pink: {
    iconBg: "bg-pink-100 dark:bg-pink-900/30",
    icon: "text-pink-600 dark:text-pink-400",
    border: "border-pink-200 dark:border-pink-900/50",
  },
  amber: {
    iconBg: "bg-amber-100 dark:bg-amber-900/30",
    icon: "text-amber-600 dark:text-amber-400",
    border: "border-amber-200 dark:border-amber-900/50",
  },
  blue: {
    iconBg: "bg-blue-100 dark:bg-blue-900/30",
    icon: "text-blue-600 dark:text-blue-400",
    border: "border-blue-200 dark:border-blue-900/50",
  },
  emerald: {
    iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
    icon: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-200 dark:border-emerald-900/50",
  },
  orange: {
    iconBg: "bg-orange-100 dark:bg-orange-900/30",
    icon: "text-orange-600 dark:text-orange-400",
    border: "border-orange-200 dark:border-orange-900/50",
  },
  cyan: {
    iconBg: "bg-cyan-100 dark:bg-cyan-900/30",
    icon: "text-cyan-600 dark:text-cyan-400",
    border: "border-cyan-200 dark:border-cyan-900/50",
  },
} as const

function AuditCard({
  icon: Icon,
  title,
  question,
  parts,
  href,
  color,
  badge,
}: {
  icon: React.ElementType
  title: string
  question: string
  parts: string[]
  href: string
  color: keyof typeof auditColors
  badge?: string
}) {
  const colors = auditColors[color]

  return (
    <Link
      href={href}
      className={cn(
        "group flex flex-col rounded-xl border p-5 transition-colors hover:border-primary/50",
        colors.border
      )}
    >
      <Row gap="sm" className="mb-3 items-center">
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-lg",
            colors.iconBg
          )}
        >
          <Icon className={cn("h-5 w-5", colors.icon)} />
        </div>
        <div>
          <Row gap="sm" className="items-center">
            <Text weight="semibold" className="group-hover:text-primary">
              {title}
            </Text>
            {badge && (
              <span className="rounded bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground">
                {badge}
              </span>
            )}
          </Row>
          <Text size="sm" variant="muted" className="italic">
            {question}
          </Text>
        </div>
      </Row>
      <div className="mb-3 flex flex-wrap gap-2">
        {parts.map((part) => (
          <span
            key={part}
            className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground"
          >
            {part}
          </span>
        ))}
      </div>
      <Text
        size="sm"
        className="text-primary mt-auto inline-flex items-center gap-1 font-medium"
      >
        View audit
        <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
      </Text>
    </Link>
  )
}

function StageRow({
  audit,
  poc,
  mvp,
  mmp,
  prod,
}: {
  audit: string
  poc: "skip" | "light" | "full"
  mvp: "skip" | "light" | "full"
  mmp: "skip" | "light" | "full"
  prod: "skip" | "light" | "full"
}) {
  const renderIcon = (level: "skip" | "light" | "full") => {
    switch (level) {
      case "skip":
        return <MinusIcon className="h-4 w-4 text-muted-foreground/50" />
      case "light":
        return <CircleIcon className="h-4 w-4 text-amber-500" />
      case "full":
        return <CheckCircleIcon className="h-4 w-4 text-emerald-500" />
    }
  }

  return (
    <tr className="border-b last:border-0">
      <td className="py-3 pr-4">{audit}</td>
      <td className="px-3 py-3 text-center">{renderIcon(poc)}</td>
      <td className="px-3 py-3 text-center">{renderIcon(mvp)}</td>
      <td className="px-3 py-3 text-center">{renderIcon(mmp)}</td>
      <td className="px-3 py-3 text-center">{renderIcon(prod)}</td>
    </tr>
  )
}

function HowCard({
  step,
  title,
  description,
}: {
  step: string
  title: string
  description: string
}) {
  return (
    <div className="flex gap-3 rounded-xl border p-4">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
        {step}
      </span>
      <div>
        <Text weight="medium">{title}</Text>
        <Text size="sm" variant="muted" className="mt-0.5">
          {description}
        </Text>
      </div>
    </div>
  )
}

const startColors = {
  red: "bg-gradient-to-br from-red-50 to-rose-50/50 dark:from-red-950/20 dark:to-rose-950/10 border-red-200 dark:border-red-900/50",
  blue: "bg-gradient-to-br from-blue-50 to-sky-50/50 dark:from-blue-950/20 dark:to-sky-950/10 border-blue-200 dark:border-blue-900/50",
} as const

function StartCard({
  title,
  description,
  href,
  color,
}: {
  title: string
  description: string
  href: string
  color: keyof typeof startColors
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex flex-col rounded-xl border p-5 transition-colors hover:border-primary/50",
        startColors[color]
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
        Start audit
        <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
      </Text>
    </Link>
  )
}
