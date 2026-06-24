import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { AuthShell } from '@/features/auth/components/auth-shell'
import { AuthSubmitButton } from '@/features/auth/components/auth-submit-button'
import { FormField } from '@/features/auth/components/form-field'
import { useAuth } from '@/features/auth/hooks/use-auth'
import { getAuthFormErrorMessage } from '@/features/auth/hooks/use-auth-form-error'
import { useDocumentTitle } from '@/hooks/use-document-title'

const registerSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, 'First name is required.')
    .max(100, 'First name must contain at most 100 characters.'),
  lastName: z
    .string()
    .trim()
    .min(1, 'Last name is required.')
    .max(100, 'Last name must contain at most 100 characters.'),
  email: z.email('Please enter a valid email address.'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long.')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter.')
    .regex(/[0-9]/, 'Password must contain at least one number.'),
})

type RegisterFormValues = z.infer<typeof registerSchema>

export function RegisterPage() {
  useDocumentTitle('Task Management System | Register')

  const navigate = useNavigate()
  const { register: registerAccount } = useAuth()
  const [formError, setFormError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm<RegisterFormValues>({
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      password: '',
    },
    resolver: zodResolver(registerSchema),
  })

  async function onSubmit(values: RegisterFormValues) {
    setFormError(null)
    setSuccessMessage(null)

    try {
      await registerAccount(values)
      setSuccessMessage('Account created successfully. Redirecting...')
      navigate('/', { replace: true })
    } catch (error) {
      setFormError(getAuthFormErrorMessage(error))
    }
  }

  return (
    <AuthShell
      eyebrow="New Account"
      title="Create a project account with backend-aligned validation."
      subtitle="The form mirrors the registration rules already enforced by the API and signs the user in immediately after success."
    >
      <div className="space-y-6">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">Register</p>
          <h3 className="mt-3 text-2xl font-semibold text-white">Create your account</h3>
          <p className="mt-2 text-sm text-slate-300">
            The resulting JWT is stored locally and reused for future protected routes.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              id="register-first-name"
              label="First name"
              autoComplete="given-name"
              placeholder="Ada"
              error={errors.firstName?.message}
              {...register('firstName')}
            />
            <FormField
              id="register-last-name"
              label="Last name"
              autoComplete="family-name"
              placeholder="Lovelace"
              error={errors.lastName?.message}
              {...register('lastName')}
            />
          </div>

          <FormField
            id="register-email"
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="ada@example.com"
            error={errors.email?.message}
            {...register('email')}
          />
          <FormField
            id="register-password"
            label="Password"
            type="password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            error={errors.password?.message}
            {...register('password')}
          />

          {formError ? (
            <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
              {formError}
            </div>
          ) : null}

          {successMessage ? (
            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
              {successMessage}
            </div>
          ) : null}

          <AuthSubmitButton
            idleLabel="Create account"
            loadingLabel="Creating account..."
            isLoading={isSubmitting}
          />
        </form>

        <p className="text-sm text-slate-300">
          Already registered?{' '}
          <Link className="font-medium text-cyan-300 hover:text-cyan-200" to="/login">
            Sign in
          </Link>
          .
        </p>
      </div>
    </AuthShell>
  )
}
