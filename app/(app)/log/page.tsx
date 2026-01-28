'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

export default function LogPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [leverageType, setLeverageType] = useState('HL')
  const [minutes, setMinutes] = useState(30)
  const [context, setContext] = useState('')
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const type = searchParams.get('type')
    if (type) setLeverageType(type)
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const endTime = new Date()
      const startTime = new Date(endTime.getTime() - minutes * 60000)

      const res = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          durationMinutes: minutes,
          leverageType,
          context: context || undefined,
          note: note || undefined,
        }),
      })

      if (!res.ok) {
        throw new Error('Failed to log session')
      }

      alert(`✅ Logged ${minutes} minutes of ${leverageType} work!`)
      router.push('/')
    } catch (error) {
      console.error('Failed to log session:', error)
      alert('Failed to log session. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">Quick Log</h1>

      <form onSubmit={handleSubmit}>
        <section className="bg-white rounded-lg p-6 shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Log Your Work</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Leverage Type
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['HL', 'MT', 'LL'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setLeverageType(type)}
                    className={`py-3 px-4 rounded-lg font-semibold transition ${
                      leverageType === type
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {type}
                    <div className="text-xs mt-1 opacity-75">
                      {type === 'HL' && 'High Leverage'}
                      {type === 'MT' && 'Maintenance'}
                      {type === 'LL' && 'Low Leverage'}
                    </div>
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
                max="240"
                step="5"
                value={minutes}
                onChange={(e) => setMinutes(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>5 min</span>
                <span>240 min</span>
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
                placeholder="e.g., meeting, email, coding"
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
                placeholder="What did you work on?"
              />
            </div>
          </div>
        </section>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-6 rounded-lg shadow-lg transition disabled:opacity-50"
        >
          {submitting ? 'Logging...' : `Log ${minutes}-min ${leverageType} Session`}
        </button>
      </form>
    </div>
  )
}
