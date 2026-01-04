# Catalyst Audit Pages — Cloud Agent Brief
> For a Cloud Agent to complete the 8 audit pages in the Catalyst docs (/docs/audits)

---

## What is Catalyst?

Catalyst is an **AI-assisted development kit** — a method and starter kit for building web apps faster with AI coding agents.

### The Method
A structured delivery workflow that progresses through 4 stages:
- **POC** (Proof of Concept) — Validate the idea works
- **MVP** (Minimum Viable Product) — Real users, real feedback
- **MMP** (Minimum Marketable Product) — Ready for paying customers
- **PROD** (Production) — Enterprise-ready, fully hardened

### The Kit
A Next.js starter with surfaces (web, app, docs, etc.), design system, and AI-friendly documentation.

### Key Principles
1. **Proof-led alignment** — Show working software, not just documents
2. **Durable decisions** — Capture decisions in artefacts that persist
3. **Staged advancement** — Harden deliberately as you advance through stages
4. **Human-led, AI-assisted** — Humans make decisions; AI helps execute

---

## Research Guidance

Before filling in audit content, **do web research** to find current best practices. Catalyst is designed for AI-assisted development, so incorporate patterns that work well with coding agents.

### Research Topics

| Audit | Research Focus |
|-------|----------------|
| Data & Security | OWASP 2024, Next.js security patterns, Supabase RLS best practices |
| Accessibility | WCAG 2.2 updates, automated a11y testing tools, React accessibility patterns |
| Design & Experience | Design system auditing, component library QA, responsive testing approaches |
| Speed & Performance | Core Web Vitals 2024 thresholds, Next.js App Router performance, edge caching patterns |
| Code & Testing | AI-assisted code review, test coverage strategies, TypeScript strict mode patterns |
| Deploy & Observe | Vercel deployment patterns, structured logging, error tracking with Sentry |
| Content & SEO | Next.js metadata API, structured data for SaaS, Core Web Vitals SEO impact |
| Integrations & Services | API resilience patterns, webhook security, circuit breaker implementations |

### AI-Assisted Development Patterns

Catalyst projects use AI coding agents (Claude, Cursor, Copilot). Research and incorporate:

- **AI-friendly code patterns** — How to write code that AI can understand and modify
- **Prompt-based auditing** — How developers ask AI to "run the security audit"
- **Automated checking** — What can AI verify automatically vs. what needs human review
- **Common AI mistakes** — What issues AI agents commonly introduce (and how to catch them)

### Sources to Check

- OWASP (owasp.org) — Security checklists and top 10
- Web.dev (web.dev) — Performance and Core Web Vitals
- A11y Project (a11yproject.com) — Accessibility checklists
- Next.js Docs (nextjs.org/docs) — Framework-specific patterns
- Vercel Docs (vercel.com/docs) — Deployment and observability

---

## Why Audits?

Catalyst has **Delivery Phases** (Brief, Build, Review, Refine) with built-in checkpoints that ask "should we proceed?" — but they don’t specify **HOW to verify quality**.

**Audits fill this gap.**

They are structured quality reviews you can run at any time — alone or with an AI coding agent. Each audit:
- Has **stage-appropriate expectations** (POC rigor ≠ Production rigor)
- Contains **concrete checklists** AI agents can work through
- Covers a **distinct quality dimension** with no overlap

### When Audits Are Used
- **At checkpoints** — Before Refine checkpoint, run relevant audits at target stage level
- **During development** — After building a feature, before a demo
- **Per surface** — Audit the whole project or focus on a specific surface
- **With AI** — "Run the Security audit at MVP level for the App surface"

---

## The 8 Audits

| # | Audit | File | Core Question | Parts |
|---|-------|------|---------------|-------|
| 1 | Data & Security | `audits/data/page.tsx` | Is this safe to use? | Auth & Access, Data Protection, API Security |
| 2 | Accessibility & Inclusion | `audits/accessibility/page.tsx` | Can everyone use this? | Keyboard & Focus, Screen Readers, Visual Clarity |
| 3 | Design & Experience | `audits/experience/page.tsx` | Is this pleasant to use? | Design Consistency, Interaction Quality, Responsive Behavior |
| 4 | Speed & Performance | `audits/performance/page.tsx` | Is this fast enough? | Load Performance, Runtime Efficiency |
| 5 | Code & Testing | `audits/code/page.tsx` | Is this maintainable? | Standards & Style, Test Coverage, Dependencies & Debt |
| 6 | Deploy & Observe | `audits/deploy/page.tsx` | Can we run and monitor this? | Deployment Pipeline, Observability, Resilience & Recovery |
| 7 | Content & SEO | `audits/content/page.tsx` | Is content ready for users? | Copy & Legal, Search & Discovery |
| 8 | Integrations & Services | `audits/integrations/page.tsx` | Do external services work? | Third-Party APIs, Webhooks & Events, Service Reliability |

