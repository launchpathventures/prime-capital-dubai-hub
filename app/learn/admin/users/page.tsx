/**
 * CATALYST - User Management Admin Page
 * 
 * Allows admins to view all users, add new users, and edit user details.
 */

import {
  UsersIcon,
  ShieldIcon,
  GraduationCapIcon,
  CheckCircleIcon,
} from "lucide-react"
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { createClient } from "@/lib/supabase/server"
import { requireAdmin } from "@/lib/auth/require-auth"
import { revalidatePath } from "next/cache"
import { AddUserForm } from "./add-user-form"
import { UserRow } from "./user-row"
import type { UserWithEmail } from "./types"

// =============================================================================
// Data Fetching
// =============================================================================

async function getAllUsers(): Promise<UserWithEmail[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase.rpc('get_all_users')
  
  if (error) {
    console.error("Failed to fetch users:", error)
    return []
  }
  
  return data || []
}

// =============================================================================
// Server Actions
// =============================================================================

export async function updateUser(formData: FormData) {
  "use server"
  
  const supabase = await createClient()
  
  const userId = formData.get("user_id") as string
  const fullName = formData.get("full_name") as string
  const role = formData.get("role") as string
  const certificationStatus = formData.get("certification_status") as string
  
  const { error } = await supabase.rpc('admin_update_user', {
    user_id: userId,
    new_full_name: fullName || null,
    new_role: role || null,
    new_certification_status: certificationStatus || null,
  })
  
  if (error) {
    console.error("Failed to update user:", error)
    return { error: error.message }
  }
  
  revalidatePath('/learn/admin/users')
  return { success: true }
}

export async function inviteUser(formData: FormData) {
  "use server"
  
  const supabase = await createClient()
  
  const email = formData.get("email") as string
  const fullName = formData.get("full_name") as string
  const role = formData.get("role") as string
  
  // Use Supabase admin to invite user
  // Note: This requires the service role key, so we'll use the invite endpoint
  const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
    data: {
      full_name: fullName,
      role: role,
    }
  })
  
  if (error) {
    console.error("Failed to invite user:", error)
    return { error: error.message }
  }
  
  // Create user profile
  if (data.user) {
    await supabase.from('user_profiles').insert({
      id: data.user.id,
      full_name: fullName,
      role: role,
      certification_status: 'in_progress',
    })
  }
  
  revalidatePath('/learn/admin/users')
  return { success: true }
}

// =============================================================================
// Page Component
// =============================================================================

const ROLE_ORDER: Record<string, number> = { admin: 0, marketing: 1, learner: 2 }

export default async function UsersAdminPage() {
  // Require admin access
  await requireAdmin()

  const allUsers = await getAllUsers()

  const users = [...allUsers].sort((a, b) => {
    const roleDiff = (ROLE_ORDER[a.role] ?? 99) - (ROLE_ORDER[b.role] ?? 99)
    if (roleDiff !== 0) return roleDiff
    const nameA = (a.full_name || a.email).toLowerCase()
    const nameB = (b.full_name || b.email).toLowerCase()
    return nameA.localeCompare(nameB)
  })

  const learnerCount = users.filter(u => u.role === 'learner').length
  const adminCount = users.filter(u => u.role === 'admin').length
  const certifiedCount = users.filter(u => u.certification_status === 'certified').length

  return (
    <div className="learn-content learn-content--wide">
        {/* Header */}
        <div className="cert-admin-header">
          <div>
            <h1 className="cert-admin-title">User Management</h1>
            <p className="cert-admin-subtitle">
              View, add, and manage users in the learning platform
            </p>
          </div>
          <AddUserForm />
        </div>

        {/* Stats */}
        <div className="cert-admin-stats">
          <div className="cert-admin-stat">
            <div className="cert-admin-stat__icon"><UsersIcon className="h-5 w-5" /></div>
            <div className="cert-admin-stat__content">
              <span className="cert-admin-stat__value">{users.length}</span>
              <span className="cert-admin-stat__label">Total Users</span>
            </div>
          </div>
          <div className="cert-admin-stat">
            <div className="cert-admin-stat__icon"><GraduationCapIcon className="h-5 w-5" /></div>
            <div className="cert-admin-stat__content">
              <span className="cert-admin-stat__value">{learnerCount}</span>
              <span className="cert-admin-stat__label">Learners</span>
            </div>
          </div>
          <div className="cert-admin-stat">
            <div className="cert-admin-stat__icon"><ShieldIcon className="h-5 w-5" /></div>
            <div className="cert-admin-stat__content">
              <span className="cert-admin-stat__value">{adminCount}</span>
              <span className="cert-admin-stat__label">Admins</span>
            </div>
          </div>
          <div className="cert-admin-stat">
            <div className="cert-admin-stat__icon"><CheckCircleIcon className="h-5 w-5" /></div>
            <div className="cert-admin-stat__content">
              <span className="cert-admin-stat__value">{certifiedCount}</span>
              <span className="cert-admin-stat__label">Certified</span>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <section className="cert-admin-section">
          <div className="cert-admin-section__header">
            <h2 className="cert-admin-section__title">
              <UsersIcon className="h-5 w-5" />
              All Users
            </h2>
            <span className="cert-admin-section__count">{users.length} total</span>
          </div>
          
          {users.length > 0 ? (
            <div className="admin-users-table">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Certification</TableHead>
                    <TableHead className="whitespace-nowrap">Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <UserRow key={user.id} user={user} />
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="cert-admin-empty cert-admin-empty--small">
              <UsersIcon className="h-8 w-8 text-gray-300" />
              <p>No users found</p>
            </div>
          )}
        </section>
    </div>
  )
}

