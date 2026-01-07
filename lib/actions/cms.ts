/**
 * CATALYST - CMS Server Actions
 * 
 * Server actions for all CMS entities: properties, team, testimonials, stats.
 * Uses Supabase for persistence with proper error handling.
 */

"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

// =============================================================================
// TYPES
// =============================================================================

export type ActionResult<T = void> = 
  | { success: true; data: T }
  | { success: false; error: string }

// Property types matching Supabase schema
export type PropertyRow = {
  id: string
  slug: string
  title: string
  type: string
  location: string
  city: string | null
  country: string | null
  developer: string | null
  developer_website: string | null
  project_website: string | null
  price: string | null
  price_from: number | null
  price_to: number | null
  currency: string | null
  status: string
  sale_status: string | null
  completion_date: string | null
  bedrooms: string | null
  bathrooms: number | null
  size_from: number | null
  size_to: number | null
  size_unit: string | null
  description: string | null
  features: string[] | null
  cover_image: string | null
  images: string[] | null
  featured: boolean | null
  display_order: number | null
  created_at: string | null
  updated_at: string | null
}

export type PropertyInput = Omit<PropertyRow, "id" | "created_at" | "updated_at">

// Team member types
export type TeamMemberRow = {
  id: string
  slug: string
  name: string
  role: string
  short_bio: string | null
  full_bio: string | null
  expertise: string[] | null
  background: string[] | null
  email: string | null
  phone: string | null
  photo: string | null
  linkedin: string | null
  is_founder: boolean | null
  display_order: number | null
  created_at: string | null
  updated_at: string | null
}

export type TeamMemberInput = Omit<TeamMemberRow, "id" | "created_at" | "updated_at">

// Testimonial types
export type TestimonialRow = {
  id: string
  quote: string
  author: string
  location: string | null
  context: string | null
  display_order: number | null
  created_at: string | null
  updated_at: string | null
}

export type TestimonialInput = Omit<TestimonialRow, "id" | "created_at" | "updated_at">

// Stats types
export type StatRow = {
  id: string
  label: string
  value: string
  description: string | null
  display_order: number | null
  created_at: string | null
  updated_at: string | null
}

export type StatInput = Omit<StatRow, "id" | "created_at" | "updated_at">

// Site settings types
export type SiteSettingRow = {
  id: string
  key: string
  value: Record<string, unknown>
  description: string | null
  updated_at: string | null
}

// =============================================================================
// PROPERTIES
// =============================================================================

export async function getPropertiesFromDb(): Promise<ActionResult<PropertyRow[]>> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .order("display_order", { ascending: true })
    
    if (error) throw error
    return { success: true, data: data ?? [] }
  } catch (error) {
    console.error("Error fetching properties:", error)
    return { success: false, error: "Failed to fetch properties" }
  }
}

export async function getPropertyById(id: string): Promise<ActionResult<PropertyRow | null>> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("id", id)
      .single()
    
    if (error && error.code !== "PGRST116") throw error
    return { success: true, data }
  } catch (error) {
    console.error("Error fetching property:", error)
    return { success: false, error: "Failed to fetch property" }
  }
}

export async function createProperty(input: PropertyInput): Promise<ActionResult<PropertyRow>> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("properties")
      .insert(input)
      .select()
      .single()
    
    if (error) throw error
    revalidatePath("/app/properties")
    revalidatePath("/properties")
    return { success: true, data }
  } catch (error) {
    console.error("Error creating property:", error)
    return { success: false, error: "Failed to create property" }
  }
}

export async function updateProperty(id: string, input: Partial<PropertyInput>): Promise<ActionResult<PropertyRow>> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("properties")
      .update({ ...input, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()
    
    if (error) throw error
    revalidatePath("/app/properties")
    revalidatePath("/properties")
    revalidatePath(`/properties/${data.slug}`)
    return { success: true, data }
  } catch (error) {
    console.error("Error updating property:", error)
    return { success: false, error: "Failed to update property" }
  }
}

