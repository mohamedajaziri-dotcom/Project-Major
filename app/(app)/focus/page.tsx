'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

export default function FocusPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [minutes, setMinutes] = useState(60)
  const [leverageType, setLeverageType] = useState('HL')
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [context, setContext] = useState('')
  const [note, setNote] = useState('')
  const [startTime, setStartTime] = useState<Date | null>(null)

  useEffect(() => {
    const type = searchParams.get('type')
    const mins = searchParams.get('minutes')
    if (type) setLeverageType(type)
    if (mins) setMinutes(parseInt(mins))
  }, [searchParams])

  useEffect(() => {
    if (isRunning && timeLeft !== null && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0) {
      handleComplete()
    }
  }, [isRunning, timeLeft])

  const startTimer = () => {
    setTimeLeft(minutes * 60)
    setIsRunning(true)
    setStartTime(new Date())
  }

  const stopTimer = () => {
    setIsRunning(false)
    setTimeLeft(null)
  }

  const handleComplete = async () => {
    setIsRunning(false)
    
    if (!startTime) return

    const endTime = new Date()
    const actualMinutes = Math.round((endTime.getTime() - startTime.getTime()) / 60000)

    try {
      await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          durationMinutes: actualMinutes,
          leverageType,
          context: context || undefined,
          note: note || undefined,
        }),
      })
      
      alert(`🎉 Session complete! ${actualMinutes} minutes of ${leverageType} work logged.`)
      router.push('/')
    } catch (error) {
      console.error('Failed to log session:', error)
      alert('Failed to log session')
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">Focus Session</h1>

      {!isRunning && timeLeft === null ? (
        <>
          {/* Session Setup */}
          <section className="bg-white rounded-lg p-6 shadow mb-6">
            <h2 className="text-xl font-semibold mb-4">Set Up Your Session</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Leverage Type
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['HL', 'MT', 'LL'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setLeverageType(type)}
                      className={`py-3 px-4 rounded-lg font-semibold transition ${
                        leverageType === type
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration: {minutes} minutes
                </label>
                <input
                  type="range"
                  min="5"
                  max="120"
                  step="5"
                  value={minutes}
                  onChange={(e) => setMinutes(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>5 min</span>
                  <span>120 min</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Context (optional)
                </label>
                <input
                  type="text"
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., deep work, learning, coding"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Note (optional)
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  rows={3}
                  placeholder="What are you working on?"
                />
              </div>
            </div>
          </section>

          <button
            onClick={startTimer}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-6 rounded-lg shadow-lg transition text-xl"
          >
            🚀 Start {minutes}-Minute {leverageType} Session
          </button>
        </>
      ) : (
        <>
          {/* Active Timer */}
          <section className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg p-8 shadow-lg text-white mb-6">
            <div className="text-center">
              <div className="text-sm uppercase tracking-wide mb-2">
                {leverageType} Session
              </div>
              <div className="text-7xl font-bold mb-4">
                {formatTime(timeLeft || 0)}
              </div>
              <div className="text-lg opacity-90">
                Stay focused. You've got this! 💪
              </div>
            </div>
          </section>

          <div className="space-y-3">
            <button
              onClick={handleComplete}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-lg transition"
            >
              ✓ Complete Session Early
            </button>
            <button
              onClick={stopTimer}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-6 rounded-lg transition"
            >
              ✕ Cancel Session
            </button>
          </div>
        </>
      )}
    </div>
  )
}
