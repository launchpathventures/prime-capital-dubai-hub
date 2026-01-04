/**
 * CATALYST - Dashboard Example
 *
 * Demonstrates a complete SaaS dashboard with:
 * - Stat cards with icons, values, trends, progress bars
 * - Performance overview with mini charts
 * - Recent activity timeline
 * - Interactive task list with checkboxes
 * - Team members grid
 * - Recent orders table
 *
 * All data is mock/demo. Uses design tokens throughout.
 */

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Container, Grid, Row, Stack, Text, Title, Dot, Avatar, Count, Center, List } from "@/components/core"
import { ExamplePrompt, getExample } from "../../_surface"

const example = getExample("dashboard")!
import {
  DollarSignIcon,
  UsersIcon,
  ShoppingCartIcon,
  ZapIcon,
  TrendingUpIcon,
  CalendarIcon,
  PlusIcon,
  FlameIcon,
  MoreVerticalIcon,
  ClockIcon,
  CheckCircle2Icon,
  UserPlusIcon,
  AlertCircleIcon,
  CreditCardIcon,
  FileTextIcon,
  DownloadIcon,
  EyeIcon,
  RefreshCwIcon,
  Share2Icon,
  PrinterIcon,
  LayoutDashboardIcon,
} from "lucide-react"

// =============================================================================
// MOCK DATA
// =============================================================================

