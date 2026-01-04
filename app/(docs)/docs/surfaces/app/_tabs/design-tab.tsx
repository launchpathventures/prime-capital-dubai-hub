/**
 * CATALYST - App Surface Design Tab
 *
 * A living showcase of App surface design patterns.
 * Top: single summary card with all design guidance
 * Below: realistic app sections as they'd appear in production
 */

"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Stack, Text, Title, Row, Avatar, Dot, Prose } from "@/components/core"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardAction, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { StatCard } from "@/components/shared"
import {
  DollarSignIcon,
  UsersIcon,
  ShoppingCartIcon,
  ZapIcon,
  PlusIcon,
  FilterIcon,
  DownloadIcon,
  MailIcon,
  BellIcon,
  UserIcon,
  CheckCircle2Icon,
  XCircleIcon,
  AlertCircleIcon,
  SearchIcon,
  RefreshCwIcon,
  CalendarIcon,
  FileTextIcon,
  ImageIcon,
  LinkIcon,
  StarIcon,
  ArchiveIcon,
  TrashIcon,
  MoreHorizontalIcon,
} from "lucide-react"

// =============================================================================
// MOCK DATA
// =============================================================================

const recentOrders = [
  { id: "ORD-7891", customer: "Sarah Chen", status: "Completed", amount: "$234.00", date: "Dec 30, 2024" },
  { id: "ORD-7890", customer: "Marcus Johnson", status: "Processing", amount: "$1,250.00", date: "Dec 30, 2024" },
  { id: "ORD-7889", customer: "Emily Davis", status: "Pending", amount: "$89.00", date: "Dec 29, 2024" },
  { id: "ORD-7888", customer: "Alex Rivera", status: "Completed", amount: "$432.00", date: "Dec 29, 2024" },
]

const teamMembers = [
  { name: "Sarah Chen", role: "Product Lead", initials: "SC", status: "online", gradient: "emerald" as const },
  { name: "Marcus Johnson", role: "Senior Developer", initials: "MJ", status: "online", gradient: "blue" as const },
  { name: "Emily Davis", role: "Designer", initials: "ED", status: "away", gradient: "violet" as const },
  { name: "Alex Rivera", role: "Developer", initials: "AR", status: "online", gradient: "amber" as const },
]

const activityItems = [
  { icon: CheckCircle2Icon, color: "text-emerald-500", text: "Order #7891 completed", time: "2m ago" },
  { icon: UserIcon, color: "text-blue-500", text: "New user signed up", time: "15m ago" },
  { icon: AlertCircleIcon, color: "text-amber-500", text: "Low inventory: Widget Pro", time: "1h ago" },
  { icon: DollarSignIcon, color: "text-emerald-500", text: "Payment received: $1,250", time: "2h ago" },
]

const dateRangeItems = [
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
]

