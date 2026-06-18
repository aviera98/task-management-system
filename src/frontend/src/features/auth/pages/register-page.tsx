import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { AuthCard } from '@/features/auth/components/auth-card'
import { TextField } from '@/features/auth/components/text-field'
import {
  registerSchema,
  type RegisterSchema,
} from '@/features/auth/schema/auth-form-schema'

export function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async () => {
    await new Promise((resolve) => setTimeout(resolve, 300))
  }

  return (
    <AuthCard
      eyebrow="User Onboarding"
      title="Create account"
      description="Registration flow, DTOs and password policies can be demonstrated from the next API milestone without changing this UI contract."
    >
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <TextField label="Full name" error={errors.fullName?.message} {...register('fullName')} />
        <TextField label="Email" error={errors.email?.message} {...register('email')} />
        <TextField
          label="Password"
          type="password"
          error={errors.password?.message}
          {...register('password')}
        />
        <TextField
          label="Confirm password"
          type="password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-2xl bg-teal-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-teal-600 disabled:opacity-60"
        >
          {isSubmitting ? 'Creating...' : 'Create account'}
        </button>
      </form>
    </AuthCard>
  )
}
