/**
 * CATALYST - App Surface Doc Tab: Develop
 *
 * How to build in the App surface — written for catalyst devs (AI-first).
 * Audience: stakeholder → catalyst dev → technical dev
 */

import { CheckCircle2Icon, SparklesIcon, FileCodeIcon, NavigationIcon, LayoutIcon, LoaderIcon, PaletteIcon } from "lucide-react"
import { Text, Row, Stack } from "@/components/core"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export function DevelopTab() {
  return (
    <div className="space-y-10">
      {/* ------------------------------------------------------------------ */}
      {/* Summary — What is this tab about */}
      {/* ------------------------------------------------------------------ */}
      <section className="space-y-4">
        <div className="border-primary bg-primary/5 rounded-lg border-l-4 p-5 space-y-3">
          <p className="text-lg font-medium leading-snug">
            Building in the App surface
          </p>
          <p className="text-muted-foreground leading-relaxed">
            This guide shows you how to add pages, update navigation, and build
            common features. Each section starts with what to ask AI, then shows
            the technical details for reference.
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* How to Work with AI */}
      {/* ------------------------------------------------------------------ */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Working with AI</h2>
        <p className="text-muted-foreground">
          Catalyst is AI-first. When you need something, describe what you want
          in plain language. The AI will handle the technical implementation.
        </p>

        <div className="bg-card rounded-lg border p-5 space-y-4">
          <Row gap="sm" className="items-center">
            <SparklesIcon className="h-5 w-5 text-primary" />
            <Text weight="medium">Example prompts</Text>
          </Row>
          <ul className="space-y-3">
            <li className="flex gap-3">
              <span className="text-primary shrink-0">→</span>
              <span className="text-sm">"Add a new Reports page to the app with a table showing monthly data"</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary shrink-0">→</span>
              <span className="text-sm">"Add a link to Reports in the sidebar navigation under Overview"</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary shrink-0">→</span>
              <span className="text-sm">"Create a settings page with notification preferences using switches"</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary shrink-0">→</span>
              <span className="text-sm">"Show a loading skeleton while the dashboard data is fetching"</span>
            </li>
          </ul>
          <p className="text-xs text-muted-foreground border-t pt-3">
            AI reads the project docs (AGENTS.md, APP.md) and knows the conventions.
            You focus on <em>what</em> you want, AI handles <em>how</em>.
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Add a Page */}
      {/* ------------------------------------------------------------------ */}
      <section className="space-y-4">
        <TaskCard
          icon={FileCodeIcon}
          title="Add a page"
          ask="Add a new [Reports] page to the app surface"
          description="Pages live under app/(app)/app/. Create a folder with the page name, then add page.tsx inside."
          details={[
            "Pages automatically get the sidebar and header",
            "The URL will be /app/[page-name]",
            "Use the core components (Stack, Row, Text, Title) for layout",
          ]}
          files={[
            { path: "app/(app)/app/reports/page.tsx", note: "Your new page" },
          ]}
          example={`// app/(app)/app/reports/page.tsx

/**
 * CATALYST - Reports Page
 */

import { Title, Text, Stack } from "@/components/core"

export default function ReportsPage() {
  return (
    <Stack gap="lg">
      <div>
        <Title>Reports</Title>
        <Text variant="muted">View your monthly reports</Text>
      </div>
      {/* Your content here */}
    </Stack>
  )
}`}
        />
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Add to Navigation */}
      {/* ------------------------------------------------------------------ */}
      <section className="space-y-4">
        <TaskCard
          icon={NavigationIcon}
          title="Add to navigation"
          ask="Add a link to [Reports] in the sidebar under [Overview]"
          description="Navigation is defined in lib/navigation.ts as data — not JSX. Add an item to the appropriate group."
          details={[
            "Navigation groups: Overview, Learn, Manage (or create your own)",
            "The sidebar renders automatically from this data",
            "Icons are optional but recommended for visual clarity",
          ]}
          files={[
            { path: "lib/navigation.ts", note: "Navigation configuration" },
          ]}
          example={`// lib/navigation.ts

export const appNavItems: NavGroup[] = [
  {
    label: "Overview",
    icon: LayoutDashboardIcon,
    items: [
      { label: "Dashboard", href: "/app/dashboard" },
      { label: "Reports", href: "/app/reports" },  // ← Add here
    ],
  },
  // ... other groups
]`}
        />
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Page Layouts */}
      {/* ------------------------------------------------------------------ */}
      <section className="space-y-4">
        <TaskCard
          icon={LayoutIcon}
          title="Page layouts"
          ask="Add a header with title, description, and an action button"
          description="Most app pages follow similar patterns: header with actions, then content sections."
          details={[
            "Use Row with justify-between for header + actions",
            "Use Card components to group related content",
            "Use Grid for multi-column layouts",
          ]}
          files={[]}
          example={`// Common page header pattern
<Row className="items-end justify-between">
  <Stack gap="xs">
    <Title>Reports</Title>
    <Text variant="muted">View and export your data</Text>
  </Stack>
  <Button>
    <DownloadIcon className="h-4 w-4" />
    Export
  </Button>
</Row>

// Content in cards
<Card>
  <CardHeader>
    <CardTitle>Monthly Summary</CardTitle>
  </CardHeader>
  <CardContent>
    {/* Your content */}
  </CardContent>
</Card>`}
        />
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Loading States */}
      {/* ------------------------------------------------------------------ */}
      <section className="space-y-4">
        <TaskCard
          icon={LoaderIcon}
          title="Loading states"
          ask="Show a loading skeleton while the page data is fetching"
          description="Add a loading.tsx file next to your page. Next.js automatically shows it while the page loads."
          details={[
            "Use Skeleton components to match your content shape",
            "Keep loading states simple — users just need to know something is happening",
            "Loading files are optional but improve perceived performance",
          ]}
          files={[
            { path: "app/(app)/app/reports/loading.tsx", note: "Loading state" },
          ]}
          example={`// app/(app)/app/reports/loading.tsx

import { Skeleton } from "@/components/ui/skeleton"
import { Stack } from "@/components/core"

export default function Loading() {
  return (
    <Stack gap="lg">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-64 w-full" />
    </Stack>
  )
}`}
        />
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Using Components */}
      {/* ------------------------------------------------------------------ */}
      <section className="space-y-4">
        <TaskCard
          icon={PaletteIcon}
          title="Using components"
          ask="Add a table showing recent orders with status badges"
          description="Catalyst includes a full component library. Check what's available before asking AI to build from scratch."
          details={[
            "Core: Stack, Row, Grid, Text, Title, Avatar, Card",
            "UI: Button, Badge, Table, Tabs, Input, Select, Switch",
            "Shared: StatCard, UserMenu, ThemeToggle",
          ]}
          files={[
            { path: "components/COMPONENTS.md", note: "Component guide" },
            { path: "components/core/", note: "Layout primitives" },
            { path: "components/ui/", note: "UI components" },
          ]}
          example={`// Example: Table with badges
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Order</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Amount</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>ORD-7891</TableCell>
      <TableCell>
        <Badge variant="default">Completed</Badge>
      </TableCell>
      <TableCell>$234.00</TableCell>
    </TableRow>
  </TableBody>
</Table>`}
        />
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Quick Reference */}
      {/* ------------------------------------------------------------------ */}
      <section className="bg-card space-y-3 rounded-lg border p-5">
        <h3 className="font-medium">Quick reference</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Text size="sm" weight="medium" className="mb-2">Key locations</Text>
            <ul className="text-muted-foreground space-y-1 text-sm">
              <li><code className="bg-muted rounded px-1 text-xs">app/(app)/app/</code> — Your pages</li>
              <li><code className="bg-muted rounded px-1 text-xs">lib/navigation.ts</code> — Sidebar links</li>
              <li><code className="bg-muted rounded px-1 text-xs">components/</code> — Reusable components</li>
            </ul>
          </div>
          <div>
            <Text size="sm" weight="medium" className="mb-2">Common asks</Text>
            <ul className="text-muted-foreground space-y-1 text-sm">
              <li>"Add a page for..."</li>
              <li>"Show a table of..."</li>
              <li>"Create a form to..."</li>
              <li>"Add tabs to switch between..."</li>
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
    <div className="bg-card rounded-lg border overflow-hidden">
      {/* Header */}
      <div className="border-b bg-muted/30 px-5 py-3">
        <Row gap="sm" className="items-center">
          <Icon className="h-4 w-4 text-muted-foreground" />
          <Text weight="medium">{title}</Text>
        </Row>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Ask AI */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
          <Row gap="sm" className="items-start">
            <SparklesIcon className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <div>
              <Text size="xs" variant="muted" className="uppercase tracking-wide">Ask AI</Text>
              <Text size="sm" className="mt-0.5">"{ask}"</Text>
            </div>
          </Row>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>

        {/* Details */}
        <ul className="space-y-1.5">
          {details.map((detail, i) => (
            <li key={i} className="flex gap-2 text-sm">
              <CheckCircle2Icon className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>{detail}</span>
            </li>
          ))}
        </ul>

        {/* Files */}
        {files.length > 0 && (
          <div className="border-t pt-4">
            <Text size="xs" variant="muted" className="uppercase tracking-wide mb-2">Files involved</Text>
            <ul className="space-y-1">
              {files.map((file, i) => (
                <li key={i} className="flex gap-2 text-sm">
                  <code className="bg-muted rounded px-1.5 py-0.5 text-xs">{file.path}</code>
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
