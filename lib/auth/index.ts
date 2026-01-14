/**
 * CATALYST - Auth Module Exports
 */

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
