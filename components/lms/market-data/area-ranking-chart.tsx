/**
 * CATALYST - Area Ranking Chart
 *
 * Horizontal bar chart showing areas ranked by value.
 * Used for existing stock and under construction views.
 */

"use client"

import { BarChart } from "@/components/vendor/charts"
import type { ChartConfig } from "@/components/ui/chart"

// =============================================================================
// Types
// =============================================================================

interface AreaData {
  area: string
  units: number
}

interface AreaRankingChartProps {
  data: AreaData[]
  valueKey?: string
  label: string
  /** Primary color for all bars */
  color?: string
}

// =============================================================================
// Component
// =============================================================================

export function AreaRankingChart({
  data,
  valueKey = "units",
  label,
  color = "hsl(221 83% 53%)", // primary blue
}: AreaRankingChartProps) {
  const config: ChartConfig = {
    [valueKey]: { label, color },
  }

  // Transform data for chart - use valueKey as the data property
  const chartData = data.map((item) => ({
    area: item.area,
    [valueKey]: item.units,
  }))

  // Truncate long area names for chart readability
  const tickFormatter = (value: string) =>
    value.length > 15 ? `${value.slice(0, 12)}...` : value

  return (
    <div className="market-data-chart area-ranking-chart">
      <BarChart
        className="h-[400px]"
        data={chartData}
        config={config}
        xKey="area"
        dataKeys={[valueKey]}
        horizontal={true}
        showLegend={false}
        showTooltip={true}
        showGrid={true}
        tickFormatter={tickFormatter}
      />
    </div>
  )
}
