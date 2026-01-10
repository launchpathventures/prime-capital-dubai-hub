# LMS Content Audit — Competency 6: Objection Navigation

**Status:** 📋 READY  
**Priority:** Critical  
**Estimated Time:** 15-20 minutes  
**Parent Brief:** [lms-content-audit-master.md](lms-content-audit-master.md)  

---

## Scope

Audit and fix all content files in `content/lms/6-objection-navigation/`:

| File | Type |
|------|------|
| `_index.md` | Competency Index |
| `6.1-objection-psychology.md` | Module |
| `6.2-common-objections.md` | Module |
| `6.3-price-objections.md` | Module |
| `6.4-timing-objections.md` | Module |
| `6.5-trust-objections.md` | Module |
| `6.6-reframing-techniques.md` | Module |
| `6.7-objection-prevention.md` | Module |

Plus related quizzes in `content/lms/quizzes/objection-navigation-*.md`.

---

## Instructions

### Step 1: Read All Files

```bash
content/lms/6-objection-navigation/_index.md
content/lms/6-objection-navigation/6.1-objection-psychology.md
content/lms/6-objection-navigation/6.2-common-objections.md
content/lms/6-objection-navigation/6.3-price-objections.md
content/lms/6-objection-navigation/6.4-timing-objections.md
content/lms/6-objection-navigation/6.5-trust-objections.md
content/lms/6-objection-navigation/6.6-reframing-techniques.md
content/lms/6-objection-navigation/6.7-objection-prevention.md
```

### Step 2: Validate Competency Index

```yaml
---
title: "Objection Navigation"   # Required
slug: "objection-navigation"    # Required
competencyNumber: 6             # Required
description: "..."              # Required
estimatedDuration: "..."        # Required
moduleCount: 7                  # Required
---
```

### Step 3: Validate Each Module

```yaml
---
title: "..."                      # Required
slug: "..."                       # Required
moduleNumber: "6.1"               # Required
competency: "objection-navigation" # Required
competencyNumber: 6               # Required
type: "knowledge"                 # Required: or "skills"
description: "..."                # Required
estimatedDuration: "..."          # Required
order: 1                          # Required: 1-7
---
```

### Step 4: Fix Issues

Apply standard fixes per master brief.

### Step 5: Record Fixes

Update `content/lms/6-objection-navigation/AUDIT.md`.

---

## Success Criteria

- [ ] `_index.md` has all required fields
- [ ] All 7 module files have all required fields
- [ ] `moduleCount: 7` is accurate
- [ ] Module numbers sequential: 6.1 through 6.7
- [ ] Order values sequential: 1 through 7
- [ ] All slugs match filenames
- [ ] AUDIT.md updated
