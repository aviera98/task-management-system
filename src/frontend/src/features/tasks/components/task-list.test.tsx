import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'
import { TaskList } from '@/features/tasks/components/task-list'
import type { Task } from '@/features/tasks/types'

const tasks: Task[] = [
  {
    id: 'task-1',
    title: 'Write tests',
    description: 'Cover task list',
    status: 'Todo',
    priority: 'High',
    userId: 'user-1',
    createdAt: new Date().toISOString(),
    updatedAt: null,
  },
]

describe('TaskList', () => {
  it('renders tasks and forwards user actions', async () => {
    const user = userEvent.setup()
    const onDelete = vi.fn()
    const onEdit = vi.fn()
    const onStatusChange = vi.fn()

    render(
      <TaskList
        tasks={tasks}
        deletingTaskId={null}
        editingTaskId={null}
        statusUpdatingTaskId={null}
        onDelete={onDelete}
        onEdit={onEdit}
        onStatusChange={onStatusChange}
      />,
    )

    expect(screen.getByText('Write tests')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Edit' }))
    await user.click(screen.getByRole('button', { name: 'Delete' }))
    await user.click(screen.getByRole('button', { name: 'InProgress' }))

    expect(onEdit).toHaveBeenCalledWith(tasks[0])
    expect(onDelete).toHaveBeenCalledWith(tasks[0])
    expect(onStatusChange).toHaveBeenCalledWith(tasks[0], 'InProgress')
  })
})
