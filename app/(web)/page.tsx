/**
 * CATALYST - Landing Page
 *
 * The main public-facing page explaining Catalyst's purpose.
 * Full homepage with all sections: Hero, Problem, Replacement,
 * Audiences, How It Works, Checkpoints, Stacks, Models, Proof, Boundaries, CTA.
 */

"use client"

import { config } from "@/lib/config"
import { useState, useEffect } from "react"
import {
  ArrowRightIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  LayersIcon,
  UsersIcon,
  RocketIcon,
  TargetIcon,
  CodeIcon,
  PresentationIcon,
  GlobeIcon,
  ZapIcon,
  LayoutTemplateIcon,
  GitMergeIcon,
  TerminalIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  PlayIcon,
  AlertTriangleIcon,
  BookOpenIcon,
} from "lucide-react"
import { cn, useScrollToTarget, scrollToElement } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Kbd } from "@/components/ui/kbd"
import { Container, Section, Stack, Row, Grid, Text, Title, Center } from "@/components/core"

export default function LandingPage() {
  useScrollToTarget()

  return (
    <Stack gap="none" className="overflow-hidden">
      <HeroSection />
      <SocialProofTicker />
      <ProblemSolutionToggle />
      <ValuePropBento />
      <HowItWorksPipeline />
      <AudienceTabs />
      <GatesSection />
      <StacksSection />
      <CTASection />
    </Stack>
  )
}

// =============================================================================
// HERO SECTION
// =============================================================================

function HeroSection() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  // Alt+M keyboard shortcut to scroll to "Learn More" section
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === "m") {
        e.preventDefault()
        scrollToElement("stop-the-chaos")
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <Section padding="xl" className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden text-center">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background opacity-70" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-[1000px] bg-primary/10 blur-[100px] rounded-full opacity-50" />
      
      <Container size="xl" className={cn("transition-all duration-1000 ease-out", mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}>
        
        <Stack gap="lg" align="center">
          <a href={config.vendor.url} target="_blank" rel="noopener noreferrer">
            <Badge variant="outline" className="animate-fade-in-up border-primary/30 bg-primary/5 text-primary backdrop-blur-sm hover:bg-primary/10 cursor-pointer">
              <RocketIcon className="size-3" />
              AI Dev Kit by {config.vendor.name}
            </Badge>
          </a>

          <Title as="h1" size="h1" align="center" className="text-5xl sm:text-7xl md:text-8xl font-extrabold">
            Ship <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500 animate-gradient-x drop-shadow-sm">Proof</span>, <br className="hidden sm:block" />
            Not Promises.
          </Title>

          <Text size="xl" align="center" className="text-foreground/80 max-w-2xl sm:text-2xl leading-relaxed font-medium">
            The AI-first operating system for high-velocity delivery. 
            Replace slow discovery loops with <span className="text-foreground font-bold">quality code</span> and a managed path to production.
          </Text>

          <Row gap="md" className="flex-col sm:flex-row pt-8">
          <Button 
            data-scroll-target="stop-the-chaos"
            className="h-14 px-8 text-lg rounded-full border-0 shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:scale-105"
          >
              More
              <Kbd className="ml-2">Alt+M</Kbd>
              <ChevronDownIcon className="ml-1 h-5 w-5" />
          </Button>
          <Button 
            variant="outline"
            nativeButton={false}
            className="h-14 px-8 text-lg rounded-full backdrop-blur-sm hover:scale-105"
            render={<a href="/docs" />}
          >
              <BookOpenIcon className="mr-2 h-5 w-5" />
              View Docs
          </Button>
          </Row>
        </Stack>

        {/* Terminal Preview */}
        <div className="mt-16 relative mx-auto max-w-4xl rounded-xl border bg-card/50 shadow-2xl backdrop-blur-sm overflow-hidden animate-fade-in-up delay-300">
          <Row gap="sm" className="border-b bg-muted/50 px-4 py-3">
            <div className="h-3 w-3 rounded-full bg-red-500/80" />
            <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
            <div className="h-3 w-3 rounded-full bg-green-500/80" />
            <Text inline size="xs" variant="muted" mono className="ml-2">catalyst-cli — v2.0.0</Text>
          </Row>
          <div className="p-6 text-left font-mono text-sm sm:text-base overflow-x-auto">
            <Stack gap="sm">
              <Row gap="sm">
                <Text inline className="text-green-500">➜</Text>
                <Text inline className="text-blue-400">~</Text>
                <Text inline variant="muted">npx create-catalyst-app my-project</Text>
              </Row>
              <Stack gap="xs" className="text-muted-foreground pl-4">
                <Text inline><span className="text-green-500">✔</span> Scaffolding project structure...</Text>
                <Text inline><span className="text-green-500">✔</span> Installing dependencies...</Text>
                <Text inline><span className="text-green-500">✔</span> Initializing git...</Text>
                <Text inline><span className="text-green-500">✔</span> Setting up Brief checkpoint...</Text>
                <Text inline weight="bold" className="text-foreground mt-2">Ready for production! 🚀</Text>
              </Stack>
            </Stack>
          </div>
        </div>
      </Container>
    </Section>
  )
}

