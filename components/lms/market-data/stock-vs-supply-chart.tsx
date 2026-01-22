/**
 * CATALYST - Stock vs Supply Chart
 *
 * Grouped bar chart comparing existing stock to incoming supply.
 * Highlights areas with high supply ratios (potential oversupply).
 */

"use client"

import { BarChart } from "@/components/vendor/charts"
import { Stack, Text } from "@/components/core"
import { Badge } from "@/components/ui/badge"
import type { ChartConfig } from "@/components/ui/chart"

// =============================================================================
// Types
// =============================================================================

interface AreaData {
  area: string
  units: number
}

interface StockVsSupplyChartProps {
  existingStock: AreaData[]
  underConstruction: AreaData[]
}

// =============================================================================
// Config
// =============================================================================

const chartConfig: ChartConfig = {
  existing: { label: "Existing Stock", color: "hsl(221 83% 53%)" }, // blue
  incoming: { label: "Under Construction", color: "hsl(45 93% 47%)" }, // amber
}

// =============================================================================
// Component
// =============================================================================

export function StockVsSupplyChart({
  existingStock,
  underConstruction,
}: StockVsSupplyChartProps) {
  // Merge data by area
  const allAreas = new Set([
    ...existingStock.map((d) => d.area),
    ...underConstruction.map((d) => d.area),
  ])

  const chartData = Array.from(allAreas)
    .map((area) => {
      const existing = existingStock.find((d) => d.area === area)?.units || 0
      const incoming =
        underConstruction.find((d) => d.area === area)?.units || 0
      const ratio = existing > 0 ? incoming / existing : 0

      return {
        area,
        existing,
        incoming,
        ratio,
      }
    })
    .sort((a, b) => b.ratio - a.ratio) // Sort by ratio (highest risk first)

  // Take top 10 for readability
  const topAreas = chartData.slice(0, 10)

  // Get ratio badge variant based on risk level
  const getRatioBadgeVariant = (ratio: number) => {
    if (ratio > 1.5) return "destructive"
    if (ratio > 1) return "secondary"
    return "outline"
  }

  // Truncate long area names
  const tickFormatter = (value: string) =>
    value.length > 12 ? `${value.slice(0, 10)}...` : value

  return (
    <Stack gap="md" className="market-data-chart stock-vs-supply-chart">
      <BarChart
        className="h-[450px]"
        data={topAreas}
        config={chartConfig}
        xKey="area"
        dataKeys={["existing", "incoming"]}
        horizontal={true}
        showLegend={true}
        showTooltip={true}
        showGrid={true}
        tickFormatter={tickFormatter}
      />

      {/* Supply ratio indicators */}
      <Stack gap="sm">
        <Text size="sm" className="font-medium text-muted-foreground">
          Supply Ratio (Incoming ÷ Existing)
        </Text>
        <div className="flex flex-wrap gap-2">
          {topAreas.slice(0, 5).map((item) => (
            <Badge key={item.area} variant={getRatioBadgeVariant(item.ratio)}>
              {item.area}: {item.ratio.toFixed(1)}x
            </Badge>
          ))}
        </div>
        <Text size="xs" className="text-muted-foreground">
          Higher ratio = more incoming supply relative to existing stock
        </Text>
      </Stack>
    </Stack>
  )
}
