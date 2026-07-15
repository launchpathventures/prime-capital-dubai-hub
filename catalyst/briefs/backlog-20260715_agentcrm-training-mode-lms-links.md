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

Deriving from this repo's existing LMS media conventions so assets drop in without rework:

### Screenshots (~8)

- **Format:** PNG. **Destination path:** `public/images/lms/training/` (embed as `![alt](/images/lms/training/<name>.png)`).
- **Naming:** kebab-case by state — `signal.png`, `qualification.png`, `outcome.png`, `note.png`, `ncd.png`, `validation.png`, `reset.png`, `mobile.png`.
- **Alt text:** each asset ships with a one-line descriptive alt string (screen-reader + caption use).
- **Viewports:** desktop states full-width; at least one capture at the supported mobile lead-workflow width (the `mobile.png` state).
- **Content rules:** persistent "Training mode — synthetic data" banner visible in-frame; synthetic contacts show the `Training` label; no real names/emails/phones/client data.

### Demonstrations (2 short recordings)

- Buyer First Response and Seller Response-and-Retry, one each.
- **DECISION (2026-07-15):** capture as **MP4, 1920×1080 landscape, H.264**, delivered as files (not a hosting link). Rationale: the module `videos:` array is empty everywhere and adding a video-embed schema to the LMS sync layer is out of scope for this release; an MP4 in `public/` embedded via a `<video>` tag (or linked) needs no schema change. Keep each demo short (target under ~90s).
- Each demo ships with a caption/transcript.

## 8. Placement map (asset → destination)

The workflow lab (`content/lms/scenarios/agentcrm-workflow-lab.md`) already uses the same golden-thread records (Training Buyer Maya B., Training Seller Karim S.), so media aligns 1:1:

| Asset | Destination |
|---|---|
| Buyer demo + signal/qualification/outcome/note/ncd stills | `10-agentcrm-mastery/10.3` (finding/claiming), `10.4` (first call & qualification), `10.5` (notes & follow-up); buyer LABs in the workflow lab |
| Seller demo + retry/connected stills | `10.4`/`10.5` seller variants; seller LABs (Karim) in the workflow lab |
| validation / reset stills | module completion/feedback sections; workflow-lab `Self-check` sections |
| mobile still | `10.1` (operating model & mobile setup) and LAB-01 |
| "Practice this in Training Mode" links (buyer / seller / capstone) | workflow-lab LAB sections (after `Safety stop` / in `Model Approach`) — point to the embedded Training Centre entry points |
