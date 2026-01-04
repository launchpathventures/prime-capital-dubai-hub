/**
 * CATALYST - URL Toast Handler
 *
 * Client component that handles:
 * 1. Toast notifications based on URL query params (?toast=signed-in)
 * 2. Supabase auth errors from URL hash fragments (#error=access_denied)
 *
 * Supported toast types:
 * - signed-in: Shows "Signed in" success toast
 * - signed-out: Shows "Signed out" success toast
 * - email-verified: Shows "Email verified" info toast (partial email change, waiting for second verification)
 * - email-updated: Shows "Email updated" success toast (email change complete)
 * - password-updated: Shows "Password updated" success toast
 * - auth-error: Shows error toast for failed verification
 *
 * Supabase errors (from hash fragments) are caught, displayed as toasts,
 * and the user is redirected to /app/profile.
 */

"use client"

import { useEffect } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { toast } from "@/components/ui/toast"

const TOAST_MESSAGES: Record<string, { message: string; type: "success" | "error" | "info" }> = {
  "signed-in": { message: "Successfully signed in", type: "success" },
  "signed-out": { message: "Successfully signed out", type: "success" },
  "email-verified": { message: "Email verified. Please check your other email to complete the update.", type: "info" },
  "email-updated": { message: "Email updated successfully", type: "success" },
  "email-link-expired": { message: "The email link has expired. Please request a new one.", type: "error" },
  "password-updated": { message: "Password updated successfully", type: "success" },
  "password-ready": { message: "You can now set a new password below", type: "info" },
  "auth-error": { message: "Verification failed. Please try again.", type: "error" },
  // Legacy aliases
  "logged-in": { message: "Successfully signed in", type: "success" },
  "logged-out": { message: "Successfully signed out", type: "success" },
}

// Friendly error messages for Supabase error codes
const SUPABASE_ERROR_MESSAGES: Record<string, string> = {
  "otp_expired": "The email link has expired. Please request a new one.",
  "access_denied": "Access denied. The link may be invalid or expired.",
  "invalid_request": "Invalid request. Please try again.",
  "unauthorized_client": "Unauthorized. Please sign in again.",
  "unsupported_grant_type": "Authentication error. Please try again.",
  "invalid_grant": "Invalid or expired link. Please request a new one.",
  "user_not_found": "User not found. Please check your account.",
  "email_not_confirmed": "Please confirm your email address first.",
  "user_banned": "This account has been suspended.",
  "session_not_found": "Session expired. Please sign in again.",
}

export function UrlToast() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const toastType = searchParams.get("toast")

  // Handle query param toasts
  useEffect(() => {
    if (toastType && TOAST_MESSAGES[toastType]) {
      const { message, type } = TOAST_MESSAGES[toastType]
      
      if (type === "success") {
        toast.success(message)
      } else if (type === "error") {
        toast.error(message)
      } else {
        toast.info(message)
      }

      // Clean up URL
      const params = new URLSearchParams(searchParams.toString())
      params.delete("toast")
      const newUrl = params.toString() ? `${pathname}?${params}` : pathname
      router.replace(newUrl, { scroll: false })
    }
  }, [toastType, pathname, router, searchParams])

  // Handle Supabase hash fragment errors (e.g., #error=access_denied&error_code=otp_expired)
  useEffect(() => {
    // Only run on client
    if (typeof window === "undefined") return

    // Don't show hash errors if we already have a success/info toast in the URL
    // This prevents double toasts when email change completes (success + stale error)
    const existingToast = toastType && TOAST_MESSAGES[toastType]
    if (existingToast && (existingToast.type === "success" || existingToast.type === "info")) return

    const hash = window.location.hash
    if (!hash || !hash.includes("error=")) return

    // Parse hash fragment
    const hashParams = new URLSearchParams(hash.substring(1))
    const error = hashParams.get("error")
    const errorCode = hashParams.get("error_code")
    const errorDescription = hashParams.get("error_description")

    if (error) {
      // Get friendly message
      const friendlyMessage = 
        (errorCode && SUPABASE_ERROR_MESSAGES[errorCode]) ||
        (error && SUPABASE_ERROR_MESSAGES[error]) ||
        errorDescription?.replace(/\+/g, " ") ||
        "An authentication error occurred. Please try again."

      // Show error toast
      toast.error(friendlyMessage)

      // Clear the hash and redirect to profile page
      setTimeout(() => {
        window.history.replaceState(null, "", window.location.pathname)
        if (!pathname.includes("/app/profile")) {
          router.push("/app/profile")
        }
      }, 100)
    }
  }, [pathname, router, toastType])

  return null
}
