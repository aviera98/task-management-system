import type { AuthUser } from '@/features/auth/types/auth-user'

export interface LoginResponse {
  accessToken: string
  expiresAt: string
  user: AuthUser
}
