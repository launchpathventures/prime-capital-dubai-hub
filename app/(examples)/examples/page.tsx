/**
 * CATALYST - Examples Overview Page
 *
 * Exciting landing page showcasing AI-generated example pages.
 * Promotes the power of AI-first development with Catalyst.
 *
 * Uses the centralized examples registry from _surface/examples-registry.ts
 */

"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Container, Stack, Row, Grid, Text } from "@/components/core"
import {
  SparklesIcon,
  ArrowRightIcon,
  ZapIcon,
  CodeIcon,
  ClockIcon,
} from "lucide-react"
import { getAllExamplesWithStyles } from "../_surface"

// =============================================================================
// EXAMPLE CARD
// =============================================================================

interface ExampleCardProps {
  title: string
  summary: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  styles: {
    gradient: string
    iconBg: string
    iconColor: string
    borderHover: string
  }
  index: number
  mounted: boolean
}

function ExampleCard({
  title,
  summary,
  href,
  icon: Icon,
  styles,
  index,
  mounted,
}: ExampleCardProps) {
  return (
    <Link href={href} className="group block">
      <Card
        className={cn(
          "relative h-full overflow-hidden transition-all duration-300",
          styles.borderHover,
          "hover:shadow-lg hover:scale-[1.02]",
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}
        style={{ transitionDelay: `${150 + index * 75}ms` }}
      >
        {/* Gradient background */}
        <div className={cn("absolute inset-0 bg-gradient-to-br pointer-events-none", styles.gradient)} />
        
        <CardContent className="relative p-5">
          <Row gap="md" align="center">
            <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-110", styles.iconBg)}>
              <Icon className={cn("h-6 w-6", styles.iconColor)} />
            </div>
            <Stack gap="xs" className="flex-1 min-w-0">
              <Row gap="sm" align="center">
                <Text size="lg" weight="semibold">{title}</Text>
                <ArrowRightIcon className="h-4 w-4 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0 text-muted-foreground" />
              </Row>
              <Text size="sm" variant="muted" className="line-clamp-1">
                {summary}
              </Text>
            </Stack>
          </Row>
        </CardContent>
      </Card>
    </Link>
  )
}

// =============================================================================
// FEATURE PILL
// =============================================================================

function FeaturePill({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <div className="group flex items-center gap-2 rounded-full border bg-background/80 px-4 py-2 text-sm transition-all hover:border-primary/30 hover:bg-primary/5 hover:shadow-sm">
      <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
      <span className="text-muted-foreground group-hover:text-foreground transition-colors">{label}</span>
    </div>
  )
}

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export default function ExamplesOverviewPage() {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => setMounted(true), [])

  return (
    <div className="relative min-h-screen">
      {/* Background effects */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
      <div className="pointer-events-none fixed top-0 left-1/2 -z-10 h-[400px] w-[1200px] max-w-[200%] -translate-x-1/2 rounded-full bg-primary/5 blur-[100px]" />
      
      <Container size="2xl" className="py-8 md:py-12">
        <Stack gap="lg">
          {/* Hero Section - More compact */}
          <div
            className={cn(
              "mx-auto max-w-4xl text-center transition-all duration-700 ease-out",
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            )}
          >
            {/* Badge */}
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm backdrop-blur-sm">
              <SparklesIcon className="h-4 w-4 text-primary" />
              <span className="font-medium">AI-Generated Examples</span>
            </div>

            {/* Title - Two lines */}
            <h1 className="mb-3 text-3xl font-extrabold tracking-tight md:text-4xl lg:text-5xl">
              Build features in
              <br />
              <span className="bg-gradient-to-r from-primary via-violet-500 to-blue-500 bg-clip-text text-transparent">
                minutes, not months.
              </span>
            </h1>

            {/* Description - Wider */}
            <p className="mx-auto mb-5 max-w-2xl text-base text-muted-foreground md:text-lg">
              Stop paying for micro-SaaS solutions. Build exactly what you need with a prompt. 
              Every example here was generated by AI—production-ready, customizable, and yours.
            </p>

            {/* Stats + CTAs in one row on desktop */}
            <div
              className={cn(
                "flex flex-wrap items-center justify-center gap-4 md:gap-6 transition-all duration-700 delay-100",
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
            >
              {/* Stats */}
              <div className="flex items-center gap-4 md:gap-6">
                <div className="text-center">
                  <div className="text-xl font-bold text-primary md:text-2xl">9</div>
                  <div className="text-xs text-muted-foreground">Examples</div>
                </div>
                <div className="h-6 w-px bg-border" />
                <div className="text-center">
                  <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 md:text-2xl">100%</div>
                  <div className="text-xs text-muted-foreground">AI Generated</div>
                </div>
                <div className="h-6 w-px bg-border" />
                <div className="text-center">
                  <div className="text-xl font-bold text-violet-600 dark:text-violet-400 md:text-2xl">~5 min</div>
                  <div className="text-xs text-muted-foreground">Per Feature</div>
                </div>
              </div>
            </div>
          </div>

          {/* Examples Grid - 2 rows of 3 */}
          <Grid cols={3} gap="md" className="examples-grid">
            {getAllExamplesWithStyles().map((example, index) => (
              <ExampleCard
                key={example.href}
                title={example.title}
                summary={example.summary}
                href={example.href}
                icon={example.icon}
                styles={example.styles}
                index={index}
                mounted={mounted}
              />
            ))}
          </Grid>

          {/* Bottom: Centered badges + CTA card stacked */}
          <Stack
            gap="md"
            align="center"
            className={cn(
              "transition-all duration-700",
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
            style={{ transitionDelay: "500ms" }}
          >
            {/* Feature pills - centered */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <FeaturePill icon={ZapIcon} label="Production Ready" />
              <FeaturePill icon={CodeIcon} label="Fully Customizable" />
              <FeaturePill icon={ClockIcon} label="Copy & Modify" />
              <FeaturePill icon={SparklesIcon} label="AI-First Workflow" />
            </div>

            {/* Compact CTA card - centered below */}
            <Card className="border-dashed bg-muted/30">
              <CardContent className="p-4">
                <Row gap="md" align="center">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <SparklesIcon className="h-4 w-4 text-primary" />
                  </div>
                  <Stack gap="none" className="min-w-0">
                    <Text size="sm" weight="semibold">Want to build your own?</Text>
                    <Text size="xs" variant="muted">Use these as templates or generate new features with a prompt.</Text>
                  </Stack>
                  <Button
                    variant="outline"
                    size="sm"
                    className="shrink-0"
                    render={<Link href="/docs" />}
                  >
                    Learn More
                    <ArrowRightIcon className="ml-1.5 h-3.5 w-3.5" />
                  </Button>
                </Row>
              </CardContent>
            </Card>
          </Stack>
        </Stack>
      </Container>
    </div>
  )
}
