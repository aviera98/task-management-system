import userEvent from '@testing-library/user-event'
import { render, screen, waitFor } from '@testing-library/react'
import { TaskForm } from '@/features/tasks/components/task-form'
import type { Task } from '@/features/tasks/types'

describe('TaskForm', () => {
  it('submits create task values', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn().mockResolvedValue(undefined)

    render(
      <TaskForm
        mode="create"
        isSubmitting={false}
        submitLabel="Create task"
        onSubmit={onSubmit}
      />,
    )

    await user.type(screen.getByLabelText('Title'), 'Release docs')
    await user.type(
      screen.getByLabelText('Description'),
      'Prepare docs for deployment.',
    )
    await user.selectOptions(screen.getByLabelText('Priority'), 'High')
    await user.click(screen.getByRole('button', { name: 'Create task' }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        title: 'Release docs',
        description: 'Prepare docs for deployment.',
        priority: 'High',
      })
    })
  })

  it('submits edit task values', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    const task: Task = {
      id: 'task-1',
      title: 'Draft task',
      description: 'Initial description',
      status: 'Todo',
      priority: 'Medium',
      userId: 'user-1',
      createdAt: new Date().toISOString(),
      updatedAt: null,
    }

    render(
      <TaskForm
        mode="edit"
        initialTask={task}
        isSubmitting={false}
        submitLabel="Save changes"
        onCancel={vi.fn()}
        onSubmit={onSubmit}
      />,
    )

    await user.clear(screen.getByLabelText('Title'))
    await user.type(screen.getByLabelText('Title'), 'Final task')
    await user.selectOptions(screen.getByLabelText('Status'), 'Completed')
    await user.selectOptions(screen.getByLabelText('Priority'), 'Low')
    await user.click(screen.getByRole('button', { name: 'Save changes' }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        title: 'Final task',
        description: 'Initial description',
        status: 'Completed',
        priority: 'Low',
      })
    })
  })

  it('shows validation errors when required fields are missing', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn().mockResolvedValue(undefined)

    render(
      <TaskForm
        mode="create"
        isSubmitting={false}
        submitLabel="Create task"
        onSubmit={onSubmit}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Create task' }))

    expect(await screen.findByText('Title is required.')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })
})
