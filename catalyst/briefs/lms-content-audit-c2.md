# LMS Content Audit — Competency 2: Client Discovery

**Status:** 📋 READY  
**Priority:** Critical  
**Estimated Time:** 15-20 minutes  
**Parent Brief:** [lms-content-audit-master.md](lms-content-audit-master.md)  

---

## Scope

Audit and fix all content files in `content/lms/2-client-discovery/`:

| File | Type |
|------|------|
| `_index.md` | Competency Index |
| `2.1-first-impressions.md` | Module |
| `2.2-active-listening.md` | Module |
| `2.3-questioning-techniques.md` | Module |
| `2.4-needs-assessment.md` | Module |
| `2.5-client-profiling.md` | Module |
| `2.6-rapport-building.md` | Module |
| `2.7-qualification-framework.md` | Module |

Plus related quizzes in `content/lms/quizzes/client-discovery-*.md`.

---

## Instructions

### Step 1: Read All Files

```bash
content/lms/2-client-discovery/_index.md
content/lms/2-client-discovery/2.1-first-impressions.md
content/lms/2-client-discovery/2.2-active-listening.md
content/lms/2-client-discovery/2.3-questioning-techniques.md
content/lms/2-client-discovery/2.4-needs-assessment.md
content/lms/2-client-discovery/2.5-client-profiling.md
content/lms/2-client-discovery/2.6-rapport-building.md
content/lms/2-client-discovery/2.7-qualification-framework.md
```

### Step 2: Validate Competency Index

```yaml
---
title: "Client Discovery"       # Required
slug: "client-discovery"        # Required
competencyNumber: 2             # Required
description: "..."              # Required
estimatedDuration: "..."        # Required: string
moduleCount: 7                  # Required
---
```

### Step 3: Validate Each Module

```yaml
---
title: "..."                    # Required
slug: "..."                     # Required
moduleNumber: "2.1"             # Required
competency: "client-discovery"  # Required
competencyNumber: 2             # Required
type: "knowledge"               # Required: or "skills"
description: "..."              # Required
estimatedDuration: "..."        # Required
order: 1                        # Required: 1-7
---
```

### Step 4: Fix Issues

Apply standard fixes per master brief.

### Step 5: Record Fixes

Update `content/lms/2-client-discovery/AUDIT.md`.

---

## Success Criteria

- [ ] `_index.md` has all required fields
- [ ] All 7 module files have all required fields
- [ ] `moduleCount: 7` is accurate
- [ ] Module numbers sequential: 2.1 through 2.7
- [ ] Order values sequential: 1 through 7
- [ ] All slugs match filenames
- [ ] AUDIT.md updated