---

## Your Task

For each audit page, you will **replace the placeholder content** with comprehensive, actionable checklists.

### Current Page Structure (Do Not Change)
Each page already has:
1. **Header** — Title, icon, core question, intro paragraph
2. **Audit parts section** — 2-3 cards with summary bullet points
3. **Stage expectations section** — POC/MVP/MMP/PROD cards
4. **Placeholder notice** — Yellow callout (REMOVE THIS)

### What You're Adding

For each audit part, expand the summary bullets into a **full checklist section** with:

1. **Checklist items** — 8-15 specific, actionable items per part
2. **Pass/Fail criteria** — What "good" looks like at each stage
3. **Common issues** — 3-5 things that frequently go wrong
4. **Quick fixes** — Practical remediation for common issues
5. **Tools & resources** — Links to relevant tools, docs, or commands

---

## Content Guidelines

### Tone & Style
- **Practical, not academic** — Write for developers who want to ship
- **Concise** — Short sentences, bullet points, tables
- **Actionable** — Every item should be checkable (yes/no, pass/fail)
- **Stage-aware** — Always clarify what's expected at each stage
- **AI-friendly** — Write so an AI agent can work through the checklist

### Checklist Item Format
Each checklist item should be:
- **Specific** — Not "check security" but "verify API routes require authentication"
- **Testable** — Can be verified with a clear yes/no answer
- **Scoped** — One thing per item, not compound checks

**Good examples:**
- ✓ "All API routes check user authentication before processing"
- ✓ "Password reset tokens expire within 1 hour"
- ✓ "Form inputs have associated labels (not just placeholders)"

**Bad examples:**
- ✗ "Security is good" (vague)
- ✗ "Check auth and permissions and session handling" (compound)
- ✗ "Consider accessibility" (not testable)

### Stage Expectations
Always frame expectations by stage:

| Stage | General Expectation |
|-------|---------------------|
| POC | Skip or awareness only — rough is fine |
| MVP | Light check — core flows work, obvious issues fixed |
| MMP | Full audit — ready for external users |
| PROD | Complete — enterprise-ready, monitored, documented |

### Writing for AI Agents
The checklists should work when a developer says:
> "Run the [Audit Name] audit at [Stage] level"

The AI agent should be able to:
1. Read the checklist
2. Examine the codebase
3. Report pass/fail for each item
4. Suggest fixes for failures

---

## Detailed Requirements Per Audit

### 1. Data & Security (`audits/data/page.tsx`)

**Auth & Access**
- Login flow security (CSRF, rate limiting, lockout)
- Session management (expiry, invalidation, storage)
- Password policies (complexity, hashing, reset flow)
- Role-based access control (RBAC implementation)
- Protected route enforcement
- OAuth/SSO integration (if applicable)

**Data Protection**
- Encryption at rest and in transit
- PII identification and handling
- GDPR/CCPA compliance basics
- Data retention policies
- Backup and recovery
- Audit logging for sensitive operations

**API Security**
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CORS configuration
- Rate limiting
- API authentication (tokens, keys)
- Secrets management (env vars, not hardcoded)
- OWASP Top 10 coverage

**Include:** Common vulnerability checklist, security headers to verify, example secure patterns

---

### 2. Accessibility & Inclusion (`audits/accessibility/page.tsx`)

**Keyboard & Focus**
- Tab order follows logical reading order
- All interactive elements focusable
- Focus indicators visible (not just outline: none)
- Skip links for main content
- No keyboard traps
- Escape closes modals/dropdowns
- Arrow key navigation where expected

**Screen Readers**
- Semantic HTML (nav, main, article, aside)
- Heading hierarchy (h1 → h2 → h3, no skips)
- Alt text for images (or empty alt for decorative)
- ARIA labels for icon buttons
- Live regions for dynamic content
- Form labels properly associated
- Error messages announced

**Visual Clarity**
- Color contrast (4.5:1 for text, 3:1 for large/UI)
- Text resizable to 200% without breaking
- No information conveyed by color alone
- Reduced motion preference respected
- Zoom to 400% still usable
- Focus visible in high contrast mode

**Include:** WCAG 2.1 AA checklist summary, testing tools (axe, Lighthouse, VoiceOver, NVDA)

