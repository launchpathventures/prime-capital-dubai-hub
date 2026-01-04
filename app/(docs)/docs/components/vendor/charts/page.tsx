/**
 * CATALYST - Charts Documentation
 *
 * Interactive examples for the chart components.
 */

"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Container, Stack, Row, Text, Title } from "@/components/core"
import {
  AreaChart,
  BarChart,
  LineChart,
  PieChart,
  type ChartConfig,
} from "@/components/vendor/charts"

// =============================================================================
// MOCK DATA
// =============================================================================

const monthlyData = [
  { month: "January", revenue: 18600, expenses: 8000 },
  { month: "February", revenue: 30500, expenses: 12000 },
  { month: "March", revenue: 23700, expenses: 10000 },
  { month: "April", revenue: 17300, expenses: 9000 },
  { month: "May", revenue: 20900, expenses: 11000 },
  { month: "June", revenue: 21400, expenses: 9500 },
]

const monthlyConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
  expenses: {
    label: "Expenses",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

const categoryData = [
  { category: "marketing", value: 27500, fill: "var(--color-marketing)" },
  { category: "sales", value: 20000, fill: "var(--color-sales)" },
  { category: "development", value: 18700, fill: "var(--color-development)" },
  { category: "support", value: 9300, fill: "var(--color-support)" },
  { category: "operations", value: 12400, fill: "var(--color-operations)" },
]

const categoryConfig = {
  value: { label: "Amount" },
  marketing: { label: "Marketing", color: "hsl(var(--chart-1))" },
  sales: { label: "Sales", color: "hsl(var(--chart-2))" },
  development: { label: "Development", color: "hsl(var(--chart-3))" },
  support: { label: "Support", color: "hsl(var(--chart-4))" },
  operations: { label: "Operations", color: "hsl(var(--chart-5))" },
} satisfies ChartConfig

// =============================================================================
// PAGE
// =============================================================================

export default function ChartsDocsPage() {
  return (
    <Container size="lg">
      <Stack gap="xl">
        {/* Header */}
        <header>
          <Row gap="sm" align="center" className="mb-2">
            <Title size="h1">Charts</Title>
            <Badge variant="secondary">Vendor</Badge>
          </Row>
          <Text variant="muted" size="lg">
            Theme-aware chart components built on recharts + shadcn/ui.
          </Text>
        </header>

        {/* Installation */}
        <section>
          <Title size="h3" className="mb-3">Installation</Title>
          <Card>
            <CardContent className="pt-4">
              <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`pnpm add recharts
npx shadcn@latest add chart`}
              </pre>
            </CardContent>
          </Card>
        </section>

        {/* Usage */}
        <section>
          <Title size="h3" className="mb-3">Usage</Title>
          <Card>
            <CardContent className="pt-4">
              <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`import { AreaChart, BarChart, LineChart, PieChart } from "@/components/vendor/charts"
import type { ChartConfig } from "@/components/vendor/charts"

const data = [
  { month: "Jan", revenue: 18600, expenses: 8000 },
  { month: "Feb", revenue: 30500, expenses: 12000 },
  // ...
]

const config = {
  revenue: { label: "Revenue", color: "hsl(var(--chart-1))" },
  expenses: { label: "Expenses", color: "hsl(var(--chart-2))" },
} satisfies ChartConfig

<AreaChart
  data={data}
  config={config}
  xKey="month"
  dataKeys={["revenue", "expenses"]}
/>`}
              </pre>
            </CardContent>
          </Card>
        </section>

        {/* Examples */}
        <section>
          <Title size="h3" className="mb-3">Examples</Title>
          <Stack gap="lg">
            {/* Area Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Area Chart</CardTitle>
              </CardHeader>
              <CardContent>
                <AreaChart
                  data={monthlyData}
                  config={monthlyConfig}
                  xKey="month"
                  dataKeys={["revenue", "expenses"]}
                  stacked
                />
              </CardContent>
            </Card>

            {/* Line Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Line Chart</CardTitle>
              </CardHeader>
              <CardContent>
                <LineChart
                  data={monthlyData}
                  config={monthlyConfig}
                  xKey="month"
                  dataKeys={["revenue", "expenses"]}
                />
              </CardContent>
            </Card>

            {/* Bar Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Bar Chart</CardTitle>
              </CardHeader>
              <CardContent>
                <BarChart
                  data={monthlyData}
                  config={monthlyConfig}
                  xKey="month"
                  dataKeys={["revenue", "expenses"]}
                />
              </CardContent>
            </Card>

            {/* Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Pie Chart (Donut)</CardTitle>
              </CardHeader>
              <CardContent>
                <PieChart
                  data={categoryData}
                  config={categoryConfig}
                  dataKey="value"
                  nameKey="category"
                  innerRadius={60}
                />
              </CardContent>
            </Card>
          </Stack>
        </section>

        {/* API Reference */}
        <section>
          <Title size="h3" className="mb-3">Components</Title>
          <Stack gap="md">
            <Card>
              <CardHeader>
                <CardTitle className="font-mono text-base">AreaChart / LineChart</CardTitle>
              </CardHeader>
              <CardContent>
                <Text size="sm" variant="muted">
                  Time-series charts for trends and comparisons.
                </Text>
                <div className="mt-3 space-y-2 text-sm">
                  <div><code className="text-primary">data</code> — Array of data points.</div>
                  <div><code className="text-primary">config</code> — Chart configuration (labels, colors).</div>
                  <div><code className="text-primary">xKey</code> — Data key for X axis.</div>
                  <div><code className="text-primary">dataKeys</code> — Array of keys to plot.</div>
                  <div><code className="text-primary">stacked</code> — Stack areas/bars (AreaChart only).</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-mono text-base">BarChart</CardTitle>
              </CardHeader>
              <CardContent>
                <Text size="sm" variant="muted">
                  Comparative bar charts, vertical or horizontal.
                </Text>
                <div className="mt-3 space-y-2 text-sm">
                  <div><code className="text-primary">horizontal</code> — Render bars horizontally.</div>
                  <div><code className="text-primary">stacked</code> — Stack bars on top of each other.</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-mono text-base">PieChart</CardTitle>
              </CardHeader>
              <CardContent>
                <Text size="sm" variant="muted">
                  Distribution charts (pie or donut style).
                </Text>
                <div className="mt-3 space-y-2 text-sm">
                  <div><code className="text-primary">dataKey</code> — Key for the numeric value.</div>
                  <div><code className="text-primary">nameKey</code> — Key for the segment label.</div>
                  <div><code className="text-primary">innerRadius</code> — Set to 0 for solid pie, higher for donut.</div>
                </div>
              </CardContent>
            </Card>
          </Stack>
        </section>

        {/* Theming */}
        <section>
          <Title size="h3" className="mb-3">Theming</Title>
          <Card>
            <CardContent className="pt-4">
              <Text size="sm" variant="muted" className="mb-3">
                Charts use CSS variables for colors. Define colors in your config using the built-in chart tokens:
              </Text>
              <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Available chart color tokens (defined in globals.css)
--chart-1  // Primary chart color
--chart-2  // Secondary
--chart-3  // Tertiary
--chart-4  // Quaternary
--chart-5  // Quinary

// Use in config
const config = {
  revenue: { 
    label: "Revenue", 
    color: "hsl(var(--chart-1))" 
  },
}`}
              </pre>
            </CardContent>
          </Card>
        </section>

        {/* Links */}
        <section>
          <Title size="h3" className="mb-3">Resources</Title>
          <Row gap="sm">
            <a
              href="https://ui.shadcn.com/docs/components/chart"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline text-sm"
            >
              shadcn/ui Chart Docs →
            </a>
            <a
              href="https://recharts.org/en-US/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline text-sm"
            >
              Recharts Documentation →
            </a>
          </Row>
        </section>
      </Stack>
    </Container>
  )
}
