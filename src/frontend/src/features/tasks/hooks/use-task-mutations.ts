import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/features/auth'
import {
  createTask,
  deleteTask,
  updateTask,
} from '@/features/tasks/api/tasks-api'
import type {
  CreateTaskRequest,
  UpdateTaskRequest,
} from '@/features/tasks/types'

export function useCreateTaskMutation() {
  const queryClient = useQueryClient()
  const { accessToken } = useAuth()

  return useMutation({
    mutationFn: (request: CreateTaskRequest) =>
      createTask(accessToken!, request),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}

export function useUpdateTaskMutation() {
  const queryClient = useQueryClient()
  const { accessToken } = useAuth()

  return useMutation({
    mutationFn: ({
      request,
      taskId,
    }: {
      taskId: string
      request: UpdateTaskRequest
    }) => updateTask(accessToken!, taskId, request),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}

export function useDeleteTaskMutation() {
  const queryClient = useQueryClient()
  const { accessToken } = useAuth()

  return useMutation({
    mutationFn: (taskId: string) => deleteTask(accessToken!, taskId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}
