import { useState } from "react";
import { PRIORITIES, STATUSES, todayKey } from "../metrics.js";

const empty = {
  title: "",
  description: "",
  priority: "medium",
  status: "todo",
  due: todayKey(),
  tags: "",
};

export default function TaskForm({ initial, onSubmit, onCancel, submitLabel = "Create task" }) {
  const [form, setForm] = useState(
    initial
      ? {
          title: initial.title,
          description: initial.description,
          priority: initial.priority,
          status: initial.status,
          due: initial.due,
          tags: (initial.tags || []).join(", "),
        }
      : empty
  );
  const [error, setError] = useState("");

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("Title is required.");
      return;
    }
    onSubmit({
      title: form.title,
      description: form.description,
      priority: form.priority,
      status: form.status,
      due: form.due,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    });
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <label>
        Title
        <input value={form.title} onChange={(e) => set("title", e.target.value)} maxLength={120} required />
      </label>
      <label>
        Description
        <textarea
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          rows={3}
          maxLength={500}
        />
      </label>
      <div className="form-row">
        <label>
          Priority
          <select value={form.priority} onChange={(e) => set("priority", e.target.value)}>
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </label>
        <label>
          Status
          <select value={form.status} onChange={(e) => set("status", e.target.value)}>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.replace("_", " ")}
              </option>
            ))}
          </select>
        </label>
        <label>
          Due
          <input type="date" value={form.due} onChange={(e) => set("due", e.target.value)} />
        </label>
      </div>
      <label>
        Tags
        <input
          value={form.tags}
          onChange={(e) => set("tags", e.target.value)}
          placeholder="comma separated"
        />
      </label>
      {error && <p className="form-error">{error}</p>}
      <div className="form-actions">
        <button type="button" className="btn ghost" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn primary">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
