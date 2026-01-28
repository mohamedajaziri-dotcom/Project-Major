'use client';

import { useEffect, useState } from 'react';
import { ProgressRing } from '@/components/ProgressRing';
import { UrgencyCard } from '@/components/UrgencyCard';
import { MajorQuestCard } from '@/components/MajorQuestCard';
import { TaskList } from '@/components/TaskList';
import { Quest, Task, WeeklyStats, LifeStats } from '@/lib/types';
import { getWeekStart, formatDate, calculateLifeStats } from '@/lib/utils';
import { 
  getWeeklyStats, 
  getTodayTasks, 
  getMajorQuest, 
  updateTaskStatus,
  getQuestTasks,
  getWeeklyTarget
} from '@/lib/db';
import { DEV_USER_ID } from '@/lib/devUser';
import { Toaster, toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats | null>(null);
  const [todayTasks, setTodayTasks] = useState<Task[]>([]);
  const [majorQuest, setMajorQuest] = useState<Quest | null>(null);
  const [questTasks, setQuestTasks] = useState<Task[]>([]);
  const [weeklyTarget, setWeeklyTarget] = useState(20);
  const [lifeStats, setLifeStats] = useState<LifeStats | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const today = new Date();
      const weekStart = getWeekStart(today);
      
      // Calculate life stats
      const birthdate = new Date('1993-02-13');
      const stats = calculateLifeStats(birthdate, 80, today);
      setLifeStats(stats);

      // Load weekly data
      const [statsData, tasksData, questData, target] = await Promise.all([
        getWeeklyStats(DEV_USER_ID, weekStart),
        getTodayTasks(DEV_USER_ID, today),
        getMajorQuest(DEV_USER_ID, weekStart),
        getWeeklyTarget(DEV_USER_ID, weekStart),
      ]);

      setWeeklyStats(statsData);
      setTodayTasks(tasksData.slice(0, 3)); // Top 3 tasks
      setMajorQuest(questData);
      setWeeklyTarget(target);

      // If we have a quest, load its tasks
      if (questData?.id) {
        const qTasks = await getQuestTasks(questData.id);
        setQuestTasks(qTasks);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTaskDone = async (taskId: number) => {
    const task = todayTasks.find((t) => t.id === taskId);
    if (!task) return;

    const newStatus = task.status === 'DONE' ? 'TODO' : 'DONE';
    const updated = await updateTaskStatus(taskId, newStatus);
    
    if (updated) {
      setTodayTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
      );
      
      if (newStatus === 'DONE') {
        toast.success('Task completed! 🎉');
      }
    } else {
      toast.error('Failed to update task');
    }
  };

  const handleStartFocus = (taskId: number) => {
    router.push(`/focus?taskId=${taskId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  const weeklyProgress = weeklyStats ? (weeklyStats.hlHours / weeklyTarget) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Toaster position="top-center" />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
        <h1 className="text-3xl font-bold mb-2">Project Major</h1>
        <p className="text-blue-100">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Weekly HL Progress Ring */}
        <div className="bg-white rounded-lg shadow-md p-6 flex justify-center">
          <ProgressRing
            progress={weeklyProgress}
            target={weeklyTarget}
            current={weeklyStats?.hlHours || 0}
            label="Weekly HL Hours"
            size={140}
            strokeWidth={12}
          />
        </div>

        {/* Urgency Card */}
        {lifeStats && (
          <UrgencyCard
            lifeStats={lifeStats}
            weeklyHLHours={weeklyStats?.hlHours || 0}
            weeklyHLTarget={weeklyTarget}
          />
        )}

        {/* Weekly Stats Overview */}
        {weeklyStats && (
          <div className="bg-white rounded-lg shadow-md p-5">
            <h3 className="text-lg font-bold text-gray-800 mb-3">📊 This Week</h3>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-blue-50 rounded p-3 text-center">
                <div className="text-2xl font-bold text-blue-700">
                  {weeklyStats.hlHours.toFixed(1)}
                </div>
                <div className="text-xs text-gray-600">HL Hours</div>
              </div>
              <div className="bg-yellow-50 rounded p-3 text-center">
                <div className="text-2xl font-bold text-yellow-700">
                  {weeklyStats.mtHours.toFixed(1)}
                </div>
                <div className="text-xs text-gray-600">MT Hours</div>
              </div>
              <div className="bg-gray-50 rounded p-3 text-center">
                <div className="text-2xl font-bold text-gray-700">
                  {weeklyStats.llHours.toFixed(1)}
                </div>
                <div className="text-xs text-gray-600">LL Hours</div>
              </div>
            </div>

            {/* HL Breakdown by Context */}
            <div className="bg-purple-50 rounded p-3 mb-3">
              <div className="text-sm font-medium text-gray-700 mb-2">HL by Context</div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>💼 Work</span>
                  <span className="font-semibold">{weeklyStats.hlByContext.work.toFixed(1)}h</span>
                </div>
                <div className="flex justify-between">
                  <span>🌆 Evening</span>
                  <span className="font-semibold">{weeklyStats.hlByContext.evening.toFixed(1)}h</span>
                </div>
                <div className="flex justify-between">
                  <span>🎉 Weekend</span>
                  <span className="font-semibold">{weeklyStats.hlByContext.weekend.toFixed(1)}h</span>
                </div>
              </div>
            </div>

            {/* LL Leakage Warning */}
            {weeklyStats.llAtWork > 0 && (
              <div className="bg-red-50 border border-red-200 rounded p-3">
                <div className="text-sm font-medium text-red-800">
                  ⚠️ LL Leakage at Work: {weeklyStats.llAtWork} minutes
                </div>
              </div>
            )}

            {/* Streak Counter */}
            {weeklyStats.daysWithHL > 0 && (
              <div className="mt-3 bg-green-50 rounded p-3 text-center">
                <div className="text-2xl font-bold text-green-700">
                  🔥 {weeklyStats.daysWithHL}
                </div>
                <div className="text-xs text-gray-600">Days with HL this week</div>
              </div>
            )}
          </div>
        )}

        {/* Major Quest */}
        <MajorQuestCard
          quest={majorQuest}
          tasks={questTasks}
          onEditQuest={() => router.push('/plan')}
        />

        {/* Today's Tasks */}
        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800">✅ Today's Top Tasks</h3>
            <button
              onClick={() => router.push('/plan')}
              className="text-blue-600 text-sm font-medium hover:text-blue-800"
            >
              Manage Tasks
            </button>
          </div>
          <TaskList
            tasks={todayTasks}
            onToggleDone={handleToggleTaskDone}
            onStartFocus={handleStartFocus}
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => router.push('/focus')}
            className="bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            ⏱️ Start Focus Session
          </button>
          <button
            onClick={() => router.push('/review')}
            className="bg-purple-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-purple-700 transition-colors shadow-md"
          >
            📈 Review Week
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-3 flex justify-around">
          <button
            onClick={() => router.push('/')}
            className="flex flex-col items-center text-blue-600 font-medium"
          >
            <span className="text-2xl mb-1">🏠</span>
            <span className="text-xs">Home</span>
          </button>
          <button
            onClick={() => router.push('/plan')}
            className="flex flex-col items-center text-gray-600 hover:text-blue-600"
          >
            <span className="text-2xl mb-1">📋</span>
            <span className="text-xs">Plan</span>
          </button>
          <button
            onClick={() => router.push('/focus')}
            className="flex flex-col items-center text-gray-600 hover:text-blue-600"
          >
            <span className="text-2xl mb-1">⏱️</span>
            <span className="text-xs">Focus</span>
          </button>
          <button
            onClick={() => router.push('/review')}
            className="flex flex-col items-center text-gray-600 hover:text-blue-600"
          >
            <span className="text-2xl mb-1">📊</span>
            <span className="text-xs">Review</span>
          </button>
        </div>
      </nav>
    </div>
  );
}