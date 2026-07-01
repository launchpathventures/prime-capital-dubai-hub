/**
 * CATALYST - Certificate PDF Generation
 *
 * Generates a branded PDF completion certificate.
 * Uses @react-pdf/renderer for server-side PDF generation.
 */

import { NextRequest, NextResponse } from "next/server"
import React from "react"
import {
  Document,
  Page,
  Text,
  View,
  Svg,
  Path,
  StyleSheet,
  renderToBuffer,
} from "@react-pdf/renderer"
import { getCertificateByPublicId } from "@/lib/lms/certificate-queries"
import { config } from "@/lib/config"

// =============================================================================
// Font Registration
// =============================================================================

// Use built-in fonts for reliability — Helvetica for body, Times for serif headings
// @react-pdf/renderer includes these by default

// =============================================================================
// Styles
// =============================================================================

const SPRUCE = "#576C75"
const ASH = "#3F4142"
const SERENITY = "#A6B5B0"
const LOGO_MARK_PATH = "M55.45,11.29c-3.44-2.54-8.34-3.81-14.69-3.81h-15.38v.66c1.03.49,1.77,1.31,2.23,2.45.46,1.15.7,2.85.7,5.09v32.96c0,2.3-.23,4-.7,5.13-.17.41-.38.77-.62,1.1h-1.86c-4.59,0-8.15-1.05-10.69-3.15-2.54-2.1-3.81-5.32-3.81-9.67,0-8.59,4.98-13.23,14.94-13.92v-.73c-1.12-.2-2.39-.29-3.81-.29-4,.05-7.4.73-10.18,2.05-2.78,1.32-4.91,3.09-6.37,5.31-1.46,2.22-2.2,4.87-2.2,7.95,0,4.54,1.72,8.08,5.16,10.62,3.44,2.54,8.34,3.81,14.69,3.81h15.19v-.66c-1.27-.59-2.08-1.56-2.42-2.93-.34-1.37-.51-2.9-.51-4.62V9.46h3.37c4.59,0,8.15,1.05,10.69,3.15,2.54,2.1,3.81,5.32,3.81,9.67,0,8.59-4.98,13.23-14.94,13.92v.73c1.12.2,2.39.29,3.81.29,4-.05,7.4-.73,10.18-2.05,2.78-1.32,4.91-3.09,6.37-5.31,1.46-2.22,2.2-4.87,2.2-7.95,0-4.54-1.72-8.08-5.16-10.62Z"

