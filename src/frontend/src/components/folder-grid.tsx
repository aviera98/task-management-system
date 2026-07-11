import { backendFolders, frontendFolders } from '@/services/folder-structure'

function FolderColumn({
  title,
  folders,
}: {
  title: string
  folders: string[]
}) {
  return (
    <article className="rounded-[2rem] border border-white/10 bg-white/5 p-8">
      <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">
        {title}
      </p>
      <ul className="mt-6 space-y-3 text-slate-200">
        {folders.map((folder) => (
          <li
            key={folder}
            className="rounded-2xl border border-white/10 px-4 py-3"
          >
            {folder}
          </li>
        ))}
      </ul>
    </article>
  )
}

export function FolderGrid() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <FolderColumn title="Frontend" folders={frontendFolders} />
      <FolderColumn title="Backend" folders={backendFolders} />
    </div>
  )
}
