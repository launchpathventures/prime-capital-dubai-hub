# Prime Capital → AgentCRM Lead Integration Brief

A complete, self-contained explanation of how Prime Capital sends lead data to
AgentCRM — the flow, the delivery semantics, the routing model, and worked
example payloads for every scenario. Read this top to bottom to fully understand
the integration.

> Quick field reference (event kiosk): `agentcrm-event-kiosk-payload.md`.
> This brief is the broader picture and supersedes it where they overlap.

---

## 1. What this is

Every lead Prime Capital captures — website enquiry forms **and** the on-site
iPad **event kiosk** — is normalised by our backend and forwarded to AgentCRM as
a single JSON enquiry. This brief tells the AgentCRM team exactly what arrives,
when, and what each field means, so leads can be de-duplicated, routed to the
right pipeline (Leads vs Partners), segmented by event, and distributed to the
right people.

---

## 2. How it works (architecture & flow)

```
  Browser / iPad
  ┌─────────────────────────────┐
  │  Website forms (contact,    │
  │  /sell, property enquiry,   │        ┌──────────────────────────────┐
  │  download, private, …)      │        │  Prime backend               │
  │  + Event kiosk (/register)  │  POST  │  /api/leads                  │
  │                             ├───────►│  1. validate (reject bad)    │
  └─────────────────────────────┘  JSON  │  2. enrich (property, agent) │
                                          │  3. build AgentCRM payload   │
                                          └──────────────┬───────────────┘
                                                         │ POST (Bearer)
                                                         ▼
                                          ┌──────────────────────────────┐
                                          │  AgentCRM                    │
                                          │  /api/public/enquiry         │
                                          └──────────────────────────────┘
```

- **Origin:** all forms post to **our** endpoint (`/api/leads`), never directly
  to AgentCRM. The browser never holds the AgentCRM key.
- **Our backend** validates the submission, enriches it server-side (resolves a
  property slug to name/URL/flags; resolves a referring team member to an email),
  then builds the AgentCRM-shaped payload and forwards it.
- **Best-effort, non-blocking:** forwarding never blocks the user. If AgentCRM is
  unreachable we log it; the guest still sees a success screen.

---

## 3. Transport & delivery semantics

| | |
|---|---|
| **Method** | `POST` |
| **Endpoint** | `https://crm.primecapitaldubai.com/api/public/enquiry` *(`AGENTCRM_API_URL`)* |
| **Auth** | `Authorization: Bearer <AGENTCRM_API_KEY>` |
| **Content-Type** | `application/json` |
| **Body size** | We reject and never send anything over **64 KB**. |
| **Trigger** | One request per completed submission. |
| **Success** | We treat **any 2xx** as success and do not parse the response body. |

**Idempotency & de-duplication.** Every payload carries a `submissionId` (UUID
v4). A user-initiated **retry resends the same `submissionId`**, so AgentCRM
should **de-dupe on `submissionId`** (with email/phone as a secondary match).
There is no server-side auto-retry today — see Open Questions.

**Field omission.** Any field whose value is empty/unknown is **omitted** from
the JSON (not sent as `null`). The deliberate exceptions are `assigneeEmail`,
`teamMemberEmail` (sent as `null` when no owner is pre-assigned) and `website`
(sent as `""`).

---

## 4. `visitorType` — the pipeline router

`visitorType` tells AgentCRM which pipeline a lead belongs to. **This is the most
important routing field.**

| Value | Meaning | Pipeline | How it's set |
|---|---|---|---|
| `investor` | Buyer / investor / advice-seeker | **Leads** (default) | inferred (default) |
| `seller` | A consumer selling **their own** property, with no buy/investment intent | **Leads** | inferred from a `sell` goal |
| `vendor` | A **partner / service-provider** | **Partners** | **explicit only** |
| `agent` | Agent-recruitment applicant | recruitment | **explicit only** |

**The critical rule:** a property **seller is never `vendor`.** In AgentCRM
`vendor` means a partner/service-provider (Partners), so a homeowner selling
their flat must route to `seller` (Leads).

**Inference logic** (when a form does not set `visitorType` explicitly):

| Goals on the lead | Result |
|---|---|
| Includes `sell` **and no** buy/investment goal | `seller` |
| Includes `sell` **and** a buy/investment goal | `investor` (and `sell` stays in `goals`) |
| Any buy/investment/advice/commercial/residential intent (no sell) | `investor` |
| No goals at all | `investor` |

