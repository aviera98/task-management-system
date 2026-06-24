import { ApiError } from '@/features/auth/types'
import { httpClient } from '@/features/auth/api/http-client'

describe('httpClient', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('sends a JSON request with bearer authentication', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ id: 'task-1' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      }),
    )

    const response = await httpClient<{ id: string }>('/api/tasks', {
      accessToken: 'jwt-token',
      body: { title: 'Task' },
      method: 'POST',
    })

    expect(response).toEqual({ id: 'task-1' })
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:8080/api/tasks',
      expect.objectContaining({
        body: JSON.stringify({ title: 'Task' }),
        method: 'POST',
      }),
    )

    const requestInit = fetchMock.mock.calls[0]?.[1]
    const headers = requestInit?.headers as Headers
    expect(headers.get('Authorization')).toBe('Bearer jwt-token')
    expect(headers.get('Content-Type')).toBe('application/json')
  })

  it('throws ApiError with backend message for failed requests', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ message: 'Invalid credentials.' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 401,
      }),
    )

    await expect(httpClient('/api/auth/login')).rejects.toEqual(
      expect.objectContaining<ApiError>({
        message: 'Invalid credentials.',
        statusCode: 401,
      }),
    )
  })
})
