'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Timer } from '@/components/Timer';
import { LeverageType, SessionContext } from '@/lib/types';
import { createSession } from '@/lib/db';
import { DEV_USER_ID } from '@/lib/devUser';
import { Toaster, toast } from 'sonner';

function FocusContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const taskId = searchParams?.get('taskId');

  const handleSessionComplete = async (
    durationMinutes: number,
    leverageType: LeverageType,
    context: SessionContext
  ) => {
    try {
      const startTime = new Date(Date.now() - durationMinutes * 60000);
      const session = await createSession(
        DEV_USER_ID,
        startTime,
        durationMinutes,
        leverageType,
        context,
        taskId ? parseInt(taskId) : undefined
      );

      if (session) {
        toast.success(
          `Session logged! ${durationMinutes}min of ${leverageType} time 🎉`,
          { duration: 5000 }
        );
        
        // Redirect to home after a short delay
        setTimeout(() => {
          router.push('/');
        }, 2000);
      } else {
        toast.error('Failed to save session');
      }
    } catch (error) {
      console.error('Error saving session:', error);
      toast.error('Failed to save session');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Toaster position="top-center" />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6">
        <button
          onClick={() => router.push('/')}
          className="text-white mb-2 hover:underline"
        >
          ← Back to Home
        </button>
        <h1 className="text-3xl font-bold">Focus Session</h1>
        <p className="text-blue-100">Time to do deep work</p>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <Timer onSessionComplete={handleSessionComplete} />
        </div>

        {/* Tips Section */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">💡 Focus Tips</h3>
          <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
            <li><strong>HL (High Leverage):</strong> Deep work that moves you forward</li>
            <li><strong>MT (Medium Task):</strong> Important but less strategic work</li>
            <li><strong>LL (Low Leverage):</strong> Necessary but low-value tasks</li>
            <li>Eliminate distractions before starting</li>
            <li>Take breaks between sessions</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function FocusPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-xl text-gray-600">Loading...</div></div>}>
      <FocusContent />
    </Suspense>
  );
}
