# Brief: Gated Off-Plan Listings + Signed-Link Unlock

**ID:** WEB-110
**Status:** In Review (website side implemented; release gated on live CRM API)
**Priority:** P1
**Surface:** Web + AgentCRM (cross-system)
**Estimate:** ~1 day website / ~3-5 days AgentCRM
**Tags:** properties, crm, security, lead-gen

---

## Implementation status (website side — 2026-07-17)

Website changes implemented and verified locally (typecheck via build, 140 tests pass, lint clean, production build clean). **Do NOT deploy until the new AgentCRM sharing API is live on `crm.primecapitaldubai.com` and the live-contract checks pass** (per CRM handoff v3).

Changed / added:
- `lib/config` env — property requests now key off `config.crm.agencyUuid` (`.env.local` already set to `f78d13a4-…`; `.env.example` updated).
- `lib/crm/client.ts` — `agency=<uuid>`; `getCrmPropertyBySlug(slug, { shareToken })` forwards the token under its landing key and forces `no-store`; error logs scrub `ref`/`share`; `access` mapped to camelCase (absent = full).
- `lib/crm/facets.ts` — agency UUID.
- `lib/crm/types.ts` — `CrmAccess`/`CrmPropertyAccess`, `isBasicTier`, `lockedSectionLabel`.
- `lib/crm/share-token.ts` (new) — `selectShareToken` (ref-wins-even-if-blank) + `paramReaderFromRecord`.
- `app/(web)/properties/[slug]/page.tsx` — resolves token from `searchParams`; fetches full when present; `access.tier` branch; basic-view `LockedDetailsCard` with one `#enquiry` CTA; `noindex` + `referrer: no-referrer` when tokened; passes `shareRef` prop to the widget; renders `StripShareToken`. Route is now `ƒ` dynamic (token responses never cached).
- `app/(web)/properties/[slug]/strip-share-token.tsx` (new) — `history.replaceState` strips `ref`/`share` after render.
- `property-enquiry-widget.tsx` — `shareRef` prop is the sole token source (no URL read); `pageUrl` sanitised so the token can't leak into the lead record.
- Tests: `tests/crm/{share-token,client,property-enquiry-widget,pdp-enquiry-channel,access-helpers}.test.ts(x)` — token precedence, agency UUID, no-store, log scrubbing, null-slug fallback, forbidden fields, access mapping, prop-sourced attribution, single-channel guard.

