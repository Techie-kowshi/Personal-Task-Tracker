
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Task } from '@/types/task';
import { X } from 'lucide-react';

interface TaskFormProps {
  task?: Task | null;
  onSubmit: (taskData: { title: string; description: string }) => void;
  onCancel: () => void;
}

const TaskForm = ({ task, onSubmit, onCancel }: TaskFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    setError('');
    onSubmit({ title: title.trim(), description: description.trim() });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
      <Card className="w-full max-w-md shadow-ai animate-scale-in gradient-card border-border/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl gradient-primary bg-clip-text text-transparent">
            {task ? 'Edit Task' : 'Add New Task'}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onCancel} className="hover:bg-destructive/10">
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                placeholder="Task title *"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-12 border-border/50 focus:border-primary transition-all duration-200"
                autoFocus
              />
              {error && <p className="text-destructive text-sm mt-1 animate-fade-in">{error}</p>}
            </div>
            <div>
              <Textarea
                placeholder="Description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[100px] resize-none border-border/50 focus:border-primary transition-all duration-200"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button 
                type="submit" 
                className="flex-1 gradient-primary hover:shadow-glow transition-all duration-300"
              >
                {task ? 'Update Task' : 'Add Task'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel} 
                className="flex-1 border-border/50 hover:bg-muted/50 transition-all duration-200"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskForm;