// =============================================================================
// SOCIAL PROOF TICKER
// =============================================================================

function SocialProofTicker() {
  return (
    <Section padding="md" className="border-y bg-muted/30">
      <Container size="xl" className="text-center">
        <Text size="sm" weight="medium" variant="muted" align="center" className="mb-6 uppercase tracking-widest">
          Trusted by forward-thinking teams
        </Text>
        <Row gap="xl" justify="center" wrap className="opacity-70 grayscale transition-all hover:grayscale-0 hover:opacity-100 duration-500">
          <Row gap="sm" className="text-xl font-bold"><ZapIcon className="h-5 w-5" /> RIVER</Row>
          <Row gap="sm" className="text-xl font-bold"><RocketIcon className="h-5 w-5" /> Launchpath</Row>
          <Row gap="sm" className="text-xl font-bold"><TargetIcon className="h-5 w-5" /> Status</Row>
          <Row gap="sm" className="text-xl font-bold"><GlobeIcon className="h-5 w-5" /> Global Corp</Row>
        </Row>
      </Container>
    </Section>
  )
}

// =============================================================================
// PROBLEM / SOLUTION TOGGLE (custom markdown to support the animation)
// =============================================================================

function ProblemSolutionToggle() {
  const [mode, setMode] = useState<"chaos" | "order">("chaos")

  return (
    <Section id="stop-the-chaos" padding="xl" className="bg-gradient-to-b from-background to-muted/30 scroll-mt-4">
      <Container size="lg" className="text-center">
        <Stack gap="xl">
        <Stack gap="sm">
          <Title as="h2" size="h2" align="center" className="text-3xl sm:text-5xl">
            Stop the <span className={cn("transition-colors duration-500", mode === "chaos" ? "text-destructive" : "text-muted-foreground line-through")}>Chaos</span>.
          </Title>
          <Text size="lg" variant="muted" align="center" className="max-w-2xl mx-auto">
            Most AI projects fail not because of code, but because of drift.
          </Text>
        </Stack>

        {/* Toggle Switch */}
        <Row justify="center">
          <Row className="bg-muted p-1 rounded-full relative cursor-pointer shadow-inner">
            <div 
              className={cn(
                "absolute top-1 bottom-1 w-[140px] rounded-full bg-background shadow-sm transition-all duration-500 ease-spring",
                mode === "chaos" ? "left-1" : "left-[145px]"
              )} 
            />
            <button 
              onClick={() => setMode("chaos")}
              className={cn("relative z-10 w-[140px] py-2 text-sm font-medium rounded-full transition-colors cursor-pointer", mode === "chaos" ? "text-foreground" : "text-muted-foreground")}
            >
              The Old Way
            </button>
            <button 
              onClick={() => setMode("order")}
              className={cn("relative z-10 w-[140px] py-2 text-sm font-medium rounded-full transition-colors cursor-pointer", mode === "order" ? "text-primary" : "text-muted-foreground")}
            >
              The Catalyst Way
            </button>
          </Row>
        </Row>

        {/* Content Card */}
        <div className="relative min-h-[400px]">
          {/* Chaos Card */}
          <div className={cn(
            "absolute inset-0 transition-all duration-500 transform",
            mode === "chaos" ? "opacity-100 scale-100 rotate-0 z-10" : "opacity-0 scale-95 -rotate-2 z-0 pointer-events-none"
          )}>
            <Stack align="center" justify="center" gap="lg" className="h-full rounded-2xl border border-destructive/20 bg-destructive/5 p-8 sm:p-12">
              <Grid cols={3} gap="md" className="w-full">
                <Stack gap="sm" className="bg-background/50 p-6 rounded-xl border border-destructive/10">
                  <Center className="h-10 w-10 rounded-full bg-destructive/10 text-destructive mx-auto">
                    <AlertTriangleIcon className="h-5 w-5" />
                  </Center>
                  <Title as="h3" size="h5" align="center" className="text-destructive">Endless Discovery</Title>
                  <Text size="sm" variant="muted" align="center">Weeks of workshops and wireframes before a single line of code is written.</Text>
                </Stack>
                <Stack gap="sm" className="bg-background/50 p-6 rounded-xl border border-destructive/10">
                  <Center className="h-10 w-10 rounded-full bg-destructive/10 text-destructive mx-auto">
                    <GitMergeIcon className="h-5 w-5" />
                  </Center>
                  <Title as="h3" size="h5" align="center" className="text-destructive">Scope Creep</Title>
                  <Text size="sm" variant="muted" align="center">"Just one more feature" turns a simple POC into a bloated, unshipping monster.</Text>
                </Stack>
                <Stack gap="sm" className="bg-background/50 p-6 rounded-xl border border-destructive/10">
                  <Center className="h-10 w-10 rounded-full bg-destructive/10 text-destructive mx-auto">
                    <TerminalIcon className="h-5 w-5" />
                  </Center>
                  <Title as="h3" size="h5" align="center" className="text-destructive">Rebuild Chaos</Title>
                  <Text size="sm" variant="muted" align="center">Throwing away the prototype because it wasn't built to scale.</Text>
                </Stack>
              </Grid>
            </Stack>
          </div>

          {/* Order Card */}
          <div className={cn(
            "absolute inset-0 transition-all duration-500 transform",
            mode === "order" ? "opacity-100 scale-100 rotate-0 z-10" : "opacity-0 scale-95 rotate-2 z-0 pointer-events-none"
          )}>
            <Stack align="center" justify="center" gap="lg" className="h-full rounded-2xl border border-primary/20 bg-primary/5 p-8 sm:p-12 shadow-2xl shadow-primary/10">
              <Grid cols={3} gap="md" className="w-full">
                <Stack gap="sm" className="bg-background p-6 rounded-xl border border-primary/10 shadow-sm hover:shadow-md transition-shadow">
                  <Center className="h-10 w-10 rounded-full bg-primary/10 text-primary mx-auto">
                    <ZapIcon className="h-5 w-5" />
                  </Center>
                  <Title as="h3" size="h5" align="center" className="text-primary">1-Week POC</Title>
                  <Text size="sm" variant="muted" align="center">Go from workshop to working code in days. Validate with reality, not diagrams.</Text>
                </Stack>
                <Stack gap="sm" className="bg-background p-6 rounded-xl border border-primary/10 shadow-sm hover:shadow-md transition-shadow">
                  <Center className="h-10 w-10 rounded-full bg-primary/10 text-primary mx-auto">
                    <ShieldCheckIcon className="h-5 w-5" />
                  </Center>
                  <Title as="h3" size="h5" align="center" className="text-primary">Delivery Checkpoints</Title>
                  <Text size="sm" variant="muted" align="center">Built-in checkpoints in every phase keep projects aligned.</Text>
                </Stack>
                <Stack gap="sm" className="bg-background p-6 rounded-xl border border-primary/10 shadow-sm hover:shadow-md transition-shadow">
                  <Center className="h-10 w-10 rounded-full bg-primary/10 text-primary mx-auto">
                    <LayersIcon className="h-5 w-5" />
                  </Center>
                  <Title as="h3" size="h5" align="center" className="text-primary">Production Path</Title>
                  <Text size="sm" variant="muted" align="center">Start simple (Stack A), then upgrade (Stack B/C) without rebuilding.</Text>
                </Stack>
              </Grid>
            </Stack>
          </div>
        </div>
        </Stack>
      </Container>
    </Section>
  )
}

