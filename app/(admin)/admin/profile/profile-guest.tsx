/**
 * Guest Profile (Demo Mode)
 *
 * Showcase profile page for demo/password modes where no real user exists.
 * Displays a compelling example of what the profile page looks like with
 * dummy data, clearly marked as a guest/demo experience.
 *
 * This is intentionally separate from ProfileForm to keep the real
 * authenticated experience cleanly isolated from the demo version.
 */

"use client"

import * as React from "react"
import { Stack, Row, Text, Title, Grid } from "@/components/core"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { DevCard } from "@/components/shared/dev-card"
import {
  KeyIcon,
  MailIcon,
  UserIcon,
  ShieldCheckIcon,
  CalendarIcon,
  ClockIcon,
  LockIcon,
  InfoIcon,
  SparklesIcon,
  TrashIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { type AuthMode } from "@/lib/auth/config"

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface ProfileGuestProps {
  /** Current auth mode */
  mode: AuthMode
}

// -----------------------------------------------------------------------------
// Mock Guest Data
// -----------------------------------------------------------------------------

const GUEST_USER = {
  name: "User",
  type: "Guest",
  email: "guest@example.com",
  joinedDaysAgo: 42,
  lastSignIn: "Today at 10:30 AM",
  userId: "guest_demo_12345",
}

// -----------------------------------------------------------------------------
// Avatar Colors (matching real profile)
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

// -----------------------------------------------------------------------------
// Guest Profile Component
// -----------------------------------------------------------------------------

export function ProfileGuest({ mode }: ProfileGuestProps) {
  // Avatar dimensions for consistent spacing
  const avatarSize = "h-20 w-20 sm:h-24 sm:w-24"
  const avatarLeft = "left-4 sm:left-6"
  const textPaddingLeft = "pl-28 sm:pl-36"

  return (
    <Stack gap="lg" className="profile-guest">
      {/* Dev Card - Guest Mode Explanation */}
      <DevCard title="Profile" badge={<Badge variant="outline" className="text-amber-600 border-amber-500/50">Guest</Badge>}>
        <Row gap="sm" align="start">
          <SparklesIcon className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
          <Stack gap="xs">
            <Text size="sm" weight="medium">Guest Mode Profile</Text>
            <Text size="xs" variant="muted">
              This is a demo profile page shown when no authenticated user is available.
              In <Badge variant="secondary" className="mx-1 text-xs py-0">{mode}</Badge> mode, 
              user data comes from a simple session cookie, not a full user database.
              Switch to <code className="text-xs bg-muted px-1 rounded">supabase</code> mode for real profile management.
            </Text>
          </Stack>
        </Row>
      </DevCard>

      {/* Profile Header with Avatar - Hero Section */}
      <Card className="profile-header overflow-hidden p-0 hover:shadow-md transition-shadow duration-300">
        <div className="relative">
          {/* Avatar - absolutely positioned, overlaps both sections */}
          <div className={cn("absolute top-[60%] -translate-y-1/2 z-10 group", avatarLeft)}>
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div
              className={cn(
                avatarSize,
                "relative rounded-full flex items-center justify-center text-xl sm:text-2xl font-bold ring-4 ring-background shadow-xl transition-transform duration-300 group-hover:scale-105",
                getAvatarColor(GUEST_USER.name)
              )}
            >
              U
            </div>
            {/* Guest badge overlay */}
            <div className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-amber-500 flex items-center justify-center ring-2 ring-background">
              <SparklesIcon className="h-3.5 w-3.5 text-white" />
            </div>
          </div>

          {/* Top section: Gradient with name */}
          <div className="relative h-[130px] bg-gradient-to-br from-amber-500/30 via-orange-500/20 to-yellow-500/10 overflow-hidden">
            {/* Decorative blur elements */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-4 right-8 h-24 w-24 rounded-full bg-amber-500/20 blur-2xl" />
              <div className="absolute bottom-0 left-1/4 h-32 w-32 rounded-full bg-orange-500/15 blur-3xl" />
              <div className="absolute top-1/2 right-1/3 h-20 w-20 rounded-full bg-yellow-500/10 blur-2xl" />
            </div>
            
            {/* Name - aligned to bottom */}
            <div className={cn("absolute inset-x-0 bottom-0 pb-1.5 pr-4", textPaddingLeft)}>
              <Row gap="sm" align="center">
                <Title size="h4" className="truncate">{GUEST_USER.name}</Title>
                <Badge variant="outline" className="border-amber-500/50 text-amber-600 dark:text-amber-400">
                  {GUEST_USER.type}
                </Badge>
              </Row>
            </div>
          </div>

          {/* Bottom section: White with email + metadata */}
          <div className={cn("h-[80px] bg-background flex flex-col justify-start pt-1.5 pr-4", textPaddingLeft)}>
            <Text size="sm" variant="muted" className="truncate">{GUEST_USER.email}</Text>
            <Row gap="sm" className="mt-1 flex-wrap">
              <Row gap="xs" className="items-center text-muted-foreground">
                <CalendarIcon className="h-3 w-3" />
                <Text size="xs">Joined {GUEST_USER.joinedDaysAgo} days ago</Text>
              </Row>
              <Row gap="xs" className="items-center text-amber-600 dark:text-amber-400">
                <SparklesIcon className="h-3 w-3" />
                <Text size="xs" className="text-amber-600 dark:text-amber-400">Demo Account</Text>
              </Row>
            </Row>
          </div>
        </div>
      </Card>

      {/* Personal Info Card */}
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
            <Badge variant="secondary" className="shrink-0">
              <LockIcon className="h-3 w-3 mr-1" />
              Demo
            </Badge>
          </Row>
        </CardHeader>
        <CardContent className="pt-0">
          <Stack gap="xs">
            <Label className="text-muted-foreground text-xs">Display Name</Label>
            <Input 
              value={GUEST_USER.name} 
              disabled 
              className="bg-muted/50"
            />
            <Text size="xs" variant="muted" className="flex items-center gap-1">
              <InfoIcon className="h-3 w-3" />
              Editable in Supabase mode only
            </Text>
          </Stack>
        </CardContent>
      </Card>

      {/* Email & Password Cards - Side by Side */}
      <Grid cols={2} gap="md">
        {/* Email Card */}
        <Card className="profile-card group hover:shadow-md transition-shadow duration-300">
          <CardHeader className="pb-3">
            <Row gap="sm" className="items-center">
              <div className="h-9 w-9 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                <MailIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-base">Email Address</CardTitle>
                <CardDescription className="text-xs">Used for sign in</CardDescription>
              </div>
            </Row>
          </CardHeader>
          <CardContent className="pt-0">
            <Stack gap="xs">
              <div className="flex items-center gap-2">
                <Input 
                  value={GUEST_USER.email} 
                  disabled 
                  className="bg-muted/50 flex-1"
                />
              </div>
              <Row gap="xs" className="items-center text-muted-foreground">
                <ShieldCheckIcon className="h-3 w-3" />
                <Text size="xs">Email verification simulated</Text>
              </Row>
            </Stack>
          </CardContent>
        </Card>

        {/* Password Card */}
        <Card className="profile-card group hover:shadow-md transition-shadow duration-300">
          <CardHeader className="pb-3">
            <Row gap="sm" className="items-center">
              <div className="h-9 w-9 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center shrink-0">
                <KeyIcon className="h-4 w-4 text-violet-600 dark:text-violet-400" />
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-base">Password</CardTitle>
                <CardDescription className="text-xs">Secure your account</CardDescription>
              </div>
            </Row>
          </CardHeader>
          <CardContent className="pt-0">
            <Stack gap="sm">
              <Input 
                type="password" 
                value="••••••••••••" 
                disabled 
                className="bg-muted/50"
              />
              <Button variant="outline" size="sm" disabled className="w-full">
                <LockIcon className="h-3.5 w-3.5 mr-1.5" />
                Change Password
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      {/* Account Details Card */}
      <Card className="profile-card group hover:shadow-md transition-shadow duration-300">
        <CardHeader className="pb-3">
          <Row gap="sm" className="items-center">
            <div className="h-9 w-9 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
              <ShieldCheckIcon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base">Account Details</CardTitle>
              <CardDescription className="text-xs">Technical information</CardDescription>
            </div>
          </Row>
        </CardHeader>
        <CardContent className="pt-0">
          <Grid cols={2} gap="md">
            <Stack gap="xs">
              <Label className="text-muted-foreground text-xs flex items-center gap-1">
                <UserIcon className="h-3 w-3" />
                User ID
              </Label>
              <code className="text-xs bg-muted px-2 py-1.5 rounded font-mono truncate block">
                {GUEST_USER.userId}
              </code>
            </Stack>
            <Stack gap="xs">
              <Label className="text-muted-foreground text-xs flex items-center gap-1">
                <ClockIcon className="h-3 w-3" />
                Last Sign In
              </Label>
              <Text size="sm" className="py-1">{GUEST_USER.lastSignIn}</Text>
            </Stack>
          </Grid>
        </CardContent>
      </Card>

      {/* Danger Zone (Demo Version) */}
      <Card className="profile-card border-destructive/30 bg-destructive/[0.02]">
        <CardHeader className="pb-3">
          <Row gap="sm" className="items-center">
            <div className="h-9 w-9 rounded-lg bg-destructive/10 flex items-center justify-center shrink-0">
              <TrashIcon className="h-4 w-4 text-destructive" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base text-destructive">Danger Zone</CardTitle>
              <CardDescription className="text-xs">Irreversible actions</CardDescription>
            </div>
            <Badge variant="secondary" className="shrink-0">
              <LockIcon className="h-3 w-3 mr-1" />
              Demo
            </Badge>
          </Row>
        </CardHeader>
        <CardContent className="pt-0">
          <Row gap="md" align="center" justify="between">
            <Stack gap="xs" className="flex-1">
              <Text size="sm" weight="medium">Delete Account</Text>
              <Text size="xs" variant="muted">
                Permanently remove your account and all data
              </Text>
            </Stack>
            <Button variant="outline" size="sm" disabled className="text-destructive border-destructive/30">
              Delete Account
            </Button>
          </Row>
        </CardContent>
      </Card>
    </Stack>
  )
}
