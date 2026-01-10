# LMS Content Audit — Competency 3: Sales Mastery

**Status:** 📋 READY  
**Priority:** Critical  
**Estimated Time:** 20 minutes  
**Parent Brief:** [lms-content-audit-master.md](lms-content-audit-master.md)  

---

## Scope

Audit and fix all content files in `content/lms/3-sales-mastery/`:

| File | Type |
|------|------|
| `_index.md` | Competency Index |
| `3.1-sales-psychology.md` | Module |
| `3.2-presentation-skills.md` | Module |
| `3.3-value-proposition.md` | Module |
| `3.4-storytelling.md` | Module |
| `3.5-closing-techniques.md` | Module |
| `3.6-negotiation.md` | Module |
| `3.7-follow-up-systems.md` | Module |
| `3.8-crm-mastery.md` | Module |

Plus related quizzes in `content/lms/quizzes/sales-mastery-*.md`.

---

## Instructions

### Step 1: Read All Files

```bash
content/lms/3-sales-mastery/_index.md
content/lms/3-sales-mastery/3.1-sales-psychology.md
content/lms/3-sales-mastery/3.2-presentation-skills.md
content/lms/3-sales-mastery/3.3-value-proposition.md
content/lms/3-sales-mastery/3.4-storytelling.md
content/lms/3-sales-mastery/3.5-closing-techniques.md
content/lms/3-sales-mastery/3.6-negotiation.md
content/lms/3-sales-mastery/3.7-follow-up-systems.md
content/lms/3-sales-mastery/3.8-crm-mastery.md
```

### Step 2: Validate Competency Index

```yaml
---
title: "Sales Mastery"          # Required
slug: "sales-mastery"           # Required
competencyNumber: 3             # Required
description: "..."              # Required
estimatedDuration: "..."        # Required
moduleCount: 8                  # Required
---
```

### Step 3: Validate Each Module

```yaml
---
title: "..."                    # Required
slug: "..."                     # Required
moduleNumber: "3.1"             # Required
competency: "sales-mastery"     # Required
competencyNumber: 3             # Required
type: "knowledge"               # Required: or "skills"
description: "..."              # Required
estimatedDuration: "..."        # Required
order: 1                        # Required: 1-8
---
```

### Step 4: Fix Issues

Apply standard fixes per master brief.

### Step 5: Record Fixes

Update `content/lms/3-sales-mastery/AUDIT.md`.

---

## Success Criteria

- [ ] `_index.md` has all required fields
- [ ] All 8 module files have all required fields
- [ ] `moduleCount: 8` is accurate
- [ ] Module numbers sequential: 3.1 through 3.8
- [ ] Order values sequential: 1 through 8
- [ ] All slugs match filenames
- [ ] AUDIT.md updated
