/**
 * CATALYST - Price Table
 *
 * Styled table showing area pricing data.
 * Displays median prices per sqft by area.
 */

// No component imports needed

// =============================================================================
// Types
// =============================================================================

interface PriceData {
  area: string
  price: number
}

interface PriceTableProps {
  data: PriceData[]
  currency: string
  unit: string
}

// =============================================================================
// Component
// =============================================================================

export function PriceTable({ data, currency, unit }: PriceTableProps) {
  // Calculate min/max for visual indicator
  const prices = data.map((d) => d.price)
  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)
  const range = maxPrice - minPrice

  // Get relative position for price bar visualization
  const getBarWidth = (price: number) => {
    if (range === 0) return 50
    return ((price - minPrice) / range) * 100
  }

  return (
    <div className="market-data-chart price-table overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-4 font-medium text-muted-foreground">
              Area
            </th>
            <th className="text-right py-3 px-4 font-medium text-muted-foreground">
              {currency} {unit}
            </th>
            <th className="py-3 px-4 font-medium text-muted-foreground w-[120px] hidden sm:table-cell">
              {/* Visual indicator column */}
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
              <td className="py-3 px-4 hidden sm:table-cell">
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary/60 rounded-full transition-all"
                    style={{ width: `${getBarWidth(item.price)}%` }}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Price range indicator */}
      <div className="flex justify-between items-center mt-3 px-4 text-xs text-muted-foreground">
        <span>
          Low: {currency} {minPrice.toLocaleString()}
        </span>
        <span>
          High: {currency} {maxPrice.toLocaleString()}
        </span>
      </div>
    </div>
  )
}
