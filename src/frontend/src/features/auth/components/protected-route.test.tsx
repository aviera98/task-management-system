import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import { ProtectedRoute } from '@/features/auth/components/protected-route'
import { AuthContext } from '@/features/auth/context/auth-context'
import type { AuthContextValue } from '@/features/auth/types'

function createAuthContextValue(overrides: Partial<AuthContextValue> = {}): AuthContextValue {
  return {
    accessToken: null,
    isAuthenticated: false,
    isInitializing: false,
    login: vi.fn(),
    logout: vi.fn(),
    register: vi.fn(),
    session: null,
    user: null,
    ...overrides,
  }
}

describe('ProtectedRoute', () => {
  it('renders protected content for authenticated users', () => {
    render(
      <AuthContext
        value={createAuthContextValue({
          accessToken: 'token',
          isAuthenticated: true,
        })}
      >
        <MemoryRouter initialEntries={['/tasks']}>
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route path="/tasks" element={<div>private page</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </AuthContext>,
    )

    expect(screen.getByText('private page')).toBeInTheDocument()
  })

  it('redirects unauthenticated users to login', () => {
    render(
      <AuthContext value={createAuthContextValue()}>
        <MemoryRouter initialEntries={['/tasks']}>
          <Routes>
            <Route path="/login" element={<div>login page</div>} />
            <Route element={<ProtectedRoute />}>
              <Route path="/tasks" element={<div>private page</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </AuthContext>,
    )

    expect(screen.getByText('login page')).toBeInTheDocument()
    expect(screen.queryByText('private page')).not.toBeInTheDocument()
  })
})
