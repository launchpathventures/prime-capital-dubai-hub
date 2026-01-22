# C3: Market Data Explorer Component

> **Priority:** HIGH | **Status:** `approved`

---

## Context

The `market_data` table has been created and seeded with Dubai real estate data from training materials. This brief covers building the **interactive UI component** that displays this data in LMS modules.

**Goal:** Give trainees interactive access to current market data (supply, pricing, stock) that matches the original training material visuals but pulls from a refreshable database.

---

## What Already Exists

### Database: `market_data` table ✅

| data_key | category | Description |
|----------|----------|-------------|
| `market_overview_2025` | market | AED 917bn total transactions, 115% YoY growth |
| `supply_pipeline_2025` | supply | 78,536 units total (34,216 completed, 24,856 construction, 19,464 on hold) |
| `existing_stock_by_area` | supply | Top 11 areas by existing units |
| `under_construction_by_area` | supply | Top 11 areas by units under construction |
| `median_prices_by_area` | pricing | AED/sqft by area (11 areas) |
| `budget_guide` | pricing | What AED 1M/2M/3M/5M+ buys in Dubai |
| `area_jvc` | area_data | JVC developers + price range |
| `area_dubai_south` | area_data | Dubai South developers + price range |

### Chart Components: `components/vendor/charts.tsx` ✅

Existing wrappers around recharts:
- `BarChart` — supports horizontal layout, perfect for area rankings
- `PieChart` — supports donut style, perfect for supply breakdown
- `AreaChart`, `LineChart` — available if needed

---

## Deliverables

### 1. Data Fetching Function

Create `lib/lms/market-data.ts`:

```typescript
/**
 * CATALYST - Market Data Fetching
 * 
 * Server-side functions to fetch market data for LMS modules.
 */

import { createClient } from "@/lib/supabase/server"

export interface MarketDataRecord {
  data_key: string
  category: string
  value: Record<string, unknown>
  source: string | null
  valid_from: string | null
  valid_until: string | null
}

/**
 * Fetch a single market data record by key
 */
export async function getMarketData(dataKey: string): Promise<MarketDataRecord | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("market_data")
    .select("*")
    .eq("data_key", dataKey)
    .eq("is_active", true)
    .single()
  
  if (error || !data) return null
  return data
}

/**
 * Fetch all market data records for a category
 */
export async function getMarketDataByCategory(category: string): Promise<MarketDataRecord[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("market_data")
    .select("*")
    .eq("category", category)
    .eq("is_active", true)
    .order("data_key")
  
  if (error) return []
  return data || []
}

/**
 * Fetch multiple market data records by keys
 */
export async function getMarketDataBatch(dataKeys: string[]): Promise<MarketDataRecord[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("market_data")
    .select("*")
    .in("data_key", dataKeys)
    .eq("is_active", true)
  
  if (error) return []
  return data || []
}
```

**Add to barrel export** in `lib/lms/index.ts`:
```typescript
export { getMarketData, getMarketDataByCategory, getMarketDataBatch } from "./market-data"
```

---

### 2. MarketDataExplorer Component

Create `components/lms/market-data-explorer.tsx`:

This is a **server component** that fetches data and renders appropriate visualizations.

```typescript
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
 */

import { getMarketData } from "@/lib/lms/market-data"
import { Stack, Text, Title } from "@/components/core"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SupplyPipelineChart } from "./market-data/supply-pipeline-chart"
import { AreaRankingChart } from "./market-data/area-ranking-chart"
import { StockVsSupplyChart } from "./market-data/stock-vs-supply-chart"
import { PriceTable } from "./market-data/price-table"
import { BudgetExplorer } from "./market-data/budget-explorer"
import { MarketSnapshotCard } from "./market-data/market-snapshot-card"
import { InfoIcon } from "lucide-react"

type Variant = "pipeline" | "stock" | "construction" | "stock-vs-supply" | "prices" | "budget" | "snapshot"

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

export async function MarketDataExplorer({
  dataKey,
  variant,
  title,
  showSource = true,
}: MarketDataExplorerProps) {
  const record = await getMarketData(dataKey)
  
  if (!record) {
    return null // Graceful degradation
  }

  return (
    <Card className="market-data-explorer my-8 border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <InfoIcon className="h-4 w-4 text-primary" />
          {title || getDefaultTitle(variant)}
        </CardTitle>
        {showSource && record.source && (
          <Text size="xs" className="text-muted-foreground">
            Source: {record.source} • As of {record.value.as_of || record.valid_from}
          </Text>
        )}
      </CardHeader>
      <CardContent>
        {variant === "pipeline" && (
          <SupplyPipelineChart data={record.value} />
        )}
        {variant === "stock" && (
          <AreaRankingChart 
            data={record.value.areas} 
            valueKey="units"
            label="Existing Units"
          />
        )}
        {variant === "construction" && (
          <AreaRankingChart 
            data={record.value.areas} 
            valueKey="units"
            label="Under Construction"
          />
        )}
        {variant === "prices" && (
          <PriceTable 
            data={record.value.areas}
            currency={record.value.currency}
            unit={record.value.unit}
          />
        )}
        {variant === "budget" && (
          <BudgetExplorer data={record.value} />
        )}
      </CardContent>
    </Card>
  )
}

function getDefaultTitle(variant: Variant): string {
  switch (variant) {
    case "pipeline": return "2025 Supply Pipeline"
    case "stock": return "Existing Stock by Area"
    case "construction": return "Under Construction by Area"
    case "stock-vs-supply": return "Stock vs Incoming Supply"
    case "prices": return "Median Prices by Area"
    case "budget": return "What Does Your Budget Buy?"
    case "snapshot": return "Market Snapshot"
  }
}
```

