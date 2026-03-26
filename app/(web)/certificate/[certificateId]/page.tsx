/**
 * CATALYST - Public Certificate Page
 *
 * Shareable, public-facing certificate view.
 * No authentication required — anyone with the URL can view.
 */

import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { config } from "@/lib/config"
import { getCertificateByPublicId } from "@/lib/lms/certificate-queries"
import { CertificateView } from "./certificate-view"

// =============================================================================
// Metadata
// =============================================================================

export async function generateMetadata({
  params,
}: {
  params: Promise<{ certificateId: string }>
}): Promise<Metadata> {
  const { certificateId } = await params
  const certificate = await getCertificateByPublicId(certificateId)

  if (!certificate || certificate.revokedAt) {
    return { title: "Certificate Not Found" }
  }

  return {
    title: `Certificate of Completion — ${certificate.fullName} | ${config.app.name}`,
    description: `${certificate.fullName} has completed the ${certificate.courseName}.`,
    openGraph: {
      title: `Certificate of Completion — ${certificate.fullName}`,
      description: `${certificate.fullName} has completed the ${certificate.courseName} with ${config.app.name}.`,
      type: "website",
    },
  }
}

// =============================================================================
// Page Component
// =============================================================================

export default async function PublicCertificatePage({
  params,
}: {
  params: Promise<{ certificateId: string }>
}) {
  const { certificateId } = await params
  const certificate = await getCertificateByPublicId(certificateId)

  if (!certificate) {
    notFound()
  }

  if (certificate.revokedAt) {
    return (
      <div className="cert-public">
        <div className="cert-public__revoked">
          <h1>Certificate Revoked</h1>
          <p>This certificate is no longer valid.</p>
        </div>
      </div>
    )
  }

  const formattedDate = new Date(certificate.issuedAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  const pdfUrl = `/api/certificate/${certificate.certificateId}/pdf`

  return (
    <div className="cert-public">
      {/* On-screen certificate */}
      <div className="cert-public__card">
        <div className="cert-public__border">
          <div className="cert-public__inner">
            <div className="cert-public__company">Prime Capital Dubai</div>
            <div className="cert-public__divider" />
            <h1 className="cert-public__title">Certificate of Completion</h1>
            <p className="cert-public__subtitle">Training Programme</p>
            <p className="cert-public__preamble">This is to certify that</p>
            <h2 className="cert-public__name">{certificate.fullName}</h2>
            <div className="cert-public__name-divider" />
            <p className="cert-public__course">
              has successfully completed the {certificate.courseName}
            </p>
            <p className="cert-public__stats">
              {certificate.modulesCompleted} modules completed · {certificate.quizzesPassed} quizzes passed
            </p>
            <div className="cert-public__date">
              <span className="cert-public__date-label">Date of Completion</span>
              <span className="cert-public__date-value">{formattedDate}</span>
            </div>
            <div className="cert-public__divider" />
            <div className="cert-public__footer">
              <span className="cert-public__footer-company">PRIME CAPITAL DUBAI</span>
              <span className="cert-public__id">{certificate.certificateId}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <CertificateView
        pdfUrl={pdfUrl}
        certificateUrl={`${config.app.url}/certificate/${certificate.certificateId}`}
      />
    </div>
  )
}
