import { CheckCircle2, LockKeyhole, Sparkles } from 'lucide-react';

export function Login({ onLogin, theme, onToggleTheme }) {
  return (
    <main className="login-shell">
      <section className="login-card glass-card">
        <div className="brand-mark"><Sparkles size={28} /></div>
        <p className="eyebrow">Daily Work Tracker</p>
        <h1>Plan, track, and improve every workday.</h1>
        <p className="muted">A modern productivity workspace with task management, work logs, analytics, and persistent local data.</p>
        <button className="primary-btn" onClick={onLogin}>
          <LockKeyhole size={18} /> Continue as Alex Morgan
        </button>
        <button className="ghost-btn" onClick={onToggleTheme}>{theme === 'dark' ? 'Use light theme' : 'Use dark theme'}</button>
      </section>
      <section className="login-preview glass-card">
        <h2>Today’s command center</h2>
        {['Smart dashboard metrics', 'Priority-based todo workflow', 'Weekly and monthly analytics', 'Activity timeline and progress tracking'].map((item) => (
          <div className="feature-row" key={item}><CheckCircle2 size={20} />{item}</div>
        ))}
      </section>
    </main>
  );
}
