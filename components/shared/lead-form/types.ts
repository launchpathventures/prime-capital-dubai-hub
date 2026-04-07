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

export type PrivateRole = "investor" | "advisor" | "family-office"

export type DeploymentRange =
  | "5m-10m"
  | "10m-20m"
  | "20m-50m"
  | "50m-plus"

export type PreferredContact = "phone" | "email" | "whatsapp"

export type FormMode = "contact" | "landing" | "download" | "private" | "property-enquiry"
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

  // Step: Property Interest (property-enquiry mode)
  bitrixLeadId?: string
  enquiryIntent?: string[]
  propertyAppeals?: string[]
  enquiryNotes?: string

  // Step: Private Context (private mode only)
  privateRole?: PrivateRole
  deploymentRange?: DeploymentRange
  preferredContact?: PreferredContact
  privateContext?: string

  // Tagging (set by parent component)
  leadTag?: string

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

  // Honeypot for bot protection (hidden field)
  website?: string
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

  /** Optional: Calendly URL to embed inline after submission */
  calendlyUrl?: string

  /** Optional: Show a property name/location field on the contact step with this label */
  propertyLabel?: string

  /** Optional: Auto-focus the first input on mount (default: true) */
  autoFocus?: boolean

  /** Optional: Tag for CRM categorisation (e.g. "distressed") */
  tag?: string

  /** Optional: Property context for property-enquiry mode */
  propertyContext?: PropertyContext

  /** Optional: Bitrix Lead ID for returning leads */
  bitrixLeadId?: string
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
  | "private-context"
  | "enquiry-intent"
  | "property-appeal"
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

export const PRIVATE_ROLE_OPTIONS: SelectOption<PrivateRole>[] = [
  { value: "investor", label: "I am an investor" },
  { value: "advisor", label: "I represent an investor" },
  { value: "family-office", label: "Family office" },
]

export const DEPLOYMENT_RANGE_OPTIONS: SelectOption<DeploymentRange>[] = [
  { value: "5m-10m", label: "AED 5–10 million" },
  { value: "10m-20m", label: "AED 10–20 million" },
  { value: "20m-50m", label: "AED 20–50 million" },
  { value: "50m-plus", label: "AED 50 million +" },
]

export const PREFERRED_CONTACT_OPTIONS: SelectOption<PreferredContact>[] = [
  { value: "phone", label: "Phone call" },
  { value: "email", label: "Email" },
  { value: "whatsapp", label: "WhatsApp" },
]

// =============================================================================
// PROPERTY ENQUIRY
// =============================================================================

export interface PropertyContext {
  slug: string
  title: string
  isOffPlan: boolean
  isDistressed: boolean
  hasDeveloper: boolean
  hasRentalYield: boolean
  developerName?: string
  coverImage?: string
}

export const ENQUIRY_INTENT_OPTIONS: SelectOption[] = [
  { value: "pricing", label: "Pricing & payment plans" },
  { value: "investment-analysis", label: "Investment analysis / ROI" },
  { value: "compare", label: "Compare with similar properties" },
  { value: "availability", label: "Check unit availability" },
  { value: "developer-info", label: "Understand the developer" },
]

export const PROPERTY_APPEAL_OPTIONS: SelectOption[] = [
  { value: "location", label: "Location" },
  { value: "price-point", label: "Price point" },
  { value: "lifestyle", label: "Lifestyle fit" },
]

export const CONDITIONAL_APPEAL_OPTIONS: (SelectOption & { condition: (ctx: PropertyContext) => boolean })[] = [
  { value: "payment-plan", label: "Payment plan flexibility", condition: (ctx) => ctx.isOffPlan },
  { value: "rental-yield", label: "Rental yield potential", condition: (ctx) => ctx.hasRentalYield },
  { value: "developer", label: "Developer reputation", condition: (ctx) => ctx.hasDeveloper },
  { value: "completion-timeline", label: "Completion timeline", condition: (ctx) => ctx.isOffPlan },
  { value: "distressed-pricing", label: "Below-market pricing", condition: (ctx) => ctx.isDistressed },
]

export const INTENT_LABELS: Record<string, string> = Object.fromEntries(
  ENQUIRY_INTENT_OPTIONS.map((o) => [o.value, o.label])
)

export const APPEAL_LABELS: Record<string, string> = Object.fromEntries(
  [...PROPERTY_APPEAL_OPTIONS, ...CONDITIONAL_APPEAL_OPTIONS].map((o) => [o.value, o.label])
)
