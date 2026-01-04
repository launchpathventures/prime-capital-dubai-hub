/**
 * CATALYST - Toast Notifications
 *
 * @source @base-ui/react v1.0.0 (Toast)
 * @customised Yes
 *   - Element Plus-inspired styling (compact, content-hugging)
 *   - Always expanded (stacked vertically, not behind each other)
 *   - Close button on all toasts
 *   - Colored variants: success, error, warning, info, loading
 *   - Promise-based toasts with loading → success/error transitions
 *
 * Usage:
 *   import { toast } from "@/components/ui/toast"
 *
 *   toast("Event created")
 *   toast.success("Saved!")
 *   toast.error("Something went wrong")
 *   toast.warning("Please review")
 *   toast.info("New update available")
 *   toast.loading("Processing...")
 *
 *   // Promise-based (auto-transitions through states)
 *   toast.promise(fetchData(), {
 *     loading: "Loading...",
 *     success: "Done!",
 *     error: "Failed",
 *   })
 */

"use client"

import * as React from "react"
import { Toast } from "@base-ui/react/toast"
import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  TriangleAlertIcon,
  XCircleIcon,
  XIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

// -----------------------------------------------------------------------------
// Global Toast Manager
// -----------------------------------------------------------------------------

const toastManager = Toast.createToastManager()

type ToastType = "default" | "success" | "error" | "warning" | "info" | "loading"

interface ToastOptions {
  type?: ToastType
  title?: string
  description?: string
  duration?: number
}

interface PromiseToastOptions<T> {
  loading: string
  success: string | ((data: T) => string)
  error: string | ((error: unknown) => string)
}

/**
 * Show a toast notification
 */
function showToast(message: string, options?: ToastOptions): string
function showToast(options: ToastOptions & { description: string }): string
function showToast(
  messageOrOptions: string | (ToastOptions & { description: string }),
  options?: ToastOptions
): string {
  if (typeof messageOrOptions === "string") {
    return toastManager.add({
      description: messageOrOptions,
      type: options?.type ?? "default",
      timeout: options?.duration,
    })
  }
  return toastManager.add({
    title: messageOrOptions.title,
    description: messageOrOptions.description,
    type: messageOrOptions.type ?? "default",
    timeout: messageOrOptions.duration,
  })
}

// Convenience methods
showToast.success = (message: string, options?: Omit<ToastOptions, "type">) =>
  showToast(message, { ...options, type: "success" })

showToast.error = (message: string, options?: Omit<ToastOptions, "type">) =>
  showToast(message, { ...options, type: "error" })

showToast.warning = (message: string, options?: Omit<ToastOptions, "type">) =>
  showToast(message, { ...options, type: "warning" })

showToast.info = (message: string, options?: Omit<ToastOptions, "type">) =>
  showToast(message, { ...options, type: "info" })

showToast.loading = (message: string, options?: Omit<ToastOptions, "type">) =>
  showToast(message, { ...options, type: "loading" })

/**
 * Show a promise-based toast with loading, success, and error states
 */
showToast.promise = async <T,>(
  promise: Promise<T>,
  options: PromiseToastOptions<T>
): Promise<T> => {
  const toastId = toastManager.add({
    description: options.loading,
    type: "loading",
    timeout: 0, // Don't auto-dismiss while loading
  })

  try {
    const result = await promise
    toastManager.update(toastId, {
      description:
        typeof options.success === "function"
          ? options.success(result)
          : options.success,
      type: "success",
      timeout: 4000,
    })
    return result
  } catch (error) {
    toastManager.update(toastId, {
      description:
        typeof options.error === "function"
          ? options.error(error)
          : options.error,
      type: "error",
      timeout: 4000,
    })
    throw error
  }
}

export { showToast as toast }

// -----------------------------------------------------------------------------
// Toast Icon
// -----------------------------------------------------------------------------

