import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import type {
  CreateTaskRequest,
  Task,
  TaskPriority,
  TaskStatus,
  UpdateTaskRequest,
} from '@/features/tasks/types'
import { FormField } from '@/features/auth/components/form-field'
import { cn } from '@/utils/cn'

const taskStatusOptions: TaskStatus[] = ['Todo', 'InProgress', 'Completed']
const taskPriorityOptions: TaskPriority[] = ['Low', 'Medium', 'High']

const createTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required.')
    .max(200, 'Title must contain at most 200 characters.'),
  description: z
    .string()
    .max(2000, 'Description must contain at most 2000 characters.'),
  priority: z.enum(taskPriorityOptions),
})

const updateTaskSchema = createTaskSchema.extend({
  status: z.enum(taskStatusOptions),
})

type CreateTaskFormValues = z.infer<typeof createTaskSchema>
type UpdateTaskFormValues = z.infer<typeof updateTaskSchema>

interface CreateTaskFormProps {
  mode: 'create'
  isSubmitting: boolean
  submitLabel: string
  onSubmit: (values: CreateTaskRequest) => Promise<void>
}

interface EditTaskFormProps {
  mode: 'edit'
  initialTask: Task
  isSubmitting: boolean
  submitLabel: string
  onCancel: () => void
  onSubmit: (values: UpdateTaskRequest) => Promise<void>
}

type TaskFormProps = CreateTaskFormProps | EditTaskFormProps

export function TaskForm(props: TaskFormProps) {
  const { isSubmitting, mode, onSubmit, submitLabel } = props
  const initialTask = mode === 'edit' ? props.initialTask : undefined
  const onCancel = mode === 'edit' ? props.onCancel : undefined

  const form = useForm<CreateTaskFormValues | UpdateTaskFormValues>({
    defaultValues:
      mode === 'create'
        ? {
            title: '',
            description: '',
            priority: 'Medium',
          }
        : {
            title: initialTask?.title ?? '',
            description: initialTask?.description ?? '',
            priority: initialTask?.priority ?? 'Medium',
            status: initialTask?.status ?? 'Todo',
          },
    resolver: zodResolver(
      mode === 'create' ? createTaskSchema : updateTaskSchema,
    ),
  })

  const {
    formState: { errors },
    handleSubmit,
    register,
  } = form

  async function submit(values: CreateTaskFormValues | UpdateTaskFormValues) {
    if (mode === 'create') {
      await onSubmit(values as CreateTaskRequest)
    } else {
      await onSubmit(values as UpdateTaskRequest)
    }

    if (mode === 'create') {
      form.reset({
        title: '',
        description: '',
        priority: 'Medium',
      })
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(submit)}>
      <FormField
        id={`${mode}-task-title`}
        label="Title"
        placeholder="Prepare release checklist"
        error={errors.title?.message}
        {...register('title')}
      />

      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-200">Description</span>
        <textarea
          rows={4}
          placeholder="Add context, acceptance notes or handoff details."
          className={cn(
            'w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-50 outline-none transition',
            'placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30',
            errors.description
              ? 'border-rose-400/70 focus:border-rose-400 focus:ring-rose-400/20'
              : '',
          )}
          {...register('description')}
        />
        {errors.description ? (
          <p className="text-sm text-rose-300">{errors.description.message}</p>
        ) : null}
      </label>

      <div
        className={cn(
          'grid gap-4',
          mode === 'edit' ? 'md:grid-cols-2' : 'md:grid-cols-1',
        )}
      >
        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-200">Priority</span>
          <select
            className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-50 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
            {...register('priority')}
          >
            {taskPriorityOptions.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
        </label>

        {mode === 'edit' ? (
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-200">Status</span>
            <select
              className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-50 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
              {...register('status')}
            >
              {taskStatusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-2xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:bg-cyan-400/60"
        >
          {isSubmitting ? 'Saving...' : submitLabel}
        </button>

        {mode === 'edit' && onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-2xl border border-white/10 px-4 py-3 text-sm text-slate-200 transition hover:border-white/20 hover:text-white"
          >
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  )
}
