/**
 * CATALYST - Shared Components
 *
 * Project-specific components composed from UI primitives.
 * These are reusable across multiple pages but aren't generic enough to be primitives.
 */

"use client"

import { ReactNode } from "react"
import { Card } from "@/components/ui/card"
import { DollarSignIcon, UsersIcon, ActivityIcon } from "lucide-react"
import { LabelValue, StatCard, ThemeToggle } from "@/components/shared"
import { Stack, Row, Grid } from "@/components/core"
import { DocsAccordionPage } from "../../../_surface/docs-accordion-page"

// =============================================================================
// COMPONENT DATA
// =============================================================================

type ComponentInfo = {
  name: string
  slug: string
  description: string
  importStatement: string
  props: { name: string; type: string; default: string; description: string }[]
  example?: React.ReactNode
}

const COMPONENTS: ComponentInfo[] = [
  {
    name: "LabelValue",
    slug: "label-value",
    description:
      "Displays label-value pairs with consistent formatting. Use for profile pages, detail views, settings, and data display.",
    importStatement: 'import { LabelValue } from "@/components/shared"',
    props: [
      { name: "label", type: "string", default: "—", description: "The label text" },
      { name: "value", type: "ReactNode", default: "—", description: "Value (shows placeholder if null/undefined)" },
      { name: "variant", type: '"inline" | "fixed" | "vertical"', default: '"inline"', description: "Layout style" },
      { name: "placeholder", type: "string", default: '"—"', description: "Shown when value is empty" },
      { name: "adjunct", type: "ReactNode", default: "—", description: "Small text after value" },
      { name: "labelWidth", type: "string", default: '"180px"', description: "Label width (fixed variant only)" },
    ],
    example: (
      <Stack gap="lg">
        {/* Inline variant */}
        <div>
          <p className="text-muted-foreground mb-3 text-xs font-medium">variant=&quot;inline&quot; (default)</p>
          <Card className="p-4">
            <Stack gap="sm">
              <LabelValue label="Email" value="user@example.com" />
              <LabelValue label="Status" value="Active" adjunct="since 2024" />
              <LabelValue label="Phone" value={null} />
            </Stack>
          </Card>
        </div>

        {/* Fixed variant */}
        <div>
          <p className="text-muted-foreground mb-3 text-xs font-medium">variant=&quot;fixed&quot; (aligned labels)</p>
          <Card className="p-4">
            <Stack gap="sm">
              <LabelValue variant="fixed" label="Full Name" value="John Doe" />
              <LabelValue variant="fixed" label="Email" value="john@example.com" />
              <LabelValue variant="fixed" label="Phone" value="+1 234 567 890" />
              <LabelValue variant="fixed" label="Department" value="Engineering" adjunct="Remote" />
            </Stack>
          </Card>
        </div>

        {/* Vertical variant */}
        <div>
          <p className="text-muted-foreground mb-3 text-xs font-medium">variant=&quot;vertical&quot;</p>
          <Row gap="lg">
            <Card className="p-4">
              <LabelValue variant="vertical" label="Total Users" value="1,234" />
            </Card>
            <Card className="p-4">
              <LabelValue variant="vertical" label="Revenue" value="$45,231" adjunct="this month" />
            </Card>
            <Card className="p-4">
              <LabelValue variant="vertical" label="Conversion" value={null} />
            </Card>
          </Row>
        </div>
      </Stack>
    ),
  },
  {
    name: "StatCard",
    slug: "stat-card",
    description:
      "Dashboard metric card with title, value, optional trend indicator and icon. Use for KPIs, analytics dashboards, overview pages.",
    importStatement: 'import { StatCard } from "@/components/shared"',
    props: [
      { name: "label", type: "string", default: "—", description: "Metric title" },
      { name: "value", type: "ReactNode", default: "—", description: "Main value to display" },
      { name: "description", type: "string", default: "—", description: "Subtitle text" },
      { name: "trend", type: '"up" | "down" | "neutral"', default: "—", description: "Auto-shows colored trend icon" },
      { name: "trendText", type: "string", default: "—", description: "Trend percentage or text" },
      { name: "icon", type: "ReactNode", default: "—", description: "Icon in top right" },
      { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Padding size" },
    ],
    example: (
      <Stack gap="lg">
        {/* Basic examples */}
        <div>
          <p className="text-muted-foreground mb-3 text-xs font-medium">With trends and icons</p>
          <Grid cols={3} gap="md">
            <StatCard
              label="Total Revenue"
              value="$45,231"
              trend="up"
              trendText="+12.5%"
              description="from last month"
              icon={<DollarSignIcon className="size-4" />}
            />
            <StatCard
              label="Active Users"
              value="2,350"
              trend="up"
              trendText="+180"
              description="from last week"
              icon={<UsersIcon className="size-4" />}
            />
            <StatCard
              label="Bounce Rate"
              value="24.5%"
              trend="down"
              trendText="-4.3%"
              description="improvement"
              icon={<ActivityIcon className="size-4" />}
            />
          </Grid>
        </div>

        {/* Size variants */}
        <div>
          <p className="text-muted-foreground mb-3 text-xs font-medium">Size variants</p>
          <Grid cols={3} gap="md">
            <StatCard size="sm" label="Small" value="$1,234" />
            <StatCard size="md" label="Medium (default)" value="$1,234" />
            <StatCard size="lg" label="Large" value="$1,234" />
          </Grid>
        </div>

        {/* Simple without trends */}
        <div>
          <p className="text-muted-foreground mb-3 text-xs font-medium">Simple (no trend)</p>
          <Grid cols={4} gap="md">
            <StatCard label="Orders" value="156" />
            <StatCard label="Products" value="43" />
            <StatCard label="Categories" value="12" />
            <StatCard label="Reviews" value="89" />
          </Grid>
        </div>
      </Stack>
    ),
  },
  {
    name: "ThemeToggle",
    slug: "theme-toggle",
    description:
      "Popover-based theme selector with color theme (Light/Dark/Auto) and density options (Compact/Default/Large). Opens on hover, persists selections to localStorage.",
    importStatement: 'import { ThemeToggle } from "@/components/shared"',
    props: [
      { name: "className", type: "string", default: "—", description: "Additional CSS classes for the trigger button" },
    ],
    example: (
      <Stack gap="lg">
        <div>
          <p className="text-muted-foreground mb-3 text-xs font-medium">Default (hover to open)</p>
          <Row gap="md" className="items-center">
            <ThemeToggle />
            <span className="text-sm text-muted-foreground">← Hover over the icon to open the selector</span>
          </Row>
        </div>
        <div>
          <p className="text-muted-foreground mb-3 text-xs font-medium">Usage notes</p>
          <Card className="p-4">
            <Stack gap="sm" className="text-sm">
              <p><strong>Color Theme:</strong> Light (amber), Dark (blue), Auto (follows system preference)</p>
              <p><strong>Density:</strong> Adjusts root font-size — Compact (14px), Default (16px), Large (18px)</p>
              <p><strong>Persistence:</strong> Theme stored by next-themes, density stored in localStorage</p>
            </Stack>
          </Card>
        </div>
      </Stack>
    ),
  },
]

// =============================================================================
// RENDER HELPERS
// =============================================================================

function PropsTable({ props }: { props: ComponentInfo["props"] }) {
  return (
    <div className="bg-muted space-y-3 rounded-lg p-4">
      <p className="font-medium">Props</p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-border border-b text-left">
              <th className="pb-2 pr-4 font-medium">Prop</th>
              <th className="pb-2 pr-4 font-medium">Type</th>
              <th className="pb-2 pr-4 font-medium">Default</th>
              <th className="pb-2 font-medium">Description</th>
            </tr>
          </thead>
          <tbody>
            {props.map((prop) => (
              <tr key={prop.name} className="border-border border-b last:border-0">
                <td className="py-2 pr-4 font-mono text-xs">{prop.name}</td>
                <td className="text-muted-foreground py-2 pr-4 font-mono text-xs">{prop.type}</td>
                <td className="py-2 pr-4 font-mono text-xs">{prop.default}</td>
                <td className="text-muted-foreground py-2 text-xs">{prop.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// =============================================================================
// MAIN PAGE
// =============================================================================

export default function SharedComponentsPage() {
  return (
    <DocsAccordionPage
      title="Shared"
      description="Project-specific components composed from UI primitives."
      items={COMPONENTS}
      searchPlaceholder="Search components..."
      renderOverview={() => (
        <>
          <p className="text-muted-foreground">
            These are <strong>project-specific</strong> components — reusable across
            multiple pages but not generic enough to be primitives in <code>ui/</code>.
          </p>

          {/* When to use */}
          <div className="bg-muted space-y-3 rounded-lg p-4">
            <p className="font-medium">When to create here</p>
            <ul className="text-muted-foreground space-y-1 text-sm">
              <li>✓ Used on multiple pages</li>
              <li>✓ Combines 2+ primitives from <code>ui/</code></li>
              <li>✓ Has project-specific logic or styling</li>
            </ul>
          </div>

          {/* When NOT to use */}
          <div className="bg-muted space-y-3 rounded-lg p-4">
            <p className="font-medium">When NOT to create here</p>
            <ul className="text-muted-foreground space-y-1 text-sm">
              <li>✗ Only used on one page → inline it in the page</li>
              <li>✗ Generic primitive → belongs in <code>ui/</code> or <code>vendor/</code></li>
            </ul>
          </div>

          {/* How to create */}
          <div className="bg-muted space-y-4 rounded-lg p-4">
            <p className="font-medium">Creating a Shared Component</p>
            <ol className="text-muted-foreground space-y-3 text-sm">
              <li className="flex gap-3">
                <span className="bg-primary text-primary-foreground flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-medium">1</span>
                <div>
                  <strong>Create the file</strong>
                  <p className="mt-0.5">Add to <code>components/shared/[name].tsx</code></p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="bg-primary text-primary-foreground flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-medium">2</span>
                <div>
                  <strong>Add the header comment</strong>
                  <pre className="bg-background mt-2 overflow-x-auto rounded border p-2 text-xs">{`/**
 * CATALYST - UserAvatar Component
 *
 * Displays user avatar with fallback initials.
 * Used in: Header, Comments, Profile
 */`}</pre>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="bg-primary text-primary-foreground flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-medium">3</span>
                <div>
                  <strong>Compose from UI primitives</strong>
                  <pre className="bg-background mt-2 overflow-x-auto rounded border p-2 text-xs">{`import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function UserAvatar({ user }: { user: User }) {
  return (
    <Avatar>
      <AvatarImage src={user.avatarUrl} />
      <AvatarFallback>{user.initials}</AvatarFallback>
    </Avatar>
  )
}`}</pre>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="bg-primary text-primary-foreground flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-medium">4</span>
                <div>
                  <strong>Update COMPONENTS.md</strong>
                  <p className="mt-0.5">Add to the shared section in <code>components/COMPONENTS.md</code></p>
                </div>
              </li>
            </ol>
          </div>

          {/* Guidelines */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="bg-muted rounded-lg p-4">
              <p className="mb-2 font-medium text-success-600">Do</p>
              <ul className="text-muted-foreground space-y-1 text-sm">
                <li>• Use across 2+ pages</li>
                <li>• Compose from UI primitives</li>
                <li>• Keep props simple and typed</li>
                <li>• Document usage in header</li>
              </ul>
            </div>
            <div className="bg-muted rounded-lg p-4">
              <p className="mb-2 font-medium text-destructive">Don&apos;t</p>
              <ul className="text-muted-foreground space-y-1 text-sm">
                <li>• Create for single-page use</li>
                <li>• Duplicate shadcn components</li>
                <li>• Over-abstract too early</li>
                <li>• Add complex state logic</li>
              </ul>
            </div>
          </div>

          {/* Import */}
          <code className="bg-muted text-muted-foreground block overflow-x-auto rounded px-3 py-2 text-xs">
            {`import { LabelValue, StatCard } from "@/components/shared"`}
          </code>
        </>
      )}
      renderItem={(component) => (
        <>
          {/* Description */}
          <p className="text-muted-foreground">{component.description}</p>

          {/* Example */}
          {component.example && (
            <div className="overflow-visible py-2">{component.example}</div>
          )}

          {/* Props table */}
          <PropsTable props={component.props} />

          {/* Import */}
          <code className="bg-muted text-muted-foreground block overflow-x-auto rounded px-3 py-2 text-xs">
            {component.importStatement}
          </code>
        </>
      )}
    />
  )
}
