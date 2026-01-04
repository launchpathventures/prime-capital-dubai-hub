/**
 * CATALYST - Theme Toggle
 *
 * A popover-based theme selector with color theme and density options.
 * Shows current theme icon in trigger, expands on hover to show all options.
 *
 * FEATURES:
 * - Color theme: Light / Dark / Auto (via next-themes)
 * - Density: Compact / Default / Large (via CSS class on html + localStorage)
 *
 * COMPOSED FROM:
 * - Button (ui/button) — trigger and placeholder
 * - Toggle (ui/toggle) — theme and density option buttons
 * - Popover (ui/popover) — container for options
 * - Tooltip (ui/tooltip) — labels on hover
 *
 * @source next-themes v0.4.x + shadcn components
 * @customised Yes — popover with toggles instead of dropdown menu
 */

"use client"

import * as React from "react"
import { Moon, Sun, SunMoon, ALargeSmall } from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Toggle } from "@/components/ui/toggle"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip"
import { Kbd } from "@/components/ui/kbd"
import { useHeaderPopover } from "./header-popover-context"

// -----------------------------------------------------------------------------
// Color Theme
// -----------------------------------------------------------------------------

type Theme = "light" | "dark" | "system"

const THEME_OPTIONS: { value: Theme; icon: typeof Sun; label: string }[] = [
  { value: "light", icon: Sun, label: "Light" },
  { value: "dark", icon: Moon, label: "Dark" },
  { value: "system", icon: SunMoon, label: "Auto" },
]

// -----------------------------------------------------------------------------
// Density
// -----------------------------------------------------------------------------

type Density = "normal" | "compact" | "large"

const DENSITY_OPTIONS: { value: Density; label: string; iconSize: string }[] = [
  { value: "normal", label: "Default", iconSize: "size-4" },
  { value: "compact", label: "Compact", iconSize: "size-3" },
  { value: "large", label: "Large", iconSize: "size-[22px]" },
]

const DENSITY_STORAGE_KEY = "catalyst-density"

function useDensity() {
  const [density, setDensityState] = React.useState<Density>("normal")

  const applyDensityClass = (value: Density) => {
    document.documentElement.classList.remove(
      "density-compact",
      "density-normal",
      "density-large"
    )
    document.documentElement.classList.add(`density-${value}`)
  }

  const withoutMotion = (fn: () => void) => {
    const root = document.documentElement
    root.setAttribute("data-density-changing", "true")
    fn()
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        root.removeAttribute("data-density-changing")
      })
    })
  }

  React.useEffect(() => {
    // Read from localStorage on mount
    const stored = localStorage.getItem(DENSITY_STORAGE_KEY) as Density | null
    const initial = stored && ["compact", "normal", "large"].includes(stored) ? stored : "normal"
    setDensityState(initial)
    applyDensityClass(initial)
  }, [])

  const setDensity = (value: Density) => {
    setDensityState(value)
    localStorage.setItem(DENSITY_STORAGE_KEY, value)
    withoutMotion(() => applyDensityClass(value))
  }

  return { density, setDensity }
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, resolvedTheme, setTheme } = useTheme()
  const { density, setDensity } = useDensity()
  const [mounted, setMounted] = React.useState(false)
  const { open, setOpen } = useHeaderPopover("theme")

  const currentTheme = (theme as Theme) || "system"

  // Prevent hydration mismatch — only render after mount
  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Cycle through themes: light → dark → system → light
  const cycleTheme = React.useCallback(() => {
    const order: Theme[] = ["light", "dark", "system"]
    const currentIndex = order.indexOf(currentTheme)
    const nextIndex = (currentIndex + 1) % order.length
    setTheme(order[nextIndex])
  }, [currentTheme, setTheme])

  // Alt+T keyboard shortcut to cycle theme
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === "t") {
        e.preventDefault()
        cycleTheme()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [cycleTheme])

  const currentOption = THEME_OPTIONS.find((o) => o.value === currentTheme) || THEME_OPTIONS[2]
  const CurrentIcon = currentOption.icon
  
  // For Auto mode, use the resolved theme's color (amber for light, blue for dark)
  const getActiveColor = (optionValue: Theme): string => {
    if (optionValue === "system") {
      return resolvedTheme === "dark" ? "text-blue-500!" : "text-amber-500!"
    }
    if (optionValue === "light") return "text-amber-500!"
    if (optionValue === "dark") return "text-blue-500!"
    return "text-primary!"
  }

  // Show placeholder during SSR to prevent layout shift
  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className={cn("shared-theme-toggle", "text-muted-foreground", className)}
        aria-label="Toggle theme"
        disabled
      >
        <Sun />
      </Button>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className={cn("shared-theme-toggle", "text-muted-foreground outline-none", className)}
            aria-label="Select theme"
            tabIndex={-1}
          >
            <CurrentIcon />
          </Button>
        }
        onMouseEnter={() => setOpen(true)}
      />
      <PopoverContent 
        className="w-auto p-3 gap-3" 
        align="end"
        onMouseLeave={() => setOpen(false)}
        tabIndex={-1}
      >
        <TooltipProvider delay={300}>
        <div className="text-center">
          <p className="text-xs font-medium text-foreground">Select Theme</p>
          <Kbd className="mt-1">Alt+T</Kbd>
        </div>
        
        {/* Color Theme */}
        <div className="flex gap-1 mb-1">
          {THEME_OPTIONS.map((option) => {
            const Icon = option.icon
            const isActive = currentTheme === option.value
            return (
              <Tooltip key={option.value}>
                <TooltipTrigger
                  render={
                    <Toggle
                      pressed={isActive}
                      onPressedChange={() => setTheme(option.value)}
                      aria-label={option.label}
                      tabIndex={-1}
                      className={isActive ? getActiveColor(option.value) : "text-muted-foreground"}
                    >
                      <Icon />
                    </Toggle>
                  }
                />
                <TooltipContent side="bottom">
                  {option.label}
                </TooltipContent>
              </Tooltip>
            )
          })}
        </div>

        {/* Density */}
        <div className="flex gap-1">
          {DENSITY_OPTIONS.map((option) => {
            const isActive = density === option.value
            return (
              <Tooltip key={option.value}>
                <TooltipTrigger
                  render={
                    <Toggle
                      pressed={isActive}
                      onPressedChange={() => setDensity(option.value)}
                      aria-label={option.label}
                      tabIndex={-1}
                      className={isActive ? "text-primary!" : "text-muted-foreground"}
                    >
                      <ALargeSmall className={option.iconSize} />
                    </Toggle>
                  }
                />
                <TooltipContent side="bottom">
                  {option.label}
                </TooltipContent>
              </Tooltip>
            )
          })}
        </div>
        </TooltipProvider>
      </PopoverContent>
    </Popover>
  )
}
