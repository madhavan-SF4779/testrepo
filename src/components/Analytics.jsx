import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { monthlyData, weeklyData } from '../data/sampleData.js';
import { getPriorityBreakdown } from '../utils/metrics.js';

const colors = ['#22c55e', '#3b82f6', '#f97316', '#ef4444'];

export function Analytics({ tasks }) {
  return (
    <section className="analytics-grid">
      <article className="panel chart-panel">
        <div className="section-heading"><div><p className="eyebrow">Weekly analytics</p><h2>Completed vs planned</h2></div></div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={weeklyData}><CartesianGrid strokeDasharray="3 3" opacity={0.2} /><XAxis dataKey="day" /><YAxis /><Tooltip /><Bar dataKey="planned" fill="#94a3b8" radius={[8, 8, 0, 0]} /><Bar dataKey="completed" fill="#4f46e5" radius={[8, 8, 0, 0]} /></BarChart>
        </ResponsiveContainer>
      </article>
      <article className="panel chart-panel">
        <div className="section-heading"><div><p className="eyebrow">Monthly productivity</p><h2>Delivery trend</h2></div></div>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={monthlyData}><CartesianGrid strokeDasharray="3 3" opacity={0.2} /><XAxis dataKey="week" /><YAxis /><Tooltip /><Line type="monotone" dataKey="completed" stroke="#14b8a6" strokeWidth={3} /><Line type="monotone" dataKey="overdue" stroke="#ef4444" strokeWidth={3} /></LineChart>
        </ResponsiveContainer>
      </article>
      <article className="panel chart-panel compact-chart">
        <div className="section-heading"><div><p className="eyebrow">Priority mix</p><h2>Workload distribution</h2></div></div>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart><Pie data={getPriorityBreakdown(tasks)} dataKey="value" nameKey="name" innerRadius={52} outerRadius={88} paddingAngle={4}>{getPriorityBreakdown(tasks).map((entry, index) => <Cell key={entry.name} fill={colors[index]} />)}</Pie><Tooltip /></PieChart>
        </ResponsiveContainer>
      </article>
    </section>
  );
}