const listItems = [
  { id: 1, title: "Q4 Planning Document", type: "Document", icon: FileTextIcon, starred: true, date: "Dec 28" },
  { id: 2, title: "Brand Assets Package", type: "Folder", icon: ImageIcon, starred: false, date: "Dec 27" },
  { id: 3, title: "API Documentation", type: "Link", icon: LinkIcon, starred: true, date: "Dec 25" },
  { id: 4, title: "Customer Feedback Report", type: "Document", icon: FileTextIcon, starred: false, date: "Dec 24" },
]

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function DesignTab() {
  const [emailNotif, setEmailNotif] = useState(true)
  const [pushNotif, setPushNotif] = useState(false)
  const [marketingNotif, setMarketingNotif] = useState(true)
  const [dateRange, setDateRange] = useState("30d")
  const [selectedItems, setSelectedItems] = useState<number[]>([])

  const toggleItem = (id: number) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  return (
    <article>
      <Stack gap="xl">
        {/* ================================================================= */}
        {/* SUMMARY CARD — All design guidance in one place */}
        {/* ================================================================= */}
        <div className="border-primary bg-primary/5 rounded-lg border-l-4 p-5 space-y-4">
          <div>
            <p className="text-lg font-medium leading-snug">App Surface Design</p>
            <p className="text-muted-foreground mt-1">Guidelines for building consistent, productive interfaces</p>
          </div>

          {/* Core message */}
          <p className="leading-relaxed">
            The App surface prioritizes <strong>density</strong>, <strong>clarity</strong>, and{" "}
            <strong>consistency</strong>. Every page should feel operational — not decorative.
            Show more data with less scrolling, keep navigation visible, and make actions obvious.
          </p>

          {/* Principles */}
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            {[
              { label: "Dense", desc: "More data, less scrolling" },
              { label: "Consistent", desc: "Predictable patterns" },
              { label: "Actionable", desc: "Clear next steps" },
              { label: "Minimal", desc: "No decoration" },
            ].map((p) => (
              <div key={p.label} className="rounded-md border bg-background p-2.5">
                <Text size="sm" weight="medium">{p.label}</Text>
                <Text size="xs" variant="muted">{p.desc}</Text>
              </div>
            ))}
          </div>

          {/* Do / Don't */}
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-md border bg-background p-3">
              <Row gap="sm" className="mb-2 items-center">
                <CheckCircle2Icon className="h-4 w-4 text-emerald-600" />
                <Text size="sm" weight="medium">Do</Text>
              </Row>
              <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">
                <li>Use cards to group related content</li>
                <li>Keep navigation visible at all times</li>
                <li>Show loading states for async data</li>
                <li>Use consistent button hierarchy</li>
              </ul>
            </div>
            <div className="rounded-md border bg-background p-3">
              <Row gap="sm" className="mb-2 items-center">
                <XCircleIcon className="h-4 w-4 text-red-600" />
                <Text size="sm" weight="medium">Don&apos;t</Text>
              </Row>
              <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">
                <li>Add hero sections or large imagery</li>
                <li>Hide navigation on desktop</li>
                <li>Use marketing-style CTAs</li>
                <li>Mix competing visual styles</li>
              </ul>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* ANALYTICS SECTION */}
        {/* ================================================================= */}
        <section>
          <Row className="mb-4 items-end justify-between">
            <Stack gap="xs">
              <Title size="h3">Analytics</Title>
              <Text size="sm" variant="muted">Track your key metrics and performance</Text>
            </Stack>
            <Select items={dateRangeItems} value={dateRange} onValueChange={(v) => v && setDateRange(v)}>
              <SelectTrigger className="w-40">
                <CalendarIcon className="h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {dateRangeItems.map((item) => (
                  <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Row>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard label="Revenue" value="$52,840" trend="up" trendText="+12.5%" icon={<DollarSignIcon className="h-4 w-4" />} />
            <StatCard label="Users" value="1,284" trend="up" trendText="+8.2%" icon={<UsersIcon className="h-4 w-4" />} />
            <StatCard label="Orders" value="542" trend="down" trendText="-3.1%" icon={<ShoppingCartIcon className="h-4 w-4" />} />
            <StatCard label="Conversion" value="3.2%" trend="neutral" trendText="No change" icon={<ZapIcon className="h-4 w-4" />} />
          </div>
        </section>

        {/* ================================================================= */}
        {/* SEARCH / HEADER BAR */}
        {/* ================================================================= */}
        <section className="rounded-lg border bg-card p-4">
          <Row className="items-center justify-between flex-wrap gap-4">
            <Row gap="sm" className="items-center">
              <Input placeholder="Search..." startIcon={<SearchIcon />} className="w-64" />
              <Button variant="outline" size="sm">
                <FilterIcon className="h-4 w-4" />
                Filters
              </Button>
            </Row>
            <Row gap="sm">
              <Button variant="outline" size="sm">
                <DownloadIcon className="h-4 w-4" />
                Export
              </Button>
              <Button size="sm">
                <PlusIcon className="h-4 w-4" />
                Create New
              </Button>
            </Row>
          </Row>
        </section>

        {/* ================================================================= */}
        {/* ORDERS TABLE */}
        {/* ================================================================= */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Review and manage incoming orders</CardDescription>
            <CardAction>
              <Row gap="sm">
                <Button variant="outline" size="sm"><FilterIcon className="h-4 w-4" />Filter</Button>
                <Button variant="outline" size="sm"><DownloadIcon className="h-4 w-4" />Export</Button>
              </Row>
            </CardAction>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell className="text-muted-foreground">{order.date}</TableCell>
                    <TableCell>
                      <Badge variant={order.status === "Completed" ? "default" : order.status === "Processing" ? "secondary" : "outline"} size="sm">
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{order.amount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="border-t bg-muted/30 justify-between">
            <Text size="sm" variant="muted">Showing 4 of 542 orders</Text>
            <Button variant="ghost" size="sm">View all →</Button>
          </CardFooter>
        </Card>

        {/* ================================================================= */}
        {/* TEAM + ACTIVITY */}
        {/* ================================================================= */}
        <section className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Team</CardTitle>
              <CardDescription>4 members online</CardDescription>
              <CardAction>
                <Button variant="outline" size="sm"><PlusIcon className="h-4 w-4" />Invite</Button>
              </CardAction>
            </CardHeader>
            <CardContent>
              <Stack gap="sm">
                {teamMembers.map((member) => (
                  <Row key={member.name} gap="sm" className="items-center">
                    <Avatar size="sm" initials={member.initials} gradient={member.gradient} />
                    <Stack gap="none" className="flex-1">
                      <Text size="sm" weight="medium">{member.name}</Text>
                      <Text size="xs" variant="muted">{member.role}</Text>
                    </Stack>
                    <Dot color={member.status === "online" ? "success" : "warning"} />
                  </Row>
                ))}
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Activity</CardTitle>
              <CardDescription>Recent events</CardDescription>
              <CardAction>
                <Button variant="ghost" size="icon-sm"><RefreshCwIcon className="h-4 w-4" /></Button>
              </CardAction>
            </CardHeader>
            <CardContent>
              <Stack gap="sm">
                {activityItems.map((item, i) => (
                  <Row key={i} gap="sm" className="items-start">
                    <item.icon className={cn("h-4 w-4 mt-0.5 shrink-0", item.color)} />
                    <Stack gap="none" className="flex-1">
                      <Text size="sm">{item.text}</Text>
                      <Text size="xs" variant="muted">{item.time}</Text>
                    </Stack>
                  </Row>
                ))}
              </Stack>
            </CardContent>
            <CardFooter className="border-t bg-muted/30">
              <Button variant="ghost" size="sm" className="w-full">View all activity</Button>
            </CardFooter>
          </Card>
        </section>

        {/* ================================================================= */}
        {/* TABS EXAMPLE */}
        {/* ================================================================= */}
        <Card>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
            <CardDescription>Manage your project settings and content</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="files">Files</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="mt-4">
                <Stack gap="md">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-lg border p-4">
                      <Text size="xs" variant="muted" className="uppercase tracking-wide">Status</Text>
                      <Row gap="sm" className="mt-1 items-center">
                        <Dot color="success" />
                        <Text weight="medium">Active</Text>
                      </Row>
                    </div>
                    <div className="rounded-lg border p-4">
                      <Text size="xs" variant="muted" className="uppercase tracking-wide">Due Date</Text>
                      <Text weight="medium" className="mt-1">January 15, 2025</Text>
                    </div>
                  </div>
                  <div className="rounded-lg border p-4">
                    <Text size="xs" variant="muted" className="uppercase tracking-wide">Description</Text>
                    <Text size="sm" className="mt-1">
                      This project involves redesigning the customer dashboard with improved analytics, 
                      better navigation, and enhanced data visualization capabilities.
                    </Text>
                  </div>
                </Stack>
              </TabsContent>
              <TabsContent value="files" className="mt-4">
                <Text size="sm" variant="muted">12 files attached to this project.</Text>
              </TabsContent>
              <TabsContent value="settings" className="mt-4">
                <Text size="sm" variant="muted">Project settings and permissions.</Text>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* ================================================================= */}
        {/* LIST WITH ACTIONS */}
        {/* ================================================================= */}
        <Card>
          <CardHeader>
            <CardTitle>Resources</CardTitle>
            <CardDescription>Documents and links for your team</CardDescription>
            <CardAction>
              <Button size="sm"><PlusIcon className="h-4 w-4" />Add Resource</Button>
            </CardAction>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {listItems.map((item) => (
                <Row key={item.id} className="items-center gap-4 px-4 py-3 hover:bg-muted/50 transition-colors">
                  <input 
                    type="checkbox" 
                    checked={selectedItems.includes(item.id)}
                    onChange={() => toggleItem(item.id)}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <item.icon className="h-4 w-4 text-muted-foreground shrink-0" />
                  <Stack gap="none" className="flex-1 min-w-0">
                    <Text size="sm" weight="medium" truncate>{item.title}</Text>
                    <Text size="xs" variant="muted">{item.type}</Text>
                  </Stack>
                  <Text size="xs" variant="muted" className="hidden sm:block">{item.date}</Text>
                  <Button variant="ghost" size="icon-xs" className={item.starred ? "text-amber-500" : ""}>
                    <StarIcon className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon-xs">
                    <MoreHorizontalIcon className="h-4 w-4" />
                  </Button>
                </Row>
              ))}
            </div>
          </CardContent>
          {selectedItems.length > 0 && (
            <CardFooter className="border-t bg-muted/30 justify-between">
              <Text size="sm" variant="muted">{selectedItems.length} selected</Text>
              <Row gap="sm">
                <Button variant="outline" size="sm"><ArchiveIcon className="h-4 w-4" />Archive</Button>
                <Button variant="outline" size="sm" className="text-destructive"><TrashIcon className="h-4 w-4" />Delete</Button>
              </Row>
            </CardFooter>
          )}
        </Card>

        {/* ================================================================= */}
        {/* SETTINGS SECTION */}
        {/* ================================================================= */}
        <section>
          <Row className="mb-4 items-end justify-between">
            <Stack gap="xs">
              <Title size="h3">Settings</Title>
              <Text size="sm" variant="muted">Manage your account preferences</Text>
            </Stack>
          </Row>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <Row gap="sm" className="items-center">
                  <BellIcon className="h-4 w-4 text-muted-foreground" />
                  <CardTitle>Notifications</CardTitle>
                </Row>
              </CardHeader>
              <CardContent>
                <Stack gap="md">
                  <Row className="items-center justify-between">
                    <Stack gap="none">
                      <Text size="sm" weight="medium">Email notifications</Text>
                      <Text size="xs" variant="muted">Important updates via email</Text>
                    </Stack>
                    <Switch checked={emailNotif} onCheckedChange={setEmailNotif} />
                  </Row>
                  <Row className="items-center justify-between">
                    <Stack gap="none">
                      <Text size="sm" weight="medium">Push notifications</Text>
                      <Text size="xs" variant="muted">Browser alerts for activity</Text>
                    </Stack>
                    <Switch checked={pushNotif} onCheckedChange={setPushNotif} />
                  </Row>
                  <Row className="items-center justify-between">
                    <Stack gap="none">
                      <Text size="sm" weight="medium">Marketing emails</Text>
                      <Text size="xs" variant="muted">Product news and updates</Text>
                    </Stack>
                    <Switch checked={marketingNotif} onCheckedChange={setMarketingNotif} />
                  </Row>
                </Stack>
              </CardContent>
            </Card>

            <Card className="pb-0">
              <CardHeader>
                <Row gap="sm" className="items-center">
                  <UserIcon className="h-4 w-4 text-muted-foreground" />
                  <CardTitle>Profile</CardTitle>
                </Row>
              </CardHeader>
              <CardContent>
                <Stack gap="md">
                  <Stack gap="xs">
                    <Text size="sm" weight="medium">Display name</Text>
                    <Input defaultValue="Sarah Chen" />
                  </Stack>
                  <Stack gap="xs">
                    <Text size="sm" weight="medium">Email address</Text>
                    <Input defaultValue="sarah@acme.com" startIcon={<MailIcon />} />
                  </Stack>
                </Stack>
              </CardContent>
              <CardFooter className="border-t bg-muted/30">
                <Row className="w-full justify-end" gap="sm">
                  <Button variant="outline">Cancel</Button>
                  <Button>Save changes</Button>
                </Row>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* ================================================================= */}
        {/* PROSE / CONTENT BLOCK */}
        {/* ================================================================= */}
        <Card>
          <CardHeader>
            <CardTitle>Documentation</CardTitle>
            <CardDescription>Getting started with the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <Prose size="sm">
              <h4>Introduction</h4>
              <p>
                Welcome to the platform documentation. This guide will help you understand the core
                concepts and get started with building your first project. We&apos;ve designed every
                feature with productivity in mind.
              </p>
              <h4>Key Concepts</h4>
              <ul>
                <li><strong>Workspaces</strong> — Organize your projects and teams in dedicated spaces</li>
                <li><strong>Dashboards</strong> — Monitor metrics and KPIs at a glance</li>
                <li><strong>Automation</strong> — Set up workflows to handle repetitive tasks</li>
              </ul>
              <p>
                For more detailed information, visit our{" "}
                <a href="#" className="text-primary hover:underline">full documentation</a> or reach
                out to our support team.
              </p>
            </Prose>
          </CardContent>
        </Card>

      </Stack>
    </article>
  )
}
