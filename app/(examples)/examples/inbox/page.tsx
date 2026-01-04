/**
 * CATALYST - Inbox Example
 *
 * Demonstrates an email-client style layout with:
 * - Left sidebar: Folder navigation with unread counts
 * - Middle: Message list with sender, subject, preview, read/unread state
 * - Right: Message detail view with full content and reply area
 *
 * All data is mock/demo. Uses design tokens throughout.
 */

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Container, Row, Stack, Text, Title, Avatar, Count } from "@/components/core"
import { ExamplePrompt, getExample } from "../../_surface"

const example = getExample("inbox")!
import {
  InboxIcon,
  SendIcon,
  FileTextIcon,
  ArchiveIcon,
  PlusIcon,
  MailIcon,
  Reply,
  Forward,
  SendHorizonalIcon,
  SearchIcon,
  XIcon,
  LightbulbIcon,
} from "lucide-react"

// =============================================================================
// TYPES
// =============================================================================

type FolderType = "inbox" | "sent" | "drafts" | "archive"

interface Message {
  id: string
  sender: string
  email: string
  subject: string
  preview: string
  body: string
  time: string
  isRead: boolean
  folder: FolderType
}

interface Folder {
  id: FolderType
  label: string
  icon: React.ComponentType<{ className?: string }>
  count?: number
}

// =============================================================================
// MOCK DATA
// =============================================================================

const folders: Folder[] = [
  { id: "inbox", label: "Inbox", icon: InboxIcon, count: 3 },
  { id: "sent", label: "Sent", icon: SendIcon },
  { id: "drafts", label: "Drafts", icon: FileTextIcon },
  { id: "archive", label: "Archive", icon: ArchiveIcon },
]

const messages: Message[] = [
  {
    id: "1",
    sender: "Sarah Chen",
    email: "sarah.chen@techcorp.com",
    subject: "Q1 rollout timeline + integration questions",
    preview: "Hey team — quick question on the integration milestones for Q1…",
    body: `Hi team,

Quick question on the integration milestones for Q1. Our engineering group wants to align on the rollout timeline and confirm the API rate limits for peak hours.

Can you share the recommended approach for batching events and any best practices from similar customers?

Thanks,
Sarah`,
    time: "9:12 AM",
    isRead: false,
    folder: "inbox",
  },
  {
    id: "2",
    sender: "Marcus Johnson",
    email: "marcus.j@enterprise.io",
    subject: "Re: Pricing — add-on for custom integration",
    preview: "Thanks for the breakdown. If we proceed with the custom connector…",
    body: `Hi,

Thanks for the breakdown. If we proceed with the custom connector, what would be the estimated timeline for implementation?

Also, can you confirm if the pricing includes ongoing maintenance or if that's a separate line item?

Best,
Marcus`,
    time: "Yesterday",
    isRead: true,
    folder: "inbox",
  },
  {
    id: "3",
    sender: "Emily Rodriguez",
    email: "emily.r@startup.co",
    subject: "Webinar follow-up: can we book a demo?",
    preview: "Loved the webinar. Could we schedule a 30 min demo next week?",
    body: `Hi there!

Loved the webinar yesterday. The feature demo really clicked with our team.

Could we schedule a 30 min demo next week? We're particularly interested in the analytics dashboard and the API integrations.

Looking forward to hearing from you!

Emily`,
    time: "2 days ago",
    isRead: false,
    folder: "inbox",
  },
  {
    id: "4",
    sender: "Kevin O'Brien",
    email: "kevin.obrien@corp.com",
    subject: "Security review checklist",
    preview: "Our security team asked for a few items before we proceed…",
    body: `Hello,

Our security team asked for a few items before we proceed with the procurement process:

1. SOC 2 Type II certification
2. Data processing agreement
3. Penetration test results
4. Business continuity plan

Could you share these documents at your earliest convenience?

Thanks,
Kevin`,
    time: "4 days ago",
    isRead: false,
    folder: "inbox",
  },
  {
    id: "5",
    sender: "Lisa Wang",
    email: "lisa.wang@agency.net",
    subject: "Partnership opportunity",
    preview: "We're looking for integration partners for our new platform…",
    body: `Hi,

We're looking for integration partners for our new platform launch in Q2.

Your product would be a great fit for our customer base. Would you be interested in exploring a partnership?

Let me know if you'd like to schedule a call to discuss.

Best regards,
Lisa`,
    time: "5 days ago",
    isRead: true,
    folder: "inbox",
  },
  {
    id: "6",
    sender: "David Park",
    email: "david.p@retail.com",
    subject: "Feature request: bulk export",
    preview: "Our team would love to see a bulk export feature for reports…",
    body: `Hello team,

Our team would love to see a bulk export feature for reports. Currently we have to export each report individually which is time-consuming.

Is this something on your roadmap? Happy to provide more details on our use case.

Thanks,
David`,
    time: "1 week ago",
    isRead: true,
    folder: "inbox",
  },
]

// =============================================================================
// FOLDER ITEM COMPONENT
// =============================================================================

interface FolderItemProps {
  folder: Folder
  isActive: boolean
  onClick: () => void
}

