'use client';

import React, { useState, useEffect, useRef } from 'react';
import { LeverageType, SessionContext } from '@/lib/types';
import { suggestSessionContext } from '@/lib/utils';

interface TimerProps {
  onSessionComplete?: (durationMinutes: number, leverageType: LeverageType, context: SessionContext) => void;
}

export function Timer({ onSessionComplete }: TimerProps) {
  const [selectedType, setSelectedType] = useState<LeverageType>('HL');
  const [selectedContext, setSelectedContext] = useState<SessionContext>(suggestSessionContext());
  const [selectedDuration, setSelectedDuration] = useState<number>(30);
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    onSessionComplete?.(selectedDuration, selectedType, selectedContext);
  };

  const startTimer = () => {
    setTimeLeft(selectedDuration * 60);
    setIsRunning(true);
  };

  const stopTimer = () => {
    const elapsedMinutes = selectedDuration - Math.floor(timeLeft / 60);
    if (elapsedMinutes > 0) {
      onSessionComplete?.(elapsedMinutes, selectedType, selectedContext);
    }
    setIsRunning(false);
    setTimeLeft(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = timeLeft > 0 ? ((selectedDuration * 60 - timeLeft) / (selectedDuration * 60)) * 100 : 0;

  return (
    <div className="space-y-4">
      {/* Leverage Type Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Leverage Type
        </label>
        <div className="flex gap-2">
          {(['HL', 'MT', 'LL'] as LeverageType[]).map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              disabled={isRunning}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors ${
                selectedType === type
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
        <p className="text-xs text-gray-500 mt-1">
          HL = High Leverage, MT = Medium Task, LL = Low Leverage
        </p>
      </div>

      {/* Context Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Context
        </label>
        <div className="flex gap-2">
          {(['work', 'evening', 'weekend'] as SessionContext[]).map((ctx) => (
            <button
              key={ctx}
              onClick={() => setSelectedContext(ctx)}
              disabled={isRunning}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors capitalize ${
                selectedContext === ctx
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {ctx}
            </button>
          ))}
        </div>
      </div>

      {/* Duration Presets */}
      {!isRunning && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Duration
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[15, 30, 60, 90].map((minutes) => (
              <button
                key={minutes}
                onClick={() => setSelectedDuration(minutes)}
                className={`py-3 px-4 rounded-lg font-semibold transition-colors ${
                  selectedDuration === minutes
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {minutes}m
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Timer Display */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-8 text-center">
        <div className="text-6xl font-bold text-gray-800 mb-4">
          {isRunning ? formatTime(timeLeft) : `${selectedDuration}:00`}
        </div>
        {isRunning && (
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
        <div className="flex gap-3 justify-center">
          {!isRunning ? (
            <button
              onClick={startTimer}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors"
            >
              Start Session
            </button>
          ) : (
            <button
              onClick={stopTimer}
              className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-red-700 transition-colors"
            >
              Stop Session
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