---

### 3. Design & Experience (`audits/experience/page.tsx`)

**Design Consistency**
- Design tokens used (not hardcoded values)
- Spacing follows the scale
- Typography consistent (sizes, weights, line-height)
- Color palette adhered to
- Component variants used correctly
- Icons from consistent set

**Interaction Quality**
- Loading states for async operations
- Error states with helpful messages
- Empty states guide next action
- Success feedback (toasts, confirmations)
- Form validation inline and on submit
- Disabled states visually distinct
- Hover/active states consistent

**Responsive Behavior**
- Breakpoints consistent across app
- Mobile layouts tested (320px minimum)
- Touch targets 44px minimum
- No horizontal scroll on mobile
- Images scale appropriately
- Typography scales for readability

**Include:** Design system compliance checklist, common UX anti-patterns to avoid

---

### 4. Speed & Performance (`audits/performance/page.tsx`)

**Load Performance**
- Largest Contentful Paint (LCP) < 2.5s
- Cumulative Layout Shift (CLS) < 0.1
- Interaction to Next Paint (INP) < 200ms
- Bundle size within budget (e.g., < 200KB initial JS)
- Images optimized (WebP, proper sizing, lazy loading)
- Fonts optimized (subset, preload, display: swap)
- Critical CSS inlined
- Third-party scripts audited

**Runtime Efficiency**
- No N+1 database queries
- Queries use proper indexes
- Unnecessary re-renders eliminated
- Large lists virtualized
- Memory leaks checked
- Caching strategy defined (CDN, browser, API)
- Background tasks don't block UI

**Include:** Core Web Vitals targets, performance testing tools, common bottlenecks

---

### 5. Code & Testing (`audits/code/page.tsx`)

**Standards & Style**
- ESLint passes with no errors
- Prettier formatting consistent
- TypeScript strict mode (no any abuse)
- Naming conventions followed
- File structure matches conventions
- Import organization clean
- No console.logs in production code

**Test Coverage**
- Unit tests for utility functions
- Integration tests for critical flows
- API route tests
- Component tests for complex UI
- E2E tests for user journeys
- Test data isolated (not production)
- CI runs tests on every PR

**Dependencies & Debt**
- No critical vulnerabilities (npm audit)
- Dependencies < 6 months old for security patches
- Unused dependencies removed
- Bundle analyzed for bloat
- Tech debt documented with effort estimates
- Dead code removed
- TODO comments have linked issues

**Include:** Test coverage targets by stage, dependency audit commands, tech debt template

---

### 6. Deploy & Observe (`audits/deploy/page.tsx`)

**Deployment Pipeline**
- CI/CD pipeline runs on every push
- Builds are reproducible
- Environment variables separated by env
- Preview deployments for PRs
- Rollback capability tested
- Feature flags for risky changes
- Database migrations automated

**Observability**
- Structured logging (JSON, levels)
- Error tracking (Sentry, etc.) configured
- Request tracing for debugging
- Uptime monitoring active
- Performance monitoring (Core Web Vitals)
- Alerts for critical errors
- Dashboards for key metrics

**Resilience & Recovery**
- Error boundaries prevent full crashes
- Graceful degradation for failed services
- Retry logic with exponential backoff
- Health check endpoints exist
- Incident playbooks documented
- Backup restoration tested
- Recovery time objectives defined

**Include:** CI/CD checklist, monitoring setup guide, incident response template

---

### 7. Content & SEO (`audits/content/page.tsx`)

**Note:** This audit applies to **web surfaces only** (public-facing marketing/content pages).

**Copy & Legal**
- All placeholder text replaced
- Tone of voice consistent
- Spelling and grammar checked
- Legal pages exist (Terms, Privacy)
- Legal review completed
- Cookie consent implemented
- Contact information accurate
- Copyright year current

**Search & Discovery**
- Unique meta title per page (< 60 chars)
- Meta descriptions compelling (< 160 chars)
- Open Graph tags for social sharing
- Twitter Card tags configured
- Structured data (JSON-LD) where relevant
- Sitemap.xml generated and submitted
- Robots.txt correct (not blocking important pages)
- Canonical URLs set
- 404 page helpful

**Include:** SEO checklist, meta tag templates, structured data examples

---

### 8. Integrations & Services (`audits/integrations/page.tsx`)

