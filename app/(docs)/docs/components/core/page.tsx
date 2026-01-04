/**
 * CATALYST - Core Components Documentation
 *
 * Catalyst's foundational building blocks for layout, typography, and visual elements.
 */

"use client"

import { Button } from "@/components/ui/button"
import { Stack, Row, Grid, Container, Section, Text, Title, Dot, Avatar, Count } from "@/components/core"
import { DocsAccordionPage } from "../../../_surface/docs-accordion-page"

// =============================================================================
// COMPONENT DATA
// =============================================================================

type ComponentInfo = {
  name: string
  slug: string
  description: string
  importStatement: string
  props: { name: string; type: string; default: string; description: string }[]
  example?: React.ReactNode
}

const COMPONENTS: ComponentInfo[] = [
  {
    name: "Stack",
    slug: "stack",
    description:
      "Vertical flex container with consistent gap spacing. Use for forms, card bodies, lists, or any vertically stacked content.",
    importStatement: 'import { Stack } from "@/components/core"',
    props: [
      { name: "gap", type: '"none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl"', default: '"md"', description: "Space between children" },
      { name: "align", type: '"start" | "center" | "end" | "stretch"', default: '"stretch"', description: "Cross-axis alignment" },
      { name: "as", type: "React.ElementType", default: '"div"', description: "Render as different element" },
      { name: "asChild", type: "boolean", default: "false", description: "Merge props onto child element" },
    ],
    example: (
      <div className="flex gap-8">
        <div>
          <p className="text-muted-foreground mb-2 text-xs">gap=&quot;sm&quot;</p>
          <Stack gap="sm" className="bg-muted/50 rounded-lg p-4">
            <div className="bg-primary/20 rounded px-3 py-2 text-sm">Item 1</div>
            <div className="bg-primary/20 rounded px-3 py-2 text-sm">Item 2</div>
            <div className="bg-primary/20 rounded px-3 py-2 text-sm">Item 3</div>
          </Stack>
        </div>
        <div>
          <p className="text-muted-foreground mb-2 text-xs">gap=&quot;lg&quot;</p>
          <Stack gap="lg" className="bg-muted/50 rounded-lg p-4">
            <div className="bg-primary/20 rounded px-3 py-2 text-sm">Item 1</div>
            <div className="bg-primary/20 rounded px-3 py-2 text-sm">Item 2</div>
            <div className="bg-primary/20 rounded px-3 py-2 text-sm">Item 3</div>
          </Stack>
        </div>
        <div>
          <p className="text-muted-foreground mb-2 text-xs">align=&quot;center&quot;</p>
          <Stack gap="sm" align="center" className="bg-muted/50 rounded-lg p-4">
            <div className="bg-primary/20 rounded px-3 py-2 text-sm">Short</div>
            <div className="bg-primary/20 rounded px-3 py-2 text-sm">Medium text</div>
            <div className="bg-primary/20 rounded px-3 py-2 text-sm">Longer content here</div>
          </Stack>
        </div>
      </div>
    ),
  },
  {
    name: "Row",
    slug: "row",
    description:
      "Horizontal flex container with consistent gap spacing. Use for button groups, icon + text combinations, or inline items.",
    importStatement: 'import { Row } from "@/components/core"',
    props: [
      { name: "gap", type: '"none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl"', default: '"md"', description: "Space between children" },
      { name: "align", type: '"start" | "center" | "end" | "stretch" | "baseline"', default: '"center"', description: "Cross-axis alignment" },
      { name: "justify", type: '"start" | "center" | "end" | "between" | "around" | "evenly"', default: '"start"', description: "Main-axis alignment" },
      { name: "wrap", type: "boolean", default: "false", description: "Allow items to wrap" },
      { name: "as", type: "React.ElementType", default: '"div"', description: "Render as different element" },
      { name: "asChild", type: "boolean", default: "false", description: "Merge props onto child element" },
    ],
    example: (
      <Stack gap="lg">
        <div>
          <p className="text-muted-foreground mb-2 text-xs">Basic row</p>
          <Row gap="sm" className="bg-muted/50 rounded-lg p-4">
            <div className="bg-primary/20 rounded px-3 py-2 text-sm">Item 1</div>
            <div className="bg-primary/20 rounded px-3 py-2 text-sm">Item 2</div>
            <div className="bg-primary/20 rounded px-3 py-2 text-sm">Item 3</div>
          </Row>
        </div>
        <div>
          <p className="text-muted-foreground mb-2 text-xs">justify=&quot;between&quot;</p>
          <Row gap="sm" justify="between" className="bg-muted/50 rounded-lg p-4">
            <div className="bg-primary/20 rounded px-3 py-2 text-sm">Left</div>
            <div className="bg-primary/20 rounded px-3 py-2 text-sm">Right</div>
          </Row>
        </div>
        <div>
          <p className="text-muted-foreground mb-2 text-xs">Button group example</p>
          <Row gap="sm">
            <Button variant="outline" size="sm">Cancel</Button>
            <Button size="sm">Save Changes</Button>
          </Row>
        </div>
      </Stack>
    ),
  },
  {
    name: "Grid",
    slug: "grid",
    description:
      "Responsive CSS grid container. Columns automatically adjust based on breakpoints. Use for card grids, feature sections, galleries.",
    importStatement: 'import { Grid } from "@/components/core"',
    props: [
      { name: "cols", type: "1 | 2 | 3 | 4 | 5 | 6", default: "3", description: "Max columns (responsive)" },
      { name: "gap", type: '"none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl"', default: '"md"', description: "Space between items" },
      { name: "align", type: '"start" | "center" | "end" | "stretch"', default: '"stretch"', description: "Cross-axis alignment" },
      { name: "as", type: "React.ElementType", default: '"div"', description: "Render as different element" },
      { name: "asChild", type: "boolean", default: "false", description: "Merge props onto child element" },
    ],
    example: (
      <Stack gap="lg">
        <div>
          <p className="text-muted-foreground mb-2 text-xs">cols=&#123;3&#125; (responsive: 1 → 2 → 3)</p>
          <Grid cols={3} gap="md">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-muted rounded-lg p-4 text-center text-sm">
                Card {i}
              </div>
            ))}
          </Grid>
        </div>
        <div>
          <p className="text-muted-foreground mb-2 text-xs">cols=&#123;4&#125; gap=&quot;lg&quot;</p>
          <Grid cols={4} gap="lg">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-muted rounded-lg p-4 text-center text-sm">
                Item {i}
              </div>
            ))}
          </Grid>
        </div>
      </Stack>
    ),
  },
  {
    name: "Container",
    slug: "container",
    description:
      "Max-width wrapper with responsive horizontal padding. Centers content and constrains width on large screens.",
    importStatement: 'import { Container } from "@/components/core"',
    props: [
      { name: "size", type: '"sm" | "md" | "lg" | "xl" | "2xl" | "full"', default: '"xl"', description: "Max-width constraint" },
      { name: "as", type: "React.ElementType", default: '"div"', description: "Render as different element" },
      { name: "asChild", type: "boolean", default: "false", description: "Merge props onto child element" },
    ],
    example: (
      <Stack gap="md">
        {(["sm", "md", "lg", "xl"] as const).map((size) => (
          <div key={size} className="bg-muted/30 rounded">
            <Container size={size} className="bg-muted/50 rounded py-2">
              <p className="text-center text-sm">size=&quot;{size}&quot;</p>
            </Container>
          </div>
        ))}
      </Stack>
    ),
  },
  {
    name: "Section",
    slug: "section",
    description:
      "Page section with consistent vertical padding. Use for major page divisions like hero, features, CTA areas. Renders as <section> element.",
    importStatement: 'import { Section } from "@/components/core"',
    props: [
      { name: "padding", type: '"none" | "sm" | "md" | "lg" | "xl"', default: '"lg"', description: "Vertical padding" },
      { name: "as", type: "React.ElementType", default: '"section"', description: "Render as different element" },
      { name: "asChild", type: "boolean", default: "false", description: "Merge props onto child element" },
    ],
    example: (
      <Stack gap="md">
        {(["sm", "md", "lg"] as const).map((padding) => (
          <Section key={padding} padding={padding} className="bg-muted/50 rounded-lg">
            <p className="text-center text-sm">padding=&quot;{padding}&quot;</p>
          </Section>
        ))}
      </Stack>
    ),
  },
  // =========================================================================
  // TYPOGRAPHY
  // =========================================================================
  {
    name: "Text",
    slug: "text",
    description:
      "Typography primitive for body text with consistent sizing and styling. Use for paragraphs, descriptions, labels, and inline text.",
    importStatement: 'import { Text } from "@/components/core"',
    props: [
      { name: "size", type: '"xs" | "sm" | "base" | "lg"', default: '"sm"', description: "Font size" },
      { name: "weight", type: '"normal" | "medium" | "semibold" | "bold"', default: '"normal"', description: "Font weight" },
      { name: "variant", type: '"default" | "muted" | "primary" | "success" | "warning" | "danger"', default: '"default"', description: "Text color" },
      { name: "inline", type: "boolean", default: "false", description: "Render as span instead of p" },
      { name: "as", type: '"p" | "span" | "div" | "label"', default: '"p"', description: "HTML element" },
      { name: "truncate", type: "boolean", default: "false", description: "Truncate with ellipsis" },
      { name: "mono", type: "boolean", default: "false", description: "Monospace font" },
    ],
    example: (
      <Stack gap="sm">
        <Text>Default text (size=&quot;sm&quot;)</Text>
        <Text size="xs" variant="muted">Extra small muted text</Text>
        <Text size="base" weight="medium">Base size with medium weight</Text>
        <Text variant="primary">Primary colored text</Text>
        <Text variant="success">Success message</Text>
        <Text mono>Monospace text for code</Text>
      </Stack>
    ),
  },
  {
    name: "Title",
    slug: "title",
    description:
      "Typography primitive for headings with semantic HTML and consistent styling. Automatically uses matching semantic heading tag.",
    importStatement: 'import { Title } from "@/components/core"',
    props: [
      { name: "size", type: '"h1" | "h2" | "h3" | "h4" | "h5" | "h6"', default: '"h2"', description: "Heading size (also determines default HTML tag)" },
      { name: "variant", type: '"default" | "muted" | "primary"', default: '"default"', description: "Text color" },
      { name: "align", type: '"left" | "center" | "right"', default: '"left"', description: "Text alignment" },
      { name: "as", type: '"h1" | "h2" | ... | "div" | "span"', default: "(matches size)", description: "Override HTML element" },
    ],
    example: (
      <Stack gap="sm">
        <Title size="h1">Heading 1</Title>
        <Title size="h2">Heading 2</Title>
        <Title size="h3">Heading 3</Title>
        <Title size="h4">Heading 4</Title>
        <Title size="h3" variant="muted">Muted heading</Title>
      </Stack>
    ),
  },
  // =========================================================================
  // VISUAL
  // =========================================================================
  {
    name: "Dot",
    slug: "dot",
    description:
      "Visual indicator for status, activity, or timeline markers. Use in activity feeds, status indicators, and lists.",
    importStatement: 'import { Dot } from "@/components/core"',
    props: [
      { name: "size", type: '"xs" | "sm" | "md" | "lg"', default: '"sm"', description: "Dot size" },
      { name: "color", type: '"default" | "muted" | "primary" | "success" | "warning" | "danger" | "info" | "violet"', default: '"primary"', description: "Dot color" },
      { name: "pulse", type: "boolean", default: "false", description: "Animate with pulse" },
    ],
    example: (
      <Row gap="md" align="center">
        <Row gap="xs" align="center"><Dot color="success" /><Text size="xs">Online</Text></Row>
        <Row gap="xs" align="center"><Dot color="warning" /><Text size="xs">Away</Text></Row>
        <Row gap="xs" align="center"><Dot color="danger" /><Text size="xs">Busy</Text></Row>
        <Row gap="xs" align="center"><Dot color="primary" pulse /><Text size="xs">Live</Text></Row>
      </Row>
    ),
  },
  {
    name: "Avatar",
    slug: "avatar",
    description:
      "User avatar with initials and gradient background. Includes helper functions for auto-generating initials and consistent gradient selection.",
    importStatement: 'import { Avatar, getInitials, getAvatarGradient } from "@/components/core"',
    props: [
      { name: "size", type: '"xs" | "sm" | "md" | "lg" | "xl"', default: '"md"', description: "Avatar size" },
      { name: "gradient", type: '"rose" | "emerald" | "violet" | "amber" | "cyan" | "blue" | "slate"', default: '"blue"', description: "Gradient color" },
      { name: "name", type: "string", default: "-", description: "Name to derive initials and gradient from" },
      { name: "initials", type: "string", default: "-", description: "Override initials (if not using name)" },
    ],
    example: (
      <Row gap="md" align="center">
        <Avatar name="Sarah Chen" size="lg" />
        <Avatar name="Mike Johnson" size="md" />
        <Avatar name="Emily Davis" size="sm" />
        <Avatar initials="JD" gradient="violet" size="md" />
      </Row>
    ),
  },
  {
    name: "Count",
    slug: "count",
    description:
      "Numeric badge/counter with tabular numbers for consistent alignment. Wraps Badge with useful count patterns built in.",
    importStatement: 'import { Count } from "@/components/core"',
    props: [
      { name: "value", type: "number | string", default: "-", description: "The count value (required)" },
      { name: "suffix", type: "string", default: "-", description: "Optional suffix (e.g., 'tasks', 'items')" },
      { name: "total", type: "number", default: "-", description: "Show as fraction (e.g., '3/5')" },
      { name: "max", type: "number", default: "-", description: "Max before showing '+' (e.g., 99+)" },
    ],
    example: (
      <Row gap="md" align="center">
        <Count value={5} />
        <Count value={12} suffix="tasks" />
        <Count value={3} total={5} />
        <Count value={150} max={99} />
      </Row>
    ),
  },
]