export async function deleteProperty(id: string): Promise<ActionResult> {
  try {
    const supabase = await createClient()
    const { error } = await supabase
      .from("properties")
      .delete()
      .eq("id", id)
    
    if (error) throw error
    revalidatePath("/app/properties")
    revalidatePath("/properties")
    return { success: true, data: undefined }
  } catch (error) {
    console.error("Error deleting property:", error)
    return { success: false, error: "Failed to delete property" }
  }
}

// =============================================================================
// TEAM MEMBERS
// =============================================================================

export async function getTeamMembersFromDb(): Promise<ActionResult<TeamMemberRow[]>> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("team_members")
      .select("*")
      .order("display_order", { ascending: true })
    
    if (error) throw error
    return { success: true, data: data ?? [] }
  } catch (error) {
    console.error("Error fetching team members:", error)
    return { success: false, error: "Failed to fetch team members" }
  }
}

export async function getTeamMemberById(id: string): Promise<ActionResult<TeamMemberRow | null>> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("team_members")
      .select("*")
      .eq("id", id)
      .single()
    
    if (error && error.code !== "PGRST116") throw error
    return { success: true, data }
  } catch (error) {
    console.error("Error fetching team member:", error)
    return { success: false, error: "Failed to fetch team member" }
  }
}

export async function createTeamMember(input: TeamMemberInput): Promise<ActionResult<TeamMemberRow>> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("team_members")
      .insert(input)
      .select()
      .single()
    
    if (error) throw error
    revalidatePath("/app/team")
    revalidatePath("/team")
    return { success: true, data }
  } catch (error) {
    console.error("Error creating team member:", error)
    return { success: false, error: "Failed to create team member" }
  }
}

export async function updateTeamMember(id: string, input: Partial<TeamMemberInput>): Promise<ActionResult<TeamMemberRow>> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("team_members")
      .update({ ...input, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()
    
    if (error) throw error
    revalidatePath("/app/team")
    revalidatePath("/team")
    revalidatePath(`/team/${data.slug}`)
    return { success: true, data }
  } catch (error) {
    console.error("Error updating team member:", error)
    return { success: false, error: "Failed to update team member" }
  }
}

export async function deleteTeamMember(id: string): Promise<ActionResult> {
  try {
    const supabase = await createClient()
    const { error } = await supabase
      .from("team_members")
      .delete()
      .eq("id", id)
    
    if (error) throw error
    revalidatePath("/app/team")
    revalidatePath("/team")
    return { success: true, data: undefined }
  } catch (error) {
    console.error("Error deleting team member:", error)
    return { success: false, error: "Failed to delete team member" }
  }
}

// =============================================================================
// TESTIMONIALS
// =============================================================================

export async function getTestimonialsFromDb(): Promise<ActionResult<TestimonialRow[]>> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .order("display_order", { ascending: true })
    
    if (error) throw error
    return { success: true, data: data ?? [] }
  } catch (error) {
    console.error("Error fetching testimonials:", error)
    return { success: false, error: "Failed to fetch testimonials" }
  }
}

export async function getTestimonialById(id: string): Promise<ActionResult<TestimonialRow | null>> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .eq("id", id)
      .single()
    
    if (error && error.code !== "PGRST116") throw error
    return { success: true, data }
  } catch (error) {
    console.error("Error fetching testimonial:", error)
    return { success: false, error: "Failed to fetch testimonial" }
  }
}

export async function createTestimonial(input: TestimonialInput): Promise<ActionResult<TestimonialRow>> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("testimonials")
      .insert(input)
      .select()
      .single()
    
    if (error) throw error
    revalidatePath("/app/testimonials")
    revalidatePath("/")
    return { success: true, data }
  } catch (error) {
    console.error("Error creating testimonial:", error)
    return { success: false, error: "Failed to create testimonial" }
  }
}

