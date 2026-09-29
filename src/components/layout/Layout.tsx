import { useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { useAuthStore } from '../../store/authStore';

export function Layout() {
  const { isAuthenticated, theme } = useAuthStore();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-8 max-w-7xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
