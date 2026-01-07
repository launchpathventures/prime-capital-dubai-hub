/**
 * CATALYST - Testimonials Admin Client Component
 */

"use client"

import { useState } from "react"
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
  Loader2Icon,
  DatabaseIcon,
  QuoteIcon,
} from "lucide-react"
import { TestimonialForm } from "./testimonial-form"
import { deleteTestimonial, type TestimonialRow } from "@/lib/actions/cms"
import { toast } from "@/components/ui/toast"

type TestimonialsClientProps = {
  testimonials: TestimonialRow[]
}

export function TestimonialsClient({ testimonials }: TestimonialsClientProps) {
  const router = useRouter()
  const [formOpen, setFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<TestimonialRow | undefined>()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<TestimonialRow | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  function handleCreate() {
    setEditingItem(undefined)
    setFormOpen(true)
  }

  function handleEdit(item: TestimonialRow) {
    setEditingItem(item)
    setFormOpen(true)
  }

  function handleDeleteClick(item: TestimonialRow) {
    setItemToDelete(item)
    setDeleteDialogOpen(true)
  }

  async function handleDeleteConfirm() {
    if (!itemToDelete) return
    
    setIsDeleting(true)
    try {
      const result = await deleteTestimonial(itemToDelete.id)
      if (result.success) {
        toast.success("Testimonial deleted successfully")
        setDeleteDialogOpen(false)
        setItemToDelete(null)
        router.refresh()
      } else {
        toast.error(result.error)
      }
    } catch (error) {
      toast.error("Failed to delete testimonial")
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
            <Title size="h3">Testimonials</Title>
            <Text variant="muted">
              Manage client testimonials
            </Text>
          </Stack>
          <Button onClick={handleCreate}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Testimonial
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
                  Testimonials are stored in your Supabase database. Changes sync to the homepage immediately.
                </Text>
              </Stack>
            </Row>
          </CardContent>
        </Card>

        {/* Testimonials Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Testimonials ({testimonials.length})</CardTitle>
            <CardDescription>
              Client testimonials displayed on the homepage
            </CardDescription>
          </CardHeader>
          <CardContent>
            {testimonials.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50%]">Quote</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {testimonials.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Row gap="sm" align="start">
                          <QuoteIcon className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                          <Text size="sm" className="line-clamp-2">
                            {item.quote}
                          </Text>
                        </Row>
                      </TableCell>
                      <TableCell>
                        <Stack gap="none">
                          <Text size="sm" weight="medium">{item.author}</Text>
                          {item.context && (
                            <Text size="xs" variant="muted">{item.context}</Text>
                          )}
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Text size="sm">{item.location}</Text>
                      </TableCell>
                      <TableCell className="text-right">
                        <Row gap="xs" justify="end">
                          <Button 
                            variant="ghost" 
                            size="icon-sm"
                            onClick={() => handleEdit(item)}
                          >
                            <PencilIcon className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon-sm"
                            onClick={() => handleDeleteClick(item)}
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
                <Text variant="muted">No testimonials found</Text>
                <Button onClick={handleCreate}>
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add First Testimonial
                </Button>
              </Stack>
            )}
          </CardContent>
        </Card>
      </Stack>

      {/* Create/Edit Form Dialog */}
      <TestimonialForm 
        testimonial={editingItem}
        open={formOpen}
        onOpenChange={setFormOpen}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Testimonial</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this testimonial from {itemToDelete?.author}? 
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
