/**
 * CATALYST - Charts Vendor Wrapper
 *
 * Higher-level chart components built on shadcn/ui chart (recharts).
 * Provides ready-to-use chart patterns for analytics dashboards.
 *
 * @usage
 *   import { AreaChart, BarChart, LineChart, PieChart } from "@/components/vendor/charts"
 *
 * SIZING:
 * Charts fill 100% width automatically. Set height via className:
 *   <AreaChart className="h-[350px]" data={data} config={config} ... />
 *
 * COLORS:
 * Colors are defined in the `config` object and applied via CSS variables:
 *   const config = {
 *     revenue: { label: "Revenue", color: "hsl(221 83% 53%)" },
 *   }
 *
 * @see https://ui.shadcn.com/docs/components/chart
 * @see https://recharts.org/en-US/
 */

"use client"

import * as React from "react"
import {
  Area,
  AreaChart as RechartsAreaChart,
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart as RechartsLineChart,
  Pie,
  PieChart as RechartsPieChart,
  XAxis,
  YAxis,
} from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { cn } from "@/lib/utils"

// =============================================================================
// TYPES
// =============================================================================

export interface ChartDataPoint {
  [key: string]: string | number
}

export interface BaseChartProps {
  /** Chart data array */
  data: ChartDataPoint[]
  /** Chart configuration for theming and labels */
  config: ChartConfig
  /** Optional className for the container */
  className?: string
  /** Show legend below chart */
  showLegend?: boolean
  /** Show tooltip on hover */
  showTooltip?: boolean
  /** Show grid lines */
  showGrid?: boolean
}

// =============================================================================
// AREA CHART
// =============================================================================

export interface AreaChartProps extends BaseChartProps {
  /** Data key for X axis (usually "date" or "month") */
  xKey: string
  /** Data keys to render as areas */
  dataKeys: string[]
  /** Stack areas on top of each other */
  stacked?: boolean
  /** Custom tick formatter for X axis */
  tickFormatter?: (value: string) => string
}

export function AreaChart({
  data,
  config,
  className,
  xKey,
  dataKeys,
  stacked = false,
  showLegend = true,
  showTooltip = true,
  showGrid = true,
  tickFormatter,
}: AreaChartProps) {
  return (
    <ChartContainer config={config} className={cn("chart chart-area", className)}>
      <RechartsAreaChart data={data} margin={{ left: 12, right: 12 }}>
        {showGrid && <CartesianGrid vertical={false} />}
        <XAxis
          dataKey={xKey}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={tickFormatter}
        />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} />
        {showTooltip && <ChartTooltip content={<ChartTooltipContent />} />}
        {showLegend && <ChartLegend content={<ChartLegendContent />} />}
        {dataKeys.map((key, index) => (
          <Area
            key={key}
            dataKey={key}
            type="natural"
            fill={`var(--color-${key})`}
            fillOpacity={0.4}
            stroke={`var(--color-${key})`}
            stackId={stacked ? "stack" : undefined}
          />
        ))}
      </RechartsAreaChart>
    </ChartContainer>
  )
}

// =============================================================================
// LINE CHART
// =============================================================================

export interface LineChartProps extends BaseChartProps {
  /** Data key for X axis */
  xKey: string
  /** Data keys to render as lines */
  dataKeys: string[]
  /** Custom tick formatter for X axis */
  tickFormatter?: (value: string) => string
}

export function LineChart({
  data,
  config,
  className,
  xKey,
  dataKeys,
  showLegend = true,
  showTooltip = true,
  showGrid = true,
  tickFormatter,
}: LineChartProps) {
  return (
    <ChartContainer config={config} className={cn("chart chart-line", className)}>
      <RechartsLineChart data={data} margin={{ left: 12, right: 12 }}>
        {showGrid && <CartesianGrid vertical={false} />}
        <XAxis
          dataKey={xKey}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={tickFormatter}
        />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} />
        {showTooltip && <ChartTooltip content={<ChartTooltipContent />} />}
        {showLegend && <ChartLegend content={<ChartLegendContent />} />}
        {dataKeys.map((key) => (
          <Line
            key={key}
            dataKey={key}
            type="natural"
            stroke={`var(--color-${key})`}
            strokeWidth={2}
            dot={false}
          />
        ))}
      </RechartsLineChart>
    </ChartContainer>
  )
}

// =============================================================================
// BAR CHART
// =============================================================================

export interface BarChartProps extends BaseChartProps {
  /** Data key for X axis */
  xKey: string
  /** Data keys to render as bars */
  dataKeys: string[]
  /** Stack bars on top of each other */
  stacked?: boolean
  /** Horizontal bar layout */
  horizontal?: boolean
  /** Custom tick formatter for category axis */
  tickFormatter?: (value: string) => string
  /** Use fill color from each data point (for category-colored bars) */
  colorByCategory?: boolean
}

export function BarChart({
  data,
  config,
  className,
  xKey,
  dataKeys,
  stacked = false,
  horizontal = false,
  showLegend = true,
  showTooltip = true,
  showGrid = true,
  tickFormatter,
  colorByCategory = false,
}: BarChartProps) {
  return (
    <ChartContainer config={config} className={cn("chart chart-bar", className)}>
      <RechartsBarChart
        data={data}
        layout={horizontal ? "vertical" : "horizontal"}
        margin={horizontal ? { left: 80, right: 12 } : { left: 12, right: 12 }}
      >
        {showGrid && <CartesianGrid vertical={!horizontal} horizontal={horizontal} />}
        {horizontal ? (
          <>
            <YAxis
              dataKey={xKey}
              type="category"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={75}
              tickFormatter={tickFormatter}
            />
            <XAxis type="number" tickLine={false} axisLine={false} tickMargin={8} />
          </>
        ) : (
          <>
            <XAxis
              dataKey={xKey}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={tickFormatter}
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
          </>
        )}
        {showTooltip && <ChartTooltip content={<ChartTooltipContent />} />}
        {showLegend && <ChartLegend content={<ChartLegendContent />} />}
        {dataKeys.map((key) => (
          <Bar
            key={key}
            dataKey={key}
            fill={`var(--color-${key})`}
            radius={horizontal ? [0, 4, 4, 0] : [4, 4, 0, 0]}
            stackId={stacked ? "stack" : undefined}
          >
            {colorByCategory && data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill as string} />
            ))}
          </Bar>
        ))}
      </RechartsBarChart>
    </ChartContainer>
  )
}

// =============================================================================
// PIE CHART
// =============================================================================

export interface PieChartProps extends BaseChartProps {
  /** Data key for the value */
  dataKey: string
  /** Data key for the name/label */
  nameKey: string
  /** Inner radius for donut style (0 for solid pie) */
  innerRadius?: number
}

export function PieChart({
  data,
  config,
  className,
  dataKey,
  nameKey,
  innerRadius = 60,
  showLegend = true,
  showTooltip = true,
}: PieChartProps) {
  return (
    <ChartContainer config={config} className={cn("chart chart-pie", className)}>
      <RechartsPieChart>
        {showTooltip && <ChartTooltip content={<ChartTooltipContent hideLabel />} />}
        {showLegend && <ChartLegend content={<ChartLegendContent nameKey={nameKey} />} />}
        <Pie
          data={data}
          dataKey={dataKey}
          nameKey={nameKey}
          innerRadius={innerRadius}
          strokeWidth={2}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={`var(--color-${entry[nameKey]})`}
            />
          ))}
        </Pie>
      </RechartsPieChart>
    </ChartContainer>
  )
}

// =============================================================================
// RE-EXPORTS for convenience
// =============================================================================

export { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent }
export type { ChartConfig }
