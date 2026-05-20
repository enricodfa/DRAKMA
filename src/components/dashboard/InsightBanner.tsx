import { insights } from '@/lib/mock-data'
import InsightCard from '@/components/insights/InsightCard'

export default function InsightBanner() {
  return (
    <div className="rounded-xl p-5" style={{ backgroundColor: '#16161E', border: '1px solid #2A2A38' }}>
      <p className="text-xs font-semibold mb-4" style={{ color: '#C9A86A' }}>
        ✦ Insights do Drakma
      </p>
      <div className="grid grid-cols-3 gap-3">
        {insights.map((insight) => (
          <InsightCard key={insight.id} insight={insight} />
        ))}
      </div>
    </div>
  )
}
