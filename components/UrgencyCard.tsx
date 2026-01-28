import React from 'react';
import { LifeStats } from '@/lib/types';

interface UrgencyCardProps {
  lifeStats: LifeStats;
  weeklyHLHours: number;
  weeklyHLTarget: number;
}

export function UrgencyCard({ lifeStats, weeklyHLHours, weeklyHLTarget }: UrgencyCardProps) {
  return (
    <div className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200 rounded-lg p-4">
      <h3 className="text-lg font-bold text-red-900 mb-3">⏰ Life Remaining</h3>
      
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-white/70 rounded p-2">
          <div className="text-xs text-gray-600">Years Left</div>
          <div className="text-xl font-bold text-red-700">{lifeStats.remainingYears.toFixed(1)}</div>
        </div>
        <div className="bg-white/70 rounded p-2">
          <div className="text-xs text-gray-600">Days Left</div>
          <div className="text-xl font-bold text-red-700">{lifeStats.remainingDays.toLocaleString()}</div>
        </div>
        <div className="bg-white/70 rounded p-2">
          <div className="text-xs text-gray-600">Total Hours</div>
          <div className="text-xl font-bold text-red-700">{lifeStats.remainingHours.toLocaleString()}</div>
        </div>
        <div className="bg-white/70 rounded p-2">
          <div className="text-xs text-gray-600">Free Hours</div>
          <div className="text-xl font-bold text-orange-700">{lifeStats.remainingFree.toLocaleString()}</div>
        </div>
      </div>

      <div className="bg-white/70 rounded p-3 mb-3">
        <div className="text-xs text-gray-600 mb-2">Time Allocation (Remaining Life)</div>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span>💤 Sleep ({(lifeStats.remainingSleep / lifeStats.remainingHours * 100).toFixed(0)}%)</span>
            <span className="font-semibold">{lifeStats.remainingSleep.toLocaleString()}h</span>
          </div>
          <div className="flex justify-between">
            <span>💼 Work ({(lifeStats.remainingWork / lifeStats.remainingHours * 100).toFixed(0)}%)</span>
            <span className="font-semibold">{lifeStats.remainingWork.toLocaleString()}h</span>
          </div>
          <div className="flex justify-between">
            <span>🎯 Free Time ({(lifeStats.remainingFree / lifeStats.remainingHours * 100).toFixed(0)}%)</span>
            <span className="font-semibold text-green-700">{lifeStats.remainingFree.toLocaleString()}h</span>
          </div>
        </div>
      </div>

      <div className="bg-blue-100 rounded p-3">
        <div className="text-xs text-gray-700 mb-1">This Week's HL Progress</div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">HL Hours</span>
          <span className="text-lg font-bold text-blue-700">
            {weeklyHLHours.toFixed(1)} / {weeklyHLTarget}h
          </span>
        </div>
        <div className="mt-2 bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-blue-600 h-full transition-all duration-500"
            style={{ width: `${Math.min((weeklyHLHours / weeklyHLTarget) * 100, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
