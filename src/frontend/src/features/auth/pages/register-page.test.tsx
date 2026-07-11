import userEvent from '@testing-library/user-event'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { ApiError } from '@/features/auth'
import { RegisterPage } from '@/features/auth/pages/register-page'
import * as authHook from '@/features/auth/hooks/use-auth'

vi.mock('@/features/auth/hooks/use-auth')
vi.mock('@/hooks/use-document-title', () => ({
  useDocumentTitle: vi.fn(),
}))

describe('RegisterPage', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('submits valid registration data', async () => {
    const user = userEvent.setup()
    const registerMock = vi.fn().mockResolvedValue(undefined)

    vi.mocked(authHook.useAuth).mockReturnValue({
      accessToken: null,
      isAuthenticated: false,
      isInitializing: false,
      login: vi.fn(),
      logout: vi.fn(),
      register: registerMock,
      session: null,
      user: null,
    })

    render(
      <MemoryRouter initialEntries={['/register']}>
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<div>home</div>} />
        </Routes>
      </MemoryRouter>,
    )

    await user.type(screen.getByLabelText('First name'), 'Ada')
    await user.type(screen.getByLabelText('Last name'), 'Lovelace')
    await user.type(screen.getByLabelText('Email'), 'ada@example.com')
    await user.type(screen.getByLabelText('Password'), 'Password123')
    await user.click(screen.getByRole('button', { name: 'Create account' }))

    await waitFor(() => {
      expect(registerMock).toHaveBeenCalledWith({
        firstName: 'Ada',
        lastName: 'Lovelace',
        email: 'ada@example.com',
        password: 'Password123',
      })
    })
  })

  it('shows validation feedback for weak passwords', async () => {
    const user = userEvent.setup()

    vi.mocked(authHook.useAuth).mockReturnValue({
      accessToken: null,
      isAuthenticated: false,
      isInitializing: false,
      login: vi.fn(),
      logout: vi.fn(),
      register: vi.fn(),
      session: null,
      user: null,
    })

    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>,
    )

    await user.type(screen.getByLabelText('First name'), 'Ada')
    await user.type(screen.getByLabelText('Last name'), 'Lovelace')
    await user.type(screen.getByLabelText('Email'), 'ada@example.com')
    await user.type(screen.getByLabelText('Password'), 'weak')
    await user.click(screen.getByRole('button', { name: 'Create account' }))

    expect(
      await screen.findByText('Password must be at least 8 characters long.'),
    ).toBeInTheDocument()
  })

  it('shows backend errors on failed registration', async () => {
    const user = userEvent.setup()
    const registerMock = vi
      .fn()
      .mockRejectedValue(new ApiError('Email already exists.', 409))

    vi.mocked(authHook.useAuth).mockReturnValue({
      accessToken: null,
      isAuthenticated: false,
      isInitializing: false,
      login: vi.fn(),
      logout: vi.fn(),
      register: registerMock,
      session: null,
      user: null,
    })

    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>,
    )

    await user.type(screen.getByLabelText('First name'), 'Ada')
    await user.type(screen.getByLabelText('Last name'), 'Lovelace')
    await user.type(screen.getByLabelText('Email'), 'ada@example.com')
    await user.type(screen.getByLabelText('Password'), 'Password123')
    await user.click(screen.getByRole('button', { name: 'Create account' }))

    expect(await screen.findByText('Email already exists.')).toBeInTheDocument()
  })
})
