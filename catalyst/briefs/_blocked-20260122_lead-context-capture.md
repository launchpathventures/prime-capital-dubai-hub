---
title: "Lead Context Capture - Property & Team Member Referrals"
assignee: "@agent"
stage: mvp
tags: [lead-capture, forms, zapier, crm]
---

# Lead Context Capture

**Track which property or team member drove the lead.**

---

## Problem

When a visitor clicks "Enquire Now" on a property detail page or "Schedule Consultation" on a team member page, they're redirected to the contact form. Currently, the form captures the `pageUrl` but loses the **context** of what specifically interested them:

- Which property were they viewing?
- Which team member did they want to consult with?
- What's that team member's email (for CRM routing)?

This context is valuable for:
- **Sales follow-up:** Know exactly what the lead is interested in
- **CRM routing:** Assign leads to the correct team member
- **Analytics:** Understand which properties/team members drive the most leads

---

## Solution

Pass context via URL query parameters and capture them in the lead form.

### User Flow

1. **Property Page:** User clicks "Enquire Now" → `/contact?property=azure-residences`
2. **Team Page:** User clicks "Schedule Consultation" → `/contact?teamMember=sarah-chen&teamMemberEmail=sarah@primecapitaldubai.com`
3. **Contact Form:** LeadForm reads URL params and includes them in submission
4. **API/Zapier:** New fields are validated and forwarded to Zapier for CRM

---

## Technical Scope

### 1. Update LeadFormData Type

**File:** `components/shared/lead-form/types.ts`

Add new optional fields:

```typescript
// Context from referring pages
referringProperty?: string      // Property slug from query param
referringTeamMember?: string    // Team member slug from query param  
referringTeamMemberEmail?: string // Team member email from query param
```

### 2. Update LeadForm to Capture URL Params

**File:** `components/shared/lead-form/use-lead-form.ts`

In the hook initialization, read URL search params and include in initial data:

- Read `property`, `teamMember`, `teamMemberEmail` from `window.location.search`
- Add to initial form data state
- Ensure these flow through to submission

### 3. Update Property Detail Page CTA

**File:** `app/(web)/properties/[slug]/page.tsx`

Change the "Enquire Now" button to pass property context:

```tsx
// Before
<Link href="/contact" />

// After  
<Link href={`/contact?property=${property.slug}`} />
```

Pass the property slug (or title) so Zapier/CRM knows which property.

### 4. Update Team Member Page CTA

**File:** `app/(web)/team/[slug]/page.tsx`

Change the "Schedule Consultation" button to pass team context:

```tsx
// Before
<Link href="/contact" />

// After
<Link href={`/contact?teamMember=${member.slug}&teamMemberEmail=${encodeURIComponent(member.email)}`} />
```

### 5. Update API Route Schema & Payload

**File:** `app/api/leads/route.ts`

Add to Zod schema:

```typescript
referringProperty: z.string().optional(),
referringTeamMember: z.string().optional(),
referringTeamMemberEmail: z.string().optional(),
```

Add to Zapier payload transformation:

```typescript
// Context from referring pages
propertyInterest: leadData.referringProperty || null,
assignToTeamMember: leadData.referringTeamMember || null,
teamMemberEmail: leadData.referringTeamMemberEmail || null,
```

---

## Acceptance Criteria

- [x] Property detail "Enquire Now" button includes `?property={slug}` in URL
- [x] Team member "Schedule Consultation" button includes `?teamMember={slug}&teamMemberEmail={email}` in URL
- [x] LeadForm reads URL params and includes in form data
- [x] API validates and accepts new fields without breaking existing submissions
- [x] Zapier payload includes `propertyInterest`, `assignToTeamMember`, `teamMemberEmail` fields
- [x] Works for direct `/contact` visits (fields are optional)
- [x] TypeScript types are updated

---

## Out of Scope

- CRM-side routing rules (Zapier/Bitrix configuration)
- Form UI changes (context is captured silently)
- Pre-filling visible form fields with context

---

## Files to Modify

| File | Change |
|------|--------|
| `components/shared/lead-form/types.ts` | Add new fields to `LeadFormData` |
| `components/shared/lead-form/use-lead-form.ts` | Read URL params on init |
| `app/(web)/properties/[slug]/page.tsx` | Update "Enquire Now" link |
| `app/(web)/team/[slug]/page.tsx` | Update "Schedule Consultation" link |
| `app/api/leads/route.ts` | Add schema fields, include in Zapier payload |

---

## Testing

1. Visit a property page → click "Enquire Now" → verify URL has `?property=...`
2. Complete form → check API logs for `referringProperty` field
3. Visit a team page → click "Schedule Consultation" → verify URL has params
4. Complete form → check API logs for team member fields
5. Visit `/contact` directly → form should work without errors (fields are null)

---

## Completion Notes

**Completed by:** GitHub Copilot
**Date:** 2026-01-22

### What was delivered
- Added `referringProperty`, `referringTeamMember`, `referringTeamMemberEmail` fields to `LeadFormData` type
- Updated `use-lead-form.ts` hook to read URL query params (`property`, `teamMember`, `teamMemberEmail`) on initialization and include them in submission
- Updated both "Enquire Now" buttons on property detail page to pass `?property={slug}`
- Updated "Schedule Consultation" button on team member page to pass `?teamMember={slug}&teamMemberEmail={email}`
- Added new fields to API route Zod schema for validation
- Added `propertyInterest`, `assignToTeamMember`, `teamMemberEmail` to Zapier payload

### What needs human review
- Test the full flow: property page → contact form → verify Zapier receives the fields
- Test the team member flow: team page → contact form → verify Zapier receives fields
- Configure Zapier/Bitrix to use these new fields for CRM routing

### Known limitations
- None - all acceptance criteria met
