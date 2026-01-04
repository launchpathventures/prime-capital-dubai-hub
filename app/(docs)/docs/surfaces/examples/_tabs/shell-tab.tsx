/**
 * CATALYST - Examples Surface Doc Tab: Layout
 *
 * How the examples layout works — sidebar, content, navigation.
 * Written for catalyst devs (AI-first), technical details collapsible.
 */

import {
  CheckCircle2Icon,
  SparklesIcon,
  PanelLeftIcon,
  LayoutIcon,
  PaletteIcon,
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
            The Examples surface uses the same sidebar + content layout as the
            App surface for consistency. This means examples look exactly like
            production pages would.
          </p>
        </div>
      </section>

      {/* Visual Overview */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Layout structure</h2>
        <p className="text-muted-foreground">
          Every example page shares this layout:
        </p>

        <div className="bg-muted/30 overflow-hidden rounded-lg border">
          <div className="grid grid-cols-[180px_1fr] gap-px bg-border">
            <div className="bg-card flex flex-col p-3">
              <div className="text-muted-foreground mb-2 text-xs font-medium uppercase">
                Sidebar
              </div>
              <div className="text-muted-foreground mb-3 text-xs">
                Example list
              </div>
              <div className="space-y-2">
                <div className="bg-muted h-3 w-20 rounded" />
                <div className="bg-primary/20 h-3 w-24 rounded" />
                <div className="bg-muted h-3 w-16 rounded" />
                <div className="bg-muted h-3 w-20 rounded" />
              </div>
            </div>
            <div className="bg-card flex min-h-40 flex-col p-4">
              <div className="text-muted-foreground mb-2 text-xs font-medium uppercase">
                Example Content
              </div>
              <div className="flex flex-1 items-center justify-center">
                <span className="text-muted-foreground text-sm">
                  Full example implementation renders here
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border p-4">
          <ul className="space-y-2 text-sm">
            <li className="flex gap-2">
              <CheckCircle2Icon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
              <span>Same layout as App surface — examples look like real pages</span>
            </li>
            <li className="flex gap-2">
              <CheckCircle2Icon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
              <span>Sidebar shows all available examples</span>
            </li>
            <li className="flex gap-2">
              <CheckCircle2Icon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
              <span>Collapses to mobile menu on small screens</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Customize Sidebar */}
      <section className="space-y-4">
        <TaskCard
          icon={PanelLeftIcon}
          title="Customize the sidebar"
          ask="Reorder the examples in the sidebar"
          description="The sidebar navigation is defined in lib/navigation.ts. Items appear in the order defined."
          details={[
            "Examples use a flat list (not groups)",
            "Each item has a label, href, and optional icon",
            "Put most important examples first",
          ]}
          files={[{ path: "lib/navigation.ts", note: "Navigation data" }]}
          example={`// lib/navigation.ts

export const examplesNavItems: NavItem[] = [
  // Reorder as needed — most useful first
  { label: "Overview", href: "/examples", icon: GripIcon },
  { label: "Dashboard", href: "/examples/dashboard", icon: LayoutDashboardIcon },
  { label: "Analytics", href: "/examples/analytics", icon: BarChart3Icon },
  { label: "CRM", href: "/examples/crm", icon: UsersIcon },
  // ...
]`}
        />
      </section>

      {/* Full-Width Content */}
      <section className="space-y-4">
        <TaskCard
          icon={LayoutIcon}
          title="Content layout"
          ask="Make the example content area fill the available width"
          description="Example content has access to the full area minus the sidebar. Use this space like you would in the App surface."
          details={[
            "No max-width constraint by default",
            "Use same layout patterns as App surface",
            "Content scrolls independently of sidebar",
          ]}
          files={[]}
          example={`// Full-width content
<Stack gap="lg">
  {/* Header spans full width */}
  <Row className="items-end justify-between">
    <Title>Analytics Dashboard</Title>
    <Button>Export</Button>
  </Row>

  {/* Grid fills available space */}
  <div className="grid gap-4 md:grid-cols-4">
    <StatCard label="Views" value="124,521" />
    <StatCard label="Visitors" value="45,281" />
    <StatCard label="Bounce" value="32.1%" />
    <StatCard label="Duration" value="2:34" />
  </div>

  {/* Charts and tables */}
  <div className="grid gap-4 lg:grid-cols-2">
    <Card>{/* Chart */}</Card>
    <Card>{/* Table */}</Card>
  </div>
</Stack>`}
        />
      </section>

      {/* Custom Styles */}
      <section className="space-y-4">
        <TaskCard
          icon={PaletteIcon}
          title="Add custom styles"
          ask="Add custom styling to the examples surface"
          description="Each surface has its own CSS file. Add styles there to customize the appearance."
          details={[
            "Surface CSS is imported by the layout automatically",
            "Use CSS variables for consistency",
            "Styles only apply to this surface",
          ]}
          files={[{ path: "app/(examples)/examples.css", note: "Examples surface styles" }]}
          example={`/* app/(examples)/examples.css */

/* Custom sidebar style for examples */
.examples-shell [data-slot="sidebar"] {
  background: var(--color-background);
}

/* Highlight active example */
.examples-shell [data-slot="nav-item"][data-active="true"] {
  background: oklch(from var(--color-primary) l c h / 0.1);
  color: var(--color-primary);
}`}
        />
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
                  app/(examples)/_surface/examples-shell.tsx
                </code>
              </li>
              <li>
                <code className="bg-muted rounded px-1 text-xs">
                  app/(examples)/layout.tsx
                </code>
              </li>
              <li>
                <code className="bg-muted rounded px-1 text-xs">
                  app/(examples)/examples.css
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
              <li>&ldquo;Add an example to the sidebar&rdquo;</li>
              <li>&ldquo;Reorder the examples list&rdquo;</li>
              <li>&ldquo;Change the sidebar style&rdquo;</li>
              <li>&ldquo;Add categories to examples&rdquo;</li>
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
