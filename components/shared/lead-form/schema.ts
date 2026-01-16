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
  "build",
  "build-wealth",
  "advice-only",
])

export const investTimelineSchema = z.enum([
  "now",
  "immediate",
  "short-term",
  "mid-term",
  "long-term",
  "undecided",
])

export const budgetRangeSchema = z.enum([
  "under-1m",
  "1m-3m",
  "3m-6m",
  "6m-10m",
  "10m-15m",
  "15m-20m",
  "20m-50m",
  "50m-plus",
])

export const propertyTypeSchema = z.enum([
  "apartment",
  "villa",
  "townhouse",
  "penthouse",
  "land",
  "commercial",
])

export const formModeSchema = z.enum(["contact", "landing", "download"])

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

export const contactStepSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  whatsapp: z
    .string()
    .min(8, "Please enter a valid phone number")
    .regex(
      /^\+?[0-9\s\-()]+$/,
      "Please enter a valid phone number"
    ),
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

// =============================================================================
// FULL FORM SCHEMAS (per mode)
// =============================================================================

const baseSchema = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  email: z.string().email(),
  whatsapp: z.string().min(8),
  formMode: formModeSchema,
  submittedAt: z.string(),
  pageUrl: z.string(),
  
  // UTM params (optional)
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  utmContent: z.string().optional(),
  utmTerm: z.string().optional(),
})

// Download mode: Just name + contact
export const downloadFormSchema = baseSchema

// Landing mode: Just name + contact  
export const landingFormSchema = baseSchema

// Contact mode: Full qualification
export const contactFormSchema = baseSchema.extend({
  goals: z.array(leadGoalSchema).min(1),
  
  // Buyer fields (optional - conditional)
  investTimeline: investTimelineSchema.optional(),
  budget: budgetRangeSchema.optional(),
  
  // Seller fields (optional - conditional)
  propertyLocation: z.string().optional(),
  propertyType: propertyTypeSchema.optional(),
  saleTimeline: investTimelineSchema.optional(),
  targetPrice: budgetRangeSchema.optional(),
  
  // Questions
  hasQuestions: z.boolean().optional(),
  questionsText: z.string().optional(),
  
  // Schedule
  scheduledMeeting: z.boolean().optional(),
})

// =============================================================================
// DYNAMIC SCHEMA SELECTOR
// =============================================================================

export function getFormSchema(mode: "contact" | "landing" | "download") {
  switch (mode) {
    case "contact":
      return contactFormSchema
    case "landing":
      return landingFormSchema
    case "download":
      return downloadFormSchema
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