const styles = StyleSheet.create({
  page: {
    padding: "60 50",
    backgroundColor: "#FFFFFF",
    fontFamily: "Helvetica",
  },
  border: {
    position: "absolute",
    top: 20,
    left: 20,
    right: 20,
    bottom: 20,
    border: `1.5pt solid ${SERENITY}`,
  },
  innerBorder: {
    position: "absolute",
    top: 24,
    left: 24,
    right: 24,
    bottom: 24,
    border: `0.5pt solid ${SERENITY}`,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  logoMark: {
    width: 34,
    height: 34,
    marginBottom: 12,
  },
  companyName: {
    fontSize: 14,
    fontFamily: "Times-Roman",
    letterSpacing: 6,
    color: SPRUCE,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  dividerTop: {
    width: 80,
    height: 1,
    backgroundColor: SERENITY,
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontFamily: "Times-Bold",
    color: ASH,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 11,
    color: SERENITY,
    letterSpacing: 3,
    textTransform: "uppercase",
    marginBottom: 36,
  },
  preamble: {
    fontSize: 11,
    color: SPRUCE,
    marginBottom: 12,
    textAlign: "center",
  },
  learnerName: {
    fontSize: 26,
    fontFamily: "Times-Bold",
    color: ASH,
    marginBottom: 12,
    textAlign: "center",
  },
  nameDivider: {
    width: 180,
    height: 0.5,
    backgroundColor: SERENITY,
    marginBottom: 24,
  },
  courseName: {
    fontSize: 13,
    fontFamily: "Times-Roman",
    color: SPRUCE,
    marginBottom: 6,
    textAlign: "center",
  },
  stats: {
    fontSize: 10,
    color: SERENITY,
    marginBottom: 32,
    textAlign: "center",
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 40,
    marginBottom: 40,
  },
  dateLabel: {
    fontSize: 9,
    color: SERENITY,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  dateValue: {
    fontSize: 11,
    color: ASH,
  },
  dividerBottom: {
    width: 80,
    height: 1,
    backgroundColor: SERENITY,
    marginBottom: 20,
  },
  footer: {
    alignItems: "center",
  },
  footerCompany: {
    fontSize: 10,
    fontFamily: "Times-Roman",
    color: SPRUCE,
    letterSpacing: 2,
    marginBottom: 4,
  },
  certificateIdText: {
    fontSize: 8,
    color: SERENITY,
    letterSpacing: 1,
  },
})

function LogoMark() {
  return React.createElement(
    Svg,
    { viewBox: "0 0 64 64", style: styles.logoMark },
    React.createElement(Path, { d: LOGO_MARK_PATH, fill: SPRUCE })
  )
}

// =============================================================================
// PDF Document
// =============================================================================

interface CertificateDocProps {
  learnerName: string
  courseName: string
  issuedAt: string
  certificateId: string
  modulesCompleted: number
  quizzesPassed: number
}

function CertificateDocument({
  learnerName,
  courseName,
  issuedAt,
  certificateId,
  modulesCompleted,
  quizzesPassed,
}: CertificateDocProps) {
  const formattedDate = new Date(issuedAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  return React.createElement(
    Document,
    { title: `Certificate - ${learnerName}`, author: config.app.name },
    React.createElement(
      Page,
      { size: "A4", style: styles.page },
      // Double border frame
      React.createElement(View, { style: styles.border }),
      React.createElement(View, { style: styles.innerBorder }),
      // Content
      React.createElement(
        View,
        { style: styles.content },
        React.createElement(LogoMark),
        React.createElement(Text, { style: styles.companyName }, config.app.name),
        React.createElement(View, { style: styles.dividerTop }),
        React.createElement(Text, { style: styles.title }, "Certificate of Completion"),
        React.createElement(Text, { style: styles.subtitle }, "Training Programme"),
        React.createElement(Text, { style: styles.preamble }, "This is to certify that"),
        React.createElement(Text, { style: styles.learnerName }, learnerName),
        React.createElement(View, { style: styles.nameDivider }),
        React.createElement(
          Text,
          { style: styles.courseName },
          `has successfully completed the ${courseName}`
        ),
        React.createElement(
          Text,
          { style: styles.stats },
          `${modulesCompleted} modules completed · ${quizzesPassed} quizzes passed`
        ),
        React.createElement(
          View,
          { style: styles.dateRow },
          React.createElement(
            View,
            { style: { alignItems: "center" as const } },
            React.createElement(Text, { style: styles.dateLabel }, "Date of Completion"),
            React.createElement(Text, { style: styles.dateValue }, formattedDate)
          )
        ),
        React.createElement(View, { style: styles.dividerBottom }),
        React.createElement(
          View,
          { style: styles.footer },
          React.createElement(Text, { style: styles.footerCompany }, config.app.name.toUpperCase()),
          React.createElement(Text, { style: styles.certificateIdText }, certificateId)
        )
      )
    )
  )
}

// =============================================================================
// Route Handler
// =============================================================================

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ certificateId: string }> }
) {
  const { certificateId } = await params

  const certificate = await getCertificateByPublicId(certificateId)

  if (!certificate || certificate.revokedAt) {
    return NextResponse.json({ error: "Certificate not found" }, { status: 404 })
  }

  const doc = CertificateDocument({
    learnerName: certificate.fullName,
    courseName: certificate.courseName,
    issuedAt: certificate.issuedAt,
    certificateId: certificate.certificateId,
    modulesCompleted: certificate.modulesCompleted,
    quizzesPassed: certificate.quizzesPassed,
  })

  const buffer = await renderToBuffer(doc)
  const uint8 = new Uint8Array(buffer)

  return new NextResponse(uint8, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${certificate.certificateId}.pdf"`,
      "Cache-Control": "public, max-age=3600",
    },
  })
}