---

### 3. Chart Sub-Components

Create folder `components/lms/market-data/` with:

#### `supply-pipeline-chart.tsx`

Donut chart showing Completed / Construction / On Hold breakdown.

```typescript
/**
 * CATALYST - Supply Pipeline Chart
 * 
 * Donut chart showing supply breakdown by status.
 */

"use client"

import { PieChart } from "@/components/vendor/charts"
import { Stack, Text } from "@/components/core"
import type { ChartConfig } from "@/components/ui/chart"

interface SupplyPipelineData {
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
}

const config: ChartConfig = {
  completed: { label: "Completed", color: "hsl(142 76% 36%)" }, // green
  construction: { label: "Under Construction", color: "hsl(221 83% 53%)" }, // blue
  on_hold: { label: "On Hold", color: "hsl(45 93% 47%)" }, // amber
}

export function SupplyPipelineChart({ data }: { data: SupplyPipelineData }) {
  const chartData = [
    { status: "Completed", value: data.breakdown.completed, fill: config.completed.color },
    { status: "Under Construction", value: data.breakdown.construction, fill: config.construction.color },
    { status: "On Hold", value: data.breakdown.on_hold, fill: config.on_hold.color },
  ]

  return (
    <Stack gap="md">
      {/* Total headline */}
      <div className="text-center">
        <Text className="text-3xl font-light text-foreground">
          {data.total_pipeline_units.toLocaleString()}
        </Text>
        <Text size="sm" className="text-muted-foreground">
          Total Units in 2025 Pipeline
        </Text>
      </div>
      
      {/* Donut chart */}
      <PieChart
        className="h-[250px] mx-auto"
        data={chartData}
        config={config}
        dataKey="value"
        nameKey="status"
        innerRadius={60}
        showLegend={true}
        showTooltip={true}
      />
      
      {/* Forecast note */}
      {data.annual_delivery_forecast && (
        <Text size="sm" className="text-center text-muted-foreground italic">
          Forecast: ~{data.annual_delivery_forecast["2024_2029_avg"].toLocaleString()} units/year (2024-2029)
          <br />
          <span className="text-xs">— {data.annual_delivery_forecast.source}</span>
        </Text>
      )}
    </Stack>
  )
}
```

#### `area-ranking-chart.tsx`

Horizontal bar chart for area rankings (stock, construction).

```typescript
/**
 * CATALYST - Area Ranking Chart
 * 
 * Horizontal bar chart showing areas ranked by value.
 */

"use client"

import { BarChart } from "@/components/vendor/charts"
import type { ChartConfig } from "@/components/ui/chart"

interface AreaData {
  area: string
  units: number
}

interface AreaRankingChartProps {
  data: AreaData[]
  valueKey: string
  label: string
}

export function AreaRankingChart({ data, valueKey, label }: AreaRankingChartProps) {
  const config: ChartConfig = {
    [valueKey]: { label, color: "hsl(221 83% 53%)" }, // primary blue
  }

  // Transform data for chart
  const chartData = data.map(item => ({
    area: item.area,
    [valueKey]: item.units,
  }))

  return (
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
      tickFormatter={(value) => value.length > 15 ? `${value.slice(0, 12)}...` : value}
    />
  )
}
```

#### `price-table.tsx`

