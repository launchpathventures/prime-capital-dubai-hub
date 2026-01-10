# LMS Content Audit — Competency 7: Relationship Stewardship

**Status:** 📋 READY  
**Priority:** Critical  
**Estimated Time:** 10-15 minutes  
**Parent Brief:** [lms-content-audit-master.md](lms-content-audit-master.md)  

---

## Scope

Audit and fix all content files in `content/lms/7-relationship-stewardship/`:

| File | Type |
|------|------|
| `_index.md` | Competency Index |
| `7.1-client-retention.md` | Module |
| `7.2-referral-generation.md` | Module |
| `7.3-network-building.md` | Module |
| `7.4-personal-branding.md` | Module |

This is the **smallest competency** with only 4 modules.

Plus related quizzes in `content/lms/quizzes/relationship-stewardship-*.md`.

---

## Instructions

### Step 1: Read All Files

```bash
content/lms/7-relationship-stewardship/_index.md
content/lms/7-relationship-stewardship/7.1-client-retention.md
content/lms/7-relationship-stewardship/7.2-referral-generation.md
content/lms/7-relationship-stewardship/7.3-network-building.md
content/lms/7-relationship-stewardship/7.4-personal-branding.md
```

### Step 2: Validate Competency Index

```yaml
---
title: "Relationship Stewardship" # Required
slug: "relationship-stewardship"  # Required
competencyNumber: 7               # Required
description: "..."                # Required
estimatedDuration: "..."          # Required
moduleCount: 4                    # Required
---
```

### Step 3: Validate Each Module

```yaml
---
title: "..."                          # Required
slug: "..."                           # Required
moduleNumber: "7.1"                   # Required
competency: "relationship-stewardship" # Required
competencyNumber: 7                   # Required
type: "knowledge"                     # Required
description: "..."                    # Required
estimatedDuration: "..."              # Required
order: 1                              # Required: 1-4
---
```

### Step 4: Fix Issues

Apply standard fixes per master brief.

### Step 5: Record Fixes

Update `content/lms/7-relationship-stewardship/AUDIT.md`.

---

## Success Criteria

- [ ] `_index.md` has all required fields
- [ ] All 4 module files have all required fields
- [ ] `moduleCount: 4` is accurate
- [ ] Module numbers sequential: 7.1 through 7.4
- [ ] Order values sequential: 1 through 4
- [ ] All slugs match filenames
- [ ] AUDIT.md updated
