/**
 * CATALYST - Global Error Boundary
 *
 * Catches errors in the root layout. Must have its own <html> and <body>
 * since the root layout may have crashed.
 * Uses minimal inline styling since CSS may not load.
 */

"use client"

import { useEffect } from "react"
import Link from "next/link"
import { trackComponentError } from "@/lib/error-tracking"

interface GlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    trackComponentError(error, "global-error", error.digest)
  }, [error])

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          padding: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          backgroundColor: "#f7f7f6",
          color: "#3f4142",
        }}
      >
        <div
          style={{
            maxWidth: "480px",
            padding: "48px 24px",
            textAlign: "center",
          }}
        >
          {/* Logo / Company Name */}
          <div
            style={{
              fontSize: "14px",
              fontWeight: 500,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#576c75",
              marginBottom: "32px",
            }}
          >
            Prime Capital Dubai
          </div>

          {/* Main Heading */}
          <h1
            style={{
              fontSize: "clamp(28px, 5vw, 36px)",
              fontWeight: 400,
              lineHeight: 1.2,
              margin: "0 0 16px 0",
              color: "#3f4142",
            }}
          >
            Something went wrong
          </h1>

          {/* Description */}
          <p
            style={{
              fontSize: "16px",
              fontWeight: 300,
              lineHeight: 1.6,
              color: "#576c75",
              margin: "0 0 32px 0",
            }}
          >
            We apologize for the inconvenience. Our team has been notified and
            is working to resolve this issue. Please try again or return to our
            homepage.
          </p>

          {/* Actions */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              alignItems: "center",
            }}
          >
            <button
              onClick={reset}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                height: "48px",
                padding: "0 32px",
                backgroundColor: "#576c75",
                color: "#f7f7f6",
                border: "none",
                borderRadius: "2px",
                fontSize: "11px",
                fontWeight: 400,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "background-color 0.2s",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = "#3f4142")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = "#576c75")
              }
            >
              Try Again
            </button>

            <Link
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                height: "48px",
                padding: "0 32px",
                backgroundColor: "transparent",
                color: "#576c75",
                border: "1px solid #576c75",
                borderRadius: "2px",
                fontSize: "11px",
                fontWeight: 400,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                textDecoration: "none",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "#576c75"
                e.currentTarget.style.color = "#f7f7f6"
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "transparent"
                e.currentTarget.style.color = "#576c75"
              }}
            >
              Go to Homepage
            </Link>
          </div>

          {/* Contact Information
             Note: Email is hardcoded here because global-error.tsx cannot import
             from config - it must work even when the root layout crashes. */}
          <p
            style={{
              fontSize: "13px",
              fontWeight: 300,
              color: "#576c75",
              marginTop: "40px",
            }}
          >
            If this problem persists, please contact us at{" "}
            <a
              href="mailto:admin@primecapitaldubai.com"
              style={{ color: "#576c75", textDecoration: "underline" }}
            >
              admin@primecapitaldubai.com
            </a>
          </p>
        </div>
      </body>
    </html>
  )
}
