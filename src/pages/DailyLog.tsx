import React, { useState } from 'react';
import { useAppStore } from '../store/appStore';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { format } from 'date-fns';
import { Activity as ActivityIcon, Send } from 'lucide-react';

export function DailyLog() {
  const { dailyStatuses, addDailyStatus } = useAppStore();
  const [statusText, setStatusText] = useState('');
  
  const today = format(new Date(), 'yyyy-MM-dd');
  const hasLoggedToday = dailyStatuses.some(s => s.date === today);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!statusText.trim()) return;
    
    addDailyStatus(statusText);
    setStatusText('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Daily Log</h1>
        <p className="text-slate-500 dark:text-slate-400">Keep track of your daily work and progress.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Log Today's Status</CardTitle>
          <CardDescription>What have you accomplished today?</CardDescription>
        </CardHeader>
        <CardContent>
          {hasLoggedToday ? (
            <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 p-4 rounded-lg flex items-center gap-3">
              <ActivityIcon className="h-5 w-5" />
              <p>You have already logged your status for today. You can update it below.</p>
            </div>
          ) : null}
          
          <form onSubmit={handleSubmit} className="mt-4">
            <textarea
              className="flex min-h-[120px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-slate-800 dark:bg-slate-950 mb-4"
              placeholder="I completed the dashboard UI and started working on the authentication..."
              value={statusText}
              onChange={(e) => setStatusText(e.target.value)}
              required
            />
            <Button type="submit" className="flex items-center gap-2">
              <Send className="h-4 w-4" />
              {hasLoggedToday ? 'Update Status' : 'Log Status'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4 mt-8">
        <h2 className="text-xl font-bold">Previous Logs</h2>
        
        {dailyStatuses.length > 0 ? (
          <div className="space-y-4">
            {dailyStatuses.map(status => (
              <Card key={status.id}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-slate-500">
                    {format(new Date(status.createdAt), 'EEEE, MMMM do, yyyy')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap">{status.statusText}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-8 text-center text-slate-500">
              No daily logs found. Start logging your work today!
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
