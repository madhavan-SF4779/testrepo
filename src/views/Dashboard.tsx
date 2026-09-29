import { format, isBefore, parseISO, startOfDay } from 'date-fns'
import { Activity, ArrowUpRight, Check, CheckCircle2, Circle, Clock3, ListTodo, Plus, Target, TimerReset, TrendingUp } from 'lucide-react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { weeklyData } from '../data/sampleData'
import type { Task, WorkLog } from '../types'
import { StatCard } from '../components/StatCard'

interface Props { tasks: Task[]; logs: WorkLog[]; onAdd: () => void; onLog: () => void; onToggle: (task: Task) => void; onTasks: () => void }

export function Dashboard({ tasks, logs, onAdd, onLog, onToggle, onTasks }: Props) {
  const completed = tasks.filter((task) => task.status === 'Done').length
  const overdue = tasks.filter((task) => task.status !== 'Done' && isBefore(parseISO(task.dueDate), startOfDay(new Date()))).length
  const progress = tasks.length ? Math.round((completed / tasks.length) * 100) : 0
  const todaysTasks = tasks.filter((task) => task.status !== 'Done').slice(0, 4)
  const recent = tasks.filter((task) => task.completedAt).sort((a, b) => (b.completedAt ?? '').localeCompare(a.completedAt ?? '')).slice(0, 4)
  const hours = logs[0]?.hours ?? 0

  return <div className="page dashboard-page">
    <div className="page-heading"><div><span className="eyebrow">{format(new Date(), 'EEEE, MMMM d')}</span><h1>Good morning, Alex.</h1><p>Here’s what’s happening with your work today.</p></div><div className="heading-actions"><button className="secondary-button" onClick={onLog}><Activity size={18} /> Log work</button><button className="primary-button" onClick={onAdd}><Plus size={18} /> New task</button></div></div>
    <section className="stats-grid"><StatCard label="Total tasks" value={tasks.length} note="Across all projects" icon={ListTodo} tone="violet" /><StatCard label="Completed" value={completed} note={`${progress}% completion rate`} icon={CheckCircle2} tone="green" /><StatCard label="In progress" value={tasks.filter((task) => task.status === 'In Progress').length} note="Keep the momentum" icon={Clock3} tone="blue" /><StatCard label="Overdue" value={overdue} note={overdue ? 'Needs your attention' : 'All caught up'} icon={TimerReset} tone="orange" /></section>
    <section className="dashboard-grid top-grid">
      <article className="panel focus-panel"><div className="panel-heading"><div><span className="eyebrow">TODAY’S FOCUS</span><h2>You’re making progress</h2></div><span className="focus-score">{progress}%</span></div><p>You’ve completed {completed} of {tasks.length} tasks. Keep going — you’re closer than you think.</p><div className="large-progress"><i style={{ width: `${progress}%` }} /></div><div className="progress-legend"><span><i className="done-dot" /> {completed} completed</span><span><i className="pending-dot" /> {tasks.length - completed} remaining</span></div><div className="focus-metrics"><div><Target size={18} /><span><strong>{tasks.length - completed}</strong> tasks left</span></div><div><Clock3 size={18} /><span><strong>{hours}h</strong> focused</span></div><div><TrendingUp size={18} /><span><strong>+14%</strong> vs last week</span></div></div></article>
      <article className="panel chart-panel"><div className="panel-heading"><div><span className="eyebrow">PRODUCTIVITY</span><h2>Weekly activity</h2></div><button className="ghost-button">This week</button></div><div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><AreaChart data={weeklyData} margin={{ left: -20, right: 4, top: 12 }}><defs><linearGradient id="activityFill" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6c5ce7" stopOpacity={0.28}/><stop offset="95%" stopColor="#6c5ce7" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--line)" /><XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted)', fontSize: 12 }} /><YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--muted)', fontSize: 12 }} /><Tooltip contentStyle={{ borderRadius: 12, border: '1px solid var(--line)', background: 'var(--surface)' }} /><Area type="monotone" dataKey="completed" stroke="#6c5ce7" strokeWidth={2.5} fill="url(#activityFill)" /></AreaChart></ResponsiveContainer></div></article>
    </section>
    <section className="dashboard-grid lower-grid">
      <article className="panel task-panel"><div className="panel-heading"><div><span className="eyebrow">NEXT UP</span><h2>Today’s tasks</h2></div><button className="text-button" onClick={onTasks}>View all <ArrowUpRight size={15} /></button></div><div className="compact-task-list">{todaysTasks.map((task) => <div className="compact-task" key={task.id}><button className="check-button" aria-label={`Complete ${task.title}`} onClick={() => onToggle(task)}><Circle size={20} /></button><div className="compact-task-copy"><strong>{task.title}</strong><span>{task.category} · Due {format(parseISO(task.dueDate), 'MMM d')}</span></div><span className={`priority ${task.priority.toLowerCase()}`}>{task.priority}</span></div>)}</div></article>
      <article className="panel timeline-panel"><div className="panel-heading"><div><span className="eyebrow">RECENT ACTIVITY</span><h2>Work timeline</h2></div></div><div className="timeline">{recent.map((task, index) => <div className="timeline-item" key={task.id}><span className="timeline-icon"><Check size={14} /></span><div><strong>Completed “{task.title}”</strong><p>{task.category} · {index === 0 ? '52 minutes ago' : `${index * 7 + 2} hours ago`}</p></div></div>)}</div></article>
    </section>
  </div>
}
