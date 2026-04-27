/**
 * CATALYST - Lead Capture API
 *
 * Receives form submissions and forwards to Zapier webhook.
 * Validates data with Zod before forwarding.
 * Maps form values to Bitrix24 codes for CRM integration.
 */

import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { randomUUID } from "node:crypto"
import { getWebPropertyBySlug } from "@/lib/content"
import type { Property } from "@/lib/content-types"

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

// Bitrix maps are keyed on the AgentCRM canonical enum values. Codes
// preserved from prior Zapier→Bitrix24 wiring; labels reworded to match
// CRM-canonical values so Zapier downstream stays consistent.

const BITRIX_GOAL_CODES: Record<string, number> = {
  "invest-offplan": 48694,
  "buy-ready": 48696,
  "sell": 48698,
  "build-wealth": 48702,
  "golden-visa": 48700, // re-uses the slot vacated by the dropped "build" goal
  "advice-only": 48704,
}

const BITRIX_GOAL_LABELS: Record<string, string> = {
  "invest-offplan": "Invest in off-plan property",
  "buy-ready": "Buy a move-in-ready property",
  "sell": "Sell a property",
  "build-wealth": "Build wealth through the property market",
  "golden-visa": "Secure a Golden Visa through property",
  "advice-only": "I am only seeking advice at this stage",
}

// Buyer timeline. Bitrix codes preserved from the closest equivalent of
// the legacy enum; 24_plus_months is new and re-uses 49816.
const BITRIX_TIMELINE_CODES: Record<string, number> = {
  "immediate": 13178,
  "3_6_months": 13180,
  "6_12_months": 49814,
  "12_24_months": 49816,
  "24_plus_months": 49816,
  "flexible": 13182,
}

const BITRIX_TIMELINE_LABELS: Record<string, string> = {
  "immediate": "Immediate (next 3 months)",
  "3_6_months": "3-6 months",
  "6_12_months": "6-12 months",
  "12_24_months": "1-2 years",
  "24_plus_months": "2+ years",
  "flexible": "Flexible / Undecided",
}

const BITRIX_BUDGET_CODES: Record<string, number> = {
  "under-1m": 49694,
  "1m-3m": 49696,
  "3m-5m": 49698,
  "5m-10m": 49700,
  "10m-20m": 49702,
  "50m-plus": 49708,
}

const BITRIX_BUDGET_LABELS: Record<string, string> = {
  "under-1m": "Less than AED 1 million",
  "1m-3m": "AED 1-3 million",
  "3m-5m": "AED 3-5 million",
  "5m-10m": "AED 5-10 million",
  "10m-20m": "AED 10-20 million",
  "50m-plus": "AED 50+ million",
}

// Numeric AED bounds (millions × 1_000_000). Sent alongside the code so
// CRM-side numeric filters can match without parsing the slug.
const BUDGET_MIN_AED: Record<string, number> = {
  "under-1m": 0,
  "1m-3m": 1_000_000,
  "3m-5m": 3_000_000,
  "5m-10m": 5_000_000,
  "10m-20m": 10_000_000,
  "50m-plus": 50_000_000,
}

const BUDGET_MAX_AED: Record<string, number | null> = {
  "under-1m": 1_000_000,
  "1m-3m": 3_000_000,
  "3m-5m": 5_000_000,
  "5m-10m": 10_000_000,
  "10m-20m": 20_000_000,
  "50m-plus": null,
}

// Seller-specific codes (different from buyer codes)
const BITRIX_SALE_TIMELINE_CODES: Record<string, number> = {
  "immediate": 49726,
  "3_6_months": 49728,
  "6_12_months": 49730,
  "12_24_months": 49732,
  "24_plus_months": 49732,
  "flexible": 49836,
}

const BITRIX_TARGET_PRICE_CODES: Record<string, number> = {
  "under-1m": 49734,
  "1m-3m": 49736,
  "3m-5m": 49738,
  "5m-10m": 49740,
  "10m-20m": 49742,
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
  "50m-plus": "AED 50+ million",
}

