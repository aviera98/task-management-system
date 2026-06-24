import type { AuthUser } from '@/features/auth/types/auth-user'

export interface AuthSession {
  accessToken: string
  user: AuthUser
}
