# Client Hub Migration Prompt
## Phase 3: Migrate Client Hub for Project/Engagement Management

**Context**: You are migrating the Client Hub from the legacy LMS repository into the unified Prime Capital platform. The hub provides project management, task tracking, and question/feedback collection for client engagements. It should be built as a reusable pattern for future Launch Path Ventures projects.

---

## Background

Read these documents first to understand the project:
- `/catalyst/specs/project-vision.md` — Project intent and scope
- `/catalyst/specs/project-architecture.md` — Decisions and rationale

Also review the existing Catalyst documentation:
- `/catalyst/CATALYST.md` — Framework overview
- `/catalyst/PATTERNS.md` — Code patterns
- `/catalyst/SURFACES.md` — Surface definitions

**Key decisions affecting this migration:**
1. Hub routes use `/hub/*` pattern (separate surface)
2. Same authentication as admin (Supabase Auth)
3. Hub is for Tim (Launch Path) + client team to manage project engagement
4. Built as reusable pattern for future clients
5. Admin area includes Hub management section at `(app)/hub`
6. shadcn/ui is the component library

**Existing route groups in this repo:**
- `(app)` — Admin/app area (add hub management here)
- `(auth)` — Authentication
- `(docs)` — Documentation
- `(present)` — Presentations
- `(web)` — Public website/marketing pages

---

## Source Structure (Legacy LMS Hub)

```
/legacy/lms/
├── app/(guest)/
│   ├── layout.tsx              # Guest layout — ADAPT
│   ├── page.tsx                # Hub landing — MIGRATE
│   ├── hub.css                 # Hub styles — MIGRATE
│   ├── projects-grid.tsx       # Project cards — MIGRATE
│   ├── admin/
│   │   └── page.tsx            # Admin dashboard — MIGRATE to /admin/hub
│   ├── projects/
│   │   ├── layout.tsx          # Projects layout — MIGRATE
│   │   ├── projects.css        # Projects styles — MIGRATE
│   │   └── [slug]/
│   │       └── page.tsx        # Project detail — MIGRATE
│   └── login/
│       └── page.tsx            # Hub login — REMOVE (use unified auth)
├── components/shared/
│   ├── voice-recorder.tsx      # Audio recording — MIGRATE
│   ├── voice-recorder.css      # Voice styles — MIGRATE
│   ├── question-response.tsx   # Response display — MIGRATE
│   ├── question-response.css   # Response styles — MIGRATE
│   ├── question-submissions.tsx # Submissions list — MIGRATE
│   ├── question-submissions.css # Submissions styles — MIGRATE
│   ├── respondent-name.tsx     # Name input modal — MIGRATE
│   ├── respondent-name.css     # Name styles — MIGRATE
│   ├── stat-card.tsx           # Stats display — MIGRATE
│   └── label-value.tsx         # Label/value pairs — MIGRATE
└── lib/
    └── supabase.ts             # Already migrated in Phase 1
```

---

## Target Structure

```
/app/
├── hub/                            # Client engagement portal — CREATE
│   ├── layout.tsx                  # Hub layout
│   ├── page.tsx                    # Hub dashboard
│   ├── projects/
│   │   ├── page.tsx                # Projects list
│   │   └── [slug]/
│   │       └── page.tsx            # Project detail with tasks
│   ├── tasks/
│   │   └── page.tsx                # All tasks view
│   └── questions/
│       ├── page.tsx                # Questions list
│       └── [id]/
│           └── page.tsx            # Question detail with responses
├── (app)/                          # Admin area
│   ├── hub/                        # Hub management — ADD
│   │   ├── page.tsx                # Hub overview
│   │   ├── projects/
│   │   │   └── page.tsx            # Manage projects
│   │   ├── tasks/
│   │   │   └── page.tsx            # Manage tasks
│   │   └── questions/
│   │       └── page.tsx            # Manage questions
│   └── ...                         # (existing from Phase 1 & 2)
└── ...

/components/
├── ui/                             # shadcn primitives (existing)
├── hub/                            # Hub-specific components — CREATE
│   ├── project-card.tsx
│   ├── task-item.tsx
│   ├── task-list.tsx
│   ├── question-card.tsx
│   ├── voice-recorder.tsx          # MIGRATE from legacy
│   ├── voice-recorder.css
│   ├── question-response.tsx       # MIGRATE from legacy
│   ├── response-form.tsx           # Text + voice response input
│   └── activity-feed.tsx
└── ...
```

