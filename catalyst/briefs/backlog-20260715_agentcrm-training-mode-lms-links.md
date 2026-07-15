<!-- CATALYST - AgentCRM Training Mode curriculum links & media brief -->

---
title: "AgentCRM Training Mode — curriculum links & media"
stage: mvp
tags: [lms, agentcrm, training, media, content]
---

# AgentCRM Training Mode — Curriculum Links & Media

> **Catalyst Brief** — Read [AGENTS.md](../../AGENTS.md) and [BRIEFS.md](../../.catalyst/BRIEFS.md) before implementing.
>
> **LMS-side companion** to the AgentCRM Embedded Training Mode epic, which is implemented in the AgentCRM product repo (`/Users/thg/code/agentcrm`, baseline `58317aa0`). See [backlog-20260715_agentcrm-embedded-training-mode.md](backlog-20260715_agentcrm-embedded-training-mode.md) for the full context. **This is the only piece of that epic that lands in this repo.**

## 1. Summary

Once the embedded Training Mode is stable and its visual pack is captured (AgentCRM sub-brief 5), place the demonstrations, screenshots, captions, and contextual links into the existing AgentCRM Mastery curriculum. This is a content/media placement task only — no LMS callback, no certificate change, no iframe embedding, no new assessment infrastructure.

The curriculum already exists in `_review` (the AgentCRM Mastery competency: `content/lms/10-agentcrm-mastery/` modules, quizzes, and `content/lms/scenarios/agentcrm-workflow-lab.md` / `agentcrm-roleplays.md`). This brief enriches it with real captured media from Training Mode and points learners to the embedded practice experience.

## 2. Scope Definition

### In scope

1. Add the two short demonstrations (Buyer First Response, Seller Response and Retry) and ~8 annotated screenshots into the relevant `10-agentcrm-mastery` modules.
2. Add captions/transcripts (supplied by the AgentCRM capture brief) alongside the media.
3. Add contextual links from the workflow labs (`agentcrm-workflow-lab.md`) pointing learners to the embedded Training Mode for hands-on practice.
4. Validate that all new files parse against the LMS sync schema and cross-references resolve.

### Out of scope

- Any LMS-to-AgentCRM integration: no progress callback, signed launch, iframe, per-click telemetry, or certificate effect (epic §4 out-of-scope).
- Changes to quizzes, pass thresholds, or certification logic.
- Producing the media itself (owned by AgentCRM sub-brief 5).
- Any change to the AgentCRM product repo.

## 3. Dependencies

- **Blocked by** AgentCRM sub-brief `feature_training-mode-visual-capture` delivering approved synthetic assets + captions.
- Assumes the AgentCRM Mastery curriculum remains in place (currently `_review`).

## 4. Approach

Receive the media pack + captions from the AgentCRM team. Place assets in the LMS media location used by existing modules and reference them from the relevant `10-agentcrm-mastery` module bodies. Add short contextual links from the workflow labs to the embedded Training Mode (buyer, seller, capstone). Keep placement consistent with existing module/scenario markdown patterns. Run local content validation.

## 5. Acceptance Criteria

- [ ] Two demonstrations and ~8 screenshots placed in the relevant AgentCRM Mastery modules with captions/transcripts.
- [ ] Workflow labs link learners to the embedded Training Mode for buyer, seller, and capstone practice.
- [ ] All new/changed content parses against the LMS sync schema; cross-references resolve.
- [ ] No LMS callback, certificate change, iframe, or new assessment infrastructure introduced.
- [ ] Media contains only approved synthetic data.

## 6. Human Review

- Confirm the captured media matches the labels/feature gates of the Prime Capital production tenant.
- Confirm the workflow-lab links point to the correct embedded Training Mode entry points.

## 7. Media handoff spec (give to the AgentCRM capture team before sub-brief 5)

**DELIVERED 2026-07-15** by the AgentCRM team. Note the scope grew on approval: the buyer flow now includes bounded synthetic property selection + proposal draft/preview, so the pack is **11 screenshots** (adds 06-property, 07-proposal) + **2 MP4 demos**. Delivered dimensions are 1280×900 (desktop) and 390×844 (mobile) — not the 1920×1080 originally specced, which is fine: these embed as-is.

### Destination paths in this repo

