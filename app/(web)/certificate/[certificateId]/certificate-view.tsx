/**
 * CATALYST - Certificate View Actions
 *
 * Client component for download and share buttons on the public certificate page.
 */

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DownloadIcon, LinkIcon, CheckIcon } from "lucide-react"

interface CertificateViewProps {
  pdfUrl: string
  certificateUrl: string
}

export function CertificateView({ pdfUrl, certificateUrl }: CertificateViewProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(certificateUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers
      const input = document.createElement("input")
      input.value = certificateUrl
      document.body.appendChild(input)
      input.select()
      document.execCommand("copy")
      document.body.removeChild(input)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="cert-public__actions">
      <Button
        render={<a href={pdfUrl} target="_blank" rel="noopener noreferrer" />}
      >
        <DownloadIcon className="h-4 w-4 mr-2" />
        Download PDF
      </Button>
      <Button variant="outline" onClick={handleCopyLink}>
        {copied ? (
          <>
            <CheckIcon className="h-4 w-4 mr-2" />
            Copied!
          </>
        ) : (
          <>
            <LinkIcon className="h-4 w-4 mr-2" />
            Copy Link
          </>
        )}
      </Button>
    </div>
  )
}
