import { useMemo, useEffect } from 'react';
import { useAppStore } from '../store/appStore';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { CheckCircle2, Clock, AlertCircle, ListTodo, Activity as ActivityIcon } from 'lucide-react';
import { format, subDays } from 'date-fns';

export function Dashboard() {
  const { todos, activities, checkOverdueTasks } = useAppStore();

  useEffect(() => {
    checkOverdueTasks();
  }, [checkOverdueTasks]);

  const stats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter(t => t.status === 'Completed').length;
    const pending = todos.filter(t => t.status === 'Pending' || t.status === 'In Progress').length;
    const overdue = todos.filter(t => t.status === 'Overdue').length;
    
    return {
      total,
      completed,
      pending,
      overdue,
      completionRate: total === 0 ? 0 : Math.round((completed / total) * 100)
    };
  }, [todos]);

  const priorityData = useMemo(() => {
    const counts = { Low: 0, Medium: 0, High: 0, Critical: 0 };
    todos.forEach(t => counts[t.priority]++);
    return [
      { name: 'Critical', value: counts.Critical, color: '#ef4444' },
      { name: 'High', value: counts.High, color: '#f97316' },
      { name: 'Medium', value: counts.Medium, color: '#eab308' },
      { name: 'Low', value: counts.Low, color: '#3b82f6' },
    ].filter(d => d.value > 0);
  }, [todos]);

  const weeklyData = useMemo(() => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dateStr = format(date, 'MMM dd');
      const isoDateStr = format(date, 'yyyy-MM-dd');
      
      const completedOnDay = activities.filter(a => 
        a.type === 'todo_completed' && a.timestamp.startsWith(isoDateStr)
      ).length;
      
      const createdOnDay = activities.filter(a => 
        a.type === 'todo_created' && a.timestamp.startsWith(isoDateStr)
      ).length;
      
      data.push({
        name: dateStr,
        Completed: completedOnDay,
        Created: createdOnDay
      });
    }
    return data;
  }, [activities]);

  const recentActivities = activities.slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400">Here's your productivity overview for today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <ListTodo className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-600 dark:text-red-400">Overdue</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.overdue}</div>
          </CardContent>
        </Card>
      </div>

      {/* Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Completion Rate</span>
            <span className="text-sm font-medium">{stats.completionRate}%</span>
          </div>
          <ProgressBar value={stats.completionRate} className="h-3" />
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Chart */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Weekly Productivity</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="Completed" fill="#22c55e" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Created" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Priority Distribution */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Task Priority Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              {priorityData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={priorityData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {priorityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-slate-500">No tasks available</p>
              )}
            </div>
            {priorityData.length > 0 && (
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                {priorityData.map((entry, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                    <span className="text-sm">{entry.name} ({entry.value})</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ActivityIcon className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4 pb-4 last:pb-0 border-b border-slate-100 dark:border-slate-800 last:border-0">
                  <div className="mt-0.5">
                    {activity.type === 'todo_created' && <ListTodo className="h-4 w-4 text-blue-500" />}
                    {activity.type === 'todo_completed' && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                    {activity.type === 'status_logged' && <ActivityIcon className="h-4 w-4 text-purple-500" />}
                    {activity.type === 'login' && <Clock className="h-4 w-4 text-slate-500" />}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{activity.description}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {format(new Date(activity.timestamp), 'MMM d, yyyy h:mm a')}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">No recent activity</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
