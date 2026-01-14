/**
 * CATALYST - Module Table of Contents (Right Sidebar)
 * 
 * Sticky ToC on the right side for desktop.
 * Shows section list with active highlighting and scroll progress.
 */

"use client"

import { useEffect, useState, useMemo, useCallback } from "react"
import { cn } from "@/lib/utils"

// =============================================================================
// Types
// =============================================================================

interface TocItem {
  id: string
  title: string
  level: number
}

// =============================================================================
// Utilities
// =============================================================================

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

function extractHeadings(markdown: string): TocItem[] {
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

interface ModuleToCRightProps {
  content: string
  hasQuiz?: boolean
  className?: string
}

export function ModuleToCRight({ content, hasQuiz, className }: ModuleToCRightProps) {
  const [activeId, setActiveId] = useState<string>("")
  const [progress, setProgress] = useState(0)
  const headings = useMemo(() => {
    const extracted = extractHeadings(content)
    // Add quiz link if quiz exists
    if (hasQuiz) {
      extracted.push({ id: "knowledge-check", title: "Knowledge Check", level: 2 })
    }
    return extracted
  }, [content, hasQuiz])

  // Reading progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const prog = docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0
      setProgress(prog)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
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
      const yOffset = -100
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset
      window.scrollTo({ top: y, behavior: "smooth" })
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
