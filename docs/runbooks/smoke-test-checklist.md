# Smoke Test Checklist

## Overview

This checklist should be completed before and after every production deployment to verify critical functionality.

## Pre-Deployment Checklist

### Local Verification

- [ ] `pnpm build` completes without errors
- [ ] `pnpm tsc --noEmit` passes type checking
- [ ] `pnpm lint` passes without errors
- [ ] `pnpm test:run` passes all tests
- [ ] Environment variables documented in `.env.example`

### Code Review

- [ ] PR reviewed and approved
- [ ] No sensitive data in code (API keys, passwords)
- [ ] Database migrations reviewed (if any)
- [ ] Breaking changes documented

---

## Post-Deployment Smoke Tests

Complete these tests immediately after deployment completes.

### 1. Homepage & Navigation

| Test | Expected Result | Pass |
|------|-----------------|------|
| Homepage loads | Page renders without errors | [ ] |
| Navigation works | All nav links work | [ ] |
| Mobile menu | Opens and closes properly | [ ] |
| Logo links to home | Clicking logo goes to / | [ ] |
| Footer links work | All footer links valid | [ ] |

### 2. Contact Form (Critical Path)

| Test | Expected Result | Pass |
|------|-----------------|------|
| Form loads | Form renders on /contact | [ ] |
| Validation shows | Error messages appear for invalid input | [ ] |
| Valid submission | Form submits successfully | [ ] |
| Success message | User sees confirmation | [ ] |

**Test Data:**
```
First Name: Test
Last Name: User
Email: test@example.com (use real email to verify)
WhatsApp: +971501234567
Goals: Buy a move-in-ready property
Timeline: Immediate
Budget: AED 3-6 million
```

### 3. Property Pages

| Test | Expected Result | Pass |
|------|-----------------|------|
| Properties list loads | /properties shows listings | [ ] |
| Filters work | Filter controls function | [ ] |
| Property detail page | Individual property loads | [ ] |
| Images load | Property images display | [ ] |
| Contact buttons work | CTA opens contact form | [ ] |

### 4. Team Pages

| Test | Expected Result | Pass |
|------|-----------------|------|
| Team list loads | /team shows team members | [ ] |
| Team member profile | Individual profiles load | [ ] |
| Contact links work | Email/phone links work | [ ] |

### 5. Authentication (Learn Surface)

| Test | Expected Result | Pass |
|------|-----------------|------|
| Login page loads | /auth/login renders | [ ] |
| Invalid login rejected | Error shown for wrong credentials | [ ] |
| Valid login succeeds | User redirected to /learn | [ ] |
| Session persists | Refresh keeps user logged in | [ ] |
| Logout works | User signed out, redirected | [ ] |

**Test Credentials:**
- Use test account or create temporary user
- Do NOT use production admin credentials for testing

### 6. Learn Dashboard (Authenticated)

| Test | Expected Result | Pass |
|------|-----------------|------|
| Dashboard loads | /learn shows progress | [ ] |
| Module list displays | Competencies and modules shown | [ ] |
| Module content loads | Can view module content | [ ] |
| Quiz starts | Can begin a quiz | [ ] |
| Quiz submission | Quiz can be submitted | [ ] |

### 7. Admin Functions (Admin Only)

| Test | Expected Result | Pass |
|------|-----------------|------|
| Admin dashboard | /learn/admin accessible | [ ] |
| User list loads | Can see user list | [ ] |
| Create user works | Can create new user | [ ] |
| Progress visible | Can see learner progress | [ ] |

### 8. API Health

| Test | Expected Result | Pass |
|------|-----------------|------|
| Leads API | POST /api/leads returns 200 | [ ] |
| Rate limiting | Multiple requests get 429 | [ ] |
| GET rejected | GET /api/leads returns 405 | [ ] |

### 9. Performance Checks

| Test | Expected Result | Pass |
|------|-----------------|------|
| LCP < 2.5s | Largest Contentful Paint acceptable | [ ] |
| No console errors | Browser console clean | [ ] |
| Images optimized | Next.js Image optimization working | [ ] |
| Caching headers | Static assets cached | [ ] |

### 10. Mobile Responsiveness

| Test | Expected Result | Pass |
|------|-----------------|------|
| Mobile layout | Pages render correctly on mobile | [ ] |
| Touch targets | Buttons/links are tappable | [ ] |
| Form usability | Forms work on mobile | [ ] |
| Navigation | Mobile menu functional | [ ] |

---

## Quick Smoke Test (5-minute version)

For minor deployments, run this abbreviated version:

1. [ ] Homepage loads
2. [ ] Contact form submits successfully
3. [ ] Login works
4. [ ] Learn dashboard accessible
5. [ ] No console errors

---

## Rollback Triggers

Immediately rollback if ANY of the following occur:

- Homepage returns 500 error
- Contact form completely broken
- Login completely broken
- Database connection errors
- Critical console errors affecting functionality

See [Deployment Rollback](./deployment-rollback.md) for rollback procedures.

---

## Test Environments

| Environment | URL | Purpose |
|-------------|-----|---------|
| Production | https://primecapitaldubai.com | Live site |
| Preview | Vercel preview URL | PR testing |
| Local | http://localhost:3000 | Development |

---

## Automated Testing

In addition to manual smoke tests, ensure CI/CD runs:

```bash
# Run before deployment
pnpm test:run
pnpm tsc --noEmit
pnpm lint
pnpm build
```

---

## Sign-off

After completing smoke tests:

- **Tester**: _______________
- **Date**: _______________
- **Deployment ID**: _______________
- **All tests pass**: [ ] Yes [ ] No
- **Notes**: _______________

If tests fail, document which tests failed and escalate to technical lead.
