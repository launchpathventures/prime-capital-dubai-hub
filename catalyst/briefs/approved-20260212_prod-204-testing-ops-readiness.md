# Brief: PROD Testing & Operational Readiness

**ID:** PROD-204
**Status:** Approved
**Priority:** P1 — High Value
**Surface:** App + API
**Estimate:** 1–2 days
**Tags:** testing, ops, production

---

## Objective

Raise test coverage for critical paths and create basic operational readiness artifacts required for production support.

---

## Background

Only 3 test files exist. No documented runbooks, rollback instructions, or backup policy are present. PROD requires minimum operational readiness.

---

## Tasks

### 1) Add tests for critical flows
- Auth flow: login, invalid login, logout
- Lead form API validation and rate limiting
- Quiz scoring / pass threshold logic
- Admin user invite flow

### 2) Add basic runbooks
- Document rollback steps for deployment
- Document how to rotate API keys
- Document how to recover from auth incidents

### 3) Define backup & retention policy
- Note Supabase backup strategy (daily snapshots or PITR)
- Document retention for LMS data

### 4) Smoke test checklist
- Define a checklist for pre-deploy validation

---

## Acceptance Criteria

- At least 8–10 targeted tests cover critical flows
- Runbooks exist for rollback, key rotation, and incident response
- Backup and retention policy documented
- Smoke test checklist ready for each deploy

---

## Non-Goals

- Full enterprise SRE tooling
- Load testing and stress testing
