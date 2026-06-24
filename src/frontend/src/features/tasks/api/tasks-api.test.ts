import * as httpClientModule from '@/features/auth/api/http-client'
import { createTask, deleteTask, getTasks, updateTask } from '@/features/tasks/api/tasks-api'

vi.mock('@/features/auth/api/http-client')

describe('tasks-api', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  it('fetches tasks for the authenticated user', async () => {
    const httpClientMock = vi.mocked(httpClientModule.httpClient)
    httpClientMock.mockResolvedValue([] as never)

    await getTasks('token-123')

    expect(httpClientMock).toHaveBeenCalledWith('/api/tasks', {
      accessToken: 'token-123',
      signal: undefined,
    })
  })

  it('creates a task', async () => {
    const httpClientMock = vi.mocked(httpClientModule.httpClient)
    httpClientMock.mockResolvedValue({ id: 'task-1' } as never)

    await createTask('token-123', {
      title: 'Task',
      description: 'Description',
      priority: 'High',
    })

    expect(httpClientMock).toHaveBeenCalledWith('/api/tasks', {
      accessToken: 'token-123',
      body: {
        title: 'Task',
        description: 'Description',
        priority: 'High',
      },
      method: 'POST',
    })
  })

  it('updates and deletes a task', async () => {
    const httpClientMock = vi.mocked(httpClientModule.httpClient)
    httpClientMock.mockResolvedValue({} as never)

    await updateTask('token-123', 'task-1', {
      title: 'Task',
      description: 'Description',
      priority: 'Low',
      status: 'Completed',
    })
    await deleteTask('token-123', 'task-1')

    expect(httpClientMock).toHaveBeenNthCalledWith(1, '/api/tasks/task-1', {
      accessToken: 'token-123',
      body: {
        title: 'Task',
        description: 'Description',
        priority: 'Low',
        status: 'Completed',
      },
      method: 'PUT',
    })
    expect(httpClientMock).toHaveBeenNthCalledWith(2, '/api/tasks/task-1', {
      accessToken: 'token-123',
      method: 'DELETE',
    })
  })
})
