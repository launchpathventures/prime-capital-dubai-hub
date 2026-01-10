# LMS Content Audit — Competency 4: Property Matching

**Status:** 📋 READY  
**Priority:** Critical  
**Estimated Time:** 15-20 minutes  
**Parent Brief:** [lms-content-audit-master.md](lms-content-audit-master.md)  

---

## Scope

Audit and fix all content files in `content/lms/4-property-matching/`:

| File | Type |
|------|------|
| `_index.md` | Competency Index |
| `4.1-property-evaluation.md` | Module |
| `4.2-matching-criteria.md` | Module |
| `4.3-viewing-preparation.md` | Module |
| `4.4-viewing-execution.md` | Module |
| `4.5-comparative-analysis.md` | Module |
| `4.6-recommendation-strategy.md` | Module |
| `4.7-decision-facilitation.md` | Module |

Plus related quizzes in `content/lms/quizzes/property-matching-*.md`.

---

## Instructions

### Step 1: Read All Files

```bash
content/lms/4-property-matching/_index.md
content/lms/4-property-matching/4.1-property-evaluation.md
content/lms/4-property-matching/4.2-matching-criteria.md
content/lms/4-property-matching/4.3-viewing-preparation.md
content/lms/4-property-matching/4.4-viewing-execution.md
content/lms/4-property-matching/4.5-comparative-analysis.md
content/lms/4-property-matching/4.6-recommendation-strategy.md
content/lms/4-property-matching/4.7-decision-facilitation.md
```

### Step 2: Validate Competency Index

```yaml
---
title: "Property Matching"      # Required
slug: "property-matching"       # Required
competencyNumber: 4             # Required
description: "..."              # Required
estimatedDuration: "..."        # Required
moduleCount: 7                  # Required
---
```

### Step 3: Validate Each Module

```yaml
---
title: "..."                    # Required
slug: "..."                     # Required
moduleNumber: "4.1"             # Required
competency: "property-matching" # Required
competencyNumber: 4             # Required
type: "knowledge"               # Required
description: "..."              # Required
estimatedDuration: "..."        # Required
order: 1                        # Required: 1-7
---
```

### Step 4: Fix Issues

Apply standard fixes per master brief.

### Step 5: Record Fixes

Update `content/lms/4-property-matching/AUDIT.md`.

---

## Success Criteria

- [ ] `_index.md` has all required fields
- [ ] All 7 module files have all required fields
- [ ] `moduleCount: 7` is accurate
- [ ] Module numbers sequential: 4.1 through 4.7
- [ ] Order values sequential: 1 through 7
- [ ] All slugs match filenames
- [ ] AUDIT.md updated
