import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { monthBuckets, priorityBreakdown, statusBreakdown, weekBuckets } from "../metrics.js";

const COLORS = ["#7c8cff", "#3d9a78", "#e0a106", "#d4534a"];

export default function Analytics({ tasks }) {
  const week = weekBuckets(tasks);
  const month = monthBuckets(tasks);
  const priorities = priorityBreakdown(tasks);
  const statuses = statusBreakdown(tasks);
  const weekDone = week.reduce((s, d) => s + d.completed, 0);
  const monthDone = month.reduce((s, d) => s + d.completed, 0);

  return (
    <section className="page">
      <header className="page-head">
        <div>
          <p className="eyebrow">Insights</p>
          <h1>Productivity analytics</h1>
        </div>
      </header>
      <div className="stat-grid compact">
        <article className="stat-card">
          <span>Completed this week</span>
          <strong>{weekDone}</strong>
        </article>
        <article className="stat-card">
          <span>Completed last 30 days</span>
          <strong>{monthDone}</strong>
        </article>
      </div>
      <div className="chart-grid">
        <article className="panel chart-panel">
          <h2>Weekly throughput</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={week}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" />
              <XAxis dataKey="label" stroke="var(--muted)" fontSize={12} />
              <YAxis allowDecimals={false} stroke="var(--muted)" fontSize={12} />
              <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--line)" }} />
              <Legend />
              <Bar dataKey="completed" fill="#3d6bff" radius={[4, 4, 0, 0]} />
              <Bar dataKey="created" fill="#9aa7c7" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </article>
        <article className="panel chart-panel">
          <h2>Monthly completions</h2>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={month}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" />
              <XAxis dataKey="label" stroke="var(--muted)" fontSize={12} interval={4} />
              <YAxis allowDecimals={false} stroke="var(--muted)" fontSize={12} />
              <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--line)" }} />
              <Line type="monotone" dataKey="completed" stroke="#3d9a78" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </article>
        <article className="panel chart-panel">
          <h2>By priority</h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={priorities} dataKey="value" nameKey="name" innerRadius={52} outerRadius={84} paddingAngle={3}>
                {priorities.map((entry, i) => (
                  <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--line)" }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </article>
        <article className="panel chart-panel">
          <h2>By status</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={statuses} layout="vertical" margin={{ left: 24 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" />
              <XAxis type="number" allowDecimals={false} stroke="var(--muted)" fontSize={12} />
              <YAxis type="category" dataKey="name" stroke="var(--muted)" fontSize={12} width={90} />
              <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--line)" }} />
              <Bar dataKey="value" fill="#5b4dff" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </article>
      </div>
    </section>
  );
}
