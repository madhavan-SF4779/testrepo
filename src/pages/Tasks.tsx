import React, { useState, useMemo } from 'react';
import { useAppStore } from '../store/appStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { Plus, Search, Trash2, Edit2, CheckCircle, Circle, AlertCircle } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import type { Priority, Status, Todo } from '../types';

export function Tasks() {
  const { todos, addTodo, updateTodo, deleteTodo } = useAppStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<Status | 'All'>('All');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'All'>('All');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [dueDate, setDueDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      const matchesSearch = todo.title.toLowerCase().includes(search.toLowerCase()) || 
                           (todo.description?.toLowerCase().includes(search.toLowerCase()) || false);
      const matchesStatus = statusFilter === 'All' || todo.status === statusFilter;
      const matchesPriority = priorityFilter === 'All' || todo.priority === priorityFilter;
      
      return matchesSearch && matchesStatus && matchesPriority;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [todos, search, statusFilter, priorityFilter]);

  const openAddModal = () => {
    setEditingTodo(null);
    setTitle('');
    setDescription('');
    setPriority('Medium');
    setDueDate(format(new Date(), 'yyyy-MM-dd'));
    setIsModalOpen(true);
  };

  const openEditModal = (todo: Todo) => {
    setEditingTodo(todo);
    setTitle(todo.title);
    setDescription(todo.description || '');
    setPriority(todo.priority);
    setDueDate(format(parseISO(todo.dueDate), 'yyyy-MM-dd'));
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingTodo) {
      updateTodo(editingTodo.id, {
        title,
        description,
        priority,
        dueDate: new Date(dueDate).toISOString(),
      });
    } else {
      addTodo({
        title,
        description,
        priority,
        dueDate: new Date(dueDate).toISOString(),
      });
    }
    
    setIsModalOpen(false);
  };

  const toggleStatus = (todo: Todo) => {
    const newStatus: Status = todo.status === 'Completed' ? 'Pending' : 'Completed';
    updateTodo(todo.id, { status: newStatus });
  };

  const getPriorityColor = (p: Priority) => {
    switch (p) {
      case 'Critical': return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      case 'High': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30';
      case 'Medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
      case 'Low': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30';
      default: return 'text-slate-600 bg-slate-100 dark:bg-slate-800';
    }
  };

  const getStatusColor = (s: Status) => {
    switch (s) {
      case 'Completed': return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      case 'In Progress': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30';
      case 'Pending': return 'text-slate-600 bg-slate-100 dark:bg-slate-800';
      case 'Overdue': return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      default: return 'text-slate-600 bg-slate-100 dark:bg-slate-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage your to-dos and priorities.</p>
        </div>
        <Button onClick={openAddModal} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Task
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search tasks..." 
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select
                className="flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as Status | 'All')}
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Overdue">Overdue</option>
              </select>
              
              <select
                className="flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value as Priority | 'All')}
              >
                <option value="All">All Priorities</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTodos.length > 0 ? (
              filteredTodos.map((todo) => (
                <div 
                  key={todo.id} 
                  className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg border transition-colors ${
                    todo.status === 'Completed' ? 'bg-slate-50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-800' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-3 flex-1">
                    <button 
                      onClick={() => toggleStatus(todo)}
                      className="mt-1 text-slate-400 hover:text-blue-600 transition-colors"
                    >
                      {todo.status === 'Completed' ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <Circle className="h-5 w-5" />
                      )}
                    </button>
                    <div>
                      <h3 className={`font-medium ${todo.status === 'Completed' ? 'line-through text-slate-500' : ''}`}>
                        {todo.title}
                      </h3>
                      {todo.description && (
                        <p className={`text-sm mt-1 ${todo.status === 'Completed' ? 'text-slate-400' : 'text-slate-600 dark:text-slate-400'}`}>
                          {todo.description}
                        </p>
                      )}
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityColor(todo.priority)}`}>
                          {todo.priority}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(todo.status)}`}>
                          {todo.status}
                        </span>
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          {todo.status === 'Overdue' && <AlertCircle className="h-3 w-3 text-red-500" />}
                          Due: {format(parseISO(todo.dueDate), 'MMM d, yyyy')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <Button variant="ghost" size="icon" onClick={() => openEditModal(todo)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => deleteTodo(todo.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <CheckCircle className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium">No tasks found</h3>
                <p className="text-slate-500">Try adjusting your filters or add a new task.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingTodo ? 'Edit Task' : 'New Task'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <Input 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="What needs to be done?" 
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <textarea
              className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-slate-800 dark:bg-slate-950"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Priority</label>
              <select
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-slate-800 dark:bg-slate-950"
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Due Date</label>
              <Input 
                type="date" 
                value={dueDate} 
                onChange={(e) => setDueDate(e.target.value)} 
                required
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {editingTodo ? 'Save Changes' : 'Create Task'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