Styled table showing median prices by area.

```typescript
/**
 * CATALYST - Price Table
 * 
 * Styled table showing area pricing data.
 */

import { Text } from "@/components/core"

interface PriceData {
  area: string
  price: number
}

interface PriceTableProps {
  data: PriceData[]
  currency: string
  unit: string
}

export function PriceTable({ data, currency, unit }: PriceTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Area</th>
            <th className="text-right py-3 px-4 font-medium text-muted-foreground">
              {currency} {unit}
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr 
              key={item.area} 
              className={index % 2 === 0 ? "bg-muted/30" : ""}
            >
              <td className="py-3 px-4 font-medium">{item.area}</td>
              <td className="py-3 px-4 text-right tabular-nums">
                {item.price.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
```

#### `index.ts` barrel export

```typescript
export { SupplyPipelineChart } from "./supply-pipeline-chart"
export { AreaRankingChart } from "./area-ranking-chart"
export { StockVsSupplyChart } from "./stock-vs-supply-chart"
export { PriceTable } from "./price-table"
export { BudgetExplorer } from "./budget-explorer"
export { MarketSnapshotCard } from "./market-snapshot-card"
```

---

### 4. Additional Components (NEW)

These components answer key learner questions.

#### `market-snapshot-card.tsx`

**Question answered:** "What's the current market state?"

```typescript
/**
 * CATALYST - Market Snapshot Card
 * 
 * Summary card showing key market statistics at a glance.
 */

import { Row, Stack, Text } from "@/components/core"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUpIcon } from "lucide-react"

interface MarketOverviewData {
  year: number
  total_transactions_aed: number
  total_transactions_usd: number
  transaction_growth_yoy: string
  notes?: string
}

interface SupplyData {
  total_pipeline_units: number
  annual_delivery_forecast?: {
    "2024_2029_avg": number
  }
}

interface MarketSnapshotCardProps {
  marketData: MarketOverviewData
  supplyData?: SupplyData
}

export function MarketSnapshotCard({ marketData, supplyData }: MarketSnapshotCardProps) {
  const formatBillions = (value: number) => {
    return `AED ${(value / 1_000_000_000).toFixed(0)}B`
  }

  return (
    <Card className="market-snapshot bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
      <CardContent className="py-6">
        <Stack gap="md">
          <Row className="items-center gap-2">
            <TrendingUpIcon className="h-5 w-5 text-primary" />
            <Text className="font-semibold text-foreground">
              Dubai Real Estate {marketData.year}
            </Text>
          </Row>
          
          <Row gap="lg" className="flex-wrap justify-center sm:justify-start">
            <StatBlock 
              value={formatBillions(marketData.total_transactions_aed)} 
              label="Total Sales" 
            />
            <StatBlock 
              value={marketData.transaction_growth_yoy} 
              label="YoY Growth" 
            />
            {supplyData && (
              <StatBlock 
                value={supplyData.total_pipeline_units.toLocaleString()} 
                label="Pipeline Units" 
              />
            )}
          </Row>
          
          {supplyData?.annual_delivery_forecast && (
            <Text size="sm" className="text-muted-foreground text-center sm:text-left">
              ~{supplyData.annual_delivery_forecast["2024_2029_avg"].toLocaleString()} units/year expected (2024-2029)
            </Text>
          )}
        </Stack>
      </CardContent>
    </Card>
  )
}

function StatBlock({ value, label }: { value: string; label: string }) {
  return (
    <Stack gap="xs" className="text-center min-w-[100px]">
      <Text className="text-2xl font-light text-foreground">{value}</Text>
      <Text size="xs" className="text-muted-foreground">{label}</Text>
    </Stack>
  )
}
```

#### `stock-vs-supply-chart.tsx`

**Question answered:** "Where is oversupply risk?"

