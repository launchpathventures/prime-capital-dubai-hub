/**
 * CATALYST - Web Surface Doc Tab: Develop
 *
 * How to build in the Web surface — written for catalyst devs (AI-first).
 * Audience: stakeholder → catalyst dev → technical dev
 */

import {
  CheckCircle2Icon,
  SparklesIcon,
  FileCodeIcon,
  NavigationIcon,
  LayoutIcon,
  LoaderIcon,
  ImageIcon,
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
            Building in the Web surface
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Add pages, build content sections, connect to a CMS, or create a
            full website. Each task shows what to ask AI first, then technical
            details for reference.
          </p>
        </div>
      </section>

      {/* How to Work with AI */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Working with AI</h2>
        <p className="text-muted-foreground">
          Describe what you want in plain language. AI handles the
          implementation.
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
                &ldquo;Build a full company website with home, about, services,
                and contact pages&rdquo;
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary shrink-0">→</span>
              <span className="text-sm">
                &ldquo;Create a blog that fetches posts from Supabase&rdquo;
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary shrink-0">→</span>
              <span className="text-sm">
                &ldquo;Add a portfolio page with project cards and filtering&rdquo;
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary shrink-0">→</span>
              <span className="text-sm">
                &ldquo;Create a pricing page with three tiers and FAQ section&rdquo;
              </span>
            </li>
          </ul>
          <p className="text-muted-foreground border-t pt-3 text-xs">
            AI reads the project docs (AGENTS.md, WEB.md) and knows the
            conventions. You focus on <em>what</em> you want, AI handles{" "}
            <em>how</em>.
          </p>
        </div>
      </section>

      {/* Add a Page */}
      <section className="space-y-4">
        <TaskCard
          icon={FileCodeIcon}
          title="Add a page"
          ask="Add a new [About] page to the web surface"
          description="Unlike other surfaces, Web pages are top-level by default — just like a traditional website. Create folders directly in app/(web)/ for URLs like /about, /pricing, /contact."
          details={[
            "Pages automatically get the header and footer",
            "URL matches the folder name: /about, /pricing, etc.",
            "If you do want /web/... URLs for isolation, use app/(web)/web/",
          ]}
          files={[{ path: "app/(web)/about/page.tsx", note: "Creates /about" }]}
          example={`// app/(web)/about/page.tsx → /about

/**
 * CATALYST - About Page
 */

import { Title, Text, Stack } from "@/components/core"

export default function AboutPage() {
  return (
    <Stack gap="xl" className="py-16">
      {/* Hero section */}
      <section className="text-center px-4">
        <Title size="h1" align="center">About Us</Title>
        <Text variant="muted" className="mt-4 max-w-2xl mx-auto">
          We're building the future of software development.
        </Text>
      </section>
      
      {/* Content sections */}
      {/* ... */}
    </Stack>
  )
}`}
        />
      </section>

      {/* Add to Navigation */}
      <section className="space-y-4">
        <TaskCard
          icon={NavigationIcon}
          title="Add to navigation"
          ask="Add an [About] link to the header navigation"
          description="Header navigation is defined in lib/navigation.ts. Add an item to webNavItems."
          details={[
            "webNavItems appears in the main header",
            "webMoreItems appears in the 'More' dropdown",
            "Keep the main nav focused — use dropdown for secondary links",
          ]}
          files={[{ path: "lib/navigation.ts", note: "Navigation configuration" }]}
          example={`// lib/navigation.ts

export const webNavItems: NavItem[] = [
  { label: "Build Web", href: "/web" },
  { label: "Build Apps", href: "/app" },
  { label: "About", href: "/about" },  // ← Add here
]

// For less prominent links, use the dropdown:
export const webMoreItems: NavItem[] = [
  { label: "Examples", href: "/examples" },
  { label: "Blog", href: "/blog" },
]`}
        />
      </section>

      {/* Marketing Sections */}
      <section className="space-y-4">
        <TaskCard
          icon={LayoutIcon}
          title="Marketing sections"
          ask="Add a features section with icons and descriptions"
          description="Marketing pages use full-width sections with consistent spacing. Build modular sections that can be reordered."
          details={[
            "Use full-width sections with centered content",
            "Alternate background colors for visual rhythm",
            "Include clear CTAs in each major section",
          ]}
          files={[]}
          example={`// Common section pattern
<section className="py-16 bg-muted/30">
  <div className="max-w-6xl mx-auto px-4">
    <div className="text-center mb-12">
      <Title size="h2">Features</Title>
      <Text variant="muted">Everything you need to ship faster</Text>
    </div>
    
    <div className="grid md:grid-cols-3 gap-8">
      <FeatureCard 
        icon={ZapIcon} 
        title="Fast" 
        description="..." 
      />
      {/* More cards */}
    </div>
  </div>
</section>`}
        />
      </section>

      {/* Images and Media */}
      <section className="space-y-4">
        <TaskCard
          icon={ImageIcon}
          title="Images and media"
          ask="Add a hero image with responsive sizing"
          description="Use Next.js Image component for optimized loading. Store marketing assets in public/images/."
          details={[
            "Use next/image for automatic optimization",
            "Provide explicit width/height for layout stability",
            "Use priority prop for above-the-fold images",
          ]}
          files={[{ path: "public/images/", note: "Image assets" }]}
          example={`import Image from "next/image"

// Hero image example
<div className="relative aspect-video">
  <Image
    src="/images/hero.png"
    alt="Product screenshot"
    fill
    className="object-cover rounded-xl"
    priority
  />
</div>

// Feature illustration
<Image
  src="/images/feature-1.png"
  alt="Feature description"
  width={400}
  height={300}
  className="rounded-lg shadow-lg"
/>`}
        />
      </section>

      {/* Loading States */}
      <section className="space-y-4">
        <TaskCard
          icon={LoaderIcon}
          title="Loading states"
          ask="Add a loading state for the blog page"
          description="Add a loading.tsx file next to your page. Next.js shows it while the page loads."
          details={[
            "Keep loading states simple for marketing pages",
            "Match the general layout shape",
            "Loading states are optional but improve perceived performance",
          ]}
          files={[{ path: "app/(web)/web/blog/loading.tsx", note: "Loading state" }]}
          example={`// app/(web)/web/blog/loading.tsx

import { Skeleton } from "@/components/ui/skeleton"
import { Stack } from "@/components/core"

export default function Loading() {
  return (
    <Stack gap="lg" className="py-16 px-4 max-w-4xl mx-auto">
      <Skeleton className="h-12 w-64 mx-auto" />
      <Skeleton className="h-6 w-96 mx-auto" />
      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
      </div>
    </Stack>
  )
}`}
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
                  app/(web)/web/
                </code>{" "}
                — Your pages
              </li>
              <li>
                <code className="bg-muted rounded px-1 text-xs">
                  lib/navigation.ts
                </code>{" "}
                — Header links
              </li>
              <li>
                <code className="bg-muted rounded px-1 text-xs">
                  public/images/
                </code>{" "}
                — Marketing assets
              </li>
            </ul>
          </div>
          <div>
            <Text size="sm" weight="medium" className="mb-2">
              Common asks
            </Text>
            <ul className="text-muted-foreground space-y-1 text-sm">
              <li>&ldquo;Add a landing page for...&rdquo;</li>
              <li>&ldquo;Create a pricing section...&rdquo;</li>
              <li>&ldquo;Add testimonials from...&rdquo;</li>
              <li>&ldquo;Build a feature comparison...&rdquo;</li>
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
