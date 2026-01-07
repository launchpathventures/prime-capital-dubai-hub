/**
 * CATALYST - Animated Stats Section (Client)
 *
 * Stats section with scroll-triggered counter animations.
 * Client component due to intersection observer usage.
 */

"use client"

import { Container } from "@/components/core"
import { useInView, useCountUp } from "@/lib/hooks/use-scroll-animation"

interface Stat {
  id: string
  value: string
  label: string
}

interface AnimatedStatsSectionProps {
  stats: Stat[]
}

/**
 * Parses a stat value like "750+", "94%", "AED 6.5B+" into components.
 */
function parseStatValue(value: string): {
  prefix: string
  number: number
  suffix: string
  decimals: number
} {
  // Match pattern: optional prefix (letters/spaces), number (with optional decimal), suffix
  const match = value.match(/^([A-Za-z\s]*)([0-9,.]+)(.*)$/)

  if (!match) {
    return { prefix: "", number: 0, suffix: value, decimals: 0 }
  }

  const prefix = match[1].trim()
  const numStr = match[2].replace(/,/g, "")
  const number = parseFloat(numStr)
  const suffix = match[3]
  const decimals = numStr.includes(".") ? numStr.split(".")[1]?.length || 0 : 0

  return { prefix, number, suffix, decimals }
}

/**
 * Single animated stat value with counter.
 */
function AnimatedStatValue({
  value,
  isInView,
}: {
  value: string
  isInView: boolean
}) {
  const { prefix, number, suffix, decimals } = parseStatValue(value)
  const animatedNumber = useCountUp(number, isInView, {
    duration: 2000,
    decimals,
  })

  // Format number with proper decimal places
  const formattedNumber =
    decimals > 0 ? animatedNumber.toFixed(decimals) : animatedNumber.toString()

  return (
    <div className="font-headline text-[var(--web-off-white)] text-[clamp(28px,5vw,52px)] font-normal leading-none mb-2">
      {prefix && (
        <span className="text-[clamp(12px,2vw,16px)] font-sans font-medium tracking-wide opacity-70 mr-1">
          {prefix}
        </span>
      )}
      <span>{formattedNumber}</span>
      <span>{suffix}</span>
    </div>
  )
}

/**
 * Stats section with animated counters.
 */
export function AnimatedStatsSection({ stats }: AnimatedStatsSectionProps) {
  const { ref, isInView } = useInView<HTMLDivElement>({ threshold: 0.2 })

  return (
    <section id="stats-section" className="bg-[var(--web-ash)]">
      <Container size="xl">
        <div
          ref={ref}
          className="stats-grid grid grid-cols-2 md:grid-cols-4 py-12 md:py-14 text-center"
        >
          {stats.map((stat, index) => (
            <div
              key={stat.id}
              className="stat-item py-4 md:py-0 px-4"
              data-index={index}
              style={{
                animationDelay: `${100 + index * 100}ms`,
              }}
            >
              <AnimatedStatValue value={stat.value} isInView={isInView} />
              <div className="text-[var(--web-serenity)] text-[11px] font-normal uppercase tracking-[0.15em]">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