**Third-Party APIs**
- API keys stored in environment variables
- Rate limits documented and respected
- Error responses handled gracefully
- Timeout configured (don't hang forever)
- Fallback behavior defined
- API versioning tracked
- SLA/uptime requirements understood

**Webhooks & Events**
- Webhook endpoints secured (signatures verified)
- Idempotency handled (duplicate delivery safe)
- Retry logic for outgoing webhooks
- Payload validation before processing
- Dead letter queue for failures
- Event ordering handled correctly
- Webhook logs for debugging

**Service Reliability**
- Circuit breakers for unstable services
- Graceful degradation when service down
- Health checks for dependencies
- Dependency status page monitored
- Failover strategy for critical services
- Service timeouts appropriate
- Connection pooling configured

**Include:** Integration checklist, circuit breaker patterns, webhook security best practices

---

## Implementation Notes

### Page Structure After Your Updates

Each audit page should have this structure after you fill it in:

```
1. Header (existing — don't change)
2. Audit parts overview (existing — keep the summary cards)
3. [NEW] Detailed checklists per part
   - Part 1: Full checklist with items, common issues, fixes
   - Part 2: Full checklist with items, common issues, fixes
   - Part 3: Full checklist with items, common issues, fixes
4. Stage expectations (existing — keep but can enhance)
5. [NEW] Tools & Resources section
6. [NEW] Related audits (cross-links)
7. REMOVE the placeholder notice
```

### Component Patterns to Use

Use these existing component patterns from the codebase:

```tsx
// For checklist sections
<section className="space-y-4">
  <h2 className="text-xl font-semibold">{partTitle}</h2>
  <ChecklistGroup items={[...]} stage="mvp" />
</section>

// For common issues
<section className="rounded-xl border border-amber-200 bg-amber-50 p-5">
  <h3 className="font-semibold">Common issues</h3>
  <ul>...</ul>
</section>

// For tools/resources
<section className="rounded-xl border p-5">
  <h3 className="font-semibold">Tools & resources</h3>
  <ul>...</ul>
</section>
```

### Creating New Components

If you need new components (e.g., `ChecklistItem`, `ChecklistGroup`), create them at the bottom of each page file as helper components, following the existing pattern in the placeholder pages.

---

## Quality Checklist for Your Work

Before submitting each audit page, verify:

- [ ] Placeholder notice removed
- [ ] Each part has 8-15 specific, testable checklist items
- [ ] Stage expectations are clear (what's required at POC vs. PROD)
- [ ] Common issues section with 3-5 items per part
- [ ] Quick fixes are practical and actionable
- [ ] Tools & resources section with relevant links
- [ ] Cross-links to related audits
- [ ] Tone is practical, concise, and developer-friendly
- [ ] Content works for AI agents to execute

---

## Reference Files

Read these for additional context:

1. **Catalyst overview**: `catalyst/CATALYST.md`
2. **Workflow overview**: `app/(docs)/docs/workflow/page.tsx`
3. **Roles & collaboration**: `app/(docs)/docs/workflow/roles/page.tsx`
4. **Delivery cycles**: `app/(docs)/docs/workflow/delivery/page.tsx`
5. **Stage workflows**: `app/(docs)/docs/workflow/poc/`, `mvp/`, `mmp/`, `production/`
6. **Existing hardening content**: `app/(docs)/docs/develop/hardening/page.tsx`
7. **Upgrade checklists**: `app/(docs)/docs/develop/upgrade-checklists/page.tsx`
8. **Audits overview page**: `app/(docs)/docs/audits/page.tsx`
9. **Example audit placeholder**: `app/(docs)/docs/audits/data/page.tsx`
10. **Design system docs**: `app/(docs)/docs/design/page.tsx`

---

## Deliverables

Update these 8 files with comprehensive content:

1. `app/(docs)/docs/audits/data/page.tsx`
2. `app/(docs)/docs/audits/accessibility/page.tsx`
3. `app/(docs)/docs/audits/experience/page.tsx`
4. `app/(docs)/docs/audits/performance/page.tsx`
5. `app/(docs)/docs/audits/code/page.tsx`
6. `app/(docs)/docs/audits/deploy/page.tsx`
7. `app/(docs)/docs/audits/content/page.tsx`
8. `app/(docs)/docs/audits/integrations/page.tsx`

Each page should be **production-ready documentation** that Catalyst developers can use immediately.

---

## Final Notes

- **Be comprehensive but not exhaustive** — Cover the important items, not every edge case
- **Be practical** — These are for real developers shipping real products
- **Be stage-aware** — Always clarify what matters at each stage
- **Be AI-friendly** — Write so an AI agent can execute the audit programmatically
- **Be consistent** — Same structure and tone across all 8 audits

Good luck! 🚀
