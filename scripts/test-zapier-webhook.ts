/**
 * CATALYST - Zapier Webhook Test Script
 *
 * Sends a test lead submission directly to the Zapier webhook
 * to verify the integration is working correctly.
 * Includes Bitrix24 codes for CRM integration.
 *
 * Usage: npx tsx scripts/test-zapier-webhook.ts
 */

import { config } from "dotenv"
import { resolve } from "path"

// Load .env.local
config({ path: resolve(process.cwd(), ".env.local") })

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

const ZAPIER_WEBHOOK_URL = process.env.ZAPIER_LEAD_WEBHOOK_URL

if (!ZAPIER_WEBHOOK_URL) {
  console.error("❌ ZAPIER_LEAD_WEBHOOK_URL not found in environment")
  console.log("   Make sure your .env.local file contains this variable")
  process.exit(1)
}

// Test lead data matching the schema in app/api/leads/route.ts
// This test includes BOTH buyer AND seller fields to verify all mappings
const goals = ["sell", "buy-ready"]  // Seller + buyer
const investTimeline = "immediate"
const budget = "1m-3m"
const saleTimeline = "short-term"
const targetPrice = "3m-6m"

const testLead = {
  // Required fields
  firstName: "Test",
  lastName: "Seller",
  email: "test.seller@example.com",
  whatsapp: "+971501234567",
  formMode: "contact",
  submittedAt: new Date().toISOString(),
  pageUrl: "https://primecapitaldubai.com/contact",

  // Goals (multi-select) - values + labels + codes
  goals: goals,
  goalsLabels: goals.map(g => BITRIX_GOAL_LABELS[g]).filter(Boolean),
  goalCodes: goals.map(g => BITRIX_GOAL_CODES[g]).filter(Boolean),

  // Buyer qualification - values + labels + codes
  investTimeline: investTimeline,
  investTimelineLabel: BITRIX_TIMELINE_LABELS[investTimeline],
  timelineCode: BITRIX_TIMELINE_CODES[investTimeline],
  
  budget: budget,
  budgetLabel: BITRIX_BUDGET_LABELS[budget],
  budgetCode: BITRIX_BUDGET_CODES[budget],

  // Seller fields - using seller-specific codes
  saleTimeline: saleTimeline,
  saleTimelineLabel: BITRIX_TIMELINE_LABELS[saleTimeline],
  saleTimelineCode: BITRIX_SALE_TIMELINE_CODES[saleTimeline],
  targetPrice: targetPrice,
  targetPriceLabel: BITRIX_BUDGET_LABELS[targetPrice],
  targetPriceCode: BITRIX_TARGET_PRICE_CODES[targetPrice],

  // Property details (for sellers)
  propertyLocation: "Dubai Marina",
  propertyType: "apartment",

  // Questions
  hasQuestions: true,
  questionsText:
    "This is a TEST submission to verify Zapier webhook integration with SELLER fields. Please ignore this message.",

  // Meeting / Calendly
  scheduledMeeting: true,
  calendlyEventId: "TEST123",
  calendlyInviteeId: "INV456",
  bookedWithTahir: "Yes",

  // URL parameters
  source: "instagram",
  utmSource: "test-script",
  utmMedium: "webhook-test",
  utmCampaign: "zapier-seller-test",
  manychat: "mc_user_123456",  
  // Form identification
  "formName": "Contact Form - Contact Page",
  // Metadata (added by the API)
  _source: "prime-capital-website",
  _timestamp: new Date().toISOString(),
  _testSubmission: true,
}

async function sendTestWebhook() {
  console.log("🚀 Sending test lead to Zapier webhook...")
  console.log("")
  console.log("📋 Test data:")
  console.log(JSON.stringify(testLead, null, 2))
  console.log("")

  try {
    const response = await fetch(ZAPIER_WEBHOOK_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testLead),
    })

    console.log(`📡 Response status: ${response.status}`)

    if (response.ok) {
      const text = await response.text()
      console.log(`✅ Webhook received successfully!`)
      if (text) {
        console.log(`   Response: ${text}`)
      }
      console.log("")
      console.log("📥 Check your Zapier dashboard to see the received data.")
      console.log(
        "   If this is a new Zap, you may need to 'Test Trigger' in Zapier."
      )
    } else {
      console.error(`❌ Webhook returned error: ${response.status}`)
      console.error(`   ${await response.text()}`)
    }
  } catch (error) {
    console.error("❌ Failed to send webhook:", error)
  }
}

sendTestWebhook()
