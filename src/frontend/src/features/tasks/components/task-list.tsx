import type { Task, TaskStatus } from '@/features/tasks/types'
import { TaskCard } from '@/features/tasks/components/task-card'

interface TaskListProps {
  deletingTaskId: string | null
  editingTaskId: string | null
  statusUpdatingTaskId: string | null
  tasks: Task[]
  onDelete: (task: Task) => void
  onEdit: (task: Task) => void
  onStatusChange: (task: Task, status: TaskStatus) => void
}

export function TaskList({
  deletingTaskId,
  editingTaskId,
  onDelete,
  onEdit,
  onStatusChange,
  statusUpdatingTaskId,
  tasks,
}: TaskListProps) {
  return (
    <div className="grid gap-4">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          isDeleting={deletingTaskId === task.id}
          isEditing={editingTaskId === task.id}
          isUpdatingStatus={statusUpdatingTaskId === task.id}
          onDelete={() => onDelete(task)}
          onEdit={() => onEdit(task)}
          onStatusChange={(status) => onStatusChange(task, status)}
        />
      ))}
    </div>
  )
}
