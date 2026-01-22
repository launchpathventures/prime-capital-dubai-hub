/**
 * CATALYST - Market Data Explorer
 *
 * Interactive data visualization for LMS modules.
 * Fetches from market_data table and renders charts/tables.
 *
 * @usage
 *   <MarketDataExplorer
 *     dataKey="supply_pipeline_2025"
 *     variant="pipeline"
 *   />
 *
 * This is a SERVER COMPONENT that fetches data and renders visualizations.
 */

import { Text } from "@/components/core"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { InfoIcon } from "lucide-react"
import { getMarketData } from "@/lib/lms/market-data"
import type {
  SupplyPipelineData,
  AreaStockData,
  AreaPriceData,
  BudgetGuideData,
} from "@/lib/lms/market-data"
import { SupplyPipelineChart } from "./market-data/supply-pipeline-chart"
import { AreaRankingChart } from "./market-data/area-ranking-chart"
import { PriceTable } from "./market-data/price-table"
import { BudgetExplorer } from "./market-data/budget-explorer"

// =============================================================================
// Types
// =============================================================================

type Variant =
  | "pipeline"
  | "stock"
  | "construction"
  | "stock-vs-supply"
  | "prices"
  | "budget"
  | "snapshot"

interface MarketDataExplorerProps {
  /** The data_key to fetch from market_data table */
  dataKey: string
  /** Which visualization variant to render */
  variant: Variant
  /** Optional title override */
  title?: string
  /** Show data source attribution */
  showSource?: boolean
}

// =============================================================================
// Helpers
// =============================================================================

function getDefaultTitle(variant: Variant): string {
  switch (variant) {
    case "pipeline":
      return "2025 Supply Pipeline"
    case "stock":
      return "Existing Stock by Area"
    case "construction":
      return "Under Construction by Area"
    case "stock-vs-supply":
      return "Stock vs Incoming Supply"
    case "prices":
      return "Median Prices by Area"
    case "budget":
      return "What Does Your Budget Buy?"
    case "snapshot":
      return "Market Snapshot"
  }
}

// =============================================================================
// Component
// =============================================================================

export async function MarketDataExplorer({
  dataKey,
  variant,
  title,
  showSource = true,
}: MarketDataExplorerProps) {
  const record = await getMarketData(dataKey)

  // Graceful degradation if data not found
  if (!record) {
    return null
  }

  // Type-safe access to value based on variant
  const value = record.value as Record<string, unknown>

  return (
    <Card className="market-data-explorer my-8 border-border/50 bg-card/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <InfoIcon className="h-4 w-4 text-primary" />
          {title || getDefaultTitle(variant)}
        </CardTitle>
        {showSource && record.source && (
          <Text size="xs" className="text-muted-foreground">
            Source: {record.source} • As of{" "}
            {(value.as_of as string) || record.valid_from}
          </Text>
        )}
      </CardHeader>
      <CardContent>
        {variant === "pipeline" && (
          <SupplyPipelineChart data={value as unknown as SupplyPipelineData} />
        )}
        {variant === "stock" && (
          <AreaRankingChart
            data={(value as unknown as AreaStockData).areas}
            label="Existing Units"
          />
        )}
        {variant === "construction" && (
          <AreaRankingChart
            data={(value as unknown as AreaStockData).areas}
            label="Under Construction"
            color="hsl(45 93% 47%)" // amber for construction
          />
        )}
        {variant === "prices" && (
          <PriceTable
            data={(value as unknown as AreaPriceData).areas}
            currency={(value as unknown as AreaPriceData).currency}
            unit={(value as unknown as AreaPriceData).unit}
          />
        )}
        {variant === "budget" && (
          <BudgetExplorer data={value as unknown as BudgetGuideData} />
        )}
      </CardContent>
    </Card>
  )
}
