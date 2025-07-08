
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
      <Card className={`transition-all duration-200 hover:shadow-md border ${
        task.completed 
          ? 'bg-green-50/50 border-green-200' 
          : 'bg-white border-gray-200'
      }`}>
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <div className="pt-1">
              <Checkbox
                checked={task.completed}
                onCheckedChange={() => onToggleComplete(task.id)}
                className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
              />
            </div>
            
            <div className="flex-1 space-y-2">
              <h3 className={`font-semibold text-lg transition-all duration-200 ${
                task.completed 
                  ? 'text-green-700 line-through' 
                  : 'text-gray-800'
              }`}>
                {task.title}
              </h3>
              
              {task.description && (
                <p className={`text-sm leading-relaxed ${
                  task.completed 
                    ? 'text-green-600' 
                    : 'text-gray-600'
                }`}>
                  {task.description}
                </p>
              )}
              
              <p className="text-xs text-gray-500">
                Created: {formatDate(task.createdAt)}
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(task)}
                className="h-8 w-8 p-0 hover:bg-blue-100"
              >
                <Edit2 className="w-4 h-4 text-blue-600" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDeleteDialog(true)}
                className="h-8 w-8 p-0 hover:bg-red-100"
              >
                <Trash2 className="w-4 h-4 text-red-600" />
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
