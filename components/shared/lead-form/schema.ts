/**
 * CATALYST - Lead Form Validation Schema
 *
 * Zod schemas for validating lead form data.
 */

import { z } from "zod"

// =============================================================================
// ENUM SCHEMAS
// =============================================================================

export const leadGoalSchema = z.enum([
  "invest-offplan",
  "buy-ready",
  "sell",
  "build-wealth",
  "golden-visa",
  "advice-only",
])

export const investTimelineSchema = z.enum([
  "immediate",
  "3_6_months",
  "6_12_months",
  "12_24_months",
  "24_plus_months",
  "flexible",
])

export const budgetRangeSchema = z.enum([
  "under-1m",
  "1m-3m",
  "3m-5m",
  "5m-10m",
  "10m-20m",
  "50m-plus",
])

export const propertyTypeSchema = z.enum([
  "apartment",
  "villa",
  "townhouse",
  "penthouse",
  "studio",
  "duplex",
  "land",
  "commercial",
  "office",
])

export const formModeSchema = z.enum([
  "contact",
  "landing",
  "download",
  "private",
  "property-enquiry",
  "newsletter",
  "event",
])

export const visitorTypeSchema = z.enum(["investor", "agent", "vendor", "seller"])

// =============================================================================
// STEP SCHEMAS
// =============================================================================

export const nameStepSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters"),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters"),
})

// E.164: starts with +, country code 1-9, then 7-14 digits.
// Must include country code so AgentCRM can dedup against existing contacts.
const e164Regex = /^\+[1-9]\d{6,14}$/
const shortTextSchema = z.string().max(100)
const urlTextSchema = z.string().max(500)
const submittedAtSchema = z.string().max(40)

export const contactStepSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  whatsapp: z
    .string()
    .regex(e164Regex, "Please enter a valid phone number including country code"),
})

export const goalsStepSchema = z.object({
  goals: z.array(leadGoalSchema).min(1, "Please select at least one goal"),
})

export const timelineBudgetStepSchema = z.object({
  investTimeline: investTimelineSchema,
  budget: budgetRangeSchema,
})

export const propertyStepSchema = z.object({
  propertyLocation: z
    .string()
    .min(2, "Please enter the property location"),
  propertyType: propertyTypeSchema,
  saleTimeline: investTimelineSchema,
  targetPrice: budgetRangeSchema,
})

export const questionsStepSchema = z.object({
  hasQuestions: z.boolean(),
  questionsText: z.string().optional(),
}).refine(
  (data) => !data.hasQuestions || (data.questionsText && data.questionsText.length > 0),
  {
    message: "Please enter your questions",
    path: ["questionsText"],
  }
)

// Private mode enums
export const privateRoleSchema = z.enum(["investor", "advisor", "family-office"])
export const deploymentRangeSchema = z.enum(["5m-10m", "10m-20m", "50m-plus"])
export const preferredContactSchema = z.enum(["phone", "email", "whatsapp"])

export const privateContextStepSchema = z.object({
  privateRole: privateRoleSchema.optional().refine(
    (val) => val !== undefined,
    { message: "Please select your role" }
  ),
  deploymentRange: deploymentRangeSchema.optional().refine(
    (val) => val !== undefined,
    { message: "Please select a range" }
  ),
  preferredContact: preferredContactSchema.optional().refine(
    (val) => val !== undefined,
    { message: "Please select a method" }
  ),
  privateContext: z.string().max(500).optional(),
})

export const propertyInterestStepSchema = z.object({
  enquiryIntent: z.array(z.string().max(100)).max(10).optional(),
  propertyAppeals: z.array(z.string().max(100)).max(10).optional(),
  enquiryNotes: z.string().max(1000).optional(),
})

// =============================================================================
// FULL FORM SCHEMAS (per mode)
// =============================================================================

const baseSchema = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  email: z.string().email(),
  whatsapp: z.string().regex(e164Regex),
  formMode: formModeSchema,
  submittedAt: submittedAtSchema,
  pageUrl: urlTextSchema,
  
  // UTM params (optional)
  utmSource: shortTextSchema.optional(),
  utmMedium: shortTextSchema.optional(),
  utmCampaign: shortTextSchema.optional(),
  utmContent: shortTextSchema.optional(),
  utmTerm: shortTextSchema.optional(),
})

// Download mode: Just name + contact
export const downloadFormSchema = baseSchema

// Landing mode: Just name + contact
export const landingFormSchema = baseSchema

// Event mode: Just name + contact (webinar / livestream registration)
export const eventFormSchema = baseSchema

