/**
 * CATALYST - Billing & Account Example
 *
 * Comprehensive SaaS billing page demonstrating:
 * - Plan & usage management
 * - Payment methods & invoices
 * - Notification preferences & security settings
 * - Interactive dialogs and state management
 */

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Container, Row, Stack, Text, Title } from "@/components/core"
import { ExamplePrompt, getExample } from "../../_surface"

const example = getExample("billing")!

import {
  CreditCardIcon,
  CheckIcon,
  ZapIcon,
  TrendingUpIcon,
  DownloadIcon,
  BellIcon,
  ShieldIcon,
  KeyIcon,
  SmartphoneIcon,
  MonitorIcon,
  TabletIcon,
  AlertTriangleIcon,
  SparklesIcon,
  ReceiptIcon,
  CalendarIcon,
  ArrowUpRightIcon,
} from "lucide-react"

// =============================================================================
// MOCK DATA
// =============================================================================

const plan = {
  name: "Pro",
  price: 29,
  cycle: "month",
  nextBilling: "January 15, 2026",
  features: [
    "Unlimited projects",
    "Priority support",
    "Advanced analytics",
    "Custom integrations",
    "Team collaboration",
    "API access",
  ],
}

const usage = [
  { label: "Projects", current: 18, limit: 25, unit: "" },
  { label: "Team Members", current: 12, limit: 15, unit: "" },
  { label: "Storage", current: 7.8, limit: 10, unit: "GB" },
  { label: "API Requests", current: 84500, limit: 100000, unit: "" },
]

const paymentMethod = {
  brand: "Visa",
  last4: "4242",
  expiry: "12/26",
  name: "Sarah Chen",
}

const invoices = [
  { id: "INV-2025-012", date: "Dec 15, 2025", amount: 29, status: "paid" as const },
  { id: "INV-2025-011", date: "Nov 15, 2025", amount: 29, status: "paid" as const },
  { id: "INV-2025-010", date: "Oct 15, 2025", amount: 29, status: "paid" as const },
  { id: "INV-2025-009", date: "Sep 15, 2025", amount: 29, status: "paid" as const },
  { id: "INV-2025-008", date: "Aug 15, 2025", amount: 49, status: "paid" as const },
  { id: "INV-2025-007", date: "Jul 15, 2025", amount: 49, status: "refunded" as const },
]

const notifications = [
  { id: "billing", label: "Billing alerts", description: "Payment confirmations and failures", enabled: true },
  { id: "usage", label: "Usage warnings", description: "When approaching plan limits", enabled: true },
  { id: "product", label: "Product updates", description: "New features and improvements", enabled: false },
  { id: "marketing", label: "Marketing", description: "Tips, offers, and newsletters", enabled: false },
]

const sessions = [
  { id: "1", device: "MacBook Pro", browser: "Chrome", location: "Auckland, NZ", time: "Now", current: true, icon: MonitorIcon },
  { id: "2", device: "iPhone 15", browser: "Safari", location: "Auckland, NZ", time: "2 hours ago", current: false, icon: SmartphoneIcon },
  { id: "3", device: "iPad Pro", browser: "Safari", location: "Sydney, AU", time: "3 days ago", current: false, icon: TabletIcon },
]

// =============================================================================
// HELPER COMPONENTS
// =============================================================================

