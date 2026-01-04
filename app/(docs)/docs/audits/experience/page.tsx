/**
 * CATALYST - Design & Experience Audit
 *
 * Structured UX review covering design consistency, interaction
 * quality, and responsive behavior across viewports.
 */

import Link from "next/link"
import { Stack, Text, Row } from "@/components/core"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  PaletteIcon,
  MousePointerClickIcon,
  SmartphoneIcon,
  ArrowLeftIcon,
  CircleIcon,
  ExternalLinkIcon,
  WrenchIcon,
  AlertCircleIcon,
  SwatchBookIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function ExperienceAuditPage() {
  return (
    <article>
      <Stack gap="xl">
        {/* Breadcrumb */}
        <Link
          href="/docs/audits"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm"
        >
          <ArrowLeftIcon className="h-3.5 w-3.5" />
          Back to Audits
        </Link>

        {/* Header */}
        <header className="space-y-3">
          <Row gap="sm" className="items-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pink-100 dark:bg-pink-900/30">
              <PaletteIcon className="h-5 w-5 text-pink-600 dark:text-pink-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Design &amp; Experience
              </h1>
              <Text variant="muted" className="italic">
                Is this pleasant to use?
              </Text>
            </div>
          </Row>
          <Text size="lg" variant="muted" className="leading-relaxed">
            Review design system adherence, interaction patterns, and responsive
            behavior. Ensure your app feels polished and consistent.
          </Text>
        </header>

        {/* ================================================================ */}
        {/* Stage expectations */}
        {/* ================================================================ */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Stage expectations</h2>
          <div className="grid gap-4 md:grid-cols-4">
            <StageCard
              stage="POC"
              level="Skip"
              expectations={[
                "Rough is fine at this stage",
                "Focus on functionality",
                "Polish comes later",
              ]}
            />
            <StageCard
              stage="MVP"
              level="Light"
              expectations={[
                "Core flows feel intentional",
                "Basic loading states exist",
                "Not obviously broken on mobile",
              ]}
            />
            <StageCard
              stage="MMP"
              level="Full"
              expectations={[
                "Design system fully applied",
                "All states handled gracefully",
                "Polished responsive experience",
              ]}
            />
            <StageCard
              stage="PROD"
              level="Complete"
              expectations={[
                "Production-grade across viewports",
                "Micro-interactions refined",
                "Consistent with brand guidelines",
              ]}
            />
          </div>
        </section>

        {/* ================================================================ */}
        {/* Tabbed Checklists */}
        {/* ================================================================ */}
        <Tabs defaultValue="design">
          <TabsList className="mb-4">
            <TabsTrigger value="design">
              <SwatchBookIcon className="h-4 w-4" />
              Design Consistency
            </TabsTrigger>
            <TabsTrigger value="interaction">
              <MousePointerClickIcon className="h-4 w-4" />
              Interaction Quality
            </TabsTrigger>
            <TabsTrigger value="responsive">
              <SmartphoneIcon className="h-4 w-4" />
              Responsive Behavior
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Design Consistency */}
          <TabsContent value="design">
            <Stack gap="lg">
              <ChecklistSection
                title="Design Tokens"
                stage="mvp"
                items={[
                  "Colors use CSS variables from design system (not hardcoded hex)",
                  "Spacing uses token values (gap-sm, gap-md, gap-lg)",
                  "Border radius consistent (uses design tokens)",
                  "Shadows use defined shadow tokens",
                  "No magic numbers for colors, spacing, or sizes",
                  "Dark mode uses inverted tokens correctly",
                ]}
              />

              <ChecklistSection
                title="Typography"
                stage="mvp"
                items={[
                  "Font family matches brand guidelines",
                  "Font sizes follow type scale (Text, Title components)",
                  "Font weights used consistently (regular, medium, semibold, bold)",
                  "Line heights appropriate for text size and context",
                  "No inline font styling that bypasses system",
                  "Heading hierarchy visually distinct",
                ]}
              />

              <ChecklistSection
                title="Spacing & Layout"
                stage="mmp"
                items={[
                  "Stack/Row/Grid primitives used for layout",
                  "Consistent gaps between sections",
                  "Padding consistent within similar components",
                  "Alignment is intentional (not default browser)",
                  "Visual rhythm maintained across pages",
                  "Whitespace used purposefully",
                ]}
              />

              <ChecklistSection
                title="Color Usage"
                stage="mmp"
                items={[
                  "Primary color used consistently for actions",
                  "Secondary colors have clear purpose",
                  "Semantic colors used correctly (success, warning, error)",
                  "Neutral colors for backgrounds and borders",
                  "Color palette not exceeded (no random colors)",
                  "Dark mode colors intentionally designed",
                ]}
              />

              <ChecklistSection
                title="Component Consistency"
                stage="mmp"
                items={[
                  "Buttons use consistent variants (primary, secondary, ghost)",
                  "Form inputs styled consistently",
                  "Cards have consistent border, shadow, padding",
                  "Icons from single icon set (Lucide)",
                  "Icon sizes consistent with context (16px, 20px, 24px)",
                  "No component style divergence between pages",
                ]}
              />

              <CommonIssues
                items={[
                  { issue: "Hardcoded color values in components", fix: "Replace with CSS variables: var(--color-primary)" },
                  { issue: "Inconsistent spacing between sections", fix: "Use Stack with gap-xl or consistent section spacing" },
                  { issue: "Mixed icon sets", fix: "Standardize on Lucide icons, replace outliers" },
                  { issue: "Typography sizes not from scale", fix: "Use Text size prop: sm, default, lg" },
                  { issue: "Custom one-off component styling", fix: "Extract to shared component or use existing UI component" },
                ]}
              />
            </Stack>
          </TabsContent>

          {/* Tab 2: Interaction Quality */}
          <TabsContent value="interaction">
            <Stack gap="lg">
              <ChecklistSection
                title="Loading States"
                stage="mvp"
                items={[
                  "Buttons show loading indicator during async actions",
                  "Page loading shows skeleton or spinner",
                  "Data fetching shows loading state",
                  "Loading states don't cause layout shift",
                  "Loading indicators animate smoothly",
                  "User cannot double-submit forms while loading",
                ]}
              />

              <ChecklistSection
                title="Error States"
                stage="mvp"
                items={[
                  "Error messages are human-readable (not technical)",
                  "Errors explain what went wrong",
                  "Errors suggest how to fix the problem",
                  "Error messages placed near the problem",
                  "Form field errors shown inline",
                  "Network errors handled gracefully",
                  "500 errors show friendly page",
                ]}
              />

              <ChecklistSection
                title="Empty States"
                stage="mmp"
                items={[
                  "Empty lists show helpful message",
                  "Empty states include call-to-action",
                  "Empty states have appropriate illustration or icon",
                  "Search with no results offers suggestions",
                  "Filters with no matches explain why",
                  "Empty dashboard guides first action",
                ]}
              />

              <ChecklistSection
                title="Success Feedback"
                stage="mmp"
                items={[
                  "Form submission shows success message",
                  "Toast notifications for background actions",
                  "Destructive actions require confirmation",
                  "Success states are clearly positive (green, checkmark)",
                  "Important actions have confirmation dialog",
                  "Undo available for reversible actions",
                ]}
              />

              <ChecklistSection
                title="Form Interactions"
                stage="mmp"
                items={[
                  "Validation shows on blur or submit (not while typing)",
                  "Required fields clearly indicated",
                  "Valid fields show positive feedback (optional)",
                  "Form progress saved or warned before leaving",
                  "Multi-step forms show progress indicator",
                  "Autocomplete enabled where appropriate",
                  "Input masks help with formatting (phone, date)",
                ]}
              />

              <ChecklistSection
                title="Hover & Active States"
                stage="mmp"
                items={[
                  "Buttons have visible hover state",
                  "Links have hover underline or color change",
                  "Clickable cards have hover treatment",
                  "Active/pressed state visually distinct",
                  "Disabled state clearly indicates non-interactive",
                  "Cursor changes appropriately (pointer, not-allowed)",
                ]}
              />

              <CommonIssues
                items={[
                  { issue: "No loading state on form submit", fix: "Add loading prop to Button, disable while pending" },
                  { issue: "Generic error message (Something went wrong)", fix: "Show specific error with actionable guidance" },
                  { issue: "Empty list shows nothing", fix: "Add EmptyState component with message and CTA" },
                  { issue: "No feedback after action", fix: "Add toast notification for success/failure" },
                  { issue: "Double submission on slow connection", fix: "Disable submit button during request" },
                ]}
              />
            </Stack>
          </TabsContent>

          {/* Tab 3: Responsive Behavior */}
          <TabsContent value="responsive">
            <Stack gap="lg">
              <ChecklistSection
                title="Mobile Layout"
                stage="mvp"
                items={[
                  "Layout usable at 320px width minimum",
                  "No horizontal scroll on mobile",
                  "Navigation accessible on mobile (hamburger menu, etc.)",
                  "Content readable without zooming",
                  "Images scale appropriately",
                  "Tables scroll horizontally or stack",
                ]}
              />

              <ChecklistSection
                title="Breakpoints"
                stage="mmp"
                items={[
                  "Consistent breakpoints used across app (sm, md, lg, xl)",
                  "Components respond to breakpoints predictably",
                  "Grid layouts adjust columns at breakpoints",
                  "Sidebar collapses at appropriate breakpoint",
                  "No content jumps between breakpoints",
                  "Tested at common device widths (375, 768, 1024, 1280)",
                ]}
              />

              <ChecklistSection
                title="Touch Targets"
                stage="mmp"
                items={[
                  "Touch targets minimum 44x44px",
                  "Adequate spacing between touch targets",
                  "Buttons not too close together on mobile",
                  "Form inputs large enough for touch",
                  "Links have sufficient tap area",
                  "Close buttons easily tappable",
                ]}
              />

              <ChecklistSection
                title="Mobile-Specific Patterns"
                stage="mmp"
                items={[
                  "Phone number links use tel: protocol",
                  "Email links use mailto: protocol",
                  "Address links open in maps",
                  "Appropriate keyboard type for inputs (email, tel, number)",
                  "No hover-only interactions on touch devices",
                  "Long press actions have alternative",
                ]}
              />

              <ChecklistSection
                title="Viewport & Orientation"
                stage="mmp"
                items={[
                  "Viewport meta tag correctly configured",
                  "Content works in landscape and portrait",
                  "Modals fit within viewport",
                  "Fixed elements don't overlap content",
                  "Virtual keyboard doesn't obscure inputs",
                  "Notch/safe area handled on modern devices",
                ]}
              />

              <CommonIssues
                items={[
                  { issue: "Content extends beyond viewport", fix: "Add overflow-x-hidden to body, check for wide elements" },
                  { issue: "Tiny touch targets", fix: "Increase button/link padding to meet 44px minimum" },
                  { issue: "Desktop-only hover menus", fix: "Add click/tap support for dropdowns on mobile" },
                  { issue: "Modal taller than viewport", fix: "Add max-height with overflow-y-auto to modal content" },
                  { issue: "Sidebar always visible on mobile", fix: "Add responsive visibility or slide-out drawer" },
                ]}
              />
            </Stack>
          </TabsContent>
        </Tabs>

        {/* ================================================================ */}
        {/* Tools & Resources */}
        {/* ================================================================ */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Tools &amp; Resources</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <ResourceCard
              title="Design System Tools"
              items={[
                { name: "Storybook", url: "https://storybook.js.org/", desc: "Component documentation and testing" },
                { name: "Figma", url: "https://figma.com/", desc: "Design collaboration platform" },
                { name: "Chromatic", url: "https://www.chromatic.com/", desc: "Visual regression testing" },
                { name: "Style Dictionary", url: "https://amzn.github.io/style-dictionary/", desc: "Design token management" },
              ]}
            />
            <ResourceCard
              title="Responsive Testing"
              items={[
                { name: "Chrome DevTools", url: "https://developer.chrome.com/docs/devtools/", desc: "Device simulation and debugging" },
                { name: "Responsively", url: "https://responsively.app/", desc: "Multi-device preview tool" },
                { name: "BrowserStack", url: "https://www.browserstack.com/", desc: "Real device testing" },
                { name: "Polypane", url: "https://polypane.app/", desc: "Developer browser for responsive" },
              ]}
            />
            <ResourceCard
              title="UX Patterns"
              items={[
                { name: "UI Patterns", url: "https://ui-patterns.com/", desc: "Common UI pattern library" },
                { name: "Mobbin", url: "https://mobbin.com/", desc: "Mobile design patterns" },
                { name: "Page Flows", url: "https://pageflows.com/", desc: "User flow inspiration" },
                { name: "Laws of UX", url: "https://lawsofux.com/", desc: "UX psychology principles" },
              ]}
            />
            <ResourceCard
              title="Component Libraries"
              items={[
                { name: "shadcn/ui", url: "https://ui.shadcn.com/", desc: "Catalyst's UI component system" },
                { name: "Radix Primitives", url: "https://www.radix-ui.com/primitives", desc: "Accessible component primitives" },
                { name: "Headless UI", url: "https://headlessui.com/", desc: "Unstyled accessible components" },
                { name: "Base UI", url: "https://base-ui.com/", desc: "Unstyled components from MUI" },
              ]}
            />
          </div>
        </section>

        {/* ================================================================ */}
        {/* AI Agent Quick Commands */}
        {/* ================================================================ */}
        <section className="rounded-xl border border-pink-200 bg-pink-50 p-5 dark:border-pink-900/50 dark:bg-pink-950/20">
          <h3 className="mb-3 font-semibold text-pink-900 dark:text-pink-200">AI Agent Commands</h3>
          <Text size="sm" className="mb-3 text-pink-800 dark:text-pink-300">
            Use these prompts with your AI coding agent to check design quality:
          </Text>
          <ul className="space-y-2 text-sm text-pink-800 dark:text-pink-300">
            <li><code className="rounded bg-pink-100 px-1.5 py-0.5 dark:bg-pink-900/50">Run the Design &amp; Experience audit at MVP level</code></li>
            <li><code className="rounded bg-pink-100 px-1.5 py-0.5 dark:bg-pink-900/50">Check for hardcoded colors in components</code></li>
            <li><code className="rounded bg-pink-100 px-1.5 py-0.5 dark:bg-pink-900/50">Find components missing loading states</code></li>
            <li><code className="rounded bg-pink-100 px-1.5 py-0.5 dark:bg-pink-900/50">Audit empty states across the app</code></li>
            <li><code className="rounded bg-pink-100 px-1.5 py-0.5 dark:bg-pink-900/50">Check mobile responsiveness at 320px viewport</code></li>
          </ul>
        </section>

        {/* ================================================================ */}
        {/* Related Audits */}
        {/* ================================================================ */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Related audits</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <RelatedAuditCard
              href="/docs/audits/accessibility"
              title="Accessibility & Inclusion"
              description="UX for users with diverse abilities"
            />
            <RelatedAuditCard
              href="/docs/audits/performance"
              title="Speed & Performance"
              description="Performance impacts experience"
            />
            <RelatedAuditCard
              href="/docs/audits/content"
              title="Content & SEO"
              description="Content quality and clarity"
            />
          </div>
        </section>
      </Stack>
    </article>
  )
}

// =============================================================================
// Helper Components
// =============================================================================

function StageCard({
  stage,
  level,
  expectations,
}: {
  stage: string
  level: string
  expectations: string[]
}) {
  return (
    <div className="rounded-xl border p-4">
      <Row gap="sm" className="mb-2 items-center">
        <span className="rounded bg-muted px-2 py-0.5 text-xs font-bold">
          {stage}
        </span>
        <Text size="sm" variant="muted">
          {level} check
        </Text>
      </Row>
      <ul className="space-y-1">
        {expectations.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/50" />
            <Text size="sm" variant="muted">
              {item}
            </Text>
          </li>
        ))}
      </ul>
    </div>
  )
}