const PREFERRED_CONTACT_LABELS: Record<string, string> = {
  "phone": "Phone Call",
  "email": "Email",
  "whatsapp": "WhatsApp",
}

// Property enquiry labels (for CRM readability)
const ENQUIRY_INTENT_LABELS: Record<string, string> = {
  "pricing": "Pricing & payment plans",
  "investment-analysis": "Investment analysis / ROI",
  "compare": "Compare with similar properties",
  "availability": "Check unit availability",
  "developer-info": "Understand the developer",
}

const PROPERTY_APPEAL_LABELS: Record<string, string> = {
  "location": "Location",
  "price-point": "Price point",
  "lifestyle": "Lifestyle fit",
  "payment-plan": "Payment plan flexibility",
  "rental-yield": "Rental yield potential",
  "developer": "Developer reputation",
  "completion-timeline": "Completion timeline",
  "distressed-pricing": "Below-market pricing",
}

// =============================================================================
// TEAM MEMBER EMAIL RESOLUTION
// =============================================================================

/**
 * Canonical map of team-member slugs → Prime Capital Google Workspace addresses.
 * Source of truth: Prime's Google admin export (April 2026).
 *
 * Used when the URL param `teamMemberEmail` is absent (older inbound links,
 * stale CMS records). Slug → email is preferred over slug → derived because
 * a few addresses don't follow the simple <firstname>@ pattern (gina, laksh,
 * wajahat, ayshaakhtar, content).
 */
const KNOWN_AGENT_EMAILS: Record<string, string> = {
  "aghil-ahmadnia": "aqeel@primecapitaldubai.com",
  "ahmed-ashfaq": "ahmed@primecapitaldubai.com",
  "ana-grace-pascual": "ana@primecapitaldubai.com",
  "anisha-mehrotra": "anisha@primecapitaldubai.com",
  "arman-kabir": "arman@primecapitaldubai.com",
  "aysha-sana": "aysha@primecapitaldubai.com",
  "aysha-akhtar-ali": "ayshaakhtar@primecapitaldubai.com",
  "bianca-ferrao": "bianca@primecapitaldubai.com",
  "danyel-barnswell": "danyel@primecapitaldubai.com",
  "divneet-sadana": "gina@primecapitaldubai.com",
  "hamzah-khaleeli": "hamzah@primecapitaldubai.com",
  "harshini-shetty": "harshini@primecapitaldubai.com",
  "ismat-sultana": "ismat@primecapitaldubai.com",
  "ivana-dabeskovic": "ivana@primecapitaldubai.com",
  "jiezelle-clemente": "jiezelle@primecapitaldubai.com",
  "khaseibah-alyammahi": "khaseibah@primecapitaldubai.com",
  "kyle-lopez": "kyle@primecapitaldubai.com",
  "kyle-lopes": "kyle@primecapitaldubai.com",
  "lakshay-mehta": "laksh@primecapitaldubai.com",
  "laveena-nambiar": "laveena@primecapitaldubai.com",
  "mohib-malgi": "mohib@primecapitaldubai.com",
  "monica-garcia": "monica@primecapitaldubai.com",
  "muhammad-wajahat": "wajahat@primecapitaldubai.com",
  "mujibunnissa-sattar": "mujibunnissa@primecapitaldubai.com",
  "parisa-lakhu": "parisa@primecapitaldubai.com",
  "rabir-saluja": "rabir@primecapitaldubai.com",
  "rafik-sacranie": "rafik@primecapitaldubai.com",
  "raghav-passan": "raghav@primecapitaldubai.com",
  "rakshima-mehra": "rakshima@primecapitaldubai.com",
  "rishabh-arora": "rishabh@primecapitaldubai.com",
  "riyam-al-mayyahi": "riyam@primecapitaldubai.com",
  "riyam-almayyahi": "riyam@primecapitaldubai.com",
  "rohit-saluja": "rohit@primecapitaldubai.com",
  "ruhaan-chawla": "ruhaan@primecapitaldubai.com",
  "shaad-haji": "shaad@primecapitaldubai.com",
  "silvia-fernandes": "silvia@primecapitaldubai.com",
  "sourav-umesh-lakhyani": "sourav@primecapitaldubai.com",
  "subha-arora": "subha@primecapitaldubai.com",
  "svitlana-tereshchenko": "svitlana@primecapitaldubai.com",
  "syed-faisal-saeed": "content@primecapitaldubai.com",
  "tahir-majithia": "tahir@primecapitaldubai.com",
  "tahir-majitia": "tahir@primecapitaldubai.com", // legacy slug typo
  "virna-trinidad": "virna@primecapitaldubai.com",
  "zorica-dimitrijievic": "zorica@primecapitaldubai.com",
}

