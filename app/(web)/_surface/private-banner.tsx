/**
 * CATALYST - Private Advisory Banner
 *
 * Subtle announcement bar for the Private Advisory page.
 * Only shows on homepage, dismissable with localStorage persistence.
 * Designed to intrigue UHNW investors without being promotional.
 */

"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { XIcon, ArrowRightIcon } from "lucide-react"

const STORAGE_KEY = "pcp-banner-dismissed"

export function PrivateBanner() {
  const [dismissed, setDismissed] = useState(true) // Start hidden to avoid flash
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  // Only show on homepage, not on /private itself
  const shouldShow = pathname === "/" || pathname === ""

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem(STORAGE_KEY)
    setDismissed(stored === "true")
  }, [])

  const handleDismiss = () => {
    setDismissed(true)
    localStorage.setItem(STORAGE_KEY, "true")
  }

  // Don't render until mounted (avoids hydration mismatch)
  if (!mounted || dismissed || !shouldShow) {
    return null
  }

  return (
    <div className="private-banner">
      <div className="private-banner__content">
        <span className="private-banner__text">
          Deploying $5M+?
        </span>
        <Link href="/private" className="private-banner__link">
          Explore Private Advisory
          <ArrowRightIcon className="private-banner__arrow" />
        </Link>
      </div>
      <button
        onClick={handleDismiss}
        className="private-banner__dismiss"
        aria-label="Dismiss banner"
      >
        <XIcon className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
