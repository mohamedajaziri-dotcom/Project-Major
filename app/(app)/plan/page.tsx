'use client'

import { useState, useEffect } from 'react'

interface Quest {
  id: string
  title: string
  description: string
  targetHours: number
}

export default function PlanPage() {
  const [quests, setQuests] = useState<Quest[]>([])
  const [showNewQuest, setShowNewQuest] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [targetHours, setTargetHours] = useState(3)

  const createQuest = async () => {
    if (!title) return
    
    // In MVP, just show locally - full implementation would POST to API
    const newQuest: Quest = {
      id: Date.now().toString(),
      title,
      description,
      targetHours,
    }
    setQuests([...quests, newQuest])
    setTitle('')
    setDescription('')
    setTargetHours(3)
    setShowNewQuest(false)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">Weekly Plan</h1>

      {/* Weekly Overview */}
      <section className="bg-white rounded-lg p-6 shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">This Week's Focus</h2>
        <p className="text-gray-600 mb-4">
          Plan your high-leverage quests and tasks for maximum impact.
        </p>
        <button
          onClick={() => setShowNewQuest(true)}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition"
        >
          + Create New Quest
        </button>
      </section>

      {/* New Quest Form */}
      {showNewQuest && (
        <section className="bg-white rounded-lg p-6 shadow mb-6">
          <h3 className="text-lg font-semibold mb-4">New Quest</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quest Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="e.g., Complete project proposal"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                rows={3}
                placeholder="Quest details..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Hours: {targetHours}
              </label>
              <input
                type="range"
                min="1"
                max="20"
                value={targetHours}
                onChange={(e) => setTargetHours(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={createQuest}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition"
              >
                Create Quest
              </button>
              <button
                onClick={() => setShowNewQuest(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Quests List */}
      <section className="bg-white rounded-lg p-6 shadow">
        <h3 className="text-lg font-semibold mb-4">Your Quests</h3>
        {quests.length > 0 ? (
          <div className="space-y-4">
            {quests.map((quest) => (
              <div key={quest.id} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-lg mb-2">{quest.title}</h4>
                <p className="text-gray-600 text-sm mb-2">{quest.description}</p>
                <div className="text-sm text-indigo-600 font-medium">
                  Target: {quest.targetHours} hours
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No quests created yet.</p>
            <p className="text-sm mt-2">Start by creating your first weekly quest!</p>
          </div>
        )}
      </section>

      {/* Tasks Section (Placeholder) */}
      <section className="bg-white rounded-lg p-6 shadow mt-6">
        <h3 className="text-lg font-semibold mb-4">Tasks</h3>
        <p className="text-gray-500 text-center py-4">
          Task management coming soon...
        </p>
      </section>
    </div>
  )
}
