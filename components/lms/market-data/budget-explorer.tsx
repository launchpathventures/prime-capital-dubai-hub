/**
 * CATALYST - Budget Explorer
 *
 * Interactive table showing what different budgets can buy.
 * The #1 question clients ask agents: "What can I get for X AED?"
 */

import { Stack, Text } from "@/components/core"
import { Badge } from "@/components/ui/badge"
import type { BudgetGuideData } from "@/lib/lms/market-data"

// =============================================================================
// Component
// =============================================================================

interface BudgetExplorerProps {
  data: BudgetGuideData
}

export function BudgetExplorer({ data }: BudgetExplorerProps) {
  return (
    <Stack gap="md" className="market-data-chart budget-explorer">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-border">
              <th className="text-left py-3 px-4 font-semibold">Budget</th>
              <th className="text-left py-3 px-4 font-semibold">Areas</th>
              <th className="text-center py-3 px-4 font-semibold hidden sm:table-cell">
                Size (sqft)
              </th>
              <th className="text-left py-3 px-4 font-semibold hidden md:table-cell">
                Property Types
              </th>
            </tr>
          </thead>
          <tbody>
            {data.tiers.map((tier, index) => (
              <tr
                key={tier.label}
                className={index % 2 === 0 ? "bg-muted/30" : ""}
              >
                <td className="py-4 px-4">
                  <Text className="font-semibold text-primary whitespace-nowrap">
                    {tier.label}
                  </Text>
                </td>
                <td className="py-4 px-4">
                  <div className="flex flex-wrap gap-1">
                    {tier.areas.map((area) => (
                      <Badge key={area} variant="outline" className="text-xs">
                        {area}
                      </Badge>
                    ))}
                  </div>
                </td>
                <td className="py-4 px-4 text-center tabular-nums hidden sm:table-cell">
                  {tier.size_sqft}
                </td>
                <td className="py-4 px-4 hidden md:table-cell">
                  <Text size="sm" className="text-muted-foreground">
                    {tier.types.join(", ")}
                  </Text>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile-only property types summary */}
      <div className="md:hidden px-4">
        <Text size="xs" className="text-muted-foreground">
          <span className="font-medium">Property types by budget:</span>
          <br />
          {data.tiers.map((tier, i) => (
            <span key={tier.label}>
              {tier.label}: {tier.types.join(", ")}
              {i < data.tiers.length - 1 ? " • " : ""}
            </span>
          ))}
        </Text>
      </div>

      <Text size="xs" className="text-muted-foreground italic text-center">
        Indicative ranges based on current market conditions. Actual
        availability varies.
      </Text>
    </Stack>
  )
}
