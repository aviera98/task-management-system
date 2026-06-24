import { ApiError } from '@/features/auth/types'
import { getAuthFormErrorMessage } from '@/features/auth/hooks/use-auth-form-error'

describe('getAuthFormErrorMessage', () => {
  it('returns backend messages for handled status codes', () => {
    expect(getAuthFormErrorMessage(new ApiError('Conflict.', 409))).toBe('Conflict.')
  })

  it('returns generic message for unknown errors', () => {
    expect(getAuthFormErrorMessage(new ApiError('Server.', 500))).toBe(
      'Something went wrong. Please try again.',
    )
  })
})
