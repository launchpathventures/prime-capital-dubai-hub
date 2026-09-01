# Prime Capital — YouTube Lead Magnet Destinations

**Type:** feature · **Phase:** MVP · **Repo:** `launchpathventures/prime-capital-dubai-hub`
**Depends on:** `backlog-agentcrm-20260826-feature_lead-magnet-enquiry-context` (the Second Opinion capture needs it; the Framework access step does not).
**Source:** `catalyst/project/rollo-20260826-register_youtube-cta-lead-magnets.md`

---

## Implementation status — released to production 1 Sep 2026

The user has explicitly authorised the implementation agent to draft the page copy and walkthrough narration for review. This overrides the kickoff restriction against drafting final copy; the result remains review copy until the user approves it. The Second Opinion turnaround remains a business decision and will not be invented.

Website groundwork completed in this branch:

- Extended the existing lead API and short-form contract with the two fixed lead-magnet IDs, structured context, document metadata, consent, and `ref`/`share` pass-through.
- Added a durable service-role delivery queue, retry cron, idempotent `submissionId` handling, and direct background delivery.
- Added private Supabase document storage with server-authorized direct uploads and stable capability URLs retained for 180 days.
- Extended the existing shared LeadForm into a four-step Second Opinion journey, with the three property routes, required objective/check questions, mobile multi-file handling, and normal-distribution CRM mapping.
- Rebuilt all four review surfaces around Prime's established photographic funnel and editorial working-document patterns; the Framework now behaves as a five-check decision file rather than a generic content page.
- Re-recorded the 71-second captioned walkthrough against the refined Framework and verified the complete experience at 1440px and 390px without console errors or horizontal overflow.
- Added CRM contract coverage; the complete suite passes (19 files, 160 tests).

Production rollout completed on 1 Sep 2026:

1. The matching AgentCRM enquiry contract shipped to production through AgentCRM release PR #544.
2. Prime's production Supabase project was confirmed and `20260831000000_lead_magnet_delivery.sql` was applied. Queue read/write and private document upload/download checks passed.
3. The required AgentCRM and retry-cron credentials were configured for Vercel production and preview.
4. A labelled Framework release-QA submission passed through the website queue and received AgentCRM HTTP 200 (`submissionId: 8e46ce82-8273-42e1-b2f5-3ec7c82e9093`).
5. The production Vercel deployment reached Ready and was promoted to `primecapitaldubai.com` and `www.primecapitaldubai.com`.

The current Second Opinion confirmation makes no invented turnaround promise: it states that the assigned adviser will confirm timing on first contact. Prime can replace that with a specific commitment later if the operating team adopts one.

---

## 1. Summary

Eight Prime Capital and Tahir Personal Channel YouTube scripts are written and cannot publish. Every one of them closes on a lead magnet whose destination is still a `[FRAMEWORK URL — VERIFY BEFORE PUBLICATION]` placeholder. This brief builds those destinations on the Prime website so the scripts become publishable.

Two assets, plus a booking route that already exists in some form:

1. **Dubai Investor Decision Framework** — the low-intent offer, referenced by 7 of the 8 scripts. **A web page, not a file.** The viewer gets access to a page they work through — five named checks — plus a short walkthrough video. Nothing is downloaded and no PDF is authored.
2. **Prime Project Second Opinion** — the mid-intent offer, referenced by *Do Not Buy the Photograph*. It is a structured lead form, nothing more: the viewer sends a specific property and the claims they want tested, the submission reaches AgentCRM with full context plus a clear instruction for the agent, and the lead is then assigned exactly as any other lead is. Fulfilment is an ordinary agent conversation, not a new workflow.
3. **Book a Call** — paired with both, on every script.

**Primary users:** a Dubai property investor arriving cold from YouTube, mid-decision, who has just been told exactly what they will receive.

**Core outcome:** every placeholder URL in the eight scripts resolves to a live page that delivers precisely what the spoken words promised — no more, no less.

---

## 2. Objectives & Success Criteria

**O1 — The Framework delivers its three promised parts.**
Every Framework CTA promises the framework, five named checks, *and* "a short video showing you how to use it". A viewer who clicks through receives all three **on a web page, immediately**. Success: a first-time visitor lands, submits, and is reading the framework page and watching the walkthrough seconds later — no file, no email round-trip, no "check your inbox".

