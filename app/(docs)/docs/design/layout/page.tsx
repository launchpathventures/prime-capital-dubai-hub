/**
 * CATALYST - Layout Design Documentation
 *
 * Documents spacing scale, section rhythm, page templates,
 * and content density guidance.
 */

export default function LayoutPage() {
  return (
    <article className="space-y-8">
      {/* Page header */}
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Layout</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Spacing, structure, and page composition patterns.
        </p>
      </header>

      {/* Spacing Scale */}
      <section className="space-y-4">
        <h2 className="text-xl font-medium">Spacing Scale</h2>
        <p className="text-muted-foreground text-sm">
          We use Tailwind&apos;s default spacing scale. Common values:
        </p>

        <div className="grid gap-2 text-sm">
          <SpacingRow value="1" pixels="4px" usage="Tight gaps, icon alignment" />
          <SpacingRow value="2" pixels="8px" usage="Component internal padding" />
          <SpacingRow value="3" pixels="12px" usage="Form field gaps" />
          <SpacingRow value="4" pixels="16px" usage="Section content gaps" />
          <SpacingRow value="6" pixels="24px" usage="Card padding, list gaps" />
          <SpacingRow value="8" pixels="32px" usage="Section spacing" />
          <SpacingRow value="12" pixels="48px" usage="Major section breaks" />
          <SpacingRow value="20" pixels="80px" usage="Page section padding" />
          <SpacingRow value="24" pixels="96px" usage="Hero/footer padding" />
        </div>
      </section>

      {/* Section Rhythm */}
      <section className="space-y-4">
        <h2 className="text-xl font-medium">Section Rhythm</h2>
        <p className="text-muted-foreground text-sm">
          Consistent vertical rhythm creates scannable pages.
        </p>

        <div className="space-y-3">
          <RhythmItem
            name="Page sections"
            value="py-20 (80px)"
            description="Major sections on marketing pages"
          />
          <RhythmItem
            name="Content blocks"
            value="space-y-8 (32px)"
            description="Between content sections within a page"
          />
          <RhythmItem
            name="Related items"
            value="space-y-4 (16px)"
            description="Between related content items"
          />
          <RhythmItem
            name="Tight groups"
            value="space-y-2 (8px)"
            description="Heading + paragraph, label + input"
          />
        </div>
      </section>

      {/* Max Widths */}
      <section className="space-y-4">
        <h2 className="text-xl font-medium">Content Width</h2>
        <p className="text-muted-foreground text-sm">
          Standard max-widths for different content types:
        </p>

        <div className="grid gap-2 text-sm">
          <WidthRow
            value="max-w-2xl"
            pixels="672px"
            usage="CTA sections, focused content"
          />
          <WidthRow
            value="max-w-3xl"
            pixels="768px"
            usage="Documentation articles, long-form"
          />
          <WidthRow
            value="max-w-4xl"
            pixels="896px"
            usage="Component galleries, wider tables"
          />
          <WidthRow
            value="max-w-5xl"
            pixels="1024px"
            usage="Marketing sections with grids"
          />
          <WidthRow
            value="max-w-7xl"
            pixels="1280px"
            usage="Full-width marketing layouts"
          />
        </div>
      </section>

      {/* Page Templates */}
      <section className="space-y-4">
        <h2 className="text-xl font-medium">Page Templates</h2>
        <p className="text-muted-foreground text-sm">
          Standard page structures for different contexts:
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <TemplateCard
            name="Marketing Page"
            structure={[
              "Header (fixed)",
              "Hero section (py-24)",
              "Content sections (py-20 each)",
              "CTA section (py-20)",
              "Footer",
            ]}
            notes="Full-width, stacked sections. Guest layout."
          />
          <TemplateCard
            name="Documentation Page"
            structure={[
              "Sidebar (fixed)",
              "Header (sticky)",
              "Article (max-w-3xl, mx-auto)",
              "Section spacing (space-y-8)",
            ]}
            notes="Constrained width for readability. Docs layout."
          />
          <TemplateCard
            name="App Dashboard"
            structure={[
              "Sidebar (fixed or collapsible)",
              "Header with breadcrumbs",
              "Page header + actions",
              "Content area (flexible)",
            ]}
            notes="Functional layout. App layout."
          />
          <TemplateCard
            name="App Detail Page"
            structure={[
              "Page header with back link",
              "Main content (constrained)",
              "Actions (sticky footer or header)",
            ]}
            notes="Focus on single item. App layout."
          />
        </div>
      </section>

      {/* Content Density */}
      <section className="space-y-4">
        <h2 className="text-xl font-medium">Content Density</h2>
        <p className="text-muted-foreground text-sm">
          Adjust density based on context and stage:
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border p-4">
            <h4 className="font-medium">POC / Demo</h4>
            <ul className="text-muted-foreground mt-2 space-y-1 text-sm">
              <li>• Generous whitespace</li>
              <li>• Clear visual hierarchy</li>
              <li>• Focus on key interactions</li>
              <li>• Fewer items per view</li>
            </ul>
          </div>
          <div className="rounded-lg border p-4">
            <h4 className="font-medium">Production App</h4>
            <ul className="text-muted-foreground mt-2 space-y-1 text-sm">
              <li>• Efficient space use</li>
              <li>• More items visible</li>
              <li>• Compact controls</li>
              <li>• Dense data tables</li>
            </ul>
          </div>
        </div>

        <p className="text-muted-foreground text-sm">
          Start sparse for POC. Increase density as users need efficiency.
        </p>
      </section>

      {/* Common Patterns */}
      <section className="space-y-4">
        <h2 className="text-xl font-medium">Common Layout Patterns</h2>

        <div className="space-y-3">
          <PatternItem
            name="Centered content"
            code="mx-auto max-w-3xl px-4"
            usage="Articles, forms, focused content"
          />
          <PatternItem
            name="Section container"
            code="px-4 py-20"
            usage="Marketing page sections"
          />
          <PatternItem
            name="Card grid"
            code="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            usage="Feature cards, options"
          />
          <PatternItem
            name="Sidebar + content"
            code="flex (sidebar w-64, content flex-1)"
            usage="App and docs layouts"
          />
        </div>
      </section>

      {/* Reference */}
      <section className="border-border rounded-lg border border-dashed p-6">
        <h3 className="font-medium">Layout Components</h3>
        <p className="text-muted-foreground mt-2 text-sm">
          See{" "}
          <a
            href="/docs/components/layout"
            className="text-primary hover:underline"
          >
            Components → Layout
          </a>{" "}
          for Shell, Sidebar, Header, and other layout components.
        </p>
      </section>
    </article>
  )
}

