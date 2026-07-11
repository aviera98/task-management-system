import type { ReactNode } from 'react'

interface AuthShellProps {
  eyebrow: string
  subtitle: string
  title: string
  children: ReactNode
}

export function AuthShell({
  eyebrow,
  subtitle,
  title,
  children,
}: AuthShellProps) {
  return (
    <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
      <div className="rounded-[2rem] border border-cyan-400/20 bg-linear-to-br from-cyan-500/15 via-slate-900 to-slate-950 p-8 shadow-2xl shadow-cyan-950/20">
        <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">
          {eyebrow}
        </p>
        <h2 className="mt-6 max-w-md text-4xl font-semibold leading-tight text-white">
          {title}
        </h2>
        <p className="mt-4 max-w-xl text-base leading-7 text-slate-300">
          {subtitle}
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <article className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm font-medium text-white">JWT session</p>
            <p className="mt-2 text-sm text-slate-300">
              The session is restored automatically from local storage after
              refresh.
            </p>
          </article>
          <article className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm font-medium text-white">Protected routing</p>
            <p className="mt-2 text-sm text-slate-300">
              Future private modules can be mounted behind a single auth
              boundary.
            </p>
          </article>
        </div>
      </div>

      <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur">
        {children}
      </div>
    </section>
  )
}
