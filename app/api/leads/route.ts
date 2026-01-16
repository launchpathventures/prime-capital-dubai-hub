/**
 * CATALYST - Lead Capture API
 *
 * Receives form submissions and forwards to Zapier webhook.
 * Validates data with Zod before forwarding.
 */

import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

// =============================================================================
// VALIDATION SCHEMA
// =============================================================================

const leadSchema = z.object({
  // Required fields
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  whatsapp: z.string().min(1),
  formMode: z.enum(["contact", "landing", "download"]),
  submittedAt: z.string(),
  pageUrl: z.string(),

  // Optional fields - goals
  goals: z.array(z.string()).optional(),

  // Optional fields - buyer qualification
  investTimeline: z.string().optional(),
  budget: z.string().optional(),

  // Optional fields - seller qualification
  propertyLocation: z.string().optional(),
  propertyType: z.string().optional(),
  saleTimeline: z.string().optional(),
  targetPrice: z.string().optional(),

  // Optional fields - questions
  hasQuestions: z.boolean().optional(),
  questionsText: z.string().optional(),

  // Optional fields - scheduling
  scheduledMeeting: z.boolean().optional(),

  // UTM parameters
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  utmContent: z.string().optional(),
  utmTerm: z.string().optional(),
})

type LeadData = z.infer<typeof leadSchema>

// =============================================================================
// HANDLER
// =============================================================================

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json()

    // Validate with Zod
    const result = leadSchema.safeParse(body)
    if (!result.success) {
      console.error("[Leads API] Validation error:", result.error.errors)
      return NextResponse.json(
        { error: "Invalid form data", details: result.error.errors },
        { status: 400 }
      )
    }

    const leadData: LeadData = result.data

    // Get Zapier webhook URL from environment
    const zapierWebhookUrl = process.env.ZAPIER_LEAD_WEBHOOK_URL

    if (!zapierWebhookUrl) {
      console.warn("[Leads API] ZAPIER_LEAD_WEBHOOK_URL not configured")
      // In development, just log and return success
      if (process.env.NODE_ENV === "development") {
        console.log("[Leads API] Lead data (dev mode):", JSON.stringify(leadData, null, 2))
        return NextResponse.json({ 
          success: true, 
          message: "Lead captured (dev mode - no webhook configured)" 
        })
      }
      // In production without webhook, still accept but log warning
      console.log("[Leads API] Lead data:", JSON.stringify(leadData, null, 2))
      return NextResponse.json({ 
        success: true, 
        message: "Lead captured" 
      })
    }

    // Forward to Zapier webhook
    const zapierResponse = await fetch(zapierWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...leadData,
        // Add some metadata for Zapier
        _source: "prime-capital-website",
        _timestamp: new Date().toISOString(),
      }),
    })

    if (!zapierResponse.ok) {
      console.error(
        "[Leads API] Zapier webhook error:",
        zapierResponse.status,
        await zapierResponse.text()
      )
      // Still return success to user - we don't want form failures due to webhook issues
      // The lead data is logged, so it can be recovered if needed
      console.log("[Leads API] Lead data (webhook failed):", JSON.stringify(leadData, null, 2))
    }

    return NextResponse.json({
      success: true,
      message: "Thank you for your enquiry. We'll be in touch shortly.",
    })
  } catch (error) {
    console.error("[Leads API] Error:", error)
    return NextResponse.json(
      { error: "Failed to process form submission" },
      { status: 500 }
    )
  }
}

// Reject other methods
export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 })
}