// Contact mode: Full qualification
export const contactFormSchema = baseSchema.extend({
  goals: z.array(leadGoalSchema).min(1),

  // Buyer fields (optional - conditional)
  investTimeline: investTimelineSchema.optional(),
  budget: budgetRangeSchema.optional(),
  propertyTypes: z.array(propertyTypeSchema).max(9).optional(),
  locations: z.array(z.string().max(100)).max(5).optional(),
  bedrooms: z.number().int().min(0).max(20).optional(),

  // Seller fields (optional - conditional)
  propertyLocation: z.string().optional(),
  propertyType: propertyTypeSchema.optional(),
  saleTimeline: investTimelineSchema.optional(),
  targetPrice: budgetRangeSchema.optional(),

  // Questions
  hasQuestions: z.boolean().optional(),
  questionsText: z.string().max(500).optional(),
})

// Private mode: Discreet UHNW capture
export const privateFormSchema = baseSchema.extend({
  privateRole: privateRoleSchema.optional(),
  deploymentRange: deploymentRangeSchema.optional(),
  preferredContact: preferredContactSchema.optional(),
  privateContext: z.string().max(500).optional(),
})

// Property enquiry mode: new leads get full flow, returning leads skip name/contact
export const propertyEnquiryFormSchema = baseSchema.extend({
  goals: z.array(leadGoalSchema).min(1).optional(),

  // Buyer fields (optional - conditional)
  investTimeline: investTimelineSchema.optional(),
  budget: budgetRangeSchema.optional(),
  propertyTypes: z.array(propertyTypeSchema).max(9).optional(),
  locations: z.array(z.string().max(100)).max(5).optional(),
  bedrooms: z.number().int().min(0).max(20).optional(),

  // Seller fields (optional - conditional)
  propertyLocation: z.string().optional(),
  propertyType: propertyTypeSchema.optional(),
  saleTimeline: investTimelineSchema.optional(),
  targetPrice: budgetRangeSchema.optional(),

  // Questions
  hasQuestions: z.boolean().optional(),
  questionsText: z.string().max(500).optional(),

  // Property interest fields
  bitrixLeadId: z.string().max(50).optional(),
  enquiryIntent: z.array(z.string().max(100)).max(10).optional(),
  propertyAppeals: z.array(z.string().max(100)).max(10).optional(),
  enquiryNotes: z.string().max(1000).optional(),
})

// Returning lead: minimal schema (no name/contact required)
export const returningLeadFormSchema = z.object({
  formMode: formModeSchema,
  submittedAt: submittedAtSchema,
  pageUrl: urlTextSchema,
  bitrixLeadId: z.string().max(50),
  enquiryIntent: z.array(z.string().max(100)).max(10).optional(),
  propertyAppeals: z.array(z.string().max(100)).max(10).optional(),
  enquiryNotes: z.string().max(1000).optional(),
  referringProperty: z.string().max(500).optional(),
  utmSource: shortTextSchema.optional(),
  utmMedium: shortTextSchema.optional(),
  utmCampaign: shortTextSchema.optional(),
  utmContent: shortTextSchema.optional(),
  utmTerm: shortTextSchema.optional(),
})

// =============================================================================
// DYNAMIC SCHEMA SELECTOR
// =============================================================================

export function getFormSchema(mode: "contact" | "landing" | "download" | "private" | "property-enquiry" | "newsletter" | "event") {
  switch (mode) {
    case "contact":
      return contactFormSchema
    case "landing":
      return landingFormSchema
    case "download":
      return downloadFormSchema
    case "private":
      return privateFormSchema
    case "property-enquiry":
      return propertyEnquiryFormSchema
    case "newsletter":
      return baseSchema
    case "event":
      return eventFormSchema
    default:
      return baseSchema
  }
}

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type NameStepData = z.infer<typeof nameStepSchema>
export type ContactStepData = z.infer<typeof contactStepSchema>
export type GoalsStepData = z.infer<typeof goalsStepSchema>
export type TimelineBudgetStepData = z.infer<typeof timelineBudgetStepSchema>
export type PropertyStepData = z.infer<typeof propertyStepSchema>
export type QuestionsStepData = z.infer<typeof questionsStepSchema>
export type ContactFormData = z.infer<typeof contactFormSchema>
export type DownloadFormData = z.infer<typeof downloadFormSchema>
export type LandingFormData = z.infer<typeof landingFormSchema>
export type EventFormData = z.infer<typeof eventFormSchema>
export type PrivateFormData = z.infer<typeof privateFormSchema>
export type PropertyInterestStepData = z.infer<typeof propertyInterestStepSchema>
export type PropertyEnquiryFormData = z.infer<typeof propertyEnquiryFormSchema>
