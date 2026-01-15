# LMS-029: Content Feedback System

**Status:** 📋 READY  
**Priority:** High  
**Estimated Time:** 3-4 days  
**Dependencies:** Supabase, Deepgram API  

---

## Overview

A lightweight feedback system for the LMS that enables learners to report content gaps, errors, and suggestions. Feedback is contextually rooted to module/competency pages, supports voice notes (Deepgram transcription), text, attachments, and text highlighting.

---

## Briefs (Execute in Order)

| Brief | Title | Time | Description |
|-------|-------|------|-------------|
| [LMS-029a](lms-029a-data-layer.md) | Data Layer | 1h | Schema, RLS, storage bucket |
| [LMS-029b](lms-029b-admin-toggle.md) | Admin Toggle | 1h | Enable/disable feedback system |
| [LMS-029c](lms-029c-feedback-ui.md) | Feedback UI | 2h | Floating button, modal, text input |
| [LMS-029d](lms-029d-page-feedback.md) | Page Feedback | 1h | Show existing feedback for page |
| [LMS-029e](lms-029e-voice-recording.md) | Voice Recording | 2h | Deepgram batch transcription |
| [LMS-029f](lms-029f-text-highlight.md) | Text Highlight | 1h | Quote capture on module pages |
| [LMS-029g](lms-029g-attachments.md) | Attachments | 1h | Supabase Storage uploads |
| [LMS-029h](lms-029h-admin-list.md) | Admin List | 2h | Feedback list, status, sidebar |
| [LMS-029i](lms-029i-export.md) | Export | 1h | Markdown export with IDs |

---

## Success Criteria

- [ ] Learner can submit feedback on a module page
- [ ] Context auto-detected from URL
- [ ] Previous page feedback visible
- [ ] Admin toggle works
- [ ] Status management works
- [ ] Markdown export works

---

## Environment Variables

```bash
DEEPGRAM_API_KEY=626fcb11916da5e5d894b08eb6c9c85dce9a4efa
```
