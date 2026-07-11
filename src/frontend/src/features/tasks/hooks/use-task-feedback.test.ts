import { ApiError } from '@/features/auth'
import { getTaskErrorMessage } from '@/features/tasks/hooks/use-task-feedback'

describe('getTaskErrorMessage', () => {
  it('returns backend messages for handled task errors', () => {
    expect(getTaskErrorMessage(new ApiError('Not found.', 404))).toBe(
      'Not found.',
    )
  })

  it('returns a generic message for unexpected errors', () => {
    expect(getTaskErrorMessage(new ApiError('Server.', 500))).toBe(
      'Task request failed. Please try again.',
    )
  })
})
