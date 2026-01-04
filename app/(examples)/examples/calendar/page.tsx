/**
 * CATALYST - Calendar Example
 *
 * Events calendar page demonstrating:
 * - Interactive FullCalendar monthly grid
 * - Toggle between Calendar and List views
 * - Event detail popup on click
 * - Add Event dialog with form
 * - Category-based color coding
 * - Dynamic event generation around current date
 *
 * Uses FullCalendar with React integration.
 */

"use client"

import React, { useState, useMemo, useCallback } from "react"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Container, Row, Stack, Text, Title } from "@/components/core"
import { ExamplePrompt, getExample } from "../../_surface"

const example = getExample("calendar")!

import {
  CalendarIcon,
  ListIcon,
  PlusIcon,
  ClockIcon,
  MapPinIcon,
  TagIcon,
  UsersIcon,
  BriefcaseIcon,
  PartyPopperIcon,
  AlertCircleIcon,
  PackageIcon,
} from "lucide-react"

// =============================================================================
// TYPES
// =============================================================================

type EventCategory = "meeting" | "social" | "deadline" | "personal"

interface CalendarEvent {
  id: string
  title: string
  date: Date
  endDate?: Date
  time?: string
  endTime?: string
  location?: string
  description?: string
  category: EventCategory
  allDay?: boolean
}

type ViewMode = "calendar" | "list"

// =============================================================================
// CATEGORY CONFIGURATION
// =============================================================================

const categoryConfig: Record<
  EventCategory,
  {
    label: string
    color: string
    bgColor: string
    icon: typeof UsersIcon
    fcBgColor: string // FullCalendar background color
    fcTextColor: string // FullCalendar text color
  }
> = {
  meeting: {
    label: "Meeting",
    color: "text-blue-700 dark:text-blue-300",
    bgColor: "bg-blue-100 dark:bg-blue-900/50",
    icon: UsersIcon,
    fcBgColor: "#3b82f6", // blue-500
    fcTextColor: "#ffffff",
  },
  social: {
    label: "Social",
    color: "text-emerald-700 dark:text-emerald-300",
    bgColor: "bg-emerald-100 dark:bg-emerald-900/50",
    icon: PartyPopperIcon,
    fcBgColor: "#10b981", // emerald-500
    fcTextColor: "#ffffff",
  },
  deadline: {
    label: "Deadline",
    color: "text-rose-700 dark:text-rose-300",
    bgColor: "bg-rose-100 dark:bg-rose-900/50",
    icon: AlertCircleIcon,
    fcBgColor: "#f43f5e", // rose-500
    fcTextColor: "#ffffff",
  },
  personal: {
    label: "Personal",
    color: "text-violet-700 dark:text-violet-300",
    bgColor: "bg-violet-100 dark:bg-violet-900/50",
    icon: BriefcaseIcon,
    fcBgColor: "#8b5cf6", // violet-500
    fcTextColor: "#ffffff",
  },
}

// =============================================================================
// MOCK DATA GENERATION
// =============================================================================

