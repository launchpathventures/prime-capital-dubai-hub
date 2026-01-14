# LMS-025: SEO & Dynamic Metadata

**Status:** 📋 READY  
**Priority:** P1 High  
**Estimated Time:** 2 hours  
**Dependencies:** None  

---

## Objective

Add dynamic metadata to Learn surface pages for proper SEO. Each competency and module page should have unique titles and descriptions. Admin routes should be excluded from search indexing.

---

## Context

Currently only the root layout has metadata:
```typescript
// app/learn/layout.tsx
export const metadata = {
  title: "Learning Portal | Prime Capital Dubai",
  description: "Prime Capital Dubai agent training and certification platform",
}
```

This means all pages show the same title in browser tabs and search results. Dynamic pages (competencies, modules) should have specific metadata.

---

## Deliverables

### 1. Add generateMetadata to Competency Page

```typescript
// app/learn/[competency]/page.tsx

import { Metadata } from "next"

interface PageProps {
  params: Promise<{ competency: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { competency: slug } = await params
  const supabase = await createClient()
  
  const { data } = await supabase
    .from("competencies")
    .select("name, description")
    .eq("slug", slug)
    .single()
  
  if (!data) {
    return {
      title: "Competency | Learning Portal",
    }
  }
  
  return {
    title: `${data.name} | Learning Portal`,
    description: data.description || `Learn ${data.name} in the Prime Capital training program.`,
  }
}
```

### 2. Add generateMetadata to Module Page

```typescript
// app/learn/[competency]/[module]/page.tsx

import { Metadata } from "next"

interface PageProps {
  params: Promise<{ competency: string; module: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { competency: competencySlug, module: moduleSlug } = await params
  const supabase = await createClient()
  
  const { data: competency } = await supabase
    .from("competencies")
    .select("name")
    .eq("slug", competencySlug)
    .single()
  
  const { data: module } = await supabase
    .from("learning_modules")
    .select("title, description")
    .eq("slug", moduleSlug)
    .single()
  
  if (!module) {
    return {
      title: "Module | Learning Portal",
    }
  }
  
  const competencyName = competency?.name || "Training"
  
  return {
    title: `${module.title} | ${competencyName}`,
    description: module.description || `Learn about ${module.title} in the ${competencyName} competency.`,
  }
}
```

### 3. Add generateMetadata to Quiz Page

```typescript
// app/learn/quiz/[quizId]/page.tsx

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { quizId } = await params
  const supabase = await createClient()
  
  const { data: quiz } = await supabase
    .from("quizzes")
    .select("title, description")
    .eq("slug", quizId)
    .single()
  
  if (!quiz) {
    return {
      title: "Quiz | Learning Portal",
    }
  }
  
  return {
    title: `${quiz.title} | Learning Portal`,
    description: quiz.description || `Test your knowledge with the ${quiz.title} quiz.`,
  }
}
```

### 4. Add noindex to Admin Routes

```typescript
// app/learn/admin/layout.tsx (create if doesn't exist)

import { Metadata } from "next"

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
```

### 5. Add Static Metadata to Other Pages

```typescript
// app/learn/progress/page.tsx
export const metadata: Metadata = {
  title: "My Progress | Learning Portal",
  description: "Track your learning progress through the Prime Capital training program.",
}

// app/learn/scenarios/page.tsx
export const metadata: Metadata = {
  title: "Practice Scenarios | Learning Portal",
  description: "Practice real-world client conversations with AI-powered roleplay scenarios.",
}

// app/learn/certification/page.tsx
export const metadata: Metadata = {
  title: "Certification | Learning Portal",
  description: "Prepare for your Prime Capital consultant certification assessment.",
}

// app/learn/quiz/rera/page.tsx
export const metadata: Metadata = {
  title: "RERA Practice Exams | Learning Portal",
  description: "Prepare for the RERA certification exam with practice questions.",
}
```

---

## Files to Modify

| File | Change |
|------|--------|
| `app/learn/[competency]/page.tsx` | Add `generateMetadata` |
| `app/learn/[competency]/[module]/page.tsx` | Add `generateMetadata` |
| `app/learn/quiz/[quizId]/page.tsx` | Add `generateMetadata` |
| `app/learn/admin/layout.tsx` | Create with `robots: noindex` |
| `app/learn/progress/page.tsx` | Add static `metadata` |
| `app/learn/scenarios/page.tsx` | Add static `metadata` |
| `app/learn/certification/page.tsx` | Add static `metadata` |
| `app/learn/quiz/rera/page.tsx` | Add static `metadata` |

---

## Acceptance Criteria

- [ ] Competency pages show competency name in browser tab
- [ ] Module pages show module title in browser tab
- [ ] Quiz pages show quiz title in browser tab
- [ ] Admin pages have `noindex` meta tag
- [ ] Static pages have descriptive titles
- [ ] View source shows proper `<title>` and `<meta name="description">`

---

## Testing

```bash
# Check page source for metadata
curl -s http://localhost:3000/learn/market-intelligence | grep -E "<title>|description"

# Verify admin noindex
curl -s http://localhost:3000/learn/admin/certification | grep -i "noindex"
```

---

## Notes

- `generateMetadata` runs on the server and can fetch data
- Keep data fetches minimal (just name/title/description)
- Consider caching competency/module names if performance is an issue
- The Learn portal is behind auth, so SEO may be less critical — but good for internal links and bookmarks
