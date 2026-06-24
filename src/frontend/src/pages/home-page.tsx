import { useAuth } from '@/features/auth'
import { FolderGrid } from '@/components/folder-grid'
import { useDocumentTitle } from '@/hooks/use-document-title'

export function HomePage() {
  useDocumentTitle('Task Management System | Home')
  const { user } = useAuth()

  return (
    <section className="space-y-8">
      <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Frontend + Backend</p>
        <h2 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight">
          Protected workspace ready for the next iteration.
        </h2>
        <p className="mt-4 max-w-2xl text-slate-300">
          JWT authentication is now wired end to end. The frontend restores the session
          automatically and is ready to call protected backend endpoints.
        </p>
        {user ? (
          <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-100">
            <span>
              Signed in as {user.firstName} {user.lastName}
            </span>
            <span className="h-1 w-1 rounded-full bg-cyan-200" />
            <span>{user.role}</span>
          </div>
        ) : null}
      </div>

      <FolderGrid />
    </section>
  )
}
