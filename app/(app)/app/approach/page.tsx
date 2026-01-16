/**
 * CATALYST - Approach Page
 *
 * Explains how Catalyst helps developers build apps efficiently.
 * Links to documentation for deeper learning.
 */

import { config } from "@/lib/config"
import { Container, Stack, Grid, Row, Text, Title } from "@/components/core"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  BookOpenIcon,
  LayersIcon,
  ZapIcon,
  TargetIcon,
  ArrowRightIcon,
  CodeIcon,
  RocketIcon,
} from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: `Approach | ${config.app.name}`,
  description: "How Catalyst helps you build production-ready apps",
}

export default function ApproachPage() {
  return (
    <Container size="lg" className="py-6">
      <Stack gap="xl">
        {/* Header */}
        <Stack gap="sm">
          <Title size="h3">The Catalyst Approach</Title>
          <Text variant="muted" className="max-w-2xl">
            Catalyst is designed for AI-assisted development. Clear conventions,
            inline documentation, and proven patterns help you ship faster.
          </Text>
        </Stack>

        {/* Core Principles */}
        <Stack gap="md">
          <Title size="h4">Core Principles</Title>
          <Grid cols={2} gap="md">
            <PrincipleCard
              icon={LayersIcon}
              title="Surfaces, Not Pages"
              description="Each surface (web, app, docs) has its own shell and styling. Delete a folder to remove an entire surface."
            />
            <PrincipleCard
              icon={ZapIcon}
              title="AI-First Structure"
              description="AGENTS.md provides context for AI tools. Clear file headers and conventions make code predictable."
            />
            <PrincipleCard
              icon={TargetIcon}
              title="Proof-Led Delivery"
              description="Start with POC, iterate to MVP, polish to production. Each stage has clear quality expectations."
            />
            <PrincipleCard
              icon={CodeIcon}
              title="Components Over Code"
              description="Use Stack, Row, Grid for layout. Use Text, Title for typography. Consistency beats cleverness."
            />
          </Grid>
        </Stack>

        {/* Quick Start */}
        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>
              The fastest path from clone to production
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Stack gap="md">
              <Step number={1} title="Read AGENTS.md">
                The source of truth for conventions. Your AI tools should read this first.
              </Step>
              <Step number={2} title="Pick your surface">
                Start with app for dashboards, web for marketing, or docs for documentation.
              </Step>
              <Step number={3} title="Configure auth">
                Set AUTH_MODE in .env.local. Demo mode for prototypes, Supabase for production.
              </Step>
              <Step number={4} title="Build with components">
                Use existing UI components. Check /app/components for examples.
              </Step>
            </Stack>
          </CardContent>
        </Card>

        {/* Documentation Links */}
        <Stack gap="md">
          <Title size="h4">Learn More</Title>
          <Grid cols={3} gap="md">
            <DocLink
              title="Documentation"
              description="Full guide to Catalyst patterns"
              href="/docs"
              icon={BookOpenIcon}
            />
            <DocLink
              title="Components"
              description="UI component reference"
              href="/app/components"
              icon={LayersIcon}
            />
            <DocLink
              title="Examples"
              description="Real-world implementations"
              href="/examples"
              icon={RocketIcon}
            />
          </Grid>
        </Stack>

        {/* CTA */}
        <Card className="bg-muted/50">
          <CardContent className="py-6">
            <Row className="justify-between items-center flex-wrap gap-4">
              <Stack gap="xs">
                <Text weight="medium">Ready to dive deeper?</Text>
                <Text size="sm" variant="muted">
                  The documentation covers everything from setup to deployment.
                </Text>
              </Stack>
              <Button render={<Link href="/docs" />}>
                <BookOpenIcon className="h-4 w-4" />
                Read the Docs
                <ArrowRightIcon className="h-4 w-4" />
              </Button>
            </Row>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  )
}

// =============================================================================
// Helper Components
// =============================================================================

function PrincipleCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType
  title: string
  description: string
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <Row gap="sm" className="items-center">
          <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center">
            <Icon className="h-4 w-4 text-primary" />
          </div>
          <CardTitle className="text-base">{title}</CardTitle>
        </Row>
      </CardHeader>
      <CardContent>
        <Text size="sm" variant="muted">{description}</Text>
      </CardContent>
    </Card>
  )
}

function Step({
  number,
  title,
  children,
}: {
  number: number
  title: string
  children: React.ReactNode
}) {
  return (
    <Row gap="md" className="items-start">
      <Badge variant="outline" className="shrink-0 h-6 w-6 p-0 justify-center">
        {number}
      </Badge>
      <Stack gap="xs">
        <Text weight="medium">{title}</Text>
        <Text size="sm" variant="muted">{children}</Text>
      </Stack>
    </Row>
  )
}

function DocLink({
  title,
  description,
  href,
  icon: Icon,
}: {
  title: string
  description: string
  href: string
  icon: React.ElementType
}) {
  return (
    <Link href={href} className="group">
      <Card className="h-full transition-colors hover:border-primary/50">
        <CardHeader className="pb-2">
          <Row gap="sm" className="items-center">
            <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            <CardTitle className="text-sm group-hover:text-primary transition-colors">
              {title}
            </CardTitle>
          </Row>
        </CardHeader>
        <CardContent>
          <Text size="xs" variant="muted">{description}</Text>
        </CardContent>
      </Card>
    </Link>
  )
}
