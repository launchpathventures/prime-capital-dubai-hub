/**
 * CATALYST - Typography Documentation
 *
 * Documents the two-layer typography architecture:
 * 1. Raw values (sizes, weights, spacing) — Easy for AI to update
 * 2. Semantic tokens — Map values to usage (title, body, ui)
 *
 * Mirrors the approach used for colors.
 */

"use client"

import * as React from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export default function TypographyPage() {
  return (
    <article className="space-y-12">
      {/* Page header */}
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Typography</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          A structured type system designed for clarity and AI-assisted development.
        </p>
      </header>

      {/* Architecture overview */}
      <section className="bg-muted space-y-3 rounded-lg p-4">
        <h2 className="font-medium">How It Works</h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Typography uses Tailwind&apos;s built-in utilities. We define three usage
          contexts: <strong>Title</strong> (headings, heroes),{" "}
          <strong>Body</strong> (paragraphs, content), and{" "}
          <strong>UI</strong> (buttons, labels, navigation).
        </p>
        <p className="text-muted-foreground text-sm">
          Same font family (Inter) → different sizes/weights per context → AI uses standard Tailwind classes.
        </p>
      </section>

      {/* ===== FONT CONTEXTS ===== */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-medium">Font Contexts</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Three usage patterns with distinct styling conventions.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <FontContextCard
            name="Title"
            weight="Semibold (600)"
            sizes="text-lg → text-6xl"
            tracking="tracking-tight (large) / normal (small)"
            example="Page headings, hero text, section titles"
            sampleClass="text-2xl font-semibold tracking-tight"
          />
          <FontContextCard
            name="Body"
            weight="Regular (400)"
            sizes="text-sm, text-base"
            tracking="normal"
            example="Paragraphs, descriptions, long-form content"
            sampleClass="text-base"
          />
          <FontContextCard
            name="UI"
            weight="Medium (500)"
            sizes="text-xs, text-sm"
            tracking="normal / tracking-wide (all caps)"
            example="Buttons, labels, nav items, form elements"
            sampleClass="text-sm font-medium"
          />
        </div>
      </section>

      {/* ===== FONT FAMILY ===== */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-medium">Font Family</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            One primary font (Inter) with a mono variant for code.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FontFamilyCard
            name="Sans (Inter)"
            tailwind="font-sans"
            sample="The quick brown fox jumps over the lazy dog"
            description="Default for all text. Used for titles, body, and UI."
          />
          <FontFamilyCard
            name="Mono (Geist Mono)"
            tailwind="font-mono"
            sample="const value = 42;"
            description="Code blocks, inline code, technical content."
            isMono
          />
        </div>
      </section>

      {/* ===== TITLES ===== */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-medium">Titles</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Heading hierarchy from hero sections to small labels.
          </p>
        </div>

        <div className="space-y-4">
          <TitleSample
            tailwind="text-6xl"
            size="60px / 3.75rem"
            tracking="tight"
            sample="Title 1"
          />
          <TitleSample
            tailwind="text-5xl"
            size="48px / 3rem"
            tracking="tight"
            sample="Title 2"
          />
          <TitleSample
            tailwind="text-4xl"
            size="36px / 2.25rem"
            tracking="tight"
            sample="Title 3"
          />
          <TitleSample
            tailwind="text-3xl"
            size="30px / 1.875rem"
            tracking="tight"
            sample="Title 4"
          />
          <TitleSample
            tailwind="text-2xl"
            size="24px / 1.5rem"
            tracking="normal"
            sample="Title 5"
          />
          <TitleSample
            tailwind="text-xl"
            size="20px / 1.25rem"
            tracking="normal"
            sample="Title 6"
          />
        </div>

        <p className="bg-primary-50 text-primary-700 border-primary-200 rounded-lg border p-3 text-sm">
          All titles use <code className="bg-primary-100 rounded px-1">font-semibold</code> (600).
          Large titles (3xl+) add <code className="bg-primary-100 rounded px-1">tracking-tight</code> for visual density.
        </p>
      </section>

      {/* ===== TEXT / BODY ===== */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-medium">Text Sizes</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Body text and paragraph sizes for content.
          </p>
        </div>

        <div className="space-y-3">
          <TextSample size="2xl" px="24px" sample="Text @ 2xl — Large callouts and intros" />
          <TextSample size="xl" px="20px" sample="Text @ xl — Subheadings and emphasis" />
          <TextSample size="lg" px="18px" sample="Text @ lg — Lead paragraphs" />
          <TextSample size="base" px="16px" sample="Text @ base — Default body text" />
          <TextSample size="sm" px="14px" sample="Text @ sm — Secondary content, descriptions" />
          <TextSample size="xs" px="12px" sample="Text @ xs — Captions, labels, metadata" />
        </div>

        <p className="bg-primary-50 text-primary-700 border-primary-200 rounded-lg border p-3 text-sm">
          Text sizes follow Tailwind defaults. Most body copy uses{" "}
          <code className="bg-primary-100 rounded px-1">text-sm</code> or{" "}
          <code className="bg-primary-100 rounded px-1">text-base</code>.
        </p>
      </section>

      {/* ===== FONT WEIGHTS ===== */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-medium">Font Weights</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Weight scale from thin to black. Common weights highlighted.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <WeightSample weight="400" name="Regular" tailwind="font-normal" context="Body" />
          <WeightSample weight="500" name="Medium" tailwind="font-medium" context="UI" />
          <WeightSample weight="600" name="Semibold" tailwind="font-semibold" context="Title" />
          <WeightSample weight="700" name="Bold" tailwind="font-bold" context="" />
        </div>

        <p className="bg-muted text-muted-foreground rounded-lg p-3 text-sm">
          We use three weights: <strong>Regular</strong> for body text,{" "}
          <strong>Medium</strong> for UI elements, <strong>Semibold</strong> for titles.
          Bold is available but rarely needed.
        </p>
      </section>

      {/* ===== LINE HEIGHT ===== */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-medium">Line Height</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Leading options for different content types.
          </p>
        </div>

        <div className="space-y-4">
          <LineHeightSample
            name="none"
            value="1"
            usage="Single-line titles"
            sample="The quick brown fox jumps."
          />
          <LineHeightSample
            name="tight"
            value="1.25"
            usage="Headlines, cards"
            sample="The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs."
          />
          <LineHeightSample
            name="snug"
            value="1.375"
            usage="UI text, short copy"
            sample="The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs."
          />
          <LineHeightSample
            name="normal"
            value="1.5"
            usage="Body text (default)"
            sample="The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs."
          />
          <LineHeightSample
            name="relaxed"
            value="1.625"
            usage="Long-form content"
            sample="The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs."
          />
          <LineHeightSample
            name="loose"
            value="2"
            usage="Extra readable, accessibility"
            sample="The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs."
          />
        </div>
      </section>

      {/* ===== LETTER SPACING ===== */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-medium">Letter Spacing</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Tracking options for visual refinement.
          </p>
        </div>

        <div className="space-y-3">
          <TrackingSample name="tighter" value="-0.05em" sample="Tighter tracking" />
          <TrackingSample name="tight" value="-0.025em" sample="Tight tracking (large titles)" />
          <TrackingSample name="normal" value="0" sample="Normal tracking (default)" />
          <TrackingSample name="wide" value="0.025em" sample="Wide tracking (buttons, labels)" />
          <TrackingSample name="wider" value="0.05em" sample="Wider tracking" />
          <TrackingSample name="widest" value="0.1em" sample="Widest tracking (all caps)" />
        </div>
      </section>

      {/* ===== TEXT COLORS ===== */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-medium">Text Colors</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Semantic text colors from the color system.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <TextColorSample
            name="foreground"
            className="text-foreground"
            usage="Primary text, headings"
          />
          <TextColorSample
            name="muted-foreground"
            className="text-muted-foreground"
            usage="Secondary text, descriptions"
          />
          <TextColorSample
            name="primary"
            className="text-primary"
            usage="Links, emphasis"
          />
          <TextColorSample
            name="destructive"
            className="text-destructive"
            usage="Error messages"
          />
          <TextColorSample
            name="success-700"
            className="text-success-700"
            usage="Success messages"
          />
          <TextColorSample
            name="warning-700"
            className="text-warning-700"
            usage="Warning messages"
          />
        </div>
      </section>

      {/* ===== PROSE / DEFAULTS ===== */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-medium">Prose Defaults</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Standard text treatments for rich content.
          </p>
        </div>

        <div className="border-border space-y-4 rounded-lg border p-6">
          <p>Normal paragraph text with default styling.</p>
          <p>
            <strong>Strong text</strong> uses font-semibold (600).
          </p>
          <p>
            <em>Emphasis text</em> uses italic styling.
          </p>
          <p>
            <a href="#" className="text-primary hover:underline">
              Hyperlinks
            </a>{" "}
            use the primary color with underline on hover.
          </p>
          <blockquote className="text-muted-foreground border-border border-l-4 pl-4 italic">
            Blockquotes are indented with a left border.
          </blockquote>
          <p>
            Inline <code className="bg-muted rounded px-1.5 py-0.5 font-mono text-sm">code</code>{" "}
            uses mono font with a muted background.
          </p>
        </div>
      </section>

      {/* ===== CONVENTIONS ===== */}
      <section className="space-y-6">
        <h2 className="text-xl font-medium">Conventions</h2>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Common patterns */}
          <div className="border-border rounded-lg border p-4">
            <h3 className="font-medium">Common Patterns</h3>
            <ul className="text-muted-foreground mt-3 space-y-2 text-sm">
              <li>
                <strong>Page titles:</strong>{" "}
                <code className="bg-muted rounded px-1">text-3xl font-semibold tracking-tight</code>
              </li>
              <li>
                <strong>Section headings:</strong>{" "}
                <code className="bg-muted rounded px-1">text-xl font-medium</code>
              </li>
              <li>
                <strong>Card titles:</strong>{" "}
                <code className="bg-muted rounded px-1">font-medium</code>
              </li>
              <li>
                <strong>Body text:</strong>{" "}
                <code className="bg-muted rounded px-1">text-sm</code> or{" "}
                <code className="bg-muted rounded px-1">text-base</code>
              </li>
              <li>
                <strong>Muted text:</strong>{" "}
                <code className="bg-muted rounded px-1">text-muted-foreground</code>
              </li>
            </ul>
          </div>

          {/* AI-friendly naming */}
          <div className="border-border rounded-lg border p-4">
            <h3 className="font-medium">AI-Friendly Naming</h3>
            <p className="text-muted-foreground mt-1 text-sm">
              We use Tailwind&apos;s standard utility classes. AI models trained on
              Tailwind will naturally use correct class names.
            </p>
            <ul className="text-muted-foreground mt-3 space-y-1 text-sm">
              <li>
                <code className="bg-muted rounded px-1">text-sm</code> — not &quot;small-text&quot;
              </li>
              <li>
                <code className="bg-muted rounded px-1">font-semibold</code> — not &quot;bold&quot; or &quot;600&quot;
              </li>
              <li>
                <code className="bg-muted rounded px-1">tracking-tight</code> — not &quot;letter-spacing&quot;
              </li>
              <li>
                <code className="bg-muted rounded px-1">leading-relaxed</code> — not &quot;line-height&quot;
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ===== IMPLEMENTATION ===== */}
      <section className="space-y-4">
        <h2 className="text-xl font-medium">Implementation</h2>

        <Accordion className="space-y-2">
          <AccordionItem value="fonts" className="border-border rounded-lg border px-4">
            <AccordionTrigger>Font setup in layout.tsx</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 text-sm">
                <p className="text-muted-foreground">
                  Fonts are loaded in the root layout and exposed as CSS variables.
                </p>
                <pre className="bg-muted overflow-x-auto rounded-lg p-4 text-xs">
                  {`import { Geist_Mono, Inter } from "next/font/google"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

// Apply to body:
<body className={\`\${inter.variable} \${geistMono.variable} font-sans\`}>`}
                </pre>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="contexts" className="border-border rounded-lg border px-4">
            <AccordionTrigger>Using font contexts</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 text-sm">
                <p className="text-muted-foreground">
                  Apply context-appropriate styling with Tailwind utilities.
                </p>
                <pre className="bg-muted overflow-x-auto rounded-lg p-4 text-xs">
                  {`/* Title context */
<h1 className="text-3xl font-semibold tracking-tight">
  Page Title
</h1>

/* Body context */
<p className="text-base leading-relaxed">
  Body paragraph with comfortable reading line height.
</p>

/* UI context */
<button className="text-sm font-medium">
  Button Label
</button>

<label className="text-sm font-medium">
  Form Label
</label>`}
                </pre>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="responsive" className="border-border rounded-lg border px-4">
            <AccordionTrigger>Responsive patterns</AccordionTrigger>
            <AccordionContent>
              <pre className="bg-muted overflow-x-auto rounded-lg p-4 text-xs">
                {`/* Responsive title */
<h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight">
  Responsive Title
</h1>

/* Hero headline */
<h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight">
  Hero Headline
</h1>

/* Responsive body */
<p className="text-sm md:text-base leading-relaxed">
  Body text that scales with viewport
</p>`}
              </pre>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* ===== VARIATIONS ===== */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-medium">Variations</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Common typography patterns for UI components.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <VariationCard
            name="Label"
            className="text-sm font-medium"
            description="Form labels, navigation"
          />
          <VariationCard
            name="Caption"
            className="text-xs text-muted-foreground"
            description="Metadata, timestamps"
          />
          <VariationCard
            name="Overline"
            className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
            description="Category tags, sections"
          />
        </div>
      </section>
    </article>
  )
}

// =============================================================================
// HELPER COMPONENTS
// =============================================================================

/**
 * Font family card showing the font with a sample.
 */
function FontFamilyCard({
  name,
  tailwind,
  sample,
  description,
  isMono = false,
}: {
  name: string
  tailwind: string
  sample: string
  description: string
  isMono?: boolean
}) {
  return (
    <div className="border-border rounded-lg border p-4">
      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {name}
      </div>
      <p className={`mt-3 text-lg ${isMono ? "font-mono" : "font-sans"}`}>
        {sample}
      </p>
      <code className="text-muted-foreground mt-3 block text-xs">
        {tailwind}
      </code>
      <p className="text-muted-foreground mt-1 text-xs">{description}</p>
    </div>
  )
}

/**
 * Font context card showing title/body/ui patterns.
 */
function FontContextCard({
  name,
  weight,
  sizes,
  tracking,
  example,
  sampleClass,
}: {
  name: string
  weight: string
  sizes: string
  tracking: string
  example: string
  sampleClass: string
}) {
  return (
    <div className="border-border rounded-lg border p-4">
      <div className="text-primary bg-primary-50 mb-3 inline-block rounded px-2 py-0.5 text-xs font-medium">
        {name}
      </div>
      <p className={`${sampleClass} mb-3`}>Sample Text</p>
      <dl className="text-muted-foreground space-y-1 text-xs">
        <div className="flex justify-between">
          <dt>Weight:</dt>
          <dd>{weight}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Sizes:</dt>
          <dd>{sizes}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Tracking:</dt>
          <dd>{tracking}</dd>
        </div>
      </dl>
      <p className="text-muted-foreground mt-3 text-[10px]">{example}</p>
    </div>
  )
}

/**
 * Title sample showing the heading with Tailwind class.
 */
function TitleSample({
  tailwind,
  size,
  tracking,
  sample,
}: {
  tailwind: string
  size: string
  tracking: string
  sample: string
}) {
  const trackingClass = tracking === "tight" ? "tracking-tight" : ""

  return (
    <div className="border-border flex items-baseline gap-4 border-b pb-4">
      <div className="w-28 shrink-0 space-y-1">
        <code className="text-muted-foreground text-xs">{tailwind}</code>
        <div className="text-muted-foreground text-[10px]">{size}</div>
      </div>
      <div className="flex-1">
        <span className={`${tailwind} font-semibold ${trackingClass}`}>
          {sample}
        </span>
      </div>
      <div className="text-muted-foreground hidden shrink-0 text-right text-[10px] sm:block">
        <div>+ font-semibold</div>
        <div>+ tracking-{tracking}</div>
      </div>
    </div>
  )
}

/**
 * Text size sample.
 */
function TextSample({
  size,
  px,
  sample,
}: {
  size: string
  px: string
  sample: string
}) {
  return (
    <div className="border-border flex items-baseline gap-4 border-b pb-3">
      <div className="w-28 shrink-0">
        <code className="text-muted-foreground text-sm">text-{size}</code>
        <div className="text-muted-foreground text-[10px]">{px}</div>
      </div>
      <span className={`text-${size}`}>{sample}</span>
    </div>
  )
}

/**
 * Weight sample with Tailwind class.
 */
function WeightSample({
  weight,
  name,
  tailwind,
  context,
}: {
  weight: string
  name: string
  tailwind: string
  context: string
}) {
  return (
    <div
      className="border-border flex items-center justify-between rounded-lg border p-3"
      style={{ fontWeight: weight }}
    >
      <div>
        <span className="text-lg">{name}</span>
        <code className="text-muted-foreground ml-2 text-xs">{tailwind}</code>
      </div>
      {context && (
        <span className="text-primary bg-primary-50 rounded px-2 py-0.5 text-xs">
          {context}
        </span>
      )}
    </div>
  )
}

/**
 * Line height sample.
 */
function LineHeightSample({
  name,
  value,
  usage,
  sample,
}: {
  name: string
  value: string
  usage: string
  sample: string
}) {
  return (
    <div className="border-border rounded-lg border p-4">
      <div className="mb-2 flex items-baseline justify-between">
        <code className="text-sm font-medium">leading-{name}</code>
        <span className="text-muted-foreground text-xs">
          {value} — {usage}
        </span>
      </div>
      <p
        className="text-muted-foreground max-w-lg text-sm"
        style={{ lineHeight: value }}
      >
        {sample}
      </p>
    </div>
  )
}

/**
 * Letter spacing sample.
 */
function TrackingSample({
  name,
  value,
  sample,
}: {
  name: string
  value: string
  sample: string
}) {
  return (
    <div className="border-border flex items-center justify-between border-b pb-3">
      <div>
        <code className="text-sm">tracking-{name}</code>
        <span className="text-muted-foreground ml-2 text-xs">({value})</span>
      </div>
      <span className={`tracking-${name}`}>{sample}</span>
    </div>
  )
}

/**
 * Text color sample.
 */
function TextColorSample({
  name,
  className,
  usage,
}: {
  name: string
  className: string
  usage: string
}) {
  return (
    <div className="border-border rounded-lg border p-3">
      <span className={`${className} font-medium`}>Sample text</span>
      <div className="mt-1 flex items-center justify-between">
        <code className="text-muted-foreground text-xs">text-{name}</code>
        <span className="text-muted-foreground text-xs">{usage}</span>
      </div>
    </div>
  )
}

/**
 * Variation card for UI patterns.
 */
function VariationCard({
  name,
  className,
  description,
}: {
  name: string
  className: string
  description: string
}) {
  return (
    <div className="border-border rounded-lg border p-4">
      <span className={className}>{name}</span>
      <p className="text-muted-foreground mt-2 text-xs">{description}</p>
      <code className="text-muted-foreground mt-1 block text-[10px]">
        {className}
      </code>
    </div>
  )
}
