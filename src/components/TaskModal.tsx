import { useEffect, useState, type FormEvent } from 'react'
import { X } from 'lucide-react'
import { format } from 'date-fns'
import type { Priority, Task, TaskStatus } from '../types'

interface TaskModalProps { task?: Task | null; onClose: () => void; onSave: (task: Task) => void }

export function TaskModal({ task, onClose, onSave }: TaskModalProps) {
  const [form, setForm] = useState<Task>(() => task ?? { id: crypto.randomUUID(), title: '', description: '', priority: 'Medium', status: 'Todo', dueDate: format(new Date(), 'yyyy-MM-dd'), category: 'General', estimate: '1h' })
  useEffect(() => { if (task) setForm(task) }, [task])
  const update = (field: keyof Task, value: string) => setForm((current) => ({ ...current, [field]: value }))
  function submit(event: FormEvent) { event.preventDefault(); onSave({ ...form, completedAt: form.status === 'Done' ? (form.completedAt ?? new Date().toISOString()) : undefined }) }

  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="task-modal-title"><div className="modal-header"><div><span className="eyebrow">TASK DETAILS</span><h2 id="task-modal-title">{task ? 'Edit task' : 'Create a new task'}</h2></div><button className="icon-button" onClick={onClose}><X size={20} /></button></div><form onSubmit={submit}><label>Task name<input autoFocus value={form.title} onChange={(event) => update('title', event.target.value)} placeholder="What needs to be done?" required /></label><label>Description<textarea value={form.description} onChange={(event) => update('description', event.target.value)} placeholder="Add helpful context..." rows={3} /></label><div className="form-grid"><label>Priority<select value={form.priority} onChange={(event) => update('priority', event.target.value as Priority)}>{['Low','Medium','High','Critical'].map((item) => <option key={item}>{item}</option>)}</select></label><label>Status<select value={form.status} onChange={(event) => update('status', event.target.value as TaskStatus)}>{['Todo','In Progress','Done'].map((item) => <option key={item}>{item}</option>)}</select></label><label>Due date<input type="date" value={form.dueDate} onChange={(event) => update('dueDate', event.target.value)} required /></label><label>Category<input value={form.category} onChange={(event) => update('category', event.target.value)} required /></label></div><div className="modal-actions"><button type="button" className="secondary-button" onClick={onClose}>Cancel</button><button type="submit" className="primary-button">{task ? 'Save changes' : 'Create task'}</button></div></form></section></div>
}