// =============================================================================
// VALUE PROP BENTO GRID
// =============================================================================

function ValuePropBento() {
  return (
    <Section padding="xl">
      <Container size="xl">
        <Stack gap="xl">
          <Stack gap="md" align="center" className="max-w-3xl mx-auto">
            <Title size="h2" align="center">Everything you need to deliver.</Title>
            <Text size="lg" variant="muted" align="center">Catalyst isn't just a template. It's a complete operating system for AI delivery.</Text>
          </Stack>

        <Grid cols={3} gap="sm" className="auto-rows-[300px]">
          {/* Large Card - Left */}
          <Stack className="md:col-span-2 row-span-1 rounded-3xl border bg-card p-8 relative overflow-hidden group hover:border-primary/50 transition-colors shadow-sm">
            <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-30 transition-opacity">
              <LayoutTemplateIcon className="h-64 w-64 -mr-16 -mt-16" />
            </div>
            <Stack gap="md" className="relative z-10 h-full justify-between">
              <Stack gap="md">
                <Center className="h-12 w-12 rounded-2xl bg-primary/10 text-primary">
                  <GlobeIcon className="h-6 w-6" />
                </Center>
                <Title size="h3">Three Delivery Surfaces</Title>
                <Text variant="muted" className="max-w-md">
                  Don't just build an app. Build the story. Catalyst supports Websites, Presentations, and Apps as first-class citizens.
                </Text>
              </Stack>
              <Row gap="sm">
                <Badge variant="secondary" className="bg-secondary/20 text-secondary-foreground hover:bg-secondary/30">Web</Badge>
                <Badge variant="secondary" className="bg-secondary/20 text-secondary-foreground hover:bg-secondary/30">Deck</Badge>
                <Badge variant="secondary" className="bg-secondary/20 text-secondary-foreground hover:bg-secondary/30">App</Badge>
              </Row>
            </Stack>
          </Stack>

          {/* Tall Card - Right */}
          <Stack className="md:col-span-1 row-span-2 rounded-3xl border bg-card p-8 relative overflow-hidden group hover:border-primary/50 transition-colors shadow-sm">
             <div className="absolute bottom-0 right-0 p-8 opacity-20 group-hover:opacity-30 transition-opacity">
              <LayersIcon className="h-64 w-64 -mr-16 -mb-16" />
            </div>
            <Stack gap="md" className="relative z-10 h-full">
              <Center className="h-12 w-12 rounded-2xl bg-secondary/10 text-secondary">
                <LayersIcon className="h-6 w-6" />
              </Center>
              <Title size="h3">The Stack Ladder</Title>
              <Text variant="muted">
                Start light, scale heavy. Never over-engineer day one.
              </Text>
              
              <Stack gap="md" className="mt-auto">
                <Stack gap="xs" className="p-4 rounded-xl bg-background border border-border shadow-sm">
                  <Row justify="between" align="center">
                    <Text weight="bold">Stack A</Text>
                    <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/20">POC</Badge>
                  </Row>
                  <Text size="xs" variant="muted">Next.js + Tailwind. Speed.</Text>
                </Stack>
                <Stack gap="xs" className="p-4 rounded-xl bg-muted/40 border border-border/50">
                  <Row justify="between" align="center">
                    <Text weight="bold" className="text-foreground/80">Stack B</Text>
                    <Badge variant="outline" className="text-[10px]">MVP</Badge>
                  </Row>
                  <Text size="xs" variant="muted">+ Supabase. Persistence.</Text>
                </Stack>
                <Stack gap="xs" className="p-4 rounded-xl bg-muted/40 border border-border/50">
                  <Row justify="between" align="center">
                    <Text weight="bold" className="text-foreground/80">Stack C</Text>
                    <Badge variant="outline" className="text-[10px]">Scale</Badge>
                  </Row>
                  <Text size="xs" variant="muted">+ Laravel/Custom. Power.</Text>
                </Stack>
              </Stack>
            </Stack>
          </Stack>

          {/* Small Card - Bottom Left */}
          <Stack gap="md" className="md:col-span-1 row-span-1 rounded-3xl border bg-card p-8 group hover:border-primary/50 transition-colors">
            <Center className="h-12 w-12 rounded-2xl bg-tertiary/10 text-tertiary">
              <TargetIcon className="h-6 w-6" />
            </Center>
            <Title size="h4">Brief Phase</Title>
            <Text size="sm" variant="muted">
              Validate the "Why" before you build the "What". Stop projects that don't matter.
            </Text>
          </Stack>

          {/* Small Card - Bottom Middle */}
          <Stack gap="md" className="md:col-span-1 row-span-1 rounded-3xl border bg-card p-8 group hover:border-primary/50 transition-colors">
            <Center className="h-12 w-12 rounded-2xl bg-success/10 text-success">
              <ShieldCheckIcon className="h-6 w-6" />
            </Center>
            <Title size="h4">Refine Phase</Title>
            <Text size="sm" variant="muted">
              No accidental production. Hardening checklists ensure you're actually ready.
            </Text>
          </Stack>
        </Grid>
        </Stack>
      </Container>
    </Section>
  )
}

