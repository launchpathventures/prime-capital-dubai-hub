/**
 * CATALYST - Parallax Hero Background
 *
 * Subtle parallax effect for hero backgrounds on desktop.
 * Disabled on mobile for performance and iOS compatibility.
 */

"use client"

import * as React from "react"
import Image from "next/image"

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
  /** Priority loading for LCP optimization */
  priority?: boolean
  /** Image focal point (CSS object-position) */
  objectPosition?: string
}

export function ParallaxHero({
  imageUrl,
  overlay = "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 100%)",
  intensity = 0.15,
  className = "",
  children,
  priority = false,
  objectPosition = "center center",
}: ParallaxHeroProps) {
  const [isDesktop, setIsDesktop] = React.useState(false)
  const heroRef = React.useRef<HTMLElement>(null)
  const backgroundRef = React.useRef<HTMLDivElement>(null)
  const frameRef = React.useRef<number | null>(null)

  // Track breakpoint without rerendering on scroll.
  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)")
    const update = () => setIsDesktop(mediaQuery.matches)
    update()

    mediaQuery.addEventListener("change", update)
    return () => mediaQuery.removeEventListener("change", update)
  }, [])

  // Apply parallax transform directly to DOM with requestAnimationFrame.
  React.useEffect(() => {
    if (!isDesktop) {
      if (backgroundRef.current) {
        backgroundRef.current.style.transform = "translate3d(0, 0, 0)"
      }
      return
    }

    const applyParallax = () => {
      frameRef.current = null

      const hero = heroRef.current
      const background = backgroundRef.current
      if (!hero || !background) return

      const rect = hero.getBoundingClientRect()
      const scrollPosition = window.scrollY
      const elementTop = rect.top + scrollPosition
      const elementHeight = rect.height

      // Skip work when the section is fully outside viewport.
      const isOutOfView =
        scrollPosition > elementTop + elementHeight ||
        scrollPosition + window.innerHeight < elementTop

      if (!isOutOfView) {
        background.style.transform = `translate3d(0, ${scrollPosition * intensity}px, 0)`
      }
    }

    const onScroll = () => {
      if (frameRef.current !== null) return
      frameRef.current = window.requestAnimationFrame(applyParallax)
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()

    return () => {
      window.removeEventListener("scroll", onScroll)
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current)
      }
    }
  }, [isDesktop, intensity])

  return (
    <section ref={heroRef} className={`relative ${className}`}>
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div
          ref={backgroundRef}
          className={`absolute inset-0 ${isDesktop ? "-top-[15%] -bottom-[15%] will-change-transform" : ""}`}
        >
          <Image
            src={imageUrl}
            alt=""
            fill
            priority={priority}
            fetchPriority={priority ? "high" : "auto"}
            className="object-cover"
            style={{ objectPosition }}
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0" style={{ background: overlay }} />
      </div>

      {/* Content layer - children rendered directly for proper absolute positioning */}
      {children}
    </section>
  )
}
