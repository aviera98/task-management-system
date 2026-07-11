import { ApiError } from '@/features/auth/types'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.trim() || 'http://localhost:8080'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

interface RequestOptions {
  accessToken?: string | null
  body?: unknown
  method?: HttpMethod
  signal?: AbortSignal
}

interface ErrorResponsePayload {
  message?: string
}

async function parseResponse<T>(response: Response): Promise<T> {
  if (response.ok) {
    if (response.status === 204) {
      return undefined as T
    }

    return (await response.json()) as T
  }

  let message = 'Request failed. Please try again.'

  try {
    const payload = (await response.json()) as ErrorResponsePayload
    if (
      typeof payload.message === 'string' &&
      payload.message.trim().length > 0
    ) {
      message = payload.message
    }
  } catch {
    // Si no hay JSON valido, se conserva un mensaje generico para la UI.
  }

  throw new ApiError(message, response.status)
}

export async function httpClient<T>(
  path: string,
  { accessToken, body, method = 'GET', signal }: RequestOptions = {},
): Promise<T> {
  const headers = new Headers({
    Accept: 'application/json',
  })

  if (body !== undefined) {
    headers.set('Content-Type', 'application/json')
  }

  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`)
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    body: body === undefined ? undefined : JSON.stringify(body),
    headers,
    method,
    signal,
  })

  return parseResponse<T>(response)
}
