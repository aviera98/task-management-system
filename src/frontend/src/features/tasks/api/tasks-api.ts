import { httpClient } from '@/features/auth/api/http-client'
import type {
  CreateTaskRequest,
  Task,
  UpdateTaskRequest,
} from '@/features/tasks/types'

export function getTasks(accessToken: string, signal?: AbortSignal) {
  return httpClient<Task[]>('/api/tasks', {
    accessToken,
    signal,
  })
}

export function createTask(accessToken: string, request: CreateTaskRequest) {
  return httpClient<Task>('/api/tasks', {
    accessToken,
    body: request,
    method: 'POST',
  })
}

export function updateTask(
  accessToken: string,
  taskId: string,
  request: UpdateTaskRequest,
) {
  return httpClient<Task>(`/api/tasks/${taskId}`, {
    accessToken,
    body: request,
    method: 'PUT',
  })
}

export function deleteTask(accessToken: string, taskId: string) {
  return httpClient<void>(`/api/tasks/${taskId}`, {
    accessToken,
    method: 'DELETE',
  })
}
