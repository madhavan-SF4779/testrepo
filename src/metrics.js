export const PRIORITIES = ["low", "medium", "high", "critical"];
export const STATUSES = ["todo", "in_progress", "done"];

export function todayKey(date = new Date()) {
  const d = new Date(date);
  const offset = d.getTimezoneOffset();
  return new Date(d.getTime() - offset * 60000).toISOString().slice(0, 10);
}

export function isOverdue(task, today = todayKey()) {
  return task.status !== "done" && task.due && task.due < today;
}

export function summarize(tasks, today = todayKey()) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "done").length;
  const pending = tasks.filter((t) => t.status !== "done").length;
  const overdue = tasks.filter((t) => isOverdue(t, today)).length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  return { total, completed, pending, overdue, percent };
}

export function weekBuckets(tasks, days = 7) {
  const buckets = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = todayKey(d);
    const label = d.toLocaleDateString(undefined, { weekday: "short" });
    const completed = tasks.filter((t) => t.completedAt && t.completedAt.slice(0, 10) === key).length;
    const created = tasks.filter((t) => t.createdAt.slice(0, 10) === key).length;
    buckets.push({ key, label, completed, created });
  }
  return buckets;
}

export function monthBuckets(tasks) {
  const buckets = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = todayKey(d);
    const completed = tasks.filter((t) => t.completedAt && t.completedAt.slice(0, 10) === key).length;
    buckets.push({
      key,
      label: d.getDate().toString(),
      completed,
    });
  }
  return buckets;
}

export function priorityBreakdown(tasks) {
  return PRIORITIES.map((name) => ({
    name,
    value: tasks.filter((t) => t.priority === name).length,
  }));
}

export function statusBreakdown(tasks) {
  return [
    { name: "To do", value: tasks.filter((t) => t.status === "todo").length },
    { name: "In progress", value: tasks.filter((t) => t.status === "in_progress").length },
    { name: "Done", value: tasks.filter((t) => t.status === "done").length },
  ];
}

export function productivityScore(tasks, logs) {
  const { percent, overdue, total } = summarize(tasks);
  const recent = logs.slice(0, 7);
  const avgHours = recent.length
    ? recent.reduce((s, l) => s + Number(l.hours || 0), 0) / recent.length
    : 0;
  const hoursScore = Math.min(100, Math.round((avgHours / 8) * 100));
  const overduePenalty = total === 0 ? 0 : Math.round((overdue / total) * 30);
  const score = Math.max(0, Math.min(100, Math.round(percent * 0.65 + hoursScore * 0.35 - overduePenalty)));
  return { score, hoursScore, avgHours: Math.round(avgHours * 10) / 10, overduePenalty };
}

export function formatWhen(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
