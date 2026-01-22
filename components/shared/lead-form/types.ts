/**
 * CATALYST - Lead Form Types
 *
 * TypeScript types for the multi-step lead capture form.
 */

// =============================================================================
// ENUM TYPES
// =============================================================================

export type LeadGoal =
  | "invest-offplan"
  | "buy-ready"
  | "sell"
  | "build"
  | "build-wealth"
  | "advice-only"

export type InvestTimeline =
  | "now" // Within a month
  | "immediate" // Within 3 months
  | "short-term" // 3-6 months
  | "mid-term" // 6-12 months
  | "long-term" // 1-2 years
  | "undecided"

export type SaleTimeline = InvestTimeline

export type BudgetRange =
  | "under-1m"
  | "1m-3m"
  | "3m-6m"
  | "6m-10m"
  | "10m-15m"
  | "15m-20m"
  | "20m-50m"
  | "50m-plus"

export type PriceRange = BudgetRange

export type PropertyType =
  | "apartment"
  | "villa"
  | "townhouse"
  | "penthouse"
  | "land"
  | "commercial"

export type FormMode = "contact" | "landing" | "download"
export type FormTheme = "light" | "dark"

// =============================================================================
// FORM DATA
// =============================================================================

export interface LeadFormData {
  // Step 1: Name
  firstName: string
  lastName: string

  // Step 2: Contact
  email: string
  whatsapp: string

  // Step 3: Goals (multi-select) - contact mode only
  goals: LeadGoal[]

  // Step 4a: Timeline & Budget (for buyers/investors)
  investTimeline?: InvestTimeline
  budget?: BudgetRange

  // Step 4b: Property Details (for sellers)
  propertyLocation?: string
  propertyType?: PropertyType
  saleTimeline?: SaleTimeline
  targetPrice?: PriceRange

  // Step 5: Questions
  hasQuestions?: boolean
  questionsText?: string

  // Step 6: Schedule (Calendly)
  scheduledMeeting?: boolean
  calendlyEventId?: string    // e.g., "ABC123"
  calendlyInviteeId?: string  // e.g., "XYZ789"

  // Meta (auto-captured)
  formMode: FormMode
  source?: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmContent?: string
  utmTerm?: string
  manychat?: string
  submittedAt: string
  pageUrl: string

  // Context from referring pages
  referringProperty?: string         // Property slug from query param
  referringTeamMember?: string       // Team member slug from query param
  referringTeamMemberEmail?: string  // Team member email from query param
}

// =============================================================================
// COMPONENT PROPS
// =============================================================================

export interface LeadFormProps {
  /** Form mode determines which steps are shown */
  mode: FormMode

  /** Optional: Override the download asset name */
  downloadAsset?: string

  /** Optional: Custom success message */
  successMessage?: string

  /** Optional: Callback after successful submission */
  onSuccess?: (data: LeadFormData) => void

  /** Optional: Custom class for styling */
  className?: string

  /** Optional: Light or dark theme */
  theme?: FormTheme

  /** Optional: URL to redirect to after successful submission (download mode) */
  redirectUrl?: string

  /** Optional: Delay in ms before redirecting (default: 3000) */
  redirectDelay?: number
}

// =============================================================================
// STEP TYPES
// =============================================================================

export type StepId =
  | "name"
  | "contact"
  | "goals"
  | "timeline-budget"
  | "property"
  | "questions"
  | "schedule"
  | "success"

export interface StepConfig {
  id: StepId
  title: string
  showFor: FormMode[]
  condition?: (data: Partial<LeadFormData>) => boolean
}

// =============================================================================
// OPTIONS FOR SELECTS
// =============================================================================

export interface SelectOption<T = string> {
  value: T
  label: string
  description?: string
}

export const GOAL_OPTIONS: SelectOption<LeadGoal>[] = [
  { value: "invest-offplan", label: "Invest in off-plan property" },
  { value: "buy-ready", label: "Buy a move-in-ready property" },
  { value: "sell", label: "Sell a property" },
  { value: "build", label: "Build a property" },
  { value: "build-wealth", label: "Build wealth through the property market" },
  { value: "advice-only", label: "I am only seeking advice at this time" },
]

export const TIMELINE_OPTIONS: SelectOption<InvestTimeline>[] = [
  { value: "now", label: "Now: within a month" },
  { value: "immediate", label: "Immediate: within the next 3 months" },
  { value: "short-term", label: "Short-term: within the next 3-6 months" },
  { value: "mid-term", label: "Mid-term: within the next 6-12 months" },
  { value: "long-term", label: "Long-term: within the next 1-2 years" },
  { value: "undecided", label: "Undecided" },
]

export const BUDGET_OPTIONS: SelectOption<BudgetRange>[] = [
  { value: "under-1m", label: "Less than AED 1 million" },
  { value: "1m-3m", label: "AED 1-3 million" },
  { value: "3m-6m", label: "AED 3-6 million" },
  { value: "6m-10m", label: "AED 6-10 million" },
  { value: "10m-15m", label: "AED 10-15 million" },
  { value: "15m-20m", label: "AED 15-20 million" },
  { value: "20m-50m", label: "AED 20-50 million" },
  { value: "50m-plus", label: "AED 50+ million" },
]

export const PROPERTY_TYPE_OPTIONS: SelectOption<PropertyType>[] = [
  { value: "apartment", label: "Apartment" },
  { value: "villa", label: "Villa" },
  { value: "townhouse", label: "Townhouse" },
  { value: "penthouse", label: "Penthouse" },
  { value: "land", label: "Land" },
  { value: "commercial", label: "Commercial" },
]
