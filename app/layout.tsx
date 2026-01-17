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
import { Geist, Geist_Mono, Inter } from "next/font/google"
import "./globals.css"
import "@/design/animate.css"
import "@/design/helpers.css"
import "@/design/print.css"
import "@/design/shared.css"
import { config } from "@/lib/config"
import { ToastProvider } from "@/components/ui/toast"
import { UrlToast } from "@/components/shared/url-toast"
import { ThemeProvider } from "@/components/shared/theme-provider"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"

// -----------------------------------------------------------------------------
// Fonts
// -----------------------------------------------------------------------------

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
  openGraph: {
    title: config.app.name,
    description: config.app.description,
    url: config.app.url,
    siteName: config.app.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: config.app.name,
    description: config.app.description,
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
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <ToastProvider>
            {children}
            <Suspense fallback={null}>
              <UrlToast />
            </Suspense>
          </ToastProvider>
          <Analytics debug={process.env.NODE_ENV === "development"} />
        </ThemeProvider>
      </body>
    </html>
  )
}
