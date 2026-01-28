import React from 'react';
import { Quest, Task } from '@/lib/types';

interface MajorQuestCardProps {
  quest: Quest | null;
  tasks: Task[];
  onEditQuest?: () => void;
}

export function MajorQuestCard({ quest, tasks, onEditQuest }: MajorQuestCardProps) {
  if (!quest) {
    return (
      <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4">
        <h3 className="text-lg font-bold text-purple-900 mb-2">🎯 Major Quest</h3>
        <p className="text-sm text-gray-600 mb-3">No major quest set for this week</p>
        <button
          onClick={onEditQuest}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
        >
          Create Major Quest
        </button>
      </div>
    );
  }

  const completedTasks = tasks.filter((t) => t.status === 'DONE').length;
  const totalTasks = tasks.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-bold text-purple-900">🎯 Major Quest</h3>
        {onEditQuest && (
          <button
            onClick={onEditQuest}
            className="text-purple-600 text-sm hover:text-purple-800"
          >
            Edit
          </button>
        )}
      </div>
      
      <h4 className="text-xl font-bold text-purple-800 mb-2">{quest.title}</h4>
      
      {quest.success_metric && (
        <p className="text-sm text-gray-700 mb-3">✓ {quest.success_metric}</p>
      )}

      <div className="flex items-center gap-3 mb-2">
        <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="bg-purple-600 h-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-sm font-semibold text-purple-800">
          {completedTasks}/{totalTasks}
        </span>
      </div>
      
      <div className="text-xs text-gray-600">
        {Math.round(progress)}% complete
      </div>
    </div>
  );
}
