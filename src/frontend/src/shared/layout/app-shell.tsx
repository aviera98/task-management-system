import { NavLink, Outlet } from 'react-router-dom'
import { cn } from '@/shared/lib/utils'

const navItems = [
  { to: '/', label: 'Dashboard' },
  { to: '/login', label: 'Login' },
  { to: '/register', label: 'Register' },
]

export function AppShell() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(15,118,110,0.18),_transparent_38%),linear-gradient(180deg,_#f7f5ef_0%,_#f2efe7_100%)] text-slate-900">
      <header className="border-b border-black/10 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-teal-700">
              Task Management System
            </p>
            <h1 className="font-display text-2xl font-semibold">Senior Portfolio Build</h1>
          </div>
          <nav className="flex gap-2 rounded-full border border-black/10 bg-white/70 p-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'rounded-full px-4 py-2 text-sm font-medium transition',
                    isActive ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900',
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">
        <Outlet />
      </main>
    </div>
  )
}