const PRIME_EMAIL_REGEX = /^[a-z0-9._-]+@primecapitaldubai\.com$/i

/**
 * Resolve the agent email used for CRM auto-assignment.
 * Order of precedence:
 *   1. Trust the URL param if it's a valid Prime domain address.
 *   2. Look up the slug in our canonical map.
 *   3. Derive `<first-segment-of-slug>@primecapitaldubai.com` as a last resort.
 * Returns null if we can't determine an address.
 */
function resolveTeamMemberEmail(
  slug: string | undefined,
  emailFromUrl: string | undefined,
): string | null {
  if (emailFromUrl && PRIME_EMAIL_REGEX.test(emailFromUrl.trim())) {
    return emailFromUrl.trim().toLowerCase()
  }
  if (!slug) return null
  const normalised = slug.trim().toLowerCase()
  if (KNOWN_AGENT_EMAILS[normalised]) return KNOWN_AGENT_EMAILS[normalised]
  const firstName = normalised.split("-")[0]
  if (!firstName || !/^[a-z]+$/.test(firstName)) return null
  return `${firstName}@primecapitaldubai.com`
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
    } else if (path.startsWith("live/")) {
      pageName = "Livestream"
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
    "property-enquiry": "Property Enquiry",
    "newsletter": "Newsletter Signup",
    "event": "Event Registration",
  }

  const modeName = modeNames[formMode] || formMode

  return `${modeName} - ${pageName}`
}

// =============================================================================
// DERIVATION HELPERS
// =============================================================================

/**
 * AgentCRM doesn't recognise "event" as a formMode — events are filed as
 * `contact` with the event name in formName + leadMagnet. Everything else
 * passes through unchanged.
 */
function mapFormModeForCrm(mode: string): string {
  return mode === "event" ? "contact" : mode
}

/**
 * Pipeline router for the CRM:
 *   - vendor: someone selling property (goals includes "sell" OR landing
 *     page with seller intent set the visitorType already)
 *   - agent: someone applying to be an introducer/agent (set explicitly
 *     via the form prop — no goals signal for this yet)
 *   - investor: default, everything else
 */
function deriveVisitorType(
  goals: string[] | undefined,
  explicit: string | undefined,
): "investor" | "agent" | "vendor" {
  if (explicit === "agent" || explicit === "vendor" || explicit === "investor") {
    return explicit
  }
  if (goals?.includes("sell")) return "vendor"
  return "investor"
}

/**
 * Coalesce the various free-text fields into a single `message` for the CRM.
 * Order of precedence: enquiry notes → seller concerns → contact-form questions → private context.
 * Returns undefined if none are populated.
 */
function buildMessage(data: {
  enquiryNotes?: string
  concerns?: string
  questionsText?: string
  privateContext?: string
}): string | undefined {
  return (
    data.enquiryNotes?.trim() ||
    data.concerns?.trim() ||
    data.questionsText?.trim() ||
    data.privateContext?.trim() ||
    undefined
  )
}

// =============================================================================
// VALIDATION SCHEMA
// =============================================================================