export async function updateTestimonial(id: string, input: Partial<TestimonialInput>): Promise<ActionResult<TestimonialRow>> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("testimonials")
      .update({ ...input, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()
    
    if (error) throw error
    revalidatePath("/app/testimonials")
    revalidatePath("/")
    return { success: true, data }
  } catch (error) {
    console.error("Error updating testimonial:", error)
    return { success: false, error: "Failed to update testimonial" }
  }
}

export async function deleteTestimonial(id: string): Promise<ActionResult> {
  try {
    const supabase = await createClient()
    const { error } = await supabase
      .from("testimonials")
      .delete()
      .eq("id", id)
    
    if (error) throw error
    revalidatePath("/app/testimonials")
    revalidatePath("/")
    return { success: true, data: undefined }
  } catch (error) {
    console.error("Error deleting testimonial:", error)
    return { success: false, error: "Failed to delete testimonial" }
  }
}

// =============================================================================
// STATS
// =============================================================================

export async function getStatsFromDb(): Promise<ActionResult<StatRow[]>> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("stats")
      .select("*")
      .order("display_order", { ascending: true })
    
    if (error) throw error
    return { success: true, data: data ?? [] }
  } catch (error) {
    console.error("Error fetching stats:", error)
    return { success: false, error: "Failed to fetch stats" }
  }
}

export async function getStatById(id: string): Promise<ActionResult<StatRow | null>> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("stats")
      .select("*")
      .eq("id", id)
      .single()
    
    if (error && error.code !== "PGRST116") throw error
    return { success: true, data }
  } catch (error) {
    console.error("Error fetching stat:", error)
    return { success: false, error: "Failed to fetch stat" }
  }
}

export async function createStat(input: StatInput): Promise<ActionResult<StatRow>> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("stats")
      .insert(input)
      .select()
      .single()
    
    if (error) throw error
    revalidatePath("/app/stats")
    revalidatePath("/")
    return { success: true, data }
  } catch (error) {
    console.error("Error creating stat:", error)
    return { success: false, error: "Failed to create stat" }
  }
}

export async function updateStat(id: string, input: Partial<StatInput>): Promise<ActionResult<StatRow>> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("stats")
      .update({ ...input, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()
    
    if (error) throw error
    revalidatePath("/app/stats")
    revalidatePath("/")
    return { success: true, data }
  } catch (error) {
    console.error("Error updating stat:", error)
    return { success: false, error: "Failed to update stat" }
  }
}

export async function deleteStat(id: string): Promise<ActionResult> {
  try {
    const supabase = await createClient()
    const { error } = await supabase
      .from("stats")
      .delete()
      .eq("id", id)
    
    if (error) throw error
    revalidatePath("/app/stats")
    revalidatePath("/")
    return { success: true, data: undefined }
  } catch (error) {
    console.error("Error deleting stat:", error)
    return { success: false, error: "Failed to delete stat" }
  }
}

// =============================================================================
// SITE SETTINGS
// =============================================================================

export async function getSiteSettingsFromDb(): Promise<ActionResult<SiteSettingRow[]>> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
    
    if (error) throw error
    return { success: true, data: data ?? [] }
  } catch (error) {
    console.error("Error fetching site settings:", error)
    return { success: false, error: "Failed to fetch site settings" }
  }
}

export async function updateSiteSetting(key: string, value: Record<string, unknown>): Promise<ActionResult<SiteSettingRow>> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("site_settings")
      .upsert({ 
        key, 
        value, 
        updated_at: new Date().toISOString() 
      }, { 
        onConflict: "key" 
      })
      .select()
      .single()
    
    if (error) throw error
    revalidatePath("/app/site-settings")
    revalidatePath("/")
    return { success: true, data }
  } catch (error) {
    console.error("Error updating site setting:", error)
    return { success: false, error: "Failed to update site setting" }
  }
}
