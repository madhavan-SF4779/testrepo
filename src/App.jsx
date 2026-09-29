import { useMemo, useState } from 'react';
import { Analytics } from './components/Analytics.jsx';
import { Dashboard } from './components/Dashboard.jsx';
import { Header } from './components/Header.jsx';
import { Login } from './components/Login.jsx';
import { Timeline } from './components/Timeline.jsx';
import { TodoManager } from './components/TodoManager.jsx';
import { WorkLog } from './components/WorkLog.jsx';
import { sampleLogs, sampleTasks, sampleUser } from './data/sampleData.js';
import { useLocalStorage } from './hooks/useLocalStorage.js';
import { getMetrics, getTimeline } from './utils/metrics.js';

const today = new Date().toISOString().slice(0, 10);
const emptyTask = { title: '', description: '', priority: 'Medium', status: 'Pending', dueDate: today, project: '' };
const emptyLog = { date: today, focus: '', hours: '8', mood: 'Focused', summary: '' };

function App() {
  const [isLoggedIn, setIsLoggedIn] = useLocalStorage('dwt-authenticated', false);
  const [theme, setTheme] = useLocalStorage('dwt-theme', 'light');
  const [tasks, setTasks] = useLocalStorage('dwt-tasks', sampleTasks);
  const [logs, setLogs] = useLocalStorage('dwt-logs', sampleLogs);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [form, setForm] = useState(emptyTask);
  const [logForm, setLogForm] = useState(emptyLog);
  const [editingId, setEditingId] = useState(null);

  const metrics = useMemo(() => getMetrics(tasks), [tasks]);
  const filteredTasks = useMemo(() => tasks.filter((task) => {
    const textMatch = [task.title, task.description, task.project].join(' ').toLowerCase().includes(query.toLowerCase());
    const filterMatch = filter === 'All' || task.status === filter || task.priority === filter;
    return textMatch && filterMatch;
  }), [tasks, query, filter]);
  const timeline = useMemo(() => getTimeline(tasks, logs), [tasks, logs]);

  const toggleTheme = () => setTheme((current) => current === 'dark' ? 'light' : 'dark');

  const saveTask = (event) => {
    event.preventDefault();
    const completedAt = form.status === 'Completed' ? new Date().toISOString() : null;
    if (editingId) {
      setTasks((current) => current.map((task) => task.id === editingId ? { ...task, ...form, completedAt: form.status === 'Completed' ? task.completedAt || completedAt : null } : task));
    } else {
      setTasks((current) => [{ ...form, id: crypto.randomUUID(), createdAt: today, completedAt }, ...current]);
    }
    setForm(emptyTask);
    setEditingId(null);
  };

  const editTask = (task) => {
    setEditingId(task.id);
    setForm({ title: task.title, description: task.description, priority: task.priority, status: task.status, dueDate: task.dueDate, project: task.project });
  };

  const deleteTask = (id) => setTasks((current) => current.filter((task) => task.id !== id));

  const saveLog = (event) => {
    event.preventDefault();
    setLogs((current) => [{ ...logForm, id: crypto.randomUUID(), hours: Number(logForm.hours) }, ...current]);
    setLogForm(emptyLog);
  };

  if (!isLoggedIn) {
    return <div className={`app ${theme}`}><Login theme={theme} onToggleTheme={toggleTheme} onLogin={() => setIsLoggedIn(true)} /></div>;
  }

  return (
    <div className={`app ${theme}`}>
      <div className="workspace">
        <Header user={sampleUser} theme={theme} onToggleTheme={toggleTheme} onLogout={() => setIsLoggedIn(false)} />
        <Dashboard metrics={metrics} />
        <div className="main-grid">
          <TodoManager
            tasks={filteredTasks}
            query={query}
            setQuery={setQuery}
            filter={filter}
            setFilter={setFilter}
            form={form}
            setForm={setForm}
            editingId={editingId}
            onSubmit={saveTask}
            onEdit={editTask}
            onDelete={deleteTask}
            onCancel={() => { setEditingId(null); setForm(emptyTask); }}
          />
          <div className="side-stack">
            <WorkLog logs={logs} logForm={logForm} setLogForm={setLogForm} onSubmit={saveLog} />
            <Timeline items={timeline} />
          </div>
        </div>
        <Analytics tasks={tasks} />
      </div>
    </div>
  );
}

export default App;
