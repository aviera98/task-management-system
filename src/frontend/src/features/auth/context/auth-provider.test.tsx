import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { AuthProvider } from '@/features/auth/context/auth-provider'
import { useAuth } from '@/features/auth/hooks/use-auth'
import type { LoginResponse, RegisterResponse } from '@/features/auth/types'
import * as authApi from '@/features/auth/api/auth-api'

vi.mock('@/features/auth/api/auth-api')

function AuthConsumer() {
  const { isAuthenticated, login, logout, user } = useAuth()

  return (
    <div>
      <span>{isAuthenticated ? 'authenticated' : 'anonymous'}</span>
      <span>{user?.email ?? 'no-user'}</span>
      <button
        type="button"
        onClick={() => login({ email: 'ada@example.com', password: 'Password123' })}
      >
        login
      </button>
      <button type="button" onClick={logout}>
        logout
      </button>
    </div>
  )
}

describe('AuthProvider', () => {
  beforeEach(() => {
    window.localStorage.clear()
    vi.resetAllMocks()
  })

  it('logs in and stores the session', async () => {
    const loginMock = vi.mocked(authApi.login)
    loginMock.mockResolvedValue({
      accessToken: 'token-123',
      expiresAt: new Date().toISOString(),
      user: {
        id: 'user-1',
        firstName: 'Ada',
        lastName: 'Lovelace',
        email: 'ada@example.com',
        role: 'Member',
      },
    } satisfies LoginResponse)

    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'login' }))

    await waitFor(() => {
      expect(screen.getByText('authenticated')).toBeInTheDocument()
    })

    expect(screen.getByText('ada@example.com')).toBeInTheDocument()
    expect(window.localStorage.getItem('task-management-system.auth')).toContain('token-123')
  })

  it('logs out and clears the stored session', async () => {
    window.localStorage.setItem(
      'task-management-system.auth',
      JSON.stringify({
        accessToken: 'stored-token',
        user: {
          id: 'user-1',
          firstName: 'Ada',
          lastName: 'Lovelace',
          email: 'ada@example.com',
          role: 'Member',
        },
      }),
    )

    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>,
    )

    expect(screen.getByText('authenticated')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'logout' }))

    await waitFor(() => {
      expect(screen.getByText('anonymous')).toBeInTheDocument()
    })

    expect(window.localStorage.getItem('task-management-system.auth')).toBeNull()
  })

  it('restores the session from local storage on startup', () => {
    window.localStorage.setItem(
      'task-management-system.auth',
      JSON.stringify({
        accessToken: 'restored-token',
        user: {
          id: 'user-2',
          firstName: 'Grace',
          lastName: 'Hopper',
          email: 'grace@example.com',
          role: 'Admin',
        },
      }),
    )

    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>,
    )

    expect(screen.getByText('authenticated')).toBeInTheDocument()
    expect(screen.getByText('grace@example.com')).toBeInTheDocument()
  })

  it('can register and then authenticate the user', async () => {
    const registerMock = vi.mocked(authApi.register)
    const loginMock = vi.mocked(authApi.login)

    registerMock.mockResolvedValue({
      id: 'user-3',
      firstName: 'Linus',
      lastName: 'Torvalds',
      email: 'linus@example.com',
      role: 'Member',
      createdAt: new Date().toISOString(),
    } satisfies RegisterResponse)

    loginMock.mockResolvedValue({
      accessToken: 'registered-token',
      expiresAt: new Date().toISOString(),
      user: {
        id: 'user-3',
        firstName: 'Linus',
        lastName: 'Torvalds',
        email: 'linus@example.com',
        role: 'Member',
      },
    } satisfies LoginResponse)

    function RegisterConsumer() {
      const { register } = useAuth()

      return (
        <button
          type="button"
          onClick={() =>
            register({
              firstName: 'Linus',
              lastName: 'Torvalds',
              email: 'linus@example.com',
              password: 'Password123',
            })
          }
        >
          register
        </button>
      )
    }

    render(
      <AuthProvider>
        <RegisterConsumer />
        <AuthConsumer />
      </AuthProvider>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'register' }))

    await waitFor(() => {
      expect(screen.getByText('authenticated')).toBeInTheDocument()
    })

    expect(registerMock).toHaveBeenCalledOnce()
    expect(loginMock).toHaveBeenCalledWith({
      email: 'linus@example.com',
      password: 'Password123',
    })
  })
})
