/**
 * CATALYST - Docs Surface Doc Tab: Develop
 *
 * How to build in the Docs surface — written for catalyst devs (AI-first).
 * Audience: stakeholder → catalyst dev → technical dev
 */

import {
  CheckCircle2Icon,
  SparklesIcon,
  FileCodeIcon,
  NavigationIcon,
  LayoutIcon,
  BookMarkedIcon,
  MessageSquareQuoteIcon,
} from "lucide-react"
import { Text, Row } from "@/components/core"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export function DevelopTab() {
  return (
    <div className="space-y-10">
      {/* Summary */}
      <section className="space-y-4">
        <div className="border-primary bg-primary/5 space-y-3 rounded-lg border-l-4 p-5">
          <p className="text-lg font-medium leading-snug">
            Building in the Docs surface
          </p>
          <p className="text-muted-foreground leading-relaxed">
            This guide shows you how to add documentation pages, organize
            content, and update navigation. Each section starts with what to ask
            AI, then shows the technical details for reference.
          </p>
        </div>
      </section>

      {/* How to Work with AI */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Working with AI</h2>
        <p className="text-muted-foreground">
          Catalyst is AI-first. When you need documentation, describe what you
          want in plain language. The AI will handle the structure and formatting.
        </p>

        <div className="bg-card space-y-4 rounded-lg border p-5">
          <Row gap="sm" className="items-center">
            <SparklesIcon className="text-primary h-5 w-5" />
            <Text weight="medium">Example prompts</Text>
          </Row>
          <ul className="space-y-3">
            <li className="flex gap-3">
              <span className="text-primary shrink-0">→</span>
              <span className="text-sm">
                &ldquo;Add a new documentation page explaining our API
                authentication&rdquo;
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary shrink-0">→</span>
              <span className="text-sm">
                &ldquo;Create a setup guide with code examples for
                getting started&rdquo;
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary shrink-0">→</span>
              <span className="text-sm">
                &ldquo;Add a troubleshooting section with common error
                fixes&rdquo;
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary shrink-0">→</span>
              <span className="text-sm">
                &ldquo;Document our component library with examples&rdquo;
              </span>
            </li>
          </ul>
          <p className="text-muted-foreground border-t pt-3 text-xs">
            AI reads the project docs (AGENTS.md, DOCS.md) and knows the
            conventions. You focus on <em>what</em> to document, AI handles{" "}
            <em>how</em>.
          </p>
        </div>
      </section>

      {/* Add a Page */}
      <section className="space-y-4">
        <TaskCard
          icon={FileCodeIcon}
          title="Add a documentation page"
          ask="Add a new docs page about [API authentication]"
          description="Pages live under app/(docs)/docs/. Create a folder with the topic name, then add page.tsx inside."
          details={[
            "Pages automatically get the sidebar navigation",
            "The URL will be /docs/[topic]",
            "Use Prose component for formatted content",
          ]}
          files={[
            { path: "app/(docs)/docs/api-auth/page.tsx", note: "Your new page" },
          ]}
          example={`// app/(docs)/docs/api-auth/page.tsx

/**
 * CATALYST - API Authentication Docs
 */

import { Prose } from "@/components/core"

export default function ApiAuthPage() {
  return (
    <article>
      <Prose>
        <h1>API Authentication</h1>
        <p className="lead">
          Learn how to authenticate requests to our API.
        </p>
        
        <h2>Getting an API Key</h2>
        <p>Navigate to Settings → API Keys to create a new key.</p>
        
        <h2>Using Your Key</h2>
        <pre><code>
Authorization: Bearer YOUR_API_KEY
        </code></pre>
      </Prose>
    </article>
  )
}`}
        />
      </section>

      {/* Add to Navigation */}
      <section className="space-y-4">
        <TaskCard
          icon={NavigationIcon}
          title="Add to navigation"
          ask="Add [API Auth] to the docs sidebar under [Documentation]"
          description="Sidebar navigation is defined in lib/navigation.ts. Add an item to the appropriate group in docsNavItems."
          details={[
            "Navigation uses groups: Documentation, Surfaces, Design System, Components",
            "Order items logically — readers scan top to bottom",
            "Consider creating new groups for large topic areas",
          ]}
          files={[
            { path: "lib/navigation.ts", note: "Navigation configuration" },
          ]}
          example={`// lib/navigation.ts

export const docsNavItems: NavGroup[] = [
  {
    label: "Documentation",
    icon: BookOpenIcon,
    items: [
      { label: "Introduction", href: "/docs" },
      { label: "Setup", href: "/docs/develop/setup" },
      { label: "API Auth", href: "/docs/api-auth" },  // ← Add here
    ],
  },
  // ... other groups
]`}
        />
      </section>

      {/* Content Structure */}
      <section className="space-y-4">
        <TaskCard
          icon={LayoutIcon}
          title="Content structure"
          ask="Add a docs page with code examples and callouts"
          description="Documentation pages follow a consistent structure: title, intro, sections with examples."
          details={[
            "Use Prose component for formatted content",
            "Add code blocks with syntax highlighting",
            "Use callouts for important notes and warnings",
          ]}
          files={[]}
          example={`// Common documentation structure
<article className="mx-auto max-w-4xl space-y-8">
  <Prose>
    <h1>Page Title</h1>
    <p className="lead">
      One-line description of what this page covers.
    </p>
    
    <h2>Section One</h2>
    <p>Explanation text...</p>
    
    {/* Code block */}
    <pre><code>
const example = "code here"
    </code></pre>
    
    {/* Callout */}
    <div className="bg-amber-500/5 border-amber-500/30 rounded-lg border p-4">
      <p><strong>Warning:</strong> Important note here.</p>
    </div>
  </Prose>
</article>`}
        />
      </section>

      {/* Code Examples */}
      <section className="space-y-4">
        <TaskCard
          icon={BookMarkedIcon}
          title="Code examples"
          ask="Add a code example with copy button"
          description="Good documentation includes runnable code. Make examples easy to copy."
          details={[
            "Use language-specific syntax highlighting",
            "Show complete, working examples",
            "Add comments explaining key parts",
          ]}
          files={[]}
          example={`// Code block with copy button
<div className="bg-muted/50 group relative rounded-lg border">
  <div className="flex items-center justify-between border-b px-4 py-2">
    <span className="text-xs text-muted-foreground">TypeScript</span>
    <button className="opacity-0 group-hover:opacity-100">
      <CopyIcon className="h-4 w-4" />
    </button>
  </div>
  <pre className="p-4 overflow-x-auto">
    <code>{\`const greeting = "Hello, World!"
console.log(greeting)\`}</code>
  </pre>
</div>`}
        />
      </section>

      {/* Callouts */}
      <section className="space-y-4">
        <TaskCard
          icon={MessageSquareQuoteIcon}
          title="Callouts and notes"
          ask="Add an info callout explaining when to use this feature"
          description="Callouts highlight important information. Use different types for different purposes."
          details={[
            "Info — Additional context (blue)",
            "Tip — Helpful suggestions (primary)",
            "Warning — Potential issues (amber)",
            "Success — Confirmation (green)",
          ]}
          files={[]}
          example={`// Info callout
<div className="bg-blue-500/5 border-blue-500/30 rounded-lg border p-4">
  <div className="flex gap-3">
    <InfoIcon className="h-5 w-5 text-blue-500 shrink-0" />
    <div>
      <p className="font-medium">Note</p>
      <p className="text-sm text-muted-foreground">
        Additional context that helps understanding.
      </p>
    </div>
  </div>
</div>

// Warning callout  
<div className="bg-amber-500/5 border-amber-500/30 rounded-lg border p-4">
  <div className="flex gap-3">
    <AlertCircleIcon className="h-5 w-5 text-amber-500 shrink-0" />
    <div>
      <p className="font-medium">Warning</p>
      <p className="text-sm text-muted-foreground">
        Important information about potential issues.
      </p>
    </div>
  </div>
</div>`}
        />
      </section>

      {/* Quick Reference */}
      <section className="bg-card space-y-3 rounded-lg border p-5">
        <h3 className="font-medium">Quick reference</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Text size="sm" weight="medium" className="mb-2">
              Key locations
            </Text>
            <ul className="text-muted-foreground space-y-1 text-sm">
              <li>
                <code className="bg-muted rounded px-1 text-xs">
                  app/(docs)/docs/
                </code>{" "}
                — Your pages
              </li>
              <li>
                <code className="bg-muted rounded px-1 text-xs">
                  lib/navigation.ts
                </code>{" "}
                — Sidebar links
              </li>
              <li>
                <code className="bg-muted rounded px-1 text-xs">
                  components/core/prose.tsx
                </code>{" "}
                — Prose styling
              </li>
            </ul>
          </div>
          <div>
            <Text size="sm" weight="medium" className="mb-2">
              Common asks
            </Text>
            <ul className="text-muted-foreground space-y-1 text-sm">
              <li>&ldquo;Document how to...&rdquo;</li>
              <li>&ldquo;Add a guide for...&rdquo;</li>
              <li>&ldquo;Create API reference for...&rdquo;</li>
              <li>&ldquo;Add troubleshooting section...&rdquo;</li>
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

        {/* Files */}
        {files.length > 0 && (
          <div className="border-t pt-4">
            <Text size="xs" variant="muted" className="mb-2 uppercase tracking-wide">
              Files involved
            </Text>
            <ul className="space-y-1">
              {files.map((file, i) => (
                <li key={i} className="flex gap-2 text-sm">
                  <code className="bg-muted rounded px-1.5 py-0.5 text-xs">
                    {file.path}
                  </code>
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
