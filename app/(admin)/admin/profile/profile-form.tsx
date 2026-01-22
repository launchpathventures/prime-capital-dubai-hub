/**
 * Profile Form
 *
 * Client-side profile management form with Supabase integration.
 * Handles: view profile, update email, change password.
 * Gracefully degrades in demo/password modes (read-only).
 */

"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"
import { getURL } from "@/lib/auth/get-url"
import { Stack, Row, Text, Title, Grid } from "@/components/core"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/toast"
import {
  KeyIcon,
  MailIcon,
  UserIcon,
  ShieldCheckIcon,
  AlertTriangleIcon,
  Loader2Icon,
  CheckCircleIcon,
  PencilIcon,
  CalendarIcon,
  ClockIcon,
  CopyIcon,
  LockIcon,
} from "lucide-react"
import type { AuthMode } from "@/lib/auth/config"
import { cn } from "@/lib/utils"

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface ProfileUser {
  id: string
  email: string
  emailVerified: boolean
  createdAt: string
  lastSignIn?: string
  displayName?: string
  avatarUrl?: string
  /** Pending email change (waiting for verification) */
  pendingEmail?: string
}

interface ProfileFormProps {
  /** Current auth mode */
  mode: AuthMode
  /** User data from server */
  user: ProfileUser | null
  /** Whether account deletion is enabled (service role key configured) */
  canDeleteAccount?: boolean
}

// -----------------------------------------------------------------------------
// Profile Form Component
// -----------------------------------------------------------------------------

export function ProfileForm({ mode, user, canDeleteAccount = false }: ProfileFormProps) {
  const router = useRouter()
  const isSupabase = mode === "supabase"

  // Local state to track pending email (since Supabase's new_email isn't always reliable)
  const [localPendingEmail, setLocalPendingEmail] = React.useState<string | undefined>(user?.pendingEmail)
  const [localDisplayName, setLocalDisplayName] = React.useState<string | undefined>(user?.displayName)

  // Show appropriate content based on auth state
  if (!user) {
    return (
      <Card className="profile-empty-state">
        <CardContent className="py-16">
          <Stack gap="md" className="items-center text-center">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
              <div className="relative h-20 w-20 rounded-full bg-muted flex items-center justify-center">
                <UserIcon className="h-10 w-10 text-muted-foreground" />
              </div>
            </div>
            <Stack gap="xs" className="items-center">
              <Title size="h4">No user session found</Title>
              <Text size="sm" variant="muted" className="max-w-sm">
                {isSupabase 
                  ? "Sign in to view and manage your profile settings."
                  : "Profile data is only available with a valid session."}
              </Text>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    )
  }

  return (
    <Stack gap="lg" className="profile-form">
      {/* Profile Header with Avatar - Full width hero */}
      <ProfileHeader user={user} localDisplayName={localDisplayName} />

      {/* Personal Info - Full width */}
      <DisplayNameCard 
        user={user} 
        isSupabase={isSupabase} 
        localDisplayName={localDisplayName}
        onDisplayNameUpdate={(name) => {
          setLocalDisplayName(name)
          router.refresh()
        }}
      />

      {/* Email & Password - Side by side */}
      <Grid cols={2} gap="md">
        <EmailCard 
          user={user} 
          isSupabase={isSupabase} 
          localPendingEmail={localPendingEmail}
          onEmailChangeRequest={(email) => {
            setLocalPendingEmail(email)
            router.refresh()
          }}
        />
        <PasswordCard user={user} isSupabase={isSupabase} />
      </Grid>

      {/* Account Details - Full width */}
      <AccountDetailsCard user={user} />

      {/* Danger Zone - Full width at bottom */}
      {isSupabase && <DangerZoneCard canDelete={canDeleteAccount} />}
    </Stack>
  )
}

// -----------------------------------------------------------------------------
// Avatar Colors (deterministic based on name)
// -----------------------------------------------------------------------------

const avatarColors = [
  "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300",
  "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
  "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  "bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300",
  "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
]

