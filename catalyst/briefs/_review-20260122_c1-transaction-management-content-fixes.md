# C1: Transaction Management Content Fixes

> **Priority:** HIGH | **Audio Regen Required:** YES (4 modules affected)

---

## Context

User feedback from LMS learners identified critical factual errors in Transaction Management content that could lead agents to give incorrect advice. These are not enhancements—they are corrections to inaccurate information.

**Resources Available:**
- ✅ Form A YouTube: https://www.youtube.com/watch?v=VHP9fR_r96o
- ✅ Form B YouTube: https://www.youtube.com/watch?v=1nYNgbXBpgI
- ✅ Form F YouTube: https://www.youtube.com/watch?v=KzyupPGXmss
- ✅ Form I (Agent-to-Agent Agreement): PDF provided
- ✅ Oqood Example: `/public/images/lms/documents/Oqood Example.pdf`
- ✅ Form Overview Diagram: Image provided

---

## Goal

Fix factual errors in Transaction Management modules to ensure agents receive accurate, up-to-date procedural information.

---

## Scope

### Module: `mou-formf` (5 feedback items)

**1. Form F Execution — REWRITE REQUIRED**
- **Current:** Describes old paper-based Form F execution procedure
- **Issue:** Process is now fully digital
- **Action:** Rewrite section to describe new online procedure
- **Audio:** REGENERATE required

**2. Deposit Holding — FACTUAL CORRECTION**
- **Current:** "NEVER hold deposits as agent"
- **Issue:** Incorrect. Legally, the seller's agent holds the deposit when no conveyancing company is used
- **Action:** Correct to: "Deposits are typically held by conveyancing company. When not using conveyancing, the seller's agent holds the deposit."
- **Audio:** REGENERATE required

**3. Form Definitions — CORRECTION**
- **Current:** Mentions Form A = agency agreement
- **Issue:** Incomplete and potentially confusing
- **Action:** Update to specify: Form A = Seller agreement, Form B = Buyer contract, Form F = MOU, Form I = Agent-to-Agent agreement
- **Audio:** REGENERATE required

**4. Add YouTube Tutorial Links**
- **Action:** Add links to official YouTube tutorials:
  - Form A: https://www.youtube.com/watch?v=VHP9fR_r96o
  - Form B: https://www.youtube.com/watch?v=1nYNgbXBpgI
  - Form F: https://www.youtube.com/watch?v=KzyupPGXmss
- **Audio:** No change needed (links are visual reference)

**5. Add Form I Information**
- **Current:** Form I (agent-to-agent agreement) not mentioned
- **Action:** Add section describing Form I purpose and when it's used
- **Source:** Form I PDF provided by user
- **Audio:** REGENERATE required (new content)

### Module: `oqood-registration` (1 feedback item)

**6. DLD Fee Split — FACTUAL CORRECTION**
- **Current:** "DLD 4% fee: Split 2% buyer, 2% seller (developer)"
- **Issue:** Incorrect. DLD fee is paid by buyer only, unless developer offers promotional discount
- **Action:** Correct to: "DLD 4% fee: Paid by buyer (some developers offer to cover as promotion)"
- **Audio:** REGENERATE required

### Module: `rera-contracts` (2 feedback items)

**7. 14-Day Cooling Off Period — CLARIFICATION**
- **Current:** States 14-day cooling off period applies to all off-plan
- **Issue:** Only applies if developer has specified it in the SPA
- **Action:** Add clarification: "The 14-day cooling off period applies if the Developer has mentioned it in the SPA"
- **Audio:** REGENERATE required

**8. Add Missing Contract Information**
- **Action:** 
  - Add Form B description (buyer contract)
  - Add Form I description (agent-to-agent agreement)
  - Add YouTube tutorial links for Form A, B, and F creation
- **Source:** Training manual
- **Audio:** REGENERATE required (new content)

### Module: `offplan-journey` (1 feedback item)

**9. Add Oqood Sample Document**
- **Current:** Shows sample Title Deed but no Oqood certificate sample
- **Issue:** Inconsistent—should show both document types
- **Action:** Add Oqood sample image from `/public/images/lms/documents/Oqood Example.pdf`
- **Audio:** No change needed (visual reference only)

### Module: `handover-process` (1 feedback item)

**10. Connection Fees — ENHANCEMENT**
- **Current:** Generic "Connection fees" in table
- **Issue:** Should specifically mention DEWA
- **Action:** Update to: "Connection fees (DEWA electricity/water)"
- **Audio:** REGENERATE required (minor, but spoken content affected)

---

## Acceptance Criteria

- [x] All 10 items addressed in module content
- [x] Module markdown files updated in `content/lms/` folder
- [x] Database `learning_modules` table updated via sync script
- [x] Essentials regenerated for affected modules (5 modules)
- [x] Audio transcripts regenerated for affected modules (4 modules)
- [x] New audio files generated via ElevenLabs for affected modules
  - ✅ 5.3-rera-contracts-intro
  - ✅ 5.6-oqood-registration-intro
  - ✅ 5.9-mou-formf-intro
  - ✅ 5.9-mou-formf-walkthrough
  - ✅ 5.11-handover-process-intro
  - ✅ 5.11-handover-process-walkthrough
- [x] Feedback items marked as `complete` in database (8 items)

---

## Dependencies

- ✅ **YouTube tutorial links:** Form A, B, F links confirmed
- ✅ **Form I draft:** PDF provided by user
- ✅ **Oqood sample:** Available at `/public/images/lms/documents/Oqood Example.pdf`

---

## Affected Modules Summary

| Module | Changes | Audio Regen |
|--------|---------|-------------|
| `mou-formf` | 5 fixes | YES |
| `oqood-registration` | 1 fix | YES |
| `rera-contracts` | 2 fixes | YES |
| `offplan-journey` | 1 enhancement | NO |
| `handover-process` | 1 fix | YES |

**Total modules requiring audio regeneration:** 4

---

## Notes

These are factual corrections that could impact agent advice quality. Prioritize over enhancements.