**O2 — The Second Opinion captures a workable request and tells the agent what to do.**
A submission arrives at AgentCRM containing property, price, payment plan, objective, the claims/documents to check, and any uploaded files — enough for the assigned agent to pick up the phone without emailing the viewer back for basics — plus an instruction stating what the conversation must cover.

**O3 — The commercial block never exceeds two offers.**
No page in this build shows Framework + Second Opinion + Book a Call together. Verified page by page.

**O4 — Nothing publishes on a dead route.**
Every URL handed back to the content team is live, tracked, and owned before the corresponding script is marked ready.

---

## 3. Users, Roles & Permissions

| Role | Goals | Must be able to |
|---|---|---|
| Cold YouTube viewer | Test a property claim themselves before reserving | Get the Framework + walkthrough without friction |
| Mid-intent viewer with a specific property | Have Prime test the parts they are unsure of | Submit property details and documents, and know what happens next |
| Prime reviewer (internal) | Fulfil the Second Opinion | Open the lead in AgentCRM and see the complete submission |

No authentication anywhere in this build. No viewer account, no login.

---

## 4. Scope Definition

### In Scope

- Framework landing page (public, indexable, YouTube-destination quality)
- Email capture step gating access to the framework page, with consent handling
- The framework itself — **a web page** presenting the five checks as something the viewer can work through against a real property
- The short walkthrough video, embedded
- The framework page carries **Second Opinion only** as the onward offer (this replaces what would have been a download-confirmation page)
- Second Opinion intake page and form, including document upload
- Second Opinion confirmation page setting expectations for what comes back
- Extension of the existing `app/api/leads/route.ts` AgentCRM forwarder to carry lead-magnet context
- Per-offer tracking parameters so YouTube performance can be read by offer
- Educational-content disclaimer matching the scripts

### Out of Scope

- Any change to the eight scripts. The pages fit the words, not the reverse.
- Any Second Opinion fulfilment workflow, queue, reviewer role or SLA tracking in the product. The lead is assigned by normal distribution and the agent handles it. The build's only fulfilment responsibility is posting a clear instruction with the lead.
- Viewer accounts, saved progress, or a returning-user dashboard.
- A third offer, a newsletter signup, a WhatsApp route, or a subscribe prompt anywhere in these commercial blocks.
- Rebuilding the Book a Call destination if one already works — verify and reuse.
- The Steven equivalents (separate brief, separate repo).

---

## 4a. Journeys (end to end)

Every step is a build responsibility. The CRM post is a step in the flow, not an afterthought bolted on later. All CRM posts extend the existing forwarder at `app/api/leads/route.ts` → `buildAgentCrmPayload`; do not create a second path.

### Journey A — Dubai Investor Decision Framework

1. Viewer finishes one of the seven Framework videos (Prime Capital 01–04, Tahir 01/02/04), clicks the link in the description or pinned comment. The URL carries per-video tracking, and may carry a `ref`/`share` token.
2. Lands on the **Framework landing page**: the promise, what they get, the five checks named, the educational disclaimer, one short form.
3. Submits the four-field short form — **first name, last name, email, WhatsApp** — with consent.
4. **The site's server POSTs to `https://crm.primecapitaldubai.com/api/public/enquiry`** via the existing forwarder, with `leadMagnetId: prime-investor-decision-framework`, `formMode: "download"`, `_source: "prime-capital-website"`, `submissionId`, and tracking + `ref` passed through untouched. Bearer key server-side only.
5. Viewer is redirected **straight to the framework page** — not gated on the CRM response. If step 4 fails it retries in the background; the viewer never sees it and never loses access.
6. **Framework page**: the five checks laid out to work through, the walkthrough video embedded, the educational disclaimer, and the **Prime Project Second Opinion as the only onward offer**.
7. In AgentCRM the lead appears and is assigned by normal distribution.

### Journey B — Prime Project Second Opinion

1. Viewer arrives from *Do Not Buy the Photograph* (description, pinned comment or end screen), or from the framework page as its single continuation.
2. Lands on the **Second Opinion intake page**: what it is, what comes back, what it is not (no valuation, no recommendation), and the disclaimer.
3. Fills the form: name, email, phone; then **property**, **price**, **payment plan**, **objective**, **claims or documents to check**.
4. Uploads documents. Files go to **Prime's own storage**; the site holds durable URLs (90-day minimum).
5. Submits. **The site's server POSTs to AgentCRM** carrying: identity fields, `leadMagnetId: prime-project-second-opinion`, the five `leadMagnetFields`, `leadMagnetDocuments` (url/filename/contentType/sizeBytes per file), the fixed `leadMagnetInstruction` (R12a), `_source`, and `submissionId` for retry-safety.
6. **Confirmation page**: what comes back, in the script's terms, and the turnaround.
7. In AgentCRM the lead appears with the instruction visible up front and every document as a working link. Assigned by **normal distribution** — no special routing.
8. The assigned agent gets in touch and covers what appears supported, what remains unproven, and the next decision. That conversation is the product.