---

## Migration Tasks

### 1. Create Hub Route Group (`/hub/*`)

#### /hub/layout.tsx

Simple layout with header showing:
- Hub title/logo
- Navigation: Dashboard, Projects, Tasks, Questions
- User menu with logout

```tsx
// app/hub/layout.tsx
import { HubHeader } from '@/components/hub/hub-header'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function HubLayout({ children }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) redirect('/login')
  
  // Check user has hub access (admin role)
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  
  if (profile?.role !== 'admin') redirect('/learn')
  
  return (
    <div className="min-h-screen bg-background">
      <HubHeader />
      <main className="container py-8">{children}</main>
    </div>
  )
}
```

#### /hub/page.tsx (Dashboard)

Shows:
- Active projects summary (cards)
- Recent activity feed
- Pending questions count
- Overdue tasks count

#### /hub/projects/page.tsx

Grid of project cards showing:
- Project name
- Status (active, completed, on hold)
- Progress percentage
- Last activity date

#### /hub/projects/[slug]/page.tsx

Project detail view:
- Project header (name, status, description)
- Progress bar
- Tasks list (filterable by status)
- Milestones timeline
- Activity feed for this project

#### /hub/tasks/page.tsx

All tasks across projects:
- Filterable by project, status, assignee
- Sortable by due date, priority
- Quick status toggle

#### /hub/questions/page.tsx

Questions list:
- Status filter (pending, answered)
- Project filter
- Shows question preview, response count, last activity

#### /hub/questions/[id]/page.tsx

Question detail:
- Full question text and context
- Attachments/links
- All responses (text and voice)
- Response form for adding new response

### 2. Migrate Voice Recorder Component

The voice recorder is a key feature. Migrate and adapt for shadcn patterns:

```tsx
// components/hub/voice-recorder.tsx
'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Mic, Square, Play, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface VoiceRecorderProps {
  onRecordingComplete: (audioUrl: string, duration: number) => void
  questionId: string
}

export function VoiceRecorder({ onRecordingComplete, questionId }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [duration, setDuration] = useState(0)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const mediaRecorder = new MediaRecorder(stream)
    mediaRecorderRef.current = mediaRecorder
    chunksRef.current = []
    
    mediaRecorder.ondataavailable = (e) => {
      chunksRef.current.push(e.data)
    }
    
    mediaRecorder.onstop = async () => {
      const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
      // Upload to Supabase Storage
      const supabase = createClient()
      const filename = `${questionId}/${Date.now()}.webm`
      const { data, error } = await supabase.storage
        .from('voice-recordings')
        .upload(filename, blob)
      
      if (data) {
        const { data: { publicUrl } } = supabase.storage
          .from('voice-recordings')
          .getPublicUrl(filename)
        setAudioUrl(publicUrl)
        onRecordingComplete(publicUrl, duration)
      }
    }
    
    mediaRecorder.start()
    setIsRecording(true)
  }
  
  const stopRecording = () => {
    mediaRecorderRef.current?.stop()
    setIsRecording(false)
  }
  
  // ... rest of component (playback, delete, waveform visualization)
}
```

### 3. Create Response Components

#### response-form.tsx

Combined text + voice response input:

```tsx
// components/hub/response-form.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { VoiceRecorder } from './voice-recorder'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface ResponseFormProps {
  questionId: string
  onSubmit: (response: { text?: string; audioUrl?: string; duration?: number }) => void
}

export function ResponseForm({ questionId, onSubmit }: ResponseFormProps) {
  const [text, setText] = useState('')
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [duration, setDuration] = useState(0)
  
  const handleSubmit = () => {
    onSubmit({
      text: text || undefined,
      audioUrl: audioUrl || undefined,
      duration: audioUrl ? duration : undefined,
    })
    setText('')
    setAudioUrl(null)
  }
  
  return (
    <div className="space-y-4">
      <Tabs defaultValue="text">
        <TabsList>
          <TabsTrigger value="text">Text Response</TabsTrigger>
          <TabsTrigger value="voice">Voice Response</TabsTrigger>
        </TabsList>
        <TabsContent value="text">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your response..."
            rows={4}
          />
        </TabsContent>
        <TabsContent value="voice">
          <VoiceRecorder
            questionId={questionId}
            onRecordingComplete={(url, dur) => {
              setAudioUrl(url)
              setDuration(dur)
            }}
          />
        </TabsContent>
      </Tabs>
      <Button onClick={handleSubmit} disabled={!text && !audioUrl}>
        Submit Response
      </Button>
    </div>
  )
}
```