const leadSchema = z.object({
  // Contact fields (optional for returning leads in property-enquiry mode)
  firstName: z.string().max(100).optional().default(""),
  lastName: z.string().max(100).optional().default(""),
  email: z.string().max(100).optional().default(""),
  // E.164 format ("+" + country code + national number, 8-15 digits total).
  // Empty string allowed for returning-lead property-enquiry submissions that
  // don't re-collect contact details.
  whatsapp: z
    .string()
    .max(20)
    .regex(/^(\+[1-9]\d{6,14})?$/, "Phone must be in E.164 format")
    .optional()
    .default(""),
  formMode: z.enum([
    "contact",
    "landing",
    "download",
    "private",
    "property-enquiry",
    "newsletter",
    "event",
  ]),
  submittedAt: z.string(),
  pageUrl: z.string().max(500),

  // Optional fields - goals
  goals: z.array(z.string().max(100)).optional(),

  // Optional fields - buyer qualification
  investTimeline: z.string().max(100).optional(),
  budget: z.string().max(100).optional(),
  propertyTypes: z.array(z.string().max(50)).max(9).optional(),
  locations: z.array(z.string().max(100)).max(5).optional(),
  bedrooms: z.number().int().min(0).max(20).optional(),

  // Optional fields - seller qualification
  propertyName: z.string().max(500).optional(),
  propertyLocation: z.string().max(500).optional(),
  concerns: z.string().max(2000).optional(),
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

  // Property enquiry fields
  bitrixLeadId: z.string().max(50).optional(),
  enquiryIntent: z.array(z.string().max(100)).max(10).optional(),
  propertyAppeals: z.array(z.string().max(100)).max(10).optional(),
  enquiryNotes: z.string().max(1000).optional(),

  // Lead magnet + tagging for CRM categorisation
  leadMagnet: z.string().max(200).optional(),
  leadTag: z.string().max(100).optional(),

  // Pipeline router
  visitorType: z.enum(["investor", "agent", "vendor"]).optional(),

  // Context from referring pages
  referringProperty: z.string().max(500).optional(),
  referringTeamMember: z.string().max(100).optional(),
  referringTeamMemberEmail: z.string().max(100).optional(),

  // Last-touch URL parameters
  source: z.string().max(100).optional(),
  utmSource: z.string().max(100).optional(),
  utmMedium: z.string().max(100).optional(),
  utmCampaign: z.string().max(100).optional(),
  utmContent: z.string().max(100).optional(),
  utmTerm: z.string().max(100).optional(),
  manychat: z.string().max(100).optional(),
  referrer: z.string().max(500).optional(),

  // First-touch attribution (read from 30-day cookie if present)
  firstTouchUtmSource: z.string().max(100).optional(),
  firstTouchUtmMedium: z.string().max(100).optional(),
  firstTouchUtmCampaign: z.string().max(100).optional(),
  firstTouchUtmContent: z.string().max(100).optional(),
  firstTouchUtmTerm: z.string().max(100).optional(),
  firstTouchReferrer: z.string().max(500).optional(),
  firstTouchLandingPage: z.string().max(500).optional(),
  firstTouchAt: z.string().max(40).optional(),

  // Idempotency + journey
  submissionId: z.string().max(50).optional(),
  sessionId: z.string().max(50).optional(),

  // Calendly booking metadata (sent via post-booking follow-up)
  scheduledMeeting: z.boolean().optional(),
  meetingStartTime: z.string().max(40).optional(),
  meetingEndTime: z.string().max(40).optional(),
  meetingInviteeName: z.string().max(200).optional(),
  meetingInviteeEmail: z.string().max(200).optional(),
  meetingEventType: z.string().max(200).optional(),
  meetingEventUri: z.string().max(500).optional(),
  meetingInviteeUri: z.string().max(500).optional(),
  meetingRescheduleUrl: z.string().max(500).optional(),
  meetingCancelUrl: z.string().max(500).optional(),

  // Honeypot field for bot protection
  website: z.string().max(500).optional(),
})