// =============================================================================
// GAP SCALE REFERENCE
// =============================================================================

const GAP_SCALE = [
  { value: "none", tailwind: "gap-0", pixels: "0" },
  { value: "xs", tailwind: "gap-1", pixels: "4px" },
  { value: "sm", tailwind: "gap-2", pixels: "8px" },
  { value: "md", tailwind: "gap-4", pixels: "16px" },
  { value: "lg", tailwind: "gap-6", pixels: "24px" },
  { value: "xl", tailwind: "gap-8", pixels: "32px" },
  { value: "2xl", tailwind: "gap-12", pixels: "48px" },
]

// =============================================================================
// RENDER HELPERS
// =============================================================================

function PropsTable({ props }: { props: ComponentInfo["props"] }) {
  return (
    <div className="bg-muted space-y-3 rounded-lg p-4">
      <p className="font-medium">Props</p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-border border-b text-left">
              <th className="pb-2 pr-4 font-medium">Prop</th>
              <th className="pb-2 pr-4 font-medium">Type</th>
              <th className="pb-2 pr-4 font-medium">Default</th>
              <th className="pb-2 font-medium">Description</th>
            </tr>
          </thead>
          <tbody>
            {props.map((prop) => (
              <tr key={prop.name} className="border-border border-b last:border-0">
                <td className="py-2 pr-4 font-mono text-xs">{prop.name}</td>
                <td className="text-muted-foreground py-2 pr-4 font-mono text-xs">{prop.type}</td>
                <td className="py-2 pr-4 font-mono text-xs">{prop.default}</td>
                <td className="text-muted-foreground py-2 text-xs">{prop.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// =============================================================================
// MAIN PAGE
// =============================================================================

export default function CoreComponentsPage() {
  return (
    <DocsAccordionPage
      title="Core"
      description="Catalyst's foundational building blocks for layout, typography, and visual elements."
      items={COMPONENTS}
      searchPlaceholder="Search core components..."
      renderOverview={() => (
        <>
          <p className="text-muted-foreground">
            <strong className="text-foreground">Catalyst Core</strong> components are the 
            foundational building blocks that everything else composes from.
            They provide consistent patterns for layout, typography, and visual indicators.
          </p>

          {/* Categories */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="bg-muted space-y-2 rounded-lg p-4">
              <p className="font-medium">Layout</p>
              <p className="text-muted-foreground text-xs">Stack, Row, Grid, Container, Section</p>
            </div>
            <div className="bg-muted space-y-2 rounded-lg p-4">
              <p className="font-medium">Typography</p>
              <p className="text-muted-foreground text-xs">Text, Title</p>
            </div>
            <div className="bg-muted space-y-2 rounded-lg p-4">
              <p className="font-medium">Visual</p>
              <p className="text-muted-foreground text-xs">Dot, Avatar, Count</p>
            </div>
          </div>

          {/* When to use */}
          <div className="bg-muted space-y-3 rounded-lg p-4">
            <p className="font-medium">When to use</p>
            <ul className="text-muted-foreground space-y-1 text-sm">
              <li>✓ Need consistent spacing without memorising Tailwind classes</li>
              <li>✓ Want semantic typography with proper HTML elements</li>
              <li>✓ Building UI that should look consistent across pages</li>
            </ul>
          </div>

          {/* Gap scale */}
          <div className="bg-muted space-y-3 rounded-lg p-4">
            <p className="font-medium">Gap Scale (Layout)</p>
            <p className="text-muted-foreground text-sm">
              All layout components use the same gap scale for consistency:
            </p>
            <div className="grid grid-cols-7 gap-2 text-center text-xs">
              {GAP_SCALE.map((g) => (
                <div key={g.value} className="space-y-1">
                  <div className="bg-background rounded border px-2 py-1.5 font-mono">{g.value}</div>
                  <div className="text-muted-foreground">{g.pixels}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Import */}
          <code className="bg-muted text-muted-foreground block overflow-x-auto rounded px-3 py-2 text-xs">
            {`import { Stack, Row, Text, Title, Dot, Avatar, Count } from "@/components/core"`}
          </code>
        </>
      )}
      renderItem={(component) => (
        <>
          {/* Description */}
          <p className="text-muted-foreground">{component.description}</p>

          {/* Example */}
          {component.example && (
            <div className="overflow-visible py-2">{component.example}</div>
          )}

          {/* Props table */}
          <PropsTable props={component.props} />

          {/* Import */}
          <code className="bg-muted text-muted-foreground block overflow-x-auto rounded px-3 py-2 text-xs">
            {component.importStatement}
          </code>
        </>
      )}
    />
  )
}