const iconMap: Record<ToastType, React.ReactNode> = {
  default: null,
  success: <CircleCheckIcon className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />,
  error: <XCircleIcon className="size-4 shrink-0 text-red-600 dark:text-red-400" />,
  warning: <TriangleAlertIcon className="size-4 shrink-0 text-amber-600 dark:text-amber-400" />,
  info: <InfoIcon className="size-4 shrink-0 text-blue-600 dark:text-blue-400" />,
  loading: <Loader2Icon className="size-4 shrink-0 text-gray-600 dark:text-gray-400 animate-spin" />,
}

// -----------------------------------------------------------------------------
// Toast Styles
// -----------------------------------------------------------------------------

const typeStyles: Record<ToastType, string> = {
  default:
    "bg-white text-gray-900 border-gray-200 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700",
  success:
    "bg-emerald-50 text-emerald-900 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-100 dark:border-emerald-800",
  error:
    "bg-red-50 text-red-900 border-red-200 dark:bg-red-950 dark:text-red-100 dark:border-red-800",
  warning:
    "bg-amber-50 text-amber-900 border-amber-200 dark:bg-amber-950 dark:text-amber-100 dark:border-amber-800",
  info:
    "bg-blue-50 text-blue-900 border-blue-200 dark:bg-blue-950 dark:text-blue-100 dark:border-blue-800",
  loading:
    "bg-gray-50 text-gray-900 border-gray-200 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700",
}

// -----------------------------------------------------------------------------
// Toast Provider & Viewport
// -----------------------------------------------------------------------------

function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <Toast.Provider toastManager={toastManager} timeout={4000}>
      {children}
      <ToastViewport />
    </Toast.Provider>
  )
}

function ToastViewport() {
  const { toasts } = Toast.useToastManager()

  return (
    <Toast.Portal>
      <Toast.Viewport
        className={cn(
          "fixed top-4 left-1/2 -translate-x-1/2 z-[100]",
          "flex flex-col items-center gap-2",
          "pointer-events-none",
          "outline-none"
        )}
      >
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} />
        ))}
      </Toast.Viewport>
    </Toast.Portal>
  )
}

// -----------------------------------------------------------------------------
// Toast Item
// -----------------------------------------------------------------------------

interface ToastItemProps {
  toast: Toast.Root.ToastObject<{
    type?: ToastType
    title?: string
    description?: string
  }>
}

function ToastItem({ toast }: ToastItemProps) {
  const type = (toast.type as ToastType) ?? "default"
  const icon = iconMap[type]

  return (
    <Toast.Root
      toast={toast}
      className={cn(
        // Layout
        "pointer-events-auto flex items-center gap-2",
        "w-auto max-w-[420px] min-w-0",
        "py-2.5 px-4 pr-3",
        // Shape & border
        "rounded-lg border shadow-md",
        // Type-specific colors
        typeStyles[type],
        // Animation
        "transition-all duration-200 ease-out",
        "data-[starting-style]:opacity-0 data-[starting-style]:-translate-y-2",
        "data-[ending-style]:opacity-0 data-[ending-style]:-translate-y-2"
      )}
    >
      {/* Icon */}
      {icon}

      {/* Content */}
      <Toast.Content className="flex-1 min-w-0">
        {toast.title && (
          <Toast.Title className="text-sm font-medium">{toast.title}</Toast.Title>
        )}
        {toast.description && (
          <Toast.Description className="text-sm">{toast.description}</Toast.Description>
        )}
      </Toast.Content>

      {/* Close button */}
      <Toast.Close
        className={cn(
          "shrink-0 p-1 rounded-full cursor-pointer",
          "opacity-60 hover:opacity-100",
          "hover:bg-black/5 dark:hover:bg-white/10",
          "transition-opacity"
        )}
      >
        <XIcon className="size-3.5" />
      </Toast.Close>
    </Toast.Root>
  )
}

export { ToastProvider }