"Buy/investment goals" = `buy-ready`, `build-wealth`, `advice-only`,
`commercial`, `residential`, `golden-visa-wills`, `invest-offplan`, `golden-visa`.

`vendor` and `agent` **only** appear when a dedicated partner/recruitment form
sets `visitorType` explicitly. (Those forms are noted as illustrative below —
see §7.6/§7.7.)

---

## 5. Lead sources (`formMode`)

| `formMode` | Source |
|---|---|
| `event` | The on-site iPad event kiosk (`/register`) — see §6. |
| `contact` | Full contact / qualification form (collects goals, budget, timeline, etc.) |
| `landing` | Quick-capture landing pages (e.g. `/sell`, campaign pages) |
| `property-enquiry` | Enquiry from a specific property listing |
| `download` | Lead-magnet / guide download |
| `private` | Private/UHNW channel |
| `newsletter` | Newsletter signup |

`formName` is an auto-derived slug combining the mode and page, e.g.
`event-registration-register`, `contact-form-contact-page`, `quick-enquiry-sell`.

---

## 6. Event kiosk specifics

The kiosk is one shared iPad at a stand/event. Staff name the event and choose a
distribution scope, then guests self-register. Every kiosk submission has
`formMode: "event"` plus:

- **`leadMagnet`** — the human event name staff typed (e.g. `"Cityscape Global 2026"`).
- **`leadTag`** — machine slug `event-<slug>` (e.g. `"event-cityscape-global-2026"`). Group/segment all leads from one event by this.
- **`utmSource: "event"`, `utmMedium: "kiosk"`, `utmCampaign: <leadTag>`** — identifies the channel.
- **`leadLifecycle: "prospect"`, `leadStage: "prospect"`** — markers that these should enter as prospects. **Currently informational** — AgentCRM stores them in the raw payload but does not yet act on them. The planned AgentCRM-side change should read these (with `formMode: "event"` / `utmMedium: "kiosk"`) to park event leads as Prospects.
- **`leadDistribution`** — `"team"` (release to all agents) or `"managers"` (hold for manager/admin distribution only — keep out of the general agent pool). Set per event by staff on the kiosk setup screen.
- **`submissionId` / `sessionId`** — a fresh UUID per guest, stable across that guest's retries (the shared iPad never merges two guests).
- **`phone` + `whatsapp`** — both set to the same E.164 number (WhatsApp-first) when a number is captured.
- **`assigneeEmail` / `teamMemberEmail`** — `null` (no pre-assigned owner; assign from a pool).

Guests give a name and **either** an email **or** a WhatsApp number (one is
enough), optionally pick interests, and optionally leave a comment.

---

## 7. Worked example payloads

These are the exact JSON bodies AgentCRM receives. `//` comments are annotations,
**not** part of the real JSON.

### 7.1 Event kiosk — investor, available to team

Guest picked "Buying property" + "Setting up a business", left a note.

```json
{
  "firstName": "Aisha",
  "lastName": "Khan",
  "email": "aisha@example.com",
  "phone": "+971501234567",
  "whatsapp": "+971501234567",

  "formMode": "event",
  "formName": "event-registration-register",
  "leadLifecycle": "prospect",
  "leadStage": "prospect",
  "leadDistribution": "team",

  "leadMagnet": "Cityscape Global 2026",
  "leadTag": "event-cityscape-global-2026",
  "pageUrl": "https://primecapitaldubai.com/register",

  "visitorType": "investor",
  "goals": ["buy-ready", "business-setup"],
  "message": "Looking for a 2BR in Marina under 3M",
  "enquiryNotes": "Looking for a 2BR in Marina under 3M",

  "utmSource": "event",
  "utmMedium": "kiosk",
  "utmCampaign": "event-cityscape-global-2026",

  "submissionId": "11111111-1111-4111-8111-111111111111",
  "sessionId": "22222222-2222-4222-8222-222222222222",
  "submittedAt": "2026-06-25T10:00:00.000Z",

  "assigneeEmail": null,
  "teamMemberEmail": null,
  "_source": "prime-capital-website",
  "website": ""
}
```

### 7.2 Event kiosk — seller, managers-only distribution

Guest picked only "Selling property"; staff set the kiosk to Managers only.

