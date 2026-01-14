/**
 * CATALYST - Learning Mode Toggle
 * 
 * Contextual bar for switching between Essentials and Deep Dive modes.
 * Shows helpful context about what each mode offers.
 */

"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Sparkles, BookOpen } from "lucide-react"

interface ModeSwitchProps {
  /** Duration for essentials mode (e.g., "15 min") */
  essentialsDuration?: string
  /** Duration for deep dive mode (e.g., "25 min") */
  deepDiveDuration?: string
  /** Whether this module has essentials generated */
  hasEssentials: boolean
  /** Current mode from server */
  currentMode?: "essentials" | "deepdive"
  /** Additional classes */
  className?: string
}

export function ModeSwitch({ 
  essentialsDuration = "15 min",
  deepDiveDuration = "25 min",
  hasEssentials,
  currentMode: serverMode,
  className
}: ModeSwitchProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  // Use server mode if provided, otherwise derive from URL
  const urlMode = searchParams.get("mode")
  const currentMode = serverMode || urlMode || (hasEssentials ? "essentials" : "deepdive")
  
  const setMode = (mode: "essentials" | "deepdive") => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("mode", mode)
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }
  
  // Don't render if no essentials available
  if (!hasEssentials) {
    return null
  }
  
  return (
    <div className={cn("mode-switch-bar", className)}>
      <div className="mode-switch-bar__inner">
        {/* Toggle buttons */}
        <div className="mode-switch-bar__toggle">
          <button
            onClick={() => setMode("essentials")}
            className={cn(
              "mode-switch-bar__button",
              currentMode === "essentials" && "mode-switch-bar__button--active"
            )}
            aria-pressed={currentMode === "essentials"}
          >
            <Sparkles className="mode-switch-bar__icon" />
            <span>Essentials</span>
            <span className="mode-switch-bar__duration">{essentialsDuration}</span>
          </button>
          <button
            onClick={() => setMode("deepdive")}
            className={cn(
              "mode-switch-bar__button",
              currentMode === "deepdive" && "mode-switch-bar__button--active"
            )}
            aria-pressed={currentMode === "deepdive"}
          >
            <BookOpen className="mode-switch-bar__icon" />
            <span>Deep Dive</span>
            <span className="mode-switch-bar__duration">{deepDiveDuration}</span>
          </button>
        </div>
        
        {/* Contextual description */}
        <p className="mode-switch-bar__context">
          {currentMode === "essentials" ? (
            <>Key facts, scripts &amp; practice scenarios — the 20% you need for 80% of conversations</>
          ) : (
            <>Full module content with complete context, examples &amp; deep background</>
          )}
        </p>
      </div>
    </div>
  )
}
