/**
 * CATALYST - About Page
 *
 * Overview of Catalyst methodology with elegant styling matching the Overview page.
 * Route: /catalyst/about
 */

import Link from "next/link"
import { Stack, Row, Text, Title, Grid } from "@/components/core"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Sparkles,
  RefreshCw,
  FolderOpen,
  BookOpen,
  ArrowRight,
  Target,
  Compass,
  Users,
  Palette,
  Layers,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react"

// -----------------------------------------------------------------------------
// Data
// -----------------------------------------------------------------------------

const stages = [
  {
    id: "poc",
    label: "POC",
    title: "Proof of Concept",
    description: "Validate the idea. Rough is fine.",
    focus: "Validate with a real, working example",
  },
  {
    id: "mvp",
    label: "MVP",
    title: "Minimum Viable Product",
    description: "Real users, real data. Only what's necessary.",
    focus: "Test with users end-to-end",
  },
  {
    id: "mmp",
    label: "MMP",
    title: "Minimum Marketable Product",
    description: "Reliable, shareable, ready for paying customers.",
    focus: "Polish, harden, prepare to scale",
  },
  {
    id: "prod",
    label: "PROD",
    title: "Production",
    description: "Intentionally hardened – not accidentally live.",
    focus: "Stability & scale at enterprise level",
  },
] as const

const deliveryLoop = [
  {
    phase: "Brief",
    description: "Define what you're building and why",
    checkpoint: "Is intent clear enough to build?",
  },
  {
    phase: "Build",
    description: "Ship working software",
    checkpoint: "Is it ready to show people?",
  },
  {
    phase: "Review",
    description: "Get feedback on the real thing",
    checkpoint: "Do we understand what needs to change?",
  },
  {
    phase: "Refine",
    description: "Decide what changes",
    checkpoint: "Loop again, or advance?",
  },
]

const coreSpecs = [
  {
    name: "Vision",
    icon: Compass,
    file: "project-vision.md",
    description: "North star, success criteria, decision principles",
  },
  {
    name: "Experience",
    icon: Users,
    file: "project-experience.md",
    description: "Users, journeys, and feature definitions",
  },
  {
    name: "Brand",
    icon: Palette,
    file: "project-brand.md",
    description: "Voice, visuals, and communication style",
  },
  {
    name: "Architecture",
    icon: Layers,
    file: "project-architecture.md",
    description: "Technical stack, patterns, and conventions",
  },
]

const quickLinks = [
  {
    href: "/docs/core/approach",
    icon: Sparkles,
    title: "Getting Started",
    description: "Quick start guide for new projects",
  },
  {
    href: "/docs/workflow",
    icon: Target,
    title: "Methodology",
    description: "Deep dive on the Catalyst method",
  },
  {
    href: "/docs",
    icon: BookOpen,
    title: "Full Documentation",
    description: "Kit components, patterns, and guides",
  },
]

// -----------------------------------------------------------------------------
// Page Component
// -----------------------------------------------------------------------------

