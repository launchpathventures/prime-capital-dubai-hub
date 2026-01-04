/**
 * CATALYST - Development Helpers
 *
 * Utility functions, hooks, and shared patterns available in the kit.
 * For prompts and templates, see the Prompts section.
 */

"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { BellIcon } from "lucide-react"
import { DocsAccordionPage } from "../../../_surface/docs-accordion-page"

// =============================================================================
// HELPER DATA
// =============================================================================

type HelperInfo = {
  name: string
  slug: string
  location: string
  category: "hook" | "utility" | "component" | "config"
  description: string
  usage: React.ReactNode
  extending?: React.ReactNode
  example?: React.ReactNode
}

const HELPERS: HelperInfo[] = [
  // === OVERVIEW ===
  {
    name: "Overview",
    slug: "overview",
    location: "lib/",
    category: "utility",
    description:
      "Development helpers are reusable utilities, hooks, and shared components. Check HELPERS.md for a quick reference.",
    usage: (
      <div className="space-y-3">
        <p className="text-muted-foreground text-sm">
          Key locations for development helpers:
        </p>
        <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
          <li>
            <code className="bg-muted rounded px-1">lib/hooks/</code> — React hooks for common patterns
          </li>
          <li>
            <code className="bg-muted rounded px-1">lib/utils.ts</code> — Utility functions (cn, etc.)
          </li>
          <li>
            <code className="bg-muted rounded px-1">lib/config.ts</code> — App configuration
          </li>
          <li>
            <code className="bg-muted rounded px-1">components/shared/</code> — Shared UI components
          </li>
        </ul>
      </div>
    ),
  },

  // === CONFIG ===
  {
    name: "Config",
    slug: "config",
    location: "lib/config.ts",
    category: "config",
    description:
      "Central configuration for app name, feature flags, and external links. Never hardcode values — use config.",
    usage: (
      <div className="space-y-3">
        <p className="text-muted-foreground text-sm">
          Import and use config values:
        </p>
        <pre className="bg-muted overflow-x-auto rounded-lg p-3 text-sm">
{`import { config } from "@/lib/config"

// App info
config.app.name           // "Catalyst"
config.app.tagline        // App description

// Feature flags
config.features.showDocsInProduction

// External links
config.links.github       // GitHub repo URL
config.links.docs         // Docs URL`}
        </pre>
      </div>
    ),
    extending: (
      <div className="space-y-3">
        <p className="text-muted-foreground text-sm">
          Add new config values to <code className="bg-muted rounded px-1">lib/config.ts</code>:
        </p>
        <pre className="bg-muted overflow-x-auto rounded-lg p-3 text-sm">
{`export const config = {
  app: { ... },
  features: {
    // Add new feature flags here
    myNewFeature: process.env.NEXT_PUBLIC_MY_FEATURE === "true",
  },
  links: {
    // Add new external links here
    support: "https://support.example.com",
  },
}`}
        </pre>
      </div>
    ),
  },

  // === UTILITIES ===
  {
    name: "URL Toast",
    slug: "url-toast",
    location: "components/shared/url-toast.tsx",
    category: "component",
    description:
      "Shows toast notifications via URL query params. Useful for showing feedback after redirects (e.g., after login, logout, form submission).",
    usage: (
      <div className="space-y-3">
        <p className="text-muted-foreground text-sm">
          Add a <code className="bg-muted rounded px-1">toast</code> query param to any URL:
        </p>
        <pre className="bg-muted overflow-x-auto rounded-lg p-3 text-sm">
{`/any-page?toast=logged-in    → Shows "Logged in" success toast
/any-page?toast=logged-out   → Shows "Logged out" success toast`}
        </pre>
        <p className="text-muted-foreground text-sm">
          The toast param is automatically removed from the URL after display.
        </p>
      </div>
    ),
    extending: (
      <div className="space-y-3">
        <p className="text-muted-foreground text-sm">
          Add entries to <code className="bg-muted rounded px-1">TOAST_MESSAGES</code> in{" "}
          <code className="bg-muted rounded px-1">url-toast.tsx</code>:
        </p>
        <pre className="bg-muted overflow-x-auto rounded-lg p-3 text-sm">
{`const TOAST_MESSAGES = {
  "logged-in": { message: "Logged in", type: "success" },
  "logged-out": { message: "Logged out", type: "success" },
  "saved": { message: "Changes saved", type: "success" },
  "error": { message: "Something went wrong", type: "error" },
}`}
        </pre>
      </div>
    ),
    example: (
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => toast.success("Logged in")}
        >
          <BellIcon className="mr-2 h-4 w-4" />
          Preview: logged-in
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => toast.success("Logged out")}
        >
          <BellIcon className="mr-2 h-4 w-4" />
          Preview: logged-out
        </Button>
      </div>
    ),
  },

  // === HOOKS ===
  {
    name: "useHashState",
    slug: "use-hash-state",
    location: "lib/hooks/use-hash-state.ts",
    category: "hook",
    description:
      "Syncs component state with the URL hash for shareable deep links. Works with Tabs, Accordion, or any value that should persist in the URL.",
    usage: (
      <div className="space-y-3">
        <p className="text-muted-foreground text-sm">
          Use with <code className="bg-muted rounded px-1">Tabs</code> or{" "}
          <code className="bg-muted rounded px-1">Accordion</code> for URL-synced navigation:
        </p>
        <pre className="bg-muted overflow-x-auto rounded-lg p-3 text-sm">
{`import { useHashState } from "@/lib/hooks"

// Key-value format: #section=general
const [section, setSection] = useHashState("section", "general")

// Simple format: #general
const [section, setSection] = useSimpleHashState("general")

// Use with Tabs
<Tabs value={section} onValueChange={setSection}>
  <TabsList>
    <TabsButton value="general">General</TabsButton>
    <TabsButton value="security">Security</TabsButton>
  </TabsList>
</Tabs>`}
        </pre>
      </div>
    ),
    extending: (
      <div className="space-y-3">
        <p className="text-muted-foreground text-sm">
          Two variants are available:
        </p>
        <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
          <li>
            <code className="bg-muted rounded px-1">useHashState(key, default)</code> — Key-value format: <code className="bg-muted rounded px-1">#key=value</code>
          </li>
          <li>
            <code className="bg-muted rounded px-1">useSimpleHashState(default)</code> — Simple format: <code className="bg-muted rounded px-1">#value</code>
          </li>
        </ul>
        <p className="text-muted-foreground text-sm">
          Both are SSR-safe and handle browser back/forward navigation.
        </p>
      </div>
    ),
  },

  // === CN UTILITY ===
  {
    name: "cn (classnames)",
    slug: "cn",
    location: "lib/utils.ts",
    category: "utility",
    description:
      "Merges Tailwind classes with proper conflict resolution. Combines clsx and tailwind-merge.",
    usage: (
      <div className="space-y-3">
        <pre className="bg-muted overflow-x-auto rounded-lg p-3 text-sm">
{`import { cn } from "@/lib/utils"

// Merge classes with conflict resolution
cn("px-4 py-2", "px-6")  // "py-2 px-6"

// Conditional classes
cn("base-class", isActive && "active-class")

// Component pattern
function Button({ className, ...props }) {
  return (
    <button className={cn("btn-base", className)} {...props} />
  )
}`}
        </pre>
      </div>
    ),
  },

  // === COPY BUTTON ===
  {
    name: "CopyButton",
    slug: "copy-button",
    location: "components/shared/copy-button.tsx",
    category: "component",
    description:
      "Button that copies text to clipboard with visual feedback. Shows a checkmark when copied.",
    usage: (
      <div className="space-y-3">
        <pre className="bg-muted overflow-x-auto rounded-lg p-3 text-sm">
{`import { CopyButton } from "@/components/shared"

<CopyButton value="text to copy" />

// With custom label
<CopyButton value={code} label="Copy code" />`}
        </pre>
      </div>
    ),
  },

  // === THEME TOGGLE ===
  {
    name: "ThemeToggle",
    slug: "theme-toggle",
    location: "components/shared/theme-toggle.tsx",
    category: "component",
    description:
      "Toggle button for light/dark/system theme. Uses next-themes under the hood.",
    usage: (
      <div className="space-y-3">
        <pre className="bg-muted overflow-x-auto rounded-lg p-3 text-sm">
{`import { ThemeToggle } from "@/components/shared"

// In a header or nav
<ThemeToggle />`}
        </pre>
        <p className="text-muted-foreground text-sm">
          Requires <code className="bg-muted rounded px-1">ThemeProvider</code> to be set up in your layout.
        </p>
      </div>
    ),
  },
]

