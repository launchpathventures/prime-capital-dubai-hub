/**
 * CATALYST - Module Table of Contents
 * 
 * Floating ToC button with expandable panel.
 * Stays out of the way until needed. Shows reading progress.
 */

"use client"

import { useEffect, useState, useMemo, useCallback } from "react"
import { ListIcon, XIcon } from "lucide-react"
import { cn } from "@/lib/utils"

// =============================================================================
// Types
// =============================================================================

export interface TocItem {
  id: string
  title: string
  level: number
}

// =============================================================================
// Utilities
// =============================================================================

/**
 * Generate a URL-safe slug from heading text
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

/**
 * Extract H2 headings from markdown content
 */
export function extractHeadings(markdown: string): TocItem[] {
  const headingRegex = /^##\s+(.+)$/gm
  const headings: TocItem[] = []
  let match

  while ((match = headingRegex.exec(markdown)) !== null) {
    const title = match[1].trim()
    headings.push({
      id: slugify(title),
      title,
      level: 2,
    })
  }

  return headings
}

// =============================================================================
// Component
// =============================================================================

interface ModuleTocProps {
  content: string
  className?: string
}

export function ModuleToC({ content, className }: ModuleTocProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeId, setActiveId] = useState<string>("")
  const [progress, setProgress] = useState(0)
  const headings = useMemo(() => extractHeadings(content), [content])

  // Reading progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const prog = docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0
      setProgress(prog)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll() // Initial call
    return () => window.removeEventListener("scroll", handleScroll)
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
        { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
      )

      observer.observe(element)
      observers.push(observer)
    })

    return () => observers.forEach((obs) => obs.disconnect())
  }, [headings])

  const handleClick = useCallback((id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const yOffset = -100
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset
      window.scrollTo({ top: y, behavior: "smooth" })
      setIsOpen(false)
    }
  }, [])

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false)
    }
    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [])

  if (headings.length < 2) return null

  const activeIndex = headings.findIndex(h => h.id === activeId)

  return (
    <>
      {/* Progress bar */}
      <div className="lms-progress" aria-hidden="true">
        <div className="lms-progress__bar" style={{ width: `${progress}%` }} />
      </div>

      {/* Contents button - inline with content */}
      <div className={cn("lms-toc-inline", className)}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn("lms-toc-inline__trigger", isOpen && "lms-toc-inline__trigger--open")}
          aria-expanded={isOpen}
          aria-label={isOpen ? "Close table of contents" : "Open table of contents"}
        >
          <ListIcon className="h-4 w-4" />
          <span className="lms-toc-inline__text">Contents</span>
          <span className="lms-toc-inline__count">
            {activeIndex >= 0 ? `${activeIndex + 1} of ${headings.length}` : `${headings.length} sections`}
          </span>
        </button>

        {/* Dropdown panel */}
        {isOpen && (
          <>
            <div className="lms-toc-inline__backdrop" onClick={() => setIsOpen(false)} />
            <nav className="lms-toc-inline__panel" aria-label="Table of contents">
              <div className="lms-toc-inline__header">
                <span>Jump to section</span>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="lms-toc-inline__close"
                  aria-label="Close"
                >
                  <XIcon className="h-4 w-4" />
                </button>
              </div>
              <ol className="lms-toc-inline__list">
                {headings.map((heading, index) => (
                  <li key={heading.id}>
                    <button
                      onClick={() => handleClick(heading.id)}
                      className={cn(
                        "lms-toc-inline__link",
                        activeId === heading.id && "lms-toc-inline__link--active"
                      )}
                    >
                      <span className="lms-toc-inline__number">{index + 1}</span>
                      <span className="lms-toc-inline__title">{heading.title}</span>
                    </button>
                  </li>
                ))}
              </ol>
            </nav>
          </>
        )}
      </div>
    </>
  )
}