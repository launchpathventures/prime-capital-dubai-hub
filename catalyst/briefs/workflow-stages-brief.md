# Workflow Stage Pages Brief
> For a Cloud Agent to complete the Workflow section of the docs (/docs/workflow)

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

Before filling in workflow content, **do web research** to find current best practices for AI-assisted development workflows.

### Research Topics

| Topic | What to Research |
|-------|------------------|
| AI-assisted delivery | How teams structure work when using AI coding agents |
| Staged deployment | Best practices for POC → MVP → Production progression |
| Delivery checkpoints | Industry patterns for release checkpoints and approvals |
| Agile + AI | How AI changes sprint cadence, review patterns, and velocity |
| Design in POCs | When and how to apply design systems at proof stage |
| Technical debt | Managing quality debt across stage promotions |

### AI-Assisted Development Patterns

Catalyst projects use AI coding agents (Claude, Cursor, Copilot). Research and incorporate:

- **AI pair programming rhythms** — How developers work with AI across a sprint
- **Review patterns for AI code** — What humans should verify vs. trust
- **Prompt engineering for workflows** — How to direct AI at different project stages
- **Velocity expectations** — How AI changes typical development timelines
- **Quality tradeoffs** — What shortcuts AI enables vs. what needs extra care

### Sources to Check

- Vercel/Next.js blog — Modern development patterns
- Anthropic/OpenAI documentation — AI assistant best practices
- Industry blogs (ThoughtWorks, Martin Fowler) — Staged delivery patterns
- DevOps resources — CI/CD and deployment cadence
- Agile community — How AI is changing sprint patterns

---

## Context

The Catalyst Workflow section has been restructured with individual pages for each delivery stage:

- **POC Workflow** (`/docs/workflow/poc`) - Already has content (review and align)
- **MVP Workflow** (`/docs/workflow/mvp`) - Placeholder, needs content
- **MMP Workflow** (`/docs/workflow/mmp`) - Placeholder, needs content
- **Production Workflow** (`/docs/workflow/production`) - Placeholder, needs content

The legacy "Stages" page contained valuable content that should be distributed across these individual pages. This brief provides the reference content and structure for filling them in.

---

## Legacy Content to Preserve

From the deleted `/docs/workflow/stages` page, each stage had:

### POC — Proof of Concept

**Quality Expectations:**
- Mock data is acceptable
- UI polish is secondary to function
- Error handling can be basic
- No authentication required
- Speed over completeness

**Anti-Patterns:**
- Building features beyond scope
- Premature optimisation
- Setting up production infrastructure
- Creating user accounts
- Integrating real payment systems

**Allowed:**
- Hardcoded data
- Simplified UI
- Missing edge case handling
- No tests (acceptable, not recommended)

**Not Allowed:**
- Real user data
- Production deployment
- Public URLs without protection

---

### MVP — Minimum Viable Product

**Quality Expectations:**
- Real data persistence
- User authentication
- Core happy-path tested
- Basic error handling
- Responsive design

**Anti-Patterns:**
- Feature creep beyond core
- Premature scaling
- Over-engineering solutions
- Building admin before user features

**Allowed:**
- Limited feature set
- Basic analytics
- Manual operational tasks
- Minimal documentation

**Not Allowed:**
- Known security vulnerabilities
- Data loss scenarios
- Missing core features

---

### MMP — Minimum Marketable Product

**Quality Expectations:**
- Feature complete for market
- Polished UI/UX
- Comprehensive error handling
- Performance optimised
- Security reviewed

**Anti-Patterns:**
- Launching without load testing
- Skipping security review
- No monitoring in place
- Missing support documentation

**Allowed:**
- Phased feature rollout
- Beta labelling for some features
- Manual processes for edge cases

**Not Allowed:**
- Unhandled errors
- Performance degradation under load
- Missing critical features

---

### PROD — Production

**Quality Expectations:**
- Full operational readiness
- Monitoring and alerting
- Backup and recovery tested
- Support runbook complete
- SLA defined and achievable

**Anti-Patterns:**
- Deploying without rollback plan
- Missing incident response process
- No on-call or support coverage
- Undocumented operational procedures

**Allowed:**
- Continuous improvement
- Feature additions via normal process
- Scheduled maintenance windows

**Not Allowed:**
- Untested deployments
- Missing monitoring
- No disaster recovery plan

---

### Stage Skipping Risks

Each stage exists for a reason:

- **POC → PROD skip:** Results in security vulnerabilities, data loss risks, and operational fragility.
- **MVP → PROD skip:** Leads to poor user experience, missing features, and support chaos.
- **MMP → PROD skip:** Causes operational failures, missing runbooks, and incident response gaps.

---