```json
{
  "firstName": "Sam",
  "lastName": "Seller",
  "whatsapp": "+971501112222",
  "phone": "+971501112222",

  "formMode": "event",
  "formName": "event-registration-register",
  "leadLifecycle": "prospect",
  "leadStage": "prospect",
  "leadDistribution": "managers",

  "leadMagnet": "Cityscape Global 2026",
  "leadTag": "event-cityscape-global-2026",
  "pageUrl": "https://primecapitaldubai.com/register",

  "visitorType": "seller",
  "goals": ["sell"],

  "utmSource": "event",
  "utmMedium": "kiosk",
  "utmCampaign": "event-cityscape-global-2026",

  "submissionId": "33333333-3333-4333-8333-333333333333",
  "sessionId": "44444444-4444-4444-8444-444444444444",
  "submittedAt": "2026-06-25T10:05:00.000Z",

  "assigneeEmail": null,
  "teamMemberEmail": null,
  "_source": "prime-capital-website",
  "website": ""
}
```

> Note: no `email`, no `goals`-based investor signal, no `message` — those keys
> are simply absent. `visitorType` is `seller` (Leads), **not** `vendor`.

### 7.3 Event kiosk — minimal (name + WhatsApp only)

```json
{
  "firstName": "Omar",
  "phone": "+971559876543",
  "whatsapp": "+971559876543",
  "formMode": "event",
  "formName": "event-registration-register",
  "leadLifecycle": "prospect",
  "leadStage": "prospect",
  "leadDistribution": "team",
  "leadMagnet": "Cityscape Global 2026",
  "leadTag": "event-cityscape-global-2026",
  "pageUrl": "https://primecapitaldubai.com/register",
  "visitorType": "investor",
  "utmSource": "event",
  "utmMedium": "kiosk",
  "utmCampaign": "event-cityscape-global-2026",
  "submissionId": "55555555-5555-4555-8555-555555555555",
  "sessionId": "66666666-6666-4666-8666-666666666666",
  "submittedAt": "2026-06-25T10:07:00.000Z",
  "assigneeEmail": null,
  "teamMemberEmail": null,
  "_source": "prime-capital-website",
  "website": ""
}
```

### 7.4 Website `/sell` landing — seller

The dedicated seller page; quick capture + a callback booking.

```json
{
  "firstName": "Tara",
  "lastName": "Vendoria",
  "email": "tara@example.com",
  "phone": "+971502223333",
  "whatsapp": "+971502223333",

  "formMode": "landing",
  "formName": "quick-enquiry-sell",
  "pageUrl": "https://primecapitaldubai.com/sell",

  "visitorType": "seller",
  "goals": ["sell"],
  "propertyLocation": "Dubai Marina",
  "message": "2-bed in Marina Gate, looking to sell within 3 months",

  "leadTag": "seller",
  "utmSource": "google",
  "utmMedium": "cpc",
  "utmCampaign": "sell-dubai-2026",

  "submissionId": "77777777-7777-4777-8777-777777777777",
  "sessionId": "88888888-8888-4888-8888-888888888888",
  "submittedAt": "2026-06-25T11:00:00.000Z",

  "assigneeEmail": null,
  "teamMemberEmail": null,
  "_source": "prime-capital-website",
  "website": ""
}
```

### 7.5 Website contact form — investor (qualified buyer)

A full contact form: buyer qualification fields are included.

```json
{
  "firstName": "Bea",
  "lastName": "Buyer",
  "email": "bea@example.com",
  "phone": "+971501230000",
  "whatsapp": "+971501230000",

  "formMode": "contact",
  "formName": "contact-form-contact-page",
  "pageUrl": "https://primecapitaldubai.com/contact",

  "visitorType": "investor",
  "goals": ["buy-ready", "build-wealth"],
  "investTimeline": "3_6_months",
  "budget": "3m-5m",
  "budgetMin": 3000000,
  "budgetMax": 5000000,
  "propertyTypes": ["apartment", "townhouse"],
  "locations": ["Dubai Marina", "Downtown Dubai"],
  "bedrooms": 2,
  "message": "Keen on high-yield off-plan",

  "utmSource": "newsletter",
  "utmMedium": "email",
  "utmCampaign": "june-2026",
  "firstTouchUtmSource": "instagram",
  "firstTouchUtmMedium": "social",
  "firstTouchAt": "2026-05-30T08:12:00.000Z",

  "submissionId": "99999999-9999-4999-8999-999999999999",
  "sessionId": "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
  "submittedAt": "2026-06-25T12:00:00.000Z",

  "assigneeEmail": null,
  "teamMemberEmail": null,
  "_source": "prime-capital-website",
  "website": ""
}
```

> `budgetMin`/`budgetMax` are server-derived AED bounds for the selected band.
> `firstTouch*` fields carry first-touch attribution when a returning visitor's
> 30-day cookie is present.

### 7.6 Partner / service-provider application — `vendor` (illustrative)

