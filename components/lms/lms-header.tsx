/**
 * CATALYST - LMS Header Component
 *
 * Fixed header for the learning portal with Prime Capital branding.
 * Solid dark background matching the design screenshots.
 */

"use client"

import Link from "next/link"
import { Row, Text } from "@/components/core"
import { Button } from "@/components/ui/button"
import { HomeIcon } from "lucide-react"

// -----------------------------------------------------------------------------
// LMSHeader Component
// -----------------------------------------------------------------------------

export function LMSHeader() {
  return (
    <header className="lms-header fixed top-0 left-0 right-0 z-50 h-14 bg-[#576C75]">
      <Row className="h-full max-w-7xl mx-auto px-4 md:px-6" align="center" justify="between">
        {/* Left: Branding */}
        <Link 
          href="/learn" 
          className="flex flex-col hover:opacity-80 transition-opacity"
        >
          <Text size="sm" weight="semibold" className="text-white leading-tight">
            Prime Capital Learning
          </Text>
          <Text size="xs" className="text-white/70 leading-tight">
            Real Estate Consultant Training
          </Text>
        </Link>

        {/* Right: Hub Button */}
        <Button 
          variant="outline"
          size="sm"
          nativeButton={false}
          render={<Link href="/" />}
          className="bg-transparent border-white/30 text-white hover:bg-white/10 hover:text-white gap-2 rounded-[2px]"
        >
          <HomeIcon className="h-4 w-4" />
          HUB
        </Button>
      </Row>
    </header>
  )
}
