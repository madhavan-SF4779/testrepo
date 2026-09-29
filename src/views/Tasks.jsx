import { useMemo, useState } from "react";
import { isOverdue, todayKey } from "../metrics.js";
import TaskForm from "../components/TaskForm.jsx";
import { Empty, Icon, Modal, PriorityPill, StatusPill } from "../components/ui.jsx";

export default function Tasks({ tasks, dispatch }) {
  const [query, setQuery] = useState("");
  const [priority, setPriority] = useState("all");
  const [status, setStatus] = useState("all");
  const [scope, setScope] = useState("all");
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);
  const today = todayKey();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tasks.filter((t) => {
      if (priority !== "all" && t.priority !== priority) return false;
      if (status !== "all" && t.status !== status) return false;
      if (scope === "overdue" && !isOverdue(t, today)) return false;
      if (scope === "today" && t.due !== today) return false;
      if (!q) return true;
      const hay = `${t.title} ${t.description} ${(t.tags || []).join(" ")}`.toLowerCase();
      return hay.includes(q);
    });
  }, [tasks, query, priority, status, scope, today]);

  return (
    <section className="page">
      <header className="page-head">
        <div>
          <p className="eyebrow">Backlog</p>
          <h1>Tasks</h1>
        </div>
        <button className="btn primary" onClick={() => setCreating(true)}>
          <Icon name="plus" size={16} /> New task
        </button>
      </header>

      <div className="toolbar">
        <label className="search">
          <Icon name="search" size={16} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search title, description, tags"
            aria-label="Search tasks"
          />
        </label>
        <select value={priority} onChange={(e) => setPriority(e.target.value)} aria-label="Filter by priority">
          <option value="all">All priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filter by status">
          <option value="all">All statuses</option>
          <option value="todo">To do</option>
          <option value="in_progress">In progress</option>
          <option value="done">Done</option>
        </select>
        <select value={scope} onChange={(e) => setScope(e.target.value)} aria-label="Filter by due date">
          <option value="all">Any date</option>
          <option value="today">Due today</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <Empty title="No tasks match" hint="Adjust filters or create a new task." />
      ) : (
        <div className="task-table" role="table">
          <div className="task-row head" role="row">
            <span />
            <span>Task</span>
            <span>Priority</span>
            <span>Status</span>
            <span>Due</span>
            <span />
          </div>
          {filtered.map((task) => (
            <div className="task-row" role="row" key={task.id}>
              <button
                className={`check ${task.status === "done" ? "on" : ""}`}
                aria-label={task.status === "done" ? "Reopen task" : "Complete task"}
                onClick={() => dispatch({ type: "toggleDone", id: task.id })}
              />
              <div className="task-main">
                <strong className={task.status === "done" ? "struck" : ""}>{task.title}</strong>
                <small>{task.description}</small>
                {task.tags?.length > 0 && (
                  <div className="tags">
                    {task.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                )}
              </div>
              <PriorityPill priority={task.priority} />
              <StatusPill status={task.status} />
              <span className={isOverdue(task, today) ? "due overdue" : "due"}>{task.due}</span>
              <div className="row-actions">
                <button className="icon-btn" aria-label="Edit task" onClick={() => setEditing(task)}>
                  <Icon name="edit" size={16} />
                </button>
                <button
                  className="icon-btn danger"
                  aria-label="Delete task"
                  onClick={() => dispatch({ type: "deleteTask", id: task.id })}
                >
                  <Icon name="trash" size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {creating && (
        <Modal title="New task" onClose={() => setCreating(false)}>
          <TaskForm
            onCancel={() => setCreating(false)}
            onSubmit={(task) => {
              dispatch({ type: "addTask", task });
              setCreating(false);
            }}
          />
        </Modal>
      )}
      {editing && (
        <Modal title="Edit task" onClose={() => setEditing(null)}>
          <TaskForm
            initial={editing}
            submitLabel="Save changes"
            onCancel={() => setEditing(null)}
            onSubmit={(patch) => {
              dispatch({ type: "updateTask", id: editing.id, patch });
              setEditing(null);
            }}
          />
        </Modal>
      )}
    </section>
  );
}
