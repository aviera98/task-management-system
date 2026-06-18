import { FolderGrid } from '@/components/folder-grid'
import { useDocumentTitle } from '@/hooks/use-document-title'

export function HomePage() {
  useDocumentTitle('Task Management System | Home')

  return (
    <section className="space-y-8">
      <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Frontend + Backend</p>
        <h2 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight">
          Professional project base ready for the next iteration.
        </h2>
        <p className="mt-4 max-w-2xl text-slate-300">
          This stage focuses on structure, tooling and application startup only.
          Business logic is intentionally deferred.
        </p>
      </div>

      <FolderGrid />
    </section>
  )
}
