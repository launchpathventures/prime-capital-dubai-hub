# AgentCRM Property Agent and Enquiry Routing

> **Catalyst Brief** — Read [AGENTS.md](../../AGENTS.md) and [BRIEFS.md](../../.catalyst/BRIEFS.md) before implementing.

## 1. Summary

Consume the additive AgentCRM property `agent` object, show the linked adviser on property detail pages, and route native property enquiries with the AgentCRM property UUID. Preserve signed-link attribution and prevent secondary unit identity from reaching website output, analytics, widget context, or enquiry payloads.

Release is gated on AgentCRM PR #335 being merged and deployed.

## 2. Objectives & Success Criteria

- A property detail page shows the linked agent's name, optional avatar, and optional title.
- Unassigned properties show the Prime Capital team fallback.
- Native property forms send `propertyInterest` as the public API property UUID.
- AgentCRM, not the website, resolves the enquiry owner.
- Secondary unit identity is absent from website-facing models and telemetry.

## 3. Users, Roles & Permissions

- Website visitor: views listing-agent context and submits an enquiry.
- Prime adviser: receives enquiries routed by AgentCRM.
- Website server: holds the Bearer key and enriches native enquiries.

No new authentication or routing controls are included.

## 4. Scope Definition

### In Scope

- Public property API type and mapper updates.
- Property adviser display on the PDP.
- Native `/api/leads` property enrichment and routing payload changes.
- Existing widget share-token forwarding.
- Secondary unit privacy guards and tests.

### Out of Scope

- Agent contact details or internal IDs.
- Website-owned assignment logic.
- AgentCRM PR #335 implementation or deployment.
- Production release before the upstream dependency is live.

## 5. Requirements

- **R1:** Treat `agent` as display-only and tolerate its absence before rollout.
- **R2:** Never pass an agent name, ID, email, or slug to route a property enquiry.
- **R3:** Send `propertyInterest`, `propertyName`, and canonical `propertyUrl` from the server for native property enquiries.
- **R4:** Continue forwarding `ref`/`share` to the widget as canonical `ref`.
- **R5:** Do not expose secondary unit identity through rendered data, URLs, analytics, widget context, or enquiry payloads.

## 6. Non-Functional Requirements

- The AgentCRM Bearer key remains server-only.
- Existing property API and widget behaviour remains backward compatible until PR #335 is deployed.
- Relevant tests, lint, typecheck, and build pass before handoff.

## 7. Design & Content Requirements

- Use existing Catalyst typography, layout, and avatar components.
- Keep the adviser card compact and adjacent to the enquiry widget.
- Fallback copy: “Prime Capital” and “Contact our team”.

## 8. Risks, Assumptions & Open Questions

- **Release blocker:** AgentCRM PR #335 must be merged and deployed before this website change is released.
- The API-provided agent avatar origin must remain permitted by the site image CSP.
- The widget remains the only enquiry channel on the PDP; the native form is the separate `/contact?property=...` flow.

## 9. Acceptance Checklist

- [x] Agent mapping and fallback are covered by tests.
- [x] PDP displays agent context without passing agent routing fields to the widget.
- [x] Native enquiry sends the AgentCRM property UUID as `propertyInterest`.
- [x] Property enquiries omit legacy assignee controls.
- [x] Unit identity and property references are absent from website-facing models and analytics.
- [x] Signed-link widget attribution remains intact.
- [x] Relevant validation passes.
- [x] Release blocker is documented in project state.

## 10. Handoff Notes

Do not release until AgentCRM PR #335 is merged and the production property response is verified to include the documented `agent` object. After deployment, smoke-test assigned and unassigned properties plus native and widget enquiries.

---

## Completion Notes

**Completed by:** Codex (tianjin workspace)
**Date:** 2026-07-21

### What was delivered

- Added backward-compatible AgentCRM agent mapping and an assigned/unassigned PDP adviser card.
- Changed native property enquiry enrichment to use the AgentCRM property API and send `propertyInterest` as the property UUID.
- Removed legacy property assignment controls whenever property-based routing applies.
- Removed unit identity and references from the app-facing property model and property references from analytics.
- Updated contract tests and integration documentation.

### What needs human review

- Visual treatment and placement of the adviser card on representative desktop and mobile PDPs.
- Assigned-agent, unassigned-property, shared-link, and native enquiry smoke tests after AgentCRM PR #335 reaches production.

### Known limitations

- Production contract verification is intentionally deferred until AgentCRM PR #335 is merged and deployed.
