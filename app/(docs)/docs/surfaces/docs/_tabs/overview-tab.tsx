/**
 * CATALYST - Docs Surface Doc Tab: Overview
 *
 * What the Docs surface is, why it exists, when to use it.
 * Audience hierarchy: stakeholder → catalyst dev → technical dev
 */

import Link from "next/link"
import {
  BookOpenIcon,
  SearchIcon,
  ListTreeIcon,
  FileTextIcon,
  LightbulbIcon,
  FolderIcon,
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
            Your knowledge base
          </p>
          <p className="text-muted-foreground mt-2 leading-relaxed">
            Technical documentation, guides, and reference material for
            developers. Organized with sidebar navigation and optimized for
            reading and scanning.
          </p>
        </div>
      </section>

      {/* What You Get */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">What You Get</h2>
        <p className="text-muted-foreground">
          A documentation system built for developers:
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <FeatureCard
            icon={ListTreeIcon}
            title="Organized navigation"
            description="Sidebar with grouped sections. Readers find what they need without hunting."
          />
          <FeatureCard
            icon={BookOpenIcon}
            title="Prose-optimized"
            description="Typography tuned for long-form reading. Code blocks, callouts, and lists."
          />
          <FeatureCard
            icon={SearchIcon}
            title="Searchable structure"
            description="Logical hierarchy helps both humans and search engines find content."
          />
          <FeatureCard
            icon={FileTextIcon}
            title="Self-documenting"
            description="Documentation about your documentation. Meta, but useful."
          />
        </div>
      </section>

      {/* When to Use It */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">When to Use It</h2>
        <p className="text-muted-foreground">
          Use this surface when you need to document something for developers:
        </p>

        <div className="bg-card rounded-xl border p-6">
          <ul className="space-y-3">
            <UseCaseItem
              title="API documentation"
              example="Endpoints, parameters, responses, examples"
            />
            <UseCaseItem
              title="Setup guides"
              example="Installation, configuration, deployment"
            />
            <UseCaseItem
              title="Architecture docs"
              example="System design, data flow, decisions"
            />
            <UseCaseItem
              title="Component reference"
              example="Props, usage patterns, examples"
            />
            <UseCaseItem
              title="Process documentation"
              example="Workflows, standards, checklists"
            />
          </ul>
        </div>

        {/* Not sure? callout */}
        <div className="bg-muted/50 flex gap-3 rounded-lg p-4">
          <LightbulbIcon className="text-primary mt-0.5 h-5 w-5 shrink-0" />
          <div className="space-y-1">
            <p className="text-sm font-medium">Not sure if you need this?</p>
            <p className="text-muted-foreground text-sm leading-relaxed">
              If it&apos;s technical reference that developers will come back to,
              put it here. If it&apos;s a tutorial meant to sell, that belongs in
              the Web surface.
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
                <MetadataItem label="Folder" value="app/(docs)" />
                <MetadataItem label="URL" value="/docs/*" />
                <MetadataItem label="Layout" value="DocsShell" />
                <MetadataItem label="Navigation" value="docsNavItems" />
                <MetadataItem label="Auth" value="Optional password" />
              </dl>
            </div>

            {/* Folder structure */}
            <div className="bg-card rounded-xl border p-5">
              <h3 className="text-muted-foreground mb-4 text-sm font-medium uppercase tracking-wide">
                Folder Structure
              </h3>
              <pre className="text-muted-foreground text-xs leading-relaxed">
                {`app/(docs)/
├── DOCS.md          # Docs
├── docs.css         # Styles
├── layout.tsx       # Shell wrapper
├── _surface/
│   └── docs-shell.tsx
└── docs/
    ├── page.tsx     # /docs index
    ├── core/        # Core docs
    ├── design/      # Design docs
    └── surfaces/    # This!`}
              </pre>
            </div>
          </div>

          <p className="text-muted-foreground mt-4 text-sm">
            Delete the entire{" "}
            <code className="bg-muted rounded px-1.5 py-0.5 text-xs">
              app/(docs)
            </code>{" "}
            folder to remove this surface. Everything is self-contained.
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
            href="/docs/surfaces"
            title="Surfaces"
            description="How surfaces work"
          />
          <ReadingLink
            href="/docs/components/layout"
            title="Layout"
            description="Shell & sidebar components"
          />
          <ReadingLink
            href="/docs/design/typography"
            title="Typography"
            description="Prose & text styles"
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
