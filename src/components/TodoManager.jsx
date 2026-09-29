import { Edit3, Plus, Search, Trash2 } from 'lucide-react';
import { priorities, statuses } from '../utils/metrics.js';

const emptyForm = { title: '', description: '', priority: 'Medium', status: 'Pending', dueDate: '', project: '' };

export function TodoManager({ tasks, query, setQuery, filter, setFilter, form, setForm, editingId, onSubmit, onEdit, onDelete, onCancel }) {
  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  return (
    <section className="panel todo-panel">
      <div className="section-heading">
        <div><p className="eyebrow">Todo management</p><h2>Prioritized work queue</h2></div>
      </div>
      <form className="task-form" onSubmit={onSubmit}>
        <input value={form.title} onChange={(event) => update('title', event.target.value)} placeholder="Task title" required />
        <input value={form.project} onChange={(event) => update('project', event.target.value)} placeholder="Project" required />
        <select value={form.priority} onChange={(event) => update('priority', event.target.value)}>{priorities.map((priority) => <option key={priority}>{priority}</option>)}</select>
        <select value={form.status} onChange={(event) => update('status', event.target.value)}>{statuses.map((status) => <option key={status}>{status}</option>)}</select>
        <input type="date" value={form.dueDate} onChange={(event) => update('dueDate', event.target.value)} required />
        <textarea value={form.description} onChange={(event) => update('description', event.target.value)} placeholder="Description" rows="2" />
        <div className="form-actions">
          <button className="primary-btn" type="submit"><Plus size={17} />{editingId ? 'Update task' : 'Create task'}</button>
          {editingId && <button type="button" className="ghost-btn" onClick={onCancel}>Cancel</button>}
        </div>
      </form>
      <div className="toolbar">
        <label><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search tasks" /></label>
        <select value={filter} onChange={(event) => setFilter(event.target.value)}><option>All</option>{statuses.map((status) => <option key={status}>{status}</option>)}{priorities.map((priority) => <option key={priority}>{priority}</option>)}</select>
      </div>
      <div className="task-list">
        {tasks.map((task) => (
          <article className="task-item" key={task.id}>
            <div>
              <div className="task-title-row"><h3>{task.title}</h3><span className={`priority ${task.priority.toLowerCase()}`}>{task.priority}</span></div>
              <p>{task.description}</p>
              <div className="task-meta"><span>{task.project}</span><span>{task.status}</span><span>Due {task.dueDate}</span></div>
            </div>
            <div className="task-actions">
              <button className="icon-btn" onClick={() => onEdit(task)} aria-label={`Edit ${task.title}`}><Edit3 size={16} /></button>
              <button className="icon-btn danger" onClick={() => onDelete(task.id)} aria-label={`Delete ${task.title}`}><Trash2 size={16} /></button>
            </div>
          </article>
        ))}
        {!tasks.length && <p className="empty-state">No tasks match your current search or filter.</p>}
      </div>
    </section>
  );
}

TodoManager.emptyForm = emptyForm;
