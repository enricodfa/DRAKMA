import Link from 'next/link'
import { recentExpenses } from '@/lib/mock-data'
import { formatCurrency, formatDate } from '@/lib/utils'

export default function RecentExpenses() {
  return (
    <div
      className="rounded-xl flex flex-col"
      style={{ backgroundColor: '#16161E', border: '1px solid #2A2A38', padding: '20px' }}
    >
      <p className="text-[13px] font-semibold mb-4" style={{ color: '#F0F0F5' }}>
        Gastos recentes
      </p>

      <div className="flex flex-col flex-1">
        {recentExpenses.map((expense, i) => (
          <div key={expense.id}>
            <div className="flex items-center gap-3 py-2.5">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0"
                style={{ backgroundColor: '#0F0F15' }}
              >
                {expense.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate" style={{ color: '#F0F0F5' }}>
                  {expense.name}
                </p>
                <p className="text-[11px]" style={{ color: '#6B6B80' }}>
                  {formatDate(expense.date)}
                </p>
              </div>
              <span className="text-xs font-semibold tabular-nums flex-shrink-0" style={{ color: '#E05C5C' }}>
                -{formatCurrency(expense.amount)}
              </span>
            </div>
            {i < recentExpenses.length - 1 && (
              <div style={{ height: 1, backgroundColor: '#1E1E28' }} />
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t" style={{ borderColor: '#2A2A38' }}>
        <Link href="/gastos" className="text-xs font-medium hover:opacity-70 transition-opacity"
          style={{ color: '#C9A86A' }}>
          Ver todos os gastos →
        </Link>
      </div>
    </div>
  )
}
