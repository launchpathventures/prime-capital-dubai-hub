/**
 * CATALYST - Presentations Index
 *
 * Showcase page for /present with:
 * - Left sidebar: Always-visible presentation list (reuses PresentNavList)
 * - Center: Engaging hero explaining the Presentations feature
 *
 * Links directly from homepage as a feature showcase.
 */

"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { ThemeToggle, SurfaceSwitcher, HeaderPopoverProvider } from "@/components/shared"
import { PresentNavList } from "../_surface"
import { MobileSidebar } from "@/components/layout/mobile-sidebar"
import { Sidebar } from "@/components/layout/sidebar"
import { useSidebarState } from "@/components/layout/use-sidebar-state"
import { presentations } from "@/lib/navigation"
import { Kbd } from "@/components/ui/kbd"
import {
  CodeIcon,
  KeyboardIcon,
  LinkIcon,
  SparklesIcon,
  ArrowRightIcon,
  PlayIcon,
  GitBranchIcon,
  PaletteIcon,
  PanelLeftIcon,
  PanelLeftCloseIcon,
} from "lucide-react"

// -----------------------------------------------------------------------------
// Page Component
// -----------------------------------------------------------------------------

export default function PresentationsIndexPage() {
  const [mounted, setMounted] = useState(false)
  const { isOpen, isMobile, toggle, close } = useSidebarState()
  
  // eslint-disable-next-line react-hooks/set-state-in-effect -- Initialization on mount
  useEffect(() => setMounted(true), [])

  // Alt+M keyboard shortcut to toggle menu (consistent with App/Docs layouts)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === "m") {
        e.preventDefault()
        toggle()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [toggle])

  // Example presentation is last (newest first order means example/oldest is at the end)
  const examplePresentation = presentations[presentations.length - 1]

  const menuLabel = isOpen ? "Close Menu" : "Open Menu"

  return (
    <div className="present-content flex h-dvh overflow-hidden">
      {/* Desktop Sidebar — always visible on desktop */}
      <Sidebar position="left" isOpen={isOpen} className="w-96">
        <PresentNavList showLogo />
      </Sidebar>

      {/* Mobile Sidebar - overlay sheet */}
      <MobileSidebar open={isMobile && isOpen} onOpenChange={(open) => !open && close()}>
        <PresentNavList showLogo onItemClick={close} />
      </MobileSidebar>

      {/* Main content */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            {/* Mobile: hamburger menu */}
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggle}
                    className="-ml-2 md:hidden"
                    aria-label={menuLabel}
                  >
                    <PanelLeftIcon className="h-5 w-5" />
                  </Button>
                }
              />
              <TooltipContent>
                {menuLabel} <Kbd className="ml-1.5">Alt+M</Kbd>
              </TooltipContent>
            </Tooltip>
            {/* Desktop: sidebar collapse toggle */}
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggle}
                    className="-ml-2 hidden md:inline-flex"
                    aria-label={menuLabel}
                  >
                    {isOpen ? (
                      <PanelLeftCloseIcon className="h-5 w-5" />
                    ) : (
                      <PanelLeftIcon className="h-5 w-5" />
                    )}
                  </Button>
                }
              />
              <TooltipContent>
                {menuLabel} <Kbd className="ml-1.5">Alt+M</Kbd>
              </TooltipContent>
            </Tooltip>
            
            <span className="font-semibold">Presentations</span>
            <Badge className="h-5 min-w-5 px-1.5 text-xs">
              {presentations.length}
            </Badge>
          </div>
          <HeaderPopoverProvider>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <SurfaceSwitcher />
            </div>
          </HeaderPopoverProvider>
        </header>

        {/* Hero */}
        <main className="relative flex min-h-0 flex-1 flex-col items-center overflow-x-hidden overflow-y-auto px-8 py-8">
          {/* Background effects */}
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
          <div className="pointer-events-none absolute top-0 left-1/2 -z-10 h-[400px] w-[800px] max-w-[200%] -translate-x-1/2 rounded-full bg-primary/5 blur-[100px]" />

          <div
            className={cn(
              "my-auto w-full max-w-2xl text-center transition-all duration-700 ease-out",
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            )}
          >
            {/* Badge */}
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm backdrop-blur-sm">
              <SparklesIcon className="h-4 w-4 text-primary" />
              <span className="font-medium">Code-First Presentations</span>
            </div>

            {/* Title */}
            <h1 className="mb-3 text-3xl font-extrabold tracking-tight md:text-4xl lg:text-5xl">
              Build slides like
              <br />
              <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                you build apps.
              </span>
            </h1>

            {/* Description */}
            <p className="mx-auto mb-6 text-base text-muted-foreground md:text-lg">
              React components, version controlled, AI-assisted. Deploy your story to the web.
            </p>

            {/* CTA */}
            {examplePresentation && (
              <div className="mb-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <Button
                  size="lg"
                  className="h-11 rounded-full px-6 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all hover:scale-105"
                  render={<Link href={examplePresentation.href} />}
                >
                  <PlayIcon className="mr-2 h-4 w-4" />
                  View Example
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-11 rounded-full px-6 hover:scale-105 transition-all"
                  render={<Link href="/docs" />}
                >
                  Read the Docs
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Code preview card */}
            <div
              className={cn(
                "mx-auto max-w-xl rounded-xl border bg-card/80 shadow-xl backdrop-blur-sm overflow-hidden transition-all duration-700 delay-150",
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
            >
              <div className="flex items-center gap-2 border-b bg-muted/50 px-4 py-2.5">
                <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
                <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
                <span className="ml-2 text-xs text-muted-foreground font-mono">page.tsx</span>
              </div>
              <div className="p-4 text-left font-mono text-xs leading-relaxed">
                <div className="text-muted-foreground">
                  <span className="text-purple-500">{"<"}</span>
                  <span className="text-primary">Slide</span>
                  <span className="text-orange-500">{" slug"}</span>
                  <span className="text-muted-foreground">{"="}</span>
                  <span className="text-green-500">{'"intro"'}</span>
                  <span className="text-purple-500">{">"}</span>
                </div>
                <div className="pl-4 text-muted-foreground">
                  <span className="text-purple-500">{"<"}</span>
                  <span className="text-primary">h1</span>
                  <span className="text-purple-500">{">"}</span>
                  <span className="text-foreground">Your Story Here</span>
                  <span className="text-purple-500">{"</"}</span>
                  <span className="text-primary">h1</span>
                  <span className="text-purple-500">{">"}</span>
                </div>
                <div className="text-muted-foreground">
                  <span className="text-purple-500">{"</"}</span>
                  <span className="text-primary">Slide</span>
                  <span className="text-purple-500">{">"}</span>
                </div>
              </div>
            </div>

            {/* Feature pills */}
            <div
              className={cn(
                "mt-8 flex flex-wrap items-center justify-center gap-3 transition-all duration-700 delay-300",
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
            >
              <FeaturePill icon={GitBranchIcon} label="Version Controlled" />
              <FeaturePill icon={KeyboardIcon} label="Keyboard Nav" />
              <FeaturePill icon={LinkIcon} label="Deep Linking" />
              <FeaturePill icon={PaletteIcon} label="Themable" />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

// -----------------------------------------------------------------------------
// Feature Pill
// -----------------------------------------------------------------------------

function FeaturePill({
  icon: Icon,
  label,
}: {
  icon: React.ElementType
  label: string
}) {
  return (
    <div className="group flex items-center gap-2 rounded-full border bg-background/80 px-4 py-2 text-sm transition-all hover:border-primary/30 hover:bg-primary/5 hover:shadow-sm">
      <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
      <span className="text-muted-foreground group-hover:text-foreground transition-colors">{label}</span>
    </div>
  )
}