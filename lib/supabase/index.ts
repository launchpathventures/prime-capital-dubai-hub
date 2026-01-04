/**
 * CATALYST - Supabase Module Exports (Stack B)
 *
 * See lib/supabase/SUPABASE.md for setup and patterns.
 * 
 * NOTE: Server module is NOT exported here to avoid "next/headers" import
 * errors in client components. Import directly from "@/lib/supabase/server".
 */

export * from "@/lib/supabase/client"
export * from "@/lib/supabase/config"
export * from "@/lib/supabase/crud"
export * from "@/lib/supabase/repository"

// Server exports removed - import from "@/lib/supabase/server" directly
// export * from "@/lib/supabase/server"
