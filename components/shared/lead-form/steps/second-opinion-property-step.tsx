/**
 * CATALYST - Second Opinion Property Step
 *
 * Captures one usable property source and uploads supporting documents before
 * the final review question so the shared enquiry submission stays compact.
 */

"use client"

import { useState } from "react"
import {
  FileTextIcon,
  LinkIcon,
  Loader2Icon,
  PenLineIcon,
  UploadIcon,
  XIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import {
  ALLOWED_DOCUMENT_TYPES,
  DOCUMENT_ACCEPT,
  LEAD_MAGNET_DOCUMENT_BUCKET,
  MAX_DOCUMENT_SIZE_BYTES,
  MAX_DOCUMENTS_PER_SUBMISSION,
} from "@/lib/lead-magnets/constants"
import type { LeadFormData } from "../types"
import { LeadFormBackButton } from "./back-button"

type PropertyRoute = "link" | "upload" | "typed"
type StoredDocument = NonNullable<LeadFormData["leadMagnetDocuments"]>[number]

interface PreparedUpload extends StoredDocument {
  uploadPath: string
  uploadToken: string
}

interface SecondOpinionPropertyStepProps {
  data: Partial<LeadFormData>
  onUpdate: (data: Partial<LeadFormData>) => void
  onNext: () => void
  onBack?: () => void
  canGoBack?: boolean
}

const routeOptions = [
  {
    value: "link",
    label: "Paste a link",
    description: "A listing or developer page",
    icon: LinkIcon,
  },
  {
    value: "upload",
    label: "Attach documents",
    description: "A brochure, floor plan or payment plan",
    icon: UploadIcon,
  },
  {
    value: "typed",
    label: "Type the details",
    description: "Property, community, price and bedrooms",
    icon: PenLineIcon,
  },
] as const

function getInitialRoute(data: Partial<LeadFormData>): PropertyRoute | null {
  if (data.propertyUrl) return "link"
  if (data.leadMagnetDocuments?.length) return "upload"
  if (data.propertyName) return "typed"
  return null
}

function fileSize(size: number) {
  return size >= 1024 * 1024
    ? `${(size / (1024 * 1024)).toFixed(1)} MB`
    : `${Math.ceil(size / 1024)} KB`
}

export function SecondOpinionPropertyStep({
  data,
  onUpdate,
  onNext,
  onBack,
  canGoBack,
}: SecondOpinionPropertyStepProps) {
  const [route, setRoute] = useState<PropertyRoute | null>(() =>
    getInitialRoute(data),
  )
  const [propertyUrl, setPropertyUrl] = useState(data.propertyUrl || "")
  const [propertyName, setPropertyName] = useState(data.propertyName || "")
  const [location, setLocation] = useState(data.locations?.[0] || "")
  const [price, setPrice] = useState(data.leadMagnetFields?.price || "")
  const [bedrooms, setBedrooms] = useState(
    data.bedrooms === undefined ? "" : String(data.bedrooms),
  )
  const [paymentPlan, setPaymentPlan] = useState(
    data.leadMagnetFields?.payment_plan || "",
  )
  const [files, setFiles] = useState<File[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isUploading, setIsUploading] = useState(false)

  const existingDocuments = data.leadMagnetDocuments || []

  const addFiles = (selected: FileList | null) => {
    if (!selected) return
    const next = [...files, ...Array.from(selected)]
    const invalidFile = next.find(
      (file) =>
        !ALLOWED_DOCUMENT_TYPES.includes(
          file.type as (typeof ALLOWED_DOCUMENT_TYPES)[number],
        ) ||
        file.size > MAX_DOCUMENT_SIZE_BYTES ||
        file.size <= 0,
    )

    if (next.length + existingDocuments.length > MAX_DOCUMENTS_PER_SUBMISSION) {
      setErrors({
        files: `You can attach up to ${MAX_DOCUMENTS_PER_SUBMISSION} files.`,
      })
      return
    }
    if (invalidFile) {
      setErrors({
        files: `${invalidFile.name} must be a PDF, Word document, JPEG, PNG or WebP file under 10 MB.`,
      })
      return
    }

    setFiles(next)
    setErrors({})
  }

  const uploadDocuments = async (): Promise<StoredDocument[]> => {
    if (!files.length) return existingDocuments

    const response = await fetch("/api/lead-magnets/documents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        submissionId: data.submissionId,
        files: files.map((file) => ({
          name: file.name,
          type: file.type,
          size: file.size,
        })),
      }),
    })
    const result = await response.json()
    if (!response.ok) throw new Error(result.error || "Document upload failed.")

    const prepared = result.uploads as PreparedUpload[]
    const supabase = createClient()
    for (const [index, upload] of prepared.entries()) {
      const { error } = await supabase.storage
        .from(LEAD_MAGNET_DOCUMENT_BUCKET)
        .uploadToSignedUrl(upload.uploadPath, upload.uploadToken, files[index], {
          contentType: files[index].type,
        })
      if (error) throw new Error(`Could not upload ${files[index].name}.`)
    }

    return [
      ...existingDocuments,
      ...prepared.map(({ url, filename, contentType, sizeBytes }) => ({
        url,
        filename,
        contentType,
        sizeBytes,
      })),
    ]
  }

  const validate = () => {
    const next: Record<string, string> = {}
    if (!route) next.route = "Choose how you want to identify the property."

    if (route === "link") {
      try {
        const parsed = new URL(propertyUrl)
        if (!parsed.protocol.startsWith("http")) throw new Error()
      } catch {
        next.propertyUrl = "Enter a complete property or developer link."
      }
    }

    if (route === "upload" && !files.length && !existingDocuments.length) {
      next.files = "Choose at least one property document."
    }

    if (route === "typed") {
      if (!propertyName.trim()) next.propertyName = "Enter the property name."
      if (!location.trim()) next.location = "Enter the location or community."
      if (!price.trim()) next.price = "Enter the stated price."
      const bedroomCount = Number.parseInt(bedrooms, 10)
      if (!bedrooms || Number.isNaN(bedroomCount) || bedroomCount < 0 || bedroomCount > 20) {
        next.bedrooms = "Enter the number of bedrooms."
      }
    }

    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!validate()) return

    setIsUploading(true)
    setErrors({})
    try {
      const documents = route === "upload" ? await uploadDocuments() : existingDocuments
      onUpdate({
        propertyUrl: route === "link" ? propertyUrl.trim() : undefined,
        propertyName: route === "typed" ? propertyName.trim() : undefined,
        locations: route === "typed" ? [location.trim()] : undefined,
        bedrooms:
          route === "typed" ? Number.parseInt(bedrooms, 10) : undefined,
        leadMagnetFields: {
          ...data.leadMagnetFields,
          price: price.trim() || undefined,
          payment_plan: paymentPlan.trim() || undefined,
        },
        leadMagnetDocuments: documents,
      })
      onNext()
    } catch (error) {
      setErrors({
        files:
          error instanceof Error
            ? error.message
            : "The documents could not be uploaded. Please try again.",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="lead-form__step" noValidate>
      <div>
        <h2 className="lead-form__question">Show us the property.</h2>
        <p className="lead-form__subtext">
          Use whichever source is already in front of you. One route is enough.
        </p>
      </div>

      <div className="lead-form__options lead-form__property-routes">
        {routeOptions.map((option) => {
          const Icon = option.icon
          return (
            <Button
              key={option.value}
              type="button"
              variant="outline"
              className={cn(
                "lead-form__option lead-form__route-option",
                route === option.value && "lead-form__option--selected",
              )}
              onClick={() => {
                setRoute(option.value)
                setErrors({})
              }}
            >
              <Icon aria-hidden="true" />
              <span className="lead-form__option-content">
                <span className="lead-form__option-label">{option.label}</span>
                <span className="lead-form__option-description">
                  {option.description}
                </span>
              </span>
            </Button>
          )
        })}
      </div>
      {errors.route && <span className="lead-form__error">{errors.route}</span>}

      {route === "link" && (
        <div className="lead-form__fields">
          <div className="lead-form__field">
            <label htmlFor="second-opinion-property-url" className="lead-form__label">
              Property or developer link
            </label>
            <Input
              id="second-opinion-property-url"
              type="url"
              value={propertyUrl}
              onChange={(event) => setPropertyUrl(event.target.value)}
              placeholder="https://"
              className={cn(
                "lead-form__input",
                errors.propertyUrl && "lead-form__input--error",
              )}
              aria-invalid={Boolean(errors.propertyUrl)}
            />
            {errors.propertyUrl && (
              <span className="lead-form__error">{errors.propertyUrl}</span>
            )}
          </div>
        </div>
      )}

      {route === "upload" && (
        <div className="lead-form__fields">
          <label className="lead-form__upload" htmlFor="second-opinion-files">
            <UploadIcon aria-hidden="true" />
            <span>
              <strong>Choose property documents</strong>
              <small>PDF, Word, JPEG, PNG or WebP · six files maximum</small>
            </span>
            <Input
              id="second-opinion-files"
              type="file"
              accept={DOCUMENT_ACCEPT}
              multiple
              onChange={(event) => addFiles(event.target.files)}
            />
          </label>

          {(existingDocuments.length > 0 || files.length > 0) && (
            <div className="lead-form__file-list" aria-label="Property documents">
              {existingDocuments.map((file) => (
                <div key={file.url} className="lead-form__file-row">
                  <FileTextIcon aria-hidden="true" />
                  <span>
                    <strong>{file.filename}</strong>
                    <small>Uploaded · {fileSize(file.sizeBytes)}</small>
                  </span>
                </div>
              ))}
              {files.map((file, index) => (
                <div
                  key={`${file.name}-${file.lastModified}`}
                  className="lead-form__file-row"
                >
                  <FileTextIcon aria-hidden="true" />
                  <span>
                    <strong>{file.name}</strong>
                    <small>Ready to upload · {fileSize(file.size)}</small>
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      setFiles((current) =>
                        current.filter((_, fileIndex) => fileIndex !== index),
                      )
                    }
                    aria-label={`Remove ${file.name}`}
                  >
                    <XIcon />
                  </Button>
                </div>
              ))}
            </div>
          )}
          {errors.files && <span className="lead-form__error">{errors.files}</span>}
        </div>
      )}

      {route === "typed" && (
        <div className="lead-form__fields">
          <div className="lead-form__field-row">
            <PropertyInput
              id="second-opinion-property-name"
              label="Property name"
              value={propertyName}
              onChange={setPropertyName}
              error={errors.propertyName}
            />
            <PropertyInput
              id="second-opinion-location"
              label="Location or community"
              value={location}
              onChange={setLocation}
              error={errors.location}
            />
            <PropertyInput
              id="second-opinion-price"
              label="Stated price"
              value={price}
              onChange={setPrice}
              error={errors.price}
            />
            <PropertyInput
              id="second-opinion-bedrooms"
              label="Bedrooms"
              value={bedrooms}
              onChange={setBedrooms}
              error={errors.bedrooms}
              type="number"
            />
          </div>
        </div>
      )}

      {route && route !== "typed" && (
        <div className="lead-form__section">
          <p className="lead-form__section-label">
            Commercial context <span className="lead-form__section-optional">optional</span>
          </p>
          <div className="lead-form__fields">
            <div className="lead-form__field">
              <label htmlFor="second-opinion-price" className="lead-form__label">
                Stated price
              </label>
              <Input
                id="second-opinion-price"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                placeholder="As stated by the seller or developer"
                className="lead-form__input"
              />
            </div>
          </div>
        </div>
      )}

      {route && (
        <div className="lead-form__field">
          <label htmlFor="second-opinion-payment-plan" className="lead-form__label">
            Payment plan <span className="lead-form__label-optional">optional</span>
          </label>
          <Textarea
            id="second-opinion-payment-plan"
            value={paymentPlan}
            onChange={(event) => setPaymentPlan(event.target.value)}
            placeholder="Add the payment structure if it matters to the review"
            className="lead-form__textarea"
            rows={3}
          />
        </div>
      )}

      <div className="lead-form__actions">
        <Button type="submit" className="lead-form__submit" disabled={isUploading}>
          {isUploading ? (
            <span className="lead-form__loading">
              <Loader2Icon className="lead-form__spinner" />
              Securing your documents
            </span>
          ) : (
            "Continue"
          )}
        </Button>
        <LeadFormBackButton onBack={onBack} canGoBack={canGoBack} />
      </div>
    </form>
  )
}

function PropertyInput({
  id,
  label,
  value,
  onChange,
  error,
  type = "text",
}: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
  type?: "text" | "number"
}) {
  return (
    <div className="lead-form__field">
      <label htmlFor={id} className="lead-form__label">
        {label}
      </label>
      <Input
        id={id}
        type={type}
        min={type === "number" ? 0 : undefined}
        max={type === "number" ? 20 : undefined}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={cn("lead-form__input", error && "lead-form__input--error")}
        aria-invalid={Boolean(error)}
      />
      {error && <span className="lead-form__error">{error}</span>}
    </div>
  )
}
