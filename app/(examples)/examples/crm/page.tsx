/**
 * CATALYST - CRM Example
 *
 * Demonstrates a two-column CRM layout with:
 * - Searchable/filterable customer list with avatars and status badges
 * - Customer detail panel with contact info, activity timeline, and actions
 *
 * All data is mock/demo. Uses design tokens throughout.
 */

"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Container, Grid, Row, Stack, Text, Title, Avatar, Count } from "@/components/core"
import { ExamplePrompt, getExample } from "../../_surface"

const example = getExample("crm")!
import {
  SearchIcon,
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  GlobeIcon,
  EditIcon,
  ArchiveIcon,
  FileTextIcon,
  ClockIcon,
  UserPlusIcon,
  MessageSquareIcon,
  CalendarIcon,
  CheckCircle2Icon,
  UsersIcon,
} from "lucide-react"

// =============================================================================
// TYPES
// =============================================================================

type CustomerStatus = "active" | "inactive" | "lead"

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  company: string
  role: string
  location: string
  website: string
  status: CustomerStatus
  pipelineValue: number
  notes: string
  lastContact: string
  activities: Activity[]
}

interface Activity {
  id: string
  type: "email" | "call" | "meeting" | "note"
  description: string
  time: string
}

// =============================================================================
// MOCK DATA
// =============================================================================

const customers: Customer[] = [
  {
    id: "1",
    name: "Sarah Chen",
    email: "sarah.chen@techcorp.com",
    phone: "+1 (555) 123-4567",
    company: "TechCorp Industries",
    role: "VP of Engineering",
    location: "San Francisco, CA",
    website: "techcorp.com",
    status: "active",
    pipelineValue: 125000,
    notes: "Key decision maker for enterprise deals. Prefers technical discussions. Follow up on Q1 proposal.",
    lastContact: "2 hours ago",
    activities: [
      { id: "a1", type: "email", description: "Sent proposal follow-up", time: "2 hours ago" },
      { id: "a2", type: "call", description: "Discovery call - discussed requirements", time: "2 days ago" },
      { id: "a3", type: "meeting", description: "Initial demo presentation", time: "1 week ago" },
      { id: "a4", type: "note", description: "Added to enterprise pipeline", time: "2 weeks ago" },
    ],
  },
  {
    id: "2",
    name: "Marcus Johnson",
    email: "marcus.j@innovate.io",
    phone: "+1 (555) 234-5678",
    company: "Innovate.io",
    role: "CTO",
    location: "Austin, TX",
    website: "innovate.io",
    status: "active",
    pipelineValue: 89000,
    notes: "Interested in API integrations. Technical buyer. Needs security compliance docs.",
    lastContact: "1 day ago",
    activities: [
      { id: "b1", type: "call", description: "Technical deep dive on API", time: "1 day ago" },
      { id: "b2", type: "email", description: "Sent security documentation", time: "3 days ago" },
      { id: "b3", type: "meeting", description: "Product demo with team", time: "1 week ago" },
    ],
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    email: "emily.r@growthstart.com",
    phone: "+1 (555) 345-6789",
    company: "GrowthStart",
    role: "Head of Operations",
    location: "New York, NY",
    website: "growthstart.com",
    status: "lead",
    pipelineValue: 45000,
    notes: "Early stage startup. Budget constraints but high growth potential. Exploring options.",
    lastContact: "3 days ago",
    activities: [
      { id: "c1", type: "email", description: "Sent pricing options", time: "3 days ago" },
      { id: "c2", type: "call", description: "Initial discovery call", time: "1 week ago" },
    ],
  },
  {
    id: "4",
    name: "David Kim",
    email: "david.kim@enterprise-sol.com",
    phone: "+1 (555) 456-7890",
    company: "Enterprise Solutions Ltd",
    role: "Director of IT",
    location: "Seattle, WA",
    website: "enterprise-sol.com",
    status: "active",
    pipelineValue: 210000,
    notes: "Large enterprise deal. Multi-year contract potential. Procurement process is lengthy.",
    lastContact: "5 hours ago",
    activities: [
      { id: "d1", type: "meeting", description: "Quarterly business review", time: "5 hours ago" },
      { id: "d2", type: "email", description: "Contract renewal discussion", time: "2 days ago" },
      { id: "d3", type: "call", description: "Support escalation resolved", time: "1 week ago" },
      { id: "d4", type: "note", description: "Upgraded to enterprise tier", time: "3 weeks ago" },
    ],
  },
  {
    id: "5",
    name: "Rachel Foster",
    email: "rachel.f@designhub.co",
    phone: "+1 (555) 567-8901",
    company: "DesignHub Co",
    role: "Creative Director",
    location: "Los Angeles, CA",
    website: "designhub.co",
    status: "inactive",
    pipelineValue: 0,
    notes: "Churned 2 months ago. Budget cuts. May revisit next fiscal year.",
    lastContact: "2 months ago",
    activities: [
      { id: "e1", type: "call", description: "Exit interview conducted", time: "2 months ago" },
      { id: "e2", type: "email", description: "Cancellation confirmation", time: "2 months ago" },
    ],
  },
  {
    id: "6",
    name: "James Wilson",
    email: "james.w@fintechpro.com",
    phone: "+1 (555) 678-9012",
    company: "FinTech Pro",
    role: "CEO",
    location: "Chicago, IL",
    website: "fintechpro.com",
    status: "lead",
    pipelineValue: 175000,
    notes: "Hot lead from conference. Very interested in compliance features. Fast decision maker.",
    lastContact: "4 hours ago",
    activities: [
      { id: "f1", type: "email", description: "Sent compliance overview", time: "4 hours ago" },
      { id: "f2", type: "meeting", description: "Met at FinTech Summit", time: "3 days ago" },
    ],
  },
  {
    id: "7",
    name: "Amanda Price",
    email: "amanda.p@retailmax.com",
    phone: "+1 (555) 789-0123",
    company: "RetailMax",
    role: "VP of Digital",
    location: "Denver, CO",
    website: "retailmax.com",
    status: "active",
    pipelineValue: 67000,
    notes: "Expanding digital presence. Looking for omnichannel solutions. Q2 implementation timeline.",
    lastContact: "1 day ago",
    activities: [
      { id: "g1", type: "call", description: "Implementation planning", time: "1 day ago" },
      { id: "g2", type: "email", description: "Sent integration docs", time: "4 days ago" },
      { id: "g3", type: "meeting", description: "Stakeholder alignment", time: "2 weeks ago" },
    ],
  },
  {
    id: "8",
    name: "Michael Torres",
    email: "m.torres@healthplus.org",
    phone: "+1 (555) 890-1234",
    company: "HealthPlus",
    role: "IT Manager",
    location: "Boston, MA",
    website: "healthplus.org",
    status: "lead",
    pipelineValue: 52000,
    notes: "Healthcare sector. HIPAA compliance critical. Long sales cycle expected.",
    lastContact: "1 week ago",
    activities: [
      { id: "h1", type: "email", description: "Sent HIPAA compliance docs", time: "1 week ago" },
      { id: "h2", type: "call", description: "Initial requirements gathering", time: "2 weeks ago" },
    ],
  },
]

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function getStatusColor(status: CustomerStatus) {
  switch (status) {
    case "active":
      return "default"
    case "inactive":
      return "secondary"
    case "lead":
      return "outline"
  }
}