### 4. Create Admin Hub Management Section

#### /admin/hub/page.tsx

Overview dashboard:
- Total projects, tasks, questions
- Recent activity
- Quick links to manage each

#### /admin/hub/projects/page.tsx

Project CRUD:
- Create new project (name, description, client)
- Edit project details
- Archive/delete projects
- Reorder projects

#### /admin/hub/tasks/page.tsx

Task management:
- Create tasks (linked to project)
- Assign to users
- Set due dates, priority
- Bulk status updates

#### /admin/hub/questions/page.tsx

Question management:
- Create questions (linked to project)
- Add context/attachments
- View all responses
- Mark as resolved

### 5. Create Supabase Schema (Hub Tables)

```sql
-- Projects
CREATE TABLE hub_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',  -- active, completed, on_hold, archived
  client_name TEXT,              -- For reusability across clients
  progress INTEGER DEFAULT 0,    -- 0-100
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tasks
CREATE TABLE hub_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES hub_projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending',  -- pending, in_progress, completed, cancelled
  priority TEXT DEFAULT 'medium', -- low, medium, high, urgent
  assignee_id UUID REFERENCES auth.users(id),
  due_date DATE,
  completed_at TIMESTAMPTZ,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Questions
CREATE TABLE hub_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES hub_projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  context TEXT,                   -- Additional context for respondents
  status TEXT DEFAULT 'pending',  -- pending, answered, resolved
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Question Responses
CREATE TABLE hub_question_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID REFERENCES hub_questions(id) ON DELETE CASCADE,
  respondent_id UUID REFERENCES auth.users(id),
  respondent_name TEXT,           -- For display (cached from user profile)
  text_response TEXT,
  audio_url TEXT,
  audio_duration INTEGER,         -- Duration in seconds
  transcription TEXT,             -- Future: AI transcription
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activity Feed
CREATE TABLE hub_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES hub_projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,           -- task_completed, question_answered, etc.
  target_type TEXT,               -- task, question, project
  target_id UUID,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_hub_tasks_project ON hub_tasks(project_id);
CREATE INDEX idx_hub_tasks_assignee ON hub_tasks(assignee_id);
CREATE INDEX idx_hub_tasks_status ON hub_tasks(status);
CREATE INDEX idx_hub_questions_project ON hub_questions(project_id);
CREATE INDEX idx_hub_responses_question ON hub_question_responses(question_id);
CREATE INDEX idx_hub_activity_project ON hub_activity(project_id);
CREATE INDEX idx_hub_activity_created ON hub_activity(created_at DESC);

-- RLS Policies
ALTER TABLE hub_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE hub_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE hub_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE hub_question_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE hub_activity ENABLE ROW LEVEL SECURITY;

-- Admin users can do everything
CREATE POLICY "Admins can manage projects" ON hub_projects
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Similar policies for other tables...
```

### 6. Create Supabase Storage Bucket

```sql
-- Create bucket for voice recordings
INSERT INTO storage.buckets (id, name, public)
VALUES ('voice-recordings', 'voice-recordings', true);

-- Policy: Admins can upload
CREATE POLICY "Admins can upload voice recordings"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'voice-recordings' AND
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_profiles.id = auth.uid()
    AND user_profiles.role = 'admin'
  )
);

-- Policy: Anyone authenticated can read
CREATE POLICY "Authenticated users can read voice recordings"
ON storage.objects FOR SELECT
USING (bucket_id = 'voice-recordings' AND auth.role() = 'authenticated');
```

### 7. Update Navigation

Add Hub to admin sidebar navigation:

