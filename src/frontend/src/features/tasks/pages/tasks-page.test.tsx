import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ApiError } from '@/features/auth'
import { TasksPage } from '@/features/tasks/pages/tasks-page'
import * as tasksQueryHook from '@/features/tasks/hooks/use-tasks-query'
import * as tasksMutationsHook from '@/features/tasks/hooks/use-task-mutations'
import type { Task } from '@/features/tasks/types'

vi.mock('@/hooks/use-document-title', () => ({
  useDocumentTitle: vi.fn(),
}))

vi.mock('@/features/tasks/hooks/use-tasks-query')
vi.mock('@/features/tasks/hooks/use-task-mutations')

const createMutation = {
  isPending: false,
  mutateAsync: vi.fn(),
}

const updateMutation = {
  isPending: false,
  mutateAsync: vi.fn(),
}

const deleteMutation = {
  isPending: false,
  mutateAsync: vi.fn(),
}

function mockTasksPageState(overrides?: {
  data?: Task[]
  isError?: boolean
  isLoading?: boolean
  error?: unknown
}) {
  vi.mocked(tasksQueryHook.useTasksQuery).mockReturnValue({
    data: overrides?.data,
    error: overrides?.error ?? null,
    isError: overrides?.isError ?? false,
    isLoading: overrides?.isLoading ?? false,
  } as ReturnType<typeof tasksQueryHook.useTasksQuery>)

  vi.mocked(tasksMutationsHook.useCreateTaskMutation).mockReturnValue(
    createMutation as never,
  )
  vi.mocked(tasksMutationsHook.useUpdateTaskMutation).mockReturnValue(
    updateMutation as never,
  )
  vi.mocked(tasksMutationsHook.useDeleteTaskMutation).mockReturnValue(
    deleteMutation as never,
  )
}

describe('TasksPage', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    createMutation.mutateAsync.mockReset()
    updateMutation.mutateAsync.mockReset()
    deleteMutation.mutateAsync.mockReset()
  })

  it('renders loading state', () => {
    mockTasksPageState({ isLoading: true })

    render(<TasksPage />)

    expect(screen.getByText('Loading tasks...')).toBeInTheDocument()
  })

  it('renders empty state', () => {
    mockTasksPageState({ data: [] })

    render(<TasksPage />)

    expect(
      screen.getByText(
        'No tasks yet. Create the first one from the form to start the authenticated workflow.',
      ),
    ).toBeInTheDocument()
  })

  it('renders error state', () => {
    mockTasksPageState({
      isError: true,
      error: new ApiError('Request failed.', 500),
    })

    render(<TasksPage />)

    expect(
      screen.getByText('Task request failed. Please try again.'),
    ).toBeInTheDocument()
  })

  it('renders the task list', () => {
    mockTasksPageState({
      data: [
        {
          id: 'task-1',
          title: 'Write tests',
          description: 'Cover the task page states.',
          status: 'InProgress',
          priority: 'High',
          userId: 'user-1',
          createdAt: new Date().toISOString(),
          updatedAt: null,
        },
        {
          id: 'task-2',
          title: 'Ship release',
          description: '',
          status: 'Todo',
          priority: 'Medium',
          userId: 'user-1',
          createdAt: new Date().toISOString(),
          updatedAt: null,
        },
      ],
    })

    render(<TasksPage />)

    expect(screen.getByText('Write tests')).toBeInTheDocument()
    expect(screen.getByText('Ship release')).toBeInTheDocument()
    expect(screen.getByText('2 items')).toBeInTheDocument()
  })

  it('creates a task through the form', async () => {
    const user = userEvent.setup()
    createMutation.mutateAsync.mockResolvedValue(undefined)
    mockTasksPageState({ data: [] })

    render(<TasksPage />)

    await user.type(screen.getByLabelText('Title'), 'Create test task')
    await user.type(screen.getByLabelText('Description'), 'Body')
    await user.selectOptions(screen.getByLabelText('Priority'), 'High')
    await user.click(screen.getByRole('button', { name: 'Create task' }))

    expect(
      await screen.findByText('Task created successfully.'),
    ).toBeInTheDocument()
    expect(createMutation.mutateAsync).toHaveBeenCalledWith({
      title: 'Create test task',
      description: 'Body',
      priority: 'High',
    })
  })

  it('opens edit mode and updates a task', async () => {
    const user = userEvent.setup()
    updateMutation.mutateAsync.mockResolvedValue(undefined)
    mockTasksPageState({
      data: [
        {
          id: 'task-1',
          title: 'Write tests',
          description: 'Cover page handlers',
          status: 'Todo',
          priority: 'High',
          userId: 'user-1',
          createdAt: new Date().toISOString(),
          updatedAt: null,
        },
      ],
    })

    render(<TasksPage />)

    await user.click(screen.getByRole('button', { name: 'Edit' }))
    const editTitleInput = screen.getAllByLabelText('Title')[1]
    await user.clear(editTitleInput)
    await user.type(editTitleInput, 'Updated task')
    await user.click(screen.getByRole('button', { name: 'Save changes' }))

    expect(
      await screen.findByText('Task updated successfully.'),
    ).toBeInTheDocument()
    expect(updateMutation.mutateAsync).toHaveBeenCalledWith({
      taskId: 'task-1',
      request: {
        title: 'Updated task',
        description: 'Cover page handlers',
        status: 'Todo',
        priority: 'High',
      },
    })
  })

  it('deletes a task and changes status', async () => {
    const user = userEvent.setup()
    updateMutation.mutateAsync.mockResolvedValue(undefined)
    deleteMutation.mutateAsync.mockResolvedValue(undefined)
    mockTasksPageState({
      data: [
        {
          id: 'task-1',
          title: 'Write tests',
          description: 'Cover page handlers',
          status: 'Todo',
          priority: 'High',
          userId: 'user-1',
          createdAt: new Date().toISOString(),
          updatedAt: null,
        },
      ],
    })

    render(<TasksPage />)

    await user.click(screen.getByRole('button', { name: 'Completed' }))
    expect(
      await screen.findByText('Task status updated successfully.'),
    ).toBeInTheDocument()
    expect(updateMutation.mutateAsync).toHaveBeenCalledWith({
      taskId: 'task-1',
      request: {
        title: 'Write tests',
        description: 'Cover page handlers',
        priority: 'High',
        status: 'Completed',
      },
    })

    await user.click(screen.getByRole('button', { name: 'Delete' }))
    expect(
      await screen.findByText('Task deleted successfully.'),
    ).toBeInTheDocument()
    expect(deleteMutation.mutateAsync).toHaveBeenCalledWith('task-1')
  })
})