function getAvatarColor(name: string): string {
  const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return avatarColors[hash % avatarColors.length]
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

// -----------------------------------------------------------------------------
// Profile Header (Avatar + Name + Email) - Hero Section
// -----------------------------------------------------------------------------

function ProfileHeader({ user, localDisplayName }: { user: ProfileUser; localDisplayName?: string }) {
  const displayName = localDisplayName || user.displayName || user.email.split("@")[0]
  const initials = getInitials(displayName)

  // Calculate account age for fun stat - use stable creation date
  const createdAt = new Date(user.createdAt).getTime()
  const [accountAge, setAccountAge] = React.useState(0)
  React.useEffect(() => {
    setAccountAge(Math.floor((Date.now() - createdAt) / (1000 * 60 * 60 * 24)))
  }, [createdAt])
  const accountAgeText = accountAge === 0 ? "Joined today" : accountAge === 1 ? "Joined 1 day ago" : `Joined ${accountAge} days ago`

  // Avatar dimensions for consistent spacing
  const avatarSize = "h-20 w-20 sm:h-24 sm:w-24" // 80px / 96px
  const avatarLeft = "left-4 sm:left-6"
  const textPaddingLeft = "pl-28 sm:pl-36" // avatar + gap

  return (
    <Card className="profile-header overflow-hidden p-0 hover:shadow-md transition-shadow duration-300">
      <div className="relative">
        {/* Avatar - absolutely positioned, overlaps both sections */}
        <div className={cn("absolute top-[60%] -translate-y-1/2 z-10 group", avatarLeft)}>
          <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          {user.avatarUrl ? (
            <Image
              src={user.avatarUrl}
              alt={displayName}
              width={96}
              height={96}
              className={cn(avatarSize, "relative rounded-full object-cover ring-4 ring-background shadow-xl")}
            />
          ) : (
            <div
              className={cn(
                avatarSize,
                "relative rounded-full flex items-center justify-center text-xl sm:text-2xl font-bold ring-4 ring-background shadow-xl transition-transform duration-300 group-hover:scale-105",
                getAvatarColor(displayName)
              )}
            >
              {initials}
            </div>
          )}
          {/* Verified badge overlay */}
          {user.emailVerified && (
            <div className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-success flex items-center justify-center ring-2 ring-background">
              <CheckCircleIcon className="h-3.5 w-3.5 text-white" />
            </div>
          )}
        </div>

        {/* Top section: Gradient with name */}
        <div className="relative h-[130px] bg-gradient-to-br from-primary/30 via-violet-500/20 to-purple-500/10 overflow-hidden">
          {/* Decorative blur elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-4 right-8 h-24 w-24 rounded-full bg-primary/20 blur-2xl" />
            <div className="absolute bottom-0 left-1/4 h-32 w-32 rounded-full bg-violet-500/15 blur-3xl" />
            <div className="absolute top-1/2 right-1/3 h-20 w-20 rounded-full bg-purple-500/10 blur-2xl" />
          </div>
          
          {/* Name - aligned to bottom */}
          <div className={cn("absolute inset-x-0 bottom-0 pb-1.5 pr-4", textPaddingLeft)}>
            <Title size="h4" className="truncate">{displayName}</Title>
          </div>
        </div>

        {/* Bottom section: White with email + metadata */}
        <div className={cn("h-[80px] bg-background flex flex-col justify-start pt-1.5 pr-4", textPaddingLeft)}>
          <Text size="sm" variant="muted" className="truncate">{user.email}</Text>
          <Row gap="sm" className="mt-1 flex-wrap">
            <Row gap="xs" className="items-center text-muted-foreground">
              <CalendarIcon className="h-3 w-3" />
              <Text size="xs">{accountAgeText}</Text>
            </Row>
            {user.emailVerified && (
              <Row gap="xs" className="items-center text-success">
                <ShieldCheckIcon className="h-3 w-3" />
                <Text size="xs" className="text-success">Verified</Text>
              </Row>
            )}
          </Row>
        </div>
      </div>
    </Card>
  )
}

// -----------------------------------------------------------------------------
// Profile Details Card (Name, future: location, etc.)
// -----------------------------------------------------------------------------

function DisplayNameCard({ 
  user, 
  isSupabase,
  localDisplayName,
  onDisplayNameUpdate,
}: { 
  user: ProfileUser
  isSupabase: boolean
  localDisplayName?: string
  onDisplayNameUpdate: (name: string) => void
}) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [displayName, setDisplayName] = React.useState(localDisplayName || user.displayName || "")
  const [isLoading, setIsLoading] = React.useState(false)

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!displayName.trim()) {
      toast.error("Display name cannot be empty")
      return
    }

    setIsLoading(true)

    try {
      const supabase = createSupabaseBrowserClient()
      const { error } = await supabase.auth.updateUser({
        data: { 
          display_name: displayName.trim(),
          full_name: displayName.trim(),
        }
      })

      if (error) {
        toast.error(error.message)
      } else {
        toast.success("Profile updated")
        setIsOpen(false)
        // Update local state and refresh server components
        onDisplayNameUpdate(displayName.trim())
      }
    } catch {
      toast.error("Failed to update profile")
    } finally {
      setIsLoading(false)
    }
  }

  const currentName = localDisplayName || user.displayName || user.email.split("@")[0]

  return (
    <Card className="profile-card group hover:shadow-md transition-shadow duration-300">
      <CardHeader className="pb-3">
        <Row gap="sm" className="items-center">
          <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <UserIcon className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base">Personal Info</CardTitle>
            <CardDescription className="text-xs">Your profile details</CardDescription>
          </div>
          {!isSupabase && (
            <Badge variant="secondary" className="shrink-0">
              <LockIcon className="h-3 w-3 mr-1" />
              Read-only
            </Badge>
          )}
        </Row>
      </CardHeader>
      <CardContent className="pt-0">
        <Stack gap="sm">
          {/* Key/Value list - expandable for future fields */}
          <div className="rounded-lg bg-muted/50 divide-y divide-border">
            <Row className="px-4 py-3 justify-between items-center gap-4">
              <Text size="xs" variant="muted" className="shrink-0">Display Name</Text>
              <Text size="sm" weight="medium" className="truncate text-right">{currentName}</Text>
            </Row>
            {/* Future fields can be added here:
            <Row className="px-4 py-3 justify-between items-center gap-4">
              <Text size="xs" variant="muted" className="shrink-0">Location</Text>
              <Text size="sm" weight="medium" className="truncate text-right">Not set</Text>
            </Row>
            */}
          </div>
        </Stack>
      </CardContent>
      {isSupabase && (
        <CardFooter className="pt-0">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger render={<Button variant="outline" size="sm" className="w-full" />}>
              <PencilIcon className="h-3.5 w-3.5 mr-1.5" />
              Update Details
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogDescription>
                  Update your personal information.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleUpdateName}>
                <Stack gap="md" className="py-4">
                  <Stack gap="xs">
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input
                      id="displayName"
                      type="text"
                      placeholder="Your name"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      disabled={isLoading}
                      required
                    />
                  </Stack>
                </Stack>
                <DialogFooter>
                  <DialogClose render={<Button type="button" variant="ghost" disabled={isLoading} />}>
                    Cancel
                  </DialogClose>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading && <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />}
                    Save Changes
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardFooter>
      )}
    </Card>
  )
}

