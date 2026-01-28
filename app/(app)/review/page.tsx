'use client'

import { useState, useEffect } from 'react'

interface WeeklyStats {
  weekStart: string
  weekEnd: string
  hlHours: number
  mtHours: number
  llHours: number
  totalHours: number
  target: number
  xpThisWeek: number
  byContext: { context: string; hours: number }[]
}

export default function ReviewPage() {
  const [stats, setStats] = useState<WeeklyStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [reflection, setReflection] = useState('')

  useEffect(() => {
    fetchWeeklyStats()
  }, [])

  const fetchWeeklyStats = async () => {
    try {
      const today = new Date().toISOString().split('T')[0]
      const res = await fetch(`/api/weekly?weekStart=${today}`)
      if (res.ok) {
        const data = await res.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Failed to fetch weekly stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">Weekly Review</h1>

      {/* Weekly Summary */}
      <section className="bg-white rounded-lg p-6 shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">This Week's Performance</h2>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-indigo-50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-indigo-600">
              {stats?.hlHours.toFixed(1) || 0}h
            </div>
            <div className="text-sm text-gray-600 mt-1">High Leverage</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-blue-600">
              {stats?.mtHours?.toFixed(1) || 0}h
            </div>
            <div className="text-sm text-gray-600 mt-1">Maintenance</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-gray-600">
              {stats?.llHours?.toFixed(1) || 0}h
            </div>
            <div className="text-sm text-gray-600 mt-1">Low Leverage</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-green-600">
              {stats?.totalHours?.toFixed(1) || 0}h
            </div>
            <div className="text-sm text-gray-600 mt-1">Total Hours</div>
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">HL Target Progress</span>
            <span className="text-sm font-semibold text-indigo-600">
              {stats?.hlHours.toFixed(1) || 0} / {stats?.target || 10} hours
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-indigo-600 h-3 rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(
                  ((stats?.hlHours || 0) / (stats?.target || 10)) * 100,
                  100
                )}%`,
              }}
            ></div>
          </div>
        </div>
      </section>

      {/* Work Breakdown */}
      {stats?.byContext && stats.byContext.length > 0 && (
        <section className="bg-white rounded-lg p-6 shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Work Breakdown</h2>
          <div className="space-y-3">
            {stats.byContext.map((item) => (
              <div key={item.context} className="flex justify-between items-center">
                <span className="text-gray-700 capitalize">{item.context || 'General'}</span>
                <span className="font-semibold text-indigo-600">
                  {item.hours.toFixed(1)}h
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* XP Earned */}
      <section className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg p-6 shadow mb-6 text-white">
        <h2 className="text-xl font-semibold mb-2">XP Earned This Week</h2>
        <div className="text-4xl font-bold">⭐ {stats?.xpThisWeek || 0} XP</div>
      </section>

      {/* Weekly Reflection */}
      <section className="bg-white rounded-lg p-6 shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Weekly Reflection</h2>
        <textarea
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          rows={6}
          placeholder="What went well this week? What could be improved? What are your key learnings?"
        />
        <button
          onClick={() => {
            // In MVP, just show alert. Full implementation would save to database
            alert('Reflection saved!')
            setReflection('')
          }}
          className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition"
        >
          Save Reflection
        </button>
      </section>

      {/* Insights */}
      <section className="bg-white rounded-lg p-6 shadow">
        <h2 className="text-xl font-semibold mb-4">Insights</h2>
        <div className="space-y-3 text-sm text-gray-700">
          {stats && stats.hlHours >= stats.target && (
            <div className="bg-green-50 border-l-4 border-green-500 p-3">
              🎉 Congratulations! You hit your HL target this week!
            </div>
          )}
          {stats && stats.hlHours < stats.target && (
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3">
              💪 You're {(stats.target - stats.hlHours).toFixed(1)} hours away from your target. Keep pushing!
            </div>
          )}
          {stats && stats.hlHours > 0 && (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-3">
              📊 Your HL work represents{' '}
              {((stats.hlHours / (stats.totalHours || 1)) * 100).toFixed(0)}% of your total tracked time.
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
