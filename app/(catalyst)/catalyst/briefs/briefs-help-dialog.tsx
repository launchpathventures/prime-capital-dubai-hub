/**
 * CATALYST - Briefs Help Dialog
 *
 * Engaging reference for how briefs work and the workflow for managing them.
 */

"use client"

import * as React from "react"
import { Stack, Row, Text } from "@/components/core"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FileText, Info, Pencil, FolderCheck, ArrowRight, Lightbulb, Target, Sparkles, MessageSquare } from "lucide-react"

export function BriefsHelpDialog() {
  return (
    <Dialog>
      <DialogTrigger
        nativeButton
        render={
          <Button size="sm" className="gap-2 w-auto">
            <Info className="h-4 w-4" />
            How briefs work
          </Button>
        }
      />

      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <Row gap="sm" align="center">
            <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <Row gap="sm" align="center">
                <DialogTitle className="text-lg">How briefs work</DialogTitle>
                <Badge variant="outline" className="text-xs border-border bg-muted/50 text-muted-foreground">
                  Quick guide
                </Badge>
              </Row>
              <DialogDescription className="text-xs">
                Your project's unit of work
              </DialogDescription>
            </div>
          </Row>
        </DialogHeader>

        <Stack gap="lg" className="pt-2">
          {/* What are briefs */}
          <Text size="sm" variant="muted">
            Briefs are markdown PRDs (Project Requirement Documents) that scope features or tasks. They live in{" "}
            <code className="bg-muted px-1.5 py-0.5 rounded text-xs">catalyst/briefs/</code> and
            give AI Agents / Teams the context needed to implement work correctly.
          </Text>

          {/* Workflow steps */}
          <div className="space-y-3">
            <Text size="sm" weight="medium">The workflow:</Text>
            <div className="space-y-2.5">
              <Row gap="sm" align="start">
                <div className="p-1.5 rounded-md bg-muted shrink-0 mt-0.5">
                  <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
                <div>
                  <Text size="sm" weight="medium">Create</Text>
                  <Text size="xs" variant="muted">
                    Run <code className="bg-muted px-1 py-0.5 rounded text-[10px]">/brief</code> to
                    draft a new brief with AI, or create one manually.
                  </Text>
                </div>
              </Row>
              <Row gap="sm" align="start">
                <div className="p-1.5 rounded-md bg-muted shrink-0 mt-0.5">
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
                <div>
                  <Text size="sm" weight="medium">Track progress</Text>
                  <Text size="xs" variant="muted">
                    AI tracks state in the filename: <code className="bg-muted px-1 py-0.5 rounded text-[10px]">active-</code>,{" "}
                    <code className="bg-muted px-1 py-0.5 rounded text-[10px]">_review-</code>,{" "}
                    <code className="bg-muted px-1 py-0.5 rounded text-[10px]">approved-</code>, etc.
                  </Text>
                </div>
              </Row>
              <Row gap="sm" align="start">
                <div className="p-1.5 rounded-md bg-muted shrink-0 mt-0.5">
                  <FolderCheck className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
                <div>
                  <Text size="sm" weight="medium">Complete</Text>
                  <Text size="xs" variant="muted">
                    When done, move the file to <code className="bg-muted px-1 py-0.5 rounded text-[10px]">complete/</code>.
                    Cancelled work goes to <code className="bg-muted px-1 py-0.5 rounded text-[10px]">archive/</code>.
                  </Text>
                </div>
              </Row>
            </div>
          </div>

          {/* A good brief */}
          <div className="space-y-3">
            <Text size="sm" weight="medium">A good brief:</Text>
            <div className="space-y-2">
              <Row gap="sm" align="start">
                <div className="p-1.5 rounded-md bg-emerald-500/10 shrink-0 mt-0.5">
                  <Target className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <Text size="xs" variant="muted">
                  <strong className="text-foreground">Defines the outcome</strong> — What does success look like? Be specific.
                </Text>
              </Row>
              <Row gap="sm" align="start">
                <div className="p-1.5 rounded-md bg-emerald-500/10 shrink-0 mt-0.5">
                  <MessageSquare className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <Text size="xs" variant="muted">
                  <strong className="text-foreground">Gives relevant context</strong> — Why does this matter? Who is it for?
                </Text>
              </Row>
              <Row gap="sm" align="start">
                <div className="p-1.5 rounded-md bg-emerald-500/10 shrink-0 mt-0.5">
                  <Sparkles className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <Text size="xs" variant="muted">
                  <strong className="text-foreground">Clarifies constraints vs. creativity</strong> — What's fixed? What's flexible?
                </Text>
              </Row>
            </div>
          </div>

          {/* Pro tip */}
          <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
            <Row gap="sm" align="start">
              <Lightbulb className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
              <Text size="xs" variant="muted">
                <strong className="text-foreground">Pro tip:</strong> Use the <strong>In Play</strong> filter to focus on active work. Completed and archived briefs are hidden by default but available via <strong>All</strong>.
              </Text>
            </Row>
          </div>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}
