<!--
CATALYST - Supabase Integration (Stack B)
-->

# Supabase Integration

**Stack B: Next.js + Supabase** — Production-ready apps with auth and database.

Adding Supabase upgrades your project from POC (Stack A) to MVP/MMP territory. This module provides config, client factories, and a repository pattern for maintainable data access.

---

## Quick Start

Packages are pre-installed. Drop in your env vars and go.

### 1. Setup Supabase Project

1. **Create a Supabase project**
   - Go to supabase.com → New project → pick org, region, and database password.
   - Wait for provisioning to finish.

2. **Create a table** (example: `users`)
   - Supabase Studio → Table Editor → New table → name it `users`.
   - Example schema:

```sql
create table public.users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text,
  framework text,
  comments text,
  created_at timestamp with time zone default now()
);
```

### 2. Get API Keys

- Supabase Dashboard → Project Settings → API
- Project URL → `NEXT_PUBLIC_SUPABASE_URL`
- Publishable key → `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- Legacy anon key → `NEXT_PUBLIC_SUPABASE_ANON_KEY` (fallback)

### 3. Configure Environment

Copy `.env.example` to `.env.local` and add:

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

⚠️ Do NOT use the `service_role` key in the browser.

### 4. Verify Setup

- `isSupabaseConfigured()` returns `true`
- The demo in `components/component-example.tsx` shows saved users

### Vercel Deployment

Add the same env vars in Vercel → Project → Settings → Environment Variables.
Apply to Production, Preview, and Development. Redeploy after saving.

---

## Removal Prompt

Use this when you want an agent to remove Supabase entirely.

```
Remove the Supabase integration and its usage examples.
Include: delete lib/supabase/, remove Supabase config entries from lib/config.ts,
remove Supabase env vars from .env.example, and strip Supabase usage in components/component-example.tsx
and docs (including the Supabase Integration page + navigation link).
```

## Module Exports

- `createSupabaseBrowserClient()`
- `createSupabaseServerClient(cookieMethods)`
- `createCrudClient(client, config)`
- `createCrudClientFactory(getClient, config)`
- `createCrudRepository(getClient, options)`
- `unwrapSupabaseResponse(response)`
- `getSupabasePublicConfig()` / `isSupabaseConfigured()`

## Inline Usage (Quick Examples)

```ts
const supabase = createSupabaseBrowserClient()

await supabase.from("users").insert(payload)
await supabase.from("users").delete().match(user)
const { data, error } = await supabase
  .from("users")
  .select("name, role, framework, comments")
  .order("name", { ascending: true })
```

## Suggested App Structure

For MVP/MMP apps, use a repository-first pattern. One repository per model keeps data access clean and testable.

```
lib/
  supabase/
  data/
    posts/
      post-model.ts      # Database row type
      post-dto.ts        # Create/Update/List shapes
      post-crud.ts       # Client factories
      post-repository.ts # App-facing API
app/
  (app)/
    posts/
      page.tsx
      components/
```

---

## Core Pieces

### Model

```ts
// lib/data/posts/post-model.ts
export type Post = {
  id: string
  title: string
  body: string
  status: "draft" | "published"
  created_at: string
}
```

### DTOs

```ts
// lib/data/posts/post-dto.ts
import type { Post } from "@/lib/data/posts/post-model"

export type PostCreateDTO = {
  title: string
  body: string
}

export type PostUpdateDTO = Partial<Pick<Post, "title" | "body" | "status">>

export type PostListDTO = Pick<Post, "id" | "title" | "status" | "created_at">
```

### CRUD Client Factory (Browser + Server)

```ts
// lib/data/posts/post-crud.ts
import { cookies } from "next/headers"
import {
  createCrudClient,
  createCrudClientFactory,
  createSupabaseBrowserClient,
  createSupabaseServerClient,
} from "@/lib/supabase"
import type { Post } from "@/lib/data/posts/post-model"

// Browser client (for client components)
export const getBrowserPostCrudClient = createCrudClientFactory<Post>(() => {
  return createSupabaseBrowserClient()
}, {
  table: "posts",
  primaryKey: "id",
  select: "id, title, body, status, created_at",
})

// Server client factory (for server components / actions)
// Next.js 15+ requires async cookies()
export async function getServerPostCrudClient() {
  const cookieStore = await cookies()
  const client = createSupabaseServerClient({
    get: (name) => cookieStore.get(name),
    set: (name, value, options) => cookieStore.set({ name, value, ...options }),
    remove: (name, options) => cookieStore.set({ name, value: "", ...options }),
  })
  return createCrudClient<Post>(client, {
    table: "posts",
    primaryKey: "id",
    select: "id, title, body, status, created_at",
  })
}
```

### Generic Repository

```ts
// lib/data/posts/post-repository.ts
import type { Post } from "@/lib/data/posts/post-model"
import type { PostCreateDTO, PostListDTO, PostUpdateDTO } from "@/lib/data/posts/post-dto"
import { createCrudRepository } from "@/lib/supabase"
import { getServerPostCrudClient } from "@/lib/data/posts/post-crud"

export const postRepository = createCrudRepository<Post, PostCreateDTO, PostUpdateDTO, PostListDTO>(
  getServerPostCrudClient,
  {
    listSelect: "id, title, status, created_at",
    listQuery: (query) => query.order("created_at", { ascending: false }),
    createDefaults: { status: "draft" },
    listMap: (post) => ({
      id: post.id,
      title: post.title,
      status: post.status,
      created_at: post.created_at,
    }),
  }
)
```

---

## Custom Repository Methods

For joins, computed fields, or multi-step logic — add custom methods alongside the generic repository.

```ts
// lib/data/posts/post-repository.ts (additional exports)
import { getServerPostCrudClient } from "@/lib/data/posts/post-crud"

export async function listPublishedPostTitles() {
  const client = await getServerPostCrudClient()
  const response = await client.list({
    select: "id, title",
    query: (q) => q.eq("status", "published").order("created_at", { ascending: false }),
  })
  if (response.error) throw response.error
  return response.data ?? []
}

export async function listPostsWithAuthor() {
  const client = await getServerPostCrudClient()
  const response = await client.list({
    select: "id, title, author:profiles(display_name)",
    query: (q) => q.order("created_at", { ascending: false }),
  })
  if (response.error) throw response.error
  return response.data ?? []
}
```

---

## Page Usage

```tsx
// app/(app)/posts/page.tsx
import { postRepository } from "@/lib/data/posts/post-repository"

export default async function PostsPage() {
  const posts = await postRepository.list()
  return <div>{posts.length} posts</div>
}
```

### Pagination

```ts
const posts = await postRepository.listPage({ page: 1, pageSize: 10 })
```

---

## Notes

- **Config** lives in `lib/config.ts` — don't read env vars elsewhere
- **Repositories** are the primary API for app code
- **Custom methods** only when the generic one isn't enough
- **Stack B** = MVP/MMP quality — repositories provide the structure for production apps
