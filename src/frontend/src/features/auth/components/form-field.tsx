import type { InputHTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string
  label: string
}

export function FormField({ className, error, id, label, ...props }: FormFieldProps) {
  return (
    <label className="block space-y-2" htmlFor={id}>
      <span className="text-sm font-medium text-slate-200">{label}</span>
      <input
        {...props}
        id={id}
        className={cn(
          'w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-50 outline-none transition',
          'placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30',
          error ? 'border-rose-400/70 focus:border-rose-400 focus:ring-rose-400/20' : '',
          className,
        )}
      />
      {error ? <p className="text-sm text-rose-300">{error}</p> : null}
    </label>
  )
}
