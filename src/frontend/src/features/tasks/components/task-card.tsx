import type { Task, TaskStatus } from '@/features/tasks/types'
import { cn } from '@/utils/cn'

const statusAccentMap: Record<TaskStatus, string> = {
  Todo: 'bg-slate-400/20 text-slate-200',
  InProgress: 'bg-amber-400/20 text-amber-200',
  Completed: 'bg-emerald-400/20 text-emerald-200',
}

interface TaskCardProps {
  task: Task
  isDeleting: boolean
  isEditing: boolean
  isUpdatingStatus: boolean
  onDelete: () => void
  onEdit: () => void
  onStatusChange: (status: TaskStatus) => void
}

export function TaskCard({
  isDeleting,
  isEditing,
  isUpdatingStatus,
  onDelete,
  onEdit,
  onStatusChange,
  task,
}: TaskCardProps) {
  return (
    <article className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                'rounded-full px-3 py-1 text-xs font-medium',
                statusAccentMap[task.status],
              )}
            >
              {task.status}
            </span>
            <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
              {task.priority}
            </span>
          </div>

          <h3 className="mt-4 text-xl font-semibold text-white">
            {task.title}
          </h3>
          <p className="mt-2 max-w-2xl whitespace-pre-wrap text-sm leading-6 text-slate-300">
            {task.description || 'No description provided.'}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onEdit}
            className="rounded-full border border-white/10 px-3 py-2 text-sm text-slate-200 transition hover:border-cyan-300 hover:text-white"
          >
            {isEditing ? 'Editing' : 'Edit'}
          </button>
          <button
            type="button"
            disabled={isDeleting}
            onClick={onDelete}
            className="rounded-full border border-rose-400/20 px-3 py-2 text-sm text-rose-200 transition hover:border-rose-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {(['Todo', 'InProgress', 'Completed'] as TaskStatus[]).map((status) => (
          <button
            key={status}
            type="button"
            disabled={isUpdatingStatus || task.status === status}
            onClick={() => onStatusChange(status)}
            className={cn(
              'rounded-full px-3 py-2 text-xs font-medium transition',
              task.status === status
                ? 'bg-cyan-400 text-slate-950'
                : 'border border-white/10 text-slate-300 hover:text-white',
            )}
          >
            {isUpdatingStatus && task.status !== status
              ? 'Updating...'
              : status}
          </button>
        ))}
      </div>
    </article>
  )
}
