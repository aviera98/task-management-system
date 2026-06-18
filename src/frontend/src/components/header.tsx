import { NavLink } from 'react-router-dom'
import type { NavItem } from '@/types/nav-item'
import { cn } from '@/utils/cn'

const navigationItems: NavItem[] = [
  { to: '/', label: 'Home' },
  { to: '/setup', label: 'Setup' },
]

export function Header() {
  return (
    <header className="border-b border-white/10 bg-slate-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">
            Task Management System
          </p>
          <h1 className="mt-2 text-2xl font-semibold">Initial Project Structure</h1>
        </div>
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
      </div>
    </header>
  )
}
