import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { AuthShell } from '@/features/auth/components/auth-shell'
import { AuthSubmitButton } from '@/features/auth/components/auth-submit-button'
import { FormField } from '@/features/auth/components/form-field'
import { useAuth } from '@/features/auth/hooks/use-auth'
import { getAuthFormErrorMessage } from '@/features/auth/hooks/use-auth-form-error'
import { useDocumentTitle } from '@/hooks/use-document-title'

const loginSchema = z.object({
  email: z.email('Please enter a valid email address.'),
  password: z.string().min(1, 'Password is required.'),
})

type LoginFormValues = z.infer<typeof loginSchema>

interface RouterState {
  from?: {
    pathname?: string
  }
}

export function LoginPage() {
  useDocumentTitle('Task Management System | Login')

  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, login } = useAuth()
  const [formError, setFormError] = useState<string | null>(null)

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(loginSchema),
  })

  const from = (location.state as RouterState | null)?.from?.pathname || '/'

  if (isAuthenticated) {
    return <Navigate to={from} replace />
  }

  async function onSubmit(values: LoginFormValues) {
    setFormError(null)

    try {
      await login(values)
      navigate(from, { replace: true })
    } catch (error) {
      setFormError(getAuthFormErrorMessage(error))
    }
  }

  return (
    <AuthShell
      eyebrow="Account Access"
      title="Sign in to continue building the workspace."
      subtitle="Use the same credentials created through the backend registration flow. The interface keeps feedback concise and avoids leaking internal error details."
    >
      <div className="space-y-6">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">Login</p>
          <h3 className="mt-3 text-2xl font-semibold text-white">Welcome back</h3>
          <p className="mt-2 text-sm text-slate-300">
            Authenticate once and the session will persist across refreshes.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <FormField
            id="login-email"
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register('email')}
          />
          <FormField
            id="login-password"
            label="Password"
            type="password"
            autoComplete="current-password"
            placeholder="Your password"
            error={errors.password?.message}
            {...register('password')}
          />

          {formError ? (
            <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
              {formError}
            </div>
          ) : null}

          <AuthSubmitButton
            idleLabel="Sign in"
            loadingLabel="Signing in..."
            isLoading={isSubmitting}
          />
        </form>

        <p className="text-sm text-slate-300">
          Need an account?{' '}
          <Link className="font-medium text-cyan-300 hover:text-cyan-200" to="/register">
            Create one
          </Link>
          .
        </p>
      </div>
    </AuthShell>
  )
}
