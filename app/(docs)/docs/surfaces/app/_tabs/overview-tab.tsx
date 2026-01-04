/**
 * CATALYST - App Surface Doc Tab: Overview
 *
 * What the App surface is, why it exists, when to use it.
 * Audience hierarchy: stakeholder → catalyst dev → technical dev
 */

import Link from "next/link"
import {
  LayoutDashboardIcon,
  LogInIcon,
  PanelLeftIcon,
  UsersIcon,
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

export function AppSurfaceOverviewTab() {
  return (
    <div className="space-y-10">
      {/* ------------------------------------------------------------------ */}
      {/* Summary — Immediate understanding for stakeholders */}
      {/* ------------------------------------------------------------------ */}
      <section className="space-y-4">
        <div className="border-primary bg-primary/5 rounded-lg border-l-4 p-5">
          <p className="text-lg font-medium leading-snug">
            The classic "logged-in" experience
          </p>
          <p className="text-muted-foreground mt-2 leading-relaxed">
            Users log in, see a sidebar, and navigate between protected pages.
            Dashboards, account settings, admin panels, internal tools — if your
            users authenticate and work within a structured layout, this is it.
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* What It Provides — Value proposition */}
      {/* ------------------------------------------------------------------ */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">What You Get</h2>
        <p className="text-muted-foreground">
          A production-ready authenticated layout, out of the box:
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <FeatureCard
            icon={LogInIcon}
            title="Protected pages"
            description="Every page requires login. Redirects are handled automatically — no auth code to write."
          />
          <FeatureCard
            icon={PanelLeftIcon}
            title="Persistent sidebar"
            description="Navigation stays visible as users move around. Collapses on mobile into a slide-out menu."
          />
          <FeatureCard
            icon={UsersIcon}
            title="User context"
            description="The header shows who's logged in — avatar, notifications, and account menu ready to go."
          />
          <FeatureCard
            icon={LayoutDashboardIcon}
            title="Scalable navigation"
            description="Grouped sections that grow with your product. Add pages without redesigning the nav."
          />
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* When to Use It — Decision support */}
      {/* ------------------------------------------------------------------ */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">When to Use It</h2>
        <p className="text-muted-foreground">
          Choose this surface when you're building something users log into and
          use repeatedly:
        </p>

        <div className="bg-card rounded-xl border p-6">
          <ul className="space-y-3">
            <UseCaseItem
              title="Dashboards"
              example="Analytics, reporting, KPIs, status overviews"
            />
            <UseCaseItem
              title="Account & settings"
              example="Profile, preferences, billing, team management"
            />
            <UseCaseItem
              title="Admin panels"
              example="Content management, user admin, system config"
            />
            <UseCaseItem
              title="Internal tools"
              example="CRM, project management, workflow apps"
            />
            <UseCaseItem
              title="SaaS products"
              example="The core experience after login"
            />
          </ul>
        </div>

        {/* Not sure? callout */}
        <div className="bg-muted/50 flex gap-3 rounded-lg p-4">
          <LightbulbIcon className="text-primary mt-0.5 h-5 w-5 shrink-0" />
          <div className="space-y-1">
            <p className="text-sm font-medium">Not sure if you need this?</p>
            <p className="text-muted-foreground text-sm leading-relaxed">
              If users log in and you want consistent navigation, start here.
              You can rename it to{" "}
              <code className="bg-background rounded px-1.5 py-0.5 text-xs">
                /dashboard
              </code>{" "}
              or{" "}
              <code className="bg-background rounded px-1.5 py-0.5 text-xs">
                /admin
              </code>
              , or delete it entirely if your project doesn't need auth.
            </p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Technical Overview — For devs who need specifics */}
      {/* ------------------------------------------------------------------ */}
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
            <h3 className="mb-4 text-sm font-medium uppercase tracking-wide text-muted-foreground">
              Configuration
            </h3>
            <dl className="space-y-3">
              <MetadataItem label="Folder" value="app/(app)" />
              <MetadataItem label="URL" value="/app/*" />
              <MetadataItem label="Layout" value="AppShell" />
              <MetadataItem label="Navigation" value="appNavItems" />
              <MetadataItem label="Auth" value="All pages protected" />
            </dl>
          </div>

          {/* Folder structure */}
          <div className="bg-card rounded-xl border p-5">
            <h3 className="mb-4 text-sm font-medium uppercase tracking-wide text-muted-foreground">
              Folder Structure
            </h3>
            <pre className="text-muted-foreground text-xs leading-relaxed">
              {`app/(app)/
├── APP.md          # Docs
├── app.css         # Styles
├── layout.tsx      # Shell wrapper
├── _surface/
│   └── app-shell.tsx
└── app/
    ├── dashboard/
    └── settings/`}
            </pre>
          </div>
        </div>

        <p className="text-muted-foreground text-sm">
          Delete the entire{" "}
          <code className="bg-muted rounded px-1.5 py-0.5 text-xs">app/(app)</code>{" "}
          folder to remove this surface. Everything is self-contained.
        </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Further Reading — Next steps */}
      {/* ------------------------------------------------------------------ */}
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
            href="/docs/develop/authentication"
            title="Auth"
            description="Authentication setup"
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
      <span className="text-primary text-sm font-medium">
        {title}
      </span>
      <span className="text-muted-foreground text-xs">{description}</span>
    </Link>
  )
}
