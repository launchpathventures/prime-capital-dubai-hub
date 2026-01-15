/**
 * CATALYST - Build Web Landing Page
 *
 * Showcases Catalyst's capabilities for building blazing-fast,
 * SEO-optimized websites with AI-first development workflow.
 */

"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Container, Stack, Row, Grid, Text, Title } from "@/components/core"
import {
  ZapIcon,
  GlobeIcon,
  SearchIcon,
  CodeIcon,
  RocketIcon,
  SparklesIcon,
  ArrowRightIcon,
  CheckIcon,
  ServerIcon,
  PaletteIcon,
  SmartphoneIcon,
  ShieldCheckIcon,
  GaugeIcon,
  LayersIcon,
  MousePointerClickIcon,
  RefreshCwIcon,
} from "lucide-react"

// =============================================================================
// FEATURE CARD
// =============================================================================

interface FeatureCardProps {
  title: string
  description: string
  icon: React.ElementType
  gradient: string
  iconColor: string
  delay: number
  mounted: boolean
}

function FeatureCard({ 
  title, 
  description, 
  icon: Icon, 
  gradient,
  iconColor,
  delay, 
  mounted 
}: FeatureCardProps) {
  return (
    <Card
      className={cn(
        "group relative overflow-hidden transition-all duration-500 hover:shadow-xl hover:scale-[1.02] hover:border-primary/30",
        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none", gradient)} />
      <CardContent className="relative p-6">
        <Stack gap="md">
          <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-transform group-hover:scale-110", iconColor)}>
            <Icon className="h-6 w-6" />
          </div>
          <Stack gap="xs">
            <Text size="lg" weight="semibold">{title}</Text>
            <Text size="sm" variant="muted" className="leading-relaxed">{description}</Text>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  )
}

// =============================================================================
// SPEED STAT
// =============================================================================

function SpeedStat({ 
  value, 
  label, 
  color,
  delay,
  mounted 
}: { 
  value: string
  label: string
  color: string
  delay: number
  mounted: boolean
}) {
  return (
    <div 
      className={cn(
        "text-center transition-all duration-700",
        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className={cn("text-3xl md:text-4xl font-bold mb-1", color)}>{value}</div>
      <Text size="sm" variant="muted">{label}</Text>
    </div>
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
// CAPABILITY ITEM
// =============================================================================

function CapabilityItem({ children }: { children: React.ReactNode }) {
  return (
    <Row gap="sm" align="start" className="group">
      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 mt-0.5">
        <CheckIcon className="h-3 w-3 text-emerald-500" />
      </div>
      <Text size="sm" variant="muted" className="group-hover:text-foreground transition-colors">{children}</Text>
    </Row>
  )
}

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export default function WebLandingPage() {
  const [mounted, setMounted] = useState(false)
  
  // eslint-disable-next-line react-hooks/set-state-in-effect -- Initialization on mount
  useEffect(() => setMounted(true), [])

  const features = [
    {
      title: "Lightning Fast",
      description: "Next.js 15 with React Server Components. Automatic code splitting, optimized images, and edge-ready deployment.",
      icon: ZapIcon,
      gradient: "from-amber-500/10 to-orange-500/5",
      iconColor: "text-amber-500",
    },
    {
      title: "SEO Optimized",
      description: "Built-in metadata API, structured data support, and server-side rendering for maximum search visibility.",
      icon: SearchIcon,
      gradient: "from-blue-500/10 to-cyan-500/5",
      iconColor: "text-blue-500",
    },
    {
      title: "API Ready",
      description: "Route handlers, server actions, and seamless integration with any backend. Connect to Supabase, REST, or GraphQL.",
      icon: ServerIcon,
      gradient: "from-violet-500/10 to-purple-500/5",
      iconColor: "text-violet-500",
    },
    {
      title: "AI-First Workflow",
      description: "Structured prompts, consistent patterns, and clear conventions. AI agents understand and extend your codebase.",
      icon: SparklesIcon,
      gradient: "from-pink-500/10 to-rose-500/5",
      iconColor: "text-pink-500",
    },
    {
      title: "Responsive Design",
      description: "Mobile-first components, fluid typography, and adaptive layouts that look great on every device.",
      icon: SmartphoneIcon,
      gradient: "from-emerald-500/10 to-teal-500/5",
      iconColor: "text-emerald-500",
    },
    {
      title: "Production Ready",
      description: "Type-safe, accessible, and tested. Ship with confidence using our gated deployment pathway.",
      icon: ShieldCheckIcon,
      gradient: "from-sky-500/10 to-blue-500/5",
      iconColor: "text-sky-500",
    },
  ]

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background effects */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/15 via-background to-background" />
      <div className="pointer-events-none fixed top-0 left-1/2 -z-10 h-[500px] w-[1200px] max-w-[200%] -translate-x-1/2 rounded-full bg-primary/8 blur-[120px]" />
      
      {/* Hero Section */}
      <section className="relative py-16 md:py-24">
        <Container size="xl">
          <div
            className={cn(
              "mx-auto max-w-4xl text-center transition-all duration-700 ease-out",
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
          >
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm backdrop-blur-sm">
              <GlobeIcon className="h-4 w-4 text-primary" />
              <span className="font-medium">Web Development</span>
            </div>

            {/* Title */}
            <Title as="h1" size="h1" align="center" className="mb-6 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight">
              Build websites at
              <br />
              <span className="bg-gradient-to-r from-primary via-blue-500 to-teal-400 bg-clip-text text-transparent animate-gradient-x">
                warp speed.
              </span>
            </Title>

            {/* Description */}
            <Text size="xl" align="center" variant="muted" className="mx-auto mb-8 max-w-2xl leading-relaxed">
              From landing pages to full marketing sites. AI-assisted development with Next.js, 
              optimized for performance, accessibility, and SEO out of the box.
            </Text>

            {/* Speed Stats */}
            <Row gap="lg" justify="center" className="mb-10 flex-wrap">
              <SpeedStat value="< 1s" label="First Paint" color="text-emerald-500" delay={200} mounted={mounted} />
              <div className="hidden sm:block h-12 w-px bg-border" />
              <SpeedStat value="95%" label="Lighthouse Score" color="text-blue-500" delay={300} mounted={mounted} />
              <div className="hidden sm:block h-12 w-px bg-border" />
              <SpeedStat value="~30min" label="To First Deploy" color="text-violet-500" delay={400} mounted={mounted} />
            </Row>

            {/* CTAs */}
            <Row gap="md" justify="center" className="flex-col sm:flex-row">
              <Button
                size="lg"
                className="h-12 rounded-full px-8 shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:scale-105 transition-all"
                nativeButton={false}
                render={<Link href="/docs" />}
              >
                <RocketIcon className="mr-2 h-5 w-5" />
                Get Started
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 rounded-full px-8 hover:scale-105 transition-all"
                nativeButton={false}
                render={<Link href="/examples" />}
              >
                View Examples
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Button>
            </Row>
          </div>
        </Container>
      </section>

      {/* Browser Preview Section */}
      <section className="relative py-8">
        <Container size="xl">
          <div
            className={cn(
              "mx-auto max-w-5xl transition-all duration-700 delay-200",
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
          >
            <div className="relative rounded-2xl border bg-card/50 shadow-2xl backdrop-blur-sm overflow-hidden">
              {/* Browser Chrome */}
              <div className="flex items-center gap-3 border-b bg-muted/50 px-4 py-3">
                <div className="flex gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500/80" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                  <div className="h-3 w-3 rounded-full bg-green-500/80" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="flex items-center gap-2 rounded-lg bg-background/80 px-4 py-1.5 text-sm text-muted-foreground">
                    <ShieldCheckIcon className="h-3.5 w-3.5 text-emerald-500" />
                    <span className="font-mono">https://your-site.com</span>
                  </div>
                </div>
                <div className="w-16" /> {/* Spacer for symmetry */}
              </div>
              
              {/* Preview Content */}
              <div className="relative p-8 md:p-12 bg-gradient-to-b from-background to-muted/20">
                <Grid cols={2} gap="lg" className="md:grid-cols-3">
                  {/* Mock page elements */}
                  <div className="col-span-2 md:col-span-3 h-8 rounded-lg bg-primary/20 animate-pulse" />
                  <div className="h-32 rounded-lg bg-muted/50 border border-dashed border-muted-foreground/20" />
                  <div className="h-32 rounded-lg bg-muted/50 border border-dashed border-muted-foreground/20" />
                  <div className="hidden md:block h-32 rounded-lg bg-muted/50 border border-dashed border-muted-foreground/20" />
                  <div className="col-span-2 md:col-span-3 h-16 rounded-lg bg-muted/30" />
                </Grid>
                
                {/* Overlay badge */}
                <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-[2px]">
                  <div className="text-center">
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full border bg-background px-4 py-2 shadow-lg">
                      <SparklesIcon className="h-5 w-5 text-primary animate-pulse" />
                      <span className="font-semibold">Your vision, rendered.</span>
                    </div>
                    <Text size="sm" variant="muted" className="block">Describe it. Build it. Ship it.</Text>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Features Grid */}
      <section className="relative py-16 md:py-24">
        <Container size="xl">
          <Stack gap="lg" align="center" className="mb-12">
            <Badge variant="outline" className="border-muted-foreground/20">
              <LayersIcon className="mr-1.5 h-3.5 w-3.5" />
              Capabilities
            </Badge>
            <Title as="h2" size="h2" align="center" className="text-3xl md:text-4xl font-bold">
              Everything you need to ship
            </Title>
            <Text size="lg" align="center" variant="muted" className="max-w-2xl">
              A complete toolkit for building modern websites. Focus on your content and design—we handle the technical complexity.
            </Text>
          </Stack>

          <Grid cols={3} gap="md" className="max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                {...feature}
                delay={100 + index * 75}
                mounted={mounted}
              />
            ))}
          </Grid>
        </Container>
      </section>

      {/* Tech Stack Section */}
      <section className="relative py-16 md:py-24 border-t bg-muted/20">
        <Container size="xl">
          <Grid cols={2} gap="lg" className="items-center">
            {/* Left: Content */}
            <Stack gap="lg">
              <Badge variant="outline" className="w-fit border-muted-foreground/20">
                <CodeIcon className="mr-1.5 h-3.5 w-3.5" />
                Tech Stack
              </Badge>
              <Title as="h2" size="h2" className="text-3xl md:text-4xl font-bold">
                Built on proven foundations
              </Title>
              <Text size="lg" variant="muted" className="leading-relaxed">
                Catalyst combines the best tools in the React ecosystem. No experimental tech, 
                no breaking changes—just stable, production-ready infrastructure.
              </Text>
              
              <Stack gap="sm">
                <CapabilityItem>Next.js 15 with App Router and Server Components</CapabilityItem>
                <CapabilityItem>TypeScript for type safety and better DX</CapabilityItem>
                <CapabilityItem>Tailwind CSS for rapid, consistent styling</CapabilityItem>
                <CapabilityItem>Radix UI primitives for accessible components</CapabilityItem>
                <CapabilityItem>Vercel, Netlify, or self-hosted deployment</CapabilityItem>
              </Stack>

              <Button
                variant="outline"
                className="w-fit"
                nativeButton={false}
                render={<Link href="/docs" />}
              >
                Explore the Docs
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Button>
            </Stack>

            {/* Right: Code Preview */}
            <div
              className={cn(
                "relative rounded-xl border bg-card/80 shadow-xl backdrop-blur-sm overflow-hidden transition-all duration-700",
                mounted ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
              )}
              style={{ transitionDelay: "400ms" }}
            >
              <div className="flex items-center gap-2 border-b bg-muted/50 px-4 py-2.5">
                <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
                <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
                <span className="ml-2 text-xs text-muted-foreground font-mono">page.tsx</span>
              </div>
              <div className="p-5 font-mono text-xs md:text-sm leading-relaxed overflow-x-auto">
                <div className="text-muted-foreground">
                  <span className="text-pink-500">export default</span>
                  <span className="text-blue-400"> function</span>
                  <span className="text-yellow-500"> Page</span>
                  <span className="text-foreground">() {"{"}</span>
                </div>
                <div className="pl-4 text-muted-foreground">
                  <span className="text-pink-500">return</span>
                  <span className="text-foreground"> (</span>
                </div>
                <div className="pl-8 text-muted-foreground">
                  <span className="text-purple-500">{"<"}</span>
                  <span className="text-primary">Container</span>
                  <span className="text-purple-500">{">"}</span>
                </div>
                <div className="pl-12 text-muted-foreground">
                  <span className="text-purple-500">{"<"}</span>
                  <span className="text-primary">Hero</span>
                  <span className="text-orange-400">{" title"}</span>
                  <span className="text-foreground">=</span>
                  <span className="text-green-400">{'"Your headline"'}</span>
                  <span className="text-purple-500">{" />"}</span>
                </div>
                <div className="pl-12 text-muted-foreground">
                  <span className="text-purple-500">{"<"}</span>
                  <span className="text-primary">Features</span>
                  <span className="text-purple-500">{" />"}</span>
                </div>
                <div className="pl-12 text-muted-foreground">
                  <span className="text-purple-500">{"<"}</span>
                  <span className="text-primary">CTA</span>
                  <span className="text-purple-500">{" />"}</span>
                </div>
                <div className="pl-8 text-muted-foreground">
                  <span className="text-purple-500">{"</"}</span>
                  <span className="text-primary">Container</span>
                  <span className="text-purple-500">{">"}</span>
                </div>
                <div className="pl-4 text-foreground">)</div>
                <div className="text-foreground">{"}"}</div>
              </div>
            </div>
          </Grid>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 md:py-24">
        <Container size="lg">
          <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background">
            <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-primary/10 blur-[80px]" />
            <CardContent className="relative p-8 md:p-12">
              <Stack gap="lg" align="center" className="text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                  <RocketIcon className="h-8 w-8 text-primary" />
                </div>
                <Title as="h2" size="h2" className="text-2xl md:text-3xl font-bold">
                  Ready to build your next website?
                </Title>
                <Text size="lg" variant="muted" className="max-w-xl">
                  Get started with Catalyst and ship your first page in minutes. 
                  No setup headaches, no configuration nightmares.
                </Text>
                
                {/* Feature pills */}
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <FeaturePill icon={GaugeIcon} label="Blazing Fast" />
                  <FeaturePill icon={PaletteIcon} label="Beautiful Design" />
                  <FeaturePill icon={MousePointerClickIcon} label="Great UX" />
                  <FeaturePill icon={RefreshCwIcon} label="Easy Updates" />
                </div>

                <Row gap="md" justify="center" className="flex-col sm:flex-row pt-4">
                  <Button
                    size="lg"
                    className="h-12 rounded-full px-8 shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:scale-105 transition-all"
                    nativeButton={false}
                    render={<Link href="/docs" />}
                  >
                    Start Building
                    <ArrowRightIcon className="ml-2 h-5 w-5" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-12 rounded-full px-8 hover:scale-105 transition-all"
                    nativeButton={false}
                    render={<Link href="/" />}
                  >
                    Learn More
                  </Button>
                </Row>
              </Stack>
            </CardContent>
          </Card>
        </Container>
      </section>
    </div>
  )
}
