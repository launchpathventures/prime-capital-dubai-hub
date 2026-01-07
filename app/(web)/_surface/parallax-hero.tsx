/**
 * CATALYST - Parallax Hero Background
 *
 * Subtle parallax effect for hero backgrounds on desktop.
 * Disabled on mobile for performance and iOS compatibility.
 */

"use client"

import * as React from "react"

interface ParallaxHeroProps {
  /** Background image URL */
  imageUrl: string
  /** Gradient overlay (optional) */
  overlay?: string
  /** Parallax intensity (0.1 = subtle, 0.5 = strong) */
  intensity?: number
  /** Additional class names */
  className?: string
  /** Children to render inside the hero */
  children: React.ReactNode
}

export function ParallaxHero({
  imageUrl,
  overlay = "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 100%)",
  intensity = 0.15,
  className = "",
  children,
}: ParallaxHeroProps) {
  const [offset, setOffset] = React.useState(0)
  const [isMobile, setIsMobile] = React.useState(true) // Default to mobile (no parallax SSR)
  const heroRef = React.useRef<HTMLElement>(null)

  // Check if mobile on mount
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Handle parallax scroll effect
  React.useEffect(() => {
    if (isMobile) return

    const handleScroll = () => {
      if (!heroRef.current) return

      const rect = heroRef.current.getBoundingClientRect()
      const scrollPosition = window.scrollY
      const elementTop = rect.top + scrollPosition
      const elementHeight = rect.height

      // Only apply parallax when hero is in view
      if (scrollPosition < elementTop + elementHeight) {
        // Calculate offset based on scroll position
        const parallaxOffset = scrollPosition * intensity
        setOffset(parallaxOffset)
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll() // Initial calculation

    return () => window.removeEventListener("scroll", handleScroll)
  }, [isMobile, intensity])

  return (
    <section
      ref={heroRef}
      className={`relative overflow-hidden ${className}`}
      style={{
        // Static background for mobile, parallax for desktop
        backgroundImage: isMobile ? `${overlay}, url('${imageUrl}')` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center 30%",
      }}
    >
      {/* Parallax background layer - only rendered on desktop */}
      {!isMobile && (
        <div
          className="absolute inset-0 -top-[15%] -bottom-[15%]"
          style={{
            backgroundImage: `${overlay}, url('${imageUrl}')`,
            backgroundSize: "cover",
            backgroundPosition: "center 30%",
            transform: `translateY(${offset}px)`,
            willChange: "transform",
          }}
          aria-hidden="true"
        />
      )}

      {/* Content layer - children rendered directly for proper absolute positioning */}
      {children}
    </section>
  )
}
