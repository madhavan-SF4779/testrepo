import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { CheckSquare } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export function Login() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) return;

    login({
      id: uuidv4(),
      name,
      email,
    });
    
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <CheckSquare className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Work Tracker</h1>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Welcome back</CardTitle>
            <CardDescription>Enter your details to sign in to your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Name
                </label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <Button type="submit" className="w-full">
                Sign In
              </Button>
            </form>
            <div className="mt-4 text-center text-sm text-slate-500 dark:text-slate-400">
              <p>Demo mode: Any name and email will work.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
