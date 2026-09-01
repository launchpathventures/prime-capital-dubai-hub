/**
 * CATALYST - Framework Browser Actions
 */

"use client"

import { PrinterIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

export function FrameworkPrintButton() {
  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      className="lead-magnet-print print-hidden"
      onClick={() => window.print()}
    >
      <PrinterIcon aria-hidden="true" />
      Print or save as PDF
    </Button>
  )
}

