/**
 * CATALYST - Lead Magnet Contract Constants
 */

export const FRAMEWORK_LEAD_MAGNET_ID =
  "prime-investor-decision-framework" as const
export const SECOND_OPINION_LEAD_MAGNET_ID =
  "prime-project-second-opinion" as const
export const FRAMEWORK_SECOND_OPINION_PREFILL_KEY =
  "prime:framework:second-opinion-prefill"

export const SECOND_OPINION_INSTRUCTION =
  "Second Opinion request from YouTube. Get in touch with this lead and give them a second opinion on the property below. Cover what appears supported, what remains unproven, and the next decision you would make. Their submitted details and any documents are on this lead."

export const LEAD_MAGNET_DOCUMENT_BUCKET = "lead-magnet-documents"
export const MAX_DOCUMENT_SIZE_BYTES = 10 * 1024 * 1024
export const MAX_DOCUMENTS_PER_SUBMISSION = 6
export const ALLOWED_DOCUMENT_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
  "image/webp",
] as const

export const DOCUMENT_ACCEPT = ".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp"
