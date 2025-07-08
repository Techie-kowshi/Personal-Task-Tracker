
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Task } from '@/types/task';
import { Edit2, Trash2 } from 'lucide-react';
import ConfirmDialog from './ConfirmDialog';

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onToggleComplete: (id: number) => void;
}

const TaskItem = ({ task, onEdit, onDelete, onToggleComplete }: TaskItemProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDelete = () => {
    onDelete(task.id);
    setShowDeleteDialog(false);
  };

  return (
    <>
      <Card className={`group transition-all duration-300 hover:shadow-glow hover:scale-[1.02] border ${
        task.completed 
          ? 'bg-success/5 border-success/20 shadow-sm' 
          : 'gradient-card border-border/50 hover:border-primary/30'
      }`}>
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <div className="pt-1">
              <Checkbox
                checked={task.completed}
                onCheckedChange={() => onToggleComplete(task.id)}
                className="data-[state=checked]:bg-success data-[state=checked]:border-success transition-all duration-200"
              />
            </div>
            
            <div className="flex-1 space-y-3">
              <h3 className={`font-semibold text-lg transition-all duration-300 ${
                task.completed 
                  ? 'text-success line-through opacity-75' 
                  : 'text-foreground group-hover:text-primary'
              }`}>
                {task.title}
              </h3>
              
              {task.description && (
                <p className={`text-sm leading-relaxed transition-all duration-200 ${
                  task.completed 
                    ? 'text-success/80 opacity-75' 
                    : 'text-muted-foreground'
                }`}>
                  {task.description}
                </p>
              )}
              
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="w-1 h-1 rounded-full bg-primary/50" />
                Created: {formatDate(task.createdAt)}
              </div>
            </div>
            
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(task)}
                className="h-8 w-8 p-0 hover:bg-primary/10 hover:shadow-sm transition-all duration-200"
              >
                <Edit2 className="w-4 h-4 text-primary" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDeleteDialog(true)}
                className="h-8 w-8 p-0 hover:bg-destructive/10 hover:shadow-sm transition-all duration-200"
              >
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        title="Delete Task"
        description="Are you sure you want to delete this task? This action cannot be undone."
      />
    </>
  );
};

export default TaskItem;
