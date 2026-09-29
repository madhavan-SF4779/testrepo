import { productivityScore, summarize } from "../metrics.js";
import { ProgressBar } from "../components/ui.jsx";

export default function Dashboard({ tasks, logs, onOpenTasks }) {
  const stats = summarize(tasks);
  const prod = productivityScore(tasks, logs);
  const cards = [
    { label: "Total tasks", value: stats.total, hint: "All tracked work" },
    { label: "Completed", value: stats.completed, hint: "Marked done" },
    { label: "Pending", value: stats.pending, hint: "Still open" },
    { label: "Overdue", value: stats.overdue, hint: "Past due and open" },
  ];

  return (
    <section className="page">
      <header className="page-head">
        <div>
          <p className="eyebrow">Today</p>
          <h1>Workspace overview</h1>
        </div>
        <button className="btn primary" onClick={onOpenTasks}>
          Manage tasks
        </button>
      </header>

      <div className="stat-grid">
        {cards.map((c) => (
          <article key={c.label} className="stat-card">
            <span>{c.label}</span>
            <strong>{c.value}</strong>
            <small>{c.hint}</small>
          </article>
        ))}
      </div>

      <div className="panel-grid">
        <article className="panel">
          <header className="panel-head">
            <h2>Completion</h2>
            <span className="muted">{stats.completed} of {stats.total} done</span>
          </header>
          <ProgressBar value={stats.percent} />
          <p className="muted">
            The bar follows the share of tasks marked done. Completing or reopening a task updates it immediately.
          </p>
        </article>
        <article className="panel">
          <header className="panel-head">
            <h2>Productivity</h2>
            <span className="score">{prod.score}</span>
          </header>
          <ul className="metric-list">
            <li>
              <span>Completion weight</span>
              <strong>{stats.percent}%</strong>
            </li>
            <li>
              <span>Hours consistency</span>
              <strong>{prod.hoursScore}% · {prod.avgHours}h avg</strong>
            </li>
            <li>
              <span>Overdue penalty</span>
              <strong>−{prod.overduePenalty}</strong>
            </li>
          </ul>
        </article>
      </div>

      <article className="panel">
        <header className="panel-head">
          <h2>Focus queue</h2>
        </header>
        <ul className="queue">
          {tasks
            .filter((t) => t.status !== "done")
            .slice()
            .sort((a, b) => a.due.localeCompare(b.due))
            .slice(0, 5)
            .map((t) => (
              <li key={t.id}>
                <span className={`dot dot-${t.priority}`} />
                <div>
                  <strong>{t.title}</strong>
                  <small>Due {t.due}</small>
                </div>
                <em>{t.priority}</em>
              </li>
            ))}
        </ul>
      </article>
    </section>
  );
}