### Journey C — Book a Call

1. Viewer clicks the booking link from a description, pinned comment, or the two-choice end screen.
2. Lands on Prime's existing booking destination. Verify it works and is tracked; build only if it does not exist.

### Failure behaviour

- CRM unreachable at A4 → retry in background, viewer proceeds to the framework page regardless.
- CRM unreachable at B5 → the submission must **not** be lost. Queue and retry, and still show the confirmation page. A dropped Second Opinion is a broken promise to someone who uploaded documents.
- Same `submissionId` replayed → one lead, never two.

---

## 5. Requirements

### The five checks (content — exact)

**R1** The Framework asset must contain these five checks, in this order, in Prime's wording. The spoken CTA in every script is: *"It walks you through the five things we want clear: whether the property fits your objective, the full financial commitment, which claims have evidence, the real competition and supply, and who may buy or rent it later."*

| # | Check | Prime label |
|---|---|---|
| 1 | Objective fit | Does the property fit your objective |
| 2 | Cost | The full financial commitment |
| 3 | Evidence | Which claims have evidence |
| 4 | Competition | The real competition **and supply** |
| 5 | Exit | Who may buy or rent it later |

**R1a (confirmed 26 Aug 2026)** All seven Prime Framework CTAs say *"**download** Prime's free Dubai Investor Decision Framework"*, and the descriptions and pinned comments repeat it. There is no file. Resolution: **give the framework page a clean print stylesheet** so "Save as PDF" works from the browser. No PDF is authored and no second asset is maintained, but the spoken word stays literally true. Do **not** author a separate PDF.

**R2** The walkthrough video is not optional garnish — it is named in every Framework CTA. The page must not ship without it, or with a placeholder in its slot.

**R3** The framework page must be a usable working reference, not a brochure about a framework. A viewer told to "test the claim for yourself before you reserve" needs something they can work through against a specific property, with each check stating plainly what to establish and what a missing answer means.

**R3a** "Work through" means read-and-apply, not fill-in-and-save. No accounts, no saved state, no server-side progress, no form persistence on the framework page. The viewer works against their own property in their own notes. This is deliberately the simplest thing that keeps the promise.

### Framework landing page

