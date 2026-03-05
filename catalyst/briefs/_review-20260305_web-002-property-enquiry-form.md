---
title: "Property Enquiry Form — Contextual, Returning-Lead Aware"
assignee: "@agent"
stage: mvp
tags: [lead-capture, forms, properties, crm, zapier]
---

# Property Enquiry Form

**A dedicated enquiry flow for property pages that adapts to returning leads and captures why a prospect is interested in a specific property.**

---

## Problem

Today, clicking "Enquire Now" on a property page redirects to `/contact?property={slug}` and runs the generic contact form. This has two issues:

1. **Returning leads repeat themselves.** Someone already in Bitrix who receives a property link from their agent must re-enter name, email, WhatsApp, goals, budget — all information the CRM already has. Friction kills re-engagement.

2. **Agents don't know *why* someone liked a property.** The form captures *that* someone enquired about a property, but not what attracted them or what they want to know. This forces the agent to start every follow-up with discovery questions instead of being prepared.

---

## Solution

A new `property-enquiry` form mode with two paths:

- **Returning leads** (identified by a Bitrix Lead ID in the URL) skip contact details and qualification — straight to property interest.
- **New leads** get the full flow but with property interest captured early, before qualification.

The form lives **inline on the property detail page** (not a redirect to `/contact`) so it can use property metadata to generate contextual preset options.

---

## User Flows

### Returning Lead (has `?bid={bitrixLeadId}`)

Agent shares a link like `primecapitaldubai.com/properties/palm-jebel-ali?bid=12345`.

```
┌──────────────────────────┐
│ 1. Property Interest     │  "What would you like to know?" + "What caught your eye?"
│    (presets + opt. notes) │
└────────────┬─────────────┘
             │
┌────────────▼─────────────┐
│ 2. Success               │  "Your agent has been notified"
└──────────────────────────┘
```

- No name, contact, goals, budget steps
- `bitrixLeadId` sent as hidden field so Zapier/Bitrix can match to existing record

### New Lead (no `bid`)

```
┌──────────────────────────┐
│ 1. Name                  │
└────────────┬─────────────┘
             │
┌────────────▼─────────────┐
│ 2. Contact               │
└────────────┬─────────────┘
             │
┌────────────▼─────────────┐
│ 3. Property Interest     │  Same step as returning lead
└────────────┬─────────────┘
             │
┌────────────▼─────────────┐
│ 4. Goals                 │
└────────────┬─────────────┘
             │
       ┌─────┴──────┐
       ▼            ▼
┌────────────┐ ┌─────────────┐
│ 5a. Budget │ │ 5b. Seller  │  (conditional on goals, same as contact mode)
│ & Timeline │ │   Details   │
└─────┬──────┘ └──────┬──────┘
      └───────┬───────┘
              ▼
┌──────────────────────────┐
│ 6. Questions             │
└────────────┬─────────────┘
             │
┌────────────▼─────────────┐
│ 7. Success               │
└──────────────────────────┘
```

---

## Property Interest Step (New)

This is the key new step. It uses **property metadata** to generate contextual presets so prospects tap rather than type.

### Section 1: "What would you like to know?"

Multi-select presets (always shown):

| Value | Label |
|-------|-------|
| `pricing` | Pricing & payment plans |
| `investment-analysis` | Investment analysis / ROI |
| `compare` | Compare with similar properties |
| `availability` | Check unit availability |
| `developer-info` | Understand the developer |

### Section 2: "What caught your eye?"

Multi-select presets. **Base options** always shown; **conditional options** appear based on property data.

**Always shown:**

| Value | Label |
|-------|-------|
| `location` | Location |
| `price-point` | Price point |
| `lifestyle` | Lifestyle fit |

**Conditional:**

| Value | Label | Condition |
|-------|-------|-----------|
| `payment-plan` | Payment plan flexibility | `completionStatus === "off-plan"` |
| `rental-yield` | Rental yield potential | `investment.estimatedRentalYield` exists |
| `developer` | Developer reputation | `developer` field is set |
| `completion-timeline` | Completion timeline | `completionStatus === "off-plan"` |
| `distressed-pricing` | Below-market pricing | `tags` includes `"distressed"` |

### Section 3: "Anything else?" (Optional)

- Free text textarea
- Placeholder: "Any specific questions or requirements..."
- **Not required** — the submit button is visible alongside it so there's zero friction to skip

---

## Property Context Props

The form needs property metadata to render conditional presets. Pass as props from the property detail page (no extra fetch needed):

```typescript
interface PropertyContext {
  slug: string
  title: string
  isOffPlan: boolean          // completionStatus === "off-plan"
  isDistressed: boolean       // tags includes "distressed"
  hasDeveloper: boolean       // developer field is set
  hasRentalYield: boolean     // investment.estimatedRentalYield exists
  developerName?: string      // For display in presets
}
```