function generateEvents(): CalendarEvent[] {
  const today = new Date()
  const events: CalendarEvent[] = []

  // Helper to add/subtract days
  const addDays = (date: Date, days: number) => {
    const result = new Date(date)
    result.setDate(result.getDate() + days)
    return result
  }

  // Sample event templates
  const eventTemplates = [
    // Meetings
    { title: "Team Standup", category: "meeting" as const, time: "09:00", endTime: "09:30", location: "Conference Room A" },
    { title: "Product Review", category: "meeting" as const, time: "14:00", endTime: "15:00", location: "Main Boardroom" },
    { title: "Client Call", category: "meeting" as const, time: "11:00", endTime: "12:00", location: "Zoom" },
    { title: "Sprint Planning", category: "meeting" as const, time: "10:00", endTime: "11:30", location: "Conference Room B" },
    { title: "1:1 with Manager", category: "meeting" as const, time: "15:30", endTime: "16:00", location: "Office 204" },
    // Social
    { title: "Team Lunch", category: "social" as const, time: "12:30", endTime: "13:30", location: "Cafe Nero" },
    { title: "Happy Hour", category: "social" as const, time: "17:00", endTime: "19:00", location: "The Local Pub" },
    { title: "Birthday Celebration", category: "social" as const, time: "15:00", endTime: "16:00", location: "Break Room" },
    { title: "Team Building", category: "social" as const, time: "14:00", endTime: "17:00", location: "Escape Room Downtown" },
    // Deadlines
    { title: "Project Milestone", category: "deadline" as const, allDay: true, description: "Phase 1 deliverables due" },
    { title: "Budget Submission", category: "deadline" as const, time: "17:00", description: "Q2 budget proposal" },
    { title: "Report Due", category: "deadline" as const, time: "09:00", description: "Monthly analytics report" },
    { title: "Contract Renewal", category: "deadline" as const, allDay: true, description: "Vendor agreement renewal" },
    // Personal
    { title: "Dentist Appointment", category: "personal" as const, time: "10:00", endTime: "11:00", location: "City Dental" },
    { title: "Gym Session", category: "personal" as const, time: "07:00", endTime: "08:00", location: "FitLife Gym" },
    { title: "Car Service", category: "personal" as const, time: "08:30", endTime: "10:00", location: "AutoCare Center" },
    { title: "Doctor Checkup", category: "personal" as const, time: "14:00", endTime: "14:30", location: "Medical Center" },
  ]

  // Day offsets for spreading events (some before, some after today)
  const dayOffsets = [-12, -10, -8, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 7, 9, 11, 14, 16, 18, 20, 22, 25]

  // Generate events
  dayOffsets.forEach((offset, index) => {
    const template = eventTemplates[index % eventTemplates.length]
    const eventDate = addDays(today, offset)

    events.push({
      id: `event-${index + 1}`,
      title: template.title,
      date: eventDate,
      time: template.time,
      endTime: template.endTime,
      location: template.location,
      description: template.description || `Details for ${template.title}`,
      category: template.category,
      allDay: template.allDay,
    })
  })

  return events
}

// =============================================================================
// HELPERS
// =============================================================================

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

function formatShortDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })
}

function formatTime(time: string): string {
  const [hours, minutes] = time.split(":")
  const hour = parseInt(hours)
  const ampm = hour >= 12 ? "PM" : "AM"
  const hour12 = hour % 12 || 12
  return `${hour12}:${minutes} ${ampm}`
}

function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

function isToday(date: Date): boolean {
  return isSameDay(date, new Date())
}

function isPast(date: Date): boolean {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const checkDate = new Date(date)
  checkDate.setHours(0, 0, 0, 0)
  return checkDate < today
}

// =============================================================================
// COMPONENTS
// =============================================================================

