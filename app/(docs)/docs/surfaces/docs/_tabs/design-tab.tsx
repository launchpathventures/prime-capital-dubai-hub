/**
 * CATALYST - Docs Surface Doc Tab: Design
 *
 * A living showcase of documentation design patterns.
 * These are the patterns used throughout Catalyst docs — copy them for consistency.
 */

"use client"

import { Stack, Text, Title, Row } from "@/components/core"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  CheckCircle2Icon,
  XCircleIcon,
  AlertTriangleIcon,
  InfoIcon,
  LightbulbIcon,
  SparklesIcon,
  FileCodeIcon,
  ZapIcon,
  ShieldIcon,
} from "lucide-react"

export function DesignTab() {
  return (
    <article>
      <Stack gap="xl">
        {/* ================================================================ */}
        {/* Natural Example: What Good Docs Look Like */}
        {/* ================================================================ */}
        <section className="space-y-6">
          {/* Summary Card */}
          <div className="border-primary bg-primary/5 space-y-4 rounded-lg border-l-4 p-5">
            <div>
              <p className="text-lg font-medium leading-snug">
                Documentation pages are scannable, actionable, and layered
              </p>
              <p className="text-muted-foreground mt-1">
                Readers get the key message at a glance, with details on demand
              </p>
            </div>

            <p className="leading-relaxed">
              This page demonstrates the design patterns used throughout Catalyst
              docs. The section you&apos;re reading now is itself an example — a{" "}
              <strong>summary card</strong> that gives you the core message
              immediately, with supporting context below.
            </p>

            <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
              {[
                { label: "Scannable", desc: "Key info at a glance" },
                { label: "Actionable", desc: "AI prompts first" },
                { label: "Layered", desc: "Details on demand" },
                { label: "Consistent", desc: "Same patterns everywhere" },
              ].map((p) => (
                <div
                  key={p.label}
                  className="bg-card rounded-md border p-2.5"
                >
                  <Text size="sm" weight="medium">
                    {p.label}
                  </Text>
                  <Text size="xs" variant="muted">
                    {p.desc}
                  </Text>
                </div>
              ))}
            </div>

            {/* Do / Don't */}
            <div className="grid gap-3 md:grid-cols-2">
              <div className="bg-card rounded-md border p-3">
                <Row gap="sm" className="mb-2 items-center">
                  <CheckCircle2Icon className="h-4 w-4 text-emerald-600" />
                  <Text size="sm" weight="medium">
                    Do
                  </Text>
                </Row>
                <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
                  <li>Lead with what to ask AI</li>
                  <li>Put code in collapsible sections</li>
                  <li>Use callouts for important info</li>
                  <li>Keep paragraphs short</li>
                </ul>
              </div>
              <div className="bg-card rounded-md border p-3">
                <Row gap="sm" className="mb-2 items-center">
                  <XCircleIcon className="h-4 w-4 text-red-600" />
                  <Text size="sm" weight="medium">
                    Don&apos;t
                  </Text>
                </Row>
                <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
                  <li>Start with implementation details</li>
                  <li>Show large code blocks inline</li>
                  <li>Write walls of text</li>
                  <li>Hide important info in prose</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Example: Task with AI prompt */}
          <div className="bg-card overflow-hidden rounded-lg border">
            <div className="border-b bg-muted/30 px-5 py-3">
              <Row gap="sm" className="items-center">
                <FileCodeIcon className="text-muted-foreground h-4 w-4" />
                <Text weight="medium">Add a new documentation page</Text>
              </Row>
            </div>
            <div className="space-y-4 p-5">
              <div className="border-primary/20 bg-primary/5 rounded-lg border p-3">
                <Row gap="sm" className="items-start">
                  <SparklesIcon className="text-primary mt-0.5 h-4 w-4 shrink-0" />
                  <div>
                    <Text
                      size="xs"
                      variant="muted"
                      className="uppercase tracking-wide"
                    >
                      Ask AI
                    </Text>
                    <Text size="sm" className="mt-0.5">
                      &quot;Create a new docs page for authentication setup&quot;
                    </Text>
                  </div>
                </Row>
              </div>
              <p className="text-muted-foreground text-sm">
                New pages follow the same structure: summary card at the top,
                task cards for how-to content, callouts for important notes.
              </p>
            </div>
          </div>

          {/* Example: Callout */}
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
            <Row gap="sm" className="items-start">
              <AlertTriangleIcon className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
              <div>
                <Text weight="medium">Callouts draw attention</Text>
                <Text size="sm" variant="muted" className="mt-1">
                  Use them sparingly for warnings, tips, and important notes
                  that readers shouldn&apos;t miss.
                </Text>
              </div>
            </Row>
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* Pattern 1: Summary Card */}
        {/* ---------------------------------------------------------------- */}
        <section className="space-y-4">
          <Title size="h3">1. Summary Card</Title>
          <p className="text-muted-foreground text-sm">
            Every tab starts with a blue summary card. Gives readers the key
            message immediately.
          </p>

          {/* Live example */}
          <div className="border-primary bg-primary/5 space-y-3 rounded-lg border-l-4 p-5">
            <p className="text-lg font-medium leading-snug">
              The main message goes here
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Supporting context that expands on the main message. Keep it to
              2-3 sentences. This pattern works for any page or section intro.
            </p>
          </div>

          {/* Code */}
          <Accordion>
            <AccordionItem value="summary-code" className="border-none">
              <AccordionTrigger className="px-0 py-2 text-sm">
                Show code
              </AccordionTrigger>
              <AccordionContent className="px-0">
                <div className="bg-muted/50 overflow-x-auto rounded-md p-4">
                  <pre className="text-xs leading-relaxed">{`<div className="border-primary bg-primary/5 space-y-3 rounded-lg border-l-4 p-5">
  <p className="text-lg font-medium leading-snug">
    The main message goes here
  </p>
  <p className="text-muted-foreground leading-relaxed">
    Supporting context...
  </p>
</div>`}</pre>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* Pattern 2: Task Card */}
        {/* ---------------------------------------------------------------- */}
        <section className="space-y-4">
          <Title size="h3">2. Task Card</Title>
          <p className="text-muted-foreground text-sm">
            For how-to content. Leads with AI prompt, shows key points, hides
            technical details in collapsible section.
          </p>

          {/* Live example */}
          <div className="bg-card overflow-hidden rounded-lg border">
            <div className="border-b bg-muted/30 px-5 py-3">
              <Row gap="sm" className="items-center">
                <FileCodeIcon className="text-muted-foreground h-4 w-4" />
                <Text weight="medium">Add a feature</Text>
              </Row>
            </div>
            <div className="space-y-4 p-5">
              {/* Ask AI */}
              <div className="border-primary/20 bg-primary/5 rounded-lg border p-3">
                <Row gap="sm" className="items-start">
                  <SparklesIcon className="text-primary mt-0.5 h-4 w-4 shrink-0" />
                  <div>
                    <Text
                      size="xs"
                      variant="muted"
                      className="uppercase tracking-wide"
                    >
                      Ask AI
                    </Text>
                    <Text size="sm" className="mt-0.5">
                      &quot;Add a notifications dropdown to the header&quot;
                    </Text>
                  </div>
                </Row>
              </div>

              {/* Description */}
              <p className="text-muted-foreground text-sm leading-relaxed">
                Brief description of what this does and why. One or two
                sentences max.
              </p>

              {/* Details */}
              <ul className="space-y-1.5">
                <li className="flex gap-2 text-sm">
                  <CheckCircle2Icon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  <span>Key point about what happens</span>
                </li>
                <li className="flex gap-2 text-sm">
                  <CheckCircle2Icon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  <span>Another important detail</span>
                </li>
              </ul>

              {/* Files */}
              <div className="border-t pt-4">
                <Text
                  size="xs"
                  variant="muted"
                  className="mb-2 uppercase tracking-wide"
                >
                  Files involved
                </Text>
                <ul className="space-y-1">
                  <li className="flex gap-2 text-sm">
                    <code className="bg-muted rounded px-1.5 py-0.5 text-xs">
                      path/to/file.tsx
                    </code>
                    <span className="text-muted-foreground">— Description</span>
                  </li>
                </ul>
              </div>

              {/* Technical details */}
              <div className="border-t pt-2">
                <Accordion>
                  <AccordionItem value="task-details" className="border-none">
                    <AccordionTrigger className="px-0 py-2 text-sm">
                      Technical details
                    </AccordionTrigger>
                    <AccordionContent className="px-0">
                      <div className="bg-muted/50 overflow-x-auto rounded-md p-4">
                        <pre className="text-xs leading-relaxed">{`// Code example goes here
const example = "hidden until clicked"`}</pre>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* Pattern 3: Callouts */}
        {/* ---------------------------------------------------------------- */}
        <section className="space-y-4">
          <Title size="h3">3. Callouts</Title>
          <p className="text-muted-foreground text-sm">
            Draw attention to important information. Use sparingly — too many
            callouts defeats the purpose.
          </p>

          <Stack gap="md">
            <Callout type="info" title="Note">
              Additional context that helps understanding but isn&apos;t critical.
            </Callout>
            <Callout type="tip" title="Tip">
              A helpful suggestion that can improve your workflow.
            </Callout>
            <Callout type="warning" title="Warning">
              Important information that could cause issues if ignored.
            </Callout>
            <Callout type="success" title="Success">
              Confirmation that something worked or is configured correctly.
            </Callout>
          </Stack>

          <Accordion>
            <AccordionItem value="callout-code" className="border-none">
              <AccordionTrigger className="px-0 py-2 text-sm">
                Show code
              </AccordionTrigger>
              <AccordionContent className="px-0">
                <div className="bg-muted/50 overflow-x-auto rounded-md p-4">
                  <pre className="text-xs leading-relaxed">{`{/* Info callout */}
<div className="rounded-lg border border-blue-500/30 bg-blue-500/5 p-4">
  <Row gap="sm" className="items-start">
    <InfoIcon className="text-blue-500 h-5 w-5 shrink-0 mt-0.5" />
    <div>
      <Text weight="medium">Note</Text>
      <Text size="sm" variant="muted" className="mt-1">
        Your message here...
      </Text>
    </div>
  </Row>
</div>

{/* Warning callout */}
<div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
  ...
</div>`}</pre>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* Pattern 4: Feature Cards */}
        {/* ---------------------------------------------------------------- */}
        <section className="space-y-4">
          <Title size="h3">4. Feature Cards</Title>
          <p className="text-muted-foreground text-sm">
            For &quot;What You Get&quot; sections. Icon + title + brief
            description.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <FeatureCard
              icon={ZapIcon}
              title="Fast builds"
              description="Optimized for performance with incremental compilation and caching."
            />
            <FeatureCard
              icon={ShieldIcon}
              title="Type safe"
              description="Full TypeScript support with strict mode enabled by default."
            />
          </div>

          <Accordion>
            <AccordionItem value="feature-code" className="border-none">
              <AccordionTrigger className="px-0 py-2 text-sm">
                Show code
              </AccordionTrigger>
              <AccordionContent className="px-0">
                <div className="bg-muted/50 overflow-x-auto rounded-md p-4">
                  <pre className="text-xs leading-relaxed">{`<div className="bg-card group rounded-xl border p-5">
  <div className="mb-3 flex items-center gap-2.5">
    <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
      <Icon className="text-primary h-4 w-4" />
    </div>
    <h3 className="font-medium">{title}</h3>
  </div>
  <p className="text-muted-foreground text-sm leading-relaxed">
    {description}
  </p>
</div>`}</pre>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* Pattern 5: Collapsible Details */}
        {/* ---------------------------------------------------------------- */}
        <section className="space-y-4">
          <Title size="h3">5. Collapsible Details</Title>
          <p className="text-muted-foreground text-sm">
            Keep pages scannable by hiding technical content. Readers who need
            it can expand; others skip it.
          </p>

          <div className="bg-card rounded-lg border p-5">
            <p className="text-sm">
              The main content is visible. Technical details are hidden below.
            </p>
            <div className="mt-4 border-t pt-2">
              <Accordion>
                <AccordionItem value="example-details" className="border-none">
                  <AccordionTrigger className="px-0 py-2 text-sm">
                    Technical details
                  </AccordionTrigger>
                  <AccordionContent className="px-0">
                    <div className="bg-muted/50 overflow-x-auto rounded-md p-4">
                      <pre className="text-xs leading-relaxed">{`// This code is hidden until the user clicks
// Great for keeping docs scannable
export function example() {
  return "hidden content"
}`}</pre>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>

          <Accordion>
            <AccordionItem value="collapsible-code" className="border-none">
              <AccordionTrigger className="px-0 py-2 text-sm">
                Show code
              </AccordionTrigger>
              <AccordionContent className="px-0">
                <div className="bg-muted/50 overflow-x-auto rounded-md p-4">
                  <pre className="text-xs leading-relaxed">{`<Accordion>
  <AccordionItem value="details" className="border-none">
    <AccordionTrigger className="px-0 py-2 text-sm">
      Technical details
    </AccordionTrigger>
    <AccordionContent className="px-0">
      <div className="bg-muted/50 overflow-x-auto rounded-md p-4">
        <pre className="text-xs leading-relaxed">
          {code}
        </pre>
      </div>
    </AccordionContent>
  </AccordionItem>
</Accordion>`}</pre>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* Pattern 6: Use Case Lists */}
        {/* ---------------------------------------------------------------- */}
        <section className="space-y-4">
          <Title size="h3">6. Use Case Lists</Title>
          <p className="text-muted-foreground text-sm">
            For &quot;When to Use It&quot; sections. Title + example in a clean
            list.
          </p>

          <div className="bg-card rounded-xl border p-6">
            <ul className="space-y-3">
              <UseCaseItem
                title="Documentation pages"
                example="Guides, reference, API docs"
              />
              <UseCaseItem
                title="Process documentation"
                example="Workflows, standards, checklists"
              />
              <UseCaseItem
                title="Architecture decisions"
                example="ADRs, design rationale, trade-offs"
              />
            </ul>
          </div>

          <Accordion>
            <AccordionItem value="usecase-code" className="border-none">
              <AccordionTrigger className="px-0 py-2 text-sm">
                Show code
              </AccordionTrigger>
              <AccordionContent className="px-0">
                <div className="bg-muted/50 overflow-x-auto rounded-md p-4">
                  <pre className="text-xs leading-relaxed">{`<li className="flex gap-3 text-sm">
  <span className="bg-primary mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" />
  <span>
    <strong className="text-foreground">{title}</strong>
    <span className="text-muted-foreground"> — {example}</span>
  </span>
</li>`}</pre>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* Pattern 7: Do/Don't Cards */}
        {/* ---------------------------------------------------------------- */}
        <section className="space-y-4">
          <Title size="h3">7. Do/Don&apos;t Cards</Title>
          <p className="text-muted-foreground text-sm">
            Quick guidelines in a scannable format. Green check for do, red X
            for don&apos;t.
          </p>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="bg-background rounded-md border p-3">
              <Row gap="sm" className="mb-2 items-center">
                <CheckCircle2Icon className="h-4 w-4 text-emerald-600" />
                <Text size="sm" weight="medium">
                  Do
                </Text>
              </Row>
              <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
                <li>First guideline</li>
                <li>Second guideline</li>
              </ul>
            </div>
            <div className="bg-background rounded-md border p-3">
              <Row gap="sm" className="mb-2 items-center">
                <XCircleIcon className="h-4 w-4 text-red-600" />
                <Text size="sm" weight="medium">
                  Don&apos;t
                </Text>
              </Row>
              <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
                <li>First anti-pattern</li>
                <li>Second anti-pattern</li>
              </ul>
            </div>
          </div>
        </section>
      </Stack>
    </article>
  )
}

