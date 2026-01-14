/**
 * CATALYST - User Management Admin Page
 * 
 * Allows admins to view all users, add new users, and edit user details.
 * Uses LearnShell for consistent navigation.
 */

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { 
  UsersIcon,
  UserPlusIcon,
  PencilIcon,
  MailIcon,
  ShieldIcon,
  GraduationCapIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  TrendingUpIcon,
} from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { LearnShell } from "@/app/learn/_surface/learn-shell"
import { getUserRole, getUserForMenu } from "@/lib/auth/require-auth"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { UserEditForm } from "./user-edit-form"
import { AddUserForm } from "./add-user-form"
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

export default async function UsersAdminPage() {
  const [users, userRole, userMenu] = await Promise.all([
    getAllUsers(),
    getUserRole(),
    getUserForMenu(),
  ])
  
  // Redirect non-admins
  if (userRole !== 'admin') {
    redirect('/learn')
  }
  
  const learnerCount = users.filter(u => u.role === 'learner').length
  const adminCount = users.filter(u => u.role === 'admin').length
  const certifiedCount = users.filter(u => u.certification_status === 'certified').length

  return (
    <LearnShell 
      activeSection="admin-users"
      userRole={userRole}
      user={userMenu ?? undefined}
      coachContext={{ level: "course" }}
    >
      <div className="learn-content">
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
              <div className="admin-users-table__header">
                <span>User</span>
                <span>Email</span>
                <span>Role</span>
                <span>Status</span>
                <span>Joined</span>
                <span></span>
              </div>
              {users.map((user) => (
                <UserRow key={user.id} user={user} />
              ))}
            </div>
          ) : (
            <div className="cert-admin-empty cert-admin-empty--small">
              <UsersIcon className="h-8 w-8 text-gray-300" />
              <p>No users found</p>
            </div>
          )}
        </section>
      </div>
    </LearnShell>
  )
}

// =============================================================================
// User Row Component
// =============================================================================

function UserRow({ user }: { user: UserWithEmail }) {
  const joinedDate = new Date(user.created_at).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
  
  const statusLabel = {
    certified: "Certified",
    ready: "Ready",
    in_progress: "In Progress",
  }[user.certification_status || "in_progress"] || "In Progress"
  
  return (
    <div className="admin-users-row">
      <div className="admin-users-row__user">
        <div className="admin-users-row__avatar">
          {user.full_name?.charAt(0)?.toUpperCase() || user.email.charAt(0).toUpperCase()}
        </div>
        <span className="admin-users-row__name">
          {user.full_name || "No name set"}
        </span>
      </div>
      <div className="admin-users-row__email">
        <MailIcon className="h-3.5 w-3.5 text-gray-400" />
        <span>{user.email}</span>
      </div>
      <div className={`admin-users-row__role admin-users-row__role--${user.role}`}>
        {user.role === 'admin' && <ShieldIcon className="h-3.5 w-3.5" />}
        {user.role === 'learner' && <GraduationCapIcon className="h-3.5 w-3.5" />}
        <span>{user.role === 'admin' ? 'Admin' : 'Learner'}</span>
      </div>
      <div className={`admin-users-row__status admin-users-row__status--${user.certification_status || 'in_progress'}`}>
        {user.certification_status === 'certified' && <CheckCircleIcon className="h-3.5 w-3.5" />}
        {user.certification_status === 'ready' && <ClockIcon className="h-3.5 w-3.5" />}
        {(!user.certification_status || user.certification_status === 'in_progress') && <TrendingUpIcon className="h-3.5 w-3.5" />}
        <span>{statusLabel}</span>
      </div>
      <div className="admin-users-row__joined">
        {joinedDate}
      </div>
      <div className="admin-users-row__actions">
        <UserEditForm user={user} />
      </div>
    </div>
  )
}
