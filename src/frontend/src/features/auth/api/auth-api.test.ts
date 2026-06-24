import * as httpClientModule from '@/features/auth/api/http-client'
import { login, register } from '@/features/auth/api/auth-api'

vi.mock('@/features/auth/api/http-client')

describe('auth-api', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  it('calls login endpoint', async () => {
    const httpClientMock = vi.mocked(httpClientModule.httpClient)
    httpClientMock.mockResolvedValue({ accessToken: 'token' } as never)

    await login({ email: 'ada@example.com', password: 'Password123' })

    expect(httpClientMock).toHaveBeenCalledWith('/api/auth/login', {
      body: { email: 'ada@example.com', password: 'Password123' },
      method: 'POST',
      signal: undefined,
    })
  })

  it('calls register endpoint', async () => {
    const httpClientMock = vi.mocked(httpClientModule.httpClient)
    httpClientMock.mockResolvedValue({ id: 'user-1' } as never)

    await register({
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'ada@example.com',
      password: 'Password123',
    })

    expect(httpClientMock).toHaveBeenCalledWith('/api/auth/register', {
      body: {
        firstName: 'Ada',
        lastName: 'Lovelace',
        email: 'ada@example.com',
        password: 'Password123',
      },
      method: 'POST',
      signal: undefined,
    })
  })
})
