/**
 * CATALYST - Docs Surface Doc Tab: Layout
 *
 * How the docs layout works — sidebar, content, navigation.
 * Written for catalyst devs (AI-first), technical details collapsible.
 */

import Link from "next/link"
import {
  CheckCircle2Icon,
  SparklesIcon,
  PanelLeftIcon,
  LayoutIcon,
  PaletteIcon,
  LockIcon,
} from "lucide-react"
import { Text, Row } from "@/components/core"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export function LayoutTab() {
  return (
    <div className="space-y-10">
      {/* Summary */}
      <section className="space-y-4">
        <div className="border-primary bg-primary/5 space-y-3 rounded-lg border-l-4 p-5">
          <p className="text-lg font-medium leading-snug">
            Understanding the layout
          </p>
          <p className="text-muted-foreground leading-relaxed">
            The Docs surface uses a sidebar + content layout optimized for
            reading. The sidebar shows navigation groups, and content scrolls
            independently for easy reference.
          </p>
        </div>
      </section>

      {/* Visual Overview */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Layout structure</h2>
        <p className="text-muted-foreground">
          Every page in the Docs surface shares this layout:
        </p>

        <div className="bg-muted/30 overflow-hidden rounded-lg border">
          <div className="grid grid-cols-[200px_1fr] gap-px bg-border">
            <div className="bg-card flex flex-col p-3">
              <div className="text-muted-foreground mb-2 text-xs font-medium uppercase">
                Sidebar
              </div>
              <div className="text-muted-foreground mb-3 text-xs">
                Navigation groups
              </div>
              <div className="space-y-2">
                <div className="bg-muted h-3 w-24 rounded" />
                <div className="bg-muted h-3 w-20 rounded" />
                <div className="bg-muted h-3 w-28 rounded" />
              </div>
              <div className="mt-4 space-y-2">
                <div className="bg-muted h-3 w-24 rounded" />
                <div className="bg-muted h-3 w-16 rounded" />
              </div>
            </div>
            <div className="bg-card flex min-h-40 flex-col p-4">
              <div className="text-muted-foreground mb-2 text-xs font-medium uppercase">
                Content
              </div>
              <div className="flex flex-1 items-center justify-center">
                <span className="text-muted-foreground text-sm">
                  Documentation content — scrolls independently
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border p-4">
          <ul className="space-y-2 text-sm">
            <li className="flex gap-2">
              <CheckCircle2Icon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
              <span>Sidebar collapses on mobile into a slide-out sheet</span>
            </li>
            <li className="flex gap-2">
              <CheckCircle2Icon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
              <span>Content area uses prose styling for readability</span>
            </li>
            <li className="flex gap-2">
              <CheckCircle2Icon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
              <span>Optional password protection for private docs</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Customize Sidebar */}
      <section className="space-y-4">
        <TaskCard
          icon={PanelLeftIcon}
          title="Customize the sidebar"
          ask="Add a new navigation group called [Tutorials] with links"
          description="The sidebar navigation is defined in lib/navigation.ts. Add groups and items there — the sidebar renders automatically."
          details={[
            "Groups have a label, icon, and list of items",
            "Each item needs a label and href",
            "Groups appear in the order defined",
          ]}
          files={[{ path: "lib/navigation.ts", note: "Navigation data" }]}
          example={`// lib/navigation.ts

export const docsNavItems: NavGroup[] = [
  {
    label: "Documentation",
    icon: BookOpenIcon,
    items: [
      { label: "Introduction", href: "/docs" },
    ],
  },
  {
    label: "Tutorials",  // ← New group
    icon: GraduationCapIcon,
    items: [
      { label: "Quick Start", href: "/docs/tutorials/quick-start" },
      { label: "Building a Dashboard", href: "/docs/tutorials/dashboard" },
    ],
  },
]`}
        />
      </section>

      {/* Content Width */}
      <section className="space-y-4">
        <TaskCard
          icon={LayoutIcon}
          title="Adjust content width"
          ask="Make the docs content area wider"
          description="Content width is set via max-width classes. Adjust in individual pages or the shell."
          details={[
            "Default max-width is max-w-3xl (768px)",
            "Can widen to max-w-4xl or max-w-5xl for reference docs",
            "Consider readability — very wide text is hard to read",
          ]}
          files={[
            { path: "app/(docs)/_surface/docs-shell.tsx", note: "Shell component" },
          ]}
          example={`// In a specific page
<article className="mx-auto max-w-4xl">
  {/* Wider content */}
</article>

// Or in the shell for all docs
<main className="mx-auto max-w-4xl px-4 py-8">
  {children}
</main>`}
        />
      </section>

      {/* Custom Styles */}
      <section className="space-y-4">
        <TaskCard
          icon={PaletteIcon}
          title="Add custom styles"
          ask="Change the prose link color in docs"
          description="Each surface has its own CSS file. Add styles there to customize the appearance."
          details={[
            "Surface CSS is imported by the layout automatically",
            "Use CSS variables for consistency",
            "Styles only apply to this surface",
          ]}
          files={[{ path: "app/(docs)/docs.css", note: "Docs surface styles" }]}
          example={`/* app/(docs)/docs.css */

/* Custom link color in prose */
.docs-shell .prose a {
  color: var(--color-primary);
}

/* Custom code block background */
.docs-shell pre {
  background: oklch(from var(--color-muted) calc(l - 0.02) c h);
}`}
        />
      </section>

      {/* Production Visibility */}
      <section className="space-y-4">
        <div className="bg-card overflow-hidden rounded-lg border">
          <div className="border-b bg-muted/30 px-5 py-3">
            <Row gap="sm" className="items-center">
              <LockIcon className="text-muted-foreground h-4 w-4" />
              <Text weight="medium">Production visibility</Text>
            </Row>
          </div>
          <div className="space-y-3 p-5">
            <p className="text-muted-foreground text-sm leading-relaxed">
              The Docs surface can be enabled or disabled in production. This is
              useful if you want docs available in development but not shipped
              publicly.
            </p>
            <ul className="space-y-1.5">
              <li className="flex gap-2 text-sm">
                <CheckCircle2Icon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                <span>
                  Set <code className="bg-muted rounded px-1 text-xs">NEXT_PUBLIC_DOCS_ENABLED=false</code> to hide docs
                </span>
              </li>
              <li className="flex gap-2 text-sm">
                <CheckCircle2Icon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                <span>In development, docs are always available</span>
              </li>
              <li className="flex gap-2 text-sm">
                <CheckCircle2Icon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                <span>In production, docs follow your chosen visibility setting</span>
              </li>
            </ul>
            <p className="border-t pt-3 text-sm">
              <Link href="/docs/develop/authentication" className="text-primary hover:underline">
                Authentication docs →
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Quick Reference */}
      <section className="bg-card space-y-3 rounded-lg border p-5">
        <h3 className="font-medium">Quick reference</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Text size="sm" weight="medium" className="mb-2">
              Key files
            </Text>
            <ul className="text-muted-foreground space-y-1 text-sm">
              <li>
                <code className="bg-muted rounded px-1 text-xs">
                  app/(docs)/_surface/docs-shell.tsx
                </code>
              </li>
              <li>
                <code className="bg-muted rounded px-1 text-xs">
                  app/(docs)/layout.tsx
                </code>
              </li>
              <li>
                <code className="bg-muted rounded px-1 text-xs">
                  app/(docs)/docs.css
                </code>
              </li>
              <li>
                <code className="bg-muted rounded px-1 text-xs">
                  lib/navigation.ts
                </code>
              </li>
            </ul>
          </div>
          <div>
            <Text size="sm" weight="medium" className="mb-2">
              Common asks
            </Text>
            <ul className="text-muted-foreground space-y-1 text-sm">
              <li>&ldquo;Add a navigation group for...&rdquo;</li>
              <li>&ldquo;Change the sidebar style...&rdquo;</li>
              <li>&ldquo;Make the content area wider&rdquo;</li>
              <li>&ldquo;Add search to the docs&rdquo;</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}

