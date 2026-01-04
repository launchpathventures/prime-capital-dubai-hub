/**
 * CATALYST - Component Examples
 *
 * Real-world patterns combining multiple primitives.
 * Use this page to preview design system changes at a glance.
 */

"use client"

import { useState } from "react"
import {
  RocketIcon,
  BotIcon,
  PaletteIcon,
  CodeIcon,
  BugIcon,
  CheckIcon,
  ZapIcon,
  LightbulbIcon,
  AlertCircleIcon,
  MinusIcon,
  PlusIcon,
  SearchIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArchiveIcon,
  FlagIcon,
  LoaderIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export default function ExamplesPage() {
  return (
    <article className="space-y-8">
      {/* Page header */}
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Examples</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Real-world patterns combining multiple primitives.
        </p>
      </header>

      {/* Intro */}
      <section className="bg-muted space-y-2 rounded-lg p-4">
        <p className="text-muted-foreground text-sm">
          This page is your <strong>design system preview</strong>. When you update colors, 
          typography, or component styles, check here to see the effect across common UI patterns.
          Great for validating changes with AI or teammates.
        </p>
      </section>

      {/* Examples Grid */}
      <div className="grid gap-12 pb-8 md:grid-cols-2">
        {/* Card with Image */}
        <ExampleCard title="Card">
          <Card className="pt-0">
            <div className="bg-gradient-to-br from-primary/20 to-secondary/20 flex aspect-video items-center justify-center">
              <RocketIcon className="text-primary size-16" />
            </div>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Ship Faster with AI</CardTitle>
                <Badge variant="secondary">New</Badge>
              </div>
              <CardDescription>
                Stop writing boilerplate. Let your AI pair-programmer handle the boring stuff.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Button size="sm">Get Started</Button>
              <Button size="sm" variant="outline">Learn More</Button>
            </CardContent>
          </Card>
        </ExampleCard>

        {/* Form */}
        <ExampleCard title="Form">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Deploy to Production</CardTitle>
              <CardDescription>Configure your deployment settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Environment</Label>
                  <Input placeholder="production" className="h-8 text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Region</Label>
                  <Input placeholder="us-east-1" className="h-8 text-sm" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Branch</Label>
                <Input placeholder="main" className="h-8 text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Deployment Notes</Label>
                <Textarea placeholder="What's in this release?" rows={2} className="text-sm" />
              </div>
              <div className="flex justify-between">
                <Button size="sm">Deploy <RocketIcon className="size-3" /></Button>
                <Button size="sm" variant="outline">Cancel</Button>
              </div>
            </CardContent>
          </Card>
        </ExampleCard>

        {/* List Items */}
        <ExampleCard title="List Items">
          <div className="space-y-2">
            <div className="border-border flex items-center justify-between rounded-lg border p-3">
              <div className="flex items-center gap-3">
                <div className="bg-primary-100 text-primary flex size-8 shrink-0 items-center justify-center rounded-full">
                  <BotIcon className="size-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">Claude helped you refactor</p>
                  <p className="text-muted-foreground text-xs">Removed 847 lines of code</p>
                </div>
              </div>
              <Badge variant="outline">Just now</Badge>
            </div>
            <div className="border-border flex items-center justify-between rounded-lg border p-3">
              <div className="flex items-center gap-3">
                <div className="bg-primary-100 text-primary flex size-8 shrink-0 items-center justify-center rounded-full">
                  <PaletteIcon className="size-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">Design tokens updated</p>
                  <p className="text-muted-foreground text-xs">Primary color → teal</p>
                </div>
              </div>
              <Badge variant="secondary">2m ago</Badge>
            </div>
            <div className="border-border flex items-center justify-between rounded-lg border p-3">
              <div className="flex items-center gap-3">
                <div className="bg-primary-100 text-primary flex size-8 shrink-0 items-center justify-center rounded-full">
                  <CodeIcon className="size-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">TypeScript errors fixed</p>
                  <p className="text-muted-foreground text-xs">0 errors, 0 warnings</p>
                </div>
              </div>
              <Badge variant="secondary">5m ago</Badge>
            </div>
          </div>
        </ExampleCard>

        {/* Empty State */}
        <ExampleCard title="Empty State">
          <div className="border-border rounded-lg border border-dashed p-6 text-center">
            <div className="bg-muted text-muted-foreground mx-auto mb-3 flex size-12 items-center justify-center rounded-full">
              <BugIcon className="size-6" />
            </div>
            <p className="text-sm font-medium">No bugs found</p>
            <p className="text-muted-foreground mb-4 text-xs">
              Either you're a genius or the tests aren't running.
            </p>
            <div className="flex justify-center gap-2">
              <Button size="sm" variant="outline">Run Tests</Button>
              <Button size="sm">Celebrate</Button>
            </div>
          </div>
        </ExampleCard>

        {/* Settings */}
        <ExampleCard title="Settings">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">AI Autocomplete</p>
                <p className="text-muted-foreground text-xs">Let AI finish your sentences.</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Sound Effects</p>
                <p className="text-muted-foreground text-xs">Beep boop on every save.</p>
              </div>
              <Switch />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Caffeine Level</p>
                <p className="text-muted-foreground text-xs">Adjust AI enthusiasm.</p>
              </div>
              <CaffeineStepper />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Color Mode</p>
                <p className="text-muted-foreground text-xs">For your precious eyes.</p>
              </div>
              <Button size="sm" variant="outline">Dark</Button>
            </div>
          </div>
        </ExampleCard>

        {/* Alerts & Feedback */}
        <ExampleCard title="Alerts">
          <div className="space-y-3">
            <Alert>
              <AlertDescription className="flex items-center gap-2 text-sm">
                <CheckIcon className="text-primary size-4 shrink-0" /> Component library synced with Figma
              </AlertDescription>
            </Alert>
            <Alert>
              <AlertDescription className="flex items-center gap-2 text-sm">
                <ZapIcon className="text-primary size-4 shrink-0" /> Build completed in 0.3s (Turbopack is fast)
              </AlertDescription>
            </Alert>
            <Alert>
              <AlertDescription className="flex items-center gap-2 text-sm">
                <LightbulbIcon className="text-primary size-4 shrink-0" /> Tip: Press <kbd className="bg-muted rounded px-1 text-xs">⌘K</kbd> for AI commands
              </AlertDescription>
            </Alert>
            <Alert>
              <AlertDescription className="flex items-center gap-2 text-sm">
                <AlertCircleIcon className="text-primary size-4 shrink-0" /> 2 components need review before merge
              </AlertDescription>
            </Alert>
          </div>
        </ExampleCard>

        {/* Input Group */}
        <ExampleCard title="Input Group">
          <div className="space-y-3">
            <div className="border-border flex items-center rounded-lg border">
              <span className="text-muted-foreground shrink-0 px-3">
                <SearchIcon className="size-4" />
              </span>
              <Input placeholder="Search components..." className="border-0 focus-visible:ring-0" />
              <span className="text-muted-foreground shrink-0 whitespace-nowrap px-3 text-xs">12 results</span>
            </div>
            <div className="border-border flex items-center rounded-lg border">
              <span className="bg-muted text-muted-foreground rounded-l-lg px-3 py-2 text-sm">https://</span>
              <Input placeholder="your-site.com" className="rounded-l-none border-0 focus-visible:ring-0" />
            </div>
            <div className="border-border flex items-center rounded-lg border">
              <span className="text-muted-foreground px-3">
                <PlusIcon className="size-4" />
              </span>
              <Input placeholder="Add a comment..." className="border-0 focus-visible:ring-0" />
            </div>
          </div>
        </ExampleCard>

        {/* Button Group */}
        <ExampleCard title="Button Group">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline"><ChevronLeftIcon className="size-4" /></Button>
              <Button size="sm" variant="outline"><ArchiveIcon className="size-3" /> Archive</Button>
              <Button size="sm" variant="outline"><FlagIcon className="size-3" /> Report</Button>
              <Button size="sm" variant="outline"><ChevronRightIcon className="size-4" /></Button>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline">1</Button>
              <Button size="sm" variant="secondary">2</Button>
              <Button size="sm" variant="outline">3</Button>
              <Button size="sm" variant="outline">4</Button>
              <Button size="sm" variant="outline">5</Button>
              <span className="text-muted-foreground px-2 text-sm">of 12</span>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm">Primary</Button>
              <Button size="sm" variant="secondary">Secondary</Button>
              <Button size="sm" variant="outline">Outline</Button>
              <Button size="sm" variant="ghost">Ghost</Button>
            </div>
          </div>
        </ExampleCard>

        {/* Progress */}
        <ExampleCard title="Progress">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Build complete</span>
                <span className="font-medium">100%</span>
              </div>
              <Progress value={100} />
            </div>
            <Separator />
            <div className="space-y-2">
              <p className="text-muted-foreground text-xs">Adjust volume</p>
              <Slider defaultValue={[70]} max={100} step={1} />
            </div>
          </div>
        </ExampleCard>

        {/* Status Badges */}
        <ExampleCard title="Badges">
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Badge className="gap-1">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
                Deploying
              </Badge>
              <Badge variant="secondary">v2.4.1</Badge>
              <Badge variant="outline">React 19</Badge>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="gap-1">
                <span className="text-green-500">●</span> Passing
              </Badge>
              <Badge variant="secondary" className="gap-1">
                <span className="text-yellow-500">●</span> Pending
              </Badge>
              <Badge variant="secondary" className="gap-1">
                <span className="text-red-500">●</span> Failed
              </Badge>
            </div>
          </div>
        </ExampleCard>

        {/* Loading Spinner */}
        <ExampleCard title="Loading Spinner">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <LoaderIcon className="text-primary size-6 animate-spin" />
              <LoaderIcon className="text-muted-foreground size-5 animate-spin" />
              <LoaderIcon className="text-muted-foreground size-4 animate-spin" />
            </div>
            <Separator />
            <div className="flex items-center gap-3">
              <Button size="sm" disabled>
                <LoaderIcon className="size-3 animate-spin" />
                Loading...
              </Button>
              <Button size="sm" variant="outline" disabled>
                Please Wait <LoaderIcon className="size-3 animate-spin" />
              </Button>
            </div>
            <div className="border-border flex items-center gap-3 rounded-lg border p-3">
              <LoaderIcon className="text-primary size-4 animate-spin" />
              <span className="text-muted-foreground text-sm">Fetching latest data...</span>
            </div>
          </div>
        </ExampleCard>

        {/* Skeleton */}
        <ExampleCard title="Loading Skeleton">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Skeleton className="bg-muted-foreground/20 h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="bg-muted-foreground/20 h-4 w-32" />
                <Skeleton className="bg-muted-foreground/20 h-3 w-24" />
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <Skeleton className="bg-muted-foreground/20 h-4 w-full" />
              <Skeleton className="bg-muted-foreground/20 h-4 w-4/5" />
              <Skeleton className="bg-muted-foreground/20 h-4 w-2/3" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="bg-muted-foreground/20 h-8 w-20 rounded-md" />
              <Skeleton className="bg-muted-foreground/20 h-8 w-20 rounded-md" />
            </div>
          </div>
        </ExampleCard>
      </div>
    </article>
  )
}

// =============================================================================
// EXAMPLE CARD
// =============================================================================

function ExampleCard({
  title,
  children,
  className = "",
}: {
  title: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={className}>
      <p className="text-muted-foreground mb-3 text-xs font-medium uppercase tracking-wide">
        {title}
      </p>
      <div>{children}</div>
    </div>
  )
}

// =============================================================================
// CAFFEINE STEPPER
// =============================================================================

function CaffeineStepper() {
  const [value, setValue] = useState(3)
  
  return (
    <div className="flex items-center gap-1">
      <Button 
        size="sm" 
        variant="outline" 
        className="h-8 w-8 p-0"
        onClick={() => setValue(Math.max(0, value - 1))}
      >
        <MinusIcon className="size-3" />
      </Button>
      <Input 
        className="h-8 w-12 text-center text-sm" 
        value={value}
        onChange={(e) => setValue(Number(e.target.value) || 0)}
      />
      <Button 
        size="sm" 
        variant="outline" 
        className="h-8 w-8 p-0"
        onClick={() => setValue(Math.min(10, value + 1))}
      >
        <PlusIcon className="size-3" />
      </Button>
    </div>
  )
}