// =============================================================================
// MAIN PAGE
// =============================================================================

export default function HelpersPage() {
  return (
    <DocsAccordionPage
      title="Helpers"
      description="Development utilities, hooks, and shared components."
      items={HELPERS}
      searchPlaceholder="Search helpers..."
      filterFn={(helper, term) =>
        helper.name.toLowerCase().includes(term) ||
        helper.slug.toLowerCase().includes(term) ||
        helper.location.toLowerCase().includes(term)
      }
      showOverview={false}
      renderTrigger={(helper) => (
        <div className="flex items-center gap-3">
          <span className="font-medium">{helper.name}</span>
          <Badge
            variant={
              helper.category === "hook"
                ? "default"
                : helper.category === "component"
                  ? "secondary"
                  : "outline"
            }
            className="text-xs capitalize"
          >
            {helper.category}
          </Badge>
        </div>
      )}
      renderItem={(helper) => (
        <>
          {/* Description */}
          <p className="text-muted-foreground">{helper.description}</p>

          {/* Location */}
          {helper.slug !== "overview" && (
            <div>
              <h4 className="mb-2 text-sm font-medium">Location</h4>
              <code className="bg-muted rounded px-2 py-1 text-sm">
                {helper.location}
              </code>
            </div>
          )}

          {/* Usage */}
          <div>
            <h4 className="mb-2 text-sm font-medium">Usage</h4>
            {helper.usage}
          </div>

          {/* Extending */}
          {helper.extending && (
            <div>
              <h4 className="mb-2 text-sm font-medium">Extending</h4>
              {helper.extending}
            </div>
          )}

          {/* Live Example */}
          {helper.example && (
            <div>
              <h4 className="mb-2 text-sm font-medium">Try it</h4>
              {helper.example}
            </div>
          )}
        </>
      )}
      afterAccordion={
        <section className="space-y-4">
          {/* Reference to Prompts */}
          <div className="border-border rounded-lg border bg-amber-50/50 p-4 dark:bg-amber-950/20">
            <h3 className="font-medium">Looking for prompts or templates?</h3>
            <p className="text-muted-foreground mt-1 text-sm">
              AI prompts, project templates, and artefact structures are in the{" "}
              <Link href="/docs/prompts" className="text-primary hover:underline">
                Prompts section
              </Link>
              .
            </p>
          </div>

          {/* AI Reference */}
          <div className="border-border rounded-lg border border-dashed p-4">
            <h3 className="font-medium">AI Reference</h3>
            <p className="text-muted-foreground text-sm">
              For a machine-readable helper list, see{" "}
              <code className="bg-muted rounded px-1">HELPERS.md</code> in the project root.
            </p>
          </div>
        </section>
      }
    />
  )
}
