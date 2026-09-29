export const sampleUser = {
  name: 'Alex Morgan',
  role: 'Product Operations Lead',
  email: 'alex@dailywork.local',
};

export const sampleTasks = [
  { id: 'task-1', title: 'Finalize Q2 roadmap brief', description: 'Prepare milestones, dependencies, and delivery risks for leadership review.', priority: 'Critical', status: 'Completed', dueDate: '2026-09-25', project: 'Strategy', createdAt: '2026-09-20', completedAt: '2026-09-25T10:15:00' },
  { id: 'task-2', title: 'Review design QA feedback', description: 'Triage mobile spacing and accessibility notes before handoff.', priority: 'High', status: 'In Progress', dueDate: '2026-09-29', project: 'Design Systems', createdAt: '2026-09-22', completedAt: null },
  { id: 'task-3', title: 'Update onboarding checklist', description: 'Add analytics setup and customer escalation routing steps.', priority: 'Medium', status: 'Pending', dueDate: '2026-10-02', project: 'People Ops', createdAt: '2026-09-23', completedAt: null },
  { id: 'task-4', title: 'Close billing incident follow-up', description: 'Publish incident notes and assign prevention tasks.', priority: 'Critical', status: 'Pending', dueDate: '2026-09-24', project: 'Revenue', createdAt: '2026-09-18', completedAt: null },
  { id: 'task-5', title: 'Schedule customer interview panel', description: 'Confirm participants and prepare interview guide.', priority: 'Low', status: 'Completed', dueDate: '2026-09-27', project: 'Research', createdAt: '2026-09-21', completedAt: '2026-09-27T15:45:00' },
  { id: 'task-6', title: 'Build launch readiness dashboard', description: 'Combine release health, QA burndown, and marketing readiness.', priority: 'High', status: 'In Progress', dueDate: '2026-10-04', project: 'Launch', createdAt: '2026-09-24', completedAt: null },
];

export const sampleLogs = [
  { id: 'log-1', date: '2026-09-23', summary: 'Completed roadmap edits and resolved three blocker comments.', focus: 'Planning', hours: 7.5, mood: 'Focused' },
  { id: 'log-2', date: '2026-09-24', summary: 'Handled billing incident analysis and synced with revenue operations.', focus: 'Incident Review', hours: 6, mood: 'Busy' },
  { id: 'log-3', date: '2026-09-25', summary: 'Presented roadmap brief and documented follow-up ownership.', focus: 'Stakeholder Alignment', hours: 8, mood: 'Productive' },
  { id: 'log-4', date: '2026-09-28', summary: 'Reviewed launch dashboard requirements and design QA notes.', focus: 'Execution', hours: 7, mood: 'Focused' },
];

export const weeklyData = [
  { day: 'Mon', completed: 3, planned: 4, focus: 72 },
  { day: 'Tue', completed: 5, planned: 5, focus: 86 },
  { day: 'Wed', completed: 4, planned: 6, focus: 78 },
  { day: 'Thu', completed: 6, planned: 7, focus: 91 },
  { day: 'Fri', completed: 5, planned: 6, focus: 84 },
  { day: 'Sat', completed: 2, planned: 3, focus: 63 },
  { day: 'Sun', completed: 1, planned: 2, focus: 55 },
];

export const monthlyData = [
  { week: 'W1', completed: 17, overdue: 2 },
  { week: 'W2', completed: 21, overdue: 1 },
  { week: 'W3', completed: 19, overdue: 3 },
  { week: 'W4', completed: 24, overdue: 1 },
];