type LeadData = z.infer<typeof leadSchema>

// =============================================================================
// PROPERTY ENRICHMENT
// =============================================================================

interface EnrichedProperty {
  ref: string
  name: string
  url: string
  developerName: string | null
  isOffPlan: boolean
  isDistressed: boolean
}

const SITE_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://primecapitaldubai.com"

/**
 * Resolve a property slug → CRM-friendly enrichment object so the CRM has
 * everything it needs (display name, canonical URL, developer, off-plan
 * flag, distressed flag) without trusting the client. Returns null if the
 * slug doesn't resolve.
 */
async function enrichProperty(slug: string | undefined): Promise<EnrichedProperty | null> {
  if (!slug) return null
  let property: Property | null = null
  try {
    property = await getWebPropertyBySlug(slug)
  } catch (err) {
    console.error("[Leads API] Property enrichment failed:", err)
    return null
  }
  if (!property) return null
  return {
    ref: property.slug,
    name: property.title,
    url: `${SITE_BASE_URL.replace(/\/$/, "")}/properties/${property.slug}`,
    developerName: property.developer,
    isOffPlan: property.completionStatus === "off-plan",
    isDistressed: property.tags?.includes("distressed") ?? false,
  }
}

// =============================================================================
// AGENT CRM FORWARDING
// =============================================================================

const AGENTCRM_API_URL = process.env.AGENTCRM_API_URL || "https://crm.primecapitaldubai.com/api/public/enquiry"
const AGENTCRM_API_KEY = process.env.AGENTCRM_API_KEY

interface ForwardResult {
  ok: boolean
  status: number
  destination: "agentcrm" | "zapier"
}

/**
 * Build the AgentCRM-shaped payload from validated lead data + server-side
 * enrichment. Field renames vs. our internal schema:
 *   - whatsapp → phone (E.164 already enforced upstream)
 *   - referringProperty → propertyRef
 *   - referringTeamMember → assigneeSlug, teamMemberEmail → assigneeEmail
 *   - questionsText / enquiryNotes / concerns / privateContext → message
 *   - formMode "event" → "contact" (event name stays in formName + leadMagnet)
 */
