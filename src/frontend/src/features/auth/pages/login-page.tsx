import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { AuthCard } from '@/features/auth/components/auth-card'
import { TextField } from '@/features/auth/components/text-field'
import { loginSchema, type LoginSchema } from '@/features/auth/schema/auth-form-schema'

export function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'admin@taskms.dev',
      password: 'Password123!',
    },
  })

  const onSubmit = async () => {
    await new Promise((resolve) => setTimeout(resolve, 300))
  }

  return (
    <AuthCard
      eyebrow="Authentication"
      title="Sign in"
      description="The UI and validation are ready. JWT issuance and role claims arrive in the next increment."
    >
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <TextField label="Email" error={errors.email?.message} {...register('email')} />
        <TextField
          label="Password"
          type="password"
          error={errors.password?.message}
          {...register('password')}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
        >
          {isSubmitting ? 'Validating...' : 'Continue'}
        </button>
      </form>
    </AuthCard>
  )
}