function FolderItem({ folder, isActive, onClick }: FolderItemProps) {
  const Icon = folder.icon
  return (
    <Button
      variant={isActive ? "default" : "ghost"}
      onClick={onClick}
      className={`inbox-folder-item w-full justify-start gap-3 ${
        isActive ? "inbox-folder-item--active" : ""
      }`}
    >
      <Icon className="h-4 w-4" />
      <span className="flex-1 text-left">{folder.label}</span>
      {folder.count && folder.count > 0 && (
        <Badge
          variant={isActive ? "secondary" : "default"}
          className={isActive ? "bg-primary-foreground/20 text-primary-foreground" : ""}
        >
          {folder.count}
        </Badge>
      )}
    </Button>
  )
}

// =============================================================================
// MESSAGE LIST ITEM COMPONENT
// =============================================================================

interface MessageListItemProps {
  message: Message
  isSelected: boolean
  onClick: () => void
  onMarkRead: () => void
}

function MessageListItem({ message, isSelected, onClick, onMarkRead }: MessageListItemProps) {
  return (
    <button
      onClick={() => {
        onClick()
        if (!message.isRead) onMarkRead()
      }}
      className={`inbox-message-item w-full text-left p-4 border-b border-border transition-colors cursor-pointer hover:bg-muted/50 ${
        isSelected ? "inbox-message-item--selected border-l-2 border-l-primary bg-muted/30" : ""
      }`}
    >
      <Row gap="md" align="start" className="inbox-message-item__content">
        <Avatar name={message.sender} size="sm" />
        <Stack gap="xs" className="flex-1 min-w-0">
          <Row gap="sm" align="center" justify="between">
            <Row gap="sm" align="center" className="min-w-0">
              <Text size="sm" weight={message.isRead ? "normal" : "semibold"} className="truncate">
                {message.sender}
              </Text>
              {!message.isRead && (
                <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
              )}
            </Row>
            <Text size="xs" variant="muted" className="shrink-0">
              {message.time}
            </Text>
          </Row>
          <Text size="sm" weight={message.isRead ? "normal" : "medium"} className="truncate">
            {message.subject}
          </Text>
          <Text size="xs" variant="muted" className="truncate">
            {message.preview}
          </Text>
        </Stack>
      </Row>
    </button>
  )
}

// =============================================================================
// MESSAGE DETAIL COMPONENT
// =============================================================================

interface MessageDetailProps {
  message: Message
}

function MessageDetail({ message }: MessageDetailProps) {
  return (
    <Card className="inbox-detail">
      {/* Message Header with Actions */}
      <div className="inbox-detail__header px-6 pb-3 border-b border-border">
        <Row gap="sm" align="center" justify="between">
          <Row gap="sm" align="center">
            <MailIcon className="h-5 w-5 text-primary" />
            <Title size="h5">Message</Title>
          </Row>
          <Row gap="sm" className="inbox-detail__actions">
            <Button size="sm">
              <Reply className="h-4 w-4 mr-2" />
              Reply
            </Button>
            <Button variant="outline" size="sm">
              <Forward className="h-4 w-4 mr-2" />
              Forward
            </Button>
            <Button variant="outline" size="sm">
              <ArchiveIcon className="h-4 w-4 mr-2" />
              Archive
            </Button>
          </Row>
        </Row>
      </div>

      {/* Message Content */}
      <div className="inbox-detail__content px-6 py-4">
        <Stack gap="md">
          {/* Subject + Meta */}
          <Stack gap="xs">
            <Title size="h4">{message.subject}</Title>
            <Text size="sm" variant="muted">
              From: {message.sender} • {message.email}
            </Text>
            <Text size="sm" variant="muted">
              Time: {message.time}
            </Text>
          </Stack>

          {/* Message Body */}
          <div className="inbox-detail__body whitespace-pre-line text-sm leading-relaxed">
            {message.body}
          </div>
        </Stack>
      </div>

      {/* Quick Reply */}
      <div className="inbox-detail__reply border-t border-border px-6 py-4">
        <Stack gap="sm">
          <Text size="sm" weight="medium">Quick reply</Text>
          <Textarea
            placeholder="Write a reply..."
            className="min-h-[80px] resize-none"
          />
          <Row justify="end">
            <Button size="sm">
              <SendHorizonalIcon className="h-4 w-4 mr-2" />
              Send
            </Button>
          </Row>
        </Stack>
      </div>
    </Card>
  )
}

// =============================================================================
// EMPTY STATE COMPONENT
// =============================================================================

function EmptyState() {
  return (
    <Card className="inbox-empty h-full min-h-[400px] flex items-center justify-center">
      <Stack gap="sm" align="center" className="text-center p-8">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
          <MailIcon className="h-6 w-6 text-muted-foreground" />
        </div>
        <Title size="h5">No message selected</Title>
        <Text variant="muted">Select a message from the list to view its contents</Text>
      </Stack>
    </Card>
  )
}

// =============================================================================
// MAIN PAGE
// =============================================================================