// -----------------------------------------------------------------------------
// Account Details Card
// -----------------------------------------------------------------------------

function AccountDetailsCard({ user }: { user: ProfileUser }) {
  const [copied, setCopied] = React.useState(false)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const copyUserId = async () => {
    await navigator.clipboard.writeText(user.id)
    setCopied(true)
    toast.success("User ID copied to clipboard")
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className="profile-card group hover:shadow-md transition-shadow duration-300">
      <CardHeader className="pb-3">
        <Row gap="sm" className="items-center">
          <div className="h-9 w-9 rounded-lg bg-violet-500/10 flex items-center justify-center">
            <ShieldCheckIcon className="h-4 w-4 text-violet-500" />
          </div>
          <div>
            <CardTitle className="text-base">Account</CardTitle>
            <CardDescription className="text-xs">Technical details</CardDescription>
          </div>
        </Row>
      </CardHeader>
      <CardContent className="pt-0">
        <Stack gap="sm">
          {/* User ID - compact */}
          <div className="rounded-lg bg-muted/50 px-3 py-2">
            <Row className="justify-between items-center gap-2">
              <Stack gap="none" className="min-w-0 flex-1">
                <Text size="xs" variant="muted">User ID</Text>
                <Text size="xs" className="font-mono truncate">{user.id}</Text>
              </Stack>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={copyUserId}
                className="shrink-0 h-7 w-7"
              >
                {copied ? (
                  <CheckCircleIcon className="h-3.5 w-3.5 text-success" />
                ) : (
                  <CopyIcon className="h-3.5 w-3.5" />
                )}
              </Button>
            </Row>
          </div>

          {/* Stats row */}
          <Row gap="sm">
            <div className="flex-1 rounded-lg bg-muted/50 px-3 py-2">
              <Row gap="xs" className="items-center mb-0.5">
                <CalendarIcon className="h-3 w-3 text-muted-foreground" />
                <Text size="xs" variant="muted">Created</Text>
              </Row>
              <Text size="xs" weight="medium">{formatDate(user.createdAt)}</Text>
            </div>
            {user.lastSignIn && (
              <div className="flex-1 rounded-lg bg-muted/50 px-3 py-2">
                <Row gap="xs" className="items-center mb-0.5">
                  <ClockIcon className="h-3 w-3 text-muted-foreground" />
                  <Text size="xs" variant="muted">Last login</Text>
                </Row>
                <Text size="xs" weight="medium">{formatDateTime(user.lastSignIn)}</Text>
              </div>
            )}
          </Row>
        </Stack>
      </CardContent>
    </Card>
  )
}

