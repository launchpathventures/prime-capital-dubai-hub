/**
 * CATALYST - Tahir Navigation
 *
 * Sticky top nav for the Tahir brand surface. Wordmark left, link cluster
 * right, single primary CTA. A hamburger panel takes over below 768px so
 * every link stays reachable on mobile. Hairline appears under the bar
 * once scrolled.
 */

"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { brands } from "@/lib/brand"

const navItems = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/videos", label: "Videos" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/faqs", label: "FAQs" },
  { href: "/strategy-kit", label: "Strategy Kit" },
  { href: "/contact", label: "Contact" },
] as const

const TAHIR_PREFIX = "/tahir"
const tahir = brands.tahir

interface TahirNavProps {
  scrolled?: boolean
}

export function TahirNav({ scrolled = false }: TahirNavProps) {
  const [open, setOpen] = React.useState(false)
  const pathname = usePathname() || ""

  // Detect whether we're being served via the /tahir subdirectory
  // (local dev / preview) vs. the production hostname rewrite. On the
  // hostname, pathname is the clean /about; under the subdirectory it's
  // /tahir/about and links must keep the prefix to avoid jumping into
  // the Prime Capital surface.
  const inSubdirectory =
    pathname === TAHIR_PREFIX || pathname.startsWith(`${TAHIR_PREFIX}/`)
  const buildHref = (path: string) =>
    inSubdirectory ? `${TAHIR_PREFIX}${path === "/" ? "" : path}` : path
  const homeHref = inSubdirectory ? TAHIR_PREFIX : "/"

  // Close the panel on Escape, lock body scroll while it's open.
  React.useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("keydown", onKey)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  const closePanel = () => setOpen(false)

  return (
    <nav className="tahir-nav" data-scrolled={scrolled}>
      <div className="tahir-container tahir-nav__inner">
        <Link
          href={homeHref}
          className="tahir-nav__wordmark"
          aria-label="Tahir Majithia — home"
          onClick={closePanel}
        >
          <Image
            src={tahir.assets.logo}
            alt="Tahir Majithia"
            width={150}
            height={42}
            priority
            className="tahir-nav__logo"
          />
        </Link>

        <div className="tahir-nav__links">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={buildHref(item.href)}
              className="tahir-nav__link"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <Link
          href={buildHref("/consultation")}
          className="tahir-btn tahir-btn--primary tahir-nav__cta"
        >
          Book a call
        </Link>

        <button
          type="button"
          className="tahir-nav__toggle"
          aria-expanded={open}
          aria-controls="tahir-nav-panel"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} aria-hidden /> : <Menu size={22} aria-hidden />}
        </button>
      </div>

      <div
        id="tahir-nav-panel"
        className="tahir-nav__panel"
        data-open={open}
        aria-hidden={!open}
      >
        <div className="tahir-container tahir-nav__panel-inner">
          <ul className="tahir-nav__panel-list">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={buildHref(item.href)}
                  className="tahir-nav__panel-link"
                  onClick={closePanel}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href={buildHref("/consultation")}
            className="tahir-btn tahir-btn--primary tahir-nav__panel-cta"
            onClick={closePanel}
          >
            Book a call
          </Link>
        </div>
      </div>
    </nav>
  )
}
