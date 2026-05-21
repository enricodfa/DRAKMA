import CategoryChart from './CategoryChart'
import RecentExpenses from './RecentExpenses'
import type { Gasto } from '@/lib/supabase/queries'

type Props = { gastos: Gasto[] }

export default function BentoGrid({ gastos }: Props) {
  return (
    <div
      className="flex-1"
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 12,
        minHeight: 0,
      }}
    >
      <CategoryChart gastos={gastos} />
      <RecentExpenses gastos={gastos} />
    </div>
  )
}
