/**
 * CATALYST - Colors Documentation
 *
 * Documents the two-layer color architecture:
 * 1. Color scales (50-900) — Raw values AI can easily generate
 * 2. Semantic tokens — Map scales to meanings (primary, destructive)
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

export default function ColorsPage() {
  return (
    <article className="space-y-12">
      {/* Page header */}
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Colors</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          A two-layer color system designed for AI-assisted development.
        </p>
      </header>

      {/* Architecture overview */}
      <section className="bg-muted space-y-3 rounded-lg p-4">
        <h2 className="font-medium">How It Works</h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Colors are defined in two layers. <strong>Color scales</strong> (50-900) 
          contain the raw OKLCH values — these are easy for AI to generate and update. 
          <strong> Semantic tokens</strong> map scales to meanings like{" "}
          <code className="bg-muted rounded px-1">primary</code> and{" "}
          <code className="bg-muted rounded px-1">destructive</code>.
        </p>
        <p className="text-muted-foreground text-sm">
          AI updates scales → semantic tokens stay stable → components just work.
        </p>
      </section>

      {/* ===== CORE COLORS ===== */}
      <section className="space-y-8">
        <div>
          <h2 className="text-xl font-medium">Core Colors</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Brand and neutral colors with full 50-900 scales.
          </p>
        </div>

        <ColorScale
          name="Primary"
          cssVar="primary"
          description="Main brand color. Buttons, links, focus rings."
          steps={SCALE_STEPS}
        />

        <ColorScale
          name="Secondary"
          cssVar="secondary"
          description="Supporting color. Secondary buttons, accents."
          steps={SCALE_STEPS}
        />

        <ColorScale
          name="Tertiary"
          cssVar="tertiary"
          description="Accent color. Highlights, gradients, loud elements."
          steps={SCALE_STEPS}
        />

        <ColorScale
          name="Gray"
          cssVar="gray"
          description="Neutral scale. Backgrounds, borders, text."
          steps={SCALE_STEPS}
        />
      </section>

      {/* ===== STATUS COLORS ===== */}
      <section className="space-y-8">
        <div>
          <h2 className="text-xl font-medium">Status Colors</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Feedback colors for actions and states. Key steps shown (full scales in CSS).
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <StatusColorGroup
            name="Destructive"
            cssVar="destructive"
            description="Dangerous actions, errors, delete buttons."
          />
          <StatusColorGroup
            name="Success"
            cssVar="success"
            description="Positive feedback, confirmations."
          />
          <StatusColorGroup
            name="Warning"
            cssVar="warning"
            description="Caution states, pending actions."
          />
          <StatusColorGroup
            name="Info"
            cssVar="info"
            description="Informational messages, tips."
          />
        </div>
      </section>

      {/* ===== USAGE ===== */}
      <section className="space-y-6">
        <h2 className="text-xl font-medium">Usage</h2>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Scale conventions */}
          <div className="border-border rounded-lg border p-4">
            <h3 className="font-medium">Common Scale Usage</h3>
            <p className="text-muted-foreground mt-1 text-sm">
              Each step in a scale has typical use cases. This helps AI pick
              consistent shades across components.
            </p>
            <ul className="text-muted-foreground mt-3 space-y-1 text-sm">
              <li>
                <code className="bg-muted rounded px-1">50-100</code> — Light backgrounds, hover fills
              </li>
              <li>
                <code className="bg-muted rounded px-1">200-300</code> — Borders, dividers
              </li>
              <li>
                <code className="bg-muted rounded px-1">500</code> — Default / base color
              </li>
              <li>
                <code className="bg-muted rounded px-1">600</code> — Hover state on solid buttons
              </li>
              <li>
                <code className="bg-muted rounded px-1">700</code> — Active / pressed state
              </li>
              <li>
                <code className="bg-muted rounded px-1">800-900</code> — Text, high contrast
              </li>
            </ul>
          </div>

          {/* Naming */}
          <div className="border-border rounded-lg border p-4">
            <h3 className="font-medium">AI-Friendly Naming</h3>
            <p className="text-muted-foreground mt-1 text-sm">
              We use token names that appear frequently in AI training data.
              When an AI sees &quot;delete button,&quot; it naturally reaches for{" "}
              <code className="bg-muted rounded px-1">destructive</code> because
              that&apos;s what shadcn uses.
            </p>
            <p className="text-muted-foreground mt-2 text-sm">
              <strong>Examples:</strong>
            </p>
            <ul className="text-muted-foreground mt-1 space-y-1 text-sm">
              <li>
                <code className="bg-muted rounded px-1">destructive</code> — not &quot;error&quot; or &quot;danger&quot;
              </li>
              <li>
                <code className="bg-muted rounded px-1">primary</code> — not &quot;brand&quot; or &quot;main&quot;
              </li>
              <li>
                <code className="bg-muted rounded px-1">muted</code> — not &quot;subtle&quot; or &quot;disabled&quot;
              </li>
              <li>
                <code className="bg-muted rounded px-1">foreground</code> — not &quot;text&quot; or &quot;content&quot;
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ===== IMPLEMENTATION ===== */}
      <section className="space-y-4">
        <h2 className="text-xl font-medium">Implementation</h2>

        <Accordion className="space-y-2">
          <AccordionItem value="layer-1" className="border-border rounded-lg border px-4">
            <AccordionTrigger>Layer 1: Color scales in :root</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 text-sm">
                <p className="text-muted-foreground">
                  Raw OKLCH values. AI can regenerate entire scales here.
                </p>
                <pre className="bg-muted overflow-x-auto rounded-lg p-4 text-xs">
                  {`:root {
  /* Primary scale (blue) */
  --primary-50: oklch(0.97 0.01 220);
  --primary-100: oklch(0.93 0.03 220);
  --primary-500: oklch(0.58 0.14 222);
  --primary-600: oklch(0.50 0.13 225);
  --primary-900: oklch(0.28 0.06 232);

  /* Destructive scale (red) */
  --destructive-50: oklch(0.97 0.02 25);
  --destructive-500: oklch(0.58 0.22 27);
  --destructive-900: oklch(0.28 0.10 27);
}`}
                </pre>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="layer-2" className="border-border rounded-lg border px-4">
            <AccordionTrigger>Layer 2: Semantic tokens in @theme</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 text-sm">
                <p className="text-muted-foreground">
                  Maps scales to meanings. Creates Tailwind utilities.
                </p>
                <pre className="bg-muted overflow-x-auto rounded-lg p-4 text-xs">
                  {`@theme inline {
  /* Semantic defaults */
  --color-primary: var(--primary-500);
  --color-primary-foreground: var(--primary-50);
  --color-destructive: var(--destructive-500);
  
  /* Full scales also available */
  --color-primary-50: var(--primary-50);
  --color-primary-600: var(--primary-600);
  /* ... etc */
}`}
                </pre>
                <p className="text-muted-foreground">
                  This creates <code className="bg-muted rounded px-1">bg-primary</code>,{" "}
                  <code className="bg-muted rounded px-1">bg-primary-600</code>,{" "}
                  <code className="bg-muted rounded px-1">text-destructive</code>, etc.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="usage" className="border-border rounded-lg border px-4">
            <AccordionTrigger>Using colors in components</AccordionTrigger>
            <AccordionContent>
              <pre className="bg-muted overflow-x-auto rounded-lg p-4 text-xs">
                {`/* Button with hover state */
<button className="bg-primary-500 hover:bg-primary-600 text-primary-foreground">
  Save Changes
</button>

/* Destructive button */
<button className="bg-destructive hover:bg-destructive-600 text-destructive-foreground">
  Delete
</button>

/* Success alert */
<div className="bg-success-50 border border-success-300 text-success-700">
  Changes saved successfully
</div>

/* CSS variables for custom styles */
.custom-card {
  background: var(--primary-50);
  border: 1px solid var(--primary-200);
}`}
              </pre>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* ===== RESOURCES ===== */}
      <section className="space-y-4">
        <h2 className="text-xl font-medium">Resources</h2>

        <div className="border-border rounded-lg border p-4">
          <h3 className="font-medium">Color Scale Tools</h3>
          <ul className="mt-3 space-y-1 text-sm">
            <li>
              <a href="https://oklch.com" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                oklch.com
              </a>{" "}
              — OKLCH color picker
            </li>
            <li>
              <a href="https://www.tints.dev/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                Tints.dev
              </a>{" "}
              — Generate Tailwind scales with OKLCH
            </li>
            <li>
              <a href="https://smart-swatch.netlify.app/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                Smart Swatch
              </a>{" "}
              — Palette generator
            </li>
          </ul>
        </div>
      </section>
    </article>
  )
}

