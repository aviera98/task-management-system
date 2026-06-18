import { StatCard } from '@/shared/ui/stat-card'
import { useDashboardSummary } from '@/features/dashboard/hooks/use-dashboard-summary'

export function DashboardPage() {
  const { data, isLoading } = useDashboardSummary()

  return (
    <section className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <article className="rounded-[2rem] border border-black/10 bg-slate-950 p-8 text-white shadow-[0_24px_80px_rgba(15,23,42,0.24)]">
          <p className="font-mono text-xs uppercase tracking-[0.4em] text-teal-300">
            Stage 1
          </p>
          <h2 className="mt-4 max-w-xl font-display text-5xl font-semibold leading-tight">
            Foundation ready for auth, CRUD, filters, metrics and CI/CD hardening.
          </h2>
          <p className="mt-4 max-w-2xl text-base text-slate-300">
            This first increment focuses on architecture, typed forms, vertical slice,
            test scaffolding and deployable project structure.
          </p>
        </article>
        <article className="rounded-[2rem] border border-black/10 bg-white/80 p-8">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
            Current focus
          </p>
          <ul className="mt-6 space-y-4 text-sm text-slate-700">
            <li>Clean Architecture backend with repository boundary</li>
            <li>Feature-based React structure with typed data layer</li>
            <li>Vitest, xUnit, Moq and FluentAssertions wired in</li>
            <li>Docker and CI files prepared for the next deployment stage</li>
          </ul>
        </article>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Tasks"
          value={isLoading ? '...' : String(data?.totalTasks ?? 0)}
          hint="Seeded from the API to validate the full stack connection."
        />
        <StatCard
          label="Completed"
          value={isLoading ? '...' : String(data?.completedTasks ?? 0)}
          hint="Tracks delivery capacity and supports future trend charts."
        />
        <StatCard
          label="In Progress"
          value={isLoading ? '...' : String(data?.inProgressTasks ?? 0)}
          hint="Surface work-in-progress to discuss flow efficiency."
        />
        <StatCard
          label="Completion Rate"
          value={isLoading ? '...' : `${data?.completionRate ?? 0}%`}
          hint="Small metric today, reusable reporting boundary later."
        />
      </div>
    </section>
  )
}
