import { useState } from 'react'
import type { Task, TaskFeedback, TaskStatus, UpdateTaskRequest } from '@/features/tasks/types'
import { TaskForm } from '@/features/tasks/components/task-form'
import { TaskList } from '@/features/tasks/components/task-list'
import { getTaskErrorMessage } from '@/features/tasks/hooks/use-task-feedback'
import { useTasksQuery } from '@/features/tasks/hooks/use-tasks-query'
import {
  useCreateTaskMutation,
  useDeleteTaskMutation,
  useUpdateTaskMutation,
} from '@/features/tasks/hooks/use-task-mutations'
import { useDocumentTitle } from '@/hooks/use-document-title'

export function TasksPage() {
  useDocumentTitle('Task Management System | Tasks')

  const tasksQuery = useTasksQuery()
  const createTaskMutation = useCreateTaskMutation()
  const updateTaskMutation = useUpdateTaskMutation()
  const deleteTaskMutation = useDeleteTaskMutation()

  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null)
  const [statusUpdatingTaskId, setStatusUpdatingTaskId] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<TaskFeedback | null>(null)

  async function handleCreate(values: { title: string; description: string; priority: Task['priority'] }) {
    setFeedback(null)

    try {
      await createTaskMutation.mutateAsync(values)
      setFeedback({ message: 'Task created successfully.', tone: 'success' })
    } catch (error) {
      setFeedback({ message: getTaskErrorMessage(error), tone: 'error' })
    }
  }

  async function handleUpdate(values: UpdateTaskRequest) {
    if (!editingTask) {
      return
    }

    setFeedback(null)

    try {
      await updateTaskMutation.mutateAsync({
        taskId: editingTask.id,
        request: values,
      })
      setEditingTask(null)
      setFeedback({ message: 'Task updated successfully.', tone: 'success' })
    } catch (error) {
      setFeedback({ message: getTaskErrorMessage(error), tone: 'error' })
    }
  }

  async function handleDelete(task: Task) {
    setDeletingTaskId(task.id)
    setFeedback(null)

    try {
      await deleteTaskMutation.mutateAsync(task.id)
      if (editingTask?.id === task.id) {
        setEditingTask(null)
      }
      setFeedback({ message: 'Task deleted successfully.', tone: 'success' })
    } catch (error) {
      setFeedback({ message: getTaskErrorMessage(error), tone: 'error' })
    } finally {
      setDeletingTaskId(null)
    }
  }

  async function handleStatusChange(task: Task, status: TaskStatus) {
    setStatusUpdatingTaskId(task.id)
    setFeedback(null)

    try {
      await updateTaskMutation.mutateAsync({
        taskId: task.id,
        request: {
          title: task.title,
          description: task.description,
          priority: task.priority,
          status,
        },
      })
      setFeedback({ message: 'Task status updated successfully.', tone: 'success' })
    } catch (error) {
      setFeedback({ message: getTaskErrorMessage(error), tone: 'error' })
    } finally {
      setStatusUpdatingTaskId(null)
    }
  }

  return (
    <section className="space-y-8">
      <div className="rounded-[2rem] border border-white/10 bg-linear-to-br from-cyan-500/15 via-slate-900 to-slate-950 p-8">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Protected Tasks</p>
        <h2 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight text-white">
          Manage your own task backlog with authenticated CRUD operations.
        </h2>
        <p className="mt-4 max-w-2xl text-slate-300">
          Every request is scoped to the authenticated user. The page is already prepared for
          future dashboards, metrics and private modules.
        </p>
      </div>

      {feedback ? (
        <div
          className={
            feedback.tone === 'success'
              ? 'rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200'
              : 'rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200'
          }
        >
          {feedback.message}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-6">
          <section className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
            <div className="mb-5">
              <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Create Task</p>
              <h3 className="mt-2 text-2xl font-semibold text-white">Add a new work item</h3>
            </div>

            <TaskForm
              mode="create"
              submitLabel="Create task"
              isSubmitting={createTaskMutation.isPending}
              onSubmit={handleCreate}
            />
          </section>

          {editingTask ? (
            <section className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
              <div className="mb-5">
                <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Edit Task</p>
                <h3 className="mt-2 text-2xl font-semibold text-white">{editingTask.title}</h3>
              </div>

              <TaskForm
                mode="edit"
                initialTask={editingTask}
                submitLabel="Save changes"
                isSubmitting={updateTaskMutation.isPending}
                onCancel={() => setEditingTask(null)}
                onSubmit={handleUpdate}
              />
            </section>
          ) : null}
        </div>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Task List</p>
              <h3 className="mt-2 text-2xl font-semibold text-white">Your current tasks</h3>
            </div>
            <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
              {tasksQuery.data?.length ?? 0} items
            </div>
          </div>

          {tasksQuery.isLoading ? (
            <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-8 text-sm text-slate-300">
              Loading tasks...
            </div>
          ) : null}

          {tasksQuery.isError ? (
            <div className="rounded-[1.75rem] border border-rose-400/20 bg-rose-400/10 p-8 text-sm text-rose-200">
              {getTaskErrorMessage(tasksQuery.error)}
            </div>
          ) : null}

          {!tasksQuery.isLoading && !tasksQuery.isError && (tasksQuery.data?.length ?? 0) === 0 ? (
            <div className="rounded-[1.75rem] border border-dashed border-white/15 bg-white/5 p-8 text-sm text-slate-300">
              No tasks yet. Create the first one from the form to start the authenticated workflow.
            </div>
          ) : null}

          {!tasksQuery.isLoading && !tasksQuery.isError && tasksQuery.data ? (
            <TaskList
              tasks={tasksQuery.data}
              editingTaskId={editingTask?.id ?? null}
              deletingTaskId={deletingTaskId}
              statusUpdatingTaskId={statusUpdatingTaskId}
              onDelete={handleDelete}
              onEdit={setEditingTask}
              onStatusChange={handleStatusChange}
            />
          ) : null}
        </section>
      </div>
    </section>
  )
}
