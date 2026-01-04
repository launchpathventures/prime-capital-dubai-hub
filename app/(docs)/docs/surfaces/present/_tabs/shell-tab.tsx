/**
 * CATALYST - Present Surface Doc Tab: Layout
 *
 * How the presentation layout works — full-screen slides, navigation.
 * Written for catalyst devs (AI-first), technical details collapsible.
 */

import {
  CheckCircle2Icon,
  SparklesIcon,
  MaximizeIcon,
  MousePointerClickIcon,
  PaletteIcon,
} from "lucide-react"
import { Text, Row } from "@/components/core"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export function LayoutTab() {
  return (
    <div className="space-y-10">
      {/* Summary */}
      <section className="space-y-4">
        <div className="border-primary bg-primary/5 space-y-3 rounded-lg border-l-4 p-5">
          <p className="text-lg font-medium leading-snug">
            Understanding the layout
          </p>
          <p className="text-muted-foreground leading-relaxed">
            The Present surface uses a full-screen, snap-scroll layout. Each
            slide fills the viewport. Navigation happens via keyboard, click,
            or dots indicator.
          </p>
        </div>
      </section>

      {/* Visual Overview */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Layout structure</h2>
        <p className="text-muted-foreground">
          Presentations use a minimal chrome approach:
        </p>

        <div className="bg-muted/30 overflow-hidden rounded-lg border">
          <div className="relative aspect-video">
            {/* Header */}
            <div className="absolute left-0 right-0 top-0 flex items-center justify-between border-b bg-card/80 px-4 py-2 backdrop-blur">
              <div className="bg-muted h-3 w-24 rounded" />
              <div className="bg-muted h-5 w-5 rounded" />
            </div>

            {/* Slide content */}
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <div className="bg-muted mx-auto mb-2 h-6 w-48 rounded" />
                <div className="bg-muted mx-auto h-3 w-32 rounded" />
              </div>
            </div>

            {/* Navigation dots */}
            <div className="absolute right-4 top-1/2 flex -translate-y-1/2 flex-col gap-2">
              <div className="bg-primary h-2 w-2 rounded-full" />
              <div className="bg-muted h-2 w-2 rounded-full" />
              <div className="bg-muted h-2 w-2 rounded-full" />
            </div>

            {/* Scroll hint */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
              <div className="bg-muted h-3 w-20 rounded" />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border p-4">
          <ul className="space-y-2 text-sm">
            <li className="flex gap-2">
              <CheckCircle2Icon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
              <span>Minimal header with title and exit button</span>
            </li>
            <li className="flex gap-2">
              <CheckCircle2Icon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
              <span>Navigation dots show progress and allow jumping</span>
            </li>
            <li className="flex gap-2">
              <CheckCircle2Icon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
              <span>URL hash syncs with current slide</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Full-Screen Mode */}
      <section className="space-y-4">
        <TaskCard
          icon={MaximizeIcon}
          title="Full-screen mode"
          ask="How do I present in full screen?"
          description="Use browser full-screen mode for distraction-free presenting. The layout is designed to work at any size."
          details={[
            "Press F11 (or Cmd+Shift+F on Mac) for browser full-screen",
            "Content scales to fill available space",
            "Navigation still works in full-screen mode",
          ]}
          files={[]}
          example={`// Full-screen is browser-native, no code needed

// However, you can hide the header in full-screen:
/* app/(present)/present.css */

:fullscreen .slides-shell [data-slot="header"] {
  display: none;
}

:fullscreen .slides-shell [data-slot="slide"] {
  padding-top: 0;
}`}
        />
      </section>

      {/* Navigation Controls */}
      <section className="space-y-4">
        <TaskCard
          icon={MousePointerClickIcon}
          title="Navigation controls"
          ask="Customize the navigation controls"
          description="Presentations support keyboard, click, and dot navigation. Customize which are active."
          details={[
            "Arrow keys: Left/Right or Up/Down",
            "Space/Enter: Advance to next slide",
            "Click: Advance (right side) or go back (left side)",
            "Dots: Jump to any slide",
          ]}
          files={[
            { path: "app/(present)/_surface/slides-shell.tsx", note: "Shell with nav" },
          ]}
          example={`// Navigation is handled by the usePresentationSlides hook
// in app/(present)/_surface/use-presentation-slides.ts

// Keyboard bindings
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === ' ') {
      nextSlide()
    }
    if (e.key === 'ArrowLeft') {
      prevSlide()
    }
  }
  window.addEventListener('keydown', handleKeyDown)
  return () => window.removeEventListener('keydown', handleKeyDown)
}, [])

// Disable click navigation if needed:
<SlidesShell clickNavigation={false}>
  {/* slides */}
</SlidesShell>`}
        />
      </section>

      {/* Custom Styles */}
      <section className="space-y-4">
        <TaskCard
          icon={PaletteIcon}
          title="Add custom styles"
          ask="Change the slide background to dark for this presentation"
          description="Each surface has its own CSS file. Add presentation-specific styles there."
          details={[
            "Surface CSS is imported by the layout automatically",
            "Add per-presentation CSS files next to page.tsx",
            "Use CSS variables for consistency",
          ]}
          files={[
            { path: "app/(present)/present.css", note: "Global presentation styles" },
            { path: "app/(present)/present/YYYYMMDD-deck/page.css", note: "Deck-specific styles" },
          ]}
          example={`/* app/(present)/present.css */

/* Dark theme slides */
.slides-shell.dark {
  --color-background: oklch(0.15 0.01 250);
  --color-foreground: oklch(0.95 0.01 250);
}

/* Gradient background */
.slides-shell .slide.gradient {
  background: linear-gradient(
    135deg,
    oklch(from var(--color-primary) l c h / 0.2),
    var(--color-background)
  );
}

/* Hide dots on specific slides */
.slide.no-dots ~ [data-slot="nav-dots"] {
  display: none;
}`}
        />
      </section>

      {/* Quick Reference */}
      <section className="bg-card space-y-3 rounded-lg border p-5">
        <h3 className="font-medium">Quick reference</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Text size="sm" weight="medium" className="mb-2">
              Key files
            </Text>
            <ul className="text-muted-foreground space-y-1 text-sm">
              <li>
                <code className="bg-muted rounded px-1 text-xs">
                  app/(present)/_surface/slides-shell.tsx
                </code>
              </li>
              <li>
                <code className="bg-muted rounded px-1 text-xs">
                  app/(present)/_surface/slide.tsx
                </code>
              </li>
              <li>
                <code className="bg-muted rounded px-1 text-xs">
                  app/(present)/present.css
                </code>
              </li>
              <li>
                <code className="bg-muted rounded px-1 text-xs">
                  lib/navigation.ts
                </code>
              </li>
            </ul>
          </div>
          <div>
            <Text size="sm" weight="medium" className="mb-2">
              Keyboard shortcuts
            </Text>
            <ul className="text-muted-foreground space-y-1 text-sm">
              <li>
                <kbd className="bg-muted rounded px-1 text-xs">→</kbd>{" "}
                <kbd className="bg-muted rounded px-1 text-xs">Space</kbd> Next slide
              </li>
              <li>
                <kbd className="bg-muted rounded px-1 text-xs">←</kbd> Previous
                slide
              </li>
              <li>
                <kbd className="bg-muted rounded px-1 text-xs">F11</kbd> Full
                screen
              </li>
              <li>
                <kbd className="bg-muted rounded px-1 text-xs">Esc</kbd> Exit
                full screen
              </li>
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