**R4** The page must deliver on whichever script sent the viewer. The four Prime Capital and three Tahir Framework closes each frame the same asset differently (a distressed-deal claim, an income case, a developer's name, an exit case, adviser honesty, market definition, down-market preparation). One page serves all seven — its promise must be the general one, not one script's angle.

**R5 (confirmed 26 Aug 2026)** The Framework **stays gated** — it is the top of the offer ladder and capture is the reason it produces leads. It gates *access to the page*, not a file. The viewer lands directly on the framework page on submit; no confirmation email is required to read it.

**R5a (form — use the existing pattern)** The Framework form is a **short-form enquiry**: **first name, last name, email, WhatsApp**, plus consent. Nothing else — this is the top of the ladder and every extra field costs completions.

Use the site's **existing short-form enquiry component and its existing AgentCRM field mapping**. Do not invent a new form, a new payload shape, or a new WhatsApp/phone convention — the pattern is already set (`app/api/leads/route.ts` already posts a single WhatsApp value into both `phone` and `whatsapp`). The only additions are the lead-magnet fields in §4a.

**R6** Consent language and handling appropriate to a cold international audience, and a stated position on what the email address will be used for.

**R7** Educational-content disclaimer, matching the scripts' description line: *"Educational content only. It is not a valuation, legal advice, financial advice or a recommendation to buy a particular property."*

**R8** The framework page — and any confirmation step in front of it — carries the **Second Opinion only** as the onward route. Never Book a Call, never both. This is the one placement rule that differs from the videos.

### Second Opinion intake

**R9 (property — three ways in, any one is enough)** *Do Not Buy the Photograph* promises the viewer sends "the property, price, payment plan, your objective and the claims or documents you want checked". Honour that without making them retype what a link already contains. One property block, three routes:

1. **Paste a link** — listing or developer page (`propertyUrl`)
2. **Upload a file** — brochure, floor plan or payment plan
3. **Type it** — property name, location/community, price, size (bedrooms)

Any one of the three satisfies the block. Someone with a Bayut tab open pastes and moves on; someone with a PDF from an agent uploads it; someone with neither types four short fields.

**R10 (the two questions that matter)** These are **always asked and always required**, whichever route above was used. Neither is on any listing page, and without them the assigned agent has nothing to test:

- **What are you trying to achieve?** — income, capital growth, a home, something else. One short answer.
- **What do you want us to check?** — the claims they are unsure about. Free text.

Everything else is retrievable from a link. These two are not. If the form gets cut back further, these survive.

**R10a (payment plan)** Optional free-text field. Named in the script and it matters for off-plan, but it is usually in the brochure or link — so ask, don't require.

**R11 (documents)** Multiple files, common document and image types, working from mobile. Files go to Prime's own storage; durable URLs (90-day minimum) post to AgentCRM. Not binary, not short-lived signed URLs.

**R11a (map to native CRM fields, not the magnet bag)** Most of this already has a home in AgentCRM and should land there, so the lead renders in the places an agent already looks:

| Form field | Post as | Why |
|---|---|---|
| Property link | `propertyUrl` | native; renders on the lead and the requirement |
| Property name | `propertyName` + `propertyInterest` | native; `propertyInterest` also lets the CRM resolve a linked listing agent if it matches one |
| Location / community | `locations: [value]` | native buyer-side field |
| Size (bedrooms) | `bedrooms` (number) | native |
| What to check | `enquiryNotes` | native long field (4,000 chars); already surfaces as the lead message |
| Price | `leadMagnetFields.price` | **not** `budget*` — the property's asking price is not the buyer's budget, and mislabelling it mis-qualifies the lead |
| Objective | `leadMagnetFields.objective` | no native equivalent |
| Payment plan | `leadMagnetFields.payment_plan` | no native equivalent |
| Uploaded files | `leadMagnetDocuments[]` | |

Only three fields need the generic lead-magnet bag. Do not build a price parser — post price as the text the viewer typed.

**R12** The confirmation page must state what comes back, in the script's own terms: *"a concise human-reviewed view of what appears supported, what remains unproven and the next decision to make"* — delivered by a Prime adviser getting in touch. Give an honest turnaround **[NEEDS CLARIFICATION: what turnaround does Prime commit to? The scripts promise no timeframe, so the page sets the first expectation. Do not invent one.]**

**R12a** Post a fixed `leadMagnetInstruction` with every Second Opinion lead so the assigned agent knows what is expected. Proposed text, to be confirmed by Prime:

> *Second Opinion request from YouTube. Get in touch with this lead and give them a second opinion on the property below. Cover what appears supported, what remains unproven, and the next decision you would make. Their submitted details and any documents are on this lead.*

The three things that conversation must cover are not decoration — they are the exact promise made in *Do Not Buy the Photograph*. An agent who calls and simply pitches has broken the script.

**R13** The form must not promise a valuation or a recommendation. Same disclaimer class as R7.

### AgentCRM integration

**R14** Extend the existing forwarder at `app/api/leads/route.ts` → `buildAgentCrmPayload`. Do not build a second path to the CRM.

**R15** Post the structured lead-magnet context defined in the AgentCRM brief. Fixed key names for Prime:

| Offer | `leadMagnetId` | `leadMagnetFields` keys |
|---|---|---|
| Framework | `prime-investor-decision-framework` | `source_script` (which video, when known) |
| Second Opinion | `prime-project-second-opinion` | `price`, `objective`, `payment_plan` — everything else maps to native CRM fields (R11a) |

**R16** Second Opinion uploads post as `leadMagnetDocuments` entries (`url`, `filename`, `contentType`, `sizeBytes`).

**R16a** Second Opinion leads are assigned by **normal agency distribution**. Do not set `assignToTeamMember`, `teamMemberEmail` or `leadDistribution` to route them specially.

**R17** Keep `_source: "prime-capital-website"` and the existing `submissionId` idempotency — a viewer retrying an upload must not create two leads.

**R18** Set `formMode: "download"` for the Framework — the CRM's existing enum value for a gated-content lead; it does not imply a file — and an appropriate mode for the Second Opinion. Keep `formName` distinct per offer so the CRM can segment.

**R19** If AgentCRM is unreachable, the viewer must still reach the framework page. A CRM failure may not become an access failure — log and retry, never block the viewer.

### Tracking

**R20** Each destination URL accepts per-video tracking so the content team can attribute by script. Preserve any existing `ref`/`share` token handling — the AgentCRM endpoint uses these for attribution and they must pass through untouched.

**R21** Report results by offer, so "Framework vs Second Opinion" is answerable without manual tagging.

### Handback

**R22** Deliver a list of final URLs mapped to the placeholder tokens in the scripts: `[FRAMEWORK URL]`, `[SECOND OPINION URL]`, `[BOOKING URL]`. This list is the artefact the content team needs; the build is not done without it.

---

## 6. Non-Functional Requirements

- **Production, not prototype.** These are public YouTube destinations for a live channel.
- **Mobile-first.** YouTube traffic is predominantly mobile — including the document upload, which must work from a phone.
- **Performance:** landing page usable on a mid-range phone on mobile data. The walkthrough video must not block first paint.
- **Accessibility:** keyboard-operable forms, labelled inputs, captions on the walkthrough video.
- **Privacy:** the Second Opinion collects purchase intent, price and uploaded documents. Storage access controls and a stated retention position are required, not optional.
- **Brand/tone:** the scripts are deliberately claim-tight and unembellished. The pages must match that register — no hype, no unsupported performance claims, no "limited time".

---

## 7. Design & Content Requirements

### Voice — Prime's, with Tahir's judgement behind it

The Framework and Second Opinion are **Prime assets** — the CTAs say "*Prime's* free Dubai Investor Decision Framework" and "request a *Prime* Project Second Opinion". So the pages are Prime's voice ("we"), not a personal blog. Tahir's first person belongs on his channel; where a page carries his judgement, attribute it to him explicitly rather than blurring the two.

**Specimen — this is the register to match.** Verbatim from *Distressed Deal*:

> "A property can be selling below what the owner paid and still not be a good deal. If you are looking at a ready property in Dubai, that distinction matters. My view is simple. A seller's loss is not automatically your opportunity. The discount only becomes meaningful when the reference is valid and the property still works after the costs, the competition and the exit are checked. The word 'distressed' describes the seller's position. It may tell you that the seller needs speed, certainty or a different payment outcome. It does not, by itself, tell you what the property is worth to you."

What makes it theirs: short declarative sentences. A distinction drawn cleanly, then held. The recurring "**X is not automatically Y**" and "**it does not, by itself, tell you…**" constructions. Conditional verbs ("may") wherever certainty is not earned. No adjective doing persuasive work.

**Construction rules**
- Lead with the decision, not the credential. No logo sequence, no generic welcome, no credentials-first opening — Prime's content governance rules these out explicitly.
- State what a check is *for* and what a missing answer *means*.
- Second person for the reader; "we"/"Prime" for the firm; "Tahir" by name where a personal judgement is being quoted.
- No exclamation marks, no urgency, no scarcity framing.

**Banned outright** — from Prime's content governance, which lists these as lines to delete unless separately approved:

> `this costs people real money` · `it is easy` · `looks safer` · `the market moved` · `two standard routes` · `that door stays closed` · `looks similar at a glance` · `at least` · `you are hoping` · `less careful buyers` · `the next time somebody tells you`

Also banned: emotional labels, metaphors, social proof, claimed audience behaviour, predicted consequences, maxims and flourishes. "Useful does not mean embellished."

**Claim-review flag words** — each needs an approved source or it goes: `most`, `usually`, `often`, `commonly`, `frequently`, `immediately`, `today`, `quickly`, `faster`, `days`, `weeks`. No "most investors", no "agents usually", no turnaround claim the business has not committed to.

**Numbers.** Any worked example on the framework page or in the walkthrough video must be labelled **synthetic**, **illustrative** or **synthetic matched inputs** at first mention, on screen as well as in text — never "completed sales", "genuine sales", "real comparables" or "market evidence". The method may call for completed-sale evidence; the example's numbers must never inherit that label.

**Attribution.** Any first-person or Prime-normative sentence must restate an approved Tahir view or governed Prime position. Do not invent a conviction to make a page sound confident.

**Approval.** Page copy and the walkthrough narration go through the same review as the YouTube scripts. Ship no placeholder copy.

### Everything else

- The viewer arrives having just been told precisely what they will get. The first screen should confirm that promise, not restate the video.
- Trust cues over persuasion: what this is, what it is not, who reviews a Second Opinion, what happens to their documents.
- Real content only. No lorem, no placeholder checks, no "coming soon" video slot.
- Follow the existing Prime hub design system.

---

## 8. Risks, Assumptions & Open Questions

- **Risk — the walkthrough video slips and the page ships without it.** Then seven scripts contain a spoken promise the page does not keep. Treat the video as a release blocker, not a follow-up.
- **Resolved — fulfilment.** No dedicated reviewer or queue. The lead is assigned as normal and the receiving agent gives the second opinion. The build's job is the instruction (R12a), not the process.
- **Risk — the instruction gets ignored.** The whole mechanism rests on one line of text reaching an agent who reads it. This is why the AgentCRM brief requires the instruction to render prominently rather than inside the activity body. Worth spot-checking with a real agent on a real lead before the scripts publish.
- **Assumption:** Prime's Book a Call destination already exists and works. Verify before assuming; if not, it is in scope.
- **Resolved — walkthrough video.** No presenter, no filming. The scripts promise only *"a short video showing you how to use it"* — no "watch me", no first person. Because the framework is now a web page, the video is a **screen capture of that page being worked through** with on-screen captions, ~60–90 seconds, one beat per check plus a short top and tail. It is produced by whoever builds the framework page, from the same content. The only external input is Prime approving the ~150 words of narration copy, which goes through the same claim review as the scripts.
- **Resolved (26 Aug 2026):** the framework is a **web page**. No PDF is authored or maintained. See R1a for the wording consequence.
- **Open (Post-Phase):** whether Framework completions should auto-suggest the Second Opinion by email.

---

## 9. Acceptance Checklist

- [x] Framework landing page live at a stable public URL, indexable, mobile-usable
- [x] The page names all five checks in Prime's exact wording, in order, including "and supply" on check 4
- [x] Copy is in Prime's voice; no Steven wording present; Tahir's personal judgements are attributed to him by name
- [x] No banned phrase from §7 appears on any page
- [x] No claim-review flag word (`most`, `usually`, `often`, `immediately`, `quickly`…) appears without an approved source
- [x] Any worked example is labelled synthetic/illustrative on screen at first mention (no worked example is used)
- [ ] Prime has approved the page copy and the walkthrough narration
- [x] The walkthrough video is embedded, plays, and is captioned
- [x] The Framework form collects exactly four fields (first name, last name, email, WhatsApp) plus consent — nothing else
- [ ] WhatsApp posts as both `whatsapp` and `phone`, and the resulting CRM contact shows a usable phone number
- [x] Submitting the form lands the viewer directly on the framework page — no file download, no "check your inbox" step
- [x] No PDF asset exists in the repo or is served from the framework route
- [x] The framework page and any confirmation step show the Second Opinion as the only onward offer — no Book a Call, no third route
- [x] The framework page prints cleanly to PDF from the browser
- [x] The property block accepts a link, a file, or typed details — any one alone lets the form submit
- [x] Objective and "what to check" are required regardless of which property route was used
- [x] Property link, name, location and bedrooms map to AgentCRM's **native** fields, not the lead-magnet bag
- [x] "What to check" maps to the lead message via `enquiryNotes`
- [x] Document upload accepts multiple files and works from a mobile browser
- [ ] A completed Second Opinion submission appears in AgentCRM as one lead showing the property, the objective, what to check, and every uploaded document as a working link
- [ ] The agent instruction is visible on that lead without scrolling into the activity body
- [x] The lead is assigned by normal distribution — no special routing fields were posted
- [ ] Uploaded document links still resolve 90 days after submission
- [ ] Retrying a submission with the same `submissionId` produces one lead, not two
- [x] Simulated AgentCRM outage: the viewer still receives the Framework; the lead is retried or queued, not lost
- [x] Educational-content disclaimer present on every page in this build
- [x] No page in the build displays three offers
- [x] Per-offer tracking is covered by the API contract tests
- [x] Final URL list handed to the content team, mapped to `[FRAMEWORK URL]`, `[SECOND OPINION URL]`, `[BOOKING URL]`
- [x] `pnpm typecheck`, `pnpm test:run`, `pnpm lint` green
