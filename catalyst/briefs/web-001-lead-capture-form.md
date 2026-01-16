# Brief: Lead Capture Form System

**ID:** WEB-001  
**Status:** Complete  
**Priority:** High  
**Surface:** Web  
**Estimate:** 2-3 days  
**Completed:** 16 January 2026

---

## Objective

Build a multi-step, conversational lead capture form system for the Prime Capital Dubai website. The form progressively qualifies leads based on their goals, captures UTM parameters, and sends data to Zapier for CRM integration.

---

## Background

The current website uses static HTML forms with no functionality. Prime Capital needs a working lead capture system that:
- Feels conversational (step-by-step, personalized prompts)
- Qualifies leads based on intent (buyer vs seller vs advice-seeker)
- Captures marketing attribution (UTM parameters)
- Integrates with their CRM via Zapier
- Supports multiple modes for different pages

---

## Form Modes

| Mode | Steps | Use Case | Fields |
|------|-------|----------|--------|
| `contact` | 6-7 steps | /contact page | Full qualification flow |
| `landing` | 2 steps | Paid landing pages | Name + Contact |
| `download` | 3 fields | Strategy kit, lead magnets | Name + Email + WhatsApp |

---

## Data Schema

### Core Fields

```typescript
interface LeadFormData {
  // Step 1: Name
  firstName: string
  lastName: string
  
  // Step 2: Contact
  email: string
  whatsapp: string
  
  // Step 3: Goals (multi-select)
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
  hasQuestions: boolean
  questionsText?: string
  
  // Step 6: Schedule (Calendly)
  scheduledMeeting?: boolean
  
  // Meta (auto-captured)
  formMode: 'contact' | 'landing' | 'download'
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmContent?: string
  utmTerm?: string
  submittedAt: string
  pageUrl: string
}
```

### Enum Types

```typescript
type LeadGoal = 
  | 'invest-offplan'
  | 'buy-ready'
  | 'sell'
  | 'build'
  | 'build-wealth'
  | 'advice-only'

type InvestTimeline =
  | 'now'           // Within a month
  | 'immediate'     // Within 3 months
  | 'short-term'    // 3-6 months
  | 'mid-term'      // 6-12 months
  | 'long-term'     // 1-2 years
  | 'undecided'

type SaleTimeline = InvestTimeline  // Same options

type BudgetRange =
  | 'under-1m'
  | '1m-3m'
  | '3m-6m'
  | '6m-10m'
  | '10m-15m'
  | '15m-20m'
  | '20m-50m'
  | '50m-plus'

type PriceRange = BudgetRange  // Same options

type PropertyType =
  | 'apartment'
  | 'villa'
  | 'townhouse'
  | 'penthouse'
  | 'land'
  | 'commercial'
```

---

## Flow Logic

### Contact Mode Flow

```
┌─────────────┐
│  1. Name    │
└──────┬──────┘
       │
┌──────▼──────┐
│ 2. Contact  │
└──────┬──────┘
       │
┌──────▼──────┐
│  3. Goals   │ (multi-select)
└──────┬──────┘
       │
       ├──────────────────────────────────┐
       │                                  │
       ▼                                  ▼
┌─────────────────┐              ┌────────────────────┐
│ 4a. Timeline &  │ (buy/invest) │ 4b. Property       │ (sell)
│     Budget      │              │     Details        │
└────────┬────────┘              └─────────┬──────────┘
         │                                 │
         └────────────────┬────────────────┘
                          │
                          ▼
                 ┌────────────────┐
                 │ 5. Questions   │
                 └────────┬───────┘
                          │
            ┌─────────────┴─────────────┐
            │                           │
            ▼                           ▼
   ┌─────────────────┐         ┌────────────────┐
   │ 6. Schedule     │         │ 6. Thank You   │ (advice-only)
   │    (Calendly)   │         │                │
   └─────────────────┘         └────────────────┘
```

### Conditional Rules

