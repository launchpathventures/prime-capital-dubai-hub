# AgentCRM — Event Kiosk Registration Payload

This describes the exact JSON Prime Capital sends to AgentCRM when a guest
completes a registration on the **event kiosk** (the iPad form Prime runs at a
stand/event). Share this with the AgentCRM team so they can map the fields and
configure event handling.

> For the full picture — architecture, delivery semantics, the complete
> `visitorType` model, and worked examples for every form type — see the
> **[AgentCRM Integration Brief](./agentcrm-integration-brief.md)**. This page is
> the quick field reference for the event kiosk specifically.

---

## Transport

| | |
|---|---|
| **Method** | `POST` |
| **Endpoint** | `https://crm.primecapitaldubai.com/api/public/enquiry` *(value of `AGENTCRM_API_URL`)* |
| **Auth** | `Authorization: Bearer <AGENTCRM_API_KEY>` |
| **Content-Type** | `application/json` |
| **Max body size** | 64 KB |
| **Trigger** | One request per completed kiosk registration |

The kiosk feeds the same enquiry endpoint as the website forms. What identifies
it as an **event** submission: `formMode: "event"`, `utmMedium: "kiosk"`,
`utmSource: "event"`, and the event name/slug in `leadMagnet` / `leadTag`.
Event leads are marked with `leadLifecycle` / `leadStage` = `"prospect"`.

---

## Example payload (typical event registration)

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

Fields whose value is `undefined` are **omitted** from the JSON (not sent as
null). The exceptions are `assigneeEmail`, `teamMemberEmail` (sent as `null`
when no agent is pre-assigned — always the case for the kiosk) and `website`
(sent as `""`).

---

## Field reference

### Identity (who registered)

| Field | Type | Presence | Notes |
|---|---|---|---|
| `firstName` | string | **always** | First token of the name they typed. |
| `lastName` | string | optional | Remainder of the name; omitted if they gave a single word. |
| `email` | string | conditional | Present if provided. **Either `email` or `phone` is always present** (guests give one or the other). |
| `phone` | string (E.164) | conditional | The mobile/WhatsApp number, e.g. `+971501234567`. Present whenever a number is captured. |
| `whatsapp` | string (E.164) | conditional | Same value as `phone` — WhatsApp-first. Both are set together when a number is captured. |

### Event identity, lifecycle & source

| Field | Type | Presence | Notes |
|---|---|---|---|
| `formMode` | string | **always** | Always `"event"` for kiosk leads. |
| `formName` | string | **always** | Auto-derived, e.g. `"event-registration-register"`. |
| `leadLifecycle` | string | **always** | Always `"prospect"` — marker that event leads should enter as prospects. **Currently informational** (see note below). |
| `leadStage` | string | **always** | Always `"prospect"` (same marker, duplicated for whichever field AgentCRM keys on). |
| `leadDistribution` | string | **always (event)** | Who the event's leads are released to: **`"team"`** (available to all agents) or **`"managers"`** (held for manager / admin distribution only). Set by staff per event on the kiosk setup screen. |
| `leadMagnet` | string | **always** | **The human-readable event name** staff typed, e.g. `"Cityscape Global 2026"`. |
| `leadTag` | string | **always** | **Machine slug for the event**, `event-<slug>`, e.g. `"event-cityscape-global-2026"`. Use this to group/segment all leads from one event. |
| `utmSource` | string | **always** | Always `"event"`. |
| `utmMedium` | string | **always** | Always `"kiosk"`. Identifies the lead as captured live on the iPad. |
| `utmCampaign` | string | **always** | Same value as `leadTag` (the event slug). |
| `pageUrl` | string | **always** | The kiosk URL. |
| `_source` | string | **always** | Always `"prime-capital-website"` (the originating system). |

### Interest & routing (what they want)

| Field | Type | Presence | Notes |
|---|---|---|---|
| `goals` | string[] | optional | The interests the guest selected. Omitted if none selected. See vocabulary below. |
| `message` | string | optional | The guest's free-text comment. |
| `enquiryNotes` | string | optional | Same value as `message` (raw copy of the comment). |
| `visitorType` | string | **always** | Pipeline router — **only ever `"investor"` or `"seller"` for kiosk leads, never `"vendor"`.** See routing rules below. |

### Tracking & assignment

| Field | Type | Presence | Notes |
|---|---|---|---|
| `submissionId` | string (UUID v4) | **always** | Unique per registration, **reused on retries**. Use for de-duplication / idempotency — a re-submit carries the same id. |
| `sessionId` | string (UUID v4) | **always** | Unique per guest. Each kiosk registration is independent — the shared iPad does **not** reuse one session across guests. |
| `submittedAt` | string (ISO 8601) | **always** | UTC timestamp of submission. |
| `assigneeEmail` | string \| null | **always** | `null` for kiosk leads — no agent is pre-assigned. AgentCRM should assign/round-robin these. |
| `teamMemberEmail` | string \| null | **always** | `null` for kiosk leads (same as above). |
| `website` | string | **always** | Honeypot field; always `""` from the kiosk. A non-empty value indicates a bot. |