const stats = [
  {
    label: "Total Revenue",
    value: "$52,840",
    icon: DollarSignIcon,
    trend: { value: 12.5, direction: "up" as const },
    progress: { current: 52840, goal: 68000 },
    gradient: "from-emerald-500/10 via-transparent to-transparent",
    accentColor: "bg-emerald-500",
    iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
  {
    label: "Active Users",
    value: "1,284",
    icon: UsersIcon,
    trend: { value: 8.2, direction: "up" as const },
    progress: { current: 1284, goal: 2000 },
    gradient: "from-blue-500/10 via-transparent to-transparent",
    accentColor: "bg-blue-500",
    iconBg: "bg-blue-100 dark:bg-blue-900/30",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    label: "Total Orders",
    value: "542",
    icon: ShoppingCartIcon,
    trend: { value: 24, direction: "up" as const },
    progress: { current: 542, goal: 600 },
    gradient: "from-violet-500/10 via-transparent to-transparent",
    accentColor: "bg-violet-500",
    iconBg: "bg-violet-100 dark:bg-violet-900/30",
    iconColor: "text-violet-600 dark:text-violet-400",
  },
  {
    label: "Conversion Rate",
    value: "3.2%",
    icon: ZapIcon,
    trend: { value: 0.8, direction: "up" as const },
    progress: null,
    gradient: "from-amber-500/20 via-amber-500/5 to-transparent",
    accentColor: "bg-amber-500",
    iconBg: "bg-amber-100 dark:bg-amber-900/30",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
]

const activities = [
  {
    id: 1,
    icon: UserPlusIcon,
    dotColor: "success" as const,
    title: "New user registered",
    description: "Sarah Chen",
    time: "2 min ago",
  },
  {
    id: 2,
    icon: CheckCircle2Icon,
    dotColor: "info" as const,
    title: "Order #1234 completed",
    description: "System",
    time: "15 min ago",
  },
  {
    id: 3,
    icon: AlertCircleIcon,
    dotColor: "warning" as const,
    title: "Low inventory alert",
    description: "System",
    time: "1 hour ago",
  },
  {
    id: 4,
    icon: CreditCardIcon,
    dotColor: "success" as const,
    title: "Payment received",
    description: "Mike Johnson",
    time: "2 hours ago",
  },
  {
    id: 5,
    icon: FileTextIcon,
    dotColor: "primary" as const,
    title: "Report generated",
    description: "Emily Davis",
    time: "3 hours ago",
  },
  {
    id: 6,
    icon: UserPlusIcon,
    dotColor: "violet" as const,
    title: "Team member invited",
    description: "Alex Thompson",
    time: "4 hours ago",
  },
]

const initialTasks = [
  { id: 1, title: "Review Q4 marketing budget", priority: "high" as const, completed: false },
  { id: 2, title: "Prepare client presentation", priority: "high" as const, completed: true },
  { id: 3, title: "Update documentation", priority: "medium" as const, completed: false },
  { id: 4, title: "Team standup meeting", priority: "low" as const, completed: true },
  { id: 5, title: "Code review for PR #142", priority: "medium" as const, completed: false },
]

const teamMembers = [
  { id: 1, name: "Sarah Chen", role: "Product Lead", tasks: 12 },
  { id: 2, name: "Mike Johnson", role: "Developer", tasks: 8 },
  { id: 3, name: "Emily Davis", role: "Designer", tasks: 5 },
  { id: 4, name: "Alex Thompson", role: "Developer", tasks: 15 },
  { id: 5, name: "Jordan Lee", role: "QA Engineer", tasks: 9 },
]

const orders = [
  { id: "ORD-001", customer: "Sarah Chen", product: "Enterprise Plan", amount: 2400, status: "completed" as const, time: "2 min ago" },
  { id: "ORD-002", customer: "Mike Johnson", product: "Pro Plan", amount: 799, status: "processing" as const, time: "15 min ago" },
  { id: "ORD-003", customer: "Emily Davis", product: "Starter Pack", amount: 199, status: "completed" as const, time: "1 hour ago" },
  { id: "ORD-004", customer: "Alex Thompson", product: "Enterprise Plan", amount: 2400, status: "pending" as const, time: "2 hours ago" },
  { id: "ORD-005", customer: "Lisa Wang", product: "Pro Plan", amount: 799, status: "completed" as const, time: "3 hours ago" },
]

// =============================================================================
// STAT CARD COMPONENT
// =============================================================================

interface StatCardProps {
  label: string
  value: string
  icon: React.ComponentType<{ className?: string }>
  trend: { value: number; direction: "up" | "down" }
  progress: { current: number; goal: number } | null
  gradient: string
  accentColor: string
  iconBg: string
  iconColor: string
}

function StatCard({ label, value, icon: Icon, trend, progress, gradient, accentColor, iconBg, iconColor }: StatCardProps) {
  const progressPercent = progress ? Math.round((progress.current / progress.goal) * 100) : 0
  
  return (
    <Card className="relative overflow-hidden group hover:shadow-lg transition-shadow">
      {/* Soft gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} pointer-events-none`} />
      
      <CardHeader className="relative pb-2">
        <Row justify="between">
          <CardDescription className="text-sm font-medium">{label}</CardDescription>
          <Center className={`size-9 rounded-full ${iconBg} ${iconColor} transition-transform group-hover:scale-110`}>
            <Icon className="h-4 w-4" />
          </Center>
        </Row>
        <CardTitle className="text-3xl font-bold tracking-tight">{value}</CardTitle>
      </CardHeader>
      
      <CardContent className="relative">
        <Stack gap="sm">
          {progress && (
            <Stack gap="xs">
              <Row justify="between" className="text-xs text-muted-foreground">
                <Text inline size="xs">Progress</Text>
                <Text inline size="xs">{progress.goal.toLocaleString()} goal</Text>
              </Row>
              <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${accentColor} rounded-full transition-all duration-500`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </Stack>
          )}
          <Row gap="xs" className={`text-sm ${trend.direction === "up" ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
            <TrendingUpIcon className={`h-3.5 w-3.5 ${trend.direction === "down" ? "rotate-180" : ""}`} />
            <Text inline weight="medium">{trend.value}%</Text>
            <Text inline variant="muted">from last month</Text>
          </Row>
        </Stack>
      </CardContent>
    </Card>
  )
}

// =============================================================================
// MINI CHART COMPONENTS
// =============================================================================

function MiniBarChart({ data, label, sublabel }: { data: number[]; label: string; sublabel?: string }) {
  const max = Math.max(...data)
  return (
    <Stack gap="md" className="bg-gradient-to-b from-primary/2 to-primary/10 rounded-2xl p-5">
      <Text size="sm" weight="medium" align="center">{label}</Text>
      <Row gap="xs" align="end" justify="center" className="h-24">
        {data.map((value, i) => (
          <div
            key={i}
            className="w-6 bg-gradient-to-t from-primary/80 to-primary rounded-t transition-all hover:opacity-80"
            style={{ height: `${(value / max) * 100}%` }}
          />
        ))}
      </Row>
      {sublabel && (
        <Text size="xs" variant="muted" align="center">{sublabel}</Text>
      )}
    </Stack>
  )
}

function MiniDonutChart({ percent, label }: { percent: number; label: string }) {
  const circumference = 2 * Math.PI * 36
  const strokeDashoffset = circumference - (percent / 100) * circumference

  return (
    <Stack align="center" justify="center" className="py-2">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="36"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-muted/15"
          />
          <circle
            cx="50"
            cy="50"
            r="36"
            fill="none"
            stroke="#14b8a6"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <Stack gap="none" align="center" justify="center" className="absolute inset-0">
          <Text size="2xl" weight="bold">{percent}%</Text>
          <Text size="xs" variant="muted" className="text-[10px]">of goal</Text>
        </Stack>
      </div>
      <Text size="sm" weight="medium" className="mt-2">{label}</Text>
    </Stack>
  )
}

function MiniLineChart({ data, label, sublabel }: { data: number[]; label: string; sublabel?: string }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  
  return (
    <Stack gap="md" className="bg-gradient-to-b from-secondary/5 to-secondary/15 rounded-2xl p-5">
      <Text size="sm" weight="medium" align="center">{label}</Text>
      <Row gap="xs" align="end" justify="center" className="h-24">
        {data.map((value, i) => (
          <div
            key={i}
            className="w-5 bg-gradient-to-t from-teal-600 to-teal-400 rounded-t transition-all hover:opacity-80"
            style={{ height: `${((value - min) / range) * 80 + 20}%` }}
          />
        ))}
      </Row>
      {sublabel && (
        <Text size="xs" variant="muted" align="center">{sublabel}</Text>
      )}
    </Stack>
  )
}

// =============================================================================
// PRIORITY BADGE
// =============================================================================

function PriorityBadge({ priority }: { priority: "high" | "medium" | "low" }) {
  const styles = {
    high: "bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800",
    medium: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800",
    low: "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700",
  }

  return (
    <Text inline size="xs" weight="medium" className={`rounded-md border px-2 py-0.5 ${styles[priority]}`}>
      {priority}
    </Text>
  )
}

// =============================================================================
// ORDER STATUS BADGE
// =============================================================================

function OrderStatusBadge({ status }: { status: "completed" | "processing" | "pending" }) {
  const styles = {
    completed: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
    processing: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800",
    pending: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800",
  }

  return (
    <Text inline size="xs" weight="medium" className={`rounded-md border px-2 py-0.5 ${styles[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Text>
  )
}

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export default function DashboardExamplePage() {
  const [tasks, setTasks] = useState(initialTasks)

  const toggleTask = (taskId: number) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ))
  }

  const completedCount = tasks.filter(t => t.completed).length
  const completionPercent = Math.round((completedCount / tasks.length) * 100)

  // Sample chart data
  const weeklyData = [35, 52, 48, 65, 58, 72, 68]
  const growthData = [120, 145, 138, 162, 175, 190, 210]

  return (
    <Container size="2xl" className="dashboard-layout">
      <Stack gap="md">
      {/* Prompt */}
      <ExamplePrompt summary={example.summary}>
        {example.prompt}
      </ExamplePrompt>

      {/* Header */}
      <Card className="dashboard-header bg-gradient-to-r from-blue-500/[0.06] via-blue-500/[0.02] to-transparent animate-in fade-in slide-in-from-top-2 duration-500">
        <CardContent className="py-4">
          <Row gap="lg" align="center" justify="between" className="flex-wrap gap-y-4">
            {/* Left: Icon + Title/Subtitle */}
            <Row gap="md" align="center">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30">
                <LayoutDashboardIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <Stack gap="none">
                <Title size="h3">Dashboard</Title>
                <Text size="sm" variant="muted">
                  Overview of your business metrics and activity
                </Text>
              </Stack>
            </Row>
            
            {/* Right: Date + New Report */}
            <Row gap="sm" align="center">
              <Button variant="outline" size="sm">
                <CalendarIcon className="h-4 w-4 mr-1.5" />
                This Month
              </Button>
              <Button size="sm">
                <PlusIcon className="h-4 w-4 mr-1.5" />
                New Report
              </Button>
            </Row>
          </Row>
        </CardContent>
      </Card>

      {/* Stat Cards */}
      <Grid cols={4} gap="md" className="dashboard-stats">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </Grid>

      {/* Performance Overview + Activity */}
      <Grid cols={3} gap="lg" className="dashboard-performance">
        {/* Performance Overview */}
        <Card className="dashboard-performance__chart lg:col-span-2">
          <CardHeader className="border-b">
            <Row gap="sm" align="center">
              <FlameIcon className="h-5 w-5 text-orange-500" />
              <CardTitle>Performance Overview</CardTitle>
            </Row>
            <CardAction>
              <DropdownMenu>
                <DropdownMenuTrigger render={<Button variant="ghost" size="sm" />}>
                  <MoreVerticalIcon className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" sideOffset={8}>
                  <DropdownMenuItem>
                    <RefreshCwIcon className="h-4 w-4" />
                    Refresh
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <DownloadIcon className="h-4 w-4" />
                    Export
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Share2Icon className="h-4 w-4" />
                    Share
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <PrinterIcon className="h-4 w-4" />
                    Print
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardAction>
          </CardHeader>
          <CardContent className="pt-4 pb-0">
            <Grid cols={3} gap="lg">
              <MiniBarChart data={weeklyData} label="Weekly Sales" sublabel="Mon → Sun" />
              <MiniDonutChart percent={78} label="Monthly Target" />
              <MiniLineChart data={growthData} label="User Growth" sublabel="7 days ago → Today" />
            </Grid>
          </CardContent>
          {/* Quick stats footer */}
          <div className="border-t">
            <div className="grid grid-cols-2 gap-4 px-6 py-4 sm:grid-cols-4 sm:gap-6">
              <Stack gap="xs" align="center">
                <Text size="xs" variant="muted">Avg. Order Value</Text>
                <Text size="2xl" weight="bold" className="text-primary">$ 127.5</Text>
              </Stack>
              <Stack gap="xs" align="center">
                <Text size="xs" variant="muted">Customer Lifetime</Text>
                <Text size="2xl" weight="bold" className="text-teal-600 dark:text-teal-400">$ 847</Text>
              </Stack>
              <Stack gap="xs" align="center">
                <Text size="xs" variant="muted">Return Rate</Text>
                <Text size="2xl" weight="bold" className="text-violet-600 dark:text-violet-400">2.4 %</Text>
              </Stack>
              <Stack gap="xs" align="center">
                <Text size="xs" variant="muted">NPS Score</Text>
                <Text size="2xl" weight="bold" className="text-blue-600 dark:text-blue-400">72</Text>
              </Stack>
            </div>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="dashboard-activity">
          <CardHeader className="border-b">
            <Row gap="sm" align="center">
              <ClockIcon className="h-5 w-5 text-primary" />
              <CardTitle>Recent Activity</CardTitle>
            </Row>
            <CardAction>
              <Button variant="link" size="sm" className="text-xs">
                View All
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className="py-3">
            <Stack gap="sm">
            {activities.map((activity) => (
              <Row key={activity.id} gap="sm" align="start">
                <Dot color={activity.dotColor} className="mt-1.5" />
                <Stack gap="xs" className="flex-1 min-w-0">
                  <Text size="sm" weight="medium" leading="tight">{activity.title}</Text>
                  <Text size="xs" variant="muted">
                    {activity.description} • {activity.time}
                  </Text>
                </Stack>
              </Row>
            ))}
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      {/* Tasks + Team */}
      <div className="grid gap-4 lg:grid-cols-2 lg:gap-6 dashboard-tasks-team">
        {/* Tasks */}
        <Card className="dashboard-tasks">
          <CardHeader className="border-b">
            <Row gap="sm" align="center">
              <CheckCircle2Icon className="h-5 w-5 text-primary" />
              <CardTitle>My Tasks</CardTitle>
              <Count value={completedCount} total={tasks.length} />
            </Row>
            <CardAction>
              <Button size="sm">
                <PlusIcon className="h-4 w-4 mr-1" />
                Add
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className="pt-6">
            <Stack gap="md">
              {/* Progress bar */}
              <Stack gap="xs">
                <div className="h-2.5 bg-muted/50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-500"
                    style={{ width: `${completionPercent}%` }}
                  />
                </div>
                <Text size="xs" variant="muted" align="right">{completionPercent}%</Text>
              </Stack>
              
              {/* Task list */}
              <Stack gap="xs">
              {tasks.map((task) => (
                <Row
                  key={task.id}
                  gap="sm"
                  align="center"
                  onClick={() => toggleTask(task.id)}
                  className={`p-3 rounded-lg cursor-pointer transition-all hover:bg-muted/50 ${task.completed ? "opacity-50" : ""}`}
                >
                  <Checkbox 
                    checked={task.completed}
                    onCheckedChange={() => {}}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <Text size="sm" variant={task.completed ? "muted" : "default"} className={`flex-1 ${task.completed ? "line-through" : ""}`}>
                    {task.title}
                  </Text>
                  <PriorityBadge priority={task.priority} />
                </Row>
              ))}
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        {/* Team Members */}
        <Card className="dashboard-team">
          <CardHeader className="border-b">
            <Row gap="sm" align="center">
              <UsersIcon className="h-5 w-5 text-primary" />
              <CardTitle>Team Members</CardTitle>
              <Count value={teamMembers.length} />
            </Row>
            <CardAction>
              <Button variant="link" size="sm" className="text-xs">
                Manage
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className="pt-2 pb-2">
            <Stack gap="none" className="divide-y divide-border">
            {teamMembers.map((member) => (
              <div key={member.id} className="py-1">
                <Row gap="sm" className="py-2 hover:bg-muted/30 -mx-2 px-2 rounded-lg transition-colors">
                  <Avatar name={member.name} />
                  <Stack gap="none" className="flex-1 min-w-0">
                    <Text size="sm" weight="medium">{member.name}</Text>
                    <Text size="xs" variant="muted">{member.role}</Text>
                  </Stack>
                  <Count value={member.tasks} suffix="tasks" className="text-primary" />
                </Row>
              </div>
            ))}
            </Stack>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders - Full width */}
      <Card className="dashboard-orders">
        <CardHeader className="border-b">
          <Row gap="sm" align="center">
            <ShoppingCartIcon className="h-5 w-5 text-primary" />
            <CardTitle>Recent Orders</CardTitle>
          </Row>
          <CardAction>
            <Row gap="sm">
            <Button variant="outline" size="sm">
              <DownloadIcon className="h-4 w-4 mr-1" />
              Export
            </Button>
            <Button size="sm">
              <EyeIcon className="h-4 w-4 mr-1" />
              View All
            </Button>
            </Row>
          </CardAction>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="pl-4 rounded-l-lg">Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Product</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="pr-4 rounded-r-lg">Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id} className="cursor-pointer hover:bg-muted/30">
                  <TableCell className="pl-4 font-mono text-sm">{order.id}</TableCell>
                  <TableCell>
                    <Row gap="sm">
                      <Avatar name={order.customer} size="sm" />
                      <Text size="sm">{order.customer}</Text>
                    </Row>
                  </TableCell>
                  <TableCell>
                    <Text size="sm" variant="muted">{order.product}</Text>
                  </TableCell>
                  <TableCell className="text-right">
                    <Text weight="semibold" className="text-emerald-600 dark:text-emerald-400">
                      ${order.amount.toLocaleString()}
                    </Text>
                  </TableCell>
                  <TableCell>
                    <OrderStatusBadge status={order.status} />
                  </TableCell>
                  <TableCell className="pr-4">
                    <Text size="sm" variant="muted">{order.time}</Text>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      </Stack>
    </Container>
  )
}
