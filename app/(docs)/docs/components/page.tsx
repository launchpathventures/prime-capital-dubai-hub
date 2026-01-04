/**
 * CATALYST - Components Overview
 *
 * Documents the component architecture and decision flow.
 * Entry point for the components documentation section.
 */

import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export default function ComponentsOverviewPage() {
  return (
    <article className="space-y-12">
      {/* Page header */}
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Components</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          A structured component library designed for AI-assisted development.
        </p>
      </header>

      {/* Architecture overview */}
      <section className="bg-muted space-y-3 rounded-lg p-4">
        <h2 className="font-medium">How It Works</h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Components are organised into four folders by purpose. This makes it
          clear where to find components and where to add new ones. AI agents
          can quickly locate the right component for any task.
        </p>
      </section>

      {/* Component categories */}
      <section className="space-y-6">
        <h2 className="text-xl font-medium">Component Types</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <ComponentTypeCard
            name="UI (Shadcn)"
            href="/docs/components/ui"
            folder="components/ui/"
            count={34}
            description="Primitive components from shadcn/ui. Easy to upgrade, minimal customisation."
            examples="Button, Input, Dialog, Card, Table"
          />
          <ComponentTypeCard
            name="Shared"
            href="/docs/components/shared"
            folder="components/shared/"
            count={2}
            description="Project-specific components composed from primitives. Reusable across pages."
            examples="LabelValue, StatCard"
          />
          <ComponentTypeCard
            name="Primitives"
            href="/docs/components/primitives"
            folder="components/primitives/"
            count={10}
            description="Building blocks for layout, typography, and visual elements."
            examples="Stack, Row, Text, Title, Dot, Avatar, Count"
          />
          <ComponentTypeCard
            name="Vendor"
            href="/docs/components/vendor"
            folder="components/vendor/"
            count={0}
            description="External packages wrapped and styled to match the design system."
            examples="Calendar, DataTable, RichTextEditor"
          />
          <ComponentTypeCard
            name="Layout"
            href="/docs/components/layout"
            folder="components/layout/"
            count={5}
            description="Layout components for page structure. Shell, Sidebar, Header, and page-level patterns."
            examples="Shell, Sidebar, Header, Logo"
          />
        </div>
      </section>

      {/* Decision flow */}
      <section className="space-y-6">
        <h2 className="text-xl font-medium">Where to Put Components</h2>

        <div className="border-border rounded-lg border p-6">
          <ol className="text-muted-foreground space-y-4 text-sm">
            <li className="flex gap-3">
              <span className="bg-primary text-primary-foreground flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium">
                1
              </span>
              <div>
                <strong className="text-foreground">Need a UI primitive?</strong>
                <p className="mt-1">
                  Check{" "}
                  <code className="bg-muted rounded px-1">components/ui/</code>{" "}
                  first. If missing, install from shadcn:{" "}
                  <code className="bg-muted rounded px-1">
                    npx shadcn@latest add [component]
                  </code>
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="bg-primary text-primary-foreground flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium">
                2
              </span>
              <div>
                <strong className="text-foreground">
                  Need an external package?
                </strong>
                <p className="mt-1">
                  Wrap it in{" "}
                  <code className="bg-muted rounded px-1">
                    components/vendor/
                  </code>{" "}
                  and style to match the design system.
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="bg-primary text-primary-foreground flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium">
                3
              </span>
              <div>
                <strong className="text-foreground">
                  Building a reusable project component?
                </strong>
                <p className="mt-1">
                  Create in{" "}
                  <code className="bg-muted rounded px-1">
                    components/shared/
                  </code>
                  . Compose from UI primitives.
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="bg-primary text-primary-foreground flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium">
                4
              </span>
              <div>
                <strong className="text-foreground">
                  One-off component for a single page?
                </strong>
                <p className="mt-1">
                  Inline it in the page file. Keep it simple (&lt;50 lines).
                </p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      {/* Component headers */}
      <section className="space-y-4">
        <h2 className="text-xl font-medium">Component Headers</h2>
        <p className="text-muted-foreground text-sm">
          Every component has a metadata header for upgrade tracking:
        </p>
        <pre className="bg-muted overflow-x-auto rounded-lg p-4 text-sm">
          {`/**
 * CATALYST - Button Component
 *
 * @source shadcn/ui + @base-ui/react
 * @customised No — stock component
 */`}
        </pre>
        <div className="text-muted-foreground grid gap-4 text-sm md:grid-cols-2">
          <div className="border-border rounded-lg border p-3">
            <Badge variant="secondary" className="mb-2">
              @customised No
            </Badge>
            <p>Safe to overwrite with new version from shadcn.</p>
          </div>
          <div className="border-border rounded-lg border p-3">
            <Badge className="mb-2">@customised Yes</Badge>
            <p>Review changes before upgrading. Preserve customisations.</p>
          </div>
        </div>
      </section>

      {/* AI reference */}
      <section className="space-y-4">
        <h2 className="text-xl font-medium">AI Reference</h2>
        <p className="text-muted-foreground text-sm">
          For a machine-readable component list, see{" "}
          <code className="bg-muted rounded px-1">components/COMPONENTS.md</code>.
          This file is optimised for AI agents to quickly understand available
          components.
        </p>
      </section>
    </article>
  )
}

/**
 * Card for each component type/category.
 */
function ComponentTypeCard({
  name,
  href,
  folder,
  count,
  description,
  examples,
}: {
  name: string
  href: string
  folder: string
  count: number
  description: string
  examples: string
}) {
  return (
    <Link
      href={href}
      className="border-border hover:border-primary/50 hover:bg-muted block rounded-lg border p-4 transition-colors"
    >
      <div className="flex items-start justify-between">
        <h3 className="font-medium">{name}</h3>
        <Badge variant="secondary">{count}</Badge>
      </div>
      <code className="text-muted-foreground mt-1 block text-xs">{folder}</code>
      <p className="text-muted-foreground mt-3 text-sm">{description}</p>
      <p className="mt-2 text-xs">
        <span className="text-muted-foreground">Examples: </span>
        {examples}
      </p>
    </Link>
  )
}
