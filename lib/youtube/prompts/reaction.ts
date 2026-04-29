/**
 * CATALYST - Live Reaction / Hot-Take Format Prompt
 *
 * Top-funnel news-cycle format. Captures search traffic on breaking topics
 * within 48 hours of the news. 7–14 day shelf life — production notes must
 * flag the freshness window.
 *
 * SPECIAL: Single CTA only (CTA #2 — Strategy Call). No CTA #1 (competes
 * with the urgency of the news peg). No CTA #3 (no next-video tease — the
 * Reaction is tied to a cycle, not a content arc).
 *
 * REQUIRES: News peg. The idea generator must flag a Reaction without a
 * concrete news peg as not-yet-saveable.
 *
 * Length: 4–6 minutes (~750–1,000 words).
 * Composes with SHARED_IMMUTABLES at generation time.
 */

export const REACTION_PROMPT = `# Format: Live Reaction / Hot-Take

Top-funnel. The format that captures **search traffic in the 48-hour window** after a real news event — DLD data drops, Fitch / Moody's / S&P reports, Central Bank UAE regulatory moves, RERA announcements, geopolitical shifts affecting the region.

Reactions are not "what I think about Dubai." They are *"this specific thing happened, and here is the practitioner's read on what it means."* No news peg, no Reaction. Route the topic to a different format.

---

## 1. Job & audience

### What this format does
Show up first, with a calmer and more useful read than every other channel reacting to the same news. Search demand is at its peak for 48–72 hours after a major data drop or regulatory announcement; that's when the Reaction must publish.

### Who's watching this specifically
- **Stage:** Cold to warm. Many arrived via search ("Fitch Dubai rating," "DLD Q1 transaction data," "Central Bank UAE LTV"). They want a fast answer with substance behind it.
- **Mindset:** Hungry for orientation. The news has just landed and they don't know whether it changes their thesis. They are sampling reads from multiple sources to triangulate.
- **Decision criteria:** Does this person give me the read in the first 90 seconds, or am I still waiting for the point at minute four? Are they sourced? Are they measured?

### Why this format is shorter and tighter
4–6 minutes. No frameworks. Single CTA. The viewer didn't come for a thesis — they came for a read on a specific event. Padding out runtime with frameworks or multiple CTAs reads as opportunism. The discipline of brevity is part of the brand signal.

---

## 2. Length & pacing

| Parameter | Value |
|-----------|-------|
| **Target word count** | 750–1,000 words |
| **Spoken length** | 4–6 minutes |
| **Hook** | ~80 words |
| **Section 1 — What Happened** | ~250 words |
| **Section 2 — What It Actually Means** | ~400 words (the heart) |
| **Section 3 — What I'm Telling Clients This Week** | ~200 words |
| **End-roll CTA #2 + tease + sign-off** | ~70 words |

**Note:** there is **no mid-roll CTA** in a Reaction. There is **no CTA #3 in the outro**. There is exactly one CTA — CTA #2 — and it appears once, at the end, immediately before the sign-off.

---

## 3. Hook formula C — News Headline + Tahir's Read

**Single hook only** (no V1/V2 split). Open with the news in one sentence. Deliver Tahir's one-line read in the second sentence. Promise the dismantle in the third.

### Required: date-stamp the video in the hook
Every Reaction's hook must include *"As of [date]…"* or *"Today is [date], and…"* near the opening. The freshness signal is part of why a viewer chooses this video over a six-month-old upload that ranks for the same query.

### Structure
1. **The news in one sentence** (named source, specific data point)
2. **Tahir's one-line read** (the practitioner's interpretation)
3. **The promise** (what the rest of the video covers)
4. **Credibility anchor** (AED 3B+, 20 years, multiple cycles)

### Worked examples (good)

**Good — Fitch report:**
> "Today is the 14th of April, 2026. Fitch Ratings has just upgraded the UAE's sovereign outlook to stable, citing the regulatory infrastructure and fiscal buffers built over the last eight years. Here's the practitioner's read: this is bigger for institutional capital flows into Dubai property than it sounds, and most of the channel coverage I've seen this morning has missed why. I'm Tahir Majithia, founder of Prime Capital Dubai. We've placed over three billion dirhams of client capital across multiple cycles. In the next four minutes, I'll show you what this rating change actually moves, and what I'm telling clients this week."

*Why it works:* date-stamped, named source (Fitch), specific data point (sovereign outlook → stable, 8-year regulatory frame), one-line read, contrarian flag (others have missed it), credibility anchor, runtime promise.

**Good — DLD data drop:**
> "As of yesterday, the Dubai Land Department has released Q1 2026 transaction data. Total transaction value is up 18.4% year-on-year. Headline reading: the cycle is still hot. Here's the practitioner's read: the headline number masks a 7-percentage-point divergence between off-plan and ready-market activity, and that divergence is the actual signal. I'm Tahir Majithia. We've deployed over three billion dirhams across multiple Dubai cycles. I'm going to spend the next four minutes on what this print actually changes — and what it doesn't."

*Why it works:* date-stamped (yesterday), named source (DLD), specific figure (18.4% YoY), reframes the headline against a sub-pattern (the divergence), promises a measured read.

**Good — Central Bank UAE LTV move:**
> "Today the Central Bank of the UAE announced a 5-percentage-point change to LTV caps on second-home mortgages for non-residents. The market is reading this as a tightening. I think the read is more nuanced than that — and the difference matters for anyone holding off-plan that completes in the next 18 months. I'm Tahir Majithia. Over 20 years and three billion dirhams placed, I've watched LTV moves cascade through this market three times. In the next five minutes, I'll show you what cascades and what doesn't."

*Why it works:* explicit date framing, named source (Central Bank UAE), specific change (5pp on second-home mortgages for non-residents), engages a fear (financing implications for off-plan completers), credibility anchor with cycle reference.

### Hook anti-patterns (do not write)

**No date-stamp:**
> ❌ "Big news from Fitch this week. Let me break it down."

*Violation:* "this week" is not a date. Search-driven viewers want freshness signal in the first sentence.

**Generic news-channel framing:**
> ❌ "BREAKING: huge announcement from the Central Bank UAE today. You won't believe what just happened."

*Violations:* clickbait construction, hype words, no specifics.

**Burying the read:**
> ❌ "The Dubai Land Department released their Q1 transaction data today. Stay tuned to find out what it means."

*Violation:* Tahir's read must arrive in the second sentence. Reaction viewers are sampling — give them the take immediately or they bounce.

### Hook quality checklist
- [ ] Date-stamped (specific day or week marker)
- [ ] Named source (Fitch / Moody's / DLD / Central Bank UAE / RERA / S&P)
- [ ] Specific data point (figure, percentage, named regulatory change)
- [ ] One-line practitioner read in the second sentence — never buried
- [ ] Credibility anchor (AED 3B+, 20 years)
- [ ] Runtime promise (4–5 minutes, not vague)
- [ ] No exclamation marks, no hype words

---

## 4. Section 1 — What Happened (~250 words)

Facts only. Sourced. No framework. No interpretation yet.

### What goes in Section 1
1. **The full news in clean spoken form** (~80 words). What was announced, by whom, when. Use named sources from the allowed list (shared-immutables §7.1).
2. **The relevant numbers and context** (~120 words). The specific figures that matter, normalised for the audience. If Fitch upgraded the outlook, what does that mean technically? If DLD data shows X% YoY, how does that compare to Q1 2025?
3. **The boundary of what's known** (~50 words). What hasn't been disclosed. What requires inference. What the data doesn't tell us.

### Tone
News reporter. Calm, factual, sourced. Tahir is establishing that he understands the news at a level deeper than the headline.

### Required
- **At least one named allowed source** in this section.
- **At least two specific numbers** with their units and timeframes.
- **No frameworks.** Frameworks belong in Authority Analysis. A Reaction reads as opportunistic if it tries to introduce a numbered framework alongside breaking news.

### Forbidden in Section 1
- Tahir's interpretation. Save it for Section 2.
- Speculation. Mark inferences as inferences.
- Comparison to other markets that aren't already in the news. Reactions stay tight to the news.

---

## 5. Section 2 — What It Actually Means (the heart, ~400 words)

The practitioner's read. The mechanics behind the headline. The reason a viewer chose this Reaction over the other channels' coverage.

### Internal structure (four beats)

#### Beat 1 — The pivot (~50 words)
Open with an explicit move from facts to interpretation.
> *"Now, here's where I'd push back on most of the takes I've seen on this in the last 24 hours. The headline reading treats [X] as the load-bearing change. It isn't. The change that actually matters here is [Y]. Let me show you why."*

#### Beat 2 — The mechanic (~200 words)
Why does this news matter? What does it actually move? Walk the viewer through the chain of consequence — the news event → what it changes about the market structure → what that means for investor decisions.

Use historical pattern recognition: *"Last time we saw a Central Bank UAE move like this — Q3 2014 — the cascade ran like this…"* Reactions are richer when they tie the current news to a prior precedent.

**Required:**
- One historical comparison. Specific date (15 September 2008 or 2014 Central Bank UAE caps are the strongest anchors, but any specific Dubai-cycle reference works).
- Mechanic-level explanation, not surface-level summary.
- At least two specific data points layered into the explanation.

#### Beat 3 — The "what's the risk of my read being wrong?" beat (~80 words)
**Required, exactly once across the script, placed at the end of Beat 2 or opening Beat 4.** This is what separates Tahir's read from every other hot-take channel.
> *"Now, what's the risk of my read being wrong? If [specific external condition] develops differently than I'm assuming, the cascade I'm describing softens — or breaks entirely. The honest answer is the read holds if [X] stays roughly stable. If it doesn't, I'd want to revisit this on next week's print."*

#### Beat 4 — Kill-line (~40 words)
End Section 2 with a punchy, screenshot-able line. Examples:
- *"The headline moved on the rating. The cycle moves on what's behind the rating."*
- *"This isn't the news everyone is reacting to. It's the news underneath the news."*
- *"Markets price headlines in days. They price mechanics in quarters. We're still in days."*

### Forbidden
- **Named numbered frameworks.** Reactions are too tight to carry frameworks without feeling like opportunistic content padding.
- **Speculation about further news.** *"And tomorrow they might announce…"* — don't.
- **Calls to action embedded in Section 2.** The single CTA waits until after Section 3.

### Engaging an investor fear
Required: at least one of the eight investor fears (shared-immutables §9) engaged head-on. The news event often maps directly to a fear (Central Bank LTV change → fear #6 region stability or fear #2 financing dependability; Fitch upgrade → fear #6; DLD data → fear #1 bubble or fear #4 liquidity).

---

## 6. Section 3 — What I'm Telling Clients This Week (~200 words)

The most concrete section. *"Here's what I said in client calls this week. Here's what I'm flagging in our weekly update."*

### Internal structure
1. **The transition** (~30 words). *"So if you're a client of ours, here's what I'm flagging this week. If you're not, here's what I'd be looking at if I were in your situation."*
2. **2–3 concrete things** (~140 words). Each one must:
   - Be **immediately useful**, not generic. *"I'd recheck the LTV terms on any off-plan completing within 18 months,"* not *"do due diligence."*
   - Be **time-bounded** (this week, this month) — Reactions live and die on freshness.
   - Be **non-prescriptive** (not "you should buy X"). The actionable item is a check, a question, an evaluation — never a recommendation of a specific product.
3. **Kill-line / sign-off transition** (~30 words). The bridge to the CTA.

### Tone
Direct, conversational, time-bound. Tahir is letting the viewer overhear what he's saying to clients. That intimacy is the format's distinctive value.

---

## 7. End-roll — CTA #2 (Strategy Call) + sign-off

**This is the only CTA in the script.** No mid-roll, no CTA #1, no CTA #3.

### Why single CTA
- CTA #1 (Strategy Kit) competes with the urgency of the news peg. The audience came for the read on this event, not a download.
- CTA #3 (call repeat + watch-next tease) doesn't fit — Reactions are tied to a news cycle, not a thematic content arc.

### CTA #2 wording
Verbatim per shared-immutables §12 — slightly compressed pacing for the shorter format:

> *"Look — if you're sitting on capital and trying to figure out what this news actually means for your specific situation, that's exactly what we do at Prime Capital. Book a strategy call with my team. We'll look at your objectives, your capital, and your timeline — and we'll tell you honestly whether Dubai makes sense for you right now. And if it doesn't, we'll tell you that too. Link is in the description."*

The *"and if it doesn't make sense, we'll tell you that too"* line is **non-negotiable**.

### Sign-off
Immediately follows the CTA. No additional content between CTA and sign-off.

> *"I'm Tahir Majithia. Prime Capital Dubai. With a plan, not a pitch."*

### What about a watch-next tease?
**Reactions do not include a watch-next tease.** The next news event is unpredictable; promising "next video on X" sets a content debt that may not match the next news cycle. End with the CTA + sign-off, nothing else.

---

## 8. Required signature patterns (Reaction only)

Verify every item is present:

- [ ] **Single hook**, ~80 words, date-stamped, named source, specific data point, one-line practitioner read in the second sentence, credibility anchor
- [ ] **Section 1 = facts only, sourced, no interpretation**
- [ ] **Section 2 = the practitioner's read with mechanics**
- [ ] **One historical comparison** in Section 2 (specific date / cycle reference)
- [ ] **"What's the risk of my read being wrong?"** beat once, in Section 2
- [ ] **No named numbered frameworks** anywhere in the script
- [ ] **One kill-line** at the end of Section 2
- [ ] **Section 3 gives 2–3 concrete, time-bounded actions** — what Tahir is telling clients this week
- [ ] **At least one of the eight investor fears** engaged head-on
- [ ] **Single CTA only** (CTA #2 — Strategy Call) — no mid-roll, no CTA #1, no CTA #3
- [ ] **No watch-next tease** in the outro
- [ ] **Sign-off line exact**, immediately after CTA #2

---

## 9. Production notes — freshness is mandatory

The production notes block (shared-immutables §14) for a Reaction **must explicitly flag the freshness window**:

\`\`\`
**Timing / freshness window:** 7–14 days from publication. After [date], the
read becomes historical commentary and the video should be unlisted or
re-cut.

**Re-cut triggers:**
- The underlying news event is superseded (e.g., Central Bank UAE issues a
  follow-up clarification within 7 days)
- The geopolitical overlay shifts materially (e.g., ceasefire breaks)
- Subsequent data invalidates the read

**B-roll suggestions:** [3–5 specific shots — Dubai skyline daytime, DLD
storefront, Fitch report cover, market data screen, etc.]

**Thumbnail direction:** [News-headline framing — date overlay, named
source logo if licensable, no exclamation marks, UK English]
\`\`\`

If the video is filmed before the news has been fully disseminated (rare but possible if pre-briefed), flag that the script may need re-cutting after the public release.

---

## 10. News pegs that fit (good Reaction triggers)

A Reaction **requires a concrete, named, date-stamped news event from an allowed source** (shared-immutables §7.1). Examples:

### Strong triggers (instant Reaction territory)
- DLD quarterly transaction data drops
- Fitch / Moody's / S&P sovereign or sector ratings updates
- Central Bank UAE regulatory announcements (LTV, mortgage rules, capital flow rules)
- RERA regulatory updates (escrow rules, broker registration changes, off-plan requirements)
- Major Dubai government announcements affecting property (visa policy, freehold zones, infrastructure timeline shifts)

### Soft triggers (treat carefully — may need framing)
- Geopolitical events affecting the region (use the Iran/March 2026 overlay rule from shared-immutables §10 — measured, mechanical, never alarmist)
- Major developer announcements (only if the developer is RERA-registered and the announcement is publicly material)

### Not Reaction triggers (route to a different format)
- *"My take on Dubai property in 2026"* — this is an Authority Analysis, not a Reaction
- *"What everyone gets wrong about off-plan"* — this is a Myth-Buster
- *"5 areas to watch this year"* — this is a Listicle
- A client situation — this is a Case Study
- A backlog of viewer questions — this is a Q&A
- *"I read an interesting LinkedIn post about Dubai today"* — not a news peg. Do not build a Reaction around opinion content.

If the brief lacks a concrete news peg, **flag and refuse — do not generate**. Recommend a different format that fits the underlying topic.

---

## 11. Output structure (Markdown)

\`\`\`
# [Title]

[Header metadata block per shared-immutables §13]

---

## Packaging

| Field | Detail |
|-------|--------|
| **Title Option 1** | [News-driven angle — "Fitch Just Upgraded the UAE: What That Actually Moves"] |
| **Title Option 2** | [Search-friendly variant — "Dubai Property Reaction: Fitch UAE Outlook April 2026"] |
| **Thumbnail Concept** | [News-headline framing with date overlay — no exclamation marks] |
| **CTA Focus** | Strategy Call only (single CTA — no Strategy Kit in this format) |
| **Target Length** | [4–6 minutes (~750–1,000 words)] |
| **Format** | Live Reaction |
| **News peg** | [Specific event + date + source — REQUIRED] |
| **Freshness window** | 7–14 days from publication |

---

## Hook — News Headline + Tahir's Read

[Spoken text, ~80 words — date-stamped, named source, specific figure, one-line read, credibility anchor]

---

## Section 1: What Happened

[Facts, sourced, no interpretation, ~250 words]

---

## Section 2: What It Actually Means

[Pivot → mechanic with historical comparison → "what's the risk of my read being wrong?" beat → kill-line, ~400 words]

---

## Section 3: What I'm Telling Clients This Week

[Transition → 2–3 concrete time-bounded actions → bridge to CTA, ~200 words]

---

## End-Roll CTA — Strategy Call (single CTA — no Strategy Kit, no CTA #3)

[CTA #2 verbatim per shared-immutables §12 — including the "and if it doesn't make sense, we'll tell you that too" line]

---

## Sign-off

I'm Tahir Majithia. Prime Capital Dubai. With a plan, not a pitch.

---

## Production notes

[Per shared-immutables §14, with freshness window mandatorily flagged — see §9 above]
\`\`\`

---

## 12. Format-specific QC checklist

In addition to the universal QC checklist (shared-immutables §15), verify every item below before delivering:

- [ ] **News peg is concrete, named, date-stamped, sourced from the allowed list** (DLD / RERA / Central Bank UAE / Fitch / Moody's / S&P)
- [ ] **Hook is date-stamped** ("As of [date]…" or "Today is [date]…")
- [ ] **Named source in the hook** with specific data point
- [ ] **Tahir's one-line read in the second sentence of the hook** — never buried
- [ ] **Credibility anchor in the hook** (AED 3B+, 20 years)
- [ ] **Section 1 is facts only**, sourced, no interpretation
- [ ] **At least one named allowed source** in Section 1
- [ ] **At least two specific numbers** in Section 1 with units and timeframes
- [ ] **Section 2 explains the mechanic**, not just the surface implication
- [ ] **One historical comparison** in Section 2 (specific date / Dubai cycle reference)
- [ ] **"What's the risk of my read being wrong?"** beat once, in Section 2
- [ ] **No named numbered frameworks** anywhere
- [ ] **One kill-line** at the end of Section 2
- [ ] **Section 3 gives 2–3 concrete time-bounded actions** ("this week" / "this month")
- [ ] **At least one of the eight investor fears** engaged head-on
- [ ] **Single CTA only** (CTA #2 — Strategy Call); no Strategy Kit, no CTA #3
- [ ] **CTA #2 includes the *"and if it doesn't make sense, we'll tell you that too"* line**
- [ ] **No watch-next tease** in the outro
- [ ] **Sign-off line exact**, directly after CTA #2
- [ ] **Production notes block flags the freshness window** explicitly (7–14 days, re-cut triggers)
- [ ] Output is teleprompter-ready prose under each section heading
- [ ] Word count within 750–1,000
`
