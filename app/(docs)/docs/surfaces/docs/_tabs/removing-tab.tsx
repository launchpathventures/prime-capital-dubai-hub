/**
 * CATALYST - Docs Surface Doc Tab: Removal
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
  ShieldIcon,
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
            Removing the Docs surface
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
                <li>• Other surfaces may link to /docs pages</li>
                <li>• External documentation links will break</li>
                <li>• Consider if you need docs for internal use</li>
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
          ask="Remove the Docs surface from my project"
          description="Delete the entire app/(docs)/ folder. This removes the shell, styles, routes, and navigation in one action."
          details={[
            "All routes under /docs will stop working",
            "CSS and shell are colocated — no cleanup in other folders",
            "All documentation pages are removed together",
          ]}
          code={`# Delete the folder
rm -rf app/(docs)

# What gets deleted:
app/(docs)/
├── DOCS.md             # Surface docs
├── docs.css            # Surface styles  
├── layout.tsx          # Layout
├── _surface/
│   └── docs-shell.tsx  # Shell component
└── docs/               # All pages
    ├── core/
    ├── design/
    ├── components/
    └── surfaces/`}
        />
      </section>

      {/* Update Navigation */}
      <section className="space-y-4">
        <TaskCard
          icon={LinkIcon}
          title="Clean up navigation"
          ask="Remove all references to the Docs surface"
          description="Remove the navigation config and any links pointing to /docs routes."
          details={[
            "Delete docsNavItems from lib/navigation.ts",
            "Search for /docs links in other surfaces",
            "Update or remove cross-surface navigation",
          ]}
          code={`// lib/navigation.ts

// DELETE this entire export:
export const docsNavItems: NavGroup[] = [
  // ...
]

// Search for remaining references:
grep -r "/docs" app/
grep -r "docsNavItems" app/`}
        />
      </section>

      {/* Clean Up Proxy */}
      <section className="space-y-4">
        <TaskCard
          icon={ShieldIcon}
          title="Update proxy middleware"
          ask="Remove docs-related logic from middleware"
          description="Remove docs routing logic from proxy.ts if you are deleting the docs surface."
          details={[
            "Remove the /docs production visibility check",
            "Remove any docs-specific redirects",
          ]}
          code={`// proxy.ts

// Remove any docs-specific logic:
// - Password checking for /docs routes
// - Redirects for unauthenticated docs access
// - Session cookie handling for docs

`}
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
              <code className="bg-muted rounded px-1 text-xs">app/(docs)/</code>{" "}
              folder deleted
            </ChecklistItem>
            <ChecklistItem checked>
              <code className="bg-muted rounded px-1 text-xs">docsNavItems</code>{" "}
              removed from navigation.ts
            </ChecklistItem>
            <ChecklistItem checked>
              No broken links to /docs routes
            </ChecklistItem>
            <ChecklistItem checked>
              Docs-related proxy logic removed
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
                &ldquo;Check for any remaining references to the Docs surface&rdquo;
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
              href="/docs/develop/authentication"
              className="text-primary hover:underline"
            >
              Authentication
            </Link>{" "}
            — If using password protection
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