// -----------------------------------------------------------------------------
// Helper Components
// -----------------------------------------------------------------------------

function TaskCard({
  icon: Icon,
  title,
  ask,
  description,
  details,
  files,
  example,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  ask: string
  description: string
  details: string[]
  files: { path: string; note: string }[]
  example: string
}) {
  return (
    <div className="bg-card overflow-hidden rounded-lg border">
      {/* Header */}
      <div className="border-b bg-muted/30 px-5 py-3">
        <Row gap="sm" className="items-center">
          <Icon className="text-muted-foreground h-4 w-4" />
          <Text weight="medium">{title}</Text>
        </Row>
      </div>

      {/* Content */}
      <div className="space-y-4 p-5">
        {/* Ask AI */}
        <div className="border-primary/20 bg-primary/5 rounded-lg border p-3">
          <Row gap="sm" className="items-start">
            <SparklesIcon className="text-primary mt-0.5 h-4 w-4 shrink-0" />
            <div>
              <Text size="xs" variant="muted" className="uppercase tracking-wide">
                Ask AI
              </Text>
              <Text size="sm" className="mt-0.5">
                &ldquo;{ask}&rdquo;
              </Text>
            </div>
          </Row>
        </div>

        {/* Description */}
        <p className="text-muted-foreground text-sm leading-relaxed">
          {description}
        </p>

        {/* Details */}
        <ul className="space-y-1.5">
          {details.map((detail, i) => (
            <li key={i} className="flex gap-2 text-sm">
              <CheckCircle2Icon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
              <span>{detail}</span>
            </li>
          ))}
        </ul>

        {/* Files */}
        {files.length > 0 && (
          <div className="border-t pt-4">
            <Text size="xs" variant="muted" className="mb-2 uppercase tracking-wide">
              Files involved
            </Text>
            <ul className="space-y-1">
              {files.map((file, i) => (
                <li key={i} className="flex gap-2 text-sm">
                  <code className="bg-muted rounded px-1.5 py-0.5 text-xs">
                    {file.path}
                  </code>
                  <span className="text-muted-foreground">— {file.note}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Code Example */}
        <div className="border-t pt-2">
          <Accordion>
            <AccordionItem value="details" className="border-none">
              <AccordionTrigger className="px-0 py-2 text-sm">
                Technical details
              </AccordionTrigger>
              <AccordionContent className="px-0">
                <div className="bg-muted/50 overflow-x-auto rounded-md p-4">
                  <pre className="text-xs leading-relaxed">{example}</pre>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  )
}
