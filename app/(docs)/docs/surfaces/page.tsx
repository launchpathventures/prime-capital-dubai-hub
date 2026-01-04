/**
 * CATALYST - Surfaces Overview
 *
 * Comprehensive introduction to Catalyst surfaces: what they are,
 * why they exist, how they work, and the flexibility they provide.
 */

import Link from "next/link"
import {
  LayersIcon,
  ShieldCheckIcon,
  ZapIcon,
  UsersIcon,
  FolderSyncIcon,
  PuzzleIcon,
  MonitorIcon,
  LayoutDashboardIcon,
  BookOpenIcon,
  PresentationIcon,
  GripIcon,
  ArrowRightIcon,
} from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function SurfacesOverviewPage() {
  return (
    <article className="space-y-12">
      {/* ------------------------------------------------------------------ */}
      {/* Hero / Summary */}
      {/* ------------------------------------------------------------------ */}
      <header className="space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight">Surfaces</h1>
        <p className="text-muted-foreground text-lg leading-relaxed">
          Different experiences for different audiences — all in one project.
        </p>

        {/* At-a-glance summary box */}
        <div className="bg-primary/5 border-primary space-y-3 rounded-lg border-l-4 p-5">
          <p className="leading-relaxed">
            A <strong>surface</strong> is a distinct area of your product designed
            for a specific audience. Your marketing site, your app dashboard, your
            documentation — each is a surface with its own look, feel, and purpose.
          </p>
          <p className="text-muted-foreground text-sm leading-relaxed">
            This separation prevents the common problem where marketing pages,
            user dashboards, and developer docs all compete for the same design
            constraints. Each surface can be optimized for its audience without
            compromising the others.
          </p>
        </div>
      </header>

      {/* ------------------------------------------------------------------ */}
      {/* Why Surfaces Exist */}
      {/* ------------------------------------------------------------------ */}
      <section className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-medium">Why This Matters</h2>
          <p className="text-muted-foreground">
            Different audiences need different experiences. Surfaces give each
            audience exactly what they need.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <BenefitCard
            icon={UsersIcon}
            title="Right Experience for Each Audience"
            description="Visitors browsing your marketing site have different needs than users in your dashboard. Surfaces let you optimize for each."
          />
          <BenefitCard
            icon={ZapIcon}
            title="Work Fast Without Breaking Things"
            description="Teams can work on different surfaces at the same time. Changes to marketing won't affect the app, and vice versa."
          />
          <BenefitCard
            icon={ShieldCheckIcon}
            title="Clear Purpose, Less Confusion"
            description="Everyone knows where things belong. Public pages go in Web, user features go in App, reference material goes in Docs."
          />
          <BenefitCard
            icon={FolderSyncIcon}
            title="Easy to Add or Remove"
            description="Each surface is self-contained. Need a new admin area? Add it. Don't need presentations? Remove them. No complicated refactoring."
          />
        </div>

        <p className="text-muted-foreground text-sm">
          The goal is clarity: anyone joining the project can quickly understand
          where to find things and where to add new work.
        </p>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* How Surfaces Work */}
      {/* ------------------------------------------------------------------ */}
      <section className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-medium">How They Work Together</h2>
          <p className="text-muted-foreground">
            Each surface is independent but they share the same design language
            and components.
          </p>
        </div>

        <div className="space-y-4">
          <div className="bg-card rounded-lg border p-5 space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium">The Delivery Story</h3>
              <p className="text-muted-foreground text-sm">
                Surfaces form a complete narrative for your product:
              </p>
            </div>
            <ul className="space-y-2 text-sm">
              <li className="flex gap-3">
                <span className="text-primary font-medium w-20 shrink-0">Web</span>
                <span className="text-muted-foreground">Your public website — pages visitors see without logging in</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-medium w-20 shrink-0">App</span>
                <span className="text-muted-foreground">Delivers value — the actual product experience</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-medium w-20 shrink-0">Docs</span>
                <span className="text-muted-foreground">Documents value — how things work and why</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-medium w-20 shrink-0">Examples</span>
                <span className="text-muted-foreground">Proves value — reference implementations that work</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-medium w-20 shrink-0">Present</span>
                <span className="text-muted-foreground">Tells the story — decisions, progress, outcomes</span>
              </li>
            </ul>
          </div>

          {/* Technical structure - collapsible */}
          <Accordion>
            <AccordionItem value="technical-structure" className="border-none">
              <AccordionTrigger className="px-0 py-2 text-sm font-medium">
                Technical structure
              </AccordionTrigger>
              <AccordionContent className="px-0">
                <div className="bg-muted/30 overflow-x-auto rounded-lg border p-4">
                  <pre className="text-sm leading-relaxed">
{`app/(surface-name)/
├── layout.tsx          # Sets the layout
├── surface.css         # Surface-specific styles
├── SURFACE.md          # Documentation
├── _surface/           # Layout components
│   └── surface-shell.tsx
└── pages/              # Your pages
    └── page.tsx`}
                  </pre>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Included Surfaces */}
      {/* ------------------------------------------------------------------ */}
      <section className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-medium">Included Surfaces</h2>
          <p className="text-muted-foreground">
            Catalyst includes six surfaces out of the box. Keep what you need,
            remove what you don&apos;t, or add new ones for your specific needs.
          </p>
        </div>

        <div className="grid gap-4">
          <SurfaceCard
            title="Web"
            route="(web)"
            icon={MonitorIcon}
            description="Your public website. Marketing pages, content, blogs, portfolios — anything visitors access without logging in."
            href="/docs/surfaces/web"
          />
          <SurfaceCard
            title="App"
            route="(app)"
            icon={LayoutDashboardIcon}
            description="Your core product. The dashboard, settings, and features users interact with after logging in."
            href="/docs/surfaces/app"
          />
          <SurfaceCard
            title="Auth"
            route="(auth)"
            icon={ShieldCheckIcon}
            description="Login, signup, and password reset. Clean, focused pages for authentication flows."
            href="/docs/surfaces/auth"
          />
          <SurfaceCard
            title="Docs"
            route="(docs)"
            icon={BookOpenIcon}
            description="Documentation and reference material. Where you explain how things work and why."
            href="/docs/surfaces/docs"
          />
          <SurfaceCard
            title="Examples"
            route="(examples)"
            icon={GripIcon}
            description="Working examples and patterns. Proven implementations you can copy and adapt."
            href="/docs/surfaces/examples"
          />
          <SurfaceCard
            title="Present"
            route="(present)"
            icon={PresentationIcon}
            description="Slide presentations. Share progress, decisions, and outcomes with stakeholders."
            href="/docs/surfaces/present"
          />
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Flexibility Section */}
      {/* ------------------------------------------------------------------ */}
      <section className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <PuzzleIcon className="text-primary h-5 w-5" />
            <h2 className="text-xl font-medium">Make It Yours</h2>
          </div>
          <p className="text-muted-foreground">
            The included surfaces are starting points. Adapt them to fit your
            project.
          </p>
        </div>

        <div className="bg-muted/30 space-y-4 rounded-lg border p-5">
          <div className="space-y-2">
            <h3 className="font-medium">Common Changes</h3>
            <ul className="text-muted-foreground space-y-2 text-sm">
              <li className="flex gap-2">
                <span className="text-primary">→</span>
                <span>
                  <strong className="text-foreground">Remove</strong> what you
                  don&apos;t need. Building an app without marketing pages? Delete
                  the Web surface.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">→</span>
                <span>
                  <strong className="text-foreground">Add</strong> new surfaces.
                  Need a separate admin area? Create one with its own layout.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">→</span>
                <span>
                  <strong className="text-foreground">Rename</strong> to match
                  your domain. "App" could become "Dashboard" or "Portal".
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">→</span>
                <span>
                  <strong className="text-foreground">Simplify</strong> if you
                  only need one or two surfaces. The pattern scales down as well
                  as up.
                </span>
              </li>
            </ul>
          </div>

          <div className="border-muted-foreground/20 border-t pt-4">
            <p className="text-muted-foreground text-sm">
              The value is the concept—clear boundaries for different audiences.
              How you implement that is up to you.
            </p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Key Takeaways */}
      {/* ------------------------------------------------------------------ */}
      <section className="space-y-4">
        <h2 className="text-xl font-medium">Key Takeaways</h2>
        <div className="bg-card space-y-3 rounded-lg border p-5">
          <TakeawayItem>
            Surfaces are separate areas for different audiences.
          </TakeawayItem>
          <TakeawayItem>
            Each has its own layout, styles, and pages.
          </TakeawayItem>
          <TakeawayItem>
            Self-contained means easy to add, remove, or change.
          </TakeawayItem>
          <TakeawayItem>
            Shared components keep everything visually consistent.
          </TakeawayItem>
          <TakeawayItem>
            Start with what you need, customize from there.
          </TakeawayItem>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Next Steps */}
      {/* ------------------------------------------------------------------ */}
      <section className="border-muted space-y-3 rounded-lg border p-5">
        <h2 className="font-medium">Explore Each Surface</h2>
        <p className="text-muted-foreground text-sm">
          Learn about each surface—what it&apos;s for, how to customize it, and
          how to remove it if you don&apos;t need it.
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          <SurfaceLink href="/docs/surfaces/web" label="Web" />
          <SurfaceLink href="/docs/surfaces/app" label="App" />
          <SurfaceLink href="/docs/surfaces/auth" label="Auth" />
          <SurfaceLink href="/docs/surfaces/docs" label="Docs" />
          <SurfaceLink href="/docs/surfaces/examples" label="Examples" />
          <SurfaceLink href="/docs/surfaces/present" label="Present" />
        </div>
      </section>
    </article>
  )
}

