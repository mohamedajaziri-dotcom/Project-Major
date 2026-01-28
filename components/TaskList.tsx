import React from 'react';
import { Task } from '@/lib/types';

interface TaskListProps {
  tasks: Task[];
  onToggleDone?: (taskId: number) => void;
  onStartFocus?: (taskId: number) => void;
  showQuickActions?: boolean;
}

export function TaskList({ tasks, onToggleDone, onStartFocus, showQuickActions = true }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No tasks for today</p>
        <p className="text-sm mt-1">Add tasks in the Plan page</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DONE':
        return 'bg-green-100 border-green-300 text-green-800';
      case 'DOING':
        return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'SKIPPED':
        return 'bg-gray-100 border-gray-300 text-gray-600';
      default:
        return 'bg-white border-gray-200 text-gray-800';
    }
  };

  const getLeverageColor = (type?: string) => {
    switch (type) {
      case 'HL':
        return 'text-blue-600 font-bold';
      case 'MT':
        return 'text-yellow-600 font-semibold';
      case 'LL':
        return 'text-gray-500';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <div
          key={task.id}
          className={`border-2 rounded-lg p-3 ${getStatusColor(task.status)}`}
        >
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={task.status === 'DONE'}
              onChange={() => onToggleDone?.(task.id!)}
              className="mt-1 w-5 h-5 rounded border-gray-300 cursor-pointer"
            />
            
            <div className="flex-1">
              <div className="flex items-start justify-between gap-2">
                <h4 className={`font-medium ${task.status === 'DONE' ? 'line-through' : ''}`}>
                  {task.title}
                </h4>
                {task.leverage_type && (
                  <span className={`text-xs font-mono ${getLeverageColor(task.leverage_type)}`}>
                    {task.leverage_type}
                  </span>
                )}
              </div>
              
              {task.estimate_minutes && (
                <p className="text-xs text-gray-600 mt-1">
                  Est: {task.estimate_minutes}min
                </p>
              )}
            </div>
          </div>

          {showQuickActions && task.status !== 'DONE' && onStartFocus && (
            <button
              onClick={() => onStartFocus(task.id!)}
              className="mt-2 text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
            >
              Start Focus Session
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
