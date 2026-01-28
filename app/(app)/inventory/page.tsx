export default function InventoryPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">Inventory</h1>

      <section className="bg-white rounded-lg p-6 shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Skills & Strengths</h2>
        <div className="text-center py-8 text-gray-500">
          <p className="text-lg mb-2">🚧 Coming in Phase 2</p>
          <p className="text-sm">
            Track your skills, strengths, and personal growth inventory
          </p>
        </div>
      </section>

      <section className="bg-white rounded-lg p-6 shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Resources</h2>
        <div className="text-center py-8 text-gray-500">
          <p className="text-sm">
            Your learning resources and references will appear here
          </p>
        </div>
      </section>

      <section className="bg-white rounded-lg p-6 shadow">
        <h2 className="text-xl font-semibold mb-4">Achievements</h2>
        <div className="text-center py-8 text-gray-500">
          <p className="text-sm">
            Track your milestones and accomplishments
          </p>
        </div>
      </section>
    </div>
  )
}