// =============================================================================
// COLOR SCALE COMPONENT
// =============================================================================

interface ColorScaleProps {
  name: string
  cssVar: string
  description: string
  steps: string[]
}

function ColorScale({ name, cssVar, description, steps }: ColorScaleProps) {
  return (
    <div className="space-y-2">
      <div>
        <h3 className="font-medium">{name}</h3>
        <p className="text-muted-foreground text-xs">{description}</p>
      </div>

      <div className="flex gap-1 overflow-x-auto pb-2">
        {steps.map((step) => (
          <div key={step} className="flex flex-col items-center gap-1">
            <div
              className="border-border h-12 w-12 shrink-0 rounded border"
              style={{ backgroundColor: `var(--${cssVar}-${step})` }}
              title={`--${cssVar}-${step}`}
            />
            <span className="text-muted-foreground text-[10px]">{step}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// =============================================================================
// STATUS COLOR GROUP (5 key steps: 100, 300, 500, 700, 900)
// =============================================================================

interface StatusColorGroupProps {
  name: string
  cssVar: string
  description: string
}

const STATUS_STEPS = ["100", "300", "500", "700", "900"]

function StatusColorGroup({ name, cssVar, description }: StatusColorGroupProps) {
  return (
    <div className="space-y-2">
      <div>
        <h3 className="font-medium">{name}</h3>
        <p className="text-muted-foreground text-xs">{description}</p>
      </div>

      <div className="flex gap-1">
        {STATUS_STEPS.map((step) => (
          <div key={step} className="flex flex-col items-center gap-1">
            <div
              className="border-border h-10 w-12 rounded border"
              style={{ backgroundColor: `var(--${cssVar}-${step})` }}
              title={`--${cssVar}-${step}`}
            />
            <span className="text-muted-foreground text-[10px]">{step}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// =============================================================================
// COLOR DATA
// =============================================================================

// Standard 50-900 scale steps
const SCALE_STEPS = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900"]
