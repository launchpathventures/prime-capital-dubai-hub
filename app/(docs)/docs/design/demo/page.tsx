/**
 * CATALYST - Design System Demo
 *
 * The ultimate design system playground. Update tokens, tweak components,
 * and watch everything respond in real-time. Part reference, part showpiece.
 */

"use client"

import { useState } from "react"
import { Stack, Text, Row, Title } from "@/components/core"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  RocketIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  ZapIcon,
  StarIcon,
  ArrowRightIcon,
  PaletteIcon,
  TypeIcon,
  LayoutGridIcon,
  SparklesIcon,
  SunIcon,
  MoonIcon,
  HeartIcon,
  TrendingUpIcon,
  UsersIcon,
  ActivityIcon,
  BotIcon,
  CodeIcon,
  CoffeeIcon,
  PartyPopperIcon,
  SpaceIcon,
  MinusIcon,
  PlusIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function DesignDemoPage() {
  return (
    <article>
      <Stack gap="xl">
        {/* ================================================================ */}
        {/* Hero Header */}
        {/* ================================================================ */}
        <header className="space-y-4">
          <Row gap="sm" className="items-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/60">
              <PaletteIcon className="h-5 w-5 text-primary-foreground" />
            </div>
            <Badge variant="secondary">Design System</Badge>
          </Row>
          <h1 className="text-3xl font-bold tracking-tight">Design Demo</h1>
          <Text size="lg" variant="muted" className="leading-relaxed">
            Your design system, visualised. Tweak a color token, adjust a font
            weight, change a border radius — then watch everything update here.
            It&apos;s like a mirror for your CSS, but more useful.
          </Text>
        </header>

        {/* Intro callout */}
        <div className="rounded-xl border border-violet-200 bg-gradient-to-br from-violet-50 to-purple-50/50 p-5 dark:border-violet-900/50 dark:from-violet-950/20 dark:to-purple-950/10">
          <Row gap="sm" className="mb-2 items-center">
            <SparklesIcon className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            <Text weight="semibold">Why this page exists</Text>
          </Row>
          <Text size="sm" className="text-violet-900 dark:text-violet-200">
            Design systems are living things. This page helps you validate
            changes at a glance, catch regressions before they ship, and
            honestly? It&apos;s just satisfying to see everything in one place.
          </Text>
        </div>

        {/* ================================================================ */}
        {/* Main Tabs */}
        {/* ================================================================ */}
        <Tabs defaultValue="colors" className="w-full">
          <TabsList className="mb-6 w-full justify-start">
            <TabsTrigger value="colors" className="gap-1.5">
              <PaletteIcon className="h-4 w-4" />
              Colors
            </TabsTrigger>
            <TabsTrigger value="typography" className="gap-1.5">
              <TypeIcon className="h-4 w-4" />
              Typography
            </TabsTrigger>
            <TabsTrigger value="components" className="gap-1.5">
              <LayoutGridIcon className="h-4 w-4" />
              Components
            </TabsTrigger>
            <TabsTrigger value="patterns" className="gap-1.5">
              <SparklesIcon className="h-4 w-4" />
              Patterns
            </TabsTrigger>
          </TabsList>

          {/* ============================================================ */}
          {/* Colors Tab */}
          {/* ============================================================ */}
          <TabsContent value="colors" className="space-y-8">
            {/* Semantic Colors */}
            <section className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold">Semantic Colors</h2>
                <Text size="sm" variant="muted">
                  The core palette. These tokens define your brand and UI hierarchy.
                </Text>
              </div>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                <ColorCard name="Primary" token="--color-primary" className="bg-primary text-primary-foreground" />
                <ColorCard name="Secondary" token="--color-secondary" className="bg-secondary text-secondary-foreground" />
                <ColorCard name="Muted" token="--color-muted" className="bg-muted text-muted-foreground" />
                <ColorCard name="Accent" token="--color-accent" className="bg-accent text-accent-foreground" />
              </div>
            </section>

            {/* Status Colors */}
            <section className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold">Status Colors</h2>
                <Text size="sm" variant="muted">
                  Feedback and state. Use sparingly for maximum impact.
                </Text>
              </div>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                <ColorCard name="Destructive" token="destructive" className="bg-destructive text-destructive-foreground" />
                <ColorCard name="Success" token="emerald-500" className="bg-emerald-500 text-white" />
                <ColorCard name="Warning" token="amber-500" className="bg-amber-500 text-white" />
                <ColorCard name="Info" token="sky-500" className="bg-sky-500 text-white" />
              </div>
            </section>

            {/* Surface Colors */}
            <section className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold">Surfaces</h2>
                <Text size="sm" variant="muted">
                  Backgrounds, cards, and borders. The canvas your UI lives on.
                </Text>
              </div>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                <ColorCard name="Background" token="--color-background" className="bg-background text-foreground border" />
                <ColorCard name="Foreground" token="--color-foreground" className="bg-foreground text-background" />
                <ColorCard name="Card" token="--color-card" className="bg-card text-card-foreground border" />
                <ColorCard name="Border" token="--color-border" className="bg-border text-foreground" />
              </div>
            </section>

            {/* Gradient Callouts */}
            <section className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold">Gradient Callouts</h2>
                <Text size="sm" variant="muted">
                  Our signature callout style. Subtle gradients that feel premium.
                </Text>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-xl border border-sky-200 bg-gradient-to-br from-sky-50 to-cyan-50/50 p-4 dark:border-sky-900/50 dark:from-sky-950/20 dark:to-cyan-950/10">
                  <Text weight="semibold" size="sm">Info / Neutral</Text>
                  <Text size="xs" variant="muted">Tips, notes, general information</Text>
                </div>
                <div className="rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50/50 p-4 dark:border-emerald-900/50 dark:from-emerald-950/20 dark:to-teal-950/10">
                  <Text weight="semibold" size="sm">Success / Positive</Text>
                  <Text size="xs" variant="muted">Confirmations, completed actions</Text>
                </div>
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-950/20">
                  <Text weight="semibold" size="sm" className="text-amber-900 dark:text-amber-200">Warning / Caution</Text>
                  <Text size="xs" className="text-amber-800 dark:text-amber-300">Important notices, proceed carefully</Text>
                </div>
                <div className="rounded-xl border border-violet-200 bg-gradient-to-br from-violet-50 to-purple-50/50 p-4 dark:border-violet-900/50 dark:from-violet-950/20 dark:to-purple-950/10">
                  <Text weight="semibold" size="sm">Feature / Highlight</Text>
                  <Text size="xs" variant="muted">New features, special content</Text>
                </div>
              </div>
            </section>
          </TabsContent>

          {/* ============================================================ */}
          {/* Typography Tab */}
          {/* ============================================================ */}
          <TabsContent value="typography" className="space-y-8">
            {/* Heading Scale */}
            <section className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold">Heading Scale</h2>
                <Text size="sm" variant="muted">
                  Bold, tracking-tight, and responsive. Each level has a purpose.
                </Text>
              </div>
              <div className="space-y-4 rounded-xl border p-6">
                <div className="border-b pb-4">
                  <Title size="h1">The quick brown fox — H1</Title>
                  <Text size="xs" variant="muted" className="mt-1">Page titles, hero headlines</Text>
                </div>
                <div className="border-b pb-4">
                  <Title size="h2">The quick brown fox — H2</Title>
                  <Text size="xs" variant="muted" className="mt-1">Section headers, major divisions</Text>
                </div>
                <div className="border-b pb-4">
                  <Title size="h3">The quick brown fox — H3</Title>
                  <Text size="xs" variant="muted" className="mt-1">Subsections, card groups</Text>
                </div>
                <div>
                  <Title size="h4">The quick brown fox — H4</Title>
                  <Text size="xs" variant="muted" className="mt-1">Card titles, list headers</Text>
                </div>
              </div>
            </section>

            {/* Body Text */}
            <section className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold">Body Text</h2>
                <Text size="sm" variant="muted">
                  Clean and readable. The workhorse of your interface.
                </Text>
              </div>
              <div className="space-y-4 rounded-xl border p-6">
                <div className="space-y-1">
                  <Text size="lg">Large — For intros and lead paragraphs that need presence.</Text>
                  <Row gap="sm">
                    <Badge variant="outline">lg</Badge>
                    <Text size="xs" variant="muted">text-lg / 1.125rem</Text>
                  </Row>
                </div>
                <Separator />
                <div className="space-y-1">
                  <Text>Default — The standard for body copy, descriptions, and content.</Text>
                  <Row gap="sm">
                    <Badge variant="outline">base</Badge>
                    <Text size="xs" variant="muted">text-base / 1rem</Text>
                  </Row>
                </div>
                <Separator />
                <div className="space-y-1">
                  <Text size="sm">Small — Captions, metadata, supporting information.</Text>
                  <Row gap="sm">
                    <Badge variant="outline">sm</Badge>
                    <Text size="xs" variant="muted">text-sm / 0.875rem</Text>
                  </Row>
                </div>
                <Separator />
                <div className="space-y-1">
                  <Text size="xs">Extra small — Fine print, timestamps, badges.</Text>
                  <Row gap="sm">
                    <Badge variant="outline">xs</Badge>
                    <Text size="xs" variant="muted">text-xs / 0.75rem</Text>
                  </Row>
                </div>
              </div>
            </section>

            {/* Text Variants */}
            <section className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold">Text Variants</h2>
                <Text size="sm" variant="muted">
                  Color and weight variations for hierarchy.
                </Text>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-lg border p-4">
                  <Text weight="bold">Bold weight</Text>
                  <Text size="xs" variant="muted">For emphasis and headers</Text>
                </div>
                <div className="rounded-lg border p-4">
                  <Text weight="semibold">Semibold weight</Text>
                  <Text size="xs" variant="muted">For subheaders and labels</Text>
                </div>
                <div className="rounded-lg border p-4">
                  <Text weight="medium">Medium weight</Text>
                  <Text size="xs" variant="muted">For subtle emphasis</Text>
                </div>
                <div className="rounded-lg border p-4">
                  <Text variant="muted">Muted variant</Text>
                  <Text size="xs" variant="muted">For secondary content</Text>
                </div>
              </div>
            </section>
          </TabsContent>

          {/* ============================================================ */}
          {/* Components Tab */}
          {/* ============================================================ */}
          <TabsContent value="components" className="space-y-8">
            {/* Buttons */}
            <section className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold">Buttons</h2>
                <Text size="sm" variant="muted">
                  Every variant, every size. Click them if you want — they don&apos;t bite.
                </Text>
              </div>
              <div className="space-y-4 rounded-xl border p-6">
                <div>
                  <Text size="xs" weight="medium" variant="muted" className="mb-2">VARIANTS</Text>
                  <Row gap="sm" className="flex-wrap">
                    <Button>Primary</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="destructive">Destructive</Button>
                  </Row>
                </div>
                <Separator />
                <div>
                  <Text size="xs" weight="medium" variant="muted" className="mb-2">SIZES</Text>
                  <Row gap="sm" className="flex-wrap items-center">
                    <Button size="sm">Small</Button>
                    <Button size="default">Default</Button>
                    <Button size="lg">Large</Button>
                    <Button size="icon"><StarIcon className="h-4 w-4" /></Button>
                  </Row>
                </div>
                <Separator />
                <div>
                  <Text size="xs" weight="medium" variant="muted" className="mb-2">WITH ICONS</Text>
                  <Row gap="sm" className="flex-wrap">
                    <Button><RocketIcon className="h-4 w-4" /> Launch</Button>
                    <Button variant="outline">Continue <ArrowRightIcon className="h-4 w-4" /></Button>
                    <Button variant="secondary"><HeartIcon className="h-4 w-4" /> Like</Button>
                  </Row>
                </div>
                <Separator />
                <div>
                  <Text size="xs" weight="medium" variant="muted" className="mb-2">STATES</Text>
                  <Row gap="sm" className="flex-wrap">
                    <Button disabled>Disabled</Button>
                    <Button variant="outline" disabled>Disabled Outline</Button>
                  </Row>
                </div>
              </div>
            </section>

            {/* Badges */}
            <section className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold">Badges</h2>
                <Text size="sm" variant="muted">
                  Labels, tags, and status indicators. Small but mighty.
                </Text>
              </div>
              <div className="rounded-xl border p-6">
                <Row gap="sm" className="flex-wrap">
                  <Badge>Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="outline">Outline</Badge>
                  <Badge variant="destructive">Destructive</Badge>
                </Row>
              </div>
            </section>

            {/* Form Elements */}
            <section className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold">Form Elements</h2>
                <Text size="sm" variant="muted">
                  Inputs that feel good to type in. Or toggle. Or slide.
                </Text>
              </div>
              <div className="grid gap-6 rounded-xl border p-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Project Name</Label>
                    <Input placeholder="my-awesome-project" />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea placeholder="What makes this project special?" rows={3} />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Text size="sm" weight="medium">Dark Mode</Text>
                      <Text size="xs" variant="muted">For night owls</Text>
                    </div>
                    <Switch />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <Text size="sm" weight="medium">Notifications</Text>
                      <Text size="xs" variant="muted">We&apos;ll ping you</Text>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Text size="sm" weight="medium">Progress</Text>
                    <Progress value={67} />
                    <Text size="xs" variant="muted">67% complete — almost there!</Text>
                  </div>
                </div>
              </div>
            </section>

            {/* Cards */}
            <section className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold">Cards</h2>
                <Text size="sm" variant="muted">
                  Containers with purpose. Every good UI needs a few.
                </Text>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="pt-0">
                  <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                    <RocketIcon className="h-12 w-12 text-primary" />
                  </div>
                  <CardHeader className="pb-2">
                    <Row className="items-center justify-between">
                      <CardTitle className="text-base">Ship Faster</CardTitle>
                      <Badge variant="secondary">New</Badge>
                    </Row>
                    <CardDescription>
                      Stop writing boilerplate. Let AI handle the boring stuff.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Row gap="sm">
                      <Button size="sm">Get Started</Button>
                      <Button size="sm" variant="outline">Learn More</Button>
                    </Row>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <TrendingUpIcon className="h-4 w-4 text-emerald-500" />
                      Weekly Stats
                    </CardTitle>
                    <CardDescription>Your productivity this week</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Row gap="xs" className="items-center">
                        <CodeIcon className="h-4 w-4 text-muted-foreground" />
                        <Text size="sm">Lines of code</Text>
                      </Row>
                      <Text size="sm" weight="semibold">2,847</Text>
                    </div>
                    <div className="flex items-center justify-between">
                      <Row gap="xs" className="items-center">
                        <CoffeeIcon className="h-4 w-4 text-muted-foreground" />
                        <Text size="sm">Coffees consumed</Text>
                      </Row>
                      <Text size="sm" weight="semibold">12</Text>
                    </div>
                    <div className="flex items-center justify-between">
                      <Row gap="xs" className="items-center">
                        <PartyPopperIcon className="h-4 w-4 text-muted-foreground" />
                        <Text size="sm">Features shipped</Text>
                      </Row>
                      <Text size="sm" weight="semibold">3</Text>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>
          </TabsContent>

          {/* ============================================================ */}
          {/* Patterns Tab */}
          {/* ============================================================ */}
          <TabsContent value="patterns" className="space-y-8">
            {/* List Items */}
            <section className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold">List Items</h2>
                <Text size="sm" variant="muted">
                  Activity feeds, notifications, timelines. The backbone of dashboards.
                </Text>
              </div>
              <div className="space-y-2">
                <ListItem
                  icon={BotIcon}
                  title="Claude helped you refactor"
                  subtitle="Removed 847 lines of code"
                  badge="Just now"
                />
                <ListItem
                  icon={PaletteIcon}
                  title="Design tokens updated"
                  subtitle="Primary color → teal"
                  badge="2m ago"
                />
                <ListItem
                  icon={CheckCircleIcon}
                  title="All tests passing"
                  subtitle="0 errors, 0 warnings"
                  badge="5m ago"
                  iconColor="text-emerald-500"
                />
              </div>
            </section>

            {/* Stats Grid */}
            <section className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold">Stat Cards</h2>
                <Text size="sm" variant="muted">
                  Numbers that matter. Make them big and beautiful.
                </Text>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <StatCard
                  icon={UsersIcon}
                  label="Total Users"
                  value="12,847"
                  change="+12%"
                  positive
                />
                <StatCard
                  icon={ActivityIcon}
                  label="Active Sessions"
                  value="342"
                  change="+8%"
                  positive
                />
                <StatCard
                  icon={ZapIcon}
                  label="Avg. Response"
                  value="23ms"
                  change="-15%"
                  positive
                />
              </div>
            </section>

            {/* Empty State */}
            <section className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold">Empty State</h2>
                <Text size="sm" variant="muted">
                  When there&apos;s nothing to show, make it delightful.
                </Text>
              </div>
              <div className="rounded-xl border border-dashed p-8 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <SparklesIcon className="h-6 w-6 text-muted-foreground" />
                </div>
                <Text weight="semibold">No bugs found</Text>
                <Text size="sm" variant="muted" className="mb-4">
                  Either you&apos;re a genius or the tests aren&apos;t running.
                </Text>
                <Row gap="sm" className="justify-center">
                  <Button variant="outline" size="sm">Run Tests</Button>
                  <Button size="sm">Celebrate</Button>
                </Row>
              </div>
            </section>

            {/* Spacing Scale */}
            <section className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold">Spacing Scale</h2>
                <Text size="sm" variant="muted">
                  Consistent spacing creates rhythm. Here&apos;s the scale we use.
                </Text>
              </div>
              <div className="space-y-3 rounded-xl border p-6">
                <SpacingRow size="0.25rem" label="4px" token="gap-1" />
                <SpacingRow size="0.5rem" label="8px" token="gap-2" />
                <SpacingRow size="1rem" label="16px" token="gap-4" />
                <SpacingRow size="1.5rem" label="24px" token="gap-6" />
                <SpacingRow size="2rem" label="32px" token="gap-8" />
                <SpacingRow size="3rem" label="48px" token="gap-12" />
              </div>
            </section>

            {/* Counter Example */}
            <section className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold">Interactive Demo</h2>
                <Text size="sm" variant="muted">
                  Just to prove things actually work around here.
                </Text>
              </div>
              <CaffeineCounter />
            </section>
          </TabsContent>
        </Tabs>

        {/* ================================================================ */}
        {/* Footer callout */}
        {/* ================================================================ */}
        <div className="rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50/50 p-5 dark:border-emerald-900/50 dark:from-emerald-950/20 dark:to-teal-950/10">
          <Row gap="sm" className="mb-2 items-center">
            <CheckCircleIcon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            <Text weight="semibold">Design system healthy</Text>
          </Row>
          <Text size="sm" className="text-emerald-900 dark:text-emerald-200">
            If everything on this page looks good, your design system is in great
            shape. Now go build something beautiful.
          </Text>
        </div>
      </Stack>
    </article>
  )
}

