/**
 * CATALYST - Examples Surface Doc Tab: Overview
 *
 * What the Examples surface is, why it exists, when to use it.
 * Audience hierarchy: stakeholder → catalyst dev → technical dev
 */

import Link from "next/link"
import {
  CopyIcon,
  LayoutDashboardIcon,
  CodeIcon,
  SparklesIcon,
  LightbulbIcon,
  FolderIcon,
  BookOpenIcon,
} from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export function OverviewTab() {
  return (
    <div className="space-y-10">
      {/* Summary */}
      <section className="space-y-4">
        <div className="border-primary bg-primary/5 rounded-lg border-l-4 p-5">
          <p className="text-lg font-medium leading-snug">
            Ready-to-copy reference implementations
          </p>
          <p className="text-muted-foreground mt-2 leading-relaxed">
            Production-quality examples that show how to build common
            application patterns. Not documentation about patterns — actual
            working implementations you can copy into your project.
          </p>
        </div>
      </section>

      {/* What You Get */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">What You Get</h2>
        <p className="text-muted-foreground">
          A library of proven patterns you can learn from and reuse:
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <FeatureCard
            icon={LayoutDashboardIcon}
            title="Full-page examples"
            description="Complete implementations, not snippets. See how all the pieces fit together."
          />
          <FeatureCard
            icon={CopyIcon}
            title="Copyable code"
            description="Every example is designed to be copied and adapted for your project."
          />
          <FeatureCard
            icon={SparklesIcon}
            title="AI-readable"
            description="Clean code that AI can understand and use as reference for your requests."
          />
          <FeatureCard
            icon={CodeIcon}
            title="Best practices"
            description="Examples follow Catalyst conventions — learn patterns as you build."
          />
        </div>
      </section>

      {/* When to Use It */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">When to Use It</h2>
        <p className="text-muted-foreground">
          Use this surface when you need to see how something is built:
        </p>

        <div className="bg-card rounded-xl border p-6">
          <ul className="space-y-3">
            <UseCaseItem
              title="Dashboard layouts"
              example="Stats, charts, tables, activity feeds"
            />
            <UseCaseItem
              title="Data management"
              example="CRM, inventory, user lists"
            />
            <UseCaseItem
              title="Communication views"
              example="Inbox, chat, notifications"
            />
            <UseCaseItem
              title="Workflow tools"
              example="Kanban boards, task lists, pipelines"
            />
            <UseCaseItem
              title="Analytics pages"
              example="Charts, reports, data visualization"
            />
          </ul>
        </div>

        {/* Not sure? callout */}
        <div className="bg-muted/50 flex gap-3 rounded-lg p-4">
          <LightbulbIcon className="text-primary mt-0.5 h-5 w-5 shrink-0" />
          <div className="space-y-1">
            <p className="text-sm font-medium">How to use examples</p>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Browse examples to find patterns you need. Copy the relevant
              parts to your App surface. Point AI at examples when asking it
              to build similar features.
            </p>
          </div>
        </div>
      </section>

      {/* Technical Details */}
      <section className="space-y-4">
        <Accordion>
          <AccordionItem value="technical-details" className="border-none">
            <AccordionTrigger className="px-0 py-2 hover:no-underline">
              <div className="flex items-center gap-2">
                <FolderIcon className="text-muted-foreground h-5 w-5" />
                <h2 className="text-xl font-semibold">Technical Details</h2>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-0 pt-2">

          <div className="grid gap-6 sm:grid-cols-2">
            {/* Metadata */}
            <div className="bg-card rounded-xl border p-5">
              <h3 className="text-muted-foreground mb-4 text-sm font-medium uppercase tracking-wide">
                Configuration
              </h3>
              <dl className="space-y-3">
                <MetadataItem label="Folder" value="app/(examples)" />
                <MetadataItem label="URL" value="/examples/*" />
                <MetadataItem label="Layout" value="ExamplesShell" />
                <MetadataItem label="Navigation" value="examplesNavItems" />
                <MetadataItem label="Auth" value="None (public)" />
              </dl>
            </div>

            {/* Folder structure */}
            <div className="bg-card rounded-xl border p-5">
              <h3 className="text-muted-foreground mb-4 text-sm font-medium uppercase tracking-wide">
                Folder Structure
              </h3>
              <pre className="text-muted-foreground text-xs leading-relaxed">
                {`app/(examples)/
├── EXAMPLES.md     # Docs
├── examples.css    # Styles
├── layout.tsx      # Shell wrapper
├── _surface/
│   └── examples-shell.tsx
└── examples/
    ├── page.tsx    # Overview
    ├── dashboard/
    ├── crm/
    └── inbox/`}
              </pre>
            </div>
          </div>

          <p className="text-muted-foreground mt-4 text-sm">
            Delete the entire{" "}
            <code className="bg-muted rounded px-1.5 py-0.5 text-xs">
              app/(examples)
            </code>{" "}
            folder to remove this surface when shipping to production.
          </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* Learn More */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <BookOpenIcon className="text-muted-foreground h-5 w-5" />
          <h2 className="text-lg font-medium">Learn More</h2>
        </div>
        <div className="grid gap-2 sm:grid-cols-3">
          <ReadingLink
            href="/examples"
            title="View Examples"
            description="Browse all examples"
          />
          <ReadingLink
            href="/docs/surfaces/app"
            title="App Surface"
            description="Where examples go"
          />
          <ReadingLink
            href="/docs/components"
            title="Components"
            description="Building blocks used"
          />
        </div>
      </section>
    </div>
  )
}

// -----------------------------------------------------------------------------
// Helper Components
// -----------------------------------------------------------------------------

function MetadataItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 text-sm">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-mono text-xs">{value}</dd>
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

function ReadingLink({
  href,
  title,
  description,
}: {
  href: string
  title: string
  description: string
}) {
  return (
    <Link
      href={href}
      className="bg-muted/50 hover:bg-muted group flex flex-col rounded-lg p-3 transition-colors"
    >
      <span className="text-primary text-sm font-medium">{title}</span>
      <span className="text-muted-foreground text-xs">{description}</span>
    </Link>
  )
}
