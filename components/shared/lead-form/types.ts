/**
 * CATALYST - Lead Form Types
 *
 * TypeScript types for the multi-step lead capture form.
 */

// =============================================================================
// ENUM TYPES
// =============================================================================

// Canonical enums — match AgentCRM expected values exactly.
// Anything outside these lists is stored as opaque metadata, not used
// for scoring/routing.

export type LeadGoal =
  | "invest-offplan"
  | "buy-ready"
  | "sell"
  | "build-wealth"
  | "golden-visa"
  | "advice-only"

export type InvestTimeline =
  | "immediate"
  | "3_6_months"
  | "6_12_months"
  | "12_24_months"
  | "24_plus_months"
  | "flexible"

export type SaleTimeline = InvestTimeline

export type BudgetRange =
  | "under-1m"
  | "1m-3m"
  | "3m-5m"
  | "5m-10m"
  | "10m-20m"
  | "50m-plus"

export type PriceRange = BudgetRange

export type PropertyType =
  | "apartment"
  | "villa"
  | "townhouse"
  | "penthouse"
  | "studio"
  | "duplex"
  | "land"
  | "commercial"
  | "office"

export type PrivateRole = "investor" | "advisor" | "family-office"

// Deployment is a subset of BudgetRange (UHNW = 5m+).
export type DeploymentRange = "5m-10m" | "10m-20m" | "50m-plus"

export type PreferredContact = "phone" | "email" | "whatsapp"

// Internal modes. `event` is internal-only; mapped to `contact` when sent
// to AgentCRM (event name carried in formName + leadMagnet).
export type FormMode =
  | "contact"
  | "landing"
  | "download"
  | "private"
  | "property-enquiry"
  | "newsletter"
  | "event"

// Pipeline router (CRM uses to assign leads). Default is investor. "seller" is
// usually inferred server-side from a "sell" goal, not set here.
export type VisitorType = "investor" | "agent" | "vendor" | "seller"
export type FormTheme = "light" | "dark"
export type FormJourney = "default" | "second-opinion"

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
  // Buyer multi-select qualification (serious investor flow)
  propertyTypes?: PropertyType[]
  locations?: string[]
  bedrooms?: number

  // Step 4b: Property Details (for sellers)
  propertyName?: string
  propertyLocation?: string
  propertyType?: PropertyType
  saleTimeline?: SaleTimeline
  targetPrice?: PriceRange

  // Concerns (landing mode — free text)
  concerns?: string

  // Step 5: Questions
  hasQuestions?: boolean
  questionsText?: string

  // Step: Property Interest (property-enquiry mode)
  bitrixLeadId?: string
  propertyUrl?: string
  enquiryIntent?: string[]
  propertyAppeals?: string[]
  enquiryNotes?: string

  // Step: Private Context (private mode only)
  privateRole?: PrivateRole
  deploymentRange?: DeploymentRange
  preferredContact?: PreferredContact
  privateContext?: string

  // Lead magnet / tagging
  leadMagnet?: string  // e.g. "Dubai Off-Plan Guide 2026"
  leadTag?: string     // e.g. "distressed", "livestream-q2-2026"
  leadMagnetId?:
    | "prime-investor-decision-framework"
    | "prime-project-second-opinion"
  leadMagnetFields?: {
    source_script?: string
    price?: string
    objective?: string
    payment_plan?: string
  }
  leadMagnetDocuments?: Array<{
    url: string
    filename: string
    contentType: string
    sizeBytes: number
  }>
  consent?: true

  // Pipeline router
  visitorType?: VisitorType

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

  // First-touch attribution (set from 30-day cookie if present)
  firstTouchUtmSource?: string
  firstTouchUtmMedium?: string
  firstTouchUtmCampaign?: string
  firstTouchUtmContent?: string
  firstTouchUtmTerm?: string
  firstTouchReferrer?: string
  firstTouchLandingPage?: string
  firstTouchAt?: string
  referrer?: string  // last-touch referrer

  // Idempotency + journey
  submissionId?: string
  sessionId?: string

  // Calendly meeting metadata (post-booking follow-up payload)
  scheduledMeeting?: boolean
  meetingStartTime?: string
  meetingEndTime?: string
  meetingInviteeName?: string
  meetingInviteeEmail?: string
  meetingEventType?: string
  meetingEventUri?: string
  meetingInviteeUri?: string
  meetingRescheduleUrl?: string
  meetingCancelUrl?: string

  // Context from referring pages
  referringProperty?: string         // Property slug from query param
  referringTeamMember?: string       // Team member slug from query param
  referringTeamMemberEmail?: string  // Team member email from query param

  // CRM prospect binder — opaque ref from the AgentCRM welcome-email link
  // (?ref=…). Forwarded verbatim so AgentCRM promotes the existing prospect
  // (Prospect → Lead) instead of creating a duplicate.
  ref?: string
  share?: string

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

  /** Optional: A specialist journey composed from the shared form engine */
  journey?: FormJourney

  /** Optional: URL to redirect to after successful submission (download mode) */
  redirectUrl?: string

  /** Optional: Delay in ms before redirecting (default: 3000) */
  redirectDelay?: number

  /** Optional: Label for the manual redirect action */
  redirectLabel?: string

  /** Optional: Supporting note beneath the manual redirect action */
  redirectNote?: string

  /** Optional: Calendly URL to embed inline after submission */
  calendlyUrl?: string

  /** Optional: Show a property name/location field on the contact step with this label */
  propertyLabel?: string

  /** Optional: Placeholder for the combined property/location field */
  propertyPlaceholder?: string

  /** Optional: Custom contact-step submit label when it opens a booking calendar */
  contactSubmitLabel?: string

  /** Optional: Custom label for the specialist journey's final submit action */
  finalSubmitLabel?: string

  /** Optional: Show separate property name and location fields instead of a single combined field */
  showPropertyFields?: boolean

  /** Optional: Show a concerns/notes textarea */
  showConcerns?: boolean

  /** Optional: Auto-focus the first input on mount (default: true) */
  autoFocus?: boolean

  /** Optional: Tag for CRM categorisation (e.g. "distressed") */
  tag?: string

  /** Optional: Structured AgentCRM lead-magnet identifier */
  leadMagnetId?: LeadFormData["leadMagnetId"]

  /** Optional: Structured lead-magnet fields */
  leadMagnetFields?: LeadFormData["leadMagnetFields"]

  /** Consent copy shown beside a required checkbox on the contact step */
  consentLabel?: string

  /** Optional: Property context for property-enquiry mode */
  propertyContext?: PropertyContext

  /** Optional: Bitrix Lead ID for returning leads */
  bitrixLeadId?: string

  /** Optional: Seed the form with known values */
  initialData?: Partial<LeadFormData>

  /** Optional: Persist completed contact fields and consent under this sessionStorage key */
  persistKey?: string

  /** Optional: Restore contact fields and consent from this sessionStorage key */
  prefillKey?: string

  /** Optional: Start after name/contact when restored data has those fields */
  skipPrefilledContact?: boolean
}

