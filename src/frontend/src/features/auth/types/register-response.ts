import type { AuthUser } from '@/features/auth/types/auth-user'

export interface RegisterResponse extends AuthUser {
  createdAt: string
}
