/**
 * CATALYST - Present Surface Doc Tab: Design
 *
 * Natural showcase of presentation design — demonstrates the visual language
 * used in Catalyst presentations with interactive previews.
 */

"use client"

import { Stack, Text, Row } from "@/components/core"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  SparklesIcon,
  ZapIcon,
  LayersIcon,
  ArrowRightIcon,
  CheckIcon,
  CodeIcon,
  AlertCircleIcon,
  MousePointerClickIcon,
  ClockIcon,
  RefreshCwIcon,
  LayoutTemplateIcon,
  PaletteIcon,
  BrainIcon,
} from "lucide-react"

export function DesignTab() {
  return (
    <article>
      <Stack gap="xl">
        {/* Summary */}
        <div className="border-primary bg-primary/5 space-y-3 rounded-lg border-l-4 p-5">
          <p className="text-lg font-medium leading-snug">
            Bold statements, visual hierarchy, generous space
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Catalyst presentations use gradient backgrounds, glass cards, and
            floating decorative blobs. These previews show the actual visual
            patterns from the example presentation.
          </p>
        </div>

        {/* ================================================================ */}
        {/* Slide Previews */}
        {/* ================================================================ */}
        <div className="space-y-6">
          {/* Title Slide */}
          <SlideFrame label="Title Slide">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
            <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />

            <div className="relative z-10 flex h-full flex-col items-center justify-center text-center">
              <SectionBadge icon={SparklesIcon}>Example Presentation</SectionBadge>
              <h1 className="mt-6 text-3xl font-extrabold tracking-tight md:text-4xl">
                Storytelling,{" "}
                <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  Reimagined.
                </span>
              </h1>
              <p className="text-muted-foreground mt-3 max-w-md text-sm md:text-base">
                Stop fighting with drag-and-drop tools. Start building
                presentations with the same power you build apps.
              </p>
              <Button size="sm" className="mt-6 rounded-full shadow-lg">
                Start the Show
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </SlideFrame>

          {/* Insight Slide - Glass Cards */}
          <SlideFrame label="Insight Slide (Glass Cards)">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 to-transparent" />
            <div className="absolute left-1/4 top-1/4 h-32 w-32 rounded-full bg-primary/20 blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />

            <div className="relative z-10 flex h-full flex-col items-center justify-center p-6 text-center">
              <SectionBadge icon={SparklesIcon}>The Insight</SectionBadge>
              <h2 className="mt-4 text-2xl font-extrabold tracking-tight md:text-3xl">
                We were already solving this.
              </h2>
              <p className="text-muted-foreground mt-2 text-sm">
                Our landing pages were engaging, easy to build, and reusable.
              </p>

              <div className="mt-6 grid w-full max-w-lg grid-cols-3 gap-3">
                <GlassCard icon={LayoutTemplateIcon} title="Same Components" />
                <GlassCard icon={PaletteIcon} title="Same Design" />
                <GlassCard icon={BrainIcon} title="Same AI" />
              </div>
            </div>
          </SlideFrame>

          {/* Comparison Slide - Before/After */}
          <SlideFrame label="Comparison Slide (Before/After Cards)">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />

            <div className="relative z-10 flex h-full flex-col p-6">
              <div className="mb-4 text-center">
                <SectionBadge icon={ZapIcon}>Paradigm Shift</SectionBadge>
                <h2 className="mt-3 text-xl font-bold md:text-2xl">
                  AI bridges{" "}
                  <span className="text-tertiary">Content</span> and{" "}
                  <span className="text-primary">Code</span>
                </h2>
              </div>

              <div className="grid flex-1 gap-4 md:grid-cols-2">
                {/* Before */}
                <div className="border-destructive/20 bg-background/60 relative overflow-hidden rounded-2xl border p-4 backdrop-blur-sm">
                  <Badge
                    variant="destructive"
                    className="bg-destructive/10 text-destructive border-destructive/20 mb-3"
                  >
                    Before
                  </Badge>
                  <h3 className="text-muted-foreground text-lg font-bold">
                    The Manual Loop
                  </h3>
                  <ul className="text-muted-foreground mt-2 space-y-1 text-sm">
                    <li className="flex gap-2">
                      <span className="text-destructive/50">−</span> Write draft in Docs
                    </li>
                    <li className="flex gap-2">
                      <span className="text-destructive/50">−</span> Copy-paste to Slides
                    </li>
                    <li className="flex gap-2">
                      <span className="text-destructive/50">−</span> Re-format everything
                    </li>
                  </ul>
                </div>

                {/* After */}
                <div className="border-primary/30 bg-background/60 relative overflow-hidden rounded-2xl border p-4 shadow-lg backdrop-blur-sm">
                  <Badge className="bg-primary text-primary-foreground mb-3">
                    Now
                  </Badge>
                  <h3 className="text-primary text-lg font-bold">
                    The Catalyst Flow
                  </h3>
                  <ul className="mt-2 space-y-1 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckIcon className="text-primary h-4 w-4" />
                      <span>&quot;Hey Claude, make a slide...&quot;</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckIcon className="text-primary h-4 w-4" />
                      <span>AI generates structure + code</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckIcon className="text-primary h-4 w-4" />
                      <span>Ship it 🚀</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </SlideFrame>

          {/* Features Slide - Bento Grid */}
          <SlideFrame label="Features Slide (Bento Grid)">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 to-transparent" />

            <div className="relative z-10 flex h-full flex-col p-6">
              <div className="mb-4 text-center">
                <SectionBadge icon={LayersIcon}>The Features</SectionBadge>
                <h2 className="mt-3 text-xl font-bold">First-Class Citizen</h2>
              </div>

              <div className="grid flex-1 grid-cols-3 gap-3">
                {/* Large card */}
                <div className="col-span-2 row-span-2 flex flex-col justify-between rounded-2xl border bg-white/50 p-4 backdrop-blur-sm dark:bg-white/5">
                  <div>
                    <div className="bg-primary/10 text-primary mb-3 flex h-8 w-8 items-center justify-center rounded-lg">
                      <CodeIcon className="h-4 w-4" />
                    </div>
                    <h3 className="font-bold">Code-First Control</h3>
                    <p className="text-muted-foreground mt-1 text-xs">
                      Version controlled. Diffable. Reviewable.
                    </p>
                  </div>
                  <div className="bg-muted/50 mt-3 rounded-lg border p-2 font-mono text-xs">
                    <span className="text-primary">git commit</span> -m &quot;Update
                    slides&quot;
                  </div>
                </div>

                {/* Small cards */}
                <div className="row-span-2 flex flex-col rounded-2xl border bg-white/50 p-4 backdrop-blur-sm dark:bg-white/5">
                  <LayoutTemplateIcon className="mb-2 h-5 w-5 text-orange-500" />
                  <h3 className="text-sm font-bold">Components</h3>
                  <p className="text-muted-foreground mt-1 text-xs">
                    Use your design system
                  </p>
                </div>
              </div>
            </div>
          </SlideFrame>

          {/* Stats Slide */}
          <SlideFrame label="Stats Slide">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />

            <div className="relative z-10 flex h-full flex-col items-center justify-center p-6 text-center">
              <h2 className="text-2xl font-extrabold tracking-tight md:text-3xl">
                <span className="bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">
                  A few prompts,
                </span>
                <br />
                <span className="text-primary">~800 lines of code.</span>
              </h2>

              <div className="mt-8 grid w-full max-w-md grid-cols-4 gap-3">
                <StatCard value="10" label="Slides" />
                <StatCard value="<10m" label="Build" />
                <StatCard value="$0" label="Cost" />
                <StatCard value="100%" label="Ready" />
              </div>
            </div>
          </SlideFrame>

          {/* CTA Slide */}
          <SlideFrame label="CTA Slide">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/15 via-transparent to-transparent" />

            <div className="relative z-10 flex h-full flex-col items-center justify-center p-6 text-center">
              <h2 className="text-3xl font-bold md:text-4xl">
                Ready to build?
              </h2>
              <p className="text-muted-foreground mt-3 max-w-md text-sm">
                View the full presentation or start building your own.
              </p>
              <div className="mt-6 flex gap-3">
                <a
                  href="/present"
                  className="inline-flex h-9 items-center justify-center rounded-full border px-4 text-sm font-medium transition-colors hover:bg-muted"
                >
                  View Presentations
                </a>
                <Button className="rounded-full">
                  Get Started
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </SlideFrame>
        </div>

        {/* Design Notes */}
        <section className="border-t pt-8">
          <Text variant="muted" className="text-center">
            These patterns are demonstrated in the{" "}
            <a
              href="/present/20251231-catalyst-example"
              className="text-primary hover:underline"
            >
              example presentation
            </a>
            .
          </Text>
        </section>
      </Stack>
    </article>
  )
}

