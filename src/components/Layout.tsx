import { useState, type ReactNode } from 'react'
import { BarChart3, CheckCircle2, ChevronDown, ClipboardCheck, LayoutDashboard, ListTodo, LogOut, Menu, Moon, Search, Settings, Sun, X } from 'lucide-react'
import type { User } from '../types'

export type View = 'dashboard' | 'tasks' | 'analytics'

interface LayoutProps {
  children: ReactNode
  view: View
  onView: (view: View) => void
  theme: 'light' | 'dark'
  onTheme: () => void
  onLogout: () => void
  user: User
  onSearch: (query: string) => void
}

export function Layout({ children, view, onView, theme, onTheme, onLogout, user, onSearch }: LayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const navItems = [
    { id: 'dashboard' as const, label: 'Overview', icon: LayoutDashboard },
    { id: 'tasks' as const, label: 'My tasks', icon: ListTodo },
    { id: 'analytics' as const, label: 'Analytics', icon: BarChart3 },
  ]
  const navigate = (next: View) => { onView(next); setMobileOpen(false) }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
        <div className="sidebar-head"><div className="brand"><span className="brand-mark"><CheckCircle2 size={20} /></span><span>Daily</span></div><button className="icon-button mobile-close" onClick={() => setMobileOpen(false)}><X size={20} /></button></div>
        <div className="workspace"><span className="workspace-avatar">N</span><div><strong>Northstar</strong><small>Personal workspace</small></div><ChevronDown size={16} /></div>
        <nav>
          <span className="nav-label">WORKSPACE</span>
          {navItems.map(({ id, label, icon: Icon }) => <button className={view === id ? 'active' : ''} onClick={() => navigate(id)} key={id}><Icon size={18} /><span>{label}</span>{id === 'tasks' && <em>8</em>}</button>)}
          <span className="nav-label second">MANAGE</span>
          <button onClick={() => navigate('tasks')}><ClipboardCheck size={18} /><span>Work log</span></button>
          <button><Settings size={18} /><span>Settings</span></button>
        </nav>
        <div className="sidebar-bottom">
          <button className="theme-toggle" onClick={onTheme}>{theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}<span>{theme === 'light' ? 'Dark mode' : 'Light mode'}</span></button>
          <div className="profile"><span className="profile-avatar">{user.name.slice(0, 2).toUpperCase()}</span><div><strong>{user.name}</strong><small>{user.email}</small></div><button aria-label="Log out" onClick={onLogout}><LogOut size={17} /></button></div>
        </div>
      </aside>
      {mobileOpen && <button aria-label="Close navigation" className="sidebar-overlay" onClick={() => setMobileOpen(false)} />}
      <div className="main-wrap">
        <header className="topbar">
          <button className="icon-button menu-button" onClick={() => setMobileOpen(true)}><Menu size={21} /></button>
          <div className="search-box"><Search size={18} /><input aria-label="Search tasks" placeholder="Search anything..." onChange={(event) => onSearch(event.target.value)} /><kbd>⌘ K</kbd></div>
          <div className="top-actions"><span className="status-dot" /><span className="top-status">All systems operational</span><button className="top-avatar">{user.name[0].toUpperCase()}</button></div>
        </header>
        <main className="content">{children}</main>
      </div>
    </div>
  )
}