function buildAgentCrmPayload(
  leadData: LeadData,
  property: EnrichedProperty | null,
  submissionId: string,
  resolvedAssigneeEmail: string | null,
) {
  const visitorType = deriveVisitorType(leadData.goals, leadData.visitorType)
  const formName = getFormName(leadData.formMode, leadData.pageUrl)
  // For events, the form name already includes the page (e.g. "Event
  // Registration - Livestream"). Use it as the leadMagnet so the CRM has a
  // single field carrying event identity, since formMode collapses to "contact".
  const leadMagnet =
    leadData.leadMagnet ||
    (leadData.formMode === "event" ? formName : undefined)

  const payload: Record<string, unknown> = {
    // Identity
    firstName: leadData.firstName || undefined,
    lastName: leadData.lastName || undefined,
    email: leadData.email || undefined,
    phone: leadData.whatsapp || undefined,
    whatsapp: leadData.whatsapp || undefined,

    // Form context
    formMode: mapFormModeForCrm(leadData.formMode),
    formName,
    leadMagnet,
    pageUrl: leadData.pageUrl,
    visitorType,
    submissionId,
    sessionId: leadData.sessionId,
    submittedAt: leadData.submittedAt,
    _source: "prime-capital-website",

    // Coalesced free-text
    message: buildMessage(leadData),

    // Buyer qualification
    goals: leadData.goals,
    investTimeline: leadData.investTimeline,
    budget: leadData.budget,
    budgetMin: leadData.budget ? BUDGET_MIN_AED[leadData.budget] : undefined,
    budgetMax: leadData.budget ? BUDGET_MAX_AED[leadData.budget] : undefined,
    propertyTypes: leadData.propertyTypes,
    locations: leadData.locations,
    bedrooms: leadData.bedrooms,

    // Seller qualification
    propertyLocation: leadData.propertyLocation,
    propertyType: leadData.propertyType,
    saleTimeline: leadData.saleTimeline,
    targetPrice: leadData.targetPrice,

    // Property enquiry — server-enriched name/url override anything the
    // client might have sent
    propertyRef: property?.ref || leadData.referringProperty,
    propertyName: property?.name,
    propertyUrl: property?.url,
    developerName: property?.developerName,
    isOffPlan: property?.isOffPlan,
    isDistressed: property?.isDistressed,
    enquiryIntent: leadData.enquiryIntent,
    propertyAppeals: leadData.propertyAppeals,
    enquiryNotes: leadData.enquiryNotes,

    // Private mode
    privateRole: leadData.privateRole,
    deploymentRange: leadData.deploymentRange,
    preferredContact: leadData.preferredContact,
    privateContext: leadData.privateContext,

    // Auto-assignment
    assigneeEmail: resolvedAssigneeEmail,
    teamMemberEmail: resolvedAssigneeEmail,
    assigneeSlug: leadData.referringTeamMember,

    // Tagging — apply distressed automatically when the property is flagged
    leadTag:
      leadData.leadTag ||
      (property?.isDistressed ? "distressed" : undefined),

    // Last-touch attribution
    utmSource: leadData.utmSource,
    utmMedium: leadData.utmMedium,
    utmCampaign: leadData.utmCampaign,
    utmContent: leadData.utmContent,
    utmTerm: leadData.utmTerm,
    referrer: leadData.referrer,
    manychat: leadData.manychat,

    // First-touch attribution
    firstTouchUtmSource: leadData.firstTouchUtmSource,
    firstTouchUtmMedium: leadData.firstTouchUtmMedium,
    firstTouchUtmCampaign: leadData.firstTouchUtmCampaign,
    firstTouchUtmContent: leadData.firstTouchUtmContent,
    firstTouchUtmTerm: leadData.firstTouchUtmTerm,
    firstTouchReferrer: leadData.firstTouchReferrer,
    firstTouchLandingPage: leadData.firstTouchLandingPage,
    firstTouchAt: leadData.firstTouchAt,

    // Meeting metadata (post-Calendly booking)
    scheduledMeeting: leadData.scheduledMeeting,
    meetingStartTime: leadData.meetingStartTime,
    meetingEndTime: leadData.meetingEndTime,
    meetingInviteeName: leadData.meetingInviteeName,
    meetingInviteeEmail: leadData.meetingInviteeEmail,
    meetingEventType: leadData.meetingEventType,
    meetingEventUri: leadData.meetingEventUri,
    meetingInviteeUri: leadData.meetingInviteeUri,
    meetingRescheduleUrl: leadData.meetingRescheduleUrl,
    meetingCancelUrl: leadData.meetingCancelUrl,

    // Bitrix lead id (for returning leads — CRM dedupes by email/phone too)
    bitrixLeadId: leadData.bitrixLeadId,

    // Honeypot — pass through so CRM's own honeypot is the second layer
    website: leadData.website ?? "",
  }

  for (const k of Object.keys(payload)) {
    if (payload[k] === undefined) delete payload[k]
  }
  return payload
}

/**
 * POST to AgentCRM with Bearer auth. Status-aware logging so ops sees the
 * difference between "key missing" (alert Tim) and "transient 5xx" (retry).
 * Never throws — always returns a ForwardResult so parallel-write works.
 */
