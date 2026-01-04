/**
 * CATALYST - Card Component
 *
 * Hybrid CSS/Tailwind approach — Tailwind always wins:
 *
 * BASE CSS (design/components/ui.css in @layer components):
 * - Layout, sizing, padding, border radius, overflow
 * - Size variants via data-size attribute
 * - Image handling for first/last child
 *
 * TAILWIND (below):
 * - Colors only (bg, border, text, shadow)
 *
 * PADDING NOTES:
 * Card has vertical padding (py-4) built in. When using CardFooter with
 * border-t, the CSS automatically adds padding-top. Add `pb-0` to Card
 * so the footer sits flush:
 *
 *   <Card className="pb-0">
 *     <CardContent>...</CardContent>
 *     <CardFooter className="border-t bg-muted/30">...</CardFooter>
 *   </Card>
 *
 * @source shadcn/ui v3.6.2
 */

import * as React from "react"

import { cn } from "@/lib/utils"

function Card({
  className,
  size = "default",
  ...props
}: React.ComponentProps<"div"> & { size?: "default" | "sm" }) {
  return (
    <div
      data-slot="card"
      data-size={size}
      className={cn(
        "ui-card",
        "border-border bg-card text-card-foreground shadow-xs",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn("ui-card__header", className)}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("ui-card__title", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("ui-card__description", "text-muted-foreground", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn("ui-card__action", className)}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("ui-card__content", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("ui-card__footer", className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