// =============================================================================
// STEP TYPES
// =============================================================================

export type StepId =
  | "name"
  | "contact"
  | "goals"
  | "timeline-budget"
  | "preferences"
  | "locations"
  | "property"
  | "questions"
  | "private-context"
  | "enquiry-intent"
  | "property-appeal"
  | "second-opinion-property"
  | "second-opinion-review"
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
  { value: "build-wealth", label: "Build wealth through the property market" },
  { value: "golden-visa", label: "Secure a Golden Visa through property" },
  { value: "advice-only", label: "I am only seeking advice at this time" },
]

export const TIMELINE_OPTIONS: SelectOption<InvestTimeline>[] = [
  { value: "immediate", label: "Immediate (next 3 months)" },
  { value: "3_6_months", label: "3-6 months" },
  { value: "6_12_months", label: "6-12 months" },
  { value: "12_24_months", label: "1-2 years" },
  { value: "24_plus_months", label: "2+ years" },
  { value: "flexible", label: "Flexible / Undecided" },
]

export const BUDGET_OPTIONS: SelectOption<BudgetRange>[] = [
  { value: "under-1m", label: "Less than AED 1 million" },
  { value: "1m-3m", label: "AED 1-3 million" },
  { value: "3m-5m", label: "AED 3-5 million" },
  { value: "5m-10m", label: "AED 5-10 million" },
  { value: "10m-20m", label: "AED 10-20 million" },
  { value: "50m-plus", label: "AED 50+ million" },
]

export const PROPERTY_TYPE_OPTIONS: SelectOption<PropertyType>[] = [
  { value: "apartment", label: "Apartment" },
  { value: "villa", label: "Villa" },
  { value: "townhouse", label: "Townhouse" },
  { value: "penthouse", label: "Penthouse" },
  { value: "studio", label: "Studio" },
  { value: "duplex", label: "Duplex" },
  { value: "land", label: "Land" },
  { value: "commercial", label: "Commercial" },
  { value: "office", label: "Office" },
]

// Canonical Dubai location list (used by the buyer multi-select).
// Match casing exactly — CRM uses these strings for filtering/segmentation.
export const LOCATION_OPTIONS: SelectOption<string>[] = [
  { value: "Downtown Dubai", label: "Downtown Dubai" },
  { value: "Dubai Marina", label: "Dubai Marina" },
  { value: "Palm Jumeirah", label: "Palm Jumeirah" },
  { value: "Business Bay", label: "Business Bay" },
  { value: "Dubai Hills Estate", label: "Dubai Hills Estate" },
  { value: "JBR", label: "JBR" },
  { value: "DIFC", label: "DIFC" },
  { value: "Jumeirah Lakes Towers (JLT)", label: "Jumeirah Lakes Towers (JLT)" },
  { value: "Arabian Ranches", label: "Arabian Ranches" },
  { value: "Mohammed Bin Rashid City (MBR)", label: "Mohammed Bin Rashid City (MBR)" },
  { value: "Emaar Beachfront", label: "Emaar Beachfront" },
  { value: "Bluewaters Island", label: "Bluewaters Island" },
  { value: "Dubai Creek Harbour", label: "Dubai Creek Harbour" },
  { value: "Jumeirah Village Circle (JVC)", label: "Jumeirah Village Circle (JVC)" },
  { value: "Tilal Al Ghaf", label: "Tilal Al Ghaf" },
  { value: "Sobha Hartland", label: "Sobha Hartland" },
  { value: "Damac Hills", label: "Damac Hills" },
  { value: "Dubai South", label: "Dubai South" },
]

export const PRIVATE_ROLE_OPTIONS: SelectOption<PrivateRole>[] = [
  { value: "investor", label: "I am an investor" },
  { value: "advisor", label: "I represent an investor" },
  { value: "family-office", label: "Family office" },
]

export const DEPLOYMENT_RANGE_OPTIONS: SelectOption<DeploymentRange>[] = [
  { value: "5m-10m", label: "AED 5–10 million" },
  { value: "10m-20m", label: "AED 10–20 million" },
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