async function forwardToAgentCrm(
  payload: Record<string, unknown>,
  submissionId: string,
  formMode: string,
): Promise<ForwardResult> {
  if (!AGENTCRM_API_KEY) {
    console.warn(
      `[Leads API] AGENTCRM_API_KEY not configured — skipping AgentCRM forward (mode=${formMode}, sub=${submissionId})`,
    )
    return { ok: false, status: 0, destination: "agentcrm" }
  }
  try {
    const res = await fetch(AGENTCRM_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${AGENTCRM_API_KEY}`,
      },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      const bodyText = await res.text().catch(() => "")
      const tier =
        res.status === 401 || res.status === 503
          ? "ALERT"
          : res.status >= 500
            ? "TRANSIENT"
            : "VALIDATION"
      console.error(
        `[Leads API][AgentCRM][${tier}] status=${res.status} mode=${formMode} sub=${submissionId} body=${bodyText.slice(0, 240)}`,
      )
      return { ok: false, status: res.status, destination: "agentcrm" }
    }
    return { ok: true, status: res.status, destination: "agentcrm" }
  } catch (err) {
    console.error(
      `[Leads API][AgentCRM][NETWORK] mode=${formMode} sub=${submissionId} err=${err instanceof Error ? err.message : String(err)}`,
    )
    return { ok: false, status: 0, destination: "agentcrm" }
  }
}

/**
 * POST to the legacy Zapier webhook with the existing Bitrix-coded payload.
 * Kept running in parallel during cutover so leads keep flowing into Bitrix24
 * while AgentCRM proves out. Never throws.
 */
async function forwardToZapier(
  zapierWebhookUrl: string,
  bitrixPayload: Record<string, unknown>,
  submissionId: string,
  formMode: string,
): Promise<ForwardResult> {
  try {
    const res = await fetch(zapierWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bitrixPayload),
    })
    if (!res.ok) {
      const bodyText = await res.text().catch(() => "")
      console.error(
        `[Leads API][Zapier] status=${res.status} mode=${formMode} sub=${submissionId} body=${bodyText.slice(0, 240)}`,
      )
      return { ok: false, status: res.status, destination: "zapier" }
    }
    return { ok: true, status: res.status, destination: "zapier" }
  } catch (err) {
    console.error(
      `[Leads API][Zapier][NETWORK] mode=${formMode} sub=${submissionId} err=${err instanceof Error ? err.message : String(err)}`,
    )
    return { ok: false, status: 0, destination: "zapier" }
  }
}

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
    // Idempotency: trust the client UUID if present, otherwise mint one.
    const submissionId = leadData.submissionId || randomUUID()

    // Server-side property enrichment + agent email resolution (used by both
    // forwarders so we don't hit the DB twice).
    const property = await enrichProperty(leadData.referringProperty)
    const resolvedAssigneeEmail = resolveTeamMemberEmail(
      leadData.referringTeamMember,
      leadData.referringTeamMemberEmail,
    )

    // Build payloads for both destinations
    const agentCrmPayload = buildAgentCrmPayload(
      leadData,
      property,
      submissionId,
      resolvedAssigneeEmail,
    )

    const bitrixPayload = {
      ...leadData,
      submissionId,

      // Goals - labels and codes
      goalsLabels: leadData.goals?.map((g) => BITRIX_GOAL_LABELS[g]).filter(Boolean) || [],
      goalCodes: leadData.goals?.map((g) => BITRIX_GOAL_CODES[g]).filter(Boolean) || [],

      // Timeline - labels and codes
      investTimelineLabel: leadData.investTimeline ? BITRIX_TIMELINE_LABELS[leadData.investTimeline] : null,
      timelineCode: leadData.investTimeline ? BITRIX_TIMELINE_CODES[leadData.investTimeline] : null,

      // Budget - labels, codes, and AED min/max
      budgetLabel: leadData.budget ? BITRIX_BUDGET_LABELS[leadData.budget] : null,
      budgetCode: leadData.budget ? BITRIX_BUDGET_CODES[leadData.budget] : null,
      budgetMin: leadData.budget ? BUDGET_MIN_AED[leadData.budget] : null,
      budgetMax: leadData.budget ? BUDGET_MAX_AED[leadData.budget] : null,

      // Sale timeline (sellers) - uses seller-specific codes
      saleTimelineLabel: leadData.saleTimeline ? BITRIX_TIMELINE_LABELS[leadData.saleTimeline] : null,
      saleTimelineCode: leadData.saleTimeline ? BITRIX_SALE_TIMELINE_CODES[leadData.saleTimeline] : null,

      // Target price (sellers) - uses seller-specific codes
      targetPriceLabel: leadData.targetPrice ? BITRIX_BUDGET_LABELS[leadData.targetPrice] : null,
      targetPriceCode: leadData.targetPrice ? BITRIX_TARGET_PRICE_CODES[leadData.targetPrice] : null,

      // Server-derived pipeline router
      visitorType: deriveVisitorType(leadData.goals, leadData.visitorType),

      // Server-enriched property data
      propertyInterest: property?.ref || leadData.referringProperty || null,
      propertyName: property?.name ?? leadData.propertyName ?? null,
      propertyUrl: property?.url ?? null,
      developerName: property?.developerName ?? null,
      isOffPlan: property?.isOffPlan ?? null,
      isDistressed: property?.isDistressed ?? null,

      // Auto-assignment
      assignToTeamMember: leadData.referringTeamMember || null,
      teamMemberEmail: resolvedAssigneeEmail,

      // Private mode labels
      privateRoleLabel: PRIVATE_ROLE_LABELS[leadData.privateRole || ""] || null,
      deploymentRangeLabel: DEPLOYMENT_RANGE_LABELS[leadData.deploymentRange || ""] || null,
      preferredContactLabel: PREFERRED_CONTACT_LABELS[leadData.preferredContact || ""] || null,

      // Property enquiry labels
      enquiryIntentLabels: leadData.enquiryIntent?.map((i) => ENQUIRY_INTENT_LABELS[i]).filter(Boolean) || [],
      propertyAppealsLabels: leadData.propertyAppeals?.map((a) => PROPERTY_APPEAL_LABELS[a]).filter(Boolean) || [],

      // Lead tag (auto-applied for distressed properties)
      leadTag:
        leadData.leadTag ||
        (property?.isDistressed ? "distressed" : null),
      leadTagLabel: (() => {
        const t = leadData.leadTag || (property?.isDistressed ? "distressed" : null)
        return t ? t.charAt(0).toUpperCase() + t.slice(1).replace(/-/g, " ") : null
      })(),

      // Coalesced free-text → message (also keep the originals)
      message: buildMessage(leadData) ?? null,

      // Form identification for CRM routing
      formName: getFormName(leadData.formMode, leadData.pageUrl),

      // Metadata for Zapier
      _source: "prime-capital-website",
      _timestamp: new Date().toISOString(),
    }

    // Pick the right Zapier webhook (BID for returning leads).
    const zapierWebhookUrl = leadData.bitrixLeadId
      ? process.env.ZAPIER_BID_WEBHOOK_URL
      : process.env.ZAPIER_LEAD_WEBHOOK_URL

    // Parallel-write: Zapier (legacy, kept during cutover) + AgentCRM (new).
    // Both are best-effort — failures don't block the user.
    const tasks: Promise<ForwardResult>[] = [
      forwardToAgentCrm(agentCrmPayload, submissionId, leadData.formMode),
    ]
    if (zapierWebhookUrl) {
      tasks.push(forwardToZapier(zapierWebhookUrl, bitrixPayload, submissionId, leadData.formMode))
    } else {
      console.warn(
        `[Leads API] Zapier webhook URL not configured (mode=${leadData.formMode}, sub=${submissionId})`,
      )
    }
    const results = await Promise.allSettled(tasks)

    // Single-line summary for ops, no PII.
    const summary = results
      .map((r) =>
        r.status === "fulfilled"
          ? `${r.value.destination}=${r.value.ok ? "ok" : `fail(${r.value.status})`}`
          : `unknown=throw`,
      )
      .join(" ")
    console.log(
      `[Leads API] mode=${leadData.formMode} sub=${submissionId} ${summary}`,
    )

    return NextResponse.json({
      success: true,
      message: "Thank you for your enquiry. We'll be in touch shortly.",
      submissionId,
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
