# Admin Panel Edit Pages Overhaul

## Context
- Prime Capital Dubai Hub project — real estate website with admin CMS
- Admin panel for managing properties, team members, and testimonials

## Goal / Request
- Add property image thumbnails to the properties table
- Replace cramped modal edit dialogs with dedicated full pages that feel less squished
- Make edit pages more intuitive, resembling the live website preview
- Add file upload support for property images and team member photos via Supabase storage

## Key Decisions
- Converted all admin edit forms from modal dialogs to dedicated route pages (`/admin/{entity}/[id]`)
- Created a two-column layout for edit pages: main content left, preview/settings sidebar right
- Built a reusable `ImageUpload` component with drag-and-drop and URL input options
- Stored uploaded images in Supabase storage bucket `cms` with folder structure (`properties/`, `team/`)
- Used public URLs for images rather than signed URLs for simplicity

## Work Completed
- **Properties table**: Added 48x48 rounded image thumbnail column with fallback icon
- **Team table**: Added 40x40 circular photo thumbnail column with fallback icon
- **New dedicated edit pages created**:
  - `app/(admin)/admin/properties/[id]/page.tsx` + `property-edit-form.tsx`
  - `app/(admin)/admin/team/[id]/page.tsx` + `team-member-edit-form.tsx`
  - `app/(admin)/admin/testimonials/[id]/page.tsx` + `testimonial-edit-form.tsx`
- **New component**: `components/shared/image-upload.tsx` — reusable upload with preview
- **New server actions in `lib/actions/cms.ts`**:
  - `uploadCmsImage()` — validates and uploads images to Supabase storage
  - `deleteCmsImage()` — removes images from storage
- **Updated client components** to use Link navigation instead of modal state

## Open Questions / Risks
- **Supabase storage bucket**: A bucket named `cms` with public access must be created manually in Supabase dashboard for uploads to work
- Pre-existing build errors in `/app/(catalyst)/` folder (unrelated to this work) — missing modules like `@/lib/briefs`, `@/lib/project-state`

## Next Steps
- Create `cms` storage bucket in Supabase with public access policy
- Test image upload flow end-to-end on properties and team members
- Consider adding gallery image upload UI for properties (currently still URL-based textarea)
