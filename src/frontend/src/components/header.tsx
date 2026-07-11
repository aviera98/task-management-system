import { NavLink } from 'react-router-dom'
import { useAuth } from '@/features/auth'
import type { NavItem } from '@/types/nav-item'
import { cn } from '@/utils/cn'

const navigationItems: NavItem[] = [
  { to: '/tasks', label: 'Tasks' },
  { to: '/setup', label: 'Setup' },
]

export function Header() {
  const { isAuthenticated, logout, user } = useAuth()

  return (
    <header className="border-b border-white/10 bg-slate-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">
            Task Management System
          </p>
          <h1 className="mt-2 text-2xl font-semibold">Task Workspace</h1>
        </div>
        <div className="flex items-center gap-4">
          <nav className="flex gap-2 rounded-full border border-white/10 bg-white/5 p-1">
            {navigationItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'rounded-full px-4 py-2 text-sm transition',
                    isActive
                      ? 'bg-cyan-400 text-slate-950'
                      : 'text-slate-300 hover:text-white',
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 md:block">
                {user?.firstName} {user?.lastName}
              </div>
              <button
                type="button"
                onClick={logout}
                className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:border-cyan-300 hover:text-white"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  cn(
                    'rounded-full px-4 py-2 text-sm transition',
                    isActive
                      ? 'bg-white text-slate-950'
                      : 'text-slate-300 hover:text-white',
                  )
                }
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  cn(
                    'rounded-full bg-cyan-400 px-4 py-2 text-sm font-medium text-slate-950 transition',
                    isActive ? 'bg-cyan-300' : 'hover:bg-cyan-300',
                  )
                }
              >
                Register
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
