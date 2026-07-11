import {
  clearStoredSession,
  loadStoredSession,
  storeSession,
} from '@/features/auth/context/auth-storage'

describe('auth-storage', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('stores and loads a valid session', () => {
    const session = {
      accessToken: 'jwt-token',
      user: {
        id: 'user-1',
        firstName: 'Ada',
        lastName: 'Lovelace',
        email: 'ada@example.com',
        role: 'Member' as const,
      },
    }

    storeSession(session)

    expect(loadStoredSession()).toEqual(session)
  })

  it('clears invalid stored data', () => {
    window.localStorage.setItem(
      'task-management-system.auth',
      JSON.stringify({
        accessToken: 'jwt-token',
        user: {
          id: 'user-1',
          firstName: 'Ada',
          lastName: 'Lovelace',
          email: 'ada@example.com',
          role: 'InvalidRole',
        },
      }),
    )

    expect(loadStoredSession()).toBeNull()
    expect(
      window.localStorage.getItem('task-management-system.auth'),
    ).toBeNull()
  })

  it('clears the stored session explicitly', () => {
    window.localStorage.setItem('task-management-system.auth', '{}')

    clearStoredSession()

    expect(
      window.localStorage.getItem('task-management-system.auth'),
    ).toBeNull()
  })
})
