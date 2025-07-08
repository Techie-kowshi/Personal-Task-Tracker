
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TaskFilter as FilterType } from '@/types/task';
import { CheckCircle, Circle, List } from 'lucide-react';

interface TaskFilterProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  taskCounts: {
    all: number;
    completed: number;
    pending: number;
  };
}

const TaskFilter = ({ currentFilter, onFilterChange, taskCounts }: TaskFilterProps) => {
  const filters = [
    { 
      key: 'all' as FilterType, 
      label: 'All', 
      icon: List, 
      count: taskCounts.all,
      color: 'bg-gray-100 text-gray-800 hover:bg-gray-200'
    },
    { 
      key: 'pending' as FilterType, 
      label: 'Pending', 
      icon: Circle, 
      count: taskCounts.pending,
      color: 'bg-orange-100 text-orange-800 hover:bg-orange-200'
    },
    { 
      key: 'completed' as FilterType, 
      label: 'Completed', 
      icon: CheckCircle, 
      count: taskCounts.completed,
      color: 'bg-green-100 text-green-800 hover:bg-green-200'
    },
  ];

  return (
    <div className="flex flex-wrap gap-3">
      {filters.map(({ key, label, icon: Icon, count, color }) => (
        <Button
          key={key}
          variant={currentFilter === key ? "default" : "outline"}
          onClick={() => onFilterChange(key)}
          className={`flex items-center gap-2 transition-all duration-200 ${
            currentFilter === key 
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' 
              : 'hover:scale-105'
          }`}
        >
          <Icon className="w-4 h-4" />
          {label}
          <Badge 
            variant="secondary" 
            className={`ml-1 ${currentFilter === key ? 'bg-white/20 text-white' : color}`}
          >
            {count}
          </Badge>
        </Button>
      ))}
    </div>
  );
};

export default TaskFilter;
