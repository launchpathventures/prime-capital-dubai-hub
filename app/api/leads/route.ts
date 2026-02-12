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
// RATE LIMITING
// =============================================================================

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000 // 15 minutes
const RATE_LIMIT_MAX_REQUESTS = 5

// In-memory rate limit store: IP -> { count, windowStart }
const rateLimitStore = new Map<string, { count: number; windowStart: number }>()
let requestCount = 0

/**
 * Clean up expired rate limit entries every 100 requests.
 */
function cleanupRateLimitStore() {
  requestCount++
  if (requestCount % 100 === 0) {
    const now = Date.now()
    for (const [ip, data] of rateLimitStore.entries()) {
      if (now - data.windowStart > RATE_LIMIT_WINDOW_MS) {
        rateLimitStore.delete(ip)
      }
    }
  }
}

/**
 * Check if the IP is rate limited.
 * Returns { limited: false } if allowed, or { limited: true, retryAfter } if blocked.
 */
function checkRateLimit(ip: string): { limited: boolean; retryAfter?: number } {
  cleanupRateLimitStore()

  const now = Date.now()
  const entry = rateLimitStore.get(ip)

  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    // New window
    rateLimitStore.set(ip, { count: 1, windowStart: now })
    return { limited: false }
  }

  if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
    // Rate limited
    const retryAfter = Math.ceil((entry.windowStart + RATE_LIMIT_WINDOW_MS - now) / 1000)
    return { limited: true, retryAfter }
  }

  // Increment count
  entry.count++
  return { limited: false }
}

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

// Private mode labels (for CRM readability)
const PRIVATE_ROLE_LABELS: Record<string, string> = {
  "investor": "Direct Investor",
  "advisor": "Advisor / Intermediary",
  "family-office": "Family Office",
}

const DEPLOYMENT_RANGE_LABELS: Record<string, string> = {
  "5m-10m": "AED 5–10 million",
  "10m-20m": "AED 10–20 million",
  "20m-50m": "AED 20–50 million",
  "50m-plus": "AED 50+ million",
}

const PREFERRED_CONTACT_LABELS: Record<string, string> = {
  "phone": "Phone Call",
  "email": "Email",
  "whatsapp": "WhatsApp",
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
    } else if (path === "private") {
      pageName = "Private Channel"
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
    "private": "Private Enquiry",
  }

  const modeName = modeNames[formMode] || formMode

  return `${modeName} - ${pageName}`
}

// =============================================================================
// VALIDATION SCHEMA
// =============================================================================

const leadSchema = z.object({
  // Required fields with length limits
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().email().max(100),
  whatsapp: z.string().min(1).max(20),
  formMode: z.enum(["contact", "landing", "download", "private"]),
  submittedAt: z.string(),
  pageUrl: z.string().max(500),

  // Optional fields - goals
  goals: z.array(z.string().max(100)).optional(),

  // Optional fields - buyer qualification
  investTimeline: z.string().max(100).optional(),
  budget: z.string().max(100).optional(),

  // Optional fields - seller qualification
  propertyLocation: z.string().max(500).optional(),
  propertyType: z.string().max(100).optional(),
  saleTimeline: z.string().max(100).optional(),
  targetPrice: z.string().max(100).optional(),

  // Optional fields - questions
  hasQuestions: z.boolean().optional(),
  questionsText: z.string().max(500).optional(),

  // Optional fields - private mode
  privateRole: z.string().max(100).optional(),
  deploymentRange: z.string().max(100).optional(),
  preferredContact: z.string().max(100).optional(),
  privateContext: z.string().max(500).optional(),

  // Context from referring pages
  referringProperty: z.string().max(500).optional(),
  referringTeamMember: z.string().max(100).optional(),
  referringTeamMemberEmail: z.string().max(100).optional(),

  // URL parameters
  source: z.string().max(100).optional(),
  utmSource: z.string().max(100).optional(),
  utmMedium: z.string().max(100).optional(),
  utmCampaign: z.string().max(100).optional(),
  utmContent: z.string().max(100).optional(),
  utmTerm: z.string().max(100).optional(),
  manychat: z.string().max(100).optional(),

  // Honeypot field for bot protection
  website: z.string().max(500).optional(),
})

type LeadData = z.infer<typeof leadSchema>

// =============================================================================
// HANDLER
// =============================================================================

export async function POST(request: NextRequest) {
  try {
    // Rate limiting - get IP from headers or fallback
    const forwardedFor = request.headers.get("x-forwarded-for")
    const ip = forwardedFor?.split(",")[0]?.trim() || "unknown"

    const rateLimitResult = checkRateLimit(ip)
    if (rateLimitResult.limited) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimitResult.retryAfter),
          },
        }
      )
    }

    // Parse request body
    const body = await request.json()

    // Honeypot check - bots will fill in this hidden field
    if (body.website) {
      // Bot detected - silently accept to avoid revealing the trap
      return NextResponse.json({ success: true })
    }

    // Validate with Zod
    const result = leadSchema.safeParse(body)
    if (!result.success) {
      // Log detailed error server-side only
      console.error("[Leads API] Validation error:", result.error.errors)
      // Return generic message to client
      return NextResponse.json(
        { error: "Please check your form and try again." },
        { status: 400 }
      )
    }

    const leadData: LeadData = result.data
    const referenceId = Date.now()

    // Get Zapier webhook URL from environment
    const zapierWebhookUrl = process.env.ZAPIER_LEAD_WEBHOOK_URL

    if (!zapierWebhookUrl) {
      console.warn("[Leads API] ZAPIER_LEAD_WEBHOOK_URL not configured")
      // Log reference ID and mode only, not PII
      console.log(`[Leads API] Lead received (no webhook): mode=${leadData.formMode}, ref=${referenceId}`)
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
      
      // Context from referring pages (for CRM routing)
      propertyInterest: leadData.referringProperty || null,
      assignToTeamMember: leadData.referringTeamMember || null,
      teamMemberEmail: leadData.referringTeamMemberEmail || null,
      
      // Private mode fields
      privateRole: leadData.privateRole || null,
      privateRoleLabel: PRIVATE_ROLE_LABELS[leadData.privateRole || ""] || null,
      deploymentRange: leadData.deploymentRange || null,
      deploymentRangeLabel: DEPLOYMENT_RANGE_LABELS[leadData.deploymentRange || ""] || null,
      preferredContact: leadData.preferredContact || null,
      preferredContactLabel: PREFERRED_CONTACT_LABELS[leadData.preferredContact || ""] || null,
      privateContext: leadData.privateContext || null,
      
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
      // Log reference ID and mode only, not PII
      console.log(`[Leads API] Lead received (webhook failed): mode=${leadData.formMode}, ref=${referenceId}`)
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
