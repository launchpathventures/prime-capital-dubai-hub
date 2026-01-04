/**
 * CATALYST - Design Customisation Guide
 *
 * Comprehensive guide to making Catalyst your own. Covers the high-impact
 * levers that actually differentiate a project: personality presets, colors,
 * border radius, gray temperature, typography, and shell layouts.
 */

"use client"

import Link from "next/link"
import { Stack, Text, Row, Title } from "@/components/core"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { CopyButton } from "@/components/shared"
import {
  PaletteIcon,
  SparklesIcon,
  CircleIcon,
  SquareIcon,
  TypeIcon,
  SunIcon,
  SnowflakeIcon,
  FlameIcon,
  ZapIcon,
  BriefcaseIcon,
  HeartIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  LayoutTemplateIcon,
  WandIcon,
  BookOpenIcon,
  ExternalLinkIcon,
  InfoIcon,
  EyeIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export default function CustomisationPage() {
  return (
    <article>
      <Stack gap="xl">
        {/* ================================================================ */}
        {/* Header */}
        {/* ================================================================ */}
        <header className="space-y-4">
          <Row gap="sm" className="items-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/60">
              <WandIcon className="h-5 w-5 text-primary-foreground" />
            </div>
            <Badge variant="secondary">Make It Yours</Badge>
          </Row>
          <h1 className="text-3xl font-bold tracking-tight">Customisation</h1>
          <Text size="lg" variant="muted" className="leading-relaxed">
            Transform Catalyst into your project. Changing a colour isn&apos;t
            enough — this guide covers the high-impact levers that actually
            differentiate your design: personality, radius, gray temperature,
            typography, and layouts.
          </Text>
        </header>

        {/* Quick context */}
        <div className="rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50/50 p-5 dark:border-amber-900/50 dark:from-amber-950/20 dark:to-orange-950/10">
          <Row gap="sm" className="mb-2 items-center">
            <AlertTriangleIcon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            <Text weight="semibold">Why projects &ldquo;look like Catalyst&rdquo;</Text>
          </Row>
          <Text size="sm" className="text-amber-900 dark:text-amber-200">
            If you only change the primary colour, your project will still have
            the same border radius, gray tones, typography, and layout patterns.
            These elements define visual identity far more than hue alone.
            Use the presets and levers below to create a distinct look.
          </Text>
        </div>

        {/* ================================================================ */}
        {/* Main Tabs */}
        {/* ================================================================ */}
        <Tabs defaultValue="presets" className="w-full">
          <TabsList className="mb-6 w-full justify-start overflow-x-auto">
            <TabsTrigger value="presets" className="gap-1.5">
              <SparklesIcon className="h-4 w-4" />
              Presets
            </TabsTrigger>
            <TabsTrigger value="colors" className="gap-1.5">
              <PaletteIcon className="h-4 w-4" />
              Colours
            </TabsTrigger>
            <TabsTrigger value="shape" className="gap-1.5">
              <SquareIcon className="h-4 w-4" />
              Shape
            </TabsTrigger>
            <TabsTrigger value="typography" className="gap-1.5">
              <TypeIcon className="h-4 w-4" />
              Typography
            </TabsTrigger>
            <TabsTrigger value="surfaces" className="gap-1.5">
              <LayoutTemplateIcon className="h-4 w-4" />
              Surfaces
            </TabsTrigger>
          </TabsList>

          {/* ============================================================ */}
          {/* Presets Tab */}
          {/* ============================================================ */}
          <TabsContent value="presets" className="space-y-8">
            <section className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold">Design Personality Presets</h2>
                <Text size="sm" variant="muted">
                  Pick a personality, copy the prompt, and let AI transform your
                  project. Each preset adjusts multiple levers for a cohesive look.
                </Text>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <PresetCard
                  name="Corporate"
                  description="Serious, trustworthy, professional. Sharp corners, cool grays, restrained palette."
                  icon={BriefcaseIcon}
                  color="slate"
                  traits={["Sharp radius (0.25rem)", "Cool gray (hue 220)", "Deep blue primary", "Subtle shadows"]}
                  prompt={`Read AGENTS.md and design/DESIGN.md, then apply the "Corporate" design personality:

1. In app/globals.css, update :root:
   - Change --radius from 0.625rem to 0.25rem
   - Update the gray scale to use a cool tint (add hue 220 to all gray values)
   - Change primary hue from 220 to 215 (deeper blue)

2. Reduce shadow intensity across components (prefer border over shadow)

3. Keep animations minimal and professional

The result should feel serious, trustworthy, and enterprise-ready.`}
                />

                <PresetCard
                  name="Friendly"
                  description="Warm, approachable, welcoming. Rounded corners, warm grays, cheerful colours."
                  icon={HeartIcon}
                  color="rose"
                  traits={["Rounded radius (1rem)", "Warm gray (hue 30)", "Teal/green primary", "Medium shadows"]}
                  prompt={`Read AGENTS.md and design/DESIGN.md, then apply the "Friendly" design personality:

1. In app/globals.css, update :root:
   - Change --radius from 0.625rem to 1rem
   - Update the gray scale to use a warm tint (add hue 30 to all gray values)
   - Change primary hue from 220 to 165 (teal/green)

2. Add gentle box-shadows to cards and interactive elements

3. Keep animations smooth and bouncy (use ease-out curves)

The result should feel warm, approachable, and human.`}
                />

                <PresetCard
                  name="Minimal"
                  description="Clean, stark, focused. No radius, pure grays, monochrome palette."
                  icon={MinusIcon}
                  color="zinc"
                  traits={["No radius (0)", "Pure neutral gray", "Monochrome palette", "No shadows"]}
                  prompt={`Read AGENTS.md and design/DESIGN.md, then apply the "Minimal" design personality:

1. In app/globals.css, update :root:
   - Change --radius from 0.625rem to 0
   - Keep gray scale neutral (no tint, pure achromatic)
   - Change primary to a dark gray (use gray-800 as primary-500)

2. Remove all box-shadows from components

3. Reduce visual hierarchy — use spacing and typography only

4. Remove gradients and decorative elements

The result should feel stark, focused, and distraction-free.`}
                />

                <PresetCard
                  name="Bold"
                  description="Energetic, confident, dynamic. Large radius, vibrant colours, strong shadows."
                  icon={ZapIcon}
                  color="violet"
                  traits={["Large radius (1rem)", "Neutral gray", "Vibrant primary", "Heavy shadows"]}
                  prompt={`Read AGENTS.md and design/DESIGN.md, then apply the "Bold" design personality:

1. In app/globals.css, update :root:
   - Change --radius from 0.625rem to 1rem
   - Keep gray neutral but increase contrast (darker 900, lighter 100)
   - Change primary to a vibrant hue (purple 280 or orange 25)
   - Increase chroma in primary scale (0.15 → 0.22)

2. Add strong box-shadows to floating elements

3. Use larger text sizes for headings

4. Make animations more pronounced

The result should feel energetic, confident, and attention-grabbing.`}
                />
              </div>
            </section>

            {/* Custom preset */}
            <section className="space-y-4">
              <h3 className="text-lg font-medium">Create Your Own</h3>
              <Text size="sm" variant="muted">
                Mix and match the levers from other tabs to create a custom
                personality. Use this template prompt:
              </Text>
              <PromptCard
                title="Custom Design Personality"
                prompt={`Read AGENTS.md and design/DESIGN.md, then apply a custom design personality:

1. Border radius: [0 / 0.25rem / 0.625rem / 1rem / 9999px]
2. Gray temperature: [cool (hue 220) / neutral (no hue) / warm (hue 30)]
3. Primary colour: [hue number, e.g. 220 for blue, 165 for teal, 280 for purple]
4. Shadow style: [none / subtle / medium / heavy]
5. Animation style: [minimal / smooth / bouncy / dramatic]

Apply these changes to app/globals.css and ensure consistency across components.`}
              />
            </section>

            {/* See it in action */}
            <div className="flex flex-wrap gap-3">
              <Link
                href="/docs/design/demo"
                className="text-primary hover:bg-primary/10 inline-flex items-center gap-2 rounded-lg border border-current px-4 py-2 text-sm font-medium transition-colors"
              >
                <EyeIcon className="h-4 w-4" />
                Preview in Demo
              </Link>
            </div>
          </TabsContent>

          {/* ============================================================ */}
          {/* Colours Tab */}
          {/* ============================================================ */}
          <TabsContent value="colors" className="space-y-8">
            <section className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold">Brand Colours</h2>
                <Text size="sm" variant="muted">
                  Catalyst uses a three-tier brand palette: primary, secondary,
                  and tertiary. Each has a full 50-900 scale for flexibility.
                </Text>
              </div>

              <div className="bg-muted/50 space-y-3 rounded-lg p-4">
                <Text size="sm" weight="medium">Where to change</Text>
                <code className="text-muted-foreground block text-sm">
                  app/globals.css → :root → Color Scales section
                </code>
              </div>

              <PromptCard
                title="Change Primary Colour"
                prompt={`Read AGENTS.md, then change the primary colour in app/globals.css.

Current: Blue (hue 220)
Change to: [YOUR COLOUR - e.g. "purple (hue 280)" or "teal (hue 165)" or "orange (hue 25)"]

Update all primary-50 through primary-900 values in both :root (light) and .dark (dark mode).
Keep the same lightness and chroma patterns, just change the hue.`}
              />

              <PromptCard
                title="Change All Brand Colours"
                prompt={`Read AGENTS.md, then update all brand colours in app/globals.css.

Primary: [hue, e.g. 220 for blue]
Secondary: [hue, e.g. 180 for teal]  
Tertiary: [hue, e.g. 285 for purple]

Update all scales (50-900) in both :root and .dark sections.
Ensure sufficient contrast between the three colours.`}
              />
            </section>

            <section className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold">Gray Temperature</h2>
                <Text size="sm" variant="muted">
                  Neutral grays feel generic. Adding a subtle hue tint creates
                  warmth (friendly) or coolness (corporate).
                </Text>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <GrayTempCard
                  name="Cool"
                  hue="220"
                  description="Professional, trustworthy"
                  className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/20"
                />
                <GrayTempCard
                  name="Neutral"
                  hue="0"
                  description="Balanced, versatile"
                  className="border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/20"
                />
                <GrayTempCard
                  name="Warm"
                  hue="30"
                  description="Friendly, approachable"
                  className="border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950/20"
                />
              </div>

              <PromptCard
                title="Add Gray Tint"
                prompt={`Read AGENTS.md, then add a subtle hue tint to the gray scale in app/globals.css.

Current: Pure neutral (hue 0)
Change to: [cool (hue 220) / warm (hue 30) / custom (hue X)]

Update all gray-50 through gray-900 values in both :root and .dark.
Keep chroma very low (0.005-0.01) so grays don't become coloured.

Example for cool gray:
--gray-500: oklch(0.55 0.005 220);`}
              />
            </section>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/docs/design/colors"
                className="text-primary hover:bg-primary/10 inline-flex items-center gap-2 rounded-lg border border-current px-4 py-2 text-sm font-medium transition-colors"
              >
                <PaletteIcon className="h-4 w-4" />
                Full Colour Reference
              </Link>
            </div>
          </TabsContent>

          {/* ============================================================ */}
          {/* Shape Tab */}
          {/* ============================================================ */}
          <TabsContent value="shape" className="space-y-8">
            <section className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold">Border Radius</h2>
                <Text size="sm" variant="muted">
                  One of the highest-impact levers. Sharp corners feel serious;
                  rounded corners feel friendly; pill shapes feel modern.
                </Text>
              </div>

              <div className="bg-muted/50 space-y-3 rounded-lg p-4">
                <Text size="sm" weight="medium">Where to change</Text>
                <code className="text-muted-foreground block text-sm">
                  app/globals.css → :root → --radius
                </code>
              </div>

              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <RadiusExample name="Sharp" value="0" />
                <RadiusExample name="Subtle" value="0.25rem" />
                <RadiusExample name="Default" value="0.625rem" current />
                <RadiusExample name="Rounded" value="1rem" />
              </div>

              <PromptCard
                title="Change Border Radius"
                prompt={`Read AGENTS.md, then change the base border radius in app/globals.css.

Current: --radius: 0.625rem
Change to: [0 / 0.25rem / 0.5rem / 1rem]

This single token controls radius across all components.
Larger values feel friendlier; smaller values feel more serious.`}
              />
            </section>

            <section className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold">Shadows</h2>
                <Text size="sm" variant="muted">
                  Shadows add depth and hierarchy. Heavy shadows feel bold;
                  subtle shadows feel refined; no shadows feel minimal.
                </Text>
              </div>

              <PromptCard
                title="Adjust Shadow Style"
                prompt={`Read AGENTS.md, then adjust shadow styling across the project.

Style: [none / subtle / medium / heavy]

For "none": Remove box-shadow from cards, buttons, and dropdowns
For "subtle": Use small, low-opacity shadows (e.g. shadow-sm)
For "medium": Use standard shadows (e.g. shadow-md)
For "heavy": Use large, higher-opacity shadows (e.g. shadow-lg)

Update component CSS in design/components/ as needed.`}
              />
            </section>

            <section className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold">Borders</h2>
                <Text size="sm" variant="muted">
                  Border width affects perceived weight. Thicker borders feel
                  bolder; thinner borders feel refined.
                </Text>
              </div>

              <div className="bg-muted/50 space-y-3 rounded-lg p-4">
                <Text size="sm" weight="medium">Where to change</Text>
                <code className="text-muted-foreground block text-sm">
                  app/globals.css → :root → --border-width
                </code>
                <Text size="xs" variant="muted">
                  Default is 1px. Use 2px for bolder UI.
                </Text>
              </div>
            </section>
          </TabsContent>

          {/* ============================================================ */}
          {/* Typography Tab */}
          {/* ============================================================ */}
          <TabsContent value="typography" className="space-y-8">
            <section className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold">Fonts</h2>
                <Text size="sm" variant="muted">
                  Typography is one of the strongest brand signals. The default
                  Geist font is clean and modern, but you may want something
                  with more personality.
                </Text>
              </div>

              <div className="bg-muted/50 space-y-3 rounded-lg p-4">
                <Text size="sm" weight="medium">Where fonts are defined</Text>
                <code className="text-muted-foreground block text-sm">
                  app/layout.tsx → next/font imports
                </code>
                <code className="text-muted-foreground block text-sm">
                  app/globals.css → @theme → --font-sans, --font-mono
                </code>
              </div>

              <div className="rounded-xl border border-sky-200 bg-gradient-to-br from-sky-50 to-cyan-50/50 p-5 dark:border-sky-900/50 dark:from-sky-950/20 dark:to-cyan-950/10">
                <Row gap="sm" className="mb-2 items-center">
                  <InfoIcon className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                  <Text weight="semibold">Font pairing suggestions</Text>
                </Row>
                <div className="mt-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">Corporate:</span>
                    <span className="text-muted-foreground">IBM Plex Sans, Source Sans Pro</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Friendly:</span>
                    <span className="text-muted-foreground">Plus Jakarta Sans, Outfit, Nunito</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Modern:</span>
                    <span className="text-muted-foreground">Inter, Satoshi, General Sans</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Editorial:</span>
                    <span className="text-muted-foreground">Libre Franklin, DM Sans</span>
                  </div>
                </div>
              </div>

              <PromptCard
                title="Change Font Family"
                prompt={`Read AGENTS.md, then change the font family.

Current: Geist Sans
Change to: [Inter / Plus Jakarta Sans / IBM Plex Sans / YOUR FONT]

1. In app/layout.tsx:
   - Import the new font from next/font/google (or next/font/local)
   - Replace the Geist font variable

2. The --font-sans variable in globals.css will pick up the new font automatically.

Make sure the font is available on Google Fonts or included locally.`}
              />
            </section>

            <section className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold">Type Scale</h2>
                <Text size="sm" variant="muted">
                  The type scale uses responsive clamp() values for headings.
                  Body text uses fixed sizes.
                </Text>
              </div>

              <div className="bg-muted/50 space-y-3 rounded-lg p-4">
                <Text size="sm" weight="medium">Where to change</Text>
                <code className="text-muted-foreground block text-sm">
                  app/globals.css → @theme → --text-3xl through --text-9xl
                </code>
              </div>
            </section>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/docs/design/typography"
                className="text-primary hover:bg-primary/10 inline-flex items-center gap-2 rounded-lg border border-current px-4 py-2 text-sm font-medium transition-colors"
              >
                <TypeIcon className="h-4 w-4" />
                Full Typography Reference
              </Link>
            </div>
          </TabsContent>

          {/* ============================================================ */}
          {/* Surfaces Tab */}
          {/* ============================================================ */}
          <TabsContent value="surfaces" className="space-y-8">
            <section className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold">Shell Layouts</h2>
                <Text size="sm" variant="muted">
                  Each surface (web, app, docs) has its own shell layout. These
                  define header, sidebar, and content structure.
                </Text>
              </div>

              <div className="rounded-xl border border-violet-200 bg-gradient-to-br from-violet-50 to-purple-50/50 p-5 dark:border-violet-900/50 dark:from-violet-950/20 dark:to-purple-950/10">
                <Row gap="sm" className="mb-2 items-center">
                  <AlertTriangleIcon className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                  <Text weight="semibold">Shells are Catalyst-branded</Text>
                </Row>
                <Text size="sm" className="text-violet-900 dark:text-violet-200">
                  The default shells work well as starting points, but their
                  visual style (gradients, patterns, spacing) is part of
                  Catalyst&apos;s identity. Customise them to match your brand.
                </Text>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <SurfaceCard
                  name="Web Shell"
                  path="app/(web)/_surface/web-shell.tsx"
                  description="Public/marketing pages with header navigation"
                  docLink="/docs/web"
                />
                <SurfaceCard
                  name="App Shell"
                  path="app/(app)/_surface/app-shell.tsx"
                  description="Dashboard with sidebar navigation"
                  docLink="/docs/app"
                />
                <SurfaceCard
                  name="Docs Shell"
                  path="app/(docs)/_surface/docs-shell.tsx"
                  description="Documentation with collapsible sidebar"
                  docLink="/docs"
                />
                <SurfaceCard
                  name="Present Shell"
                  path="app/(present)/_surface/slides-shell.tsx"
                  description="Slide presentations with navigation"
                  docLink="/present"
                />
              </div>
            </section>

            <section className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold">Landing Page</h2>
                <Text size="sm" variant="muted">
                  The default landing page demonstrates Catalyst patterns:
                  hero with gradient, bento grid, social proof ticker.
                  These are meant to inspire, not constrain.
                </Text>
              </div>

              <PromptCard
                title="Rebuild Landing Page"
                prompt={`Read AGENTS.md and catalyst/SURFACES.md.

The current landing page at app/(web)/page.tsx showcases Catalyst.
Create a new landing page for [YOUR PROJECT]:

1. Replace the hero with [your headline and value proposition]
2. Remove the Catalyst-specific sections (problem/solution toggle, etc.)
3. Add sections relevant to your product: [features / pricing / testimonials / etc.]

Keep using the core components (Stack, Row, Container, Section) for consistency.`}
              />

              <PromptCard
                title="Customise Shell Header"
                prompt={`Read AGENTS.md, then customise the web shell header.

File: app/(web)/_surface/web-shell.tsx

Changes:
1. Update the logo component to use your brand
2. Adjust navigation items in lib/navigation.ts
3. Change header styling (background, blur, border) to match your brand

Keep the responsive behaviour and mobile menu functionality.`}
              />
            </section>

            <section className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold">Surface-Specific Styles</h2>
                <Text size="sm" variant="muted">
                  Each surface can have its own CSS file for overrides.
                </Text>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <code className="bg-muted rounded-lg p-3 text-sm">app/(web)/web.css</code>
                <code className="bg-muted rounded-lg p-3 text-sm">app/(app)/app.css</code>
                <code className="bg-muted rounded-lg p-3 text-sm">app/(docs)/docs.css</code>
                <code className="bg-muted rounded-lg p-3 text-sm">app/(present)/present.css</code>
              </div>
            </section>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/docs/surfaces"
                className="text-primary hover:bg-primary/10 inline-flex items-center gap-2 rounded-lg border border-current px-4 py-2 text-sm font-medium transition-colors"
              >
                <LayoutTemplateIcon className="h-4 w-4" />
                Surface Documentation
              </Link>
            </div>
          </TabsContent>
        </Tabs>

        {/* ================================================================ */}
        {/* Next Steps */}
        {/* ================================================================ */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Next Steps</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <NextStepCard
              href="/docs/design/demo"
              title="Preview Changes"
              description="See all components with your new tokens"
            />
            <NextStepCard
              href="/docs/design/colors"
              title="Colour Reference"
              description="Full documentation of the colour system"
            />
            <NextStepCard
              href="/docs/develop/setup"
              title="Back to Setup"
              description="Continue the setup guide"
            />
          </div>
        </section>

        {/* ================================================================ */}
        {/* Related Docs */}
        {/* ================================================================ */}
        <section className="border-border space-y-4 border-t pt-8">
          <Text size="sm" variant="muted" weight="medium">Related documentation</Text>
          <div className="flex flex-wrap gap-3">
            <RelatedLink href="/docs/design" label="Design Overview" />
            <RelatedLink href="/docs/design/colors" label="Colours" />
            <RelatedLink href="/docs/design/typography" label="Typography" />
            <RelatedLink href="/docs/design/layout" label="Layout" />
            <RelatedLink href="/docs/develop/setup#step-7" label="Setup Step 7" />
            <RelatedLink href="/web" label="Web Surface" />
            <RelatedLink href="/app" label="App Surface" />
          </div>
        </section>
      </Stack>
    </article>
  )
}

// =============================================================================
// COMPONENTS
// =============================================================================

function PresetCard({
  name,
  description,
  icon: Icon,
  color,
  traits,
  prompt,
}: {
  name: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  traits: string[]
  prompt: string
}) {
  const colorClasses: Record<string, string> = {
    slate: "border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/20",
    rose: "border-rose-200 bg-rose-50 dark:border-rose-900 dark:bg-rose-950/20",
    zinc: "border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/20",
    violet: "border-violet-200 bg-violet-50 dark:border-violet-900 dark:bg-violet-950/20",
  }

  const iconClasses: Record<string, string> = {
    slate: "text-slate-600 dark:text-slate-400",
    rose: "text-rose-600 dark:text-rose-400",
    zinc: "text-zinc-600 dark:text-zinc-400",
    violet: "text-violet-600 dark:text-violet-400",
  }

  return (
    <div className={cn("space-y-4 rounded-xl border p-5", colorClasses[color])}>
      <Row gap="sm" className="items-center">
        <Icon className={cn("h-5 w-5", iconClasses[color])} />
        <Text weight="semibold">{name}</Text>
      </Row>
      <Text size="sm" variant="muted">{description}</Text>
      <ul className="space-y-1">
        {traits.map((trait) => (
          <li key={trait} className="text-muted-foreground flex items-center gap-2 text-xs">
            <CheckCircleIcon className="h-3 w-3" />
            {trait}
          </li>
        ))}
      </ul>
      <div className="border-border border-t pt-4">
        <div className="bg-background rounded-lg p-3">
          <pre className="max-h-32 overflow-y-auto whitespace-pre-wrap text-xs">
            {prompt}
          </pre>
        </div>
        <div className="mt-2 flex justify-end">
          <CopyButton text={prompt} variant="icon" />
        </div>
      </div>
    </div>
  )
}

function PromptCard({ title, prompt }: { title: string; prompt: string }) {
  return (
    <div className="border-border rounded-lg border p-4">
      <Row gap="sm" className="mb-3">
        <SparklesIcon className="text-primary h-4 w-4" />
        <Text size="sm" weight="medium">
          {title}
        </Text>
      </Row>
      <div className="bg-muted rounded-lg p-3">
        <pre className="overflow-x-auto whitespace-pre-wrap text-sm">
          {prompt}
        </pre>
      </div>
      <div className="mt-2 flex justify-end">
        <CopyButton text={prompt} variant="icon" />
      </div>
    </div>
  )
}

function GrayTempCard({
  name,
  hue,
  description,
  className,
}: {
  name: string
  hue: string
  description: string
  className: string
}) {
  return (
    <div className={cn("rounded-lg border p-4 text-center", className)}>
      <Text weight="semibold">{name}</Text>
      <Text size="xs" variant="muted" className="mt-1">
        Hue: {hue}
      </Text>
      <Text size="xs" variant="muted" className="mt-2">
        {description}
      </Text>
    </div>
  )
}

function RadiusExample({
  name,
  value,
  current,
}: {
  name: string
  value: string
  current?: boolean
}) {
  return (
    <div className="text-center">
      <div
        className={cn(
          "border-primary bg-primary/10 mx-auto mb-2 h-16 w-16 border-2",
          current && "ring-primary ring-2 ring-offset-2"
        )}
        style={{ borderRadius: value }}
      />
      <Text size="sm" weight={current ? "semibold" : "normal"}>
        {name}
      </Text>
      <Text size="xs" variant="muted">{value}</Text>
    </div>
  )
}

function SurfaceCard({
  name,
  path,
  description,
  docLink,
}: {
  name: string
  path: string
  description: string
  docLink: string
}) {
  return (
    <div className="border-border rounded-lg border p-4">
      <Text weight="semibold">{name}</Text>
      <Text size="xs" variant="muted" className="mt-1">{description}</Text>
      <code className="text-muted-foreground mt-3 block text-xs">{path}</code>
      <Link
        href={docLink}
        className="text-primary mt-3 inline-flex items-center gap-1 text-sm hover:underline"
      >
        View surface <ArrowRightIcon className="h-3 w-3" />
      </Link>
    </div>
  )
}

function NextStepCard({
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
      className="border-border hover:border-primary/30 hover:bg-muted/50 group flex flex-col gap-2 rounded-lg border p-4 transition-colors"
    >
      <Text weight="medium" className="group-hover:text-primary">
        {title}
      </Text>
      <Text size="sm" variant="muted">{description}</Text>
    </Link>
  )
}

function RelatedLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="text-muted-foreground hover:text-foreground hover:bg-muted inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm transition-colors"
    >
      {label}
      <ArrowRightIcon className="h-3 w-3" />
    </Link>
  )
}

// Missing icon fallback
function MinusIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M5 12h14" />
    </svg>
  )
}
