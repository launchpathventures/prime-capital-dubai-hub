/**
 * CATALYST - Module Market Data Section
 *
 * Server component that renders market data visualizations
 * based on the current module slug. Different modules show
 * different visualizations.
 *
 * @usage
 *   <ModuleMarketData moduleSlug="dubai-overview" />
 */

import { Stack } from "@/components/core"
import {
  getMarketOverview,
  getSupplyPipeline,
  getExistingStock,
  getUnderConstruction,
  getMedianPrices,
  getBudgetGuide,
} from "@/lib/lms/market-data"
import { MarketDataExplorer } from "./market-data-explorer"
import { MarketSnapshotCard } from "./market-data/market-snapshot-card"
import { StockVsSupplyChart } from "./market-data/stock-vs-supply-chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3Icon } from "lucide-react"

// =============================================================================
// Types
// =============================================================================

interface ModuleMarketDataProps {
  moduleSlug: string
}

// Modules that have market data sections
export const MARKET_DATA_MODULES: string[] = [
  "dubai-overview",
  "area-deep-dives",
  "area-knowledge",
]

/** Check if a module has market data */
export function hasModuleMarketData(moduleSlug: string): boolean {
  return MARKET_DATA_MODULES.includes(moduleSlug)
}

// =============================================================================
// Component
// =============================================================================

export async function ModuleMarketData({ moduleSlug }: ModuleMarketDataProps) {
  // Only render for specific modules
  if (!MARKET_DATA_MODULES.includes(moduleSlug)) {
    return null
  }

  try {
    // Render different visualizations based on module
    switch (moduleSlug) {
      case "dubai-overview":
        return await DubaiOverviewData()
      case "area-deep-dives":
        return await AreaDeepDivesData()
      case "area-knowledge":
        return await AreaKnowledgeData()
      default:
        return null
    }
  } catch (error) {
    // Graceful degradation - don't crash the page if market data fails
    console.error("Failed to load market data:", error)
    return null
  }
}

// =============================================================================
// Module-Specific Sections
// =============================================================================

/**
 * Dubai Overview Module
 * Shows: Market snapshot + Supply pipeline chart
 */
async function DubaiOverviewData() {
  // Data fetching in try/catch
  let marketData = null
  let supplyData = null
  
  try {
    ;[marketData, supplyData] = await Promise.all([
      getMarketOverview(),
      getSupplyPipeline(),
    ])
  } catch {
    return null
  }

  // Need at least market overview to show anything
  if (!marketData) return null

  // JSX rendering outside try/catch
  return (
    <Stack gap="lg" className="module-market-data">
      {/* Market snapshot at top */}
      <MarketSnapshotCard marketData={marketData} supplyData={supplyData || undefined} />

      {/* Supply breakdown */}
      {supplyData && (
        <MarketDataExplorer
          dataKey="supply_pipeline_2025"
          variant="pipeline"
          title="2025 Supply Pipeline"
        />
      )}
    </Stack>
  )
}

/**
 * Area Deep Dives Module
 * Shows: Stock vs Supply comparison chart
 */
async function AreaDeepDivesData() {
  // Data fetching in try/catch
  let existingStock = null
  let underConstruction = null
  
  try {
    ;[existingStock, underConstruction] = await Promise.all([
      getExistingStock(),
      getUnderConstruction(),
    ])
  } catch {
    return null
  }

  // Need at least one data set
  if (!existingStock && !underConstruction) return null

  // JSX rendering outside try/catch
  // Need both data sets to show comparison
  if (!existingStock || !underConstruction) {
    // Fall back to individual charts if only one available
    return (
      <Stack gap="lg" className="module-market-data">
        {existingStock && (
          <MarketDataExplorer
            dataKey="existing_stock_by_area"
            variant="stock"
            title="Existing Residential Stock"
          />
        )}
        {underConstruction && (
          <MarketDataExplorer
            dataKey="under_construction_by_area"
            variant="construction"
            title="Residential Under Construction"
          />
        )}
      </Stack>
    )
  }

  // Combined stock vs supply comparison
  return (
    <Card className="module-market-data border-border/50 bg-card/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <BarChart3Icon className="h-4 w-4 text-primary" />
          Stock vs Incoming Supply
        </CardTitle>
      </CardHeader>
      <CardContent>
        <StockVsSupplyChart
          existingStock={existingStock.areas}
          underConstruction={underConstruction.areas}
        />
      </CardContent>
    </Card>
  )
}

/**
 * Area Knowledge Module
 * Shows: Budget explorer + Price table
 */
async function AreaKnowledgeData() {
  // Data fetching in try/catch
  let budgetGuide = null
  let medianPrices = null
  
  try {
    ;[budgetGuide, medianPrices] = await Promise.all([
      getBudgetGuide(),
      getMedianPrices(),
    ])
  } catch {
    return null
  }

  // Need at least one data set
  if (!budgetGuide && !medianPrices) return null

  // JSX rendering outside try/catch
  return (
    <Stack gap="lg" className="module-market-data">
      {/* Budget guide - THE key client question */}
      {budgetGuide && (
        <MarketDataExplorer
          dataKey="budget_guide"
          variant="budget"
          title="What Does Your Budget Buy?"
        />
      )}

      {/* Price per sqft by area */}
      {medianPrices && (
        <MarketDataExplorer
          dataKey="median_prices_by_area"
          variant="prices"
          title="Median Prices by Area"
        />
      )}
    </Stack>
  )
}
