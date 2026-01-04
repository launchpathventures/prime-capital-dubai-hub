/**
 * CATALYST - Web Surface Doc Tab: Removal
 *
 * How to cleanly remove this surface from your project.
 * Written for catalyst devs (AI-first).
 */

import Link from "next/link"
import {
  AlertTriangleIcon,
  CheckCircle2Icon,
  SparklesIcon,
  TrashIcon,
  LinkIcon,
  HomeIcon,
} from "lucide-react"
import { Text, Row } from "@/components/core"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export function RemovalTab() {
  return (
    <div className="space-y-10">
      {/* Summary */}
      <section className="space-y-4">
        <div className="border-primary bg-primary/5 space-y-3 rounded-lg border-l-4 p-5">
          <p className="text-lg font-medium leading-snug">
            Removing the Web surface
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Surfaces are self-contained by design. Everything lives in one
            folder — delete it and clean up a few references. This guide walks
            through the process.
          </p>
        </div>
      </section>

      {/* Before You Start */}
      <section className="space-y-4">
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
          <Row gap="sm" className="items-start">
            <AlertTriangleIcon className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
            <div className="space-y-2">
              <Text weight="medium">Before you delete</Text>
              <ul className="text-muted-foreground space-y-1 text-sm">
                <li>• The Web surface includes your home page at /</li>
                <li>• You&apos;ll need to set a new home page or redirect</li>
                <li>• Check for external links pointing to your marketing pages</li>
              </ul>
            </div>
          </Row>
        </div>
      </section>

      {/* Delete the Surface */}
      <section className="space-y-4">
        <TaskCard
          icon={TrashIcon}
          title="Delete the surface"
          ask="Remove the Web surface from my project"
          description="Delete the entire app/(web)/ folder. This removes the shell, styles, routes, and docs in one action."
          details={[
            "All routes under / (public pages) will stop working",
            "CSS and shell are colocated — no cleanup in other folders",
            "The layout and all pages are removed together",
          ]}
          code={`# Delete the folder
rm -rf app/(web)

# What gets deleted:
app/(web)/
├── WEB.md              # Surface docs
├── web.css             # Surface styles  
├── layout.tsx          # Layout
├── page.tsx            # Home page at /
├── _surface/
│   └── web-shell.tsx   # Shell component
└── web/                # All public pages
    ├── pricing/
    └── about/`}
        />
      </section>

      {/* Update Navigation */}
      <section className="space-y-4">
        <TaskCard
          icon={LinkIcon}
          title="Clean up navigation"
          ask="Remove all references to the Web surface"
          description="Remove the navigation config and any links pointing to public pages."
          details={[
            "Delete webNavItems from lib/navigation.ts",
            "Delete webMoreItems from lib/navigation.ts",
            "Search for links to removed pages in other surfaces",
          ]}
          code={`// lib/navigation.ts

// DELETE these exports:
export const webNavItems: NavItem[] = [
  // ...
]

export const webMoreItems: NavItem[] = [
  // ...
]

// Search for remaining references:
grep -r "webNavItems" app/
grep -r "href=\"/\"" app/
grep -r "href=\"/pricing\"" app/`}
        />
      </section>

      {/* Set New Home Page */}
      <section className="space-y-4">
        <TaskCard
          icon={HomeIcon}
          title="Set a new home page"
          ask="Make [/app] the new home page after removing Web surface"
          description="With the Web surface gone, you need a new page at / or a redirect to another surface."
          details={[
            "Create a new app/page.tsx for a simple home page",
            "Or redirect / to another surface in next.config.ts",
            "Consider which surface should be the default entry point",
          ]}
          code={`// Option 1: Redirect to App surface
// next.config.ts

const config = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/app/dashboard',
        permanent: false,
      },
    ]
  },
}

// Option 2: Simple home page
// app/page.tsx

export default function HomePage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <a href="/app" className="text-primary hover:underline">
        Go to App →
      </a>
    </div>
  )
}`}
        />
      </section>

      {/* Verification */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Verify removal</h2>
        <p className="text-muted-foreground">
          Run these checks to make sure everything is cleaned up:
        </p>

        <div className="bg-card space-y-3 rounded-lg border p-5">
          <ul className="space-y-2">
            <ChecklistItem checked>
              <code className="bg-muted rounded px-1 text-xs">app/(web)/</code>{" "}
              folder deleted
            </ChecklistItem>
            <ChecklistItem checked>
              <code className="bg-muted rounded px-1 text-xs">webNavItems</code>{" "}
              removed from navigation.ts
            </ChecklistItem>
            <ChecklistItem checked>
              New home page or redirect configured
            </ChecklistItem>
            <ChecklistItem checked>
              No broken links to old marketing pages
            </ChecklistItem>
            <ChecklistItem checked>
              Build passes:{" "}
              <code className="bg-muted rounded px-1 text-xs">pnpm build</code>
            </ChecklistItem>
          </ul>
        </div>

        <div className="border-primary/20 bg-primary/5 rounded-lg border p-3">
          <Row gap="sm" className="items-start">
            <SparklesIcon className="text-primary mt-0.5 h-4 w-4 shrink-0" />
            <div>
              <Text size="xs" variant="muted" className="uppercase tracking-wide">
                Ask AI
              </Text>
              <Text size="sm" className="mt-0.5">
                &ldquo;Check for any remaining references to the Web surface&rdquo;
              </Text>
            </div>
          </Row>
        </div>
      </section>

      {/* Related */}
      <section className="bg-card space-y-3 rounded-lg border p-5">
        <h3 className="font-medium">Related docs</h3>
        <ul className="text-muted-foreground space-y-2 text-sm">
          <li>
            <Link href="/docs/surfaces" className="text-primary hover:underline">
              Surfaces Overview
            </Link>{" "}
            — How surfaces work and why they&apos;re self-contained
          </li>
          <li>
            <Link
              href="/docs/surfaces/app"
              className="text-primary hover:underline"
            >
              App Surface
            </Link>{" "}
            — If you&apos;re making App your main entry point
          </li>
        </ul>
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
  code,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  ask: string
  description: string
  details: string[]
  code: string
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

        {/* Code Example */}
        <div className="border-t pt-2">
          <Accordion>
            <AccordionItem value="details" className="border-none">
              <AccordionTrigger className="px-0 py-2 text-sm">
                Technical details
              </AccordionTrigger>
              <AccordionContent className="px-0">
                <div className="bg-muted/50 overflow-x-auto rounded-md p-4">
                  <pre className="text-xs leading-relaxed">{code}</pre>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  )
}

function ChecklistItem({
  children,
  checked,
}: {
  children: React.ReactNode
  checked?: boolean
}) {
  return (
    <li className="flex items-start gap-2 text-sm">
      <div
        className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border ${checked ? "border-primary bg-primary" : "border-muted-foreground/30"}`}
      >
        {checked && <CheckCircle2Icon className="h-3 w-3 text-primary-foreground" />}
      </div>
      <span>{children}</span>
    </li>
  )
}
