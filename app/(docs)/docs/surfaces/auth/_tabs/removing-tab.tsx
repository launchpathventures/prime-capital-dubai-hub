/**
 * CATALYST - Auth Surface Doc Tab: Removal
 *
 * How to cleanly remove this surface from your project.
 * Written for catalyst devs (AI-first).
 */

import Link from "next/link"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  AlertTriangleIcon,
  CheckCircle2Icon,
  SparklesIcon,
  TrashIcon,
  LinkIcon,
  ServerIcon,
} from "lucide-react"
import { Text, Row } from "@/components/core"

export function RemovalTab() {
  return (
    <div className="space-y-10">
      {/* Summary */}
      <section className="space-y-4">
        <div className="border-primary bg-primary/5 space-y-3 rounded-lg border-l-4 p-5">
          <p className="text-lg font-medium leading-snug">
            Removing the Auth surface
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Surfaces are self-contained by design. However, auth connects to
            multiple parts of the app — API routes, middleware, and the App
            surface. This guide covers all the cleanup.
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
                <li>• The App surface depends on auth for protection</li>
                <li>• You&apos;ll need alternative authentication if using App surface</li>
                <li>• API routes in /api/auth/ must also be removed</li>
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
          ask="Remove the Auth surface from my project"
          description="Delete the entire app/(auth)/ folder. This removes all auth pages and the shell."
          details={[
            "All routes under /auth will stop working",
            "CSS and shell are colocated — no cleanup in other folders",
            "Also delete API routes and update middleware",
          ]}
          code={`# Delete the folder
rm -rf app/(auth)

# What gets deleted:
app/(auth)/
├── AUTH.md               # Surface docs
├── auth.css              # Surface styles  
├── layout.tsx            # Layout
├── _surface/
│   ├── auth-shell.tsx    # Shell
│   └── auth-card.tsx     # Card component
└── auth/
    ├── login/
    ├── register/
    ├── forgot-password/
    └── reset-password/`}
        />
      </section>

      {/* Delete API Routes */}
      <section className="space-y-4">
        <TaskCard
          icon={ServerIcon}
          title="Delete API routes"
          ask="Remove auth API routes"
          description="Auth uses API routes for callbacks, sign out, and validation. Remove these too."
          details={[
            "Delete the entire app/api/auth/ folder",
            "Remove any auth-related environment variables if not needed",
            "Update or remove the auth config file",
          ]}
          code={`# Delete auth API routes
rm -rf app/api/auth

# What gets deleted:
app/api/auth/
├── callback/
│   └── route.ts          # Supabase callback
├── signout/
│   └── route.ts          # Sign out handler
├── validate-password/
│   └── route.ts          # Password mode
├── validate-custom/
│   └── route.ts          # Custom mode
└── delete-account/
    └── route.ts          # Account deletion

# Also clean up:
rm -rf lib/auth/          # Auth utilities (if not needed)`}
        />
      </section>

      {/* Update Middleware */}
      <section className="space-y-4">
        <TaskCard
          icon={LinkIcon}
          title="Update middleware"
          ask="Remove auth checks from middleware"
          description="The proxy.ts middleware checks authentication. Update it if you're removing auth."
          details={[
            "Remove auth session checks from proxy.ts",
            "Remove redirect to /auth/login logic",
            "Keep other middleware functionality if needed",
          ]}
          code={`// proxy.ts

// REMOVE auth-related logic:

// Before:
if (isProtectedRoute && !session) {
  return NextResponse.redirect(
    new URL('/auth/login', request.url)
  )
}

// After:
// Either remove protection entirely, or use alternative auth

// If keeping App surface without auth:
// - Make all /app routes public
// - Or integrate with your own auth system`}
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
              <code className="bg-muted rounded px-1 text-xs">app/(auth)/</code>{" "}
              folder deleted
            </ChecklistItem>
            <ChecklistItem checked>
              <code className="bg-muted rounded px-1 text-xs">app/api/auth/</code>{" "}
              folder deleted
            </ChecklistItem>
            <ChecklistItem checked>
              Auth checks removed from middleware
            </ChecklistItem>
            <ChecklistItem checked>
              No broken links to /auth routes
            </ChecklistItem>
            <ChecklistItem checked>
              App surface still works (or has alternative protection)
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
                &ldquo;Check for any remaining references to the Auth surface&rdquo;
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
            — Full auth documentation
          </li>
          <li>
            <Link
              href="/docs/surfaces/app"
              className="text-primary hover:underline"
            >
              App Surface
            </Link>{" "}
            — Depends on auth for protection
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
        {checked && (
          <CheckCircle2Icon className="h-3 w-3 text-primary-foreground" />
        )}
      </div>
      <span>{children}</span>
    </li>
  )
}
