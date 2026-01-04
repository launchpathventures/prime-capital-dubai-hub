/**
 * CATALYST - Examples Surface Doc Tab: Develop
 *
 * How to build in the Examples surface — written for catalyst devs (AI-first).
 * Audience: stakeholder → catalyst dev → technical dev
 */

import {
  CheckCircle2Icon,
  SparklesIcon,
  FileCodeIcon,
  NavigationIcon,
  LayoutIcon,
  DatabaseIcon,
  CopyIcon,
} from "lucide-react"
import { Text, Row } from "@/components/core"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export function DevelopTab() {
  return (
    <div className="space-y-10">
      {/* Summary */}
      <section className="space-y-4">
        <div className="border-primary bg-primary/5 space-y-3 rounded-lg border-l-4 p-5">
          <p className="text-lg font-medium leading-snug">
            Building in the Examples surface
          </p>
          <p className="text-muted-foreground leading-relaxed">
            This guide shows you how to add example pages that demonstrate
            patterns for developers and AI to reference. Each section starts
            with what to ask AI, then shows the technical details.
          </p>
        </div>
      </section>

      {/* How to Work with AI */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Working with AI</h2>
        <p className="text-muted-foreground">
          Catalyst is AI-first. When you need an example, describe the pattern
          you want to demonstrate. AI will create a production-quality
          implementation.
        </p>

        <div className="bg-card space-y-4 rounded-lg border p-5">
          <Row gap="sm" className="items-center">
            <SparklesIcon className="text-primary h-5 w-5" />
            <Text weight="medium">Example prompts</Text>
          </Row>
          <ul className="space-y-3">
            <li className="flex gap-3">
              <span className="text-primary shrink-0">→</span>
              <span className="text-sm">
                &ldquo;Create an example dashboard with stats cards, a chart,
                and a recent activity table&rdquo;
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary shrink-0">→</span>
              <span className="text-sm">
                &ldquo;Add a CRM example with a contacts list and deal
                pipeline view&rdquo;
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary shrink-0">→</span>
              <span className="text-sm">
                &ldquo;Create an inbox example with folder navigation and
                message list&rdquo;
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary shrink-0">→</span>
              <span className="text-sm">
                &ldquo;Build a kanban board example with drag-and-drop
                columns&rdquo;
              </span>
            </li>
          </ul>
          <p className="text-muted-foreground border-t pt-3 text-xs">
            AI reads the project docs (AGENTS.md, EXAMPLES.md) and knows the
            conventions. You focus on <em>what pattern</em> to demonstrate, AI
            handles the implementation.
          </p>
        </div>
      </section>

      {/* Add an Example */}
      <section className="space-y-4">
        <TaskCard
          icon={FileCodeIcon}
          title="Add an example"
          ask="Add a new [Analytics] example to the examples surface"
          description="Examples live under app/(examples)/examples/. Create a folder with the example name, then add page.tsx inside."
          details={[
            "Examples automatically get the sidebar navigation",
            "The URL will be /examples/[name]",
            "Use production-quality code — this is a reference",
          ]}
          files={[
            { path: "app/(examples)/examples/analytics/page.tsx", note: "Your new example" },
          ]}
          example={`// app/(examples)/examples/analytics/page.tsx

/**
 * CATALYST - Analytics Example
 */

import { Title, Text, Stack, Row } from "@/components/core"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatCard } from "@/components/shared"

// Mock data — realistic values
const stats = [
  { label: "Page Views", value: "124,521", trend: "up", trendText: "+12%" },
  { label: "Unique Visitors", value: "45,281", trend: "up", trendText: "+8%" },
  { label: "Bounce Rate", value: "32.1%", trend: "down", trendText: "-2%" },
]

export default function AnalyticsExample() {
  return (
    <Stack gap="lg">
      <div>
        <Title>Analytics</Title>
        <Text variant="muted">Track your website performance</Text>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map(stat => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>
      
      {/* Add charts, tables, etc. */}
    </Stack>
  )
}`}
        />
      </section>

      {/* Add to Navigation */}
      <section className="space-y-4">
        <TaskCard
          icon={NavigationIcon}
          title="Add to navigation"
          ask="Add [Analytics] to the examples sidebar"
          description="Sidebar navigation is defined in lib/navigation.ts. Add an item to examplesNavItems."
          details={[
            "Examples use a flat list (not groups)",
            "Add an icon for visual identification",
            "Keep examples in logical order",
          ]}
          files={[{ path: "lib/navigation.ts", note: "Navigation configuration" }]}
          example={`// lib/navigation.ts

export const examplesNavItems: NavItem[] = [
  { label: "Overview", href: "/examples", icon: GripIcon },
  { label: "Dashboard", href: "/examples/dashboard", icon: LayoutDashboardIcon },
  { label: "Analytics", href: "/examples/analytics", icon: BarChart3Icon },  // ← Add
  { label: "CRM", href: "/examples/crm", icon: UsersIcon },
  // ...
]`}
        />
      </section>

      {/* Mock Data */}
      <section className="space-y-4">
        <TaskCard
          icon={DatabaseIcon}
          title="Add realistic mock data"
          ask="Create mock data for the CRM example with realistic contacts"
          description="Examples need realistic data to be useful references. Create mock data at the top of your page or in a separate file."
          details={[
            "Use realistic names, emails, values",
            "Include variety (different statuses, amounts)",
            "Keep data in the same file for easy copying",
          ]}
          files={[]}
          example={`// Mock data at top of page
const contacts = [
  { 
    id: 1, 
    name: "Sarah Chen", 
    email: "sarah@acme.com", 
    company: "Acme Inc",
    status: "active",
    deals: 3,
    value: 45000,
  },
  { 
    id: 2, 
    name: "Marcus Johnson", 
    email: "marcus@globex.com", 
    company: "Globex Corp",
    status: "active",
    deals: 1,
    value: 12500,
  },
  // More realistic data...
]

const deals = [
  { id: 1, title: "Enterprise License", value: 25000, stage: "negotiation" },
  { id: 2, title: "Annual Support", value: 8500, stage: "closed-won" },
  // ...
]`}
        />
      </section>

      {/* Example Structure */}
      <section className="space-y-4">
        <TaskCard
          icon={LayoutIcon}
          title="Example page structure"
          ask="Create a well-structured example with header, content sections, and interactions"
          description="Examples should follow consistent patterns so they're easy to understand and copy."
          details={[
            "Start with title and description",
            "Use the same layout patterns as App surface",
            "Include interactive elements (filters, actions)",
            "Show different states (empty, loading, error)",
          ]}
          files={[]}
          example={`// Standard example structure
export default function ExamplePage() {
  return (
    <Stack gap="lg">
      {/* Header with title and actions */}
      <Row className="items-end justify-between">
        <Stack gap="xs">
          <Title>Example Name</Title>
          <Text variant="muted">Description of what this shows</Text>
        </Stack>
        <Button>
          <PlusIcon className="h-4 w-4" />
          Add New
        </Button>
      </Row>

      {/* Filters/controls */}
      <Row gap="sm">
        <Input placeholder="Search..." startIcon={<SearchIcon />} />
        <Select>{/* Filter options */}</Select>
      </Row>

      {/* Main content */}
      <Card>
        <CardHeader>
          <CardTitle>Data Table</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>{/* Table content */}</Table>
        </CardContent>
      </Card>
    </Stack>
  )
}`}
        />
      </section>

      {/* Making Examples Copyable */}
      <section className="space-y-4">
        <TaskCard
          icon={CopyIcon}
          title="Make examples copyable"
          ask="Ensure the example code is easy to copy to the App surface"
          description="The whole point of examples is to be copied. Structure code so it's easy to adapt."
          details={[
            "Keep mock data separate from components",
            "Use standard patterns from the design system",
            "Avoid example-specific abstractions",
            "Comment any non-obvious patterns",
          ]}
          files={[]}
          example={`// Good: Self-contained, easy to copy
export default function SettingsExample() {
  const [notifications, setNotifications] = useState(true)
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
      </CardHeader>
      <CardContent>
        <Row className="items-center justify-between">
          <div>
            <Text weight="medium">Email notifications</Text>
            <Text size="sm" variant="muted">Get updates via email</Text>
          </div>
          <Switch 
            checked={notifications} 
            onCheckedChange={setNotifications} 
          />
        </Row>
      </CardContent>
    </Card>
  )
}

// Avoid: Custom hooks or complex abstractions
// that would need to be copied separately`}
        />
      </section>

      {/* Quick Reference */}
      <section className="bg-card space-y-3 rounded-lg border p-5">
        <h3 className="font-medium">Quick reference</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Text size="sm" weight="medium" className="mb-2">
              Key locations
            </Text>
            <ul className="text-muted-foreground space-y-1 text-sm">
              <li>
                <code className="bg-muted rounded px-1 text-xs">
                  app/(examples)/examples/
                </code>{" "}
                — Your examples
              </li>
              <li>
                <code className="bg-muted rounded px-1 text-xs">
                  lib/navigation.ts
                </code>{" "}
                — Sidebar links
              </li>
              <li>
                <code className="bg-muted rounded px-1 text-xs">
                  /examples
                </code>{" "}
                — Overview page
              </li>
            </ul>
          </div>
          <div>
            <Text size="sm" weight="medium" className="mb-2">
              Common asks
            </Text>
            <ul className="text-muted-foreground space-y-1 text-sm">
              <li>&ldquo;Create an example showing...&rdquo;</li>
              <li>&ldquo;Add a [pattern] example...&rdquo;</li>
              <li>&ldquo;Build a reference for...&rdquo;</li>
              <li>&ldquo;Show how to implement...&rdquo;</li>
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
