/**
 * CATALYST - Web Surface Doc Tab: Overview
 *
 * What the Web surface is, why it exists, when to use it.
 * Audience hierarchy: stakeholder → catalyst dev → technical dev
 */

import Link from "next/link"
import {
  GlobeIcon,
  MegaphoneIcon,
  SearchIcon,
  ImageIcon,
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

export function OverviewTab() {
  return (
    <div className="space-y-10">
      {/* Summary */}
      <section className="space-y-4">
        <div className="border-primary bg-primary/5 rounded-lg border-l-4 p-5">
          <p className="text-lg font-medium leading-snug">
            Your public face to the world
          </p>
          <p className="text-muted-foreground mt-2 leading-relaxed">
            Build anything public — from simple landing pages to full
            content-driven websites. Marketing pages, blogs, portfolios,
            documentation sites, or complete web applications without auth.
          </p>
        </div>
      </section>

      {/* What You Get */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">What You Get</h2>
        <p className="text-muted-foreground">
          A high-performance website foundation, ready for any public content:
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <FeatureCard
            icon={GlobeIcon}
            title="Fully public"
            description="No authentication required. Build websites, blogs, portfolios — anything visitors should access freely."
          />
          <FeatureCard
            icon={MegaphoneIcon}
            title="Flexible layouts"
            description="Header + footer layout works for marketing, content sites, blogs, and more. Easy to customize."
          />
          <FeatureCard
            icon={SearchIcon}
            title="SEO & performance"
            description="Server-rendered, fast-loading pages. Built for search engines and Core Web Vitals."
          />
          <FeatureCard
            icon={ImageIcon}
            title="CMS-ready"
            description="Connect to any headless CMS, or use Supabase via the App surface as a lightweight content backend."
          />
        </div>
      </section>

      {/* When to Use It */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">When to Use It</h2>
        <p className="text-muted-foreground">
          Use this surface for any public content — from simple pages to full
          websites:
        </p>

        <div className="bg-card rounded-xl border p-6">
          <ul className="space-y-3">
            <UseCaseItem
              title="Full websites"
              example="Company sites, portfolios, agency sites"
            />
            <UseCaseItem
              title="Content & blogs"
              example="Articles, resources, news, tutorials"
            />
            <UseCaseItem
              title="Marketing pages"
              example="Landing pages, campaigns, product launches"
            />
            <UseCaseItem
              title="Pricing & info"
              example="Pricing tables, about, team, contact"
            />
            <UseCaseItem
              title="Legal & compliance"
              example="Terms, privacy policy, accessibility"
            />
          </ul>
        </div>

        {/* CMS hint callout */}
        <div className="bg-muted/50 flex gap-3 rounded-lg p-4">
          <LightbulbIcon className="text-primary mt-0.5 h-5 w-5 shrink-0" />
          <div className="space-y-1">
            <p className="text-sm font-medium">Need dynamic content?</p>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Connect to a headless CMS for full content management, or use
              Supabase via the App surface as a lightweight backend for blog
              posts, case studies, or other content.
            </p>
          </div>
        </div>
      </section>

      {/* Technical Details */}
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
              <h3 className="text-muted-foreground mb-4 text-sm font-medium uppercase tracking-wide">
                Configuration
              </h3>
              <dl className="space-y-3">
                <MetadataItem label="Folder" value="app/(web)" />
                <MetadataItem label="URL" value="/ (root)" />
                <MetadataItem label="Layout" value="WebShell" />
                <MetadataItem label="Navigation" value="webNavItems" />
                <MetadataItem label="Auth" value="None (public)" />
              </dl>
            </div>

            {/* Folder structure */}
            <div className="bg-card rounded-xl border p-5">
              <h3 className="text-muted-foreground mb-4 text-sm font-medium uppercase tracking-wide">
                Folder Structure
              </h3>
              <pre className="text-muted-foreground text-xs leading-relaxed">
                {`app/(web)/
├── WEB.md          # Docs
├── web.css         # Styles
├── layout.tsx      # Shell wrapper
├── page.tsx        # Home page (/)
├── about/          # → /about
├── pricing/        # → /pricing
├── _surface/
│   └── web-shell.tsx
└── web/            # Optional: /web/...
    └── [pages]/`}
              </pre>
              <p className="text-muted-foreground mt-3 text-xs">
                Pages go directly in app/(web)/ for top-level URLs like /about.
                Use app/(web)/web/ only if you want /web/... URLs.
              </p>
            </div>
          </div>

          <p className="text-muted-foreground mt-4 text-sm">
            Delete the entire{" "}
            <code className="bg-muted rounded px-1.5 py-0.5 text-xs">
              app/(web)
            </code>{" "}
            folder to remove this surface. Everything is self-contained.
          </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* Learn More */}
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
            description="Shell & header components"
          />
          <ReadingLink
            href="/docs/design"
            title="Design"
            description="Visual patterns & tokens"
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
      <span className="text-primary text-sm font-medium">{title}</span>
      <span className="text-muted-foreground text-xs">{description}</span>
    </Link>
  )
}
