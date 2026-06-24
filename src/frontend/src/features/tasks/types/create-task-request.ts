import type { TaskPriority } from '@/features/tasks/types/task'

export interface CreateTaskRequest {
  title: string
  description: string
  priority: TaskPriority
}
