import { insights } from '@/lib/mock-data'
import InsightCard from '@/components/insights/InsightCard'

export default function InsightBanner() {
  return (
    <div
      className="rounded-xl p-5"
      style={{ backgroundColor: '#1B1B1F' }}
    >
      {/* Header */}
      <p className="text-xs font-semibold mb-4" style={{ color: '#C9A86A' }}>
        ✦ Insights do Drakma
      </p>

      {/* 3-column grid */}
      <div className="grid grid-cols-3 gap-3">
        {insights.map((insight) => (
          <InsightCard key={insight.id} insight={insight} />
        ))}
      </div>
    </div>
  )
}
