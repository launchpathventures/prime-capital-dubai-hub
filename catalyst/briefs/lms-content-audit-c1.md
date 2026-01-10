# LMS Content Audit — Competency 1: Market Intelligence

**Status:** 📋 READY  
**Priority:** Critical  
**Estimated Time:** 20-25 minutes  
**Parent Brief:** [lms-content-audit-master.md](lms-content-audit-master.md)  

---

## Scope

Audit and fix all content files in `content/lms/1-market-intelligence/`:

| File | Type |
|------|------|
| `_index.md` | Competency Index |
| `1.1-dubai-overview.md` | Module |
| `1.2-market-trends.md` | Module |
| `1.3-property-types.md` | Module |
| `1.4-key-areas.md` | Module |
| `1.5-developer-landscape.md` | Module |
| `1.6-legal-framework.md` | Module |
| `1.7-financing-options.md` | Module |
| `1.8-investment-analysis.md` | Module |
| `1.9-competitor-awareness.md` | Module |
| `1.10-source-intelligence.md` | Module |

Plus related quizzes in `content/lms/quizzes/market-intelligence-*.md`.

---

## Instructions

### Step 1: Read All Files

Read the frontmatter of each file:

```bash
content/lms/1-market-intelligence/_index.md
content/lms/1-market-intelligence/1.1-dubai-overview.md
content/lms/1-market-intelligence/1.2-market-trends.md
content/lms/1-market-intelligence/1.3-property-types.md
content/lms/1-market-intelligence/1.4-key-areas.md
content/lms/1-market-intelligence/1.5-developer-landscape.md
content/lms/1-market-intelligence/1.6-legal-framework.md
content/lms/1-market-intelligence/1.7-financing-options.md
content/lms/1-market-intelligence/1.8-investment-analysis.md
content/lms/1-market-intelligence/1.9-competitor-awareness.md
content/lms/1-market-intelligence/1.10-source-intelligence.md
```

### Step 2: Validate Competency Index

Check `_index.md` against required schema:

```yaml
---
title: "Market Intelligence"    # Required
slug: "market-intelligence"     # Required
competencyNumber: 1             # Required: must be 1
description: "..."              # Required
estimatedDuration: "4-5 hours"  # Required: string with unit
moduleCount: 10                 # Required: must be 10
learningObjectives: [...]       # Recommended
---
```

### Step 3: Validate Each Module

For each module file, check required fields:

```yaml
---
title: "..."                    # Required
slug: "..."                     # Required: match filename
moduleNumber: "1.1"             # Required: match filename
competency: "market-intelligence" # Required
competencyNumber: 1             # Required
type: "knowledge"               # Required
description: "..."              # Required
estimatedDuration: "..."        # Required: string
order: 1                        # Required: sequential 1-10
---
```

### Step 4: Fix Issues Directly

Edit files to fix any issues found:

| Issue | Action |
|-------|--------|
| Missing `competencyNumber` | Add `competencyNumber: 1` |
| Missing `moduleNumber` | Derive from filename |
| `module: 1.1` | Rename to `moduleNumber: "1.1"` |
| Missing `order` | Derive from moduleNumber |
| Missing `description` | Add from content |
| Missing `type` | Add `type: "knowledge"` |

### Step 5: Check Related Quizzes

Find and validate quizzes in `content/lms/quizzes/`:
- `market-intelligence-1.md`
- `market-intelligence-2.md`
- `market-intelligence-3.md`
- `market-intelligence-4.md`

Ensure `relatedModule` references valid module slugs.

### Step 6: Record Fixes

Update `content/lms/1-market-intelligence/AUDIT.md`:

```markdown
# Content Audit — Competency 1: Market Intelligence

**Last Audited:** [DATE]
**Audited By:** GitHub Copilot Agent

## Summary
- Files audited: 11 (index + 10 modules)
- Issues fixed: X
- Status: ✅ PASS / ⚠️ NEEDS REVIEW

## Fixes Applied
[Document each fix with before/after]

## Related Quizzes
- market-intelligence-1.md: ✅ Valid
- market-intelligence-2.md: ✅ Valid
- market-intelligence-3.md: ✅ Valid
- market-intelligence-4.md: ✅ Valid
```

---

## Success Criteria

- [ ] `_index.md` has all required fields
- [ ] All 10 module files have all required fields
- [ ] `moduleCount: 10` is accurate
- [ ] Module numbers sequential: 1.1 through 1.10
- [ ] Order values sequential: 1 through 10
- [ ] All slugs match filenames
- [ ] Related quizzes validated
- [ ] AUDIT.md updated
