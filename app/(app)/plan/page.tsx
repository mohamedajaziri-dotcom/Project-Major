'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Quest, Task, LeverageType } from '@/lib/types';
import { getWeekStart, formatDate } from '@/lib/utils';
import {
  getMajorQuest,
  createOrUpdateMajorQuest,
  getQuestTasks,
  createTask,
  updateTaskStatus,
} from '@/lib/db';
import { DEV_USER_ID } from '@/lib/devUser';
import { Toaster, toast } from 'sonner';

export default function PlanPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [majorQuest, setMajorQuest] = useState<Quest | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [questTitle, setQuestTitle] = useState('');
  const [successMetric, setSuccessMetric] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDate, setNewTaskDate] = useState('');
  const [newTaskEstimate, setNewTaskEstimate] = useState('');
  const [newTaskLeverage, setNewTaskLeverage] = useState<LeverageType>('HL');
  const [isEditingQuest, setIsEditingQuest] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const weekStart = getWeekStart(new Date());
      const quest = await getMajorQuest(DEV_USER_ID, weekStart);
      setMajorQuest(quest);
      
      if (quest) {
        setQuestTitle(quest.title);
        setSuccessMetric(quest.success_metric || '');
        const questTasks = await getQuestTasks(quest.id!);
        setTasks(questTasks);
      } else {
        setIsEditingQuest(true);
      }
    } catch (error) {
      console.error('Error loading plan data:', error);
      toast.error('Failed to load plan data');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveQuest = async () => {
    if (!questTitle.trim()) {
      toast.error('Quest title is required');
      return;
    }

    try {
      const weekStart = getWeekStart(new Date());
      const quest = await createOrUpdateMajorQuest(
        DEV_USER_ID,
        weekStart,
        questTitle,
        successMetric
      );
      
      if (quest) {
        setMajorQuest(quest);
        setIsEditingQuest(false);
        toast.success('Major Quest saved!');
      } else {
        toast.error('Failed to save quest');
      }
    } catch (error) {
      console.error('Error saving quest:', error);
      toast.error('Failed to save quest');
    }
  };

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) {
      toast.error('Task title is required');
      return;
    }

    if (!majorQuest?.id) {
      toast.error('Create a Major Quest first');
      return;
    }

    try {
      const task = await createTask(
        DEV_USER_ID,
        newTaskTitle,
        majorQuest.id,
        newTaskDate ? new Date(newTaskDate) : undefined,
        newTaskEstimate ? parseInt(newTaskEstimate) : undefined,
        newTaskLeverage
      );

      if (task) {
        setTasks((prev) => [...prev, task]);
        setNewTaskTitle('');
        setNewTaskDate('');
        setNewTaskEstimate('');
        toast.success('Task added!');
      } else {
        toast.error('Failed to add task');
      }
    } catch (error) {
      console.error('Error adding task:', error);
      toast.error('Failed to add task');
    }
  };

  const handleUpdateTaskStatus = async (taskId: number, newStatus: string) => {
    const updated = await updateTaskStatus(taskId, newStatus as any);
    if (updated) {
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: newStatus as any } : t))
      );
      toast.success('Task status updated');
    } else {
      toast.error('Failed to update task');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Toaster position="top-center" />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
        <button
          onClick={() => router.push('/')}
          className="text-white mb-2 hover:underline"
        >
          ← Back to Home
        </button>
        <h1 className="text-3xl font-bold">Weekly Plan</h1>
        <p className="text-purple-100">Week of {formatDate(getWeekStart(new Date()))}</p>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Major Quest Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">🎯 Major Quest</h2>
            {!isEditingQuest && majorQuest && (
              <button
                onClick={() => setIsEditingQuest(true)}
                className="text-purple-600 text-sm font-medium hover:text-purple-800"
              >
                Edit
              </button>
            )}
          </div>

          {isEditingQuest ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quest Title *
                </label>
                <input
                  type="text"
                  value={questTitle}
                  onChange={(e) => setQuestTitle(e.target.value)}
                  placeholder="What's your main mission this week?"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Success Metric (optional)
                </label>
                <input
                  type="text"
                  value={successMetric}
                  onChange={(e) => setSuccessMetric(e.target.value)}
                  placeholder="How will you know you succeeded?"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleSaveQuest}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors"
                >
                  Save Quest
                </button>
                {majorQuest && (
                  <button
                    onClick={() => {
                      setIsEditingQuest(false);
                      setQuestTitle(majorQuest.title);
                      setSuccessMetric(majorQuest.success_metric || '');
                    }}
                    className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div>
              <h3 className="text-2xl font-bold text-purple-800 mb-2">
                {majorQuest?.title}
              </h3>
              {majorQuest?.success_metric && (
                <p className="text-gray-700">✓ {majorQuest.success_metric}</p>
              )}
            </div>
          )}
        </div>

        {/* Tasks Section */}
        {majorQuest && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">📋 Tasks</h2>

            {/* Add Task Form */}
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">Add New Task</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Task title *"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Planned Date</label>
                    <input
                      type="date"
                      value={newTaskDate}
                      onChange={(e) => setNewTaskDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Est. Minutes</label>
                    <input
                      type="number"
                      value={newTaskEstimate}
                      onChange={(e) => setNewTaskEstimate(e.target.value)}
                      placeholder="30"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Leverage Type</label>
                  <div className="flex gap-2">
                    {(['HL', 'MT', 'LL'] as LeverageType[]).map((type) => (
                      <button
                        key={type}
                        onClick={() => setNewTaskLeverage(type)}
                        className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors ${
                          newTaskLeverage === type
                            ? type === 'HL'
                              ? 'bg-blue-600 text-white'
                              : type === 'MT'
                              ? 'bg-yellow-500 text-white'
                              : 'bg-gray-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  onClick={handleAddTask}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Add Task
                </button>
              </div>
            </div>

            {/* Tasks List */}
            <div className="space-y-2">
              {tasks.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  No tasks yet. Add your first task above!
                </p>
              ) : (
                tasks.map((task) => (
                  <div
                    key={task.id}
                    className="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">{task.title}</h4>
                        <div className="flex flex-wrap gap-2 mt-2 text-xs">
                          {task.planned_date && (
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              📅 {task.planned_date}
                            </span>
                          )}
                          {task.estimate_minutes && (
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                              ⏱️ {task.estimate_minutes}min
                            </span>
                          )}
                          {task.leverage_type && (
                            <span
                              className={`px-2 py-1 rounded font-semibold ${
                                task.leverage_type === 'HL'
                                  ? 'bg-blue-200 text-blue-900'
                                  : task.leverage_type === 'MT'
                                  ? 'bg-yellow-200 text-yellow-900'
                                  : 'bg-gray-200 text-gray-700'
                              }`}
                            >
                              {task.leverage_type}
                            </span>
                          )}
                        </div>
                      </div>
                      <select
                        value={task.status}
                        onChange={(e) => handleUpdateTaskStatus(task.id!, e.target.value)}
                        className={`px-3 py-1 rounded-lg font-medium text-sm border-2 ${
                          task.status === 'DONE'
                            ? 'bg-green-100 border-green-300 text-green-800'
                            : task.status === 'DOING'
                            ? 'bg-blue-100 border-blue-300 text-blue-800'
                            : task.status === 'SKIPPED'
                            ? 'bg-gray-100 border-gray-300 text-gray-600'
                            : 'bg-white border-gray-300 text-gray-800'
                        }`}
                      >
                        <option value="TODO">TODO</option>
                        <option value="DOING">DOING</option>
                        <option value="DONE">DONE</option>
                        <option value="SKIPPED">SKIPPED</option>
                      </select>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