export default function InboxPage() {
  const [activeFolder, setActiveFolder] = useState<FolderType>("inbox")
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>("1")
  const [searchQuery, setSearchQuery] = useState("")
  const [messageStates, setMessageStates] = useState<Record<string, boolean>>(() => {
    // Initialize with existing read states
    const states: Record<string, boolean> = {}
    messages.forEach((m) => {
      states[m.id] = m.isRead
    })
    return states
  })

  const folderMessages = messages.filter((m) => {
    const matchesFolder = m.folder === activeFolder
    const matchesSearch =
      searchQuery === "" ||
      m.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.preview.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFolder && matchesSearch
  })
  const selectedMessage = messages.find((m) => m.id === selectedMessageId)

  // Count unread messages for inbox folder
  const unreadCount = messages.filter((m) => m.folder === "inbox" && !messageStates[m.id]).length

  const foldersWithCounts = folders.map((f) => ({
    ...f,
    count: f.id === "inbox" ? unreadCount : f.count,
  }))

  const markMessageRead = (messageId: string) => {
    setMessageStates((prev) => ({ ...prev, [messageId]: true }))
  }

  return (
    <Container size="2xl" className="inbox-layout">
      <Stack gap="lg">
        {/* Prompt */}
        <ExamplePrompt summary={example.summary}>
          {example.prompt}
        </ExamplePrompt>

        {/* Header */}
        <Card className="inbox-header bg-gradient-to-r from-amber-500/[0.06] via-amber-500/[0.02] to-transparent animate-in fade-in slide-in-from-top-2 duration-500">
          <CardContent className="py-4">
            <Row gap="lg" align="center" justify="between" className="flex-wrap gap-y-4">
              <Row gap="md" align="center">
                <div className="flex size-11 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
                  <MailIcon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <Stack gap="none">
                  <Title size="h3">Inbox</Title>
                  <Text size="sm" variant="muted">
                    Manage your messages and conversations
                  </Text>
                </Stack>
              </Row>
              <Row gap="sm" align="center">
                <Button variant="outline" size="sm">
                  <SearchIcon className="h-4 w-4 mr-1.5" />
                  Search
                </Button>
                <Button size="sm">
                  <PlusIcon className="h-4 w-4 mr-1.5" />
                  Compose
                </Button>
              </Row>
            </Row>
          </CardContent>
        </Card>

        {/* Inbox Grid - Three columns */}
        <div className="inbox-grid grid grid-cols-1 lg:grid-cols-[240px_360px_1fr] gap-4">
          {/* Left: Folder Sidebar */}
          <Card className="inbox-folders">
            <CardContent className="p-3 pt-0">
              <Stack gap="sm">
                <Button className="w-full">
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Compose
                </Button>

                <Text size="xs" variant="muted" className="px-3 pt-2">
                  Folders
                </Text>

                <Stack gap="xs">
                  {foldersWithCounts.map((folder) => (
                    <FolderItem
                      key={folder.id}
                      folder={folder}
                      isActive={activeFolder === folder.id}
                      onClick={() => setActiveFolder(folder.id)}
                    />
                  ))}
                </Stack>

                {/* Tip Card */}
                <div className="inbox-tip mt-2 p-3 rounded-lg bg-muted/50 border border-border/50">
                  <Row gap="sm" align="start">
                    <LightbulbIcon className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                    <Text size="xs" variant="muted" leading="tight">
                      Click a message to mark it read.
                    </Text>
                  </Row>
                </div>
              </Stack>
            </CardContent>
          </Card>

          {/* Middle: Message List */}
          <div className="inbox-list-wrapper relative min-h-[500px]">
            <Card className="inbox-list lg:absolute lg:inset-0 flex flex-col overflow-hidden">
              {/* Header */}
              <div className="inbox-list__header px-4 pb-3 border-b border-border shrink-0">
                <Stack gap="sm">
                  <Row gap="sm" align="center">
                    <MailIcon className="h-5 w-5 text-primary" />
                    <Title size="h5">
                      {folders.find((f) => f.id === activeFolder)?.label}
                    </Title>
                    <Count value={folderMessages.length} />
                  </Row>
                  <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search messages..."
                      className="pl-9 pr-9"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSearchQuery("")}
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:text-foreground"
                      >
                        <XIcon className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </Stack>
              </div>

              {/* Message List */}
              <ScrollArea className="inbox-list__messages flex-1 min-h-0">
                {folderMessages.length === 0 ? (
                  <div className="p-8 text-center">
                    <Text variant="muted">No messages in this folder</Text>
                  </div>
                ) : (
                  folderMessages.map((message) => (
                    <MessageListItem
                      key={message.id}
                      message={{ ...message, isRead: messageStates[message.id] }}
                      isSelected={selectedMessageId === message.id}
                      onClick={() => setSelectedMessageId(message.id)}
                      onMarkRead={() => markMessageRead(message.id)}
                    />
                  ))
                )}
              </ScrollArea>
            </Card>
          </div>

          {/* Right: Message Detail */}
          <div className="inbox-main">
            {selectedMessage ? (
              <MessageDetail message={selectedMessage} />
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
      </Stack>
    </Container>
  )
}
