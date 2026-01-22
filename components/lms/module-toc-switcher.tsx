/**
 * CATALYST - Module ToC Switcher
 * 
 * Client component that shows the appropriate ToC based on current mode.
 * Reads mode from URL params so it stays in sync with ModuleContentSwitcher.
 */

"use client"

import { useSearchParams } from "next/navigation"
import { EssentialsToCRight, ModuleToCRight } from "@/components/lms"
import type { EssentialsContent } from "@/lib/learning-types"

interface ModuleToCProps {
  /** Essentials content for ToC generation */
  essentials: EssentialsContent | null
  /** Deep dive content for ToC generation */
  deepDiveContent: string | null
  /** Whether a quiz exists */
  hasQuiz: boolean
  /** Whether this module has market data */
  hasMarketData?: boolean
  /** Initial mode from server (used before hydration) */
  initialMode?: "essentials" | "deepdive"
}

export function ModuleToCSwitcher({
  essentials,
  deepDiveContent,
  hasQuiz,
  hasMarketData,
  initialMode = "deepdive",
}: ModuleToCProps) {
  const searchParams = useSearchParams()

  // Derive mode from URL, falling back to initial mode
  const urlMode = searchParams.get("mode") as "essentials" | "deepdive" | null
  const mode = urlMode || initialMode

  // Show appropriate ToC based on mode
  if (mode === "essentials" && essentials) {
    return <EssentialsToCRight essentials={essentials} hasQuiz={hasQuiz} hasMarketData={hasMarketData} />
  }

  if (deepDiveContent) {
    return <ModuleToCRight content={deepDiveContent} hasQuiz={hasQuiz} hasMarketData={hasMarketData} />
  }

  return null
}
