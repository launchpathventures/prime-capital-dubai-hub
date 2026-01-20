/**
 * CATALYST - Lead Capture API
 *
 * Receives form submissions and forwards to Zapier webhook.
 * Validates data with Zod before forwarding.
 * Maps form values to Bitrix24 codes for CRM integration.
 */

import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

// =============================================================================
// BITRIX24 CODE MAPPINGS
// =============================================================================

const BITRIX_GOAL_CODES: Record<string, number> = {
  "invest-offplan": 48694,
  "buy-ready": 48696,
  "sell": 48698,
  "build": 48700,
  "build-wealth": 48702,
  "advice-only": 48704,
}

const BITRIX_GOAL_LABELS: Record<string, string> = {
  "invest-offplan": "Invest in off-plan property",
  "buy-ready": "Buy a move-in-ready property",
  "sell": "Sell a property",
  "build": "Build a property",
  "build-wealth": "Build wealth through the property market",
  "advice-only": "I am only seeking advice at this stage",
}

const BITRIX_TIMELINE_CODES: Record<string, number> = {
  "now": 13176,
  "immediate": 13178,
  "short-term": 13180,
  "mid-term": 49814,
  "long-term": 49816,
  "undecided": 13182,
}

const BITRIX_TIMELINE_LABELS: Record<string, string> = {
  "now": "Now: within a month",
  "immediate": "Immediate: within the next 3 months",
  "short-term": "Short-term: within the next 3-6 months",
  "mid-term": "Mid-term: within the next 6-12 months",
  "long-term": "Long-term: within the next 1-2 years",
  "undecided": "Undecided",
}

const BITRIX_BUDGET_CODES: Record<string, number> = {
  "under-1m": 49694,
  "1m-3m": 49696,
  "3m-6m": 49698,
  "6m-10m": 49700,
  "10m-15m": 49702,
  "15m-20m": 49704,
  "20m-50m": 49706,
  "50m-plus": 49708,
}

const BITRIX_BUDGET_LABELS: Record<string, string> = {
  "under-1m": "Less than AED 1 million",
  "1m-3m": "AED 1-3 million",
  "3m-6m": "AED 3-6 million",
  "6m-10m": "AED 6-10 million",
  "10m-15m": "AED 10-15 million",
  "15m-20m": "AED 15-20 million",
  "20m-50m": "AED 20-50 million",
  "50m-plus": "AED 50+ million",
}

// Seller-specific codes (different from buyer codes)
const BITRIX_SALE_TIMELINE_CODES: Record<string, number> = {
  "now": 49834,
  "immediate": 49726,
  "short-term": 49728,
  "mid-term": 49730,
  "long-term": 49732,
  "undecided": 49836,
}

const BITRIX_TARGET_PRICE_CODES: Record<string, number> = {
  "under-1m": 49734,
  "1m-3m": 49736,
  "3m-6m": 49738,
  "6m-10m": 49740,
  "10m-15m": 49742,
  "15m-20m": 49744,
  "20m-50m": 49746,
  "50m-plus": 49748,
}

// =============================================================================
// FORM NAME HELPER
// =============================================================================

/**
 * Generate a descriptive form name for CRM routing.
 * Combines form mode with page context.
 */
function getFormName(formMode: string, pageUrl: string): string {
  // Extract page path from URL
  let pageName = "Unknown Page"
  try {
    const url = new URL(pageUrl)
    const path = url.pathname.replace(/^\/|\/$/g, "") // Remove leading/trailing slashes
    
    if (!path || path === "") {
      pageName = "Homepage"
    } else if (path === "contact") {
      pageName = "Contact Page"
    } else if (path.startsWith("properties/")) {
      pageName = "Property Listing"
    } else if (path === "services") {
      pageName = "Services Page"
    } else if (path === "strategy-kit") {
      pageName = "Strategy Kit"
    } else if (path === "about") {
      pageName = "About Page"
    } else {
      // Capitalize and format the path
      pageName = path.split("/")[0].replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())
    }
  } catch {
    // If URL parsing fails, just use the formMode
  }

  // Map form mode to readable name
  const modeNames: Record<string, string> = {
    "contact": "Contact Form",
    "landing": "Quick Enquiry",
    "download": "Download Request",
  }

  const modeName = modeNames[formMode] || formMode

  return `${modeName} - ${pageName}`
}

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

  // Optional fields - scheduling (Calendly)
  scheduledMeeting: z.boolean().optional(),
  calendlyEventId: z.string().optional(),
  calendlyInviteeId: z.string().optional(),

  // URL parameters
  source: z.string().optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  utmContent: z.string().optional(),
  utmTerm: z.string().optional(),
  manychat: z.string().optional(),
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
    // Transform data to include Bitrix24 codes and labels
    const bitrixPayload = {
      // Original data (for reference/debugging)
      ...leadData,
      
      // Goals - labels and codes
      goalsLabels: leadData.goals?.map(g => BITRIX_GOAL_LABELS[g]).filter(Boolean) || [],
      goalCodes: leadData.goals?.map(g => BITRIX_GOAL_CODES[g]).filter(Boolean) || [],
      
      // Timeline - labels and codes
      investTimelineLabel: leadData.investTimeline ? BITRIX_TIMELINE_LABELS[leadData.investTimeline] : null,
      timelineCode: leadData.investTimeline ? BITRIX_TIMELINE_CODES[leadData.investTimeline] : null,
      
      // Budget - labels and codes
      budgetLabel: leadData.budget ? BITRIX_BUDGET_LABELS[leadData.budget] : null,
      budgetCode: leadData.budget ? BITRIX_BUDGET_CODES[leadData.budget] : null,
      
      // Sale timeline (sellers) - labels and codes (uses seller-specific codes)
      saleTimelineLabel: leadData.saleTimeline ? BITRIX_TIMELINE_LABELS[leadData.saleTimeline] : null,
      saleTimelineCode: leadData.saleTimeline ? BITRIX_SALE_TIMELINE_CODES[leadData.saleTimeline] : null,
      
      // Target price (sellers) - labels and codes (uses seller-specific codes)
      targetPriceLabel: leadData.targetPrice ? BITRIX_BUDGET_LABELS[leadData.targetPrice] : null,
      targetPriceCode: leadData.targetPrice ? BITRIX_TARGET_PRICE_CODES[leadData.targetPrice] : null,
      
      // Calendly booking status
      bookedWithTahir: leadData.scheduledMeeting ? "Yes" : "No",
      
      // Form identification for CRM routing
      formName: getFormName(leadData.formMode, leadData.pageUrl),
      
      // Metadata for Zapier
      _source: "prime-capital-website",
      _timestamp: new Date().toISOString(),
    }

    const zapierResponse = await fetch(zapierWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bitrixPayload),
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
