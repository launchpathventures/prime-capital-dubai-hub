/**
 * CATALYST - Supply Pipeline Chart
 *
 * Donut chart showing supply breakdown by status.
 * Displays completed, under construction, and on hold units.
 */

"use client"

import { PieChart } from "@/components/vendor/charts"
import { Stack, Text } from "@/components/core"
import type { ChartConfig } from "@/components/ui/chart"
import type { SupplyPipelineData } from "@/lib/lms/market-data"

// =============================================================================
// Config
// =============================================================================

// Chart colors by status
const COLORS = {
  completed: "hsl(142 76% 36%)", // green
  construction: "hsl(221 83% 53%)", // blue
  onHold: "hsl(45 93% 47%)", // amber
}

const chartConfig: ChartConfig = {
  Completed: { label: "Completed", color: COLORS.completed },
  "Under Construction": { label: "Under Construction", color: COLORS.construction },
  "On Hold": { label: "On Hold", color: COLORS.onHold },
}

// =============================================================================
// Component
// =============================================================================

interface SupplyPipelineChartProps {
  data: SupplyPipelineData
}

export function SupplyPipelineChart({ data }: SupplyPipelineChartProps) {
  const chartData = [
    {
      status: "Completed",
      value: data.breakdown.completed,
      fill: COLORS.completed,
    },
    {
      status: "Under Construction",
      value: data.breakdown.construction,
      fill: COLORS.construction,
    },
    {
      status: "On Hold",
      value: data.breakdown.on_hold,
      fill: COLORS.onHold,
    },
  ]

  return (
    <Stack gap="md" className="market-data-chart supply-pipeline-chart">
      {/* Total headline */}
      <div className="text-center">
        <Text className="text-3xl font-light text-foreground tabular-nums">
          {data.total_pipeline_units.toLocaleString()}
        </Text>
        <Text size="sm" className="text-muted-foreground">
          Total Units in 2025 Pipeline
        </Text>
      </div>

      {/* Donut chart */}
      <PieChart
        className="h-[280px] mx-auto"
        data={chartData}
        config={chartConfig}
        dataKey="value"
        nameKey="status"
        innerRadius={60}
        showLegend={true}
        showTooltip={true}
      />

      {/* Forecast note */}
      {data.annual_delivery_forecast && (
        <Text
          size="sm"
          className="text-center text-muted-foreground italic pt-2"
        >
          Forecast: ~
          {data.annual_delivery_forecast["2024_2029_avg"].toLocaleString()}{" "}
          units/year (2024-2029)
          <br />
          <span className="text-xs">
            — {data.annual_delivery_forecast.source}
          </span>
        </Text>
      )}
    </Stack>
  )
}
