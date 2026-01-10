# LMS Content Audit — Competency 0: Foundations

**Status:** 📋 READY  
**Priority:** Critical  
**Estimated Time:** 15-20 minutes  
**Parent Brief:** [lms-content-audit-master.md](lms-content-audit-master.md)  

---

## Scope

Audit and fix all content files in `content/lms/0-foundations/`:

| File | Type |
|------|------|
| `_index.md` | Competency Index |
| `0.1-company-orientation.md` | Module |
| `0.2-real-estate-basics.md` | Module |
| `0.3-prime-capital-tools.md` | Module |
| `0.4-communication-skills.md` | Module |
| `0.5-professional-standards.md` | Module |

Plus any related quizzes in `content/lms/quizzes/` that reference `foundations`.

---

## Instructions

### Step 1: Read All Files

Read the frontmatter of each file in the folder:

```bash
# Files to audit
content/lms/0-foundations/_index.md
content/lms/0-foundations/0.1-company-orientation.md
content/lms/0-foundations/0.2-real-estate-basics.md
content/lms/0-foundations/0.3-prime-capital-tools.md
content/lms/0-foundations/0.4-communication-skills.md
content/lms/0-foundations/0.5-professional-standards.md
```

### Step 2: Validate Competency Index

Check `_index.md` against required schema:

```yaml
---
title: "..."                    # Required
slug: "foundations"             # Required: must be "foundations"
competencyNumber: 0             # Required: must be 0
description: "..."              # Required
estimatedDuration: "..."        # Required: string with unit
moduleCount: 5                  # Required: must match actual file count
learningObjectives: [...]       # Recommended
---
```

**Known Issues to Fix:**
- If `competency: 0` exists, rename to `competencyNumber: 0`
- If `estimatedDuration: 240` (number), convert to `estimatedDuration: "4 hours"`
- If `slug` is missing, add `slug: "foundations"`

### Step 3: Validate Each Module

For each module file, check:

```yaml
---
title: "..."                    # Required
slug: "..."                     # Required: must match filename without prefix
moduleNumber: "0.1"             # Required: must match filename
competency: "foundations"       # Required
competencyNumber: 0             # Required
type: "knowledge"               # Required: knowledge | skills | skills-script
description: "..."              # Required
estimatedDuration: "..."        # Required: string with unit
order: 1                        # Required: sequential 1-5
---
```

**Derive from filename:** `0.1-company-orientation.md`
- `moduleNumber: "0.1"`
- `slug: "company-orientation"`
- `order: 1`

### Step 4: Fix Issues Directly

Do NOT just report issues. **Edit the files** to fix them.

| Issue | Action |
|-------|--------|
| `competency: 0` | Change to `competencyNumber: 0` |
| `module: 0.1` | Change to `moduleNumber: "0.1"` |
| `estimatedDuration: 45` | Change to `estimatedDuration: "45 minutes"` |
| Missing `description` | Add based on first paragraph of content |
| Missing `type` | Add `type: "knowledge"` |
| `moduleType: knowledge` | Change to `type: "knowledge"` |
| Missing `competency` | Add `competency: "foundations"` |
| Missing `slug` | Derive from filename |

### Step 5: Record Fixes

Create/update `content/lms/0-foundations/AUDIT.md`:

```markdown
# Content Audit — Competency 0: Foundations

**Last Audited:** [DATE]
**Audited By:** GitHub Copilot Agent

## Summary
- Files audited: 6
- Issues fixed: X
- Status: ✅ PASS / ⚠️ NEEDS REVIEW

## Fixes Applied

### _index.md
| Field | Before | After | Reason |
|-------|--------|-------|--------|
| ... | ... | ... | ... |

### 0.1-company-orientation.md
| Field | Before | After | Reason |
|-------|--------|-------|--------|
| ... | ... | ... | ... |

## Validation Checklist

- [ ] All required fields present in _index.md
- [ ] All required fields present in all modules
- [ ] moduleCount matches actual file count
- [ ] Module numbers are sequential (0.1, 0.2, 0.3, 0.4, 0.5)
- [ ] All slugs match filenames
- [ ] No duplicate slugs
```

---

## Success Criteria

- [ ] `_index.md` has all required fields with correct types
- [ ] All 5 module files have all required fields with correct types
- [ ] `moduleCount: 5` matches actual module count
- [ ] Module numbers are sequential: 0.1, 0.2, 0.3, 0.4, 0.5
- [ ] All `order` values are sequential: 1, 2, 3, 4, 5
- [ ] All slugs are lowercase-hyphenated and match filenames
- [ ] AUDIT.md updated with results

---

## Notes

- This competency has an existing AUDIT.md from Jan 9, 2026
- Previous audit fixed weak verb "Learn about" → "Articulate"
- Re-verify all changes are still in place
