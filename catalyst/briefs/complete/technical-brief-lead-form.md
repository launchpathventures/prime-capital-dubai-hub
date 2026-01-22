# Technical Brief: Multi-Step Lead Capture Form

**Purpose:** Enable another AI agent to rebuild this lead form system in a different codebase.

**Original Project:** Prime Capital Dubai (Next.js 14+ / React / TypeScript)

---

## Overview

A multi-step, conversational lead capture form with:
- 3 form modes (contact, landing, download)
- Conditional step branching based on user selections
- Zod validation per step
- UTM parameter capture
- Calendly scheduling integration
- CRM integration via Zapier webhook
- Light/dark theme support
- Keyboard shortcuts for selection

---

## Architecture

```
components/shared/lead-form/
├── index.ts              # Barrel export
├── lead-form.tsx         # Main component
├── lead-form.css         # Styles (CSS variables, BEM)
├── use-lead-form.ts      # State management hook
├── types.ts              # TypeScript types + option arrays
├── schema.ts             # Zod validation schemas
└── steps/                # Individual step components
    ├── index.ts
    ├── name-step.tsx
    ├── contact-step.tsx
    ├── goals-step.tsx
    ├── timeline-budget-step.tsx
    ├── property-step.tsx
    ├── questions-step.tsx
    ├── schedule-step.tsx
    └── success-step.tsx

app/api/leads/
└── route.ts              # API endpoint (Zapier webhook)

lib/hooks/
└── use-utm-params.ts     # UTM parameter extraction
```

---

## Form Modes & Step Flow

### Mode: `contact` (Full Qualification)
```
name → contact → goals → [timeline-budget | property] → questions → [schedule] → success
```
- Shows all qualification steps
- `timeline-budget` shown if buyer goals selected
- `property` shown if "sell" goal selected
- `schedule` skipped if only "advice-only" goal

### Mode: `landing` (Quick Capture)
```
name → contact → success
```
- Minimal friction, just name + contact
- Submits after contact step

### Mode: `download` (Lead Magnet)
```
name → contact → success
```
- Same as landing but displays download asset name
- Success step offers download button

---

## Data Model

### Form Data (`LeadFormData`)

```typescript
interface LeadFormData {
  // Step 1: Name
  firstName: string
  lastName: string

  // Step 2: Contact
  email: string
  whatsapp: string

  // Step 3: Goals (multi-select, contact mode only)
  goals: LeadGoal[]

  // Step 4a: Buyer/Investor qualification
  investTimeline?: InvestTimeline
  budget?: BudgetRange

  // Step 4b: Seller qualification
  propertyLocation?: string
  propertyType?: PropertyType
  saleTimeline?: SaleTimeline
  targetPrice?: PriceRange

  // Step 5: Questions
  hasQuestions?: boolean
  questionsText?: string

  // Step 6: Calendly scheduling
  scheduledMeeting?: boolean
  calendlyEventId?: string
  calendlyInviteeId?: string

  // Auto-captured metadata
  formMode: FormMode
  submittedAt: string
  pageUrl: string
  
  // UTM parameters
  source?: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmContent?: string
  utmTerm?: string
  manychat?: string
}
```

### Enum Types

```typescript
type LeadGoal =
  | "invest-offplan"
  | "buy-ready"
  | "sell"
  | "build"
  | "build-wealth"
  | "advice-only"

type InvestTimeline =
  | "now"       // Within a month
  | "immediate" // Within 3 months
  | "short-term" // 3-6 months
  | "mid-term"   // 6-12 months
  | "long-term"  // 1-2 years
  | "undecided"

type BudgetRange =
  | "under-1m" | "1m-3m" | "3m-6m" | "6m-10m"
  | "10m-15m" | "15m-20m" | "20m-50m" | "50m-plus"

type PropertyType =
  | "apartment" | "villa" | "townhouse"
  | "penthouse" | "land" | "commercial"

type FormMode = "contact" | "landing" | "download"
type FormTheme = "light" | "dark"
```

---

## Component API

### LeadForm Props

```typescript
interface LeadFormProps {
  mode: FormMode              // Required: determines step flow
  downloadAsset?: string      // For download mode: asset name
  successMessage?: string     // Custom success message
  onSuccess?: (data: LeadFormData) => void  // Callback
  className?: string          // Custom styling
  theme?: FormTheme          // "light" | "dark" (default: "light")
}
```