// =============================================================================
// Helper Components
// =============================================================================

function ColorCard({
  name,
  token,
  className,
}: {
  name: string
  token: string
  className?: string
}) {
  return (
    <div className={cn("flex h-20 flex-col items-center justify-center rounded-xl text-center", className)}>
      <Text size="sm" weight="semibold">{name}</Text>
      <Text size="xs" className="opacity-75">{token}</Text>
    </div>
  )
}

function ListItem({
  icon: Icon,
  title,
  subtitle,
  badge,
  iconColor = "text-primary",
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  subtitle: string
  badge: string
  iconColor?: string
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border p-3">
      <Row gap="sm" className="items-center">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
          <Icon className={cn("h-4 w-4", iconColor)} />
        </div>
        <div>
          <Text size="sm" weight="medium">{title}</Text>
          <Text size="xs" variant="muted">{subtitle}</Text>
        </div>
      </Row>
      <Badge variant="outline">{badge}</Badge>
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  change,
  positive,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  change: string
  positive?: boolean
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <Row className="items-center justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
            <Icon className="h-5 w-5 text-muted-foreground" />
          </div>
          <Badge variant={positive ? "secondary" : "destructive"} className="text-xs">
            {change}
          </Badge>
        </Row>
        <div className="mt-3">
          <Text size="2xl" weight="bold">{value}</Text>
          <Text size="sm" variant="muted">{label}</Text>
        </div>
      </CardContent>
    </Card>
  )
}

