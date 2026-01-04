/**
 * CATALYST - Present Surface Doc Tab: Develop
 *
 * How to build in the Present surface — written for catalyst devs (AI-first).
 * Audience: stakeholder → catalyst dev → technical dev
 */

import {
  CheckCircle2Icon,
  SparklesIcon,
  FileCodeIcon,
  NavigationIcon,
  LayoutIcon,
  SlidersIcon,
  PlayIcon,
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
            Building in the Present surface
          </p>
          <p className="text-muted-foreground leading-relaxed">
            This guide shows you how to create presentations, add slides, and
            customize navigation. Each section starts with what to ask AI, then
            shows the technical details.
          </p>
        </div>
      </section>

      {/* How to Work with AI */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Working with AI</h2>
        <p className="text-muted-foreground">
          Catalyst is AI-first. When you need a presentation, describe the
          story you want to tell. AI will create the slide structure and content.
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
                &ldquo;Create a presentation about our Q4 project progress
                with 6 slides&rdquo;
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary shrink-0">→</span>
              <span className="text-sm">
                &ldquo;Add a demo slide that shows the new dashboard
                component live&rdquo;
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary shrink-0">→</span>
              <span className="text-sm">
                &ldquo;Create an architecture overview presentation with
                diagrams&rdquo;
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary shrink-0">→</span>
              <span className="text-sm">
                &ldquo;Build a pitch deck with problem, solution, and
                next steps&rdquo;
              </span>
            </li>
          </ul>
          <p className="text-muted-foreground border-t pt-3 text-xs">
            AI reads the project docs (AGENTS.md, PRESENT.md) and knows the
            conventions. You focus on <em>the story</em>, AI handles the slides.
          </p>
        </div>
      </section>

      {/* Create a Presentation */}
      <section className="space-y-4">
        <TaskCard
          icon={FileCodeIcon}
          title="Create a presentation"
          ask="Create a new presentation called [Project Update] with 5 slides"
          description="Presentations live under app/(present)/present/. Create a folder with a date prefix for organization."
          details={[
            "Use YYYYMMDD-name format for folders",
            "Each presentation is a single page.tsx file",
            "Slides are components within the page",
          ]}
          files={[
            { path: "app/(present)/present/20250115-project-update/page.tsx", note: "Your presentation" },
          ]}
          example={`// app/(present)/present/20250115-project-update/page.tsx

/**
 * CATALYST - Project Update Presentation
 */

"use client"

import { SlidesShell, Slide } from "../_surface"

export default function ProjectUpdateDeck() {
  return (
    <SlidesShell>
      <Slide>
        <h1 className="text-5xl font-bold">Project Update</h1>
        <p className="text-xl text-muted-foreground mt-4">
          Q4 2024 Progress Review
        </p>
      </Slide>

      <Slide>
        <h2 className="text-4xl font-bold">What We Built</h2>
        {/* Content */}
      </Slide>

      <Slide>
        <h2 className="text-4xl font-bold">Key Metrics</h2>
        {/* Stats, charts */}
      </Slide>

      <Slide>
        <h2 className="text-4xl font-bold">Next Steps</h2>
        {/* Roadmap */}
      </Slide>

      <Slide>
        <h2 className="text-5xl font-bold">Questions?</h2>
      </Slide>
    </SlidesShell>
  )
}`}
        />
      </section>

      {/* Add to Navigation */}
      <section className="space-y-4">
        <TaskCard
          icon={NavigationIcon}
          title="Add to presentations list"
          ask="Add [Project Update] to the presentations navigation"
          description="Presentations are listed in lib/navigation.ts. Add an entry to make it appear in the presentations index."
          details={[
            "Include title, addendum (date/audience), href, and date",
            "Date is used for sorting (newest first)",
            "Presentations appear on /present",
          ]}
          files={[{ path: "lib/navigation.ts", note: "Navigation configuration" }]}
          example={`// lib/navigation.ts

export const presentations: Presentation[] = [
  {
    title: "Project Update",
    addendum: "Q4 Review • January 2025",
    href: "/present/20250115-project-update",
    date: "2025-01-15",
  },
  // ... other presentations
]`}
        />
      </section>

      {/* Slide Types */}
      <section className="space-y-4">
        <TaskCard
          icon={LayoutIcon}
          title="Slide layouts"
          ask="Add a split slide with image on left and text on right"
          description="Use different slide layouts for visual variety. The Slide component provides centering by default."
          details={[
            "Title slides: Large centered text",
            "Content slides: Heading + list or paragraphs",
            "Split slides: Image/visual + text side by side",
            "Full-screen media: Edge-to-edge images or video",
          ]}
          files={[]}
          example={`// Title slide
<Slide>
  <h1 className="text-6xl font-bold text-center">
    Big Statement
  </h1>
</Slide>

// Split slide
<Slide>
  <div className="grid md:grid-cols-2 gap-8 items-center">
    <img src="/images/diagram.png" alt="..." />
    <div>
      <h2 className="text-3xl font-bold">Key Point</h2>
      <p className="text-muted-foreground mt-2">
        Supporting explanation...
      </p>
    </div>
  </div>
</Slide>

// Full-screen image
<Slide className="p-0">
  <img 
    src="/images/hero.png" 
    alt="..." 
    className="w-full h-full object-cover"
  />
</Slide>`}
        />
      </section>

      {/* Live Components */}
      <section className="space-y-4">
        <TaskCard
          icon={PlayIcon}
          title="Embed live components"
          ask="Add a slide that shows the StatCard component with real data"
          description="One advantage of code-based slides: include working React components. Show actual UI, not screenshots."
          details={[
            "Import and use any component from your project",
            "Pass real or mock data to components",
            "Interactive elements work during presentation",
          ]}
          files={[]}
          example={`// Import your components
import { StatCard } from "@/components/shared"
import { Card } from "@/components/ui/card"

// Use them in slides
<Slide>
  <h2 className="text-3xl font-bold mb-8">Dashboard Preview</h2>
  
  <div className="grid grid-cols-3 gap-4">
    <StatCard 
      label="Revenue" 
      value="$52,840" 
      trend="up" 
      trendText="+12%" 
    />
    <StatCard 
      label="Users" 
      value="1,284" 
      trend="up" 
      trendText="+8%" 
    />
    <StatCard 
      label="Orders" 
      value="542" 
      trend="down" 
      trendText="-3%" 
    />
  </div>
</Slide>`}
        />
      </section>

      {/* Transitions */}
      <section className="space-y-4">
        <TaskCard
          icon={SlidersIcon}
          title="Customize transitions"
          ask="Add custom transitions between slides"
          description="Presentations use CSS snap-scroll by default. Customize transitions in the surface CSS."
          details={[
            "Default: Smooth scroll snap between slides",
            "Add CSS animations for entrance effects",
            "Keep transitions subtle — don't distract from content",
          ]}
          files={[{ path: "app/(present)/present.css", note: "Presentation styles" }]}
          example={`/* app/(present)/present.css */

/* Custom slide entrance animation */
.slides-shell .slide {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Slide-specific background */
.slide.dark {
  background: var(--color-foreground);
  color: var(--color-background);
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
                  app/(present)/present/
                </code>{" "}
                — Your presentations
              </li>
              <li>
                <code className="bg-muted rounded px-1 text-xs">
                  lib/navigation.ts
                </code>{" "}
                — Presentations list
              </li>
              <li>
                <code className="bg-muted rounded px-1 text-xs">
                  app/(present)/_surface/
                </code>{" "}
                — Slide components
              </li>
            </ul>
          </div>
          <div>
            <Text size="sm" weight="medium" className="mb-2">
              Common asks
            </Text>
            <ul className="text-muted-foreground space-y-1 text-sm">
              <li>&ldquo;Create a presentation about...&rdquo;</li>
              <li>&ldquo;Add a slide showing...&rdquo;</li>
              <li>&ldquo;Include a live demo of...&rdquo;</li>
              <li>&ldquo;Add speaker notes for...&rdquo;</li>
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