function getActivityIcon(type: Activity["type"]) {
  switch (type) {
    case "email":
      return { icon: MailIcon, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950" }
    case "call":
      return { icon: PhoneIcon, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950" }
    case "meeting":
      return { icon: CalendarIcon, color: "text-violet-500", bg: "bg-violet-50 dark:bg-violet-950" }
    case "note":
      return { icon: FileTextIcon, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-950" }
  }
}

// =============================================================================
// CUSTOMER LIST ITEM
// =============================================================================

interface CustomerListItemProps {
  customer: Customer
  isSelected: boolean
  onClick: () => void
}

function CustomerListItem({ customer, isSelected, onClick }: CustomerListItemProps) {
  return (
    <button
      onClick={onClick}
      className={`crm-customer-item w-full text-left p-4 border-b border-border transition-colors hover:bg-muted/50 ${
        isSelected ? "crm-customer-item--selected bg-muted border-l-2 border-l-primary" : ""
      }`}
    >
      <Row gap="md" align="center" className="crm-customer-item__content">
        <Avatar name={customer.name} size="md" />
        <Stack gap="xs" className="flex-1 min-w-0">
          <Row gap="sm" align="center">
            <Text weight="medium" className="truncate">{customer.name}</Text>
            <Badge variant={getStatusColor(customer.status)} className="capitalize shrink-0">
              {customer.status}
            </Badge>
          </Row>
          <Text size="sm" variant="muted" className="truncate">
            {customer.company} • {customer.role}
          </Text>
        </Stack>
      </Row>
    </button>
  )
}

// =============================================================================
// CUSTOMER DETAIL PANEL
// =============================================================================

interface CustomerDetailProps {
  customer: Customer
}

function CustomerDetail({ customer }: CustomerDetailProps) {
  return (
    <Stack gap="lg" className="crm-detail">
      {/* Header Card */}
      <Card className="crm-detail__header">
        <CardContent>
          <Stack gap="md">
            <Row gap="md" align="center" className="crm-detail__profile">
              <Avatar name={customer.name} size="lg" />
              <Stack gap="xs">
                <Row gap="sm" align="center" wrap>
                  <Title size="h4">{customer.name}</Title>
                  <Badge variant={getStatusColor(customer.status)} className="capitalize">
                    {customer.status}
                  </Badge>
                </Row>
                <Text size="sm" variant="muted">
                  {customer.role} at {customer.company}
                </Text>
                {customer.pipelineValue > 0 && (
                  <Text size="sm" weight="medium" className="text-emerald-600 dark:text-emerald-400">
                    ${customer.pipelineValue.toLocaleString()} pipeline value
                  </Text>
                )}
              </Stack>
            </Row>
            {/* Action Buttons */}
            <Row gap="sm" wrap className="crm-detail__actions">
              <Button size="sm">
                <MailIcon className="h-4 w-4 mr-2" />
                Email
              </Button>
              <Button variant="outline" size="sm">
                <PhoneIcon className="h-4 w-4 mr-2" />
                Call
              </Button>
              <Button variant="outline" size="sm">
                <EditIcon className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="outline" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10 hover:border-destructive/50">
                <ArchiveIcon className="h-4 w-4 mr-2" />
                Archive
              </Button>
            </Row>
          </Stack>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card className="crm-detail__contact">
        <CardHeader className="pb-0">
          <Row gap="sm" align="center">
            <UsersIcon className="h-4 w-4 text-primary" />
            <CardTitle className="text-base">Contact Information</CardTitle>
          </Row>
        </CardHeader>
        <CardContent>
          <div className="crm-detail__contact-grid grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Stack gap="xs">
              <Text size="xs" variant="muted">Email</Text>
              <Row gap="sm" align="center">
                <MailIcon className="h-3.5 w-3.5 text-muted-foreground" />
                <Text size="sm">{customer.email}</Text>
              </Row>
            </Stack>
            <Stack gap="xs">
              <Text size="xs" variant="muted">Phone</Text>
              <Row gap="sm" align="center">
                <PhoneIcon className="h-3.5 w-3.5 text-muted-foreground" />
                <Text size="sm">{customer.phone}</Text>
              </Row>
            </Stack>
            <Stack gap="xs">
              <Text size="xs" variant="muted">Location</Text>
              <Row gap="sm" align="center">
                <MapPinIcon className="h-3.5 w-3.5 text-muted-foreground" />
                <Text size="sm">{customer.location}</Text>
              </Row>
            </Stack>
            <Stack gap="xs">
              <Text size="xs" variant="muted">Website</Text>
              <Row gap="sm" align="center">
                <GlobeIcon className="h-3.5 w-3.5 text-muted-foreground" />
                <Text size="sm">{customer.website}</Text>
              </Row>
            </Stack>
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      <Card className="crm-detail__notes">
        <CardHeader className="pb-0">
          <Row justify="between" align="center">
            <Row gap="sm" align="center">
              <FileTextIcon className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">Notes</CardTitle>
            </Row>
            <Button variant="link" size="sm">
              <EditIcon className="h-4 w-4 mr-1" />
              Edit
            </Button>
          </Row>
        </CardHeader>
        <CardContent>
          <Text size="sm" variant="muted">{customer.notes}</Text>
        </CardContent>
      </Card>

      {/* Activity Timeline */}
      <Card className="crm-detail__activity">
        <CardHeader className="pb-0">
          <Row justify="between" align="center">
            <Row gap="sm" align="center">
              <ClockIcon className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">Recent Activity</CardTitle>
            </Row>
            <Text size="sm" variant="muted">Last contact: {customer.lastContact}</Text>
          </Row>
        </CardHeader>
        <CardContent>
          <div className="crm-detail__timeline relative">
            {/* Vertical connecting line */}
            <div className="crm-detail__timeline-line absolute left-4 top-4 bottom-4 w-px bg-border" />
            <Stack gap="md">
              {customer.activities.map((activity, index) => {
                const { icon: Icon, color, bg } = getActivityIcon(activity.type)
                return (
                  <Row key={activity.id} gap="md" align="start" className="crm-detail__timeline-item relative">
                    <div className={`shrink-0 w-8 h-8 rounded-full ${bg} flex items-center justify-center z-10`}>
                      <Icon className={`h-4 w-4 ${color}`} />
                    </div>
                    <Stack gap="xs" className="flex-1 min-w-0 pt-1">
                      <Text size="sm">{activity.description}</Text>
                      <Text size="xs" variant="muted">{activity.time}</Text>
                    </Stack>
                  </Row>
                )
              })}
            </Stack>
          </div>
        </CardContent>
      </Card>
    </Stack>
  )
}

// =============================================================================
// EMPTY STATE
// =============================================================================

function EmptyState() {
  return (
    <Card className="crm-empty h-full min-h-[400px] flex items-center justify-center">
      <Stack gap="md" align="center" className="text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
          <UserPlusIcon className="h-8 w-8 text-muted-foreground" />
        </div>
        <Stack gap="xs">
          <Title size="h5">Select a customer</Title>
          <Text variant="muted">
            Choose a customer from the list to view their details
          </Text>
        </Stack>
      </Stack>
    </Card>
  )
}

// =============================================================================
// MAIN PAGE
// =============================================================================

export default function CRMPage() {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>("1")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | CustomerStatus>("all")

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      // Search filter
      const matchesSearch =
        searchQuery === "" ||
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase())

      // Status filter
      const matchesStatus = statusFilter === "all" || customer.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [searchQuery, statusFilter])

  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId)

  return (
    <Container size="2xl" className="crm-layout">
      <Stack gap="lg">
        {/* Prompt */}
        <ExamplePrompt summary={example.summary}>
          {example.prompt}
        </ExamplePrompt>

        {/* Header */}
        <Card className="crm-header bg-gradient-to-r from-emerald-500/[0.06] via-emerald-500/[0.02] to-transparent animate-in fade-in slide-in-from-top-2 duration-500">
          <CardContent className="py-4">
            <Row gap="lg" align="center" justify="between" className="flex-wrap gap-y-4">
              <Row gap="md" align="center">
                <div className="flex size-11 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                  <UsersIcon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <Stack gap="none">
                  <Title size="h3">CRM</Title>
                  <Text size="sm" variant="muted">
                    Manage your customer relationships
                  </Text>
                </Stack>
              </Row>
              <Button size="sm">
                <UserPlusIcon className="h-4 w-4 mr-1.5" />
                Add Customer
              </Button>
            </Row>
          </CardContent>
        </Card>

        {/* CRM Grid - Two columns */}
        <div className="crm-grid grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6">
          {/* Left: Customer List - wrapper lets card fill grid cell height */}
          <div className="crm-sidebar-wrapper relative min-h-[400px]">
            <Card className="crm-sidebar lg:absolute lg:inset-0 flex flex-col overflow-hidden">
              {/* Header with title */}
              <div className="crm-sidebar__header px-4 pb-4 border-b border-border shrink-0">
              <Stack gap="sm">
                <Row gap="sm" align="center">
                  <Title size="h5">All Customers</Title>
                  <Count value={filteredCustomers.length} />
                </Row>
                <Row gap="sm">
                  <div className="flex-1">
                    <Input
                      placeholder="Search customers..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onClear={() => setSearchQuery("")}
                      startIcon={<SearchIcon className="h-4 w-4" />}
                      clearable
                    />
                  </div>
                  <Select
                    value={statusFilter}
                    onValueChange={(value) => setStatusFilter(value as typeof statusFilter)}
                  >
                    <SelectTrigger className="w-28">
                      <SelectValue>
                        {statusFilter === "all" ? "All" : 
                         statusFilter === "active" ? "Active" : 
                         statusFilter === "inactive" ? "Inactive" : "Lead"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="lead">Lead</SelectItem>
                    </SelectContent>
                  </Select>
                </Row>
              </Stack>
            </div>

            {/* Customer List */}
            <ScrollArea className="crm-sidebar__list flex-1 min-h-0">
              <div>
                {filteredCustomers.map((customer) => (
                  <CustomerListItem
                    key={customer.id}
                    customer={customer}
                    isSelected={customer.id === selectedCustomerId}
                    onClick={() => setSelectedCustomerId(customer.id)}
                  />
                ))}
                {filteredCustomers.length === 0 && (
                  <div className="p-8 text-center">
                    <Text variant="muted">No customers found</Text>
                  </div>
                )}
              </div>
            </ScrollArea>
          </Card>
          </div>

          {/* Right: Customer Detail */}
          <div className="crm-main">
            {selectedCustomer ? (
              <CustomerDetail customer={selectedCustomer} />
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
      </Stack>
    </Container>
  )
}
