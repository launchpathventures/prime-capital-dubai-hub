/**
 * CATALYST - Analytics Example
 *
 * Demonstrates a client-ready analytics dashboard with:
 * - Date range selector and KPI metric cards
 * - Primary trend chart with period comparison
 * - Supporting bar and pie charts
 * - Top performers data table
 *
 * Uses recharts via @/components/vendor/charts
 */

"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Container, Row, Stack, Grid, Text, Title } from "@/components/core"
import { ExamplePrompt, getExample } from "../../_surface"

const example = getExample("analytics")!
import {
  AreaChart,
  PieChart,
  type ChartConfig,
} from "@/components/vendor/charts"
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  ResponsiveContainer,
  LabelList,
} from "recharts"
import {
  TrendingUpIcon,
  UsersIcon,
  TargetIcon,
  DollarSignIcon,
  ActivityIcon,
  DownloadIcon,
  PackageIcon,
  BarChart3Icon,
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// =============================================================================
// TYPES
// =============================================================================

type DateRange = "7d" | "30d" | "90d" | "custom"

interface MetricCard {
  title: string
  value: string
  change: number
  changeLabel: string
  icon: React.ElementType
}

// =============================================================================
// MOCK DATA
// =============================================================================

const dateRanges: { label: string; value: DateRange }[] = [
  { label: "Last 7 days", value: "7d" },
  { label: "Last 30 days", value: "30d" },
  { label: "Last 90 days", value: "90d" },
  { label: "Custom", value: "custom" },
]

// Metric cards data
const metricsData: MetricCard[] = [
  {
    title: "Total Visitors",
    value: "45,231",
    change: 12.5,
    changeLabel: "vs last period",
    icon: UsersIcon,
  },
  {
    title: "Conversions",
    value: "2,847",
    change: 8.2,
    changeLabel: "vs last period",
    icon: TargetIcon,
  },
  {
    title: "Revenue",
    value: "$128,430",
    change: -3.1,
    changeLabel: "vs last period",
    icon: DollarSignIcon,
  },
  {
    title: "Bounce Rate",
    value: "42.3%",
    change: -5.4,
    changeLabel: "lower is better",
    icon: ActivityIcon,
  },
]

// Trend chart data (daily for 30 days)
const trendData = [
  { date: "Nov 25", visitors: 1320, previousVisitors: 1080 },
  { date: "Nov 26", visitors: 1280, previousVisitors: 1120 },
  { date: "Nov 27", visitors: 1420, previousVisitors: 1050 },
  { date: "Nov 28", visitors: 1580, previousVisitors: 1240 },
  { date: "Nov 29", visitors: 1790, previousVisitors: 1320 },
  { date: "Nov 30", visitors: 1550, previousVisitors: 1280 },
  { date: "Dec 1", visitors: 1420, previousVisitors: 1180 },
  { date: "Dec 2", visitors: 1380, previousVisitors: 1220 },
  { date: "Dec 3", visitors: 1520, previousVisitors: 1150 },
  { date: "Dec 4", visitors: 1680, previousVisitors: 1340 },
  { date: "Dec 5", visitors: 1890, previousVisitors: 1420 },
  { date: "Dec 6", visitors: 1650, previousVisitors: 1380 },
  { date: "Dec 7", visitors: 1420, previousVisitors: 1290 },
  { date: "Dec 8", visitors: 1580, previousVisitors: 1350 },
  { date: "Dec 9", visitors: 1720, previousVisitors: 1410 },
  { date: "Dec 10", visitors: 1850, previousVisitors: 1480 },
  { date: "Dec 11", visitors: 2010, previousVisitors: 1520 },
  { date: "Dec 12", visitors: 1920, previousVisitors: 1590 },
  { date: "Dec 13", visitors: 1780, previousVisitors: 1450 },
  { date: "Dec 14", visitors: 1650, previousVisitors: 1380 },
  { date: "Dec 15", visitors: 1720, previousVisitors: 1420 },
  { date: "Dec 16", visitors: 1890, previousVisitors: 1510 },
  { date: "Dec 17", visitors: 2050, previousVisitors: 1620 },
  { date: "Dec 18", visitors: 2180, previousVisitors: 1710 },
  { date: "Dec 19", visitors: 2020, previousVisitors: 1650 },
  { date: "Dec 20", visitors: 1850, previousVisitors: 1520 },
  { date: "Dec 21", visitors: 1680, previousVisitors: 1380 },
  { date: "Dec 22", visitors: 1590, previousVisitors: 1340 },
  { date: "Dec 23", visitors: 1720, previousVisitors: 1450 },
  { date: "Dec 24", visitors: 1950, previousVisitors: 1580 },
]

const trendConfig = {
  visitors: {
    label: "Current Period",
    color: "hsl(221 83% 53%)", // Vibrant blue
  },
  previousVisitors: {
    label: "Previous Period",
    color: "hsl(280 65% 75%)", // Light purple - more distinct
  },
} satisfies ChartConfig

// Traffic sources data - sorted by visitors descending
const sourcesData = [
  { name: "Organic Search", visitors: 18420, fill: "hsl(221 83% 53%)" },
  { name: "Direct Traffic", visitors: 12850, fill: "hsl(160 60% 45%)" },
  { name: "Social Media", visitors: 8340, fill: "hsl(280 65% 60%)" },
  { name: "Referral", visitors: 4120, fill: "hsl(35 90% 55%)" },
  { name: "Email", visitors: 1501, fill: "hsl(350 70% 55%)" },
]

// Device distribution data
const deviceData = [
  { device: "desktop", value: 58, fill: "var(--color-desktop)" },
  { device: "mobile", value: 32, fill: "var(--color-mobile)" },
  { device: "tablet", value: 10, fill: "var(--color-tablet)" },
]

const deviceConfig = {
  value: { label: "Percentage" },
  desktop: { label: "Desktop", color: "hsl(221 83% 53%)" },
  mobile: { label: "Mobile", color: "hsl(160 60% 45%)" },
  tablet: { label: "Tablet", color: "hsl(280 65% 60%)" },
} satisfies ChartConfig

// Top pages data
const topPagesData = [
  { page: "/products", visitors: 8420, conversions: 342, rate: "4.1%" },
  { page: "/pricing", visitors: 6180, conversions: 289, rate: "4.7%" },
  { page: "/features", visitors: 5340, conversions: 198, rate: "3.7%" },
  { page: "/blog/guide", visitors: 4890, conversions: 156, rate: "3.2%" },
  { page: "/contact", visitors: 3210, conversions: 245, rate: "7.6%" },
]

// =============================================================================
// METRIC CARD COMPONENT
// Follows Dashboard StatCard pattern for consistency
// =============================================================================

function MetricCardComponent({ metric, accentColor }: { metric: MetricCard; accentColor: string }) {
  const isPositive = metric.change > 0
  const isNeutral = metric.change === 0
  // For bounce rate, negative change is good
  const isBounceRate = metric.title === "Bounce Rate"
  const isGood = isBounceRate ? !isPositive : isPositive

  // Convert accentColor to gradient and bg classes
  const gradientMap: Record<string, string> = {
    "hsl(var(--chart-1))": "from-blue-500/10 via-transparent to-transparent",
    "hsl(var(--chart-2))": "from-emerald-500/10 via-transparent to-transparent",
    "hsl(var(--chart-3))": "from-orange-500/10 via-transparent to-transparent",
    "hsl(var(--chart-4))": "from-violet-500/10 via-transparent to-transparent",
  }
  const iconBgMap: Record<string, string> = {
    "hsl(var(--chart-1))": "bg-blue-100 dark:bg-blue-900/30",
    "hsl(var(--chart-2))": "bg-emerald-100 dark:bg-emerald-900/30",
    "hsl(var(--chart-3))": "bg-orange-100 dark:bg-orange-900/30",
    "hsl(var(--chart-4))": "bg-violet-100 dark:bg-violet-900/30",
  }
  const iconColorMap: Record<string, string> = {
    "hsl(var(--chart-1))": "text-blue-600 dark:text-blue-400",
    "hsl(var(--chart-2))": "text-emerald-600 dark:text-emerald-400",
    "hsl(var(--chart-3))": "text-orange-600 dark:text-orange-400",
    "hsl(var(--chart-4))": "text-violet-600 dark:text-violet-400",
  }

  const gradient = gradientMap[accentColor] || "from-primary/10 via-transparent to-transparent"
  const iconBg = iconBgMap[accentColor] || "bg-muted"
  const iconColor = iconColorMap[accentColor] || "text-muted-foreground"

  return (
    <Card className="analytics-metric group relative overflow-hidden hover:shadow-lg transition-shadow">
      {/* Soft gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} pointer-events-none`} />
      
      <CardHeader className="relative pb-2">
        <Row justify="between">
          <CardDescription className="text-sm font-medium">{metric.title}</CardDescription>
          <div className={`size-9 flex items-center justify-center rounded-full ${iconBg} ${iconColor} transition-transform group-hover:scale-110`}>
            <metric.icon className="h-4 w-4" />
          </div>
        </Row>
        <CardTitle className="text-3xl font-bold tracking-tight">{metric.value}</CardTitle>
      </CardHeader>
      
      <CardContent className="relative pt-0">
        <Row gap="xs" align="center" className={`text-sm ${isGood ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
          {!isNeutral && (
            <TrendingUpIcon className={`h-3.5 w-3.5 ${!isGood ? "rotate-180" : ""}`} />
          )}
          <Text inline weight="medium" size="sm">{isPositive ? "+" : ""}{metric.change}%</Text>
          <Text inline variant="muted" size="sm">{metric.changeLabel}</Text>
        </Row>
      </CardContent>
    </Card>
  )
}

// Accent colors for metric cards
const metricAccentColors = [
  "hsl(var(--chart-1))", // Visitors - blue/cyan
  "hsl(var(--chart-2))", // Conversions - green
  "hsl(var(--chart-3))", // Revenue - orange
  "hsl(var(--chart-4))", // Bounce Rate - pink
]

// =============================================================================
// MAIN PAGE
// =============================================================================

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState<DateRange>("30d")

  return (
    <Container size="2xl" className="analytics-layout">
      <Stack gap="lg">
        {/* Prompt */}
        <ExamplePrompt summary={example.summary}>
          {example.prompt}
          <Card className="mt-4 p-3 bg-muted/50 border-dashed">
            <Row gap="sm" align="center">
              <PackageIcon className="h-4 w-4 text-muted-foreground shrink-0" />
              <Text size="sm" variant="muted">
                Uses{" "}
                <a href="/docs/components/vendor/charts" className="text-primary hover:underline">recharts</a>{" "}
                for charts — see <code className="bg-background px-1 rounded text-xs">components/vendor/charts.tsx</code>
              </Text>
            </Row>
          </Card>
        </ExamplePrompt>

        {/* Header with Date Range Selector */}
        <Card className="analytics-header bg-gradient-to-r from-orange-500/[0.06] via-orange-500/[0.02] to-transparent animate-in fade-in slide-in-from-top-2 duration-500">
          <CardContent className="py-4">
            <Row gap="lg" align="center" justify="between" className="flex-wrap gap-y-4">
              {/* Left: Icon + Title/Subtitle */}
              <Row gap="md" align="center">
                <div className="flex size-11 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30">
                  <BarChart3Icon className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <Stack gap="none">
                  <Title size="h3">Analytics</Title>
                  <Text size="sm" variant="muted">
                    Track your key metrics and performance
                  </Text>
                </Stack>
              </Row>
              
              {/* Right: Date Selector + Export */}
              <Row gap="sm" align="center">
                <Select 
                  items={dateRanges}
                  value={dateRange} 
                  onValueChange={(v) => setDateRange(v as DateRange)}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Select range..." />
                  </SelectTrigger>
                  <SelectContent>
                    {dateRanges.map((range) => (
                      <SelectItem key={range.value} value={range.value}>
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <DownloadIcon className="h-4 w-4" />
                  Export
                </Button>
              </Row>
            </Row>
          </CardContent>
        </Card>

        {/* Metric Cards */}
        <Grid cols={4} gap="md" className="analytics-metrics">
          {metricsData.map((metric, index) => (
            <MetricCardComponent 
              key={metric.title} 
              metric={metric} 
              accentColor={metricAccentColors[index]} 
            />
          ))}
        </Grid>

        {/* Main Trend Chart - Full Width */}
        <Card className="analytics-trend relative overflow-hidden">
          {/* Subtle gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.03] via-transparent to-transparent pointer-events-none" />
          <CardHeader className="relative">
            <Row gap="sm" align="center" justify="between" className="flex-wrap">
              <div>
                <CardTitle>Visitor Trends</CardTitle>
                <Text size="sm" variant="muted">Daily visitors compared to previous period</Text>
              </div>
              <Row gap="sm">
                <Badge variant="outline" className="gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "hsl(221 83% 53%)" }} />
                  Current Period
                </Badge>
                <Badge variant="outline" className="gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "hsl(280 65% 75%)" }} />
                  Previous Period
                </Badge>
              </Row>
            </Row>
          </CardHeader>
          <CardContent className="relative">
            <AreaChart
              key={`trend-${dateRange}`}
              data={trendData}
              config={trendConfig}
              xKey="date"
              dataKeys={["visitors", "previousVisitors"]}
              showLegend={false}
              className="h-[350px]"
            />
          </CardContent>
        </Card>

        {/* Supporting Charts Row */}
        <Grid cols={2} gap="md" className="analytics-supporting">
          {/* Traffic Sources - Horizontal Bar Chart with recharts */}
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/[0.03] via-transparent to-transparent pointer-events-none" />
            <CardHeader className="relative">
              <Row align="center" justify="between">
                <div>
                  <CardTitle>Traffic Sources</CardTitle>
                  <Text size="sm" variant="muted">Where your visitors come from</Text>
                </div>
                <Badge variant="secondary" size="sm">Top 5</Badge>
              </Row>
            </CardHeader>
            <CardContent className="relative h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart
                  key={`sources-${dateRange}`}
                  data={sourcesData}
                  layout="vertical"
                  margin={{ top: 0, right: 50, bottom: 0, left: 0 }}
                  barCategoryGap="20%"
                >
                  <XAxis type="number" hide />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 13, fill: "hsl(var(--foreground))" }}
                    width={85}
                  />
                  <Bar 
                    dataKey="visitors" 
                    radius={[0, 6, 6, 0]}
                    animationDuration={800}
                    animationEasing="ease-out"
                  >
                    {sourcesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                    <LabelList 
                      dataKey="visitors" 
                      position="right" 
                      formatter={(value: number) => value.toLocaleString()}
                      style={{ fontSize: 12, fontWeight: 500, fill: "hsl(var(--muted-foreground))" }}
                    />
                  </Bar>
                </RechartsBarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Device Distribution Pie Chart */}
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.03] via-transparent to-transparent pointer-events-none" />
            <CardHeader className="relative">
              <Row align="center" justify="between">
                <div>
                  <CardTitle>Device Distribution</CardTitle>
                  <Text size="sm" variant="muted">Breakdown by device type</Text>
                </div>
                <Row gap="xs">
                  <Badge variant="outline" size="sm" className="gap-1">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: "hsl(221 83% 53%)" }} />
                    58%
                  </Badge>
                  <Badge variant="outline" size="sm" className="gap-1">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: "hsl(160 60% 45%)" }} />
                    32%
                  </Badge>
                  <Badge variant="outline" size="sm" className="gap-1">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: "hsl(280 65% 60%)" }} />
                    10%
                  </Badge>
                </Row>
              </Row>
            </CardHeader>
            <CardContent className="relative">
              <PieChart
                key={`device-${dateRange}`}
                data={deviceData}
                config={deviceConfig}
                dataKey="value"
                nameKey="device"
                innerRadius={55}
                className="h-[280px]"
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Top Pages Table */}
        <Card className="analytics-table">
          <CardHeader>
            <Row align="center" justify="between">
              <div>
                <CardTitle>Top Pages</CardTitle>
                <Text size="sm" variant="muted">Best performing pages by visitor count</Text>
              </div>
              <Button variant="link" size="sm" className="text-primary">View All →</Button>
            </Row>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead className="pl-4 rounded-l-lg w-[40%]">Page</TableHead>
                  <TableHead className="text-right">Visitors</TableHead>
                  <TableHead className="text-right">Conversions</TableHead>
                  <TableHead className="text-right">Conv. Rate</TableHead>
                  <TableHead className="text-right pr-4 rounded-r-lg w-[120px]">Performance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topPagesData.map((page, index) => {
                  const rate = parseFloat(page.rate)
                  const isHigh = rate > 4.5
                  const isMedium = rate > 3.5 && rate <= 4.5
                  // Performance bar width based on visitors (relative to max)
                  const maxVisitors = Math.max(...topPagesData.map(p => p.visitors))
                  const performancePercent = (page.visitors / maxVisitors) * 100
                  return (
                    <TableRow key={page.page}>
                      <TableCell className="pl-4">
                        <div className="flex items-center gap-2">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-medium">
                            {index + 1}
                          </span>
                          <span className="font-medium">{page.page}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium tabular-nums">
                        {page.visitors.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">{page.conversions}</TableCell>
                      <TableCell className="text-right">
                        <Badge 
                          variant={isHigh ? "default" : isMedium ? "secondary" : "outline"} 
                          size="sm"
                          className={isHigh ? "bg-emerald-600 hover:bg-emerald-600" : ""}
                        >
                          {page.rate}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right pr-4">
                        <div className="flex items-center justify-end gap-2">
                          <div className="h-2 w-20 overflow-hidden rounded-full bg-muted">
                            <div 
                              className="h-full rounded-full transition-all"
                              style={{ 
                                width: `${performancePercent}%`,
                                backgroundColor: isHigh 
                                  ? "hsl(160 60% 45%)" 
                                  : isMedium 
                                    ? "hsl(221 83% 53%)" 
                                    : "hsl(280 65% 60%)"
                              }}
                            />
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  )
}
