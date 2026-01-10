# LMS Content Audit — Scenarios Folder

**Status:** 📋 READY  
**Priority:** Medium  
**Estimated Time:** 10-15 minutes  
**Parent Brief:** [lms-content-audit-master.md](lms-content-audit-master.md)  

---

## Scope

Audit and fix all scenario files in `content/lms/scenarios/`:

| File | Purpose |
|------|---------|
| `buyer-consultation.md` | Skills practice scenario |
| `listing-presentation.md` | Skills practice scenario |
| `negotiation-simulation.md` | Skills practice scenario |
| `objection-handling.md` | Skills practice scenario |
| `property-viewing.md` | Skills practice scenario |
| `closing-techniques.md` | Skills practice scenario |

Scenarios are **interactive practice exercises** tied to skills modules.

---

## Instructions

### Step 1: Read All Scenario Files

```bash
content/lms/scenarios/buyer-consultation.md
content/lms/scenarios/listing-presentation.md
content/lms/scenarios/negotiation-simulation.md
content/lms/scenarios/objection-handling.md
content/lms/scenarios/property-viewing.md
content/lms/scenarios/closing-techniques.md
```

### Step 2: Determine Scenario Schema

Scenarios have different frontmatter from modules/quizzes. Expected schema:

```yaml
---
title: "Scenario Title"                 # Required
slug: "scenario-slug"                   # Required: matches filename
type: "scenario"                        # Required: identifies content type
description: "Brief description..."     # Required
competencies: ["competency-1", "..."]   # Required: array of related competencies
difficulty: "intermediate"              # Required: beginner | intermediate | advanced
estimatedDuration: "30 minutes"         # Required
objectives:                             # Required
  - "Practice objective 1..."
  - "Practice objective 2..."
setup: "..."                            # Optional: scenario setup text
roles: ["buyer", "agent"]               # Optional: participants
createdAt: "2026-01-07"                 # Optional
updatedAt: "2026-01-07"                 # Optional
---
```

### Step 3: Map Scenarios to Competencies

| Scenario | Primary Competency | Secondary Competencies |
|----------|-------------------|----------------------|
| `buyer-consultation.md` | client-discovery | sales-mastery |
| `listing-presentation.md` | sales-mastery | market-intelligence |
| `negotiation-simulation.md` | sales-mastery | objection-navigation |
| `objection-handling.md` | objection-navigation | sales-mastery |
| `property-viewing.md` | property-matching | client-discovery |
| `closing-techniques.md` | sales-mastery | transaction-management |

### Step 4: Fix Issues

| Issue | Action |
|-------|--------|
| Missing `type` | Add `type: "scenario"` |
| Missing `competencies` | Derive from content |
| Missing `difficulty` | Default to `intermediate` |
| Missing `objectives` | Extract from content |
| Invalid competency refs | Fix to valid slugs |

### Step 5: Record Fixes

Create `content/lms/scenarios/AUDIT.md`:

```markdown
# Content Audit — Scenarios Folder

**Last Audited:** [DATE]
**Audited By:** GitHub Copilot Agent

## Summary
- Files audited: 6
- Issues fixed: X
- Status: ✅ PASS / ⚠️ NEEDS REVIEW

## Scenario Mapping
| Scenario | Competencies | Status |
|----------|--------------|--------|
| buyer-consultation | client-discovery, sales-mastery | ✅ |
| listing-presentation | sales-mastery, market-intelligence | ✅ |
| negotiation-simulation | sales-mastery, objection-navigation | ✅ |
| objection-handling | objection-navigation, sales-mastery | ✅ |
| property-viewing | property-matching, client-discovery | ✅ |
| closing-techniques | sales-mastery, transaction-management | ✅ |

## Fixes Applied
[Document each fix]
```

---

## Success Criteria

- [ ] All 6 scenario files have required fields
- [ ] All `competencies` reference valid competency slugs
- [ ] All `type` values are set to `"scenario"`
- [ ] All slugs match filenames
- [ ] AUDIT.md created with results

---

## Notes

- Scenarios are used for AI Coach role-play practice
- They tie together multiple competencies
- Lower priority than module/quiz audits
