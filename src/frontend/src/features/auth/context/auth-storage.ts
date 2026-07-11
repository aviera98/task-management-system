import type {
  AuthSession,
  AuthStorageSchema,
  UserRole,
} from '@/features/auth/types'

const AUTH_STORAGE_KEY = 'task-management-system.auth'
const validRoles: UserRole[] = ['Admin', 'Manager', 'Member']

export function loadStoredSession(): AuthSession | null {
  if (typeof window === 'undefined') {
    return null
  }

  const rawSession = window.localStorage.getItem(AUTH_STORAGE_KEY)
  if (!rawSession) {
    return null
  }

  try {
    const parsedSession = JSON.parse(rawSession) as Partial<AuthStorageSchema>

    if (
      typeof parsedSession.accessToken !== 'string' ||
      typeof parsedSession.user?.id !== 'string' ||
      typeof parsedSession.user?.firstName !== 'string' ||
      typeof parsedSession.user?.lastName !== 'string' ||
      typeof parsedSession.user?.email !== 'string' ||
      typeof parsedSession.user?.role !== 'string' ||
      !validRoles.includes(parsedSession.user.role as UserRole)
    ) {
      clearStoredSession()
      return null
    }

    return {
      accessToken: parsedSession.accessToken,
      user: {
        id: parsedSession.user.id,
        firstName: parsedSession.user.firstName,
        lastName: parsedSession.user.lastName,
        email: parsedSession.user.email,
        role: parsedSession.user.role,
      },
    }
  } catch {
    clearStoredSession()
    return null
  }
}

export function storeSession(session: AuthSession) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session))
}

export function clearStoredSession() {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY)
}
