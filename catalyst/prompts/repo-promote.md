# Repo Promote — Advance Project Stage

**Role:** You are guiding a Catalyst project through a **stage promotion**.

Stage promotions move the project from one quality bar to the next:
- POC → MVP (real users with real data)
- MVP → MMP (ready for paying customers)
- MMP → PROD (enterprise operations)

---

## Promotion Overview

| Promotion | From | To | Focus |
|-----------|------|-----|-------|
| POC → MVP | Prototype | Real users | Auth, database, core paths |
| MVP → MMP | Early product | Market ready | Polish, security, performance |
| MMP → PROD | Market ready | Production | Monitoring, recovery, support |

---

## Required Input

**Which promotion?**
- POC → MVP
- MVP → MMP
- MMP → PROD

If not specified, ask before proceeding.

---

## POC → MVP Promotion

### What Changes
| From (POC) | To (MVP) |
|------------|----------|
| Mock data | Real database |
| No auth | Real authentication |
| Happy path only | Basic error handling |
| Desktop demo | Responsive design |
| Hardcoded config | Environment variables |

### Checklist
- [ ] Authentication implemented
- [ ] Real database connected
- [ ] Core happy paths work end-to-end
- [ ] Basic form validation
- [ ] Responsive design functional
- [ ] Environment variables configured
- [ ] No hardcoded secrets

### What NOT to Do
- Don't add new features (scope creep)
- Don't optimise for performance yet
- Don't build comprehensive test coverage
- Don't implement every edge case

---

## MVP → MMP Promotion

### What Changes
| From (MVP) | To (MMP) |
|------------|----------|
| Basic error handling | Comprehensive handling |
| Works on mobile | Polished responsive |
| Core flows work | All edge cases handled |
| Functional UI | Polished, professional |
| Basic security | Security-reviewed |

### Checklist
- [ ] All UI states implemented (loading, error, empty)
- [ ] Comprehensive error handling
- [ ] Accessibility basics (keyboard nav, contrast)
- [ ] Performance acceptable
- [ ] Security review completed
- [ ] User documentation exists
- [ ] Basic monitoring in place

### What NOT to Do
- Don't add new features
- Don't over-engineer for scale you don't have
- Don't build enterprise features

---

## MMP → PROD Promotion

### What Changes
| From (MMP) | To (PROD) |
|------------|-----------|
| Basic monitoring | Comprehensive observability |
| Manual recovery | Automated backup/restore |
| Ad-hoc support | Support runbooks |
| Best-effort uptime | SLA-defined availability |

### Checklist
- [ ] Full monitoring and alerting
- [ ] Backup procedures documented and tested
- [ ] Incident response process defined
- [ ] Support runbooks exist
- [ ] SLA defined and measurable
- [ ] Rollback capability tested
- [ ] Data retention policies implemented

### What NOT to Do
- Don't add features during this phase
- Don't skip testing recovery procedures
- Don't deploy without runbooks
- Don't promise SLAs you can't measure

---

## Promotion Process

### Step 1: Assess Current State

Review the codebase for:
- What's mocked or incomplete
- What error handling is missing
- What breaks on different devices/scenarios
- What's hardcoded

### Step 2: Create Promotion Plan

Propose a phased plan:
1. **Foundation** — Core infrastructure changes
2. **Core** — Main functionality upgrades
3. **Polish** — Error handling, edge cases
4. **Validation** — Testing and verification

### Step 3: Implement in Phases

For each phase:
- Implement the changes
- Test the functionality
- Summarise what changed

### Step 4: Validate Readiness

Run appropriate audits:
- For MVP: Security (light), UX (light)
- For MMP: All audits at full level
- For PROD: Complete audits + operational readiness

### Step 5: Update Stage

When ready:
- Update `catalyst/project-state.md` stage field
- Update version if appropriate
- Document what was done

---

## Your First Response

> "Which stage promotion are you doing?
>
> - **POC → MVP** — Adding auth, database, and real data
> - **MVP → MMP** — Polish, security, and production readiness
> - **MMP → PROD** — Monitoring, recovery, and operations
>
> Tell me which one, and I'll assess the current state and create a promotion plan."
