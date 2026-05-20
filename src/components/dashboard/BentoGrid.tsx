import CategoryChart from './CategoryChart'
import InsightBanner from './InsightBanner'
import RecentExpenses from './RecentExpenses'
import AIAssistant from '@/components/ai/AIAssistant'

export default function BentoGrid() {
  return (
    <div
      className="flex-1"
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1.4fr 1fr',
        gridTemplateRows: 'auto 1fr',
        gap: 12,
        minHeight: 0,
      }}
    >
      {/* Col 1 — spans 2 rows */}
      <div style={{ gridRow: 'span 2', minHeight: 0 }}>
        <CategoryChart />
      </div>

      {/* Col 2-3 Row 1 — InsightBanner spans 2 cols */}
      <div style={{ gridColumn: 'span 2' }}>
        <InsightBanner />
      </div>

      {/* Col 2 Row 2 */}
      <div style={{ minHeight: 0 }}>
        <RecentExpenses />
      </div>

      {/* Col 3 Row 2 */}
      <div style={{ minHeight: 0 }}>
        <AIAssistant />
      </div>
    </div>
  )
}