## Target Page Structure

Each workflow page should follow this structure:

### 1. Header
- Stage badge with color (blue=POC, amber=MVP, purple=MMP, emerald=PROD)
- Title: "{Stage} Workflow"
- Subtitle: One-sentence summary of what this stage is about

### 2. Purpose Section
- What this stage achieves
- Who it's for (stakeholders, early users, paying customers, enterprise)
- What "done" looks like

### 3. Duration & Cadence
- Typical timeframe
- Meeting rhythm (daily standups? weekly reviews?)
- How often to show stakeholders

### 4. Key Activities
- What gets built
- What gets tested
- What gets documented

### 5. Quality Bar
- Use the Quality Expectations from legacy content above
- Format as clear, scannable list

### 6. Boundaries
Grid with two columns:
- **Allowed:** What's acceptable at this stage
- **Not Allowed:** What should never happen

### 7. Anti-Patterns
- Common mistakes to avoid
- Warning about premature work

### 8. Promotion Criteria
- What must be true to move to next stage
- Link to relevant Audits that should pass
- Link to Delivery Cycles page

### 9. Links
- Previous/Next stage workflow
- Related Audits
- Design System (if relevant to stage)

---

## Component Patterns

Use the existing component patterns from the placeholder pages:

```tsx
// Stage badge
<span className="rounded-lg bg-amber-100 px-2.5 py-1 text-sm font-bold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
  MVP
</span>

// Info cards grid
<div className="grid gap-4 md:grid-cols-2">
  <div className="rounded-xl border p-4">
    <Text weight="medium">Title</Text>
    <Text size="sm" variant="muted" className="mt-1">Content</Text>
  </div>
</div>

// Boundaries grid
<div className="grid gap-4 sm:grid-cols-2">
  <div className="rounded-lg border border-success/30 bg-success/5 p-4">
    <h4 className="mb-2 font-medium text-success">Allowed</h4>
    <ul className="text-muted-foreground space-y-1 text-sm">
      <li>• Item</li>
    </ul>
  </div>
  <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
    <h4 className="mb-2 font-medium text-destructive">Not Allowed</h4>
    <ul className="text-muted-foreground space-y-1 text-sm">
      <li>• Item</li>
    </ul>
  </div>
</div>

// Warning callout
<section className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-950/20">
  <p className="text-sm font-medium text-amber-900 dark:text-amber-200">
    ⚠️ Warning text
  </p>
</section>
```

---

## Detailed Requirements Per Stage

### POC Workflow (`workflow/poc/page.tsx`)

**Already has content** — Review and align with the structure below. Ensure it includes:

- **Purpose:** Validate assumptions with working code. Stakeholders can see and steer.
- **Duration:** Typically 3-5 days with AI assistance (was 1-2 weeks before AI)
- **Cadence:** Daily check-ins, end-of-week demo
- **Key activities:** Core flow prototype, stakeholder demo, feedback capture
- **AI patterns:** AI builds fast, human reviews for intent alignment
- **Design:** Use design system basics (spacing, typography) but don't polish
- **Promotion to MVP:** Stakeholder approval, validated core flows, documented learnings

---

### MVP Workflow (`workflow/mvp/page.tsx`)

**Placeholder — needs full content.** Include:

- **Purpose:** Get real users using real features. Validate product-market fit.
- **Duration:** Typically 2-4 weeks depending on scope
- **Cadence:** Daily standups, twice-weekly demos
- **Key activities:** 
  - Add authentication and data persistence
  - Implement core happy paths
  - Deploy to staging environment
  - Onboard early users for feedback
- **AI patterns:** AI handles boilerplate (auth, CRUD), human focuses on UX decisions
- **Design:** Apply design system properly. Responsive design matters.
- **Quality bar:** Use legacy content (real data, auth, basic error handling)
- **Boundaries:** Use legacy Allowed/Not Allowed content
- **Anti-patterns:** Feature creep, premature scaling, admin-first development
- **Promotion to MMP:** Core features complete, early user feedback positive, no critical bugs

---

### MMP Workflow (`workflow/mmp/page.tsx`)

**Placeholder — needs full content.** Include:

- **Purpose:** Ready for paying customers. Polish and reliability.
- **Duration:** Typically 2-6 weeks depending on polish requirements
- **Cadence:** Regular QA cycles, stakeholder sign-offs
- **Key activities:**
  - UI/UX polish and consistency pass
  - Comprehensive error handling
  - Performance optimization
  - Security review and hardening
  - Documentation for users
