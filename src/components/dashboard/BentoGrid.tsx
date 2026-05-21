import CategoryChart from './CategoryChart'
import InsightBanner from './InsightBanner'
import RecentExpenses from './RecentExpenses'
import AIAssistant from '@/components/ai/AIAssistant'
import type { Gasto } from '@/lib/supabase/queries'

type Props = { gastos: Gasto[] }

export default function BentoGrid({ gastos }: Props) {
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
      <div style={{ gridRow: 'span 2', minHeight: 0 }}>
        <CategoryChart gastos={gastos} />
      </div>
      <div style={{ gridColumn: 'span 2' }}>
        <InsightBanner />
      </div>
      <div style={{ minHeight: 0 }}>
        <RecentExpenses gastos={gastos} />
      </div>
      <div style={{ minHeight: 0 }}>
        <AIAssistant />
      </div>
    </div>
  )
}
