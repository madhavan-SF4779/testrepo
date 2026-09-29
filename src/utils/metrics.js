export const priorities = ['Low', 'Medium', 'High', 'Critical'];
export const statuses = ['Pending', 'In Progress', 'Completed'];

export function isOverdue(task, today = new Date()) {
  const due = new Date(`${task.dueDate}T23:59:59`);
  return task.status !== 'Completed' && due < today;
}

export function getMetrics(tasks) {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.status === 'Completed').length;
  const pending = tasks.filter((task) => task.status !== 'Completed').length;
  const overdue = tasks.filter((task) => isOverdue(task)).length;
  const completionRate = total ? Math.round((completed / total) * 100) : 0;
  const highImpactDone = tasks.filter((task) => ['High', 'Critical'].includes(task.priority) && task.status === 'Completed').length;
  const highImpactTotal = tasks.filter((task) => ['High', 'Critical'].includes(task.priority)).length;
  const productivity = Math.round((completionRate * 0.7) + (highImpactTotal ? (highImpactDone / highImpactTotal) * 30 : 20));

  return { total, completed, pending, overdue, completionRate, productivity };
}

export function getPriorityBreakdown(tasks) {
  return priorities.map((priority) => ({
    name: priority,
    value: tasks.filter((task) => task.priority === priority).length,
  }));
}

export function getTimeline(tasks, logs) {
  const completedTasks = tasks
    .filter((task) => task.completedAt)
    .map((task) => ({
      id: task.id,
      type: 'task',
      title: task.title,
      detail: `${task.project} • ${task.priority} priority`,
      date: task.completedAt,
    }));

  const workLogs = logs.map((log) => ({
    id: log.id,
    type: 'log',
    title: log.focus,
    detail: `${log.summary} (${log.hours}h, ${log.mood})`,
    date: `${log.date}T12:00:00`,
  }));

  return [...completedTasks, ...workLogs].sort((a, b) => new Date(b.date) - new Date(a.date));
}
