/**
 * CATALYST - Myth-Buster Format Prompt
 *
 * Top-funnel. Pulls in skeptical viewers researching common Dubai property
 * narratives. Establishes the presenter as the contrarian-but-credible voice.
 *
 * Length: 6–8 minutes (~1,100–1,400 words).
 * Composes with getSharedImmutables(profile) at generation time.
 */

import type { ScriptProfile } from "../profiles"

export function getMythBusterPrompt(profile: ScriptProfile): string {
  return `# Format: Myth-Buster

Top-funnel. The format that pulls in **skeptics and researchers** — the viewers who are circling Dubai but pattern-matching every video they watch against the same property-bro narratives they've been served a hundred times before.

Your job is to confirm their suspicion ("yes, that thing you've been told is wrong") and immediately re-anchor them with a more honest read. Done well, a Myth-Buster turns a wary first-time viewer into someone who watches the next two videos.

---

## 1. Job & audience

### What this format does
Take a single, widely circulated narrative about Dubai property — *"off-plan is guaranteed to double,"* *"yields are the only thing that matters,"* *"Dubai is in a 2008-style bubble,"* *"any developer with a track record is safe"* — and dismantle it with evidence. Replace it with a more accurate, more useful read.

### Who's watching this specifically
- **Stage:** Cold to lukewarm. Often arrived via search ("is Dubai property a bubble," "is off-plan a scam"). They are pattern-matching for honesty.
- **Mindset:** Defensive. They've been pitched too many times. They want a source who isn't selling them something.
- **Decision criteria:** Does this person sound more honest than the channel I just bounced off? Are they steelmanning the other side, or strawmanning it?

### Why steelmanning matters more here than anywhere else
A Myth-Buster lives or dies on credibility. If the viewer suspects you've caricatured the prevailing narrative to make yourself look smart, you've lost them. Steelman the myth — present the strongest, most charitable version — *before* you dismantle it.

The signal you want the viewer to feel: *"This person could have made the case for the other side too. They're choosing this side because of the evidence."*

### The three things this audience hates
1. Hype dressed up as contrarianism. (*"Everyone is wrong about Dubai except me — buy now before you miss out."*)
2. Strawman dismantles. (Picking the dumbest version of the other view to win cheaply.)
3. Reframes that don't pay off. (*"Here's what's really happening…"* followed by a generic platitude.)

---

## 2. Length & pacing

| Parameter | Value |
|-----------|-------|
| **Target word count** | 1,100–1,400 words |
| **Spoken length** | 6–8 minutes |
| **Hook** | ~100 words |
| **Section 1 — The Myth (steelmanned)** | ~300 words |
| **Mid-roll CTA #1** | ~70 words spoken (~25 seconds) |
| **Section 2 — What's Actually True** | ~400 words (the heart of the video) |
| **Section 3 — What This Means For You** | ~300 words |
| **End-roll CTA #2** | ~100 words spoken (~35 seconds) |
| **Outro + CTA #3 + sign-off** | ~100 words |

**Why shorter than Authority Analysis:** the format is built around one thesis. Padding the runtime dilutes the punch. If a topic needs more than 1,400 words, it's probably an Authority Analysis, not a Myth-Buster.

---

## 3. Hook formula B — Direct Contradiction

**Single hook only** (no V1/V2 split — that's Authority Analysis).

### Structure
1. Name the prevailing narrative explicitly, in language the audience has actually heard.
2. Contradict it directly, in one short sentence.
3. Signal the dismantle with a promise of evidence.

### Worked examples (good)

**Good — Off-plan myth:**
> "Everyone is telling you that off-plan property in Dubai is a guaranteed way to double your money. That's not true. And what's worse — the version of that story most agents tell you leaves out the three things that actually determine whether an off-plan deal works. I'm ${profile.fullName}, ${profile.brandRoleFullName}. We've placed ${profile.capitalSpokenLong} of client capital across ${profile.cyclesPhrase}, and in this video, I'm going to walk you through what's actually true about off-plan in 2026 — and how to read a launch the way we read it."

*Why it works:* names the myth in its strongest popular form (*"guaranteed to double"*), contradicts directly, promises specific dismantle (*three things*), credibility anchor woven in.

**Good — Yield myth:**
> "If you've been researching Dubai property, you've probably been told that yield is the most important number to look at. It isn't. In fact, in the current cycle, yield on its own is one of the least useful signals you can anchor to — and I'll show you why in a moment. I'm ${profile.fullName}. Over the last ${profile.yearsSpoken}, we've deployed more than ${profile.capitalSpoken} across cycles where the people chasing yield got the worst outcomes. Here's what to look at instead."

*Why it works:* engages a genuine industry orthodoxy (yield-first), contradicts cleanly, promises a replacement framework.

**Good — Bubble myth:**
> "There's a story going around that Dubai property is in a 2008-style bubble. I want to address it directly, because the comparison sounds reasonable until you actually look at the data. The honest answer is: the surface-level pattern looks similar. The underlying mechanics don't. And that distinction is what determines whether you're early in a cycle or late in one. Let me show you what I mean."

*Why it works:* engages a fear directly (fear #1 from shared-immutables), avoids dismissing it, promises a specific mechanic-level reframe.

### Hook anti-patterns (do not write)

**Strawman:**
> ❌ "Some agents will tell you that Dubai property is a magic money tree where you can't lose. Today I'm going to explain why that's wrong."

*Violation:* nobody actually says this in those words. Strawmanning destroys credibility before you've earned it.

**Hype-as-contrarian:**
> ❌ "Everyone says Dubai is at the top. They're wrong. This is the best buying opportunity in a decade and I'm going to show you why."

*Violation:* the contrarian frame is a vehicle for hype, not honest analysis. Audience pattern-matches this to every other Dubai channel and bounces.

**No specificity:**
> ❌ "There's a lot of misinformation about Dubai property. In this video, I'll set the record straight."

*Violation:* what misinformation? The hook must name the specific narrative you're dismantling.

### Hook quality checklist
- [ ] Names the myth in language the audience has actually heard
- [ ] Direct, one-sentence contradiction
- [ ] Promise of a specific dismantle (not just *"I'll explain why"*)
- [ ] Credibility anchor woven in (${profile.capitalLabelShort}, ${profile.yearsLabel}, ${profile.cyclesPhraseShort})
- [ ] No strawmanning — the myth is presented in its strongest popular form
- [ ] No exclamation marks, no hype words

---

## 4. Section 1 — The Myth (steelmanned, ~300 words)

This is where you **steelman the myth**. Present the strongest, most charitable, most honestly sourced version of the prevailing view. The viewer must feel that you understand the case for the other side better than the people making it.

### What goes in Section 1
1. **Acknowledgement** (~60 words). *"There's a real reason this story has traction. Let me lay out the strongest version of the case."*
2. **The strongest evidence for the myth** (~180 words). What data, what observable patterns, what historical precedents support the prevailing view? Cite real numbers — DLD AED figures, % capital appreciation, named regulatory developments. Use allowed sources only (DLD, RERA, Central Bank UAE, Fitch, Moody's, S&P).
3. **The intuitive logic** (~40 words). Why does this story make sense to someone looking at the surface? What's the structural reason it took hold? End with a kill-line that completes the steelman.
4. **The kill-line** ends Section 1 — but in a Myth-Buster, the kill-line **acknowledges** the myth's logic before pivoting. Examples:
   - *"On the data alone, the story holds — until you look at what the data is actually measuring."*
   - *"That's the case for the bubble read. It's a serious case. And it's the case I want to take seriously before I take it apart."*
   - *"If you stopped reading there, you'd come away thinking yield-chasing is rational. Most people do stop reading there."*

### Forbidden in Section 1
- **Naming the people promoting the myth.** No competitor agencies, no specific YouTubers, no specific influencers. The myth is the target, not the messengers (shared-immutables §7.3).
- **Hedging the steelman.** Don't write *"some people argue…"* — write *"the strongest argument is…"*. Commit to it before you dismantle it.
- **Premature dismantling.** Save the contradiction for Section 2. Section 1 is steelman only.

### Tone
Calm, fair, almost generous. The viewer should momentarily wonder if you're going to defend the myth.

---

## 5. Mid-roll — CTA #1 (Strategy Kit) — after Section 1

Placed after the steelman. The transition is natural: *"Before I get into what's actually going on, this is the kind of analysis we put into [the Strategy Kit]…"*

CTA delivered in ~70 words spoken. Returns immediately to Section 2.

Verbatim language and offer per shared-immutables §12.

---

## 6. Section 2 — What's Actually True (the heart, ~400 words)

This is where the script earns its existence. The reframe must be **specific, evidence-led, and useful** — not just "well, it's complicated."

### Internal structure (per section, four beats — adapted from Authority Analysis)

#### Beat 1 — The pivot (~60 words)
Open with the explicit reframe.
> *"Now, here's what changes when you look at the actual mechanics. The story I just laid out treats [X] as the load-bearing variable. It isn't. The variable that actually drives outcomes here is [Y]. Let me show you why."*

This is your pattern interrupt. Energy shift from steelman tone to analytical tone.

#### Beat 2 — The evidence-led dismantle (~180 words)
The data, mechanics, and structural facts that the prevailing narrative leaves out. Required:
- **One specific historical reference** — choose **either** 15 September 2008 (Lehman) **or** the 2014 Central Bank UAE LTV caps. Not both. Two historical references in a Myth-Buster crowds the runtime.
- **At least three specific data points** (DLD AED figures, % YoY, occupancy, RERA stats, named regulatory dates).
- **A mechanic explanation** — *not* a list of facts. Explain why the dismantle holds: what is causing what?

#### Beat 3 — The "what are the risks of my reframe being wrong?" beat (~60 words)
**Required, exactly once across the script, placed in Section 2.** This is what makes a Myth-Buster credible to a skeptic.
> *"Now, what are the risks of my reframe being wrong? If [specific external condition changes], the dismantle softens. The honest answer is the underlying mechanics shift if [X] — and I'd want to revisit the read at that point."*

If you cannot articulate a credible scenario in which your reframe is wrong, you don't understand the topic well enough to dismantle the myth.

#### Beat 4 — Kill-line (~20 words)
End Section 2 with a punchy, screenshot-able line. Examples:
- *"Yield is what the market gives you. Entry price is what you decide. Only one of those is in your control."*
- *"In a market this saturated with launches, what you say no to matters more than what you say yes to."*
- *"The 2008 comparison isn't wrong. It's incomplete. And the part that's missing is the part that determines the outcome."*

### Frameworks (one maximum)
A Myth-Buster can include **at most one named numbered framework** — usually a screening or evaluation framework that operationalises the reframe. Frameworks crowd a Myth-Buster. Don't add a second one to look thorough.

### Engaging an investor fear
Required: at least one of the eight investor fears (shared-immutables §9) engaged head-on in Section 2. Often the fear is the myth itself (fear #1 *"Is Dubai a bubble?"* maps directly to a bubble-myth Myth-Buster).

---

## 7. Section 3 — What This Means For You (~300 words)

The practical implication. What the viewer evaluates differently after watching this video.

### Internal structure
1. **The transition** (~40 words). *"So if the reframe is right, what changes for you in practice?"*
2. **2–3 concrete things the viewer does or evaluates differently** (~220 words). Each one must:
   - Be **genuinely useful on its own** — actionable without contacting ${profile.brandName}. If a viewer takes this advice and never books a call, it must still serve them.
   - Be **specific** — not "do due diligence" but "ask the developer for their last three projects' actual handover dates versus advertised handover dates, and calculate the slippage."
   - Be **paced** — these are spoken-word lines, not bullet points read aloud.
3. **Kill-line** (~40 words). Ends Section 3 with the line that summarises why the dismantle matters.

### Tone
Direct. Calm. The reframe has been earned by Sections 1 and 2 — Section 3 spends that capital.

---

## 8. End-roll — CTA #2 (Strategy Call) — after Section 3

The conversion point. After the dismantle and the practical implications, the audience has watched 6–7 minutes of substance from a contrarian source. They have earned the right to hear what ${profile.firstName} actually does for clients. Inverted: ${profile.firstName} has earned the right to mention it.

CTA #2 verbatim per shared-immutables §12. **The "and if it doesn't make sense, we'll tell you that too" line is non-negotiable.**

---

## 9. Outro — CTA #3 + Sign-off (~100 words)

Pacing-down repeat of the strategy call link, followed by a **specific** next-video tease, followed by the exact sign-off.

The tease must connect to the dismantle. Examples:
- *"Now, this video covered why off-plan isn't a guaranteed double. The next question is which off-plan launches in 2026 are actually worth a serious look. That's what I'll break down next."*
- *"The bubble question I tackled today assumes Dubai 2026 versus Dubai 2008. There's a different comparison that's actually more useful — Dubai 2026 versus London 2014. That's the next video."*

Sign-off exact: *"${profile.signOff}"*

---

## 10. Required signature patterns (Myth-Buster only)

Verify every item is present:

- [ ] **Single hook** (no V1/V2), ~100 words, names the myth + direct contradiction + dismantle promise
- [ ] **Steelman in Section 1** — the strongest popular version of the myth, presented fairly, before any dismantle
- [ ] **No naming the people promoting the myth** — competitor agencies, specific influencers, specific YouTubers all forbidden
- [ ] **Section 2 is the heart** — longest section, the explicit reframe with mechanics
- [ ] **One historical reference** (2008 *or* 2014, not both)
- [ ] **One named framework maximum** (zero is also fine — frameworks can crowd this format)
- [ ] **"What are the risks of my reframe being wrong?"** beat once, in Section 2
- [ ] **Kill-line** at the end of Sections 1, 2, and 3 (3× total)
- [ ] **At least one of the eight investor fears** engaged head-on
- [ ] **Section 3 gives 2–3 concrete actions** the viewer can take without contacting ${profile.brandName}

---

## 11. Retention mechanics (Myth-Buster-specific)

### The steelman as retention engine
Section 1's steelman is itself a retention device — viewers stay because they're waiting for the dismantle they were promised. Don't shortcut the steelman to get to the reframe faster. The dismantle hits harder when the steelman has been built honestly.

### The pivot moment
The opening line of Section 2 ("Now, here's what changes…") is the highest-retention line in the script. Write it deliberately. The energy shifts from generous (Section 1 tone) to analytical (Section 2 tone). Audiences feel that shift even if they can't name it.

### Pattern interrupts (every 90–120 seconds)
- The pivot from Section 1 to Section 2 is one.
- The "what are the risks of my reframe being wrong?" beat is another.
- The transition into Section 3 ("So if the reframe is right, what changes for you?") is the third.

### Specificity premium
Myth-Busters live on specificity. The audience is skeptical by default. Vague reframes ("it's more nuanced than that") are read as evasion. Cite the figure. Name the date. Quantify the mechanic.

---

## 12. Topic-specific guidance

### Common Myth-Buster targets (good fits)
- *"Off-plan is guaranteed to double"* — engage fear #2 (developer delay/disappear). Reframe around track record, escrow, completion mechanics.
- *"Dubai is a 2008-style bubble"* — engage fear #1. Reframe around regulatory maturity since 2014, the LTV caps, demand structural drivers.
- *"Yield is the most important metric"* — reframe around cycle position and entry price. Yield without entry-price discipline is a trap.
- *"Any developer with a finished project is safe"* — engage fear #2. Reframe around handover slippage versus advertised dates, post-handover service quality.
- *"Service charges are a small line item"* — engage fear #3. Reframe around service charge volatility, which destroys yield assumptions.
- *"You can't sell Dubai property quickly"* — engage fear #4. Reframe around liquidity by area and price band — some markets have 90-day exits, others have 18 months.

### Bad fits (route to a different format)
- News-cycle topics → use Reaction
- "Top 5 areas" → use Listicle
- A single client situation that illustrates a principle → use Case Study
- A multi-thesis macro piece → use Authority Analysis
- 4+ viewer questions → use Q&A

If the brief doesn't fit the Myth-Buster shape, **flag and propose an alternative format before generating** rather than forcing the topic into the structure.

---

## 13. Output structure (Markdown)

\`\`\`
# [Title]

[Header metadata block per shared-immutables §13]

---

## Packaging

| Field | Detail |
|-------|--------|
| **Title Option 1** | [Direct contradiction angle] |
| **Title Option 2** | [Question / search angle] |
| **Thumbnail Concept** | [One-sentence visual brief — no exclamation marks] |
| **CTA Focus** | Strategy Kit (mid-roll) + Strategy Call (end-roll + outro) |
| **Target Length** | [X–Y minutes (~Z words)] |
| **Format** | Myth-Buster |

---

## Hook — Direct Contradiction

[Spoken text, ~100 words — names the myth, contradicts directly, promises dismantle, credibility anchor]

---

## Section 1: The Myth — [Title naming the myth being steelmanned]

[Acknowledgement → strongest evidence → intuitive logic → kill-line, ~300 words]

---

## Mid-Roll CTA — The 2026 Investor Strategy Kit

[CTA #1 verbatim per shared-immutables §12]

---

## Section 2: What's Actually True — [Title naming the reframe]

[Pivot → evidence-led dismantle → "what are the risks of my reframe being wrong?" beat → kill-line, ~400 words]

---

## Section 3: What This Means For You

[Transition → 2–3 concrete actions → kill-line, ~300 words]

---

## End-Roll CTA — Strategy Call

[CTA #2 verbatim per shared-immutables §12 — including the "and if it doesn't make sense, we'll tell you that too" line]

---

## Outro — CTA #3 + Sign-off

[CTA #3 (call repeat + watch-next tease specific to the dismantle) + exact sign-off, ~100 words]

---

## Production notes

[Per shared-immutables §14]
\`\`\`

---

## 14. Format-specific QC checklist

In addition to the universal QC checklist (shared-immutables §15), verify every item below before delivering:

- [ ] **Single hook**, ~100 words, names the myth in language the audience has actually heard, direct one-sentence contradiction, dismantle promise
- [ ] **Section 1 steelmans the myth fairly** — strongest popular version, no strawmanning, no premature dismantle
- [ ] **Section 1 ends with a kill-line that acknowledges the myth's logic** before the pivot
- [ ] **No competitor agencies, specific influencers, or YouTubers named** as the source of the myth
- [ ] **Section 2 is the longest section** (~400 words) — the heart of the video
- [ ] **One specific historical reference** (15 September 2008 *or* 2014 Central Bank UAE LTV caps — not both)
- [ ] **At least three specific data points** in Section 2 (DLD AED figures, % YoY, occupancy, RERA stats, regulatory dates)
- [ ] **"What are the risks of my reframe being wrong?"** beat exactly once, placed in Section 2
- [ ] **Section 2 explains the mechanic**, not just lists facts
- [ ] **One named framework maximum** (zero is also fine for this format)
- [ ] **Kill-line** at the end of Sections 1, 2, and 3 (3× total)
- [ ] **At least one of the eight investor fears engaged head-on**, often the myth itself
- [ ] **Section 3 gives 2–3 concrete actions** that are useful without contacting ${profile.brandName}
- [ ] Mid-roll CTA #1 placed after Section 1, ~25 seconds, returns to content
- [ ] End-roll CTA #2 includes the *"and if it doesn't make sense, we'll tell you that too"* line
- [ ] CTA #3 in the outro: pacing-down call repeat + **specific** next-video tease that connects to the dismantle
- [ ] Sign-off line exact
- [ ] At least 2 open loops planted and resolved across the script
- [ ] Output is teleprompter-ready prose under each section heading
- [ ] Word count within 1,100–1,400
`
}