Deferred to live verification (can't be exercised under jsdom / stale API): end-to-end basic↔full render against real gated payloads, CRM-minted basic/full/revoked tokens, and attribution landing on the correct CRM contact.

### Review round 1 — items closed (2026-07-17)

1. **Removed the anonymous 300s property cache.** `crmFetch` is now always `cache: "no-store"` (no ISR opt-in); the CRM contract is `no-store` for anonymous AND token responses, so a website TTL could keep a full response public after the default flips to basic. Removed `export const revalidate = 300` from `/properties` and `/properties/[slug]` (now `force-dynamic`). **Consequence:** any page embedding property data is now dynamic — `/`, `/contact`, `/properties`, `/properties/[slug]` render as `ƒ`. CRM request load increases (as the CRM team noted). Added `unstable_rethrow` in `crmFetch` so Next's `DYNAMIC_SERVER_USAGE` bailout isn't swallowed/logged as an upstream failure.
2. **Hard token response headers.** `proxy.ts` (edge middleware — the repo uses `proxy.ts`, not `middleware.ts`) stamps `Cache-Control: private, no-store` + `Referrer-Policy: no-referrer` on token-bearing `/properties*` responses, via the pure `shareTokenResponseHeaders` helper (`lib/crm/token-response-headers.ts`). Unit-tested. Live header inspection remains part of the CRM-deploy gate (acceptance #12).
3. **Full `tsc --noEmit` green.** Root cause of the earlier JPG errors was a pre-build stale state (missing `.next/types` broke `next-env.d.ts`'s image-types reference); with generated types present it is 0 errors, stable with or without `.next/types`. Added a canonical `typecheck` script (`tsc --noEmit`). Verified: `typecheck` = 0 errors, 145 tests pass, repo lint clean, production build compiles.

---

## Objective

Off-plan properties from AgentCRM show a **basic public listing** by default on `primecapitaldubai.com`. When an agent shares a **signed link** (direct link, proposal, or campaign) from AgentCRM, the recipient / holder of that link sees the **full listing**. Secondary/ready listings are unaffected (always full).

**Basic listing includes:** Name, Location + Address, Price From (not range), Bedrooms, Unit Sizes (From), About This Property, Location & Views.

---

## Background

The website is a thin consumer of the AgentCRM public API (`crm.primecapitaldubai.com/api/public/properties`, agency `prime-capital`). All property data is fetched live per request via `lib/crm/client.ts` with Next ISR (300s) as the only cache. Today the PDP (`app/(web)/properties/[slug]/page.tsx`) pulls the full `CrmPropertyFull` for every off-plan property and renders each section conditionally.

There is currently **no** share-link, proposal, or token mechanism in this repo. AgentCRM previously had `contact_share_tokens` + `campaigns` tables (dropped in `supabase/migrations/20260324999999_cleanup_crm_tables.sql`). The enquiry widget already forwards a `ref` attribution param (`lib/crm/widget.ts`) — the intended hook for share tokens.

---

## Core Decision: Gate at the CRM, not the website

There are two ways to gate, and only one is acceptable:

- **Website-side hiding (REJECT):** CRM keeps returning full data; the website hides fields unless a token is present. Fake security — every gated field still sits in the JSON payload, visible in the Network tab / view-source. Defeats the purpose.
- **CRM-side projection (REQUIRED):** The CRM's public detail endpoint returns a **basic projection** for off-plan by default, and the **full projection** only when a valid signed token is presented. Gated data never leaves the CRM without authorization.

Consequence: ~80% of the work is on AgentCRM. The website change is small — thread a token through, and render locked sections as lead-gen teasers.

---

## Field Split (whitelist owned by AgentCRM)

| Section / field | Basic (default) | Full (unlocked) |
|---|---|---|
| Name / title | yes | yes |
| Location (area) + Address | yes | yes |
| Price From (`priceFrom` only, no `priceTo`) | yes | full range |
| Bedrooms | yes | yes |
| Unit size From (`sqft` / size min only) | yes | full range |
| About This Property (`overview` / `description`) | yes | yes |
| Location & Views (`locationAndViews`) | yes | yes |
| Hero image | yes (1) | yes |
| Payment Plan, DLD waiver, post-handover | — | yes |
| Available Unit Types table (`unitTypes[]`) | — | yes |
| Developer details, completion date, construction % | — | yes |
| Finishing, Kitchen, Furnishings, Reasons to Invest | — | yes |
| Documents (brochure, factsheet, master plan, video, 3D) | — | yes |
| Notes / Latest Updates | — | yes |
| Full gallery, Amenities, Key Features | OPEN QUESTION (§Open) | yes |

The CRM detail response also returns access metadata so the website can render locked affordances rather than silently omitting:

```jsonc
"access": {
  "tier": "basic" | "full",
  "gated": true,
  "lockedSections": ["payment_plan", "unit_types", "developer", "documents"]
}
```

`lockedSections` lets the PDP show a blurred teaser + "Request full details" CTA — turning the gate into a lead funnel rather than a dead end.

---

## Signed-Link Mechanism

**Token: opaque, DB-backed (recommended over stateless JWT).** Direct links, proposals, and campaigns all want per-recipient tracking, revocation, and expiry, which stateless JWTs can't give cleanly. One row per share link:

```
property_share_links(
  token          text primary key,   -- >=128-bit random, URL-safe
  property_id    uuid,
  agent_id       uuid,               -- sharing agent (attribution)
  contact_id     uuid null,          -- recipient, if known (proposal)
  channel        enum('direct','proposal','campaign'),
  scope          text default 'full',
  expires_at     timestamptz null,   -- per-channel policy
  revoked_at     timestamptz null,
  max_uses       int null,
  use_count      int default 0,
  created_at     timestamptz
)
```

(Stateless alternative: HMAC/JWT `{propertyId, scope, exp, jti}` signed with a CRM secret, `jti` checked against a revocation table. DB-opaque is simpler and matches the tracking Prime will want.)

**Link shape:** `https://primecapitaldubai.com/properties/{slug}?share={token}`

**Channels / lifecycle:**
- **Direct link** — agent clicks "Copy full link" on a property; long-lived, revocable.
- **Proposal** — bound to a `contact_id`; typically 30-90 day expiry.
- **Campaign** — issued per campaign; expiry tied to campaign window; may set `max_uses`.

**Attribution bonus:** the token also identifies the sharing agent + recipient. Pass it through as the widget `ref` param → any enquiry the recipient submits is auto-attributed to the sharing agent and linked to the proposal/campaign. One token does gating and attribution.

---

## Request Flow

**Default (no token):** `/properties/{slug}` → website fetch (no auth) → CRM returns basic projection → cacheable (ISR 300), indexable.

**Unlocked (`?share=token`):** `/properties/{slug}?share=T` → website forwards token to CRM (`Authorization: Bearer T` or `?share=T`) with `cache: 'no-store'` → CRM validates (lookup + not expired + not revoked + under max_uses), logs an open event, returns full projection → website renders full, sets `noindex`.

**Invalid/expired token:** CRM returns basic + `access.tier:"basic"` with a reason → website shows basic view plus a subtle "This link has expired — request a new one" notice.

---

## AgentCRM Tasks (the bulk of the work)

1. **Projection layer** on `GET /api/public/properties/{slug}` (+ list + facets): off-plan default = basic whitelist; valid token = full. Secondary listings unchanged. The whitelist is defined server-side (single source of truth).
2. **`access` metadata + `lockedSections`** in the detail response.
3. **Token issuance** — `property_share_links` table + agent UI ("Copy public link" / "Copy full link", "Generate proposal link", campaign link generation).
4. **Token validation** — accept via header or `?share=`, verify lookup + expiry + revocation + max_uses, increment `use_count`, log an open event (recipient analytics).
5. **Attribution** — when a token is present on a downstream enquiry (`ref`), tie the lead to the token's agent / contact / campaign.
6. **Ops** — rate-limit the token path to deter enumeration; keep default responses `max-age=300` but mark token responses `no-store`.

---

## Contract locked by AgentCRM (2026-07-17)

The CRM team returned the finalized contract — see `.context/agentcrm-signed-link-gating-brief.md` (their handoff). CRM-side design is settled; the website tasks below are updated to match it. Key deltas from the original draft:

- **Agency param is a UUID**, not the `prime-capital` slug: `agency=f78d13a4-c23e-47ce-81f6-b36284891eca`. Confirmed the **same** UUID the widget already uses — set `NEXT_PUBLIC_CRM_AGENCY_UUID=f78d13a4-c23e-47ce-81f6-b36284891eca` and switch the property-request `agency` param from `config.crm.agencySlug` to `config.crm.agencyUuid`.
- **Enquiry channel resolved: the PDP iframe widget is the single owner.** Do NOT add a second submission via `app/api/leads/route.ts` for a PDP enquiry. The widget posts internally to `/api/public/property-chat/lead` on the CRM origin, canonicalises `ref`, and resolves attribution server-side — no Bearer key touches the browser. Its response is `{success, contactId, enquiryId, created, readiness}` with **no `attributed` flag**; verify attribution on the resulting CRM contact/enquiry. The server-side Bearer route (`/api/public/enquiry`) stays authoritative only for native non-widget forms.
- **Dual token param**: accept both `?ref=` and `?share=`; **`ref` wins even when blank**. Canonicalise to `ref` when building the widget URL. Do NOT map it to UTM or ManyChat fields.
- **`Referrer-Policy: no-referrer`** on token-bearing pages (stricter than the site global).
- **Scrub the token from the visible URL** with `history.replaceState` after the server fetch; retain it only in page state for enquiry submission.
- **No page/RSC caching** for token requests (not just `no-store` on the fetch). Never log the token to Sentry/analytics. Expect `Cache-Control: private, no-store` from the API.
- **Secondary listings** are full-access but unit identity is never public — see the Secondary-property rule below.
- Detail links must use **`slug ?? id`** (secondary listings can have `slug: null`).

## Website (jakarta) Tasks

1. `lib/crm/client.ts` —
   - Switch the `agency` query param from `config.crm.agencySlug` to `config.crm.agencyUuid`. Set `NEXT_PUBLIC_CRM_AGENCY_UUID=f78d13a4-c23e-47ce-81f6-b36284891eca` in the source `.env.local` (root project dir — do not edit the workspace copy) and `.env.example`.
   - `getCrmPropertyBySlug(slugOrId, { shareToken })` and the list fetch: when a token is present, append it to the CRM request and use `cache: 'no-store'`.
   - In the error/`trackError` path, scrub the token from any URL sent to Sentry.
2. `lib/crm/types.ts` — add the `access` block (`tier`, `gated`, `locked_sections`, `reason`) to the list item AND detail types; treat missing `access` as full/legacy (backward compatible).
3. `lib/crm/browse-filters.ts` (or a small shared parser) — read the share token: `ref` first (wins even when blank), else `share`.
4. `app/(web)/properties/[slug]/page.tsx` —
   - Read the token from `searchParams`; pass to the fetch.
   - Branch on `access.tier`: `full` renders all returned sections; `basic` renders teaser fields + `locked_sections` unlock/contact UI. Never render null gated values as `0` / "unknown" / empty rows.
   - When a token is present: force dynamic rendering (opt out of `revalidate = 300`), set `robots: { index: false }` and `Referrer-Policy: no-referrer`.
5. Token lifecycle on the client — pass the token from the server render into page state as a **prop**, `history.replaceState` to strip `ref`/`share` from the URL. **Gotcha:** `PropertyEnquiryWidget` currently reads `ref` from `window.location.search` (`property-enquiry-widget.tsx:112`). Once the URL is scrubbed that read returns nothing, so the token must be threaded to the widget as a prop, not re-read from the URL — and the widget must also fall back to `share` when `ref` is absent.
6. Enquiry (PDP) — keep the iframe widget as the sole path; do not also POST via `/api/leads`. Append the canonical token to the widget URL as `ref` (prefer `property.embedUrl` + set `ref`, per the CRM sample; our `buildWidgetUrl` already maps `ref` and uses `agencyUuid`, which is equivalent once the env UUID is set). Verify attribution on the CRM contact — the widget response has no `attributed` flag.
7. Detail-link builders — use `property.slug ?? property.id`:
   - `app/(web)/properties/_components/properties-filter.tsx:148`
   - `app/sitemap.ts:44` (or filter null-slug rows from the sitemap)
8. Browse cards — off-plan cards show "Price from" (drop `priceTo`); handle `access.tier: "basic"` list items.

## Secondary-property rule (new)

Secondary/ready listings are full-access, but **unit identity is never public**. The website must tolerate and never re-introduce it:

- No `unit_number` / `unitNumber` — the PDP sidebar already guards `{property.unitNumber && …}`; keep it. Never source a unit number from CMS, URL, analytics, or cache.
- Redacted unit-identifying prose and media URLs (accept as-is).
- `slug: null` → route via UUID (the `slug ?? id` fix above).

---

## Build Sequencing: AgentCRM first or website first?

**Recommendation: AgentCRM first — specifically the projection (the gate) — then website + CRM token work in parallel against a frozen contract.**

The dependency is directional (website consumes what the CRM produces), and the gate is security-critical, so it cannot ship from the website alone. Never ship website-side hiding as a stopgap — it leaks the full payload.

Key insight: **the CRM projection alone delivers the gate with zero website deploy.** Because the PDP already renders sections conditionally, the moment the CRM starts returning basic-only for off-plan, those sections simply disappear on the live site. No leak, graceful degradation.

**Phase 0 — Contract lock (both, day 1).** Agree and write down the JSON shape: `access` block, `lockedSections` keys, token param name, header-vs-query, error semantics. This unblocks parallel work — the website builds against a fixture of the agreed contract immediately.

**Phase 1 — CRM: the gate (Tasks 1-2).** Ship basic projection as the off-plan default. Gating is now LIVE, safely, with no website change.

**Phase 2 — parallel.**
- CRM: token issuance (3) + validation → full (4).
- Website: all website tasks against the frozen contract, testable against CRM staging as soon as Task 4 exists. Merge is safe because with no token nothing changes.

**Phase 3 — integrate.** End-to-end unlock flow on staging; attribution (5); verify `no-store` + `noindex`; verify cache isolation (a token response must never land on a cache key a tokenless visitor can read).

**Compatibility guarantees that make either deploy order safe:**
- Website treats missing `access` as full/legacy → a website deploy before the CRM changes breaks nothing.
- CRM flipping the default to basic before the website ships → PDP degrades gracefully (sections vanish), still no leak.

---

## Acceptance Criteria

- [ ] Off-plan PDP with no token renders only the 7 basic sections; gated fields are absent from the JSON payload (verify in Network tab)
- [ ] Off-plan PDP with a valid `?share` token renders the full listing
- [ ] Expired / revoked / invalid token falls back to basic view with a notice
- [ ] Token responses are `no-store` on both sides and never served from cache to a tokenless visitor
- [ ] Token URLs return `noindex` and never appear in the sitemap
- [ ] Secondary/ready listings are unchanged (always full)
- [ ] An enquiry from a tokenised link is attributed to the sharing agent / campaign
- [ ] Off-plan browse cards show "Price from" (no range)
- [ ] Missing `access` metadata is treated as full (no regression on legacy responses)

---

## Open Questions (post-handover)

Resolved by the CRM handoff (v2, 2026-07-17): field split, `access` shape, token degradation, issuance, agency UUID (same as the widget's, env `NEXT_PUBLIC_CRM_AGENCY_UUID`), and enquiry channel (iframe widget is the sole PDP owner) are all settled. Remaining:

1. **CTA prominence** — should the basic view push "Request full details" hard (lead-gen), or stay a clean minimal listing? (Product/design call for Prime.)

---

## Release blocker (2026-07-17)

The new AgentCRM sharing API build is **not yet deployed** to `https://crm.primecapitaldubai.com` — the DB migration is live, but the CRM domain was still serving the previous API build during the 2026-07-17 smoke test. We can build the website changes now, but **cannot verify or release** end-to-end until CRM redeploys. Do not flip the `agency` param to the UUID in production until the new build is confirmed serving. Get a redeploy ETA from the CRM team.

## Risks

- **Cache correctness is the top risk.** A token response written to a shared cache key leaks full data to the public. Enforce `no-store` on the fetch AND opt the page out of ISR/RSC caching for token requests.
- **Referer leakage** — a query-param token can leak via the `Referer` header to third-party assets. Keep `Referrer-Policy: strict-origin-when-cross-origin` (already set in `next.config.ts`) and avoid third-party requests on the PDP that carry the full URL.
- **Cross-team coordination** — the CRM is a separate system/team. The Phase 0 contract lock is the critical unblocker; slippage there blocks both sides.