function SpacingRow({
  size,
  label,
  token,
}: {
  size: string
  label: string
  token: string
}) {
  return (
    <Row gap="md" className="items-center">
      <div
        className="shrink-0 rounded bg-primary"
        style={{ width: size, height: size, minWidth: size }}
      />
      <div className="flex-1">
        <Row gap="sm" className="items-center">
          <Text size="sm" weight="medium">{label}</Text>
          <Badge variant="outline" className="text-xs">{token}</Badge>
        </Row>
      </div>
    </Row>
  )
}

function CaffeineCounter() {
  const [count, setCount] = useState(3)
  
  const getMessage = () => {
    if (count === 0) return "No coffee? Brave choice."
    if (count <= 2) return "A reasonable amount of caffeine."
    if (count <= 5) return "You're in the zone."
    if (count <= 8) return "Your code might vibrate."
    return "You can see through time now."
  }

  return (
    <div className="rounded-xl border p-6">
      <Row className="items-center justify-between">
        <div>
          <Text weight="semibold">Caffeine Level</Text>
          <Text size="sm" variant="muted">{getMessage()}</Text>
        </div>
        <Row gap="xs" className="items-center">
          <Button
            size="icon"
            variant="outline"
            onClick={() => setCount(Math.max(0, count - 1))}
          >
            <MinusIcon className="h-4 w-4" />
          </Button>
          <div className="flex h-10 w-12 items-center justify-center rounded-md bg-muted text-lg font-semibold">
            {count}
          </div>
          <Button
            size="icon"
            variant="outline"
            onClick={() => setCount(count + 1)}
          >
            <PlusIcon className="h-4 w-4" />
          </Button>
        </Row>
      </Row>
      <Progress value={Math.min(count * 10, 100)} className="mt-4" />
    </div>
  )
}
