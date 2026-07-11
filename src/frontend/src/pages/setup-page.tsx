import { useDocumentTitle } from '@/hooks/use-document-title'
import { projectStatus } from '@/services/project-status'

export function SetupPage() {
  useDocumentTitle('Task Management System | Setup')

  return (
    <section className="grid gap-4 md:grid-cols-2">
      {projectStatus.map((item) => (
        <article
          key={item.title}
          className="rounded-3xl border border-white/10 bg-white/5 p-6"
        >
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">
            {item.title}
          </p>
          <p className="mt-4 text-slate-200">{item.description}</p>
        </article>
      ))}
    </section>
  )
}