function EventCard({
  event,
  onClick,
  compact = false,
}: {
  event: CalendarEvent
  onClick: () => void
  compact?: boolean
}) {
  const config = categoryConfig[event.category]
  const CategoryIcon = config.icon
  const eventIsPast = isPast(event.date) && !isToday(event.date)

  if (compact) {
    return (
      <div
        onClick={onClick}
        className={`cursor-pointer rounded px-2 py-1 text-xs font-medium truncate ${config.bgColor} ${config.color} ${eventIsPast ? "opacity-60" : ""}`}
      >
        {event.title}
      </div>
    )
  }

  return (
    <Card
      className={`group cursor-pointer transition-all hover:shadow-md hover:border-primary/30 ${eventIsPast ? "opacity-70 bg-muted/30" : ""}`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <Row gap="md" align="start">
          <div
            className={`shrink-0 size-10 rounded-xl flex items-center justify-center ${config.bgColor}`}
          >
            <CategoryIcon className={`size-5 ${config.color}`} />
          </div>
          <Stack gap="xs" className="flex-1 min-w-0">
            <Text weight="medium" className="line-clamp-1 group-hover:text-primary transition-colors">
              {event.title}
            </Text>
            <Row gap="sm" align="center" className="flex-wrap gap-y-1">
              {event.time && (
                <Row gap="xs" align="center">
                  <ClockIcon className="size-3.5 text-muted-foreground" />
                  <Text size="sm" variant="muted">
                    {formatTime(event.time)}
                    {event.endTime && ` - ${formatTime(event.endTime)}`}
                  </Text>
                </Row>
              )}
              {event.allDay && (
                <Row gap="xs" align="center">
                  <ClockIcon className="size-3.5 text-muted-foreground" />
                  <Text size="sm" variant="muted">
                    All day
                  </Text>
                </Row>
              )}
              {event.location && (
                <Row gap="xs" align="center">
                  <MapPinIcon className="size-3.5 text-muted-foreground" />
                  <Text size="sm" variant="muted" className="line-clamp-1">
                    {event.location}
                  </Text>
                </Row>
              )}
            </Row>
            <Badge
              variant="secondary"
              className={`w-fit text-xs ${config.bgColor} ${config.color} border-0`}
            >
              {config.label}
            </Badge>
          </Stack>
        </Row>
      </CardContent>
    </Card>
  )
}

function EventDetailDialog({
  event,
  open,
  onClose,
}: {
  event: CalendarEvent | null
  open: boolean
  onClose: () => void
}) {
  if (!event) return null

  const config = categoryConfig[event.category]
  const CategoryIcon = config.icon

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-start gap-4">
            <div
              className={`shrink-0 size-12 rounded-xl flex items-center justify-center ${config.bgColor}`}
            >
              <CategoryIcon className={`size-6 ${config.color}`} />
            </div>
            <div className="flex-1 min-w-0 pt-0.5">
              <DialogTitle className="text-xl leading-tight">{event.title}</DialogTitle>
              <DialogDescription className="mt-1.5">
                {formatDate(event.date)}
                {isPast(event.date) && !isToday(event.date) && (
                  <Badge variant="outline" className="ml-2 text-xs">Past</Badge>
                )}
                {isToday(event.date) && (
                  <Badge className="ml-2 text-xs bg-primary text-primary-foreground">Today</Badge>
                )}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Stack gap="md" className="py-4">
          {/* Time */}
          {(event.time || event.allDay) && (
            <Row gap="sm" align="center">
              <div className="size-8 rounded-lg bg-muted flex items-center justify-center">
                <ClockIcon className="size-4 text-muted-foreground" />
              </div>
              <Text>
                {event.allDay
                  ? "All day event"
                  : `${formatTime(event.time!)}${event.endTime ? ` - ${formatTime(event.endTime)}` : ""}`}
              </Text>
            </Row>
          )}

          {/* Location */}
          {event.location && (
            <Row gap="sm" align="center">
              <div className="size-8 rounded-lg bg-muted flex items-center justify-center">
                <MapPinIcon className="size-4 text-muted-foreground" />
              </div>
              <Text>{event.location}</Text>
            </Row>
          )}

          {/* Category */}
          <Row gap="sm" align="center">
            <div className="size-8 rounded-lg bg-muted flex items-center justify-center">
              <TagIcon className="size-4 text-muted-foreground" />
            </div>
            <Badge
              variant="secondary"
              className={`${config.bgColor} ${config.color} border-0`}
            >
              {config.label}
            </Badge>
          </Row>

          {/* Description */}
          {event.description && (
            <div className="pt-3 mt-1 border-t">
              <Text size="sm" variant="muted" className="mb-2 font-medium">
                Description
              </Text>
              <Text className="leading-relaxed">{event.description}</Text>
            </div>
          )}
        </Stack>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function AddEventDialog({
  open,
  onClose,
  onAdd,
  initialDate,
}: {
  open: boolean
  onClose: () => void
  onAdd: (event: CalendarEvent) => void
  initialDate?: Date
}) {
  // Helper to format date as YYYY-MM-DD in local timezone
  const formatDateLocal = (d: Date) => {
    const year = d.getFullYear()
    const month = (d.getMonth() + 1).toString().padStart(2, "0")
    const day = d.getDate().toString().padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  const [title, setTitle] = useState("")
  const [date, setDate] = useState(formatDateLocal(initialDate || new Date()))
  const [time, setTime] = useState("")
  const [endTime, setEndTime] = useState("")

  // Update form when initialDate changes (from clicking calendar)
  React.useEffect(() => {
    if (initialDate) {
      setDate(formatDateLocal(initialDate))
      // Extract time if clicking on a time slot (not midnight = all day)
      const hours = initialDate.getHours()
      const minutes = initialDate.getMinutes()
      if (hours !== 0 || minutes !== 0) {
        const timeStr = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
        setTime(timeStr)
        // Set end time to 1 hour later
        const endHour = Math.min(hours + 1, 23)
        setEndTime(`${endHour.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`)
        setAllDay(false)
      } else {
        setTime("")
        setEndTime("")
      }
    }
  }, [initialDate])
  const [location, setLocation] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState<EventCategory>("meeting")
  const [allDay, setAllDay] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    const newEvent: CalendarEvent = {
      id: `event-${Date.now()}`,
      title: title.trim(),
      date: new Date(date),
      time: allDay ? undefined : time || undefined,
      endTime: allDay ? undefined : endTime || undefined,
      location: location.trim() || undefined,
      description: description.trim() || undefined,
      category,
      allDay,
    }

    onAdd(newEvent)
    resetForm()
    onClose()
  }

  const resetForm = () => {
    setTitle("")
    setDate(formatDateLocal(new Date()))
    setTime("")
    setEndTime("")
    setLocation("")
    setDescription("")
    setCategory("meeting")
    setAllDay(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          resetForm()
          onClose()
        }
      }}
    >
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Event</DialogTitle>
            <DialogDescription>
              Create a new event on your calendar.
            </DialogDescription>
          </DialogHeader>

          <Stack gap="md" className="py-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="Event title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            {/* All Day Toggle */}
            <Row gap="sm" align="center">
              <input
                type="checkbox"
                id="allDay"
                checked={allDay}
                onChange={(e) => setAllDay(e.target.checked)}
                className="size-4 rounded border-input"
              />
              <Label htmlFor="allDay" className="cursor-pointer">
                All day event
              </Label>
            </Row>

            {/* Time (conditional) */}
            {!allDay && (
              <Row gap="md">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="time">Start Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <Label htmlFor="endTime">End Time</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>
              </Row>
            )}

            {/* Category */}
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={category}
                onValueChange={(v) => setCategory(v as EventCategory)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(categoryConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      <Row gap="sm" align="center">
                        <config.icon className="size-4" />
                        {config.label}
                      </Row>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="Add location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Add description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
          </Stack>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!title.trim()}>
              Add Event
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// =============================================================================
// MAIN PAGE
// =============================================================================

export default function CalendarPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("calendar")
  const [events, setEvents] = useState<CalendarEvent[]>(() => generateEvents())
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [showEventDetail, setShowEventDetail] = useState(false)
  const [showAddEvent, setShowAddEvent] = useState(false)
  const [addEventDate, setAddEventDate] = useState<Date | undefined>()

  const handleEventClick = useCallback((event: CalendarEvent) => {
    setSelectedEvent(event)
    setShowEventDetail(true)
  }, [])

  const handleAddEvent = useCallback((event: CalendarEvent) => {
    setEvents((prev) => [...prev, event])
  }, [])

  const handleDateClick = useCallback((date: Date) => {
    setAddEventDate(date)
    setShowAddEvent(true)
  }, [])

  // Convert events to FullCalendar format
  const fullCalendarEvents = useMemo(() => {
    return events.map((event) => ({
      id: event.id,
      title: event.title,
      start: event.time
        ? `${event.date.toISOString().split("T")[0]}T${event.time}`
        : event.date.toISOString().split("T")[0],
      end: event.endTime
        ? `${event.date.toISOString().split("T")[0]}T${event.endTime}`
        : undefined,
      allDay: event.allDay || !event.time,
      backgroundColor: categoryConfig[event.category].fcBgColor,
      borderColor: categoryConfig[event.category].fcBgColor,
      textColor: categoryConfig[event.category].fcTextColor,
      extendedProps: { event },
    }))
  }, [events])

  // Group events by date for list view
  const groupedEvents = useMemo(() => {
    const sorted = [...events].sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    )
    const groups: { date: Date; events: CalendarEvent[] }[] = []

    sorted.forEach((event) => {
      const existingGroup = groups.find((g) => isSameDay(g.date, event.date))
      if (existingGroup) {
        existingGroup.events.push(event)
      } else {
        groups.push({ date: event.date, events: [event] })
      }
    })

    // Sort events within each group by time
    groups.forEach((group) => {
      group.events.sort((a, b) => {
        if (!a.time && !b.time) return 0
        if (!a.time) return -1
        if (!b.time) return 1
        return a.time.localeCompare(b.time)
      })
    })

    return groups
  }, [events])

  return (
    <Container className="calendar-page py-6">
      {/* Prompt */}
      <ExamplePrompt summary={example.summary}>
        {example.prompt}
        <Card className="mt-4 p-3 bg-muted/50 border-dashed">
          <Row gap="sm" align="center">
            <PackageIcon className="h-4 w-4 text-muted-foreground shrink-0" />
            <Text size="sm" variant="muted">
              Uses{" "}
              <a href="https://fullcalendar.io/docs/react" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">FullCalendar</a>{" "}
              for calendar — see <code className="bg-background px-1 rounded text-xs">@fullcalendar/react</code>
            </Text>
          </Row>
        </Card>
      </ExamplePrompt>

      {/* Header */}
      <div className="mt-6">
        <Card className="border-primary/20 bg-gradient-to-r from-primary/[0.06] via-primary/[0.02] to-transparent">
          <CardContent className="py-5">
            <Row
              gap="lg"
              align="center"
              justify="between"
              className="flex-wrap gap-y-4"
            >
              {/* Left: Title */}
              <Row gap="md" align="center">
                <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
                  <CalendarIcon className="size-6 text-primary" />
                </div>
                <Stack gap="none">
                  <Title size="h3">Events Calendar</Title>
                  <Text size="sm" variant="muted">
                    {events.length} events scheduled
                  </Text>
                </Stack>
              </Row>

              {/* Right: View Toggle + Add */}
              <Row gap="md" align="center">
                {/* View Toggle */}
                <div className="flex rounded-lg border bg-muted/50 p-1">
                  <Button
                    variant={viewMode === "calendar" ? "default" : "ghost"}
                    size="sm"
                    className="gap-1.5"
                    onClick={() => setViewMode("calendar")}
                  >
                    <CalendarIcon className="size-4" />
                    Calendar
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    className="gap-1.5"
                    onClick={() => setViewMode("list")}
                  >
                    <ListIcon className="size-4" />
                    List
                  </Button>
                </div>

                {/* Add Event */}
                <Button
                  onClick={() => {
                    setAddEventDate(undefined)
                    setShowAddEvent(true)
                  }}
                  className="gap-1.5"
                >
                  <PlusIcon className="size-4" />
                  Add Event
                </Button>
              </Row>
            </Row>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="mt-6">
        {viewMode === "calendar" ? (
          /* Calendar View */
          <Card className="p-4 sm:p-6 calendar-wrapper overflow-hidden">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay",
              }}
              height="auto"
              dayMaxEvents={3}
              nowIndicator={true}
              eventClick={(info) => {
                const event = info.event.extendedProps.event as CalendarEvent
                handleEventClick(event)
              }}
              dateClick={(info) => {
                handleDateClick(info.date)
              }}
              events={fullCalendarEvents}
            />
          </Card>
        ) : (
          /* List View */
          <Stack gap="lg">
            {groupedEvents.length === 0 ? (
              <Card className="p-12 text-center border-dashed">
                <Stack gap="md" align="center">
                  <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <CalendarIcon className="size-8 text-primary" />
                  </div>
                  <Stack gap="xs" align="center">
                    <Title size="h4">No events scheduled</Title>
                    <Text variant="muted" className="max-w-xs">
                      Create your first event to start organizing your calendar.
                    </Text>
                  </Stack>
                  <Button
                    onClick={() => {
                      setAddEventDate(undefined)
                      setShowAddEvent(true)
                    }}
                    className="mt-2"
                  >
                    <PlusIcon className="size-4 mr-2" />
                    Add Event
                  </Button>
                </Stack>
              </Card>
            ) : (
              groupedEvents.map((group) => (
                <div key={group.date.toISOString()}>
                  {/* Date Header */}
                  <Row gap="md" align="center" className="mb-3">
                    <div
                      className={`shrink-0 size-12 rounded-xl flex flex-col items-center justify-center ${
                        isToday(group.date)
                          ? "bg-primary text-primary-foreground shadow-md"
                          : isPast(group.date)
                          ? "bg-muted/60"
                          : "bg-muted"
                      }`}
                    >
                      <Text
                        size="xs"
                        className={
                          isToday(group.date)
                            ? "opacity-80"
                            : "text-muted-foreground"
                        }
                      >
                        {group.date.toLocaleDateString("en-US", {
                          weekday: "short",
                        })}
                      </Text>
                      <Text weight="bold" size="lg">
                        {group.date.getDate()}
                      </Text>
                    </div>
                    <Stack gap="none">
                      <Row gap="sm" align="center">
                        <Text weight="medium" className={isPast(group.date) && !isToday(group.date) ? "text-muted-foreground" : ""}>
                          {group.date.toLocaleDateString("en-US", {
                            weekday: "long",
                          })}
                        </Text>
                        {isToday(group.date) && (
                          <Badge className="bg-primary text-primary-foreground">Today</Badge>
                        )}
                      </Row>
                      <Text size="sm" variant="muted">
                        {group.date.toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </Text>
                    </Stack>
                  </Row>

                  {/* Events for this date */}
                  <Stack gap="sm" className="ml-16">
                    {group.events.map((event) => (
                      <EventCard
                        key={event.id}
                        event={event}
                        onClick={() => handleEventClick(event)}
                      />
                    ))}
                  </Stack>
                </div>
              ))
            )}
          </Stack>
        )}
      </div>

      {/* Dialogs */}
      <EventDetailDialog
        event={selectedEvent}
        open={showEventDetail}
        onClose={() => setShowEventDetail(false)}
      />

      <AddEventDialog
        open={showAddEvent}
        onClose={() => setShowAddEvent(false)}
        onAdd={handleAddEvent}
        initialDate={addEventDate}
      />

      {/* 
        FullCalendar CSS Customization
        Per docs: https://fullcalendar.io/docs/css-customization
        CSS variables must be set on :root to work properly.
        We use .calendar-wrapper for scoped overrides only.
      */}
      <style jsx global>{`
        /* ===== FULLCALENDAR CSS VARIABLES (must be on :root) ===== */
        :root {
          --fc-small-font-size: 0.85em;
          --fc-page-bg-color: #fff;
          --fc-neutral-bg-color: rgba(208, 208, 208, 0.3);
          --fc-neutral-text-color: #808080;
          --fc-border-color: #ddd;
          
          --fc-button-text-color: #fff;
          --fc-button-bg-color: #2C3E50;
          --fc-button-border-color: #2C3E50;
          --fc-button-hover-bg-color: #1e2b37;
          --fc-button-hover-border-color: #1a252f;
          --fc-button-active-bg-color: #1a252f;
          --fc-button-active-border-color: #151e27;
          
          --fc-event-bg-color: #3788d8;
          --fc-event-border-color: #3788d8;
          --fc-event-text-color: #fff;
          
          --fc-event-selected-overlay-color: rgba(0, 0, 0, 0.25);
          --fc-more-link-bg-color: #d0d0d0;
          --fc-more-link-text-color: inherit;
          
          --fc-non-business-color: rgba(215, 215, 215, 0.3);
          --fc-bg-event-color: rgb(143, 223, 130);
          --fc-bg-event-opacity: 0.3;
          --fc-highlight-color: rgba(188, 232, 241, 0.3);
          --fc-today-bg-color: rgba(255, 220, 40, 0.15);
          --fc-now-indicator-color: red;
        }

        /* Dark mode overrides */
        :root.dark {
          --fc-page-bg-color: hsl(240 10% 4%);
          --fc-neutral-bg-color: rgba(255, 255, 255, 0.1);
          --fc-neutral-text-color: #a0a0a0;
          --fc-border-color: rgba(255, 255, 255, 0.15);
          
          --fc-button-text-color: #fff;
          --fc-button-bg-color: hsl(240 5% 26%);
          --fc-button-border-color: hsl(240 5% 26%);
          --fc-button-hover-bg-color: hsl(240 5% 34%);
          --fc-button-hover-border-color: hsl(240 5% 34%);
          --fc-button-active-bg-color: hsl(240 5% 40%);
          --fc-button-active-border-color: hsl(240 5% 40%);
          
          --fc-non-business-color: rgba(40, 40, 40, 0.3);
          --fc-today-bg-color: rgba(255, 220, 40, 0.1);
        }

        /* ===== SCOPED OVERRIDES FOR OUR DESIGN ===== */
        
        /* Font inheritance */
        .calendar-wrapper .fc {
          font-family: inherit;
        }

        /* Toolbar */
        .calendar-wrapper .fc-toolbar {
          margin-bottom: 1rem !important;
          gap: 0.5rem;
        }

        .calendar-wrapper .fc-toolbar-title {
          font-size: 1.25rem !important;
          font-weight: 600 !important;
        }

        /* Button refinements */
        .calendar-wrapper .fc-button {
          font-size: 0.875rem !important;
          font-weight: 500 !important;
          text-transform: capitalize !important;
          box-shadow: none !important;
          border-radius: 0.375rem !important;
        }

        .calendar-wrapper .fc-button-group > .fc-button {
          border-radius: 0 !important;
        }

        .calendar-wrapper .fc-button-group > .fc-button:first-child {
          border-top-left-radius: 0.375rem !important;
          border-bottom-left-radius: 0.375rem !important;
        }

        .calendar-wrapper .fc-button-group > .fc-button:last-child {
          border-top-right-radius: 0.375rem !important;
          border-bottom-right-radius: 0.375rem !important;
        }

        .calendar-wrapper .fc-button:focus {
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3) !important;
        }

        /* Column headers */
        .calendar-wrapper .fc-col-header-cell {
          padding: 0.625rem 0;
          font-weight: 600;
          font-size: 0.8125rem;
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }

        .calendar-wrapper .fc-col-header-cell-cushion {
          padding: 0.5rem;
        }

        /* Day cells */
        .calendar-wrapper .fc-daygrid-day {
          min-height: 100px;
        }

        .calendar-wrapper .fc-daygrid-day-top {
          padding: 0.375rem;
        }

        .calendar-wrapper .fc-daygrid-day-number {
          font-size: 0.875rem;
          font-weight: 500;
          padding: 0.25rem 0.5rem;
        }

        /* Day cell hover effect */
        .calendar-wrapper .fc-daygrid-day:hover {
          background: rgba(0, 0, 0, 0.02);
          cursor: pointer;
        }

        :root.dark .calendar-wrapper .fc-daygrid-day:hover {
          background: rgba(255, 255, 255, 0.03);
        }

        /* Keep today's highlight visible on hover */
        .calendar-wrapper .fc-day-today:hover {
          background: rgba(13, 148, 136, 0.12) !important;
        }

        /* Today highlight - custom circle on number */
        .calendar-wrapper .fc-day-today .fc-daygrid-day-number {
          background: #0d9488;
          color: #fff;
          border-radius: 9999px;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
        }

        /* Events */
        .calendar-wrapper .fc-daygrid-event {
          border-radius: 0.25rem;
          font-size: 0.75rem;
          cursor: pointer;
          margin: 1px 2px;
        }

        .calendar-wrapper .fc-daygrid-dot-event {
          padding: 2px 4px;
        }

        .calendar-wrapper .fc-daygrid-dot-event .fc-event-title {
          font-weight: 500;
        }

        .calendar-wrapper .fc-daygrid-block-event {
          padding: 2px 4px;
        }

        .calendar-wrapper .fc-event:hover {
          filter: brightness(0.9);
        }

        /* More link */
        .calendar-wrapper .fc-daygrid-more-link {
          font-size: 0.75rem;
          font-weight: 600;
          padding: 2px 4px;
        }

        /* Time grid view */
        .calendar-wrapper .fc-timegrid-slot {
          height: 2.5rem;
        }

        .calendar-wrapper .fc-timegrid-slot-label {
          font-size: 0.75rem;
          padding-right: 0.75rem !important;
          vertical-align: top;
          padding-top: 0.25rem !important;
        }

        /* Time grid - hover effects for week/day views */
        .calendar-wrapper .fc-timegrid-slot-lane {
          cursor: pointer;
          transition: background 0.1s ease;
        }

        .calendar-wrapper .fc-timegrid-slot-lane:hover {
          background: rgba(0, 0, 0, 0.04) !important;
        }

        :root.dark .calendar-wrapper .fc-timegrid-slot-lane:hover {
          background: rgba(255, 255, 255, 0.05) !important;
        }

        .calendar-wrapper .fc-timegrid-event {
          border-radius: 0.25rem;
          font-size: 0.75rem;
        }

        /* Popover */
        .calendar-wrapper .fc-popover {
          border-radius: 0.5rem !important;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15) !important;
          z-index: 50 !important;
        }

        .calendar-wrapper .fc-popover-header {
          padding: 0.5rem 0.75rem !important;
          font-weight: 500 !important;
          border-radius: 0.5rem 0.5rem 0 0 !important;
        }

        .calendar-wrapper .fc-popover-body {
          padding: 0.5rem !important;
        }

        /* Scrollbar */
        .calendar-wrapper .fc-scroller::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        .calendar-wrapper .fc-scroller::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.05);
        }

        .calendar-wrapper .fc-scroller::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 4px;
        }

        .calendar-wrapper .fc-scroller::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.3);
        }

        /* Dark mode scrollbar */
        :root.dark .calendar-wrapper .fc-scroller::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }

        :root.dark .calendar-wrapper .fc-scroller::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
        }

        :root.dark .calendar-wrapper .fc-scroller::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        /* Dark mode today circle */
        :root.dark .calendar-wrapper .fc-day-today .fc-daygrid-day-number {
          background: #14b8a6;
        }
      `}</style>
    </Container>
  )
}
