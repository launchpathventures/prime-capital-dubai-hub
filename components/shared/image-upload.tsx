/**
 * Image Upload Component
 *
 * Reusable image upload with preview and drag-and-drop support.
 * Team photos are visually cropped before upload so public cards receive a
 * predictable square source instead of relying on CSS to guess the framing.
 */

"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import Image from "next/image"
import { Stack, Text } from "@/components/core"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UploadIcon, XIcon, ImageIcon, Loader2Icon } from "lucide-react"
import { uploadCmsImage } from "@/lib/actions/cms"
import { toast } from "@/components/ui/toast"
import { cn } from "@/lib/utils"
import {
  TeamPhotoCropDialog,
  type TeamPhotoCropSource,
} from "@/components/shared/team-photo-crop-dialog"

type ImageUploadProps = {
  label: string
  value: string | null
  onChange: (url: string | null) => void
  folder: "properties" | "team"
  aspectRatio?: "square" | "video" | "portrait"
  placeholder?: string
  guidance?: string
}

export function ImageUpload({
  label,
  value,
  onChange,
  folder,
  aspectRatio = "video",
  placeholder = "Click to upload or drag and drop",
  guidance,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [urlInputValue, setUrlInputValue] = useState("")
  const [cropSource, setCropSource] = useState<TeamPhotoCropSource | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const aspectClasses = {
    square: "aspect-square",
    video: "aspect-video",
    portrait: "aspect-[3/4]",
  }

  const uploadFile = useCallback(async (file: File) => {
    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const result = await uploadCmsImage(formData, folder)

      if (result.success) {
        onChange(result.data)
        toast.success("Image uploaded successfully")
      } else {
        toast.error(result.error)
      }
    } catch {
      toast.error("Failed to upload image")
    } finally {
      setIsUploading(false)
    }
  }, [folder, onChange])

  const openCropper = useCallback((file: File) => {
    const url = URL.createObjectURL(file)
    const image = new window.Image()

    image.onload = () => {
      setCropSource({ file, image, url })
    }
    image.onerror = () => {
      URL.revokeObjectURL(url)
      toast.error("This image could not be opened")
    }
    image.src = url
  }, [])

  const handleFileSelect = useCallback((file: File) => {
    if (folder === "team" && aspectRatio === "square") {
      openCropper(file)
      return
    }

    void uploadFile(file)
  }, [aspectRatio, folder, openCropper, uploadFile])

  useEffect(() => {
    return () => {
      if (cropSource) URL.revokeObjectURL(cropSource.url)
    }
  }, [cropSource])

  const handleCropConfirm = useCallback(async (file: File) => {
    setCropSource(null)
    await uploadFile(file)
  }, [uploadFile])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
    e.target.value = ""
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith("image/")) {
      handleFileSelect(file)
    } else {
      toast.error("Please drop a valid image file")
    }
  }, [handleFileSelect])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleUrlSubmit = () => {
    if (urlInputValue.trim()) {
      onChange(urlInputValue.trim())
      setUrlInputValue("")
      setShowUrlInput(false)
    }
  }

  const handleRemove = () => {
    onChange(null)
  }

  return (
    <Stack gap="sm">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        {folder !== "team" && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="text-xs h-7"
          >
            {showUrlInput ? "Upload file" : "Use URL instead"}
          </Button>
        )}
      </div>

      {showUrlInput ? (
        <div className="flex gap-2">
          <Input
            value={urlInputValue}
            onChange={(e) => setUrlInputValue(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="flex-1"
          />
          <Button
            type="button"
            onClick={handleUrlSubmit}
            disabled={!urlInputValue.trim()}
          >
            Add
          </Button>
        </div>
      ) : (
        <div
          className={cn(
            "relative border-2 border-dashed rounded-lg overflow-hidden transition-colors cursor-pointer",
            aspectClasses[aspectRatio],
            isDragging
              ? "border-primary bg-primary/5"
              : value
                ? "border-transparent"
                : "border-muted-foreground/25 hover:border-muted-foreground/50"
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => !value && inputRef.current?.click()}
        >
          {isUploading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <Stack gap="sm" align="center">
                <Loader2Icon className="h-8 w-8 animate-spin text-muted-foreground" />
                <Text size="sm" variant="muted">Uploading...</Text>
              </Stack>
            </div>
          ) : value ? (
            <>
              <Image
                src={value}
                alt="Preview"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={(e) => {
                    e.stopPropagation()
                    inputRef.current?.click()
                  }}
                >
                  <UploadIcon className="h-4 w-4 mr-1" />
                  Replace
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemove()
                  }}
                >
                  <XIcon className="h-4 w-4 mr-1" />
                  Remove
                </Button>
              </div>
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Stack gap="sm" align="center" className="text-center p-4">
                <ImageIcon className="h-10 w-10 text-muted-foreground" />
                <Text size="sm" variant="muted">{placeholder}</Text>
                <Text size="xs" variant="muted">JPEG, PNG, WebP or GIF (max 10MB)</Text>
                {guidance && <Text size="xs" variant="muted">{guidance}</Text>}
              </Stack>
            </div>
          )}

          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleInputChange}
            className="hidden"
          />
        </div>
      )}

      <TeamPhotoCropDialog
        source={cropSource}
        onCancel={() => setCropSource(null)}
        onConfirm={handleCropConfirm}
      />
    </Stack>
  )
}
