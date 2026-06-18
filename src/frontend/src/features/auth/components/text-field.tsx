import type { InputHTMLAttributes } from 'react'

type TextFieldProps = {
  error?: string
  label: string
  type?: string
} & InputHTMLAttributes<HTMLInputElement>

export function TextField({ error, label, type = 'text', ...props }: TextFieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>
      <input
        {...props}
        type={type}
        className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-950 focus:bg-white"
      />
      {error ? <span className="mt-2 block text-sm text-rose-600">{error}</span> : null}
    </label>
  )
}
