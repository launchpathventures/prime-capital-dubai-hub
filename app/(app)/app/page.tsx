/**
 * CATALYST - App Landing Page
 *
 * Showcases the benefits of building apps with Catalyst.
 * This is a demo/marketing page - in production you'd likely
 * redirect authenticated users straight to /app/dashboard.
 */

"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Stack, Row, Grid, Text, Title } from "@/components/core"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  RocketIcon,
  ZapIcon,
  LayersIcon,
  ShieldCheckIcon,
  CodeIcon,
  ArrowRightIcon,
  CheckIcon,
  SparklesIcon,
  LayoutDashboardIcon,
  DatabaseIcon,
  PaletteIcon,
} from "lucide-react"

export default function AppLandingPage() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <div className="app-bleed">
      {/* Hero with gradient background */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-primary/[0.02] to-transparent pb-16 pt-12">
        {/* Decorative gradient orb */}
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        
        <div className="app-section relative">
          <Stack
            gap="lg"
            className={cn(
              "items-center text-center transition-all duration-700",
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            )}
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm backdrop-blur-sm">
              <SparklesIcon className="h-4 w-4 text-primary" />
              <span className="font-medium">AI-First Development</span>
            </div>

            <Title size="h1">
              Build apps{" "}
              <span className="text-primary">faster</span>
              {" "}with Catalyst
            </Title>

            <Text size="lg" variant="muted" className="max-w-xl">
              Stop rebuilding authentication, layouts, and components.
              Start with a foundation designed for AI-assisted development.
            </Text>

            <Stack gap="sm" className="items-center pt-2">
              <Button size="lg" nativeButton={false} render={<Link href="/auth/login" />}>
                <ArrowRightIcon className="h-4 w-4" />
                Try the Sign in Flow
              </Button>
              <Text size="sm" variant="muted">
                Experience the auth process, then explore the dashboard
              </Text>
            </Stack>
          </Stack>
        </div>
      </section>

      {/* Content section */}
      <article className="app-section py-8">
        <Stack gap="xl">
          {/* Value Props */}
          <Grid cols={3} gap="md">
            <ValueCard
              icon={ZapIcon}
              title="Minutes, Not Days"
              description="Auth, navigation, and 40+ components ready to use. Clone and start building."
              delay={100}
              mounted={mounted}
            />
            <ValueCard
              icon={SparklesIcon}
              title="AI-Optimized"
              description="AGENTS.md, clear conventions, and inline docs help AI tools understand your codebase."
              delay={200}
              mounted={mounted}
            />
            <ValueCard
              icon={LayersIcon}
              title="Production Patterns"
              description="Surfaces, shells, and component architecture that scales from POC to production."
              delay={300}
              mounted={mounted}
            />
          </Grid>

          {/* Features List */}
          <Card
            className={cn(
              "transition-all duration-700",
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            )}
            style={{ transitionDelay: "400ms" }}
          >
            <CardContent className="p-6">
              <Grid cols={2} gap="lg">
                <Stack gap="sm">
                  <Text weight="semibold" className="mb-2">What&apos;s Included</Text>
                  <FeatureItem icon={ShieldCheckIcon}>Multi-mode authentication</FeatureItem>
                  <FeatureItem icon={LayoutDashboardIcon}>Collapsible sidebar layout</FeatureItem>
                  <FeatureItem icon={PaletteIcon}>Light/dark theme support</FeatureItem>
                  <FeatureItem icon={CodeIcon}>40+ UI components</FeatureItem>
                </Stack>
                <Stack gap="sm">
                  <Text weight="semibold" className="mb-2">Built For</Text>
                  <FeatureItem icon={RocketIcon}>Rapid prototyping</FeatureItem>
                  <FeatureItem icon={DatabaseIcon}>Supabase integration</FeatureItem>
                  <FeatureItem icon={LayersIcon}>Next.js 15 App Router</FeatureItem>
                  <FeatureItem icon={SparklesIcon}>AI-assisted coding</FeatureItem>
                </Stack>
              </Grid>
            </CardContent>
          </Card>

          {/* Explore More */}
          <Stack
            gap="sm"
            className={cn(
              "items-center text-center transition-all duration-700",
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            )}
            style={{ transitionDelay: "500ms" }}
          >
            <Text variant="muted">
              Explore the sidebar to see example pages, or
            </Text>
            <Row gap="sm" className="flex-wrap justify-center">
              <Button variant="outline" size="sm" nativeButton={false} render={<Link href="/app/approach" />}>
                Learn the Approach
              </Button>
              <Button variant="outline" size="sm" nativeButton={false} render={<Link href="/docs" />}>
                Read the Docs
              </Button>
            </Row>
          </Stack>
        </Stack>
      </article>
    </div>
  )
}

// =============================================================================
// Helper Components
// =============================================================================

function ValueCard({
  icon: Icon,
  title,
  description,
  delay,
  mounted,
}: {
  icon: React.ElementType
  title: string
  description: string
  delay: number
  mounted: boolean
}) {
  return (
    <Card
      className={cn(
        "transition-all duration-700 hover:border-primary/30",
        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <CardContent className="p-5">
        <Stack gap="sm">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <Text weight="semibold">{title}</Text>
          <Text size="sm" variant="muted">{description}</Text>
        </Stack>
      </CardContent>
    </Card>
  )
}

function FeatureItem({
  icon: Icon,
  children,
}: {
  icon: React.ElementType
  children: React.ReactNode
}) {
  return (
    <Row gap="sm" className="items-center">
      <Icon className="h-4 w-4 text-primary shrink-0" />
      <Text size="sm">{children}</Text>
    </Row>
  )
}
