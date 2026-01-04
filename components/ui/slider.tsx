/**
 * CATALYST - Slider Component
 *
 * Hybrid CSS/Tailwind approach — Tailwind always wins:
 *
 * BASE CSS (design/components/ui.css in @layer components):
 * - Layout, sizing, border radius, focus ring, disabled state
 * - Thumb sizing + transitions
 *
 * TAILWIND (below):
 * - Colors and orientation-specific sizing
 *
 * @source shadcn/ui + @base-ui/react
 */

"use client"

import * as React from "react"
import { Slider as SliderPrimitive } from "@base-ui/react/slider"

import { cn } from "@/lib/utils"

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: SliderPrimitive.Root.Props) {
  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
          ? defaultValue
          : [min, max],
    [value, defaultValue, min, max]
  )

  return (
    <SliderPrimitive.Root
      className="ui-slider data-horizontal:w-full data-vertical:h-full"
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      thumbAlignment="edge"
      {...props}
    >
      <SliderPrimitive.Control
        className={cn(
          "ui-slider__control data-vertical:min-h-40 w-full select-none data-disabled:opacity-50 data-vertical:h-full data-vertical:w-auto data-vertical:flex-col",
          className
        )}
      >
        <SliderPrimitive.Track
          data-slot="slider-track"
          className="ui-slider__track bg-muted data-horizontal:h-1.5 data-horizontal:w-full data-vertical:h-full data-vertical:w-1.5 relative overflow-hidden select-none"
        >
          <SliderPrimitive.Indicator
            data-slot="slider-range"
            className="ui-slider__range bg-primary select-none data-horizontal:h-full data-vertical:w-full"
          />
        </SliderPrimitive.Track>
        {Array.from({ length: _values.length }, (_, index) => (
          <SliderPrimitive.Thumb
            data-slot="slider-thumb"
            key={index}
            className="ui-slider__thumb border-primary bg-white ring-ring/50 data-disabled:cursor-not-allowed data-disabled:opacity-50"
          />
        ))}
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  )
}

export { Slider }