There is **no** partner application form yet. When one is built it will set
`visitorType: "vendor"` explicitly, and the payload will look like:

```json
{
  "firstName": "Pat",
  "lastName": "Partner",
  "email": "pat@partner.example",
  "phone": "+971504445555",
  "whatsapp": "+971504445555",
  "formMode": "contact",
  "formName": "contact-form-partners",
  "pageUrl": "https://primecapitaldubai.com/partners",
  "visitorType": "vendor",
  "message": "Mortgage brokerage interested in a referral partnership",
  "submissionId": "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
  "sessionId": "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
  "submittedAt": "2026-06-25T13:00:00.000Z",
  "assigneeEmail": null,
  "teamMemberEmail": null,
  "_source": "prime-capital-website",
  "website": ""
}
```

### 7.7 Agent recruitment — `agent` (illustrative)

Likewise illustrative — a recruitment form would set `visitorType: "agent"`:

```json
{
  "firstName": "Ade",
  "lastName": "Applicant",
  "email": "ade@example.com",
  "phone": "+971506660000",
  "whatsapp": "+971506660000",
  "formMode": "contact",
  "formName": "contact-form-careers",
  "pageUrl": "https://primecapitaldubai.com/careers",
  "visitorType": "agent",
  "message": "5 years Dubai brokerage experience, RERA certified",
  "submissionId": "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
  "sessionId": "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
  "submittedAt": "2026-06-25T14:00:00.000Z",
  "assigneeEmail": null,
  "teamMemberEmail": null,
  "_source": "prime-capital-website",
  "website": ""
}
```

---

## 8. Complete field reference

### Identity

| Field | Type | Presence | Notes |
|---|---|---|---|
| `firstName` | string | always | First token of the name. |
| `lastName` | string | optional | Remainder; omitted for a single-word name. |
| `email` | string | conditional | **`email` or `phone` is always present** (one is enough). |
| `phone` | string (E.164) | conditional | Mobile/WhatsApp number, e.g. `+971501234567`. |
| `whatsapp` | string (E.164) | conditional | Same value as `phone` (WhatsApp-first); both set together. |

### Source, routing & lifecycle

