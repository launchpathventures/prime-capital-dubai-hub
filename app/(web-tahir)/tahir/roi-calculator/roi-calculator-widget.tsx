/**
 * CATALYST - ROI Calculator Widget
 *
 * Lightweight rental-yield + 5-year projection calculator. Pure
 * client-side maths — no third-party deps. Inputs:
 *   - Purchase price (AED)
 *   - Annual rent (AED)
 *   - Service charges & costs (% of price)
 *   - Capital growth (% per year)
 *
 * Outputs net rental yield, gross 5-year cash return, and total value
 * including projected capital appreciation.
 */

"use client"

import { useMemo, useState } from "react"

import { TahirShare } from "../../_surface/tahir-share"
import { brands } from "@/lib/brand"

interface Inputs {
  price: number
  rent: number
  costsPct: number
  growthPct: number
}

const DEFAULTS: Inputs = {
  price: 2_500_000,
  rent: 200_000,
  costsPct: 1.5,
  growthPct: 6,
}

function readInputsFromUrl(): Inputs {
  if (typeof window === "undefined") return DEFAULTS

  const params = new URLSearchParams(window.location.search)
  const next = { ...DEFAULTS }
  const keys: Array<keyof Inputs> = ["price", "rent", "costsPct", "growthPct"]

  keys.forEach((key) => {
    const rawValue = params.get(key)
    if (rawValue === null) return

    const value = Number(rawValue)
    if (Number.isFinite(value) && value >= 0) {
      next[key] = value
    }
  })

  return next
}

function formatAed(n: number): string {
  if (!Number.isFinite(n)) return "—"
  return new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency: "AED",
    maximumFractionDigits: 0,
  }).format(n)
}

function formatPct(n: number): string {
  if (!Number.isFinite(n)) return "—"
  return `${n.toFixed(2)}%`
}

export function RoiCalculatorWidget() {
  const [inputs, setInputs] = useState<Inputs>(() => readInputsFromUrl())

  const update = (key: keyof Inputs) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value)
    setInputs((prev) => ({ ...prev, [key]: Number.isNaN(value) ? 0 : value }))
  }

  const result = useMemo(() => {
    const { price, rent, costsPct, growthPct } = inputs
    if (price <= 0) {
      return {
        grossYield: 0,
        netYield: 0,
        annualCashflow: 0,
        fiveYearCashflow: 0,
        projectedValue: 0,
        totalReturn: 0,
        totalReturnPct: 0,
      }
    }
    const annualCosts = price * (costsPct / 100)
    const netAnnual = rent - annualCosts
    const grossYield = (rent / price) * 100
    const netYield = (netAnnual / price) * 100
    const fiveYearCashflow = netAnnual * 5
    const projectedValue = price * Math.pow(1 + growthPct / 100, 5)
    const totalReturn = fiveYearCashflow + (projectedValue - price)
    const totalReturnPct = (totalReturn / price) * 100
    return {
      grossYield,
      netYield,
      annualCashflow: netAnnual,
      fiveYearCashflow,
      projectedValue,
      totalReturn,
      totalReturnPct,
    }
  }, [inputs])

  const shareUrl = useMemo(() => {
    const params = new URLSearchParams()
    params.set("price", String(inputs.price))
    params.set("rent", String(inputs.rent))
    params.set("costsPct", String(inputs.costsPct))
    params.set("growthPct", String(inputs.growthPct))
    return `https://${brands.tahir.domain}/roi-calculator?${params.toString()}`
  }, [inputs])

  return (
    <div className="roi-calc">
      <div className="roi-calc__inputs">
        <label className="roi-calc__field">
          <span>Purchase price (AED)</span>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            step={50_000}
            value={inputs.price}
            onChange={update("price")}
          />
        </label>
        <label className="roi-calc__field">
          <span>Annual rent (AED)</span>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            step={5_000}
            value={inputs.rent}
            onChange={update("rent")}
          />
        </label>
        <label className="roi-calc__field">
          <span>Annual costs (% of price)</span>
          <input
            type="number"
            inputMode="decimal"
            min={0}
            step={0.1}
            value={inputs.costsPct}
            onChange={update("costsPct")}
          />
          <input
            type="range"
            min={0}
            max={5}
            step={0.1}
            value={inputs.costsPct}
            onChange={update("costsPct")}
            aria-label="Annual costs percentage"
          />
          <small>Service charges, maintenance, management.</small>
        </label>
        <label className="roi-calc__field">
          <span>Capital growth (% per year)</span>
          <input
            type="number"
            inputMode="decimal"
            min={0}
            step={0.5}
            value={inputs.growthPct}
            onChange={update("growthPct")}
          />
          <input
            type="range"
            min={0}
            max={12}
            step={0.5}
            value={inputs.growthPct}
            onChange={update("growthPct")}
            aria-label="Capital growth percentage"
          />
          <small>Conservative Dubai average sits around 5–8%.</small>
        </label>
      </div>

      <div className="roi-calc__outputs">
        <div className="roi-calc__metric">
          <span className="roi-calc__metric-label">Gross rental yield</span>
          <span className="roi-calc__metric-value">{formatPct(result.grossYield)}</span>
        </div>
        <div className="roi-calc__metric">
          <span className="roi-calc__metric-label">Net rental yield</span>
          <span className="roi-calc__metric-value">{formatPct(result.netYield)}</span>
        </div>
        <div className="roi-calc__metric">
          <span className="roi-calc__metric-label">Annual cashflow (net)</span>
          <span className="roi-calc__metric-value">{formatAed(result.annualCashflow)}</span>
        </div>
        <div className="roi-calc__metric">
          <span className="roi-calc__metric-label">5-year rent (net)</span>
          <span className="roi-calc__metric-value">{formatAed(result.fiveYearCashflow)}</span>
        </div>
        <div className="roi-calc__metric">
          <span className="roi-calc__metric-label">Projected value (year 5)</span>
          <span className="roi-calc__metric-value">{formatAed(result.projectedValue)}</span>
        </div>
        <div className="roi-calc__metric roi-calc__metric--accent">
          <span className="roi-calc__metric-label">Total 5-year return</span>
          <span className="roi-calc__metric-value">
            {formatAed(result.totalReturn)}
            <span className="roi-calc__metric-sub">
              {" "}
              ({formatPct(result.totalReturnPct)})
            </span>
          </span>
        </div>
        <div className="roi-calc__share">
          <TahirShare
            title="Dubai property ROI calculator"
            text="Run a Dubai property ROI scenario with Tahir Majithia's calculator."
            url={shareUrl}
            label="Share this scenario"
          />
        </div>
      </div>
    </div>
  )
}
