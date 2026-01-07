/**
 * CATALYST - Properties Admin Client Component
 * 
 * Client-side logic for properties CRUD operations.
 */

"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
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
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ExternalLinkIcon,
  Loader2Icon,
  DatabaseIcon,
} from "lucide-react"
import { PropertyForm } from "./property-form"
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
  const [formOpen, setFormOpen] = useState(false)
  const [editingProperty, setEditingProperty] = useState<PropertyRow | undefined>()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [propertyToDelete, setPropertyToDelete] = useState<PropertyRow | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  function handleCreate() {
    setEditingProperty(undefined)
    setFormOpen(true)
  }

  function handleEdit(property: PropertyRow) {
    setEditingProperty(property)
    setFormOpen(true)
  }

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
    } catch (error) {
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
          <Button onClick={handleCreate}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Property
          </Button>
        </Row>

        {/* Connected Badge */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <Row gap="md" align="start">
              <DatabaseIcon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <Stack gap="xs">
                <Text weight="medium">Connected to Supabase</Text>
                <Text size="sm" variant="muted">
                  Properties are stored in your Supabase database. Changes sync to the public website immediately.
                </Text>
              </Stack>
            </Row>
          </CardContent>
        </Card>

        {/* Properties Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Properties ({properties.length})</CardTitle>
            <CardDescription>
              Click a property to view on the public website
            </CardDescription>
          </CardHeader>
          <CardContent>
            {properties.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Property</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Price Range</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {properties.map((property) => (
                    <TableRow key={property.id}>
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
                        {property.featured && (
                          <Badge variant="outline" className="ml-1">Featured</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Row gap="xs" justify="end">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            nativeButton={false}
                            render={<Link href={`/properties/${property.slug}`} target="_blank" />}
                          >
                            <ExternalLinkIcon className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon-sm"
                            onClick={() => handleEdit(property)}
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
                <Button onClick={handleCreate}>
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add First Property
                </Button>
              </Stack>
            )}
          </CardContent>
        </Card>
      </Stack>

      {/* Create/Edit Form Dialog */}
      <PropertyForm 
        property={editingProperty}
        open={formOpen}
        onOpenChange={setFormOpen}
      />

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