### Usage Examples

```tsx
// Full contact form
<LeadForm mode="contact" theme="light" />

// Lead magnet download
<LeadForm 
  mode="download" 
  downloadAsset="Strategy Kit"
  theme="dark"
/>

// Quick landing page capture
<LeadForm 
  mode="landing" 
  onSuccess={(data) => trackConversion(data)}
/>
```

---

## State Management Hook (`useLeadForm`)

The hook manages:
1. **Step navigation** - Based on mode and conditional logic
2. **Form data** - Partial data built up across steps
3. **Submission** - POST to API endpoint
4. **UTM params** - Captured on mount

### Key Logic

```typescript
const STEPS: StepDef[] = [
  { id: "name", modes: ["contact", "landing", "download"] },
  { id: "contact", modes: ["contact", "landing", "download"] },
  { id: "goals", modes: ["contact"] },
  {
    id: "timeline-budget",
    modes: ["contact"],
    condition: (data) => {
      const buyerGoals = ["invest-offplan", "buy-ready", "build", "build-wealth"]
      return data.goals?.some(g => buyerGoals.includes(g)) ?? false
    },
  },
  {
    id: "property",
    modes: ["contact"],
    condition: (data) => data.goals?.includes("sell") ?? false,
  },
  { id: "questions", modes: ["contact"] },
  {
    id: "schedule",
    modes: ["contact"],
    condition: (data) => {
      // Skip if only "advice-only" selected
      if (data.goals?.length === 1 && data.goals[0] === "advice-only") {
        return false
      }
      return true
    },
  },
  { id: "success", modes: ["contact", "landing", "download"] },
]
```

### Hook Return

```typescript
interface UseLeadFormReturn {
  currentStep: StepId
  currentStepIndex: number
  totalSteps: number
  data: Partial<LeadFormData>
  isSubmitting: boolean
  error: string | null
  nextStep: () => void
  prevStep: () => void
  canGoBack: boolean
  canGoNext: boolean
  updateData: (updates: Partial<LeadFormData>) => void
  submit: () => Promise<void>
  availableSteps: StepId[]
  progress: number
}
```

---

## Validation (Zod Schemas)

Each step has its own validation schema:

```typescript
// Name step
const nameStepSchema = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
})

// Contact step
const contactStepSchema = z.object({
  email: z.string().email(),
  whatsapp: z.string().min(8).regex(/^\+?[0-9\s\-()]+$/),
})

// Goals step
const goalsStepSchema = z.object({
  goals: z.array(leadGoalSchema).min(1),
})

// Timeline/Budget step
const timelineBudgetStepSchema = z.object({
  investTimeline: investTimelineSchema,
  budget: budgetRangeSchema,
})

// Property step (sellers)
const propertyStepSchema = z.object({
  propertyLocation: z.string().min(2),
  propertyType: propertyTypeSchema,
  saleTimeline: investTimelineSchema,
  targetPrice: budgetRangeSchema,
})

// Questions step
const questionsStepSchema = z.object({
  hasQuestions: z.boolean(),
  questionsText: z.string().optional(),
}).refine(
  (data) => !data.hasQuestions || (data.questionsText && data.questionsText.length > 0),
  { message: "Please enter your questions" }
)
```

---

## API Endpoint

### Route: `POST /api/leads`

Receives form data and forwards to Zapier webhook.

### Request Body

```typescript
{
  // All LeadFormData fields
  firstName: string,
  lastName: string,
  email: string,
  whatsapp: string,
  formMode: "contact" | "landing" | "download",
  submittedAt: string,  // ISO timestamp
  pageUrl: string,
  
  // Optional based on mode/selection
  goals?: string[],
  investTimeline?: string,
  budget?: string,
  // ... etc
}
```

### Response

```typescript
// Success
{ success: true, message: "Thank you for your enquiry..." }

// Validation error
{ error: "Invalid form data", details: [...] }

// Server error
{ error: "Failed to process form submission" }
```

### CRM Integration (Bitrix24 via Zapier)

The API transforms form values to CRM codes:

```typescript
const bitrixPayload = {
  // Original data
  ...leadData,
  
  // Transformed for CRM
  goalsLabels: ["Invest in off-plan property", ...],
  goalCodes: [48694, ...],
  investTimelineLabel: "Now: within a month",
  timelineCode: 13176,
  budgetLabel: "AED 1-3 million",
  budgetCode: 49696,
  bookedWithTahir: "Yes" | "No",
  formName: "Contact Form - Homepage",
  
  // Metadata
  _source: "prime-capital-website",
  _timestamp: "2026-01-21T10:30:00.000Z",
}
```

