/**
 * CATALYST - Auth Module Exports
 *
 * ⚠️  IMPORTANT: This barrel export is for SERVER components only!
 *
 * For CLIENT components, import directly from the specific file:
 * - import { getURL } from "@/lib/auth/get-url"
 * - import { type AuthMode } from "@/lib/auth/config"
 *
 * This prevents bundling server-only code (next/headers) into client bundles.
 */

import "server-only"

export {
  type AuthMode,
  type AuthConfig,
  getAuthMode,
  getAuthConfig,
  isRegistrationEnabled,
  isPasswordRecoveryEnabled,
} from "./config"

export { getURL } from "./get-url"

export {
  requireAuth,
  requireAdmin,
  getOptionalUser,
  getUserWithProfile,
  getUserForMenu,
} from "./require-auth"
