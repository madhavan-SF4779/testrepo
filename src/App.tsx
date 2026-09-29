import { useEffect, useState } from 'react'
import { Login } from './components/Login'
import { Layout, type View } from './components/Layout'
import { TaskModal } from './components/TaskModal'
import { WorkLogModal } from './components/WorkLogModal'
import { sampleLogs, sampleTasks } from './data/sampleData'
import { useLocalStorage } from './hooks/useLocalStorage'
import type { Task, User, WorkLog } from './types'
import { Analytics } from './views/Analytics'
import { Dashboard } from './views/Dashboard'
import { Tasks } from './views/Tasks'

export default function App() {
  const [user, setUser] = useLocalStorage<User | null>('daily-user', null)
  const [tasks, setTasks] = useLocalStorage<Task[]>('daily-tasks', sampleTasks)
  const [logs, setLogs] = useLocalStorage<WorkLog[]>('daily-logs', sampleLogs)
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('daily-theme', 'light')
  const [view, setView] = useState<View>('dashboard')
  const [taskModal, setTaskModal] = useState<{ open: boolean; task?: Task | null }>({ open: false })
  const [logModal, setLogModal] = useState(false)
  const [search, setSearch] = useState('')

  useEffect(() => { document.documentElement.dataset.theme = theme }, [theme])
  if (!user) return <Login onLogin={setUser} />

  function saveTask(task: Task) { setTasks((current) => current.some((item) => item.id === task.id) ? current.map((item) => item.id === task.id ? task : item) : [task, ...current]); setTaskModal({ open: false }) }
  function toggleTask(task: Task) { const done = task.status !== 'Done'; saveTask({ ...task, status: done ? 'Done' : 'Todo', completedAt: done ? new Date().toISOString() : undefined }) }

  return <Layout view={view} onView={setView} theme={theme} onTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')} onLogout={() => setUser(null)} user={user} onSearch={(query) => { setSearch(query); if (query) setView('tasks') }}>
    {view === 'dashboard' && <Dashboard tasks={tasks} logs={logs} onAdd={() => setTaskModal({ open: true })} onLog={() => setLogModal(true)} onToggle={toggleTask} onTasks={() => setView('tasks')} />}
    {view === 'tasks' && <Tasks tasks={tasks} externalSearch={search} onAdd={() => setTaskModal({ open: true })} onEdit={(task) => setTaskModal({ open: true, task })} onDelete={(id) => setTasks((current) => current.filter((task) => task.id !== id))} onToggle={toggleTask} />}
    {view === 'analytics' && <Analytics tasks={tasks} logs={logs} />}
    {taskModal.open && <TaskModal task={taskModal.task} onClose={() => setTaskModal({ open: false })} onSave={saveTask} />}
    {logModal && <WorkLogModal onClose={() => setLogModal(false)} onSave={(log) => { setLogs((current) => [log, ...current]); setLogModal(false) }} />}
  </Layout>
}