> Fields used by other Prime forms (e.g. `budget`, `propertyTypes`, `locations`,
> `propertyRef`, `developerName`, `investTimeline`, Calendly meeting fields) are
> **not sent** by the kiosk and will be absent.

---

## `visitorType` routing rules (kiosk leads)

`vendor` is **never** sent for kiosk leads — in AgentCRM `vendor` means a
partner / service-provider, not a property seller. Instead:

| Guest's `goals` | `visitorType` |
|---|---|
| Includes `"sell"` **and no** buy/investment goal | `"seller"` |
| Includes `"sell"` **and** a buy/investment goal | `"investor"` (and `"sell"` stays in `goals`) |
| Any buy / investment / advice / commercial / residential intent (no sell) | `"investor"` |
| No goals selected | `"investor"` |

"Buy/investment goals" = `buy-ready`, `build-wealth`, `advice-only`,
`commercial`, `residential` (plus the canonical website goals `invest-offplan`,
`golden-visa`).

### Full `visitorType` vocabulary (applies to all Prime forms, not just the kiosk)

| Value | Meaning | How it's set |
|---|---|---|
| `investor` | Buyer / investor / advice — the default Leads pipeline | inferred (default) |
| `seller` | A consumer selling **their own** property, no buy/investment intent | inferred from a `sell` goal |
| `vendor` | A **partner / service-provider** (AgentCRM Partners, not Leads) | **explicit only** — a partner application form sets it |
| `agent` | Agent recruitment applicant | **explicit only** — a recruitment form sets it |

A property seller is **never** routed to `vendor`. `vendor` and `agent` only
appear when a form sets `visitorType` explicitly.

---

## Interest vocabulary (`goals`)

The kiosk sends these exact string codes. Suggested human labels for display:

| Code | Label | Routing signal |
|---|---|---|
| `buy-ready` | Buying property | buy/investment → investor |
| `build-wealth` | Building an investment portfolio | buy/investment → investor |
| `advice-only` | Strategic investment advice | buy/investment → investor |
| `business-setup` | Setting up a business in Dubai | neutral |
| `development` | Building / developing in Dubai | neutral |
| `sell` | Selling property | seller (unless a buy/investment goal is also present) |
| `commercial` | Commercial property | buy/investment → investor |
| `residential` | Residential property | buy/investment → investor |

A guest may select multiple, so `goals` can mix codes (e.g.
`["buy-ready", "commercial"]`). `"sell"` is always preserved in `goals`
regardless of the routed `visitorType`.

---

## Minimal payload (guest gave only a name + WhatsApp, no interests/comment)

```json
{
  "firstName": "Omar",
  "phone": "+971559876543",
  "whatsapp": "+971559876543",
  "formMode": "event",
  "formName": "event-registration-register",
  "leadLifecycle": "prospect",
  "leadStage": "prospect",
  "leadDistribution": "managers",
  "leadMagnet": "Cityscape Global 2026",
  "leadTag": "event-cityscape-global-2026",
  "pageUrl": "https://primecapitaldubai.com/register",
  "visitorType": "investor",
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

### Sell-only guest

Same shape, with:

```json
{ "visitorType": "seller", "goals": ["sell"] }
```

---

## Recommended handling on the AgentCRM side

1. **De-dupe** on `submissionId` (retries reuse the same id), with email/phone
   as a secondary match.
2. **Mark as prospect** for event leads. Today `leadLifecycle` / `leadStage`
   = `"prospect"` are **informational only** — AgentCRM stores them in the raw
   payload but does not yet treat them as lifecycle controls. The planned
   AgentCRM-side change should read these (combined with `formMode: "event"` /
   `utmMedium: "kiosk"`) to park event/kiosk submissions as Prospects.
3. **Honour distribution scope** via `leadDistribution`: `"team"` leads can be
   released to all agents; `"managers"` leads should be held for manager / admin
   distribution only (do not surface to the general agent pool).
4. **Segment the event** by `leadTag` (or `utmCampaign`) — every lead from one
   event shares the same value; `leadMagnet` is the display name.
5. **Assign** event leads from a pool — `assigneeEmail` / `teamMemberEmail` are
   `null`, so there's no pre-set owner.
6. **Contact channel**: treat `phone` / `whatsapp` as a WhatsApp-first number;
   note that `email` may be absent (and vice versa).
7. **Route** `visitorType` to the right pipeline — `seller` and `investor` for
   organic leads; `vendor` (Partners) and `agent` only ever arrive when set
   explicitly by a partner / recruitment form. A property seller is never `vendor`.
