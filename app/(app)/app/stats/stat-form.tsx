/**
 * CATALYST - Stat Form Component
 */

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Stack } from "@/components/core"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Loader2Icon } from "lucide-react"
import { 
  createStat, 
  updateStat, 
  type StatRow, 
  type StatInput 
} from "@/lib/actions/cms"
import { toast } from "@/components/ui/toast"

type StatFormProps = {
  stat?: StatRow
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function StatForm({ stat, open, onOpenChange }: StatFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const isEditing = !!stat

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    
    const input: StatInput = {
      label: formData.get("label") as string,
      value: formData.get("value") as string,
      description: formData.get("description") as string || null,
      display_order: formData.get("display_order") ? Number(formData.get("display_order")) : 0,
    }

    try {
      if (isEditing) {
        const result = await updateStat(stat.id, input)
        if (result.success) {
          toast.success("Stat updated successfully")
          onOpenChange(false)
          router.refresh()
        } else {
          toast.error(result.error)
        }
      } else {
        const result = await createStat(input)
        if (result.success) {
          toast.success("Stat created successfully")
          onOpenChange(false)
          router.refresh()
        } else {
          toast.error(result.error)
        }
      }
    } catch (error) {
      toast.error("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Statistic" : "Add New Statistic"}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Update the statistic details below." 
              : "Add a new homepage statistic."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <Stack gap="md">
            <div>
              <Label htmlFor="value">Value *</Label>
              <Input 
                id="value" 
                name="value" 
                defaultValue={stat?.value}
                placeholder="e.g. AED 500M+"
                required 
              />
              <p className="text-xs text-muted-foreground mt-1">
                The main statistic number/text (e.g. "15+", "$500M", "98%")
              </p>
            </div>
            
            <div>
              <Label htmlFor="label">Label *</Label>
              <Input 
                id="label" 
                name="label" 
                defaultValue={stat?.label}
                placeholder="e.g. Total Transaction Value"
                required 
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Input 
                id="description" 
                name="description" 
                defaultValue={stat?.description || ""}
                placeholder="Additional context..."
              />
            </div>
            
            <div>
              <Label htmlFor="display_order">Display Order</Label>
              <Input 
                id="display_order" 
                name="display_order" 
                type="number"
                defaultValue={stat?.display_order || 0}
                placeholder="0"
              />
            </div>

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />}
                {isEditing ? "Save Changes" : "Add Statistic"}
              </Button>
            </DialogFooter>
          </Stack>
        </form>
      </DialogContent>
    </Dialog>
  )
}
