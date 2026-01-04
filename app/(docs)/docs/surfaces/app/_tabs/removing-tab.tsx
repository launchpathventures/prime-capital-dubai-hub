/**
 * CATALYST - App Surface Doc Tab: Removal
 *
 * How to cleanly remove this surface from your project.
 * Written for catalyst devs (AI-first).
 */

import Link from "next/link"
import { AlertTriangleIcon, CheckCircle2Icon, SparklesIcon, TrashIcon, LinkIcon, ShieldIcon } from "lucide-react"
import { Text, Row, Stack } from "@/components/core"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export function RemovalTab() {
  return (
    <div className="space-y-10">
      {/* ------------------------------------------------------------------ */}
      {/* Summary */}
      {/* ------------------------------------------------------------------ */}
      <section className="space-y-4">
        <div className="border-primary bg-primary/5 rounded-lg border-l-4 p-5 space-y-3">
          <p className="text-lg font-medium leading-snug">
            Removing the App surface
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Surfaces are self-contained by design. Everything lives in one folder —
            delete it and clean up a few references. This guide walks through the process.
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Before You Start */}
      {/* ------------------------------------------------------------------ */}
      <section className="space-y-4">
        <div className="bg-amber-500/5 border border-amber-500/30 rounded-lg p-4">
          <Row gap="sm" className="items-start">
            <AlertTriangleIcon className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="space-y-2">
              <Text weight="medium">Before you delete</Text>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• The App surface is the default redirect after login</li>
                <li>• If using auth, you'll need to update the redirect target</li>
                <li>• Make sure no other surfaces link to /app routes</li>
              </ul>
            </div>
          </Row>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Delete the Surface */}
      {/* ------------------------------------------------------------------ */}
      <section className="space-y-4">
        <TaskCard
          icon={TrashIcon}
          title="Delete the surface"
          ask="Remove the App surface from my project"
          description="Delete the entire app/(app)/ folder. This removes the shell, styles, routes, and docs in one action."
          details={[
            "All routes under /app will stop working",
            "CSS and shell are colocated — no cleanup in other folders",
            "The layout, surface docs, and all pages are gone",
          ]}
          code={`# Delete the folder
rm -rf app/(app)

# What gets deleted:
app/(app)/
├── APP.md              # Surface docs
├── app.css             # Surface styles  
├── layout.tsx          # Layout
├── _surface/
│   └── app-shell.tsx   # Shell component
└── app/                # All routes
    ├── dashboard/
    ├── settings/
    └── profile/`}
        />
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Update Navigation */}
      {/* ------------------------------------------------------------------ */}
      <section className="space-y-4">
        <TaskCard
          icon={LinkIcon}
          title="Clean up navigation"
          ask="Remove all references to the App surface"
          description="Remove the navigation config and any links pointing to /app routes."
          details={[
            "Delete appNavItems from lib/navigation.ts",
            "Search for /app links in other surfaces",
            "Update or remove any cross-surface navigation",
          ]}
          code={`// lib/navigation.ts

// DELETE this entire export:
export const appNavItems: NavGroup[] = [
  // ...
]

// Search for remaining references:
grep -r "/app" app/`}
        />
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Update Auth */}
      {/* ------------------------------------------------------------------ */}
      <section className="space-y-4">
        <TaskCard
          icon={ShieldIcon}
          title="Update auth redirects"
          ask="Change the login redirect from /app to [new destination]"
          description="If using authentication, update where users go after login."
          details={[
            "Auth callback defaults to redirecting to /app",
            "Change this to your new destination (e.g., /dashboard, /)",
            "Also update any logout redirects if needed",
          ]}
          code={`// app/api/auth/callback/route.ts

// Change the redirect destination:
return NextResponse.redirect(
  new URL('/dashboard', origin)  // ← Update this
)`}
        />
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Verification */}
      {/* ------------------------------------------------------------------ */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Verify removal</h2>
        <p className="text-muted-foreground">
          Run these checks to make sure everything is cleaned up:
        </p>

        <div className="bg-card rounded-lg border p-5 space-y-3">
          <ul className="space-y-2">
            <ChecklistItem checked>
              <code className="bg-muted rounded px-1 text-xs">app/(app)/</code> folder deleted
            </ChecklistItem>
            <ChecklistItem checked>
              <code className="bg-muted rounded px-1 text-xs">appNavItems</code> removed from navigation.ts
            </ChecklistItem>
            <ChecklistItem checked>
              No broken links to /app routes
            </ChecklistItem>
            <ChecklistItem checked>
              Auth redirect updated (if using auth)
            </ChecklistItem>
            <ChecklistItem checked>
              Build passes: <code className="bg-muted rounded px-1 text-xs">pnpm build</code>
            </ChecklistItem>
          </ul>
        </div>

        <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
          <Row gap="sm" className="items-start">
            <SparklesIcon className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <div>
              <Text size="xs" variant="muted" className="uppercase tracking-wide">Ask AI</Text>
              <Text size="sm" className="mt-0.5">"Check for any remaining references to the App surface"</Text>
            </div>
          </Row>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Related */}
      {/* ------------------------------------------------------------------ */}
      <section className="bg-card space-y-3 rounded-lg border p-5">
        <h3 className="font-medium">Related docs</h3>
        <ul className="text-muted-foreground space-y-2 text-sm">
          <li>
            <Link href="/docs/surfaces" className="text-primary hover:underline">
              Surfaces Overview
            </Link>{" "}
            — How surfaces work and why they're self-contained
          </li>
          <li>
            <Link href="/docs/develop/authentication" className="text-primary hover:underline">
              Authentication
            </Link>{" "}
            — Updating auth redirects and protection
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
  checked 
}: { 
  children: React.ReactNode
  checked?: boolean 
}) {
  return (
    <li className="flex items-start gap-2 text-sm">
      <div className={`mt-0.5 h-4 w-4 rounded border flex items-center justify-center shrink-0 ${checked ? 'bg-primary border-primary' : 'border-muted-foreground/30'}`}>
        {checked && <CheckCircle2Icon className="h-3 w-3 text-primary-foreground" />}
      </div>
      <span>{children}</span>
    </li>
  )
}
