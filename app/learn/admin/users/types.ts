/**
 * CATALYST - User Admin Types
 */

export interface UserWithEmail {
  id: string
  email: string
  full_name: string | null
  role: string
  certification_status: string | null
  created_at: string
  updated_at: string
  last_sign_in_at: string | null
}
