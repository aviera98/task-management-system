type StatCardProps = {
  label: string
  value: string
  hint: string
}

export function StatCard({ label, value, hint }: StatCardProps) {
  return (
    <article className="rounded-3xl border border-black/10 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
      <p className="text-sm uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="mt-4 font-display text-5xl font-semibold text-slate-950">{value}</p>
      <p className="mt-2 text-sm text-slate-600">{hint}</p>
    </article>
  )
}
