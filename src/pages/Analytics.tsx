import { useMemo } from 'react';
import { useAppStore } from '../store/appStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subDays, startOfWeek, endOfWeek, parseISO, isWithinInterval } from 'date-fns';

export function Analytics() {
  const { todos, activities } = useAppStore();

  const activityData = useMemo(() => {
    const data = [];
    for (let i = 14; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dateStr = format(date, 'MMM dd');
      const isoDateStr = format(date, 'yyyy-MM-dd');
      
      const activityCount = activities.filter(a => a.timestamp.startsWith(isoDateStr)).length;
      
      data.push({
        name: dateStr,
        Activities: activityCount
      });
    }
    return data;
  }, [activities]);

  const productivityScore = useMemo(() => {
    const start = startOfWeek(new Date());
    const end = endOfWeek(new Date());
    
    const completedThisWeek = todos.filter(t => 
      t.status === 'Completed' && 
      isWithinInterval(parseISO(t.updatedAt), { start, end })
    ).length;
    
    const createdThisWeek = todos.filter(t => 
      isWithinInterval(parseISO(t.createdAt), { start, end })
    ).length;
    
    if (createdThisWeek === 0) return 100; // default if no tasks
    return Math.min(Math.round((completedThisWeek / createdThisWeek) * 100), 100);
  }, [todos]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="text-slate-500 dark:text-slate-400">Detailed insights into your productivity.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Weekly Score</CardTitle>
            <CardDescription>Completion vs Creation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-4">
              <div className="relative flex items-center justify-center h-32 w-32 rounded-full border-8 border-slate-100 dark:border-slate-800">
                <div 
                  className="absolute inset-0 rounded-full border-8 border-blue-600 dark:border-blue-500"
                  style={{
                    clipPath: `polygon(0 0, 100% 0, 100% ${productivityScore}%, 0 ${productivityScore}%)`,
                    transform: 'rotate(-90deg)',
                  }}
                />
                <span className="text-3xl font-bold">{productivityScore}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Activity Trend (14 Days)</CardTitle>
            <CardDescription>Number of actions performed per day</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                  />
                  <Line type="monotone" dataKey="Activities" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.length > 0 ? (
              activities.map((activity) => (
                <div key={activity.id} className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-slate-800 last:border-0">
                  <div>
                    <p className="font-medium">{activity.description}</p>
                    <p className="text-sm text-slate-500">{format(new Date(activity.timestamp), 'MMM d, yyyy h:mm a')}</p>
                  </div>
                  <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                    {activity.type.replace('_', ' ')}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-slate-500 text-center py-4">No activities recorded yet.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
