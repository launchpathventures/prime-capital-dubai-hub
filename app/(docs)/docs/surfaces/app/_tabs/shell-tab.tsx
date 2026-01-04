/**
 * CATALYST - App Surface Doc Tab: Layout
 *
 * How the app layout works — sidebar, header, content areas.
 * Written for catalyst devs (AI-first), technical details collapsible.
 */

import Link from "next/link"
import { CheckCircle2Icon, SparklesIcon, PanelLeftIcon, LayoutIcon, PaletteIcon, ShieldIcon } from "lucide-react"
import { Text, Row, Stack } from "@/components/core"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export function LayoutTab() {
  return (
    <div className="space-y-10">
      {/* ------------------------------------------------------------------ */}
      {/* Summary */}
      {/* ------------------------------------------------------------------ */}
      <section className="space-y-4">
        <div className="border-primary bg-primary/5 rounded-lg border-l-4 p-5 space-y-3">
          <p className="text-lg font-medium leading-snug">
            Understanding the layout
          </p>
          <p className="text-muted-foreground leading-relaxed">
            The App surface uses a sidebar + header layout. The sidebar shows
            navigation, the header shows user actions, and your page content
            fills the main area. This guide explains how to customize each part.
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Visual Overview */}
      {/* ------------------------------------------------------------------ */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Layout structure</h2>
        <p className="text-muted-foreground">
          Every page in the App surface shares this layout:
        </p>

        <div className="bg-muted/30 overflow-hidden rounded-lg border">
          <div className="grid grid-cols-[auto_1fr] grid-rows-[auto_1fr] gap-px bg-border">
            <div className="bg-card row-span-2 flex w-48 flex-col p-3">
              <div className="text-muted-foreground mb-2 text-xs font-medium uppercase">
                Sidebar
              </div>
              <div className="text-xs text-muted-foreground mb-3">Logo + navigation groups</div>
              <div className="bg-muted mb-1 h-4 w-3/4 rounded" />
              <div className="bg-muted mb-1 h-4 w-2/3 rounded" />
              <div className="bg-muted mb-1 h-4 w-3/4 rounded" />
              <div className="flex-1" />
              <div className="text-xs text-muted-foreground">Collapse toggle</div>
            </div>
            <div className="bg-card flex h-12 items-center gap-2 px-3">
              <div className="text-muted-foreground text-xs font-medium uppercase">
                Header
              </div>
              <div className="text-xs text-muted-foreground">— notifications, user menu, theme</div>
              <div className="flex-1" />
              <div className="bg-muted h-6 w-6 rounded-full" />
              <div className="bg-muted h-6 w-6 rounded-full" />
            </div>
            <div className="bg-card flex min-h-32 items-center justify-center p-4">
              <span className="text-muted-foreground text-sm">
                Your page content appears here
              </span>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border p-4">
          <ul className="space-y-2 text-sm">
            <li className="flex gap-2">
              <CheckCircle2Icon className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Sidebar collapses to icons on desktop (Alt+M to toggle)</span>
            </li>
            <li className="flex gap-2">
              <CheckCircle2Icon className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>On mobile, sidebar becomes a slide-out sheet</span>
            </li>
            <li className="flex gap-2">
              <CheckCircle2Icon className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>All pages protected by authentication automatically</span>
            </li>
          </ul>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Customize Sidebar */}
      {/* ------------------------------------------------------------------ */}
      <section className="space-y-4">
        <TaskCard
          icon={PanelLeftIcon}
          title="Customize the sidebar"
          ask="Add a new navigation group called [Reports] with links to [Monthly] and [Annual]"
          description="The sidebar navigation is defined as data in lib/navigation.ts. Add groups and links there — the sidebar renders automatically."
          details={[
            "Groups have a label, icon, and list of items",
            "Each item needs a label and href",
            "Groups expand/collapse automatically",
          ]}
          files={[
            { path: "lib/navigation.ts", note: "Navigation data" },
          ]}
          example={`// lib/navigation.ts

export const appNavItems: NavGroup[] = [
  {
    label: "Overview",
    icon: LayoutDashboardIcon,
    items: [
      { label: "Dashboard", href: "/app/dashboard" },
    ],
  },
  {
    label: "Reports",  // ← New group
    icon: BarChartIcon,
    items: [
      { label: "Monthly", href: "/app/reports/monthly" },
      { label: "Annual", href: "/app/reports/annual" },
    ],
  },
]`}
        />
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Customize Header */}
      {/* ------------------------------------------------------------------ */}
      <section className="space-y-4">
        <TaskCard
          icon={LayoutIcon}
          title="Customize the header"
          ask="Remove the theme toggle from the header" 
          description="The header actions are defined in the shell component. Add or remove components to change what appears."
          details={[
            "Default actions: notifications, user menu, theme toggle, surface switcher",
            "All action components are in components/shared/",
            "The user object is passed from the layout",
          ]}
          files={[
            { path: "app/(app)/_surface/app-shell.tsx", note: "Shell component" },
            { path: "components/shared/", note: "Header action components" },
          ]}
          example={`// app/(app)/_surface/app-shell.tsx

<Header.Actions>
  <UserNotifications />
  <UserMenu user={user} />
  {/* <ThemeToggle /> ← Remove this line */}
  <SurfaceSwitcher />
</Header.Actions>`}
        />
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Custom Styles */}
      {/* ------------------------------------------------------------------ */}
      <section className="space-y-4">
        <TaskCard
          icon={PaletteIcon}
          title="Add custom styles"
          ask="Make the sidebar background darker in the app surface"
          description="Each surface has its own CSS file. Add styles there to customize the appearance without affecting other surfaces."
          details={[
            "Surface CSS is imported by the layout automatically",
            "Use CSS variables for consistency with the design system",
            "Styles only apply to this surface",
          ]}
          files={[
            { path: "app/(app)/app.css", note: "App surface styles" },
          ]}
          example={`/* app/(app)/app.css */

/* Custom sidebar background */
.app-shell [data-slot="sidebar"] {
  background: oklch(from var(--color-background) calc(l - 0.02) c h);
}

/* Custom header border */
.app-shell [data-slot="header"] {
  border-bottom: 1px solid var(--color-border);
}`}
        />
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Auth Note */}
      {/* ------------------------------------------------------------------ */}
      <section className="space-y-4">
        <div className="bg-card rounded-lg border overflow-hidden">
          <div className="border-b bg-muted/30 px-5 py-3">
            <Row gap="sm" className="items-center">
              <ShieldIcon className="h-4 w-4 text-muted-foreground" />
              <Text weight="medium">Authentication</Text>
            </Row>
          </div>
          <div className="p-5 space-y-3">
            <p className="text-sm text-muted-foreground leading-relaxed">
              All App surface pages are protected automatically. You don't need to add
              auth checks to individual pages — it's handled by middleware.
            </p>
            <ul className="space-y-1.5">
              <li className="flex gap-2 text-sm">
                <CheckCircle2Icon className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Unauthenticated users are redirected to login</span>
              </li>
              <li className="flex gap-2 text-sm">
                <CheckCircle2Icon className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>User data is fetched server-side and passed to components</span>
              </li>
              <li className="flex gap-2 text-sm">
                <CheckCircle2Icon className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Session management is automatic via Supabase</span>
              </li>
            </ul>
            <p className="text-sm border-t pt-3">
              <Link href="/docs/develop/authentication" className="text-primary hover:underline">
                Authentication docs →
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Quick Reference */}
      {/* ------------------------------------------------------------------ */}
      <section className="bg-card space-y-3 rounded-lg border p-5">
        <h3 className="font-medium">Quick reference</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Text size="sm" weight="medium" className="mb-2">Key files</Text>
            <ul className="text-muted-foreground space-y-1 text-sm">
              <li><code className="bg-muted rounded px-1 text-xs">app/(app)/_surface/app-shell.tsx</code></li>
              <li><code className="bg-muted rounded px-1 text-xs">app/(app)/layout.tsx</code></li>
              <li><code className="bg-muted rounded px-1 text-xs">app/(app)/app.css</code></li>
              <li><code className="bg-muted rounded px-1 text-xs">lib/navigation.ts</code></li>
            </ul>
          </div>
          <div>
            <Text size="sm" weight="medium" className="mb-2">Common asks</Text>
            <ul className="text-muted-foreground space-y-1 text-sm">
              <li>"Add a navigation group for..."</li>
              <li>"Change the header to show..."</li>
              <li>"Make the sidebar [color/style]..."</li>
              <li>"Move the sidebar to the right"</li>
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