export default function CatalystAboutPage() {
  return (
    <article className="catalyst-about">
      <Stack gap="lg">
        {/* ============================================================
            HERO SECTION: Matches Overview page gradient card
            ============================================================ */}
        <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-primary/3 to-white dark:to-background p-5 md:p-6">
          <Stack gap="md">
            <Row gap="sm" align="center">
              <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Sparkles className="h-5 w-5 md:h-6 md:w-6" />
              </div>
              <Title size="h3" className="font-bold">
                About Catalyst
              </Title>
            </Row>
            <Text size="sm" variant="muted">
              Catalyst is a method and a kit – working together to help you build the right thing, fast.
            </Text>
          </Stack>
        </div>

        {/* ============================================================
            WHY CATALYST: The problem it solves
            ============================================================ */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <Stack gap="xs">
            <Text size="sm" weight="medium">Why Catalyst? Speed isn&apos;t the problem – drift is.</Text>
            <Text size="xs" variant="muted">
              Misread intent, silent scope creep, and prototypes that quietly become production.
              Catalyst provides the guardrails to keep you aligned as velocity increases.
            </Text>
          </Stack>
        </div>

        {/* ============================================================
            DELIVERY LOOP: Compact horizontal steps
            ============================================================ */}
        <Card>
          <CardContent className="pt-4 pb-4">
            <Row gap="sm" align="center" className="mb-3">
              <RefreshCw className="h-4 w-4 text-primary" />
              <Text size="base" weight="semibold">The Delivery Loop</Text>
              <Text size="sm" variant="muted">Loop until ready, then advance</Text>
            </Row>
            <Grid cols={4} gap="sm" className="delivery-loop-grid">
              {deliveryLoop.map((step, i) => (
                <div
                  key={step.phase}
                  className="relative p-3 rounded-xl bg-muted/50"
                >
                  <Stack gap="xs">
                    <Row gap="sm" align="center">
                      <Badge variant="outline" className="text-[10px] font-mono px-1.5 py-0 h-5">
                        {i + 1}
                      </Badge>
                      <Text size="sm" weight="semibold">{step.phase}</Text>
                    </Row>
                    <Text size="xs" variant="muted">{step.description}</Text>
                    <Text size="xs" className="italic text-muted-foreground/70 line-clamp-1">
                      &ldquo;{step.checkpoint}&rdquo;
                    </Text>
                  </Stack>
                </div>
              ))}
            </Grid>
          </CardContent>
        </Card>

        {/* ============================================================
            DELIVERY STAGES: Generic stage definitions
            ============================================================ */}
        <Card>
          <CardContent className="pt-4 pb-4">
            <Row gap="sm" align="center" className="mb-3">
              <Layers className="h-4 w-4 text-primary" />
              <Text size="base" weight="semibold">Delivery Stages</Text>
              <Text size="sm" variant="muted">Know where you are and what&apos;s next</Text>
            </Row>
            <Grid cols={2} gap="sm" className="stages-grid">
              {stages.map((stage) => (
                <div
                  key={stage.id}
                  className="p-3 rounded-xl bg-muted/50"
                >
                  <Stack gap="xs">
                    <Row gap="sm" align="center">
                      <Badge variant="outline" className="text-xs font-mono px-2">
                        {stage.label}
                      </Badge>
                      <Text size="sm" weight="medium">{stage.title}</Text>
                    </Row>
                    <Text size="xs" variant="muted">{stage.description}</Text>
                    <Row gap="xs" align="center">
                      <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
                      <Text size="xs" variant="muted">{stage.focus}</Text>
                    </Row>
                  </Stack>
                </div>
              ))}
            </Grid>
          </CardContent>
        </Card>

        {/* ============================================================
            CORE SPECS: Subtle card grid
            ============================================================ */}
        <Card>
          <CardContent className="pt-4 pb-4">
            <Row gap="sm" align="center" className="mb-3">
              <FolderOpen className="h-4 w-4 text-primary" />
              <Text size="base" weight="semibold">Core Project Specs</Text>
              <Text size="sm" variant="muted">Foundational documents</Text>
            </Row>
            <Grid cols={2} gap="sm" className="specs-grid">
              {coreSpecs.map((spec) => {
                const Icon = spec.icon
                return (
                  <div
                    key={spec.name}
                    className="p-3 rounded-xl bg-muted/50"
                  >
                    <Stack gap="xs">
                      <Row gap="sm" align="center">
                        <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                          <Icon className="h-4 w-4" />
                        </div>
                        <Text size="sm" weight="semibold">{spec.name}</Text>
                      </Row>
                      <Text size="xs" variant="muted">{spec.description}</Text>
                      <Text size="xs" className="font-mono text-muted-foreground/60">
                        {spec.file}
                      </Text>
                    </Stack>
                  </div>
                )
              })}
            </Grid>
          </CardContent>
        </Card>

        {/* ============================================================
            QUICK LINKS: Matches Overview page shortcut style
            ============================================================ */}
        <Row gap="sm" wrap className="items-stretch">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex-1 min-w-[140px] px-4 py-3 rounded-lg border bg-card hover:bg-muted/50 hover:border-primary/30 transition-colors group"
            >
              <Row gap="sm" align="center">
                <link.icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                <Stack gap="none" className="flex-1 min-w-0">
                  <Text size="sm" weight="medium">{link.title}</Text>
                  <Text size="xs" variant="muted" className="truncate">{link.description}</Text>
                </Stack>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
              </Row>
            </Link>
          ))}
        </Row>
      </Stack>
    </article>
  )
}