### Environment Variables

```bash
# Required for CRM integration
ZAPIER_LEAD_WEBHOOK_URL=https://hooks.zapier.com/hooks/catch/...

# Optional Calendly URL (has default)
NEXT_PUBLIC_CALENDLY_URL=https://calendly.com/yourname/30min
```

---

## Calendly Integration

### How It Works

1. Calendly script loaded dynamically on schedule step
2. Inline widget initialized with prefilled name/email
3. Listens for `calendly.event_scheduled` message
4. Extracts event ID and invitee ID from payload
5. Updates form data and triggers submission

### Implementation

```typescript
// Load script
const script = document.createElement("script")
script.src = "https://assets.calendly.com/assets/external/widget.js"
document.body.appendChild(script)

// Initialize widget
window.Calendly.initInlineWidget({
  url: calendlyUrl,
  parentElement: containerRef.current,
  prefill: {
    name: `${data.firstName} ${data.lastName}`,
    email: data.email,
  },
})

// Listen for booking
window.addEventListener("message", (e) => {
  if (e.data.event === "calendly.event_scheduled") {
    const eventId = e.data.payload?.event?.uri.split("/").pop()
    const inviteeId = e.data.payload?.invitee?.uri.split("/").pop()
    onUpdate({ scheduledMeeting: true, calendlyEventId: eventId, calendlyInviteeId: inviteeId })
    onSubmit()
  }
})
```

---

## UTM Parameter Capture

### Hook Usage

```typescript
const utm = useUTMParams()
// Returns: { utmSource, utmMedium, utmCampaign, utmContent, utmTerm, source, manychat }
```

### Captured Parameters

| URL Param | Data Field |
|-----------|-----------|
| `utm_source` | `utmSource` |
| `utm_medium` | `utmMedium` |
| `utm_campaign` | `utmCampaign` |
| `utm_content` | `utmContent` |
| `utm_term` | `utmTerm` |
| `source` | `source` |
| `manychat` | `manychat` |

---

## Styling System

### CSS Variables (Design Tokens)

```css
.lead-form {
  /* Transitions */
  --lf-transition: 300ms cubic-bezier(0, 0, 0.2, 1);
  --lf-transition-fast: 150ms cubic-bezier(0, 0, 0.2, 1);
  
  /* Typography */
  --lf-font-question: clamp(24px, 3vw, 32px);
  --lf-font-greeting: clamp(14px, 2vw, 16px);
  --lf-font-body: 14px;
  --lf-font-small: 13px;
  --lf-font-tiny: 11px;
  
  /* Spacing */
  --lf-gap: 1.5rem;
  --lf-gap-sm: 0.75rem;
  --lf-gap-xs: 0.5rem;
}

/* Light theme */
.lead-form--light {
  --lf-text: #3F4142;
  --lf-text-muted: #576C75;
  --lf-text-subtle: #A6B5B0;
  --lf-accent: #576C75;
  --lf-border: rgba(87, 108, 117, 0.2);
  --lf-input-bg: white;
}

/* Dark theme */
.lead-form--dark {
  --lf-text: #F2EFEA;
  --lf-text-muted: #A6B5B0;
  --lf-text-subtle: rgba(242, 239, 234, 0.5);
  --lf-accent: #F2EFEA;
  --lf-border: rgba(242, 239, 234, 0.2);
  --lf-input-bg: rgba(255, 255, 255, 0.05);
}
```

### BEM Class Structure

