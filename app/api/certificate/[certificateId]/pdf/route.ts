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