// -----------------------------------------------------------------------------
// Components
// -----------------------------------------------------------------------------

function BenefitCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
}) {
  return (
    <div className="bg-card space-y-2 rounded-lg border p-4">
      <div className="flex items-center gap-2">
        <Icon className="text-primary h-4 w-4" />
        <h3 className="text-sm font-medium">{title}</h3>
      </div>
      <p className="text-muted-foreground text-sm leading-relaxed">
        {description}
      </p>
    </div>
  )
}

function SurfaceCard({
  title,
  route,
  icon: Icon,
  description,
  href,
}: {
  title: string
  route: string
  icon: React.ComponentType<{ className?: string }>
  description: string
  href: string
}) {
  return (
    <Link
      href={href}
      className="group bg-card hover:border-primary/50 flex items-start gap-4 rounded-lg border p-5 transition-all hover:shadow-md"
    >
      <div className="bg-primary/10 text-primary mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-md">
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold group-hover:text-primary transition-colors">
            {title}
          </h3>
          <code className="text-muted-foreground bg-muted rounded px-1.5 py-0.5 text-xs font-normal">
            {route}
          </code>
        </div>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {description}
        </p>
      </div>
      <ArrowRightIcon className="text-muted-foreground/30 group-hover:text-primary mt-2.5 h-5 w-5 -translate-x-2 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
    </Link>
  )
}

function TakeawayItem({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-2 text-sm">
      <span className="text-primary">✓</span>
      <span>{children}</span>
    </div>
  )
}

function SurfaceLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="bg-muted hover:bg-muted/70 rounded-md px-3 py-1.5 text-sm font-medium transition-colors"
    >
      {label}
    </Link>
  )
}
