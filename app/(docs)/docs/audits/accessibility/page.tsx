/**
 * CATALYST - Accessibility & Inclusion Audit
 *
 * Structured accessibility review covering keyboard navigation,
 * screen reader support, and visual clarity. WCAG 2.1 aligned.
 */

import Link from "next/link"
import { Stack, Text, Row } from "@/components/core"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  AccessibilityIcon,
  KeyboardIcon,
  EarIcon,
  EyeIcon,
  ArrowLeftIcon,
  CircleIcon,
  ExternalLinkIcon,
  WrenchIcon,
  AlertCircleIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function AccessibilityAuditPage() {
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
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <AccessibilityIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Accessibility &amp; Inclusion
              </h1>
              <Text variant="muted" className="italic">
                Can everyone use this?
              </Text>
            </div>
          </Row>
          <Text size="lg" variant="muted" className="leading-relaxed">
            Review keyboard navigation, screen reader support, and visual
            clarity. Ensure your app works for users with diverse abilities.
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
              level="Light"
              expectations={[
                "Awareness of major barriers",
                "No egregious keyboard traps",
                "Basic semantic HTML",
              ]}
            />
            <StageCard
              stage="MVP"
              level="Light"
              expectations={[
                "Core flows keyboard accessible",
                "Main headings structured",
                "Focus visible on interactive elements",
              ]}
            />
            <StageCard
              stage="MMP"
              level="Full"
              expectations={[
                "WCAG 2.1 AA on primary paths",
                "Screen reader tested",
                "Color contrast validated",
              ]}
            />
            <StageCard
              stage="PROD"
              level="Complete"
              expectations={[
                "Full WCAG 2.1 AA compliance",
                "Tested with assistive tech",
                "Accessibility statement published",
              ]}
            />
          </div>
        </section>

        {/* ================================================================ */}
        {/* Tabbed Checklists */}
        {/* ================================================================ */}
        <Tabs defaultValue="keyboard">
          <TabsList className="mb-4">
            <TabsTrigger value="keyboard">
              <KeyboardIcon className="h-4 w-4" />
              Keyboard &amp; Focus
            </TabsTrigger>
            <TabsTrigger value="screenreaders">
              <EarIcon className="h-4 w-4" />
              Screen Readers
            </TabsTrigger>
            <TabsTrigger value="visual">
              <EyeIcon className="h-4 w-4" />
              Visual Clarity
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Keyboard & Focus */}
          <TabsContent value="keyboard">
            <Stack gap="lg">
              <ChecklistSection
                title="Tab Order"
                stage="mvp"
                items={[
                  "Tab order follows logical reading order (left-to-right, top-to-bottom)",
                  "Tab order matches visual layout (no unexpected jumps)",
                  "Tabbing moves through all interactive elements in sequence",
                  "Reverse tab (Shift+Tab) works correctly",
                  "Focus does not jump to hidden or off-screen elements",
                  "Modal dialogs trap focus within until dismissed",
                ]}
              />

              <ChecklistSection
                title="Focus Indicators"
                stage="mvp"
                items={[
                  "All interactive elements have visible focus state",
                  "Focus indicator has sufficient contrast (3:1 against background)",
                  "Focus indicator is not just a color change",
                  "Focus style is consistent across the application",
                  "Focus is not removed with outline: none without replacement",
                  "Focus-visible used for keyboard-only focus styles (optional enhancement)",
                ]}
              />

              <ChecklistSection
                title="Keyboard Navigation"
                stage="mmp"
                items={[
                  "All functionality available via keyboard alone",
                  "Skip link provided to bypass navigation",
                  "Skip link is first focusable element on page",
                  "Arrow keys work in expected places (menus, tabs, sliders)",
                  "Escape closes modals, dropdowns, and overlays",
                  "Space activates buttons and checkboxes",
                  "Enter activates links and buttons",
                ]}
              />

              <ChecklistSection
                title="No Keyboard Traps"
                stage="mvp"
                items={[
                  "User can always tab away from any component",
                  "Modals can be closed with Escape key",
                  "Third-party widgets do not trap focus",
                  "Infinite scroll does not prevent keyboard navigation",
                  "Auto-playing content can be paused/stopped",
                  "Video players are keyboard accessible",
                ]}
              />

              <CommonIssues
                items={[
                  { issue: "Custom buttons using <div> instead of <button>", fix: "Use semantic <button> or add role=\"button\" with keyboard handlers" },
                  { issue: "Focus indicator removed for aesthetics", fix: "Implement custom focus-visible styles instead of removing" },
                  { issue: "Modal does not trap focus", fix: "Use focus-trap library or implement focus trap with refs" },
                  { issue: "Skip link not visible", fix: "Show skip link on focus (sr-only with :focus-visible override)" },
                  { issue: "Dropdown menu items not keyboard accessible", fix: "Add arrow key navigation with roving tabindex pattern" },
                ]}
              />
            </Stack>
          </TabsContent>

          {/* Tab 2: Screen Readers */}
          <TabsContent value="screenreaders">
            <Stack gap="lg">
              <ChecklistSection
                title="Semantic HTML"
                stage="mvp"
                items={[
                  "Page uses landmark elements (nav, main, aside, footer)",
                  "Only one <main> element per page",
                  "Navigation uses <nav> element",
                  "Content sections use <article> or <section> with headings",
                  "Lists use <ul>, <ol>, or <dl> appropriately",
                  "Tables have <th> for headers and scope attributes",
                  "Buttons use <button>, links use <a>",
                ]}
              />

              <ChecklistSection
                title="Heading Hierarchy"
                stage="mvp"
                items={[
                  "Page has exactly one <h1> element",
                  "Headings follow logical order (h1 → h2 → h3, no skips)",
                  "Headings describe section content accurately",
                  "Heading levels not chosen for visual styling alone",
                  "No empty headings",
                  "Heading structure forms logical outline",
                ]}
              />

              <ChecklistSection
                title="Images & Icons"
                stage="mvp"
                items={[
                  "Informative images have descriptive alt text",
                  "Decorative images have empty alt=\"\"",
                  "Complex images have extended descriptions (longdesc or visible)",
                  "Icon buttons have accessible names (aria-label or visible text)",
                  "SVG icons have appropriate role and title/aria-label",
                  "Background images with text have text alternative",
                ]}
              />

              <ChecklistSection
                title="Forms & Labels"
                stage="mvp"
                items={[
                  "All form inputs have associated <label> elements",
                  "Labels use for attribute pointing to input id",
                  "Required fields indicated with aria-required or visible indicator",
                  "Error messages associated with fields (aria-describedby)",
                  "Error messages announced on form submission",
                  "Placeholder text does not replace labels",
                  "Fieldset and legend group related inputs",
                ]}
              />

              <ChecklistSection
                title="Dynamic Content"
                stage="mmp"
                items={[
                  "Live regions used for dynamic updates (aria-live)",
                  "Status messages use role=\"status\" or aria-live=\"polite\"",
                  "Alert messages use role=\"alert\" or aria-live=\"assertive\"",
                  "Loading states announced to screen readers",
                  "Page title updates on client-side navigation",
                  "Focus managed on route changes (focus to main or h1)",
                ]}
              />

              <ChecklistSection
                title="ARIA Usage"
                stage="mmp"
                items={[
                  "ARIA used only when HTML semantics insufficient",
                  "All ARIA roles have required properties",
                  "aria-expanded used for expandable content",
                  "aria-selected used for selected items in lists",
                  "aria-describedby provides additional descriptions",
                  "aria-hidden used correctly (not on focusable elements)",
                ]}
              />

              <CommonIssues
                items={[
                  { issue: "Links that say \"click here\" or \"read more\"", fix: "Use descriptive link text that makes sense out of context" },
                  { issue: "Form inputs without labels", fix: "Add explicit <label> elements with for attribute" },
                  { issue: "Icon buttons without accessible names", fix: "Add aria-label with action description" },
                  { issue: "Heading levels skipped (h1 to h3)", fix: "Restructure to use h2 between h1 and h3" },
                  { issue: "Dynamic content not announced", fix: "Wrap updates in aria-live region" },
                ]}
              />
            </Stack>
          </TabsContent>

          {/* Tab 3: Visual Clarity */}
          <TabsContent value="visual">
            <Stack gap="lg">
              <ChecklistSection
                title="Color Contrast"
                stage="mmp"
                items={[
                  "Normal text has 4.5:1 contrast ratio (WCAG AA)",
                  "Large text (18pt+) has 3:1 contrast ratio",
                  "UI components have 3:1 contrast against background",
                  "Focus indicators have 3:1 contrast",
                  "Links distinguishable from surrounding text (not just color)",
                  "Contrast checked in both light and dark modes",
                ]}
              />

              <ChecklistSection
                title="Color Independence"
                stage="mmp"
                items={[
                  "Information not conveyed by color alone",
                  "Error states use icon or text in addition to color",
                  "Required fields have indicator beyond color",
                  "Charts/graphs use patterns or labels with colors",
                  "Links have underline or other visual indicator",
                  "Status indicators use shape or text with color",
                ]}
              />

              <ChecklistSection
                title="Text Resizing"
                stage="mmp"
                items={[
                  "Text resizable to 200% without loss of content",
                  "No horizontal scroll at 200% text size",
                  "Relative units used for text (rem, em, not px)",
                  "Container sizes accommodate larger text",
                  "Line heights allow text to expand",
                  "Input fields expand with larger text",
                ]}
              />

              <ChecklistSection
                title="Zoom & Reflow"
                stage="mmp"
                items={[
                  "Content reflows at 320px viewport width",
                  "400% zoom usable without horizontal scrolling",
                  "Critical functionality visible at 400% zoom",
                  "Touch targets 44x44px minimum",
                  "Adequate spacing between interactive elements",
                  "Content not clipped or hidden at high zoom",
                ]}
              />

              <ChecklistSection
                title="Motion & Animation"
                stage="mmp"
                items={[
                  "prefers-reduced-motion respected",
                  "No content flashes more than 3 times per second",
                  "Auto-playing content can be paused",
                  "Animations not required for understanding",
                  "Parallax effects have reduced-motion alternative",
                  "Loading spinners respect motion preferences",
                ]}
              />

              <ChecklistSection
                title="High Contrast & Dark Mode"
                stage="prod"
                items={[
                  "Content visible in Windows High Contrast mode",
                  "Dark mode does not reduce accessibility",
                  "All content visible in forced-colors mode",
                  "Focus indicators visible in all color modes",
                  "Images have appropriate contrast in all modes",
                ]}
              />

              <CommonIssues
                items={[
                  { issue: "Gray text with insufficient contrast", fix: "Use contrast checker, increase contrast to 4.5:1" },
                  { issue: "Animations cause motion sickness", fix: "Wrap in prefers-reduced-motion media query" },
                  { issue: "Text in fixed-size containers clips", fix: "Use flexible containers with min-height" },
                  { issue: "Links only distinguished by color", fix: "Add underline or other visual indicator" },
                  { issue: "Error messages only in red", fix: "Add error icon and descriptive text" },
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
              title="Automated Testing"
              items={[
                { name: "axe DevTools", url: "https://www.deque.com/axe/", desc: "Browser extension for accessibility testing" },
                { name: "Lighthouse", url: "https://developer.chrome.com/docs/lighthouse", desc: "Chrome built-in accessibility audits" },
                { name: "WAVE", url: "https://wave.webaim.org/", desc: "Web accessibility evaluation tool" },
                { name: "Pa11y", url: "https://pa11y.org/", desc: "Automated accessibility testing CLI" },
              ]}
            />
            <ResourceCard
              title="Manual Testing"
              items={[
                { name: "VoiceOver", url: "https://www.apple.com/accessibility/vision/", desc: "macOS/iOS screen reader" },
                { name: "NVDA", url: "https://www.nvaccess.org/", desc: "Free Windows screen reader" },
                { name: "JAWS", url: "https://www.freedomscientific.com/products/software/jaws/", desc: "Windows screen reader" },
                { name: "Accessibility Insights", url: "https://accessibilityinsights.io/", desc: "Microsoft testing tools" },
              ]}
            />
            <ResourceCard
              title="Contrast & Color"
              items={[
                { name: "WebAIM Contrast Checker", url: "https://webaim.org/resources/contrastchecker/", desc: "Check color contrast ratios" },
                { name: "Stark", url: "https://www.getstark.co/", desc: "Accessibility design toolkit" },
                { name: "Colorblind Web Page Filter", url: "https://www.toptal.com/designers/colorfilter", desc: "Simulate color blindness" },
                { name: "Who Can Use", url: "https://www.whocanuse.com/", desc: "Color contrast with context" },
              ]}
            />
            <ResourceCard
              title="References"
              items={[
                { name: "WCAG 2.1", url: "https://www.w3.org/WAI/WCAG21/quickref/", desc: "Web Content Accessibility Guidelines" },
                { name: "A11y Project Checklist", url: "https://www.a11yproject.com/checklist/", desc: "Practical accessibility checklist" },
                { name: "MDN Accessibility", url: "https://developer.mozilla.org/en-US/docs/Web/Accessibility", desc: "Web accessibility docs" },
                { name: "Inclusive Components", url: "https://inclusive-components.design/", desc: "Accessible component patterns" },
              ]}
            />
          </div>
        </section>

        {/* ================================================================ */}
        {/* AI Agent Quick Commands */}
        {/* ================================================================ */}
        <section className="rounded-xl border border-purple-200 bg-purple-50 p-5 dark:border-purple-900/50 dark:bg-purple-950/20">
          <h3 className="mb-3 font-semibold text-purple-900 dark:text-purple-200">AI Agent Commands</h3>
          <Text size="sm" className="mb-3 text-purple-800 dark:text-purple-300">
            Use these prompts with your AI coding agent to check accessibility:
          </Text>
          <ul className="space-y-2 text-sm text-purple-800 dark:text-purple-300">
            <li><code className="rounded bg-purple-100 px-1.5 py-0.5 dark:bg-purple-900/50">Run the Accessibility audit at MVP level</code></li>
            <li><code className="rounded bg-purple-100 px-1.5 py-0.5 dark:bg-purple-900/50">Check all images for alt text</code></li>
            <li><code className="rounded bg-purple-100 px-1.5 py-0.5 dark:bg-purple-900/50">Verify heading hierarchy across pages</code></li>
            <li><code className="rounded bg-purple-100 px-1.5 py-0.5 dark:bg-purple-900/50">Find form inputs without labels</code></li>
            <li><code className="rounded bg-purple-100 px-1.5 py-0.5 dark:bg-purple-900/50">Check for missing aria-labels on icon buttons</code></li>
          </ul>
        </section>

        {/* ================================================================ */}
        {/* Related Audits */}
        {/* ================================================================ */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Related audits</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <RelatedAuditCard
              href="/docs/audits/experience"
              title="Design & Experience"
              description="Design consistency affects accessibility"
            />
            <RelatedAuditCard
              href="/docs/audits/content"
              title="Content & SEO"
              description="Content structure and clarity"
            />
            <RelatedAuditCard
              href="/docs/audits/performance"
              title="Speed & Performance"
              description="Performance impacts accessibility"
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