- **AI patterns:** AI runs audits, human reviews findings and prioritizes fixes
- **Design:** Full design system compliance. All audits should pass.
- **Quality bar:** Use legacy content (feature complete, polished, security reviewed)
- **Boundaries:** Use legacy Allowed/Not Allowed content
- **Anti-patterns:** Launching without load testing, skipping security review
- **Promotion to PROD:** All audits pass, stakeholder sign-off, support processes defined

---

### PROD Workflow (`workflow/production/page.tsx`)

**Placeholder — needs full content.** Include:

- **Purpose:** Enterprise-ready. Operational excellence. Support and maintenance.
- **Duration:** Ongoing — this is the steady state
- **Cadence:** Scheduled releases, monitoring, incident response
- **Key activities:**
  - Monitoring and alerting setup
  - Backup and disaster recovery
  - Runbooks and documentation
  - On-call and support processes
  - Continuous improvement
- **AI patterns:** AI helps with incident triage, log analysis, routine maintenance
- **Design:** Design system updates go through proper review
- **Quality bar:** Use legacy content (operational readiness, SLAs, recovery tested)
- **Boundaries:** Use legacy Allowed/Not Allowed content
- **Anti-patterns:** Deploying without rollback, missing incident response
- **Stage skipping risks:** Include the warning content from legacy Stages page

---

## Content Guidelines

1. **Voice:** Direct, practical, scannable
2. **Length:** Each section should be concise — 2-4 sentences or bullet points
3. **Links:** Use Next.js `<Link>` component, not `<a>` tags
4. **Consistency:** All four stage pages should follow the same structure

---

## Files to Update

1. `app/(docs)/docs/workflow/mvp/page.tsx` - Replace placeholder with full content
2. `app/(docs)/docs/workflow/mmp/page.tsx` - Replace placeholder with full content
3. `app/(docs)/docs/workflow/production/page.tsx` - Replace placeholder with full content
4. `app/(docs)/docs/workflow/poc/page.tsx` - Review and align with new structure if needed

---

## Success Criteria

- [ ] All four stage workflow pages have consistent structure
- [ ] Legacy stage content is preserved across the new pages
- [ ] Stage skipping risks are captured (on Production page or Delivery page)
- [ ] Each page links to relevant Audits
- [ ] Each page links to previous/next stages
- [ ] Quality expectations are clear and actionable
- [ ] AI-assisted development patterns are incorporated
- [ ] Placeholder notices are removed
- [ ] Design System callout included where relevant

---

## Reference Files

Read these for additional context:

1. **Catalyst overview**: `catalyst/CATALYST.md`
2. **Workflow overview**: `app/(docs)/docs/workflow/page.tsx`
3. **Roles & collaboration**: `app/(docs)/docs/workflow/roles/page.tsx`
4. **Delivery cycles**: `app/(docs)/docs/workflow/delivery/page.tsx`
5. **POC workflow (existing)**: `app/(docs)/docs/workflow/poc/page.tsx`
6. **Audits overview**: `app/(docs)/docs/audits/page.tsx`
7. **Design system**: `app/(docs)/docs/design/page.tsx`
8. **Hardening guide**: `app/(docs)/docs/develop/hardening/page.tsx`

---

## Quality Checklist for Your Work

Before submitting each workflow page, verify:

- [ ] Placeholder notice removed
- [ ] Header matches stage color scheme (blue=POC, amber=MVP, purple=MMP, emerald=PROD)
- [ ] Purpose section explains what this stage achieves and who it's for
- [ ] Duration and cadence are realistic for AI-assisted development
- [ ] Key activities are specific and actionable
- [ ] Quality bar uses the legacy content provided above
- [ ] Boundaries grid shows Allowed vs. Not Allowed clearly
- [ ] Anti-patterns warn against common mistakes
- [ ] Promotion criteria link to relevant Audits
- [ ] Navigation links to previous/next stages work
- [ ] Tone is practical, concise, and developer-friendly
- [ ] Content incorporates AI-assisted development patterns from research

---

## Deliverables

Update these 4 files with comprehensive content:

1. `app/(docs)/docs/workflow/poc/page.tsx` — Review and align with new structure
2. `app/(docs)/docs/workflow/mvp/page.tsx` — Replace placeholder with full content
3. `app/(docs)/docs/workflow/mmp/page.tsx` — Replace placeholder with full content
4. `app/(docs)/docs/workflow/production/page.tsx` — Replace placeholder with full content

Each page should be **production-ready documentation** that Catalyst developers can use immediately.

---

## Final Notes

- **Be practical** — These are for real developers shipping real products
- **Be stage-aware** — Clearly differentiate what matters at each stage
- **Be AI-friendly** — Write so an AI agent can help execute each stage
- **Be consistent** — Same structure and tone across all 4 workflow pages
- **Incorporate research** — Use current best practices for AI-assisted development

Good luck! 🚀
