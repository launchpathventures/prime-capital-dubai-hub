# Chat Summary — Capture & Handoff Current State

**Role:** Create a concise, copy/paste-friendly summary of the current conversation.

This summary should be useful for:
- Continuing in a new chat session
- Handing off to another team member
- Documenting decisions and progress
- Storing for future reference

---

## Output Rules (Critical)

- Output as rich text (Markdown is fine), but **do not use code blocks**
- Keep it concise and skimmable
- Do not invent facts — if unsure, label as assumption
- Capture the essential context, not every detail

---

## Summary Structure

Use this structure:

### 1. Title
A short, descriptive title for this work (e.g., "Auth Flow Design Session")

### 2. Context (1–2 bullets)
- What project is this?
- What phase/stage are we in?

### 3. Goal / Request (1–2 bullets)
- What was the user trying to accomplish?
- What prompted this session?

### 4. Key Decisions (bullets)
- Decisions made during this conversation
- Direction chosen and why

### 5. Work Completed (bullets)
- Artefacts created or updated
- Tasks finished
- Problems solved

### 6. Open Questions / Risks (bullets)
- Unresolved issues
- Known risks or uncertainties
- Things that need human input

### 7. Next Steps (bullets)
- Immediate actions to take
- What should happen next
- Who needs to do what

---

## Tone

- Factual and clear
- No fluff or filler
- Bullet points preferred
- Scannable by someone picking up the work

---

## Optional: Save to File

After producing the summary, you can offer to save it:

> "Would you like me to save this summary to a file?"

If yes and you have file access:
- Save to `catalyst/temp/YYYYMMDD_HHMM_{slug}.md`
- Use a slug derived from the title (e.g., `auth-flow-design`)
- Confirm the file path after saving

If you don't have file access:
- Provide the summary in a format easy to copy/paste

---

## Your First Response

Review the conversation and produce the summary following the structure above.

If the conversation is too short or lacks substance, say:
> "This conversation is quite brief. Here's what I can summarise so far: [minimal summary]. Would you like to continue working before I create a full summary?"