// -----------------------------------------------------------------------------
// Email Card
// -----------------------------------------------------------------------------

function EmailCard({ 
  user, 
  isSupabase,
  localPendingEmail,
  onEmailChangeRequest,
}: { 
  user: ProfileUser
  isSupabase: boolean
  localPendingEmail?: string
  onEmailChangeRequest: (email: string) => void
}) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [currentPassword, setCurrentPassword] = React.useState("")
  const [newEmail, setNewEmail] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [isResending, setIsResending] = React.useState(false)

  // Use local pending email (more reliable than Supabase's new_email field)
  const pendingEmail = localPendingEmail || user.pendingEmail

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newEmail || newEmail === user.email) {
      setIsOpen(false)
      return
    }

    if (!currentPassword) {
      toast.error("Please enter your current password")
      return
    }

    setIsLoading(true)

    try {
      const supabase = createSupabaseBrowserClient()

      // Verify current password first
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      })
      if (signInError) {
        toast.error("Current password is incorrect")
        setIsLoading(false)
        return
      }

      // Request email change
      // Note: Some email domains may trigger a false "invalid email" error due to
      // Supabase's domain validation. See: https://github.com/supabase/auth/issues/2252
      const { error } = await supabase.auth.updateUser(
        { email: newEmail },
        { emailRedirectTo: `${getURL()}api/auth/callback?next=/admin/profile` }
      )

      if (error) {
        // Check if this might be the domain validation bug
        if (error.message.includes("invalid")) {
          toast.error("Email update failed. This email domain may not be supported.")
        } else {
          toast.error(error.message)
        }
        return
      }

      // Success - email change request sent
      // With "Secure email change" enabled, user must verify from both old and new email
      toast.success("Verification email sent. Check both your old and new email addresses.")
      setIsOpen(false)
      setCurrentPassword("")
      // Update local state with the pending email
      onEmailChangeRequest(newEmail)
      setNewEmail("")
    } catch (err) {
      console.error("Email update error:", err)
      toast.error("Failed to update email")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendVerification = async () => {
    setIsResending(true)

    try {
      const supabase = createSupabaseBrowserClient()
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: user.email,
      })

      if (error) {
        toast.error(error.message)
      } else {
        toast.success("Verification email sent")
      }
    } catch {
      toast.error("Failed to resend verification email")
    } finally {
      setIsResending(false)
    }
  }

  return (
    <Card className="profile-card group hover:shadow-md transition-shadow duration-300">
      <CardHeader className="pb-3">
        <Row gap="sm" className="items-center">
          <div className="h-9 w-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <MailIcon className="h-4 w-4 text-blue-500" />
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base">Email</CardTitle>
            <CardDescription className="text-xs">Your login email address</CardDescription>
          </div>
          {user.emailVerified ? (
            <Badge variant="default" className="bg-success hover:bg-success shrink-0">
              <CheckCircleIcon className="h-3 w-3 mr-1" />
              Verified
            </Badge>
          ) : (
            <Row gap="sm" className="items-center shrink-0">
              <Badge variant="secondary">Unverified</Badge>
              {isSupabase && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleResendVerification}
                  disabled={isResending}
                >
                  {isResending ? (
                    <Loader2Icon className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    "Resend"
                  )}
                </Button>
              )}
            </Row>
          )}
        </Row>
      </CardHeader>
      <CardContent className="pt-0">
        <Stack gap="sm">
          <div className="rounded-lg bg-muted/50 px-4 py-3">
            <Text size="sm" weight="medium">{user.email}</Text>
          </div>

          {/* Pending Email Change Badge */}
          {pendingEmail && (
            <div className="rounded-lg border border-warning/30 bg-warning/10 px-3 py-2.5">
              <Row gap="sm" className="items-center">
                <div className="h-7 w-7 rounded-full bg-warning/20 flex items-center justify-center shrink-0">
                  <MailIcon className="h-3.5 w-3.5 text-warning" />
                </div>
                <Stack gap="none" className="min-w-0">
                  <Text size="xs" weight="medium">Pending change</Text>
                  <Text size="xs" variant="muted" className="truncate">
                    {pendingEmail}
                  </Text>
                </Stack>
              </Row>
            </div>
          )}
        </Stack>
      </CardContent>
      {isSupabase && (
        <CardFooter className="pt-0">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger render={<Button variant="outline" size="sm" className="w-full" />}>
              <MailIcon className="h-3.5 w-3.5 mr-1.5" />
              Change Email
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                  <DialogTitle>Update Email Address</DialogTitle>
                  <DialogDescription>
                    Enter your new email address. For security, we&apos;ll send verification links to both your current and new email addresses. You&apos;ll need to confirm from both to complete the update.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleUpdateEmail}>
                  <Stack gap="md" className="py-4">
                    <Stack gap="xs">
                      <Label htmlFor="currentPasswordEmail">Current Password</Label>
                      <Input
                        id="currentPasswordEmail"
                        type="password"
                        placeholder="••••••••"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        disabled={isLoading}
                        required
                      />
                    </Stack>
                    <Stack gap="xs">
                      <Label htmlFor="newEmail">New Email Address</Label>
                      <Input
                        id="newEmail"
                        type="email"
                        placeholder="new@example.com"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        disabled={isLoading}
                        required
                      />
                    </Stack>
                  </Stack>
                  <DialogFooter>
                    <DialogClose render={<Button type="button" variant="ghost" disabled={isLoading} />}>
                      Cancel
                    </DialogClose>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading && <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />}
                      Send Verification
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
        </CardFooter>
      )}
    </Card>
  )
}

