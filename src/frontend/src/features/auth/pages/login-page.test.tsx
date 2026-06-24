import userEvent from '@testing-library/user-event'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { ApiError } from '@/features/auth'
import { LoginPage } from '@/features/auth/pages/login-page'
import * as authHook from '@/features/auth/hooks/use-auth'

vi.mock('@/features/auth/hooks/use-auth')
vi.mock('@/hooks/use-document-title', () => ({
  useDocumentTitle: vi.fn(),
}))

describe('LoginPage', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('submits valid credentials through auth context', async () => {
    const user = userEvent.setup()
    const loginMock = vi.fn().mockResolvedValue(undefined)

    vi.mocked(authHook.useAuth).mockReturnValue({
      accessToken: null,
      isAuthenticated: false,
      isInitializing: false,
      login: loginMock,
      logout: vi.fn(),
      register: vi.fn(),
      session: null,
      user: null,
    })

    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<div>home</div>} />
        </Routes>
      </MemoryRouter>,
    )

    await user.type(screen.getByLabelText('Email'), 'ada@example.com')
    await user.type(screen.getByLabelText('Password'), 'Password123')
    await user.click(screen.getByRole('button', { name: 'Sign in' }))

    await waitFor(() => {
      expect(loginMock).toHaveBeenCalledWith({
        email: 'ada@example.com',
        password: 'Password123',
      })
    })
  })

  it('shows backend errors on failed login', async () => {
    const user = userEvent.setup()
    const loginMock = vi.fn().mockRejectedValue(new ApiError('Invalid credentials.', 401))

    vi.mocked(authHook.useAuth).mockReturnValue({
      accessToken: null,
      isAuthenticated: false,
      isInitializing: false,
      login: loginMock,
      logout: vi.fn(),
      register: vi.fn(),
      session: null,
      user: null,
    })

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    )

    await user.type(screen.getByLabelText('Email'), 'ada@example.com')
    await user.type(screen.getByLabelText('Password'), 'Password123')
    await user.click(screen.getByRole('button', { name: 'Sign in' }))

    expect(await screen.findByText('Invalid credentials.')).toBeInTheDocument()
  })
})
