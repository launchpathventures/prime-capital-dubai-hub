/**
 * CATALYST - Listicle / Ranking Format Prompt
 *
 * Top-funnel CTR engine. High click-through, broad appeal, designed for
 * shareability and search. The format that pulls cold viewers into the
 * channel.
 *
 * Length: 7–9 minutes (~1,300–1,500 words).
 * Composes with SHARED_IMMUTABLES at generation time.
 *
 * NON-NEGOTIABLE: Title and thumbnail must lead with the number.
 */

export const LISTICLE_PROMPT = `# Format: Listicle / Ranking

Top-funnel. The **CTR engine** of the channel. Listicles pull in cold viewers from search and discovery surfaces; the format is built for click-through and shareability without sliding into clickbait.

A Prime Capital Listicle is not "Top 10 Apartments In Dubai." It is *"Five Dubai Corridors I'd Actively Avoid In 2026,"* or *"Three Mistakes I See Every Quarter From New Investors,"* or *"Four Questions That Eliminate 80% Of Off-Plan Launches."* The format earns the click; the content earns the trust.

---

## 1. Job & audience

### What this format does
Convert a high-intent search query (*"best Dubai areas to invest"*) into a watch session that exposes the viewer to Tahir's voice, frameworks, and trustworthiness — at a depth that no other Dubai channel offers in the same format. The list itself is a hook; the analysis under each item is what holds attention.

### Who's watching this specifically
- **Stage:** Cold. Often arriving via search or YouTube recommendations. They may not yet know the brand.
- **Mindset:** Looking for a fast, scannable read on a topic they've started researching. Most have low patience for setup.
- **Decision criteria:** Does the list deliver one specific insight per item? Or am I getting "great location, good developer, strong yield" — generic filler I've seen on every channel?

### The 80/20 of a Listicle
**80% of the work is the criteria** — what makes the entries entries, what makes the order the order. **20% of the work is the items themselves.** A Listicle without explicit criteria reads as personal opinion; a Listicle with explicit criteria reads as analysis.

The viewer should be able to apply the criteria to a different list and produce a useful answer themselves.

---

## 2. Length & pacing

| Parameter | Value |
|-----------|-------|
| **Target word count** | 1,300–1,500 words |
| **Spoken length** | 7–9 minutes |
| **Hook** | ~100 words |
| **Section 1 — Brief framing** | ~200 words (why this list, criteria) |
| **Section 2 — The List** | ~800–1,000 words total (5 items × ~150–200 words each, or 3 items × ~250 words each) |
| **Mid-roll CTA #1 — placed after item 3 of 5** | ~70 words spoken (~25 seconds) |
| **Section 3 — How to use this list** | ~150 words |
| **End-roll CTA #2** | ~100 words spoken (~35 seconds) |
| **Outro + CTA #3 + sign-off** | ~80 words |

**List length convention:** odd numbers outperform even numbers in titles (5, 3, 7). Three is too few for the runtime; seven is too many to do depth. **Default to 5.** If the topic genuinely fits 3, lengthen each item to ~250 words. If 7, keep items tight at ~120 words and consider whether two items merge.

---

## 3. Hook formula E — Numbered Curiosity

**Single hook only** (no V1/V2 split). Open with the number, tease the most surprising entry, and explain why the audience should stay.

### Required: title and thumbnail must lead with the number
**Non-negotiable**. *"5 Dubai Corridors I'd Actively Avoid In 2026"* — not *"Dubai Corridors To Avoid In 2026."* The number is the click trigger; without it, the format collapses into a generic Authority Analysis.

### Structure
1. **The number, named explicitly** (one sentence)
2. **The teaser of the most surprising entry** — without naming it (creates the open loop)
3. **Why the audience should stay** — what the criteria let them do
4. **Credibility anchor** (AED 3B+, 20 years)
5. **Promise of analytical depth** (not a generic list — specific data and reasoning under each)

### Worked examples (good)

**Good — Corridors to avoid:**
> "There are five Dubai corridors I'd actively avoid in 2026. Number three is going to surprise you, because it's where most investors are buying right now — and the case for buying there is, at first glance, completely reasonable. I'm Tahir Majithia, founder of Prime Capital Dubai. We've placed over three billion dirhams of client capital across multiple market cycles, and the corridors I'm flagging today are flagged because of specific structural reasons — not personal opinion. Each one comes with the data, the criterion, and what to look at instead. By the end of this video, you'll have a screen you can apply to any corridor I haven't covered."

*Why it works:* number leads, surprise teaser (number 3 is contrarian), credibility anchor, promise of structural reasoning over opinion, takeaway promise (a screen for any corridor).

**Good — Mistakes:**
> "Three mistakes I see every quarter from investors who come to us after they've already bought. Mistake number two costs more on average than the first and the third combined — and almost nobody flags it before signing. I'm Tahir Majithia. 20 years in this market, three billion dirhams of client capital placed. These aren't theoretical mistakes. They're patterns that show up in deals every quarter, and each one comes with a specific way to catch it before you sign."

*Why it works:* number leads (three), specific cost teaser (number two is the expensive one), pattern claim grounded in volume (every quarter), promise of preventative criteria.

**Good — Off-plan questions:**
> "There are four questions that eliminate roughly 80% of the off-plan launches we look at. The launches that survive these four questions go on to a much deeper analysis — but if a launch can't pass these four, we don't bother. Question two is the one that catches most investors out, because the data you need to answer it isn't in the brochure. I'm Tahir Majithia, Prime Capital Dubai. Across 20 years and three billion dirhams placed, this filter is the single most useful screening tool I've used."

*Why it works:* number leads, specific filter rate (80%), surprise teaser (question 2), tool-focused (audience leaves with something they can use).

### Hook anti-patterns (do not write)

**Generic / no surprise:**
> ❌ "Today I'm going to share five Dubai areas to invest in."

*Violations:* no surprise teaser, no criteria, no reason to watch the whole video versus reading the comments.

**Clickbait curiosity:**
> ❌ "5 Dubai areas you NEED to know about — number 4 will SHOCK you."

*Violations:* hype words, exclamation construction, audience pattern-matches to scam content.

**Number buried:**
> ❌ "Dubai property is moving fast. Today I want to talk about some of the corridors I'd avoid right now."

*Violations:* number not in the first sentence, no list framing, no surprise teaser.

### Hook quality checklist
- [ ] Number named in the first sentence
- [ ] Surprise teaser for one specific entry (without naming it)
- [ ] Reason to watch the whole video (the criteria, not just the list)
- [ ] Credibility anchor (AED 3B+, 20 years)
- [ ] No exclamation marks, no hype words, no ALL CAPS

---

## 4. Section 1 — Brief framing (~200 words)

Why this list. What the criteria are. Why the audience should care about the criteria, not just the entries.

### Internal structure
1. **Why this list, now** (~60 words). Why is this list relevant in 2026? What's changed in the market that makes the criteria load-bearing now? Tie to a specific cycle observation.
2. **The criteria** (~100 words). What separates the entries on the list from the corridors / mistakes / questions / developers / etc. that didn't make it. **State the criteria explicitly** — the audience should be able to apply them to any new candidate after the video.
3. **The kill-line / setup for the list** (~40 words). The line that frames the list and creates anticipation for item 1. Examples:
   - *"On these criteria, here's how the list looks. I'll start with the entry I'd flag most loudly."*
   - *"Order matters here. I'm building to number one, which is the corridor I think is the most consequentially mispriced — but every one of these earns its spot."*

### Required
- The criteria must be **explicit** — not implied. *"I looked at three things: handover slippage history, secondary-market liquidity, and current price-to-rent ratio."*
- The criteria must be **applicable beyond this list** — the viewer should leave with a screen, not just opinions.
- One historical reference can land here (2008 or 2014) if it justifies the current criteria. Or save it for one of the list items.

### Forbidden
- Generic *"I looked at the data and these stood out"* framing — be specific about the data
- Vague criteria like *"good fundamentals"* — name the metric

---

## 5. Section 2 — The List (~800–1,000 words, ~150–200 words per item)

The substance. Each item gets the same internal structure, executed with discipline.

### Order matters
**Build to the most counterintuitive entry.** Number 1 is the most shareable, screenshot-able insight on the list — the one a viewer is most likely to clip. Number 2–4 are progressively more familiar reads. The teaser entry from the hook (typically number 3 in a 5-item list) is the surprise.

If you're writing a "5 corridors to avoid" list:
- 5 — a corridor most people already suspect (warm-up)
- 4 — a corridor with a specific structural concern (technical depth)
- 3 — the surprise entry (often counter to current investor consensus)
- 2 — a corridor with the most expensive failure mode
- 1 — the most consequentially mispriced corridor on the list (the "Number 1" insight)

**Don't reorder for narrative convenience after the fact.** If item 4 is genuinely the surprise, name it as the surprise in the hook teaser.

### Per-item structure (~150–200 words each)

#### Beat 1 — The item, named (one sentence)
The entry stated cleanly. *"Number five: [Corridor / Mistake / Question / Developer]."*

#### Beat 2 — The data point (~30 words)
**Required: one specific data point per item.** DLD figures, % YoY, occupancy, named regulatory date, completion-vs-advertised slippage, secondary-market velocity. Specificity is the format's whole value.

#### Beat 3 — The practitioner observation (~80 words)
**Required: one practitioner observation per item** — what Tahir has actually seen across deals, not what's pulled from a market report. This is what separates a Prime Capital Listicle from a research-firm summary.

> *"Across the deals we've reviewed in this corridor over the last 18 months, the pattern that's become unmistakable is [specific pattern]. Three of those deals came back to us after the client bought elsewhere — they wanted us to help unwind a position the original recommendation hadn't stress-tested for [specific risk]."*

#### Beat 4 — The actionable takeaway (~30 words)
What the viewer does with this item. A check, a question, an evaluation. Specific, not generic.
> *"If you're looking at this corridor, the question to ask is: [specific question]. The answer determines whether the case for buying here is real or hopeful."*

### Required across the list (not per item)
- **At least one historical reference** somewhere in the list (2008 or 2014, or a specific Dubai-cycle precedent that operationalises the analysis)
- **One named numbered framework maximum** (zero is also fine — the list itself often serves as the framework)
- **At least one of the eight investor fears** engaged head-on (often dictated by the topic — a "corridors to avoid" list maps to fear #4 liquidity; an "off-plan questions" list maps to fear #2 developer reliability)
- **Kill-line at the end of the list** (after item 1, before transitioning to Section 3) — the line that crystallises why the list mattered

### Mid-roll — CTA #1 placement
**Insert after item 3 of 5** (or after item 2 of 3, or after item 4 of 7). The mid-list CTA captures engaged viewers who are halfway through and have demonstrated they're staying — but who may drop off before the end. The transition is natural: *"Before I get to numbers two and one, this is the kind of structured analysis we put into the Strategy Kit."*

CTA delivered in ~70 words spoken. Returns immediately to the list.

Verbatim language and offer per shared-immutables §12.

### Forbidden in the list
- **Items without a specific data point.** "This area has good fundamentals" is filler.
- **Items without a practitioner observation.** Without it, you're just summarising research.
- **Naming competitor agencies, specific developers in identifying ways, or specific buildings.** Even on a "developers I'd avoid" list, **route via category** (*"developers without a completed project in this corridor,"* not *"[Developer Name] is on this list because…"*).
- **Adding items to hit the number.** Better to publish a 4-item list than a 5-item list with a weak entry.

---

## 6. Section 3 — How to use this list (~150 words)

The practical wrap. How does the viewer apply the criteria from Section 1 and the list from Section 2 to their own situation?

### Internal structure
1. **The synthesis** (~60 words). What pattern emerges from looking at all the entries together?
2. **The "what are the risks of getting this list wrong?" beat** (~60 words). **Required, exactly once across the script, placed in Section 3.**
   > *"Now, what are the risks of getting this list wrong? The biggest one is over-applying the criteria — every corridor / question / framework has a context where it doesn't hold. The second is under-applying — assuming this list is a substitute for situation-specific analysis. It isn't. Use it as a screen, not as a recommendation."*
3. **The application bridge** (~30 words). How the audience moves from list to action.

### Required
- The "what are the risks of getting this list wrong?" beat
- A clear application instruction — the audience leaves knowing what to do with the list

---

## 7. End-roll — CTA #2 (Strategy Call) — after Section 3

Standard placement. After the criteria, the list, and the application guidance. The viewer has spent 7–9 minutes with Tahir's analytical voice — the CTA earns itself.

CTA #2 verbatim per shared-immutables §12. **The "and if it doesn't make sense, we'll tell you that too" line is non-negotiable.**

---

## 8. Outro — CTA #3 + Sign-off (~80 words)

Pacing-down repeat of the strategy call link, followed by a **specific** next-video tease, followed by the exact sign-off.

The tease should connect to a Listicle-adjacent topic — often a deeper dive into one of the items, or a complementary list with different criteria.
- *"The corridors I covered today were specifically the ones to avoid. The next video flips it: the four corridors I'd actively look at in 2026, and the criteria that put them on that list. Make sure you're subscribed."*
- *"This list focused on the questions that eliminate launches. The next video covers the questions that elevate them — once a launch survives the first filter, what do you look at next?"*

Sign-off exact: *"I'm Tahir Majithia. Prime Capital Dubai. With a plan, not a pitch."*

---

## 9. Required signature patterns (Listicle only)

Verify every item is present:

- [ ] **Title leads with the number** — non-negotiable
- [ ] **Thumbnail leads with the number** — non-negotiable. **No exclamation marks**.
- [ ] **Single hook**, ~100 words, number named in first sentence, surprise teaser for one entry, criteria-as-takeaway promise, credibility anchor
- [ ] **Section 1 states the criteria explicitly** and reusably
- [ ] **Section 2 = the list**, ordered to build to the most counterintuitive entry
- [ ] **Each list item has one specific data point** (DLD, RERA, % YoY, occupancy, regulatory date, etc.)
- [ ] **Each list item has one practitioner observation** — what Tahir has seen, not what's in a research report
- [ ] **Each list item has an actionable takeaway** — a check, a question, an evaluation
- [ ] **Mid-roll CTA #1 placed mid-list** (after item 3 of 5, or proportional)
- [ ] **At least one historical reference** somewhere in the list (2008 or 2014, or a specific Dubai-cycle precedent)
- [ ] **One named numbered framework maximum** (zero is fine — the list often serves as the framework)
- [ ] **Kill-line at the end of the list** (after item 1)
- [ ] **At least one of the eight investor fears** engaged head-on
- [ ] **"What are the risks of getting this list wrong?"** beat in Section 3
- [ ] CTA #2 placed after Section 3, includes the *"and if it doesn't make sense, we'll tell you that too"* line
- [ ] CTA #3 in the outro: pacing-down call repeat + **specific** next-video tease

---

## 10. Topic-specific guidance

### Strong Listicle topics (good fits)
- Corridors to avoid / actively look at
- Mistakes new Dubai investors make
- Questions to filter off-plan launches / developers / areas
- Mistakes seen during the 2014 cycle that are reappearing
- Red flags in property brochures
- Costs investors underestimate
- Areas where yield is misleading
- Developer due-diligence checks

### Bad fits (route to a different format)
- A single thesis with three supporting arguments — that's an Authority Analysis with sub-sections, not a Listicle
- A breaking news event — that's a Reaction
- "Everyone says X, but…" — that's a Myth-Buster
- A specific real client situation — that's a Case Study
- A backlog of viewer questions — that's a Q&A

### When to refuse the brief
If the brief produces a list where most entries don't have one clear data point or one specific practitioner observation, **flag and propose an Authority Analysis instead** — the topic isn't built for the Listicle's per-item discipline.

---

## 11. Output structure (Markdown)

\`\`\`
# [Title — must lead with the number]

[Header metadata block per shared-immutables §13]

---

## Packaging

| Field | Detail |
|-------|--------|
| **Title Option 1** | [Number-led, specific — e.g. "5 Dubai Corridors I'd Actively Avoid In 2026"] |
| **Title Option 2** | [Number-led, search-friendly — e.g. "5 Dubai Areas To Avoid: Strategic Investor Guide 2026"] |
| **Thumbnail Concept** | [Number must dominate the thumbnail. No exclamation marks. UK English. One-sentence visual brief.] |
| **CTA Focus** | Strategy Kit (mid-list) + Strategy Call (end-roll + outro) |
| **Target Length** | [7–9 minutes (~1,300–1,500 words)] |
| **Format** | Listicle |
| **List length** | [3 / 5 / 7 — default 5] |

---

## Hook — Numbered Curiosity

[Spoken text, ~100 words — number-led, surprise teaser, criteria promise, credibility anchor]

---

## Section 1: Why This List

[Why now → the criteria explicitly stated → kill-line, ~200 words]

---

## Section 2: The List

### Item [N]: [Item name]

[Item named → one specific data point → one practitioner observation → actionable takeaway, ~150–200 words]

[Repeat per item. Mid-roll CTA #1 inserted after item 3 of 5 (or proportional).]

---

## Mid-Roll CTA — The 2026 Investor Strategy Kit

[Inserted at the proportional mid-point of the list. CTA #1 verbatim per shared-immutables §12.]

---

[Continue list — items 2 and 1 — building to the most counterintuitive insight]

---

## Kill-line / list close

[Punchy line at the end of item 1 / end of list, ~30 words]

---

## Section 3: How to use this list

[Synthesis → "what are the risks of getting this list wrong?" beat → application bridge, ~150 words]

---

## End-Roll CTA — Strategy Call

[CTA #2 verbatim per shared-immutables §12 — including the "and if it doesn't make sense, we'll tell you that too" line]

---

## Outro — CTA #3 + Sign-off

[CTA #3 (call repeat + watch-next tease — often a complementary list with different criteria) + exact sign-off, ~80 words]

---

## Production notes

[Per shared-immutables §14, with thumbnail / title number rule reinforced]
\`\`\`

---

## 12. Format-specific QC checklist

In addition to the universal QC checklist (shared-immutables §15), verify every item below before delivering:

- [ ] **Title leads with the number** — non-negotiable
- [ ] **Thumbnail brief specifies the number must dominate** — non-negotiable
- [ ] **Zero exclamation marks** in title or thumbnail brief
- [ ] **Hook**, ~100 words: number in first sentence, surprise teaser for one entry, criteria-as-takeaway promise, credibility anchor
- [ ] **Section 1 states the criteria explicitly** — reusable beyond this list
- [ ] **List ordered to build to the most counterintuitive entry** (Number 1)
- [ ] **Each item has one specific data point** — no generic "good fundamentals"
- [ ] **Each item has one practitioner observation** — what Tahir has seen across deals
- [ ] **Each item has an actionable takeaway** — a check, a question, an evaluation
- [ ] **Mid-roll CTA #1 placed mid-list** (after item 3 of 5, or proportional)
- [ ] **At least one historical reference** in the list (2008 or 2014, or specific Dubai-cycle precedent)
- [ ] **One named framework maximum** in the script
- [ ] **Kill-line at the end of the list**
- [ ] **At least one of the eight investor fears** engaged head-on
- [ ] **"What are the risks of getting this list wrong?"** beat in Section 3
- [ ] CTA #2 placed after Section 3, includes the *"and if it doesn't make sense, we'll tell you that too"* line
- [ ] CTA #3 in the outro: pacing-down call repeat + **specific** next-video tease (often a complementary list)
- [ ] Sign-off line exact
- [ ] No competitor agencies named, no identifying developers/buildings on items
- [ ] Output is teleprompter-ready prose under each section heading
- [ ] Word count within 1,300–1,500
`
