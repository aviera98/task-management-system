import { ApiError } from '@/features/auth'

export function getTaskErrorMessage(error: unknown) {
  if (error instanceof ApiError) {
    switch (error.statusCode) {
      case 400:
      case 401:
      case 404:
        return error.message
      default:
        return 'Task request failed. Please try again.'
    }
  }

  return error instanceof Error && error.message.trim().length > 0
    ? error.message
    : 'Task request failed. Please try again.'
}
