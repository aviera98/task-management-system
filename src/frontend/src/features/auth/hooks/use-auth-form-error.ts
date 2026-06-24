import { ApiError } from '@/features/auth/types'

const DEFAULT_AUTH_ERROR = 'Something went wrong. Please try again.'

export function getAuthFormErrorMessage(error: unknown) {
  if (error instanceof ApiError) {
    switch (error.statusCode) {
      case 400:
      case 401:
      case 409:
        return error.message
      default:
        return DEFAULT_AUTH_ERROR
    }
  }

  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message
  }

  return DEFAULT_AUTH_ERROR
}
