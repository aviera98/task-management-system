import type { TaskPriority, TaskStatus } from '@/features/tasks/types/task'

export interface UpdateTaskRequest {
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
}
