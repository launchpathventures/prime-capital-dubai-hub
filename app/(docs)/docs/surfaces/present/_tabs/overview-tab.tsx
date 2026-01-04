/**
 * CATALYST - Present Surface Doc Tab: Overview
 *
 * What the Present surface is, why it exists, when to use it.
 * Audience hierarchy: stakeholder → catalyst dev → technical dev
 */

import Link from "next/link"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  PresentationIcon,
  MousePointerClickIcon,
  MaximizeIcon,
  MonitorIcon,
  LightbulbIcon,
  FolderIcon,
  BookOpenIcon,
} from "lucide-react"

export function OverviewTab() {
  return (
    <div className="space-y-10">
      {/* Summary */}
      <section className="space-y-4">
        <div className="border-primary bg-primary/5 rounded-lg border-l-4 p-5">
          <p className="text-lg font-medium leading-snug">
            Slides as code, close to the work
          </p>
          <p className="text-muted-foreground mt-2 leading-relaxed">
            Create presentations that live with your project. No switching
            between tools — build slides with the same components you use in
            your app, keeping the narrative close to the code.
          </p>
        </div>
      </section>

      {/* What You Get */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">What You Get</h2>
        <p className="text-muted-foreground">
          A presentation system built for developers and stakeholders:
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <FeatureCard
            icon={MaximizeIcon}
            title="Full-screen slides"
            description="Edge-to-edge content with snap-scroll navigation. Maximum visual impact."
          />
          <FeatureCard
            icon={MousePointerClickIcon}
            title="Keyboard + click navigation"
            description="Arrow keys, space bar, or click to advance. Natural presenting flow."
          />
          <FeatureCard
            icon={MonitorIcon}
            title="URL hash sync"
            description="Each slide has a URL. Share links to specific slides, resume where you left off."
          />
          <FeatureCard
            icon={PresentationIcon}
            title="Code-based content"
            description="Use React components for slides. Include live examples, charts, and interactions."
          />
        </div>
      </section>

      {/* When to Use It */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">When to Use It</h2>
        <p className="text-muted-foreground">
          Use this surface when you need to present to stakeholders:
        </p>

        <div className="bg-card rounded-xl border p-6">
          <ul className="space-y-3">
            <UseCaseItem
              title="Project updates"
              example="Sprint reviews, milestone demos, progress reports"
            />
            <UseCaseItem
              title="Client presentations"
              example="Proposals, design reviews, feature walkthroughs"
            />
            <UseCaseItem
              title="Internal pitches"
              example="Architecture decisions, new initiatives, team updates"
            />
            <UseCaseItem
              title="Workshops"
              example="Training sessions, onboarding, knowledge sharing"
            />
            <UseCaseItem
              title="Live demos"
              example="Product showcases with embedded working examples"
            />
          </ul>
        </div>

        {/* Not sure? callout */}
        <div className="bg-muted/50 flex gap-3 rounded-lg p-4">
          <LightbulbIcon className="text-primary mt-0.5 h-5 w-5 shrink-0" />
          <div className="space-y-1">
            <p className="text-sm font-medium">Why slides in code?</p>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Presentations often drift from reality. When slides live with
              your code, they stay current. Show actual components, real data
              structures, and working interactions.
            </p>
          </div>
        </div>
      </section>

      {/* Technical Details */}
      <section className="space-y-4">
        <Accordion>
          <AccordionItem value="technical-details" className="border-none">
            <AccordionTrigger className="px-0 py-2 hover:no-underline">
              <div className="flex items-center gap-2">
                <FolderIcon className="text-muted-foreground h-5 w-5" />
                <h2 className="text-xl font-semibold">Technical Details</h2>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-0 pt-2">
              <div className="grid gap-6 sm:grid-cols-2">
                {/* Metadata */}
                <div className="bg-card rounded-xl border p-5">
                  <h3 className="text-muted-foreground mb-4 text-sm font-medium uppercase tracking-wide">
                    Configuration
                  </h3>
                  <dl className="space-y-3">
                    <MetadataItem label="Folder" value="app/(present)" />
                    <MetadataItem label="URL" value="/present/*" />
                    <MetadataItem label="Layout" value="SlidesShell" />
                    <MetadataItem label="Navigation" value="presentations[]" />
                    <MetadataItem label="Auth" value="None (public)" />
                  </dl>
                </div>

                {/* Folder structure */}
                <div className="bg-card rounded-xl border p-5">
                  <h3 className="text-muted-foreground mb-4 text-sm font-medium uppercase tracking-wide">
                    Folder Structure
                  </h3>
                  <pre className="text-muted-foreground text-xs leading-relaxed">
                    {`app/(present)/
├── PRESENT.md      # Docs
├── present.css     # Styles
├── layout.tsx      # Shell wrapper
├── _surface/
│   ├── slides-shell.tsx
│   ├── slide.tsx
│   └── nav.tsx
└── present/
    └── YYYYMMDD-deck/
        └── page.tsx`}
                  </pre>
                </div>
              </div>

              <p className="text-muted-foreground mt-4 text-sm">
                Delete the entire{" "}
                <code className="bg-muted rounded px-1.5 py-0.5 text-xs">
                  app/(present)
                </code>{" "}
                folder to remove this surface. Everything is self-contained.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* Learn More */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <BookOpenIcon className="text-muted-foreground h-5 w-5" />
          <h2 className="text-lg font-medium">Learn More</h2>
        </div>
        <div className="grid gap-2 sm:grid-cols-3">
          <ReadingLink
            href="/present"
            title="View Presentations"
            description="See available decks"
          />
          <ReadingLink
            href="/docs/surfaces"
            title="Surfaces"
            description="How surfaces work"
          />
          <ReadingLink
            href="/docs/design"
            title="Design"
            description="Visual patterns"
          />
        </div>
      </section>
    </div>
  )
}

// -----------------------------------------------------------------------------
// Helper Components
// -----------------------------------------------------------------------------

function MetadataItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 text-sm">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-mono text-xs">{value}</dd>
    </div>
  )
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
}) {
  return (
    <div className="bg-card group rounded-xl border p-5 transition-colors">
      <div className="mb-3 flex items-center gap-2.5">
        <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
          <Icon className="text-primary h-4 w-4" />
        </div>
        <h3 className="font-medium">{title}</h3>
      </div>
      <p className="text-muted-foreground text-sm leading-relaxed">
        {description}
      </p>
    </div>
  )
}

function UseCaseItem({ title, example }: { title: string; example: string }) {
  return (
    <li className="flex gap-3 text-sm">
      <span className="bg-primary mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" />
      <span>
        <strong className="text-foreground">{title}</strong>
        <span className="text-muted-foreground"> — {example}</span>
      </span>
    </li>
  )
}

function ReadingLink({
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
      className="bg-muted/50 hover:bg-muted group flex flex-col rounded-lg p-3 transition-colors"
    >
      <span className="text-primary text-sm font-medium">{title}</span>
      <span className="text-muted-foreground text-xs">{description}</span>
    </Link>
  )
}
