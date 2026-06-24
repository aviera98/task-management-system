export type TaskStatus = 'Todo' | 'InProgress' | 'Completed'
export type TaskPriority = 'Low' | 'Medium' | 'High'

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  userId: string
  createdAt: string
  updatedAt: string | null
}
