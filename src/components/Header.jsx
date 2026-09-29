import { LogOut, Moon, Search, Sun } from 'lucide-react';

export function Header({ user, theme, onToggleTheme, onLogout }) {
  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">Workspace</p>
        <h1>Daily Work Tracker</h1>
      </div>
      <div className="topbar-actions">
        <div className="global-search"><Search size={16} /><span>Search tasks, logs, projects</span></div>
        <button className="icon-btn" aria-label="Toggle theme" onClick={onToggleTheme}>{theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}</button>
        <div className="avatar" title={user.email}>{user.name.split(' ').map((part) => part[0]).join('')}</div>
        <button className="icon-btn" aria-label="Logout" onClick={onLogout}><LogOut size={18} /></button>
      </div>
    </header>
  );
}