function UsageMeter({ label, current, limit, unit }: { label: string; current: number; limit: number; unit: string }) {
  const percentage = Math.round((current / limit) * 100)
  const isWarning = percentage >= 75
  const isCritical = percentage >= 90
  
  const formatValue = (val: number) => {
    if (val >= 1000) return `${(val / 1000).toFixed(1)}k`
    return val.toString()
  }

  return (
    <Stack gap="xs">
      <Row justify="between">
        <Text size="sm" weight="medium">{label}</Text>
        <Text size="sm" className={isCritical ? "text-rose-600 dark:text-rose-400 font-medium" : isWarning ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground"}>
          {formatValue(current)}{unit} / {formatValue(limit)}{unit}
        </Text>
      </Row>
      <Progress 
        value={percentage} 
        className={`h-2 ${isCritical ? "[&>div]:bg-rose-500" : isWarning ? "[&>div]:bg-amber-500" : "[&>div]:bg-emerald-500"}`}
      />
    </Stack>
  )
}

function InvoiceStatusBadge({ status }: { status: "paid" | "pending" | "failed" | "refunded" }) {
  const styles = {
    paid: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800",
    pending: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-800",
    failed: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-400 dark:border-rose-800",
    refunded: "bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-950/50 dark:text-slate-400 dark:border-slate-700",
  }
  return <Badge variant="outline" className={styles[status]}>{status}</Badge>
}

// =============================================================================
// DIALOGS
// =============================================================================

function UpdatePaymentDialog() {
  const [cardNumber, setCardNumber] = useState("")
  
  const formatCard = (value: string) => {
    const nums = value.replace(/\D/g, "").slice(0, 16)
    return nums.replace(/(\d{4})(?=\d)/g, "$1 ")
  }

  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" size="sm">Update</Button>} />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Payment Method</DialogTitle>
          <DialogDescription>Enter your new card details below.</DialogDescription>
        </DialogHeader>
        
        {/* Current Card */}
        <div className="rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 p-4 text-white">
          <Row justify="between" align="center" className="mb-3">
            <Text size="xs" className="text-slate-400 uppercase tracking-wide">Current</Text>
            <Text size="sm" className="font-medium">{paymentMethod.brand}</Text>
          </Row>
          <Text className="font-mono tracking-widest mb-3">•••• •••• •••• {paymentMethod.last4}</Text>
          <Row justify="between">
            <Text size="xs" className="text-slate-400">{paymentMethod.name}</Text>
            <Text size="xs" className="text-slate-400">Exp {paymentMethod.expiry}</Text>
          </Row>
        </div>

        <Stack gap="md" className="pt-2">
          <Stack gap="sm">
            <Label>Card Number</Label>
            <Input 
              placeholder="4242 4242 4242 4242" 
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCard(e.target.value))}
            />
          </Stack>
          <Row gap="md">
            <Stack gap="sm" className="flex-1">
              <Label>Expiry</Label>
              <Input placeholder="MM / YY" />
            </Stack>
            <Stack gap="sm" className="flex-1">
              <Label>CVC</Label>
              <Input placeholder="123" maxLength={4} />
            </Stack>
          </Row>
        </Stack>

        <DialogFooter className="mt-4">
          <DialogClose render={<Button variant="outline">Cancel</Button>} />
          <Button className="bg-emerald-600 hover:bg-emerald-700">Save Card</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function ViewInvoicesDialog() {
  return (
    <Dialog>
      <DialogTrigger render={
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          View all invoices
          <ArrowUpRightIcon className="h-3 w-3 ml-1" />
        </Button>
      } />
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Invoice History</DialogTitle>
          <DialogDescription>Download invoices for your records.</DialogDescription>
        </DialogHeader>
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Invoice</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((inv) => (
                <TableRow key={inv.id} className="group">
                  <TableCell className="font-mono text-sm">{inv.id}</TableCell>
                  <TableCell className="text-muted-foreground">{inv.date}</TableCell>
                  <TableCell className="font-medium">${inv.amount}.00</TableCell>
                  <TableCell><InvoiceStatusBadge status={inv.status} /></TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100">
                      <DownloadIcon className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Close</Button>} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function CancelPlanDialog() {
  const [confirm, setConfirm] = useState("")
  
  return (
    <Dialog>
      <DialogTrigger render={
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30">
          Cancel plan
        </Button>
      } />
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center sm:text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30 mb-2">
            <AlertTriangleIcon className="h-6 w-6 text-amber-600" />
          </div>
          <DialogTitle>Cancel your subscription?</DialogTitle>
          <DialogDescription>
            Your plan will remain active until <span className="font-medium text-foreground">{plan.nextBilling}</span>. After that, you'll lose access to Pro features.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-3 my-2">
          <Text size="sm" weight="medium" className="text-amber-800 dark:text-amber-200 mb-1">You'll lose:</Text>
          <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-0.5">
            {plan.features.slice(0, 3).map((f) => (
              <li key={f}>• {f}</li>
            ))}
          </ul>
        </div>

        <Stack gap="sm">
          <Label className="text-sm">
            Type <span className="font-mono font-bold text-rose-600">CANCEL</span> to confirm
          </Label>
          <Input 
            value={confirm} 
            onChange={(e) => setConfirm(e.target.value.toUpperCase())}
            placeholder="Type CANCEL"
          />
        </Stack>

        <DialogFooter className="mt-4 gap-2">
          <DialogClose render={<Button variant="outline">Keep plan</Button>} />
          <Button variant="destructive" disabled={confirm !== "CANCEL"}>Cancel subscription</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// =============================================================================
// MAIN PAGE
// =============================================================================

export default function BillingPage() {
  const [notificationState, setNotificationState] = useState(notifications)
  const [twoFactor, setTwoFactor] = useState(false)
  const [sessionList, setSessionList] = useState(sessions)

  const toggleNotification = (id: string) => {
    setNotificationState((prev) => prev.map((n) => n.id === id ? { ...n, enabled: !n.enabled } : n))
  }

  const revokeSession = (id: string) => {
    setSessionList((prev) => prev.filter((s) => s.id !== id))
  }

  return (
    <Container size="xl">
      <Stack gap="lg">
        {/* Prompt */}
        <ExamplePrompt summary={example.summary}>
          {example.prompt}
        </ExamplePrompt>

        {/* Header */}
        <Card className="bg-gradient-to-r from-blue-500/[0.06] via-blue-500/[0.02] to-transparent animate-in fade-in slide-in-from-top-2 duration-500">
          <CardContent className="py-4">
            <Row gap="md" align="center">
              <div className="flex size-11 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                <CreditCardIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <Stack gap="none">
                <Title size="h3">Billing & Account</Title>
                <Text size="sm" variant="muted">
                  Manage your subscription, usage, and account settings
                </Text>
              </Stack>
            </Row>
          </CardContent>
        </Card>

        {/* ================================================================= */}
        {/* PLAN & USAGE */}
        {/* ================================================================= */}
        <div className="grid gap-4 lg:grid-cols-5">
          {/* Current Plan - 3 cols */}
          <Card className="lg:col-span-3 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent pointer-events-none" />
            <CardHeader className="pb-4">
              <Row justify="between" align="start">
                <Row gap="md" align="center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/50">
                    <SparklesIcon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <Stack gap="none">
                    <Row gap="sm" align="center">
                      <Title size="h4">Pro Plan</Title>
                      <Badge className="bg-emerald-600">Active</Badge>
                    </Row>
                    <Text size="sm" variant="muted">Billed monthly</Text>
                  </Stack>
                </Row>
                <Stack gap="none" align="end">
                  <Row gap="xs" align="baseline">
                    <Text className="text-3xl font-bold">${plan.price}</Text>
                    <Text size="sm" variant="muted">/{plan.cycle}</Text>
                  </Row>
                  <Text size="xs" variant="muted">Next billing {plan.nextBilling}</Text>
                </Stack>
              </Row>
            </CardHeader>
            <CardContent className="pt-0">
              <Separator className="mb-4" />
              <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                {plan.features.map((feature) => (
                  <Row key={feature} gap="sm" align="center">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/50">
                      <CheckIcon className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <Text size="sm">{feature}</Text>
                  </Row>
                ))}
              </div>
              <Separator className="my-4" />
              <Row justify="between" align="center">
                <Row gap="sm">
                  <Button variant="outline" size="sm">
                    <ZapIcon className="h-4 w-4 mr-1.5" />
                    Upgrade to Enterprise
                  </Button>
                  <CancelPlanDialog />
                </Row>
                <Text size="xs" variant="muted">
                  <CalendarIcon className="h-3 w-3 inline mr-1" />
                  Member since Jul 2025
                </Text>
              </Row>
            </CardContent>
          </Card>

          {/* Usage - 2 cols */}
          <Card className="lg:col-span-2 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent pointer-events-none" />
            <CardHeader className="pb-4">
              <Row gap="md" align="center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50">
                  <TrendingUpIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <Stack gap="none">
                  <Title size="h4">Usage This Month</Title>
                  <Text size="sm" variant="muted">Resets on billing date</Text>
                </Stack>
              </Row>
            </CardHeader>
            <CardContent className="pt-0">
              <Stack gap="md">
                {usage.map((u) => (
                  <UsageMeter key={u.label} {...u} />
                ))}
              </Stack>
              {usage.some((u) => (u.current / u.limit) >= 0.75) && (
                <div className="mt-4 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/30 p-3">
                  <Row gap="sm" align="center">
                    <AlertTriangleIcon className="h-4 w-4 text-amber-600 shrink-0" />
                    <Text size="sm" className="text-amber-800 dark:text-amber-200">
                      Approaching limits. <button className="underline font-medium">Upgrade now</button>
                    </Text>
                  </Row>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* ================================================================= */}
        {/* UPGRADE PLANS */}
        {/* ================================================================= */}
        <div className="grid gap-4 md:grid-cols-3">
          {/* Starter */}
          <Card className="relative">
            <CardHeader className="pb-4">
              <Stack gap="sm">
                <Title size="h4">Starter</Title>
                <Row gap="xs" align="baseline">
                  <Text className="text-3xl font-bold">$0</Text>
                  <Text size="sm" variant="muted">/month</Text>
                </Row>
                <Text size="sm" variant="muted">For individuals getting started</Text>
              </Stack>
            </CardHeader>
            <CardContent className="pt-0">
              <Stack gap="md">
                <Stack gap="xs">
                  {["3 projects", "1 team member", "1GB storage", "Community support"].map((f) => (
                    <Row key={f} gap="sm" align="center">
                      <CheckIcon className="h-4 w-4 text-muted-foreground" />
                      <Text size="sm">{f}</Text>
                    </Row>
                  ))}
                </Stack>
                <Button variant="outline" className="w-full" disabled>
                  Downgrade
                </Button>
              </Stack>
            </CardContent>
          </Card>

          {/* Pro - Current */}
          <Card className="relative overflow-visible border-2 border-emerald-500 shadow-lg shadow-emerald-500/10">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
              <Badge className="bg-emerald-600 shadow-sm px-3">Current Plan</Badge>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent pointer-events-none rounded-lg" />
            <CardHeader className="pb-4 pt-6">
              <Stack gap="sm">
                <Title size="h4">Pro</Title>
                <Row gap="xs" align="baseline">
                  <Text className="text-3xl font-bold">$29</Text>
                  <Text size="sm" variant="muted">/month</Text>
                </Row>
                <Text size="sm" variant="muted">For growing teams</Text>
              </Stack>
            </CardHeader>
            <CardContent className="pt-0">
              <Stack gap="md">
                <Stack gap="xs">
                  {["25 projects", "15 team members", "10GB storage", "Priority support", "API access"].map((f) => (
                    <Row key={f} gap="sm" align="center">
                      <CheckIcon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      <Text size="sm">{f}</Text>
                    </Row>
                  ))}
                </Stack>
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700" disabled>
                  <CheckIcon className="h-4 w-4 mr-1.5" />
                  Current Plan
                </Button>
              </Stack>
            </CardContent>
          </Card>

          {/* Enterprise */}
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-transparent pointer-events-none" />
            <CardHeader className="pb-4">
              <Stack gap="sm">
                <Row gap="sm" align="center">
                  <Title size="h4">Enterprise</Title>
                  <Badge variant="outline" className="text-violet-600 border-violet-200 dark:text-violet-400 dark:border-violet-800">
                    Popular
                  </Badge>
                </Row>
                <Row gap="xs" align="baseline">
                  <Text className="text-3xl font-bold">$99</Text>
                  <Text size="sm" variant="muted">/month</Text>
                </Row>
                <Text size="sm" variant="muted">For scaling organizations</Text>
              </Stack>
            </CardHeader>
            <CardContent className="pt-0">
              <Stack gap="md">
                <Stack gap="xs">
                  {["Unlimited projects", "Unlimited members", "100GB storage", "24/7 support", "Custom integrations", "SSO & audit logs"].map((f) => (
                    <Row key={f} gap="sm" align="center">
                      <CheckIcon className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                      <Text size="sm">{f}</Text>
                    </Row>
                  ))}
                </Stack>
                <Button className="w-full bg-violet-600 hover:bg-violet-700">
                  <ZapIcon className="h-4 w-4 mr-1.5" />
                  Upgrade to Enterprise
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </div>

        {/* ================================================================= */}
        {/* PAYMENT & INVOICES */}
        {/* ================================================================= */}
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Payment Method */}
          <Card>
            <CardHeader className="pb-4">
              <Row justify="between" align="center">
                <Row gap="md" align="center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                    <CreditCardIcon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                  </div>
                  <Stack gap="none">
                    <Title size="h4">Payment Method</Title>
                    <Text size="sm" variant="muted">Manage your billing details</Text>
                  </Stack>
                </Row>
                <UpdatePaymentDialog />
              </Row>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="rounded-lg border bg-muted/30 p-4">
                <Row justify="between" align="center">
                  <Row gap="md" align="center">
                    <div className="flex h-10 w-14 items-center justify-center rounded bg-gradient-to-br from-blue-600 to-blue-800 text-white text-xs font-bold">
                      VISA
                    </div>
                    <Stack gap="none">
                      <Text size="sm" weight="medium">•••• •••• •••• {paymentMethod.last4}</Text>
                      <Text size="xs" variant="muted">Expires {paymentMethod.expiry}</Text>
                    </Stack>
                  </Row>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800">
                    Default
                  </Badge>
                </Row>
              </div>
            </CardContent>
          </Card>

          {/* Recent Invoices */}
          <Card>
            <CardHeader className="pb-4">
              <Row justify="between" align="center">
                <Row gap="md" align="center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                    <ReceiptIcon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                  </div>
                  <Stack gap="none">
                    <Title size="h4">Recent Invoices</Title>
                    <Text size="sm" variant="muted">Download for your records</Text>
                  </Stack>
                </Row>
                <ViewInvoicesDialog />
              </Row>
            </CardHeader>
            <CardContent className="pt-0">
              <Stack gap="sm">
                {invoices.slice(0, 3).map((inv) => (
                  <Row key={inv.id} justify="between" align="center" className="group">
                    <Row gap="md" align="center">
                      <Text size="sm" className="font-mono text-muted-foreground">{inv.id}</Text>
                      <Text size="sm">{inv.date}</Text>
                    </Row>
                    <Row gap="md" align="center">
                      <Text size="sm" weight="medium">${inv.amount}.00</Text>
                      <InvoiceStatusBadge status={inv.status} />
                      <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                        <DownloadIcon className="h-4 w-4" />
                      </Button>
                    </Row>
                  </Row>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </div>

        {/* ================================================================= */}
        {/* NOTIFICATIONS & SECURITY */}
        {/* ================================================================= */}
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Notifications */}
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent pointer-events-none" />
            <CardHeader className="pb-4">
              <Row gap="md" align="center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/50">
                  <BellIcon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <Stack gap="none">
                  <Title size="h4">Notifications</Title>
                  <Text size="sm" variant="muted">Manage email preferences</Text>
                </Stack>
              </Row>
            </CardHeader>
            <CardContent className="pt-0">
              <Stack gap="none" className="divide-y">
                {notificationState.map((n) => (
                  <Row key={n.id} justify="between" align="center" className="py-3 first:pt-0 last:pb-0">
                    <Stack gap="none">
                      <Text size="sm" weight="medium">{n.label}</Text>
                      <Text size="xs" variant="muted">{n.description}</Text>
                    </Stack>
                    <Switch checked={n.enabled} onCheckedChange={() => toggleNotification(n.id)} />
                  </Row>
                ))}
              </Stack>
            </CardContent>
          </Card>

          {/* Security */}
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent pointer-events-none" />
            <CardHeader className="pb-4">
              <Row gap="md" align="center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/50">
                  <ShieldIcon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <Stack gap="none">
                  <Title size="h4">Security</Title>
                  <Text size="sm" variant="muted">Protect your account</Text>
                </Stack>
              </Row>
            </CardHeader>
            <CardContent className="pt-0">
              <Stack gap="sm">
                {/* Password */}
                <Row justify="between" align="center" className="rounded-lg border p-3 hover:bg-muted/50 transition-colors">
                  <Row gap="sm" align="center">
                    <KeyIcon className="h-4 w-4 text-muted-foreground" />
                    <Stack gap="none">
                      <Text size="sm" weight="medium">Password</Text>
                      <Text size="xs" variant="muted">Last changed 3 months ago</Text>
                    </Stack>
                  </Row>
                  <Button variant="outline" size="sm">Change</Button>
                </Row>

                {/* 2FA */}
                <Row 
                  justify="between" 
                  align="center" 
                  className={`rounded-lg border p-3 transition-all ${twoFactor ? "border-emerald-200 bg-emerald-50/50 dark:border-emerald-800 dark:bg-emerald-950/30" : "hover:bg-muted/50"}`}
                >
                  <Row gap="sm" align="center">
                    <ShieldIcon className={`h-4 w-4 ${twoFactor ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`} />
                    <Stack gap="none">
                      <Text size="sm" weight="medium">Two-factor authentication</Text>
                      <Text size="xs" variant="muted">{twoFactor ? "Enabled via authenticator app" : "Add extra security to your account"}</Text>
                    </Stack>
                  </Row>
                  <Switch checked={twoFactor} onCheckedChange={setTwoFactor} />
                </Row>

                {/* Sessions */}
                <div className="rounded-lg border p-3">
                  <Row justify="between" align="center" className="mb-2">
                    <Text size="sm" weight="medium">Active sessions</Text>
                    {sessionList.length > 1 && (
                      <button 
                        onClick={() => setSessionList((s) => s.filter((x) => x.current))}
                        className="text-xs text-rose-600 dark:text-rose-400 hover:underline"
                      >
                        Sign out all others
                      </button>
                    )}
                  </Row>
                  <Stack gap="xs">
                    {sessionList.map((s) => (
                      <Row key={s.id} justify="between" align="center" className="group py-1">
                        <Row gap="sm" align="center">
                          <s.icon className="h-4 w-4 text-muted-foreground" />
                          <Stack gap="none">
                            <Row gap="sm" align="center">
                              <Text size="sm">{s.device}</Text>
                              {s.current && (
                                <Badge variant="outline" size="sm" className="text-[10px] py-0 text-emerald-600 border-emerald-200 dark:text-emerald-400 dark:border-emerald-800">
                                  This device
                                </Badge>
                              )}
                            </Row>
                            <Text size="xs" variant="muted">{s.location} · {s.time}</Text>
                          </Stack>
                        </Row>
                        {!s.current && (
                          <button
                            onClick={() => revokeSession(s.id)}
                            className="text-xs text-rose-600 dark:text-rose-400 opacity-0 group-hover:opacity-100 hover:underline transition-opacity"
                          >
                            Revoke
                          </button>
                        )}
                      </Row>
                    ))}
                  </Stack>
                </div>
              </Stack>
            </CardContent>
          </Card>
        </div>
      </Stack>
    </Container>
  )
}