// -----------------------------------------------------------------------------
// Password Card
// -----------------------------------------------------------------------------

function PasswordCard({ user, isSupabase }: { user: ProfileUser; isSupabase: boolean }) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [currentPassword, setCurrentPassword] = React.useState("")
  const [newPassword, setNewPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!currentPassword) {
      toast.error("Please enter your current password")
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters")
      return
    }

    setIsLoading(true)

    try {
      const supabase = createSupabaseBrowserClient()

      // Verify current password first
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      })

      if (signInError) {
        toast.error("Current password is incorrect")
        setIsLoading(false)
        return
      }

      const { error } = await supabase.auth.updateUser({ password: newPassword })

      if (error) {
        toast.error(error.message)
      } else {
        toast.success("Password updated successfully")
        setIsOpen(false)
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
      }
    } catch {
      toast.error("Failed to update password")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="profile-card group hover:shadow-md transition-shadow duration-300">
      <CardHeader className="pb-3">
        <Row gap="sm" className="items-center">
          <div className="h-9 w-9 rounded-lg bg-emerald-500/10 flex items-center justify-center">
            <KeyIcon className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base">Password</CardTitle>
            <CardDescription className="text-xs">Keep your account secure</CardDescription>
          </div>
          {!isSupabase && (
            <Badge variant="secondary" className="shrink-0">
              <LockIcon className="h-3 w-3 mr-1" />
              Read-only
            </Badge>
          )}
        </Row>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="rounded-lg bg-muted/50 px-4 py-3">
          <Row gap="sm" className="items-center">
            <div className="flex gap-1">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-2 w-2 rounded-full bg-foreground/30" />
              ))}
            </div>
            <Text size="xs" variant="muted">Last changed: Unknown</Text>
          </Row>
        </div>
      </CardContent>
      {isSupabase && (
        <CardFooter className="pt-0">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger render={<Button variant="outline" size="sm" className="w-full" />}>
              <KeyIcon className="h-3.5 w-3.5 mr-1.5" />
              Change Password
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Update Password</DialogTitle>
                <DialogDescription>
                  Enter a new password for your account. Make sure it&apos;s at least 6 characters.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleUpdatePassword}>
                <Stack gap="md" className="py-4">
                  <Stack gap="xs">
                    <Label htmlFor="currentPasswordUpdate">Current Password</Label>
                    <Input
                      id="currentPasswordUpdate"
                      type="password"
                      placeholder="••••••••"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      disabled={isLoading}
                      required
                    />
                  </Stack>
                  <Stack gap="xs">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      disabled={isLoading}
                      required
                      minLength={6}
                    />
                  </Stack>
                  <Stack gap="xs">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={isLoading}
                      required
                      minLength={6}
                    />
                  </Stack>
                </Stack>
                <DialogFooter>
                  <DialogClose render={<Button type="button" variant="ghost" disabled={isLoading} />}>
                    Cancel
                  </DialogClose>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading && <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />}
                    Update Password
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardFooter>
      )}
    </Card>
  )
}

