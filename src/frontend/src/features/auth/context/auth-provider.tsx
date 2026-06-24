import type { ReactNode } from 'react'
import { useState } from 'react'
import { login as loginRequest, register as registerRequest } from '@/features/auth/api/auth-api'
import { AuthContext } from '@/features/auth/context/auth-context'
import { clearStoredSession, loadStoredSession, storeSession } from '@/features/auth/context/auth-storage'
import type { AuthSession, AuthContextValue, LoginRequest, RegisterRequest } from '@/features/auth/types'

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<AuthSession | null>(() => loadStoredSession())

  async function login(request: LoginRequest) {
    const response = await loginRequest(request)
    const nextSession: AuthSession = {
      accessToken: response.accessToken,
      user: response.user,
    }

    storeSession(nextSession)
    setSession(nextSession)
  }

  async function register(request: RegisterRequest) {
    await registerRequest(request)
    await login({
      email: request.email,
      password: request.password,
    })
  }

  function logout() {
    clearStoredSession()
    setSession(null)
  }

  const value: AuthContextValue = {
    accessToken: session?.accessToken ?? null,
    isAuthenticated: session !== null,
    isInitializing: false,
    login,
    logout,
    register,
    session,
    user: session?.user ?? null,
  }

  return <AuthContext value={value}>{children}</AuthContext>
}
