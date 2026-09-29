import { AlertTriangle, CheckCircle2, Clock3, Target, TrendingUp } from 'lucide-react';

const cards = [
  ['total', 'Total tasks', Target],
  ['completed', 'Completed', CheckCircle2],
  ['pending', 'Pending', Clock3],
  ['overdue', 'Overdue', AlertTriangle],
  ['productivity', 'Productivity', TrendingUp],
];

export function Dashboard({ metrics }) {
  return (
    <section className="dashboard-grid">
      {cards.map(([key, label, Icon]) => (
        <article className="metric-card" key={key}>
          <div className={`metric-icon ${key}`}><Icon size={20} /></div>
          <span>{label}</span>
          <strong>{key === 'productivity' ? `${metrics[key]}%` : metrics[key]}</strong>
        </article>
      ))}
      <article className="progress-card">
        <div className="progress-card-header">
          <div><span>Completion progress</span><strong>{metrics.completionRate}%</strong></div>
          <p>{metrics.completed} of {metrics.total} tasks completed</p>
        </div>
        <div className="progress-track"><div className="progress-fill" style={{ width: `${metrics.completionRate}%` }} /></div>
      </article>
    </section>
  );
}
