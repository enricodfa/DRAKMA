import Link from 'next/link'
import { recentExpenses } from '@/lib/mock-data'
import { formatCurrency, formatDate } from '@/lib/utils'

export default function RecentExpenses() {
  return (
    <div
      className="rounded-xl flex flex-col"
      style={{
        backgroundColor: '#FFFFFF',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        padding: '20px',
      }}
    >
      {/* Title */}
      <p className="text-[13px] font-semibold mb-4" style={{ color: '#1B1B1F' }}>
        Gastos recentes
      </p>

      {/* List */}
      <div className="flex flex-col flex-1">
        {recentExpenses.map((expense, i) => (
          <div key={expense.id}>
            <div className="flex items-center gap-3 py-2.5">
              {/* Icon */}
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0"
                style={{ backgroundColor: '#F5F5F3' }}
              >
                {expense.icon}
              </div>

              {/* Name + date */}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate" style={{ color: '#1B1B1F' }}>
                  {expense.name}
                </p>
                <p className="text-[11px]" style={{ color: '#9090A0' }}>
                  {formatDate(expense.date)}
                </p>
              </div>

              {/* Amount */}
              <span
                className="text-xs font-semibold tabular-nums flex-shrink-0"
                style={{ color: '#E05C5C' }}
              >
                -{formatCurrency(expense.amount)}
              </span>
            </div>

            {/* Divider (not after last item) */}
            {i < recentExpenses.length - 1 && (
              <div style={{ height: 1, backgroundColor: '#F5F5F3' }} />
            )}
          </div>
        ))}
      </div>

      {/* Footer link */}
      <div className="mt-4 pt-3 border-t" style={{ borderColor: '#F5F5F3' }}>
        <Link
          href="/gastos"
          className="text-xs font-medium transition-opacity hover:opacity-70"
          style={{ color: '#C9A86A' }}
        >
          Ver todos os gastos →
        </Link>
      </div>
    </div>
  )
}
