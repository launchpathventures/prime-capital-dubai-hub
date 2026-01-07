/**
 * CATALYST - Stats Admin Client Component
 */

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Stack, Row, Grid, Text, Title } from "@/components/core"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
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
} from "lucide-react"
import { StatForm } from "./stat-form"
import { deleteStat, type StatRow } from "@/lib/actions/cms"
import { toast } from "@/components/ui/toast"

type StatsClientProps = {
  stats: StatRow[]
}

export function StatsClient({ stats }: StatsClientProps) {
  const router = useRouter()
  const [formOpen, setFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<StatRow | undefined>()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<StatRow | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  function handleCreate() {
    setEditingItem(undefined)
    setFormOpen(true)
  }

  function handleEdit(item: StatRow) {
    setEditingItem(item)
    setFormOpen(true)
  }

  function handleDeleteClick(item: StatRow) {
    setItemToDelete(item)
    setDeleteDialogOpen(true)
  }

  async function handleDeleteConfirm() {
    if (!itemToDelete) return
    
    setIsDeleting(true)
    try {
      const result = await deleteStat(itemToDelete.id)
      if (result.success) {
        toast.success("Statistic deleted successfully")
        setDeleteDialogOpen(false)
        setItemToDelete(null)
        router.refresh()
      } else {
        toast.error(result.error)
      }
    } catch (error) {
      toast.error("Failed to delete statistic")
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
            <Title size="h3">Statistics</Title>
            <Text variant="muted">
              Manage homepage credibility statistics
            </Text>
          </Stack>
          <Button onClick={handleCreate}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Stat
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
                  Statistics are stored in your Supabase database. Changes sync to the homepage immediately.
                </Text>
              </Stack>
            </Row>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <Card>
          <CardHeader>
            <CardTitle>Homepage Statistics ({stats.length})</CardTitle>
            <CardDescription>
              These statistics appear in the stats bar on the homepage
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stats.length > 0 ? (
              <Grid cols={2} gap="lg">
                {stats.map((stat) => (
                  <Card key={stat.id} className="bg-muted/30">
                    <CardContent className="pt-6">
                      <Stack gap="md">
                        <Row justify="between" align="start">
                          <Stack gap="xs">
                            <Text size="sm" variant="muted">Value</Text>
                            <Text size="2xl" weight="bold" className="text-primary">
                              {stat.value}
                            </Text>
                          </Stack>
                          <Row gap="xs">
                            <Button 
                              variant="ghost" 
                              size="icon-sm"
                              onClick={() => handleEdit(stat)}
                            >
                              <PencilIcon className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon-sm"
                              onClick={() => handleDeleteClick(stat)}
                            >
                              <TrashIcon className="h-4 w-4" />
                            </Button>
                          </Row>
                        </Row>

                        <div className="h-px bg-border" />

                        <Stack gap="xs">
                          <Text size="sm" weight="medium">{stat.label}</Text>
                          {stat.description && (
                            <Text size="xs" variant="muted">{stat.description}</Text>
                          )}
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
              </Grid>
            ) : (
              <Stack gap="md" align="center" className="py-12">
                <Text variant="muted">No statistics found</Text>
                <Button onClick={handleCreate}>
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add First Statistic
                </Button>
              </Stack>
            )}
          </CardContent>
        </Card>
      </Stack>

      {/* Create/Edit Form Dialog */}
      <StatForm 
        stat={editingItem}
        open={formOpen}
        onOpenChange={setFormOpen}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Statistic</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the &quot;{itemToDelete?.label}&quot; statistic? 
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
