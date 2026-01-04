/**
 * CATALYST - Examples Surface Doc Tab: Design
 *
 * A living showcase of Examples surface design patterns.
 * Shows mini-previews of the example pages available.
 */

"use client"

import Link from "next/link"
import { Stack, Text, Title, Row } from "@/components/core"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  CheckCircle2Icon,
  XCircleIcon,
  LayoutDashboardIcon,
  UsersIcon,
  InboxIcon,
  KanbanIcon,
  BarChart3Icon,
  SettingsIcon,
  ArrowRightIcon,
} from "lucide-react"

export function DesignTab() {
  return (
    <article>
      <Stack gap="xl">
        {/* Summary Card */}
        <div className="border-primary bg-primary/5 space-y-4 rounded-lg border-l-4 p-5">
          <div>
            <p className="text-lg font-medium leading-snug">
              Examples Surface Design
            </p>
            <p className="text-muted-foreground mt-1">
              Guidelines for building reusable reference implementations
            </p>
          </div>

          {/* Core message */}
          <p className="leading-relaxed">
            Examples should be <strong>production-quality</strong>,{" "}
            <strong>realistic</strong>, and <strong>self-contained</strong>.
            Each example demonstrates a complete pattern — not a minimal demo,
            but something you&apos;d actually ship.
          </p>

          {/* Principles */}
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            {[
              { label: "Complete", desc: "Full implementations" },
              { label: "Realistic", desc: "Real-world data" },
              { label: "Copyable", desc: "Easy to adapt" },
              { label: "Consistent", desc: "Same patterns" },
            ].map((p) => (
              <div key={p.label} className="bg-background rounded-md border p-2.5">
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
            <div className="bg-background rounded-md border p-3">
              <Row gap="sm" className="mb-2 items-center">
                <CheckCircle2Icon className="h-4 w-4 text-emerald-600" />
                <Text size="sm" weight="medium">
                  Do
                </Text>
              </Row>
              <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
                <li>Use realistic mock data</li>
                <li>Include interactive states</li>
                <li>Follow App surface patterns</li>
                <li>Make code easy to copy</li>
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
                <li>Create minimal stubs</li>
                <li>Use placeholder data</li>
                <li>Skip loading/error states</li>
                <li>Over-complicate the code</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Available Examples */}
        <section>
          <Title size="h3" className="mb-4">
            Available examples
          </Title>
          <div className="grid gap-4 md:grid-cols-2">
            <ExampleCard
              icon={LayoutDashboardIcon}
              title="Dashboard"
              description="Analytics dashboard with stats, charts, tables, and activity feeds."
              href="/examples/dashboard"
              status="complete"
            />
            <ExampleCard
              icon={UsersIcon}
              title="CRM"
              description="Customer relationship management with contacts, deals, and pipeline."
              href="/examples/crm"
              status="planned"
            />
            <ExampleCard
              icon={InboxIcon}
              title="Inbox"
              description="Email/message interface with folders, threads, and compose."
              href="/examples/inbox"
              status="planned"
            />
            <ExampleCard
              icon={KanbanIcon}
              title="Kanban"
              description="Drag-and-drop board for project and task management."
              href="/examples/kanban"
              status="planned"
            />
            <ExampleCard
              icon={BarChart3Icon}
              title="Analytics"
              description="Data visualization with charts, filters, and date ranges."
              href="/examples/analytics"
              status="planned"
            />
            <ExampleCard
              icon={SettingsIcon}
              title="Settings"
              description="User preferences with forms, toggles, and account management."
              href="/examples/settings"
              status="planned"
            />
          </div>
        </section>

        {/* Example Page Preview */}
        <section className="bg-muted/30 rounded-xl border p-6">
          <Title size="h3" className="mb-4">
            Example page structure
          </Title>
          <div className="grid gap-4 md:grid-cols-[180px_1fr]">
            {/* Mock sidebar */}
            <div className="bg-card rounded-lg border p-3">
              <Text size="xs" variant="muted" className="mb-2 uppercase">
                Examples
              </Text>
              <ul className="space-y-1 text-sm">
                <li className="text-muted-foreground">Overview</li>
                <li className="text-primary font-medium">Dashboard</li>
                <li className="text-muted-foreground">CRM</li>
                <li className="text-muted-foreground">Inbox</li>
              </ul>
            </div>

            {/* Mock content */}
            <div className="bg-card rounded-lg border p-4">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <div className="bg-muted mb-1 h-4 w-32 rounded" />
                  <div className="bg-muted h-3 w-48 rounded" />
                </div>
                <div className="bg-muted h-8 w-20 rounded" />
              </div>
              <div className="grid grid-cols-4 gap-2">
                <div className="bg-muted h-16 rounded" />
                <div className="bg-muted h-16 rounded" />
                <div className="bg-muted h-16 rounded" />
                <div className="bg-muted h-16 rounded" />
              </div>
              <div className="bg-muted mt-4 h-32 rounded" />
            </div>
          </div>
          <Text size="sm" variant="muted" className="mt-4">
            Examples use the same sidebar layout as the App surface for
            consistency.
          </Text>
        </section>

        {/* View Examples CTA */}
        <section className="text-center">
          <Button size="lg" nativeButton={false} render={<Link href="/examples" />}>
            Browse All Examples
            <ArrowRightIcon className="h-4 w-4" />
          </Button>
        </section>
      </Stack>
    </article>
  )
}

// -----------------------------------------------------------------------------
// Helper Components
// -----------------------------------------------------------------------------

function ExampleCard({
  icon: Icon,
  title,
  description,
  href,
  status,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  href: string
  status: "complete" | "planned"
}) {
  return (
    <Card className={status === "planned" ? "opacity-60" : ""}>
      <CardHeader>
        <Row gap="sm" className="items-center justify-between">
          <Row gap="sm" className="items-center">
            <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
              <Icon className="text-primary h-4 w-4" />
            </div>
            <CardTitle className="text-base">{title}</CardTitle>
          </Row>
          <Badge
            variant={status === "complete" ? "default" : "secondary"}
            size="sm"
          >
            {status === "complete" ? "Available" : "Planned"}
          </Badge>
        </Row>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {status === "complete" ? (
          <Button variant="outline" size="sm" nativeButton={false} render={<Link href={href} />}>
            View Example
            <ArrowRightIcon className="h-3 w-3" />
          </Button>
        ) : (
          <Text size="sm" variant="muted">
            Coming soon
          </Text>
        )}
      </CardContent>
    </Card>
  )
}
