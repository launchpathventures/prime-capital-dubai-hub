/**
 * CATALYST - Auth Surface Doc Tab: Design
 *
 * A living showcase of Auth surface design patterns.
 * Shows form layouts, error states, and trust signals.
 */

"use client"

import { Stack, Text, Title, Row } from "@/components/core"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import {
  CheckCircle2Icon,
  XCircleIcon,
  MailIcon,
  LockIcon,
  Loader2Icon,
  AlertCircleIcon,
} from "lucide-react"

export function DesignTab() {
  return (
    <article>
      <Stack gap="xl">
        {/* Summary Card */}
        <div className="border-primary bg-primary/5 space-y-4 rounded-lg border-l-4 p-5">
          <div>
            <p className="text-lg font-medium leading-snug">
              Auth Surface Design
            </p>
            <p className="text-muted-foreground mt-1">
              Guidelines for trustworthy authentication pages
            </p>
          </div>

          {/* Core message */}
          <p className="leading-relaxed">
            Auth pages should be <strong>clean</strong>,{" "}
            <strong>focused</strong>, and <strong>trustworthy</strong>. Remove
            distractions, show clear feedback, and make errors easy to fix.
          </p>

          {/* Principles */}
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            {[
              { label: "Focused", desc: "One task per page" },
              { label: "Clear", desc: "Obvious next step" },
              { label: "Forgiving", desc: "Easy error recovery" },
              { label: "Secure", desc: "Trust signals" },
            ].map((p) => (
              <div key={p.label} className="bg-background rounded-md border p-2.5">
                <Text size="sm" weight="medium">
                  {p.label}
                </Text>
                <Text size="xs" variant="muted">
                  {p.desc}
                </Text>
              </div>
            ))}
          </div>

          {/* Do / Don't */}
          <div className="grid gap-3 md:grid-cols-2">
            <div className="bg-background rounded-md border p-3">
              <Row gap="sm" className="mb-2 items-center">
                <CheckCircle2Icon className="h-4 w-4 text-emerald-600" />
                <Text size="sm" weight="medium">
                  Do
                </Text>
              </Row>
              <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
                <li>Center the form with ample whitespace</li>
                <li>Show clear validation feedback</li>
                <li>Provide password visibility toggle</li>
                <li>Include links to related flows</li>
              </ul>
            </div>
            <div className="bg-background rounded-md border p-3">
              <Row gap="sm" className="mb-2 items-center">
                <XCircleIcon className="h-4 w-4 text-red-600" />
                <Text size="sm" weight="medium">
                  Don&apos;t
                </Text>
              </Row>
              <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
                <li>Add unnecessary navigation</li>
                <li>Show vague error messages</li>
                <li>Require too many fields</li>
                <li>Hide the submit button</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Sign In Form */}
        <section className="flex justify-center">
            <Card className="w-full max-w-md">
              <CardHeader className="text-center">
                <div className="bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                  <LockIcon className="text-primary h-6 w-6" />
                </div>
                <CardTitle>Welcome back</CardTitle>
                <CardDescription>
                  Sign in to your account to continue
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <MailIcon className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <button className="text-primary text-xs hover:underline">
                      Forgot password?
                    </button>
                  </div>
                  <Input id="password" type="password" placeholder="••••••••" />
                </div>
              </CardContent>
              <CardFooter className="flex-col gap-4">
                <Button className="w-full">Sign in</Button>
                <Text size="sm" variant="muted">
                  Don&apos;t have an account?{" "}
                  <button className="text-primary hover:underline">
                    Sign up
                  </button>
                </Text>
              </CardFooter>
            </Card>
        </section>

        {/* Form States */}
        <div className="grid gap-6 md:grid-cols-2">
            {/* Loading state */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Loading</CardTitle>
                <CardDescription>While submitting</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" disabled>
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </Button>
              </CardContent>
            </Card>

            {/* Error state */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Error</CardTitle>
                <CardDescription>Failed validation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-3">
                  <Row gap="sm" className="items-center">
                    <AlertCircleIcon className="h-4 w-4 text-red-500" />
                    <Text size="sm">Invalid email or password</Text>
                  </Row>
                </div>
                <Input
                  type="email"
                  defaultValue="invalid@"
                  className="border-red-500"
                />
              </CardContent>
            </Card>

            {/* Success state */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Success</CardTitle>
                <CardDescription>After submission</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4 text-center">
                  <CheckCircle2Icon className="mx-auto mb-2 h-8 w-8 text-emerald-500" />
                  <Text weight="medium">Check your email</Text>
                  <Text size="sm" variant="muted">
                    We sent a password reset link
                  </Text>
                </div>
              </CardContent>
            </Card>

            {/* Disabled state */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Disabled</CardTitle>
                <CardDescription>Incomplete form</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input type="email" placeholder="Email" />
                <Button className="w-full" disabled>
                  Sign in
                </Button>
              </CardContent>
            </Card>
        </div>

        {/* Social Login */}
        <div className="bg-muted rounded-xl border p-6">
          <div className="mx-auto max-w-md space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-muted text-muted-foreground px-2">
                  Or continue with
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline">
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </Button>
              <Button variant="outline">
                <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub
              </Button>
            </div>
          </div>
        </div>

        {/* Trust Signals */}
        <Card>
            <CardContent className="pt-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center">
                  <LockIcon className="text-muted-foreground mx-auto mb-2 h-6 w-6" />
                  <Text size="sm" weight="medium">
                    Secure connection
                  </Text>
                  <Text size="xs" variant="muted">
                    256-bit encryption
                  </Text>
                </div>
                <div className="text-center">
                  <ShieldCheckIcon className="text-muted-foreground mx-auto mb-2 h-6 w-6" />
                  <Text size="sm" weight="medium">
                    Privacy protected
                  </Text>
                  <Text size="xs" variant="muted">
                    GDPR compliant
                  </Text>
                </div>
                <div className="text-center">
                  <CheckCircle2Icon className="text-muted-foreground mx-auto mb-2 h-6 w-6" />
                  <Text size="sm" weight="medium">
                    Verified provider
                  </Text>
                  <Text size="xs" variant="muted">
                    SOC 2 certified
                  </Text>
                </div>
              </div>
            </CardContent>
        </Card>
      </Stack>
    </article>
  )
}

// Helper icon for trust signals
function ShieldCheckIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}
