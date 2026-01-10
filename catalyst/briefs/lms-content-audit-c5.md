# LMS Content Audit — Competency 5: Transaction Management

**Status:** 📋 READY  
**Priority:** Critical  
**Estimated Time:** 25-30 minutes  
**Parent Brief:** [lms-content-audit-master.md](lms-content-audit-master.md)  

---

## Scope

Audit and fix all content files in `content/lms/5-transaction-management/`:

| File | Type |
|------|------|
| `_index.md` | Competency Index |
| `5.1-transaction-overview.md` | Module |
| `5.2-documentation.md` | Module |
| `5.3-mou-process.md` | Module |
| `5.4-spa-fundamentals.md` | Module |
| `5.5-payment-structures.md` | Module |
| `5.6-mortgage-coordination.md` | Module |
| `5.7-noc-process.md` | Module |
| `5.8-transfer-procedures.md` | Module |
| `5.9-handover-process.md` | Module |
| `5.10-post-sale-support.md` | Module |
| `5.11-compliance-checklist.md` | Module |
| `5.12-troubleshooting.md` | Module |

This is the **largest competency** with 12 modules.

---

## Instructions

### Step 1: Read All Files

```bash
content/lms/5-transaction-management/_index.md
content/lms/5-transaction-management/5.1-transaction-overview.md
content/lms/5-transaction-management/5.2-documentation.md
content/lms/5-transaction-management/5.3-mou-process.md
content/lms/5-transaction-management/5.4-spa-fundamentals.md
content/lms/5-transaction-management/5.5-payment-structures.md
content/lms/5-transaction-management/5.6-mortgage-coordination.md
content/lms/5-transaction-management/5.7-noc-process.md
content/lms/5-transaction-management/5.8-transfer-procedures.md
content/lms/5-transaction-management/5.9-handover-process.md
content/lms/5-transaction-management/5.10-post-sale-support.md
content/lms/5-transaction-management/5.11-compliance-checklist.md
content/lms/5-transaction-management/5.12-troubleshooting.md
```

### Step 2: Validate Competency Index

```yaml
---
title: "Transaction Management" # Required
slug: "transaction-management"  # Required
competencyNumber: 5             # Required
description: "..."              # Required
estimatedDuration: "..."        # Required
moduleCount: 12                 # Required
---
```

### Step 3: Validate Each Module

```yaml
---
title: "..."                        # Required
slug: "..."                         # Required
moduleNumber: "5.1"                 # Required
competency: "transaction-management" # Required
competencyNumber: 5                 # Required
type: "knowledge"                   # Required
description: "..."                  # Required
estimatedDuration: "..."            # Required
order: 1                            # Required: 1-12
---
```

### Step 4: Fix Issues

Apply standard fixes per master brief.

### Step 5: Record Fixes

Update `content/lms/5-transaction-management/AUDIT.md`.

---

## Success Criteria

- [ ] `_index.md` has all required fields
- [ ] All 12 module files have all required fields
- [ ] `moduleCount: 12` is accurate
- [ ] Module numbers sequential: 5.1 through 5.12
- [ ] Order values sequential: 1 through 12
- [ ] All slugs match filenames
- [ ] AUDIT.md updated