```typescript
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

interface AreaData {
  area: string
  units: number
}

interface StockVsSupplyChartProps {
  existingStock: AreaData[]
  underConstruction: AreaData[]
}

export function StockVsSupplyChart({ existingStock, underConstruction }: StockVsSupplyChartProps) {
  const config: ChartConfig = {
    existing: { label: "Existing Stock", color: "hsl(221 83% 53%)" }, // blue
    incoming: { label: "Under Construction", color: "hsl(45 93% 47%)" }, // amber
  }

  // Merge data by area
  const allAreas = new Set([
    ...existingStock.map(d => d.area),
    ...underConstruction.map(d => d.area),
  ])

  const chartData = Array.from(allAreas).map(area => {
    const existing = existingStock.find(d => d.area === area)?.units || 0
    const incoming = underConstruction.find(d => d.area === area)?.units || 0
    const ratio = existing > 0 ? (incoming / existing) : 0
    
    return {
      area,
      existing,
      incoming,
      ratio,
    }
  }).sort((a, b) => b.ratio - a.ratio) // Sort by ratio (highest risk first)

  // Take top 10 for readability
  const topAreas = chartData.slice(0, 10)

  return (
    <Stack gap="md">
      <BarChart
        className="h-[450px]"
        data={topAreas}
        config={config}
        xKey="area"
        dataKeys={["existing", "incoming"]}
        horizontal={true}
        showLegend={true}
        showTooltip={true}
        showGrid={true}
        tickFormatter={(value) => value.length > 12 ? `${value.slice(0, 10)}...` : value}
      />
      
      {/* Supply ratio indicators */}
      <Stack gap="sm">
        <Text size="sm" className="font-medium text-muted-foreground">Supply Ratio (Incoming ÷ Existing)</Text>
        <div className="flex flex-wrap gap-2">
          {topAreas.slice(0, 5).map(item => (
            <Badge 
              key={item.area}
              variant={item.ratio > 1.5 ? "destructive" : item.ratio > 1 ? "secondary" : "outline"}
            >
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
```

#### `budget-explorer.tsx`

**Question answered:** "What does AED X buy in Dubai?"

```typescript
/**
 * CATALYST - Budget Explorer
 * 
 * Interactive table showing what different budgets can buy.
 * The #1 question clients ask agents.
 */

import { Stack, Text, Row } from "@/components/core"
import { Badge } from "@/components/ui/badge"

interface BudgetTier {
  budget: number
  label: string
  areas: string[]
  size_sqft: string
  types: string[]
}

interface BudgetGuideData {
  currency: string
  tiers: BudgetTier[]
}

export function BudgetExplorer({ data }: { data: BudgetGuideData }) {
  return (
    <Stack gap="md">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-border">
              <th className="text-left py-3 px-4 font-semibold">Budget</th>
              <th className="text-left py-3 px-4 font-semibold">Areas</th>
              <th className="text-center py-3 px-4 font-semibold">Size (sqft)</th>
              <th className="text-left py-3 px-4 font-semibold">Property Types</th>
            </tr>
          </thead>
          <tbody>
            {data.tiers.map((tier, index) => (
              <tr 
                key={tier.label} 
                className={index % 2 === 0 ? "bg-muted/30" : ""}
              >
                <td className="py-4 px-4">
                  <Text className="font-semibold text-primary">{tier.label}</Text>
                </td>
                <td className="py-4 px-4">
                  <div className="flex flex-wrap gap-1">
                    {tier.areas.map(area => (
                      <Badge key={area} variant="outline" className="text-xs">
                        {area}
                      </Badge>
                    ))}
                  </div>
                </td>
                <td className="py-4 px-4 text-center tabular-nums">
                  {tier.size_sqft}
                </td>
                <td className="py-4 px-4">
                  <Text size="sm" className="text-muted-foreground">
                    {tier.types.join(", ")}
                  </Text>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <Text size="xs" className="text-muted-foreground italic text-center">
        Indicative ranges based on current market conditions. Actual availability varies.
      </Text>
    </Stack>
  )
}
```

---

### 4. Add to LMS Component Index

Update `components/lms/index.ts`:

```typescript
export { MarketDataExplorer } from "./market-data-explorer"
```

---

### 5. Module Integration

Add `MarketDataExplorer` to these modules:

#### `dubai-overview` module

Add after the market overview section:

```tsx
{/* Market snapshot at top */}
<MarketSnapshotCard 
  marketData={marketOverviewData} 
  supplyData={supplyPipelineData}
/>

{/* Supply breakdown */}
<MarketDataExplorer 
  dataKey="supply_pipeline_2025" 
  variant="pipeline"
  title="2025 Supply Pipeline"
/>
```

#### `area-deep-dives` module

Add in the supply/stock section:

```tsx
{/* Combined stock vs supply comparison - shows oversupply risk */}
<StockVsSupplyChart
  existingStock={existingStockData.areas}
  underConstruction={underConstructionData.areas}
/>
```

Or use separate charts:

```tsx
<MarketDataExplorer 
  dataKey="existing_stock_by_area" 
  variant="stock"
  title="Existing Residential Stock"
/>

<MarketDataExplorer 
  dataKey="under_construction_by_area" 
  variant="construction"
  title="Residential Under Construction"
/>
```

