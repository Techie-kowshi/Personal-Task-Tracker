
import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { StatsCard } from '@/components/ui/stats-card';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import TaskFilter from './TaskFilter';
import AiAssistant from './ai/AiAssistant';
import { Task, TaskFilter as FilterType } from '@/types/task';
import { loadTasks, saveTasks } from '@/utils/localStorage';
import { LogOut, Plus, Search, Target, TrendingUp, Clock, CheckCircle, BarChart3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TaskDashboardProps {
  username: string;
  onLogout: () => void;
}

const TaskDashboard = ({ username, onLogout }: TaskDashboardProps) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const loadedTasks = loadTasks();
    setTasks(loadedTasks);
  }, []);

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const addTask = (taskData: { title: string; description: string; priority?: 'low' | 'medium' | 'high' }) => {
    const newTask: Task = {
      id: Date.now(),
      title: taskData.title,
      description: taskData.description,
      completed: false,
      createdAt: new Date().toISOString(),
      priority: taskData.priority || 'medium',
    };
    setTasks([newTask, ...tasks]);
    setShowForm(false);
    toast({
      title: "Task Added",
      description: "Your new task has been created successfully.",
    });
  };

  const updateTask = (taskData: { title: string; description: string; priority?: 'low' | 'medium' | 'high' }) => {
    if (!editingTask) return;
    
    setTasks(tasks.map(task => 
      task.id === editingTask.id 
        ? { ...task, title: taskData.title, description: taskData.description, priority: taskData.priority || task.priority }
        : task
    ));
    setEditingTask(null);
    toast({
      title: "Task Updated",
      description: "Your task has been updated successfully.",
    });
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
    toast({
      title: "Task Deleted",
      description: "The task has been removed.",
      variant: "destructive",
    });
  };

  const toggleComplete = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const filteredTasks = useMemo(() => {
    let filtered = tasks.filter(task => {
      switch (filter) {
        case 'completed':
          return task.completed;
        case 'pending':
          return !task.completed;
        default:
          return true;
      }
    });

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [tasks, filter, searchQuery]);

  const taskCounts = {
    all: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    pending: tasks.filter(t => !t.completed).length,
  };

  const stats = useMemo(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    const today = new Date();
    const todayTasks = tasks.filter(t => {
      const taskDate = new Date(t.createdAt);
      return taskDate.toDateString() === today.toDateString();
    }).length;

    const thisWeekTasks = tasks.filter(t => {
      const taskDate = new Date(t.createdAt);
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      return taskDate >= weekAgo;
    }).length;

    return {
      totalTasks,
      completedTasks,
      completionRate,
      todayTasks,
      thisWeekTasks,
      pendingTasks: totalTasks - completedTasks
    };
  }, [tasks]);

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Advanced Header */}
      <header className="glass border-b border-border/50 sticky top-0 z-40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center shadow-glow">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
                    TaskTracker AI
                  </h1>
                  <p className="text-sm text-muted-foreground">Welcome back, {username}!</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64 bg-background/50 border-border/50 focus:border-primary"
                />
              </div>
              
              <Button
                onClick={() => setShowForm(true)}
                className="gradient-primary hover:shadow-glow transition-all duration-300"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </Button>
              
              <ThemeToggle />
              
              <Button variant="outline" onClick={onLogout} className="border-border/50">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-8">
      {/* Stats Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <StatsCard
              title="Total Tasks"
              value={stats.totalTasks}
              description="All-time tasks created"
              icon={BarChart3}
              className="hover:scale-105 transition-transform duration-300"
            />
            <StatsCard
              title="Completed"
              value={stats.completedTasks}
              description={`${stats.completionRate}% completion rate`}
              icon={CheckCircle}
              className="hover:scale-105 transition-transform duration-300"
            />
            <StatsCard
              title="High Priority"
              value={tasks.filter(t => t.priority === 'high' && !t.completed).length}
              description="Urgent tasks pending"
              icon={Target}
              className="hover:scale-105 transition-transform duration-300"
            />
            <StatsCard
              title="This Week"
              value={stats.thisWeekTasks}
              description="Tasks created this week"
              icon={TrendingUp}
              className="hover:scale-105 transition-transform duration-300"
            />
            <StatsCard
              title="Today"
              value={stats.todayTasks}
              description="Tasks created today"
              icon={Clock}
              className="hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Task Management */}
          <div className="space-y-6">
            <TaskFilter
              currentFilter={filter}
              onFilterChange={setFilter}
              taskCounts={taskCounts}
            />

            <TaskList
              tasks={filteredTasks}
              onEdit={setEditingTask}
              onDelete={deleteTask}
              onToggleComplete={toggleComplete}
            />

            {filteredTasks.length === 0 && (
              <div className="text-center py-12">
                <div className="relative">
                  <div className="text-4xl mb-4 animate-float">🎯</div>
                  <div className="text-muted-foreground text-lg mb-4">
                    {searchQuery ? `No tasks found for "${searchQuery}"` : 
                     filter === 'all' ? 'No tasks yet. Start your productivity journey!' : 
                     `No ${filter} tasks.`}
                  </div>
                  {filter === 'all' && !searchQuery && (
                    <Button 
                      onClick={() => setShowForm(true)}
                      variant="outline" 
                      className="border-primary/50 hover:bg-primary/10 transition-all duration-300"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create your first task
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* AI Assistant */}
      <AiAssistant tasks={tasks} onAddTask={addTask} />

      {/* Task Form Modal */}
      {(showForm || editingTask) && (
        <TaskForm
          task={editingTask}
          onSubmit={editingTask ? updateTask : addTask}
          onCancel={() => {
            setShowForm(false);
            setEditingTask(null);
          }}
        />
      )}
    </div>
  );
};

export default TaskDashboard;