// -----------------------------------------------------------------------------
// Helper Components
// -----------------------------------------------------------------------------

function SlideFrame({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="overflow-hidden rounded-xl border shadow-sm">
      <div className="bg-muted/30 border-b px-4 py-2">
        <Text size="xs" variant="muted" className="uppercase tracking-wide">
          {label}
        </Text>
      </div>
      <div className="bg-background relative aspect-video overflow-hidden">
        {children}
      </div>
    </div>
  )
}

function SectionBadge({
  icon: Icon,
  children,
  variant = "default",
}: {
  icon: React.ComponentType<{ className?: string }>
  children: React.ReactNode
  variant?: "default" | "destructive"
}) {
  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium backdrop-blur-sm ${
        variant === "destructive"
          ? "border-destructive/30 bg-destructive/10 text-destructive"
          : "border-primary/30 bg-primary/10 text-primary"
      }`}
    >
      <Icon className="h-3 w-3" />
      {children}
    </div>
  )
}

function GlassCard({
  icon: Icon,
  title,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
}) {
  return (
    <div className="rounded-xl border border-white/20 bg-white/50 p-3 text-center backdrop-blur-sm transition-all hover:-translate-y-0.5 dark:bg-white/5">
      <Icon className="text-primary mx-auto h-5 w-5" />
      <p className="mt-1.5 text-xs font-medium">{title}</p>
    </div>
  )
}

function PainPoint({
  icon: Icon,
  text,
}: {
  icon: React.ComponentType<{ className?: string }>
  text: string
}) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <Icon className="text-muted-foreground h-3.5 w-3.5 shrink-0" />
      <span className="text-muted-foreground">{text}</span>
    </div>
  )
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl border bg-white/50 p-3 text-center backdrop-blur-sm dark:bg-white/5">
      <div className="text-lg font-bold">{value}</div>
      <div className="text-muted-foreground text-xs">{label}</div>
    </div>
  )
}