---

## Returning Lead Identification

### URL Parameter

Property links shared by agents include the Bitrix Lead ID:

```
/properties/palm-jebel-ali?bid=12345
```

### Open Questions

- **Should `bid` be the raw Bitrix Lead ID?** This is simple but exposes CRM internals in URLs. Alternative: a hashed/encoded value that Zapier can decode.
- **For now:** Use raw ID. Can add encoding later if needed. The ID is not sensitive — it's an internal reference number, not PII.

### How it flows

1. Property page reads `bid` from URL search params
2. Passes it to the form as a prop
3. Form skips name/contact/goals/budget steps
4. `bitrixLeadId` included as hidden field in submission payload
5. Zapier matches to existing Bitrix record and logs the property interest

---

## Data Schema Changes

### New Fields on LeadFormData

```typescript
// Bitrix returning lead ID (from URL param)
bitrixLeadId?: string

// Property interest (new step)
enquiryIntent?: string[]        // What they want to know (multi-select)
propertyAppeals?: string[]      // What caught their eye (multi-select)
enquiryNotes?: string           // Optional free text
```

### New Fields on API Route (Zod)

```typescript
bitrixLeadId: z.string().max(50).optional(),
enquiryIntent: z.array(z.string().max(100)).max(10).optional(),
propertyAppeals: z.array(z.string().max(100)).max(10).optional(),
enquiryNotes: z.string().max(1000).optional(),
```

### Webhook Payload Additions

```typescript
// Returning lead matching
bitrixLeadId: leadData.bitrixLeadId || null,

// Property interest (human-readable labels)
enquiryIntent: leadData.enquiryIntent || [],
enquiryIntentLabels: leadData.enquiryIntent?.map(i => INTENT_LABELS[i]).filter(Boolean) || [],
propertyAppeals: leadData.propertyAppeals || [],
propertyAppealsLabels: leadData.propertyAppeals?.map(a => APPEAL_LABELS[a]).filter(Boolean) || [],
enquiryNotes: leadData.enquiryNotes || null,
```

---

## UI Placement

### Property Detail Page Changes

Replace the redirect-to-contact CTA with an **inline form section** on the property detail page.

**Where:** Below the main content / gallery, above the footer. Full-width section with the property's dark treatment (similar to the investment reasons card).

**Why inline, not modal:**
- Contextual — the visitor can still see the property details above
- No redirect — they stay on the page they're interested in
- Form can access property data directly via props (no fetch)

**The existing sidebar CTA card** ("Interested in this property?") becomes an anchor link that scrolls to the form section instead of linking to `/contact`.

**The hero "Enquire Now" button** also becomes an anchor scroll.

---

## Files to Create

| File | Purpose |
|------|---------|
| `components/shared/lead-form/steps/property-interest-step.tsx` | New step component |

## Files to Modify

| File | Change |
|------|--------|
| `components/shared/lead-form/types.ts` | Add `property-enquiry` mode, new field types, `PropertyContext` interface, preset option arrays |
| `components/shared/lead-form/use-lead-form.ts` | Add `property-enquiry` step sequence, read `bid` param, handle returning lead skip logic |
| `components/shared/lead-form/lead-form.tsx` | Accept `PropertyContext` prop, render new step, pass context |
| `app/(web)/properties/[slug]/page.tsx` | Inline form section, remove `/contact` redirect links, pass property context |
| `app/api/leads/route.ts` | Add new fields to Zod schema and webhook payload |

---

## Acceptance Criteria

- [ ] New `property-enquiry` form mode renders inline on property detail pages
- [ ] Form detects `bid` URL param and skips name/contact/goals/budget for returning leads
- [ ] Property interest step shows contextual presets based on property metadata
- [ ] Conditional presets appear/hide correctly (off-plan, distressed, yield, developer)
- [ ] Free text "Anything else?" is optional — form submits without it
- [ ] New leads get full qualification flow (property interest → goals → budget/timeline → questions)
- [ ] All new fields validated and sent to Zapier webhook
- [ ] `bitrixLeadId` included in payload for returning leads
- [ ] Existing form modes (`contact`, `landing`, `download`, `private`) unaffected
- [ ] Mobile-responsive — preset buttons are touch-friendly

---

## Out of Scope

- Bitrix-side automation to match `bitrixLeadId` (Zapier config, not code)
- Hashing/encoding the `bid` parameter (can add later)
- Pre-populating returning lead's name in the UI ("Welcome back, Ahmed")
- Property recommendation engine based on appeals
- A/B testing the step order

---

## Dependencies

- Existing lead form system (WEB-001) — extends, does not replace
- Lead context capture (completed) — builds on `referringProperty` pattern
- Zapier webhook — new fields need mapping on the Zapier side after deployment
