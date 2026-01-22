/**
 * CATALYST - Market Snapshot Card
 *
 * Summary card showing key market statistics at a glance.
 * Answers: "What's the current market state?"
 */

import { Row, Stack, Text } from "@/components/core"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUpIcon } from "lucide-react"
import type {
  MarketOverviewData,
  SupplyPipelineData,
} from "@/lib/lms/market-data"

// =============================================================================
// Types
// =============================================================================

interface MarketSnapshotCardProps {
  marketData: MarketOverviewData
  supplyData?: SupplyPipelineData
}

// =============================================================================
// Helper
// =============================================================================

function StatBlock({ value, label }: { value: string; label: string }) {
  return (
    <Stack gap="xs" className="text-center min-w-[100px]">
      <Text className="text-2xl font-light text-foreground tabular-nums">
        {value}
      </Text>
      <Text size="xs" className="text-muted-foreground">
        {label}
      </Text>
    </Stack>
  )
}

// =============================================================================
// Component
// =============================================================================

export function MarketSnapshotCard({
  marketData,
  supplyData,
}: MarketSnapshotCardProps) {
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

          <Row
            gap="lg"
            className="flex-wrap justify-center sm:justify-start"
          >
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
            <Text
              size="sm"
              className="text-muted-foreground text-center sm:text-left"
            >
              ~
              {supplyData.annual_delivery_forecast[
                "2024_2029_avg"
              ].toLocaleString()}{" "}
              units/year expected (2024-2029)
            </Text>
          )}

          {marketData.notes && (
            <Text size="xs" className="text-muted-foreground italic">
              {marketData.notes}
            </Text>
          )}
        </Stack>
      </CardContent>
    </Card>
  )
}
