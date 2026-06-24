import type { PropsWithChildren } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { AuthContext } from '@/features/auth/context/auth-context'
import * as tasksApi from '@/features/tasks/api/tasks-api'
import { useTasksQuery } from '@/features/tasks/hooks/use-tasks-query'

vi.mock('@/features/tasks/api/tasks-api')

describe('useTasksQuery', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  it('loads tasks for the authenticated user', async () => {
    vi.mocked(tasksApi.getTasks).mockResolvedValue([
      {
        id: 'task-1',
        title: 'Task',
        description: 'Description',
        status: 'Todo',
        priority: 'Medium',
        userId: 'user-1',
        createdAt: new Date().toISOString(),
        updatedAt: null,
      },
    ] as never)

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    })

    function Wrapper({ children }: PropsWithChildren) {
      return (
        <QueryClientProvider client={queryClient}>
          <AuthContext
            value={{
              accessToken: 'token-123',
              isAuthenticated: true,
              isInitializing: false,
              login: vi.fn(),
              logout: vi.fn(),
              register: vi.fn(),
              session: null,
              user: null,
            }}
          >
            {children}
          </AuthContext>
        </QueryClientProvider>
      )
    }

    const { result } = renderHook(() => useTasksQuery(), {
      wrapper: Wrapper,
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(tasksApi.getTasks).toHaveBeenCalledWith('token-123', expect.any(AbortSignal))
    expect(result.current.data).toHaveLength(1)
  })
})