- **Screenshots:** `public/images/lms/training/<file>.png` → embed as `![alt](/images/lms/training/<file>.png)`.
- **Demos:** `public/media/lms/training/<file>.mp4` → embed via a `<video controls>` tag in the module MDX/markdown (no `videos:` frontmatter schema needed).

### Delivered assets (final)

| File | Kind | Caption (for embed alt/figure) |
|---|---|---|
| `demos/buyer-first-response.mp4` | MP4 1280×900 7.72s silent | Buyer First Response loop: signal → qualification → note → NCD → property selection → proposal preview → validation. |
| `demos/seller-follow-up.mp4` | MP4 1280×900 7.20s silent | Seller Response & Retry: preserve No-answer + 2h retry, trigger connected follow-up, then qualification → note → NCD → validation. |
| `01-buyer-signal.png` | 1280×900 | Start from the synthetic signal: read source context and mission before acting. |
| `02-buyer-outcome.png` | 1280×900 | Record the supplied outcome: Connected is stored as simulated evidence, never calls a provider. |
| `03-buyer-qualification.png` | 1280×900 | Confirm, correct, and preserve unknowns: imported values are not treated as confirmed facts. |
| `04-buyer-note.png` | 1280×900 | Four-part note: context, decision meaning, commitment, owner/timing — learner-reviewed, not AI-graded. |
| `05-buyer-ncd.png` | 1280×900 | Set the exact next commitment: proposal review, next business day 15:00 Dubai. |
| `06-buyer-property.png` | 1280×900 | Choose from bounded synthetic candidates: comparison never queries the live catalogue. |
| `07-buyer-proposal.png` | 1280×900 | Review a contained proposal draft: send, share, public view, tracking do not exist. |
| `08-buyer-validation.png` | 1280×900 | Inspect each required result: 7 deterministic checks report Pass/Fix independently, no percentage. |
| `09-mobile-training.png` | 390×844 | Same practice loop on mobile: banner, Exit, mission, progress visible without overflow. |
| `10-seller-retry.png` | 1280×900 | Preserve the seller retry state: No answer + retry NCD exist before the connected follow-up. |
| `11-reset-state.png` | 1280×900 | Reset starts a clean private run: evidence, answers, note, NCD, property, proposal return to fixture. |

Full SHA-256 checksums are in the handoff manifest (`.context/attachments/.../pasted_text_2026-07-15_16-25-21.txt`) — verify after copying.

## 8. Placement map (asset → destination)

The workflow lab (`content/lms/scenarios/agentcrm-workflow-lab.md`) already uses the same golden-thread records (Maya B., Karim S.), so media aligns 1:1:

| Asset | Destination |
|---|---|
| `buyer-first-response.mp4` + `01`,`02` | `10.3` finding/filtering/claiming; workflow-lab buyer first-response LAB |
| `03-buyer-qualification` | `10.4` first call & qualification (buyer) |
| `04-buyer-note`, `05-buyer-ncd` | `10.5` lead details, notes & follow-up |
| `06-buyer-property`, `07-buyer-proposal` | `10.6` properties, shortlists & proposals (matches the new buyer property/proposal scope) |
| `08-buyer-validation`, `11-reset-state` | module `Self-check`/completion sections; workflow-lab self-check |
| `09-mobile-training` | `10.1` operating model & mobile setup; LAB-01 |
| `seller-follow-up.mp4` + `10-seller-retry` | `10.4`/`10.5` seller variants; workflow-lab seller (Karim) LABs |
| "Practice in Training Mode" links (buyer / seller / capstone) | workflow-lab LAB sections (after `Safety stop` / in `Model Approach`) → embedded Training Centre entry points |

## 9. Execution status

- [x] Media pack delivered by AgentCRM (2026-07-15): 2 demos + 11 screenshots, captions, transcripts, checksums.
- [ ] **BLOCKED — need the binary files.** The manifest is in hand but the 13 actual `.mp4`/`.png` files are not in this workspace or any reachable branch. Drop the delivered `demos/` + `screenshots/` directory into the workspace (e.g. `.context/`), or point to its path.
- [ ] Copy assets to `public/images/lms/training/` and `public/media/lms/training/`; verify SHA-256.
- [ ] Embed images + `<video>` demos + "Practice in Training Mode" links per §8.
- [ ] `pnpm test:run` + `pnpm lint` green; visual check that images resolve.
- [ ] Commit; PR references the AgentCRM epic completion.
