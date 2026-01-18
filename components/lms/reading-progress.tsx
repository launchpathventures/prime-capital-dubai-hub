/**
 * CATALYST - Reading Progress Bar
 * 
 * Simple horizontal progress bar showing scroll position.
 * Displayed at the top of the page.
 */

"use client"

import { useEffect, useState } from "react"

export function ReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // The scrolling container is .learn-content-wrapper, not the window
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

  return (
    <div className="lms-progress" aria-hidden="true">
      <div className="lms-progress__bar" style={{ width: `${progress}%` }} />
    </div>
  )
}
