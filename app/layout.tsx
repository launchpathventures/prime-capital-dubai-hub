/**
 * CATALYST - Root Layout
 *
 * The root layout that wraps all pages.
 * Handles: fonts, global CSS, and base HTML structure.
 *
 * Note: Page-specific shells are colocated with each route group:
 * - (web): Public/marketing pages → WebShell
 * - (app): Authenticated pages → AppShell
 * - (docs): Documentation pages → DocsShell
 * - (present): Presentations → SlidesShell
 */

import type { Metadata } from "next"
import { Playfair_Display } from "next/font/google"
import "./globals.css"
import "@/design/animate.css"
import "@/design/helpers.css"
import "@/design/print.css"
import "@/design/shared.css"
import { config } from "@/lib/config"
import { JsonLd, organizationJsonLd, websiteJsonLd } from "@/lib/json-ld"
import { SpeedInsights } from "@vercel/speed-insights/next"

// -----------------------------------------------------------------------------
// Fonts — loaded via next/font for consistent cross-platform rendering
// -----------------------------------------------------------------------------

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-headline",
})

// -----------------------------------------------------------------------------
// Metadata
// -----------------------------------------------------------------------------

export const metadata: Metadata = {
  title: {
    default: config.app.name,
    template: `%s | ${config.app.name}`,
  },
  description: config.app.description,
  metadataBase: new URL(config.app.url),
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml", sizes: "any" }],
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: config.app.name,
    description: config.app.description,
    url: config.app.url,
    siteName: config.app.name,
    type: "website",
    images: [
      {
        url: "/images/hero/home-hero.jpg",
        width: 1200,
        height: 630,
        alt: config.app.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: config.app.name,
    description: config.app.description,
    images: ["/images/hero/home-hero.jpg"],
  },
}

// -----------------------------------------------------------------------------
// Root Layout
// -----------------------------------------------------------------------------

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={playfair.variable} suppressHydrationWarning>
      <body className="antialiased">
        {children}
        <SpeedInsights />
        <JsonLd data={organizationJsonLd()} />
        <JsonLd data={websiteJsonLd()} />
      </body>
    </html>
  )
}
