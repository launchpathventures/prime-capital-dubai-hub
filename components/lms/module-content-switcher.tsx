/**
 * CATALYST - Module Content Switcher
 * 
 * Client component that handles instant switching between Essentials and Deep Dive modes.
 * Manages mode state locally for instant switching, no server round-trip needed.
 * 
 * The page passes both content types; this component toggles which one displays.
 * Also handles the right-side ToC switching.
 */

"use client"

import { useState, useCallback, type ReactNode } from "react"
import { useSearchParams, usePathname, useRouter } from "next/navigation"
import { EssentialsView, SectionRenderer } from "@/components/lms"
import { ModuleControlsBar, type AudioTrack } from "@/components/lms/module-controls-bar"
import { ModuleCoachPrompt } from "@/components/lms/coach"
import type { EssentialsContent } from "@/lib/learning-types"

// =============================================================================
// Types
// =============================================================================

export interface ScenarioLink {
  slug: string
  title: string
  scenarioCount: number | null
}

interface ModuleContentSwitcherProps {
  /** Module title for coach prompt */
  moduleTitle: string
  /** Essentials content (AI-generated summary) */
  essentials: EssentialsContent | null
  /** Deep dive content (full markdown) */
  deepDiveContent: string | null
  /** Audio tracks for the module */
  audioTracks?: AudioTrack[]
  /** Essentials duration string */
  essentialsDuration?: string
  /** Deep dive duration string */
  deepDiveDuration?: string
  /** Linked scenarios for practice */
  linkedScenarios?: ScenarioLink[]
  /** Initial mode from URL */
  initialMode?: "essentials" | "deepdive"
  /** ToC for essentials mode (rendered by server) */
  essentialsToC?: ReactNode
  /** ToC for deep dive mode (rendered by server) */
  deepDiveToC?: ReactNode
  /** Market data component (rendered by server) */
  marketData?: ReactNode
}

// =============================================================================
// Component
// =============================================================================

export function ModuleContentSwitcher({
  moduleTitle,
  essentials,
  deepDiveContent,
  audioTracks = [],
  essentialsDuration = "15 min",
  deepDiveDuration = "25 min",
  linkedScenarios = [],
  initialMode,
  marketData,
}: ModuleContentSwitcherProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  // Determine initial mode
  const hasEssentials = !!essentials
  const defaultMode = hasEssentials ? "essentials" : "deepdive"
  const urlMode = searchParams.get("mode") as "essentials" | "deepdive" | null
  
  // Local state for instant switching
  const [mode, setModeState] = useState<"essentials" | "deepdive">(
    initialMode || urlMode || defaultMode
  )
  
  // Handle mode change - instant local state update, async URL sync
  const setMode = useCallback((newMode: "essentials" | "deepdive") => {
    // Instant local update - content switches immediately
    setModeState(newMode)
    
    // Sync to URL in background (for bookmarkability) - no loading state needed
    const params = new URLSearchParams(searchParams.toString())
    params.set("mode", newMode)
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }, [pathname, router, searchParams])
  
  // Handler for switching from essentials to deep dive
  const handleSwitchToDeepDive = useCallback(() => {
    setMode("deepdive")
  }, [setMode])

  return (
    <>
      {/* AI Coach - collapsible */}
      <ModuleCoachPrompt moduleTitle={moduleTitle} />
      
      {/* Combined Controls Bar - Audio + Mode Toggle */}
      <ModuleControlsBar
        audioTracks={audioTracks}
        hasEssentials={hasEssentials}
        essentialsDuration={essentialsDuration}
        deepDiveDuration={deepDiveDuration}
        currentMode={mode}
        onModeChange={setMode}
      />

      {/* Content - instant switch, no skeleton needed */}
      {mode === "essentials" && essentials ? (
        <EssentialsView
          essentials={essentials}
          onSwitchMode={handleSwitchToDeepDive}
          linkedScenarios={linkedScenarios}
          marketData={marketData}
        />
      ) : deepDiveContent ? (
        <SectionRenderer content={deepDiveContent} linkedScenarios={linkedScenarios} marketData={marketData} />
      ) : null}
    </>
  )
}
