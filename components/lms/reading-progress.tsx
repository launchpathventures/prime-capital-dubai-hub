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

  return (
    <div className="lms-progress" aria-hidden="true">
      <div className="lms-progress__bar" style={{ width: `${progress}%` }} />
    </div>
  )
}