| Field | Type | Presence | Notes |
|---|---|---|---|
| `formMode` | string | always | `event` / `contact` / `landing` / `property-enquiry` / `download` / `private` / `newsletter`. |
| `formName` | string | always | Auto-derived mode+page slug. |
| `visitorType` | string | always | `investor` / `seller` / `vendor` / `agent` — see §4. |
| `goals` | string[] | optional | Interest codes — see vocabulary below. `sell` is always preserved. |
| `message` | string | optional | Free-text comment (coalesced from the form's notes field). |
| `enquiryNotes` | string | optional | Raw copy of the comment (event kiosk). |
| `leadLifecycle` | string | event: always | `"prospect"` — informational today (see §6). |
| `leadStage` | string | event: always | `"prospect"` — informational today. |
| `leadDistribution` | string | event: always | `"team"` or `"managers"` — see §6. |
| `leadMagnet` | string | event: always | Human event name (also set by download/lead-magnet forms). |
| `leadTag` | string | conditional | `event-<slug>` for events; campaign tag (e.g. `seller`, `distressed`) elsewhere. |
| `_source` | string | always | Always `"prime-capital-website"`. |

### Buyer qualification (contact / property-enquiry forms)

| Field | Type | Notes |
|---|---|---|
| `investTimeline` | string | e.g. `immediate`, `3_6_months`, `6_12_months`, `12_24_months`, `24_plus_months`, `flexible`. |
| `budget` | string | Band, e.g. `under-1m`, `1m-3m`, `3m-5m`, `5m-10m`, `10m-20m`, `50m-plus`. |
| `budgetMin` / `budgetMax` | number | Server-derived AED bounds for the band. |
| `propertyTypes` | string[] | e.g. `apartment`, `villa`, `townhouse`, `penthouse`, `studio`, `commercial`, `office`, `land`. |
| `locations` | string[] | Canonical Dubai locations (e.g. `Dubai Marina`). |
| `bedrooms` | number | Bedroom count. |
| `propertyLocation` / `propertyName` / `propertyType` / `saleTimeline` / `targetPrice` | string | Seller-side qualification. |

### Property enquiry enrichment (server-side, when a listing is referenced)

| Field | Type | Notes |
|---|---|---|
| `propertyRef` | string | Property slug. |
| `propertyName` / `propertyUrl` | string | Server-resolved (not trusted from the client). |
| `developerName` | string | |
| `isOffPlan` / `isDistressed` | boolean | |

### Attribution

| Field | Type | Notes |
|---|---|---|
| `utmSource` / `utmMedium` / `utmCampaign` / `utmContent` / `utmTerm` | string | Last-touch UTM (event kiosk overrides to `event`/`kiosk`/`<leadTag>`). |
| `referrer` | string | Last-touch referrer. |
| `firstTouchUtm*` / `firstTouchReferrer` / `firstTouchLandingPage` / `firstTouchAt` | string | First-touch (30-day cookie) when present. |
| `manychat` | string | Passed through when present. |

### Tracking & assignment

| Field | Type | Presence | Notes |
|---|---|---|---|
| `submissionId` | string (UUID v4) | always | **De-dupe key.** Reused on retries. |
| `sessionId` | string (UUID v4) | always | Unique per guest/visitor. |
| `submittedAt` | string (ISO 8601) | always | UTC timestamp. |
| `assigneeEmail` / `teamMemberEmail` | string \| null | always | Resolved team-member email when the lead came from an agent's page; `null` otherwise (incl. all kiosk leads). |
| `pageUrl` | string | always | Page the lead was submitted from. |
| `website` | string | always | Honeypot; `""` on legitimate leads, non-empty indicates a bot. |

### Goals vocabulary

| Code | Label | Routing signal |
|---|---|---|
| `buy-ready` | Buying property | buy/investment → investor |
| `build-wealth` | Building an investment portfolio | buy/investment → investor |
| `advice-only` | Strategic investment advice | buy/investment → investor |
| `golden-visa-wills` | Golden Visa & Wills | buy/investment → investor |
| `commercial` | Commercial property | buy/investment → investor |
| `residential` | Residential property | buy/investment → investor |
| `business-setup` | Setting up a business in Dubai | neutral |
| `development` | Building / developing in Dubai | neutral |
| `sell` | Selling property | seller (unless a buy/investment goal is also present) |
| `invest-offplan` | Invest in off-plan (website) | buy/investment → investor |
| `golden-visa` | Golden Visa via property (website) | buy/investment → investor |

---

## 9. Guarantees & edge cases

- **One of `email`/`phone` is always present**; the other may be absent.
- **`phone` and `whatsapp` are the same value**, set together (WhatsApp-first).
- **A property seller is never `vendor`** — `vendor`/`agent` are explicit-only.
- **`sell` is never stripped** from `goals`, even when routed to `investor`.
- **Retries reuse `submissionId`** — expect occasional duplicate ids; de-dupe.
- **Honeypot:** a non-empty `website` means a bot; we still forward it so
  AgentCRM can silently drop it.
- **Omitted vs null:** unknown values are omitted; only `assigneeEmail`,
  `teamMemberEmail` (`null`) and `website` (`""`) are sent when empty.

---

## 10. Recommended AgentCRM-side handling

1. **De-dupe** on `submissionId` (secondary: email/phone).
2. **Prospect parking** for event leads — read `formMode: "event"` /
   `utmMedium: "kiosk"` (and the `leadLifecycle`/`leadStage` markers once you
   honour them) to file event/kiosk submissions as Prospects.
3. **Distribution** — honour `leadDistribution`: `"team"` → general agent pool;
   `"managers"` → restricted to manager/admin distribution.
4. **Pipeline** — route `visitorType`: `investor`/`seller` → Leads,
   `vendor` → Partners, `agent` → recruitment.
5. **Event segmentation** — group by `leadTag` / `utmCampaign`; `leadMagnet` is
   the display name.
6. **Assignment** — event leads have `assigneeEmail`/`teamMemberEmail` = `null`;
   assign from a pool.
7. **Contact** — WhatsApp-first; `email` may be absent.

---

## 11. Open questions for the AgentCRM team

1. **Field naming/enums** — are `visitorType` values (`investor`/`seller`/`vendor`/`agent`), `leadDistribution` (`team`/`managers`), and `leadLifecycle`/`leadStage` (`prospect`) the exact names/values you want, or should we align to your schema?
2. **Lifecycle controls** — confirm the AgentCRM-side change to honour
   `leadLifecycle`/`leadStage` (and/or `formMode`/`utmMedium`) for Prospect parking.
3. **Delivery durability** — we currently send once (best-effort, no server-side
   retry/queue). If you want guaranteed delivery on transient 5xx, we can add a
   durable retry. Do you return a stable lead id we should capture?
4. **De-dupe window** — confirm `submissionId` is the right idempotency key on
   your side.
