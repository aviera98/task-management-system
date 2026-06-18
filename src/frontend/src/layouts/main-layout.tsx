import { Outlet } from 'react-router-dom'
import { Header } from '@/components/header'

export function MainLayout() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <Header />
      <main className="mx-auto max-w-6xl px-6 py-12">
        <Outlet />
      </main>
    </div>
  )
}