| Goals Include | Next Step After Goals |
|---------------|----------------------|
| invest-offplan, buy-ready, build, build-wealth | Timeline & Budget |
| sell | Property Details |
| advice-only (only) | Questions (skip qualification) |
| Mixed (buyer + seller) | Timeline & Budget first, then Properties |

---

## Step Content

### Step 1: Name
- **Heading:** "Hello. Who am I speaking with today?"
- **Fields:** First Name, Last Name
- **Layout:** Side-by-side on desktop

### Step 2: Contact
- **Heading:** "Thanks {firstName}. Can you share your contact details so we can contact you about your enquiry."
- **Subtext:** "We cherish our clients' privacy and never share your details with 3rd parties."
- **Fields:** Email (with icon), WhatsApp (with country code selector)

### Step 3: Goals
- **Heading:** "Can you please share your goal / reason for connecting with Tahir?"
- **Question:** "What is your goal? What are you looking to achieve with Tahir?"
- **Type:** Multi-select checkboxes
- **Options:**
  - Invest in off-plan property
  - Buy a move-in-ready property
  - Sell a property
  - Build a property
  - Build wealth through the property market
  - I am only seeking advice at this time

### Step 4a: Timeline & Budget (Buyers)
- **Heading:** "Fantastic {firstName}. So I can direct your enquiry to the most qualified member of my team, can you please share with me a few details about your current situation."
- **Section 1:** "Your Investing Timeline"
  - "What is your timeline for investing?" (single select)
- **Section 2:** "Your Budget"
  - "What is your budget for your investment?" (grid of options)

### Step 4b: Property Details (Sellers)
- **Heading:** Same as 4a
- **Section 1:** "Property Location"
  - "Where is your property located?" (text input - Development Name/Suburb)
  - "What type of property are you looking to sell?" (dropdown)
- **Section 2:** "Your Sale Timeline"
  - Timeline options (same as investing)
- **Section 3:** "Your Target Price"
  - Price range options (same as budget)

### Step 5: Questions
- **Heading:** "Questions / Concerns"
- **Question:** "Do you have any specific questions or concerns you would like addressed by Tahir and his team?"
- **Type:** Yes/No toggle
- **Conditional:** If Yes, show textarea

### Step 6: Schedule (Calendly)
- **Heading:** "Given your goals, let's find a time to connect. Please book a time below."
- **Embed:** Calendly inline widget
- **URL:** `https://calendly.com/tahirmajithia/30min`
- **Skip option:** "I'll schedule later" link

### Success Screen
- **Heading:** "Thank you, {firstName}!"
- **Message:** "We've received your enquiry and a member of our team will be in touch within one business day."
- **If scheduled:** "Your consultation is confirmed for {date/time}."

---

## Technical Requirements

### Files to Create

```
components/
└── shared/
    └── lead-form/
        ├── index.ts                    # Barrel export
        ├── lead-form.tsx               # Main component
        ├── lead-form.css               # Styles
        ├── types.ts                    # TypeScript types
        ├── schema.ts                   # Zod validation
        ├── use-lead-form.ts            # Form state hook
        └── steps/
            ├── name-step.tsx
            ├── contact-step.tsx
            ├── goals-step.tsx
            ├── timeline-budget-step.tsx
            ├── property-step.tsx
            ├── questions-step.tsx
            ├── schedule-step.tsx
            └── success-step.tsx

lib/
├── hooks/
│   └── use-utm-params.ts               # UTM extraction hook
└── leads/
    └── submit-lead.ts                  # Client-side submission

app/
└── api/
    └── leads/
        └── route.ts                    # API endpoint
```

### Environment Variables

```env
# Zapier webhook for lead capture
ZAPIER_LEAD_WEBHOOK_URL=https://hooks.zapier.com/hooks/catch/xxx/yyy

# Calendly link for scheduling
NEXT_PUBLIC_CALENDLY_URL=https://calendly.com/tahirmajithia/30min
```