#### `area-knowledge` module

Add in the pricing section:

```tsx
{/* Budget guide - THE key client question */}
<MarketDataExplorer 
  dataKey="budget_guide" 
  variant="budget"
  title="What Does Your Budget Buy?"
/>

{/* Price per sqft by area */}
<MarketDataExplorer 
  dataKey="median_prices_by_area" 
  variant="prices"
  title="Median Prices by Area (Q2 2025)"
/>
```

**Integration approach:** Since modules use markdown rendered via `MarkdownRenderer`, we need to either:

1. **Option A:** Add components to the module page layout (outside markdown)
2. **Option B:** Create a custom markdown directive (e.g., `:::market-data{key="supply_pipeline_2025"}`)
3. **Option C:** Add to essentials view as a dedicated section

**Recommended: Option A** — Add to module page based on module slug. Clean and doesn't require markdown changes.

---

## Implementation Notes

### Data Flow

```
Module Page
  └── Check module slug
      └── If area-knowledge, area-deep-dives, or dubai-overview:
          └── Render <MarketDataExplorer /> with appropriate props
              └── Fetches from market_data table
                  └── Renders chart/table component
```

### CSS Classes

Add to `app/learn/learn.css`:

```css
/* Market Data Explorer */
.market-data-explorer {
  @apply bg-card/50;
}

.market-data-explorer [data-chart] {
  /* Chart container styling */
}
```

### Type Generation

After implementing, run:
```bash
pnpm supabase gen types typescript --project-id ebirxyrjwaulyqizcbcs > lib/supabase/database.types.ts
```

---

## Acceptance Criteria

- [ ] `lib/lms/market-data.ts` created with fetch functions
- [ ] `MarketDataExplorer` component created (server component)
- [ ] `MarketSnapshotCard` renders market overview stats
- [ ] `SupplyPipelineChart` renders donut chart
- [ ] `StockVsSupplyChart` renders grouped bar chart with ratio badges
- [ ] `AreaRankingChart` renders horizontal bar chart
- [ ] `BudgetExplorer` renders budget-to-area table
- [ ] `PriceTable` renders styled price table
- [ ] Components integrated into `dubai-overview` module
- [ ] Components integrated into `area-deep-dives` module
- [ ] Components integrated into `area-knowledge` module
- [ ] Data displays correctly from `market_data` table
- [ ] Graceful degradation if data missing

---

## Testing

1. Navigate to `/learn/c2-market-intelligence/dubai-overview`
   - Should see market snapshot card (AED 917B, 115% growth, 78,536 pipeline)
   - Should see supply pipeline donut chart
   
2. Navigate to `/learn/c2-market-intelligence/area-deep-dives`
   - Should see stock vs supply comparison chart
   - Should see supply ratio badges (JVC: 1.8x ⚠️, etc.)

3. Navigate to `/learn/c2-market-intelligence/area-knowledge`
   - Should see budget explorer (AED 1M → JVC, Studio/1BR, etc.)
   - Should see median prices table

---

## Files to Create/Modify

| Action | File |
|--------|------|
| CREATE | `lib/lms/market-data.ts` |
| MODIFY | `lib/lms/index.ts` (add export) |
| CREATE | `components/lms/market-data-explorer.tsx` |
| CREATE | `components/lms/market-data/supply-pipeline-chart.tsx` |
| CREATE | `components/lms/market-data/area-ranking-chart.tsx` |
| CREATE | `components/lms/market-data/stock-vs-supply-chart.tsx` |
| CREATE | `components/lms/market-data/price-table.tsx` |
| CREATE | `components/lms/market-data/budget-explorer.tsx` |
| CREATE | `components/lms/market-data/market-snapshot-card.tsx` |
| CREATE | `components/lms/market-data/index.ts` |
| MODIFY | `components/lms/index.ts` (add export) |
| MODIFY | `app/learn/[competency]/[module]/page.tsx` (conditional render) |
| MODIFY | `app/learn/learn.css` (optional styling) |

---

## Related

- **C2: Market Intelligence** — Content fixes that reference this data

## Data Updates

When new market reports are provided, update via SQL:

```sql
UPDATE market_data 
SET value = '{...new data...}'::jsonb,
    source = 'Knight Frank Q1 2026',
    valid_from = '2026-01-01',
    updated_at = now()
WHERE data_key = 'supply_pipeline_2025';
```

Future: Create `/update-market-data` slash command for streamlined updates.