// -----------------------------------------------------------------------------
// Danger Zone Card
// -----------------------------------------------------------------------------

interface DangerZoneCardProps {
  /** Whether account deletion is enabled (service role key configured) */
  canDelete: boolean
}

function DangerZoneCard({ canDelete }: DangerZoneCardProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [confirmText, setConfirmText] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)

  const handleDeleteAccount = async () => {
    if (confirmText !== "DELETE") {
      toast.error("Please type DELETE to confirm")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/delete-account", { method: "DELETE" })
      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || "Failed to delete account")
        return
      }

      toast.success("Account deleted successfully")
      // Redirect to home page after deletion
      window.location.href = "/"
    } catch {
      toast.error("Failed to delete account")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="danger-zone border-destructive/20 bg-destructive/5 hover:shadow-md transition-shadow duration-300">
      <CardContent className="py-4">
        <Row gap="md" className="items-center justify-between flex-wrap">
          <Row gap="sm" className="items-center">
            <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
              <AlertTriangleIcon className="h-5 w-5 text-destructive" />
            </div>
            <Stack gap="none">
              <Text size="sm" weight="medium" className="text-destructive">Danger Zone</Text>
              <Text size="xs" variant="muted">
                {canDelete 
                  ? "Permanently delete your account" 
                  : "Contact admin to delete account"}
              </Text>
            </Stack>
          </Row>
          {canDelete && (
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger render={<Button variant="destructive" size="sm" />}>
                <AlertTriangleIcon className="h-3.5 w-3.5 mr-1.5" />
                Delete Account
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-destructive">Delete Account</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete your
                    account and remove all associated data from our servers.
                  </DialogDescription>
                </DialogHeader>
                <Stack gap="md" className="py-4">
                  <Stack gap="sm">
                    <Label htmlFor="confirmDelete">
                      Type <strong>DELETE</strong> to confirm
                    </Label>
                    <Input
                      id="confirmDelete"
                      placeholder="DELETE"
                      value={confirmText}
                      onChange={(e) => setConfirmText(e.target.value)}
                      disabled={isLoading}
                    />
                  </Stack>
                </Stack>
                <DialogFooter>
                  <DialogClose render={<Button type="button" variant="ghost" disabled={isLoading} />}>
                    Cancel
                  </DialogClose>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteAccount}
                    disabled={isLoading || confirmText !== "DELETE"}
                  >
                    {isLoading && <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />}
                    Delete Account
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </Row>
      </CardContent>
    </Card>
  )
}