### Component API

```tsx
interface LeadFormProps {
  /** Form mode determines which steps are shown */
  mode: 'contact' | 'landing' | 'download'
  
  /** Optional: Override the download asset name */
  downloadAsset?: string
  
  /** Optional: Custom success message */
  successMessage?: string
  
  /** Optional: Callback after successful submission */
  onSuccess?: (data: LeadFormData) => void
  
  /** Optional: Custom class for styling */
  className?: string
  
  /** Optional: Light or dark theme */
  theme?: 'light' | 'dark'
}

// Usage examples:
<LeadForm mode="contact" theme="light" />
<LeadForm mode="download" downloadAsset="Dubai Investment Strategy Kit" theme="dark" />
<LeadForm mode="landing" theme="dark" />
```

### API Endpoint

```typescript
// POST /api/leads
// Request body: LeadFormData
// Response: { success: boolean, message: string }

// Workflow:
// 1. Validate request body with Zod
// 2. Forward to Zapier webhook
// 3. Return success/error response
```

---

## Design Requirements

### Visual Style
- Match web surface design language (see current contact/strategy-kit pages)
- Dark theme for embedded forms (strategy kit hero)
- Light theme for contact page
- Orange accent color for CTAs (`var(--web-gold)` or similar)
- Subtle animations between steps (fade + slide)

### Choice Buttons
- Pill/card style for single-select (radio appearance)
- Checkbox style for multi-select
- Hover and selected states
- Grid layout for budget/price options (2 columns)

### Progress Indicator
- Subtle step dots or progress bar
- Current step highlighted
- Completed steps marked

### Mobile Considerations
- Full-width form on mobile
- Stacked layout for name fields
- Touch-friendly choice buttons (44px minimum)
- Sticky CTA button at bottom

---

## Integration Points

### Page Updates Required

1. **Contact Page** (`app/(web)/contact/page.tsx`)
   - Replace static form with `<LeadForm mode="contact" theme="light" />`
   - Keep surrounding layout (hero, contact details, process section)

2. **Strategy Kit Page** (`app/(web)/strategy-kit/page.tsx`)
   - Replace static form with `<LeadForm mode="download" downloadAsset="Dubai Investment Strategy Kit" theme="dark" />`

3. **Future Landing Pages**
   - Template with `<LeadForm mode="landing" theme="dark" />`

---

## Validation Rules

| Field | Rules |
|-------|-------|
| firstName | Required, 2-50 chars |
| lastName | Required, 2-50 chars |
| email | Required, valid email format |
| whatsapp | Required, valid phone format |
| goals | At least one selection required |
| investTimeline | Required if buyer goals selected |
| budget | Required if buyer goals selected |
| propertyLocation | Required if sell goal selected |
| propertyType | Required if sell goal selected |
| saleTimeline | Required if sell goal selected |
| targetPrice | Required if sell goal selected |
| hasQuestions | Required |
| questionsText | Required if hasQuestions is true |

---

## Success Criteria

- [ ] Form submits successfully to Zapier webhook
- [ ] All three modes render correctly with appropriate steps
- [ ] Conditional branching works based on goal selection
- [ ] UTM parameters captured from URL
- [ ] Calendly embeds and allows booking
- [ ] Form works on mobile devices
- [ ] Loading/error states display correctly
- [ ] Animations are smooth between steps
- [ ] Validation prevents invalid submissions

---

## Out of Scope (Future)

- AI-driven conversational qualification
- Real-time lead scoring
- A/B testing framework
- Direct CRM integration (via Zapier for now)
- Phone number verification (OTP)
- Lead deduplication

---

## Dependencies

- Calendly embed script or React component
- Zapier webhook URL (to be provided)

---

## Notes

- Keep implementation simple — avoid over-engineering
- Form state should persist during step navigation (back button works)
- Consider localStorage backup for form recovery
- Calendly has a React package (`react-calendly`) but inline embed with script is simpler
