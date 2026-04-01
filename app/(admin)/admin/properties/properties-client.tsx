/**
 * Properties Admin Client Component
 *
 * Client-side logic for properties CRUD operations.
 * Uses dedicated edit pages instead of modals for better UX.
 */

"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Stack, Row, Text, Title } from "@/components/core"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog"
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible"
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ExternalLinkIcon,
  Loader2Icon,
  BuildingIcon,
  TagIcon,
  HelpCircleIcon,
  ChevronDownIcon,
} from "lucide-react"
import { deleteProperty, type PropertyRow } from "@/lib/actions/cms"
import { toast } from "@/components/ui/toast"

type PropertiesClientProps = {
  properties: PropertyRow[]
}

function formatPrice(from: number | null, to: number | null, currency: string | null): string {
  const curr = currency || "AED"
  const formatShort = (n: number) => {
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`
    if (n >= 1000) return `${(n / 1000).toFixed(0)}K`
    return n.toString()
  }

  if (!from && !to) return "Price on request"
  if (from && !to) return `${curr} ${formatShort(from)}+`
  if (!from && to) return `Up to ${curr} ${formatShort(to)}`
  if (from === to) return `${curr} ${formatShort(from!)}`
  return `${curr} ${formatShort(from!)} - ${formatShort(to!)}`
}

export function PropertiesClient({ properties }: PropertiesClientProps) {
  const router = useRouter()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [propertyToDelete, setPropertyToDelete] = useState<PropertyRow | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  function handleDeleteClick(property: PropertyRow) {
    setPropertyToDelete(property)
    setDeleteDialogOpen(true)
  }

  async function handleDeleteConfirm() {
    if (!propertyToDelete) return

    setIsDeleting(true)
    try {
      const result = await deleteProperty(propertyToDelete.id)
      if (result.success) {
        toast.success("Property deleted successfully")
        setDeleteDialogOpen(false)
        setPropertyToDelete(null)
        router.refresh()
      } else {
        toast.error(result.error)
      }
    } catch {
      toast.error("Failed to delete property")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <Stack gap="xl">
        {/* Page Header */}
        <Row justify="between" align="center">
          <Stack gap="xs">
            <Title size="h3">Properties</Title>
            <Text variant="muted">
              Manage your property listings
            </Text>
          </Stack>
          <Button render={<Link href="/admin/properties/new" />}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Property
          </Button>
        </Row>

        {/* Distressed Property Guide */}
        <DistressedPropertyGuide />

        {/* Properties Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Properties ({properties.length})</CardTitle>
            <CardDescription>
              Click a row to edit, or use the action buttons
            </CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            {properties.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16"></TableHead>
                    <TableHead>Property</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Price Range</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right sticky right-0 bg-background pl-4 shadow-[inset_1px_0_0_var(--color-border)]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {properties.map((property) => (
                    <TableRow
                      key={property.id}
                      className="cursor-pointer"
                      onClick={() => router.push(`/admin/properties/${property.id}`)}
                    >
                      <TableCell>
                        <div className="w-12 h-12 rounded-md overflow-hidden bg-muted flex-shrink-0">
                          {property.cover_image ? (
                            <Image
                              src={property.cover_image}
                              alt={property.title}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <BuildingIcon className="h-5 w-5 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Stack gap="none">
                          <Text weight="medium">{property.title}</Text>
                          <Text size="xs" variant="muted">{property.developer}</Text>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {property.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Text size="sm">{property.location}</Text>
                      </TableCell>
                      <TableCell>
                        <Text size="sm">
                          {formatPrice(property.price_from, property.price_to, property.currency)}
                        </Text>
                      </TableCell>
                      <TableCell>
                        <Badge variant={property.status === "available" ? "default" : "secondary"}>
                          {property.status}
                        </Badge>
                        {property.tags?.includes("distressed") && (
                          <Badge variant="outline" className="ml-1">
                            <TagIcon className="h-3 w-3 mr-1" />
                            Distressed
                          </Badge>
                        )}
                        {property.featured && (
                          <Badge variant="outline" className="ml-1">Featured</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right sticky right-0 bg-card pl-4 shadow-[inset_1px_0_0_var(--color-border)]" onClick={(e) => e.stopPropagation()}>
                        <Row gap="xs" justify="end">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            render={<Link href={`/properties/${property.slug}`} target="_blank" />}
                          >
                            <ExternalLinkIcon className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            render={<Link href={`/admin/properties/${property.id}`} />}
                          >
                            <PencilIcon className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => handleDeleteClick(property)}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </Row>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Stack gap="md" align="center" className="py-12">
                <Text variant="muted">No properties found</Text>
                <Button render={<Link href="/admin/properties/new" />}>
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add First Property
                </Button>
              </Stack>
            )}
          </CardContent>
        </Card>
      </Stack>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Property</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{propertyToDelete?.title}&quot;?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting && <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

// =============================================================================
// DISTRESSED PROPERTY GUIDE
// Collapsible help card explaining how to create distressed property listings.
// =============================================================================

function DistressedPropertyGuide() {
  return (
    <Card>
      <Collapsible>
        <CardHeader className="pb-0">
          <CollapsibleTrigger
            render={<div role="button" tabIndex={0} />}
            className="group flex items-center justify-between w-full cursor-pointer"
          >
            <Row gap="md" align="start">
              <HelpCircleIcon className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <Stack gap="xs">
                <Text weight="medium">How to create a distressed property listing</Text>
                <Text size="sm" variant="muted">
                  Guide for setting up below-market deals with the right pricing, description, and features
                </Text>
              </Stack>
            </Row>
            <ChevronDownIcon className="h-4 w-4 text-muted-foreground shrink-0 transition-transform group-data-[open]:rotate-180" />
          </CollapsibleTrigger>
        </CardHeader>

        <CollapsibleContent>
          <CardContent className="pt-4">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Left column */}
              <Stack gap="md">
                <div>
                  <Text size="sm" weight="medium" className="mb-1">What is a distressed property?</Text>
                  <Text size="sm" variant="muted">
                    A property sold below market value by a motivated seller — typically due to financial
                    pressure, payment plan assumptions, or urgent timelines. These appear on the dedicated
                    distressed deals page and are tagged for CRM routing.
                  </Text>
                </div>

                <div>
                  <Text size="sm" weight="medium" className="mb-1">Setting up pricing</Text>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-4">
                    <li><strong>Price From</strong> — the current asking price (discounted amount)</li>
                    <li><strong>Price To</strong> — the original price or market value</li>
                    <li>The public page shows Price From as the headline with Price To crossed out</li>
                  </ul>
                </div>

                <div>
                  <Text size="sm" weight="medium" className="mb-1">Writing the description</Text>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-4">
                    <li>State the discount — &quot;Original price AED X, now offered at AED Y&quot;</li>
                    <li>Mention payment plan status — e.g. &quot;60% already paid by seller&quot;</li>
                    <li>Include handover timeline if off-plan</li>
                    <li>Keep the tone factual and restrained — no urgency language</li>
                  </ul>
                </div>
              </Stack>

              {/* Right column */}
              <Stack gap="md">
                <div>
                  <Text size="sm" weight="medium" className="mb-1">Key features to include</Text>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-4">
                    <li>Payment split — e.g. &quot;60% Paid by Seller&quot;, &quot;40% Balance on Handover&quot;</li>
                    <li>Price context — e.g. &quot;Below Original Price&quot;, &quot;Lowest in Market&quot;</li>
                    <li>Standout specs — floor level, views, layout type</li>
                    <li>Keep to 4–5 concise features</li>
                  </ul>
                </div>

                <div>
                  <Text size="sm" weight="medium" className="mb-1">Before publishing checklist</Text>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-4">
                    <li>Toggle &quot;Distressed Sale&quot; on in Settings</li>
                    <li>Set Price From (asking) and Price To (original)</li>
                    <li>Add a cover image</li>
                    <li>Write a description explaining the discount and payment terms</li>
                    <li>Add 4–5 features highlighting the deal specifics</li>
                    <li>Toggle &quot;Published&quot; when ready</li>
                  </ul>
                </div>

                <div>
                  <Text size="sm" weight="medium" className="mb-1">Example</Text>
                  <div className="rounded-md border bg-muted/50 p-3 text-xs space-y-1">
                    <Text size="xs" weight="medium">Sobha One Tower D — 1 Bed + Study</Text>
                    <Text size="xs" variant="muted">Price: AED 1,750,000 (original AED 1,870,000)</Text>
                    <Text size="xs" variant="muted">
                      &quot;High floor 1-bed + study with golf course views. 60% paid by seller — buyer
                      assumes 40% balance on handover.&quot;
                    </Text>
                    <Text size="xs" variant="muted">
                      Features: Golf Course View · High Floor · 60% Paid · 40% on Handover
                    </Text>
                  </div>
                </div>
              </Stack>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}
