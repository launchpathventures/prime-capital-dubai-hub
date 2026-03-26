/**
 * CATALYST - Certificate Card
 *
 * Displays an issued certificate with download and share actions.
 * Used on the learner certification page.
 */

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  AwardIcon,
  DownloadIcon,
  LinkIcon,
  CheckIcon,
} from "lucide-react"
import type { CertificateWithProfile } from "@/lib/learning-types"

interface CertificateCardProps {
  certificate: CertificateWithProfile
  appUrl: string
}

export function CertificateCard({ certificate, appUrl }: CertificateCardProps) {
  const [copied, setCopied] = useState(false)

  const formattedDate = new Date(certificate.issuedAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  const publicUrl = `${appUrl}/certificate/${certificate.certificateId}`
  const pdfUrl = `/api/certificate/${certificate.certificateId}/pdf`

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(publicUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Silent fallback
    }
  }

  return (
    <div className="cert-card">
      <div className="cert-card__badge">
        <AwardIcon className="h-8 w-8" />
      </div>
      <div className="cert-card__content">
        <h2 className="cert-card__title">Certificate of Completion</h2>
        <p className="cert-card__course">{certificate.courseName}</p>
        <div className="cert-card__meta">
          <span>Issued {formattedDate}</span>
          <span className="cert-card__dot">·</span>
          <span>{certificate.certificateId}</span>
        </div>
        <p className="cert-card__stats">
          {certificate.modulesCompleted} modules · {certificate.quizzesPassed} quizzes passed
        </p>
      </div>
      <div className="cert-card__actions">
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
              Share Link
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
