'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const [weeklyTarget, setWeeklyTarget] = useState(10)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const saveSettings = async () => {
    setLoading(true)
    // In MVP, just save to localStorage
    localStorage.setItem('weeklyTarget', weeklyTarget.toString())
    alert('Settings saved!')
    setLoading(false)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      {/* Weekly Target */}
      <section className="bg-white rounded-lg p-6 shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Weekly HL Target</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target High-Leverage Hours: {weeklyTarget} hours/week
            </label>
            <input
              type="range"
              min="1"
              max="40"
              value={weeklyTarget}
              onChange={(e) => setWeeklyTarget(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1h</span>
              <span>40h</span>
            </div>
          </div>
          <button
            onClick={saveSettings}
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </section>

      {/* Profile */}
      <section className="bg-white rounded-lg p-6 shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Profile</h2>
        <div className="text-sm text-gray-600">
          <p>Manage your account settings and preferences</p>
        </div>
      </section>

      {/* Notifications */}
      <section className="bg-white rounded-lg p-6 shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Notifications</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Daily reminders</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Weekly review reminders</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
        </div>
      </section>

      {/* Danger Zone */}
      <section className="bg-white rounded-lg p-6 shadow border-2 border-red-200">
        <h2 className="text-xl font-semibold mb-4 text-red-600">Danger Zone</h2>
        <button
          onClick={handleSignOut}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition"
        >
          Sign Out
        </button>
      </section>
    </div>
  )
}
