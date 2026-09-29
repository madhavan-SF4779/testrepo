import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, Clock, LogOut, Sun, Moon, Activity } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { cn } from '../../lib/utils';

export function Sidebar() {
  const { logout, theme, toggleTheme, user } = useAuthStore();

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: CheckSquare, label: 'Tasks', path: '/tasks' },
    { icon: Clock, label: 'Daily Log', path: '/log' },
    { icon: Activity, label: 'Analytics', path: '/analytics' },
  ];

  return (
    <aside className="w-64 border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 flex flex-col min-h-screen">
      <div className="p-6">
        <h1 className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
          <CheckSquare className="text-blue-600 h-6 w-6" />
          Work Tracker
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                isActive 
                  ? "bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400 font-medium" 
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200"
              )
            }
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3 mb-4 px-3">
          <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-700 dark:text-blue-400 font-bold">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
              {user?.name}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {user?.email}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2">
          <button
            onClick={toggleTheme}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 rounded-md transition-colors"
          >
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            {theme === 'light' ? 'Dark' : 'Light'}
          </button>
          
          <button
            onClick={logout}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/50 rounded-md transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}
