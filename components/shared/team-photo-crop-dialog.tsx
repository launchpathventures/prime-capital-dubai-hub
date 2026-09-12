/**
 * CATALYST - Team Photo Crop Dialog
 *
 * Produces a predictable square team portrait while letting an editor choose
 * the subject framing instead of relying on automatic crop heuristics.
 */

"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Row, Stack, Text } from "@/components/core"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { toast } from "@/components/ui/toast"
import { Loader2Icon } from "lucide-react"

export type TeamPhotoCropSource = {
  file: File
  image: HTMLImageElement
  url: string
}

type TeamPhotoCropDialogProps = {
  source: TeamPhotoCropSource | null
  onCancel: () => void
  onConfirm: (file: File) => Promise<void>
}

const TEAM_PHOTO_SIZE = 1200

function getSliderValue(value: number | readonly number[], fallback: number): number {
  return typeof value === "number" ? value : value[0] ?? fallback
}

export function TeamPhotoCropDialog({ source, onCancel, onConfirm }: TeamPhotoCropDialogProps) {
  const [isCropping, setIsCropping] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [positionX, setPositionX] = useState(50)
  const [positionY, setPositionY] = useState(50)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const resetCrop = useCallback(() => {
    setZoom(1)
    setPositionX(50)
    setPositionY(50)
  }, [])

  useEffect(() => {
    if (source) resetCrop()
  }, [resetCrop, source])

  useEffect(() => {
    if (!source || !canvasRef.current) return

    const canvas = canvasRef.current
    const context = canvas.getContext("2d")
    if (!context) return

    const coverScale = Math.max(
      TEAM_PHOTO_SIZE / source.image.naturalWidth,
      TEAM_PHOTO_SIZE / source.image.naturalHeight
    )
    const scale = coverScale * zoom
    const width = source.image.naturalWidth * scale
    const height = source.image.naturalHeight * scale
    const x = -(width - TEAM_PHOTO_SIZE) * (positionX / 100)
    const y = -(height - TEAM_PHOTO_SIZE) * (positionY / 100)

    context.clearRect(0, 0, TEAM_PHOTO_SIZE, TEAM_PHOTO_SIZE)
    context.imageSmoothingEnabled = true
    context.imageSmoothingQuality = "high"
    context.drawImage(source.image, x, y, width, height)
  }, [positionX, positionY, source, zoom])

  const applyCrop = useCallback(async () => {
    const canvas = canvasRef.current
    if (!canvas || !source) return

    setIsCropping(true)
    try {
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (result) => result ? resolve(result) : reject(new Error("Failed to crop image")),
          "image/jpeg",
          0.9
        )
      })
      const baseName = source.file.name.replace(/\.[^.]+$/, "")
      const croppedFile = new File([blob], `${baseName}-square.jpg`, { type: "image/jpeg" })

      await onConfirm(croppedFile)
    } catch {
      toast.error("Failed to crop image")
    } finally {
      setIsCropping(false)
    }
  }, [onConfirm, source])

  return (
    <Dialog
      open={source !== null}
      onOpenChange={(open) => {
        if (!open && !isCropping) onCancel()
      }}
    >
      <DialogContent className="team-photo-crop max-h-[90dvh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Frame the team photo</DialogTitle>
          <DialogDescription>
            Position the person consistently inside the square. This is the exact crop used on team cards and profiles.
          </DialogDescription>
        </DialogHeader>

        <div className="team-photo-crop__preview mx-auto w-full max-w-[32rem] overflow-hidden rounded-md bg-muted">
          <canvas
            ref={canvasRef}
            width={TEAM_PHOTO_SIZE}
            height={TEAM_PHOTO_SIZE}
            className="block aspect-square h-auto w-full"
          />
        </div>

        <Stack gap="md">
          <Stack gap="xs">
            <Row align="center" justify="between">
              <Label>Zoom</Label>
              <Text size="xs" variant="muted">{zoom.toFixed(1)}×</Text>
            </Row>
            <Slider
              value={[zoom]}
              min={1}
              max={3}
              step={0.05}
              onValueChange={(value) => setZoom(getSliderValue(value, 1))}
              aria-label="Photo zoom"
            />
          </Stack>

          <Stack gap="xs">
            <Row align="center" justify="between">
              <Label>Horizontal focus</Label>
              <Text size="xs" variant="muted">Left ↔ Right</Text>
            </Row>
            <Slider
              value={[positionX]}
              min={0}
              max={100}
              step={1}
              onValueChange={(value) => setPositionX(getSliderValue(value, 50))}
              aria-label="Horizontal photo position"
            />
          </Stack>

          <Stack gap="xs">
            <Row align="center" justify="between">
              <Label>Vertical focus</Label>
              <Text size="xs" variant="muted">Top ↕ Bottom</Text>
            </Row>
            <Slider
              value={[positionY]}
              min={0}
              max={100}
              step={1}
              onValueChange={(value) => setPositionY(getSliderValue(value, 50))}
              aria-label="Vertical photo position"
            />
          </Stack>
        </Stack>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel} disabled={isCropping}>
            Cancel
          </Button>
          <Button type="button" variant="ghost" onClick={resetCrop} disabled={isCropping}>
            Reset
          </Button>
          <Button type="button" onClick={() => void applyCrop()} disabled={isCropping}>
            {isCropping ? (
              <>
                <Loader2Icon className="h-4 w-4 animate-spin" />
                Preparing photo...
              </>
            ) : (
              "Use this crop"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
