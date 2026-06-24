import type { PropsWithChildren } from 'react'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { AuthContext } from '@/features/auth/context/auth-context'
import * as tasksApi from '@/features/tasks/api/tasks-api'
import {
  useCreateTaskMutation,
  useDeleteTaskMutation,
  useUpdateTaskMutation,
} from '@/features/tasks/hooks/use-task-mutations'

vi.mock('@/features/tasks/api/tasks-api')

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
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

  return { queryClient, Wrapper }
}

describe('task mutations hooks', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  it('creates, updates and deletes tasks through the API layer', async () => {
    vi.mocked(tasksApi.createTask).mockResolvedValue({ id: 'task-1' } as never)
    vi.mocked(tasksApi.updateTask).mockResolvedValue({ id: 'task-1' } as never)
    vi.mocked(tasksApi.deleteTask).mockResolvedValue(undefined as never)

    const createWrapperResult = createWrapper()
    const createResult = renderHook(() => useCreateTaskMutation(), {
      wrapper: createWrapperResult.Wrapper,
    })

    createResult.result.current.mutate({
      title: 'Task',
      description: 'Description',
      priority: 'High',
    })

    await waitFor(() => {
      expect(tasksApi.createTask).toHaveBeenCalledWith('token-123', {
        title: 'Task',
        description: 'Description',
        priority: 'High',
      })
    })

    const updateWrapperResult = createWrapper()
    const updateResult = renderHook(() => useUpdateTaskMutation(), {
      wrapper: updateWrapperResult.Wrapper,
    })

    updateResult.result.current.mutate({
      taskId: 'task-1',
      request: {
        title: 'Task',
        description: 'Description',
        priority: 'Low',
        status: 'Completed',
      },
    })

    await waitFor(() => {
      expect(tasksApi.updateTask).toHaveBeenCalledWith('token-123', 'task-1', {
        title: 'Task',
        description: 'Description',
        priority: 'Low',
        status: 'Completed',
      })
    })

    const deleteWrapperResult = createWrapper()
    const deleteResult = renderHook(() => useDeleteTaskMutation(), {
      wrapper: deleteWrapperResult.Wrapper,
    })

    deleteResult.result.current.mutate('task-1')

    await waitFor(() => {
      expect(tasksApi.deleteTask).toHaveBeenCalledWith('token-123', 'task-1')
    })
  })
})
