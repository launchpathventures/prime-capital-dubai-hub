# LMS-029b: Admin Toggle

**Status:** 📋 READY  
**Priority:** High  
**Estimated Time:** 1 hour  
**Dependencies:** LMS-029a  

---

## Objective

Add an admin setting to enable/disable the feedback system across the LMS.

---

## Tasks

### 1. Add Site Setting

Insert into `site_settings` table:

```sql
insert into site_settings (key, value, description)
values (
  'feedback_enabled',
  'true'::jsonb,
  'Enable/disable the content feedback system in the LMS'
);
```

### 2. Create Server Action

**File:** `lib/lms/feedback-settings.ts`

```typescript
"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getFeedbackEnabled(): Promise<boolean> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "feedback_enabled")
    .single()
  
  return data?.value === true
}

export async function setFeedbackEnabled(enabled: boolean): Promise<void> {
  const supabase = await createClient()
  
  // Check admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")
  
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("role")
    .eq("id", user.id)
    .single()
  
  if (profile?.role !== "admin") {
    throw new Error("Not authorized")
  }
  
  await supabase
    .from("site_settings")
    .update({ value: enabled })
    .eq("key", "feedback_enabled")
  
  revalidatePath("/learn")
}
```

### 3. Add Toggle to Learn Admin

**File:** `app/learn/admin/layout.tsx` or create `app/learn/admin/settings/page.tsx`

Add a toggle switch for feedback_enabled setting.

Simple UI:
```tsx
import { getFeedbackEnabled, setFeedbackEnabled } from "@/lib/lms/feedback-settings"
import { Switch } from "@/components/ui/switch"

// In the admin settings page
const enabled = await getFeedbackEnabled()

<form action={async () => {
  "use server"
  await setFeedbackEnabled(!enabled)
}}>
  <label>
    <Switch name="enabled" defaultChecked={enabled} />
    Content Feedback System
  </label>
  <button type="submit">Save</button>
</form>
```

---

## Verification

- [ ] Setting exists in `site_settings`
- [ ] Toggle appears in Learn Admin
- [ ] Toggle changes persist
- [ ] Non-admins cannot change setting
