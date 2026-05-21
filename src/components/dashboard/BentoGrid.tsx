import CategoryChart from './CategoryChart'
import RecentExpenses from './RecentExpenses'
import type { Gasto } from '@/lib/supabase/queries'

type Props = { gastos: Gasto[] }

export default function BentoGrid({ gastos }: Props) {
  return (
    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3" style={{ minHeight: 0 }}>
      <CategoryChart gastos={gastos} />
      <RecentExpenses gastos={gastos} />
    </div>
  )
}