// =============================================================================
// HOW IT WORKS PIPELINE
// =============================================================================

function HowItWorksPipeline() {
  return (
    <Section padding="xl" className="bg-muted/30 border-y">
      <Container size="xl">
        <Stack gap="xl" align="center">
          <Stack gap="md" align="center">
            <Title size="h2" align="center">The 1-Week Rhythm</Title>
            <Text variant="muted" align="center">From idea to validated proof in 5 days.</Text>
          </Stack>

          <Stack className="relative w-full">
            {/* Connecting Line */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-border -translate-y-1/2 hidden md:block" />
            
            <Grid cols={5} gap="lg" className="relative z-10">
              {[
                { step: "01", title: "Brief", desc: "Capture intent & constraints" },
                { step: "02", title: "Artefacts", desc: "Vision, Arch, & Requirements" },
                { step: "03", title: "Build", desc: "Stack A. Working code." },
                { step: "04", title: "Review", desc: "Live review & adjustment" },
                { step: "05", title: "Decide", desc: "Refine or Advance" },
              ].map((item, i) => (
                <Stack key={i} gap="md" align="center" className="group">
                  <Center className="w-12 h-12 rounded-full bg-background border-2 border-muted-foreground/30 font-bold text-muted-foreground group-hover:border-primary group-hover:text-primary group-hover:scale-110 transition-all duration-300 shadow-sm">
                    {item.step}
                  </Center>
                  <Title size="h5">{item.title}</Title>
                  <Text size="sm" variant="muted" align="center">{item.desc}</Text>
                </Stack>
              ))}
            </Grid>
          </Stack>
        </Stack>
      </Container>
    </Section>
  )
}

// =============================================================================
// AUDIENCE TABS
// =============================================================================

function AudienceTabs() {
  const audiences = [
    {
      id: "delivery-leads",
      title: "Delivery Leads",
      icon: <RocketIcon className="h-5 w-5" />,
      headline: "Speed without the mess.",
      copy: "You need to move fast, but you can't afford to break things. Catalyst gives you the velocity of AI with the governance of enterprise delivery.",
      points: ["Standardised artefacts", "Clear decision logs", "No 'hero' dependency"]
    },
    {
      id: "solo-builders",
      title: "Solo Builders",
      icon: <CodeIcon className="h-5 w-5" />,
      headline: "Escape the low-code ceiling.",
      copy: "Vibe coding is fun until you need a database migration. Catalyst gives you a real, scalable codebase that you can actually take to production.",
      points: ["Real React/Next.js code", "Production-ready auth", "Scalable architecture"]
    },
    {
      id: "agencies",
      title: "Agencies",
      icon: <UsersIcon className="h-5 w-5" />,
      headline: "Stop reinventing the wheel.",
      copy: "Every project starts from zero. Catalyst gives you a standardized operating system so your team can focus on the unique 10% that creates value.",
      points: ["Repeatable revenue", "Consistent quality", "Faster onboarding"]
    }
  ]

  return (
    <Section padding="xl">
      <Container size="lg">
        <Stack gap="xl">
          <Title size="h2" align="center">Built for your reality.</Title>
          
          <Tabs defaultValue="delivery-leads" orientation="vertical" className="flex flex-col md:flex-row gap-8">
            <TabsList className="flex-row md:flex-col md:w-1/3 overflow-x-auto md:overflow-visible pb-4 md:pb-0 bg-transparent gap-2 h-auto">
              {audiences.map((audience) => (
                <TabsTrigger
                  key={audience.id}
                  value={audience.id}
                  className={cn(
                    "flex items-center gap-3 p-4 rounded-xl text-left transition-all min-w-[200px] md:min-w-0 h-auto justify-start",
                    "bg-muted/50 hover:bg-muted text-muted-foreground",
                    "data-[selected]:bg-primary data-[selected]:text-primary-foreground data-[selected]:shadow-lg data-[selected]:scale-105"
                  )}
                >
                  {audience.icon}
                  <Text inline weight="medium">{audience.title}</Text>
                </TabsTrigger>
              ))}
            </TabsList>

            {audiences.map((audience) => (
              <TabsContent
                key={audience.id}
                value={audience.id}
                className="md:w-2/3 bg-card border rounded-3xl p-8 md:p-12 shadow-xl min-h-[300px] animate-fade-in"
              >
                <Stack gap="lg" className="h-full justify-center">
                  <Title size="h3" className="text-primary">{audience.headline}</Title>
                  <Text size="lg" variant="muted" leading="relaxed">
                    {audience.copy}
                  </Text>
                  <Stack gap="sm">
                    {audience.points.map((point, i) => (
                      <Row key={i} gap="sm" align="center">
                        <CheckCircleIcon className="h-5 w-5 text-green-500" />
                        <Text weight="medium">{point}</Text>
                      </Row>
                    ))}
                  </Stack>
                </Stack>
              </TabsContent>
            ))}
          </Tabs>
        </Stack>
      </Container>
    </Section>
  )
}

// =============================================================================
// CHECKPOINTS SECTION (Delivery Loop phases)
// =============================================================================

function GatesSection() {
  return (
    <Section padding="xl" className="bg-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      <Container size="lg" className="relative z-10">
        <Stack gap="xl" align="center">
          <Title size="h2" align="center" className="text-white">Built-in Checkpoints</Title>
          
          <Grid cols={3} gap="lg">
            <Stack gap="md" align="center" className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
              <Center className="h-12 w-12 rounded-full bg-blue-500/20 text-blue-400">
                <TargetIcon className="h-6 w-6" />
              </Center>
              <Title size="h4" className="text-white">Brief</Title>
              <Text size="sm" align="center" className="text-slate-400">Are we building the right thing?</Text>
            </Stack>
            <Stack gap="md" align="center" className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
              <Center className="h-12 w-12 rounded-full bg-yellow-500/20 text-yellow-400">
                <CodeIcon className="h-6 w-6" />
              </Center>
              <Title size="h4" className="text-white">Build & Review</Title>
              <Text size="sm" align="center" className="text-slate-400">Are we building it right?</Text>
            </Stack>
            <Stack gap="md" align="center" className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
              <Center className="h-12 w-12 rounded-full bg-green-500/20 text-green-400">
                <ShieldCheckIcon className="h-6 w-6" />
              </Center>
              <Title size="h4" className="text-white">Refine</Title>
              <Text size="sm" align="center" className="text-slate-400">Loop again or advance?</Text>
            </Stack>
          </Grid>
        </Stack>
      </Container>
    </Section>
  )
}

// =============================================================================
// STACKS SECTION (Simplified)
// =============================================================================

function StacksSection() {
  return (
    <Section padding="xl">
      <Container size="lg">
        <Stack gap="xl" align="center">
          <Stack gap="md" align="center">
            <Title size="h2" align="center">Start Small. Scale Later.</Title>
            <Text variant="muted" align="center">The architecture grows with your product.</Text>
          </Stack>
          
          <Row gap="md" align="center" justify="center" className="flex-col md:flex-row">
            <Stack gap="sm" align="center" className="w-full md:w-1/3 p-6 rounded-xl border-2 border-dashed border-muted-foreground/20">
              <Text className="text-4xl font-black text-muted-foreground/20">A</Text>
              <Title size="h4">Next.js Only</Title>
              <Text size="xs" variant="muted">For POCs & Demos</Text>
            </Stack>
            <ArrowRightIcon className="hidden md:block text-muted-foreground/30" />
            <Stack gap="sm" align="center" className="w-full md:w-1/3 p-6 rounded-xl border bg-card shadow-sm">
              <Text className="text-4xl font-black text-primary/20">B</Text>
              <Title size="h4" className="text-primary">Next.js + Supabase</Title>
              <Text size="xs" variant="muted">For MVPs & Apps</Text>
            </Stack>
            <ArrowRightIcon className="hidden md:block text-muted-foreground/30" />
            <Stack gap="sm" align="center" className="w-full md:w-1/3 p-6 rounded-xl border-2 border-dashed border-muted-foreground/20">
              <Text className="text-4xl font-black text-muted-foreground/20">C</Text>
              <Title size="h4">Next.js + Laravel</Title>
              <Text size="xs" variant="muted">For Enterprise Scale</Text>
            </Stack>
          </Row>
        </Stack>
      </Container>
    </Section>
  )
}

// =============================================================================
// CTA SECTION
// =============================================================================

function CTASection() {
  return (
    <Section padding="xl" className="bg-primary/5">
      <Container size="md">
        <Stack gap="lg" align="center">
          <Title size="h1" align="center" className="text-4xl sm:text-5xl">
            Ready to stop guessing?
          </Title>
          <Text size="xl" variant="muted" align="center" className="max-w-2xl">
            Join the teams using Catalyst to deliver world-class AI products in record time.
          </Text>
          <Row gap="md" justify="center" className="flex-col sm:flex-row pt-4">
            <Button
              nativeButton={false}
              className="h-16 px-10 text-xl rounded-full shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:scale-105"
              render={<a href="/docs" />}
            >
              Get Started
              <ArrowRightIcon className="ml-2 h-6 w-6" />
            </Button>
          </Row>
          <Text size="sm" variant="muted" align="center" className="pt-8">
            Open Source • MIT License • Built for the Future
          </Text>
        </Stack>
      </Container>
    </Section>
  )
}
