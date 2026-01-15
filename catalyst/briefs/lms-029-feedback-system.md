# LMS-029: Content Feedback System

**Status:** 📋 READY  
**Priority:** High  
**Estimated Time:** 3-4 days  
**Dependencies:** Supabase, Deepgram API  
**Agent-Safe:** ✅ Yes — well-defined inputs/outputs, follows existing patterns

---

## Overview

A lightweight feedback system for the LMS that enables learners to report content gaps, errors, and suggestions. Feedback is contextually rooted to module/competency pages, supports voice notes (Deepgram transcription), text, attachments, and text highlighting. Admins can toggle the system, view all feedback, manage status, and export to Markdown for AI-assisted content updates.

---

## Briefs

This feature is split into focused briefs:

| Brief | Title | Status | Description |
|-------|-------|--------|-------------|
| LMS-029a | Data Layer | 📋 READY | Schema, RLS, storage bucket |
| LMS-029b | Admin Toggle | 📋 READY | Enable/disable feedback system |
| LMS-029c | Feedback UI | 📋 READY | Floating button, modal, context detection |
| LMS-029d | Voice Recording | 📋 READY | Deepgram batch transcription |
| LMS-029e | Text Highlighting | 📋 READY | Quote capture on module pages |
| LMS-029f | Attachments | 📋 READY | Supabase Storage uploads |
| LMS-029g | Page Feedback | 📋 READY | Show existing feedback for page |
| LMS-029h | Admin Management | 📋 READY | Feedback list, status, sidebar link |
| LMS-029i | Markdown Export | 📋 READY | Export with feedback IDs |

---

## Success Criteria

- [ ] Learner can submit feedback on a module page with voice/text/attachment
- [ ] Highlighted text is captured correctly
- [ ] Context auto-detected from URL (module-specific vs general)
- [ ] Previous page feedback visible to avoid duplicates
- [ ] Feedback appears in admin list with filtering
- [ ] Status can be updated by admin (new → in_progress → complete)
- [ ] Export produces valid Markdown with feedback IDs
- [ ] Admin toggle enables/disables feedback button site-wide

---

## Technical Approach

### Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Feedback System                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐    │
│  │   Floating   │     │   Feedback   │     │    Page      │    │
│  │   Button     │────▶│    Modal     │────▶│  Feedback    │    │
│  │              │     │              │     │   List       │    │
│  └──────────────┘     └──────────────┘     └──────────────┘    │
│                              │                                   │
│                              ▼                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    Feedback Form                          │   │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐     │   │
│  │  │ Context │  │  Text   │  │  Voice  │  │ Attach  │     │   │
│  │  │ Toggle  │  │  Input  │  │ Record  │  │  Files  │     │   │
│  │  └─────────┘  └─────────┘  └─────────┘  └─────────┘     │   │
│  │                    │              │           │           │   │
│  │                    ▼              ▼           ▼           │   │
│  │              ┌──────────────────────────────────────┐    │   │
│  │              │         Supabase Storage             │    │   │
│  │              │    (audio files, attachments)        │    │   │
│  │              └──────────────────────────────────────┘    │   │
│  │                              │                            │   │
│  │                              ▼                            │   │
│  │              ┌──────────────────────────────────────┐    │   │
│  │              │         Deepgram API                 │    │   │
│  │              │    (batch transcription)             │    │   │
│  │              └──────────────────────────────────────┘    │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              │                                   │
│                              ▼                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                 lms_feedback table                        │   │
│  │  - context (competency_slug, module_slug)                │   │
│  │  - content (text, transcription, quoted_text)            │   │
│  │  - attachments (array of storage paths)                  │   │
│  │  - status (new, in_progress, complete)                   │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              │                                   │
│                              ▼                                   │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐    │
│  │    Admin     │     │   Feedback   │     │   Markdown   │    │
│  │   Sidebar    │────▶│    List      │────▶│   Export     │    │
│  │    Link      │     │              │     │              │    │
│  └──────────────┘     └──────────────┘     └──────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Key Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `FeedbackButton` | `components/lms/feedback-button.tsx` | Floating trigger button |
| `FeedbackModal` | `components/lms/feedback-modal.tsx` | Main feedback form |
| `FeedbackVoice` | `components/lms/feedback-voice.tsx` | Voice recording UI |
| `FeedbackQuote` | `components/lms/feedback-quote.tsx` | Text selection handler |
| `PageFeedback` | `components/lms/page-feedback.tsx` | Show existing feedback |
| `FeedbackProvider` | `components/lms/feedback-provider.tsx` | Context + state |

### Database Schema

```sql
-- Core feedback table
create table lms_feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  
  -- Context
  feedback_type text not null check (feedback_type in ('general', 'module')),
  competency_slug text,
  module_slug text,
  page_url text,
  
  -- Content
  text_content text,
  voice_transcription text,
  quoted_text text,
  
  -- Files
  audio_path text,
  attachments text[], -- array of storage paths
  
  -- Status
  status text not null default 'new' check (status in ('new', 'in_progress', 'complete')),
  
  -- Timestamps
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

### API Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/feedback` | POST | Submit new feedback |
| `/api/feedback` | GET | List feedback (admin) |
| `/api/feedback/[id]/status` | PATCH | Update status (admin) |
| `/api/feedback/export` | GET | Markdown export |
| `/api/feedback/transcribe` | POST | Deepgram transcription |

---

## Environment Variables

```bash
# Deepgram API Key (add to .env.local)
DEEPGRAM_API_KEY=626fcb11916da5e5d894b08eb6c9c85dce9a4efa
```

---

## Implementation Order

1. **LMS-029a** — Data layer (schema, RLS, storage)
2. **LMS-029b** — Admin toggle (site settings)
3. **LMS-029c** — Basic feedback UI (button, modal, text input)
4. **LMS-029g** — Page feedback display (show existing)
5. **LMS-029d** — Voice recording + Deepgram
6. **LMS-029e** — Text highlighting
7. **LMS-029f** — Attachments
8. **LMS-029h** — Admin management UI
9. **LMS-029i** — Markdown export

---

## Notes

- Voice recording uses MediaRecorder API (WebM format)
- Deepgram batch transcription (not real-time streaming)
- Attachments limited to 10MB per file
- Text highlighting only works on module content pages
- All users can view feedback for a page (to avoid duplicates)
- Only admins can change status