// =============================================================================
// HELPER COMPONENTS
// =============================================================================

function SpacingRow({
  value,
  pixels,
  usage,
}: {
  value: string
  pixels: string
  usage: string
}) {
  return (
    <div className="flex items-center gap-4 rounded border p-2">
      <code className="bg-muted w-12 rounded px-2 py-1 text-center text-xs">
        {value}
      </code>
      <span className="text-muted-foreground w-16 text-sm">{pixels}</span>
      <span className="text-muted-foreground flex-1 text-sm">{usage}</span>
    </div>
  )
}

function RhythmItem({
  name,
  value,
  description,
}: {
  name: string
  value: string
  description: string
}) {
  return (
    <div className="flex gap-4 rounded border p-3">
      <div className="flex-1">
        <p className="font-medium">{name}</p>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
      <code className="bg-muted h-fit rounded px-2 py-1 text-xs">{value}</code>
    </div>
  )
}

function WidthRow({
  value,
  pixels,
  usage,
}: {
  value: string
  pixels: string
  usage: string
}) {
  return (
    <div className="flex items-center gap-4 rounded border p-2">
      <code className="bg-muted w-24 rounded px-2 py-1 text-center text-xs">
        {value}
      </code>
      <span className="text-muted-foreground w-16 text-sm">{pixels}</span>
      <span className="text-muted-foreground flex-1 text-sm">{usage}</span>
    </div>
  )
}

function TemplateCard({
  name,
  structure,
  notes,
}: {
  name: string
  structure: string[]
  notes: string
}) {
  return (
    <div className="rounded-lg border p-4">
      <h4 className="font-medium">{name}</h4>
      <ul className="text-muted-foreground mt-2 space-y-1 text-sm">
        {structure.map((item, i) => (
          <li key={i}>• {item}</li>
        ))}
      </ul>
      <p className="text-muted-foreground mt-2 text-xs italic">{notes}</p>
    </div>
  )
}

function PatternItem({
  name,
  code,
  usage,
}: {
  name: string
  code: string
  usage: string
}) {
  return (
    <div className="rounded border p-3">
      <div className="flex items-start justify-between gap-2">
        <p className="font-medium">{name}</p>
        <code className="bg-muted shrink-0 rounded px-2 py-0.5 text-xs">
          {code}
        </code>
      </div>
      <p className="text-muted-foreground mt-1 text-sm">{usage}</p>
    </div>
  )
}