// -----------------------------------------------------------------------------
// Helper Components
// -----------------------------------------------------------------------------

function Callout({
  type,
  title,
  children,
}: {
  type: "info" | "tip" | "warning" | "success"
  title: string
  children: React.ReactNode
}) {
  const styles = {
    info: {
      border: "border-blue-500/30",
      bg: "bg-blue-500/5",
      icon: InfoIcon,
      iconColor: "text-blue-500",
    },
    tip: {
      border: "border-primary/30",
      bg: "bg-primary/5",
      icon: LightbulbIcon,
      iconColor: "text-primary",
    },
    warning: {
      border: "border-amber-500/30",
      bg: "bg-amber-500/5",
      icon: AlertTriangleIcon,
      iconColor: "text-amber-500",
    },
    success: {
      border: "border-emerald-500/30",
      bg: "bg-emerald-500/5",
      icon: CheckCircle2Icon,
      iconColor: "text-emerald-500",
    },
  }

  const style = styles[type]
  const Icon = style.icon

  return (
    <div className={`rounded-lg border p-4 ${style.border} ${style.bg}`}>
      <Row gap="sm" className="items-start">
        <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${style.iconColor}`} />
        <div>
          <Text weight="medium">{title}</Text>
          <Text size="sm" variant="muted" className="mt-1">
            {children}
          </Text>
        </div>
      </Row>
    </div>
  )
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
}) {
  return (
    <div className="bg-card group rounded-xl border p-5 transition-colors">
      <div className="mb-3 flex items-center gap-2.5">
        <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
          <Icon className="text-primary h-4 w-4" />
        </div>
        <h3 className="font-medium">{title}</h3>
      </div>
      <p className="text-muted-foreground text-sm leading-relaxed">
        {description}
      </p>
    </div>
  )
}

function UseCaseItem({ title, example }: { title: string; example: string }) {
  return (
    <li className="flex gap-3 text-sm">
      <span className="bg-primary mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" />
      <span>
        <strong className="text-foreground">{title}</strong>
        <span className="text-muted-foreground"> — {example}</span>
      </span>
    </li>
  )
}
