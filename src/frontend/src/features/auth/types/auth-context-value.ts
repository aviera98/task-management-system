import type { AuthSession } from '@/features/auth/types/auth-session'
import type { LoginRequest } from '@/features/auth/types/login-request'
import type { RegisterRequest } from '@/features/auth/types/register-request'

export interface AuthContextValue {
  accessToken: string | null
  isAuthenticated: boolean
  isInitializing: boolean
  login: (request: LoginRequest) => Promise<void>
  logout: () => void
  register: (request: RegisterRequest) => Promise<void>
  session: AuthSession | null
  user: AuthSession['user'] | null
}
