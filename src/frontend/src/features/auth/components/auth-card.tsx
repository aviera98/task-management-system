import type { PropsWithChildren, ReactNode } from 'react'

type AuthCardProps = PropsWithChildren<{
  eyebrow: string
  title: string
  description: ReactNode
}>

export function AuthCard({ eyebrow, title, description, children }: AuthCardProps) {
  return (
    <section className="mx-auto max-w-xl rounded-[2rem] border border-black/10 bg-white/85 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
      <p className="font-mono text-xs uppercase tracking-[0.35em] text-teal-700">{eyebrow}</p>
      <h2 className="mt-4 font-display text-4xl font-semibold text-slate-950">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
      <div className="mt-8">{children}</div>
    </section>
  )
}
