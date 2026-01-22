/**
 * CATALYST - Market Data Fetching
 *
 * Server-side functions to fetch market data for LMS modules.
 * Data is stored in the market_data table and can be refreshed
 * when new market reports become available.
 */

import { createClient } from "@/lib/supabase/server"

// =============================================================================
// Types
// =============================================================================

export interface MarketDataRecord {
  data_key: string
  category: string
  value: Record<string, unknown>
  source: string | null
  valid_from: string | null
  valid_until: string | null
}

// Specific data shapes for type safety
export interface MarketOverviewData {
  year: number
  total_transactions_aed: number
  total_transactions_usd: number
  transaction_growth_yoy: string
  as_of: string
  notes?: string
}

export interface SupplyPipelineData {
  total_pipeline_units: number
  breakdown: {
    completed: number
    construction: number
    on_hold: number
  }
  annual_delivery_forecast?: {
    "2024_2029_avg": number
    source: string
  }
  as_of: string
}

export interface AreaStockData {
  areas: Array<{
    area: string
    units: number
  }>
  as_of: string
}

export interface AreaPriceData {
  currency: string
  unit: string
  areas: Array<{
    area: string
    price: number
  }>
  as_of: string
}

export interface BudgetGuideData {
  currency: string
  tiers: Array<{
    budget: number
    label: string
    areas: string[]
    size_sqft: string
    types: string[]
  }>
  as_of: string
}

// =============================================================================
// Fetch Functions
// =============================================================================

/**
 * Fetch a single market data record by key
 */
export async function getMarketData(dataKey: string): Promise<MarketDataRecord | null> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("market_data")
      .select("data_key, category, value, source, valid_from, valid_until")
      .eq("data_key", dataKey)
      .eq("is_active", true)
      .single()

    if (error || !data) return null
    return data
  } catch {
    // Table might not exist yet
    return null
  }
}

/**
 * Fetch all market data records for a category
 */
export async function getMarketDataByCategory(
  category: string
): Promise<MarketDataRecord[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("market_data")
    .select("data_key, category, value, source, valid_from, valid_until")
    .eq("category", category)
    .eq("is_active", true)
    .order("data_key")

  if (error) return []
  return data || []
}

/**
 * Fetch multiple market data records by keys
 */
export async function getMarketDataBatch(
  dataKeys: string[]
): Promise<MarketDataRecord[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("market_data")
    .select("data_key, category, value, source, valid_from, valid_until")
    .in("data_key", dataKeys)
    .eq("is_active", true)

  if (error) return []
  return data || []
}

/**
 * Fetch market overview data (AED 917bn total transactions, etc.)
 */
export async function getMarketOverview(): Promise<MarketOverviewData | null> {
  const record = await getMarketData("market_overview_2025")
  if (!record) return null
  return record.value as unknown as MarketOverviewData
}

/**
 * Fetch supply pipeline data (completed, construction, on hold)
 */
export async function getSupplyPipeline(): Promise<SupplyPipelineData | null> {
  const record = await getMarketData("supply_pipeline_2025")
  if (!record) return null
  return record.value as unknown as SupplyPipelineData
}

/**
 * Fetch existing stock by area
 */
export async function getExistingStock(): Promise<AreaStockData | null> {
  const record = await getMarketData("existing_stock_by_area")
  if (!record) return null
  return record.value as unknown as AreaStockData
}

/**
 * Fetch units under construction by area
 */
export async function getUnderConstruction(): Promise<AreaStockData | null> {
  const record = await getMarketData("under_construction_by_area")
  if (!record) return null
  return record.value as unknown as AreaStockData
}

/**
 * Fetch median prices by area
 */
export async function getMedianPrices(): Promise<AreaPriceData | null> {
  const record = await getMarketData("median_prices_by_area")
  if (!record) return null
  return record.value as unknown as AreaPriceData
}

/**
 * Fetch budget guide (what AED 1M/2M/3M/5M buys)
 */
export async function getBudgetGuide(): Promise<BudgetGuideData | null> {
  const record = await getMarketData("budget_guide")
  if (!record) return null
  return record.value as unknown as BudgetGuideData
}

/**
 * Fetch all market data needed for a module.
 * Returns a combined object for convenience.
 */
export async function getMarketDataForModule(moduleSlug: string) {
  // Different modules need different data sets
  const dataNeeded: Record<string, string[]> = {
    "dubai-overview": ["market_overview_2025", "supply_pipeline_2025"],
    "area-deep-dives": ["existing_stock_by_area", "under_construction_by_area"],
    "area-knowledge": ["median_prices_by_area", "budget_guide"],
  }

  const keys = dataNeeded[moduleSlug]
  if (!keys) return null

  const records = await getMarketDataBatch(keys)

  // Convert to a keyed object for easy access
  const result: Record<string, MarketDataRecord> = {}
  for (const record of records) {
    result[record.data_key] = record
  }

  return result
}