const stageColors = {
  poc: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  mvp: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300",
  mmp: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300",
  prod: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
} as const

function ChecklistSection({
  title,
  stage,
  items,
}: {
  title: string
  stage: "poc" | "mvp" | "mmp" | "prod"
  items: string[]
}) {
  const stageLabels = { poc: "POC", mvp: "MVP", mmp: "MMP", prod: "PROD" }
  
  return (
    <div className="rounded-xl border p-5">
      <Row gap="sm" className="mb-4 items-center justify-between">
        <Text weight="semibold">{title}</Text>
        <span className={cn("rounded px-2 py-0.5 text-xs font-medium", stageColors[stage])}>
          {stageLabels[stage]}+
        </span>
      </Row>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-3 text-sm">
            <CircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/40" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function CommonIssues({
  items,
}: {
  items: { issue: string; fix: string }[]
}) {
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-900/50 dark:bg-amber-950/20">
      <Row gap="sm" className="mb-4 items-center">
        <AlertCircleIcon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
        <Text weight="semibold" className="text-amber-900 dark:text-amber-200">Common Issues &amp; Quick Fixes</Text>
      </Row>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex items-start gap-3 text-sm">
            <WrenchIcon className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <div>
              <span className="font-medium text-amber-900 dark:text-amber-200">{item.issue}:</span>{" "}
              <span className="text-amber-800 dark:text-amber-300">{item.fix}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ResourceCard({
  title,
  items,
}: {
  title: string
  items: { name: string; url: string; desc: string }[]
}) {
  return (
    <div className="rounded-xl border p-5">
      <Text weight="semibold" className="mb-3">{title}</Text>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.name} className="text-sm">
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
            >
              {item.name}
              <ExternalLinkIcon className="h-3 w-3" />
            </a>
            <span className="text-muted-foreground"> — {item.desc}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function RelatedAuditCard({
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
      className="rounded-xl border p-4 transition-colors hover:border-primary/50"
    >
      <Text weight="medium" className="text-primary">{title}</Text>
      <Text size="sm" variant="muted" className="mt-1">{description}</Text>
    </Link>
  )
}
