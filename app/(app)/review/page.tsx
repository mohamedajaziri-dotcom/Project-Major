'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { WeeklyStats } from '@/lib/types';
import { getWeekStart, formatDate } from '@/lib/utils';
import { getWeeklyStats, getWeeklyTarget } from '@/lib/db';
import { DEV_USER_ID } from '@/lib/devUser';
import { Toaster, toast } from 'sonner';

export default function ReviewPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats | null>(null);
  const [weeklyTarget, setWeeklyTarget] = useState(20);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const weekStart = getWeekStart(new Date());
      const [stats, target] = await Promise.all([
        getWeeklyStats(DEV_USER_ID, weekStart),
        getWeeklyTarget(DEV_USER_ID, weekStart),
      ]);

      setWeeklyStats(stats);
      setWeeklyTarget(target);
    } catch (error) {
      console.error('Error loading review data:', error);
      toast.error('Failed to load review data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!weeklyStats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">No data available</div>
      </div>
    );
  }

  const weeklyProgress = (weeklyStats.hlHours / weeklyTarget) * 100;
  const totalHours = weeklyStats.hlHours + weeklyStats.mtHours + weeklyStats.llHours;

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
        <h1 className="text-3xl font-bold">Weekly Review</h1>
        <p className="text-purple-100">Week of {weeklyStats.weekStart}</p>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Overall Stats */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">📊 Overall Performance</h2>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-blue-700">
                {weeklyStats.hlHours.toFixed(1)}h
              </div>
              <div className="text-sm text-gray-600 mt-1">HL Hours</div>
              <div className="text-xs text-gray-500">
                Target: {weeklyTarget}h ({weeklyProgress.toFixed(0)}%)
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-green-700">
                {totalHours.toFixed(1)}h
              </div>
              <div className="text-sm text-gray-600 mt-1">Total Tracked</div>
              <div className="text-xs text-gray-500">
                {weeklyStats.sessionCount} sessions
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium">Weekly HL Target</span>
              <span className="font-semibold">
                {weeklyStats.hlHours.toFixed(1)} / {weeklyTarget}h
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  weeklyProgress >= 100
                    ? 'bg-green-600'
                    : weeklyProgress >= 75
                    ? 'bg-blue-600'
                    : 'bg-yellow-500'
                }`}
                style={{ width: `${Math.min(weeklyProgress, 100)}%` }}
              />
            </div>
          </div>

          {weeklyProgress >= 100 && (
            <div className="bg-green-100 border border-green-300 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-green-800">
                🎉 Target achieved! Great work!
              </div>
            </div>
          )}
        </div>

        {/* Time Breakdown */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">⏱️ Time Breakdown</h2>
          
          <div className="space-y-4">
            {/* HL/MT/LL Distribution */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">By Leverage Type</h3>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>HL (High Leverage)</span>
                    <span className="font-semibold">{weeklyStats.hlHours.toFixed(1)}h</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-full rounded-full"
                      style={{
                        width: `${totalHours > 0 ? (weeklyStats.hlHours / totalHours) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>MT (Medium Task)</span>
                    <span className="font-semibold">{weeklyStats.mtHours.toFixed(1)}h</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-full rounded-full"
                      style={{
                        width: `${totalHours > 0 ? (weeklyStats.mtHours / totalHours) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>LL (Low Leverage)</span>
                    <span className="font-semibold">{weeklyStats.llHours.toFixed(1)}h</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gray-500 h-full rounded-full"
                      style={{
                        width: `${totalHours > 0 ? (weeklyStats.llHours / totalHours) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* HL by Context */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">HL by Context</h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-purple-50 rounded p-3 text-center">
                  <div className="text-2xl font-bold text-purple-700">
                    {weeklyStats.hlByContext.work.toFixed(1)}h
                  </div>
                  <div className="text-xs text-gray-600">Work</div>
                </div>
                <div className="bg-indigo-50 rounded p-3 text-center">
                  <div className="text-2xl font-bold text-indigo-700">
                    {weeklyStats.hlByContext.evening.toFixed(1)}h
                  </div>
                  <div className="text-xs text-gray-600">Evening</div>
                </div>
                <div className="bg-pink-50 rounded p-3 text-center">
                  <div className="text-2xl font-bold text-pink-700">
                    {weeklyStats.hlByContext.weekend.toFixed(1)}h
                  </div>
                  <div className="text-xs text-gray-600">Weekend</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Insights */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">💡 Insights</h2>
          
          <div className="space-y-3">
            {weeklyStats.daysWithHL > 0 && (
              <div className="flex items-start gap-3 bg-green-50 rounded p-3">
                <span className="text-2xl">✅</span>
                <div>
                  <div className="font-semibold text-green-800">
                    {weeklyStats.daysWithHL} days with HL work
                  </div>
                  <div className="text-sm text-gray-600">
                    Great consistency! Keep building that streak.
                  </div>
                </div>
              </div>
            )}

            {weeklyStats.llAtWork > 0 && (
              <div className="flex items-start gap-3 bg-red-50 rounded p-3">
                <span className="text-2xl">⚠️</span>
                <div>
                  <div className="font-semibold text-red-800">
                    {weeklyStats.llAtWork} minutes of LL during work hours
                  </div>
                  <div className="text-sm text-gray-600">
                    Consider batching low-leverage tasks outside of work hours.
                  </div>
                </div>
              </div>
            )}

            {weeklyProgress < 50 && (
              <div className="flex items-start gap-3 bg-yellow-50 rounded p-3">
                <span className="text-2xl">🎯</span>
                <div>
                  <div className="font-semibold text-yellow-800">
                    Behind on weekly HL target
                  </div>
                  <div className="text-sm text-gray-600">
                    You need {(weeklyTarget - weeklyStats.hlHours).toFixed(1)}h more to hit your goal.
                    Push harder in the remaining days!
                  </div>
                </div>
              </div>
            )}

            {weeklyStats.hlByContext.work > weeklyStats.hlByContext.evening + weeklyStats.hlByContext.weekend && (
              <div className="flex items-start gap-3 bg-blue-50 rounded p-3">
                <span className="text-2xl">💼</span>
                <div>
                  <div className="font-semibold text-blue-800">
                    Most HL work during work hours
                  </div>
                  <div className="text-sm text-gray-600">
                    You're making great use of your work time. Consider protecting evening/weekend for rest.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
