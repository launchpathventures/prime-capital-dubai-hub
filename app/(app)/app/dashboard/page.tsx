/**
 * CATALYST - Dashboard Page
 *
 * Main dashboard showing overview metrics, recent activity, and quick actions.
 * This is the default landing page after authentication.
 */

"use client"

import { config } from "@/lib/config"
import { Container, Stack, Grid, Row, Text, Title } from "@/components/core"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  TrendingUpIcon,
  TrendingDownIcon,
  UsersIcon,
  ActivityIcon,
  DollarSignIcon,
  TargetIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ClockIcon,
  AlertCircleIcon,
} from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <Container size="lg" className="py-6">
      <Stack gap="xl">
        {/* Page Header */}
        <Stack gap="xs">
          <Title size="h3">Dashboard</Title>
          <Text variant="muted">
            Welcome back! Here&apos;s an overview of your application.
          </Text>
        </Stack>

        {/* Metrics Grid */}
        <Grid cols={4} gap="md">
          <MetricCard
            title="Total Users"
            value="2,847"
            change="+12.5%"
            trend="up"
            icon={UsersIcon}
          />
          <MetricCard
            title="Active Sessions"
            value="1,234"
            change="+8.2%"
            trend="up"
            icon={ActivityIcon}
          />
          <MetricCard
            title="Revenue"
            value="$45,231"
            change="-2.4%"
            trend="down"
            icon={DollarSignIcon}
          />
          <MetricCard
            title="Conversion"
            value="3.24%"
            change="+0.8%"
            trend="up"
            icon={TargetIcon}
          />
        </Grid>

        {/* Main Content Grid */}
        <Grid cols={3} gap="md">
          {/* Recent Activity - spans 2 columns */}
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates from your application</CardDescription>
            </CardHeader>
            <CardContent>
              <Stack gap="sm">
                <ActivityItem
                  icon={CheckCircleIcon}
                  iconColor="text-success"
                  title="New user registered"
                  description="john.doe@example.com joined the platform"
                  time="2 minutes ago"
                />
                <ActivityItem
                  icon={ClockIcon}
                  iconColor="text-warning"
                  title="Scheduled maintenance"
                  description="System maintenance planned for tomorrow"
                  time="1 hour ago"
                />
                <ActivityItem
                  icon={AlertCircleIcon}
                  iconColor="text-destructive"
                  title="Payment failed"
                  description="Subscription renewal failed for user #1234"
                  time="3 hours ago"
                />
                <ActivityItem
                  icon={CheckCircleIcon}
                  iconColor="text-success"
                  title="Feature deployed"
                  description="New dashboard analytics released"
                  time="5 hours ago"
                />
              </Stack>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent>
              <Stack gap="sm">
                <Button variant="outline" className="justify-start w-full" nativeButton={false} render={<Link href="/app/approach" />}>
                  <TargetIcon className="h-4 w-4" />
                  Learn Approach
                </Button>
                <Button variant="outline" className="justify-start w-full" nativeButton={false} render={<Link href="/app/components" />}>
                  <ActivityIcon className="h-4 w-4" />
                  Explore Components
                </Button>
                <Button variant="outline" className="justify-start w-full" nativeButton={false} render={<Link href="/app/settings" />}>
                  <UsersIcon className="h-4 w-4" />
                  Manage Settings
                </Button>
                <Button variant="outline" className="justify-start w-full" nativeButton={false} render={<Link href="/docs" />}>
                  <ArrowRightIcon className="h-4 w-4" />
                  View Documentation
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Project Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Project Progress</CardTitle>
            <CardDescription>Track the status of ongoing initiatives</CardDescription>
          </CardHeader>
          <CardContent>
            <Stack gap="lg">
              <ProjectProgress
                name="Authentication System"
                progress={100}
                status="completed"
              />
              <ProjectProgress
                name="Dashboard Analytics"
                progress={75}
                status="in-progress"
              />
              <ProjectProgress
                name="API Integration"
                progress={45}
                status="in-progress"
              />
              <ProjectProgress
                name="Mobile Optimization"
                progress={20}
                status="in-progress"
              />
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  )
}

// =============================================================================
// Helper Components
// =============================================================================

function MetricCard({
  title,
  value,
  change,
  trend,
  icon: Icon,
}: {
  title: string
  value: string
  change: string
  trend: "up" | "down"
  icon: React.ElementType
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <Row gap="xs" className="items-center mt-1">
          {trend === "up" ? (
            <TrendingUpIcon className="h-3 w-3 text-success" />
          ) : (
            <TrendingDownIcon className="h-3 w-3 text-destructive" />
          )}
          <Text
            size="xs"
            className={trend === "up" ? "text-success" : "text-destructive"}
          >
            {change}
          </Text>
          <Text size="xs" variant="muted">from last month</Text>
        </Row>
      </CardContent>
    </Card>
  )
}

function ActivityItem({
  icon: Icon,
  iconColor,
  title,
  description,
  time,
}: {
  icon: React.ElementType
  iconColor: string
  title: string
  description: string
  time: string
}) {
  return (
    <Row gap="sm" className="items-start py-2 border-b last:border-0">
      <div className="mt-0.5">
        <Icon className={`h-4 w-4 ${iconColor}`} />
      </div>
      <Stack gap="none" className="flex-1 min-w-0">
        <Text size="sm" weight="medium">{title}</Text>
        <Text size="xs" variant="muted" className="truncate">{description}</Text>
      </Stack>
      <Text size="xs" variant="muted" className="shrink-0">{time}</Text>
    </Row>
  )
}

function ProjectProgress({
  name,
  progress,
  status,
}: {
  name: string
  progress: number
  status: "completed" | "in-progress" | "not-started"
}) {
  const statusConfig = {
    completed: { label: "Completed", variant: "default" as const },
    "in-progress": { label: "In Progress", variant: "secondary" as const },
    "not-started": { label: "Not Started", variant: "outline" as const },
  }

  const { label, variant } = statusConfig[status]

  return (
    <Stack gap="sm">
      <Row className="justify-between items-center">
        <Text size="sm" weight="medium">{name}</Text>
        <Badge variant={variant}>{label}</Badge>
      </Row>
      <Progress value={progress} className="h-2" />
    </Stack>
  )
}
