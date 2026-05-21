import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'
import type { Gasto } from '@/lib/supabase/queries'

type Props = { gastos: Gasto[] }

export default function RecentExpenses({ gastos }: Props) {
  const recent = gastos.slice(0, 5)

  return (
    <div className="rounded-xl flex flex-col h-full" style={{ backgroundColor: '#16161E', border: '1px solid #2A2A38', padding: '16px' }}>
      <p className="text-[13px] font-semibold mb-3" style={{ color: '#F0F0F5' }}>Gastos recentes</p>
      {recent.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-xs" style={{ color: '#6B6B80' }}>Nenhum gasto ainda</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2 flex-1 overflow-hidden">
          {recent.map(g => (
            <div key={g.id} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-base"
                style={{ backgroundColor: '#1E1E28' }}>
                {g.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate" style={{ color: '#D0D0D8' }}>{g.name}</p>
                <p className="text-[10px]" style={{ color: '#6B6B80' }}>
                  {new Date(g.date + 'T12:00:00').toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}
                </p>
              </div>
              <span className="text-xs font-semibold tabular-nums" style={{ color: '#E05C5C' }}>
                -{formatCurrency(g.amount)}
              </span>
            </div>
          ))}
        </div>
      )}
      <div className="mt-3 pt-3 border-t" style={{ borderColor: '#2A2A38' }}>
        <Link href="/gastos" className="text-xs font-medium hover:opacity-70" style={{ color: '#C9A86A' }}>
          Ver todos →
        </Link>
      </div>
    </div>
  )
}