```typescript
// lib/navigation.ts

export const adminNavigation = [
  {
    label: 'Content',
    items: [
      { label: 'Properties', href: '/admin/properties', icon: Building },
      { label: 'Team', href: '/admin/team', icon: Users },
      // ...
    ],
  },
  {
    label: 'Learning',
    items: [
      { label: 'Modules', href: '/admin/learning', icon: BookOpen },
      { label: 'Users', href: '/admin/users', icon: UserPlus },
      { label: 'Progress', href: '/admin/progress', icon: BarChart },
    ],
  },
  {
    label: 'Hub',
    items: [
      { label: 'Projects', href: '/admin/hub/projects', icon: Folder },
      { label: 'Tasks', href: '/admin/hub/tasks', icon: CheckSquare },
      { label: 'Questions', href: '/admin/hub/questions', icon: MessageCircle },
    ],
  },
  {
    label: 'Settings',
    items: [
      { label: 'Site Settings', href: '/admin/settings', icon: Settings },
    ],
  },
]
```

### 8. Build for Reusability

Structure the Hub components and utilities to be portable:

```
/lib/hub/
├── types.ts              # Hub type definitions
├── queries.ts            # Supabase queries for hub data
├── utils.ts              # Helper functions
└── config.ts             # Hub configuration (can be overridden per client)

/components/hub/
├── index.ts              # Barrel exports
├── project-card.tsx
├── task-item.tsx
├── question-card.tsx
├── voice-recorder.tsx
├── response-form.tsx
├── activity-feed.tsx
└── hub-header.tsx
```

Configuration pattern for reusability:

```typescript
// lib/hub/config.ts
export interface HubConfig {
  clientName: string
  features: {
    voiceRecording: boolean
    taskAssignment: boolean
    activityFeed: boolean
  }
  labels: {
    projects: string      // "Projects" or "Engagements" etc.
    tasks: string         // "Tasks" or "Action Items" etc.
    questions: string     // "Questions" or "Feedback" etc.
  }
}

export const defaultHubConfig: HubConfig = {
  clientName: 'Client',
  features: {
    voiceRecording: true,
    taskAssignment: true,
    activityFeed: true,
  },
  labels: {
    projects: 'Projects',
    tasks: 'Tasks',
    questions: 'Questions',
  },
}

// Can be overridden per deployment
export const hubConfig: HubConfig = {
  ...defaultHubConfig,
  clientName: 'Prime Capital',
}
```

---

## Do NOT Migrate

- `/legacy/lms/app/(guest)/login/` — Use unified auth
- Hub-specific password authentication — Use Supabase Auth
- Any hardcoded client-specific content (make configurable)

---

## Verification Checklist

After migration, verify:

**Hub Pages:**
- [ ] `/hub` — Dashboard loads, shows projects summary
- [ ] `/hub/projects` — Projects grid displays
- [ ] `/hub/projects/[slug]` — Project detail with tasks
- [ ] `/hub/tasks` — Tasks list with filters
- [ ] `/hub/questions` — Questions list
- [ ] `/hub/questions/[id]` — Question detail with responses

**Admin Hub Management:**
- [ ] `/admin/hub` — Overview loads
- [ ] `/admin/hub/projects` — Can create/edit/delete projects
- [ ] `/admin/hub/tasks` — Can create/edit/assign tasks
- [ ] `/admin/hub/questions` — Can create/manage questions

**Voice Recording:**
- [ ] Can start/stop recording
- [ ] Recording uploads to Supabase Storage
- [ ] Playback works
- [ ] Duration tracked correctly

**Response Submission:**
- [ ] Can submit text response
- [ ] Can submit voice response
- [ ] Can submit both together
- [ ] Responses appear in question detail

**Activity Feed:**
- [ ] Actions logged to hub_activity
- [ ] Feed displays on project detail
- [ ] Feed displays on hub dashboard

**Authentication:**
- [ ] Only admin users can access `/hub/*`
- [ ] Learners redirected to `/learn`
- [ ] Unauthenticated users redirected to login

**Reusability:**
- [ ] Hub config can be changed without code changes
- [ ] Labels configurable
- [ ] Features can be toggled

---

## Notes

- Voice recordings should have reasonable size limits (e.g., 5 minutes max)
- Consider adding transcription in future (Whisper API)
- Activity feed should be efficient (paginated, indexed queries)
- Mobile responsiveness important for client team access
- Keep UI consistent with admin panel styling
