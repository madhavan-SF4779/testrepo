import { CalendarDays, Send } from 'lucide-react';

export function WorkLog({ logs, logForm, setLogForm, onSubmit }) {
  const update = (field, value) => setLogForm((current) => ({ ...current, [field]: value }));

  return (
    <section className="panel">
      <div className="section-heading"><div><p className="eyebrow">Daily status</p><h2>Work log</h2></div><CalendarDays size={22} /></div>
      <form className="log-form" onSubmit={onSubmit}>
        <input type="date" value={logForm.date} onChange={(event) => update('date', event.target.value)} required />
        <input value={logForm.focus} onChange={(event) => update('focus', event.target.value)} placeholder="Primary focus" required />
        <input type="number" min="0" max="24" step="0.5" value={logForm.hours} onChange={(event) => update('hours', event.target.value)} placeholder="Hours" required />
        <select value={logForm.mood} onChange={(event) => update('mood', event.target.value)}><option>Focused</option><option>Productive</option><option>Busy</option><option>Blocked</option></select>
        <textarea value={logForm.summary} onChange={(event) => update('summary', event.target.value)} placeholder="What did you accomplish today?" rows="3" required />
        <button className="primary-btn" type="submit"><Send size={16} /> Save status</button>
      </form>
      <div className="mini-list">
        {logs.slice(0, 4).map((log) => <div key={log.id}><strong>{log.focus}</strong><span>{log.date} • {log.hours}h • {log.mood}</span></div>)}
      </div>
    </section>
  );
}
