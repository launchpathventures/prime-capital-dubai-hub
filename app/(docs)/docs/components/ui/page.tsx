/**
 * CATALYST - UI Components (Shadcn)
 *
 * Showcases all shadcn/ui primitives with search and individual accordions.
 * Each component has examples and links to shadcn docs.
 */

"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
  ComboboxCollection,
} from "@/components/ui/combobox"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
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
import { Toggle } from "@/components/ui/toggle"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { toast } from "@/components/ui/toast"
import {
  ExternalLinkIcon,
  InfoIcon,
  ChevronRightIcon,
  MailIcon,
  UserIcon,
  SettingsIcon,
  LogOutIcon,
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  PlusIcon,
  Trash2Icon,
  DownloadIcon,
  StarIcon,
  HeartIcon,
  BookmarkIcon,
  SearchIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  AlertCircleIcon,
  ArrowRightIcon,
  BookOpenIcon,
} from "lucide-react"
import { DocsAccordionPage } from "../../../_surface/docs-accordion-page"

// =============================================================================
// EXAMPLE COMPONENTS (for stateful demos)
// =============================================================================

const FRAMEWORKS = ["Next.js", "Remix", "Astro", "Nuxt", "SvelteKit"]

function ComboboxExample() {
  return (
    <Combobox items={FRAMEWORKS}>
      <ComboboxInput className="w-56" placeholder="Select a framework..." />
      <ComboboxContent>
        <ComboboxList>
          <ComboboxEmpty>No framework found.</ComboboxEmpty>
          <ComboboxCollection>
            {(item: string) => (
              <ComboboxItem key={item} value={item}>
                {item}
              </ComboboxItem>
            )}
          </ComboboxCollection>
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}

// =============================================================================
// COMPONENT DATA
// =============================================================================

type ComponentInfo = {
  name: string
  slug: string
  description: string
  importStatement: string
  customised: boolean
  customNotes?: string
  example?: React.ReactNode
}

const COMPONENTS: ComponentInfo[] = [
  {
    name: "Accordion",
    slug: "accordion",
    description: "Expandable content sections. Click headers to show/hide content.",
    importStatement: "import { Accordion, AccordionItem, ... } from \"@/components/ui/accordion\"",
    customised: true,
    customNotes: "Added cursor-pointer, fixed focus ring clipping with internal padding",
    example: (
      <Card className="px-4 py-0">
        <Accordion>
          <AccordionItem>
            <AccordionTrigger>Section One</AccordionTrigger>
            <AccordionContent>Content for section one.</AccordionContent>
          </AccordionItem>
          <AccordionItem>
            <AccordionTrigger>Section Two</AccordionTrigger>
            <AccordionContent>Content for section two.</AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>
    ),
  },
  {
    name: "Alert",
    slug: "alert",
    description: "Displays a callout for important information or feedback.",
    importStatement: "import { Alert, AlertTitle, ... } from \"@/components/ui/alert\"",
    customised: true,
    example: (
      <div className="space-y-3">
        <Alert>
          <InfoIcon className="size-4" />
          <AlertTitle>Default</AlertTitle>
          <AlertDescription>Standard alert with card background.</AlertDescription>
        </Alert>
        <Alert variant="muted">
          <InfoIcon className="size-4" />
          <AlertTitle>Muted</AlertTitle>
          <AlertDescription>Subtle gray background for less emphasis.</AlertDescription>
        </Alert>
        <Alert variant="info">
          <InfoIcon className="size-4" />
          <AlertTitle>Info</AlertTitle>
          <AlertDescription>Informational message for the user.</AlertDescription>
        </Alert>
        <Alert variant="success">
          <CheckCircleIcon className="size-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>Action completed successfully.</AlertDescription>
        </Alert>
        <Alert variant="warning">
          <AlertTriangleIcon className="size-4" />
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>Something needs your attention.</AlertDescription>
        </Alert>
        <Alert variant="destructive">
          <AlertCircleIcon className="size-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Something went wrong.</AlertDescription>
        </Alert>
      </div>
    ),
  },
  {
    name: "Alert Dialog",
    slug: "alert-dialog",
    description: "Modal dialog for confirmations that interrupt the user. Requires user response before continuing.",
    importStatement: "import { AlertDialog, AlertDialogTrigger, ... } from \"@/components/ui/alert-dialog\"",
    customised: false,
    example: (
      <AlertDialog>
        <AlertDialogTrigger render={<Button variant="destructive" size="sm" />}>
          <Trash2Icon className="size-4 mr-1.5" />Delete Account
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-2">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive">
              <Trash2Icon className="size-4 mr-1.5" />Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    ),
  },
  {
    name: "Aspect Ratio",
    slug: "aspect-ratio",
    description: "Maintains a fixed aspect ratio for content (e.g., 16:9 for video).",
    importStatement: "import { AspectRatio } from \"@/components/ui/aspect-ratio\"",
    customised: false,
    example: (
      <div className="flex items-end gap-3">
        <div className="bg-muted flex h-16 items-center justify-center rounded" style={{ aspectRatio: "1/1" }}>
          <span className="text-muted-foreground text-xs">1:1</span>
        </div>
        <div className="bg-muted flex h-16 items-center justify-center rounded" style={{ aspectRatio: "4/3" }}>
          <span className="text-muted-foreground text-xs">4:3</span>
        </div>
        <div className="bg-muted flex h-16 items-center justify-center rounded" style={{ aspectRatio: "16/9" }}>
          <span className="text-muted-foreground text-xs">16:9</span>
        </div>
      </div>
    ),
  },
  {
    name: "Avatar",
    slug: "avatar",
    description: "User profile image with fallback initials.",
    importStatement: "import { Avatar, AvatarImage, AvatarFallback } from \"@/components/ui/avatar\"",
    customised: false,
    example: (
      <div className="flex gap-3">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <Avatar className="size-8">
          <AvatarFallback className="text-xs">SM</AvatarFallback>
        </Avatar>
      </div>
    ),
  },
  {
    name: "Badge",
    slug: "badge",
    description: "Small status indicator or label.",
    importStatement: "import { Badge } from \"@/components/ui/badge\"",
    customised: false,
    example: (
      <div className="flex flex-wrap gap-2">
        <Badge>Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="outline">Outline</Badge>
        <Badge variant="destructive">Destructive</Badge>
      </div>
    ),
  },
  {
    name: "Breadcrumb",
    slug: "breadcrumb",
    description: "Navigation trail showing the current page location.",
    importStatement: "import { Breadcrumb, BreadcrumbList, ... } from \"@/components/ui/breadcrumb\"",
    customised: false,
    example: (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#" onClick={(e) => e.preventDefault()}>Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="#" onClick={(e) => e.preventDefault()}>Products</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Current Page</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    ),
  },
  {
    name: "Button",
    slug: "button",
    description: "Primary interaction element with multiple variants and sizes.",
    importStatement: "import { Button } from \"@/components/ui/button\"",
    customised: true,
    customNotes: "Hybrid CSS/Tailwind — structure in CSS, colors in Tailwind",
    example: (
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Button size="sm">Default</Button>
          <Button size="sm" variant="secondary">Secondary</Button>
          <Button size="sm" variant="outline">Outline</Button>
          <Button size="sm" variant="ghost">Ghost</Button>
          <Button size="sm" variant="destructive">Destructive</Button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm"><PlusIcon className="size-4 mr-1.5" />With Icon</Button>
          <Button size="sm" variant="outline"><DownloadIcon className="size-4 mr-1.5" />Download</Button>
          <Button size="icon" variant="outline"><SettingsIcon className="size-4" /></Button>
          <Button size="icon" variant="ghost"><Trash2Icon className="size-4" /></Button>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="xs">XS</Button>
          <Button size="sm">SM</Button>
          <Button size="default">Default</Button>
          <Button size="lg">LG</Button>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" disabled>Disabled</Button>
          <Button size="sm" variant="outline" disabled>Disabled</Button>
        </div>
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-dashed">
          <Button className="h-14 px-8 text-lg rounded-full border-0 shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:scale-105 transition-all">
            Get Started
            <ArrowRightIcon className="size-5" />
          </Button>
          <Button variant="outline" className="h-14 px-8 text-lg rounded-full backdrop-blur-sm hover:scale-105 transition-all">
            <BookOpenIcon className="size-5" />
            View Docs
          </Button>
        </div>
      </div>
    ),
  },
  {
    name: "Card",
    slug: "card",
    description: "Container for grouping related content with header and body.",
    importStatement: "import { Card, CardHeader, CardContent, ... } from \"@/components/ui/card\"",
    customised: true,
    customNotes: "Changed ring to border (fixes clipping)",
    example: (
      <Card className="max-w-xs">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Card Title</CardTitle>
          <CardDescription>Brief description</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">Card content goes here.</p>
        </CardContent>
      </Card>
    ),
  },
  {
    name: "Checkbox",
    slug: "checkbox",
    description: "Toggle for boolean values, often used in forms.",
    importStatement: "import { Checkbox } from \"@/components/ui/checkbox\"",
    customised: true,
    customNotes: "Cursor styles (pointer, not-allowed when disabled)",
    example: (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Checkbox id="terms" />
          <Label htmlFor="terms">Accept terms and conditions</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="newsletter" />
          <Label htmlFor="newsletter">Subscribe to newsletter</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="disabled" disabled />
          <Label htmlFor="disabled" className="text-muted-foreground">Disabled option</Label>
        </div>
      </div>
    ),
  },
  {
    name: "Collapsible",
    slug: "collapsible",
    description: "Expandable section with trigger button and animated content reveal.",
    importStatement: "import { Collapsible, CollapsibleTrigger, ... } from \"@/components/ui/collapsible\"",
    customised: false,
    example: (
      <Collapsible className="w-full max-w-xs">
        <CollapsibleTrigger className="flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium hover:bg-muted">
          <ChevronRightIcon className="size-5" />
          <span>View more items</span>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-2 pl-7 pt-2">
          <div className="rounded border px-3 py-2 text-sm">Item 1</div>
          <div className="rounded border px-3 py-2 text-sm">Item 2</div>
          <div className="rounded border px-3 py-2 text-sm">Item 3</div>
        </CollapsibleContent>
      </Collapsible>
    ),
  },
  {
    name: "Combobox",
    slug: "combobox",
    description: "Searchable dropdown with autocomplete and keyboard navigation.",
    importStatement: "import { Combobox, ComboboxInput, ... } from \"@/components/ui/combobox\"",
    customised: false,
    example: <ComboboxExample />,
  },
  {
    name: "Dialog",
    slug: "dialog",
    description: "Centered modal overlay with backdrop. Use for forms, confirmations, or detailed content.",
    importStatement: "import { Dialog, DialogTrigger, DialogContent, ... } from \"@/components/ui/dialog\"",
    customised: false,
    example: (
      <Dialog>
        <DialogTrigger render={<Button variant="outline" size="sm" />}>
          Edit Profile
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>Make changes to your profile here.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <div className="space-y-1">
              <Label htmlFor="name">Name</Label>
              <Input id="name" defaultValue="John Doe" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="username">Username</Label>
              <Input id="username" defaultValue="@johndoe" />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-2">
            <DialogClose render={<Button variant="outline" size="sm" />}>
              Cancel
            </DialogClose>
            <DialogClose render={<Button size="sm" />}>
              Save changes
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    ),
  },
  {
    name: "Dropdown Menu",
    slug: "dropdown-menu",
    description: "Contextual menu triggered by a button. Supports items, checkboxes, radio groups, and sub-menus.",
    importStatement: "import { DropdownMenu, DropdownMenuTrigger, ... } from \"@/components/ui/dropdown-menu\"",
    customised: false,
    example: (
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="outline" size="sm" />}>
          Open Menu
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48">
          <DropdownMenuGroup>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuItem><UserIcon className="mr-2 size-4" />Profile</DropdownMenuItem>
            <DropdownMenuItem><SettingsIcon className="mr-2 size-4" />Settings</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem><LogOutIcon className="mr-2 size-4" />Log out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
  {
    name: "Field",
    slug: "field",
    description: "Form field wrapper combining Label, Input, and error text with consistent spacing.",
    importStatement: "import { Field, FieldLabel, ... } from \"@/components/ui/field\"",
    customised: false,
    example: (
      <div className="space-y-4 max-w-xs overflow-visible">
        <Field>
          <FieldLabel>Email</FieldLabel>
          <Input type="email" placeholder="you@example.com" />
        </Field>
        <Field>
          <FieldLabel>Username</FieldLabel>
          <Input placeholder="johndoe" />
          <FieldDescription>This username is available.</FieldDescription>
        </Field>
      </div>
    ),
  },
  {
    name: "Input",
    slug: "input",
    description: "Text input field with optional startIcon, endIcon, and clearable props.",
    importStatement: "import { Input } from \"@/components/ui/input\"",
    customised: true,
    customNotes: "Added clearable, startIcon, endIcon props for common patterns",
    example: (
      <div className="space-y-3 max-w-xs overflow-visible">
        <Input placeholder="Default input" />
        <Input placeholder="With start icon" startIcon={<SearchIcon />} />
        <Input placeholder="With end icon" endIcon={<MailIcon />} />
        <Input placeholder="Clearable (type something)" clearable defaultValue="Clear me" />
        <Input placeholder="Disabled" disabled />
      </div>
    ),
  },
  {
    name: "Input Group",
    slug: "input-otp",
    description: "Input with prefix/suffix slots for icons, buttons, or text.",
    importStatement: "import { InputGroup, InputGroupInput, ... } from \"@/components/ui/input-group\"",
    customised: false,
    example: (
      <div className="space-y-3 max-w-xs">
        <InputGroup>
          <InputGroupText><MailIcon className="size-4" /></InputGroupText>
          <InputGroupInput placeholder="Email address" />
        </InputGroup>
        <InputGroup>
          <InputGroupText>https://</InputGroupText>
          <InputGroupInput placeholder="example.com" />
        </InputGroup>
      </div>
    ),
  },
  {
    name: "Label",
    slug: "label",
    description: "Accessible label for form inputs.",
    importStatement: "import { Label } from \"@/components/ui/label\"",
    customised: false,
    example: (
      <div className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="example">Email address</Label>
          <Input id="example" type="email" placeholder="you@example.com" className="max-w-xs" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="required-example">Username <span className="text-destructive">*</span></Label>
          <Input id="required-example" placeholder="Required field" required className="max-w-xs" />
        </div>
      </div>
    ),
  },
  {
    name: "Popover",
    slug: "popover",
    description: "Floating panel anchored to a trigger. Use for rich tooltips, date pickers, or contextual forms.",
    importStatement: "import { Popover, PopoverTrigger, ... } from \"@/components/ui/popover\"",
    customised: false,
    example: (
      <Popover>
        <PopoverTrigger render={<Button variant="outline" size="sm" />}>
          Open Popover
        </PopoverTrigger>
        <PopoverContent className="w-64">
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Dimensions</h4>
            <p className="text-muted-foreground text-xs">Set the dimensions for the layer.</p>
            <div className="grid gap-2">
              <div className="grid grid-cols-3 items-center gap-2">
                <Label className="text-xs">Width</Label>
                <Input className="col-span-2 h-8" defaultValue="100%" />
              </div>
              <div className="grid grid-cols-3 items-center gap-2">
                <Label className="text-xs">Height</Label>
                <Input className="col-span-2 h-8" defaultValue="auto" />
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    ),
  },
  {
    name: "Progress",
    slug: "progress",
    description: "Visual indicator of completion or loading progress.",
    importStatement: "import { Progress } from \"@/components/ui/progress\"",
    customised: false,
    example: (
      <div className="space-y-3 max-w-xs">
        <Progress value={33} />
        <Progress value={66} />
        <Progress value={100} />
      </div>
    ),
  },
  {
    name: "Radio Group",
    slug: "radio-group",
    description: "Single-select from mutually exclusive options with keyboard navigation.",
    importStatement: "import { RadioGroup, RadioGroupItem } from \"@/components/ui/radio-group\"",
    customised: true,
    customNotes: "Cursor styles (pointer, not-allowed when disabled)",
    example: (
      <RadioGroup defaultValue="option-1" className="space-y-2">
        <div className="flex items-center gap-2">
          <RadioGroupItem value="option-1" id="r1" />
          <Label htmlFor="r1">Default option</Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="option-2" id="r2" />
          <Label htmlFor="r2">Second option</Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="option-3" id="r3" disabled />
          <Label htmlFor="r3" className="text-muted-foreground">Disabled option</Label>
        </div>
      </RadioGroup>
    ),
  },
  {
    name: "Scroll Area",
    slug: "scroll-area",
    description: "Custom scrollbar container with cross-browser consistent styling.",
    importStatement: "import { ScrollArea } from \"@/components/ui/scroll-area\"",
    customised: false,
    example: (
      <ScrollArea className="h-32 w-48 rounded border p-3">
        <div className="space-y-2">
          {["Apple", "Banana", "Cherry", "Date", "Elderberry", "Fig", "Grape", "Honeydew"].map((fruit) => (
            <div key={fruit} className="text-sm">{fruit}</div>
          ))}
        </div>
      </ScrollArea>
    ),
  },
  {
    name: "Select",
    slug: "select",
    description: "Native-feeling dropdown select with groups and custom option rendering.",
    importStatement: "import { Select, SelectTrigger, SelectContent, ... } from \"@/components/ui/select\"",
    customised: false,
    example: (
      <Select defaultValue="Apple">
        <SelectTrigger className="w-48">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Apple">Apple</SelectItem>
          <SelectItem value="Banana">Banana</SelectItem>
          <SelectItem value="Cherry">Cherry</SelectItem>
          <SelectItem value="Grape">Grape</SelectItem>
        </SelectContent>
      </Select>
    ),
  },
  {
    name: "Separator",
    slug: "separator",
    description: "Visual divider between content sections.",
    importStatement: "import { Separator } from \"@/components/ui/separator\"",
    customised: false,
    example: (
      <div className="space-y-2 max-w-xs">
        <p className="text-sm">Above the line</p>
        <Separator />
        <p className="text-sm">Below the line</p>
      </div>
    ),
  },
  {
    name: "Sheet (Panel)",
    slug: "sheet",
    description: "Slide-out panel from any screen edge. Use for navigation, forms, or detailed content.",
    importStatement: "import { Sheet, SheetTrigger, SheetContent, ... } from \"@/components/ui/sheet\"",
    customised: false,
    example: (
      <div className="flex gap-2">
        <Sheet>
          <SheetTrigger render={<Button variant="outline" size="sm" />}>
            Open Left
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Navigation</SheetTitle>
              <SheetDescription>Browse the app sections.</SheetDescription>
            </SheetHeader>
            <div className="py-4 space-y-2">
              <div className="rounded border px-3 py-2 text-sm">Dashboard</div>
              <div className="rounded border px-3 py-2 text-sm">Settings</div>
              <div className="rounded border px-3 py-2 text-sm">Profile</div>
            </div>
          </SheetContent>
        </Sheet>
        <Sheet>
          <SheetTrigger render={<Button variant="outline" size="sm" />}>
            Open Right
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>Details</SheetTitle>
              <SheetDescription>View item details.</SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
    ),
  },
  {
    name: "Skeleton",
    slug: "skeleton",
    description: "Placeholder loading state mimicking content shape.",
    importStatement: "import { Skeleton } from \"@/components/ui/skeleton\"",
    customised: true,
    customNotes: "Made background slightly darker for visibility",
    example: (
      <div className="flex items-center gap-3">
        <Skeleton className="size-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
    ),
  },
  {
    name: "Slider",
    slug: "slider",
    description: "Range input for selecting numeric values.",
    importStatement: "import { Slider } from \"@/components/ui/slider\"",
    customised: true,
    customNotes: "Added cursor-pointer to thumb",
    example: (
      <div className="space-y-4 max-w-xs">
        <Slider defaultValue={[50]} max={100} />
        <Slider defaultValue={[25, 75]} max={100} />
      </div>
    ),
  },
  {
    name: "Toast",
    slug: "toast",
    description: "Lightweight toast notifications with auto-dismiss and close button.",
    importStatement: "import { toast } from \"@/components/ui/toast\"",
    customised: true,
    customNotes: "Built on Base UI Toast for full styling control. Element Plus-inspired: compact, always stacked vertically, close button enabled. Supports promise-based toasts with loading state.",
    example: (
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="outline" onClick={() => toast("Event has been created")}>
          Default
        </Button>
        <Button size="sm" variant="outline" onClick={() => toast.success("Successfully saved!")}>
          Success
        </Button>
        <Button size="sm" variant="outline" onClick={() => toast.error("Something went wrong")}>
          Error
        </Button>
        <Button size="sm" variant="outline" onClick={() => toast.warning("Please review your changes")}>
          Warning
        </Button>
        <Button size="sm" variant="outline" onClick={() => toast.info("New update available")}>
          Info
        </Button>
        <Button size="sm" variant="outline" onClick={() => {
          toast.promise(
            new Promise((resolve) => setTimeout(resolve, 2000)),
            {
              loading: "Saving changes...",
              success: "Changes saved successfully!",
              error: "Failed to save changes",
            }
          )
        }}>
          Promise (2s)
        </Button>
        <Button size="sm" variant="outline" onClick={() => {
          toast.success("First notification")
          setTimeout(() => toast.info("Second notification"), 100)
          setTimeout(() => toast.warning("Third notification"), 200)
        }}>
          Show Multiple
        </Button>
      </div>
    ),
  },
  {
    name: "Switch",
    slug: "switch",
    description: "Toggle switch for on/off states.",
    importStatement: "import { Switch } from \"@/components/ui/switch\"",
    customised: true,
    customNotes: "Cursor styles (pointer, not-allowed when disabled)",
    example: (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Switch id="notifications" />
          <Label htmlFor="notifications">Enable notifications</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch id="dark-mode" defaultChecked />
          <Label htmlFor="dark-mode">Dark mode</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch id="disabled-switch" disabled />
          <Label htmlFor="disabled-switch" className="text-muted-foreground">Disabled option</Label>
        </div>
      </div>
    ),
  },
  {
    name: "Table",
    slug: "table",
    description: "Semantic table with Header, Body, Row, Head, and Cell components.",
    importStatement: "import { Table, TableHeader, TableBody, ... } from \"@/components/ui/table\"",
    customised: false,
    example: (
      <Table className="text-sm">
        <TableHeader>
          <TableRow className="bg-muted/100">
            <TableHead className="w-24">Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">Alice</TableCell>
            <TableCell><Badge variant="secondary">Active</Badge></TableCell>
            <TableCell className="text-right">$250.00</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Bob</TableCell>
            <TableCell><Badge variant="outline">Pending</Badge></TableCell>
            <TableCell className="text-right">$150.00</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Charlie</TableCell>
            <TableCell><Badge variant="destructive">Overdue</Badge></TableCell>
            <TableCell className="text-right">$75.00</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    ),
  },
  {
    name: "Tabs",
    slug: "tabs",
    description: "Keyboard-navigable tabbed content panels with lazy or eager rendering.",
    importStatement: "import { Tabs, TabsList, TabsTrigger, ... } from \"@/components/ui/tabs\"",
    customised: true,
    customNotes: "Cursor styles (pointer, not-allowed when disabled)",
    example: (
      <Tabs defaultValue="account" className="w-full max-w-sm">
        <TabsList>
          <TabsTrigger value="account"><UserIcon className="size-4" />Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="disabled" disabled>Disabled</TabsTrigger>
        </TabsList>
        <TabsContent value="account" className="p-3 text-sm">
          Manage your account settings and preferences.
        </TabsContent>
        <TabsContent value="password" className="p-3 text-sm">
          Change your password here.
        </TabsContent>
        <TabsContent value="settings" className="p-3 text-sm">
          Configure application settings.
        </TabsContent>
      </Tabs>
    ),
  },
  {
    name: "Textarea",
    slug: "textarea",
    description: "Multi-line text input for longer content.",
    importStatement: "import { Textarea } from \"@/components/ui/textarea\"",
    customised: false,
    example: (
      <Textarea placeholder="Enter your message..." className="max-w-xs" rows={3} />
    ),
  },
  {
    name: "Toggle",
    slug: "toggle",
    description: "Two-state button (pressed/unpressed). Use for binary toggles like text formatting.",
    importStatement: "import { Toggle } from \"@/components/ui/toggle\"",
    customised: true,
    customNotes: "Added cursor-pointer, data-[pressed] states, and background transitions",
    example: (
      <div className="flex gap-2">
        <Toggle
          size="sm"
          variant="outline"
          defaultPressed
          aria-label="Toggle star"
          className="data-[pressed]:*:[svg]:fill-amber-500 data-[pressed]:*:[svg]:stroke-amber-500"
        >
          <StarIcon className="size-4" />
          Star
        </Toggle>
        <Toggle
          size="sm"
          variant="outline"
          aria-label="Toggle heart"
          className="data-[pressed]:*:[svg]:fill-red-500 data-[pressed]:*:[svg]:stroke-red-500"
        >
          <HeartIcon className="size-4" />
          Heart
        </Toggle>
        <Toggle
          size="sm"
          variant="outline"
          aria-label="Toggle bookmark"
          className="data-[pressed]:*:[svg]:fill-blue-500 data-[pressed]:*:[svg]:stroke-blue-500"
        >
          <BookmarkIcon className="size-4" />
          Bookmark
        </Toggle>
      </div>
    ),
  },
  {
    name: "Tooltip",
    slug: "tooltip",
    description: "Contextual information on hover or focus.",
    importStatement: "import { Tooltip, TooltipTrigger, ... } from \"@/components/ui/tooltip\"",
    customised: false,
    example: (
      <TooltipProvider>
        <div className="flex gap-3">
          <Tooltip>
            <TooltipTrigger render={<Button variant="outline" size="sm" />}>
              Hover me
            </TooltipTrigger>
            <TooltipContent>
              <p>Helpful information</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    ),
  },
]

// =============================================================================
// MAIN PAGE
// =============================================================================

export default function UIComponentsPage() {
  return (
    <DocsAccordionPage
      title="UI Components"
      description="Pre-installed shadcn/ui primitives ready to use."
      items={COMPONENTS}
      searchPlaceholder="Search components..."
      renderOverview={() => (
        <>
          <p className="text-muted-foreground">
            These are <strong className="text-foreground">shadcn/ui</strong> primitives — 
            a collection of accessible, customisable components built on Base UI and 
            styled with Tailwind 4 CSS.
          </p>

          <div className="bg-muted space-y-3 rounded-lg p-4">
            <p className="font-medium">Adding new components</p>
            <code className="bg-background block rounded border px-3 py-2 text-sm">
              npx shadcn@latest add [component-name]
            </code>
            <p className="text-muted-foreground text-sm">
              This installs the component to <code className="text-foreground">components/ui/</code> where 
              you can customise it.
            </p>
          </div>

          <div className="bg-muted space-y-3 rounded-lg p-4">
            <p className="font-medium">Component headers</p>
            <p className="text-muted-foreground text-sm">
              Each component file has a header showing whether it&apos;s stock or customised. 
              Stock components are safe to overwrite during upgrades. Customised components 
              need manual review.
            </p>
            <div className="flex gap-2">
              <Badge variant="secondary">Stock</Badge>
              <Badge variant="default">Customised</Badge>
            </div>
          </div>

          <div className="flex gap-3">
            <a
              href="https://ui.shadcn.com/docs/components"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground inline-flex items-center text-sm underline underline-offset-4"
            >
              Full shadcn/ui Library <ExternalLinkIcon className="ml-1 size-3" />
            </a>
          </div>
        </>
      )}
      renderTrigger={(component) => (
        <div className="flex items-center gap-3">
          <span>{component.name}</span>
          {component.customised ? (
            <Badge>Customised</Badge>
          ) : (
            <Badge variant="secondary">Stock</Badge>
          )}
        </div>
      )}
      renderItem={(component) => (
        <>
          {/* Description + Example */}
          <p className="text-muted-foreground">{component.description}</p>
          {component.example && (
            <div className="overflow-visible py-2">
              {component.example}
            </div>
          )}

          {/* Customisation notes */}
          {component.customised && component.customNotes && (
            <div className="bg-muted rounded-lg px-3 py-2">
              <p className="text-sm">
                <span className="font-medium">Customised:</span>{" "}
                <span className="text-muted-foreground">{component.customNotes}</span>
              </p>
            </div>
          )}

          {/* Import */}
          <code className="bg-muted text-muted-foreground block overflow-x-auto rounded px-3 py-2 text-xs">
            {component.importStatement}
          </code>

          {/* Link to shadcn */}
          <a
            href={`https://ui.shadcn.com/docs/components/${component.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground inline-flex items-center text-xs underline underline-offset-4"
          >
            View on shadcn/ui <ExternalLinkIcon className="ml-1 size-3" />
          </a>
        </>
      )}
    />
  )
}
