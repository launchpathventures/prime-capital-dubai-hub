/**
 * CATALYST - Essentials Table of Contents (Right Sidebar)
 * 
 * Sticky ToC on the right side for essentials view.
 * Shows fixed section list based on available essentials content.
 */

"use client"

import { useEffect, useState, useMemo, useCallback } from "react"
import { cn } from "@/lib/utils"
import type { EssentialsContent } from "@/lib/learning-types"

// =============================================================================
// Types
// =============================================================================

interface TocItem {
  id: string
  title: string
  available: boolean
}

// =============================================================================
// Component
// =============================================================================

interface EssentialsToCRightProps {
  essentials: EssentialsContent
  hasQuiz?: boolean
  hasMarketData?: boolean
  className?: string
}

export function EssentialsToCRight({ essentials, hasQuiz, hasMarketData, className }: EssentialsToCRightProps) {
  const [activeId, setActiveId] = useState<string>("")
  const [progress, setProgress] = useState(0)

  // Build TOC from essentials content
  const headings = useMemo<TocItem[]>(() => {
    const items: TocItem[] = []

    // Always show Summary
    if (essentials.tldr) {
      items.push({ id: "summary", title: "Summary", available: true })
    }

    // Market Data (after summary)
    if (hasMarketData) {
      items.push({ id: "market-data", title: "Market Data", available: true })
    }

    // Key Facts
    if (essentials.keyFacts?.length > 0) {
      items.push({ id: "key-facts", title: "Key Facts", available: true })
    }
    
    // Scripts
    if (essentials.scripts?.length > 0) {
      items.push({ id: "scripts", title: "Scripts", available: true })
    }
    
    // Key Documents (images)
    if (essentials.images?.filter(img => img.essential).length > 0) {
      items.push({ id: "key-documents", title: "Key Documents", available: true })
    }
    
    // Audio
    if (essentials.audio?.length > 0) {
      items.push({ id: "coach-demo", title: "Coach Demo", available: true })
    }
    
    // Practice
    if (essentials.practice) {
      items.push({ id: "practice-scenario", title: "Practice Scenario", available: true })
    }
    
    // Reflection -> Your Takeaway
    if (essentials.reflection) {
      items.push({ id: "your-takeaway", title: "Your Takeaway", available: true })
    }
    
    // Deep Dive CTA always present
    items.push({ id: "deep-dive-cta", title: "Deep Dive", available: true })
    
    // Knowledge Check quiz link
    if (hasQuiz) {
      items.push({ id: "knowledge-check", title: "Knowledge Check", available: true })
    }
    
    return items
  }, [essentials, hasQuiz, hasMarketData])

  // Reading progress - listens to the scroll container, not window
  useEffect(() => {
    const scrollContainer = document.querySelector(".learn-content-wrapper")

    const handleScroll = () => {
      if (scrollContainer) {
        const scrollTop = scrollContainer.scrollTop
        const scrollHeight = scrollContainer.scrollHeight - scrollContainer.clientHeight
        const prog = scrollHeight > 0 ? Math.min((scrollTop / scrollHeight) * 100, 100) : 0
        setProgress(prog)
      } else {
        // Fallback to window scroll
        const scrollTop = window.scrollY
        const docHeight = document.documentElement.scrollHeight - window.innerHeight
        const prog = docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0
        setProgress(prog)
      }
    }

    const target = scrollContainer || window
    target.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => target.removeEventListener("scroll", handleScroll)
  }, [])

  // Scroll-spy
  useEffect(() => {
    if (headings.length === 0) return

    const observers: IntersectionObserver[] = []
    const visibleSections = new Set<string>()

    headings.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (!element) return

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              visibleSections.add(id)
            } else {
              visibleSections.delete(id)
            }
            
            const firstVisible = headings.find(h => visibleSections.has(h.id))
            if (firstVisible) {
              setActiveId(firstVisible.id)
            }
          })
        },
        { rootMargin: "-100px 0px -60% 0px", threshold: 0 }
      )

      observer.observe(element)
      observers.push(observer)
    })

    return () => observers.forEach((obs) => obs.disconnect())
  }, [headings])

  const handleClick = useCallback((id: string) => {
    const element = document.getElementById(id)
    if (element) {
      // The scrolling container is .learn-content-wrapper, not the window
      const scrollContainer = document.querySelector(".learn-content-wrapper")
      if (scrollContainer) {
        const yOffset = -100
        const containerRect = scrollContainer.getBoundingClientRect()
        const elementRect = element.getBoundingClientRect()
        const y = elementRect.top - containerRect.top + scrollContainer.scrollTop + yOffset
        scrollContainer.scrollTo({ top: y, behavior: "smooth" })
      } else {
        // Fallback to window scroll if container not found
        const yOffset = -100
        const y = element.getBoundingClientRect().top + window.scrollY + yOffset
        window.scrollTo({ top: y, behavior: "smooth" })
      }
    }
  }, [])

  if (headings.length < 2) return null

  return (
    <aside className={cn("lms-toc-right", className)}>
      <div className="lms-toc-right__inner">
        {/* Progress indicator */}
        <div className="lms-toc-right__progress">
          <div 
            className="lms-toc-right__progress-bar" 
            style={{ height: `${progress}%` }} 
          />
        </div>

        {/* Header */}
        <div className="lms-toc-right__header">
          On this page
        </div>

        {/* Links */}
        <nav className="lms-toc-right__nav" aria-label="Table of contents">
          <ol className="lms-toc-right__list">
            {headings.map((heading) => (
              <li key={heading.id}>
                <button
                  onClick={() => handleClick(heading.id)}
                  className={cn(
                    "lms-toc-right__link",
                    activeId === heading.id && "lms-toc-right__link--active"
                  )}
                >
                  {heading.title}
                </button>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </aside>
  )
}
