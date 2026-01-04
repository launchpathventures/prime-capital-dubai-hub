/**
 * DEFAULT - shadcn/Next.js Example File
 *
 * This file is from the default shadcn + Next.js setup.
 * It demonstrates component usage patterns.
 *
 * Safe to delete if not needed for your project.
 */

"use client"

import * as React from "react"

import {
  Example,
  ExampleWrapper,
} from "@/components/example"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { createSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase"
import { toast } from "@/components/ui/toast"
import { PlusIcon, BluetoothIcon, MoreVerticalIcon, FileIcon, FolderIcon, FolderOpenIcon, FileCodeIcon, MoreHorizontalIcon, FolderSearchIcon, SaveIcon, DownloadIcon, EyeIcon, LayoutIcon, PaletteIcon, SunIcon, MoonIcon, MonitorIcon, UserIcon, CreditCardIcon, SettingsIcon, KeyboardIcon, LanguagesIcon, BellIcon, MailIcon, ShieldIcon, HelpCircleIcon, FileTextIcon, LogOutIcon, LayoutGridIcon, ListIcon } from "lucide-react"

export function ComponentExample() {
  const isSupabaseReady = isSupabaseConfigured()
  const supabase = React.useMemo(
    () => (isSupabaseReady ? createSupabaseBrowserClient() : null),
    [isSupabaseReady]
  )
  const [users, setUsers] = React.useState<UserRecord[]>([])
  const [isLoadingUsers, setIsLoadingUsers] = React.useState(false)
  const [usersError, setUsersError] = React.useState<string | null>(null)

  const refreshUsers = React.useCallback(async () => {
    if (!supabase) return
    setIsLoadingUsers(true)
    setUsersError(null)
    const { data, error } = await supabase
      .from("users")
      .select("name, role, framework, comments")
      .order("name", { ascending: true })

    if (error) {
      setUsers([])
      setUsersError("Unable to load users.")
    } else {
      const normalized = (data ?? []).map((user) => ({
        name: user.name ?? "",
        role: user.role ?? "",
        framework: user.framework ?? "",
        comments: user.comments ?? "",
      }))
      setUsers(normalized)
    }

    setIsLoadingUsers(false)
  }, [supabase])

  const saveUser = React.useCallback(
    async (payload: UserRecord) => {
      if (!isSupabaseReady || !supabase) {
        return { ok: false, message: "Supabase is not configured. Skipping save." }
      }
      const { error } = await supabase.from("users").insert(payload)
      if (error) {
        return { ok: false, message: "Unable to save user." }
      }
      await refreshUsers()
      return { ok: true, message: "User information saved." }
    },
    [isSupabaseReady, supabase, refreshUsers]
  )

  const removeUser = React.useCallback(
    async (user: UserRecord) => {
      if (!supabase) return
      setUsersError(null)
      const { error } = await supabase.from("users").delete().match(user)
      if (error) {
        setUsersError("Unable to remove user.")
        return
      }
      await refreshUsers()
    },
    [supabase, refreshUsers]
  )

  React.useEffect(() => {
    refreshUsers()
  }, [refreshUsers])

  return (
    <ExampleWrapper>
      <CardExample />
      <FormExample onSave={saveUser} isSupabaseReady={isSupabaseReady} />
      <UsersExample
        users={users}
        isLoading={isLoadingUsers}
        error={usersError}
        isSupabaseReady={isSupabaseReady}
        onRemove={removeUser}
      />
    </ExampleWrapper>
  )
}

function CardExample() {
  return (
    <Example title="Card" className="items-center justify-center">
      <Card className="relative w-full max-w-sm overflow-hidden pt-0">
        <div className="bg-primary absolute inset-0 z-30 aspect-video opacity-50 mix-blend-color" />
        <img
          src="https://images.unsplash.com/photo-1604076850742-4c7221f3101b?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Photo by mymind on Unsplash"
          title="Photo by mymind on Unsplash"
          className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale"
        />
        <CardHeader>
          <CardTitle>Observability Plus is replacing Monitoring</CardTitle>
          <CardDescription>
            Switch to the improved way to explore your data, with natural
            language. Monitoring will no longer be available on the Pro plan in
            November, 2025
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <AlertDialog>
            <AlertDialogTrigger render={<Button />}>
              <PlusIcon data-icon="inline-start" />
              Show Dialog
            </AlertDialogTrigger>
            <AlertDialogContent size="sm">
              <AlertDialogHeader>
                <AlertDialogMedia>
                  <BluetoothIcon
                  />
                </AlertDialogMedia>
                <AlertDialogTitle>Allow accessory to connect?</AlertDialogTitle>
                <AlertDialogDescription>
                  Do you want to allow the USB accessory to connect to this
                  device?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Don&apos;t allow</AlertDialogCancel>
                <AlertDialogAction>Allow</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Badge variant="secondary" className="ml-auto">
            Warning
          </Badge>
        </CardFooter>
      </Card>
    </Example>
  )
}

const frameworks = [
  "Next.js",
  "SvelteKit",
  "Nuxt.js",
  "Remix",
  "Astro",
] as const

const roleItems = [
  { label: "Developer", value: "developer" },
  { label: "Designer", value: "designer" },
  { label: "Manager", value: "manager" },
  { label: "Other", value: "other" },
]

type UserRecord = {
  name: string
  role: string
  framework: string
  comments: string
}

type SaveResult = { ok: boolean; message: string }
type ViewMode = "cards" | "list"

function getInitials(name: string) {
  const trimmed = name.trim()
  if (!trimmed) return "?"
  const [first, second] = trimmed.split(/\s+/)
  return `${first?.[0] ?? ""}${second?.[0] ?? ""}`.toUpperCase()
}

function FormExample({
  onSave,
  isSupabaseReady,
}: {
  onSave: (payload: UserRecord) => Promise<SaveResult>
  isSupabaseReady: boolean
}) {
  const [notifications, setNotifications] = React.useState({
    email: true,
    sms: false,
    push: true,
  })
  const [theme, setTheme] = React.useState("light")
  const [name, setName] = React.useState("")
  const [role, setRole] = React.useState("")
  const [framework, setFramework] = React.useState("")
  const [comments, setComments] = React.useState("")
  const [isSaving, setIsSaving] = React.useState(false)
  const [saveMessage, setSaveMessage] = React.useState<string | null>(null)

  const resetForm = React.useCallback(() => {
    setName("")
    setRole("")
    setFramework("")
    setComments("")
  }, [])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!isSupabaseReady) {
      return
    }
    setSaveMessage(null)
    setIsSaving(true)
    const result = await onSave({
      name,
      role,
      framework,
      comments,
    })
    setIsSaving(false)
    if (result.ok) {
      toast.success("User information saved.")
      setSaveMessage(null)
      resetForm()
    } else {
      setSaveMessage(result.message)
    }
  }

  return (
    <Example title="Form">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>User Information</CardTitle>
          <CardDescription>Please fill in your details below</CardDescription>
          <CardAction>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={<Button variant="ghost" size="icon" />}
              >
                <MoreVerticalIcon
                />
                <span className="sr-only">More options</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>File</DropdownMenuLabel>
                  <DropdownMenuItem>
                    <FileIcon
                    />
                    New File
                    <DropdownMenuShortcut>⌘N</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FolderIcon
                    />
                    New Folder
                    <DropdownMenuShortcut>⇧⌘N</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <FolderOpenIcon
                      />
                      Open Recent
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuGroup>
                          <DropdownMenuLabel>Recent Projects</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <FileCodeIcon
                            />
                            Project Alpha
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FileCodeIcon
                            />
                            Project Beta
                          </DropdownMenuItem>
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                              <MoreHorizontalIcon
                              />
                              More Projects
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent>
                                <DropdownMenuItem>
                                  <FileCodeIcon
                                  />
                                  Project Gamma
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <FileCodeIcon
                                  />
                                  Project Delta
                                </DropdownMenuItem>
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                          <DropdownMenuItem>
                            <FolderSearchIcon
                            />
                            Browse...
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <SaveIcon
                    />
                    Save
                    <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <DownloadIcon
                    />
                    Export
                    <DropdownMenuShortcut>⇧⌘E</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuLabel>View</DropdownMenuLabel>
                  <DropdownMenuCheckboxItem
                    checked={notifications.email}
                    onCheckedChange={(checked) =>
                      setNotifications({
                        ...notifications,
                        email: checked === true,
                      })
                    }
                  >
                    <EyeIcon
                    />
                    Show Sidebar
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={notifications.sms}
                    onCheckedChange={(checked) =>
                      setNotifications({
                        ...notifications,
                        sms: checked === true,
                      })
                    }
                  >
                    <LayoutIcon
                    />
                    Show Status Bar
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <PaletteIcon
                      />
                      Theme
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuGroup>
                          <DropdownMenuLabel>Appearance</DropdownMenuLabel>
                          <DropdownMenuRadioGroup
                            value={theme}
                            onValueChange={setTheme}
                          >
                            <DropdownMenuRadioItem value="light">
                              <SunIcon
                              />
                              Light
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="dark">
                              <MoonIcon
                              />
                              Dark
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="system">
                              <MonitorIcon
                              />
                              System
                            </DropdownMenuRadioItem>
                          </DropdownMenuRadioGroup>
                        </DropdownMenuGroup>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Account</DropdownMenuLabel>
                  <DropdownMenuItem>
                    <UserIcon
                    />
                    Profile
                    <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <CreditCardIcon
                    />
                    Billing
                  </DropdownMenuItem>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <SettingsIcon
                      />
                      Settings
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuGroup>
                          <DropdownMenuLabel>Preferences</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <KeyboardIcon
                            />
                            Keyboard Shortcuts
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <LanguagesIcon
                            />
                            Language
                          </DropdownMenuItem>
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                              <BellIcon
                              />
                              Notifications
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent>
                                <DropdownMenuGroup>
                                  <DropdownMenuLabel>
                                    Notification Types
                                  </DropdownMenuLabel>
                                  <DropdownMenuCheckboxItem
                                    checked={notifications.push}
                                    onCheckedChange={(checked) =>
                                      setNotifications({
                                        ...notifications,
                                        push: checked === true,
                                      })
                                    }
                                  >
                                    <BellIcon
                                    />
                                    Push Notifications
                                  </DropdownMenuCheckboxItem>
                                  <DropdownMenuCheckboxItem
                                    checked={notifications.email}
                                    onCheckedChange={(checked) =>
                                      setNotifications({
                                        ...notifications,
                                        email: checked === true,
                                      })
                                    }
                                  >
                                    <MailIcon
                                    />
                                    Email Notifications
                                  </DropdownMenuCheckboxItem>
                                </DropdownMenuGroup>
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                          <DropdownMenuItem>
                            <ShieldIcon
                            />
                            Privacy & Security
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <HelpCircleIcon
                    />
                    Help & Support
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FileTextIcon
                    />
                    Documentation
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem variant="destructive">
                    <LogOutIcon
                    />
                    Sign Out
                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="small-form-name">Name</FieldLabel>
                  <Input
                    id="small-form-name"
                    placeholder="Enter your name"
                    required
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="small-form-role">Role</FieldLabel>
                  <Select
                    items={roleItems}
                    value={role}
                    onValueChange={(value) => value && setRole(value)}
                  >
                    <SelectTrigger id="small-form-role">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {roleItems.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
              </div>
              <Field>
                <FieldLabel htmlFor="small-form-framework">
                  Framework
                </FieldLabel>
                <Combobox
                  items={frameworks}
                  value={framework}
                  onValueChange={(value) => setFramework(value ?? "")}
                >
                  <ComboboxInput
                    id="small-form-framework"
                    placeholder="Select a framework"
                    required
                    value={framework}
                    onChange={(event) => setFramework(event.target.value)}
                  />
                  <ComboboxContent>
                    <ComboboxEmpty>No frameworks found.</ComboboxEmpty>
                    <ComboboxList>
                      {(item) => (
                        <ComboboxItem key={item} value={item}>
                          {item}
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              </Field>
              <Field>
                <FieldLabel htmlFor="small-form-comments">Comments</FieldLabel>
                <Textarea
                  id="small-form-comments"
                  placeholder="Add any additional comments"
                  value={comments}
                  onChange={(event) => setComments(event.target.value)}
                />
              </Field>
              <Field orientation="horizontal">
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? "Saving..." : "Submit"}
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  onClick={resetForm}
                >
                  Cancel
                </Button>
              </Field>
              {saveMessage ? (
                <p className="text-muted-foreground text-xs">{saveMessage}</p>
              ) : null}
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </Example>
  )
}

function UsersExample({
  users,
  isLoading,
  error,
  isSupabaseReady,
  onRemove,
}: {
  users: UserRecord[]
  isLoading: boolean
  error: string | null
  isSupabaseReady: boolean
  onRemove: (user: UserRecord) => void
}) {
  const [viewMode, setViewMode] = React.useState<ViewMode>("cards")

  return (
    <Example title="Supabase Integrations - Example Users Table" containerClassName="md:col-span-2">
      <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as ViewMode)}>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Saved Users</CardTitle>
            <CardDescription>
              {isSupabaseReady
                ? "Live data from the users table."
                : "Follow the steps below to set up Supabase."}
            </CardDescription>
            {isSupabaseReady && users.length > 0 ? (
              <CardAction>
                <TabsList variant="line">
                  <TabsTrigger value="cards">
                    <LayoutGridIcon />
                    Card view
                  </TabsTrigger>
                  <TabsTrigger value="list">
                    <ListIcon />
                    List view
                  </TabsTrigger>
                </TabsList>
              </CardAction>
            ) : null}
          </CardHeader>
          <CardContent>
            {!isSupabaseReady ? (
              <div className="space-y-3 rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground">
                <div className="font-medium text-foreground">Supabase setup (quick)</div>
                <ol className="list-decimal space-y-2 pl-4">
                  <li>Create a Supabase project.</li>
                  <li>
                    Create a `users` table with columns: `id`, `name`, `role`, `framework`,
                    `comments`, `created_at`.
                  </li>
                  <li>
                    Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (or
                    `NEXT_PUBLIC_SUPABASE_ANON_KEY`) to `.env.local` from Project Settings → API.
                  </li>
                </ol>
                <div className="rounded-md border bg-card p-3 text-xs text-foreground">
                  <pre className="whitespace-pre-wrap">
{`NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY`}
                  </pre>
                </div>
              </div>
            ) : null}
            {isSupabaseReady && error ? (
              <p className="text-destructive text-sm">{error}</p>
            ) : null}
            {isSupabaseReady && isLoading ? (
              <p className="text-muted-foreground text-sm">Loading users...</p>
            ) : null}
            {isSupabaseReady && !error && !isLoading && users.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                No users saved yet.
              </p>
            ) : null}
            {isSupabaseReady && users.length > 0 ? (
              <>
                <TabsContent value="cards">
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {users.map((user) => (
                      <Card
                        key={`${user.name}-${user.role}-${user.framework}`}
                        className="flex h-full flex-col"
                      >
                        <CardHeader className="flex flex-row items-start gap-3">
                          <Avatar size="lg">
                            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                          </Avatar>
                          <div className="space-y-1">
                            <CardTitle className="text-base">{user.name}</CardTitle>
                            <CardDescription className="text-xs">
                              {user.role || "Role not set"}
                            </CardDescription>
                          </div>
                        </CardHeader>
                        <CardContent className="flex flex-1 flex-col gap-3 text-sm">
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="secondary">{user.role || "No role"}</Badge>
                            <Badge variant="outline">{user.framework || "No framework"}</Badge>
                          </div>
                          <p className="text-muted-foreground">
                            {user.comments || "No additional comments."}
                          </p>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="mt-auto"
                            onClick={() => onRemove(user)}
                          >
                            Remove
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="list">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Framework</TableHead>
                        <TableHead>Comments</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow
                          key={`${user.name}-${user.role}-${user.framework}`}
                        >
                          <TableCell>{user.name}</TableCell>
                          <TableCell>{user.role || "—"}</TableCell>
                          <TableCell>{user.framework}</TableCell>
                          <TableCell className="max-w-[240px] truncate">
                            {user.comments || "—"}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => onRemove(user)}
                            >
                              Remove
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>
              </>
            ) : null}
          </CardContent>
        </Card>
      </Tabs>
    </Example>
  )
}
