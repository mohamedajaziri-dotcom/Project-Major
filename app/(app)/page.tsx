'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface WeeklyStats {
  weekStart: string
  weekEnd: string
  hlHours: number
  target: number
  remaining: number
  xpThisWeek: number
}

interface Quest {
  id: string
  title: string
  progress: number
}

export default function Home() {
  const router = useRouter()
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats | null>(null)
  const [energy, setEnergy] = useState(5)
  const [hlCommitment, setHlCommitment] = useState(2)
  const [quests, setQuests] = useState<Quest[]>([])
  const [loading, setLoading] = useState(true)
  const [streak, setStreak] = useState(0)
  const [coins, setCoins] = useState(0)
  const [xpToday, setXpToday] = useState(0)

  useEffect(() => {
    fetchWeeklyStats()
    // Load commitment from localStorage
    const savedCommitment = localStorage.getItem('hlCommitment')
    if (savedCommitment) {
      setHlCommitment(parseInt(savedCommitment))
    }
  }, [])

  const fetchWeeklyStats = async () => {
    try {
      const today = new Date().toISOString().split('T')[0]
      const res = await fetch(`/api/weekly?weekStart=${today}`)
      if (res.ok) {
        const data = await res.json()
        setWeeklyStats(data)
        setStreak(data.streak || 0)
        setCoins(data.coins || 0)
        setXpToday(data.xpToday || 0)
        setQuests(data.quests || [])
      }
    } catch (error) {
      console.error('Failed to fetch weekly stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveEnergy = async () => {
    try {
      const today = new Date().toISOString().split('T')[0]
      await fetch('/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: today, energy }),
      })
      alert('Energy level saved!')
    } catch (error) {
      console.error('Failed to save energy:', error)
      alert('Failed to save energy level')
    }
  }

  const setCommitment = (sessions: number) => {
    setHlCommitment(sessions)
    localStorage.setItem('hlCommitment', sessions.toString())
  }

  const startSession = (type: string, minutes: number) => {
    router.push(`/focus?type=${type}&minutes=${minutes}`)
  }

  const quickLog = (type: string) => {
    router.push(`/log?type=${type}`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  const hlHours = weeklyStats?.hlHours || 0
  const target = weeklyStats?.target || 10
  const remaining = weeklyStats?.remaining || target
  const progressPercent = (hlHours / target) * 100

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      {/* Weekly North Star */}
      <section className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-6 text-white">
        <h2 className="text-xl font-bold mb-2">Weekly North Star</h2>
        <p className="text-indigo-100">WHLH (Weekly High-Leverage Hours)</p>
        <div className="mt-4 text-3xl font-bold">{hlHours.toFixed(1)} / {target} hours</div>
      </section>

      {/* Progress Bar */}
      <section className="bg-white rounded-lg p-6 shadow">
        <h3 className="font-semibold mb-3">This Week's Progress</h3>
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-200">
                HL Hours
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold inline-block text-indigo-600">
                {Math.min(progressPercent, 100).toFixed(0)}%
              </span>
            </div>
          </div>
          <div className="overflow-hidden h-3 mb-4 text-xs flex rounded bg-indigo-100">
            <div
              style={{ width: `${Math.min(progressPercent, 100)}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-600 transition-all duration-500"
            ></div>
          </div>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-700">
            {remaining > 0 ? `${remaining.toFixed(1)} HL hours remaining to hit target` : '🎉 Target achieved!'}
          </p>
        </div>
      </section>

      {/* Start HL Session CTA */}
      <button
        onClick={() => startSession('HL', 60)}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-6 rounded-lg shadow-lg transition duration-200 transform hover:scale-105"
      >
        🚀 Start HL Session (60 min)
      </button>

      {/* Today Plan */}
      <section className="bg-white rounded-lg p-6 shadow">
        <h3 className="font-semibold mb-3 text-lg">Today's Plan</h3>
        <div className="space-y-2">
          <p className="text-gray-600">Focus on your most impactful tasks</p>
          <div className="border-l-4 border-indigo-500 pl-4 py-2 bg-indigo-50">
            <p className="text-sm font-medium text-gray-700">High-leverage work blocks scheduled</p>
          </div>
        </div>
      </section>

      {/* Energy Slider */}
      <section className="bg-white rounded-lg p-6 shadow">
        <h3 className="font-semibold mb-3">Energy Check-in</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-2">
              How's your energy today? (1-10)
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={energy}
              onChange={(e) => setEnergy(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Low</span>
              <span className="font-bold text-indigo-600 text-lg">{energy}</span>
              <span>High</span>
            </div>
          </div>
          <button
            onClick={saveEnergy}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition"
          >
            Save Energy Level
          </button>
        </div>
      </section>

      {/* Today HL Commitment */}
      <section className="bg-white rounded-lg p-6 shadow">
        <h3 className="font-semibold mb-3">Today's HL Commitment</h3>
        <p className="text-sm text-gray-600 mb-3">How many HL sessions will you complete today?</p>
        <div className="flex gap-3">
          {[1, 2, 3].map((num) => (
            <button
              key={num}
              onClick={() => setCommitment(num)}
              className={`flex-1 py-3 px-4 rounded-lg font-bold transition ${
                hlCommitment === num
                  ? 'bg-indigo-600 text-white shadow-lg scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {num} {num === 1 ? 'Session' : 'Sessions'}
            </button>
          ))}
        </div>
      </section>

      {/* Next Action Card */}
      <section className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg p-6 shadow-lg text-white">
        <h3 className="font-bold mb-3 text-lg">⚡ Next Action</h3>
        <p className="mb-4">Ready to dive in?</p>
        <button
          onClick={() => startSession('HL', 15)}
          className="w-full bg-white text-orange-600 font-bold py-3 px-6 rounded-lg hover:bg-gray-50 transition transform hover:scale-105"
        >
          Start 15-min HL Sprint
        </button>
      </section>

      {/* Quick Log */}
      <section className="bg-white rounded-lg p-6 shadow">
        <h3 className="font-semibold mb-3">Quick Log</h3>
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => quickLog('HL')}
            className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-semibold py-3 px-4 rounded-lg transition"
          >
            Log HL
          </button>
          <button
            onClick={() => quickLog('MT')}
            className="bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold py-3 px-4 rounded-lg transition"
          >
            Log MT
          </button>
          <button
            onClick={() => quickLog('LL')}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-lg transition"
          >
            Log LL
          </button>
        </div>
      </section>

      {/* This Week's Quests */}
      <section className="bg-white rounded-lg p-6 shadow">
        <h3 className="font-semibold mb-4 text-lg">This Week's Quests</h3>
        {quests.length > 0 ? (
          <div className="space-y-3">
            {quests.map((quest) => (
              <div key={quest.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">{quest.title}</h4>
                  <span className="text-sm text-indigo-600 font-semibold">{quest.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${quest.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">
            <p>No quests yet. Create your first quest in the Plan section!</p>
            <button
              onClick={() => router.push('/plan')}
              className="mt-3 text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Go to Plan →
            </button>
          </div>
        )}
      </section>

      {/* Rewards */}
      <section className="bg-white rounded-lg p-6 shadow">
        <h3 className="font-semibold mb-4 text-lg">Rewards</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-3xl mb-2">⭐</div>
            <div className="text-2xl font-bold text-yellow-600">{xpToday}</div>
            <div className="text-xs text-gray-600">XP Today</div>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">🔥</div>
            <div className="text-2xl font-bold text-orange-600">{streak}</div>
            <div className="text-xs text-gray-600">Day Streak</div>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">🪙</div>
            <div className="text-2xl font-bold text-yellow-500">{coins}</div>
            <div className="text-xs text-gray-600">Coins</div>
          </div>
        </div>
      </section>
    </div>
  )
}