```css
.lead-form                    /* Root container */
.lead-form--light/--dark      /* Theme modifier */
.lead-form__container         /* Inner wrapper */
.lead-form__content           /* Step content area */
.lead-form__step              /* Individual step */
.lead-form__greeting          /* "Nice to meet you, {name}" */
.lead-form__question          /* Main question text */
.lead-form__subtext           /* Helper text below question */
.lead-form__fields            /* Input field container */
.lead-form__field             /* Single field wrapper */
.lead-form__field-row         /* Side-by-side fields */
.lead-form__label             /* Field label */
.lead-form__input             /* Text input */
.lead-form__input--error      /* Error state */
.lead-form__textarea          /* Multi-line input */
.lead-form__options           /* Option button container */
.lead-form__options--grid     /* 2-column grid variant */
.lead-form__option            /* Option button */
.lead-form__option--selected  /* Selected state */
.lead-form__option-key        /* Keyboard shortcut badge */
.lead-form__option-label      /* Option text */
.lead-form__option-check      /* Checkmark container */
.lead-form__actions           /* Button container */
.lead-form__submit            /* Primary button */
.lead-form__secondary         /* Secondary button */
.lead-form__error             /* Error message */
.lead-form__section           /* Section divider */
.lead-form__section-label     /* Section heading */
.lead-form__calendly          /* Calendly embed container */
.lead-form__success           /* Success state */
.lead-form__success-icon      /* Checkmark icon */
.lead-form__success-title     /* "Thank you, {name}" */
.lead-form__success-message   /* Confirmation text */
.lead-form__keyboard-hint     /* "Press 1-6 to select" */
.lead-form__loading           /* Loading state */
.lead-form__spinner           /* Spinning loader */
```

### Animations

```css
/* Step entry animation */
@keyframes lf-enter {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Success state animation */
@keyframes lf-success {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Loading spinner */
@keyframes lf-spin {
  to {
    transform: rotate(360deg);
  }
}
```

---

## Keyboard Shortcuts

| Step | Keys | Action |
|------|------|--------|
| Goals | `1-6` | Toggle option |
| Timeline/Budget | `1-6` | Select option |
| Questions | `Y/N` or `1/2` | Select yes/no |

Desktop-only (hidden on mobile via `@media (min-width: 768px)`).

---

## Step Component Pattern

Each step follows this pattern:

```tsx
interface StepProps {
  data: Partial<LeadFormData>
  onUpdate: (data: Partial<LeadFormData>) => void
  onNext: () => void
  theme: FormTheme
  // Additional props per step
}

function SomeStep({ data, onUpdate, onNext, theme }: StepProps) {
  const [localState, setLocalState] = useState(data.someField || "")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate with Zod
    const result = someStepSchema.safeParse({ someField: localState })
    if (!result.success) {
      // Set errors
      return
    }
    
    // Update parent state
    onUpdate({ someField: localState })
    onNext()
  }

  return (
    <form onSubmit={handleSubmit} className="lead-form__step">
      {/* Question */}
      <div>
        <h2 className="lead-form__question">What's your question?</h2>
        <p className="lead-form__subtext">Helper text</p>
      </div>

      {/* Input fields or options */}
      <div className="lead-form__fields">
        {/* ... */}
      </div>

      {/* Actions */}
      <div className="lead-form__actions">
        <button type="submit" className="lead-form__submit">
          Continue
          <ArrowRightIcon className="lead-form__submit-icon" />
        </button>
      </div>
    </form>
  )
}
```

---

## Dependencies

```json
{
  "dependencies": {
    "react": "^18 or ^19",
    "zod": "^3.x",
    "lucide-react": "^0.x",  // Icons
    "clsx": "^2.x",          // Or any cn() utility
  }
}
```

The form uses standard React patterns and has minimal dependencies.

---

## Rebuild Checklist

1. **Types first** - Create `types.ts` with all interfaces and option arrays
2. **Validation** - Create `schema.ts` with Zod schemas for each step
3. **UTM hook** - Create `use-utm-params.ts` for marketing attribution
4. **State hook** - Create `use-lead-form.ts` with step logic
5. **Step components** - Build each step following the pattern above
6. **Main component** - Create `lead-form.tsx` to orchestrate steps
7. **Styles** - Create `lead-form.css` with CSS variables and BEM classes
8. **API endpoint** - Create POST handler with validation and webhook forwarding
9. **Integration** - Use `<LeadForm mode="..." />` in pages

---

## Notes for Implementation

1. **Scroll behavior** - Form scrolls to top when step changes (uses `scrollIntoView`)
2. **Error handling** - API returns success even if webhook fails (logs data for recovery)
3. **Graceful degradation** - Works without Calendly/Zapier in dev mode
4. **Accessibility** - Form uses semantic HTML, proper labels, keyboard navigation
5. **Mobile-first** - Grid layouts stack on mobile, keyboard hints hidden
6. **Personalization** - Steps use first name for conversational feel

---

*Generated from Prime Capital Dubai codebase, January 2026*
