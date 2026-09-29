import { format, subDays } from 'date-fns'
import type { Task, WorkLog } from '../types'

const day = (offset: number) => format(subDays(new Date(), offset), 'yyyy-MM-dd')

export const sampleTasks: Task[] = [
  { id: '1', title: 'Finalize Q2 product roadmap', description: 'Align milestones with the product and engineering leads.', priority: 'Critical', status: 'In Progress', dueDate: day(-1), category: 'Planning', estimate: '2h' },
  { id: '2', title: 'Review dashboard analytics', description: 'Validate core funnel metrics before the weekly review.', priority: 'High', status: 'Todo', dueDate: day(0), category: 'Analytics', estimate: '1h' },
  { id: '3', title: 'Update onboarding flow', description: 'Apply feedback from the latest usability interviews.', priority: 'High', status: 'Done', dueDate: day(1), category: 'Design', estimate: '3h', completedAt: new Date(Date.now() - 1000 * 60 * 52).toISOString() },
  { id: '4', title: 'Prepare sprint retrospective', description: 'Collect wins, blockers, and follow-up actions.', priority: 'Medium', status: 'Todo', dueDate: day(-2), category: 'Team', estimate: '45m' },
  { id: '5', title: 'Resolve mobile navigation issue', description: 'Verify the fix across small viewport breakpoints.', priority: 'Critical', status: 'Done', dueDate: day(2), category: 'Engineering', estimate: '2h', completedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() },
  { id: '6', title: 'Customer discovery notes', description: 'Consolidate insights and tag recurring themes.', priority: 'Medium', status: 'Done', dueDate: day(3), category: 'Research', estimate: '1.5h', completedAt: new Date(Date.now() - 1000 * 60 * 60 * 27).toISOString() },
  { id: '7', title: 'Refresh documentation', description: 'Update API examples for the latest release.', priority: 'Low', status: 'Todo', dueDate: day(-4), category: 'Documentation', estimate: '1h' },
  { id: '8', title: 'Set up monthly report', description: 'Create the reporting outline and assign owners.', priority: 'Low', status: 'Done', dueDate: day(4), category: 'Operations', estimate: '30m', completedAt: new Date(Date.now() - 1000 * 60 * 60 * 50).toISOString() },
]

export const sampleLogs: WorkLog[] = [
  { id: 'l1', date: day(0), mood: 4, hours: 6.5, note: 'Strong progress on roadmap planning and analytics review.' },
  { id: 'l2', date: day(1), mood: 5, hours: 7.2, note: 'Cleared a difficult UI issue and finished onboarding updates.' },
  { id: 'l3', date: day(2), mood: 3, hours: 5.5, note: 'Mostly meetings; moved key planning work forward.' },
  { id: 'l4', date: day(3), mood: 4, hours: 6.8, note: 'Productive research and documentation session.' },
]

export const weeklyData = [
  { day: 'Mon', completed: 4, hours: 6.2 },
  { day: 'Tue', completed: 6, hours: 7.4 },
  { day: 'Wed', completed: 3, hours: 5.5 },
  { day: 'Thu', completed: 7, hours: 7.8 },
  { day: 'Fri', completed: 5, hours: 6.5 },
  { day: 'Sat', completed: 2, hours: 3.1 },
  { day: 'Sun', completed: 4, hours: 4.8 },
]

export const monthlyData = [
  { week: 'Week 1', completed: 18, goal: 22 },
  { week: 'Week 2', completed: 24, goal: 22 },
  { week: 'Week 3', completed: 20, goal: 22 },
  { week: 'Week 4', completed: 27, goal: 22 },
]
